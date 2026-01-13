-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "action_url" TEXT,
ADD COLUMN     "entity_id" INTEGER,
ADD COLUMN     "entity_type" TEXT;

-- CreateIndex
CREATE INDEX "Notification_user_id_idx" ON "public"."Notification"("user_id");

-- CreateIndex
CREATE INDEX "Notification_entity_type_entity_id_idx" ON "public"."Notification"("entity_type", "entity_id");
