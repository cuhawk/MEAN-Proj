import { Route } from "@angular/router";

export type Path = Route & { id: number, fragment?: string, isHeader?: boolean };
