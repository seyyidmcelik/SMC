/* Profile Photo Upload Start */
let ppUpload = document.getElementById('ppUpload')
let ppUploadForm = document.getElementById('profilePhotoModal')
let ppCloseForm = document.getElementById('profilePhotoClose')

document.getElementById('pp').addEventListener('change', (e) => {
    //#ppPreview
    var url = URL.createObjectURL(e.target.files[0])
    var img = document.getElementById('ppPreview')
    img.setAttribute('src', url)
    img.setAttribute('height', 100)
    img.style.display = 'block'
})
if (ppUpload) {
    ppUpload.onclick = function () {
        ppUploadForm.classList.add('active-modal')
        document.body.style.overflowY = 'hidden'
    }
}
ppCloseForm.onclick = function () {
    ppUploadForm.classList.remove('active-modal')
    document.body.style.overflowY = 'auto'
}
/* Profile Photo Upload End */

/* Profile Photo Delete Start */
let deletePPModal = document.getElementById('photo-delete-modal')
let deletePPPhoto = document.getElementById('ppDelete')
if (deletePPPhoto) {
    deletePPPhoto.addEventListener('click', () => {
        document.body.style.overflowY = 'hidden'
        deletePPModal.classList.add('active-delete-modal')

        document.getElementById('delete-btn').onclick = function () {
            location.assign(deletePPPhoto.getAttribute('data-href'))
        }
        document.getElementById('cancel-btn').onclick = function () {
            deletePPModal.classList.remove('active-delete-modal')
            document.body.style.overflowY = 'auto'
        }
    })
}
/* Profile Photo Delete End */

/* Profile Photo Full Screen Start */
let ppFull = document.getElementById('ppFull')
let photoModal = document.getElementById('photo-modal')
let ppFullImg = document.getElementById('photoModalImg')
if (ppFull) {
    ppFull.onclick = function () {
        ppFullImg.setAttribute('src', ppFull.getAttribute('data-url'))
        ppFullImg.setAttribute('alt', ppFull.getAttribute('data-name'))
        photoModal.classList.add('active-modal')
        document.body.style.overflowY = 'hidden'
    }
}
/* Profile Photo Full Screen End */

/* Delete Photo Start */
let deleteModal = document.getElementById('photo-delete-modal')
let deletePhotos = document.querySelectorAll('.delete-photo')
deletePhotos.forEach(function (photo) {
    photo.addEventListener('click', () => {
        document.body.style.overflowY = 'hidden'
        deleteModal.classList.add('active-delete-modal')
        document.getElementById('delete-btn').onclick = function () {
            location.assign(photo.getAttribute('data-href'))
        }
        document.getElementById('cancel-btn').onclick = function () {
            deleteModal.classList.remove('active-delete-modal')
            document.body.style.overflowY = 'auto'
        }
    })
})
/* Delete Photo End */

/* Photo Full Screen Start */
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
/* Photo Full Screen End */

/* Photo File Upload Modal Start */
let formModal = document.getElementById('photo-modal-form')
let closeForm = document.getElementById('close-form')
let uploadBtn = document.getElementById('upload-btn')
uploadBtn.addEventListener('click', () => {
    formModal.classList.add('active-modal')
    document.body.style.overflowY = 'hidden'
})
closeForm.addEventListener('click', () => {
    formModal.classList.remove('active-modal')
    document.body.style.overflowY = 'auto'
})
/* Photo File Upload Modal End */

/* Photo File Upload Modal Start */
let photoEditModal = document.getElementById('photo-edit-modal')
let form = document.getElementById('editForm')
let closeEdit = document.getElementById('close-edit')
let editLinks = document.querySelectorAll('.edit')
let editId = document.getElementById('editId')
let editDesc = document.getElementById('editDesc')
let editTags = document.getElementById('editTags')
editLinks.forEach((edit) => {
    edit.addEventListener('click', () => {
        editId.setAttribute('value', edit.getAttribute('data-edit-photo-id'))
        editDesc.setAttribute('value', edit.getAttribute('data-edit-description'))
        editTags.setAttribute('value', edit.getAttribute('data-edit-tags').toString().replaceAll(',', ' '))
        photoEditModal.classList.add('active-modal')
        document.body.style.overflowY = 'hidden'
    })
})
closeEdit.addEventListener('click', () => {
    photoEditModal.classList.remove('active-modal')
    document.body.style.overflowY = 'auto'
})
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    try {
        let res = await fetch('/gallery/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    _id: editId.value,
                    description: editDesc.value,
                    tags: editTags.value.split(' '),

                }
            )
        })
        await res.json()
        location.assign('/users/dashboard')
    } catch (error) {
        console.log({ error });
    }
})
/* Photo File Upload Modal End */

