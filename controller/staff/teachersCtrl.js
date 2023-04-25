const AysncHandler = require("express-async-handler");
const Teacher = require("../../model/Staff/Teacher");
const generateToken = require("../../utils/generateToken");
const { hashPassword, isPassMatched } = require("../../utils/helpers");

//@desc  Admin Register Teacher
//@route POST /api/teachers/admin/register
//@acess  Private

exports.adminRegisterTeacher = AysncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //check if teacher already exists
  const teacher = await Teacher.findOne({ email });
  if (teacher) {
    throw new Error("Teacher already employed");
  }
  //Hash password
  const hashedPassword = await hashPassword(password);
  // create
  const teacherCreated = await Teacher.create({
    name,
    email,
    password: hashedPassword,
  });
  //send teacher data
  res.status(201).json({
    status: "success",
    message: "Teacher registered successfully",
    data: teacherCreated,
  });
});

//@desc    login a teacher
//@route   POST /api/v1/teachers/login
//@access  Public

exports.loginTeacher = AysncHandler(async (req, res) => {
  const { email, password } = req.body;
  //find the  user
  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    return res.json({ message: "Invalid login crendentials" });
  }
  //verify the password
  const isMatched = await isPassMatched(password, teacher?.password);
  if (!isMatched) {
    return res.json({ message: "Invalid login crendentials" });
  } else {
    res.status(200).json({
      status: "success",
      message: "Teacher logged in successfully",
      data: generateToken(teacher?._id),
    });
  }
});

//@desc    Get all Teachers
//@route   GET /api/v1/admin/teachers
//@access  Private admin only

exports.getAllTeachersAdmin = AysncHandler(async (req, res) => {
  const teachers = await Teacher.find();
  res.status(200).json({
    status: "success",
    message: "Teachers fetched successfully",
    data: teachers,
  });
});
