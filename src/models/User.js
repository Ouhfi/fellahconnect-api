import { Model } from "sequelize";
import bcrypt from "bcrypt";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      
      User.hasOne(models.Farmer, {
        foreignKey: "userId",
        as: "farmer",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [3, 50],
        },
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      role: {
        type: DataTypes.ENUM("admin", "farmer"),
        allowNull: false,
        defaultValue: "farmer",
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,

      scopes: {
        active: {
          where: {
            isActive: true,
          },
        },

        farmers: {
          where: {
            role: "farmer",
          },
        },
      },
      
      hooks: {
        async beforeCreate(user) {
          user.password = await bcrypt.hash(user.password, 10);
        },
        
         async beforeUpdate(user) {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
      },
    }
    });
  return User;
};
