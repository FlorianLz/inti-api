import { Injectable } from '@nestjs/common';
import * as process from 'process';
const Amadeus = require('amadeus');

@Injectable()
export class AmadeusService {
  getClient() {
    return new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    });
  }
}
