import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { HttpError } from 'src/errors/errors.service';
import { QueryIssuesDto } from './dto/querry-issue.dto';
import type { Response } from 'express';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  create(@Body() dto: CreateIssueDto) {
    if (dto.title.length < 3)
      throw new HttpError(400, 'Title must be at least 3 characters.');
    if (dto.description.length < 10)
      throw new HttpError(400, 'Description must be at least 10 characters.');
    return this.issuesService.create(dto);
  }
  @Post(':id/comment')
  createComment(
    @Body() dto: CreateCommentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!id) throw new HttpError(400, 'Id is required');
    if (!dto.body) throw new HttpError(400, 'Body is required');
    return this.issuesService.createComment(dto.body, id);
  }

  @Get()
  async findAll(
    @Query() dto: QueryIssuesDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { total, issues } = await this.issuesService.findAll(dto);
    res.setHeader('X-Total-Count', String(total));
    res.setHeader('Acces-Control-Expose-Headers', 'X-total-Count');
    return issues;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.issuesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIssueDto: UpdateIssueDto,
  ) {
    return this.issuesService.update(id, updateIssueDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.issuesService.remove(id);
  }
}
