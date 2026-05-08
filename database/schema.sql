-- NightVibe Database Schema
-- Run this to create all tables manually (Sequelize auto-syncs, but this is for reference)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer','club_owner','super_admin')),
  "isActive" BOOLEAN DEFAULT TRUE,
  "isVerified" BOOLEAN DEFAULT FALSE,
  "profileImage" VARCHAR(500),
  "whatsappEnabled" BOOLEAN DEFAULT TRUE,
  "lastLogin" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Clubs
CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  phone VARCHAR(15) NOT NULL,
  email VARCHAR(255),
  "ownerWhatsapp" VARCHAR(15) NOT NULL,
  images TEXT[] DEFAULT '{}',
  "openTime" TIME,
  "closeTime" TIME,
  capacity INT DEFAULT 200,
  "isActive" BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0,
  "totalReviews" INT DEFAULT 0,
  amenities TEXT[] DEFAULT '{}',
  "ownerId" UUID,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Packages
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "clubId" UUID REFERENCES clubs(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  type VARCHAR(30) CHECK (type IN ('entry_only','entry_drinks','entry_cab','entry_bike','full_combo')),
  "pricePerPerson" DECIMAL(10,2) NOT NULL,
  "priceCouple" DECIMAL(10,2),
  "priceGroup" DECIMAL(10,2),
  "includesTransport" BOOLEAN DEFAULT FALSE,
  "includesDrinks" BOOLEAN DEFAULT FALSE,
  "drinksAllowance" INT DEFAULT 0,
  "isActive" BOOLEAN DEFAULT TRUE,
  "maxPeople" INT DEFAULT 50,
  features TEXT[] DEFAULT '{}',
  "imageUrl" VARCHAR(500),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "bookingId" VARCHAR(20) UNIQUE NOT NULL,
  "userId" UUID REFERENCES users(id),
  "clubId" UUID REFERENCES clubs(id),
  "packageId" UUID REFERENCES packages(id),
  "visitDate" DATE NOT NULL,
  "visitTime" TIME NOT NULL,
  "numberOfPeople" INT NOT NULL,
  "guestType" VARCHAR(10) CHECK ("guestType" IN ('single','couple','group')),
  "tableRequired" BOOLEAN DEFAULT FALSE,
  "transportRequired" BOOLEAN DEFAULT FALSE,
  "transportType" VARCHAR(10) DEFAULT 'none',
  "pickupLocation" TEXT,
  "pickupLatitude" DECIMAL(10,8),
  "pickupLongitude" DECIMAL(11,8),
  "pickupTime" TIME,
  status VARCHAR(20) DEFAULT 'pending',
  "totalAmount" DECIMAL(10,2) NOT NULL,
  "advanceAmount" DECIMAL(10,2) NOT NULL,
  "specialRequests" TEXT,
  "promoCode" VARCHAR(50),
  "discountAmount" DECIMAL(10,2) DEFAULT 0,
  "qrCode" TEXT,
  "checkedIn" BOOLEAN DEFAULT FALSE,
  "checkedInAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Drivers
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  whatsapp VARCHAR(15),
  "licenseNumber" VARCHAR(50) NOT NULL,
  "vehicleType" VARCHAR(10) CHECK ("vehicleType" IN ('cab','bike','both')),
  "vehicleNumber" VARCHAR(20) NOT NULL,
  "vehicleModel" VARCHAR(100),
  "isAvailable" BOOLEAN DEFAULT TRUE,
  "isActive" BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 5.0,
  "totalTrips" INT DEFAULT 0,
  "profileImage" VARCHAR(500),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Transports
CREATE TABLE IF NOT EXISTS transports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "bookingId" UUID REFERENCES bookings(id),
  "driverId" UUID REFERENCES drivers(id),
  type VARCHAR(10) CHECK (type IN ('cab','bike')),
  "pickupLocation" TEXT NOT NULL,
  "pickupLatitude" DECIMAL(10,8),
  "pickupLongitude" DECIMAL(11,8),
  "pickupTime" TIME NOT NULL,
  status VARCHAR(30) DEFAULT 'scheduled',
  "driverNotified" BOOLEAN DEFAULT FALSE,
  "customerNotified" BOOLEAN DEFAULT FALSE,
  "estimatedArrival" TIMESTAMPTZ,
  "completedAt" TIMESTAMPTZ,
  notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "bookingId" UUID REFERENCES bookings(id),
  "razorpayOrderId" VARCHAR(100),
  "razorpayPaymentId" VARCHAR(100),
  "razorpaySignature" VARCHAR(500),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(5) DEFAULT 'INR',
  method VARCHAR(20),
  status VARCHAR(20) DEFAULT 'created',
  "paidAt" TIMESTAMPTZ,
  "refundId" VARCHAR(100),
  "refundAmount" DECIMAL(10,2),
  "refundedAt" TIMESTAMPTZ,
  notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID,
  "bookingId" UUID,
  type VARCHAR(50) NOT NULL,
  channel VARCHAR(20) NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  "sentAt" TIMESTAMPTZ,
  "errorMessage" TEXT,
  metadata JSONB DEFAULT '{}',
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings("userId");
CREATE INDEX IF NOT EXISTS idx_bookings_club ON bookings("clubId");
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings("visitDate");
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_transports_booking ON transports("bookingId");
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments("bookingId");
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications("userId");
