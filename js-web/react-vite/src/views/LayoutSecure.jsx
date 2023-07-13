import { Navigate, Outlet, Link } from 'react-router-dom';
import useUserStore from '../store';

const LayoutSecure = () => {
  // const { user } = useAuth();
  const user = useUserStore((state) => state.user);
  const doLogout = useUserStore((state) => state.logoutUser);

  if (!user) return <Navigate to="/" />;

  return (
    <div>
      <h2>LayoutSecure</h2>
      <nav>
        <Link to="/dashboard/settings">Settings</Link>
        <Link to="/dashboard/profile">Profile</Link>
        <button onClick={doLogout}>Logout</button>
      </nav>
      <Outlet />
    </div>
  );
};
export default LayoutSecure;
