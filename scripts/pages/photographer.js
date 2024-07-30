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
    console.log("erreur");
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
        <h1 tabindex="0">${element.name}</h1>
        <p tabindex="0">${element.country}, ${element.city}</p>
        <p tabindex="0">${element.tagline}</p>
    `;
  const picture = `assets/profil/${element.portrait}`;
  img.innerHTML = `<img src="${picture}" alt="profil de ${element.name}" tabindex="0">`;
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
                <div class="h3"><h3 class="title" tabindex="0">${instance.title}</h3></div>
                <div class="nmberIcon">
                    <p class="paraNumbIcon" tabindex="0">${instance.likes}</p>
                    <span><ion-icon class="like" name="heart" tabindex="0"></ion-icon></span>
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
    return `<div class="img_block" tabindex="0"><img src="${this.imagePath}" class="imageDisplay" alt="${this.title}"/></div>`;
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
              <video class="imageDisplay" style="cursor: pointer;" controls width="100%" height="100%" tabindex="0">
                <source src="${this.videoPath}" alt="${this.title}" type="video/mp4"/>
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
    // Gestion des likes avec la touche Entrée
    likeIcons[i].addEventListener("keydown", (e) => {
      if (e.key === "Enter") likeIcons[i].click();
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
    img_block.addEventListener("keydown", (e) => {
      if (e.key === "Enter") img_block.click();
    });
    // Gestionnaire d'événements pour les écrans tactiles (si nécessaire)
    img_block.addEventListener("touchstart", () => {
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
    containerTrier.innerHTML += `<div class="elementTexteClique" tabindex="0">${item.name}</div><span></span>`;
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

    // Ajouter un gestionnaire pour la touche Enter
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleItemClick(index);
      }
    });

    // Ajouter tabindex pour rendre l'élément focusable
    element.setAttribute("tabindex", "0");
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

// Initialisation des écouteurs d'événements
function setupEventListeners() {
  trie();
  nombreLike();
  addClickEventListeners();
  addImageClickEventListeners(); // Assurez-vous que les écouteurs d'événements pour les images sont initialisés
}

// Appel de la fonction pour récupérer les données des photographes
getPhotographers();

//---------scroll du page avec les fleche-----
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault(); // Empêche le comportement par défaut de changement de focus

    // Défilement personnalisé
    const scrollAmount = 100; // Ajustez la valeur pour contrôler la vitesse de défilement
    if (event.key === "ArrowUp") {
      window.scrollBy({
        top: -scrollAmount, // Défilement vers le haut
        left: 0,
        behavior: "smooth", // Défilement en douceur
      });
    } else if (event.key === "ArrowDown") {
      window.scrollBy({
        top: scrollAmount, // Défilement vers le bas
        left: 0,
        behavior: "smooth", // Défilement en douceur
      });
    }
  }
});
