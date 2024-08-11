import { Module } from '@nestjs/common';
import { SitemapController } from './sitemap.controller';
import { TopPageService } from 'src/top-page/top-page.service';
import { ConfigModule } from '@nestjs/config';
import { TopPageModule } from 'src/top-page/top-page.module';

@Module({
	controllers: [SitemapController],
	imports: [ConfigModule, TopPageModule],
	providers: [TopPageService],
})
export class SitemapModule {}
