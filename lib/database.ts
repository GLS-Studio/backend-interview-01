import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  { ssl: true }
);

export function dbConnect() {
  return sequelize.authenticate();
}

export function sync() {
  return sequelize.sync();
}
