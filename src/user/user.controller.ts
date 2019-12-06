import { UserDTO } from './user.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Query
} from '@nestjs/common';
import { UserService } from './user.service';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/shared/user.decorator';
import { IQuery } from 'src/shared/query.interface';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/users')
  // @UseGuards(new AuthGuard())
  showAllUsers(@Query() query: IQuery) {
    return this.userService.shawAll(query);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: UserDTO) {
    return this.userService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserDTO) {
    return this.userService.register(data);
  }
}
