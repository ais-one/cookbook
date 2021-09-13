import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
export declare class RocketService {
    private httpService;
    constructor(httpService: HttpService);
    getNextLaunchRemainingTime(): Observable<AxiosResponse<any>>;
}
