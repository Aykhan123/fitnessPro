import React, { useState } from 'react';

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleUsername = (e) => {
        setUsername(e.target.value)
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

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

    const handleLogin = async () => {
        const response = await fetch('http://127.0.0.1:8000/log_in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':  getCsrfToken
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        if(response.ok){
            console.log('successfully logged in')
        }
    }









  return (
    <>
    <form action="">
            <input type="text" onChange={handleUsername} placeholder="enter username" />
            <input type="text" onChange={handlePassword} placeholder="enter password" />
            <button onClick={handleLogin}>Submit</button>
            
        </form>
    <div>
      <h2>Login Page</h2>
    </div>
    </>
  );
  
};

export default Login;