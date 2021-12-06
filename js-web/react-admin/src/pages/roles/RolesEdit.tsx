import React, { SyntheticEvent, useEffect, useState } from 'react'
import axios from 'axios'

import Wrapper from '../../components/Wrapper'
import { Navigate } from 'react-router-dom'
import { Permission } from '../../models/permission'

const RolesEdit = (props: any) => {
  const [name, setName] = useState('')
  const [permissions, setPermissions] = useState([])
  const [selected, setSelected] = useState([] as number []) // selected permissions
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    const getPermissions = async () => {
      const res = await axios.get(`/permission`)
      setPermissions(res.data)

      const {data} = await axios.get(`/role/${props.match.params.id}`)
      setName(data.name)
      setSelected(data.permission.map((p: Permission) => p.id))

    }
    getPermissions()

  }, [])

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault()
    await axios.put(`/role/${props.match.params.id}`, {
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
            <input className="form-control" defaultValue={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Permissions</label>
          <div className="col-sm-10">
            {permissions.map((permission: Permission) => {
              return (
                <div className="form-check form-check-inline col-3" key={permission.id}>
                  <input className="form-check-input"
                    type="checkbox"
                    value={permission.id}
                    checked={selected.some(s => s === permission.id)}
                    onChange={() => check(permission.id)}
                  />
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

export default RolesEdit
