function photographerTemplate(data) {
	const { name, portrait, country, city, tagline, price, id } = data

	const picture = `assets/profil/${portrait}`

	function getUserCardDOM() {
		const article = document.createElement("article")
		const img_div = document.createElement("div")
		const img = document.createElement("img")
		img.setAttribute("src", picture)
		const h2 = document.createElement("h2")
		const h3 = document.createElement("h3")
		const para1 = document.createElement("p")
		const para2 = document.createElement("p")

		h2.textContent = name
		h3.textContent = country + " , " + city
		para1.textContent = tagline
		para2.textContent = price + "£/jour"

		article.appendChild(img_div)
		img_div.appendChild(img)
		article.appendChild(h2)
		article.appendChild(h3)
		article.appendChild(para1)
		article.appendChild(para2)
		img_div.style.cursor = "pointer"
		img_div.addEventListener("click", () => {
			window.location.href = "photographer.html#" + id
		})
		return article
	}
	return { name, picture, country, city, tagline, price, id, getUserCardDOM }
}
