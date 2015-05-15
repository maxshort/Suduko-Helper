def makeStyle(row, col):
    style = "sudoku permanent "
    if row == 1:
        style += "topEdge "
    elif row%3==0:
        style += "bottomEdge "

    if col ==1:
        style += "leftEdge "
    elif col%3 ==0:
        style += "rightEdge "

    return style

def makeTable():
    tableHtml = "<table class = 'sudoku' id = 'inputTable'>\n"
    for row in range(1,10):
        tableHtml += "\t<tr class = 'sudoku'>\n"
        for col in range(1,10):
            tableHtml += "\t\t<td class = '"+makeStyle(row,col)+"'>" +"<input type=\"text\" size =\"1\" maxlength=\"1\"></input></td>\n"
        tableHtml+="</tr>\n"
    tableHtml += "</table>"
    return tableHtml

print(makeTable())
