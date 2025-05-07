const request = require('supertest');
const app = require('../../app');
const testUtils = require('../../testUtils');

describe('users route', () => {
    beforeAll(async () => {
        await testUtils.connectDB();
    });
    afterAll(async () => {
        await testUtils.stopDB();
    });
    afterEach(async () => {
        await testUtils.clearDB();
    });
    
    test('POST /users/login', async () => {
        await request(app).post('/users').send({email: 'hagueb@uw.edu', password: 'password'}).expect(201);

        return request(app)
            .post('/users/login')
            .send({email: 'hagueb@uw.edu', password: 'password'})
            .expect(200);
    });
});