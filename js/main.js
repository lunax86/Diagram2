
const project = new Project('.project-1');
project.init();


// debug window
const debugButtons = document.querySelectorAll('.debug button');
debugButtons.forEach( (button) => {
    button.addEventListener('click', () => {
        project.diagram.calendar.days = button.dataset.days;
        project.refresh();
    });
});
