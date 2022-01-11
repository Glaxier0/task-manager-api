const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {testUserOne, testUserTwo, testTaskOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create a task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send({
            description: "Test app"
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task["completed"]).toEqual(false)
})

test('Should not create a task with invalid description/competed', async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send({
            description: "",
            completed: ""
        })
        .expect(400)
})

test('Should get all task for a user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)
})

test('Should get all completed task for a user', async () => {
    const response = await request(app)
        .get('/tasks?completed=true&limit=10&skip=0')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(1)
})

test('Should get all not completed task for a user', async () => {
    const response = await request(app)
        .get('/tasks?completed=true&limit=10&skip=0')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(1)
})

test('Should get all task sorted by created at for a user', async () => {
    await request(app)
        .get('/tasks?sortBy=createdAt&limit=10&skip=0')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should get 2.page tasks for a user', async () => {
    const response = await request(app)
        .get('/tasks?limit=1&skip=1')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(1)
})

test('Should get a task for a user', async () => {
    await request(app)
        .get(`/tasks/${testTaskOne._id}`)
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get another users task', async () => {
    await request(app)
        .get(`/tasks/${testTaskOne._id}`)
        .set('Authorization', `Bearer ${testUserTwo.tokens[0].token}`)
        .send()
        .expect(404)
})

test('Should not get a task for unauthenticated user', async () => {
    await request(app)
        .get(`/tasks/${testTaskOne._id}`)
        .send()
        .expect(401)
})

test('Should not update a task with invalid description/completed', async () => {
    request(app)
        .patch(`/tasks/${testTaskOne._id}`)
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send({
            description: "",
            completed: ""
        })
    expect(400)
})

test('Should not update other users task', async () => {
    request(app)
        .patch(`/tasks/${testTaskOne._id}`)
        .set('Authorization', `Bearer ${testUserTwo.tokens[0].token}`)
        .send({
            description: "Test fail update",
        })
    expect(400)
})

test('Should delete user task', async () => {
    await request(app)
        .delete(`/tasks/${testTaskOne._id}`)
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Task.findById(testTaskOne._id)
    expect(task).toBeNull()
})

test('Should not delete other users tasks', async () => {
    await request(app)
        .delete(`/tasks/${testTaskOne._id}`)
        .set('Authorization', `Bearer ${testUserTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(testTaskOne._id)
    expect(task).not.toBeNull()
})

test('Should not delete task for unauthenticated user', async () => {
    await request(app)
        .delete(`/tasks/${testTaskOne._id}`)
        .send()
        .expect(401)
})