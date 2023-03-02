/* Reset Password Fetch Start */
let resetPass = document.getElementById('resetPass')
let newpass = document.getElementById('newpass')
let toast = document.getElementById('toast')
let toastContent = document.querySelector('.toast-content-container')
resetPass.addEventListener('submit', async (e) => {
    e.preventDefault()
    let loc = location.pathname.split('/')
    try {
        let res = await fetch('/users/resetpassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id: loc[loc.length - 1],
                newpass: newpass.value
            })
        })
        let result = await res.json()
        if (result.success) {
            toastContent.innerText = result.message
            toast.classList.add('active-toast', 'toast-success')
            setTimeout(() => {
                toast.classList.remove('active-toast')
            }, 4000);
            setTimeout(() => {
                toast.classList.remove('toast-success')
            }, 6000);
        } else {
            toastContent.innerText = result.error.errors.password.message
            toast.classList.add('active-toast', 'toast-danger')
            setTimeout(() => {
                toast.classList.remove('active-toast')
            }, 4000);
            setTimeout(() => {
                toast.classList.remove('toast-danger')
            }, 6000);
        }
        console.log(1, result);
    } catch (error) {
        console.log(error)
    }
})
/* Reset Password Fetch End */