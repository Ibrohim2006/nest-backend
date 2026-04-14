import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsers1776174577230 implements MigrationInterface {
    name = 'CreateUsers1776174577230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "firstName" character varying(50) NOT NULL, "lastName" character varying(50) NOT NULL, "email" character varying NOT NULL, "password" character varying(255), "isVerified" boolean NOT NULL DEFAULT false, "isBlocked" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5372672fbfd1677205e0ce3ece" ON "users" ("firstName") `);
        await queryRunner.query(`CREATE INDEX "IDX_af99afb7cf88ce20aff6977e68" ON "users" ("lastName") `);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_136aac53fa22201c0ff93740ab" ON "users" ("email", "isVerified") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_136aac53fa22201c0ff93740ab"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_af99afb7cf88ce20aff6977e68"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5372672fbfd1677205e0ce3ece"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
