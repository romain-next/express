const request = require('supertest');
const app = require('../app');
const User = require('../model/user');
const { sequelizeInstance } = require('../db');

describe('Tests API DevOps (Intégration avec SQLite en mémoire)', () => {
  
  beforeAll(async () => {
    await sequelizeInstance.sync({ force: true });
  });

  afterEach(async () => {
    await User.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await sequelizeInstance.close();
  });

  test('GET /health devrait retourner un status 200 et ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('POST /users devrait créer un utilisateur avec des données valides', async () => {
    const newUser = { name: 'DevOps', firstName: 'Expert', email: 'test@devops.com' };
    
    const res = await request(app)
      .post('/users')
      .send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe('DevOps');
    
    const userInDb = await User.findOne({ where: { email: 'test@devops.com' } });
    expect(userInDb).not.toBeNull();
    expect(userInDb.firstName).toBe('Expert');
  });

  test('POST /users devrait retourner 400 si un champ est manquant', async () => {
    const invalidUser = { name: 'Alice' };

    const res = await request(app)
      .post('/users')
      .send(invalidUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Champ manquant');
  });

  test('GET /users devrait retourner la liste des utilisateurs', async () => {
    await User.create({ name: 'Doe', firstName: 'John', email: 'john@test.com' });

    const res = await request(app).get('/users');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Doe');
  });

  test('GET /users/:id devrait retourner 404 si l\'utilisateur n\'existe pas', async () => {
    const res = await request(app).get('/users/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('not found');
  });

  test('PUT /users/:id devrait mettre à jour un utilisateur', async () => {
    const createdUser = await User.create({ name: 'OldName', firstName: 'Bob', email: 'bob@test.com' });

    const res = await request(app)
      .put(`/users/${createdUser.id}`)
      .send({ name: 'NewName' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('NewName');
  });

  test('DELETE /users/:id devrait supprimer l\'utilisateur s\'il existe', async () => {
    const createdUser = await User.create({ name: 'Smith', firstName: 'Will', email: 'will@test.com' });

    const res = await request(app).delete(`/users/${createdUser.id}`);
    expect(res.statusCode).toBe(200);
    
    const userInDb = await User.findByPk(createdUser.id);
    expect(userInDb).toBeNull();
  });

});