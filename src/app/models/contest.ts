import { Time } from "@angular/common";
import { RequestProblem } from "./request.problem";

export class Contest {
    id : number = 0;
    name : string = '';
    city : string | null = null;
    country : string | null = null;
    description : string | null = null;
    difficulty : number | null = 0;
    duration_seconds : number | null = 0;
    duration_time : string | null = null;
    frozen : boolean | null = null;
    icpc_region : string | null = null;
    kind : string | null = null;
    phase : string | null = null;
    prepared_by : string | null = null;
    problems :  RequestProblem[] = [];
    relative_time_seconds : number | null = 0
    season : string | null = null;
    start_datatime : string | null = null;
    start_time_seconds : number | null = 0;
    type : string | null = null;
    type_of_contest :  string | null = null;
    type_of_source : string | null = null;
    url : string | null = null;
    website_url : string | null = null;
}