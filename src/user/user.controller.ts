import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @IsPublic()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return users;
    } catch (e) {
      return null;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() newData: Partial<User>) {
    try {
      const user = await this.userService.findById(+id);
      if (!user) {
        return { errors: ['Usuário não encontrado.'] };
      }
      const updatedUser = await this.userService.update(+id, newData);
      const { id: userId, name, email } = updatedUser;

      return { id: userId, name, email };
    } catch (e) {
      return { errors: [e.message] };
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(+id);
      if (!user) {
        return { errors: ['Usuário não encontrado.'] };
      }
      await this.userService.delete(+id);
      return 'Usuário deletado com sucesso! Faça login ou crie sua conta novamente.';
    } catch (e) {
      return { errors: [e.message] };
    }
  }
}
