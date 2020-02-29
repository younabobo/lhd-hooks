"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

/**
 *	useSwipe track one touch and excute the propriate callback each time
 * @param {React.Element} Element
 * @param {object} Handlers
 * @param {function} Handlers.onSwipeDown the function to excute when swipe down excute when touch is done
 * @param {function} Handlers.onSwipeUp the function to excute when swipe up excute when touch is done
 * @param {function} Handlers.onSwipeLeft the function to excute when swipe left excute when touch is done
 * @param {function} Handlers.onSwipeRight the function to excute when swipe right excute when touch is done
 * @param {function} Handlers.onDistanceLessThanDelta the function to excute when swipe less then delta
 * @param {function} Handlers.onTouchMove the function to excute when touch move
 * @param {number} [delta=30]
 */
var useSwipe = function useSwipe(Element, Handlers) {
  var delta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30;

  var start = (0, _react.useRef)({});
  var end = (0, _react.useRef)({});
  var handlers = (0, _react.useRef)(Handlers);

  (0, _react.useEffect)(function () {
    handlers.current = Handlers;
  }, [Handlers]);
  var swipeDirection = (0, _react.useCallback)(function (start, end, delta) {
    if (start && start.x && start.y && end && end.x && end.y && delta) {
      var xDiff = end.x - start.x,
          yDiff = end.y - start.y;
      if (xDiff > yDiff && xDiff > delta) {
        return "left";
      } else if (yDiff > xDiff && yDiff > delta) {
        return "down";
      } else if (xDiff < yDiff && xDiff < -delta) {
        return "right";
      } else if (yDiff < xDiff && yDiff < -delta) {
        return "up";
      }
    }
    return false;
  }, []);
  var onTouchStart = (0, _react.useCallback)(function (e) {
    var point = e.touches.length && {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    start.current = point || null;
  }, []);

  var onTouchMove = (0, _react.useCallback)(function (e) {
    var distance = e.changedTouches.length && {
      x: e.changedTouches[0].clientX - start.current.x,
      y: e.changedTouches[0].clientY - start.current.y
    };
    var onTouchMove = handlers.current.onTouchMove;

    if (onTouchMove) onTouchMove(distance);
  }, []);

  var onTouchEnd = (0, _react.useCallback)(function (e) {
    var point = e.changedTouches.length && {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };
    var _handlers$current = handlers.current,
        onSwipeDown = _handlers$current.onSwipeDown,
        onSwipeUp = _handlers$current.onSwipeUp,
        onSwipeLeft = _handlers$current.onSwipeLeft,
        onSwipeRight = _handlers$current.onSwipeRight,
        onDistanceLessThanDelta = _handlers$current.onDistanceLessThanDelta;

    end.current = point || null;

    switch (swipeDirection(start.current, end.current, delta)) {
      case "down":
        onSwipeDown && onSwipeDown();
        break;
      case "up":
        onSwipeUp && onSwipeUp();
        break;
      case "left":
        onSwipeLeft && onSwipeLeft();
        break;
      case "right":
        onSwipeRight && onSwipeRight();
        break;
      default:
        onDistanceLessThanDelta && onDistanceLessThanDelta();
        return;
    }
  }, [delta, swipeDirection]);

  (0, _react.useEffect)(function () {
    if (!Element || !Element.current) return;
    var current = Element.current;

    current.addEventListener("touchstart", onTouchStart);
    current.addEventListener("touchmove", onTouchMove);
    current.addEventListener("touchend", onTouchEnd);
    return function () {
      current.addEventListener("touchstart", onTouchStart);
      current.addEventListener("touchmove", onTouchMove);
      current.addEventListener("touchend", onTouchEnd);
    };
  }, [Element, onTouchStart, onTouchMove, onTouchEnd]);
};

exports.default = useSwipe;