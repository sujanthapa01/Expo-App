import { Module } from '@nestjs/common';
import {AppConfigModule} from "./config/config.module"
import {DbConfigModule} from "./db/db.module"

@Module({
  imports: [AppConfigModule,DbConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
