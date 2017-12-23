import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from 'ionic-angular';
import { SharedModule } from '../shared/shared.module';

const _components = [
];
@NgModule({
    declarations: _components,
    imports: [
        BrowserModule,
        CommonModule,
        IonicModule,
        SharedModule
    ],
    exports: _components,
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ComponentsModule { }
