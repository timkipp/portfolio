window.onload = function() {
    console.log("Window loading...");

    const months = [ "January", "February", "March",
                     "April", "May", "June", 
                     "July", "August", "September",
                     "October", "November", "December"];
    const todaysDate = new Date();
    const todaysYear = todaysDate.getFullYear();;
    const todaysMonth = todaysDate.getMonth();
    const monthName = months[todaysMonth];

    document.querySelector("#year_selected").innerText = todaysYear;
    document.querySelector("#month_selected").innerText = monthName;
    const listOfYears = document.querySelector("#select_year")

    for(let i = 1; i <= 99; i++) {
        let listItem = document.createElement("li");
        let listLink = document.createElement("a");
        listItem.setAttribute("href", "#");
        listLink.innerText = i
        listItem.appendChild(listLink);
        listOfYears.appendChild(listItem);
    }

    document.querySelectorAll("ul.dropdown li").forEach(item => {
        item.addEventListener("click", function(){ elementClicked(this); });
    });

    displayCalendar();
}

function elementClicked(thisElement) {
    var centuryElement;
    var yearElement;
    var listElement;
    var centurySelectedText;
    var centuryPrefix;
    var centuryYear;
    var elementText;
    var yearSelectedText;
    var yearSuffix;
    const parent = thisElement.parentElement;
    const parentId = parent.id

    elementText = new String(thisElement.innerText);
    if(elementText.length == 1) {
        elementText = new String("0" + elementText);
    }    
    switch(parentId) {
        case "select_century":
            centuryPrefix = elementText.substring(0, 2);
            listElement = document.querySelector("#century_selected");
            yearElement = document.querySelector("#year_selected");
            yearSelectedText = new String(yearElement.innerText).toString();
            yearSuffix = new String(yearSelectedText.substring(2));
            centuryYear = new String(centuryPrefix + yearSuffix);
            yearElement.innerText = centuryYear.toString();
            break;
        case "select_year":
            listElement = document.querySelector("#year_selected");
            centuryElement = document.querySelector("#century_selected");
            centurySelectedText = new String(centuryElement.innerText);
            centuryPrefix = new String(centurySelectedText.substring(0, 2));
            centuryYear = new String(centuryPrefix + elementText);
            elementText = centuryYear.toString();
            break;
        case "select_month":
            listElement = document.querySelector("#month_selected");
    }

    listElement.innerText = elementText;
    parent.style.visibility = "hidden";
    window.setTimeout(removeStyleAttribute, 2000, parent);

    displayCalendar();
}

function removeStyleAttribute(thisElement) {
    thisElement.removeAttribute("style");
}

function mouseEntered(thisElement) {
    thisElement.children[1].removeAttribute("style");
}

function mousedOver(thisElement) {
    thisElement.children[1].removeAttribute("style");
}

function displayCalendar() {

    const calendar = document.querySelector("table#custom_calendar tbody");
    const yearSelected = document.querySelector("#year_selected");
    const monthSelected = document.querySelector("#month_selected");
    var this_day;
    var this_month;
    var this_year;
    var days = 0;
    var sat = 0;
    var sun = 1;
    var mon = 2;
    var tue = 3;
    var wed = 4;
    var thu = 5;
    var fri = 6;
    var isLeapYear = false;
    var newWeek = true;

    if(calendar.children.length > 0) {
        for(var r = calendar.children.length - 1; r >= 0; r--) {
            let row = calendar.children[r];
            calendar.removeChild(row);
        }
    }

    this_day = 1;
    this_month = monthSelected.innerText;
    this_year = Number(yearSelected.innerText);
    if(this_year % 100 == 0) {
        if(this_year % 400 == 0) {
            isLeapYear = true;
        }
    } else {
        if(this_year % 4 == 0) {
            isLeapYear = true;
        }
    }

    switch(this_month) {
        case "January":
            this_month = 1;
            days = 31;
            break;
        case "February":
            this_month = 2;
            if(isLeapYear == true) {
                days = 29;
            } 
            else {
                days = 28;
            }
            break;
        case "March":
            this_month = 3;
            days = 31;
            break;
        case "April":
            this_month = 4;
            days = 30;
            break;
        case "May":
            this_month = 5;
            days = 31;
            break;
        case "June":
            this_month = 6;
            days = 30;
            break;
        case "July":
            this_month = 7;
            days = 31;
            break;
        case "August":
            this_month = 8;
            days = 31;
            break;
        case "September":
            this_month = 9;
            days = 30;
            break;
        case "October":
            this_month = 10;
            days = 31;
            break;
        case "November":
            this_month = 11;
            days = 30;
            break;
        case "December":
            this_month = 12;
            days = 31;            
    }

    var startDay = zellersCongruence(this_day, this_month, this_year);

    var cellIndex = 0;
    var weekRow;
    var dateCell;
    var dayOfWeek;
    var dateText = "";
    var beginMonth = false;
    day = 0;
    do {
        cellIndex++;
        dayOfWeek = cellIndex % 7;
        dateCell = document.createElement("td");
        if(dayOfWeek == startDay && beginMonth == false) {
            beginMonth = true;
        }
        if(beginMonth == true) {
            day++;
            dateText = day;
        } else {
            dateText = "";
        }

        dateCell.innerText = dateText;
        if(newWeek == true) {
            weekRow = document.createElement("tr");
            calendar.appendChild(weekRow);
        }
        weekRow.appendChild(dateCell);
        if(dayOfWeek == 0) {
            newWeek = true;
        } else {
            newWeek = false;
        }
    } while(day < days);
}

function zellersCongruence(this_day, this_month, this_year) {
    
        var day = this_day;
        var month = this_month;
        var year = this_year;
    
        if (this_month == 1) {
            month = 13;
            year--;
        }
        if (month == 2) {
            month = 14;
            year--;
        }
        var q = day;
        var m = month;
        var k = year % 100;
        var j = Math.trunc(year / 100);
        var h = Math.trunc(q + Math.floor(13 * (m + 1) / 5) + k + Math.floor(k / 4) + Math.floor(j / 4) + 5 * j);
        h = h % 7;
    
        return h;
    }