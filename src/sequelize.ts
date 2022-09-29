import { Sequelize } from "sequelize-typescript";
import { config } from "./config/config";
import { User } from "./models/User";

const c = config.dev;

export const sequelize = new Sequelize({
  username: c.username,
  password: c.password,
  database: c.database,
  host: c.host,
  dialect: "postgres",
  storage: ":memory:",
});

sequelize.addModels([User]);

export const createDB = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
};

export { User };
