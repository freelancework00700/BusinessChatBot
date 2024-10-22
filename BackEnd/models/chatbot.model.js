import {Model, DataTypes } from "sequelize";

export class ChatBot extends Model {
  // Static method to initialize the model schema
  static initModel(connection) {
    ChatBot.init(
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
        reply: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        replyType: {
            type: DataTypes.ENUM('text', 'template'),
            allowNull: false
        },
        business_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        }
      },
      {
        tableName: "ChatBot",
        sequelize: connection,
        freezeTableName: true,
        timestamps: true,
      }
    );
  }

  // Static method to initialize associations with other models
  static initAssociations() {
    
  }
}
