require('dotenv').config();
const { sequelize, User, Club, Package, Driver } = require('../models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });

    console.log('🌱 Seeding database...');

    // Super admin
    const adminExists = await User.findOne({ where: { email: 'admin@nightvibe.com' } });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@nightvibe.com',
        phone: '9999999999',
        password: 'Admin@123456',
        role: 'super_admin',
        isActive: true,
        isVerified: true,
      });
      console.log('✅ Super Admin created');
    }

    // Sample clubs
    const clubs = [
      {
        name: 'Zodiac The Club',
        description: 'Premium nightclub experience with live DJs and amazing ambiance',
        address: 'Level 3, DLF Cyber Hub, Gurugram',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        phone: '9876543210',
        email: 'info@zodiacclub.in',
        ownerWhatsapp: '9876543210',
        capacity: 300,
        openTime: '21:00:00',
        closeTime: '04:00:00',
        rating: 4.7,
        amenities: ['Live DJ', 'Bar', 'Dance Floor', 'VIP Lounge', 'Valet Parking'],
        images: ['https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800'],
      },
      {
        name: 'Privee — The Social',
        description: 'Exclusive luxury club with bottle service and international artists',
        address: 'Hotel Shangri-La, Connaught Place, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        phone: '9811223344',
        email: 'reservations@privee.in',
        ownerWhatsapp: '9811223344',
        capacity: 200,
        openTime: '22:00:00',
        closeTime: '05:00:00',
        rating: 4.9,
        amenities: ['Celebrity DJs', 'Premium Bar', 'VIP Tables', 'Rooftop', 'Hookah Lounge'],
        images: ['https://images.unsplash.com/photo-1571204829887-3b8d69e4094d?w=800'],
      },
      {
        name: 'F Bar & Lounge',
        description: 'Mumbai\'s hottest nightlife destination with stunning skyline views',
        address: 'Kamala Mills, Lower Parel, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400013',
        phone: '9920123456',
        email: 'hello@fbar.in',
        ownerWhatsapp: '9920123456',
        capacity: 250,
        openTime: '20:00:00',
        closeTime: '03:00:00',
        rating: 4.6,
        amenities: ['Skyline View', 'Live Music', 'Craft Cocktails', 'Food Menu', 'Private Cabins'],
        images: ['https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800'],
      },
    ];

    const createdClubs = [];
    for (const clubData of clubs) {
      const [club] = await Club.findOrCreate({ where: { name: clubData.name }, defaults: clubData });
      createdClubs.push(club);
      console.log(`✅ Club: ${club.name}`);
    }

    // Packages for each club
    for (const club of createdClubs) {
      const existingPkg = await Package.count({ where: { clubId: club.id } });
      if (existingPkg > 0) continue;

      await Package.bulkCreate([
        {
          clubId: club.id,
          name: 'Entry Only',
          description: 'Basic entry to the club',
          type: 'entry_only',
          pricePerPerson: 800,
          priceCouple: 1400,
          priceGroup: 700,
          includesTransport: false,
          includesDrinks: false,
          features: ['Club Entry', 'Dance Floor Access', 'Coat Check'],
        },
        {
          clubId: club.id,
          name: 'Entry + Drinks',
          description: 'Entry with complimentary drinks package',
          type: 'entry_drinks',
          pricePerPerson: 1500,
          priceCouple: 2500,
          priceGroup: 1300,
          includesTransport: false,
          includesDrinks: true,
          drinksAllowance: 2,
          features: ['Club Entry', '2 Premium Drinks', 'Dance Floor', 'Priority Queue'],
        },
        {
          clubId: club.id,
          name: 'Entry + Cab',
          description: 'Entry with cab pickup and drop service',
          type: 'entry_cab',
          pricePerPerson: 1800,
          priceCouple: 3000,
          priceGroup: 1600,
          includesTransport: true,
          includesDrinks: false,
          features: ['Club Entry', 'Cab Pickup & Drop', 'Safe Ride Home', 'Dance Floor'],
        },
        {
          clubId: club.id,
          name: 'Full Combo ⭐',
          description: 'Everything included — entry, drinks, and transport',
          type: 'full_combo',
          pricePerPerson: 2500,
          priceCouple: 4200,
          priceGroup: 2200,
          includesTransport: true,
          includesDrinks: true,
          drinksAllowance: 3,
          features: ['Club Entry', '3 Premium Drinks', 'Cab Pickup & Drop', 'VIP Queue', 'Coat Check', 'Priority Table'],
        },
      ]);
      console.log(`✅ Packages created for ${club.name}`);
    }

    // Sample drivers
    const driverData = [
      { name: 'Rajesh Kumar', phone: '9988776655', whatsapp: '9988776655', licenseNumber: 'HR26AB1234', vehicleType: 'cab', vehicleNumber: 'HR26 AB 1234', vehicleModel: 'Swift Dzire', rating: 4.8 },
      { name: 'Suresh Singh', phone: '9977665544', whatsapp: '9977665544', licenseNumber: 'DL3CAB5678', vehicleType: 'cab', vehicleNumber: 'DL3C AB 5678', vehicleModel: 'Honda City', rating: 4.9 },
      { name: 'Amit Sharma', phone: '9966554433', whatsapp: '9966554433', licenseNumber: 'MH12AB9012', vehicleType: 'bike', vehicleNumber: 'MH12 AB 9012', vehicleModel: 'Royal Enfield', rating: 4.7 },
    ];

    for (const d of driverData) {
      await Driver.findOrCreate({ where: { phone: d.phone }, defaults: d });
    }
    console.log('✅ Drivers created');

    console.log('\n🎉 Seed completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 Admin Login:');
    console.log('   Email: admin@nightvibe.com');
    console.log('   Password: Admin@123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
