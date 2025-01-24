import { Result } from "joji-ct-fp";
import type { UUID } from "../../../shared/types";

export interface FilePort {
    uploadFile(file: File, fileName: string, creatorId: UUID): Promise<Result<string, Error>>
    getFile(filePath: string): Promise<Result<Buffer, Error>>
    downloadFile(filePath: string, downloadFolder: string): Promise<Result<string, Error>>
    deleteFile(filePath: string): Promise<Result<boolean, Error>>
    renameFile(oldFilePath: string, newFilePath: string): Promise<Result<boolean, Error>>
}