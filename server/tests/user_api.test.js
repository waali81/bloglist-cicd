const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

describe('user creation', () => {
  test('valid user is created', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'secret'
    }

    await api.post('/api/users').send(newUser).expect(201)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes('testuser'))
  })

  test('user with too short password is not created', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: '12'
    }

    const usersAtStart = await helper.usersInDb()

    await api.post('/api/users').send(newUser).expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('user without username is not created', async () => {
    const newUser = {
      name: 'No Username',
      password: 'secret'
    }

    const usersAtStart = await helper.usersInDb()

    await api.post('/api/users').send(newUser).expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('username must be at least 3 characters', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short',
      password: 'secret'
    }

    const usersAtStart = await helper.usersInDb()

    await api.post('/api/users').send(newUser).expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('username must be unique', async () => {
    const user = {
      username: 'sameuser',
      name: 'Test',
      password: 'secret'
    }

    await api.post('/api/users').send(user)

    const usersAtStart = await helper.usersInDb()

    await api.post('/api/users').send(user).expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
