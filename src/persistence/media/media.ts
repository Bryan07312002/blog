import { ProfilePhotoFilePersistenceRepository } from "../../services";
import { writeFileSync, rmSync } from "fs";
import * as path from "path";

export class FSProfilePhotoFilePersistenceRepository
    implements ProfilePhotoFilePersistenceRepository
{
    constructor(
        private basePath: string,
        private baseUrl: URL,
    ) {}

    async save(file: File): Promise<void> {
        writeFileSync(
            path.join(this.basePath, file.name),
            Buffer.from(await file.arrayBuffer()),
        );
    }

    async delete(imgPath: string): Promise<void> {
        rmSync(path.join(this.basePath, imgPath));
    }

    async getRealUrl(url: string): Promise<string> {
        return new URL(path.join(this.baseUrl.toString(), url)).toString();
    }
}
