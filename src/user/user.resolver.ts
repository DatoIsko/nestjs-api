import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { CommentService } from 'src/comment/comment.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private userService: UserService,
    private commentService: CommentService
  ) {}

  @Query('users')
  getUsers(@Args('page') page: number, @Args('limit') limit: number) {
    return this.userService.shawAll({ page, limit });
  }

  @ResolveProperty()
  comments(@Parent() user) {
    const { id } = user;
    return this.commentService.showByUser(id);
  }

}
