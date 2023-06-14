import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { SupabaseController } from './supabase/supabase.controller';
import { SupabaseService } from './supabase/supabase.service';
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import { SearchService } from './search/search.service';
import { SearchController } from './search/search.controller';

ConfigModule.forRoot();

@Module({
  imports: [SearchModule, SupabaseModule],
  controllers: [AppController, SupabaseController, SearchController],
  providers: [AppService, SupabaseService, SearchService],
})
export class AppModule {}
