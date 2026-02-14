import {
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
} from "@nestjs/common"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../generated/prisma/client"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class DbConfigService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

    constructor(config: ConfigService) {

        const dbUrl = config.get<string>("DATABASE_URL")

        if (!dbUrl) {
            throw new Error("Missing DATABASE_URL")
        }

        const adapter = new PrismaPg({
            connectionString: dbUrl,
        })

        super({ adapter })
    }

    async onModuleInit(): Promise<void> {
        await this.$connect()
    }

    async onModuleDestroy(): Promise<void> {
        await this.$disconnect()
    }
}
