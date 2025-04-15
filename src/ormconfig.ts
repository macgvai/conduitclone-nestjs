import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '95.31.29.96',
  port: 5432,
  username: 'conduitclone',
  password: '*****',
  database: 'conduitclone',
  schema: 'public',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
export default config;
