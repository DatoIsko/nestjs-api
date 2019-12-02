import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { IdeaEntity } from './idea.entity';
import { IdeaDTO } from './idea.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>
  ) {}

  async findAll() {
    return await this.ideaRepository.find();
  }

  async create(data: IdeaDTO) {
    const idea = await this.ideaRepository.create(data);
    await this.ideaRepository.save(idea);
    return idea;
  }

  async findOne(id: string) {
    const idea = await this.ideaRepository.findOne({ where: { id } });

    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return idea;
  }

  async update(id: string, data: Partial<IdeaDTO>) {
    const idea = await this.ideaRepository.findOne({ where: { id } });

    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.ideaRepository.update({ id }, data);

    return await this.ideaRepository.findOne({ where: { id } });
  }

  async destroy(id: string) {
    const idea = await this.ideaRepository.findOne({ where: { id } });

    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.ideaRepository.delete({ id });

    return idea;
  }
}
