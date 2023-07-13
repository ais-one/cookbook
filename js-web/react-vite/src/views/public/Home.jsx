import { Navigate, useNavigate } from 'react-router-dom';
import useUserStore from '../../store';

const Home = () => {
  const userLogin = useUserStore((state) => state.loginUser);
  const user = useUserStore((state) => state.user);
  // const navigate = useNavigate();

  const doLogin = () => {
    userLogin();
    // navigate('/login'); // cause a mess
  };

  // will only navigate out when user is valid
  if (user) {
    return <Navigate to="/dashboard/profile" />;
  }

  return (
    <div>
      <p>This is the Home Page</p>
      <p>User is {user ? user.userId : 'No User'}</p>
      <button onClick={doLogin}>Login</button>
    </div>
  );
};

export default Home;
