import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('ReviewService', () => {
	let service: ReviewService;

	const exec = { exec: jest.fn() };
	const reviewRepositryFactory = () => ({
		find: () => exec,
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ReviewService, { useFactory: reviewRepositryFactory, provide: getModelToken('ReviewModel') }],
		}).compile();

		service = module.get<ReviewService>(ReviewService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('findByProductId working', async () => {
		const id = new Types.ObjectId().toHexString();
		reviewRepositryFactory()
			.find()
			.exec.mockReturnValueOnce([{ productId: id }]);
		const res = await service.findByProductId(id);
		expect(res[0].productId).toBe(id);
	});
});
