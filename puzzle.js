var puzzle = document.getElementById('puzzle');
var context = puzzle.getContext('2d');
var obrazek = new Image();
obrazek.src = './img/puzzle.jpg';
obrazek.addEventListener('load', drawGrid, false);

var gridSize = document.getElementById('puzzle').width;
var tileNum = 4;
var tileSize = gridSize / tileNum;
var clickLoc = new Object;
clickLoc.x = 0;
clickLoc.y = 0;
var emptyLoc = new Object;
emptyLoc.x = 0;
emptyLoc.y = 0;

var solved = false;
var hint = false;
var gridParts = new Object;
setBoard();

function setBoard() {
    boardParts = new Array(tileNum);
    for (var i = 0; i < tileNum; ++i) {
        boardParts[i] = new Array(tileNum);
        for (var j = 0; j < tileNum; ++j) {
            boardParts[i][j] = new Object;
            boardParts[i][j].x = i;
            boardParts[i][j].y = j;
        }
    }
    setTiles();
    setEmpty();

    if(!isSolvable()) {
        if(emptyLoc.y == 0  && emptyLoc.x <= 1) {
            swap(tileNum - 2, tileNum -1, tileNum - 1, tileNum - 1);
        }else {
            swap(0, 0, 1, 0);
        }
        setEmpty();
    }
    solved = false;
}

function setTiles() {
    var i = tileNum * tileNum - 1;
    while(i > 0) {
        var j = Math.floor(Math.random() * i);
        var xi = i % tileNum;
        var yi = Math.floor(i / tileNum);
        var xj = j % tileNum;
        var yj = Math.floor(j / tileNum);
        swap(xi, yi, xj, yj);
        --i;
    }
}

function swap(ix, iy, jx, jy) {
    var temp = new Object();
    temp= boardParts[ix][iy];
    boardParts[ix][iy] = boardParts[jx][jy];
    boardParts[jx][jy] = temp;
}

function setEmpty() {
    for(var i = 0; i < tileNum; ++i) {
        for(var j = 0; j < tileNum; ++j) {
            if(boardParts[i][j].x == tileNum - 1 && boardParts[i][j].y == tileNum - 1) {
                emptyLoc.x = 0;
                emptyLoc.y = 0;
            }
        }
    }
}

function sumInversions() {
    var inv	= 0;
    for(var i =0; i < tileNum; ++i){		//for all tiles it adds their inversions to a counter
        for(var j = 0; j < tileNum; ++j) {
            inv += countInversions(j, i);
        }
    }
    return inv;
}

function countInversions(a, b) {
    var inv = 0;	//running counter of inversions to return when loop completes
    var num = b * tileNum + a;	//this essentially numbers tiles in order from 0 - tileNum - 1. like a 1d array
    var end = tileNum * tileNum;	//gives end to array, stops loop before it runs out of grid
    var value = boardParts[a][b].y * tileNum + boardParts[a][b].x; 	//gives value to compare against all other values in 1d array.

    for(var i = num + 1; i < end; ++i) {
        var x = i % tileNum;
        var y = Math.floor(i / tileNum);
        var comp = boardParts[x][y].y *tileNum + boardParts[x][y].x;
        if(value > comp && value != (end - 1)) {
            ++inv;
        }
    }
    return inv;
}

function isSolvable() {
    var emptyRow = emptyLoc.y;
    var row = tileNum - emptyRow;

    if(tileNum % 2 == 1){	//if the height and width is odd then even number of inversions needed to be solvable
        return (sumInversions() % 2 == 0);	//will return false if odd size and odd inversions (unsolvable)
    }
    if(tileNum % 2 == 0 && row % 2 == 0){		//if height and width is even and empty on even row then inversions must be odd
        return (sumInversions() % 2 == 1);	//will return false if even size and even inversions (unsolvable)
    }
    if(tileNum % 2 == 0 && row % 2 == 1){	//if height and width is even and empty on odd row then inversions must be even
        return (sumInversions() % 2 == 0);	//will return false if odd row and odd inversions (unsolvable)
    }
}

