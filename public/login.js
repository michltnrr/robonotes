const email = document.querySelector(`#email`)
const password = document.querySelector(`#password`)

const loginBtn = document.querySelector(`#login`)

loginBtn.addEventListener('click', async function() {
    const loginUser = await fetch(`/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    })

    if(loginUser.status !== 200) {
        console.log('Login error')
    }
    console.log(loginUser)
    window.location.href = `/`
})