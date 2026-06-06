-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#16a34a',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductTags" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "_ProductTags_B_index" ON "_ProductTags"("B");

-- AddForeignKey
ALTER TABLE "_ProductTags" ADD CONSTRAINT "_ProductTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTags" ADD CONSTRAINT "_ProductTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: create the Halal/Organic tags from the existing boolean flags and
-- link them to every product that currently has the flag set, so no data is lost.
INSERT INTO "Tag" ("id","slug","label","color","updatedAt") VALUES
    ('tag_halal',   'halal',   'Halal',   '#16a34a', CURRENT_TIMESTAMP),
    ('tag_organic', 'organic', 'Organic', '#84cc16', CURRENT_TIMESTAMP);

INSERT INTO "_ProductTags" ("A","B") SELECT "id", 'tag_halal'   FROM "Product" WHERE "isHalal"   = true;
INSERT INTO "_ProductTags" ("A","B") SELECT "id", 'tag_organic' FROM "Product" WHERE "isOrganic" = true;

-- Drop the now-migrated boolean columns
ALTER TABLE "Product" DROP COLUMN "isHalal",
DROP COLUMN "isOrganic";
