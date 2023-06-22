import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../api/supabase/supabase.module';
import { OpenmeteoModule } from '../../api/openmeteo/openmeteo.module';

@Module({
  imports: [SupabaseModule, OpenmeteoModule],
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CitiesModule {}
