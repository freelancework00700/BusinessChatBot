import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

export class UserRoutes {
    userController = new UserController();
    authMiddleware = new AuthMiddleware();
    router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', this.authMiddleware.validateToken, this.userController.getAllUsers);
        this.router.post('/', this.userController.signInAndSignUp);
    }
};
