import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Permission } from "../utils/permissions";

// Define the attributes for the User model
interface UserAttributes {
  id: string;
  displayName: string;
  permissions: Permission[];
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the required attributes for creating a User, as 'id' is optional
// interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

//  Here 'id' is required for creation, so we don't make it optional
interface UserCreationAttributes extends UserAttributes {}

// Define the User model class with proper types
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public displayName!: string;
  public permissions!: Permission[];
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 3. Initialize the Model
// This links the class to the database table definition.
export const initUserModel = (sequelize: Sequelize): typeof User => {
  User.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      permissions: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: true,
    }
  );
  return User;
};
export default User;
