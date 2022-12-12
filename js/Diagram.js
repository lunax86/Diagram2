class Diagram
{

    colors = {
        diagramBackground: '#333',
        taskBackground: '#093',
        grid: '#111',
        text: '#fff',
    }

    constructor(canlendar, overlaySelector, canvasSelector) {
        
        this.calendar = canlendar;
        this.overlay = new Overlay(overlaySelector);
        this.canvas = new Canvas(canvasSelector);

    }

    renderGrid () {

        this.canvas.color = this.colors.grid;

        for (let i = 1; i < this.calendar.todo(); i++) {

            this.canvas.drawLine(i * this.overlay.unit.day, 0, i * this.overlay.unit.day, this.overlay.box.height);
        }
    }

    renderHeader() {

        const header = this.overlay.element.querySelector('.diagram-header');
        const box = header.getBoundingClientRect();

        this.canvas.color = this.colors.text;
        this.canvas.text.align = 'center';
        for (let i = 0; i < this.calendar.todo(); i++) {

            this.canvas.drawText(
                i * this.overlay.unit.day + this.overlay.unit.day / 2,
                this.overlay.unit.day / 2, 
                i + 1
                );
        }

    }

    render() {

        this.overlay.refresh(this.calendar.todo());
        this.canvas.resize(this.overlay.box.width, this.overlay.box.height);

        [...this.overlay.element.querySelectorAll('.employee')].forEach((employee) => {
            
            const tasks = [...employee.querySelectorAll('.task')];
            
            tasks.reduce((offset, task) => {

                const box = task.getBoundingClientRect();
                const hours = task.querySelector('.hours').innerHTML.trim();
                const width = hours * this.overlay.unit.hour;

                const dataBox = task.querySelector('.task-data');
                dataBox.style.left = offset + 'px';
                dataBox.style.width = width + 'px';

                this.canvas.color = this.colors.taskBackground;                
                this.canvas.drawRectangle(offset, box.top - this.overlay.box.top, width, box.height);

                return offset + width;
            }, 0);

        });

        this.renderHeader();
        this.renderGrid();
    }

}