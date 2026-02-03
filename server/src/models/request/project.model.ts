import { Location } from "../location/location.model";


export enum ProjectType {
    Emergency,
    Semiannual,
};

export enum Median {
    H1,
    H2,
};

export interface Project {
    name: string;
    purpsoe: string;
    type: ProjectType;
    kind: string;
    location: Location;
    year?: number;
    median?: Median;
}