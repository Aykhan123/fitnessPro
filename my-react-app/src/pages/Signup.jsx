import { useState, useEffect } from "react"

const Signup = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    // const [currentUser, setCurrentUser] = useState()`




    const handleUsername = (e) => {
        setUsername(e.target.value)
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }
    // console.log(username)
    // console.log(password)

    let csrfToken = null
    const getCsrfToken = async () => {
      const request = await fetch('http://127.0.0.1:8000/csrftoken/', {
        method: 'GET',
        credentials: 'include',
      })
      let result = await request.json()
      csrfToken = result.csrf
      return csrfToken
    }

    const handleMakeUser = async () => {
        const result = await fetch('http://127.0.0.1:8000/sign_up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
    }
 





    return(
        <>

        <form action="">
            <input type="text" onChange={handleUsername} placeholder="enter username" />
            <input type="text" onChange={handlePassword} placeholder="enter password" />
            <button onClick={handleMakeUser}>Submit</button>
            
        </form>
        <h1>THIS IS THE SIGN UP PAGE</h1>



        </>
    )
}

export default Signup