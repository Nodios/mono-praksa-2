﻿import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import { ILocation } from "./models/location.model";

@Injectable()
export class LocationService {
    constructor(private http: Http) { }

    getLocation(address: string): Observable<ILocation> {
        return this.http.get("/api/locations/get?address=" + address)
            .map((response: Response) => <ILocation>response.json())
            .catch(this.handleError);
    }

    getLocationById(id: string): Observable<ILocation> {
        return this.http.get("/api/locations/get?id=" + id)
            .map((response: Response) => <ILocation>response.json())
            .catch(this.handleError);
    }

    handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || "Server error");
    }

    updateRating(locationId: string, rating: number, currentRating: number, rateCount: number): Observable<ILocation> {
        return this.http.put("/api/locations/update/rating?locationId=" + locationId + "&rating=" + rating + "&currentrating=" + currentRating + "&ratecount=" + rateCount, {})
            .map((response: Response) => {
                return <ILocation>response.json();
            }).catch(this.handleError);
    }
}