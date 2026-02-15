import { Module } from '@nestjs/common';
import {AppConfigModule} from "./config/config.module"
import {DbConfigModule} from "./db/db.module"
import {ProfileModule} from "./profile/profile.module"

@Module({
  imports: [AppConfigModule,DbConfigModule,ProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
