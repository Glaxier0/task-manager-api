const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {testUserOneId, testUserOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        "name": "Test",
        "email": "test@test.com",
        "password": "12345678"
    })
        .expect(201)
})

test('Should not signup as new user with invalid name/email/password', async () => {
    await request(app).post('/users').send({
        "name": "",
        "email": "",
        "password": ""
    })
        .expect(400)
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login')
        .send({
            "email": testUserOne.email,
            "password": testUserOne.password
        })
        .expect(200)

    const user = await User.findById(testUserOneId)
    expect(response.body.token).toBe(user["tokens"][1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login')
        .send({
            "email": "nonexistentUser@test.com",
            "password": "nonexistentUser"
        })
        .expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete profile for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(testUserOneId)
    expect(user).toBeNull()
})

test('Should not delete profile for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar to profile', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/profile.png')
    expect(200)

    const user = await User.findById(testUserOneId)
    expect(user["avatar"]).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request((app))
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send({
            name: "testUpdate"
        })
        .expect(200)

    const user = await User.findById(testUserOneId)
    expect(user["name"]).toEqual('testUpdate')
})

test('Should not update invalid user fields', async () => {
    await request((app))
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send({
            location: "testLocation"
        })
        .expect(400)
})

test('Should not update invalid name/email/password user fields', async () => {
    await request((app))
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send({
            name: "testLocation",
            email: "",
            password: ""
        })
        .expect(400)
})

test('Should not update profile for unauthenticated user', async () => {
    await request((app))
        .patch('/users/me')
        .send()
        .expect(401)
})