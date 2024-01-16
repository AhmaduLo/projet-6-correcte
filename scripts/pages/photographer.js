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
const containt_all = document.getElementsByClassName("containt_all");
const imgToSlide = document.getElementsByClassName("imgToSlide");
const contact_modal = document.getElementById("contact_modal");
const containtTrie = document.querySelector(".containtTrie");
const chevron_ouvert = document.getElementsByClassName("chevron_ouvert");
const containerTrier = document.querySelector(".containerTrier");

// Récupérer le fragment d'URL (tout ce qui suit le dièse #)
var fragmentUrl = window.location.hash;
// Retirer le dièse (#) pour obtenir uniquement l'ID
var idRecupere = fragmentUrl.slice(1);
//-----nbre de likes a stocker------
let Thelikes;
const ArrayLikes = [];
let somme = 0;
const ArrayPhotos = [];
//---------------------appelle donner avec le fetch-----------------------------
async function getPhotographers() {
  const response = await fetch("http://127.0.0.1:5500/data/photographers.json");
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des photographes");
  }
  const data = await response.json();
  const profil = data.photographers;
  const media = data.media;
  afficheProfil(profil, media);
}

//------------------------affiche le photo profile et info------------------------------
function afficheProfil(profil, media) {
  profil.forEach((element) => {
    //----si id de mon json est egale a l'id recurer tu m'affiche c donner--------
    if (element.id == idRecupere) {
      info_persso.innerHTML += `
        <h2>${element.name}</h2>
        <p>${element.country},${element.city}</p>
          <p>${element.tagline}</p>
  `;
      const picture = `assets/profil/${element.portrait}`;
      img.innerHTML += ` <img src="${picture}" alt="profil photographe">`;
      //-------pour couper le prenom----
      var fullName = element.name;
      var firstName = fullName.split(" ")[0];
      //-------------afficher les realisation du photographe------------
      media.forEach((itemMedia) => {
        let imageElement = "";
        let videoElement = "";
        let picture = "";
        let video = "";

        //----si photographerId est egale a id du photographe tu m'affiche c'est realisation---
        if (itemMedia.photographerId == element.id) {
          if (itemMedia.image) {
            picture = `assets/albumPhoto/${firstName}/${itemMedia.image}`;
            imageElement = `
              <div class="img_block">
              <img src="${picture}" class="imageDisplay" alt="${itemMedia.image}" />
              </div>
              `;
            ArrayPhotos.push(itemMedia.image);
          } else if (itemMedia.video) {
            video = `assets/albumPhoto/${firstName}/${itemMedia.video}`;
            videoElement = `
            <div class="img_block">
              <video class="imageDisplay" style="cursor: pointer;" controls width="100%" height="100% id="videoPlayer">
              <source src="${video}"  alt="${itemMedia.video}" type="video/mp4" />
              </video>
              </div>
              `;
            ArrayPhotos.push(itemMedia.video);
          }

          //------------affichage des elements des photos-------------------
          section.innerHTML += `
            <div class="container" data-likes=${itemMedia.likes} data-date=${itemMedia.date}>
           
            ${imageElement}
            ${videoElement}
      
            <div class="name_like">
            <div class="h3">
            <h3 class="title">${itemMedia.title}</h3> 
            </div>
            <div class="nmberIcon">
            <p class="paraNumbIcon">${itemMedia.likes}</p>
            <span><ion-icon class="like" name="heart"></ion-icon></span>
            </div>
            </div>
            </div>
            `;
          ArrayLikes.push(itemMedia.likes);
          nombreLike(itemMedia);
        }
      });
      totalLikes();
      //-------------clique sur l'image et slide---------------------
      for (let i = 0; i < img_block.length; i++) {
        img_block[i].addEventListener("click", (e) => {
          ArrayPhotos.forEach((itemeArrayPhotos, index) => {
            const namePhoto =
              e.target.parentElement.parentElement.children[1].children[0]
                .children[0].textContent;
            //--faire apparaitre le module des photos pour le slide-----
            modalPhoto.classList.add("afficheModalPhoto");
            noneAll.classList.add("none");
            contact_modal.style.display = "none";

            //------condition pour siblier photo cliquer------
            if (e.target.nodeName == "VIDEO") {
              var url = e.target.children[0].src;
              var urlParts = url.split("/");
              var fileNameVideo = urlParts[urlParts.length - 1];
              if (itemeArrayPhotos == fileNameVideo) {
                const sourceVideo = `assets/albumPhoto/${firstName}/${itemeArrayPhotos}`;
                imgcontainer.innerHTML += `
                    <video class="imageDisplay" controls width="100%" height="100% id="videoPlayer">
                    <source src="${sourceVideo}"type="video/mp4" /></video>
                    <h3 class="ItemeTitle">${namePhoto}</h3>
                    `;
                slider(itemeArrayPhotos, firstName);
              }
            } else {
              if (itemeArrayPhotos == e.target.alt) {
                const sourceImg = `assets/albumPhoto/${firstName}/${itemeArrayPhotos}`;
                imgcontainer.innerHTML += `
              <img id="imgToSlide"  src="${sourceImg}" alt="${e.target.alt}">
              <h3 class="ItemeTitle">${namePhoto}</h3>
               `;
                slider(itemeArrayPhotos, firstName, index);
              }
            }
          });

          //--------------close module photo------------------
          closeModule[0].addEventListener("click", () => {
            imgcontainer.innerHTML = "";
            noneAll.classList.remove("none");
            modalPhoto.classList.remove("afficheModalPhoto");
            keybordForm();
          });
          document.addEventListener("keydown", (event) => {
            if (event.key == "Enter") {
              imgcontainer.innerHTML = "";
              noneAll.classList.remove("none");
              modalPhoto.classList.remove("afficheModalPhoto");
              keybordForm();
            }
          });
          contact_modal.style.display = "none";
        });
      }
    }
  });
}
//--------clique sur l'icon like-------------
function nombreLike() {
  for (let i = 0; i < likeIcons.length; i++) {
    likeIcons[i].addEventListener("click", (e) => {
      if (likeIcons[i].classList.contains("liked")) {
        e.target.parentElement.parentElement.children[0].textContent--;
        e.target.classList.remove("liked");
        e.target.classList.remove("color");
        somme--;
      } else {
        e.target.parentElement.parentElement.children[0].textContent++;
        e.target.classList.add("liked");
        e.target.classList.add("color");
        somme++;
      }
      like_priceTotal.children[0].children[0].textContent = somme;
    });
  }
}
nombreLike();
//--------function pour determiner les img et les video-----
function isVideo(fileName) {
  const videoExtensions = ["mp4", "avi", "mov"];
  const fileExtension = fileName.split(".").pop().toLowerCase();
  return videoExtensions.includes(fileExtension);
}

