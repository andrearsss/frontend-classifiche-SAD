
const rowsPerPage = 10;
const pageOffset = 5;
const tableBody = document.getElementById('table-body');
const pagination = document.getElementById('pagination');
let totalPages = 60; // #######################################
let cache = {}

const statisticOptions = {
    sfida: [
        { id: 'partite_giocate', label: 'Partite giocate' },
        { id: 'partite_vinte', label: 'Partite vinte' },
        { id: 'classi_testate', label: 'Classi testate' }
    ],
    scalata: [
        { id: 'statistica1', label: 'Esempio1' },
        { id: 'statistica2', label: 'Esempio2' },

    ]
};




// GET simulation
async function fetchRows(gamemode, statistic, startPage, endPage) {
    return new Promise((resolve) => {
        setTimeout(async () => {
            try {
                const response = await fetch('classifiche.json');
                const allRows = await response.json();
                rows = allRows[gamemode][statistic];

                let startRow = (startPage - 1) * rowsPerPage
                let endRow = endPage * rowsPerPage;
                resolve(rows.slice(startRow, endRow+1));
            } catch (error) {
                console.error('Error fetching data:', error);
                resolve([]);
            }
        }, 2000); // Simulate 2 seconds delay
    });
}

/*
Logica di fetching

Si chiede la pagina X che non è in cache:
if X==1 prendo intervallo (X, X+pageOffset) // prima pagina -> prendo le y successive
else // pagina intermedia -> prendo un intorno di y pagine
    if X+1 è in cache prendo l'intervallo prima (X-pageOffset, X) (senza scendere sotto pagina 1, quindi max(1, x-pageOffset))
    elif X-1 è in cache prendo l'intervallo dopo (X, X+pageOffset) (senza eccedere oltre l'ultima pagina (la conosco?))
    else // se è una pagina "isolata"
        prendo l'intorno (X-floor(pageOffset/2), X+floor(pageOffset/2))         //es. se pageOffset==5 prendo intervallo (X-2, X+2)
*/

// fetch rows and update cache
async function getRows(gamemode, statistic, page) {
    // loading spinner
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </td>
      </tr>
    `;

    let startPage, endPage;

    // define what page interval to fetch
    if (page == 1) {
        startPage = 1;
        endPage = startPage + pageOffset - 1;
    } else {    // pagina intermedia
        if (cache?.[gamemode]?.[statistic]?.[page+1]) { // se la pagina x+1 è in cache, prendo le pagine precedenti 
            startPage = Math.max(1, page - pageOffset + 1); // es. page = 5, pageOffset = 5, prendo pagine 1,2,3,4,5
                                                            // es. page = 2, pageOffset = 5, prendo pagine 1,2
            endPage = page;   
        } else if (cache?.[gamemode]?.[statistic]?.[page-1]) { // se la pagina x-1 è in cache, prendo le pagine successive 
            startPage = page;
                                                           
            endPage = page + pageOffset - 1;  // ############## gestire totalPages 
        } else {
            offset = Math.floor(pageOffset/2);
            startPage = Math.max(1, page - offset);
            endPage = page + offset;
        }
    }

    // fetch rows
    const fetchedRows = await fetchRows(gamemode, statistic, startPage, endPage);
    const startRow = (startPage - 1) * rowsPerPage;

    if (!cache[gamemode]) {
        cache[gamemode] = {};
    }
    if (!cache[gamemode][statistic]) {
        cache[gamemode][statistic] = {}
    }

    // store fetched rows in cache
    for (let page = startPage; page <= endPage; page++) {
        const pageStartIndex = (page - 1) * rowsPerPage;
        cache[gamemode][statistic][page] = fetchedRows.slice(
            pageStartIndex - startRow,
            pageStartIndex - startRow + rowsPerPage
        );
    }
    console.log('Cache updated', cache);
}


// fetch rows from startPage to startPage+pageOffset and store in cache
/*async function getRows(gamemode, statistic, startPage) {

    // loading spinner
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </td>
      </tr>
    `;

    // fetch rows
    const fetchedRows = await fetchRows(gamemode, statistic, startPage);
    const startRow = (startPage - 1) * rowsPerPage;

    if (!cache[gamemode]) {
        cache[gamemode] = {};
    }
    if (!cache[gamemode][statistic]) {
        cache[gamemode][statistic] = {}
    }

    // store fetched rows in cache
    for (let page = startPage; page < startPage + pageOffset; page++) {
        const pageStartIndex = (page - 1) * rowsPerPage;
        cache[gamemode][statistic][page] = fetchedRows.slice(
            pageStartIndex - startRow,
            pageStartIndex - startRow + rowsPerPage
        );
    }
    console.log('Cache updated', cache);
}*/

