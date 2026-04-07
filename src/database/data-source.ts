import { resolve } from "node:path";
import { DataSource } from "typeorm";
import "dotenv/config";
import z from "zod";
import { databaseConfigSchema } from "@/config/database/database.config";
import { snakeNamingStrategy } from "./naming-strategy";

const result = databaseConfigSchema.safeParse(process.env);

if (!result.success) {
  console.error(z.prettifyError(result.error));
  process.exit(1);
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: result.data.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [resolve(__dirname, "../modules/**/entities/*.entity.{ts,js}")],
  migrations: [resolve(__dirname, "./migrations/*.{ts,js}")],
  ssl: false,
  namingStrategy: snakeNamingStrategy,
});
