import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveProperty,
  Parent
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/shared/user.decorator';
import { IdeaRO, IdeaDTO } from './idea.dto';
import { IdeaService } from './idea.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { CommentService } from 'src/comment/comment.service';

// const pubSub = new PubSub();

@Resolver('Idea')
export class IdeaResolver {
  constructor(
    private ideaService: IdeaService,
    private commentService: CommentService
  ) {}

  @Query('ideas')
  getIdeas(
    @Args('page') page: number,
    @Args('limit') limit: number,
    @Args('newest') newest: boolean
  ) {
    return this.ideaService.findAll({
      order: newest,
      page,
      limit
    });
  }

  @ResolveProperty()
  comments(@Parent() idea) {
    const { id } = idea;
    return this.commentService.showByIdea(id);
  }
}
