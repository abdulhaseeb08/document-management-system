import path from "path";
import fs from "fs";

export const createLoggerFolder = (folderName: string): void => {
    const logsDir = path.join(process.cwd(), String(process.env.LOG_FOLDER));
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, {recursive: true});
        return;
    }
    return;
}
