﻿import { Component, Output, EventEmitter, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { IEvent } from '../models/event.model';

@Component({
    templateUrl:'app/components/event/views/event-search-list.component.html',
    selector: 'display-list'
})

export class EventListComponent {
    @Input() events: IEvent[];
    @Input() eventCount: number;
    @Output() event = new EventEmitter();
    @Output() pageChange = new EventEmitter();

    eventDetails(evt: IEvent) {
        this.event.emit(evt);
    }

    onPageChange(event: any) {
        this.pageChange.emit(event);
    }
}