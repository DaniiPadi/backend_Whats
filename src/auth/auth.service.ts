import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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

  /**
   * Registra un nuevo usuario y devuelve un enlace de WhatsApp.
   */
  async register(createUserDto: CreateUserDto): Promise<{ user: User; whatsappLink: string; }> {
    try {
      // 1. Crear la entidad de usuario con los datos del DTO
      const newUser = this.userRepo.create({
        username: createUserDto.username,
        phone: createUserDto.phone,
        // No se manejan otros campos como contraseña o rol
      });

      // 2. Guardar el nuevo usuario en la base de datos
      const savedUser = await this.userRepo.save(newUser);

      // 3. Generar el enlace de WhatsApp
      const celular = savedUser.phone?.replace('+', ''); // Quita el '+' si existe
      const mensaje = encodeURIComponent(`Hola ${savedUser.username}, gracias por registrarte.`);
      const whatsappLink = `https://wa.me/${celular}?text=${mensaje}`;

      // 4. Devolver el objeto con el usuario y el enlace
      return {
        user: savedUser,
        whatsappLink,
      };
      
    } catch (error) {
      // Manejo de error si el teléfono ya existe (asumiendo que es único)
      if (error.code === '23505') { // Código de error de PostgreSQL para violación de restricción única
        throw new UnprocessableEntityException('El número de teléfono ya está en uso.');
      }
      throw new Error(`Error al crear el usuario: ${error.message}`);
    }
  }
}