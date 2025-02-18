import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewFilesPage } from './view-files.page';

const routes: Routes = [
  {
    path: '',
    component: ViewFilesPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ViewFilesPageModule { }