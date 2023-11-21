import { MigrationInterface, QueryRunner } from "typeorm";

export class default1694631313564 implements MigrationInterface {
    name = 'default1694631313564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "financial" ("id" SERIAL NOT NULL, "totalMoneyBet" character varying NOT NULL, "date" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_9095bd42e3bb76c634d7561eb45" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "financial" ADD CONSTRAINT "FK_4ab5e3f5930b9afe135ac42c533" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "financial" DROP CONSTRAINT "FK_4ab5e3f5930b9afe135ac42c533"`);
        await queryRunner.query(`DROP TABLE "financial"`);
    }

}
