const userNameInput = document.querySelector(`#username`)
const emailInput = document.querySelector(`#email`)
const passwordInput = document.querySelector(`#password`)
const reenteredPwrdInput = document.querySelector(`#confirm-password`)

const createBtn = document.querySelector(`#createAcc`)
createBtn.addEventListener('click', async function(e) {
    e.preventDefault()
    
    const userName = userNameInput.value
    const email = emailInput.value
    const password = passwordInput.value
    const reenteredPwrd = reenteredPwrdInput.value
    
    //display error message in frontend
    if(password !== reenteredPwrd) {
        console.log(`Passwords must match`)
        return
    }

    const signUp = await fetch(`/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userName, email, password
        })
    })

    if(signUp.status === 201) {
        console.log(signUp)
        window.location.href = `/login`
    }
    else {
        console.log(`SignupFailed`)
    }
})