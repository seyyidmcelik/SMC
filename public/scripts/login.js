/* Login Authentication Start */
const loginform = document.getElementById('loginform')
const emailError = document.querySelector('#emailError')
const passwordError = document.querySelector('#password')

loginform.addEventListener("submit", async (e) => {
    e.preventDefault();

    emailError.textContent = "";
    passwordError.textContent = "";

    emailError.style.display = "none"
    passwordError.style.display = "none"

    const email = loginform.email.value
    const password = loginform.password.value
    try {
        const res = await fetch('users/login', {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" }
        })
        const data = await res.json();
        if (data.emailError || data.passwordError) {
            if (data.emailError) {
                emailError.textContent = data.emailError
                emailError.style.display = "block"
            }
            if (data.passwordError) {
                passwordError.textContent = data.passwordError
                passwordError.style.display = "block"
            }
        } else {
            if (data.to) {
                location.assign("/users/" + data.to)
            } else {
                location.assign("/users/dashboard")
            }
        }
    } catch (err) {
        console.log("ERR::", err)
    }
})
/* Login Authentication End */

/* Rest Password Modal Start */
let passowrdModal = document.getElementById('password-modal')
let closePass = document.getElementById('close-password')
let uploadPass = document.getElementById('forget-pass')
uploadPass.addEventListener('click', () => {
    passowrdModal.classList.add('active-modal')
    document.body.style.overflowY = 'hidden'
})
closePass.addEventListener('click', () => {
    passowrdModal.classList.remove('active-modal')
    document.body.style.overflowY = 'auto'
})
/* Rest Password Modal End */

/* Reset Passwort Mail Fetch Start */
let resetPassformMail = document.getElementById('editForm')
let forgottenEmail = document.getElementById('emailforpass')
let errorDiv = document.querySelector('#editForm .error')
let toast = document.getElementById('toast')
let toastContent = document.querySelector('.toast-content-container')
let submitBtn = document.getElementById('resetSubmitBtn')
resetPassformMail.onsubmit = async function (e) {
    e.preventDefault();
    try {
        let res = await fetch('users/resetpasswordemail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: forgottenEmail.value
            })
        })
        let result = await res.json();
        console.log(result)
        if (!result.success) {
            submitBtn.setAttribute('disabled', 'true')
            errorDiv.innerText = result.message
            errorDiv.style.display = 'block'
            toastContent.innerText = result.message
            toast.classList.add('active-toast', 'toast-danger')
            setTimeout(() => {
                toast.classList.remove('active-toast')
                submitBtn.removeAttribute('disabled')
            }, 5000);
            setTimeout(() => {
                toast.classList.remove('toast-danger')
            }, 5500);
        } else {
            submitBtn.setAttribute('disabled', 'true')
            errorDiv.style.display = 'none'
            console.log(result.message)
            toastContent.innerText = result.message
            toast.classList.add('active-toast', 'toast-success')
            setTimeout(() => {
                toast.classList.remove('active-toast')
                submitBtn.removeAttribute('disabled')
            }, 5000);
            setTimeout(() => {
                toast.classList.remove('toast-success')
            }, 5500);
        }
    } catch (error) {
        console.log({ error })
    }
}

/* Reset Password Mail Fetch End */
