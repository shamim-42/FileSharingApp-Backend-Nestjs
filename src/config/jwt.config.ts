import { SignOptions } from 'jsonwebtoken'
require('dotenv').config()

const signOptions: SignOptions = {
    expiresIn: 43200
}

export const jwtConstants = {
    secret: process.env.JWT_SECRET,
    signOptions,
}