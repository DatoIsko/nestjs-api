import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CommentDTO } from './comment.dto';

@Resolver('Comment')
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query()
  comment(@Args('id') id: string) {
    return this.commentService.show(id);
  }

  @Mutation('createComment')
  @UseGuards(new AuthGuard())
  create(
    @Context('user') user,
    @Args('idea') ideaId: string,
    @Args('comment') comment: string
  ) {
    const { id: userId } = user;
    const data: CommentDTO = { comment };
    return this.commentService.create(ideaId, userId, data);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  deleteComment(@Args('id') id: string, @Context('user') user) {
    const { id: userId } = user;
    return this.commentService.destroy(id, userId);
  }
}
