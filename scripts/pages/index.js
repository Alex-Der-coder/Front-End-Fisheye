// index.js
function getPhotographers() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/photographers.json');
        xhr.onload = () => {
            if (xhr.status === 200) {
                try {
                    const photographersData = JSON.parse(xhr.responseText);
                    const photographers = photographersData.photographers; // Extract the array of photographers
                    console.log("Fetched photographers data:", photographers);
                    resolve(photographers);
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(new Error('Failed to fetch photographers data.'));
            }
        };
        xhr.onerror = () => {
            reject(new Error('Failed to fetch photographers data.'));
        };
        xhr.send();
    });
}

function photographerTemplate(photographer) {
    return {
        name: photographer.name,
        imageUrl: photographer.portrait,
        city: photographer.city,
        country: photographer.country,
        tagline: photographer.tagline,
        price: photographer.price,
        id: photographer.id,
         // Use 'portrait' property as the image URL
        // Add other properties you need
        getUserCardDOM: function () {
            const card = document.createElement('div');
            card.classList.add('photographer-card');
            card.classList.add('photographer-card');
            card.innerHTML = `
            <article data-photographer-id="${this.id}">
            <a class="display_none_decoration"  href="photographer.html?id=${this.id}">
                <img src="data/${this.imageUrl}" alt="${this.name}">
                <h2>${this.name}</h2>
                <p>${this.city}, ${this.country}</p>
                <p>${this.tagline}</p>
                <p>${this.price} &euro;/par jour</p>
                </a>
            </article>   
            <div class="about_me">
            </div> 
            `;
            return card;
        },
    };
}

async function displayData(photographers) {
    const photographersSection = document.querySelector('.photographer_section');

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    try {
        const photographers = await getPhotographers();
        console.log("Data fetched successfully. Now displaying data.");
        displayData(photographers);
    } catch (error) {
        console.error(error);
    }
}

init();
