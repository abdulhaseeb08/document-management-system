import { DataSource } from 'typeorm';
import type { CommandResult } from '../../../../shared/types';

export const initializeDataSource = async(dataSource: DataSource): Promise<CommandResult<DataSource>> => {
    try {
        await dataSource.initialize();
        return { success: true, value: dataSource };
    } catch (err) {
        return { success: false, error: err as Error };
    }
};

