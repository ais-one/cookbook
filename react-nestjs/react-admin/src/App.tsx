import React from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Login from './pages/Login'
import Users from './pages/users/Users'
import UsersCreate from './pages/users/UsersCreate'
import UsersEdit from './pages/users/UsersEdit';
import Roles from './pages/roles/Roles';
import RolesCreate from './pages/roles/RolesCreate';
import RolesEdit from './pages/roles/RolesEdit';
import Products from './pages/products/Products';
import ProductsCreate from './pages/products/ProductsCreate';
import ProductsEdit from './pages/products/ProductsEdit';
import Orders from './pages/orders/Orders';
import Profile from './pages/Profile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route path={'/'} exact component={Dashboard} />
        <Route path={'/register'} component={Register} />
        <Route path={'/login'} component={Login} />
        <Route path={'/users'} exact component={Users} />
        <Route path={'/users/create'} component={UsersCreate} />
        <Route path={'/users/:id/edit'} component={UsersEdit} />
        <Route path={'/roles'} exact component={Roles} />
        <Route path={'/roles/create'} component={RolesCreate} />
        <Route path={'/roles/:id/edit'} component={RolesEdit} />
        <Route path={'/products'} exact component={Products} />
        <Route path={'/products/create'} component={ProductsCreate} />
        <Route path={'/products/:id/edit'} component={ProductsEdit} />
        <Route path={'/orders'} exact component={Orders} />
        <Route path={'/profile'} exact component={Profile} />
     </BrowserRouter>
    </div>
  );
}

export default App;
