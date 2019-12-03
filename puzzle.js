var puzzle = document.getElementById('puzzle');
var context = puzzle.getContext('2d');
var obrazek = new Image();
obrazek.src = './img/puzzle.jpg';
obrazek.addEventListener('load', rysowanieSiatki, false);
var rozmiarCanvas = document.getElementById('puzzle').width; // szerokość = 640px
var rozmiar_planszy = 4; // plansza 4x4
var rozmiarKlocka = rozmiarCanvas / rozmiar_planszy; //rozmiar jednego puzzla w pixelach
var czerwonyKlocek = new Object;
czerwonyKlocek.x = 0;
czerwonyKlocek.y = 0;
var wybranyKlocek = new Object;
wybranyKlocek.x = 0; //ustawienie wspołrzędnych
wybranyKlocek.y = 0;
var ułożony = false;
var hint = false;
var częściSiatki = new Object;
ustawienieTablicy();

function ustawienieTablicy() { //tworzenie tablicy dwuwymiarowej
    elementyTablicy = new Array(rozmiar_planszy);
    for (var i = 0; i < rozmiar_planszy; ++i) {
        elementyTablicy[i] = new Array(rozmiar_planszy);
        for (var j = 0; j < rozmiar_planszy; ++j) {
            elementyTablicy[i][j] = new Object;
            elementyTablicy[i][j].x = i;
            elementyTablicy[i][j].y = j;
        }
    }
    ustawienieKlocków();
    czyszczeniePlanszy();

    if(!sprRozwiązywalność()) {
        if(czerwonyKlocek.y == 0  && czerwonyKlocek.x <= 1) {
            zamiana(rozmiar_planszy - 2, rozmiar_planszy -1, rozmiar_planszy - 1, rozmiar_planszy - 1);
        }else {
            zamiana(0, 0, 1, 0);
        }
        czyszczeniePlanszy();
    }
    ułożony = false;
}

function ustawienieKlocków() { // shuffle puzzle
    var i = rozmiar_planszy * rozmiar_planszy - 1;
    while(i > 0) {
        var j = Math.floor(Math.random() * i);
        var xi = i % rozmiar_planszy;
        var yi = Math.floor(i / rozmiar_planszy);
        var xj = j % rozmiar_planszy;
        var yj = Math.floor(j / rozmiar_planszy);
        zamiana(xi, yi, xj, yj);
        --i;
    }
}

function zamiana(ix, iy, jx, jy) { // zamiana pozycji puzla z  puzlmem y
    var temp = new Object();
    temp= elementyTablicy[ix][iy];
    elementyTablicy[ix][iy] = elementyTablicy[jx][jy];
    elementyTablicy[jx][jy] = temp;
}

function czyszczeniePlanszy() { // czyścimy plansz  (na chwile )
    for(var i = 0; i < rozmiar_planszy; ++i) {
        for(var j = 0; j < rozmiar_planszy; ++j) {
            if(elementyTablicy[i][j].x == rozmiar_planszy - 1 && elementyTablicy[i][j].y == rozmiar_planszy - 1) {
                czerwonyKlocek.x = 0;
                czerwonyKlocek.y = 0;
            }
        }
    }
}

function sumaInwersji() {
    var inwersje	= 0;
    for(var i =0; i < rozmiar_planszy; ++i){
        for(var j = 0; j < rozmiar_planszy; ++j) {
            // dla każdego klocka dodaje jego inwersje do licznika
            inwersje += policzInwersje(j, i);
        }
    }
    return inwersje;
}

function policzInwersje(a, b) {
    var inwersje = 0;	//licznik inwersji
    var num = b * rozmiar_planszy + a;
    var koniec = rozmiar_planszy * rozmiar_planszy;	// koniec tablicy, zanim pętla wyjdzie poza planszę
    var value = elementyTablicy[a][b].y * rozmiar_planszy + elementyTablicy[a][b].x; // podaje wartość do porównania
    for(var i = num + 1; i < koniec; ++i) {
        var x = i % rozmiar_planszy;
        var y = Math.floor(i / rozmiar_planszy);
        var comp = elementyTablicy[x][y].y *rozmiar_planszy + elementyTablicy[x][y].x;
        if(value > comp && value != (koniec - 1)) {
            ++inwersje;
        }
    }
    return inwersje;
}

