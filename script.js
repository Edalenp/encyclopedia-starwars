// Save the API and select the DOM elements

const api = 'https://swapi.dev/api/people/';
const form = document.getElementById("search-form");
const query = document.querySelector(".search-input");
const button = document.querySelector(".search-button");
const containerCharacters = document.querySelector(".container-characters");
const loader = document.getElementById("loader");

// We initialize our page by default at 1 and if the user is searching

let page = 1;
let isSearching = false;

function toggleLoader(show) {
    if (show) loader.classList.remove("hidden");
    else loader.classList.add("hidden");
}

function showError(message) {
    containerCharacters.innerHTML = `
        <div class="important" style="border-color: var(--sith-red); background: rgba(255, 0, 60, 0.1);">
            <p style="color: var(--sith-red);">${message}</p>
        </div>`;
}

// Function for the fetch of data 

async function fetchData(url) {
    try {
        toggleLoader(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not okay");
        return await response.json();
    } catch (error) {
        showError("CONNECTION LOST. UNABLE TO RETRIEVE DATA FROM ARCHIVES.");
        return null;
    } finally {
        toggleLoader(false);
    }
}

// Function to fetch and show results 

async function results(url) {
    const data = await fetchData(url);
    if (data && data.results) {
        showResults(data.results);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Function to create character-card HTML template 

function createCard(character) {
    const imagePath = `static/${character.name.toLowerCase()}.jpg`
    const cardHTML =
        `
    <div class="character-card">
        <div class="card-image-container">
            <img src="${imagePath}" alt="${character.name}" class="character-image" loading="lazy" width="300" height="400" decoding="async">
        </div>
        <div class="card-details">
            <h3>${character.name}</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="label">Birth Year</span>
                    <span class="value">${character.birth_year}</span>
                </div>
                <div class="stat-item">
                    <span class="label">Height</span>
                    <span class="value">${character.height} cm</span>
                </div>
                <div class="stat-item">
                    <span class="label">Mass</span>
                    <span class="value">${character.mass} kg</span>
                </div>
                <div class="stat-item">
                    <span class="label">Gender</span>
                    <span class="value">${character.gender}</span>
                </div>
            </div>
        </div>
    </div>
    `;
    return cardHTML;
}
// Function to display results

function showResults(results) {
    containerCharacters.innerHTML = "";

    results.forEach(character => {
        const card = createCard(character);
        containerCharacters.insertAdjacentHTML("beforeend", card);
    });
}

// Function to handle form submission

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTerm = query.value.trim();

    if (searchTerm) {
        isSearching = true;
        results(`https://swapi.dev/api/people/?search=${searchTerm}`);
    } else {
        isSearching = false;
        results(`${api}?page=${page}`);
    }

    query.value = "";

});

// Function to handle pagination

function handlePagination(direction) {
    if (direction === 'previous') page = (page === 1) ? 9 : page - 1;
    else if (direction === 'next') page = (page === 9) ? 1 : page + 1;

    if (isSearching) {
        results(`https://swapi.dev/api/people/?search=${query.value.trim()}`);
    } else results(`${api}?page=${page}`);
}

// Event listeners for pagination buttons

document.getElementById('previous-button').addEventListener('click', () => handlePagination('previous'));
document.getElementById('next-button').addEventListener('click', () => handlePagination('next'));

// Initial results on page load

results(`${api}?page=${page}`);
