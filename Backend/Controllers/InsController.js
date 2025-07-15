const BikeInstructor = require('../Model/BikeInstructorModel');
const BikeCarInstructor = require('../Model/BikeCarInstructorModel');
const HeavyVehicleInstructor = require('../Model/HeavyVehicleInstructor');
const EnrolledCourse = require('../Model/EnrolledCourse');

// Get all instructors
const getAllInstructors = async (req, res) => {
  try {
    console.log('Fetching all instructors');
    const bikeInstructors = await BikeInstructor.find();
    const bikeCarInstructors = await BikeCarInstructor.find();
    const heavyVehicleInstructors = await HeavyVehicleInstructor.find();
    
    console.log(`Found: ${bikeInstructors.length} bike instructors, ${bikeCarInstructors.length} bike/car instructors, ${heavyVehicleInstructors.length} heavy vehicle instructors`);
    
    res.status(200).json({
      success: true,
      instructors: {
        bike: bikeInstructors,
        bikeCar: bikeCarInstructors,
        heavyVehicle: heavyVehicleInstructors
      }
    });
  } catch (error) {
    console.error('Error in getAllInstructors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch instructors',
      error: error.message
    });
  }
};

// Get instructors by type
const getInstructorsByType = async (req, res) => {
  try {
    const { type } = req.params;
    console.log(`Fetching instructors of type: ${type}`);
    
    let instructors = [];
    
    switch (type) {
      case 'bike':
        instructors = await BikeInstructor.find({ availability: true });
        break;
      case 'bikeCar':
        instructors = await BikeCarInstructor.find({ availability: true });
        break;
      case 'heavyVehicle':
        instructors = await HeavyVehicleInstructor.find({ availability: true });
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid instructor type'
        });
    }
    
    console.log(`Found ${instructors.length} instructors of type ${type}`);
    
    res.status(200).json({
      success: true,
      instructors
    });
  } catch (error) {
    console.error('Error in getInstructorsByType:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch instructors',
      error: error.message
    });
  }
};

// Create a new instructor
const createInstructor = async (req, res) => {
  try {
    const { type, instructorData } = req.body;
    console.log(`Creating instructor of type: ${type}`);
    console.log('Data:', instructorData);
    
    let instructor;
    
    switch (type) {
      case 'bike':
        instructor = await BikeInstructor.create(instructorData);
        break;
      case 'bikeCar':
        instructor = await BikeCarInstructor.create(instructorData);
        break;
      case 'heavyVehicle':
        instructor = await HeavyVehicleInstructor.create(instructorData);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid instructor type'
        });
    }
    
    console.log('Instructor created successfully');
    
    res.status(201).json({
      success: true,
      instructor
    });
  } catch (error) {
    console.error('Error in createInstructor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create instructor',
      error: error.message
    });
  }
};

// Get instructor by ID
const getInstructorById = async (req, res) => {
  try {
    const { type, id } = req.params;
    console.log(`Fetching instructor of type ${type} with ID: ${id}`);
    
    let instructor;
    
    switch (type) {
      case 'bike':
        instructor = await BikeInstructor.findById(id);
        break;
      case 'bikeCar':
        instructor = await BikeCarInstructor.findById(id);
        break;
      case 'heavyVehicle':
        instructor = await HeavyVehicleInstructor.findById(id);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid instructor type'
        });
    }
    
    if (!instructor) {
      console.log('Instructor not found');
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }
    
    console.log('Instructor found');
    
    res.status(200).json({
      success: true,
      instructor
    });
  } catch (error) {
    console.error('Error in getInstructorById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch instructor',
      error: error.message
    });
  }
};

// Get instructors for a specific course
const getInstructorsForCourse = async (req, res) => {
  try {
    const { courseType } = req.params;
    console.log(`Fetching instructors for course type: ${courseType}`);
    
    let instructors = [];
    
    // Normalize the course type for better matching
    const normalizedCourseType = courseType.toLowerCase();
    
    if (normalizedCourseType.includes('bike') && !normalizedCourseType.includes('car')) {
      console.log('Fetching bike instructors');
      // Bike only courses - get only bike instructors
      instructors = await BikeInstructor.find({ availability: true });
    } 
    else if ((normalizedCourseType.includes('car') && !normalizedCourseType.includes('bike')) || 
             (normalizedCourseType.includes('car') && normalizedCourseType.includes('bike'))) {
      console.log('Fetching car/bike instructors');
      // Car only or Car+Bike courses - get bike/car instructors
      instructors = await BikeCarInstructor.find({ availability: true });
    } 
    else if (normalizedCourseType.includes('truck') || 
             normalizedCourseType.includes('bus') || 
             normalizedCourseType.includes('heavy')) {
      console.log('Fetching heavy vehicle instructors');
      // Heavy vehicle courses - get heavy vehicle instructors
      instructors = await HeavyVehicleInstructor.find({ availability: true });
    } 
    else {
      console.log('Course type not specifically matched, returning bike/car instructors as default');
      // Default - return bike/car instructors which are more versatile
      instructors = await BikeCarInstructor.find({ availability: true });
    }
    
    console.log(`Found ${instructors.length} instructors for course type ${courseType}`);
    
    res.status(200).json({
      success: true,
      instructors
    });
  } catch (error) {
    console.error('Error in getInstructorsForCourse:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch instructors for course',
      error: error.message
    });
  }
};

// Enroll in a course with an instructor
const enrollInCourse = async (req, res) => {
  try {
    const { 
      studentId, 
      studentName, 
      courseId, 
      courseName, 
      instructorId, 
      instructorModel, 
      instructorName, 
      paymentId 
    } = req.body;
    
    console.log('Enrolling student in course:');
    console.log(`Student: ${studentName} (${studentId})`);
    console.log(`Course: ${courseName} (${courseId})`);
    console.log(`Instructor: ${instructorName} (${instructorId}) - Model: ${instructorModel}`);
    
    // Check if already enrolled in this course
    const existingEnrollment = await EnrolledCourse.findOne({
      studentId,
      courseId
    });
    
    if (existingEnrollment) {
      console.log('Student already enrolled in this course');
      return res.status(400).json({
        success: false,
        message: 'Student is already enrolled in this course'
      });
    }
    
    // Create new enrollment
    const enrollment = await EnrolledCourse.create({
      studentId,
      studentName,
      courseId,
      courseName,
      instructorId,
      instructorModel,
      instructorName,
      paymentId,
      startDate: new Date(),
      status: 'Active'
    });
    
    console.log('Enrollment created successfully');
    
    res.status(201).json({
      success: true,
      enrollment
    });
  } catch (error) {
    console.error('Error in enrollInCourse:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course',
      error: error.message
    });
  }
};

// Get enrolled courses for a student
const getEnrolledCourses = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log(`Fetching enrolled courses for student: ${studentId}`);
    
    const enrolledCourses = await EnrolledCourse.find({ studentId });
    
    console.log(`Found ${enrolledCourses.length} enrolled courses`);
    
    res.status(200).json({
      success: true,
      enrolledCourses
    });
  } catch (error) {
    console.error('Error in getEnrolledCourses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrolled courses',
      error: error.message
    });
  }
};

module.exports = {
  getAllInstructors,
  getInstructorsByType,
  createInstructor,
  getInstructorById,
  getInstructorsForCourse,
  enrollInCourse,
  getEnrolledCourses
};
