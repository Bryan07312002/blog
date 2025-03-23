import { UUID } from "crypto";
import { UserRole, UserState } from "../../models";

export type Database = {
    users: UsersTable;
    profiles: UserProfilesTable;
    posts: PostsTable;
};

export interface UsersTable {
    uuid: UUID;
    username: string;
    email: string;
    password: string;
    role: UserRole[];
    state: UserState;
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
