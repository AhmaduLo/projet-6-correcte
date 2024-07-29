const info_persso = document.querySelector(".info_persso");
const img = document.querySelector(".img");
const section = document.querySelector("section");
const like_priceTotal = document.querySelector(".like_priceTotal");
const likeIcons = document.getElementsByClassName("like");
const modalPhoto = document.querySelector(".modalPhoto");
const noneAll = document.querySelector(".noneAll");
const closeModule = document.getElementsByClassName("closeModule");
const imgcontainer = document.querySelector(".imgcontainer");
const chevronplus = document.getElementsByClassName("chevronplus");
const chevronmoins = document.getElementsByClassName("chevronmoins");
const containtTrie = document.querySelector(".containtTrie");
const chevron_ouvert = document.getElementsByClassName("chevron_ouvert");
const containerTrier = document.querySelector(".containerTrier");


// Récupération du fragment d'URL et de l'ID
var fragmentUrl = window.location.hash;
var idRecupere = fragmentUrl.slice(1);

// Déclaration de tableaux et variables pour stocker les likes et les photos
const ArrayLikes = [];
let somme = 0;
const ArrayPhotos = [];
let currentIndex = -1; // Déclaration de currentIndex pour la navigation
let focusableArray = []; // Déclaration de focusableArray pour la navigation
const ArrayTries = [{ name: "Populaire" }, { name: "Date" }, { name: "Titre" }];

// Fonction asynchrone pour récupérer les données des photographes
async function getPhotographers() {
  try {
    const response = await fetch(
      "http://127.0.0.1:5500/data/photographers.json"
    );
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des photographes");

    const data = await response.json();
    afficheProfil(data.photographers, data.media);
  } catch (error) {
    console.error(error);
  }
}

// Fonction pour afficher les profils et médias des photographes
function afficheProfil(profil, media) {
  profil.forEach((element) => {
    if (element.id == idRecupere) {
      displayProfileInfo(element); // Affiche les informations du profil
      const firstName = element.name.split(" ")[0];
      media.forEach((itemMedia) => {
        if (itemMedia.photographerId == element.id) {
          displayMedia(itemMedia, firstName); // Affiche les médias associés au profil
          totalLikes(itemMedia); // Calcule et affiche le total des likes
        }
      });
      setupEventListeners(); // Initialise les écouteurs d'événements
    }
  });
}

// Fonction pour afficher les informations du profil
function displayProfileInfo(element) {
  info_persso.innerHTML = `
        <h2>${element.name}</h2>
        <p>${element.country}, ${element.city}</p>
        <p>${element.tagline}</p>
    `;
  const picture = `assets/profil/${element.portrait}`;
  img.innerHTML = `<img src="${picture}" alt="profil photographe">`;
}

// Fonction pour afficher les médias
function displayMedia(itemMedia, firstName) {
  // Utilisation de la MediaFactory pour créer une instance de média (image ou vidéo)
  const instance = MediaFactory.createMedia(itemMedia, firstName);
  let mediaElement = instance.getMediaElement();
  section.innerHTML += `
        <div class="container" data-likes=${itemMedia.likes} data-date=${itemMedia.date}>
            ${mediaElement}
            <div class="name_like">
                <div class="h3"><h3 class="title">${instance.title}</h3></div>
                <div class="nmberIcon">
                    <p class="paraNumbIcon">${instance.likes}</p>
                    <span><ion-icon class="like" name="heart"></ion-icon></span>
                </div>
            </div>
        </div>
    `;
  ArrayLikes.push(itemMedia.likes);
  ArrayPhotos.push(instance.getMediaPath());
  addImageClickEventListeners(); // Ajout des écouteurs d'événements pour les images
}

// Classe abstraite Media
class Media {
  constructor(data, firstName) {
    this.likes = data.likes;
    this.id = data.id;
    this.photographerId = data.photographerId;
    this.title = data.title;
    this.price = data.price;
    this.firstName = firstName;
  }

  getMediaElement() {
    throw new Error("Cette méthode doit être implémentée par les sous-classes");
  }
}

// Sous-classe ImageMedia
class ImageMedia extends Media {
  constructor(data, firstName) {
    super(data, firstName);
    this.imagePath = `assets/albumPhoto/${firstName}/${data.image}`;
  }

  getMediaElement() {
    return `<div class="img_block"><img src="${this.imagePath}" class="imageDisplay" alt="${this.imagePath}"/></div>`;
  }

  getMediaPath() {
    return this.imagePath;
  }
}

// Sous-classe VideoMedia
class VideoMedia extends Media {
  constructor(data, firstName) {
    super(data, firstName);
    this.videoPath = `assets/albumPhoto/${firstName}/${data.video}`;
  }

  getMediaElement() {
    return `<div class="img_block">
              <video class="imageDisplay" style="cursor: pointer;" controls width="100%" height="100%">
                <source src="${this.videoPath}" alt="${this.videoPath}" type="video/mp4"/>
              </video>
            </div>`;
  }

