import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './app/search/search.module';
import { ConfigModule } from '@nestjs/config';
import { CitiesModule } from './app/cities/cities.module';

ConfigModule.forRoot({
  isGlobal: true,
});

@Module({
  imports: [SearchModule, CitiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
