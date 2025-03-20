import { UUID } from "crypto";

type UserRole = "Reader" | "Writer" | "Admin";

export class User {
    constructor(
        public uuid: UUID,
        public username: string,
        public email: string,
        public password: string,
        public userRole: UserRole[],
    ) {}
}
