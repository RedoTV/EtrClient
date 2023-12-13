import { Submission } from "./submission";
import { User } from "./user";

export class Team {
    public id : number = 0;
    public team_name : string = "";
    public users : User[] = [];
    //public submissions : Submission[] = []; Submissions are not given!
}