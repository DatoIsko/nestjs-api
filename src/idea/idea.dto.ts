/*tslint:disable max-classes-per-file*/
import { IsString } from 'class-validator';
import { UserRO } from 'src/user/user.dto';
import { CommentRO } from 'src/comment/comment.dto';

export class IdeaDTO {
  @IsString()
  readonly idea: string;

  @IsString()
  readonly description: string;
}

export class IdeaRO {
  id?: string;
  created: Date;
  updated: Date;
  idea: string;
  description: string;
  comments: CommentRO[];
  author: UserRO;
  upvotes?: number;
  downvotes?: number;
}
