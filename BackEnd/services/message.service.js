import { Conversation } from "../models/conversation.model.js";
import { Messages } from "../models/messages.model.js";
import { Users } from "../models/user.model.js";

export class MessageService {
    /** Create message */
    createMessage = async (params) => {
        return await Messages.create(params);
    };

    /** Get message by conversation id */ 
    getMessagesByConversationId = async (conversation_id) => {
        return await Messages.findAll({
            include: [
                { model: Users },
                { model: Conversation }
            ],
            where: { conversation_id } 
        });
    };
}