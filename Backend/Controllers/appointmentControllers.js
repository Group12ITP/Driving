import Appointment from "../models/appointmentModel.js";


export const bookAppointment = async (req, res) => {
  try {
    const { date, time, instructor, studentName, email } = req.body;

   
    const existingAppointment = await Appointment.findOne({ date, time, instructor });
    if (existingAppointment) {
      return res.status(400).json({ message: "Time slot already booked" });
    }

    const newAppointment = new Appointment({ date, time, instructor, studentName, email });
    await newAppointment.save();

    res.json({ message: "Appointment booked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("instructor");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};