  getMediaPath() {
    return this.videoPath;
  }
}

// Classe MediaFactory pour créer des objets Media
class MediaFactory {
  static createMedia(data, firstName) {
    if (data.image) {
      return new ImageMedia(data, firstName);
    } else if (data.video) {
      return new VideoMedia(data, firstName);
    } else {
      throw new Error("Type de média inconnu");
    }
  }
}

// Fonction pour gérer les likes
function nombreLike() {
  for (let i = 0; i < likeIcons.length; i++) {
    likeIcons[i].addEventListener("click", (e) => {
      const likeIcon = e.target;
      const likeCountElement = likeIcon.parentElement.parentElement.children[0];
      let likeCount = parseInt(likeCountElement.textContent);

      if (likeIcon.classList.contains("liked")) {
        likeCount--;
        likeIcon.classList.remove("liked");
        likeIcon.classList.remove("color");
        somme--;
      } else {
        likeCount++;
        likeIcon.classList.add("liked");
        likeIcon.classList.add("color");
        somme++;
      }

      likeCountElement.textContent = likeCount;
      updateTotalLikes(); // Met à jour le total des likes affiché
    });
  }
}

// Fonction pour mettre à jour le total des likes
function updateTotalLikes() {
  like_priceTotal.children[0].children[0].textContent = somme;
}

// Fonction pour calculer et afficher le total des likes
function totalLikes(itemMedia) {
  somme = ArrayLikes.reduce((acc, like) => acc + like, 0);
  like_priceTotal.innerHTML = `
        <div class="like_total">
            <p class="likeTotalPara">${somme}</p>
            <ion-icon name="heart"></ion-icon>
        </div>
        <div class="prise_jour">
            <div class="prise">${itemMedia.price}£/ jour</div>
        </div>
    `;
}

// Fonction pour vérifier si un fichier est une vidéo
function isVideo(fileName) {
  const videoExtensions = ["mp4", "avi", "mov"];
  return videoExtensions.includes(fileName.split(".").pop().toLowerCase());
}

// Fonction pour vérifier si un fichier est une image
function isImage(fileName) {
  const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  return imageExtensions.includes(fileName.split(".").pop().toLowerCase());
}

// Fonction pour gérer le slider des médias
function slider(currentIndex) {
  document.addEventListener("keydown", handleKeyDown);
  chevronplus[0].addEventListener("click", handleNext);
  chevronmoins[0].addEventListener("click", handlePrev);

  function handleKeyDown(event) {
    if (event.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % ArrayPhotos.length;
      updateSlider(currentIndex);
    } else if (event.key === "ArrowLeft") {
      currentIndex =
        (currentIndex - 1 + ArrayPhotos.length) % ArrayPhotos.length;
      updateSlider(currentIndex);
    } else if (event.key === "Escape") {
      closeModule();
      console.log("yesss");
    }
  }

  function handleNext() {
    currentIndex = (currentIndex + 1) % ArrayPhotos.length;
    updateSlider(currentIndex);
  }

  function handlePrev() {
    currentIndex = (currentIndex - 1 + ArrayPhotos.length) % ArrayPhotos.length;
    updateSlider(currentIndex);
  }

  function updateSlider(index) {
    const item = ArrayPhotos[index];
    if (!item) return; // Vérification si l'élément est défini

    imgcontainer.innerHTML = "";
    if (isImage(item)) {
      imgcontainer.innerHTML = `<img id="imgToSlide" src="${item}" alt="image">`;
    } else if (isVideo(item)) {
      imgcontainer.innerHTML = `<video class="imageDisplay" controls width="100%" height="100%">
                                    <source src="${item}" type="video/mp4">
                                  </video>`;
    }
  }

  // Fonction pour nettoyer les écouteurs d'événements
  function cleanup() {
    document.removeEventListener("keydown", handleKeyDown);
    chevronplus[0].removeEventListener("click", handleNext);
    chevronmoins[0].removeEventListener("click", handlePrev);
  }

  return cleanup; // Retourne la fonction de nettoyage
}

// Ajout des écouteurs d'événements pour les images
function addImageClickEventListeners() {
  const img_blocks = document.querySelectorAll(".img_block");
  img_blocks.forEach((img_block, index) => {
    img_block.addEventListener("click", () => {
      const item = ArrayPhotos[index];
      if (item) {
        openModal(item, index); // Ouvre le modal pour l'image sélectionnée
      }
    });
  });
}

