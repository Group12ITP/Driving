const AddcourseModel = require("../Model/AddcourseModel.js"); 


const getAllCourse = async (req, res, next) => {
    let courses;
    try {
        courses = await AddcourseModel.find(); 
    } catch (err) {
        console.log(err);
    }
    
    if (!courses || courses.length === 0) {
        return res.status(404).json({ message: "Courses not found" });
    }
    
    return res.status(200).json({ courses });
};


const addCourse = async (req, res, next) => {
    const { id, name, description, duration } = req.body;

    let newCourse;
    try {
        newCourse = new AddcourseModel({
            id,
            name,
            description,
            duration,
        });

        await newCourse.save();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    return res.status(201).json({ newCourse });
};


const getById = async (req, res, next) => {
    const id = req.params.id; 
    let course;

    try {
        course = await AddcourseModel.findById(id); 
    } catch (err) {
        return res.status(500).json({ message: "Error fetching course", error: err.message });
    }

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ course });
};

// Update course details
const updateCourse = async (req, res, next) => {
    const courseId = req.params.id; 
    const { name, description, duration } = req.body; 

    let course;
    try {
        course = await AddcourseModel.findByIdAndUpdate(courseId, 
            { name, description, duration }, 
            
        );
    } catch (err) {
        return res.status(500).json({ message: "Error updating course", error: err.message });
    }

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ message: "Course updated successfully", course });
};

// Delete course 
const deleteCourse = async (req, res, next) => {
    const courseId = req.params.id; 

    let course;
    try {
        course = await AddcourseModel.findByIdAndDelete(courseId); 
    } catch (err) {
        return res.status(500).json({ message: "Error deleting course", error: err.message });
    }

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ message: "Course deleted successfully" });
};


exports.getAllCourse = getAllCourse;
exports.addCourse = addCourse;
exports.getById = getById; 
exports.updateCourse = updateCourse;
exports.deleteCourse = deleteCourse;