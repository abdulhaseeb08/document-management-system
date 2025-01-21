import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../../infra/di/inversify/inversify.types";
import type { Logger } from "../../ports/logger/logger";
import { Result } from "joji-ct-fp";
import { promises as fs } from "fs";
import { join } from "path";
import { FileFormat } from "../../../shared/enums/FileFormats";
import { UnsupportedFileFormatError } from "../../errors/DocumentErrors";
import type { UUID } from "../../../shared/types";

@injectable()
export class FileService {
    constructor(
        @inject(INVERIFY_IDENTIFIERS.Logger) private logger: Logger
    ) {}

    public async uploadFile(file: File, fileName: string, creatorId: UUID): Promise<Result<string, Error>> {
        const fileExtension = this.getFileExtension(file.type);
        if (!fileExtension) {
            this.logger.error("Unsupported file format: " + file.type);
            return Result.Err(new UnsupportedFileFormatError(`Unsupported file format ${file.type}`));
        }

        const filePath = await this.createFilePath(creatorId, fileName, fileExtension);
        await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
        this.logger.info("File uploaded successfully: " + filePath);
        return Result.Ok(filePath);
    }

    public async createFilePath(creatorId: UUID, fileName: string, fileExtension: string): Promise<string> {
        return join(String(process.env.FILE_STORAGE_PATH), `${creatorId}--${fileName}.${fileExtension}`);
    }

    public async getFile(filePath: string): Promise<Result<Buffer, Error>> {
        const file = await fs.readFile(filePath);
        this.logger.info("File retrieved successfully: " + filePath);
        return Result.Ok(file);
    }

    public async deleteFile(filePath: string): Promise<Result<boolean, Error>> {
        await fs.unlink(filePath);
        this.logger.info("File deleted successfully: " + filePath);
        return Result.Ok(true);
    }

    public async renameFile(oldFilePath: string, newFilePath: string): Promise<Result<boolean, Error>> {
        await fs.rename(oldFilePath, newFilePath);
        this.logger.info("File renamed successfully: " + oldFilePath + " to " + newFilePath);
        return Result.Ok(true);
    }

    private getFileExtension(mimeType: string): string | null {
        switch (mimeType) {
            case "application/pdf":
                return FileFormat.PDF;
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return FileFormat.DOCX;
            case "text/plain":
                return FileFormat.TXT;
            case "application/json":
                return FileFormat.JSON;
            case "image/jpeg":
                return FileFormat.JPEG;
            case "image/png":
                return FileFormat.PNG;
            default:
                return null;
        }
    }
}
