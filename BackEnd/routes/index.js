import { Router } from "express";
import { UserRoutes } from "./user.routes.js";
import { ChatBotRoutes } from "./chatbot.routes.js"; 
import { ConversationRoutes } from "./conversation.routes.js"; 
import { MessageRoutes } from "./message.routes.js";

export class Routes {
    router = Router();
    userRoutes = new UserRoutes();
    chatbotRoutes = new ChatBotRoutes();
    conversationRoutes = new ConversationRoutes();
    messageRoutes = new MessageRoutes();


    constructor() {
        this.router.use('/user', this.userRoutes.router);
        this.router.use('/chatbot', this.chatbotRoutes.router);
        this.router.use('/conversation', this.conversationRoutes.router);
        this.router.use('/message', this.messageRoutes.router);
    }
}