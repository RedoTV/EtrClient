import { Submission } from "./submission";
import { Team } from "./team";
import { User } from "./user";


export class ContestEntry {
    user : User | null = null;
    team : Team | null = null;
    submissions : Submission[] = [];
}