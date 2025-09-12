import { Sequelize } from "sequelize";
import User, { initUserModel } from "../models/User";

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const sequelize = new Sequelize(
  process.env.DB_DATABASE!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// Define a type for our `db` object to ensure type safety
interface Db {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  User: typeof User;
  // Add other models here
}

const db: Partial<Db> = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Initialize and add all models to the db object
db.User = initUserModel(sequelize);

// You can define associations here
// For example:
// db.User.hasMany(db.Post);
// db.Post.belongsTo(db.User);

export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
    // Sync all models with the database.
    await db.sequelize!.sync({ alter: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("An error occurred during startup:", error);
  }
}

export default db as Db;
