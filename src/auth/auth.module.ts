import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // importante
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([User])], 
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
