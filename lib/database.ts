import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "postgresql://dbuser:wfug4uWiZvA4pDr2e4bq@db2788ghh.hjgkoruhs.eu-central-1.rds.amazonaws.com/db",
  { ssl: true }
);

export function dbConnect() {
  return sequelize.authenticate();
}

export function sync() {
  return sequelize.sync();
}
