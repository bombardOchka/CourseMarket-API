import { Controller, Get, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TopPageService } from 'src/top-page/top-page.service';
import { addDays, format } from 'date-fns';
import { Builder } from 'xml2js';
import { CATEGORY_URL } from './sitemap.constants';

@Controller('sitemaps')
export class SitemapController {
	domain: string;

	constructor(
		private readonly topPageService: TopPageService,
		private readonly configService: ConfigService,
	) {
		this.domain = this.configService.get('DOMAIN') ?? '';
	}

	@Get('xml')
	@Header('content-type', 'text/xml')
	async sitemap() {
		const formatString = "yyyy-MM-dd'T'THH:mm:00.000xxxx";
		let res = [
			{
				loc: this.domain,
				lastmod: format(addDays(new Date(), -1), formatString),
				changefreq: 'daily',
				priority: '1.0',
			},
			{
				loc: `${this.domain}/courses`,
				lastmod: format(addDays(new Date(), -1), formatString),
				changefreq: 'daily',
				priority: '1.0',
			},
		];
		const pages = await this.topPageService.findAll();
		res = res.concat(
			pages.map((page) => {
				return {
					loc: `${this.domain}${CATEGORY_URL[page.firstLevelCategory]}/${page.alias}`,
					lastmod: format(addDays(new Date(), -1), formatString),
					changefreq: 'weekly',
					priority: '0.7',
				};
			}),
		);
		const builder = new Builder({
			xmldec: { version: '1.0', encoding: 'UTF-8' },
		});
		return builder.buildObject({
			urlset: {
				$: {
					xmlns: 'http://www.sitemaps.org/schemas/sitemaps/0.9',
				},
				url: res,
			},
		});
	}
}
