import { UserDTO } from './user.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Query,
  Param
} from '@nestjs/common';
import { UserService } from './user.service';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/shared/user.decorator';
import { IQuery } from 'src/shared/query.interface';

@Controller()
export class UserController {
  constructor(private userService: UserService) { }

  @Get('api/users')
  // @UseGuards(new AuthGuard())
  showAllUsers(@Query() query: IQuery) {
    return this.userService.shawAll(query);
  }

  @Get('auth/users/:username')
  showOneUser(@Param('username') username: string) {
    return this.userService.read(username);
  }

  @Get('auth/whoami')
  @UseGuards(new AuthGuard())
  showMe(@User('username') username: string) {
    return this.userService.read(username);
  }

  @Post('auth/login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: UserDTO) {
    return this.userService.login(data);
  }

  @Post('auth/register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserDTO) {
    return this.userService.register(data);
  }
}
