import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModel, AuthSchema } from './auth.model';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTConfig } from 'src/config/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	controllers: [AuthController],
	imports: [
		MongooseModule.forFeature([{ name: AuthModel.name, schema: AuthSchema }]),
		JwtModule.registerAsync({ imports: [ConfigModule], inject: [ConfigService], useFactory: getJWTConfig }),
		ConfigModule,
		PassportModule,
	],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
