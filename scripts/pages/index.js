async function getPhotographers() {
	const response = await fetch("http://127.0.0.1:5500/data/photographers.json")
	if (!response.ok) {
		throw new Error("Erreur lors de la récupération des photographes")
	}
	const data = await response.json()
	const photographers = data.photographers
	return photographers
}

async function displayData(photographers) {
	const photographersSection = document.querySelector(".photographer_section")

	photographers.forEach((photographer) => {
		const photographerModel = photographerTemplate(photographer)
		const userCardDOM = photographerModel.getUserCardDOM()
		photographersSection.appendChild(userCardDOM)
	})
}

async function init() {
	const photographers = await getPhotographers()
	displayData(photographers)
}

init()

function keyBoxfunc() {
	let currentIndex = 0
	document.addEventListener("keydown", (event) => {
		const focusableElements = document.querySelectorAll("div,img, h1, h2, h3, p")
		const focusableArray = Array.from(focusableElements)
  
		if (currentIndex === -1) {
			currentIndex = 0 // Définit sur le premier élément si currentIndex est -1
			focusableArray[currentIndex].classList.add("active")
			focusableArray[currentIndex].focus()
		}
  
		switch (event.key) {
		case "ArrowLeft":
			navigate(-1)
			break
		case "ArrowRight":
			navigate(1)
			break
		case "ArrowUp":
			navigate(-5)
			break
		case "ArrowDown":
			navigate(5)
			break
		case "Enter":
			clickElement()
			break
		}
  
		function navigate(direction) {
			// Supprime la classe 'active' de l'élément actuellement sélectionné
			focusableArray[currentIndex].classList.remove("activeOne")
  
			currentIndex += direction
			currentIndex = Math.max(
				0,
				Math.min(currentIndex, focusableArray.length - 1)
			)
  
			// Ajoute la classe 'active' à l'élément actuellement sélectionné
			focusableArray[currentIndex].classList.add("activeOne")
  
			// Donne le focus à l'élément actuellement sélectionné
			focusableArray[currentIndex].focus()
		}
		function clickElement() {
			// Simuler un clic sur l'élément actuellement focalisé
			const elementToClick = focusableArray[currentIndex]
			if (elementToClick) {
				elementToClick.click()
			}
		}
	})
}
keyBoxfunc()
