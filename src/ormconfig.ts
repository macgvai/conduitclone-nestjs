import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'postgres',
  host: '192.168.1.90',
  // host: '95.31.29.96',
  port: 5432,
  username: 'conduitclone',
  password: '45893',
  database: 'conduitclone',
  schema: 'public',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/migration/**/*{.ts,.js}'],
};
export default config;
