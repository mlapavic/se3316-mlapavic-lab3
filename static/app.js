document.getElementById('get-timetable').addEventListener('click', getTimetables);

document.getElementById('create-schedule').addEventListener('click', createSchedule);
document.getElementById('add-course').addEventListener('click', addCourse);
document.getElementById('delete-schedule').addEventListener('click', deleteSchedule);
document.getElementById('delete-all').addEventListener('click', deleteAll);
document.getElementById('display-schedule').addEventListener('click', displaySchedule);


//COURSE STUFF
function getTimetables(){
    while((document.getElementById("timetables")).firstChild ){
        (document.getElementById("timetables")).removeChild((document.getElementById("timetables")).firstChild );
    }

    const subjectInput = document.getElementById("subject_code").value;
    const courseInput = document.getElementById("course_code").value;
    const componentInput = document.getElementById("component").value; 
    
    console.log(subjectInput);
    console.log(courseInput);
    console.log(componentInput);


    if(courseInput == "" && componentInput == ""){
        fetch(`/api/courses/${subjectInput}`)
        .then(res => res.json()
        .then(data => {
            console.log(data);
            const l = document.getElementById('timetables');
            data.forEach(e => {
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(`${e.subject} ${e.catalog_nbr} ${e.className} 
                ${e.course_info[0].ssr_component} ${e.course_info[0].start_time} ${e.course_info[0].end_time}
                ${e.course_info[0].days}`));
                l.appendChild(item);
            });
        }));
    }else{
        fetch(`/api/courses/${subjectInput}/${courseInput}/${componentInput}`)
        .then(res => res.json()
        .then(data => {
            console.log(data);
            const l = document.getElementById('timetables');
            data.forEach(e => {
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(`${e.subject} ${e.catalog_nbr} ${e.className} 
                ${e.course_info[0].ssr_component} ${e.course_info[0].start_time} ${e.course_info[0].end_time}
                ${e.course_info[0].days}`));
                l.appendChild(item);
            });
        }));
    }  
}

////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
//Schedule Stuff

function createSchedule(){

}
function addCourse(){

}
function deleteSchedule(){

}
function deleteAll(){

}

//Display the schedule
function displaySchedule(){
    while((document.getElementById("scheduleView")).firstChild ){
        (document.getElementById("scheduleView")).removeChild((document.getElementById("scheduleView")).firstChild );
    }

    const scheduleInput = document.getElementById("scheduleN").value;

    fetch(`/api/schedules/${scheduleInput}`)
        .then(res => res.json()
        .then(data => {
            console.log(data);
            const l = document.getElementById('scheduleView');
            data.forEach(e => {
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(`${e.subject} ${e.catalog_nbr} ${e.className} 
                ${e.course_info[0].ssr_component} ${e.course_info[0].start_time} ${e.course_info[0].end_time}
                ${e.course_info[0].days}`));
                l.appendChild(item);
            });
        }));

}
