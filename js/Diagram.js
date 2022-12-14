class Diagram
{

    colors = {
        diagramBackground: '#333',
        taskBackground: '#093',
        grid: '#111',
        text: '#fff',
    }

    constructor(calendar, overlaySelector, canvasSelector) {
        
        this.calendar = calendar;
        this.overlay = new Overlay(overlaySelector);
        this.canvas = new Canvas(canvasSelector);

    }

    getRemSize() {    
        
        return parseFloat(window.getComputedStyle(document.querySelector('body')).fontSize);
    }

    renderGrid() {

        this.canvas.color = this.colors.grid;

        const rows = this.calendar.todo();
        for (let i = 0; i <= rows; i++) {

            const fromX = i == rows ? i * this.overlay.unit.day - 1 : i * this.overlay.unit.day;
            const toX = i == rows ? i * this.overlay.unit.day - 1 : i * this.overlay.unit.day;
            this.canvas.drawLine(fromX, 0, toX, this.overlay.box.height);
        }
    }

    renderHeader() {

        const header = this.overlay.element.querySelector('.diagram-header');
        const box = header.getBoundingClientRect();

        this.canvas.color = this.colors.text;
        this.canvas.text.align = 'center';
        this.canvas.text.size = (this.overlay.unit.day * 0.7 > 16 ? 16 : this.overlay.unit.day * 0.7 ) + 'px';

        for (let i = 0; i < this.calendar.todo(); i++) {

            this.canvas.drawText(
                i * this.overlay.unit.day + this.overlay.unit.day / 2,
                this.getRemSize() * 1.5, 
                i + 1
                );
        }

    }

    renderTasks(employee) {

        const tasks = [...employee.querySelectorAll('.task')];
            
        tasks.reduce((offset, task) => {

            const dataBox = task.querySelector('.task-data');
            const coefficient =  employee.querySelector('.coefficient').innerHTML.trim();
            dataBox.dataset.coefficient = coefficient;

            const box = task.getBoundingClientRect();
            const hours = task.querySelector('.hours').innerHTML.trim();
            const width = hours * this.overlay.unit.hour * coefficient;

            dataBox.style.left = offset + 'px';
            dataBox.style.width = width + 'px';

            this.canvas.color = this.colors.taskBackground;                
            this.canvas.drawRectangle(offset, box.top - this.overlay.box.top, width, box.height);

            return offset + width;
        }, 0);

    }

    render() {

        this.overlay.refresh(this.calendar.todo());
        this.canvas.resize(this.overlay.box.width, this.overlay.box.height);

        [...this.overlay.element.querySelectorAll('.employee')].forEach((employee) => {
            
            this.renderTasks(employee);
        });

        this.renderHeader();
        this.renderGrid();
    }

}