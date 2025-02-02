import { DataSource } from "typeorm";
import User from "../domain/entity/User";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: __dirname + "/../../database.sqlite",
  synchronize: true,
  logging: true,
  entities: [User],
});
