const  mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InstructorSchema = new Schema({
    name:{
        type: String,
        required:true,
    },
    gmail:{
        type: String,
        required:true,
    },
    phone:{
        type: Number,
        required:true,
    },
    gender:{
        type: String,
        required:true,
    },
    age:{
        type: Number,
        required:true,
    },
    experience:{
        type: String,
        required:true,
    },
    hiredate:{
        type: Date,
        required:true,
    },
    salary:{
        type: Number,
        required:true,
    },
    workinghours:{
        type: Number,
        required:true,
    },
    licenseNumber:{
        type: String,
        required:true,
    },
    vehcleId:{
        type: String,
        required:true,
    },
    vehcleNumber:{
        type: String,
        required:true,

    }


});

module.exports = mongoose.model(
    "InstructorModel",
    InstructorSchema
)