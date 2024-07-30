import { photographerTemplate } from "../templates/photographer.js";

async function getPhotographers() {
  const response = await fetch("http://127.0.0.1:5500/data/photographers.json");
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des photographes");
  }
  const data = await response.json();
  const photographers = data.photographers;
  return photographers;
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  const photographers = await getPhotographers();
  displayData(photographers);
}

init();
