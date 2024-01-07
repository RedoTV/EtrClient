import { RequestProblem } from "./request.problem";
import { User } from "./user";
import { Team } from "./team";


/**
 * Model for contest submission either of user or team. Matches data given by etr API.
 */
export class Submission {
    public id : number = 0;
    public contest_id : number = 0;
    public creation_time_seconds : number = 0;
    public relative_time_seconds : number = 0;
    public problem_id : number = 0;
    public problem : RequestProblem = new RequestProblem;
    public author_id : number = 0;
    public author : User = new User;
    public team_id : number | null = null;
    public team : Team | null = null;
    public programming_language : string = "";
    public verdict : string = "";
    public testset : string = "";
    public passed_test_count : number = 0;
    public time_consumed_millis : number = 0;
    public memory_consumed_bytes : number = 0;
    public points : number = 0;
    public type_of_member : string = "";

}