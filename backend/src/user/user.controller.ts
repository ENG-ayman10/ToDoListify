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
        @Res() res: Response // INFO: Use to set the cookies.
    ) {
        this.logger.log(`POST ${this.API_PATH}/register`);
        const fullData: FullUserData = await this.userService.create(createUserDto);
        res.cookie('refreshToken', fullData.refreshToken, refreshTokenCookieConfig );
        res.status(HttpStatus.CREATED).json(omitObjectKeys(fullData, ['refreshToken']));
    }

    @Post('login')
    login(
        @Res() res: Response // INFO: Use to set the cookies.
    ) {
        this.logger.log(`POST ${this.API_PATH}/login`);
    }

    @Get('refresh')
    refresh(
        @Req() req: Request, // INFO: Use to get the cookies.
        @Res() res: Response // INFO: Use to set the cookies.
    ) {
        this.logger.log(`GET ${this.API_PATH}/refresh`);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update/info')
    updateInformation(
        @GetUser() user: UserEntity,
        @Res() res: Response // INFO: Use to update the cookies.
    ) {
        this.logger.log(`PATCH ${this.API_PATH}/update/info`);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update/pass')
    updatePassword(
        @GetUser() user: UserEntity,
        @Res() res: Response // INFO: Use to update the cookies.
    ) {
        this.logger.log(`PATCH ${this.API_PATH}/update/pass`);
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete('delete')
    delete(
        @GetUser() user: UserEntity,
        @Res() res: Response // INFO: Use to delete the cookies.
    ) {
        this.logger.log(`DELETE ${this.API_PATH}/delete`);
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(
        @GetUser() user: UserEntity,
        @Res() res: Response // INFO: Use to delete the cookies.
    ) {
        this.logger.log(`PATCH ${this.API_PATH}/logout`);
    }
}
