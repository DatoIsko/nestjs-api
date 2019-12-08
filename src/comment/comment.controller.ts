import {
  Controller,
  Post,
  Logger,
  UseGuards,
  UsePipes,
  Body,
  Get,
  Param,
  Delete
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { User } from 'src/shared/user.decorator';
import { AuthGuard } from 'src/shared/auth.guard';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { CommentDTO } from './comment.dto';

@Controller('api/comments')
export class CommentController {
  private logger = new Logger('CommentController');
  constructor(private commentService: CommentService) {}

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
    if (options.comment) {
      this.logger.log(`COMMENT ${JSON.stringify(options.comment)}`);
    }
  }

  @Get('idea/:id')
  showCommentsByIdea(@Param('id') id: string) {
    this.logger.log(id);
    return this.commentService.showByIdea(id);
  }

  @Get('user/:id')
  showCommentsByUser(@Param('id') id: string) {
    this.logger.log(id);
    return this.commentService.showByUser(id);
  }

  @Post('idea/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createComment(
    @Param('id') idea: string,
    @User('id') user: string,
    @Body() data: CommentDTO
  ) {
    this.logData({ idea, user, data });
    return this.commentService.create(idea, user, data);
  }

  @Get(':id')
  showComment(@Param('id') id: string) {
    this.logger.log(id);
    return this.commentService.show(id);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyComment(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.commentService.destroy(id, user);
  }
}
