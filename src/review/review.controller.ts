import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewDocument } from './review.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { TelegramService } from 'src/telegram/telegram.service';

@Controller('review')
export class ReviewController {
	constructor(
		private readonly reviewService: ReviewService,
		private readonly telegramService: TelegramService,
	) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto): Promise<ReviewDocument> {
		return this.reviewService.create(dto);
	}

	@UsePipes(new ValidationPipe())
	@Post('notify')
	async notify(@Body() dto: CreateReviewDto) {
		const message =
			`Имя: ${dto.name}\n` +
			`Заголовок: ${dto.title}\n` +
			`Описание: ${dto.description}\n` +
			`Рейтинг: ${dto.rating}\n` +
			`ID Продукта: ${dto.productId}`;
		return this.telegramService.sendMessage(message);
	}

	@Get('findByProduct/:productId')
	async get(@Param('productId') productId: string): Promise<ReviewDocument[]> {
		return this.reviewService.findByProductId(productId);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string): Promise<ReviewDocument> {
		const deletedDoc = await this.reviewService.delete(id);
		if (!deletedDoc) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedDoc;
	}

	@UseGuards(JwtAuthGuard)
	@Delete('deleteByProductId/:productId')
	async deleteByProductId(@Param('productId', IdValidationPipe) productId: string): Promise<{ deletedCount?: number }> {
		const deletedDocs = await this.reviewService.deleteByProductId(productId);
		return deletedDocs;
	}
}
