import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../../infra/di/inversify/inversify.types";
import { Result } from "joji-ct-fp";
import type { UUID } from "../../../shared/types";
import type { FilePort } from "../../ports/file/File";

@injectable()
export class FileService {
    constructor(
        @inject(INVERIFY_IDENTIFIERS.FilePort) private fileAdapter: FilePort
    ) {}

    public async uploadFile(file: File, fileName: string, creatorId: UUID): Promise<Result<string, Error>> {
        const filePath = await this.fileAdapter.uploadFile(file, fileName, creatorId);
        return filePath;
    }

    public async getFile(filePath: string): Promise<Result<Buffer, Error>> {
        const file = await this.fileAdapter.getFile(filePath);
        return file;
    }

    public async downloadFile(filePath: string, downloadFolder: string): Promise<Result<string, Error>> {
        const destinationPath = await this.fileAdapter.downloadFile(filePath, downloadFolder);
        return destinationPath;
    }

    public async deleteFile(filePath: string): Promise<Result<boolean, Error>> {
        const deleted = await this.fileAdapter.deleteFile(filePath);
        return deleted;
    }

    public async renameFile(oldFilePath: string, newFilePath: string): Promise<Result<boolean, Error>> {
        const renamed = await this.fileAdapter.renameFile(oldFilePath, newFilePath);
        return renamed;
    }

}
