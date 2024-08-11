import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '../src/auth/auth.constants';

const testDto: AuthDto = {
	login: 'dwadwadd@gmail.com',
	password: 'wadwadwadwad222',
};

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let acces_token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/login (POST) - succes', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(testDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				acces_token = body.acces_token;
				expect(acces_token).toBeDefined();
			});
	});

	it('/auth/login (POST) - fail password', () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...testDto, password: 'dwadw' })
			.expect(401, {
				statusCode: 401,
				error: 'Unauthorized',
				message: WRONG_PASSWORD_ERROR,
			});
	});

	it('/auth/login (POST) - fail login', () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...testDto, login: 'dabobadw@gmail.com' })
			.expect(401, {
				statusCode: 401,
				error: 'Unauthorized',
				message: USER_NOT_FOUND_ERROR,
			});
	});

	afterAll(() => {
		disconnect();
	});
});
