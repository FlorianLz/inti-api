import * as process from 'process';

const Amadeus = require('amadeus');

export const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
  logLevel: process.env.AMADEUS_LOG_LEVEL,
});
