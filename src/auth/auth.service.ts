import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/auth/dto/userdto';
import { User } from 'src/auth/entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepo.create({
        username: createUserDto.username,
        phone: createUserDto.phone,
      });

      return await this.userRepo.save(user);
    } catch (error) {
      throw new Error(`Error al crear el usuario: ${error.message}`);
    }
  }
}
