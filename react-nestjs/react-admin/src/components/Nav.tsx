import React from 'react'
// import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'

import { User } from '../models/user'

const Nav = (props: { user: User }) => {
  // use Redux instead
  // const [user, setUser] = useState(new User())
  // useEffect(() => {
  //   const getUser = async () => {
  //     const { data } = await axios.get('/auth/user')
  //     setUser(new User(
  //       data.id, data.first_name, data.last_name, data.email
  //     ))
  //     // cannot do setUser(data), as there is function in the User class
  //   }
  //   getUser()
  // }, [])

  const logout = async () => {
    await axios.post('/auth/logout', {})
  }

  return (
    <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">Company name</a>
    <button className="navbar-toggler position-absolute d-md-none collapsed" type="button"
      data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu"
      aria-expanded="false" aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" />
    <div className="navbar-nav">
      <div className="nav-item text-nowrap">
        <Link to="/profile" className="nav-link px-3">{props.user.name}</Link>
      </div>
      <div className="nav-item text-nowrap">
        <Link to="/login" className="nav-link px-3" onClick={logout}>Sign out</Link>
      </div>
    </div>
    </header>
  )
}

const mapStateToProps = (state: {user: User}) => { // get events from other componets user
  return {
    user: state.user
  }
}

// const mapDispatchToProps = null // send events from this component to other components

export default connect(mapStateToProps)(Nav)
