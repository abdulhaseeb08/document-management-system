import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../infra/di/inversify/inversify.types";
import type { Logger } from "../../app/ports/logger/logger";
import { Result } from "joji-ct-fp";
import { promises as fs } from "fs";
import { join } from "path";
import { FileFormat } from "../../shared/enums/FileFormats";
import { UnsupportedFileFormatError } from "../../app/errors/DocumentErrors";
import type { UUID } from "../../shared/types";
import type { FilePort } from "../../app/ports/file/File";

@injectable()
export class LocalStorageAdapter implements FilePort {
    constructor(
        @inject(INVERIFY_IDENTIFIERS.Logger) private logger: Logger
    ) {}

    public async uploadFile(file: File, fileName: string, creatorId: UUID): Promise<Result<string, Error>> {
        const fileExtension = this.getFileExtension(file.type);
        if (!fileExtension) {
            this.logger.error("Unsupported file format: " + file.type);
            return Result.Err(new UnsupportedFileFormatError(`Unsupported file format ${file.type}`));
        }

        const filePath = this.createFilePath(creatorId, fileName, fileExtension);
        await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
        this.logger.info("File uploaded successfully: " + filePath);
        return Result.Ok(filePath);
    }

    private createFilePath(creatorId: UUID, fileName: string, fileExtension: string): string {
        return join(String(process.env.FILE_STORAGE_PATH), `${creatorId}--${fileName}.${fileExtension}`);
    }

    public async getFile(filePath: string): Promise<Result<Buffer, Error>> {
        const file = await fs.readFile(filePath);
        this.logger.info("File retrieved successfully: " + filePath);
        return Result.Ok(file);
    }

    public async downloadFile(filePath: string, downloadFolder: string): Promise<Result<string, Error>> {
            const fileName = filePath.split('/').pop();
            if (!fileName) {
                this.logger.error("Invalid file path: " + filePath);
                return Result.Err(new Error("Invalid file path"));
            }

            const destinationPath = join(downloadFolder, fileName);
            await fs.copyFile(filePath, destinationPath);
            this.logger.info("File downloaded successfully to: " + destinationPath);
            return Result.Ok(destinationPath);
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
