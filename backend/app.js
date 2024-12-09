const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const app = express();
const cors = require('cors');
app.use(cors());
const helmet = require('helmet')
const submissionFormRoute = require('./routes/submissionform')
const students = require('./routes/students')
const bitrix = require('./routes/bitrix')
const localStorage = require('./routes/localstorage')
const { regFormController, checkStudentIdController } = require('./controllers/students.controllers');
const { insertStudentAnswersController, calcStudentExamScoreController, calcStudentPracticeScoreController } = require('./controllers/studentsAnswers.controllers');
const { insertStudentTestController, getStudentExamIdController } = require('./controllers/studentTests.controllers');
const { getStudentExamStatusController, examScoreController } = require('./controllers/studentTestResult.controllers');
const { getQuestionsController } = require('./controllers/questions.controllers');
const { examInfoController, linkDataController } = require('./controllers/StudentsExamsLinks.controllers');
const { logMessage } = require('./utils/system.utils');

const port = process.env.PORT;
const logLevel = process.env.LOG_LEVEL || 'tiny'



app.use(express.json());

app.use(morgan(logLevel));

app.use(helmet());

app.use('/api/v1/submissionform', submissionFormRoute)
app.use('/api/v1/students', students)
app.use('/api/v1/localstorage', localStorage)
app.use('/api/v1/bitrix', bitrix)


// an endpoint to insert a student answers
app.post('/insertAStudentAnswers', insertStudentAnswersController);

// an endpoint to get exam questions
app.get('/getQuestions', getQuestionsController);

// an endpoint to start a new exam
app.post('/insertStudentTest', insertStudentTestController);

// an endpoint to get studentexamid in order to use it in fetching exam status and chose wether to start a new exam or not
app.get('/getStudentExamId', getStudentExamIdController)

// Get Student Exam Status
app.get('/getStudentExamStatus', getStudentExamStatusController);

// Calculate Student Exam Score
app.post('/calcStudentExamScore', calcStudentExamScoreController);

app.post('/calcStudentPracticeScore', calcStudentPracticeScoreController)

app.post('/reg_form', regFormController)

app.post('/exam_info', examInfoController);

app.get('/checkStudentId', checkStudentIdController)

app.get('/link_data', linkDataController)

app.get("/exam_score", examScoreController)

app.listen(port, () => {
  logMessage(`Forms is running on http://localhost:${port}`, "Success", "INFO");

});

