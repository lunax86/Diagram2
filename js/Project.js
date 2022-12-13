class Project
{

    constructor(selector) {

        this.selector = selector;
        this.element = document.querySelector(selector);

        this.calendar = new Calendar();
        this.diagram = new Diagram(this.calendar, selector + ' .diagram-overlay', selector + ' .diagram-canvas');
        
    }

    refresh() {

        this.popTasks();
        this.observeTasks();
        this.diagram.render();
    }

    observeTasks() {

        this.resizeObserver.disconnect();

        const tasksWithResize = this.element.querySelectorAll('.diagram .task .task-data');

        tasksWithResize.forEach( (taskWithResize) => {
            this.resizeObserver.observe(taskWithResize);
        });
    }

    resizeTask(task) {

        const width = task.clientWidth;
        const hours = width / this.diagram.overlay.unit.hour;

        const hoursElement = task.querySelector('.hours');
        hoursElement.innerHTML = Math.round(hours);

        this.diagram.render();
    }

    init() {

        this.dragAndDrop(this.selector + ' .employee', this.selector + ' .employee-container');
        this.dragAndDrop(this.selector + ' .task', this.selector + ' .task-container');

        window.addEventListener('resize', () => {
            this.diagram.render();
        });

        // solution from: https://stackoverflow.com/questions/67751039/javascript-resizeobserver-is-triggered-unexpected
        let entriesSeen = new Set();
        this.resizeObserver = new ResizeObserver( (entries) => {

            for (let entry of entries) {
                if (!entriesSeen.has(entry.target)) {
                    entriesSeen.add(entry.target);
                } else {
                    this.resizeTask(entry.target);
                }
            }

        });

        this.refresh();
    }

    dragAndDrop(selectorItems, selectorContainers) {

        const items = this.element.querySelectorAll(selectorItems);
        const containers = this.element.querySelectorAll(selectorContainers);

        items.forEach( (item) => {

            item.addEventListener('dragstart', (event) => {

                item.classList.add('dragging');
                event.stopPropagation();
            });
        });
    
        items.forEach( (item) => {

            item.addEventListener('dragend', () => {

                item.classList.remove('dragging');
            });
        });
        
        containers.forEach( (container) => {

            container.addEventListener('dragover', (event) => {

                const draggingItem = document.querySelector(selectorItems+'.dragging');
                
                if (draggingItem == null) {
                    return;
                } else {
                    event.preventDefault();
                }

                const afterItem = this.getItemAfter(container, event.clientY);

                if (afterItem == null) {
                    container.appendChild(draggingItem);
                } else {
                    container.insertBefore(draggingItem, afterItem);
                }
                
                this.refresh();
            });
        })
    }

    getItemAfter(container, y) {

        const otherItems = [...container.querySelectorAll(':scope > .draggable:not(.dragging)')];

        return otherItems.reduce( (closestItem, otherItem) => {

            const box = otherItem.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
        
            if (offset < 0 && offset > closestItem.offset) {
                return {offset: offset, element: otherItem}
            } else {
                return closestItem;
            }

        }, {offset: Number.NEGATIVE_INFINITY}).element;
    }

    popTasks() {
        
        const taskContainer = this.element.querySelector('.tasks.list');

        [...this.element.querySelectorAll('.employees .task')].forEach((task) => {

            taskContainer.appendChild(task);
        });
    }

}