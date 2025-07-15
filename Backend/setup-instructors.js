const mongoose = require('mongoose');
const BikeInstructor = require('./Model/BikeInstructorModel');
const BikeCarInstructor = require('./Model/BikeCarInstructorModel');
const HeavyVehicleInstructor = require('./Model/HeavyVehicleInstructor');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection
mongoose.connect("mongodb+srv://kanchana:kanchana@userdb.0k55m.mongodb.net/")
  .then(() => console.log('MongoDB connected for instructor setup'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample instructors data
const bikeInstructors = [
  {
    instructorId: 'BO001',
    name: 'John Rider',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    experience: 8,
    description: 'Specialized in teaching beginners how to ride motorcycles safely. Expert in traffic navigation techniques for urban environments.',
    ratings: 4.7,
    reviewCount: 124,
    specialization: 'Bike Training',
    contact: {
      email: 'john.rider@drivemaster.com',
      phone: '555-123-4567'
    }
  },
  {
    instructorId: 'BO002',
    name: 'Sara Wheels',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    experience: 6,
    description: 'Former motorcycle racer with extensive experience teaching defensive riding techniques and advanced maneuvers.',
    ratings: 4.9,
    reviewCount: 89,
    specialization: 'Advanced Bike Training',
    contact: {
      email: 'sara.wheels@drivemaster.com',
      phone: '555-789-0123'
    }
  },
  {
    instructorId: 'BO003',
    name: 'Mike Speed',
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    experience: 5,
    description: 'Specializes in sport bike training and safety. Certified in advanced riding techniques and emergency maneuvers.',
    ratings: 4.5,
    reviewCount: 76,
    specialization: 'Sport Bike Training',
    contact: {
      email: 'mike.speed@drivemaster.com',
      phone: '555-456-7890'
    }
  }
];

const bikeCarInstructors = [
  {
    instructorId: 'BC001',
    name: 'David Thompson',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    experience: 12,
    description: 'Dual-certified instructor with expertise in both car and motorcycle training. Specializes in helping students transition between vehicles.',
    ratings: 4.8,
    reviewCount: 156,
    specialization: 'Bike & Car Training',
    vehicleTypes: ['Bike', 'Car', 'Sedan', 'SUV'],
    contact: {
      email: 'david.thompson@drivemaster.com',
      phone: '555-234-5678'
    }
  },
  {
    instructorId: 'BC002',
    name: 'Emma Rodriguez',
    image: 'https://randomuser.me/api/portraits/women/28.jpg',
    experience: 10,
    description: 'Patient instructor who adapts teaching methods to individual learning styles. Experienced with anxious students and those with special needs.',
    ratings: 4.9,
    reviewCount: 203,
    specialization: 'Multi-vehicle Training',
    vehicleTypes: ['Bike', 'Car', 'Compact'],
    contact: {
      email: 'emma.rodriguez@drivemaster.com',
      phone: '555-345-6789'
    }
  },
  {
    instructorId: 'BC003',
    name: 'James Wilson',
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
    experience: 7,
    description: 'Former driving examiner with insider knowledge of test requirements. High pass rate for both motorcycle and car license tests.',
    ratings: 4.6,
    reviewCount: 118,
    specialization: 'License Test Preparation',
    vehicleTypes: ['Bike', 'Car', 'Manual', 'Automatic'],
    contact: {
      email: 'james.wilson@drivemaster.com',
      phone: '555-567-8901'
    }
  }
];

const heavyVehicleInstructors = [
  {
    instructorId: 'HV001',
    name: 'Robert Trucks',
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
    experience: 15,
    description: 'Former long-haul truck driver with over a million safe miles. Specializes in teaching defensive driving for large vehicles and load management.',
    ratings: 4.8,
    reviewCount: 87,
    specialization: 'Heavy Vehicle Training',
    vehicleTypes: ['Truck', 'HGV'],
    licenseTypes: ['Class A', 'Class B'],
    contact: {
      email: 'robert.trucks@drivemaster.com',
      phone: '555-678-9012'
    }
  },
  {
    instructorId: 'HV002',
    name: 'Patricia Bus',
    image: 'https://randomuser.me/api/portraits/women/36.jpg',
    experience: 11,
    description: 'Professional bus driver turned instructor. Expert in passenger transport safety and urban route navigation.',
    ratings: 4.7,
    reviewCount: 64,
    specialization: 'Bus Training',
    vehicleTypes: ['Bus'],
    licenseTypes: ['Class B', 'Passenger Endorsement'],
    contact: {
      email: 'patricia.bus@drivemaster.com',
      phone: '555-789-0123'
    }
  },
  {
    instructorId: 'HV003',
    name: 'George Heavy',
    image: 'https://randomuser.me/api/portraits/men/78.jpg',
    experience: 18,
    description: 'Comprehensive experience with all types of heavy vehicles. Specializes in training for hazardous materials transport.',
    ratings: 4.9,
    reviewCount: 92,
    specialization: 'Specialized Heavy Vehicle Training',
    vehicleTypes: ['Truck', 'Bus', 'HGV', 'LGV'],
    licenseTypes: ['Class A', 'Class B', 'Hazmat Endorsement', 'Tanker Endorsement'],
    contact: {
      email: 'george.heavy@drivemaster.com',
      phone: '555-890-1234'
    }
  }
];

// Function to populate the database
const populateInstructors = async () => {
  try {
    // Clear existing data
    await BikeInstructor.deleteMany({});
    await BikeCarInstructor.deleteMany({});
    await HeavyVehicleInstructor.deleteMany({});

    // Insert new data
    await BikeInstructor.insertMany(bikeInstructors);
    await BikeCarInstructor.insertMany(bikeCarInstructors);
    await HeavyVehicleInstructor.insertMany(heavyVehicleInstructors);
    
    console.log('Sample instructor data has been inserted successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error populating instructors data:', error);
    mongoose.connection.close();
  }
};

// Run the populate function
populateInstructors(); 