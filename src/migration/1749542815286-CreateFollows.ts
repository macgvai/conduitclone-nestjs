import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFollows1749542815286 implements MigrationInterface {
    name = 'CreateFollows1749542815286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" RENAME COLUMN "folowerId" TO "followerId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" RENAME COLUMN "followerId" TO "folowerId"`);
    }

}
