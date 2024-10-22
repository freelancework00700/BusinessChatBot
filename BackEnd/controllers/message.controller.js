import { MessageService } from "../services/message.service.js";
import { HttpStatus } from "../utils/http-status.js";
import { ChatBotService } from "../services/chatbot.service.js";
import { ConversationService } from "../services/conversation.service.js";

export class MessagesController extends HttpStatus {
    messageService = new MessageService();
    chatBotService = new ChatBotService();
    conversationService = new ConversationService();

    /** GET API: Get all messages by conversation id */
    getMessages = async (req, res) => {
        try {
            const { conversation_id } = req.params;

            const getMessage = await this.messageService.getMessagesByConversationId(conversation_id);
            if (!getMessage.length) return this.sendBadRequestResponse(res, "Message not found.");

            this.sendOkResponse(res, "Messages get successfully.", getMessage);
        } catch (err) {
            console.log("err: ", err);
            this.sendBadRequestResponse(res, err.message);
        }
    };

    /** POST API: Create a message */
    createMessage = async (req, res) => {
        try {
            const { userId } = res.locals.auth;
            const { message, conversation_id } = req.body;

            const params = {
                message,
                sendBy: userId,
                conversation_id
            }

            // Create customer side message
            const createMessage = await this.messageService.createMessage(params);
            if (!createMessage) return this.sendBadRequestResponse(res, "Unable to create message.");

            // Get conversation for business id
            const conversation = await this.conversationService.getConversationById(conversation_id);
            if (!conversation) return this.sendBadRequestResponse(res, "Conersation not found.");

            // Check this message exist or not in chatbot.
            const getMessage = await this.chatBotService.getChatbotByMessage(message, conversation.business_id);

            // If message exist, get message reply and create new message business side
            if (getMessage) {

                const replyParams = {
                    message: getMessage.reply,
                    sendBy: conversation.business_id,
                    conversation_id
                };

                // Create a reply
                await this.messageService.createMessage(replyParams);
            } else {
                const replyParams = {
                    message: "Sorry, we need more information.",
                    sendBy: conversation.business_id,
                    conversation_id
                };

                // Create a default reply
                await this.messageService.createMessage(replyParams);
            }

            this.sendOkResponse(res, "Message created successfully.", createMessage);

        } catch (err) {
            console.log("err: ", err);
            this.sendBadRequestResponse(res, err.message);
        }
    };
}