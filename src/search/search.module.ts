import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Module } from '@nestjs/common';
import { SearchTransportModule } from './transports/search-transport.module';

@Module({
  imports: [SearchTransportModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
