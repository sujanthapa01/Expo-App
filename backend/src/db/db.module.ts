import {Module,Global} from "@nestjs/common"
import {DbConfigService} from "./db.service"

@Global()
@Module({
    providers: [DbConfigService],
    exports: [DbConfigService],
})
export class DbConfigModule {}