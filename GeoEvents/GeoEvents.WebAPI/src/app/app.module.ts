import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { Error404Component } from './components/error/error-404.component';
import { HomeComponent } from './components/home/home.component';

import { EventModule } from './components/event/event.module';
import { AppRoutingModule } from './app-routing.module';

import { PreserveSearchQueryService } from './shared/preserve-search-query.service';
import { LoaderService } from './shared/loader.service';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule,
		EventModule,
		AppRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        AppComponent,
        NavbarComponent,
        Error404Component,
		HomeComponent
    ],
    bootstrap: [ AppComponent ],
    providers: [
        PreserveSearchQueryService,
        LoaderService
    ]
	
})
export class AppModule { }
