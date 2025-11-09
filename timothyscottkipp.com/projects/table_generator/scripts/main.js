window.onload = function() {
    console.log("Window loading...");
    
    if (document.querySelector("section:last-of-type").style.display = "none") {
        var tableBody = document.querySelector("table#preview_table tbody");
    } else {
        var tableBody = document.querySelector("main section:last-of-type table");
    }

    const tableRows = tableBody.children;
    const numberOfRows = tableBody.childElementCount
    
    document.querySelector("#number_of_rows").value = 1;
    document.querySelector("#number_of_columns").value = 1;

    if(numberOfRows > 1) {
        for(let r = numberOfRows - 1; r > 0; rr--) {
            var tableRow = tableRows[r];
            tableBody.removeChild(tableRow);    
        }
    } else {
        var tableRow = tableRows[0];
    }

    const numberOfColumns = tableRow.childElementCount;
    if(numberOfColumns > 0) {
        for(let c = numberOfColumns - 1; c > 0; c--) {
            let tableCell = tableRow.children[c];
            tableRow.removeChild(tableCell);
        }
    }        

    resizeTable();
}

function resizeTable() {
    
    var tableSection;
    var table;
    var tableBody;
    
    if(document.querySelector("main section:last-of-type").style.display == "none") {
        tableSection = document.querySelector("section#preview")
        table = document.querySelector("table#preview_table");
        tableBody = document.querySelector("table#preview_table tbody")
    } else {
        tableSection = document.querySelection("#table")
        table = tableSection.firstElementChild;

        if(table.firstElementChild.tagName = "caption") {
            tableBody = table.children[1];
        } else {
            tableBody = table.firstElementChild;
        }
    }    

    let sectionWidth = tableSection.clientWidth
    let tableDimension = (sectionWidth * .9) + "px";

    table.style.width = tableDimension; 
    table.style.height = tableDimension;
    tableBody.style.width = tableDimension;
    tableBody.style.height = tableDimension;
}

function updateRowsOrColumns(spinButton, inputControl) {

    let buttonClass = spinButton.className;
    let inputValue = 0;
    let buttonId = "";
    let rowsOrColumns = "";

    inputValue = Number(inputControl.value);
    buttonId = spinButton.id;

    if(buttonId == "spindown_rows" || buttonId == "spinup_rows") {
        rowsOrColumns = "rows"
    } else {
        rowsOrColumns = "columns"
    }

    if(buttonClass == "spin_down" && inputValue > 1) {
        var changeValue = -1;                    
    } else if (buttonClass == "spin_up") {
        var changeValue = 1;
    } else {
        var changeValue = 0;
    }
    
    let newInputValue = inputValue + changeValue;
    
    // inputControl.setAttribute('value', newInputValue);
    inputControl.value = newInputValue;

    if(changeValue != 0) {
        updatePreviewTable();
    }        

    // Check to see if this works. Would not work in Assignment 4 
    function spinDownToggleDisabled() {
        if(newInputValue == 0) {
            console.log("Before Setting 'disabled': ", spinButton.getAttribute("disabled"))
            spinButton.setAttribute("disabled", true);
            console.log("After Setting 'disabled: ", spinButton.getAttribute("disabled"))
        } else {
            console.log("Before Removing 'disabled': ", spinButton.getAttribute("disabled"))
            spinButton.removeAttribute("disabled");
            console.log("After Removing 'disabled: ", spinButton.getAttribute("disabled"))
        }
    }
}

function updatePreviewTable() {
    
    let previewTable = document.getElementById('preview_table');
  	let newTableBody = document.createElement('tbody');
    let tableCell;
   	let heightPercent = "";
    let widthPercent = "";
    let cellWidth = 0.0;
    let cellHeight = 0.0;
    let tableWidth = 0.0;
    let columnCount = Number(document.querySelector("#number_of_columns").value);
    let rowCount = Number(document.querySelector("#number_of_rows").value);
    
    tableWidth = Number(previewTable.clientWidth);
    tableWidthText = tableWidth + "px";
    
    cellWidth = 100 / columnCount;
    cellHeight = 100 / rowCount;
    heightPercent = cellHeight + "%";
    widthPercent = cellWidth + "%";
    
    for(let r = 0; r < rowCount; r++) {
        let tableRow = document.createElement("tr");
        tableRow.style.height = heightPercent
        for(let c = 0; c < columnCount; c++) {
            tableCell = document.createElement("td");
            tableCell.style.width = widthPercent;
            tableCell.style.height = heightPercent;
            tableRow.appendChild(tableCell);
        }
        newTableBody.appendChild(tableRow);
    }
  	
	previewTable.replaceChild(newTableBody, previewTable.firstElementChild);
    
}

function createUserTable() {
    const userTable = document.createElement("table");
    const tableCaption = document.createElement("caption");
    const tableBody = document.createElement("tbody");
    
    const captionText = document.querySelector("#table_caption").value;

    const numberOfRows = Number(document.querySelector("#number_of_rows").value);
    const numberOfColumns = Number(document.querySelector("#number_of_columns").value);

    let cellWidth = 100 / numberOfColumns;
    let cellHeight = 100 / numberOfRows;
    let heightPercent = cellHeight + "%";
    let widthPercent = cellWidth + "%";

    if (captionText != "") {
        tableCaption.innerText = captionText;
        userTable.appendChild(tableCaption);
    }    

    for(let row = 0; row < numberOfRows; row++) {
        const tableRow = document.createElement("tr");
        for(let column = 0; column < numberOfColumns; column++) {
            var tableCell = document.createElement("td");
            tableRow.appendChild(tableCell);
            tableCell.style.width = widthPercent;
            tableCell.style.height = heightPercent;
        }
        tableBody.appendChild(tableRow);
    }
    
    userTable.appendChild(tableBody);

    document.querySelectorAll("section").forEach(item => item.style.display = "none");

    const tableSection = document.querySelector("main section:last-of-type")
    tableSection.style.display = "block";
    tableSection.appendChild(userTable);
}