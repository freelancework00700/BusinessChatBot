import { ChatBotService } from "../services/chatbot.service.js";
import { HttpStatus } from "../utils/http-status.js";
import { HelperFunctions } from "../utils/helper-functions.js";
import { Op } from "sequelize";

export class ChatBotController extends HttpStatus {
    chatbotService = new ChatBotService();
    helperFunctions = new HelperFunctions();

    /** GET API: Get all chat bot by business owner */
    getChatBots = async (req, res) => {
        try {
            const { userId } = res.locals.auth;
            const { pageIndex, pageSize, sortColumn, sortDirection } = req.query;

            const where = {};
            where[Op.and] = [];

            where[Op.and].push({ business_id: userId });
 
            // Get all options including searching, sorting and pagination.
            const options = this.helperFunctions.getOptions(
                where,
                pageIndex,
                pageSize,
                sortColumn,
                sortDirection
            );

            const getChatBots = await this.chatbotService.getChatBots(options);
            if (!getChatBots.length) return this.sendBadRequestResponse(res, "Unable to create chatbot.");

            this.sendOkResponse(res, "Get all chatbots.", getChatBots);
        } catch (err) {
            console.log("err: ", err);
            this.sendBadRequestResponse(res, err.message);
        }
    };

    /** POST API: Create a new chat bot */
    createChatBot = async (req, res) => {
        try {
            const { userId } = res.locals.auth;
            const params = req.body;

            params.business_id = userId;
            const existingChatBot = await this.chatbotService.getChatbotByMessage(params.message, params.business_id);

            if (existingChatBot) return this.sendBadRequestResponse(res, "ChatBot already exist.", existingChatBot);

            const chatbot = await this.chatbotService.createChatBot(params);
            if (!chatbot) return this.sendBadRequestResponse(res, "Unable to create chatbot.");

            this.sendOkResponse(res, "Chatbot created successfully.", chatbot);

        } catch (err) {
            console.log("err: ", err);
            this.sendBadRequestResponse(res, err.message);
        }
    };

    /** PUT API: Update chatbot */
    updateChatbot = async (req, res) => {
        try {
            const { userId } = res.locals.auth;
            const { id } = req.params;
            const params = req.body;

            params.business_id = userId;
            const chatbot = await this.chatbotService.getChatBotById(id);
            if (!chatbot) return this.sendBadRequestResponse(res, "Chatbot not found.");

            const existingChatBot = await this.chatbotService.existingChatBot(id, params);
            if (existingChatBot) return this.sendBadRequestResponse(res, "Chatbot already exists.", existingChatBot);

            const updateChatbot = await this.chatbotService.updateChatbot(id, params);
            if (!updateChatbot) return this.sendBadRequestResponse(res, "Unable to update chatbot.");

            this.sendOkResponse(res, "Chatbot updated successfully.");
        } catch (err) {
            console.log("err: ", err);
            this.sendBadRequestResponse(res, err.message);
        }
    };

    /** DELETE API: Delete chatbot */
    deleteChatbot = async (req, res) => {
        try {
            const { id } = req.params;

            const chatbot = await this.chatbotService.getChatBotById(id);
            if (!chatbot) return this.sendBadRequestResponse(res, "Chatbot not found.");

            const deleteChatbot = await this.chatbotService.deleteChatbot(id);
            if (!deleteChatbot) return this.sendBadRequestResponse(res, "Unable to delete chatbot.");

            this.sendOkResponse(res, "Chatbot deleted successfully.");

        } catch (err) {
            console.log("err: ", err);
            this.sendBadRequestResponse(res, err.message);
        }
    };

    /** GET API: Get chatbot by id */
    getChatBotById = async (req, res) => {
        try {
            const { id } = req.params;

            const chatbot = await this.chatbotService.getChatBotById(id);
            if (!chatbot) return this.sendBadRequestResponse(res, "Chatbot not found.");

            this.sendOkResponse(res, "Chatbot get successfully.", chatbot);

        } catch (err) {
            console.log("err: ", err);
            this.sendBadRequestResponse(res, err.message);
        }
    };
}