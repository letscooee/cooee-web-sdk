import {sendEvent} from "./network/utils-temp";
import {Event} from "./models/event";
import {UserAuthService} from "./services/user-auth.service";

export default class CooeeSDK {

    private static readonly INSTANCE = new CooeeSDK();

    private readonly userAuthService: UserAuthService;

    private constructor() {
        this.userAuthService = new UserAuthService();
    }

    static init(appID: string, appSecret: string): void {
        this.INSTANCE.userAuthService.init(appID, appSecret);
    }

    static sendEvent(name: string, props: {}): void {
        const event = new Event(name, props)
        sendEvent(event)
    }
}
