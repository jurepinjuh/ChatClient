import { Deserializable } from "./deserializable";
import { User } from "./user";

export class Message implements Deserializable{
    deserialize(input: any): this {
        return Object.assign(this,input);
    }
    public content:string;
    public signature:string;
    public userid:string;
    public fromUserid:string;
}