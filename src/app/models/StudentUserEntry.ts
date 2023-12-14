import { Submission } from "./submission";
import { User } from "./user";


export class StudentUserEntry {
    user : User = new User;
    submissions : Submission[] = [];
}