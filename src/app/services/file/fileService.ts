import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../../infra/di/inversify/inversify.types";
import type { Logger } from "../../ports/logger/logger";
import { Result } from "joji-ct-fp";
import { promises as fs } from "fs";
import { join } from "path";
import { FileFormat } from "../../../shared/enums/FileFormats";
import { UnsupportedFileFormatError } from "../../errors/DocumentErrors";

@injectable()
export class FileService {
    constructor(
        @inject(INVERIFY_IDENTIFIERS.Logger) private logger: Logger
    ) {}

    public async uploadFile(file: File, fileName: string): Promise<Result<string, Error>> {
        const fileExtension = this.getFileExtension(file.type);
        if (!fileExtension) {
            this.logger.error("Unsupported file format: " + file.type);
            return Result.Err(new UnsupportedFileFormatError(`Unsupported file format ${file.type}`));
        }

        const filePath = join(String(process.env.FILE_STORAGE_PATH), `${fileName}.${fileExtension}`);
        await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
        this.logger.info("File uploaded successfully: " + filePath);
        return Result.Ok(filePath);
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
