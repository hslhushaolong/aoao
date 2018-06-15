
// Object.defineProperty(exports, '__esModule', {
//   value: true,
// });

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _form = require('./form');
const _search = require('./search');
const _content = require('./content');

Object.defineProperty(exports, 'CoreForm', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_form).default;
  },
});

Object.defineProperty(exports, 'CoreSearch', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_search).default;
  },
});

Object.defineProperty(exports, 'CoreContent', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_content).default;
  },
});
