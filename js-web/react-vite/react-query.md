```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}
```

### axiosInstance.ts

```ts
import axios, { HeadersDefaults } from 'axios';

const axiosClient = axios.create();

// Replace this with our own backend base URL
axiosClient.defaults.baseURL = 'https://api.example.org/';

type headers = {
  'Content-Type': string;
  Accept: string;
  Authorization: string;
};

axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
} as headers & HeadersDefaults;

// Adding Authorization header for all requests

axiosClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access-token');
    if (token) {
      // Configure this as per your backend requirements
      config.headers!['Authorization'] = token;
    }
    return config;
  },
  error => Promise.reject(error);
);

axiosClient.interceptors.response.use(
  res => res,
  async err => {
    const originalConfig = err.config;

    if (originalConfig.url !== '/user/login' && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await axios.post(
            'https://api.example.org/user/refresh',
            {
              headers: {
                Authorization: localStorage.getItem('refresh-token')!
              }
            }
          );

          const access = rs.data.data['X-Auth-Token'];
          const refresh = rs.data.data['X-Refresh-Token'];

          localStorage.setItem('access-token', access);
          localStorage.setItem('refresh-token', refresh);

          return axiosClient(originalConfig);
        } catch (_error) {
          toast.error('Session time out. Please login again.', {
            id: 'sessionTimeOut'
          });
          // Logging out the user by removing all the tokens from local
          localStorage.removeItem('access-token');
          localStorage.removeItem('refresh-token');
          // Redirecting the user to the landing page
          window.location.href = window.location.origin;
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default axiosClient;
```


### src/hooks/useUserLogin.ts

```ts
import { useMutation } from '@tanstack/react-query';
import axios from 'axiosInstance';

type LoginData = {
  email: string;
  password: string;
};

const postUserData = async (data: LoginData) => {
  const res = await axios.post("user/login", data).then(res => {
    return {
      // Change the path of reading the values from response as per your backend reponse
      auth_token: res.data.data['X-Auth-Token'],
      refresh_token: res.data.data['X-Refresh-Token'],
    };
  });

  return res;
};

export const useUserLogin = () => {
  return useMutation((data: LoginData) => postUserData(data), {});
};
```

### Home.tsx

```tsx
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useUserLogin } from '../hooks/useUserLogin';

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data, isLoading, mutate: login, isSuccess, isError } = useUserLogin();

  useEffect(() => {
    if (isSuccess) {
      toast.success('Login Successful!');
      localStorage.setItem('access-token', data.auth_token);
      localStorage.setItem('refresh-token', data.refresh_token);
    } else if (isError) {
      toast.error('Login failed!');
    } else return;
  }, [isSuccess, isError]);

  const handleSubmit = () => {
    login({ email, password }); // Login api call
  };

  if (isLoading) <div>Loading...</div>;

  return (
    <div>
      <form>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
        />
        <button onClick={handleSubmit} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Home;
```