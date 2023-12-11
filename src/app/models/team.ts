import { Submission } from "./submission";
import { User } from "./user";

export class Team {
    id : number = 0;
    team_name : string = "";
    users : User[] = [];
    submissions : Submission[] = [];
}