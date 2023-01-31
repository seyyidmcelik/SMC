const titles = document.querySelectorAll(".title")

const callback = (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("fadeIn")
        } else {
            entry.target.classList.remove("fadeIn")
        }
    })
}

const options = {}

const myObserver = new IntersectionObserver(callback, options)

titles.forEach(function (title) {
    myObserver.observe(title)
})
