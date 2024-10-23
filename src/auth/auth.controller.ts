import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { Allow } from 'src/decorators/allow.decorator';
import { ApiResponse } from 'src/responses/api.response';

@Controller('auth')
@ApiTags('Auth')
@Allow()
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('login')
    async login(@Body() loginDto: loginDto) {
        return new ApiResponse(true, "Logged in Successfully", await this.authService.login(loginDto))
    }

    @Get('profile')
    test() {
        return "Helloooo I'm testing"
    }

}
