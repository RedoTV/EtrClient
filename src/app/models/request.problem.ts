export class RequestProblem {
    public contest_id : number | null = null;
    public id : number = 0;
    public index : string = '';
    public name : string = '';
    public points : number | null = null;
    public problemset_name : string | null = null;
    public rating : number | null = null;
    public tags : string[] = [];
    public type : string | null = null;
}