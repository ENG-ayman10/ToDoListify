import { 
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
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
import { LoginDto } from './dtos/login.dto';
import { UpdateUserDto } from './dtos/update.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { DeleteDto } from './dtos/delete.dto';
import { UserState } from './enums/user-state.enum';

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

    async login( loginDto: LoginDto ): Promise<FullUserData> {
        const user = await this.userRepository.findOne({ where: {username: loginDto.username}});
        if (!user) throw new NotFoundException(`User '${loginDto.username}' NOT found!`);
        const loginHashPassword = await bcrypt.hash(loginDto.password, user.salt);
        if ( 
            user.password !== loginHashPassword 
        ) throw new UnauthorizedException("Invalid password!");
        this.logger.log(`User '${user.username}' logging.`);
        return this.formatUserData(user);
    }

    async refresh(refreshToken: string|undefined ): Promise<FullUserData> {
        if (!refreshToken) throw new UnauthorizedException();
        try {
            const decoded: JwtPayloadInterface = this.jwtService.verify(refreshToken, {ignoreExpiration: false});
            const user = await this.userRepository.findOne({where: {username: decoded.username} });
            if (!user) throw new UnauthorizedException();
            return this.formatUserData(user);
        } catch( _ ) {
            throw new UnauthorizedException();
        }
    }

    async updateInfo( updateUserDto: UpdateUserDto, user: UserEntity ): Promise<FullUserData> {
        const updateUserDtoKeys: string[] = Object.keys(updateUserDto);
        const updatefields: string[] = [ 'name', 'username', 'email' ];
        if (
            updateUserDtoKeys.length > updatefields.length ||
            updateUserDtoKeys.length < 1 ||
            !updateUserDtoKeys.every( (key) => updatefields.includes(key) )
        ) throw new BadRequestException("Invalid body!");
        Object.assign(user, updateUserDto);
        return this.formatUserData(await user.save());
    }

    async updatePass( updatePasswordDto: UpdatePasswordDto, user: UserEntity): Promise<void> {
        const oldPasswordHash = await bcrypt.hash(updatePasswordDto.oldPassword, user.salt);
        if ( oldPasswordHash !== user.password ) throw new UnauthorizedException();
        user.password = await bcrypt.hash(updatePasswordDto.password, user.salt);
        await user.save();
        return;
    }

    async delete(deleteDto: DeleteDto, user: UserEntity): Promise<void> {
        if (
            (await bcrypt.hash(deleteDto.password, user.salt)) !== user.password
        ) throw new UnauthorizedException();
        user.state = UserState.INACTIVE;
        await user.save();
        return;
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
