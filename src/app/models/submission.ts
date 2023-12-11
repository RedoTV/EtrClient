import { RequestProblem } from "./request.problem";
import { User } from "./user";
import { Team } from "./team";

export class Submission {
    id : number = 0;
    contest_id : number = 0;
    creation_time_seconds : number = 0;
    relative_time_seconds : number = 0;
    problem_id : number = 0;
    problem : RequestProblem = new RequestProblem;
    author_id : number = 0;
    author : User = new User;
    team_id : number = 0;
    team : Team = new Team;
    programming_language : string = "";
    verdict : string = "";
    testset : string = "";
    passed_test_count : number = 0;
    time_consumed_millis : number = 0;
    memory_consumed_bytes : number = 0;
    points : number = 0;
    type_of_member : string = "";

}