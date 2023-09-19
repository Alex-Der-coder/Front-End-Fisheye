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
  
  
  const modalHeader = document.querySelector("#contact_modal header h2");
  modalHeader.textContent = `Contactez-moi ${photographerAndMedia.photographer.name}`;
  
  
  function calculateTotalLikes(mediaArray) {
    let total = 0;
    for (const item of mediaArray) {
      total += item.likes;
    }
    return total;
  }
  
  let totalLikes = calculateTotalLikes(photographerAndMedia.media);
  
  
  console.log('Total des likes:', totalLikes);
  console.log(photographerAndMedia.photographer.price);
  
  
  const aboutMeDiv = document.querySelector('.photograph-header');
  const aboutGallery = document.querySelector('.photograph_header_gallery');
  
  aboutMeDiv.innerHTML += `
  <article class="about_me" data-photographer-id="${photographerId}">
  <img class="about_me_img" src="data/${photographerAndMedia.photographer.portrait}" alt="${photographerAndMedia.photographer.name}">
  <h2>${photographerAndMedia.photographer.name}</h2>
  <p class="location"> ${photographerAndMedia.photographer.city}, ${photographerAndMedia.photographer.country}</p>
  <p class="talk_about">${photographerAndMedia.photographer.tagline}</p>
  </article>
  <div class="my_job">
  <p id="totalCount">${totalLikes} <span>&#x2665;</span></p>
  <p> ${photographerAndMedia.photographer.price} € / jour </p>
  </div>
  
  `;
  aboutGallery.innerHTML += `
  
  <div class="sort-select">
  <label for="sortSelect">Triez par :</label>
  
  <div class="custom-dropdown">
  <button class="dropdown-button">Sélectionnez une option   <span class="chevron"></span> </button>
  <ul class="dropdown-list">
  <li>
  <a href="#" data-value="popular" aria-label="Order by Popularité">Popularité </a>
  </li>
  <li>
  <a href="#" data-value="recent" aria-label="Order by Date">Date </a>
  </li>
  <li>
  <a href="#" data-value="title" aria-label="Order by Titre">Titre </a>
  </li>
  </ul>
  
  </div>
  </div>
  <div class="gallery">
  </div>
  <div class="lightbox" id="lightboxModal">
  <span class="close-btn" id="closeModal">&times;</span>
  <button class="lightbox-prev-btn" aria-label="Previous image">❮</button>
  <button class="lightbox-next-btn" aria-label="Next image">❯</button>  
  <div class="modal-content">
  <div class="media-container"></div>
  <figcaption id="media-title"></figcaption>
  </div>
  </div>
  
  
  
  </div>
  `;
  
  const photographerPortrait = document.querySelector(`[data-photographer-id="${photographerId}"] img`);
  photographerPortrait.setAttribute('aria-label', `${photographerAndMedia.photographer.name}'s portrait`);
  
  const media = photographerAndMedia.media;
  function createMediaElement(media, mediaType) {
    const figureElement = document.createElement('figure');
    
    let mediaElement;
    if (mediaType === 'image') {
      mediaElement = document.createElement('img');
      mediaElement.src = `assets/thumbnail/${media.image}`;
      figureElement.setAttribute('tabindex', '0');
    } else if (mediaType === 'video') {
      mediaElement = document.createElement('video');
      mediaElement.src = `assets/thumbnail/${media.video}`;
      mediaElement.controls = true;
      
      const sourceElement = document.createElement('source');
      sourceElement.src = `assets/thumbnail/${media.video}`;
      sourceElement.type = 'video/mp4';
      mediaElement.appendChild(sourceElement);
    }
    
    mediaElement.alt = media.title;
    mediaElement.classList.add('thumb');
    mediaElement.setAttribute('aria-label', `${media.title}, closeup view`);
    
    
    const figCaptionElement = document.createElement('figcaption');
    figCaptionElement.textContent = media.title;
    
    const titleAndLikesContainer = document.createElement('div');
    titleAndLikesContainer.classList.add('title-likes-container');
    
    const titleAndLikesContent = document.createElement('div');
    titleAndLikesContent.classList.add('title-likes-content');
    
    const likesElement = document.createElement('span');
    likesElement.textContent = media.likes;
    likesElement.setAttribute('aria-label', `Likes`);
    
    const likeButton = document.createElement('button');
    likeButton.classList.add('like-button');
    likeButton.textContent = '❤️';
    
    let isLiked = false;
    const likesElementtotal = document.getElementById('totalCount'); // Sélectionnez l'élément avec l'ID "totalCount"
    likeButton.addEventListener('click', () => {
      if (isLiked) {
        media.likes--;
      } else {
        media.likes++;
      }
      isLiked = !isLiked;
      
      // Mettez à jour le compteur totalLikes
      totalLikes = calculateTotalLikes(photographerAndMedia.media);
      
      // Mettez à jour l'affichage du total des likes
      likesElementtotal.textContent = `${totalLikes} ♥`;
      likesElement.textContent = `${media.likes}`;
      console.log('Total des likes:', totalLikes);
    });
    
    // La fonction calculateTotalLikes reste la même
    
    titleAndLikesContent.appendChild(likesElement);
    titleAndLikesContent.appendChild(likeButton);
    
    titleAndLikesContainer.appendChild(figCaptionElement);
    titleAndLikesContainer.appendChild(titleAndLikesContent);
    
    figureElement.appendChild(mediaElement);
    figureElement.appendChild(titleAndLikesContainer);
    
    mediaElement.addEventListener('click', () => {
      if (mediaType === 'image') {
        openModal(media.image, media.title);
      } else if (mediaType === 'video') {
        openModal(media.video, media.title);
      }
    });
    
    return figureElement;
  }
  const galleryDiv = document.querySelector('.gallery');
  const imgElement = createMediaElement(media, 'image');
  
  galleryDiv.appendChild(imgElement);
  
  const videoElement = createMediaElement(media, 'video');
  
  galleryDiv.appendChild(videoElement);
  
  photographerPortrait.setAttribute('aria-label', `${photographerAndMedia.photographer.name}'s portrait`);
  
  
  
  let currentMediaIndex = 0;
  
  const lightboxModal = document.getElementById('lightboxModal');
  const closeModalBtn = document.getElementById('closeModal');
  const prevBtn = document.querySelector('.lightbox-prev-btn');
  const nextBtn = document.querySelector('.lightbox-next-btn');
  const modalMediaContainer = document.querySelector('.media-container');
  const modalMediaTitle = document.getElementById('media-title');
  
  function openModal(mediaPath, mediaTitle) {
    modalMediaContainer.innerHTML = ''; // Nettoyer le contenu précédent
    
    if (mediaPath.includes('.mp4')) {
      const videoElement = document.createElement('video');
      videoElement.src = `assets/thumbnail/${mediaPath}`;
      videoElement.controls = true;
      modalMediaContainer.appendChild(videoElement);
    } else {
      const imgElement = document.createElement('img');
      imgElement.src = `assets/thumbnail/${mediaPath}`;
      imgElement.alt = mediaTitle;
      modalMediaContainer.appendChild(imgElement);
    }
    
    modalMediaTitle.textContent = mediaTitle;
    lightboxModal.style.display = 'flex';
  }
  
  closeModalBtn.addEventListener('click', () => {
    lightboxModal.style.display = 'none';
  });
  
  function calculateTotalLikes(mediaArray) {
    let total = 0;
    for (const item of mediaArray) {
      total += item.likes;
    }
    return total;
  }
  
  // Fonction pour fermer le modal
  function fermerModal() {
    lightboxModal.style.display = 'none';
  }
  
  // Ajoutez un écouteur d'événements pour le bouton de fermeture du modal
  closeModalBtn.addEventListener('click', fermerModal);
  
  // Ajoutez un écouteur d'événements pour la touche "Escape"
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      fermerModal();
    }
  });
  
  
  prevBtn.addEventListener('click', () => {
    navigateMedia(-1);
  });
  
  nextBtn.addEventListener('click', () => {
    navigateMedia(1);
  });
  
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      navigateMedia(-1); // Déplacer vers la gauche
    } else if (event.key === 'ArrowRight') {
      navigateMedia(1); // Déplacer vers la droite
    }
  });
  
  function navigateMedia(direction) {
    currentMediaIndex += direction;
    
    if (currentMediaIndex < 0) {
      currentMediaIndex = photographerAndMedia.media.length - 1;
    } else if (currentMediaIndex >= photographerAndMedia.media.length) {
      currentMediaIndex = 0;
    }
    
    const media = photographerAndMedia.media[currentMediaIndex];
    openModal(media.image || media.video, media.title);
  }
  
  
  const dropdownButton = document.querySelector(".dropdown-button");
  const dropdownList = document.querySelector(".dropdown-list");
  const dropdownItems = document.querySelectorAll(".dropdown-list a");
  const chevron = document.querySelector(".chevron"); // Sélectionnez l'élément chevron
  
  
  // Cacher la liste déroulante au chargement initial
  dropdownList.style.display = "none";
  
  // Fonction pour inverser le chevron
  function toggleChevron() {
    chevron.classList.toggle("rotate"); // Ajoute ou retire la classe rotate
  }
  
  // Inverser le chevron initial au chargement de la page
  toggleChevron();
  dropdownButton.addEventListener("click", function() {
    dropdownList.style.display = dropdownList.style.display === "none" ? "block" : "none";
    dropdownList.classList.toggle("open");
    chevron.classList.toggle("rotate"); // Utilisez directement la classe chevron ici
  });
  
  
  // Gérer la sélection d'une option
  dropdownItems.forEach(item => {
    item.addEventListener("click", function(event) {
      event.preventDefault();
      
      // Obtenir la valeur de l'option sélectionnée
      const selectedValue = item.getAttribute("data-value");
      let sortedMedia;
      
      // Trier les médias en fonction de l'option sélectionnée
      if (selectedValue === "popular") {
        sortedMedia = sortByPopularity(photographerAndMedia.media);
      } else if (selectedValue === "recent") {
        sortedMedia = sortByRecent(photographerAndMedia.media);
      } else if (selectedValue === "title") {
        sortedMedia = sortByTitle(photographerAndMedia.media);
      } else {
        sortedMedia = photographerAndMedia.media;
      }
      
      // Mettre à jour la galerie avec les médias triés
      galleryDiv.innerHTML = "";
      
      sortedMedia.forEach(media => {
        if (media.hasOwnProperty("image")) {
          const imgElement = createMediaElement(media, "image");
          galleryDiv.appendChild(imgElement);
        } else if (media.hasOwnProperty("video")) {
          const videoElement = createMediaElement(media, "video");
          galleryDiv.appendChild(videoElement);
        }
      });
      
      // Mettre à jour le texte du bouton avec l'option sélectionnée
      const buttonText = item.textContent +  '˄' ;
      dropdownButton.textContent = buttonText;
      
      // Cacher la liste déroulante après la sélection
      dropdownList.style.display = "none";
      
      // Mettre à jour la visibilité des options dans la liste
      dropdownItems.forEach(option => {
        option.style.display = option === item ? "none" : "block";
      });
    });
  });
  
  // Sélectionner la valeur par défaut (Popularité) et mettre à jour le texte du bouton
  const defaultItem = document.querySelector(".dropdown-list a[data-value='popular']");
  const defaultButtonText = defaultItem.textContent;
  dropdownButton.textContent = defaultButtonText;
  defaultItem.click();
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



