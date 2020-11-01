document.getElementById('get-inventory').addEventListener('click', getCourses);

function getCourses() {
    while((document.getElementById("courses")).firstChild ){
        (document.getElementById("courses")).removeChild((document.getElementById("courses")).firstChild );
      }
    fetch("/api/courses")
    .then(res => res.json()
    .then(data => {
        console.log(data);
        const l = document.getElementById('courses');
        data.forEach(e => {
            const item = document.createElement('li');
            item.appendChild(document.createTextNode(`${e.subject} ${e.className} ${e.catalog_nbr}`));
            l.appendChild(item);
        });
    }));
}