function sprRozwiązywalność() {
    var emptyRow = czerwonyKlocek.y;
    var row = rozmiar_planszy - emptyRow;
    //jeśli wysokość i szerokość są nieparzyste, wówczas parzysta liczba inwersji potrzebna do rozwiązania
    if(rozmiar_planszy % 2 == 1){
        return (sumaInwersji() % 2 == 0);	//zwróci false, jeśli nieparzysty rozmiar i nieparzyste inwersje (nierozwiązywalne)
    }
    //jeśli wysokość i szerokość są równe i puste w parzystym rzędzie, wówczas odwrócenie musi być nieparzyste
    if(rozmiar_planszy % 2 == 0 && row % 2 == 0){
        return (sumaInwersji() % 2 == 1);	//zwróci false, jeśli parzysty rozmiar i parzyste odwrócenie (nierozwiązywalne)
    }
    //jeśli wysokość i szerokość są parzyste i pusty w nieparzystym rzędzie, wówczas odwrócenie musi być parzyste
    if(rozmiar_planszy % 2 == 0 && row % 2 == 1){
        return (sumaInwersji() % 2 == 0);	//zwróci false, jeśli nieparzyste wiersze i nieparzyste inwersje (nierozwiązywalne)
    }
}

function rysowanieSiatki() {
    context.clearRect(0, 0, rozmiarCanvas, rozmiarCanvas);
    for(var i = 0; i < rozmiar_planszy; ++i) {
        for(var j = 0; j < rozmiar_planszy; ++j) {
            var x = elementyTablicy[i][j].x;
            var y = elementyTablicy[i][j].y;
            if(i != czerwonyKlocek.x || j != czerwonyKlocek.y || ułożony == true) {
                context.drawImage(obrazek, x * rozmiarKlocka, y * rozmiarKlocka, rozmiarKlocka, rozmiarKlocka, i * rozmiarKlocka, j * rozmiarKlocka, rozmiarKlocka, rozmiarKlocka);
            }
        }
    }
}

function odległość(cX, cY, eX, eY) {
    var d = Math.abs(cX - eX) + Math.abs(cY - eY);
    return d;
}
//onmouseover - gdy wskaźnk myszki zostanie przesunięty na canvas
document.getElementById('puzzle').onmouseover = function(e){
    //pageX, pageY - odczytują wspolrzedne x i y (w pixelach) miejsca kliknięcia myszką
    // offsetX, offsetY zwracaja wspolrzędne wskaznika myszki, względnie do elementu docelowego - czyli tutaj wybranego klocka
    wybranyKlocek.x = Math.floor((e.pageX - this.offsetLeft) / rozmiarKlocka);
    wybranyKlocek.y = Math.floor((e.pageY - this.offsetTop) / rozmiarKlocka);
};


document.getElementById('puzzle').onclick = function(e) {
    if(!ułożony) {
        wybranyKlocek.x = Math.floor((e.pageX - this.offsetLeft) / rozmiarKlocka); // pozycja x klocka na którego kliknęlismy
        wybranyKlocek.y = Math.floor((e.pageY - this.offsetTop) / rozmiarKlocka);  // pozycja y klocka na którego kliknęlismy
        var odl = odległość(wybranyKlocek.x, wybranyKlocek.y, czerwonyKlocek.x, czerwonyKlocek.y);
        if(odl == 1) { //jeśli odległoć od czerwonego klocka jest = 1, czyli wybrany klocek przylega do niego
            zamianaKlocków(czerwonyKlocek, wybranyKlocek);
            rysowanieSiatki();
        }

        if(ułożony) {
            okienkoWygranej();
        }
    }
};

