import { Router } from 'express';
import { MessagesController } from '../controllers/message.controller.js'; 
import { AuthMiddleware } from '../middleware/auth.middleware.js';

export class MessageRoutes {
    messagesController = new MessagesController();
    authMiddleware = new AuthMiddleware();
    router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/:conversation_id', this.authMiddleware.validateToken, this.messagesController.getMessages);
        this.router.post('/', this.authMiddleware.validateToken, this.messagesController.createMessage);
    }
};
