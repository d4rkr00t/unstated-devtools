"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.diff = diff;
function diff(obj1, obj2) {
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

  if (!obj1 || (typeof obj1 === "undefined" ? "undefined" : _typeof(obj1)) != "object" || !obj2 || (typeof obj2 === "undefined" ? "undefined" : _typeof(obj2)) != "object") {
    return [{ op: "replace", path: [], value: obj2, oldValue: obj1 }];
  }

  function getDiff(obj1, obj2, basePath, diffs) {
    if (isLimitReached(diffs, limit)) {
      return limitError(diffs);
    }

    var obj1Keys = Object.keys(obj1);
    var obj1KeysLength = obj1Keys.length;
    var obj2Keys = Object.keys(obj2);
    var obj2KeysLength = obj2Keys.length;
    var path = void 0;

    for (var i = 0; i < obj1KeysLength; i++) {
      var key = obj1Keys[i];
      if (!(key in obj2)) {
        path = basePath.concat(key);
        diffs.remove.push({
          op: "remove",
          path: path,
          value: obj1
        });
      }
    }

    for (var _i = 0; _i < obj2KeysLength; _i++) {
      var _key = obj2Keys[_i];
      var obj1AtKey = obj1[_key];
      var obj2AtKey = obj2[_key];
      if (!(_key in obj1)) {
        path = basePath.concat(_key);
        var obj2Value = obj2[_key];
        diffs.add.push({
          op: "add",
          path: path,
          value: obj2Value
        });
      } else if (obj1AtKey !== obj2AtKey) {
        if (Object(obj1AtKey) !== obj1AtKey || Object(obj2AtKey) !== obj2AtKey) {
          path = pushReplace(path, basePath, _key, diffs, obj2, obj1);
        } else {
          if (!Object.keys(obj1AtKey).length && !Object.keys(obj2AtKey).length && JSON.stringify(obj1AtKey) != JSON.stringify(obj2AtKey)) {
            path = pushReplace(path, basePath, _key, diffs, obj2, obj1);
          } else {
            getDiff(obj1[_key], obj2[_key], basePath.concat(_key), diffs);
          }
        }
      }
    }

    if (isLimitReached(diffs, limit)) {
      return limitError(diffs).errors;
    }

    return diffs.remove.concat(diffs.replace).concat(diffs.add).concat(diffs.errors);
  }

  return getDiff(obj1, obj2, [], {
    remove: [],
    replace: [],
    add: [],
    errors: []
  });
}

var isLimitReached = function isLimitReached(diffs, limit) {
  return diffs.remove.length + diffs.add.length + diffs.replace.length >= limit;
};

var limitError = function limitError(diffs) {
  return {
    remove: [],
    replace: [],
    add: [],
    errors: [{ op: "error", type: "limit", message: "Diff is too big..." }]
  };
};

var pushReplace = function pushReplace(path, basePath, key, diffs, obj2, obj1) {
  path = basePath.concat(key);
  diffs.replace.push({
    op: "replace",
    path: path,
    value: obj2[key],
    oldValue: obj1[key]
  });
  return path;
};