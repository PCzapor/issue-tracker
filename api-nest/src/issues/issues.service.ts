import { Injectable } from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { PrismaService } from 'prisma/prisma.service';
import { QueryIssuesDto } from './dto/querry-issue.dto';
import { HttpError } from 'src/errors/errors.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class IssuesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateIssueDto) {
    const issue = await this.prisma.issues.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status ?? 'open',
        priority: dto.priority ?? 'medium',
      },
    });
    return issue;
  }
  async createComment(body: string, issueId: number) {
    const exists = await this.prisma.issues.findUnique({
      where: { id: issueId },
      select: { id: true },
    });
    if (!exists) throw new HttpError(400, 'Issue not found');
    return this.prisma.comments.create({
      data: { issueId, body },
    });
  }

  async findAll(dto: QueryIssuesDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (dto.priority) where.priority = dto.priority;
    if (dto.status) where.status = dto.status;

    if (dto.q) {
      where.OR = [
        { title: { contains: dto.q, mode: 'insensitive' } },
        {
          description: { contains: dto.q, mode: 'insensitive' },
        },
      ];
    }
    const orderBy = dto.sort
      ? { [dto.sort]: dto.order ?? 'desc' }
      : { createdAt: 'desc' as const };
    const [issues, total] = await this.prisma.$transaction([
      this.prisma.issues.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { _count: { select: { comments: true } } },
      }),
      this.prisma.issues.count({ where }),
    ]);
    return {
      issues,
      total,
    };
  }

  findOne(id: number) {
    return this.prisma.issues.findUnique({
      where: { id },
      include: { comments: { orderBy: { createdAt: 'desc' } } },
    });
  }

  update(id: number, dto: UpdateIssueDto) {
    return this.prisma.issues.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.issues.delete({ where: { id } });
  }
}
