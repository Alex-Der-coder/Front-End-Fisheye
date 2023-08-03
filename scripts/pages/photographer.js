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

function fetchPhotographersJson() {
    return fetch('scripts/templates/photographer.js').then(response => response.json());
  }



  function filterMediaByPhotographerId(mediaData, photographerId) {
    return mediaData.filter((media) => media.photographerId === photographerId);
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


async function fetchJsonData() {
  try {
    const response = await fetch('data/photographers.json'); // Use the correct relative URL
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    throw new Error('Error fetching JSON data.');
  }
}



async function getPhotographerAndMedia(jsonData, photographerId) {
  const photographer = jsonData.photographers.find((p) => p.id === parseInt(photographerId));
  const mediaData = await fetchJsonData(); // Utilisez "await" pour attendre que les données soient récupérées
  const filteredMediaItems = mediaData.media.filter((media) => media.photographerId === parseInt(photographerId));
  
  return {
    photographer: photographer,
    media: filteredMediaItems
  };
}



async function main() {
  const jsonData = await fetchJsonData();
  const urlParams = new URLSearchParams(window.location.search);
  const photographerId = urlParams.get('id');
  const photographerAndMedia = await getPhotographerAndMedia(jsonData, photographerId);

  console.log('Photographer:', photographerAndMedia.photographer);
  console.log('Media:', photographerAndMedia.media);

  const aboutMeDiv = document.querySelector('.photograph-header');
  aboutMeDiv.innerHTML += `
    <article data-photographer-id="${photographerId}">
      <img src="data/${photographerAndMedia.photographer.portrait}" alt="${photographerAndMedia.photographer.name}">
      <h2>${photographerAndMedia.photographer.name}</h2>
      <p>${photographerAndMedia.photographer.tagline}</p>
      <p>City: ${photographerAndMedia.photographer.city}</p>
      <p>Country: ${photographerAndMedia.photographer.country}</p>
    </article>
    <div class="sort-select">
    <label for="sort-select">Triez par :</label>
    <select id="sort-select">
    <option value="popular">Popularité</option>
    <option value="recent">Récent</option>
    <option value="title">Titre</option>
  </select>
    </div>
    <div class="gallery">
    </div>
  `;
  const galleryDiv = document.querySelector('.gallery');
  const sortSelect = document.querySelector('.sort-select');


  photographerAndMedia.media.forEach(media => {
    if (media.hasOwnProperty('image')) {
      const imgElement = createImageElement(media);
      galleryDiv.appendChild(imgElement);
    } else if (media.hasOwnProperty('video')) {
      const videoElement = createVideoElement(media);
      galleryDiv.appendChild(videoElement);
    }
  });

  sortSelect.addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    let sortedMedia;
  
    if (selectedValue === 'popular') {
      sortedMedia = sortByPopularity(photographerAndMedia.media);
    } else if (selectedValue === 'recent') {
      sortedMedia = sortByRecent(photographerAndMedia.media);
    } else if (selectedValue === 'title') {
      sortedMedia = sortByTitle(photographerAndMedia.media);
    } else {
      sortedMedia = photographerAndMedia.media; // Pas de tri spécifié, utilisez l'ordre d'origine
    }
  
    // Videz la galerie actuelle et ajoutez les éléments triés
    galleryDiv.innerHTML = '';
    sortedMedia.forEach(media => {
      if (media.hasOwnProperty('image')) {
        const imgElement = createImageElement(media);
        galleryDiv.appendChild(imgElement);
      } else if (media.hasOwnProperty('video')) {
        const videoElement = createVideoElement(media);
        galleryDiv.appendChild(videoElement);
      }
    });
  });

}

function createImageElement(media) {
  const figureElement = document.createElement('figure');

  const imgElement = document.createElement('img');
  imgElement.src = `assets/thumbnail/${media.image}`;
  imgElement.alt = media.title;
  imgElement.classList.add('thumb');

  // Ajout des attributs personnalisés à la balise figure
  figureElement.setAttribute('data-title', media.title);
  figureElement.setAttribute('data-likes', media.likes);
  figureElement.setAttribute('data-date', media.date);

  const figCaptionElement = document.createElement('figcaption');
  figCaptionElement.textContent = `${media.title} ${media.likes} ❤️ `;

  figureElement.appendChild(imgElement);
  figureElement.appendChild(figCaptionElement);

  return figureElement;
}

function createVideoElement(media) {
  const figureElement = document.createElement('figure');

  const videoElement = document.createElement('video');
  videoElement.src = `assets/thumbnail/${media.video}`;
  videoElement.alt = media.title;
  videoElement.classList.add('thumb');
  videoElement.controls = true;

  const sourceElement = document.createElement('source');
  sourceElement.src = `assets/thumbnail/${media.video}`;
  sourceElement.type = 'video/mp4';

  const figCaptionElement = document.createElement('figcaption');
  const titleElement = document.createElement('h3');
  titleElement.textContent = media.title;

  const contentElement = document.createElement('p');
  contentElement.textContent = `${media.likes} likes ❤️`; // Utilisez le caractère Unicode pour le symbole du cœur

  figCaptionElement.appendChild(titleElement);
  figCaptionElement.appendChild(contentElement);

  figureElement.setAttribute('data-title', media.title);
  figureElement.setAttribute('data-likes', media.likes);
  figureElement.setAttribute('data-date', media.date);

  figureElement.appendChild(videoElement);
  figureElement.appendChild(sourceElement);
  figureElement.appendChild(figCaptionElement);

  return figureElement;
}





// Fonction pour trier les médias par popularité (likes)
function sortByPopularity(mediaArray) {
  return mediaArray.slice().sort((a, b) => b.likes - a.likes);
}

// Fonction pour trier les médias par récence (date)
function sortByRecent(mediaArray) {
  return mediaArray.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Fonction pour trier les médias par titre
function sortByTitle(mediaArray) {
  return mediaArray.slice().sort((a, b) => a.title.localeCompare(b.title));
}


main();





