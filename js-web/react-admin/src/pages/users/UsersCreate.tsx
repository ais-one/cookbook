import React, { SyntheticEvent, useEffect, useState } from 'react'
import axios from 'axios'

import Wrapper from '../../components/Wrapper'
import { Role } from '../../models/role'
import { Navigate } from 'react-router-dom'

const UsersCreate = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState('')
  const [roles, setRoles] = useState([])
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    const getRoles = async () => {
      const { data } = await axios.get(`/role`)
      setRoles(data)
    }
    getRoles()

  }, [])

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault()
    await axios.post('/user', {
      first_name: firstName,
      last_name: lastName,
      email,
      role_id: roleId
    })
    setRedirect(true)
  }

  if (redirect) return <Navigate to="/users" />
  return (
    <Wrapper>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>First Name</label>
          <input className="form-control" onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Last Name</label>
          <input className="form-control" onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Email Name</label>
          <input className="form-control" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select className="form-control" onChange={(e) => setRoleId(e.target.value)}>
            {roles.map((role: Role) => {
              return (
                <option key={role.id} value={role.id}>{role.name}</option>
              )
            })}
          </select>
        </div>
        <button className="btn btn-outline-secondary">Save</button>
      </form>

    </Wrapper>
  )
}

export default UsersCreate
