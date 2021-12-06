import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import Wrapper from '../../components/Wrapper'
import { Role } from '../../models/role'

const Roles = () => {
  const [roles, setRoles] = useState([])

  useEffect(() => {
    const getRoles = async () => {
      const { data } = await axios.get(`/role`)
      setRoles(data)
    }
    getRoles()
  }, [])

  const del = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await axios.delete(`/role/${id}`)
      setRoles(roles.filter((role :Role) => role.id !== id))
    }
  }

  return (
    <Wrapper>
      <div className="pt-3 pb-2 mb-3 border-bottom">
        <Link to={'/roles/create'} className="btn btn-sm btn-outline-secondary">Add</Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role: Role) => {
              return (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>{role.name}</td>
                  <td>
                    <div className="btn-group mr-2">
                      <Link to={`/roles/${role.id}/edit`} className="btn btn-sm btn-outline-secondary">Edit</Link>
                      <a href="#" className="btn btn-sm btn-outline-secondary" onClick={() => del(role.id)}>Delete</a>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Wrapper>
  )
}

export default Roles
