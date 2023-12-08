import { Time } from "@angular/common";
import { RequestProblem } from "./request.problem";

export class Contest {
    city:string = '';
    country:string = '';
    description:string = '';
    difficulty:number = 0;
    duration_seconds:number = 0;
    duration_time:string = '';
    frozen:boolean = false;
    icpc_region:string = '';
    id:number = 0;
    kind:string = '';
    name:string = '';
    phase:string = '';
    prepared_by:string = '';
    problems: RequestProblem[] = [];
    relative_time_seconds:number = 0
    season:string = '';
    start_datatime:string = '';
    start_time_seconds:number = 0;
    type:string = '';
    type_of_contest: string = '';
    type_of_source:string = '';
    url:string = '';
    website_url:string = '';
}