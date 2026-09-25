/**
 * BloodConnect Seed Script
 * Run: npm run seed (or node utils/seed.js)
 *
 * Creates:
 *  - 1 admin user
 *  - 5 donor users + donor profiles
 *  - 3 hospital users + hospital profiles
 *  - Blood stock for all 8 blood groups
 *  - 10 blood requests
 *  - 5 donations
 *  - Sample notifications
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const BloodStock = require('../models/BloodStock');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ─── Seed Data Definitions ────────────────────────────────────────────────────

const adminData = {
  name: 'BloodConnect Admin',
  email: 'admin@bloodconnect.com',
  password: 'Admin@123',
  role: 'admin',
};

const donorsData = [
  {
    user: { name: 'Rajesh Kumar', email: 'rajesh@example.com', password: 'Donor@123', role: 'donor' },
    profile: {
      phone: '9876543210',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'Male',
      bloodGroup: 'O+',
      address: '12, MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      availabilityStatus: 'AVAILABLE',
    },
  },
  {
    user: { name: 'Priya Sharma', email: 'priya@example.com', password: 'Donor@123', role: 'donor' },
    profile: {
      phone: '9876543211',
      dateOfBirth: new Date('1995-08-22'),
      gender: 'Female',
      bloodGroup: 'A+',
      address: '45, Park Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      availabilityStatus: 'AVAILABLE',
    },
  },
  {
    user: { name: 'Amit Patel', email: 'amit@example.com', password: 'Donor@123', role: 'donor' },
    profile: {
      phone: '9876543212',
      dateOfBirth: new Date('1988-12-10'),
      gender: 'Male',
      bloodGroup: 'B+',
      address: '78, Gandhi Nagar',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001',
      availabilityStatus: 'AVAILABLE',
    },
  },
  {
    user: { name: 'Sneha Reddy', email: 'sneha@example.com', password: 'Donor@123', role: 'donor' },
    profile: {
      phone: '9876543213',
      dateOfBirth: new Date('1992-03-28'),
      gender: 'Female',
      bloodGroup: 'AB+',
      address: '23, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      availabilityStatus: 'UNAVAILABLE',
    },
  },
  {
    user: { name: 'Vikram Singh', email: 'vikram@example.com', password: 'Donor@123', role: 'donor' },
    profile: {
      phone: '9876543214',
      dateOfBirth: new Date('1985-07-04'),
      gender: 'Male',
      bloodGroup: 'O-',
      address: '56, Civil Lines',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      availabilityStatus: 'AVAILABLE',
    },
  },
];

const hospitalsData = [
  {
    user: { name: 'Apollo Hospital Admin', email: 'apollo@example.com', password: 'Hospital@123', role: 'hospital' },
    profile: {
      hospitalName: 'Apollo Hospitals',
      phone: '08012345678',
      licenseNumber: 'MH-HOSP-2023-001',
      address: '154/11, Bannerghatta Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560076',
      verificationStatus: 'VERIFIED',
    },
  },
  {
    user: { name: 'Fortis Healthcare Admin', email: 'fortis@example.com', password: 'Hospital@123', role: 'hospital' },
    profile: {
      hospitalName: 'Fortis Memorial Research Institute',
      phone: '01123456789',
      licenseNumber: 'DL-HOSP-2023-002',
      address: 'Sector 44, Gurugram',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      verificationStatus: 'VERIFIED',
    },
  },
  {
    user: { name: 'AIIMS Admin', email: 'aiims@example.com', password: 'Hospital@123', role: 'hospital' },
    profile: {
      hospitalName: 'All India Institute of Medical Sciences',
      phone: '01126588500',
      licenseNumber: 'DL-HOSP-2023-003',
      address: 'Ansari Nagar East, New Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110029',
      verificationStatus: 'PENDING',
    },
  },
];

const bloodStockData = [
  { bloodGroup: 'A+',  unitsAvailable: 45 },
  { bloodGroup: 'A-',  unitsAvailable: 12 },
  { bloodGroup: 'B+',  unitsAvailable: 38 },
  { bloodGroup: 'B-',  unitsAvailable: 8  },
  { bloodGroup: 'AB+', unitsAvailable: 22 },
  { bloodGroup: 'AB-', unitsAvailable: 5  },
  { bloodGroup: 'O+',  unitsAvailable: 60 },
  { bloodGroup: 'O-',  unitsAvailable: 3  },
];

// ─── Connect and Seed ─────────────────────────────────────────────────────────

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB');

    // ── Wipe existing data ──────────────────────────────────────────────────
    console.log('\n🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Donor.deleteMany({}),
      Hospital.deleteMany({}),
      BloodStock.deleteMany({}),
      BloodRequest.deleteMany({}),
      Donation.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('   ✔ All collections cleared');

    // ── Create Admin ────────────────────────────────────────────────────────
    console.log('\n👤 Creating admin user...');
    const adminUser = await User.create(adminData);
    console.log(`   ✔ Admin: ${adminUser.email} | Password: Admin@123`);

    // ── Create Donors ───────────────────────────────────────────────────────
    console.log('\n🩸 Creating donors...');
    const createdDonors = [];
    for (const d of donorsData) {
      const user = await User.create(d.user);
      const profile = await Donor.create({ user: user._id, ...d.profile });
      createdDonors.push({ user, profile });
      console.log(`   ✔ Donor: ${user.email} | BG: ${profile.bloodGroup} | Password: Donor@123`);
    }

    // ── Create Hospitals ────────────────────────────────────────────────────
    console.log('\n🏥 Creating hospitals...');
    const createdHospitals = [];
    for (const h of hospitalsData) {
      const user = await User.create(h.user);
      const profile = await Hospital.create({ user: user._id, ...h.profile });
      createdHospitals.push({ user, profile });
      console.log(
        `   ✔ Hospital: ${user.email} | ${profile.hospitalName} | Status: ${profile.verificationStatus} | Password: Hospital@123`
      );
    }

    // ── Blood Stock ─────────────────────────────────────────────────────────
    console.log('\n💉 Creating blood stock...');
    const stockDocs = await BloodStock.insertMany(bloodStockData);
    stockDocs.forEach((s) => {
      console.log(`   ✔ ${s.bloodGroup}: ${s.unitsAvailable} units → ${s.status}`);
    });

    // ── Blood Requests ──────────────────────────────────────────────────────
    console.log('\n📋 Creating blood requests...');
    const verifiedHospitals = createdHospitals.filter(
      (h) => h.profile.verificationStatus === 'VERIFIED'
    );

    const requestsData = [
      {
        hospital: verifiedHospitals[0].profile._id,
        patientName: 'Ravi Shankar',
        bloodGroup: 'O+',
        unitsRequired: 3,
        requiredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        city: 'Bangalore',
        reason: 'Surgery - knee replacement',
        urgency: 'URGENT',
        contactNumber: '9876501234',
        status: 'APPROVED',
      },
      {
        hospital: verifiedHospitals[0].profile._id,
        patientName: 'Meera Nair',
        bloodGroup: 'A+',
        unitsRequired: 2,
        requiredDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        city: 'Bangalore',
        reason: 'Road accident - internal bleeding',
        urgency: 'EMERGENCY',
        contactNumber: '9876501235',
        status: 'PENDING',
      },
      {
        hospital: verifiedHospitals[0].profile._id,
        patientName: 'Suresh Babu',
        bloodGroup: 'B+',
        unitsRequired: 4,
        requiredDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        city: 'Bangalore',
        reason: 'Thalassemia treatment',
        urgency: 'NORMAL',
        contactNumber: '9876501236',
        status: 'COMPLETED',
      },
      {
        hospital: verifiedHospitals[1].profile._id,
        patientName: 'Anita Desai',
        bloodGroup: 'AB+',
        unitsRequired: 1,
        requiredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        city: 'Gurugram',
        reason: 'Dengue - platelet transfusion',
        urgency: 'URGENT',
        contactNumber: '9876501237',
        status: 'APPROVED',
      },
      {
        hospital: verifiedHospitals[1].profile._id,
        patientName: 'Kartik Malhotra',
        bloodGroup: 'O-',
        unitsRequired: 5,
        requiredDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        city: 'Gurugram',
        reason: 'Heart bypass surgery',
        urgency: 'EMERGENCY',
        contactNumber: '9876501238',
        status: 'PENDING',
      },
      {
        hospital: verifiedHospitals[0].profile._id,
        patientName: 'Deepak Sharma',
        bloodGroup: 'A-',
        unitsRequired: 2,
        requiredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        city: 'Bangalore',
        reason: 'Liver transplant preparation',
        urgency: 'NORMAL',
        contactNumber: '9876501239',
        status: 'PENDING',
      },
      {
        hospital: verifiedHospitals[1].profile._id,
        patientName: 'Lakshmi Iyer',
        bloodGroup: 'B-',
        unitsRequired: 3,
        requiredDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        city: 'Delhi',
        reason: 'Cancer chemotherapy support',
        urgency: 'URGENT',
        contactNumber: '9876501240',
        status: 'REJECTED',
        notes: 'Insufficient stock for requested blood group',
      },
      {
        hospital: verifiedHospitals[0].profile._id,
        patientName: 'Mohan Das',
        bloodGroup: 'O+',
        unitsRequired: 2,
        requiredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        city: 'Bangalore',
        reason: 'Post-surgery recovery',
        urgency: 'NORMAL',
        contactNumber: '9876501241',
        status: 'APPROVED',
      },
      {
        hospital: verifiedHospitals[1].profile._id,
        patientName: 'Pooja Gupta',
        bloodGroup: 'AB-',
        unitsRequired: 2,
        requiredDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        city: 'Gurugram',
        reason: 'Childbirth complications',
        urgency: 'URGENT',
        contactNumber: '9876501242',
        status: 'PENDING',
      },
      {
        hospital: verifiedHospitals[0].profile._id,
        patientName: 'Rohit Verma',
        bloodGroup: 'A+',
        unitsRequired: 1,
        requiredDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        city: 'Bangalore',
        reason: 'Elective surgery preparation',
        urgency: 'NORMAL',
        contactNumber: '9876501243',
        status: 'COMPLETED',
      },
    ];

    const createdRequests = await BloodRequest.insertMany(requestsData);
    console.log(`   ✔ Created ${createdRequests.length} blood requests`);

    // ── Donations ───────────────────────────────────────────────────────────
    console.log('\n🩸 Creating donations...');
    const donationsData = [
      {
        donor: createdDonors[0].profile._id,
        bloodGroup: 'O+',
        unitsDonated: 1,
        donationDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), // 100 days ago
        location: 'BloodConnect Center, Bangalore',
        notes: 'Voluntary donation',
        recordedBy: adminUser._id,
      },
      {
        donor: createdDonors[1].profile._id,
        bloodGroup: 'A+',
        unitsDonated: 1,
        donationDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
        location: 'BloodConnect Center, Mumbai',
        notes: 'Camp donation',
        recordedBy: adminUser._id,
      },
      {
        donor: createdDonors[2].profile._id,
        bloodGroup: 'B+',
        unitsDonated: 1,
        donationDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        location: 'Apollo Hospital Donation Drive, Ahmedabad',
        notes: 'Hospital drive',
        recordedBy: adminUser._id,
      },
      {
        donor: createdDonors[4].profile._id,
        bloodGroup: 'O-',
        unitsDonated: 1,
        donationDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
        location: 'Red Cross Camp, Delhi',
        notes: 'Universal donor - emergency camp',
        recordedBy: adminUser._id,
      },
      {
        donor: createdDonors[0].profile._id,
        bloodGroup: 'O+',
        unitsDonated: 1,
        donationDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
        location: 'BloodConnect Center, Bangalore',
        notes: 'Second donation',
        recordedBy: adminUser._id,
      },
    ];

    const createdDonations = await Donation.insertMany(donationsData);
    console.log(`   ✔ Created ${createdDonations.length} donations`);

    // Update donor stats based on donations
    // Donor 0 (Rajesh) - 2 donations
    await Donor.findByIdAndUpdate(createdDonors[0].profile._id, {
      donationCount: 2,
      lastDonationDate: donationsData[0].donationDate, // most recent
    });
    // Donor 1 (Priya) - 1 donation
    await Donor.findByIdAndUpdate(createdDonors[1].profile._id, {
      donationCount: 1,
      lastDonationDate: donationsData[1].donationDate,
    });
    // Donor 2 (Amit) - 1 donation
    await Donor.findByIdAndUpdate(createdDonors[2].profile._id, {
      donationCount: 1,
      lastDonationDate: donationsData[2].donationDate,
    });
    // Donor 4 (Vikram) - 1 donation
    await Donor.findByIdAndUpdate(createdDonors[4].profile._id, {
      donationCount: 1,
      lastDonationDate: donationsData[3].donationDate,
    });
    console.log('   ✔ Updated donor donation counts and last donation dates');

    // ── Notifications ───────────────────────────────────────────────────────
    console.log('\n🔔 Creating sample notifications...');
    const notificationsData = [
      {
        user: adminUser._id,
        message: '⚠️ LOW STOCK: O- blood group has only 3 units remaining.',
        type: 'LOW_STOCK',
        isRead: false,
      },
      {
        user: adminUser._id,
        message: '⚠️ LOW STOCK: AB- blood group has only 5 units remaining.',
        type: 'LOW_STOCK',
        isRead: false,
      },
      {
        user: adminUser._id,
        message: '🆘 EMERGENCY: New blood request from Apollo Hospitals for 2 units of A+. City: Bangalore.',
        type: 'EMERGENCY',
        isRead: false,
      },
      {
        user: createdHospitals[0].user._id,
        message: 'Your blood request for 3 units of O+ has been APPROVED.',
        type: 'REQUEST_APPROVED',
        isRead: false,
      },
      {
        user: createdHospitals[0].user._id,
        message: 'Your blood request for 4 units of B+ has been COMPLETED. Blood units dispatched.',
        type: 'REQUEST_COMPLETED',
        isRead: true,
      },
      {
        user: createdHospitals[1].user._id,
        message: 'Your hospital has been verified. You can now submit blood requests.',
        type: 'REQUEST_APPROVED',
        isRead: true,
      },
      {
        user: createdHospitals[1].user._id,
        message: 'Your blood request for 3 units of B- has been REJECTED. Reason: Insufficient stock for requested blood group',
        type: 'REQUEST_REJECTED',
        isRead: false,
      },
      {
        user: createdDonors[0].user._id,
        message: 'Thank you! Your donation of 1 unit of O+ blood has been recorded. Total donations: 2.',
        type: 'DONATION_RECORDED',
        isRead: false,
      },
      {
        user: createdDonors[1].user._id,
        message: 'Thank you! Your donation of 1 unit of A+ blood has been recorded. Total donations: 1.',
        type: 'DONATION_RECORDED',
        isRead: true,
      },
      {
        user: createdDonors[4].user._id,
        message: 'Thank you! Your donation of 1 unit of O- blood has been recorded. Total donations: 1.',
        type: 'DONATION_RECORDED',
        isRead: false,
      },
    ];

    await Notification.insertMany(notificationsData);
    console.log(`   ✔ Created ${notificationsData.length} notifications`);

    // ── Summary ─────────────────────────────────────────────────────────────
    console.log('\n' + '═'.repeat(60));
    console.log('✅ SEED COMPLETED SUCCESSFULLY');
    console.log('═'.repeat(60));
    console.log('\n📋 CREDENTIALS SUMMARY:');
    console.log('\n  [ADMIN]');
    console.log(`    Email    : admin@bloodconnect.com`);
    console.log(`    Password : Admin@123`);
    console.log('\n  [DONORS]');
    donorsData.forEach((d, i) => {
      console.log(`    ${i + 1}. ${d.user.email} | BG: ${d.profile.bloodGroup} | Password: Donor@123`);
    });
    console.log('\n  [HOSPITALS]');
    hospitalsData.forEach((h, i) => {
      console.log(
        `    ${i + 1}. ${h.user.email} | ${h.profile.hospitalName} (${h.profile.verificationStatus}) | Password: Hospital@123`
      );
    });
    console.log('\n' + '═'.repeat(60));
    console.log('Blood Stock:');
    bloodStockData.forEach((s) => {
      const status = s.unitsAvailable === 0 ? 'OUT_OF_STOCK' : s.unitsAvailable <= 10 ? 'LOW_STOCK ⚠️' : 'AVAILABLE ✅';
      console.log(`    ${s.bloodGroup.padEnd(4)}: ${String(s.unitsAvailable).padStart(3)} units — ${status}`);
    });
    console.log('═'.repeat(60) + '\n');

    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed. Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
};

seed();
