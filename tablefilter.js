(function () {
    "use strict";
    
    function makeFilterFunction(expr) {
        if (expr == "")
            return null;
        return new Function("s", "return " + expr + ";");
    }
    
    function isMatchingRow(row, filters) {
        let cells = row.children;
        let rowMatches = true;
        for (let c = 0; c < Math.min(filters.length, cells.length); c++) {
            let cell = cells[c];
            let filter = filters[c];
            let cellContent = cell.innerText;
            if (filter)
                rowMatches &= !!filter(cellContent);
        }
        return rowMatches;
    }

    function getFilterValues(filterRow) {
        let filterInputs = filterRow.getElementsByTagName('input');

        let filterValues = [];
        for (let input of filterInputs) {
            filterValues.push(input.value);
        }
        return filterValues;
    }

    function filterTable(table, filterRow) {
        let filterValues = getFilterValues(filterRow);
        let filters = filterValues.map(makeFilterFunction);

        let tbody = table.getElementsByTagName('tbody')[0];
        let rows = tbody.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            if (isMatchingRow(row, filters)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    }

    function getOrCreate(parentElement, tagName) {
        let childElement = parentElement.getElementsByTagName(tagName)[0];
        if (childElement === undefined) {
            childElement = document.createElement(tagName);
            parentElement.insertBefore(childElement, parentElement.firstChild);
        }
        return childElement;
    }

    function decorateTable(table) {
        let rows = table.getElementsByTagName('tr');
        let firstRow = rows[0];
        let firstCells = firstRow.children;

        let filterRow = document.createElement('tr');
        for (let i = 0; i < firstCells.length; i++) {
            let filterCell = document.createElement('td');
            let filterInput = document.createElement('input');
            filterInput.type = "search";
            filterInput.style.width = (firstCells[i].getBoundingClientRect()['width'] - 10) + 'px';
            filterInput.addEventListener("change", function () {
                filterTable(table, filterRow);
            });
            filterCell.appendChild(filterInput);
            filterRow.appendChild(filterCell);
        }

        let thead = getOrCreate(table, 'thead');
        thead.appendChild(filterRow);
    }

    let tables = document.getElementsByTagName("table");
    for (var table of tables) {
        decorateTable(table);
    }
})();
