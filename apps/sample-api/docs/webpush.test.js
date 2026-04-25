import { findUser } from '@common/node/auth/jwt';
import webpush from '@common/node/comms/webpush';
import express from 'express';
import request from 'supertest';
import webpushRouter from '../routes/webpush';

jest.mock('@common/node/auth');
jest.mock('@common/node/comms/webpush');

describe('POST /send/:id', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(webpushRouter);
    jest.clearAllMocks();
  });

  it('should send Webpush notification successfully', async () => {
    findUser.mockResolvedValue({ id: '1', pnToken: '{"endpoint":"test"}' });
    webpush.send.mockResolvedValue({ success: true });

    const res = await request(app)
      .post('/send/1')
      .send({ mode: 'Webpush', data: { title: 'Test', body: 'Body' } });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('sent');
    expect(webpush.send).toHaveBeenCalled();
  });

  it('should return 404 when user not found', async () => {
    findUser.mockResolvedValue(null);

    const res = await request(app)
      .post('/send/1')
      .send({ mode: 'Webpush', data: { title: 'Test', body: 'Body' } });

    expect(res.status).toBe(404);
    expect(res.body.status).toBe('no user or token');
  });

  it('should return 500 on send error', async () => {
    findUser.mockResolvedValue({ id: '1', pnToken: 'token' });
    webpush.send.mockRejectedValue(new Error('Webpush error'));

    const res = await request(app)
      .post('/send/1')
      .send({ mode: 'Webpush', data: { title: 'Test', body: 'Body' } });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
