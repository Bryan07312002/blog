import { UserProfilePhotoFilePersistenceRepository } from "../../services";
import { writeFileSync, rmSync } from "fs";
import * as path from "path";

export class FSUserProfilePhotoFilePersistenceRepository
    implements UserProfilePhotoFilePersistenceRepository
{
    constructor(
        private basePath: string,
        private baseUrl: URL,
    ) {}

    async save(imgPath: string, blob: Blob): Promise<void> {
        writeFileSync(
            path.join(this.basePath, imgPath),
            Buffer.from(await blob.arrayBuffer()),
        );
    }

    async delete(imgPath: string): Promise<void> {
        rmSync(path.join(this.basePath, imgPath));
    }

    async getRealUrl(url: string): Promise<string> {
        return new URL(this.baseUrl, url).toString();
    }
}
