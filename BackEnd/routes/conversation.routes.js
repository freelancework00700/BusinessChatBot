import { Router } from 'express';
import { ConversationController } from '../controllers/conversation.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

export class ConversationRoutes {
    conversationController = new ConversationController();
    authMiddleware = new AuthMiddleware();
    router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/:id', this.authMiddleware.validateToken, this.conversationController.getConversationById);
        this.router.post('/', this.authMiddleware.validateToken, this.conversationController.createConversation);
    }
};