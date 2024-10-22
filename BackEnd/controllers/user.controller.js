import { HttpStatus } from "../utils/http-status.js";
import { UserService } from "../services/user.service.js";
import { compareAsync, generateToken, hashAsync } from "../utils/crypto-helper.js";
import { Op } from "sequelize";
import { sequelize } from "../server.js";

export class UserController extends HttpStatus {
    userService = new UserService();

    /** GET API: Get all users */
    getAllUsers = async (req, res) => {
        try {

            const where = {};
            where[Op.and] = [];

            where[Op.and].push(sequelize.literal(`type = 'business_owner'`));
            
           const users = await this.userService.getAllUser(where);

            if (!users.length) return this.sendBadRequestResponse(res, "User not found.");

            this.sendOkResponse(res, "Users get successfully.", users);
        } catch (err) {
            console.log("err: ", err);
            this.sendBadRequestResponse(res, err.message);
        }
    };

    /** POST API: Create a new user if not exist, otherwise login that user. */
    signInAndSignUp = async (req, res) => {
        try {

            const { email, password, type } = req.body;

            // Check same email user exist or not.
            const existingUser = await this.userService.getUserByEmail(email);

            // If user exist, check password and login.
            if (existingUser) {
                const check = await compareAsync(password, existingUser.password);
                if (!check) return this.sendBadRequestResponse(res, "Invalid credentials.");

                const jwtToken = generateToken(existingUser);

                return this.sendOkResponse(res, "Login successfully.", {  user: existingUser, jwtToken });
            }

            // Hash password
            const hashPassword = await hashAsync(password);
            
            const params = {
                email,
                password: hashPassword,
                type
            }
            
            // Create a new user
            const user = await this.userService.createUser(params);
            if (!user) return this.sendBadRequestResponse(res, "Unable to crearte user.");

            // Create token
            const jwtToken = generateToken(user);
            return this.sendOkResponse(res, "User created successfully.", { user, jwtToken });

        } catch (err) {
            console.log("err: ", err);
            this.sendBadRequestResponse(res, err.message);
        }
    };
}