import {Model, DataTypes } from "sequelize";

export class Conversation extends Model {
  // Static method to initialize the model schema
  static initModel(connection) {
    Conversation.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        customer_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        business_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        tableName: "conversation", 
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
