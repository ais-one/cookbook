import React, { SyntheticEvent, useState } from 'react'
import { Navigate } from 'react-router-dom'
// import axios from 'axios'

import '../Login.css'

const Register = () => {
  let first_name = ''
  let last_name = ''
  let email = ''
  let password = ''
  let password_confirm = ''

  const [redirect, setRedirect] = useState(false)

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault()
    console.log(first_name, last_name, email, password, password_confirm)
    // const res = await axios.post('/auth/register', {
    //   first_name, last_name, email, password, password_confirm
    // })
    // console.log(res.data)
    setRedirect(true)
  }

  return (
    redirect ? <Navigate to={'/login'} /> :
    <main className="form-signin">
      <form onSubmit={submit}>
        <h1 className="h3 mb-3 fw-normal">Please Register</h1>
        <input className="form-control" placeholder="First Name" required />
        <input className="form-control" placeholder="Last Name" required />
        <input type="email" className="form-control" placeholder="Email" required />
        <input type="password" className="form-control" placeholder="Password" required />
        <input type="password" className="form-control" placeholder="Password Confirm" required />
        <button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
      </form>
    </main>
  )
}

export default Register
