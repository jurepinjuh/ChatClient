import { Deserializable } from "./deserializable";

export class User implements Deserializable{
    deserialize(input: any): this {
        return Object.assign(this,input);
    }
    public id:string;
    public socketId:string;
    public username:string;
    public key:string;
}