import { Component, OnInit, DoCheck, ViewChild, NgZone, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MapsAPILoader } from '@agm/core';

import { IEvent, CustomAttribute } from '../models/event.model';
import { IFilter } from '../models/filter.model';
import { CategoryService } from '../providers/category.service';

import { PreserveSearchQueryService } from '../../../shared/preserve-search-query.service';
import { EventService } from '../providers/event.service';
import { GeocodingService } from '../../../shared/geocoding.service';
import { LoaderService } from '../../../shared/loader.service';

import { needBothOrNeitherOfAddressAndRadius, endDateBeforeStartDate } from '../validators/validator';

@Component({
	templateUrl: 'app/components/event/views/event-search.component.html'
})
export class EventSearchComponent implements OnInit {
    private _searchEventLoading: boolean = false;
    private _userApproximateAddress: string = "";
    private _eventCount: number;

	//variables for storing data
	private _events: IEvent[];
	//private _event: IEvent;
	private _errorMessage: string;
	
	//variables for the filter and retrieving data
    filterForm: FormGroup;
    start: FormControl;
    end: FormControl;
    address: FormControl;
    radius: FormControl;
    searchString: FormControl;
    latitude: FormControl;
    longitude: FormControl;
    price: FormControl;
    rating: FormControl;
    customCategoryName: FormControl;
    customCategoryValue: FormControl;
	private _filter: IFilter;
	private _dataServiceSubscription: Subscription;
	
	//variables for the location services
    isAddressValid: boolean = false;
	
	@ViewChild("search") searchElementRef: ElementRef;
	
	//booleans for displaying ui elements
    private _isMapMode: boolean = false;
    //private _isDetailMode: boolean = false;
	private _isAdvancedSearch: boolean = false;

    //constructor
    constructor(
        private _eventService: EventService,
        private _preserveSearchQueryService: PreserveSearchQueryService,
        private _mapsAPILoader: MapsAPILoader,
        private _ngZone: NgZone,
        private _geocodingService: GeocodingService,
        private _loaderService: LoaderService,
        private _categoryService: CategoryService
    ) {
		this.createForm();
	}
	
    ngOnInit(): void {
        this._categoryService.buildCategories(false);

        this._geocodingService.getUserApproximateAddress()
            .subscribe(response => {
                if (response.status == "success") {
                    this.userApproximateAddress = response.city + ", " + response.country;
                }
            });

        this._loaderService.loaderStatus.subscribe((value: boolean) => {
            this.searchEventLoading = value;
        });

        //checking if this service has any params inside, used when redirected from searching in home component
		//if there are params, user likely selected the search button on the home component
		//if there are not any params, user likely clicked on the advanced search button, or redirected from somewhere else.
		if(this._preserveSearchQueryService.searchQuery != null){
			this.filter = {
				ULat: null,
				ULong: null,
				Radius: 0,
				StartTime: null,
				EndTime: null,
                Category: 0,
                Price: null,
                RatingEvent: null,
                SearchString: this._preserveSearchQueryService.searchQuery,
                Custom: null,
				
				PageNumber: 1,
				PageSize: 25,
				OrderByString: "Name",
				OrderIsAscending: true
            }		
            this.getEvents(this.filter);
            this.getEventCount(this.filter);
		}
		else{
			this.isAdvancedSearch = true;
        }

        this.startMapZoomListener();
	}

    onPageChange(event: any) {
        this.onSubmit(this.filterForm.value, event.page + 1, false);
    }

	//submits
    onSubmit(formValues: any, pageNumber: number = 1, filterChanged: boolean = true): void {
        this._loaderService.displayLoader(true);
        let selectedCategories = this.getSelectedCategories();

        if (filterChanged) {
            let customModel: CustomAttribute[] = [{ key: formValues.customCategoryName, values: [formValues.customCategoryValue] }];
            let custom: string = null;
            if (customModel[0].key) {
                custom = JSON.stringify(customModel);
            }

            this.filter = {
                ULat: formValues.latitude,
                ULong: formValues.longitude,
                Radius: formValues.radius,
                StartTime: formValues.start,
                EndTime: formValues.end,
                Category: selectedCategories,
                SearchString: formValues.searchString,
                Price: formValues.price,
                RatingEvent: formValues.rating,
                Custom: custom,


                PageNumber: 1,
                PageSize: 25,
                OrderByString: "Name",
                OrderIsAscending: true
            }

            if (this.filter.SearchString == null) {
                this.filter.SearchString == "";
            }
        }
        else {
            this.filter.PageNumber = pageNumber;
        }
        		
        this.getEvents(this.filter);

        if (filterChanged) {
            this.getEventCount(this.filter);
        }
	}
	
	//return a number that represents the chosen categories
	//if none are selected it treats it as if all were selected
	getSelectedCategories(): number {
        let chosenCategories: number[] = [];
		
        this._categoryService.categories.filter(checkbox => {
            if (checkbox.checked) {
                chosenCategories.push(checkbox.id);
            }
        });
        var cat = 0
        for (let c of chosenCategories) {
            cat += c
        }
        return cat;
	}
	
	//called when the checkbox for one of the categories changes
	//updates the array of categories (i think)
    updateCategories(category: number) {
        this._categoryService.categories.filter(checkbox => {
            if (checkbox.id == category) {
                checkbox.checked = !checkbox.checked;
            }
        });
    }
	
