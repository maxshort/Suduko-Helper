/*jslint node: true */
/*jslint browser: true*/
    "use strict";



//ROWS ALWAYS NEED TO EXIST IN BOARD ARRAY -- EVEN IF THEY ARE JUST []

//take in row,col,val triplets, permanent is optional -- it will be added
function initializeBoard(existingVals) {
    //define board 
    var board = [];
    for (var i = 1; i <= 9; i++) {
        board[i] = [];
        for (var j = 1; j <= 9; j++) {
            board[i][j] = {
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
            if (board[rowNum][colNum].permanent) {
                col.readOnly = true; //TODO: just add readOnly to permanent
                col.classList.add("permanent");
            } else {
                col.readOnly = false;
                col.classList.remove("permanent");
            }
            if (board[rowNum][colNum].val !== null) {
                col.value = board[rowNum][colNum].val;
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
    currentBoard = initializeBoard(existingElements); //currentBoard is a global
    convertToTable(currentBoard);
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
    var nonSolved = [];
    for (var i = 1; i <= 9; i++) {
        for (var j = 1; j <= 9; j++) {
            if (currentBoard[i][j].val === null) {
                nonSolved.push(currentBoard[i][j]);
            }
        }
    }
    
    var marker = "marker"; //catches infinite loop
    nonSolved.push(marker);
    var lengthAtLastMark = nonSolved.length;

    //>1 b/c of "marker" -- see above
    while (nonSolved.length > 1) {
        var current = nonSolved.shift();
        
        //-1 compensates for fact that marker is out
        if (current ===marker && nonSolved.length == lengthAtLastMark-1)                                        {
           break; //we hit a dead end??? 
        }
        else if (current===marker){
            nonSolved.push(marker);
            lengthAtLastMark = nonSolved.length;
            continue;
        }
        var possible = possibleVals(currentBoard, current.row, current.col);

        

        if (possible.length === 0) {
            window.alert("Possible values 0 for row " + current.row + ",col:" + current.col);
        } else if (possible.length == 1) {
            current.val = possible[0];            
            currentBoard[current.row][current.col] = current;
            convertToTable(currentBoard);
        } else { //if not solved, put back into queue...
            nonSolved.push(current);
        }

    }
    window.alert("at end, unsolved is: "+nonSolved.length);
    return false;
}

function possibleVals(board, rowNum, colNum) {
    var rowHas = rowContains(board, rowNum);
    var colHas = colContains(board, colNum);
    var boxHas = boxContains(board, rowNum, colNum);  
    var possible = [];
    for (var i = 1; i <= 9; i++) {
        if (rowHas[i] + colHas[i] + boxHas[i] === 0) {
            possible.push(i);
        }
    }
    if (possible.length == 0){
        window.alert(rowNum+","+colNum+":"+rowHas.join()+";"+colHas.join()+";"+boxHas.join());   
        window.alert(rowHas.length+","+colHas.length+","+boxHas.length);
    }
    return possible;
}

function rowContains(board, rowNum) {
    var row = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    board[rowNum].forEach(function (element, index, array) {
        row[element.val] = 1;
    });
    
    return row;
}

function colContains(board, colNum) {
    var col = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 1; i <= 9; i++) {
        if (board[i][colNum].val !== null) {
            col[board[i][colNum].val] = 1;
        }
    }
    return col;
}

function boxContains(board, rowNum, colNum) {
    var box = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var initRow = (Math.floor((rowNum - 1) / 3) * 3 + 1);
    var initCol = (Math.floor((colNum - 1) / 3) * 3 + 1);
    for (var i = initRow; i <= initRow + 2; i++) {
        for (var j = initCol; j <= initCol + 2; j++) {
            if (board[i][j].val !== null) {
                box[board[i][j].val] = 1;
            }
        }
    }
    return box;
}

//simulating enum
//http://stackoverflow.com/questions/287903/enums-in-javascript
var boardState = {
    INITIAL: "initial state",
    LOADED: "puzzle loaded"
};

//initialize board state
var currentBoard = null; //only used when submitting board, somewhat temporary, eventually should convert a lot of this to proper OO.
alterBoardState(boardState.INITIAL);