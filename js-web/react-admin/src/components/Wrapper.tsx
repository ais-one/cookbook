import React, { Dispatch, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Nav from './Nav'
import Menu from './Menu'
import axios from 'axios'
import { connect } from 'react-redux'
import { User } from '../models/user'
import { setUser } from '../redux/actions/setUserAction'

const Wrapper = (props: any) => {
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      try {
        const {data} = await axios.get('/auth/user')
        props.setUser(new User( // redux action
          data.id, data.first_name, data.last_name, data.email, data.role
        ))
  
      } catch(e) {
        setRedirect(true)
      }
    }
    getUser()
  }, [])

  if (redirect) return <Navigate to='/login' />
  return (
    <>
      <Nav />
      <div className="container-fluid">
        <div className="row">
          <Menu />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {props.children}
          </main>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = (state: {user: User}) => { // get events from other componets user
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => { // send events from this component to other components
  return {
    setUser: (user: User) => dispatch(setUser(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)
