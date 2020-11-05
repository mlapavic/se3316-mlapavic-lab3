const express = require('express');
//const cors = require('cors');
const app = express();
//const bodyParser = require('body-parser');

const { body } = require('express-validator');

const port = 3000;
const router = express.Router();
const router1 = express.Router();

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low(adapter)
 
// Set some defaults
db.defaults({ schedulesDb: [] }).write()

const data = require("./Lab3-timetable-data.json");
let timetableArray = [];

const data1 = require("./db.json");
const e = require('express');



//Parse data in body as JSON
router1.use(express.json());

function timetableFunction(){
    for(i=0; i < timetableArray.length;i++){
        timetableArray.pop();
    }
    for(i=0; i < data.length;i++){
        timetableArray.push({
            "subject": data[i].subject,
            "className": data[i].className,
            "catalog_nbr": data[i].catalog_nbr,
            "course_info": data[i].course_info
        });
    }
}
timetableFunction();

//Setup serving front-end code
app.use('/', express.static('static'));

//Setup middleware to do logging
app.use((req,res,next) => { //for all routes
    console.log(`${req.method} request for ${req.url}`);
    next();
});


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


//Back-end Part 1
//Get all available subject codes and descriptions
router.get('/', (req,res) => {
    let array1 = [];

    for(i=0; i < timetableArray.length;i++){
        array1.push({
            "subject": timetableArray[i].subject,
            "catalog_nbr": timetableArray[i].catalog_nbr
        });
    }

    res.send(array1);
    //res.send(timetableArray);
});

//Back-end Part 2
//Get a course(s) via subject code
router.get('/:subject_Code', (req,res) => { 
    const subject = req.params.subject_Code;
    
    const courseArray = [];
    const array1 = [];
    for(i=0;i<timetableArray.length;i++){
        if((timetableArray[i].subject).toString() === subject.toString()){
            courseArray.push(timetableArray[i]);
            array1.push(timetableArray[i].catalog_nbr);
        }
    }
    if(array1.length > 0){
        console.log(`Subject: ${subject} Course(s): ${array1}`);
        //res.send(array1);
        res.send(courseArray); 
    }
    else{
        res.status(404).send(`Subject code ${subject} was NOT found`);
    }
});

//Back-end Part 3
//Get a course via subject code + course code 
router.get('/:subject_Code/:course_Code', (req,res) => {
    const subject = req.params.subject_Code;
    const course = req.params.course_Code;
    const courseArray = [];

    for(i=0;i<timetableArray.length;i++){
        if(timetableArray[i].subject === subject && timetableArray[i].catalog_nbr == course){
            courseArray.push(timetableArray[i]);
        }
    }
    if(courseArray.length > 0){
        res.send(courseArray); 
    }
    else{
        res.status(404).send(`Subject code ${subject} or ${course} was NOT found`);
    }
});

//Back-end Part 3
//Get a course via subject code + course code + component
router.get('/:subject_Code/:course_Code/:course_Component', (req,res) => {
    const subject = req.params.subject_Code;
    const course = req.params.course_Code;
    const component = req.params.course_Component;
    const courseArray = [];
    console.log(component);
    for(i=0;i<timetableArray.length;i++){
        if(timetableArray[i].subject === subject && timetableArray[i].catalog_nbr == course && timetableArray[i].course_info[0].ssr_component === component){
            courseArray.push(timetableArray[i]);
        }
    }
    if(courseArray.length > 0){
        res.send(courseArray); 
    }
    else{
        res.status(404).send(`Subject code ${subject} or ${course} or ${component} was NOT found`);
    }
});

//#################################################################################################
//#################################################################################################
//#################################################################################################
//Schedule stuff


router1.get('/', (req,res) => {
    let scheduleVar = db.get('schedulesDb').value();
    const scheduleCourse = [];

    for(i=0; i < scheduleCourse.length;i++){
        scheduleCourse.pop();
    }
    for(i=0;i<scheduleVar.length;i++){ 
        scheduleCourse.push({
            "name": (scheduleVar[i]).sName,
            "Number_Courses": ((scheduleVar[i]).listOfCourses).length
        });


    }
    console.log(scheduleCourse);
    res.send(scheduleCourse);
});


