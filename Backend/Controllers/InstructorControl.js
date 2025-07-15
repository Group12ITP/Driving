const Instructor = require("../Model/InstructorModel")
const User = require("../Model/UserModel")
const EnrolledCourse = require("../Model/EnrolledCourse")

const getAllInstructors = async (req,res,next) => {
   
    let instructors;

    try{
        instructors = await Instructor.find();
    }
    catch(err){
        console.log(err);
    }

    if(!instructors){
        return res.status(404).json({message:"Instructor not found"});
    }

    return res.status(200).json({instructors});
};

const addInstructors = async(req,res,next) => {

    const {name,gmail,phone,gender,age,experience,hiredate,salary,workinghours,licenseNumber,vehcleId,vehcleNumber} = req.body;

    let instructors;

    try{
        instructors = new Instructor({name,gmail,phone,gender,age,experience,hiredate,salary,workinghours,licenseNumber,vehcleId,vehcleNumber});
        await instructors.save();
    }
    catch(err)
    {
        console.log(err);
    }

    if(!instructors){
        return res.status(404).json({message:"Unable to add instructors"});
    }
    return res.status(200).json({instructors});


}

const getInstructorbyId = async(req,res,next) => {

    const id = req.params.id;

    let instructor;

    try{
            instructor = await Instructor.findById(id);
    }
    catch(err){
        console.log(err);
    }

    if(!instructor){
            return res.status(404).json({message:"Unable to add instructors"});
    }
    return res.status(200).json({instructor});
}

const updateInstructor = async(req,res,next) => {

    const id = req.params.id;
    const {name,gmail,phone,gender,age,experience,hiredate,salary,workinghours,licenseNumber,vehcleId,vehcleNumber} = req.body;

    let users;

    try{
        instructor = await Instructor.findByIdAndUpdate(id,
            {name: name, gmail :gmail,phone: phone,gender: gender,age: age,experience: experience,hiredate: hiredate,salary: salary,workinghours: workinghours,licenseNumber: licenseNumber,vehcleId: vehcleId,vehcleNumber: vehcleNumber});
            instructor = await instructor.save();
    }
    catch(err){
        console.log(err);
    }

    if(!instructor){ 
        return res.status(404).json({message:"Unable to update instructor details"});
    }
    return res.status(200).json({instructor});

}

const deleteInstructor = async(req,res,next) => {

    const id = req.params.id;

    let instructor;

    try{
        instructor = await Instructor.findByIdAndDelete(id)
    }
    catch(err){
        console.log(err);
    }

    if(!instructor){
        return res.status(404).json({message:"Unable to delete instructor details"});
    }
    return res.status(200).json({instructor});
}

const getInstructorStudents = async(req, res, next) => {
    const instructorId = req.params.instructorId;
    
    try {
        const instructor = await Instructor.findById(instructorId);
        
        if (!instructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }
        
        const enrolledCourses = await EnrolledCourse.find({ instructorId: instructorId });
        
        if (!enrolledCourses || enrolledCourses.length === 0) {
            return res.status(200).json([]);
        }
        
        const studentIds = enrolledCourses.map(course => course.userId);
        
        const students = await User.find({ 
            _id: { $in: studentIds },
            role: 'student'
        });
        
        const studentsWithDetails = students.map(student => {
            const studentCourse = enrolledCourses.find(course => 
                course.userId.toString() === student._id.toString()
            );
            
            return {
                _id: student._id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                course: studentCourse ? studentCourse.courseName : null,
                progress: studentCourse ? studentCourse.progress : 0
            };
        });
        
        return res.status(200).json(studentsWithDetails);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching instructor's students", error: err.message });
    }
}

exports.getAllInstructors = getAllInstructors;
exports.addInstructors = addInstructors;
exports.getInstructorbyId = getInstructorbyId;
exports.updateInstructor = updateInstructor;
exports.deleteInstructor = deleteInstructor;
exports.getInstructorStudents = getInstructorStudents;