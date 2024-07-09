const info_persso = document.querySelector(".info_persso");
const img = document.querySelector(".img");
const section = document.querySelector("section");
const like_priceTotal = document.querySelector(".like_priceTotal");
const likeIcons = document.getElementsByClassName("like");
const img_block = document.getElementsByClassName("img_block");
const modalPhoto = document.querySelector(".modalPhoto");
const noneAll = document.querySelector(".noneAll");
const closeModule = document.getElementsByClassName("closeModule");
const imgcontainer = document.querySelector(".imgcontainer");
const chevronplus = document.getElementsByClassName("chevronplus");
const chevronmoins = document.getElementsByClassName("chevronmoins");
const contact_modal = document.getElementById("contact_modal");
const containtTrie = document.querySelector(".containtTrie");
const chevron_ouvert = document.getElementsByClassName("chevron_ouvert");
const containerTrier = document.querySelector(".containerTrier");

var fragmentUrl = window.location.hash;
var idRecupere = fragmentUrl.slice(1);

const ArrayLikes = [];
let somme = 0;
const ArrayPhotos = [];
let currentIndex = -1; // Déclaration de currentIndex
let focusableArray = []; // Déclaration de focusableArray
const ArrayTries = [{ name: "Populaire" }, { name: "Date" }, { name: "Titre" }];

//---------Fetch des données des photographes--------------
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

//---------Affichage du profil--------------
function afficheProfil(profil, media) {
  profil.forEach((element) => {
    if (element.id == idRecupere) {
      displayProfileInfo(element);
      const firstName = element.name.split(" ")[0];
      media.forEach((itemMedia) => {
        if (itemMedia.photographerId == element.id) {
          displayMedia(itemMedia, firstName);
        }
      });
      setupEventListeners();
      totalLikes();
    }
  });
}

function displayProfileInfo(element) {
  info_persso.innerHTML = `
        <h2>${element.name}</h2>
        <p>${element.country}, ${element.city}</p>
        <p>${element.tagline}</p>
    `;
  const picture = `assets/profil/${element.portrait}`;
  img.innerHTML = `<img src="${picture}" alt="profil photographe">`;
}

function displayMedia(itemMedia, firstName) {
  const instance = new Realisation(itemMedia, firstName);
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

//---------Classe de réalisation--------------
class Realisation {
  constructor(data, firstName) {
    this.likes = data.likes;
    this.id = data.id;
    this.imagePath = data.image
      ? `assets/albumPhoto/${firstName}/${data.image}`
      : null;
    this.videoPath = data.video
      ? `assets/albumPhoto/${firstName}/${data.video}`
      : null;
    this.title = data.title;
    this.price = data.price;
  }

  getMediaElement() {
    if (this.imagePath) {
      return `<div class="img_block"><img src="${this.imagePath}" class="imageDisplay" alt="${this.imagePath}"/></div>`;
    } else if (this.videoPath) {
      return `<div class="img_block">
                        <video class="imageDisplay" style="cursor: pointer;" controls width="100%" height="100%">
                            <source src="${this.videoPath}" alt="${this.videoPath}" type="video/mp4"/>
                        </video>
                    </div>`;
    }
    return "";
  }

  getMediaPath() {
    return this.imagePath || this.videoPath;
  }
}

//------------Fonctions pour gérer les likes------------
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
      updateTotalLikes();
    });
  }
}

function updateTotalLikes() {
  like_priceTotal.children[0].children[0].textContent = somme;
}

function totalLikes() {
  somme = ArrayLikes.reduce((acc, like) => acc + like, 0);
  like_priceTotal.innerHTML = `
        <div class="like_total">
            <p class="likeTotalPara">${somme}</p>
            <ion-icon name="heart"></ion-icon>
        </div>
        <div class="prise_jour">
            <div class="prise">15£/ jour</div>
        </div>
    `;
}

//---------------Fonctions pour afficher les images et vidéos-------
function isVideo(fileName) {
  const videoExtensions = ["mp4", "avi", "mov"];
  return videoExtensions.includes(fileName.split(".").pop().toLowerCase());
}

function isImage(fileName) {
  const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  return imageExtensions.includes(fileName.split(".").pop().toLowerCase());
}

