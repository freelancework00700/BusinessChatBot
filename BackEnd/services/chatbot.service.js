import { Op } from "sequelize";
import { ChatBot } from "../models/chatbot.model.js";

export class ChatBotService {

    /** Get chatbot by busines id */
    getChatBots = async (options) => {
        return await ChatBot.findAll(options);
    }

    /** Create chatbot */
    createChatBot = async (params) => {
        return await ChatBot.create(params);
    };

    /** Get chatbot by message */
    getChatbotByMessage = async (message, business_id) => {
        return await ChatBot.findOne({ where: { message, business_id } });
    };

    /** Get chatbot by id */
    getChatBotById = async (id) => {
        return await ChatBot.findByPk(id);
    };

    /** Check if message already exist in same id or not. */
    existingChatBot = async (id, params) => {
        return await ChatBot.findOne({ where: { message: params.message, business_id: params.business_id, id: { [Op.ne]: id }  } });
    };

    /** Update chatbot */
    updateChatbot = async (id, params) => {
        return await ChatBot.update(params, { where: { id } });
    };

    /** Delete chatbot */
    deleteChatbot = async (id) => {
        return await ChatBot.destroy({ where: { id } });
    };
}