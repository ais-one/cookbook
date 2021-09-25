import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  it('should be defined', () => {
    expect(new AuthInterceptor()).toBeDefined();
  });
});
