import {
    Injectable,
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
} from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { DbConfigService } from "../db/db.service"
import { GitHubProfileDto } from "./dtos/dto"

@Injectable()
export class ProfileService {
    constructor(private readonly db: DbConfigService) {}

    async create(githubProfileDto: GitHubProfileDto) {
        try {
            const profile = await this.db.gitHubProfile.create({
                data: githubProfileDto
            })

            return profile

        } catch (error) {


            if (error instanceof Prisma.PrismaClientKnownRequestError) {

                switch (error.code) {

                    case "P2002":
                        // Unique constraint failed
                        throw new ConflictException(
                            `Profile with this ${error.meta?.target} already exists.`,
                        )

                    case "P2003":
                        // Foreign key constraint
                        throw new BadRequestException("Invalid relation reference.")

                    case "P2025":
                        // Record not found
                        throw new BadRequestException("Record not found.")

                    default:
                        throw new InternalServerErrorException(
                            "Database operation failed.",
                        )
                }
            }

            throw new InternalServerErrorException(
                "Unexpected error occurred.",
            )
        }
    }
}
