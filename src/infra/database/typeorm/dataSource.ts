import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { DocumentEntity } from './entities/DocumentEntity';
import { UserEntity } from './entities/UserEntity';
import { PermissionEntity } from './entities/PermissionEntity';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [DocumentEntity, UserEntity, PermissionEntity],
});

export default AppDataSource;