import { useState } from 'react';
import useUserStore from '../../store';

const Profile = () => {
  const testState = useUserStore((state) => state.test);
  const user = useUserStore((state) => state.user);
  const userUpdate = useUserStore((state) => state.updateUser);
  const [age, setAge] = useState('');

  const updateAge = () => {
    userUpdate(age);
  };

  return user ? (
    <div>
      <p>Profile for {user.userId}</p>
      <p>testState {testState}</p>
      <p>Age {user.age}</p>
      <input onChange={(ev) => setAge(ev.target.value)} value={age} />
      <button onClick={updateAge}>Edit Age</button>
    </div>
  ) : (
    <p>Error No User</p>
  );
};

export default Profile;
