import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum TopLevelCategory {
	Courses,
	Services,
	Books,
	Products,
}

@Schema({ _id: false })
export class HhData {
	@Prop()
	count: number;
	@Prop()
	juniorSalary: number;
	@Prop()
	middleSalary: number;
	@Prop()
	seniorSalary: number;
}

@Schema({ _id: false })
export class Advantage {
	@Prop()
	title: string;
	@Prop()
	description: string;
}

export type TopPageDocument = HydratedDocument<TopPageModel>;

@Schema()
export class TopPageModel {
	@Prop({ enum: TopLevelCategory })
	firstLevelCategory: TopLevelCategory;

	@Prop()
	secondCategory: string;

	@Prop({ unique: true })
	alias: string;

	@Prop()
	title: string;

	@Prop()
	category: string;

	@Prop(HhData)
	hh?: HhData;

	@Prop([Advantage])
	advantages: Advantage[];

	@Prop()
	seoText: string;

	@Prop()
	tagsTitle: string;

	@Prop([String])
	tags: string[];
}

export const TopPageSchema = SchemaFactory.createForClass(TopPageModel);

TopPageSchema.index({ '$**': 'text' });
