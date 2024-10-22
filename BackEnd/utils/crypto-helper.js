import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import env from './validate-env.js';

const SECRET = env.SECRET_KEY || "";

export const encrypt = (data) => {
    return jwt.sign(data, SECRET);
};

export const decrypt = (token) => {
    return jwt.decode(token, SECRET);
};

export const hashAsync = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const compareAsync = async (password, passwordHash) => {
    return await bcrypt.compare(password, passwordHash);
};

export const generateToken = (user) => {
    const data = { id : user.id , email : user.email }
    return jwt.sign(data, SECRET);
}

export const decodeToken = (token) => {
    return jwt.verify(token, SECRET);
}