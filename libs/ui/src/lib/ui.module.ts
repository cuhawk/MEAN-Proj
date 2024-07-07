import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { NgbCollapse, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterLink } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

/**
 *  Angular Modules
 */
const ANGULAR_MODULES = [
  CommonModule,
  RouterLink,
  FormsModule,
  ReactiveFormsModule,
];

/**
 *   Third Party Modules
 */
const THIRD_PARTY_MODULES = [
  NgbNavModule,
  NgbCollapse,
];

/**
 *   Custom Component
 */
const COMPONENTS = [
  HeaderComponent
];

@NgModule({
  imports: [
    ...ANGULAR_MODULES,
    ...THIRD_PARTY_MODULES,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class UiModule {}
