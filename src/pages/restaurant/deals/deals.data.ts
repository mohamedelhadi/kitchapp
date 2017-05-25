import { Injectable } from "@angular/core";
import { Api } from "../../../app/services/api";
import { IDeal, DEALS } from "../../../contracts";
import { Storage } from "@ionic/storage";

import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/Observable";

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
    getDeals(forceUpdate?: boolean) {
        if (forceUpdate || this.deals.getValue().length === 0) {
            this.api.get("deals").subscribe((deals: IDeal[]) => {
                this.storage.set(DEALS, deals);
                this.deals.next(deals);
            });
        }
    }
    getRestaurantDeals(restaurantId: number): Observable<IDeal[]> {
        return this.deals.map(deals => deals.filter(deal => deal.restaurantId === restaurantId));
        // return this.api.get(`deals/restaurantdeals/${restaurantId}`);
    }
}
