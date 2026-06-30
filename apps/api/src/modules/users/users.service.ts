import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

const userInclude = {
  roles: { include: { role: true } },
  branches: { include: { branch: true } },
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('A user with this email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        roles: dto.roleIds ? { create: dto.roleIds.map((roleId) => ({ roleId })) } : undefined,
        branches: dto.branchIds
          ? { create: dto.branchIds.map((branchId) => ({ branchId })) }
          : undefined,
      },
      include: userInclude,
    });
  }

  findAll() {
    return this.prisma.user.findMany({ include: userInclude, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, include: userInclude });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    if (dto.roleIds) {
      await this.prisma.userRole.deleteMany({ where: { userId: id } });
      await this.prisma.userRole.createMany({
        data: dto.roleIds.map((roleId) => ({ userId: id, roleId })),
      });
    }
    if (dto.branchIds) {
      await this.prisma.userBranch.deleteMany({ where: { userId: id } });
      await this.prisma.userBranch.createMany({
        data: dto.branchIds.map((branchId) => ({ userId: id, branchId })),
      });
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        isActive: dto.isActive,
      },
      include: userInclude,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data: { isActive: false } });
  }
}
