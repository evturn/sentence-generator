'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _instance = require('./instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (filepath) {
  var createInstance = (0, _compose2.default)(_instance2.default, stringifyFile, readFile, resolvePath);
  return createInstance(filepath);
};

function resolvePath(filepath) {
  return _path2.default.resolve(process.cwd(), filepath);
}

function readFile(path) {
  return _fs2.default.readFileSync(path);
}

function stringifyFile(file) {
  return file.toString();
}
module.exports = exports['default'];