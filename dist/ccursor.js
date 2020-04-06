/* ccursor.js v1.0.0 | © 2020 diogo gomes | https://github.com/diogo-ml-gomes/custom-cursor#readme */
const Cursor = function() {
    function Cursor(...e) {
        this.cursor = {
            el: void 0,
            x: null,
            y: null
        };
        this.hover = {
            elements: e.hoverElements || [ "LABEL", "INPUT", "A", "BUTTON" ]
        };
        this.listeners = {
            onmousemove: this.onmousemove.bind(this)
        };
        this.properties = {
            body: e.body || document.body,
            cursorSelector: e.cursorSelector || "#cursor",
            offset: e.offset || 0
        };
    }
    Cursor.prototype.init = function() {
        this.draw();
        this.addEventListeners();
    };
    Cursor.prototype.addEventListeners = function() {
        document.body.addEventListener("mousemove", this.listeners.onmousemove);
    };
    Cursor.prototype.onmousemove = function() {
        this.getCursorXY();
        this.appendPosition();
        this.isHover();
    };
    Cursor.prototype.getCursorXY = function(e) {
        e = e || window.event;
        this.cursor.x = e.pageX;
        this.cursor.y = e.pageY;
        if (void 0 === e.pageX) {
            this.cursor.x = clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            this.cursor.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
    };
    Cursor.prototype.appendPosition = function() {
        let e = this.properties.offset;
        cursorPosition = "--positionx: " + (this.cursor.x - e) + "px; --positiony: " + (this.cursor.y - e) + "px;";
        this.cursor.el.style = cursorPosition;
    };
    Cursor.prototype.isHover = function() {
        let e = {
            x: this.cursor.x,
            y: this.cursor.y,
            tags: this.hover.elements
        }, o = {
            tagName: document.elementFromPoint(e.x, e.y).tagName,
            tags: e.tags
        };
        this.activeCursor(o.tags.indexOf(o.tagName) >= 0);
    };
    Cursor.prototype.activeCursor = function(e) {
        let o = this;
        e ? o.cursor.el.classList.add("active") : o.cursor.el.classList.remove("active");
    };
    Cursor.prototype.draw = function() {
        const e = "#", o = ".", t = document.createElement("span");
        if (this.properties.cursorSelector.indexOf(e) >= 0) {
            t.id = this.properties.cursorSelector.replace(e, "");
            this.properties.body.appendChild(t);
            this.cursor.el = document.getElementById(t.id);
        } else if (this.properties.cursorSelector.indexOf(o) >= 0) {
            t.classList.add(this.properties.cursorSelector.replace(o, ""));
            this.properties.body.appendChild(t);
            this.cursor.el = document.querySelector(this.properties.cursorSelector);
        } else return console.error("cursorSelector: '" + this.properties.cursorSelector + "' - You need to choose if you want a class or an id");
    };
    return Cursor;
}();