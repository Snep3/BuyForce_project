import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TYPE } from '../config/database.config';

@Module({
  imports: [
    ConfigModule,
    ...(DB_TYPE === 'mongo'
      ? [
          MongooseModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
              uri: config.get<string>('MONGO_URL'),
            }),
            inject: [ConfigService],
          }),
        ]
      : []),
    // בעתיד, אם DB_TYPE === 'sql' -> פה נחליף ל-TypeORM/Prisma
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
