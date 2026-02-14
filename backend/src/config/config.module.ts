import {Module} from "@nestjs/common"
import {ConfigModule} from "@nestjs/config"
import {ValidationSchima} from "./config.validator"

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: ValidationSchima,
            validationOptions: {
                abortEarly: false
            }

        })
    ]
})


export class AppConfigModule {}