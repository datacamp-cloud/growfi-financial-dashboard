ALTER TABLE "Transaction"
ADD COLUMN "goalId" TEXT;

CREATE INDEX "Transaction_goalId_idx" ON "Transaction"("goalId");

ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_goalId_fkey"
FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
