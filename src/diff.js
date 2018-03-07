export function diff(obj1, obj2, limit = 100) {
  if (!obj1 || typeof obj1 != "object" || !obj2 || typeof obj2 != "object") {
    return [{ op: "replace", path: [], value: obj2, oldValue: obj1 }];
  }

  function getDiff(obj1, obj2, basePath, diffs) {
    if (isLimitReached(diffs, limit)) {
      return limitError(diffs);
    }

    const obj1Keys = Object.keys(obj1);
    const obj1KeysLength = obj1Keys.length;
    const obj2Keys = Object.keys(obj2);
    const obj2KeysLength = obj2Keys.length;
    let path;

    for (let i = 0; i < obj1KeysLength; i++) {
      const key = obj1Keys[i];
      if (!(key in obj2)) {
        path = basePath.concat(key);
        diffs.remove.push({
          op: "remove",
          path,
          value: obj1
        });
      }
    }

    for (let i = 0; i < obj2KeysLength; i++) {
      const key = obj2Keys[i];
      const obj1AtKey = obj1[key];
      const obj2AtKey = obj2[key];
      if (!(key in obj1)) {
        path = basePath.concat(key);
        const obj2Value = obj2[key];
        diffs.add.push({
          op: "add",
          path,
          value: obj2Value
        });
      } else if (obj1AtKey !== obj2AtKey) {
        if (
          Object(obj1AtKey) !== obj1AtKey ||
          Object(obj2AtKey) !== obj2AtKey
        ) {
          path = pushReplace(path, basePath, key, diffs, obj2, obj1);
        } else {
          if (
            !Object.keys(obj1AtKey).length &&
            !Object.keys(obj2AtKey).length &&
            JSON.stringify(obj1AtKey) != JSON.stringify(obj2AtKey)
          ) {
            path = pushReplace(path, basePath, key, diffs, obj2, obj1);
          } else {
            getDiff(obj1[key], obj2[key], basePath.concat(key), diffs);
          }
        }
      }
    }

    if (isLimitReached(diffs, limit)) {
      return limitError(diffs).errors;
    }

    return diffs.remove
      .concat(diffs.replace)
      .concat(diffs.add)
      .concat(diffs.errors);
  }

  return getDiff(obj1, obj2, [], {
    remove: [],
    replace: [],
    add: [],
    errors: []
  });
}

const isLimitReached = (diffs, limit) =>
  diffs.remove.length + diffs.add.length + diffs.replace.length >= limit;

const limitError = diffs => ({
  remove: [],
  replace: [],
  add: [],
  errors: [{ op: "error", type: "limit", message: "Diff is too big..." }]
});

const pushReplace = (path, basePath, key, diffs, obj2, obj1) => {
  path = basePath.concat(key);
  diffs.replace.push({
    op: "replace",
    path,
    value: obj2[key],
    oldValue: obj1[key]
  });
  return path;
};
