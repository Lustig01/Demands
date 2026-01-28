import { Location } from "../location/location.model";

export interface Capacity {
    id: string;
    location: Location;
    resource: string;
    service: string;
    value: number;
}