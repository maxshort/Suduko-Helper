/*jslint node: true */
/*jslint browser: true*/
    "use strict";

//ROWS ALWAYS NEED TO EXIST IN BOARD ARRAY -- EVEN IF THEY ARE JUST []

//take in row,col,val triplets, permanent is optional -- it will be added
function initializeBoard(existingVals) {
    //define board 
    var board = [];
    for (var i = 1; i <= 9; i++) {
        for (var j = 1; j <= 9; j++) {
            board[i] = {
                row: i,
                col: j,
                val: null,
                permanent: false
            };
        }

    }
    existingVals.forEach(function (val) {
        if (!isValidLocation(val)) {
            throw "Invalid location" + val.row + "," + val.col;
        }
        val.permanent = true;
        board[val.row][val.col] = val;
    });
    return board;
}

//updates the table on the page with board
//assumes that everything in the board is permanent
function convertToTable(board) {

    var table = document.getElementById("inputTable");
    for (var rowNum = 1; rowNum <= table.rows.length; rowNum++) {
        var row = table.rows[rowNum - 1];
        for (var colNum = 1; colNum <= row.cells.length; colNum++) {
            var col = row.cells[colNum - 1].getElementsByTagName("input")[0];
            if (board[rowNum][colNum] !== undefined) {
                col.value = board[rowNum][colNum].val;
                col.readOnly = true;
                col.classList.add("permanent");
            } else {
                col.value = "";
                col.readOnly = false;
                col.classList.remove("permanent");
            }
        }
    }
}

//checks whether the proposed location exists on a board
function isValidLocation(loc) {
    return loc.row >= 0 && loc.row <= 9 && loc.col >= 0 && loc.col <= 9;
}

//loads a board based on user input
function loadInputPuzzle(event) {
    event.preventDefault(); //don't submit the form
    var table = document.getElementById("inputTable");
    var rows = table.rows;
    var existingElements = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        for (var j = 0; j < row.cells.length; j++) {
            var value = +row.cells[j].getElementsByTagName("input")[0].value;
            //for some reason javascript converts "" to 0
            if (value > 0) {
                existingElements.push({
                    row: i + 1,
                    col: j + 1,
                    val: value
                });
            }
        }
    }
    convertToTable(initializeBoard(existingElements));
    alterBoardState(boardState.LOADED);
    return false; //extra prevention against form submission
}

//if running on JSFiddle make sure to choose no wrap - in <body>

function resetBoard(event) {
    alterBoardState(boardState.INITIAL);
}

//boardState initial - when the form submits the user's puzzle is loaded
//boardState loaded - when the form submits the user's puzzle is solved.
function alterBoardState(state) {

    if (state === boardState.INITIAL) {
        document.getElementById("sForm").removeEventListener("submit", solvePuzzle);
        document.getElementById("sForm").addEventListener("submit", loadInputPuzzle);
        document.getElementById("sFormSubmit").value = "Load Puzzle";
        var inputBoxes = document.getElementById("inputTable").getElementsByTagName("input");
        for (var i = 0; i < inputBoxes.length; i++) {
            inputBoxes[i].readOnly = false;
            inputBoxes[i].classList.remove("permanent");
        }

    } else if (state === boardState.LOADED) {
        document.getElementById("sForm").removeEventListener("submit", loadInputPuzzle);
        document.getElementById("sForm").addEventListener("submit", solvePuzzle);
        document.getElementById("sFormSubmit").value = "Solve Puzzle";
    } else {
        window.alert("state was: " + state);
    }
}

function solvePuzzle(event) {
    event.preventDefault();
    window.alert("not supported!");
    return false;
}

function rowContains(board, rowNum) {
    var row = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    board[rowNum].forEach(function (element, index, array) {
        row[element.val] = 1;
    });
    return row;
}

//simulating enum
//http://stackoverflow.com/questions/287903/enums-in-javascript
var boardState = {
    INITIAL: "initial state",
    LOADED: "puzzle loaded"
};

//initialize board state
alterBoardState(boardState.INITIAL);