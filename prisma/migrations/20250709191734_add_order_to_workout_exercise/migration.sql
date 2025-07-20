/*
  Warnings:

  - Added the required column `order` to the `WorkoutExercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkoutExercise" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
