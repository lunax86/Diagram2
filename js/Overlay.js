class Overlay
{

    constructor(selector) {

        this.element = document.querySelector(selector);
    }

    refresh(columns) {

        this.box = this.element.getBoundingClientRect();

        const day = this.box.width / columns;
        const hour = day / 8;

        this.unit = {
            day: day,
            hour: hour
        };
    }

}