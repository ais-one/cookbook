import { HttpResponse, http } from 'msw';

export default [
  http.get('http://127.0.0.1:8080/api/msw/test', () => {
    return HttpResponse.json({
      message: 'it works :)',
    });
  }),
  http.post('http://127.0.0.1:8080/api/auth/login', ({ request, params, cookies }) => {
    console.log('cookies ? :', cookies);
    return HttpResponse.json({ otp: 1 });
  }),
  http.post('http://127.0.0.1:8080/api/auth/otp', ({ request, params, cookies }) => {
    console.log(request.body); // {"id":1,"pin":"111111"}
    return HttpResponse.json({
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZ3JvdXBzIjoiVGVzdEdyb3VwIiwiaWF0IjoxNjk0NDk2NDA5LCJleHAiOjE2OTQ0OTkxMDl9.vW3XwxNIJ0LVdenwqcZZzl04T-ufJuTed7FvyVYb2Io',
      refresh_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk0NDk2NDA5LCJleHAiOjE2OTQ1MDAwMDl9.p3xFoXix9_xBJOOLgH2hkvomQnz5D4ct_Zk21tcsojE',
      user_meta: {
        email: 'test',
        roles: ['TestGroup'],
      },
    });
  }),
  http.get('http://127.0.0.1:8080/api/auth/logout', () => {
    return HttpResponse.json({
      message: 'Logged Out',
    });
  }),
];
