const fs = require("fs"); 
const jwt = require('jsonwebtoken')
//const config = require('../config')

const signOptions = { expiresIn: '6h', algorithm: 'RS256'};
const privateKey = fs.readFileSync("./keys/private.pem")
const publicKey = fs.readFileSync('./keys/public.pem')

const createJWT = (payload) => jwt.sign(payload, privateKey, signOptions);
const verifyJWT = (token) => jwt.verify(token, publicKey)

module.exports = { createJWT, verifyJWT }