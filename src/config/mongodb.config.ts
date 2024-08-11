import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const getMongoDBConfig = async (configService: ConfigService): Promise<MongooseModuleFactoryOptions> => {
	const mongoLogin = configService.get<string>('MONGO_LOGIN');
	const mongoPassword = configService.get<string>('MONGO_PASSWORD');
	const mongoHost = configService.get<string>('MONGO_HOST');
	const mongoPort = configService.get<string>('MONGO_PORT');
	const uri = `mongodb://${mongoLogin}:${mongoPassword}@${mongoHost}:${mongoPort}`;
	console.log('MongoDB Connection URI:', uri);
	return {
		uri,
	};
};
