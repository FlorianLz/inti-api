import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SupabaseController } from './supabase.controller';
import { SearchService } from "../search/search.service";
import { SearchController } from "../search/search.controller";

@Module({
  imports: [],
  controllers: [SupabaseController, SearchController],
  providers: [SupabaseService, SearchService],
})
export class SupabaseModule {}
