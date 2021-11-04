import React, { SyntheticEvent, useEffect, useState } from 'react'
import axios from 'axios'

import Wrapper from '../../components/Wrapper'
import { Role } from '../../models/role'
import { Navigate } from 'react-router-dom'

const UsersEdit = (props: any) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState('')
  const [roles, setRoles] = useState([])
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    const getRoles = async () => {
      const res = await axios.get(`/role`)
      setRoles(res.data)

      const {data} = await axios.get(`/user/${props.match.params.id}`)
      setFirstName(data.first_name)
      setLastName(data.last_name)
      setEmail(data.email)
      setRoleId(data.role.id)
    }
    getRoles()

  }, [])

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault()
    await axios.put(`/user/${props.match.params.id}`, {
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
          <input className="form-control" defaultValue={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Last Name</label>
          <input className="form-control" defaultValue={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Email Name</label>
          <input className="form-control" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select className="form-control" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
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

export default UsersEdit
