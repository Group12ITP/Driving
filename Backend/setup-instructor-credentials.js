const mongoose = require('mongoose');
const BikeInstructor = require('./Model/BikeInstructorModel');
const BikeCarInstructor = require('./Model/BikeCarInstructorModel');
const HeavyVehicleInstructor = require('./Model/HeavyVehicleInstructor');
const InstructorCredentials = require('./Model/InstructorCredentials');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection
mongoose.connect("mongodb+srv://kanchana:kanchana@userdb.0k55m.mongodb.net/")
  .then(() => console.log('MongoDB connected for instructor credentials setup'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to generate a random password
const generatePassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }
  return password;
};

// Function to extract email from contact info
const getEmail = (contact) => {
  return contact && contact.email ? contact.email : null;
};

// Function to create credentials for instructors
const createInstructorCredentials = async () => {
  try {
    // Clear existing instructor credentials
    await InstructorCredentials.deleteMany({});
    
    // Get all instructors from different collections
    const bikeInstructors = await BikeInstructor.find({});
    const bikeCarInstructors = await BikeCarInstructor.find({});
    const heavyVehicleInstructors = await HeavyVehicleInstructor.find({});
    
    // Create credentials for bike instructors
    for (const instructor of bikeInstructors) {
      const email = getEmail(instructor.contact) || `${instructor.name.toLowerCase().replace(/\s+/g, '.')}@drivemaster.com`;
      const password = generatePassword();
      
      await InstructorCredentials.create({
        instructorId: instructor.instructorId,
        name: instructor.name,
        email: email,
        password: password,
        instructorType: 'Bike'
      });
      
      console.log(`Created credentials for Bike Instructor: ${instructor.name} | Email: ${email} | Password: ${password}`);
    }
    
    // Create credentials for bike-car instructors
    for (const instructor of bikeCarInstructors) {
      const email = getEmail(instructor.contact) || `${instructor.name.toLowerCase().replace(/\s+/g, '.')}@drivemaster.com`;
      const password = generatePassword();
      
      await InstructorCredentials.create({
        instructorId: instructor.instructorId,
        name: instructor.name,
        email: email,
        password: password,
        instructorType: 'BikeCar'
      });
      
      console.log(`Created credentials for BikeCar Instructor: ${instructor.name} | Email: ${email} | Password: ${password}`);
    }
    
    // Create credentials for heavy vehicle instructors
    for (const instructor of heavyVehicleInstructors) {
      const email = getEmail(instructor.contact) || `${instructor.name.toLowerCase().replace(/\s+/g, '.')}@drivemaster.com`;
      const password = generatePassword();
      
      await InstructorCredentials.create({
        instructorId: instructor.instructorId,
        name: instructor.name,
        email: email,
        password: password,
        instructorType: 'HeavyVehicle'
      });
      
      console.log(`Created credentials for Heavy Vehicle Instructor: ${instructor.name} | Email: ${email} | Password: ${password}`);
    }
    
    console.log('Instructor credentials have been created successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating instructor credentials:', error);
    mongoose.connection.close();
  }
};

// Run the setup function
createInstructorCredentials(); 