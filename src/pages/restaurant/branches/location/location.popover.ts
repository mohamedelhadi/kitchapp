import { ViewController, NavParams } from "ionic-angular";
import { Component, ViewChild, ElementRef, OnInit, Renderer2 } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { BasePopover } from "../../../../app/infrastructure/index";
import { Utils } from "../../../../app/helpers/index";
import { IBranch } from "../../../../app/contracts/index";

declare const google;

@Component({
    templateUrl: "location.popover.html",
    selector: "location-popover"
})
export class LocationPopover extends BasePopover implements OnInit {
    @ViewChild("map") public map: ElementRef;
    public branch: IBranch;
    public locationUrl: any;
    constructor(public viewCtrl: ViewController, private params: NavParams, private sanitizer: DomSanitizer, private renderer: Renderer2) {
        super({ viewCtrl });
        this.branch = params.data.branch;
        this.locationUrl = this.sanitizer.bypassSecurityTrustUrl("geo:" + this.branch.location.latitude + "," + this.branch.location.longitude);
    }
    public ngOnInit(): void {
        super.ngOnInit();
        // Load map only after view is initialized
        if (Utils.isOnline()) {
            this.loadMap();
        } else {
            this.renderer.setStyle(this.map.nativeElement, "display", "none"); // manually hiding as ngIf causes @ViewChild("map") to fail
        }
    }
    public sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    public close() {
        this.viewCtrl.dismiss();
    }
    private loadMap() {
        if (google === undefined) { // failed to load google maps script due to network, ad-block, ..etc.
            return;
        }
        const coordinates = { lat: this.branch.location.latitude, lng: this.branch.location.longitude };
        const map = new google.maps.Map(this.map.nativeElement, {
            center: coordinates,
            zoom: 16
        });
        const marker = new google.maps.Marker({
            map,
            position: coordinates,
            title: this.branch.name[this.settings.language]
        });
        const infoWindow = new google.maps.InfoWindow({
            content: this.branch.name[this.settings.language]
        });
        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    }
}
