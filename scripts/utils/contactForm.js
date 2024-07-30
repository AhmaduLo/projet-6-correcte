function displayModal() {
  const noneAll = document.querySelector(".noneAll");
  const modal = document.getElementById("contact_modal");
  modal.style.display = "block";
  noneAll.classList.add("none");

  // Ajouter un écouteur d'événements pour la touche Échap
  document.addEventListener("keydown", handleEscapeKey);
}
// console.log(displayModal());
function closeModal() {
  const noneAll = document.querySelector(".noneAll");
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
  noneAll.classList.remove("none");

  document.removeEventListener("keydown", handleEscapeKey);
}

// Fonction pour gérer la touche Échap
function handleEscapeKey(event) {
  if (event.key === "Escape") {
    closeModal();
  }
}
const myForm = document.querySelector(".myForm");

function submite() {
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const prenom = document.getElementById("Prenom").value;
    const nom = document.getElementById("Nom").value;
    const email = document.getElementById("Email").value;
    const message = document.getElementById("Message").value;

    // Example regex for name (allow only letters and spaces)
    const nameRegex = /^[a-zA-Z\s]+$/;
    // Example regex for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nameRegex.test(prenom)) {
      alert("Veuillez entrer un prénom valide.");
      return false;
    }
    if (!nameRegex.test(nom)) {
      alert("Veuillez entrer un nom valide.");
      return false;
    }

    if (!emailRegex.test(email)) {
      alert("Veuillez entrer une adresse email valide.");
      return false;
    }
    if (
      nameRegex.test(prenom) &&
      nameRegex.test(nom) &&
      emailRegex.test(email) === true &&
      message !== ""
    ) {
      closeModal();
    }
    console.log(prenom);
    console.log(nom);
    console.log(email);
    console.log(message);
  });
}

submite();
