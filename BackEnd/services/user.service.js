import { Users } from "../models/user.model.js";

export class UserService {
    /** Get all business owner */
    getAllUser = async (where) => {
       return await Users.findAll({ where });
    };

    /** Get user by email */
    getUserByEmail = async (email) => {
       return await Users.findOne({ where: { email } });
    };

    /** Create user */
    createUser = async (params) => {
       return await Users.create(params);
    };
}