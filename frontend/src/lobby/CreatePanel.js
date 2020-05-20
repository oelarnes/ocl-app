"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _utils = _interopRequireDefault(require("utils/utils"));

var _app = _interopRequireDefault(require("../app"));

var _utils2 = require("../utils");

var _axios = _interopRequireDefault(require("axios"));

var _GameOptions = _interopRequireDefault(require("./GameOptions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var CreatePanel = function CreatePanel() {
  var _App$state = _app.default.state,
      title = _App$state.title,
      seats = _App$state.seats;
  return /*#__PURE__*/_react.default.createElement("fieldset", {
    className: "fieldset"
  }, /*#__PURE__*/_react.default.createElement("legend", {
    className: "legend"
  }, "Create a Room"), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("label", null, "Event Id:", " ", /*#__PURE__*/_react.default.createElement("select", {
    value: title,
    onChange: function onChange(e) {
      _app.default.save("title", e.currentTarget.value);
    },
    onBlur: /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
        var ctParam, _yield$axios$post, data;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                ctParam = e.currentTarget.value.includes("-powered-") ? "Powered" : e.currentTarget.value.includes("-interactive-") ? "Interactive" : null;

                if (!ctParam) {
                  _context.next = 7;
                  break;
                }

                _context.next = 4;
                return _axios.default.post("/api/data", {
                  query: "{cubeByType(cubeType: ".concat(ctParam, "){cardNames}}")
                });

              case 4:
                _yield$axios$post = _context.sent;
                data = _yield$axios$post.data;

                _app.default.save("list", data.data.cubeByType.cardNames.join("\n"));

              case 7:
                _app.default.save("oclDataSync", !/$casual-/.test(e.currentTarget.value));

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()
  }, (0, _utils2.eventIdOptions)().map(function (x, i) {
    return /*#__PURE__*/_react.default.createElement("option", {
      key: i
    }, x);
  })))), title.includes("casual-") ? /*#__PURE__*/_react.default.createElement("div", null, "Number of players:", " ", /*#__PURE__*/_react.default.createElement("select", {
    value: seats,
    onChange: function onChange(e) {
      _app.default.save("seats", e.currentTarget.value);
    }
  }, _utils.default.seq(100, 1).map(function (x, i) {
    return /*#__PURE__*/_react.default.createElement("option", {
      key: i
    }, x);
  }))) : "", title.includes("casual-other-") ? /*#__PURE__*/_react.default.createElement(_GameOptions.default, null) : "", /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement("button", {
    onClick: _app.default._emit("create")
  }, "Create Room")));
};

var _default = CreatePanel;
exports.default = _default;

