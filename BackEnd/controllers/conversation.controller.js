import { HttpStatus } from "../utils/http-status.js";
import { ConversationService } from "../services/conversation.service.js";

export class ConversationController extends HttpStatus {
    conversationService = new ConversationService();

    /** POST API: Create a new conversation */
    createConversation = async (req, res) => {
        try {
            const { userId } = res.locals.auth;
            const params = req.body;
            params.customer_id = userId;

            const existingConversation = await this.conversationService.getConversationByCustomerAndBusinessId(params);
            if (existingConversation) return this.sendBadRequestResponse(res, "Conversation already exist.", existingConversation);

            const conversation = await this.conversationService.createConversation(params);
            if (!conversation) return this.sendBadRequestResponse(res, "Unable to create conversation.");

            this.sendOkResponse(res, "Conversation created successfully.", conversation);
        } catch (err) {
            console.log("err: ", err);
            this.sendBadRequestResponse(res, err.message);
        }
    };

    /** GET API: Get conversation by id */
    getConversationById = async (req, res) => {
        try {
            const { id } = req.params;

            const conversation = await this.conversationService.getConversationById(id);
            if (!conversation) return this.sendBadRequestResponse(res, "Conversation not found.");

            this.sendOkResponse(res, "Conversation get successfully.", conversation);
        } catch (err) {
            console.log("err: ", err);
            this.sendBadRequestResponse(res, err.message);
        }
    }
}