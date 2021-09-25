import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class RocketService {
  constructor(private httpService: HttpService) {}

  getNextLaunchRemainingTime(): Observable<AxiosResponse<any>> { // <AxiosResponse<any>>
    return this.httpService.get('https://api.spacexdata.com/v4/launches/next').pipe(map(response => response.data))
  }
}
