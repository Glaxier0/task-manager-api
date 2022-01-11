const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const testUserOneId = new mongoose.Types.ObjectId()
const testUserOne = {
    _id: testUserOneId,
    name: "testUserOne",
    email: "testUserOne@test.com",
    password: "12345678",
    tokens: [{
        token: jwt.sign({_id: testUserOneId}, process.env.JWT_SECRET)
    }]
}

const testUserTwoId = new mongoose.Types.ObjectId()
const testUserTwo = {
    _id: testUserTwoId,
    name: "testUserTwo",
    email: "testUserTwo@test.com",
    password: "12345678",
    tokens: [{
        token: jwt.sign({_id: testUserTwoId}, process.env.JWT_SECRET)
    }]
}

const testTaskOneId = new mongoose.Types.ObjectId()
const testTaskOne = {
    _id: testTaskOneId,
    description: 'Test task one',
    completed: true,
    user: testUserOneId
}

const testTaskTwoId = new mongoose.Types.ObjectId()
const testTaskTwo = {
    _id: testTaskTwoId,
    description: 'Test task two',
    completed: false,
    user: testUserOneId
}

const testTaskThreeId = new mongoose.Types.ObjectId()
const testTaskThree = {
    _id: testTaskThreeId,
    description: 'Test task three',
    completed: false,
    user: testUserTwoId
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(testUserOne).save()
    await new User(testUserTwo).save()
    await new Task(testTaskOne).save()
    await new Task(testTaskTwo).save()
    await new Task(testTaskThree).save()
}

module.exports = {
    testUserOneId,
    testUserOne,
    testUserTwoId,
    testUserTwo,
    testTaskOne,
    testTaskTwo,
    testTaskThree,
    setupDatabase
}