	//sets the position(latitude and longitude) using geolocation services
	private setCurrentPosition(): void {
		//todo: extend this with other location services in case geolocation is blocked by user
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.filterForm.controls["latitude"].setValue(position.coords.latitude);
                this.filterForm.controls["longitude"].setValue(position.coords.longitude);
                this._geocodingService.getAddress(this.filterForm.controls["latitude"].value, this.filterForm.controls["longitude"].value).subscribe(response => {
                    this.filterForm.controls["address"].setValue(response);
                });
                this.isAddressValid = true;
			});
		}
	}	
	
	//adds an event listener that listens for changes in the element with the #adress tag
	//once it detects changes and verifies that the adress is correct
	//is sets the latitude and longitude, then Zooms the map on the appropriate position, or so I've been told... 
	private startMapZoomListener() {
		this._mapsAPILoader.load().then(() => {
			let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
				types: ["address"]
			});
			autocomplete.addListener("place_changed", () => {
				this._ngZone.run(() => {
					//get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
					//verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        this.filterForm.controls["latitude"].setValue(null);
                        this.filterForm.controls["longitude"].setValue(null);
						return;
					}
					//set latitude, longitude and zoom
					this.filterForm.controls["latitude"].setValue(place.geometry.location.lat());
                    this.filterForm.controls["longitude"].setValue(place.geometry.location.lng());
                    this._geocodingService.getAddress(this.filterForm.controls["latitude"].value, this.filterForm.controls["longitude"].value).subscribe(response => {
                        this.filterForm.controls["address"].setValue(response);
                    });
                    this.isAddressValid = true;
				});
			});
		});	
	}
	
	//toggles displaying advanced search, triggered on click
	toggleAdvancedSearch(): void {
		this.isAdvancedSearch = !this.isAdvancedSearch;
	}

    private getEventCount(filter: IFilter): void {
        this._eventService.getEventCount(filter)
            .subscribe(result => {
                this.eventCount = result;
            });
    }

	//calls the http service and gets the events
	private getEvents(filter: IFilter): void {
		this._dataServiceSubscription = this._eventService.getEvents(filter)
            .subscribe(result => {
                this.events = result;
                this._preserveSearchQueryService.searchQuery = null;
                this._loaderService.displayLoader(false);
            }, error => this.errorMessage = <any>error);
	}
	
	//gets the events when user checks the ascending order checkbox
    getEventsAscendingChanged() {
        this.filter.OrderIsAscending = !this.filter.OrderIsAscending;
		//get the events
        this.getEvents(this.filter);
	}
	
	//gets the events when user changes the sorting order
	getEventsOrderChanged(newOrder: string){
		this.filter.OrderByString = newOrder
		this.getEvents(this.filter);
	}
	
	toggleMapMode(): void {
		this.isMapMode = !this.isMapMode;
	}
	
	//creates the form for advanced search
	private createForm(): void {
        this.start = new FormControl(null);
        this.end = new FormControl(null);
        this.address = new FormControl(null);
        this.radius = new FormControl(null, Validators.pattern(/^[0-9]+(\.\d+)?$/));
        this.searchString = new FormControl(null);
        this.latitude = new FormControl(null);
        this.longitude = new FormControl(null);
        this.price = new FormControl(null, Validators.pattern(/^[0-9]+(\.\d{1,2})?$/));
        this.rating = new FormControl(null, Validators.pattern(/(^[1-4](\.\d+)?|5)$/));
        this.customCategoryName = new FormControl(null);
        this.customCategoryValue = new FormControl(null);

        this.filterForm = new FormGroup({
            start: this.start,
            end: this.end,
            address: this.address,
            radius: this.radius,
            searchString: this.searchString,
            latitude: this.latitude,
            longitude: this.longitude,
            price: this.price,
            rating: this.rating,
            customCategoryName: this.customCategoryName,
            customCategoryValue: this.customCategoryValue
        });
        this.filterForm.setValidators([needBothOrNeitherOfAddressAndRadius('latitude', 'radius'), endDateBeforeStartDate('start', 'end')]);
    }

    clearLocation(): void {
        this.isAddressValid = false;
        this.filterForm.controls["address"].setValue("");
        this.filterForm.controls["latitude"].setValue(null);
        this.filterForm.controls["longitude"].setValue(null);
    }

    get eventCount(): number {
        return this._eventCount;
    }

    set eventCount(theEventCount: number) {
        this._eventCount = theEventCount;
    }

    get searchEventLoading(): boolean {
        return this._searchEventLoading;
    }

    set searchEventLoading(thesearchEventLoading: boolean) {
        this._searchEventLoading = thesearchEventLoading;
    }

    get userApproximateAddress(): string {
        return this._userApproximateAddress;
    }

    set userApproximateAddress(theUserApproximateAddress: string) {
        this._userApproximateAddress = theUserApproximateAddress;
    }

    get events(): IEvent[] {
        return this._events;
    }

    set events(theEvents: IEvent[]) {
        this._events = theEvents;
    }

    get errorMessage(): string {
        return this._errorMessage;
    }

    set errorMessage(theErrorMessage: string) {
        this._errorMessage = theErrorMessage;
    }

    get filter(): IFilter {
        return this._filter;
    }

    set filter(theFilter: IFilter) {
        this._filter = theFilter;
    }

    get isMapMode(): boolean {
        return this._isMapMode;
    }

    set isMapMode(isMapMode: boolean) {
        this._isMapMode = isMapMode;
    }

    get isAdvancedSearch(): boolean {
        return this._isAdvancedSearch;
    }

    set isAdvancedSearch(isAdvancedSearch: boolean) {
        this._isAdvancedSearch = isAdvancedSearch;
    }
}