function isImage(fileName) {
  const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  const fileExtension = fileName.split(".").pop().toLowerCase();
  return imageExtensions.includes(fileExtension);
}

//-------function pour slider les photos----
function slider(itemeArrayPhotos, firstName, index) {
  let currentIndex = 0;
  currentIndex = index;
  //-------------slide avec les fleche clavier--------
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % ArrayPhotos.length;
      updateSlider(itemeArrayPhotos, firstName, currentIndex);
    } else if (event.key === "ArrowLeft") {
      currentIndex =
        (currentIndex - 1 + ArrayPhotos.length) % ArrayPhotos.length;
      updateSlider(itemeArrayPhotos, firstName, currentIndex);
    }
  });
  //-------------slide avec le cuseur--------
  chevronplus[0].addEventListener("click", (e) => {
    currentIndex = (currentIndex + 1) % ArrayPhotos.length;
    updateSlider(itemeArrayPhotos, firstName, currentIndex);
  });

  chevronmoins[0].addEventListener("click", (e) => {
    currentIndex = (currentIndex - 1 + ArrayPhotos.length) % ArrayPhotos.length;
    updateSlider(itemeArrayPhotos, firstName, currentIndex);
  });

  function updateSlider(itemeArrayPhotos, firstName, e) {
    itemeArrayPhotos = ArrayPhotos[currentIndex];
    const source = `assets/albumPhoto/${firstName}/${itemeArrayPhotos}`;
    var urlParts = source.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const fileNamePhoto = fileName.replace(/\.[^/.]+$/, "");
    imgcontainer.innerHTML = "";
    if (isImage(fileName)) {
      imgcontainer.innerHTML += `
    <div class="containt_all" style="display: block;">
    <img id="imgToSlide"  src="${source}" alt="${fileNamePhoto}">
    <h3 class="ItemeTitle">${fileNamePhoto}</h3>
    </div>
     `;
    } else if (isVideo(fileName)) {
      imgcontainer.innerHTML += `
    <div class="containt_all" style="display: block;">
    <video class="imageDisplay" controls width="100%" height="100% id="videoPlayer">
    <source src="${source}"type="video/mp4" /></video>
    <h3 class="ItemeTitle">${fileNamePhoto}</h3>
    </div>
     `;
    }
  }
}

