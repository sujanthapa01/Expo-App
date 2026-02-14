import {Controller, Body, Post} from "@nestjs/common"
import {ProfileService} from "./profile.service";
import {GitHubProfileDto} from "./dtos/dto"

@Controller()
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Post()
    async createProfile(@Body() githubProfileDto: GitHubProfileDto){
        return this.profileService.create(githubProfileDto)
    }
}