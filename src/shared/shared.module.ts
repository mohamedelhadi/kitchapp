import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { declarations } from '../app/app.module';
import { SafeUrlPipe } from './pipes/index';
import { ImageFallbackDirective } from './directives/index';

const _declarations = [
    SafeUrlPipe,
    ImageFallbackDirective
];
@NgModule({
    declarations: [_declarations],
    exports: [
        TranslateModule,
        ..._declarations
    ]
})
export class SharedModule { }
