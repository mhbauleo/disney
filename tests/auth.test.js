const { app, server } = require('../server')
const request = require('supertest')
const expect = require('chai').expect
const { createHash, isValidPassword } = require('../helpers/bcrypt')
const { verifyJWT } = require('../helpers/jwt')
const User = require("../model/models/userModel");

const newUser = {
    email: 'new@email.com',
    password: '1234'
}

describe('Auth', () => {

    beforeEach(() => {
        jest.setTimeout('10000')
    })
    afterAll(() => {
        server.close()
    })

    describe('POST /auth/register', () => {
        beforeAll(async () => {
            await User.destroy({ truncate: true, cascade: false})
        })

        afterEach(async () => {
            await User.destroy({ truncate: true, cascade: false})
        })

        test('Create a valid user', async () => {
            let response = await request(app).post('/auth/register').send(newUser)

            expect(response.body.status).to.eql("success")
            expect(response.body.data).to.eql(null)
            expect(response.status).to.eql(201) 
            
            const user = await User.findOne({where: {email: newUser.email }})
            const isValid = await isValidPassword(user, newUser.password)
            expect(user.email).to.eql(newUser.email)
            expect(isValid).to.eql(true)
        })

        test('Create a user with an email already registered', async () => {
            const hashedPassword = await createHash(newUser.password)
            await User.create({ email: newUser.email, password: hashedPassword })

            let response = await request(app).post('/auth/register').send(newUser)

            expect(response.body.status).to.eql("fail")
            expect(response.body.data?.message).to.be.a("string")
            expect(response.status).to.eql(409) 
        })

        test('Register without password', async () => {
            let response = await request(app).post('/auth/register').send({ email: newUser.email })

            expect(response.body.status).to.eql("fail")
            expect(response.body.data?.message).to.be.a("string")
            expect(response.status).to.eql(422) 
        })

        test('Register without email', async () => {
            let response = await request(app).post('/auth/register').send({ password: newUser.password })

            expect(response.body.status).to.eql("fail")
            expect(response.body.data?.message).to.be.a("string")
            expect(response.status).to.eql(422) 
        })
    })

    describe('POST /auth/login', () => {
        beforeAll(async () => {
            const hashedPassword = await createHash(newUser.password)
            await User.create({ email: newUser.email, password: hashedPassword })
        })

        afterAll(async () => {
            await User.destroy({ truncate: true, cascade: false})
        })

        test('Login with correct credentials', async () => {
            let response = await request(app).post('/auth/login').send(newUser)

            const payload = verifyJWT(response.body.data)
            expect(response.body.status).to.eql("success")
            expect(payload.email).to.eql(newUser.email)
            expect(response.status).to.eql(200) 
        })

        test('Email not created', async () => {
            let response = await request(app).post('/auth/login').send({...newUser, email: "nocreated@gmail.com"})

            expect(response.body.status).to.eql("fail")
            expect(response.body.data?.message).to.be.a("string")
            expect(response.status).to.eql(401) 
        })

        test('Invalid password', async () => {
            let response = await request(app).post('/auth/login').send({...newUser, password: "12345"})

            expect(response.body.status).to.eql("fail")
            expect(response.body.data?.message).to.be.a("string")
            expect(response.status).to.eql(401) 
        })

        test('Login without email', async () => {
            let response = await request(app).post('/auth/login').send({ password: newUser.password })

            expect(response.body.status).to.eql("fail")
            expect(response.body.data?.message).to.be.a("string")
            expect(response.status).to.eql(422) 
        })

        test('Login without password', async () => {
            let response = await request(app).post('/auth/login').send({ email: newUser.email })

            expect(response.body.status).to.eql("fail")
            expect(response.body.data?.message).to.be.a("string")
            expect(response.status).to.eql(422) 
        })
    })
})