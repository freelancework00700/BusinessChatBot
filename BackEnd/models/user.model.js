import {Model, DataTypes } from "sequelize";

export class Users extends Model {
  // Static method to initialize the model schema
  static initModel(connection) {
    Users.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        type: {
          type: DataTypes.ENUM('business_owner', 'customer'),
          allowNull: true
        }
      },
      {
        tableName: "user", 
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
