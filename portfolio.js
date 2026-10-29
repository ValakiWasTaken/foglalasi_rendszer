document.addEventListener("scroll", () => {
    const scrollUpButton = document.getElementById("scrollUp")
    if (window.scrollY > 0) {
        scrollUpButton.style.opacity = 1
    }
    else {
        scrollUpButton.style.opacity = 0
    }
})