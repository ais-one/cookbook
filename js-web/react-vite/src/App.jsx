import './App.css';

import { Routes, Route } from 'react-router-dom';

import LayoutPublic from './views/LayoutPublic';
import LayoutSecure from './views/LayoutSecure';

import Login from './views/public/Login';
import Home from './views/public/Home';

import Profile from './views/secure/Profile';
import Settings from './views/secure/Settings';

function App() {
  return (
    <Routes>
      <Route element={<LayoutPublic />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/dashboard" element={<LayoutSecure />}>
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
