import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams, Nav } from "ionic-angular";
import { Home, Settings } from "../";

@Component({
    selector: "side-menu",
    templateUrl: "side-menu.html"
})
export class SideMenu {

    @ViewChild(Nav) public nav: Nav;
    public rootPage: any = Home;
    public home = Home;
    public settings = Settings;

    constructor(public navCtrl: NavController, public navParams: NavParams) { }
}
