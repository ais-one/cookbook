import React, { SyntheticEvent, useEffect, useState } from 'react'
import axios from 'axios'

import Wrapper from '../../components/Wrapper'
import { Navigate } from 'react-router-dom'
import { Permission } from '../../models/permission'

const RolesCreate = () => {
  const [name, setName] = useState('')
  const [permissions, setPermissions] = useState([])
  const [selected, setSelected] = useState([] as number []) // selected permissions
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    const getPermissions = async () => {
      const { data } = await axios.get(`/permission`)
      setPermissions(data)
    }
    getPermissions()

  }, [])

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault()
    await axios.post('/role', {
      name,
      permission: selected
    })
    setRedirect(true)
  }

  const check = (id: number) => {
    if (selected.some(s => s === id)) { // remove
      setSelected(selected.filter(s => s !== id))      
      return
    }
    setSelected([...selected, id]) // add
  }

  if (redirect) return <Navigate to="/roles" />
  return (
    <Wrapper>
      <form onSubmit={submit}>
        <div className="mb-3 mt-3 row">
          <label className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input className="form-control" onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

        <div className="mb-3 row">
          <label>Role</label>
          <label className="col-sm-2 col-form-label">Permissions</label>
          <div className="col-sm-10">
            {permissions.map((permission: Permission) => {
              return (
                <div className="form-check form-check-inline col-3" key={permission.id}>
                  <input className="form-check-input" type="checkbox" value={permission.id} onChange={() => check(permission.id)}/>
                  <label className="form-check-label">{permission.name}</label>
                </div>
              )
            })}
          </div>  
        </div>
        <button className="btn btn-outline-secondary">Save</button>
      </form>

    </Wrapper>
  )
}

export default RolesCreate
