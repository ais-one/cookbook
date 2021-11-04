import React, { SyntheticEvent, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

import '../Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault()
    const res = await axios.post('/auth/login', {
      email, password
    })
    console.log(res.data)
    setRedirect(true)
  }

  return (
    redirect ? <Navigate to={'/'} /> :
    <main className="form-signin">
      <form onSubmit={submit}>
        <h1 className="h3 mb-3 fw-normal">Please Sign In</h1>
        <input type="email" className="form-control" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="form-control" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
        <button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
      </form>
    </main>
  )
}

export default Login
