import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { DocumentModel } from './models/DocumentModel';
import { UserModel } from './models/UserModel';
import { PermissionModel } from './models/PermissionModel';

// const AppDataSource = new DataSource({
//   type: 'postgres',
//   url: process.env.DATABASE_URL,
//   host: process.env.HOST,
//   port: Number(process.env.PORT),
//   username: process.env.USERNAME,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
//   entities: [DocumentModel, UserModel, PermissionModel],
// });

// ✅ Initialize the Data Source
const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost', // Replace with your PostgreSQL host
    port: 5432,        // Default PostgreSQL port
    username: 'august_black', // Replace with your PostgreSQL username
    password: 'august_black', // Replace with your PostgreSQL password
    database: 'postgres',    // Replace with your database name
    entities: [UserModel, DocumentModel, PermissionModel],
    synchronize: true, // Auto-create database tables (development only)
});

export default AppDataSource;