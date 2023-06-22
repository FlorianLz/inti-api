import { Module } from '@nestjs/common';
import { SearchBookingService } from './search-booking.service';
import { SearchBookingController } from './search-booking.controller';
import { HttpModule } from '@nestjs/axios';
import { AmadeusModule } from '../../../api/amadeus/amadeus.module';
import { SupabaseModule } from '../../../api/supabase/supabase.module';
import { PricelineModule } from '../../../api/priceline/priceline.module';
import { OpencageModule } from '../../../api/opencage/opencage.module';
@Module({
  imports: [
    HttpModule,
    AmadeusModule,
    SupabaseModule,
    PricelineModule,
    OpencageModule,
  ],
  controllers: [SearchBookingController],
  providers: [SearchBookingService],
  exports: [SearchBookingService],
})
export class SearchBookingModule {}
