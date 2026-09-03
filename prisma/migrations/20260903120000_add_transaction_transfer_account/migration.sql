ALTER TABLE "Transaction"
ADD COLUMN "relatedAccountId" TEXT;

CREATE INDEX "Transaction_relatedAccountId_idx" ON "Transaction"("relatedAccountId");

ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_relatedAccountId_fkey"
FOREIGN KEY ("relatedAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
