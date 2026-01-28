import { Base } from "./base.model";
import { Environment } from "./environment.model";
import { Network } from "./network.model";

export interface Location {
    id: string;
    base: Base;
    environment: Environment;
    network: Network;
}