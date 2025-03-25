import { DecompressionStrategy } from "../services";
import unzipper from "unzipper";
import { basename } from "path";

export class ZipDecompressor implements DecompressionStrategy {
    async decompress(file: File): Promise<File[]> {
        const dir = await unzipper.Open.buffer(
            Buffer.from(await file.arrayBuffer()),
        );

        const files: File[] = await Promise.all(
            dir.files
                .filter((file) => file.type == "File")
                .map(
                    async (file) =>
                        new File([await file.buffer()], basename(file.path), {
                            // FIXME: this will be wrong if filename contains more than 1 "."
                            type: basename(file.path).split(".")[1],
                            lastModified: file.lastModifiedTime,
                        }),
                ),
        );

        return files;
    }
}
