/* Reset Password Fetch Start */
let resetPass = document.getElementById('resetPass')
let newpass = document.getElementById('newpass')
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
        console.log(result);
    } catch (error) {
        console.log(error)
    }
})
/* Reset Password Fetch End */