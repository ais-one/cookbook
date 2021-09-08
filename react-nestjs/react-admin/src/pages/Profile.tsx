import axios from 'axios'
import React, { Dispatch, SyntheticEvent, useEffect, useState } from 'react'
import { connect } from 'react-redux'

import Wrapper from '../components/Wrapper'
import { User } from '../models/user'
import { setUser } from '../redux/actions/setUserAction' 

const Profile = (props: { user: User, setUser: (user: User) => void }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  useEffect(() => {
    setFirstName(props.user.first_name)
    setLastName(props.user.last_name)
    setEmail(props.user.email)
  }, [props.user])

  const infoSubmit = async (e: SyntheticEvent) => {  
    e.preventDefault()
    const {data} = await axios.put('/user/info', {
      first_name: firstName,
      last_name: lastName,
      email,
    })
    props.setUser(new User( // redux action
      data.id, data.first_name, data.last_name, data.email, data.role
    ))
  }

  const passwordSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    await axios.put('/user/password', {
      password,
      password_confirm: passwordConfirm,
    })
  }

  return (
    <Wrapper>
    <h3>Account Information</h3>
    <form onSubmit={infoSubmit}>
        <div className="mb-3">
            <label>First Name</label>
            <input className="form-control"
                   defaultValue={firstName}
                   onChange={e => setFirstName(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <label>Last Name</label>
            <input className="form-control"
                   defaultValue={lastName}
                   onChange={e => setLastName(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <label>Email</label>
            <input className="form-control"
                   defaultValue={email}
                   onChange={e => setEmail(e.target.value)}
            />
        </div>

        <button className="btn btn-outline-secondary">Save</button>
    </form>

    <h3 className="mt-4">Change Password</h3>
    <form onSubmit={passwordSubmit}>
        <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control"
                   onChange={e => setPassword(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <label>Password Confirm</label>
            <input type="password" className="form-control"
                   onChange={e => setPasswordConfirm(e.target.value)}
            />
        </div>

        <button className="btn btn-outline-secondary">Save</button>
    </form>
    </Wrapper>
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
