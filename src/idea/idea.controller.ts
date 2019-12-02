import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  Logger
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Controller('idea')
export class IdeaController {
  private logger = new Logger('IdeaController');
  constructor(private readonly ideaService: IdeaService) {}

  @Get()
  showAllIdeas() {
    return this.ideaService.findAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createIdea(@Body() data: IdeaDTO) {
    this.logger.log(JSON.stringify(data));
    return this.ideaService.create(data);
  }

  @Get(':id')
  readIdea(@Param('id') id: string) {
    this.logger.log(id);
    return this.ideaService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDTO>) {
    this.logger.log(JSON.stringify(data));
    return this.ideaService.update(id, data);
  }

  @Delete(':id')
  destroyIdea(@Param('id') id: string) {
    this.logger.log(id);
    return this.ideaService.destroy(id);
  }
}
