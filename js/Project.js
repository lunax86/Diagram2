class Project
{

    constructor (selector) {

        this.element = document.querySelector(selector);

        this.calendar = new Calendar();
        this.diagram = new Diagram(this.calendar, selector + ' .diagram-overlay', selector + ' .diagram-canvas');
        
        this.init(selector);
    }

    init(selector) {

        this.dragAndDrop(selector + ' .employee', selector + ' .employee-container');
        this.dragAndDrop(selector + ' .task', selector + ' .task-container');

        this.diagram.render();

        window.addEventListener('resize', () => {
            this.diagram.render();
        });

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
                
                this.popTasks();
                this.diagram.render();
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