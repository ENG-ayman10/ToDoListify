import { UserEntity } from "./entities/user.entity";

export interface FullUserData {
    accessToken: string;
    refreshToken: string;
    user: UserEntity;
}