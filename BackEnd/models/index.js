
import { Users } from "./user.model.js";
import { ChatBot } from "./chatbot.model.js";
import { Conversation } from "./conversation.model.js";
import { Messages } from "./messages.model.js";

export const initMySQLModels = (connection) => {
  // init models here
  Users.initModel(connection);
  ChatBot.initModel(connection);
  Conversation.initModel(connection);
  Messages.initModel(connection);

  // init associations here
  Users.initAssociations();
  ChatBot.initAssociations();
  Conversation.initAssociations();
  Messages.initAssociations();
};