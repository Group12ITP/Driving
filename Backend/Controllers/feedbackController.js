const feedback = require("../Model/feedbackModel");

const getAllFeedback = async (req,res,next) =>{

    let feedbacks;

    try{
        feedbacks = await feedback.find();
    }catch(err){
        console.log(err);
    }

    if(!feedbacks){
        return res.status(404).json({message:"Feebacks not found"});
    }
    //display all feedback
    return res.status(200).json({ feedbacks });
};


const addFeedback = async (req,res,next)=>{

    const {name,email,message} = req.body;

    let feedbacks;

    try{
        feedbacks= new feedback({name,email,message});
        await feedbacks.save();
    }catch(err){
        console.log(err);
    }

    if(!feedbacks){
        return res.status(404).json({message:"unable to add feedback"});
    }

    return res.status(200).json({ feedbacks })

};

const getById = async(req,res,next)=>{
    const id = req.params.id;

    let feedbacks;

    try{
        feedbacks = await feedback.findById(id);
    }catch(err){
        console.log(err);
    }

    if(!feedbacks){
        return res.status(404).json({message:"Feedback not found"});
    }

    return res.status(200).json({ feedbacks })
};

const updateFeedback = async(req,res,next) =>{

    const id = req.params.id;
    const {name,email,message} = req.body;

    let feedbacks;

    try{
        feedbacks= await feedback.findByIdAndUpdate(id,{
            name: name,email: email,message: message
        });
        feedbacks= await feedbacks.save();
    }catch(err){
        console.log(err);
    }

    if(!feedbacks){
        return res.status(404).json({message:"Unable to update feedback"});
    }

    return res.status(200).json({ feedbacks })

};

const deleteFeedback = async (req,res,next)=>{

    const id = req.params.id;

    let feedbacks;

    try{
        feedbacks = await feedback.findByIdAndDelete(id);
    }catch(err){
        console.log(err);
    }

    if(!feedbacks){
        return res.status(404).json({message:"Unable to Delete feedback"});
    }

    return res.status(200).json({ feedbacks })

}

exports.getAllFeedback = getAllFeedback;
exports.addFeedback = addFeedback;
exports.getById = getById;
exports.updateFeedback = updateFeedback;
exports.deleteFeedback = deleteFeedback;