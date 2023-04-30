const express = require("express");
const {
  createExam,
  getExams,
  getExam,
} = require("../../controller/academics/examsCtrl");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");

const examRouter = express.Router();

examRouter.route("/", isTeacherLogin, isTeacher).post(createExam).get(getExams);

examRouter.route("/:id", isTeacherLogin, isTeacher).get(getExam);

module.exports = examRouter;
