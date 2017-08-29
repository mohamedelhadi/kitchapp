import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { IDeal, DEALS, IApiOptions } from "../../contracts";
import { Api } from "../../services";

@Injectable()
export class DealsData {
    private deals = new BehaviorSubject<IDeal[]>([]);

    constructor(private api: Api, private storage: Storage) {
        storage.ready().then(() => {
            this.storage.get(DEALS).then((deals: IDeal[]) => {
                if (deals) {
                    this.deals.next(deals);
                }
            });
        });
    }
    get Deals() {
        return this.deals.asObservable();
    }
    public getDeals(forceUpdate?: boolean, options?: IApiOptions) {
        if (forceUpdate || this.deals.getValue().length === 0) {
            this.api.get("deals", options).subscribe((deals: IDeal[]) => {
                this.storage.set(DEALS, deals);
                this.deals.next(deals);
            });
        }
    }
    public getRestaurantDeals(restaurantId: number): Observable<IDeal[]> {
        return this.deals.map(deals => deals.filter(deal => deal.restaurantId === restaurantId));
        // return this.api.get(`deals/restaurantdeals/${restaurantId}`);
    }
}
