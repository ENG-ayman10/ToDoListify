import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create.dto';
import { FullUserData } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadInterface } from 'src/auth/interfaces';
import { omitObjectKeys } from 'src/utils/omit.util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name, {timestamp: true});
    constructor( 
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async create( createUserDto: CreateUserDto ): Promise<FullUserData> {
        const user: UserEntity = this.userRepository.create();
        Object.assign(user, omitObjectKeys(createUserDto, ['confirmation']));
        user.salt = await bcrypt.genSalt(
            Number.parseInt(
                this.configService.get<string>("TODOLISTIFY_PASSWORD_SALT_RANGE", "12")
            )
        );
        user.password = await bcrypt.hash(createUserDto.password, user.salt);
        try {
            return this.formatUserData(await user.save());
        } catch(error) {
            if  (error.code == '23505' )
                throw new HttpException(`Username/Email is already registered!`, HttpStatus.FOUND);
            throw new InternalServerErrorException();
        }
    }

    private formatUserData( user: UserEntity ): FullUserData {
        const payload: JwtPayloadInterface = { id: user.id, username: user.username };
        const expiresIn: string = this.configService.get<string>("TODOLISTIFY_JWT_LONG_EXPIRESIN", '3d');
        this.logger.log(`Create tokens for '${user.username}'`);
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, {expiresIn}),
            user: omitObjectKeys(
                user, 
                ['password', 'salt', 'state']
            ) as UserEntity
        }
    }
}