function drawGrid() {
    context.clearRect(0, 0, gridSize, gridSize);
    for(var i = 0; i < tileNum; ++i) {
        for(var j = 0; j < tileNum; ++j) {
            var x = boardParts[i][j].x;
            var y = boardParts[i][j].y;
            if(i != emptyLoc.x || j != emptyLoc.y || solved == true) {
                context.drawImage(obrazek, x * tileSize, y * tileSize, tileSize, tileSize, i * tileSize, j * tileSize, tileSize, tileSize);
            }
        }
    }
}

function distance(cX, cY, eX, eY) {
    var d = Math.abs(cX - eX) + Math.abs(cY - eY);
    return d;
}

document.getElementById('puzzle').onmouseover = function(e){
    clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize);
    clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize);
};


document.getElementById('puzzle').onclick = function(e) {
    if(!solved) {
        clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize); // pozycja x kwadracika na którego kliknęlismy
        clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize);  // pozycja y kwadracika na którego kliknęlismy
        var d = distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y);
        if(d == 1) {
            slideTiles(emptyLoc, clickLoc);
            drawGrid();
        }

        if(solved) {
            solvedAlert();
        }
    }
};

function slideTiles(emptyLoc, clickLoc) {
    boardParts[emptyLoc.x][emptyLoc.y].x = boardParts[clickLoc.x][clickLoc.y].x;
    boardParts[emptyLoc.x][emptyLoc.y].y = boardParts[clickLoc.x][clickLoc.y].y;
    boardParts[clickLoc.x][clickLoc.y].x = tileNum - 1;
    boardParts[clickLoc.x][clickLoc.y].y = tileNum - 1;
    emptyLoc.x = clickLoc.x;
    emptyLoc.y = clickLoc.y;
    checkSolved();
}

function checkSolved() {
    for(var i = 0; i < tileNum; ++i) {
        for(var j = 0; j < tileNum; ++j) {
            console.log(boardParts[i][j].x + " " + boardParts[i][j].y)
            if(boardParts[i][j].x != i || boardParts[i][j].y != j) {
                solved = false;
                return;
            }
        }
    }
    solved = true;

}

function resetPuzzle() {
    tileSize = gridSize / tileNum;
    solved = false;
    setBoard();
    drawGrid();
}

$(function () {
    puzzle.onmousemove = mousePos;
});

document.getElementById('resetButton').onclick = function(e) {
    resetPuzzle();
};

function test(src) {
    obrazek.src = src;
    document.getElementById("hint").src = src;
}

function updateTextInput(val) {
    document.getElementById('textInput').value=val;
    tileNum = val;
}
function solvedAlert() {
    var retry = confirm('Wygrałeś! Chcesz zagrać ponownie?');
    if(retry) {
        resetPuzzle();
    }
}

function showHint() {
    context.drawImage(obrazek, 0, 0);
}

document.getElementById('puzzle').onmouseover = function(e) {
  //  showHint();
};

document.getElementById('hint').onmouseout = function(e) {
    drawGrid();
};

function getImage(url){
    return new Promise(
        function(resolve, reject){
            obrazek.onload = function(){ resolve(url); };
            obrazek.onerror = function(){ reject(url); };
            obrazek.src = url;
        }
    );
}
function onSuccess(url){
    document.getElementById("hint").src = url;
    console.log("Success:  " + url)
}
function onFailure(url){
    alert("on failure")
    console.log("Error loading " + url);}
/*loadFull wywoływana na onclick na obrazku skmpresowanym */
function loadFull(src){
    var obietnica = getImage(src);
    obietnica.then(onSuccess).catch(onFailure);
    resetPuzzle()
}

function mousePos(e) {
    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
       // console.log(mouseX + mouseY)
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
       // console.log(mouseX + mouseY)
    }

    clickLoc.x = Math.floor((mouseX) / tileSize);
    clickLoc.y = Math.floor((mouseY) / tileSize);
    var d = distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y);
    if(d == 1){
        document.body.style.cursor = 'grab';
    }
    else {
        document.body.style.cursor = 'default';
    }
}
