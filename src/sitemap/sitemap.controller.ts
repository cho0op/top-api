import { Controller, Get, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { format, subDays } from 'date-fns';
import { Builder } from 'xml2js';
import { TopPageService } from '../top-page/top-page.service';
import { CATEGORY_URL } from './sitemap.contants';

@Controller('sitemap')
export class SitemapController {
  domain: string;

  constructor(
    private readonly topPageService: TopPageService,
    private readonly configService: ConfigService,
  ) {
    this.domain = configService.get('DOMAIN') ?? '';
  }

  @Get('xml')
  @Header('content-type', 'text/xml')
  async sitemap() {
    const formatString = `yyyy-MM-dd-T-HH:mm:00.000xxx`;
    const builder = new Builder({
      xmldec: { version: '1.0', encoding: 'UTF-8' },
    });
    let response = [
      {
        loc: this.domain,
        lastmod: format(subDays(new Date(), 1), formatString),
        changeFreq: 'daily',
        priority: '1',
      },
      {
        loc: `${this.domain}/courses`,
        lastmod: format(subDays(new Date(), 1), formatString),
        changeFreq: 'daily',
        priority: '1',
      },
    ];
    const pages = await this.topPageService.findAll();
    response = response.concat(
      pages.map((page) => {
        return {
          loc: `${this.domain}${CATEGORY_URL[page.firstCategory]}/${
            page.alias
          }`,
          lastmod: format(new Date(page.updatedAt), formatString),
          changeFreq: 'weekly',
          priority: '0.7',
        };
      }),
    );

    return builder.buildObject({
      urlSet: {
        $: {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        },
        url: response,
      },
    });
  }
}
