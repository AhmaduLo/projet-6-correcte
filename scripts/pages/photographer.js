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

          nombreLike(itemMedia);
        }
      });
      //-------------clique sur l'image et slide---------------------
      for (let i = 0; i < img_block.length; i++) {
        img_block[i].addEventListener("click", (e) => {
          ArrayPhotos.forEach((itemeArrayPhotos) => {
            const namePhoto =
              e.target.parentElement.parentElement.children[1].children[0]
                .children[0].textContent;
            //--faire apparaitre le module des photos pour le slide-----
            modalPhoto.classList.add("afficheModalPhoto");
            noneAll.classList.add("none");
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
                slider(itemeArrayPhotos, firstName);
              }
            }
          });

          //--------------close module photo------------------
          closeModule[0].addEventListener("click", () => {
            imgcontainer.innerHTML = "";
            noneAll.classList.remove("none");
            modalPhoto.classList.remove("afficheModalPhoto");
          });
        });
      }
    }
  });
}
//--------clique sur l'icon like-------------
function nombreLike(itemMedia) {
  for (let i = 0; i < likeIcons.length; i++) {
    likeIcons[i].addEventListener("click", (e) => {
      if (likeIcons[i].classList.contains("liked")) {
        //console.log(e.target.parentElement.children[0]);
        e.target.parentElement.parentElement.children[0].textContent--;
        likeIcons[i].classList.remove("liked");
        likeIcons[i].classList.remove("color");
      } else {
        e.target.parentElement.parentElement.children[0].textContent++;
        likeIcons[i].classList.add("liked");
        likeIcons[i].classList.add("color");
      }
    });
  }
}
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
function slider(itemeArrayPhotos, firstName) {
  let currentIndex = 0;

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

getPhotographers();