function slider(currentIndex) {
  document.addEventListener("keydown", handleKeyDown);
  chevronplus[0].addEventListener("click", handleNext);
  chevronmoins[0].addEventListener("click", handlePrev);

  function handleKeyDown(event) {
    if (event.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % ArrayPhotos.length;
      updateSlider(currentIndex);
    } else if (event.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + ArrayPhotos.length) % ArrayPhotos.length;
      updateSlider(currentIndex);
    } else if (event.key === "Escape") {
      closeModal();
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

    imgcontainer.innerHTML = '';
    if (isImage(item)) {
      imgcontainer.innerHTML = `<img id="imgToSlide" src="${item}" alt="image">`;
    } else if (isVideo(item)) {
      imgcontainer.innerHTML = `<video class="imageDisplay" controls width="100%" height="100%">
                                    <source src="${item}" type="video/mp4">
                                  </video>`;
    }
  }

  function cleanup() {
    document.removeEventListener("keydown", handleKeyDown);
    chevronplus[0].removeEventListener("click", handleNext);
    chevronmoins[0].removeEventListener("click", handlePrev);
  }

  return cleanup;
}

// Ajout de l'écouteur d'événements pour les images
function addImageClickEventListeners() {
  const img_blocks = document.querySelectorAll(".img_block");
  img_blocks.forEach((img_block, index) => {
    img_block.addEventListener("click", (e) => {
      const item = ArrayPhotos[index];
      if (item) {
        openModal(item, index);
      }
    });
  });
}

function openModal(item, index) {
  if (!item) return; // Vérification si l'élément est défini

  imgcontainer.innerHTML = '';
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
      closeModal(cleanupSlider);
    }
  }
}

function closeModal(cleanupSlider) {
  imgcontainer.innerHTML = '';
  modalPhoto.classList.remove("afficheModalPhoto");
  noneAll.classList.remove("none");
  cleanupSlider();
  document.removeEventListener("keydown", handleEscape);
}

//--------------Fonction de tri-----------
function trie() {
  ArrayTries.forEach((item) => {
    containerTrier.innerHTML += `<div class="elementTexteClique">${item.name}</div><span></span>`;
  });

  chevron_ouvert[0].addEventListener("click", () => {
    containtTrie.classList.toggle("afterclick");
    chevron_ouvert[0].classList.toggle("rotate");
  });

  addClickEventListeners();
}

function addClickEventListeners() {
  const elementTexteClique = document.querySelectorAll(".elementTexteClique");
  elementTexteClique.forEach((element, index) => {
    element.addEventListener("click", (e) => {
      handleItemClick(e, index);
    });
  });
}

function handleItemClick(e, index) {
  const clickedItem = ArrayTries[index];
  ArrayTries[index] = ArrayTries[0];
  ArrayTries[0] = clickedItem;
  containerTrier.innerHTML = "";
  ArrayTries.forEach((item) => {
    containerTrier.innerHTML += `<div class="elementTexteClique">${item.name}</div><span></span>`;
  });

  let photos = Array.from(section.getElementsByClassName("container"));
  if (e.target.textContent == "Populaire") {
    photos.sort(
      (a, b) =>
        parseInt(b.getAttribute("data-likes")) -
        parseInt(a.getAttribute("data-likes"))
    );
  } else if (e.target.textContent == "Date") {
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
  addImageClickEventListeners(); // Ajout des écouteurs d'événements pour les images après le tri
}

//------------Fonctions pour la navigation avec le clavier------------
function keyFunction() {
  document.addEventListener("keydown", (event) => {
    const focusableElements = document.querySelectorAll(
      "div.img, div.img_block, ion-icon.like, h1, h2, h3, p, ion-icon.chevron_ouvert, div.elementTexteClique, button#btnContact"
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

function clickPhotos() {
  const elementToClick = focusableArray[currentIndex];
  if (elementToClick.children[0]) {
    elementToClick.children[0].click();
  }
}

//-------Initialisation------------
function setupEventListeners() {
  trie();
  nombreLike();
  keyFunction();
  addClickEventListeners();
  addImageClickEventListeners(); // Assurez-vous que les écouteurs d'événements pour les images sont initialisés
}

getPhotographers();