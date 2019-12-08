import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveProperty,
  Parent,
  Context
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { IdeaRO, IdeaDTO } from './idea.dto';
import { IdeaService } from './idea.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { CommentService } from 'src/comment/comment.service';

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

  @Query('myIdeas')
  @UseGuards(new AuthGuard())
  showAllIdeas(
    @Context('user') user,
    @Args('page') page: number,
    @Args('limit') limit: number,
    @Args('newest') order: boolean
  ) {
    const { id: userId } = user;
    return this.ideaService.findAllByUser(userId, {
      order,
      page,
      limit
    });
  }

  @Mutation('createIdea')
  @UseGuards(new AuthGuard())
  async create(
    @Context('user') user,
    @Args('idea') idea: string,
    @Args('description') description: string
  ): Promise<IdeaRO> {
    const { id } = user;
    const data: IdeaDTO = { idea, description };
    const createdIdea = await this.ideaService.create(id, data);
    return createdIdea;
  }

  @Mutation('updateIdea')
  @UseGuards(new AuthGuard())
  update(
    @Context('user') user,
    @Args('id') id: string,
    @Args('idea') idea: string,
    @Args('description') description: string
  ) {
    const { id: userId } = user;
    const data = { idea, description };
    return this.ideaService.update(id, userId, data);
  }

  @Mutation('deleteIdea')
  @UseGuards(new AuthGuard())
  delete(@Args('id') id: string, @Context('user') user) {
    const { id: userId } = user;
    return this.ideaService.destroy(id, userId);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  upvote(@Args('id') id: string, @Context('user') user) {
    const { id: userId } = user;
    return this.ideaService.upvote(id, userId);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  downvote(@Args('id') id: string, @Context('user') user) {
    const { id: userId } = user;
    return this.ideaService.downvote(id, userId);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  bookmark(@Args('id') id: string, @Context('user') user) {
    const { id: userId } = user;
    return this.ideaService.bookmark(id, userId);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  unbookmark(@Args('id') id: string, @Context('user') user) {
    const { id: userId } = user;
    return this.ideaService.unbookmark(id, userId);
  }
}