// Fonction pour ouvrir le modal
function openModal(item, index) {
  if (!item) return; // Vérification si l'élément est défini
  imgcontainer.innerHTML = "";
  if (isImage(item)) {
    imgcontainer.innerHTML = `<img id="imgToSlide" src="${item}" alt="image">`;
  } else if (isVideo(item)) {
    imgcontainer.innerHTML = `<video class="imageDisplay" controls width="100%" height="100%">
                                <source src="${item}" type="video/mp4">
                              </video>`;
  }

  modalPhoto.classList.add("afficheModalPhoto");
  noneAll.classList.add("none");

  const cleanupSlider = slider(index);

  closeModule[0].addEventListener("click", () => {
    closeModal(cleanupSlider);
  });

  document.addEventListener("keydown", handleEscape);

  function handleEscape(event) {
    if (event.key === "Escape") {
      console.log("yes");
      closeModal(cleanupSlider);
    }
  }
  function closeModal(cleanupSlider) {
    imgcontainer.innerHTML = "";
    modalPhoto.classList.remove("afficheModalPhoto");
    noneAll.classList.remove("none");
    cleanupSlider();
    document.removeEventListener("keydown", handleEscape);
  }
}

// Fonction de tri des éléments
function trie() {
  ArrayTries.forEach((item) => {
    containerTrier.innerHTML += `<div class="elementTexteClique">${item.name}</div><span></span>`;
  });
  chevron_ouvert[0].addEventListener("click", () => {
    containtTrie.classList.toggle("afterclick");
    chevron_ouvert[0].classList.toggle("rotate");
  });

  addClickEventListeners(); // Ajout des écouteurs d'événements pour les éléments de tri
}

// Ajout des écouteurs d'événements pour les éléments de tri
function addClickEventListeners() {
  const elementTexteClique = document.querySelectorAll(".elementTexteClique");
  elementTexteClique.forEach((element, index) => {
    element.addEventListener("click", () => {
      handleItemClick(index);
    });
  });
}

// Fonction pour gérer le clic sur les éléments de tri
function handleItemClick(index) {
  const clickedItem = ArrayTries[index];
  ArrayTries[index] = ArrayTries[0];
  ArrayTries[0] = clickedItem;
  containerTrier.innerHTML = "";
  ArrayTries.forEach((item) => {
    containerTrier.innerHTML += `<div class="elementTexteClique">${item.name}</div><span></span>`;
  });

  let photos = Array.from(section.getElementsByClassName("container"));
  if (ArrayTries[0].name == "Populaire") {
    photos.sort(
      (a, b) =>
        parseInt(b.getAttribute("data-likes")) -
        parseInt(a.getAttribute("data-likes"))
    );
  } else if (ArrayTries[0].name == "Date") {
    photos.sort(
      (a, b) =>
        parseInt(b.getAttribute("data-date")) -
        parseInt(a.getAttribute("data-date"))
    );
  } else {
    photos.sort((a, b) =>
      a
        .querySelector(".title")
        .textContent.localeCompare(b.querySelector(".title").textContent)
    );
  }

  section.innerHTML = "";
  photos.forEach((photo) => section.appendChild(photo));
  addClickEventListeners();
}

// Fonction pour la navigation avec le clavier
function keyFunction() {
  document.addEventListener("keydown", (event) => {
    const focusableElements = document.querySelectorAll(
      "div.img, div.img_block, ion-icon.like,  ion-icon.chevron_ouvert, div.elementTexteClique, button#btnContact"
    );

    const visibleElements = Array.from(focusableElements).filter(
      (element) => window.getComputedStyle(element).display !== "none"
    );
    focusableArray = visibleElements;

    if (currentIndex === -1) {
      currentIndex = 0;
      focusableArray[currentIndex].classList.add("activeOne");
      focusableArray[currentIndex].focus();
    }

    switch (event.key) {
      case "ArrowLeft":
        navigate(-1);
        break;
      case "ArrowRight":
        navigate(1);
        break;
      case "ArrowUp":
        navigate(-5);
        break;
      case "ArrowDown":
        navigate(5);
        break;
      case "Enter":
        clickPhotos();
        break;
    }
  });
}

// Fonction pour naviguer entre les éléments avec le clavier
function navigate(direction) {
  focusableArray[currentIndex].classList.remove("activeOne");
  currentIndex += direction;
  currentIndex = Math.max(0, Math.min(currentIndex, focusableArray.length - 1));

  focusableArray[currentIndex].classList.add("activeOne");
  focusableArray[currentIndex].focus();
  focusableArray[currentIndex].scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

// Fonction pour cliquer sur les photos avec le clavier
function clickPhotos() {
  const elementToClick = focusableArray[currentIndex];
  if (elementToClick.children[0]) {
    elementToClick.children[0].click();
  }
}

// Initialisation des écouteurs d'événements
function setupEventListeners() {
  trie();
  nombreLike();
  keyFunction();
  addClickEventListeners();
  addImageClickEventListeners(); // Assurez-vous que les écouteurs d'événements pour les images sont initialisés
}

// Appel de la fonction pour récupérer les données des photographes
getPhotographers();
