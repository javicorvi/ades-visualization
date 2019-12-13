import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DocumentsComponent } from './documents/documents.component';

import { FormsModule } from '@angular/forms';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { MessagesComponent } from './messages/messages.component';

import { FindingTabulatorComponent } from './finding-tabulator/finding-tabulator.component';
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    DocumentsComponent,
    DocumentDetailComponent,
    MessagesComponent,
    FindingTabulatorComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [HeaderComponent, FooterComponent, DocumentsComponent, DocumentDetailComponent, MessagesComponent]
})
export class AppModule { }
