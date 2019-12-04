import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  Logger,
  UseGuards
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO, IdeaRO } from './idea.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { UserRO } from 'src/user/user.dto';
import { User } from 'src/shared/user.decorator';

@Controller('api/ideas')
export class IdeaController {
  private logger = new Logger('IdeaController');
  constructor(private readonly ideaService: IdeaService) {}

  private logData(options: any) {
    if (options.user) {
      this.logger.log(`USER ${JSON.stringify(options.user)}`);
    }
    if (options.data) {
      this.logger.log(`DATA ${JSON.stringify(options.data)}`);
    }
    if (options.id) {
      this.logger.log(`IDEA ${JSON.stringify(options.id)}`);
    }
  }

  @Get()
  @UseGuards(new AuthGuard())
  showAllIdeas(@User('id') userId) {
    return this.ideaService.findAll(userId);
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createIdea(@User('id') user, @Body() data: IdeaDTO) {
    this.logData({ user, data });
    return this.ideaService.create(user, data);
  }

  @Get(':id')
  readIdea(@Param('id') id: string) {
    this.logger.log(id);
    return this.ideaService.findOne(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateIdea(
    @Param('id') id: string,
    @User('id') user: string,
    @Body() data: Partial<IdeaDTO>
  ) {
    this.logData({ id, user, data });
    return this.ideaService.update(id, user, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyIdea(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.ideaService.destroy(id, user);
  }

  @Post(':id/upvote')
  @UseGuards(new AuthGuard())
  upvoteIdea(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.ideaService.upvote(id, user);
  }

  @Post(':id/downvote')
  @UseGuards(new AuthGuard())
  downvoteIdea(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.ideaService.downvote(id, user);
  }

  @Post(':id/bookmark')
  @UseGuards(new AuthGuard())
  bookmarkIdea(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.ideaService.bookmark(id, user);
  }

  @Delete(':id/bookmark')
  @UseGuards(new AuthGuard())
  unbookmarkIdea(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.ideaService.unbookmark(id, user);
  }
}
