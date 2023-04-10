import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const TYPEORMCONFIG: TypeOrmModuleOptions = {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    type: "mysql",
    entities: [__dirname + '/../**/*.entity{.js,.ts}'],
    synchronize: true,
}