function toggleLike(media, likeButton) {
  if (media.liked) {
    media.likes--;
    media.liked = false;
  } else {
    media.likes++;
    media.liked = true;
  }
  
  likeButton.textContent = `${media.likes} ❤️`;
}


main();

$(document).ready(function() {
  // Lorsque le bouton est cliqué, basculez la classe "open" pour afficher/cacher la liste déroulante
  $('.dropdown-button').click(function() {
    const customDropdown = $('.custom-dropdown');
    const dropdownButton = $('.dropdown-button');
    const dropdownList = $('.dropdown-list');
    
    customDropdown.toggleClass('open');
    dropdownList.toggle(); // Affiche ou cache la liste déroulante
    
    // Mettez à jour le texte du bouton avec le chevron en fonction de l'état de la liste déroulante
    const selectedOption = dropdownList.find('a[data-value]:visible').text();
    const chevron = customDropdown.hasClass('open') ? ' ˅' : ' ˄';
    dropdownButton.text(selectedOption + chevron);
  });
  
  // Lorsqu'un élément d'option est cliqué, mettez à jour le texte du bouton et fermez la liste déroulante
  $('.dropdown-list a').click(function() {
    const selectedOption = $(this).text();
    const customDropdown = $('.custom-dropdown');
    const dropdownButton = $('.dropdown-button');
    
    // Mettez à jour le texte du bouton avec le chevron
    dropdownButton.text(selectedOption + ' ˄');
    
    customDropdown.removeClass('open');
  });
  
  // Fermez la liste déroulante si l'utilisateur clique en dehors de celle-ci
  $(document).click(function(event) {
    if (!$(event.target).closest('.custom-dropdown').length) {
      $('.custom-dropdown').removeClass('open');
    }
  });
});



// Sélectionnez le formulaire par son identifiant
const contactForm = document.getElementById('contact_form');

// Ajoutez un gestionnaire d'événements à la soumission du formulaire
contactForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Empêche le formulaire de se soumettre normalement
  
  // Récupérez les valeurs du formulaire
  const firstName = document.getElementById('first_name').value;
  const lastName = document.getElementById('last_name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  // Créez une chaîne de caractères contenant toutes les informations
  const allInfo = `Prénom: ${firstName}, Nom: ${lastName}, Adresse électronique: ${email}, Message: ${message}`;
  
  // Affichez toutes les informations dans un seul console.log
  console.log(allInfo);
});