function zamianaKlocków(czerwony, wybrany) {
    elementyTablicy[czerwony.x][czerwony.y].x = elementyTablicy[wybrany.x][wybrany.y].x;
    elementyTablicy[czerwony.x][czerwony.y].y = elementyTablicy[wybrany.x][wybrany.y].y;
    elementyTablicy[wybrany.x][wybrany.y].x = rozmiar_planszy - 1;
    elementyTablicy[wybrany.x][wybrany.y].y = rozmiar_planszy - 1;
    czerwony.x = wybrany.x;
    czerwony.y = wybrany.y;
    sprWygranej();
}

function sprWygranej() {
    for(var i = 0; i < rozmiar_planszy; ++i) {
        for(var j = 0; j < rozmiar_planszy; ++j) {
            //jeśli którakolwiek ze współrzędnych nie będzie sie zgadzać to obrazek nie został ułożony
            if(elementyTablicy[i][j].x != i || elementyTablicy[i][j].y != j) {
                ułożony = false;
                return;
            }
        }
    }
    ułożony = true;
}

function resetPuzzle() {
    czyszczeniePlanszy()
    rozmiarKlocka = rozmiarCanvas / rozmiar_planszy;
    ułożony = false;
    ustawienieTablicy();
    rysowanieSiatki();
}

$(function () {
    puzzle.onmousemove = mousePos;
});

document.getElementById('resetButton').onclick = function(e) {
    resetPuzzle();
};

function test(src) {
    obrazek.src = src;
    document.getElementById("hint").src = src; //obrazek źródłowy, wskazówka
}

function podajParametry(wartosc) {
    document.getElementById('textInput').value=wartosc;
    rozmiar_planszy = wartosc;
}
function okienkoWygranej() {
    var retry = confirm('Wygrałeś! Chcesz zagrać ponownie?');
    if(retry) {
        resetPuzzle();
    }
}

document.getElementById('hint').onmouseout = function(e) {
    rysowanieSiatki();
};

function pobierzObrazek(źródło){
    //asynchroniczny kod realizujący działanie obietnicy, wywołane resolve() jezeli sukces
    //albo wywołane reject(), jeżeli porażka
    // konstruktor Promise akceptuje pojedynczy argument - funkcje executor, która zawiera kod przeznaczony do
    // zainicjalizowania obietnicy, funkcja executor otrzymuje podane jako argumenty dwie funkcje: resolve() oraz reject(),
    // resolve() jest wywoływana, gdy executor zakonczy działanie sukcesem (obietnica jest gotowa do spełnienia),
    // funkcja reject() jest wywoływana, gdy działanie executora zakonczyło sie niepowodzeniem
    return new Promise(
        function(resolve, reject){
            obrazek.onload = function(){ resolve(źródło); };
            obrazek.onerror = function(){ reject(źródło); };
            obrazek.src = źródło;
        }
    );
}

//loadFull wywoływana na onclick na obrazku skompresowanym
function loadFull(src){
    var obietnica = pobierzObrazek(src);
// then() to podstawowa metoda pozwalajaca na podjecie działan po zmianie stanu obietnicy. Pobiera 2 argumenty:
// Pierwszy to funkcja przeznaczona do wywołania,gdy obietnica bedzie spełniona. 2. arg. to funkcja wywoływana w przypadku
// odrzucenia obietnicy
    obietnica.then(onSuccess).catch(onFailure);
    resetPuzzle()
}
function onSuccess(url){
    document.getElementById("hint").src = url;
}

function onFailure(url){
    alert("on failure")
}
function mousePos(e) {
    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }

    wybranyKlocek.x = Math.floor((mouseX) / rozmiarKlocka);
    wybranyKlocek.y = Math.floor((mouseY) / rozmiarKlocka);
    var odl = odległość(wybranyKlocek.x, wybranyKlocek.y, czerwonyKlocek.x, czerwonyKlocek.y);
    if(odl == 1){
        document.body.style.cursor = 'grab'; // kursor łapka, czyli na klockach, na które możemy kliknąć
    }
    else {
        document.body.style.cursor = 'default'; //kursor domyślna strzałka,czyli ze nie mozna kliknac
    }
}
