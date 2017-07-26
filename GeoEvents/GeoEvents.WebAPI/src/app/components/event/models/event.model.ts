﻿export interface IEvent {
    Id: string,
    Name: string,
    Description: string,
    StartTime: Date,
    EndTime: Date,
    Latitude: number,
    Longitude: number,
    Categories: number[],
    Price: number,
    Capacity: number,
    Reserved: number,
    Rating: number,
    RateCount: number,
    CustomModel: CustomAttribute[],
    Custom: string,
    LocationId: string
}

export interface CustomAttribute {
    key: string,
    values: string[]
}