import { Time } from "@angular/common";

export type RequestContest = {
    city:string;
    country:string;
    description:string;
    difficulty:number;
    duration_seconds:number;
    duration_time:Time;
    frozen:boolean;
    icpc_region:string;
    id:number;
    kind:string;
    name:string;
    phase:string;
    prepared_by:string;
    problems: [];
    relative_time_seconds:number;
    season:string;
    start_datatime:Date;
    start_time_seconds:number;
    type:string;
    type_of_contest: string;
    type_of_source:string;
    url:string;
    website_url:string;
}