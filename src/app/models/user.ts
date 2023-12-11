import { Team } from "./team";
import { Submission } from "./submission";

export class User {
    public id : number = 0;
    public handle : string = "";
    public email : string | null = null;
    public vk_id : string | null = null;
    public open_id : string | null = null;
    public first_name : string | null = null;
    public last_name : string | null = null;
    public country : string | null = null;
    public city : string | null = null;
    public organization : string | null = null;
    public rank : string | null = null;
    public rating : string | null = null;
    public max_rank : string | null = null;
    public last_online_time_seconds : number | null = null;
    public registration_time_seconds : number | null = null;
    public friend_of_count : string | null = null;
    public avatar : string | null = null;
    public title_photo : string | null = null;
    public watch : boolean | null = null;
    public grade : number | null = null;
    public dl_id : string | null = null;
    public teams : Team[] = [];
    public submissions : Submission[] = [];
}