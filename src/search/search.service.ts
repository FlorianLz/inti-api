import { Injectable } from '@nestjs/common';
import { ISearchInput } from '../interfaces';

@Injectable()
export class SearchService {
  getSearch(params: ISearchInput): any {
    return JSON.stringify(params);
  }
}
