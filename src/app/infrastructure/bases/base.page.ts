import { Logger } from '../../helpers/index';
import { IAppSettings, TranslationKeys, Language, IonPageEvents } from '../../contracts/index';
import { Settings$ } from '../index';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';

export abstract class BasePage {
    protected logger: Logger;
    protected settings: IAppSettings;
    protected translation = TranslationKeys;
    protected ionPageEvents = new Subject<IonPageEvents>();
    constructor({ logger }: { logger?: Logger }) {
        this.logger = logger;
        Settings$.takeUntil(this.pageUnload)
            .subscribe(settings => this.settings = settings);
    }
    protected ionViewWillUnload() {
        if (this.logger) {
            this.logger.log({ event: 'ionViewWillUnload', component: this });
        }
        this.ionPageEvents.next(IonPageEvents.ionViewWillUnload);
        this.ionPageEvents.complete();
    }
    protected pageUnload = this.ionPageEvents
        .filter(event => event === IonPageEvents.ionViewWillUnload);
    public isRtl() {
        return this.settings && this.settings.language === Language.ar;
    }
    public isLtr() {
        return !this.isRtl();
    }
}
