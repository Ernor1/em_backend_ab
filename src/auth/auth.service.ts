import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { Prisma, User, Status, Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginPayload } from './dto/login-payload';




type TokenProps = {
    id: string
    email: string
    userName: string
    roles: Role[]
    status: Status
}
type UserWithRoles = Prisma.UserGetPayload<{
    include: { roles: true }
}>

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService, private readonly jwtService: JwtService) { }

    async login(loginDto: loginDto): Promise<LoginPayload> {
        const user: UserWithRoles = await this.validateUser(loginDto.email, loginDto.password);
        const tokenProps: TokenProps = {
            id: user.id,
            email: user.email,
            userName: user.firstName,
            status: user.status,
            roles: user.roles
        }

        const loginPayload: LoginPayload = {
            id: user.id,
            email: user.email,
            userName: user.firstName,
            status: user.status,
            token: this.jwtService.sign(tokenProps)
        };

        return loginPayload;
    }
    async validateUser(email: string, password: string) {
        let user: UserWithRoles = await this.userService.findUserByEmail(email)
        if (!user) {
            throw new NotFoundException("User Not Found")
        }
        let isMatch: boolean = await bcrypt.compare(password, user.password)
        if (isMatch) {
            return user
        } else {
            throw new BadRequestException("Wrong email or password")
        }

    }
}
