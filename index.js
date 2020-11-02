const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();

const data = require("./Lab3-timetable-data.json");
let timetableArray = [];

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

//Get all available subject codes and descriptions
router.get('/', (req,res) => {
    res.send(timetableArray);
});

//Get a course(s) via subject code
router.get('/:subject_Code', (req,res) => { 
    const subject = req.params.subject_Code;
    
    const courseArray = [];

    for(i=0;i<timetableArray.length;i++){
        if(timetableArray[i].subject === subject){
            courseArray.push(timetableArray[i].catalog_nbr);
        }
    }
    if(courseArray.length > 0){
        console.log(`Subject: ${subject} Course(s): ${courseArray}`);
        res.send(courseArray); 
    }
    else{
        res.status(404).send(`Subject code ${subject} was NOT found`);
    }
});

//Get a course via subject code + course code 
router.get('/:subject_Code/:course_Code', (req,res) => {
    const subject = req.params.subject_Code;
    const course = req.params.course_Code;
    const courseArray = [];

    for(i=0;i<timetableArray.length;i++){
        if(timetableArray[i].subject === subject && timetableArray[i].catalog_nbr === course){
            courseArray.push(timetableArray[i]);
        }
    }
    if(courseArray.length > 0){
        res.send(courseArray); 
    }
    else{
        res.status(404).send(`Subject code ${subject} was NOT found`);
    }
});

//Get a course via subject code + course code + component
router.get('/:subject_Code/:course_Code/:course_Component', (req,res) => {
    const subject = req.params.subject_Code;
    const course = req.params.course_Code;
    const component = req.params.course_Component;
    const courseArray = [];
    console.log(component);
    for(i=0;i<timetableArray.length;i++){
        if(timetableArray[i].subject === subject && timetableArray[i].catalog_nbr === course && timetableArray[i].course_info[0].ssr_component === component){
            courseArray.push(timetableArray[i]);
        }
    }
    if(courseArray.length > 0){
        res.send(courseArray); 
    }
    else{
        res.status(404).send(`Subject code ${subject} was NOT found`);
    }
});

//Install the router at /api/courses
app.use('/api/courses', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});