//------------function triage----------------------
let ArrayTries = [];
function trie() {
  ArrayTries = [{ name: "Populaire" }, { name: "Date" }, { name: "Titre" }];
  ArrayTries.forEach((item) => {
    containerTrier.innerHTML += ` 
    <div class="elementTexteClique">${item.name} </div>
    <span></span>
    `;
  });
  chevron_ouvert[0].addEventListener("click", () => {
    containtTrie.classList.toggle("afterclick");
    chevron_ouvert[0].classList.toggle("rotate");
  });
}
trie();
//-----------echanger les element apres lique--------
//---------- Add click event listener to each element---populaire-----
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
  // Réinitialisez le contenu de containerTrier
  containerTrier.innerHTML = "";
  // Mise à jour du tableau ArrayTries
  const newArrayTries = ArrayTries.map((item) => ({ name: item.name }));
  ArrayTries = newArrayTries;
  // Affichez les éléments dans containerTrier
  ArrayTries.forEach((item) => {
    containerTrier.innerHTML += `
           <div class="elementTexteClique">${item.name}</div>
           <span></span>
       `;
  });
  addClickEventListeners();
  //--------------------------------------------------------
  let photos = Array.from(section.getElementsByClassName("container"));
  if (e.target.textContent == "Populaire") {
    // Triez les photos en fonction du nombre de likes
    photos.sort(function (a, b) {
      const likesA = parseInt(a.getAttribute("data-likes"));
      const likesB = parseInt(b.getAttribute("data-likes"));
      return likesB - likesA; // Triez de manière décroissante
    });
  } else if (e.target.textContent == "Date") {
    photos.sort(function (a, b) {
      const dateA = parseInt(a.getAttribute("data-date"));
      const dateB = parseInt(b.getAttribute("data-date"));
      return dateB - dateA; // Triez de manière décroissante
    });
  } else {
    photos.sort(function (a, b) {
      const titleA = a.querySelector(".title").textContent;
      const titleB = b.querySelector(".title").textContent;
      return titleA.localeCompare(titleB); // Triez de manière alphabétique
    });
  }
  // Supprimez toutes les photos du conteneur
  section.innerHTML = "";
  // Ajoutez les photos triées au conteneur
  photos.forEach(function (photo) {
    section.appendChild(photo);
    //-------liker----------
  });
}

function totalLikes() {
  for (let i = 0; i < ArrayLikes.length; i++) {
    somme += ArrayLikes[i];
  }
  like_priceTotal.innerHTML += `
  <div class="like_total">
      <p class="likeTotalPara">${somme}</p>
      <ion-icon name="heart"></ion-icon>
      </div>
      <div class="prise_jour">
        <div class="prise">15£/ jour</div>
      </div>
  `;
}

//------------se deplacer avec les fleche---------------------
let currentIndex = 0;
let focusableArray;
function keyFunction() {
  document.addEventListener("keydown", (event) => {
    const focusableElements = document.querySelectorAll(
      "div.img,div.img_block,ion-icon.like, h1, h2, h3, p,ion-icon.chevron_ouvert,div.elementTexteClique,button#btnContact"
    );

    // Filtrer les éléments visibles (display: block)
    const visibleElements = Array.from(focusableElements).filter(
      (element) => window.getComputedStyle(element).display !== "none"
    );
    //console.log(visibleElements);
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
        clickActivePhotos();
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

  //--------ouverture du triee-------------
  const currentElement = focusableArray[currentIndex];
  const classesList = Array.from(currentElement.classList);
}
function clickActivePhotos() {
  const elementToClick = focusableArray[currentIndex];
  if (elementToClick) {
    elementToClick.click();
  }}
function clickPhotos() {
  const elementToClick = focusableArray[currentIndex];
  if (elementToClick.children[0]) {
    elementToClick.children[0].click();
  }
}

keyFunction();
addClickEventListeners();
getPhotographers();
