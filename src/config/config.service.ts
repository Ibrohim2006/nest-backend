import { Injectable, Logger } from '@nestjs/common';
import z from 'zod';
import { ConfigSchema, configSchema } from './config.schema';

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);
  private readonly config: ConfigSchema;

  constructor() {
    const result = configSchema.safeParse(process.env);

    if (!result.success) {
      this.logger.error(z.prettifyError(result.error));
      process.exit(1);
    }

    this.config = result.data;
  }

  get<K extends keyof ConfigSchema>(key: K): ConfigSchema[K] {
    return this.config[key];
  }
}
