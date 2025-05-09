
import request from 'supertest';
import { server } from './server';

describe('TEST CRUD API', () => {
  let userId: string;
  const newUser = { username: 'new_user', age: 20, hobbies: [] };
  const updatedUser = { username: 'new_user_updated', age: 21, hobbies: ['swimming'] };

  beforeAll((done) => {
    server.listen(4000, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('GET /api/users should return empty array', async () => {
    const res = await request(server).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/users shold create a new user record', async () => {
    const res = await request(server).post('/api/users').send(newUser);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(newUser);
    userId = res.body.id;
  });

  it('GET /api/users/{userId} should return just created user\'s record', async () => {
    const res = await request(server).get(`/api/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(newUser);
  });

  it('PUT /api/users/{userId} should update existing user\'s record', async () => {
    const res = await request(server).put(`/api/users/${userId}`).send(updatedUser);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(updatedUser);
    expect(res.body.id).toBe(userId);
  });

  it('DELETE /api/users/{userId} should delete existing user\'s record', async () => {
    const res = await request(server).delete(`/api/users/${userId}`);
    expect(res.status).toBe(204);
  });

  it('GET /api/users/{userId} should give 404 status code when trying to get deleted user\'s record', async () => {
    const res = await request(server).delete(`/api/users/${userId}`);
    expect(res.status).toBe(404);
  });
});