import { Team } from "./team";
import { Submission } from "./submission";
import { last } from "rxjs";

export class User {
    id : number = 0;
    handle : string = "";
    email : string | null = null;
    vk_id : string | null = null;
    open_id : string | null = null;
    first_name : string | null = null;
    last_name : string | null = null;
    country : string | null = null;
    city : string | null = null;
    organization : string | null = null;
    rank : string | null = null;
    rating : string | null = null;
    max_rank : string | null = null;
    last_online_time_seconds : number | null = null;
    registration_time_seconds : number | null = null;
    friend_of_count : string | null = null;
    avatar : string | null = null;
    title_photo : string | null = null;
    watch : boolean | null = null;
    grade : number | null = null;
    dl_id : string | null = null;
    teams : Team[] = [];
    submissions : Submission[] = [];
    constructor(id:number, first_name:string, last_name:string, organization:string, city:string, grade:number) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.organization = organization;
        this.city = city;
        this.grade = grade;
    }
}