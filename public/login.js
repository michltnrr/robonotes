const emailInput = document.querySelector(`#email`)
const passwordInput = document.querySelector(`#password`)

const loginBtn = document.querySelector(`#login`)

loginBtn.addEventListener('click', async function(e) {
    e.preventDefault()
    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()
    
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
    console.log(`Email : ${email}, Password: ${password}`)
    if(loginUser.status !== 200) {
        console.log('Login error')
    }
    const res = await loginUser.json()
    localStorage.setItem('token', res.token)
    
    console.log(loginUser)
    window.location.href = `/addcourse`
})