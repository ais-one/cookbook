import React from 'react'
import { NavLink } from 'react-router-dom'
const Menu = () => {
  return (
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink to={'/'} end className="nav-link" aria-current="page">
              <span data-feather="dashboard"></span>
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={'/users'} className="nav-link" aria-current="page">
              <span data-feather="users"></span>
              Users
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={'/roles'} className="nav-link" aria-current="page">
              <span data-feather="roles"></span>
              Roles
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={'/products'} className="nav-link" aria-current="page">
              <span data-feather="products"></span>
              Products
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={'/orders'} className="nav-link" aria-current="page">
              <span data-feather="orders"></span>
              Orders
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Menu
