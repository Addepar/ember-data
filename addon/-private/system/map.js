import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import OrderedSet from '@ember/ordered-set';

function copyNull(obj) {
  let output = Object.create(null);

  for (let prop in obj) {
    // hasOwnPropery is not needed because obj is Object.create(null);
    output[prop] = obj[prop];
  }

  return output;
};

function copyMap(original, newObject) {
  let keys = original._keys.copy();
  let values = copyNull(original._values);

  newObject._keys = keys;
  newObject._values = values;
  newObject.size = original.size;

  return newObject;
}

export class Map {
  constructor() {
    this._keys = new OrderedSet();
    this._values = Object.create(null);
    this.size = 0;
  }

  static create() {
    let Constructor = this;
    return new Constructor();
  }

  get(key) {
    if (this.size === 0) {
      return;
    }

    let values = this._values;
    let guid = guidFor(key);

    return values[guid];
  }

  set(key, value) {
    let keys = this._keys;
    let values = this._values;
    let guid = guidFor(key);

    // ensure we don't store -0
    let k = key === -0 ? 0 : key; // eslint-disable-line no-compare-neg-zero

    keys.add(k, guid);

    values[guid] = value;

    this.size = keys.size;

    return this;
  }

  delete(key) {
    if (this.size === 0) {
      return false;
    }
    // don't use ES6 "delete" because it will be annoying
    // to use in browsers that are not ES6 friendly;
    let keys = this._keys;
    let values = this._values;
    let guid = guidFor(key);

    if (keys.delete(key, guid)) {
      delete values[guid];
      this.size = keys.size;
      return true;
    } else {
      return false;
    }
  }

  has(key) {
    return this._keys.has(key);
  }

  forEach(callback /*, ...thisArg*/) {
    assert(
      `${Object.prototype.toString.call(callback)} is not a function`,
      typeof callback === 'function'
    );

    if (this.size === 0) {
      return;
    }

    let map = this;
    let cb, thisArg;

    if (arguments.length === 2) {
      thisArg = arguments[1];
      cb = key => callback.call(thisArg, map.get(key), key, map);
    } else {
      cb = key => callback(map.get(key), key, map);
    }

    this._keys.forEach(cb);
  }

  clear() {
    this._keys.clear();
    this._values = Object.create(null);
    this.size = 0;
  }

  copy() {
    return copyMap(this, new Map());
  }
}

export class MapWithDefault extends Map {
  constructor(options) {
    super();
    this.defaultValue = options.defaultValue;
  }

  static create(options) {
    if (options) {
      return new MapWithDefault(options);
    } else {
      return new Map();
    }
  }

  get(key) {
    let hasValue = this.has(key);

    if (hasValue) {
      return super.get(key);
    } else {
      let defaultValue = this.defaultValue(key);
      this.set(key, defaultValue);
      return defaultValue;
    }
  }

  copy() {
    let Constructor = this.constructor;
    return copyMap(
      this,
      new Constructor({
        defaultValue: this.defaultValue,
      })
    );
  }
}
