import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { UserDTO, UserRO } from './user.dto';
import { IQuery } from 'src/shared/query.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async shawAll(q?: IQuery): Promise<UserRO[]> {
    const limit = (q && q.limit) || 25;
    const page = (q && q.page) || 1;
    const users = await this.userRepository.find({
      relations: ['ideas', 'bookmarks'],
      take: limit,
      skip: limit * (page - 1)
    });

    return users.map(user => user.toResponseObject(false));
  }

  async read(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['ideas', 'bookmarks']
    });

    return user.toResponseObject(false);
  }

  async login(data: UserDTO): Promise<UserRO> {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST
      );
    }

    return user.toResponseObject();
  }

  async register(data: UserDTO): Promise<UserRO> {
    const { username, password } = data;
    let user = await this.userRepository.findOne({ where: { username } });

    if (user) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    }

    user = await this.userRepository.create(data);
    await this.userRepository.save(user);

    return user.toResponseObject();
  }
}
