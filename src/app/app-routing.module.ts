import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReactWrapperComponent} from "./react-wrapper/react-wrapper.component";

const routes: Routes = [
  { path: 'react-app', component: ReactWrapperComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
