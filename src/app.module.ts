import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { getMongoConfig } from './configs/mongo.config';
import { getTelegramConfig } from './configs/telegra.config';
import { FilesModule } from './files/files.module';
import { GithubModule } from './github/github.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { TelegramModule } from './telegram/telegram.module';
import { TopPageModule } from './top-page/top-page.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    TopPageModule,
    ProductModule,
    ReviewModule,
    FilesModule,
    SitemapModule,
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      injects: [ConfigService],
      useFactory: getTelegramConfig,
    }),
    GithubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
