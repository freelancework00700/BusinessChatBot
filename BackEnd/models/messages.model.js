import { Model, DataTypes } from "sequelize";
import { Users } from "./user.model.js";
import { Conversation } from "./conversation.model.js";

export class Messages extends Model {
    // Static method to initialize the model schema
    static initModel(connection) {
        Messages.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                message: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                sendBy: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                conversation_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
            },
            {
                tableName: "messages",
                sequelize: connection,
                freezeTableName: true,
                timestamps: true,
            }
        );
    }

    // Static method to initialize associations with other models
    static initAssociations() {
        Messages.belongsTo(Users, { foreignKey: { name: 'sendBy', allowNull: false } });
        Messages.belongsTo(Conversation, { foreignKey: { name: 'conversation_id', allowNull: false } });
    }
}