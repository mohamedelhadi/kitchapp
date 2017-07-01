import { Injectable } from "@angular/core";
// import { ViewWrappedError } from "@angular/core/src/linker/errors";

@Injectable()
export class Logger {

    public error(err?: any) {
        // tslint:disable-next-line:no-console
        console.error(err);
        // log to error tracker
    }

    public log(data: any) {
        if (typeof data === "string") {
            // tslint:disable-next-line:no-console
            console.log(data);
        } else {
            const json = "\n" + JSON.stringify(data, null, 2) + "\n";
            this.highlightJsonSyntax(json);
        }
    }

    private highlightJsonSyntax(json) {
        // tslint:disable-next-line:one-variable-per-declaration
        const arr = [],
            _string = "color:brown",
            _number = "color:green",
            _boolean = "color:blue",
            _null = "color:magenta",
            _key = "color:dimgray";

        json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
            let style = _number;
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    style = _key;
                } else {
                    style = _string;
                }
            } else if (/true|false/.test(match)) {
                style = _boolean;
            } else if (/null/.test(match)) {
                style = _null;
            }
            arr.push(style);
            arr.push("");
            return "%c" + match + "%c";
        });

        arr.unshift(json);
        console.log.apply(console, arr);
    }
}
