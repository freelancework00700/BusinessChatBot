import { Router } from 'express';
import { ChatBotController } from '../controllers/chatbot.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

export class ChatBotRoutes {
    chatBotController = new ChatBotController();
    authMiddleware = new AuthMiddleware();
    router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', this.authMiddleware.validateToken, this.chatBotController.getChatBots);
        this.router.post('/', this.authMiddleware.validateToken, this.chatBotController.createChatBot);
        this.router.put('/:id', this.authMiddleware.validateToken, this.chatBotController.updateChatbot);
        this.router.delete('/:id', this.authMiddleware.validateToken, this.chatBotController.deleteChatbot);
        this.router.get('/:id', this.authMiddleware.validateToken, this.chatBotController.getChatBotById);
    }
};
