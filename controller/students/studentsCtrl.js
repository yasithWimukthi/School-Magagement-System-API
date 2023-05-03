const AysncHandler = require("express-async-handler");
const Student = require("../../model/Academic/Student");
const generateToken = require("../../utils/generateToken");
const { hashPassword, isPassMatched } = require("../../utils/helpers");

//@desc  Admin Register Student
//@route POST /api/students/admin/register
//@acess  Private Admin only

exports.adminRegisterStudent = AysncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //check if teacher already exists
  const student = await Student.findOne({ email });
  if (student) {
    throw new Error("Student already employed");
  }
  //Hash password
  const hashedPassword = await hashPassword(password);
  // create
  const studentRegistered = await Student.create({
    name,
    email,
    password: hashedPassword,
  });
  //send student data
  res.status(201).json({
    status: "success",
    message: "Student registered successfully",
    data: studentRegistered,
  });
});

//@desc    login  student
//@route   POST /api/v1/students/login
//@access  Public

exports.loginStudent = AysncHandler(async (req, res) => {
  const { email, password } = req.body;
  //find the  user
  const student = await Student.findOne({ email });
  if (!student) {
    return res.json({ message: "Invalid login crendentials" });
  }
  //verify the password
  const isMatched = await isPassMatched(password, student?.password);
  if (!isMatched) {
    return res.json({ message: "Invalid login crendentials" });
  } else {
    res.status(200).json({
      status: "success",
      message: "Student logged in successfully",
      data: generateToken(student?._id),
    });
  }
});
