'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _useSwipe = require('./useSwipe');

var _useSwipe2 = _interopRequireDefault(_useSwipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useScrollAnimation = function useScrollAnimation(ref) {
	var scrolling = (0, _react.useRef)(false);
	var step = (0, _react.useRef)(0);

	var _useState = (0, _react.useState)(0),
	    _useState2 = _slicedToArray(_useState, 2),
	    index = _useState2[0],
	    setIndex = _useState2[1];

	var element = (0, _react.useRef)(null);

	var _useState3 = (0, _react.useState)(0),
	    _useState4 = _slicedToArray(_useState3, 2),
	    height = _useState4[0],
	    setHeight = _useState4[1];

	var scroll = (0, _react.useCallback)(function (el, y, d) {
		var direction = d ? d : el.scrollTop < y ? "down" : "up";
		switch (direction) {
			case "up":
				el.scrollTop -= ++step.current;
				if (el.scrollTop <= y) {
					step.current = 0;
					return el.scrollTop = y;
				}
				break;
			case "down":
				el.scrollTop += ++step.current;
				if (el.scrollTop >= y) {
					step.current = 0;
					return el.scrollTop = y;
				}
				break;
			default:
				return;
		}
		return requestAnimationFrame(function () {
			return scroll(el, y, direction);
		});
	}, []);

	var scrollTo = (0, _react.useCallback)(function (i) {
		if (scrolling.current) return;
		scrolling.current = true;
		var el = element.current,
		    h = height;

		if (i >= 0 && i * h <= el.scrollHeight - h) {
			scroll(el, i * h);
			setIndex(i);
		}
		scrolling.current = false;
	}, [height, scroll]);

	(0, _useSwipe2.default)(ref, {
		onSwipeUp: function onSwipeUp() {
			return scrollTo(index + 1);
		},
		onSwipeDown: function onSwipeDown() {
			return scrollTo(index - 1);
		},
		onTouchMove: function onTouchMove(e) {
			element.current.scrollTop = index * height - e.y;
		},
		onDistanceLessThanDelta: function onDistanceLessThanDelta() {
			scrollTo(index);
		}
	}, 50);

	(0, _react.useEffect)(function () {
		var keyListener = function keyListener(e) {
			if (e.keyCode === 38) scrollTo(index - 1);else if (e.keyCode === 40) scrollTo(index + 1);
		};
		window.addEventListener('keyup', keyListener);
		return function () {
			return window.removeEventListener('keyup', keyListener);
		};
	}, [scrollTo, index]);

	(0, _react.useEffect)(function () {
		if (element.current) scrollTo(index);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [height, scrollTo]);

	(0, _react.useEffect)(function () {
		if (ref && ref.current) {
			element.current = ref.current;
			setHeight(ref.current.offsetHeight);
		} else {
			element.current = document.body;
			setHeight(window.innerHeight);
		};

		var onScroll = function onScroll(e) {
			e.preventDefault();
			if (e.deltaY > 0 && index < element.current.scrollHeight) {
				// downscroll code
				scrollTo(index + 1);
			} else if (e.deltaY < 0 && index > 0) {
				// upscroll code
				scrollTo(index - 1);
			}
		};

		var onResize = function onResize() {
			if (ref && ref.current) setHeight(ref.current.offsetHeight);else setHeight(window.innerHeight);
		};

		window.addEventListener('resize', onResize);
		element.current.addEventListener('wheel', onScroll);
		return function () {
			element.current.removeEventListener('wheel', onScroll);
			window.removeEventListener('resize', onResize);
		};
	}, [index, ref, scrollTo]);
	return [index, scrollTo];
};

exports.default = useScrollAnimation;