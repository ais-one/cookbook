import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import Wrapper from '../../components/Wrapper'
import { User } from '../../models/user'
import Paginator from '../../components/Paginator'

const Users = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(0)

  useEffect(() => {
    const getUsers = async () => {
      const { data } = await axios.get(`/user?page=${page}`)
      setUsers(data.data)
      setLastPage(data.meta.last_page)
      // setUser(new User(
      //   data.id, data.first_name, data.last_name, data.email
      // ))
      // cannot do setUser(data), as there is function in the User class
    }
    getUsers()
  }, [page])

  const del = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await axios.delete(`/user/${id}`)
      setUsers(users.filter((user :User) => user.id !== id))
    }
  }

  return (
    <Wrapper>
      <div className="pt-3 pb-2 mb-3 border-bottom">
        <Link to={'/users/create'} className="btn btn-sm btn-outline-secondary">Add</Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => {
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{user.email}</td>
                  <td>{user.role.name}</td>
                  <td>
                    <div className="btn-group mr-2">
                      <Link to={`/users/${user.id}/edit`} className="btn btn-sm btn-outline-secondary">Edit</Link>
                      <a href="#" className="btn btn-sm btn-outline-secondary" onClick={() => del(user.id)}>Delete</a>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Paginator page={page} lastPage={lastPage} pageChanged={setPage} />
    </Wrapper>
  )
}

export default Users
