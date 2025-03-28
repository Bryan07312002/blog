import { UUID } from "crypto";
import { Role, State } from "../../models";

export type Database = {
    users: UsersTable;
    profiles: UserProfilesTable;
    posts: PostsTable;
    user_roles: UserRoles;
};

export interface UserRoles {
    user_uuid: UUID;
    role: Role;
}

export interface UsersTable {
    uuid: UUID;
    username: string;
    email: string;
    password: string;
    state: State;
}

export interface UserProfilesTable {
    user_uuid: UUID;
    title?: string;
    bio?: string;
    profile_photo_url?: string;
    lives_in?: string;
    works_at?: string;
    studie_at?: string;
}

export interface PostsTable {
    uuid: UUID;
    title: string;
    user_id: UUID;
    posted_at: string;
    file_url: string;
}