// Rendering functions

function renderTable(gamemode, statistic, page) {

    tableBody.innerHTML = '';

    // rendering table rows
    cache[gamemode][statistic][page].forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.rank}</td>
          <td>${row.giocatore}</td>
          <td>${row.statistica}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function renderPagination(currentPage) {

    pagination.innerHTML = '';

    // "Page 1" button
    const firstButton = document.createElement('li');
    firstButton.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    firstButton.innerHTML = `
        <button class="page-link" onclick="loadPage(1)" aria-label="First">&laquo; First page</button>
      `;
    pagination.appendChild(firstButton);

    // "Previous" button
    const prevButton = document.createElement('li');
    prevButton.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevButton.innerHTML = `
        <button class="page-link" onclick="loadPage(${currentPage - 1})" aria-label="Previous">&laquo; Previous</button>
      `;
    pagination.appendChild(prevButton);

    // Current page button
    const currentPageButton = document.createElement('li');
    currentPageButton.className = 'page-item active';
    currentPageButton.innerHTML = `
        <button class="page-link">${currentPage}</button>
      `;
    pagination.appendChild(currentPageButton);

    // "Next" button
    const nextButton = document.createElement('li');
    nextButton.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextButton.innerHTML = `
        <button class="page-link" onclick="loadPage(${currentPage + 1})" aria-label="Next">Next &raquo;</button>
      `;
    pagination.appendChild(nextButton);

    // "Page last" button
    /*const lastButton = document.createElement('li');
    lastButton.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    lastButton.innerHTML = `
        <button class="page-link" onclick="loadPage(${totalPages})" aria-label="First">&laquo; Last page</button>
      `;
    pagination.appendChild(lastButton);*/
}


// Render statistic options based on the selected gamemode
function updateStatisticOptions(gamemode) {
    const container = document.getElementById('statistic-options');
    container.innerHTML = '';

    // render selectors
    statisticOptions[gamemode].forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'form-check';

        const input = document.createElement('input');
        input.className = 'form-check-input statistic';
        input.type = 'radio';
        input.name = 'statistic';
        input.id = option.id;
        input.value = option.label;

        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.htmlFor = option.id;
        label.textContent = option.label;

        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        container.appendChild(optionDiv);
    });

    // Select the first option by default
    if (container.firstChild) {
        container.firstChild.querySelector('input').checked = true;
    }

    // add loadPage trigger on selection
    const statisticSelectors = document.querySelectorAll('input[name="statistic"]');
    statisticSelectors.forEach(selector => {
        selector.addEventListener('change', (event) => {
            if (event.target.checked) {
                loadPage(1);
            }
        });
    });
}

async function loadPage(page) {
    if (page < 1) return;

    const gamemode = document.querySelector('input[name="gamemode"]:checked').id;
    const statistic = document.querySelector('input[name="statistic"]:checked').id;

    // fetch page if not in cache
    if (!(cache?.[gamemode]?.[statistic]?.[page])) {
        await getRows(gamemode, statistic, page);
    }

    // render table and buttons
    renderTable(gamemode, statistic, page);
    renderPagination(page);
}





// Page initialization

// add listener for leaderboard creation
document.addEventListener('DOMContentLoaded', function () {
    const gamemode = document.querySelector('input[name="gamemode"]:checked').id;
    updateStatisticOptions(gamemode);

    const offcanvasElement = document.getElementById('offcanvasDarkNavbar');
    offcanvasElement.addEventListener('show.bs.offcanvas', function () {
        loadPage(1);
    });
});


// add listeners on gamemode selectors
const gamemodeSelectors = document.querySelectorAll('input[name="gamemode"]');

gamemodeSelectors.forEach(selector => {
    selector.addEventListener('change', (event) => {
        if (event.target.checked) {
            console.log(event.target.id);

            updateStatisticOptions(event.target.id);
            loadPage(1);
        }
    });
});


