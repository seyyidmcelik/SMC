/* Profile Photo Full Screen Start */
let modal = document.getElementById('photo-modal')
let closeBtn = document.getElementById('close')
let fullScreens = document.querySelectorAll('.getfullScreen')
let photoModalImg = document.getElementById('photoModalImg')
fullScreens.forEach(function (fullScreen) {
    fullScreen.addEventListener('click', () => {
        photoModalImg.setAttribute('src', fullScreen.getAttribute('data-url'))
        photoModalImg.setAttribute('alt', fullScreen.getAttribute('data-name'))
        modal.classList.add('active-modal')
        document.body.style.overflowY = 'hidden'
    })
})
closeBtn.addEventListener('click', () => {
    modal.classList.remove('active-modal')
    document.body.style.overflowY = 'auto'
})
/* Profile Photo Full Screen End */