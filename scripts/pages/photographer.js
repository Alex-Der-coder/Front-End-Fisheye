// Function to fetch the photographers data from photographers.json
function getPhotographers() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/photographers.json');
        xhr.onload = () => {
            if (xhr.status === 200) {
                try {
                    const photographersData = JSON.parse(xhr.responseText);
                    const photographers = photographersData.photographers;
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

// Function to get the photographer info based on ID
function getPhotographerInfo(photographerId) {
    return new Promise((resolve, reject) => {
        getPhotographers()
            .then(photographers => {
                const photographer = photographers.find(p => p.id === parseInt(photographerId));
                if (photographer) {
                    resolve(photographer);
                } else {
                    reject(new Error('Photographer not found.'));
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}

// Récupérer l'ID du photographe à partir des URL parameters
const urlParams = new URLSearchParams(window.location.search);
const photographerId = urlParams.get('id');

// Récupérer les informations du photographe
getPhotographerInfo(photographerId)
    .then(photographer => {
        // Afficher les informations du photographe sur la page
        const aboutMeDiv = document.querySelector('.photograph-header');
        aboutMeDiv.innerHTML += `
        <article data-photographer-id="${photographer.id}">
            <img src="${photographer.portrait}" alt="${photographer.name}">
            <h2>${photographer.name}</h2>
            <p>${photographer.tagline}</p>
            <p>City: ${photographer.city}</p>
            <p>Country: ${photographer.country}</p>
        </article>
        <div class="galerie">
        </div>
        `;

        const galleryDiv = document.querySelector('.galerie');
        photographer.pictures.forEach(picture => {
            const imgElement = document.createElement('img');
            imgElement.src = picture; 
            imgElement.alt = photographer.name; 
            imgElement.classList.add('thumb');
            galleryDiv.appendChild(imgElement);
        });
    })
    .catch(error => {
        console.error(error);
        // Gérer l'erreur, par exemple afficher un message d'erreur sur la page
    });
