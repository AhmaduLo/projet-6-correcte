export function photographerTemplate(data) {
  const { name, portrait, country, city, tagline, price, id } = data;

  const picture = `assets/profil/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const img_div = document.createElement("div");
    img_div.tabIndex = 0;

    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", "Photo de" + " " + name);

    const h2 = document.createElement("h2");
    h2.tabIndex = 0;

    const h3 = document.createElement("h3");
    h3.tabIndex = 0;

    const para1 = document.createElement("p");
    para1.tabIndex = 0;

    const para2 = document.createElement("p");
    para2.tabIndex = 0;

    h2.textContent = name;
    h3.textContent = country + " , " + city;
    para1.textContent = tagline;
    para2.textContent = price + "£/jour";

    article.appendChild(img_div);
    img_div.appendChild(img);
    article.appendChild(h2);
    article.appendChild(h3);
    article.appendChild(para1);
    article.appendChild(para2);
    img_div.style.cursor = "pointer";

    const handleClick = () => {
      window.location.href = "photographer.html#" + id;
    };

    img_div.addEventListener("click", handleClick);
    img_div.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleClick(); // Activer avec Entrée
    });

    return article;
  }
  return { name, picture, country, city, tagline, price, id, getUserCardDOM };
}
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
