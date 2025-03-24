import { 
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Logger,
    Patch,
    Post,
    Req,
    Res,
    UseGuards,
    ValidationPipe
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { GetUser } from './decorators/get-user.decorator';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create.dto';
import { FullUserData } from './interfaces';
import { refreshTokenCookieConfig } from 'src/config/cookies.config';
import { omitObjectKeys } from 'src/utils/omit.util';
import { LoginDto } from './dtos/login.dto';
import { UpdateUserDto } from './dtos/update.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { DeleteDto } from './dtos/delete.dto';

@Controller('user')
export class UserController {
    private readonly logger: Logger = new Logger(UserController.name, {timestamp: true});
    private readonly API_PATH = '/api/v1/user';
    
    constructor(
        private userService: UserService
    ) {}

    @Post('register')
    async create(
        @Body(ValidationPipe) createUserDto: CreateUserDto,
        @Res() res: Response
    ) {
        this.logger.log(`POST ${this.API_PATH}/register`);
        const fullData: FullUserData = await this.userService.create(createUserDto);
        res.cookie('refreshToken', fullData.refreshToken, refreshTokenCookieConfig );
        res.status(HttpStatus.CREATED).json(omitObjectKeys(fullData, ['refreshToken']));
    }

    @Post('login')
    async login(
        @Body(ValidationPipe) loginDto: LoginDto,
        @Res() res: Response
    ) {
        this.logger.log(`POST ${this.API_PATH}/login`);
        const fullData: FullUserData = await this.userService.login(loginDto);
        res.cookie('refreshToken', fullData.refreshToken, refreshTokenCookieConfig );
        res.status(HttpStatus.OK).json(omitObjectKeys(fullData, ['refreshToken']));
    }

    @Get('refresh')
    async refresh(
        @Req() req: Request,
        @Res() res: Response
    ) {
        this.logger.log(`GET ${this.API_PATH}/refresh`);
        const { refreshToken } = req.cookies;
        const fullData: FullUserData = await this.userService.refresh(refreshToken);
        res.cookie('refreshToken', fullData.refreshToken, refreshTokenCookieConfig );
        res.status(HttpStatus.OK).json(omitObjectKeys(fullData, ['refreshToken']));
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update/info')
    async updateInformation(
        @Body(ValidationPipe) updateUserDto: UpdateUserDto,
        @GetUser() user: UserEntity,
        @Res() res: Response
    ) {
        this.logger.log(`PATCH ${this.API_PATH}/update/info`);
        const fullData: FullUserData = await this.userService.updateInfo(updateUserDto, user);
        res.cookie('refreshToken', fullData.refreshToken, refreshTokenCookieConfig );
        res.status(HttpStatus.OK).json(omitObjectKeys(fullData, ['refreshToken']));
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update/pass')
    updatePassword(
        @Body(ValidationPipe) updatePasswordDto: UpdatePasswordDto,
        @GetUser() user: UserEntity,
        
    ) {
        this.logger.log(`PATCH ${this.API_PATH}/update/pass`);
        return this.userService.updatePass(updatePasswordDto, user);
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete('delete')
    async delete(
        @Body(ValidationPipe) deleteDto: DeleteDto,
        @GetUser() user: UserEntity,
        @Res() res: Response
    ) {
        this.logger.log(`DELETE ${this.API_PATH}/delete`);
        await this.userService.delete(deleteDto, user);
        res.cookie("refreshToken", "", {maxAge: 1000, httpOnly: true});
        res.status(200).send();
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(
        @GetUser() user: UserEntity,
        @Res() res: Response
    ) {
        this.logger.log(`PATCH ${this.API_PATH}/logout`);
        res.cookie("refreshToken", "", {maxAge: 1000, httpOnly: true});
        res.status(200).send();
    }
}