/* Photo Modal Validator Start */
let myform = document.getElementById('photo-modal')
const tagInput = document.getElementById('tag');
const err = document.getElementById('err');
const submitBtn = document.querySelector('input[type="submit"]')
tagInput.addEventListener('blur', (e) => {
    let tags = e.target.value.trim().split(' ')
    if (tags.length > 5) {
        err.textContent = "Tag limit must be max 5"
        err.style.color = 'red'
        submitBtn.setAttribute('disabled', true)
        tagInput.setAttribute('value', '')
    } else {
        err.textContent = ""
        submitBtn.removeAttribute('disabled')
        tagInput.setAttribute('value', tags)
    }
})
/* Photo Modal Validator End */

/* Photo Preview before upload Start */
document.querySelector('input[type="file"]').addEventListener('change', (e) => {
    var url = URL.createObjectURL(e.target.files[0])
    var img = document.getElementById('photoPreview')
    img.setAttribute('src', url)
    img.setAttribute('height', 100)
    img.style.display = 'block'
})
/* Photo Preview before upload End */

/* Settings Modal Start */
const settingIcon = document.querySelector('nav #setting-icon')
const settingsModal = document.getElementById('settingsModal')

settingIcon.addEventListener('click', (e) => {
    e.stopPropagation()
    settingsModal.classList.toggle('settings-active')
})
window.addEventListener('click', (e) => {
    if (settingsModal.classList.contains('settings-active')) {
        settingsModal.classList.remove('settings-active')
    }
})
window.onkeydown = function (e) {
    if (e.keyCode == 27) {
        settingsModal.classList.remove('settings-active')
        document.getElementById('biographyModal').classList.remove('active-bio-modal')
    }
}
/* Settings Modal End */

/* Biography Modal Start */
let bioModal = document.getElementById('biographyModal')
let bioLink = document.querySelector('.settings-items a')
let bioClose = document.querySelector('.close-bio-modal')
bioLink.onclick = function (e) {
    e.stopPropagation()
    bioModal.classList.add('active-bio-modal')
}
bioClose.onclick = function () {
    if (bioModal.classList.contains('active-bio-modal')) {
        bioModal.classList.remove('active-bio-modal')
    }
}
/* Biography Modal End */

/* Password Modal Start */
let passwordModal = document.getElementById('passwordModal')
let passwordLink = document.querySelector('#settingsModal a:nth-child(2)')
let passwordClose = document.querySelector('.close-password-modal')
passwordLink.onclick = function (e) {
    e.stopPropagation()
    passwordModal.classList.add('active-modal')
}
passwordClose.onclick = function () {
    if (passwordModal.classList.contains('active-modal')) {
        passwordModal.classList.remove('active-modal')
    }
}
/* Password Modal End */

/* Password Fetch Start */
let passModal = document.getElementById('passwordModal')
let toast = document.getElementById('toast')
let passwordForm = document.querySelector('#passwordModal form')
let toastContent = document.querySelector('.toast-content-container')
let currentpass = document.getElementById('currentpass')
passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    try {
        let res = await fetch('/users/dashboard/pass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    currentpass: passwordForm.currentpass.value,
                    newpass: passwordForm.newpass.value
                }
            )
        })
        let result = await res.json()
        if (result.success) {
            currentpass.innerText = ''
            toastContent.innerText = result.message
            toast.classList.add('active-toast', 'toast-success')
            passModal.classList.remove('active-modal')
            passwordForm.currentpass.value = ''
            passwordForm.currentpass.focus()
            passwordForm.newpass.value = ''
            setTimeout(() => {
                toast.classList.remove('active-toast')
            }, 4000);
            setTimeout(() => {
                toast.classList.remove('toast-success')
            }, 6000);
        } else {
            currentpass.innerText = result.message
            toastContent.innerText = result.message
            passwordForm.currentpass.value = ''
            passwordForm.currentpass.focus()
            passwordForm.newpass.value = ''
            toast.classList.add('active-toast', 'toast-danger')
            setTimeout(() => {
                toast.classList.remove('active-toast')
            }, 4000);
            setTimeout(() => {
                toast.classList.remove('toast-danger')
            }, 6000);
        }
    } catch (error) {
        console.log({ error });
    }
})
/* Password Fetch End */

/* Delete Account Start */
let deleteAccountModal = document.getElementById('account-delete-modal')
let deleteLink = document.querySelector('div#settingsModal a:nth-child(3)')
if (deleteLink) {
    deleteLink.addEventListener('click', () => {
        document.body.style.overflowY = 'hidden'
        deleteAccountModal.classList.add('active-delete-modal')

        document.getElementById('delete-account-btn').onclick = function () {
            location.assign('/users/dashboard/del?_method=DELETE')
        }
        document.getElementById('cancel-account-btn').onclick = function () {
            deleteAccountModal.classList.remove('active-delete-modal')
            document.body.style.overflowY = 'auto'
        }
    })
}
/* Delete Account End */