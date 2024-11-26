// Example data: 30 rows of placeholder data
const data = Array.from({ length: 189 }, (_, i) => ({
    rank: i + 1,
    giocatore: `Giocatore ${i + 1}`,
    statistica: `${Math.floor(Math.random() * 100)}%`,
}));


const rowsPerPage = 10;
const tableBody = document.getElementById('table-body');
const pagination = document.getElementById('pagination');

function renderTable(page) {
    // Clear existing rows
    tableBody.innerHTML = '';

    // Calculate the start and end indices for the current page
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    // Add rows for the current page
    data.slice(start, end).forEach(row => {
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
    const totalPages = Math.ceil(data.length / rowsPerPage);

    // Clear existing pagination buttons
    pagination.innerHTML = '';

    // "Page 1" button
    const firstButton = document.createElement('li');
    firstButton.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    firstButton.innerHTML = `
        <button class="page-link" onclick="changePage(1)" aria-label="First">&laquo; First page</button>
      `;
    pagination.appendChild(firstButton);

    // "Previous" button
    const prevButton = document.createElement('li');
    prevButton.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevButton.innerHTML = `
        <button class="page-link" onclick="changePage(${currentPage - 1})" aria-label="Previous">&laquo; Previous</button>
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
        <button class="page-link" onclick="changePage(${currentPage + 1})" aria-label="Next">Next &raquo;</button>
      `;
    pagination.appendChild(nextButton);

    // "Page last" button
    const lastButton = document.createElement('li');
    lastButton.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    lastButton.innerHTML = `
        <button class="page-link" onclick="changePage(${totalPages})" aria-label="First">&laquo; Last page</button>
      `;
    pagination.appendChild(lastButton);
}

function changePage(page) {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    if (page < 1 || page > totalPages) return; // Prevent invalid page changes
    renderTable(page);
    renderPagination(page);
}

// Initialize table and pagination
renderTable(1);
renderPagination(1);
