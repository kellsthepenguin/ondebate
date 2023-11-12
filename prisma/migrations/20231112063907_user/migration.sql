-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "pw" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
