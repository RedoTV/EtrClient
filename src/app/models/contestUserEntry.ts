import { Submission } from "./submission";
import { User } from "./user";


export class ContestUserEntry {
    user : User = new User;
    submissions : Submission[] = [];
}