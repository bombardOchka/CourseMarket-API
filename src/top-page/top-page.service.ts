import { Injectable } from '@nestjs/common';
import { TopPageDocument, TopPageModel } from './top-page.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTopPageModelDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Injectable()
export class TopPageService {
	constructor(@InjectModel(TopPageModel.name) private readonly topPageModel: Model<TopPageDocument>) {}

	async create(dto: CreateTopPageModelDto) {
		return this.topPageModel.create(dto);
	}

	async findAll() {
		return this.topPageModel.find().exec();
	}

	async findByAlias(alias: string) {
		return this.topPageModel.findOne({ alias }).exec();
	}

	async findById(id: string) {
		return this.topPageModel.findById(id).exec();
	}

	async findByText(text: string) {
		return this.topPageModel.find({ $text: { $search: text, $caseSensitive: false } }).exec();
	}

	async deleteById(id: string) {
		return this.topPageModel.findByIdAndDelete(id).exec();
	}

	async patchById(id: string, dto: CreateTopPageModelDto) {
		return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async findByCategory(dto: FindTopPageDto) {
		return this.topPageModel
			.aggregate()
			.match({
				firstLevelCategory: dto.firstCategory,
			})
			.group({
				_id: { secondCategory: 'secondCategory' },
				pages: { $push: { alias: '$alias', title: '$title' } },
			})
			.exec();
	}
}
