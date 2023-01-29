const API = 'https://api.thecatapi.com/v1';
const API_KEY = 'live_7mubuOBuhjyYaMJHadzfRlUmzVcctvbpNamss4Zo313Vo3d3SnaxX6HI1PbMmWB5'

const sig = document.getElementById('sig-btn');
const cardContainer = document.querySelector('.cards-container');
const mainTitle = document.querySelector('.main__title');
const titlePage = document.querySelector('title');
const random = document.querySelector('#random');
const favourites = document.querySelector('#favourites');
const sigBtnContainer = document.querySelector('.sig-btn-container');

const menuIcon = document.querySelector('.menu-icon');

const menu = document.getElementById('refs');



function openMenu() {
    menu.classList.toggle('hidden');
    menu.classList.toggle('display-flex')
    console.log('asd')
}

menuIcon.addEventListener('click', openMenu)

sig.addEventListener('click', loadRandomMichis);
random.addEventListener('click', loadRandomMichis);
favourites.addEventListener('click', loadFavouritesMichis);

async function fetchCats(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-API-KEY': API_KEY
        }
    });
    return await response.json();
}

async function loadRandomMichis() {
    mainTitle.innerHTML = 'Random Michis';
    titlePage.innerText = 'Random Muchis';
    sigBtnContainer.classList.remove('hidden');
    cardContainer.innerHTML = 'Loading...';

    const cats = await fetchCats(`${API}/images/search?limit=8`);
    let view;

    view = `
        ${cats.map(cat => `
            <div class="card-container" id="${cat.id}">
                <figure class="card-img-container">
                    <img src="${cat.url}" class="card-img" alt="gatito aleatorio">
                </figure>
                <div class="card-btn-container">
                    <button class="card-btn" onclick="saveFavourite('${cat.id}')">Add to fovorit</button>
                </div>
            </div>
        `).join('')}
    `;
    cardContainer.innerHTML = view;
}

async function loadFavouritesMichis() {
    mainTitle.innerHTML = 'Favourites Michis';
    titlePage.innerText = 'Favourites Michis';
    if (!sigBtnContainer.classList.contains('hidden')) {
        sigBtnContainer.classList.add('hidden');
    }

    cardContainer.innerHTML = 'Loading...';

    const cats = await fetchCats(`${API}/favourites?limit=20`);

    console.log(cats);
    let view;

    view = `
        ${cats.map(cat => `
            <div class="card-container" id="${cat.id}">
                <figure class="card-img-container">
                    <img src="${cat.image.url}"  class="card-img" alt="gatito aleatorio">
                </figure>
                <div class="card-btn-container">
                    <button class="card-btn card-btn--delete" onclick="deleteFavourite('${cat.id}')">Delete of Favourites</button>
                </div>
            </div>
        `).join('')}

    `;
    cardContainer.innerHTML = view;
}


async function saveFavourite(id) {
    const response = await fetch(`${API}/favourites?api_key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
        },
        body: JSON.stringify({
            image_id: id
        })
    });

    const data = await response.json();

    console.log(data);
}

async function deleteFavourite(id) {

    const card = document.getElementById(`${id}`);
    card.classList.add('deleting');
    try {

        const response = await fetch(`${API}/favourites/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            }
        });
        
        if (response.status == 200) {
            console.log('Se elimino de favoritos:' + id);
            document.getElementById(`${id}`).remove();
            
        } else console.log('F no funciona esta monda');
    } catch (err) {
        if (card.classList.contains('deleting'))
            card.classList.remove('deleting');
        throw new Error(err);
    }
}

loadRandomMichis();