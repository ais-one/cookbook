import { Navigate, Outlet } from 'react-router-dom';

const LayoutPublic = () => {
  // const { user } = useAuth();
  // if (!user) return <Navigate to="/" />;

  return (
    <div>
      <h2>LayoutPublic</h2>
      <Outlet />
    </div>
  );
};

export default LayoutPublic;
