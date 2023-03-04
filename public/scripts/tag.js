
/* Tags Controle for Mobile Start */
let tagContainer = document.querySelector('.top-tags')
let arrow = document.querySelector('.arrow')
tagContainer.addEventListener('click', () => {
    tagContainer.classList.toggle('mobile-tags')
    arrow.classList.toggle('active-arrow')
})
/* Tags Controle for Mobile End */