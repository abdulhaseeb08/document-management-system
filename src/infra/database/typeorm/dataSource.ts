import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { DocumentModel } from './models/DocumentModel';
import { UserModel } from './models/UserModel';
import { PermissionModel } from './models/PermissionModel';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [DocumentModel, UserModel, PermissionModel],
  synchronize: true,
});

export default AppDataSource;