function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "block";
  noneAll.classList.add("none");
  keybordForm();
}

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
  noneAll.classList.remove("none");
  keyFunction();
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
    if (
      nameRegex.test(prenom) &&
      nameRegex.test(nom) &&
      emailRegex.test(email) === true &&
      message != ""
    ) {
      closeModal();
    }
    console.log(prenom);
    console.log(nom);
    console.log(email);
    console.log(message);
  });
}

function keybordForm() {
  let currentIndex = 0;
  let focusableArray;
  document.addEventListener("keydown", (event) => {
    const focusableElements = document.querySelectorAll(
      "h2.title_form,img.icon_close,button#btn_valid_form,input,textarea"
    );
    // Filtrer les éléments visibles (display: block)
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
        clickActiveContainer();
        break;
    }
    function navigate(direction) {
      focusableArray[currentIndex].classList.remove("activeOne");

      currentIndex += direction;
      currentIndex = Math.max(
        0,
        Math.min(currentIndex, focusableArray.length - 1)
      );

      focusableArray[currentIndex].classList.add("activeOne");
      focusableArray[currentIndex].focus();
      focusableArray[currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    function clickActiveContainer() {
      const elementToClick = focusableArray[currentIndex];
      if (elementToClick) {
        elementToClick.click();
      }
    }
  });
}

submite();
