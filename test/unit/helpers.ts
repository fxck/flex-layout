import {isArray, forEach, toJson} from '../src/utils/util';

function _baseThey(msg, vals, spec, itFn) {
  var valsIsArray = isArray(vals);
  forEach(vals, (val, key) => {
    var message = msg.split('$prop').join(toJson(valsIsArray ? val : key));
    itFn(message, () => spec.call(this, val));
  });
}

export function they(msg, vals, spec) {
  _baseThey(msg, vals, spec, it);
}

export function fthey(msg, vals, spec) {
  _baseThey(msg, vals, spec, fit);
}

export function xthey(msg, vals, spec) {
  _baseThey(msg, vals, spec, xit);
}

export function iit(message, fn) {
  return fit(message, fn);
}

export function xit(message, fn) {}
