import { Time } from "@angular/common";
import { RequestProblem } from "./request.problem";

/**
 * Contest model. Matches data given by etr API.
 */
export class Contest {
    public id : number = 0;
    public name : string = '';
    public city : string | null = null;
    public country : string | null = null;
    public description : string | null = null;
    public difficulty : number | null = 0;
    public duration_seconds : number | null = 0;
    public duration_time : string | null = null;
    public frozen : boolean | null = null;
    public icpc_region : string | null = null;
    public kind : string | null = null;
    public phase : string | null = null;
    public prepared_by : string | null = null;
    public problems :  RequestProblem[] = [];
    public relative_time_seconds : number | null = 0
    public season : string | null = null;
    public start_datatime : string | null = null;
    public start_time_seconds : number | null = 0;
    public type : string | null = null;
    public type_of_contest :  string | null = null;
    public type_of_source : string | null = null;
    public url : string | null = null;
    public website_url : string | null = null;
}