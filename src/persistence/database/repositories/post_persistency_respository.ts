import { UUID } from "crypto";
import { Post } from "../../../models";
import { PostPersistenceRepository } from "../../../services";
import { KyselyDatabaseConnection } from "../connection";

export class KyselyPostPersistencyRepository
    implements PostPersistenceRepository
{
    constructor(public conn: KyselyDatabaseConnection) {}

    create(post: Post): Promise<void> {
        throw new Error("Method not implemented.");
    }

    delete(uuid: UUID): Promise<void> {
        throw new Error("Method not implemented.");
    }

    findByUUID(uuid: UUID): Promise<Post> {
        throw new Error("Method not implemented.");
    }
}
