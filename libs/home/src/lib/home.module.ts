import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "./home.component";

import { NgIconsModule } from "@ng-icons/core";
import { octPersonAdd, octPeople } from "@ng-icons/octicons";
import { RouterLink } from "@angular/router";

/**
 *  Modules
 */
const MODULES = [
  CommonModule,
  NgIconsModule.withIcons({ octPersonAdd, octPeople }),
];


/**
 *    Main and Custom Components
 */
const COMPONENTS = [
  HomeComponent
];

@NgModule({
  imports: [
    ...MODULES,
    RouterLink
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class HomeModule {}
