import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from './top-page.service';
import { CreateTopPageModelDto } from './dto/create-top-page.dto';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
	constructor(private readonly topPageService: TopPageService) {}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateTopPageModelDto) {
		return this.topPageService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async getById(@Param('id', IdValidationPipe) id: string) {
		const topPage = await this.topPageService.findById(id);
		if (!topPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
		}
		return topPage;
	}

	@Get('byAlias/:alias')
	async getByAlias(@Param('alias') alias: string) {
		const topPages = await this.topPageService.findByAlias(alias);
		if (!topPages) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
		}
		return topPages;
	}

	@Get('textSearch/:text')
	async getByTextSearch(@Param('text') text: string) {
		return this.topPageService.findByText(text);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedTopPage = await this.topPageService.deleteById(id);
		if (!deletedTopPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
		}
		return deletedTopPage;
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Patch(':id')
	async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTopPageModelDto) {
		const patchedTopPage = await this.topPageService.patchById(id, dto);
		if (!patchedTopPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
		}
		return patchedTopPage;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindTopPageDto) {
		return this.topPageService.findByCategory(dto);
	}
}
