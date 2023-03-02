/* Register Validation Start */
const form = document.querySelector('form')
const nameError = document.querySelector('#name')
const emailError = document.querySelector('#email')
const passwordError = document.querySelector('#password')

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    emailError.textContent = "";
    passwordError.textContent = "";
    nameError.textContent = "";

    emailError.style.display = "none"
    passwordError.style.display = "none"
    nameError.style.display = "none"

    const email = form.email.value
    const password = form.password.value
    const username = form.name.value
    try {
        const res = await fetch('users/register', {
            method: "POST",
            body: JSON.stringify({ username, email, password }),
            headers: { "Content-Type": "application/json" }
        })
        const data = await res.json();
        if (data) {
            if (data.email) {
                emailError.textContent = data.email
                emailError.style.display = "block"
            }
            if (data.password) {
                passwordError.textContent = data.password
                passwordError.style.display = "block"
            }
            if (data.username) {
                nameError.textContent = data.username
                nameError.style.display = "block"
            }
        }
        if (data.user) {
            location.assign("/login")
        }
    } catch (err) {
        console.log("ERR::", err)
    }
})
/* Register Validation End */