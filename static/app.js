document.getElementById('get-timetable').addEventListener('click', getTimetables);

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

