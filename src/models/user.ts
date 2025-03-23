import { UUID } from "crypto";

export enum Role {
    Reader = "reader",
    Writer = "writer",
    Admin = "admin",
}
export enum State {
    Active = "active",
    Inactive = "inactive",
    Banned = "banned",
}

export class User {
    constructor(
        public uuid: UUID,
        public username: string,
        public email: string,
        public password: string,
        public role: Role[],
        public state: State,
    ) {}
}
