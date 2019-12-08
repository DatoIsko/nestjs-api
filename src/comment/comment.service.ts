import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { CommentDTO, CommentRO } from './comment.dto';
import { IdeaEntity } from 'src/idea/idea.entity';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  private toResponseObject(comment: CommentEntity): CommentRO | any {
    const resObj: any = comment;

    if (resObj.author) {
      resObj.author = comment.author.toResponseObject(false);
    }

    return resObj;
  }

  private ensureOwnership(comment: CommentEntity, userId: string) {
    if (comment.author.id !== userId) {
      throw new HttpException(
        `You'r not owner of this comment`,
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async create(
    ideaId: string,
    userId: string,
    data: CommentDTO
  ): Promise<CommentEntity> {
    const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });

    if (!idea) {
      throw new HttpException('Idea not fount', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
    const comment = await this.commentRepository.create({
      ...data,
      idea,
      author: user
    });

    await this.commentRepository.save(comment);
    return this.toResponseObject(comment);
  }

  async showByIdea(id: string): Promise<CommentEntity[]> {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['comments', 'comments.author', 'comments.idea']
    });

    return idea.comments.map(comment => this.toResponseObject(comment));
  }

  async showByUser(id: string): Promise<CommentEntity[]> {
    const comments = await this.commentRepository.find({
      where: { author: { id } },
      relations: ['author']
    });

    return comments.map(comment => this.toResponseObject(comment));
  }

  async show(id: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'idea']
    });

    if (!comment) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return this.toResponseObject(comment);
  }

  async destroy(id: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'idea']
    });

    if (!comment) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(comment, userId);
    await this.commentRepository.delete({ id });

    return this.toResponseObject(comment);
  }
}
