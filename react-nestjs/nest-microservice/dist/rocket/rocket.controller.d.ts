import { RocketService } from './rocket.service';
export declare class RocketController {
    private rocketService;
    constructor(rocketService: RocketService);
    getNextLaunchRemainingTime(): import("rxjs").Observable<import("axios").AxiosResponse<any>>;
}
