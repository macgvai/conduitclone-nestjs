import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1745220548117 implements MigrationInterface {
  name = ' SeedDb1745220548117';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "tags" ("name") VALUES ('dragons'), ('cofee'), ('food'), ('NESTJS'), ('ANGULAR')`,
    );
    // password: 132
    await queryRunner.query(
      `INSERT INTO "users" ("username", "email", "password") VALUES ('Viktor', 'st.viktorr@mail.com', '$2b$10$nFF.Vitdiuvp9h9wIbj10uzKI8lybKAtOhxH8qMvoW.UeuK4SVbfi')`,
    );
    await queryRunner.query(
      `INSERT INTO "articles" ("slug", "title", "description", "body", "tagList", "authorId") VALUES ('first-article', 'First article', 'This is my first article', 'This is my first article', 'dragons,cofee, food', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO "articles" ("slug", "title", "description", "body", "tagList", "authorId") VALUES ('second-article', 'Second article', 'This is my second article', 'This is my second article', 'dragons,cofee', 1)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
