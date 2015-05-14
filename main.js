/*jslint node: true */
/*jslint browser: true*/
    "use strict";
//take in row,col,val pairs, permanent is optional
function initializeBoard(existingVals) {
    //define board 
    //(JS can't dynamically create 2d arrays...)
    var board = [];
    for (var i = 1; i <= 9; i++) {
        board[i] = [];
    }
    existingVals.forEach(function (val) {
        if (!isValidLocation(val)) {
            throw "Invalid location" + val.row + "," + val.col;
        }
        val.permanent = true;
        board[val.row][val.col] = val;
    });
    //window.alert("board here: " + board);
    return board;
}

function convertToTable(board) {
    var tableHTML = "<table class='sudoku' id='inputTable'>";
    for (var row = 1; row <= 9; row++) {
        tableHTML += "<tr class = 'sudoku'>";
        for (var col = 1; col <= 9; col++) {

            tableHTML += "<td class = '" + styleMaker(row, col) + "'>" + (board[row][col] ? board[row][col].val : "<input type=\"text\" size =\"1\" maxlength=\"1\"></input>") + "</td>";
        }
        tableHTML += "</tr>";
    }
    return tableHTML;
}

function styleMaker(row, col) {
    var style = "sudoku permanent ";
    if (row == 1) {
        style += "topEdge ";
    } else if (row % 3 === 0) {
        style = "bottomEdge ";
    }

    if (col == 1) {
        style += "leftEdge ";
    } else if (col % 3 === 0) {
        style += "rightEdge ";
    }
    return style;

}

function isValidLocation(loc) {
    return loc.row >= 0 && loc.row <= 9 && loc.col >= 0 && loc.col <= 9;
}

function formSubmitted() {
    var table = document.getElementById("inputTable");
    var rows = table.rows;
    var existingElements = [];
    for (var i = 0; i<rows.length; i++)
    {
        var row = rows[i];
        for (var j = 0; j<row.cells.length; j++)
        {
           var value = +row.cells[j].childNodes[0].value;
           //for some reason javascript converts "" to 0
           if (value>0)
           {
               existingElements.push({
                   row:i + 1,
                   col:j + 1,
                   val:value
               });               
           }
        }
    }
    document.getElementById("hi").innerHTML =    convertToTable(initializeBoard(existingElements));
    return false;
}

//if running on JSFiddle make sure to choose no wrap - in <body>


document.getElementById("initialForm").innerHTML =

convertToTable(initializeBoard([])) + document.getElementById("initialForm").innerHTML;