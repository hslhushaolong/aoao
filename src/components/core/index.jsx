
Object.defineProperty(exports, '__esModule', {
  value: true,
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _form = require('./form');
const _upload = require('./upload');
const _search = require('./search');
const _content = require('./content');
const _preview = require('./preview');

Object.defineProperty(exports, 'CoreForm', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_form).default;
  },
});

Object.defineProperty(exports, 'CoreUpload', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_upload).default;
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

Object.defineProperty(exports, 'CorePreview', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_preview).default;
  },
});
