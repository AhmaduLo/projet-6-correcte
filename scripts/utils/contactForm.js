function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "block";
  noneAll.classList.add("none");
}

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
  noneAll.classList.remove("none");
}
const myForm = document.querySelector(".myForm");
const inputs = document.querySelectorAll("input");

function submite() {
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const prenom = document.getElementById("prenom").value;
    const nom = document.getElementById("nom").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

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
    console.log(prenom);
    console.log(nom);
    console.log(email);
    console.log(message);
  });
}
submite();