//Get the subject/course pairs for a given schedule
//Back-end Part 6
router1.get('/:schedule', (req,res) => {   
    //This will be the name of the schedule that the user inputs
    const scheduleName = req.params.schedule;

    if(db.get('schedulesDb').find({sName:scheduleName}).value()){
        res.send(db.get('schedulesDb').find({sName:scheduleName}));
    }else{
        console.log(`${scheduleName} was does not exist!`);
        return res.status(400).send(`${scheduleName} does not exist!`)
    }
 });

 //Create a schedule with a given schedule name
//Back-end Part 4
 router1.post('/:schedule', (req,res) => {   
     if(!req.params.schedule || req.params.schedule.length > 10){
        //400 Bad Request
        return res.status(400).send('Name is required & must be a max of 10 characters!')
     }
    
    //This will be the name of the schedule that the user inputs
    const scheduleName = req.params.schedule;

    //Clean input
    for(i=0;i<scheduleName.length;i++){
        if(scheduleName.charAt(i) == '.' || scheduleName.charAt(i) == '/' || scheduleName.charAt(i) == '<' || scheduleName.charAt(i) == '&'){
            //400 Bad Request
            return res.status(400).send('No special characters!')
        }
    }

    if(db.get('schedulesDb').find({sName:scheduleName}).value()){
        return res.status(400).send(`${scheduleName} has already been created!`)
    }else{
        db.get('schedulesDb').push({sName:scheduleName, listOfCourses:[]}).write()
        console.log(`${scheduleName} was created and stored in db!`);
    }

    //Send this response
    res.send("Post Test Complete");
 });
 

 //Save a subject/course code pair to a schedule
 //Back-end Part 5
 router1.post('/:schedule/:subject_Code/:course_Code', (req,res) => { 
    //Validate  
    if(!req.params.schedule || req.params.schedule.length > 10){
        //400 Bad Request
        return res.status(400).send('Name is required & must be a max of 10 characters!')
     }
     if(!req.params.subject_Code || req.params.subject_Code.length > 8){
        //400 Bad Request
        return res.status(400).send('Subject code is required & must be a max of 8 characters!')
     }
     if(!req.params.course_Code || req.params.course_Code.length > 5){
        //400 Bad Request
        return res.status(400).send('Course code is required & must be a max of 5 characters!')
     }

    //This will be the name of the schedule that the user inputs
    const scheduleName = req.params.schedule;
    const subjectVar = req.params.subject_Code;
    const courseVar = req.params.course_Code;

    //Clean input
    for(i=0;i<scheduleName.length;i++){
        if(scheduleName.charAt(i) == '.' || scheduleName.charAt(i) == '/' || scheduleName.charAt(i) == '<' || scheduleName.charAt(i) == '&'){
            //400 Bad Request
            return res.status(400).send('No special characters!')
        }
    }
    for(i=0;i<subjectVar.length;i++){
        if(subjectVar.charAt(i) == '.' || subjectVar.charAt(i) == '/' || subjectVar.charAt(i) == '<' || subjectVar.charAt(i) == '&'){
            //400 Bad Request
            return res.status(400).send('No special characters!')
        }
    }
    for(i=0;i<courseVar.length;i++){
        if(courseVar.charAt(i) == '.' || courseVar.charAt(i) == '/' || courseVar.charAt(i) == '<' || courseVar.charAt(i) == '&'){
            //400 Bad Request
            return res.status(400).send('No special characters!')
        }
    }

    let scheduleVar = db.get('schedulesDb').find({sName: scheduleName}).value();

    if(scheduleVar){
        (scheduleVar.listOfCourses).push({subject:subjectVar, catalog_nbr:courseVar });
        db.set({schedulesDb:scheduleVar}).write();
        res.send("Course is added!");
    }else{
   
        return res.status(400).send(`${scheduleName} does not exist!`)
    }

 });

 //Delete a single schedule with a given name
 router1.delete('/:schedule', (req,res) => {
    const scheduleName = req.params.schedule;

    if(db.get('schedulesDb').find({sName:scheduleName}).value()){
        db.get('schedulesDb').remove({sName:scheduleName}).write()
        res.send(`${scheduleName} has been deleted!`)
    }else{
        return res.status(400).send(`${scheduleName} does not exist!`)
    }
 });

 //Delete all schedules
 router1.delete('/', (req,res) => {

    console.log(db.get('schedulesDb').value().length);
    for(i=0 ; i < (db.get('schedulesDb').value().length) ;i++){
        db.get('schedulesDb').pop().write()
    }

    res.send("Delete Test Complete");
    //db.get('schedulesDb').pop().write()
 });
   
//Install the router at /api/courses
app.use('/api/courses', router);

app.use('/api/schedules', router1);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});