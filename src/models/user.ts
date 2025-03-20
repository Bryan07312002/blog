import { UUID } from "crypto";

// TODO: transform this to enums
export type UserRole = "Reader" | "Writer" | "Admin";
export type UserState = "Active" | "Inactive" | "Banned";

export class User {
    constructor(
        public uuid: UUID,
        public username: string,
        public email: string,
        public password: string,
        public userRole: UserRole[],
        public state: UserState,
    ) {}
}
