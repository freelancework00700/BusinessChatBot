import { Conversation } from "../models/conversation.model.js";

export class ConversationService {
    /** Create conversation */
    createConversation = async (params) => {
        return await Conversation.create(params);
    };

    /** Get Conversation by customer id and business id */
    getConversationByCustomerAndBusinessId = async (params) => {
        return await Conversation.findOne({ where: { customer_id: params.customer_id, business_id: params.business_id } });
    }

    /** Get conversaion by id */
    getConversationById = async (id) => {
        return await Conversation.findByPk(id);
    };
}