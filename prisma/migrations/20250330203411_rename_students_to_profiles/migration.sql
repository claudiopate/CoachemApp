-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT,
    "level" TEXT,
    "preferredSport" TEXT,
    "preferredDays" TEXT[],
    "preferredTimes" TEXT,
    "notes" TEXT,
    "organizationId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "coach_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'lesson',
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_records" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "progress_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE INDEX "profiles_userId_idx" ON "profiles"("userId");

-- CreateIndex
CREATE INDEX "profiles_organizationId_idx" ON "profiles"("organizationId");

-- CreateIndex
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE INDEX "bookings_coach_id_idx" ON "bookings"("coach_id");

-- CreateIndex
CREATE INDEX "bookings_organization_id_idx" ON "bookings"("organization_id");

-- CreateIndex
CREATE INDEX "bookings_date_idx" ON "bookings"("date");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_booking_id_key" ON "attendance"("booking_id");

-- CreateIndex
CREATE INDEX "attendance_booking_id_idx" ON "attendance"("booking_id");

-- CreateIndex
CREATE INDEX "attendance_organization_id_idx" ON "attendance"("organization_id");

-- CreateIndex
CREATE INDEX "progress_records_profile_id_idx" ON "progress_records"("profile_id");

-- CreateIndex
CREATE INDEX "progress_records_organization_id_idx" ON "progress_records"("organization_id");

-- CreateIndex
CREATE INDEX "progress_records_date_idx" ON "progress_records"("date");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "profiles"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_records" ADD CONSTRAINT "progress_records_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
