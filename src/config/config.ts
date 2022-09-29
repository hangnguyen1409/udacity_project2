export const config = {
  dev: {
    username: process.env.USERNAME_DB,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: "postgres",
  },
  jwt: {
    secret: process.env.JWT,
  },
};
