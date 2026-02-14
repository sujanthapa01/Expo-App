import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsUrl,
    IsInt,
    Min,
} from 'class-validator'
import { Type } from 'class-transformer'

export class GitHubProfileDto {

    @IsString()
    @IsNotEmpty()
    login: string

    @IsOptional()
    @IsString()
    name?: string | null

    @IsString()
    @IsUrl()
    avatar_url: string

    @IsOptional()
    @IsString()
    bio?: string | null

    @Type(() => Number)
    @IsInt()
    @Min(0)
    followers: number

    @Type(() => Number)
    @IsInt()
    @Min(0)
    following: number

    @Type(() => Number)
    @IsInt()
    @Min(0)
    public_repos: number
}
