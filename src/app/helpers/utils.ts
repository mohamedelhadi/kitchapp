import { Injectable } from "@angular/core";
import { Configuration } from "../../environments/env.config";
import { Environments } from "../../environments/configuration";
import { IDropdownOption } from "../../contracts";

declare const navigator: any;
declare const Connection: any;

@Injectable()
export class Utils {
    static isOnline() {
        // tslint:disable-next-line:triple-equals
        return navigator && navigator.connection && navigator.connection.type != Connection.NONE && navigator.connection.type != Connection.UNKNOWN;
        /*Connection.UNKNOWN
        Connection.ETHERNET
        Connection.WIFI
        Connection.CELL_2G
        Connection.CELL_3G
        Connection.CELL_4G
        Connection.CELL
        Connection.NONE*/
    }
    static getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        const deg2rad = 0.017453292519943295; // === Math.PI / 180
        const cos = Math.cos;
        lat1 *= deg2rad;
        lon1 *= deg2rad;
        lat2 *= deg2rad;
        lon2 *= deg2rad;
        const a = (
            (1 - cos(lat2 - lat1)) +
            (1 - cos(lon2 - lon1)) * cos(lat1) * cos(lat2)
        ) / 2;

        return 12742 * Math.asin(Math.sqrt(a)); // Diameter of the earth in km (2 * 6371)
    }
    static deepClone(o) { // recursiveDeepCopy2 =>  https://jsperf.com/js-deep-copy/7
        // use with discretion!

        // tslint:disable-next-line:one-variable-per-declaration
        let newO, i;

        if (typeof o !== "object") { return o; }
        if (!o) { return o; }

        if (o.constructor === Array) {
            newO = [];
            for (i = 0; i < o.length; i += 1) {
                newO[i] = Utils.deepClone(o[i]);
            }
            return newO;
        }

        newO = {};
        // tslint:disable-next-line:forin
        for (i in o) {
            newO[i] = Utils.deepClone(o[i]);
        }
        return newO;
    }
    static containsArabic(text: string): boolean {
        return /[\u0600-\u06FF]/.test(text);
    }

    static isPhoneNumber(phone: string): boolean {
        return phone ? phone.match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g) !== null : false;
    }

    static isNumber(value: any): boolean {
        return /^\d+$/.test(value);
    }

    static openBrowser(link: string): void {
        (window as any).cordova.InAppBrowser.open(link, "_system", "location=yes");
    }

    static getExtension(file: string | File): string {
        if (typeof (file) === "string" || file instanceof String) {
            // tslint:disable-next-line:no-bitwise
            return file.substr((~-file.lastIndexOf(".") >>> 0) + 2).toLowerCase();
        } else {
            // tslint:disable-next-line:no-bitwise
            return file.name.substr((~-file.name.lastIndexOf(".") >>> 0) + 2).toLowerCase();
        }
    }

    static getPath(filePath: string): string {
        return filePath.substring(0, filePath.lastIndexOf("/") + 1);
    }

    static getFileName(file: string | File): string {
        if (typeof (file) === "string" || file instanceof String) {
            return file.substring(file.lastIndexOf("/") + 1);
        } else {
            return file.name;
        }
    }

    static normalizeFileName(name: string): string {
        name = name.replace(/[|&;$%@" \-<>()+,]/g, ""); // remove illegal chars
        name = name.replace(/\.(?=.*?\.)/, ""); // remove dots except the extension dot
        return name;
    }

    static enumToDropdown(e): IDropdownOption[] {
        const options: IDropdownOption[] = [];
        for (const item in e) {
            if (e.hasOwnProperty(item) && !Utils.isNumber(item)) { // discard numeric versions of the enum
                options.push({ text: item, value: e[item] });
            }
        }
        return options;
    }

    static getHash(value: string) {
        // tslint:disable-next-line:one-variable-per-declaration
        let hash = 0, i, chr, len;
        if (value.length === 0) {
            return hash;
        }
        for (i = 0, len = value.length; i < len; i++) {
            chr = value.charCodeAt(i);
            // tslint:disable-next-line:no-bitwise
            hash = ((hash << 5) - hash) + chr;
            // tslint:disable-next-line:no-bitwise
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    static getMime(name: string): string {
        const extension = this.getExtension(name);
        switch (extension) {
            case "jpg": case "jpeg":
                return "image/jpeg";
            case "gif":
                return "image/gif";
            case "bmp":
                return "image/bmp";
            case "png":
                return "image/png";
            case "mp3":
                return "audio/mpeg";
            case "mid":
                return "application/x-midi";
            case "wav":
                return "audio/x-wav";
            case "amr":
                return "audio/amr";
            case "3gp":
                return "video/3gpp";
            case "aac":
                return "audio/x-aac";
            case "ogg":
                return "audio/ogg";
            case "flac":
                return "audio/x-flac";
            case "m4a":
                return "audio/mp4";
            case "pdf":
                return "application/pdf";
            case "txt":
                return "text/plain";
            case "doc":
                return "application/mxf";
            case "docx":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "xls":
                return "application/vnd.ms-excel";
            case "xlsx":
                return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "ppt":
                return "application/vnd.ms-powerpoint";
            case "pptx":
                return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        }
    }

    /*static searchAndMark(value: string, text: string): string {
        // find matching characters and mark them
        if (text) {
            let index = text.toLowerCase().indexOf(value);
            if (index !== -1) {
                text = text.insertAt(index + value.length, "</mark>");
                text = text.insertAt(index, "<mark>");
                return text;
            }
        }
        return null;
    }*/

    constructor(private config: Configuration) { }
    isDev() {
        return this.config.Environment === Environments.Dev || this.config.Environment === Environments.Simulator;
    }
}
