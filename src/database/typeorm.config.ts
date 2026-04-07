import { resolve } from "node:path";
import { defaultOutDir } from "@nestjs/cli/lib/configuration/defaults";
import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ConfigService } from "@/config/config.service";
import { snakeNamingStrategy } from "./naming-strategy";

@Injectable()
export class TypeormConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      url: this.configService.get("DATABASE_URL"),
      logging: false,
      entities: [
        resolve(defaultOutDir, "modules/**/entities/*.entity.{ts,js}"),
      ],
      synchronize: true,
      autoLoadEntities: true,
      ssl: false,
      namingStrategy: snakeNamingStrategy,
    };
  }
}
