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
        getUserCardDOM: function () {
            const card = document.createElement('article');
            card.classList.add('photographer-card');
            card.dataset.photographerId = this.id;

            const figure = document.createElement('figure');
            figure.setAttribute('tabindex', '0');

            const link = document.createElement('a');
            link.classList.add('display_none_decoration');
            link.href = `photographer.html?id=${this.id}`;
            link.setAttribute('aria-label', `Voici ${this.name} dans la ville ${this.city}`);

            const image = document.createElement('img');
            image.src = `data/${this.imageUrl}`;
            image.alt = `${this.name} - ${this.tagline}`;
            link.appendChild(image);

            const nameHeading = document.createElement('h2');
            nameHeading.id = `name-${this.id}`;
            nameHeading.textContent = this.name;

            const location = document.createElement('p');
            location.id = `location-${this.id}`;
            location.textContent = `${this.city}, ${this.country}`;
            location.classList.add('location');



            const tagline = document.createElement('p');
            tagline.textContent = this.tagline;

            const price = document.createElement('p');
            price.textContent = `${this.price} €/par jour`;

            link.appendChild(nameHeading);
            link.appendChild(location);

            figure.appendChild(link);
            figure.appendChild(tagline);
            figure.appendChild(price);

            card.appendChild(figure);

            const aboutMe = document.createElement('div');
            aboutMe.classList.add('about_me');
            card.appendChild(aboutMe);

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
