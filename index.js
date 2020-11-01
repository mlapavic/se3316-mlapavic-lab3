const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();

const data = require("./Lab3-timetable-data.json");

//Setup serving front-end code
app.use('/', express.static('static'));

//Setup middleware to do logging
app.use((req,res,next) => { //for all routes
    console.log(`${req.method} request for ${req.url}`);
    next();
});

router.get('/', (req,res) => {
    let timetableArray = [];
    for(i=0; i < data.length;i++){
        timetableArray.push({
            "subject": data[i].subject,
            "className": data[i].className
        });
    }
    res.send(timetableArray);
});

//Install the router at /api/courses
app.use('/api/courses', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});