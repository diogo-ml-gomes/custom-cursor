const Cursor = (function () {
	function Cursor(...props) {
		this.cursor = {
			el: undefined,
			x: null,
			y: null
		};
		this.hover = {
			elements: props.hoverElements || ['LABEL', 'INPUT', 'A', 'BUTTON']
		};
		this.listeners = {
			onmousemove: this.onmousemove.bind(this)
		};

		// User settings
		this.properties = {
			body: props.body || document.body,
			cursorSelector: props.cursorSelector || '#cursor',
			offset: props.offset || 0
		};
	}

	Cursor.prototype.init = function () {
		this.draw();
		this.addEventListeners();
	};

	Cursor.prototype.addEventListeners = function () {
		document.body.addEventListener('mousemove', this.listeners.onmousemove);
	};

	Cursor.prototype.onmousemove = function () {
		this.getCursorXY();
		this.appendPosition();
		this.isHover();
	};

	Cursor.prototype.getCursorXY = function (e) {
		e = e || window.event;
		this.cursor.x = e.pageX;
		this.cursor.y = e.pageY;

		if (e.pageX === undefined) {
			this.cursor.x = clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			this.cursor.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
	};

	Cursor.prototype.appendPosition = function () {
		let offset = this.properties.offset;
		cursorPosition = '--positionx: ' + (this.cursor.x - offset) + 'px; --positiony: ' + (this.cursor.y - offset) + 'px;';
		this.cursor.el.style = cursorPosition;
	};

	Cursor.prototype.isHover = function () {
		let _this = {
			x: this.cursor.x,
			y: this.cursor.y,
			tags: this.hover.elements
        },
        elHover = {
			tagName: document.elementFromPoint(_this.x, _this.y).tagName,
			tags: _this.tags
		};

		this.activeCursor(elHover.tags.indexOf(elHover.tagName) >= 0);
	};

	Cursor.prototype.activeCursor = function (isActive) {
		let _this = this;
		isActive ? _this.cursor.el.classList.add('active') : _this.cursor.el.classList.remove('active');
	};

	Cursor.prototype.draw = function () {
		const idSymbol = '#',
              classSymbol = '.',
              cursorDOM = document.createElement('span');

		// If class or id
		if (this.properties.cursorSelector.indexOf(idSymbol) >= 0) {
			cursorDOM.id = this.properties.cursorSelector.replace(idSymbol, '');
			this.properties.body.appendChild(cursorDOM);
			this.cursor.el = document.getElementById(cursorDOM.id);
		} else if (this.properties.cursorSelector.indexOf(classSymbol) >= 0) {
			cursorDOM.classList.add(
				this.properties.cursorSelector.replace(classSymbol, '')
			);
			this.properties.body.appendChild(cursorDOM);
			this.cursor.el = document.querySelector(this.properties.cursorSelector);
		} else {
			return console.error('cursorSelector: \'' + this.properties.cursorSelector + '\' - You need to choose if you want a class or an id');
		}
	};

	return Cursor;
})();