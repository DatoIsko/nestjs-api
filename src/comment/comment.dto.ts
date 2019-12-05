/*tslint:disable max-classes-per-file*/
import { IsString } from 'class-validator';
import { UserRO } from 'src/user/user.dto';
import { IdeaRO } from 'src/idea/idea.dto';

export class CommentDTO {
  @IsString()
  readonly comment: string;
}

export class CommentRO {
  id?: string;
  created: Date;
  comment: string;
  author: UserRO;
  idea: IdeaRO;
}
