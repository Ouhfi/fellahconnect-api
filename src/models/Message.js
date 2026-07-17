import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      prompt: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      response: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "messages",
      timestamps: true,
    }
  );

  return Message;
};
