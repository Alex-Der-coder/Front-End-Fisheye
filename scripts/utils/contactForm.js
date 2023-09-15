function displayModal() {
    const main = document.getElementById("main");
    const header = document.querySelector("header");
  
    // Enregistrez l'état précédent de main et header
    main.setAttribute("data-prev-display", main.style.display);
    header.setAttribute("data-prev-opacity", header.style.opacity);
  
    // Mettez à jour les styles de main et header pour la modal
    main.style.display = "none";
    header.style.opacity = 0;
  
    // Affichez la modal
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
  }
  
  function closeModal() {
    // Restaurez l'état précédent de main et header
    const main = document.getElementById("main");
    const header = document.querySelector("header");
  
    main.style.display = main.getAttribute("data-prev-display") || "block";
    header.style.opacity = header.getAttribute("data-prev-opacity") || 1;
  
    // Fermez la modal
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
  }
  

