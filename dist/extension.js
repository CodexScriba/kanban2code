"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/fast-glob/out/utils/array.js
var require_array = __commonJS({
  "node_modules/fast-glob/out/utils/array.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.splitWhen = exports2.flatten = void 0;
    function flatten(items) {
      return items.reduce((collection, item) => [].concat(collection, item), []);
    }
    exports2.flatten = flatten;
    function splitWhen(items, predicate) {
      const result = [[]];
      let groupIndex = 0;
      for (const item of items) {
        if (predicate(item)) {
          groupIndex++;
          result[groupIndex] = [];
        } else {
          result[groupIndex].push(item);
        }
      }
      return result;
    }
    exports2.splitWhen = splitWhen;
  }
});

// node_modules/fast-glob/out/utils/errno.js
var require_errno = __commonJS({
  "node_modules/fast-glob/out/utils/errno.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isEnoentCodeError = void 0;
    function isEnoentCodeError(error) {
      return error.code === "ENOENT";
    }
    exports2.isEnoentCodeError = isEnoentCodeError;
  }
});

// node_modules/fast-glob/out/utils/fs.js
var require_fs = __commonJS({
  "node_modules/fast-glob/out/utils/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createDirentFromStats = void 0;
    var DirentFromStats = class {
      constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
      }
    };
    function createDirentFromStats(name, stats) {
      return new DirentFromStats(name, stats);
    }
    exports2.createDirentFromStats = createDirentFromStats;
  }
});

// node_modules/fast-glob/out/utils/path.js
var require_path = __commonJS({
  "node_modules/fast-glob/out/utils/path.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.convertPosixPathToPattern = exports2.convertWindowsPathToPattern = exports2.convertPathToPattern = exports2.escapePosixPath = exports2.escapeWindowsPath = exports2.escape = exports2.removeLeadingDotSegment = exports2.makeAbsolute = exports2.unixify = void 0;
    var os = require("os");
    var path14 = require("path");
    var IS_WINDOWS_PLATFORM = os.platform() === "win32";
    var LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2;
    var POSIX_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g;
    var WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()[\]{}]|^!|[!+@](?=\())/g;
    var DOS_DEVICE_PATH_RE = /^\\\\([.?])/;
    var WINDOWS_BACKSLASHES_RE = /\\(?![!()+@[\]{}])/g;
    function unixify(filepath) {
      return filepath.replace(/\\/g, "/");
    }
    exports2.unixify = unixify;
    function makeAbsolute(cwd, filepath) {
      return path14.resolve(cwd, filepath);
    }
    exports2.makeAbsolute = makeAbsolute;
    function removeLeadingDotSegment(entry) {
      if (entry.charAt(0) === ".") {
        const secondCharactery = entry.charAt(1);
        if (secondCharactery === "/" || secondCharactery === "\\") {
          return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
        }
      }
      return entry;
    }
    exports2.removeLeadingDotSegment = removeLeadingDotSegment;
    exports2.escape = IS_WINDOWS_PLATFORM ? escapeWindowsPath : escapePosixPath;
    function escapeWindowsPath(pattern) {
      return pattern.replace(WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
    }
    exports2.escapeWindowsPath = escapeWindowsPath;
    function escapePosixPath(pattern) {
      return pattern.replace(POSIX_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
    }
    exports2.escapePosixPath = escapePosixPath;
    exports2.convertPathToPattern = IS_WINDOWS_PLATFORM ? convertWindowsPathToPattern : convertPosixPathToPattern;
    function convertWindowsPathToPattern(filepath) {
      return escapeWindowsPath(filepath).replace(DOS_DEVICE_PATH_RE, "//$1").replace(WINDOWS_BACKSLASHES_RE, "/");
    }
    exports2.convertWindowsPathToPattern = convertWindowsPathToPattern;
    function convertPosixPathToPattern(filepath) {
      return escapePosixPath(filepath);
    }
    exports2.convertPosixPathToPattern = convertPosixPathToPattern;
  }
});

// node_modules/is-extglob/index.js
var require_is_extglob = __commonJS({
  "node_modules/is-extglob/index.js"(exports2, module2) {
    module2.exports = function isExtglob(str2) {
      if (typeof str2 !== "string" || str2 === "") {
        return false;
      }
      var match;
      while (match = /(\\).|([@?!+*]\(.*\))/g.exec(str2)) {
        if (match[2]) return true;
        str2 = str2.slice(match.index + match[0].length);
      }
      return false;
    };
  }
});

// node_modules/is-glob/index.js
var require_is_glob = __commonJS({
  "node_modules/is-glob/index.js"(exports2, module2) {
    var isExtglob = require_is_extglob();
    var chars = { "{": "}", "(": ")", "[": "]" };
    var strictCheck = function(str2) {
      if (str2[0] === "!") {
        return true;
      }
      var index = 0;
      var pipeIndex = -2;
      var closeSquareIndex = -2;
      var closeCurlyIndex = -2;
      var closeParenIndex = -2;
      var backSlashIndex = -2;
      while (index < str2.length) {
        if (str2[index] === "*") {
          return true;
        }
        if (str2[index + 1] === "?" && /[\].+)]/.test(str2[index])) {
          return true;
        }
        if (closeSquareIndex !== -1 && str2[index] === "[" && str2[index + 1] !== "]") {
          if (closeSquareIndex < index) {
            closeSquareIndex = str2.indexOf("]", index);
          }
          if (closeSquareIndex > index) {
            if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
              return true;
            }
            backSlashIndex = str2.indexOf("\\", index);
            if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
              return true;
            }
          }
        }
        if (closeCurlyIndex !== -1 && str2[index] === "{" && str2[index + 1] !== "}") {
          closeCurlyIndex = str2.indexOf("}", index);
          if (closeCurlyIndex > index) {
            backSlashIndex = str2.indexOf("\\", index);
            if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) {
              return true;
            }
          }
        }
        if (closeParenIndex !== -1 && str2[index] === "(" && str2[index + 1] === "?" && /[:!=]/.test(str2[index + 2]) && str2[index + 3] !== ")") {
          closeParenIndex = str2.indexOf(")", index);
          if (closeParenIndex > index) {
            backSlashIndex = str2.indexOf("\\", index);
            if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
              return true;
            }
          }
        }
        if (pipeIndex !== -1 && str2[index] === "(" && str2[index + 1] !== "|") {
          if (pipeIndex < index) {
            pipeIndex = str2.indexOf("|", index);
          }
          if (pipeIndex !== -1 && str2[pipeIndex + 1] !== ")") {
            closeParenIndex = str2.indexOf(")", pipeIndex);
            if (closeParenIndex > pipeIndex) {
              backSlashIndex = str2.indexOf("\\", pipeIndex);
              if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
                return true;
              }
            }
          }
        }
        if (str2[index] === "\\") {
          var open = str2[index + 1];
          index += 2;
          var close = chars[open];
          if (close) {
            var n = str2.indexOf(close, index);
            if (n !== -1) {
              index = n + 1;
            }
          }
          if (str2[index] === "!") {
            return true;
          }
        } else {
          index++;
        }
      }
      return false;
    };
    var relaxedCheck = function(str2) {
      if (str2[0] === "!") {
        return true;
      }
      var index = 0;
      while (index < str2.length) {
        if (/[*?{}()[\]]/.test(str2[index])) {
          return true;
        }
        if (str2[index] === "\\") {
          var open = str2[index + 1];
          index += 2;
          var close = chars[open];
          if (close) {
            var n = str2.indexOf(close, index);
            if (n !== -1) {
              index = n + 1;
            }
          }
          if (str2[index] === "!") {
            return true;
          }
        } else {
          index++;
        }
      }
      return false;
    };
    module2.exports = function isGlob(str2, options2) {
      if (typeof str2 !== "string" || str2 === "") {
        return false;
      }
      if (isExtglob(str2)) {
        return true;
      }
      var check = strictCheck;
      if (options2 && options2.strict === false) {
        check = relaxedCheck;
      }
      return check(str2);
    };
  }
});

// node_modules/fast-glob/node_modules/glob-parent/index.js
var require_glob_parent = __commonJS({
  "node_modules/fast-glob/node_modules/glob-parent/index.js"(exports2, module2) {
    "use strict";
    var isGlob = require_is_glob();
    var pathPosixDirname = require("path").posix.dirname;
    var isWin32 = require("os").platform() === "win32";
    var slash = "/";
    var backslash = /\\/g;
    var enclosure = /[\{\[].*[\}\]]$/;
    var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
    var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;
    module2.exports = function globParent(str2, opts) {
      var options2 = Object.assign({ flipBackslashes: true }, opts);
      if (options2.flipBackslashes && isWin32 && str2.indexOf(slash) < 0) {
        str2 = str2.replace(backslash, slash);
      }
      if (enclosure.test(str2)) {
        str2 += slash;
      }
      str2 += "a";
      do {
        str2 = pathPosixDirname(str2);
      } while (isGlob(str2) || globby.test(str2));
      return str2.replace(escaped, "$1");
    };
  }
});

// node_modules/braces/lib/utils.js
var require_utils = __commonJS({
  "node_modules/braces/lib/utils.js"(exports2) {
    "use strict";
    exports2.isInteger = (num) => {
      if (typeof num === "number") {
        return Number.isInteger(num);
      }
      if (typeof num === "string" && num.trim() !== "") {
        return Number.isInteger(Number(num));
      }
      return false;
    };
    exports2.find = (node, type) => node.nodes.find((node2) => node2.type === type);
    exports2.exceedsLimit = (min, max, step = 1, limit) => {
      if (limit === false) return false;
      if (!exports2.isInteger(min) || !exports2.isInteger(max)) return false;
      return (Number(max) - Number(min)) / Number(step) >= limit;
    };
    exports2.escapeNode = (block, n = 0, type) => {
      const node = block.nodes[n];
      if (!node) return;
      if (type && node.type === type || node.type === "open" || node.type === "close") {
        if (node.escaped !== true) {
          node.value = "\\" + node.value;
          node.escaped = true;
        }
      }
    };
    exports2.encloseBrace = (node) => {
      if (node.type !== "brace") return false;
      if (node.commas >> 0 + node.ranges >> 0 === 0) {
        node.invalid = true;
        return true;
      }
      return false;
    };
    exports2.isInvalidBrace = (block) => {
      if (block.type !== "brace") return false;
      if (block.invalid === true || block.dollar) return true;
      if (block.commas >> 0 + block.ranges >> 0 === 0) {
        block.invalid = true;
        return true;
      }
      if (block.open !== true || block.close !== true) {
        block.invalid = true;
        return true;
      }
      return false;
    };
    exports2.isOpenOrClose = (node) => {
      if (node.type === "open" || node.type === "close") {
        return true;
      }
      return node.open === true || node.close === true;
    };
    exports2.reduce = (nodes) => nodes.reduce((acc, node) => {
      if (node.type === "text") acc.push(node.value);
      if (node.type === "range") node.type = "text";
      return acc;
    }, []);
    exports2.flatten = (...args) => {
      const result = [];
      const flat = (arr) => {
        for (let i = 0; i < arr.length; i++) {
          const ele = arr[i];
          if (Array.isArray(ele)) {
            flat(ele);
            continue;
          }
          if (ele !== void 0) {
            result.push(ele);
          }
        }
        return result;
      };
      flat(args);
      return result;
    };
  }
});

// node_modules/braces/lib/stringify.js
var require_stringify = __commonJS({
  "node_modules/braces/lib/stringify.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = (ast, options2 = {}) => {
      const stringify = (node, parent = {}) => {
        const invalidBlock = options2.escapeInvalid && utils.isInvalidBrace(parent);
        const invalidNode = node.invalid === true && options2.escapeInvalid === true;
        let output = "";
        if (node.value) {
          if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
            return "\\" + node.value;
          }
          return node.value;
        }
        if (node.value) {
          return node.value;
        }
        if (node.nodes) {
          for (const child of node.nodes) {
            output += stringify(child);
          }
        }
        return output;
      };
      return stringify(ast);
    };
  }
});

// node_modules/is-number/index.js
var require_is_number = __commonJS({
  "node_modules/is-number/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function(num) {
      if (typeof num === "number") {
        return num - num === 0;
      }
      if (typeof num === "string" && num.trim() !== "") {
        return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
      }
      return false;
    };
  }
});

// node_modules/to-regex-range/index.js
var require_to_regex_range = __commonJS({
  "node_modules/to-regex-range/index.js"(exports2, module2) {
    "use strict";
    var isNumber = require_is_number();
    var toRegexRange = (min, max, options2) => {
      if (isNumber(min) === false) {
        throw new TypeError("toRegexRange: expected the first argument to be a number");
      }
      if (max === void 0 || min === max) {
        return String(min);
      }
      if (isNumber(max) === false) {
        throw new TypeError("toRegexRange: expected the second argument to be a number.");
      }
      let opts = { relaxZeros: true, ...options2 };
      if (typeof opts.strictZeros === "boolean") {
        opts.relaxZeros = opts.strictZeros === false;
      }
      let relax = String(opts.relaxZeros);
      let shorthand = String(opts.shorthand);
      let capture = String(opts.capture);
      let wrap2 = String(opts.wrap);
      let cacheKey = min + ":" + max + "=" + relax + shorthand + capture + wrap2;
      if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
        return toRegexRange.cache[cacheKey].result;
      }
      let a = Math.min(min, max);
      let b = Math.max(min, max);
      if (Math.abs(a - b) === 1) {
        let result = min + "|" + max;
        if (opts.capture) {
          return `(${result})`;
        }
        if (opts.wrap === false) {
          return result;
        }
        return `(?:${result})`;
      }
      let isPadded = hasPadding(min) || hasPadding(max);
      let state = { min, max, a, b };
      let positives = [];
      let negatives = [];
      if (isPadded) {
        state.isPadded = isPadded;
        state.maxLen = String(state.max).length;
      }
      if (a < 0) {
        let newMin = b < 0 ? Math.abs(b) : 1;
        negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
        a = state.a = 0;
      }
      if (b >= 0) {
        positives = splitToPatterns(a, b, state, opts);
      }
      state.negatives = negatives;
      state.positives = positives;
      state.result = collatePatterns(negatives, positives, opts);
      if (opts.capture === true) {
        state.result = `(${state.result})`;
      } else if (opts.wrap !== false && positives.length + negatives.length > 1) {
        state.result = `(?:${state.result})`;
      }
      toRegexRange.cache[cacheKey] = state;
      return state.result;
    };
    function collatePatterns(neg, pos, options2) {
      let onlyNegative = filterPatterns(neg, pos, "-", false, options2) || [];
      let onlyPositive = filterPatterns(pos, neg, "", false, options2) || [];
      let intersected = filterPatterns(neg, pos, "-?", true, options2) || [];
      let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
      return subpatterns.join("|");
    }
    function splitToRanges(min, max) {
      let nines = 1;
      let zeros = 1;
      let stop = countNines(min, nines);
      let stops = /* @__PURE__ */ new Set([max]);
      while (min <= stop && stop <= max) {
        stops.add(stop);
        nines += 1;
        stop = countNines(min, nines);
      }
      stop = countZeros(max + 1, zeros) - 1;
      while (min < stop && stop <= max) {
        stops.add(stop);
        zeros += 1;
        stop = countZeros(max + 1, zeros) - 1;
      }
      stops = [...stops];
      stops.sort(compare);
      return stops;
    }
    function rangeToPattern(start, stop, options2) {
      if (start === stop) {
        return { pattern: start, count: [], digits: 0 };
      }
      let zipped = zip(start, stop);
      let digits = zipped.length;
      let pattern = "";
      let count = 0;
      for (let i = 0; i < digits; i++) {
        let [startDigit, stopDigit] = zipped[i];
        if (startDigit === stopDigit) {
          pattern += startDigit;
        } else if (startDigit !== "0" || stopDigit !== "9") {
          pattern += toCharacterClass(startDigit, stopDigit, options2);
        } else {
          count++;
        }
      }
      if (count) {
        pattern += options2.shorthand === true ? "\\d" : "[0-9]";
      }
      return { pattern, count: [count], digits };
    }
    function splitToPatterns(min, max, tok, options2) {
      let ranges = splitToRanges(min, max);
      let tokens = [];
      let start = min;
      let prev;
      for (let i = 0; i < ranges.length; i++) {
        let max2 = ranges[i];
        let obj = rangeToPattern(String(start), String(max2), options2);
        let zeros = "";
        if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
          if (prev.count.length > 1) {
            prev.count.pop();
          }
          prev.count.push(obj.count[0]);
          prev.string = prev.pattern + toQuantifier(prev.count);
          start = max2 + 1;
          continue;
        }
        if (tok.isPadded) {
          zeros = padZeros(max2, tok, options2);
        }
        obj.string = zeros + obj.pattern + toQuantifier(obj.count);
        tokens.push(obj);
        start = max2 + 1;
        prev = obj;
      }
      return tokens;
    }
    function filterPatterns(arr, comparison, prefix, intersection, options2) {
      let result = [];
      for (let ele of arr) {
        let { string } = ele;
        if (!intersection && !contains(comparison, "string", string)) {
          result.push(prefix + string);
        }
        if (intersection && contains(comparison, "string", string)) {
          result.push(prefix + string);
        }
      }
      return result;
    }
    function zip(a, b) {
      let arr = [];
      for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
      return arr;
    }
    function compare(a, b) {
      return a > b ? 1 : b > a ? -1 : 0;
    }
    function contains(arr, key, val) {
      return arr.some((ele) => ele[key] === val);
    }
    function countNines(min, len) {
      return Number(String(min).slice(0, -len) + "9".repeat(len));
    }
    function countZeros(integer, zeros) {
      return integer - integer % Math.pow(10, zeros);
    }
    function toQuantifier(digits) {
      let [start = 0, stop = ""] = digits;
      if (stop || start > 1) {
        return `{${start + (stop ? "," + stop : "")}}`;
      }
      return "";
    }
    function toCharacterClass(a, b, options2) {
      return `[${a}${b - a === 1 ? "" : "-"}${b}]`;
    }
    function hasPadding(str2) {
      return /^-?(0+)\d/.test(str2);
    }
    function padZeros(value, tok, options2) {
      if (!tok.isPadded) {
        return value;
      }
      let diff = Math.abs(tok.maxLen - String(value).length);
      let relax = options2.relaxZeros !== false;
      switch (diff) {
        case 0:
          return "";
        case 1:
          return relax ? "0?" : "0";
        case 2:
          return relax ? "0{0,2}" : "00";
        default: {
          return relax ? `0{0,${diff}}` : `0{${diff}}`;
        }
      }
    }
    toRegexRange.cache = {};
    toRegexRange.clearCache = () => toRegexRange.cache = {};
    module2.exports = toRegexRange;
  }
});

// node_modules/fill-range/index.js
var require_fill_range = __commonJS({
  "node_modules/fill-range/index.js"(exports2, module2) {
    "use strict";
    var util2 = require("util");
    var toRegexRange = require_to_regex_range();
    var isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    var transform = (toNumber) => {
      return (value) => toNumber === true ? Number(value) : String(value);
    };
    var isValidValue = (value) => {
      return typeof value === "number" || typeof value === "string" && value !== "";
    };
    var isNumber = (num) => Number.isInteger(+num);
    var zeros = (input) => {
      let value = `${input}`;
      let index = -1;
      if (value[0] === "-") value = value.slice(1);
      if (value === "0") return false;
      while (value[++index] === "0") ;
      return index > 0;
    };
    var stringify = (start, end, options2) => {
      if (typeof start === "string" || typeof end === "string") {
        return true;
      }
      return options2.stringify === true;
    };
    var pad = (input, maxLength, toNumber) => {
      if (maxLength > 0) {
        let dash = input[0] === "-" ? "-" : "";
        if (dash) input = input.slice(1);
        input = dash + input.padStart(dash ? maxLength - 1 : maxLength, "0");
      }
      if (toNumber === false) {
        return String(input);
      }
      return input;
    };
    var toMaxLen = (input, maxLength) => {
      let negative = input[0] === "-" ? "-" : "";
      if (negative) {
        input = input.slice(1);
        maxLength--;
      }
      while (input.length < maxLength) input = "0" + input;
      return negative ? "-" + input : input;
    };
    var toSequence = (parts, options2, maxLen) => {
      parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
      parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
      let prefix = options2.capture ? "" : "?:";
      let positives = "";
      let negatives = "";
      let result;
      if (parts.positives.length) {
        positives = parts.positives.map((v) => toMaxLen(String(v), maxLen)).join("|");
      }
      if (parts.negatives.length) {
        negatives = `-(${prefix}${parts.negatives.map((v) => toMaxLen(String(v), maxLen)).join("|")})`;
      }
      if (positives && negatives) {
        result = `${positives}|${negatives}`;
      } else {
        result = positives || negatives;
      }
      if (options2.wrap) {
        return `(${prefix}${result})`;
      }
      return result;
    };
    var toRange = (a, b, isNumbers, options2) => {
      if (isNumbers) {
        return toRegexRange(a, b, { wrap: false, ...options2 });
      }
      let start = String.fromCharCode(a);
      if (a === b) return start;
      let stop = String.fromCharCode(b);
      return `[${start}-${stop}]`;
    };
    var toRegex = (start, end, options2) => {
      if (Array.isArray(start)) {
        let wrap2 = options2.wrap === true;
        let prefix = options2.capture ? "" : "?:";
        return wrap2 ? `(${prefix}${start.join("|")})` : start.join("|");
      }
      return toRegexRange(start, end, options2);
    };
    var rangeError = (...args) => {
      return new RangeError("Invalid range arguments: " + util2.inspect(...args));
    };
    var invalidRange = (start, end, options2) => {
      if (options2.strictRanges === true) throw rangeError([start, end]);
      return [];
    };
    var invalidStep = (step, options2) => {
      if (options2.strictRanges === true) {
        throw new TypeError(`Expected step "${step}" to be a number`);
      }
      return [];
    };
    var fillNumbers = (start, end, step = 1, options2 = {}) => {
      let a = Number(start);
      let b = Number(end);
      if (!Number.isInteger(a) || !Number.isInteger(b)) {
        if (options2.strictRanges === true) throw rangeError([start, end]);
        return [];
      }
      if (a === 0) a = 0;
      if (b === 0) b = 0;
      let descending = a > b;
      let startString = String(start);
      let endString = String(end);
      let stepString = String(step);
      step = Math.max(Math.abs(step), 1);
      let padded = zeros(startString) || zeros(endString) || zeros(stepString);
      let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
      let toNumber = padded === false && stringify(start, end, options2) === false;
      let format = options2.transform || transform(toNumber);
      if (options2.toRegex && step === 1) {
        return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options2);
      }
      let parts = { negatives: [], positives: [] };
      let push = (num) => parts[num < 0 ? "negatives" : "positives"].push(Math.abs(num));
      let range = [];
      let index = 0;
      while (descending ? a >= b : a <= b) {
        if (options2.toRegex === true && step > 1) {
          push(a);
        } else {
          range.push(pad(format(a, index), maxLen, toNumber));
        }
        a = descending ? a - step : a + step;
        index++;
      }
      if (options2.toRegex === true) {
        return step > 1 ? toSequence(parts, options2, maxLen) : toRegex(range, null, { wrap: false, ...options2 });
      }
      return range;
    };
    var fillLetters = (start, end, step = 1, options2 = {}) => {
      if (!isNumber(start) && start.length > 1 || !isNumber(end) && end.length > 1) {
        return invalidRange(start, end, options2);
      }
      let format = options2.transform || ((val) => String.fromCharCode(val));
      let a = `${start}`.charCodeAt(0);
      let b = `${end}`.charCodeAt(0);
      let descending = a > b;
      let min = Math.min(a, b);
      let max = Math.max(a, b);
      if (options2.toRegex && step === 1) {
        return toRange(min, max, false, options2);
      }
      let range = [];
      let index = 0;
      while (descending ? a >= b : a <= b) {
        range.push(format(a, index));
        a = descending ? a - step : a + step;
        index++;
      }
      if (options2.toRegex === true) {
        return toRegex(range, null, { wrap: false, options: options2 });
      }
      return range;
    };
    var fill = (start, end, step, options2 = {}) => {
      if (end == null && isValidValue(start)) {
        return [start];
      }
      if (!isValidValue(start) || !isValidValue(end)) {
        return invalidRange(start, end, options2);
      }
      if (typeof step === "function") {
        return fill(start, end, 1, { transform: step });
      }
      if (isObject(step)) {
        return fill(start, end, 0, step);
      }
      let opts = { ...options2 };
      if (opts.capture === true) opts.wrap = true;
      step = step || opts.step || 1;
      if (!isNumber(step)) {
        if (step != null && !isObject(step)) return invalidStep(step, opts);
        return fill(start, end, 1, step);
      }
      if (isNumber(start) && isNumber(end)) {
        return fillNumbers(start, end, step, opts);
      }
      return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
    };
    module2.exports = fill;
  }
});

// node_modules/braces/lib/compile.js
var require_compile = __commonJS({
  "node_modules/braces/lib/compile.js"(exports2, module2) {
    "use strict";
    var fill = require_fill_range();
    var utils = require_utils();
    var compile = (ast, options2 = {}) => {
      const walk = (node, parent = {}) => {
        const invalidBlock = utils.isInvalidBrace(parent);
        const invalidNode = node.invalid === true && options2.escapeInvalid === true;
        const invalid = invalidBlock === true || invalidNode === true;
        const prefix = options2.escapeInvalid === true ? "\\" : "";
        let output = "";
        if (node.isOpen === true) {
          return prefix + node.value;
        }
        if (node.isClose === true) {
          console.log("node.isClose", prefix, node.value);
          return prefix + node.value;
        }
        if (node.type === "open") {
          return invalid ? prefix + node.value : "(";
        }
        if (node.type === "close") {
          return invalid ? prefix + node.value : ")";
        }
        if (node.type === "comma") {
          return node.prev.type === "comma" ? "" : invalid ? node.value : "|";
        }
        if (node.value) {
          return node.value;
        }
        if (node.nodes && node.ranges > 0) {
          const args = utils.reduce(node.nodes);
          const range = fill(...args, { ...options2, wrap: false, toRegex: true, strictZeros: true });
          if (range.length !== 0) {
            return args.length > 1 && range.length > 1 ? `(${range})` : range;
          }
        }
        if (node.nodes) {
          for (const child of node.nodes) {
            output += walk(child, node);
          }
        }
        return output;
      };
      return walk(ast);
    };
    module2.exports = compile;
  }
});

// node_modules/braces/lib/expand.js
var require_expand = __commonJS({
  "node_modules/braces/lib/expand.js"(exports2, module2) {
    "use strict";
    var fill = require_fill_range();
    var stringify = require_stringify();
    var utils = require_utils();
    var append = (queue = "", stash = "", enclose = false) => {
      const result = [];
      queue = [].concat(queue);
      stash = [].concat(stash);
      if (!stash.length) return queue;
      if (!queue.length) {
        return enclose ? utils.flatten(stash).map((ele) => `{${ele}}`) : stash;
      }
      for (const item of queue) {
        if (Array.isArray(item)) {
          for (const value of item) {
            result.push(append(value, stash, enclose));
          }
        } else {
          for (let ele of stash) {
            if (enclose === true && typeof ele === "string") ele = `{${ele}}`;
            result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
          }
        }
      }
      return utils.flatten(result);
    };
    var expand = (ast, options2 = {}) => {
      const rangeLimit = options2.rangeLimit === void 0 ? 1e3 : options2.rangeLimit;
      const walk = (node, parent = {}) => {
        node.queue = [];
        let p = parent;
        let q = parent.queue;
        while (p.type !== "brace" && p.type !== "root" && p.parent) {
          p = p.parent;
          q = p.queue;
        }
        if (node.invalid || node.dollar) {
          q.push(append(q.pop(), stringify(node, options2)));
          return;
        }
        if (node.type === "brace" && node.invalid !== true && node.nodes.length === 2) {
          q.push(append(q.pop(), ["{}"]));
          return;
        }
        if (node.nodes && node.ranges > 0) {
          const args = utils.reduce(node.nodes);
          if (utils.exceedsLimit(...args, options2.step, rangeLimit)) {
            throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
          }
          let range = fill(...args, options2);
          if (range.length === 0) {
            range = stringify(node, options2);
          }
          q.push(append(q.pop(), range));
          node.nodes = [];
          return;
        }
        const enclose = utils.encloseBrace(node);
        let queue = node.queue;
        let block = node;
        while (block.type !== "brace" && block.type !== "root" && block.parent) {
          block = block.parent;
          queue = block.queue;
        }
        for (let i = 0; i < node.nodes.length; i++) {
          const child = node.nodes[i];
          if (child.type === "comma" && node.type === "brace") {
            if (i === 1) queue.push("");
            queue.push("");
            continue;
          }
          if (child.type === "close") {
            q.push(append(q.pop(), queue, enclose));
            continue;
          }
          if (child.value && child.type !== "open") {
            queue.push(append(queue.pop(), child.value));
            continue;
          }
          if (child.nodes) {
            walk(child, node);
          }
        }
        return queue;
      };
      return utils.flatten(walk(ast));
    };
    module2.exports = expand;
  }
});

// node_modules/braces/lib/constants.js
var require_constants = __commonJS({
  "node_modules/braces/lib/constants.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      MAX_LENGTH: 1e4,
      // Digits
      CHAR_0: "0",
      /* 0 */
      CHAR_9: "9",
      /* 9 */
      // Alphabet chars.
      CHAR_UPPERCASE_A: "A",
      /* A */
      CHAR_LOWERCASE_A: "a",
      /* a */
      CHAR_UPPERCASE_Z: "Z",
      /* Z */
      CHAR_LOWERCASE_Z: "z",
      /* z */
      CHAR_LEFT_PARENTHESES: "(",
      /* ( */
      CHAR_RIGHT_PARENTHESES: ")",
      /* ) */
      CHAR_ASTERISK: "*",
      /* * */
      // Non-alphabetic chars.
      CHAR_AMPERSAND: "&",
      /* & */
      CHAR_AT: "@",
      /* @ */
      CHAR_BACKSLASH: "\\",
      /* \ */
      CHAR_BACKTICK: "`",
      /* ` */
      CHAR_CARRIAGE_RETURN: "\r",
      /* \r */
      CHAR_CIRCUMFLEX_ACCENT: "^",
      /* ^ */
      CHAR_COLON: ":",
      /* : */
      CHAR_COMMA: ",",
      /* , */
      CHAR_DOLLAR: "$",
      /* . */
      CHAR_DOT: ".",
      /* . */
      CHAR_DOUBLE_QUOTE: '"',
      /* " */
      CHAR_EQUAL: "=",
      /* = */
      CHAR_EXCLAMATION_MARK: "!",
      /* ! */
      CHAR_FORM_FEED: "\f",
      /* \f */
      CHAR_FORWARD_SLASH: "/",
      /* / */
      CHAR_HASH: "#",
      /* # */
      CHAR_HYPHEN_MINUS: "-",
      /* - */
      CHAR_LEFT_ANGLE_BRACKET: "<",
      /* < */
      CHAR_LEFT_CURLY_BRACE: "{",
      /* { */
      CHAR_LEFT_SQUARE_BRACKET: "[",
      /* [ */
      CHAR_LINE_FEED: "\n",
      /* \n */
      CHAR_NO_BREAK_SPACE: "\xA0",
      /* \u00A0 */
      CHAR_PERCENT: "%",
      /* % */
      CHAR_PLUS: "+",
      /* + */
      CHAR_QUESTION_MARK: "?",
      /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: ">",
      /* > */
      CHAR_RIGHT_CURLY_BRACE: "}",
      /* } */
      CHAR_RIGHT_SQUARE_BRACKET: "]",
      /* ] */
      CHAR_SEMICOLON: ";",
      /* ; */
      CHAR_SINGLE_QUOTE: "'",
      /* ' */
      CHAR_SPACE: " ",
      /*   */
      CHAR_TAB: "	",
      /* \t */
      CHAR_UNDERSCORE: "_",
      /* _ */
      CHAR_VERTICAL_LINE: "|",
      /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\uFEFF"
      /* \uFEFF */
    };
  }
});

// node_modules/braces/lib/parse.js
var require_parse = __commonJS({
  "node_modules/braces/lib/parse.js"(exports2, module2) {
    "use strict";
    var stringify = require_stringify();
    var {
      MAX_LENGTH,
      CHAR_BACKSLASH,
      /* \ */
      CHAR_BACKTICK,
      /* ` */
      CHAR_COMMA,
      /* , */
      CHAR_DOT,
      /* . */
      CHAR_LEFT_PARENTHESES,
      /* ( */
      CHAR_RIGHT_PARENTHESES,
      /* ) */
      CHAR_LEFT_CURLY_BRACE,
      /* { */
      CHAR_RIGHT_CURLY_BRACE,
      /* } */
      CHAR_LEFT_SQUARE_BRACKET,
      /* [ */
      CHAR_RIGHT_SQUARE_BRACKET,
      /* ] */
      CHAR_DOUBLE_QUOTE,
      /* " */
      CHAR_SINGLE_QUOTE,
      /* ' */
      CHAR_NO_BREAK_SPACE,
      CHAR_ZERO_WIDTH_NOBREAK_SPACE
    } = require_constants();
    var parse2 = (input, options2 = {}) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected a string");
      }
      const opts = options2 || {};
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      if (input.length > max) {
        throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
      }
      const ast = { type: "root", input, nodes: [] };
      const stack = [ast];
      let block = ast;
      let prev = ast;
      let brackets = 0;
      const length = input.length;
      let index = 0;
      let depth = 0;
      let value;
      const advance = () => input[index++];
      const push = (node) => {
        if (node.type === "text" && prev.type === "dot") {
          prev.type = "text";
        }
        if (prev && prev.type === "text" && node.type === "text") {
          prev.value += node.value;
          return;
        }
        block.nodes.push(node);
        node.parent = block;
        node.prev = prev;
        prev = node;
        return node;
      };
      push({ type: "bos" });
      while (index < length) {
        block = stack[stack.length - 1];
        value = advance();
        if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
          continue;
        }
        if (value === CHAR_BACKSLASH) {
          push({ type: "text", value: (options2.keepEscaping ? value : "") + advance() });
          continue;
        }
        if (value === CHAR_RIGHT_SQUARE_BRACKET) {
          push({ type: "text", value: "\\" + value });
          continue;
        }
        if (value === CHAR_LEFT_SQUARE_BRACKET) {
          brackets++;
          let next;
          while (index < length && (next = advance())) {
            value += next;
            if (next === CHAR_LEFT_SQUARE_BRACKET) {
              brackets++;
              continue;
            }
            if (next === CHAR_BACKSLASH) {
              value += advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              brackets--;
              if (brackets === 0) {
                break;
              }
            }
          }
          push({ type: "text", value });
          continue;
        }
        if (value === CHAR_LEFT_PARENTHESES) {
          block = push({ type: "paren", nodes: [] });
          stack.push(block);
          push({ type: "text", value });
          continue;
        }
        if (value === CHAR_RIGHT_PARENTHESES) {
          if (block.type !== "paren") {
            push({ type: "text", value });
            continue;
          }
          block = stack.pop();
          push({ type: "text", value });
          block = stack[stack.length - 1];
          continue;
        }
        if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
          const open = value;
          let next;
          if (options2.keepQuotes !== true) {
            value = "";
          }
          while (index < length && (next = advance())) {
            if (next === CHAR_BACKSLASH) {
              value += next + advance();
              continue;
            }
            if (next === open) {
              if (options2.keepQuotes === true) value += next;
              break;
            }
            value += next;
          }
          push({ type: "text", value });
          continue;
        }
        if (value === CHAR_LEFT_CURLY_BRACE) {
          depth++;
          const dollar = prev.value && prev.value.slice(-1) === "$" || block.dollar === true;
          const brace = {
            type: "brace",
            open: true,
            close: false,
            dollar,
            depth,
            commas: 0,
            ranges: 0,
            nodes: []
          };
          block = push(brace);
          stack.push(block);
          push({ type: "open", value });
          continue;
        }
        if (value === CHAR_RIGHT_CURLY_BRACE) {
          if (block.type !== "brace") {
            push({ type: "text", value });
            continue;
          }
          const type = "close";
          block = stack.pop();
          block.close = true;
          push({ type, value });
          depth--;
          block = stack[stack.length - 1];
          continue;
        }
        if (value === CHAR_COMMA && depth > 0) {
          if (block.ranges > 0) {
            block.ranges = 0;
            const open = block.nodes.shift();
            block.nodes = [open, { type: "text", value: stringify(block) }];
          }
          push({ type: "comma", value });
          block.commas++;
          continue;
        }
        if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
          const siblings = block.nodes;
          if (depth === 0 || siblings.length === 0) {
            push({ type: "text", value });
            continue;
          }
          if (prev.type === "dot") {
            block.range = [];
            prev.value += value;
            prev.type = "range";
            if (block.nodes.length !== 3 && block.nodes.length !== 5) {
              block.invalid = true;
              block.ranges = 0;
              prev.type = "text";
              continue;
            }
            block.ranges++;
            block.args = [];
            continue;
          }
          if (prev.type === "range") {
            siblings.pop();
            const before = siblings[siblings.length - 1];
            before.value += prev.value + value;
            prev = before;
            block.ranges--;
            continue;
          }
          push({ type: "dot", value });
          continue;
        }
        push({ type: "text", value });
      }
      do {
        block = stack.pop();
        if (block.type !== "root") {
          block.nodes.forEach((node) => {
            if (!node.nodes) {
              if (node.type === "open") node.isOpen = true;
              if (node.type === "close") node.isClose = true;
              if (!node.nodes) node.type = "text";
              node.invalid = true;
            }
          });
          const parent = stack[stack.length - 1];
          const index2 = parent.nodes.indexOf(block);
          parent.nodes.splice(index2, 1, ...block.nodes);
        }
      } while (stack.length > 0);
      push({ type: "eos" });
      return ast;
    };
    module2.exports = parse2;
  }
});

// node_modules/braces/index.js
var require_braces = __commonJS({
  "node_modules/braces/index.js"(exports2, module2) {
    "use strict";
    var stringify = require_stringify();
    var compile = require_compile();
    var expand = require_expand();
    var parse2 = require_parse();
    var braces = (input, options2 = {}) => {
      let output = [];
      if (Array.isArray(input)) {
        for (const pattern of input) {
          const result = braces.create(pattern, options2);
          if (Array.isArray(result)) {
            output.push(...result);
          } else {
            output.push(result);
          }
        }
      } else {
        output = [].concat(braces.create(input, options2));
      }
      if (options2 && options2.expand === true && options2.nodupes === true) {
        output = [...new Set(output)];
      }
      return output;
    };
    braces.parse = (input, options2 = {}) => parse2(input, options2);
    braces.stringify = (input, options2 = {}) => {
      if (typeof input === "string") {
        return stringify(braces.parse(input, options2), options2);
      }
      return stringify(input, options2);
    };
    braces.compile = (input, options2 = {}) => {
      if (typeof input === "string") {
        input = braces.parse(input, options2);
      }
      return compile(input, options2);
    };
    braces.expand = (input, options2 = {}) => {
      if (typeof input === "string") {
        input = braces.parse(input, options2);
      }
      let result = expand(input, options2);
      if (options2.noempty === true) {
        result = result.filter(Boolean);
      }
      if (options2.nodupes === true) {
        result = [...new Set(result)];
      }
      return result;
    };
    braces.create = (input, options2 = {}) => {
      if (input === "" || input.length < 3) {
        return [input];
      }
      return options2.expand !== true ? braces.compile(input, options2) : braces.expand(input, options2);
    };
    module2.exports = braces;
  }
});

// node_modules/micromatch/node_modules/picomatch/lib/constants.js
var require_constants2 = __commonJS({
  "node_modules/micromatch/node_modules/picomatch/lib/constants.js"(exports2, module2) {
    "use strict";
    var path14 = require("path");
    var WIN_SLASH = "\\\\/";
    var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
    var DOT_LITERAL = "\\.";
    var PLUS_LITERAL = "\\+";
    var QMARK_LITERAL = "\\?";
    var SLASH_LITERAL = "\\/";
    var ONE_CHAR = "(?=.)";
    var QMARK = "[^/]";
    var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
    var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
    var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
    var NO_DOT = `(?!${DOT_LITERAL})`;
    var NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
    var NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
    var NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
    var QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
    var STAR = `${QMARK}*?`;
    var POSIX_CHARS = {
      DOT_LITERAL,
      PLUS_LITERAL,
      QMARK_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      QMARK,
      END_ANCHOR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR
    };
    var WINDOWS_CHARS = {
      ...POSIX_CHARS,
      SLASH_LITERAL: `[${WIN_SLASH}]`,
      QMARK: WIN_NO_SLASH,
      STAR: `${WIN_NO_SLASH}*?`,
      DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
      NO_DOT: `(?!${DOT_LITERAL})`,
      NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
      NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
      START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
      END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
    };
    var POSIX_REGEX_SOURCE = {
      alnum: "a-zA-Z0-9",
      alpha: "a-zA-Z",
      ascii: "\\x00-\\x7F",
      blank: " \\t",
      cntrl: "\\x00-\\x1F\\x7F",
      digit: "0-9",
      graph: "\\x21-\\x7E",
      lower: "a-z",
      print: "\\x20-\\x7E ",
      punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
      space: " \\t\\r\\n\\v\\f",
      upper: "A-Z",
      word: "A-Za-z0-9_",
      xdigit: "A-Fa-f0-9"
    };
    module2.exports = {
      MAX_LENGTH: 1024 * 64,
      POSIX_REGEX_SOURCE,
      // regular expressions
      REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
      REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
      REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
      REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
      REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
      REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
      // Replace globs with equivalent patterns to reduce parsing time.
      REPLACEMENTS: {
        "***": "*",
        "**/**": "**",
        "**/**/**": "**"
      },
      // Digits
      CHAR_0: 48,
      /* 0 */
      CHAR_9: 57,
      /* 9 */
      // Alphabet chars.
      CHAR_UPPERCASE_A: 65,
      /* A */
      CHAR_LOWERCASE_A: 97,
      /* a */
      CHAR_UPPERCASE_Z: 90,
      /* Z */
      CHAR_LOWERCASE_Z: 122,
      /* z */
      CHAR_LEFT_PARENTHESES: 40,
      /* ( */
      CHAR_RIGHT_PARENTHESES: 41,
      /* ) */
      CHAR_ASTERISK: 42,
      /* * */
      // Non-alphabetic chars.
      CHAR_AMPERSAND: 38,
      /* & */
      CHAR_AT: 64,
      /* @ */
      CHAR_BACKWARD_SLASH: 92,
      /* \ */
      CHAR_CARRIAGE_RETURN: 13,
      /* \r */
      CHAR_CIRCUMFLEX_ACCENT: 94,
      /* ^ */
      CHAR_COLON: 58,
      /* : */
      CHAR_COMMA: 44,
      /* , */
      CHAR_DOT: 46,
      /* . */
      CHAR_DOUBLE_QUOTE: 34,
      /* " */
      CHAR_EQUAL: 61,
      /* = */
      CHAR_EXCLAMATION_MARK: 33,
      /* ! */
      CHAR_FORM_FEED: 12,
      /* \f */
      CHAR_FORWARD_SLASH: 47,
      /* / */
      CHAR_GRAVE_ACCENT: 96,
      /* ` */
      CHAR_HASH: 35,
      /* # */
      CHAR_HYPHEN_MINUS: 45,
      /* - */
      CHAR_LEFT_ANGLE_BRACKET: 60,
      /* < */
      CHAR_LEFT_CURLY_BRACE: 123,
      /* { */
      CHAR_LEFT_SQUARE_BRACKET: 91,
      /* [ */
      CHAR_LINE_FEED: 10,
      /* \n */
      CHAR_NO_BREAK_SPACE: 160,
      /* \u00A0 */
      CHAR_PERCENT: 37,
      /* % */
      CHAR_PLUS: 43,
      /* + */
      CHAR_QUESTION_MARK: 63,
      /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: 62,
      /* > */
      CHAR_RIGHT_CURLY_BRACE: 125,
      /* } */
      CHAR_RIGHT_SQUARE_BRACKET: 93,
      /* ] */
      CHAR_SEMICOLON: 59,
      /* ; */
      CHAR_SINGLE_QUOTE: 39,
      /* ' */
      CHAR_SPACE: 32,
      /*   */
      CHAR_TAB: 9,
      /* \t */
      CHAR_UNDERSCORE: 95,
      /* _ */
      CHAR_VERTICAL_LINE: 124,
      /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
      /* \uFEFF */
      SEP: path14.sep,
      /**
       * Create EXTGLOB_CHARS
       */
      extglobChars(chars) {
        return {
          "!": { type: "negate", open: "(?:(?!(?:", close: `))${chars.STAR})` },
          "?": { type: "qmark", open: "(?:", close: ")?" },
          "+": { type: "plus", open: "(?:", close: ")+" },
          "*": { type: "star", open: "(?:", close: ")*" },
          "@": { type: "at", open: "(?:", close: ")" }
        };
      },
      /**
       * Create GLOB_CHARS
       */
      globChars(win32) {
        return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
      }
    };
  }
});

// node_modules/micromatch/node_modules/picomatch/lib/utils.js
var require_utils2 = __commonJS({
  "node_modules/micromatch/node_modules/picomatch/lib/utils.js"(exports2) {
    "use strict";
    var path14 = require("path");
    var win32 = process.platform === "win32";
    var {
      REGEX_BACKSLASH,
      REGEX_REMOVE_BACKSLASH,
      REGEX_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_GLOBAL
    } = require_constants2();
    exports2.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    exports2.hasRegexChars = (str2) => REGEX_SPECIAL_CHARS.test(str2);
    exports2.isRegexChar = (str2) => str2.length === 1 && exports2.hasRegexChars(str2);
    exports2.escapeRegex = (str2) => str2.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
    exports2.toPosixSlashes = (str2) => str2.replace(REGEX_BACKSLASH, "/");
    exports2.removeBackslashes = (str2) => {
      return str2.replace(REGEX_REMOVE_BACKSLASH, (match) => {
        return match === "\\" ? "" : match;
      });
    };
    exports2.supportsLookbehinds = () => {
      const segs = process.version.slice(1).split(".").map(Number);
      if (segs.length === 3 && segs[0] >= 9 || segs[0] === 8 && segs[1] >= 10) {
        return true;
      }
      return false;
    };
    exports2.isWindows = (options2) => {
      if (options2 && typeof options2.windows === "boolean") {
        return options2.windows;
      }
      return win32 === true || path14.sep === "\\";
    };
    exports2.escapeLast = (input, char, lastIdx) => {
      const idx = input.lastIndexOf(char, lastIdx);
      if (idx === -1) return input;
      if (input[idx - 1] === "\\") return exports2.escapeLast(input, char, idx - 1);
      return `${input.slice(0, idx)}\\${input.slice(idx)}`;
    };
    exports2.removePrefix = (input, state = {}) => {
      let output = input;
      if (output.startsWith("./")) {
        output = output.slice(2);
        state.prefix = "./";
      }
      return output;
    };
    exports2.wrapOutput = (input, state = {}, options2 = {}) => {
      const prepend = options2.contains ? "" : "^";
      const append = options2.contains ? "" : "$";
      let output = `${prepend}(?:${input})${append}`;
      if (state.negated === true) {
        output = `(?:^(?!${output}).*$)`;
      }
      return output;
    };
  }
});

// node_modules/micromatch/node_modules/picomatch/lib/scan.js
var require_scan = __commonJS({
  "node_modules/micromatch/node_modules/picomatch/lib/scan.js"(exports2, module2) {
    "use strict";
    var utils = require_utils2();
    var {
      CHAR_ASTERISK,
      /* * */
      CHAR_AT,
      /* @ */
      CHAR_BACKWARD_SLASH,
      /* \ */
      CHAR_COMMA,
      /* , */
      CHAR_DOT,
      /* . */
      CHAR_EXCLAMATION_MARK,
      /* ! */
      CHAR_FORWARD_SLASH,
      /* / */
      CHAR_LEFT_CURLY_BRACE,
      /* { */
      CHAR_LEFT_PARENTHESES,
      /* ( */
      CHAR_LEFT_SQUARE_BRACKET,
      /* [ */
      CHAR_PLUS,
      /* + */
      CHAR_QUESTION_MARK,
      /* ? */
      CHAR_RIGHT_CURLY_BRACE,
      /* } */
      CHAR_RIGHT_PARENTHESES,
      /* ) */
      CHAR_RIGHT_SQUARE_BRACKET
      /* ] */
    } = require_constants2();
    var isPathSeparator = (code) => {
      return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
    };
    var depth = (token) => {
      if (token.isPrefix !== true) {
        token.depth = token.isGlobstar ? Infinity : 1;
      }
    };
    var scan = (input, options2) => {
      const opts = options2 || {};
      const length = input.length - 1;
      const scanToEnd = opts.parts === true || opts.scanToEnd === true;
      const slashes = [];
      const tokens = [];
      const parts = [];
      let str2 = input;
      let index = -1;
      let start = 0;
      let lastIndex = 0;
      let isBrace = false;
      let isBracket = false;
      let isGlob = false;
      let isExtglob = false;
      let isGlobstar = false;
      let braceEscaped = false;
      let backslashes = false;
      let negated = false;
      let negatedExtglob = false;
      let finished = false;
      let braces = 0;
      let prev;
      let code;
      let token = { value: "", depth: 0, isGlob: false };
      const eos = () => index >= length;
      const peek = () => str2.charCodeAt(index + 1);
      const advance = () => {
        prev = code;
        return str2.charCodeAt(++index);
      };
      while (index < length) {
        code = advance();
        let next;
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          code = advance();
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braceEscaped = true;
          }
          continue;
        }
        if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (code === CHAR_LEFT_CURLY_BRACE) {
              braces++;
              continue;
            }
            if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (braceEscaped !== true && code === CHAR_COMMA) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (code === CHAR_RIGHT_CURLY_BRACE) {
              braces--;
              if (braces === 0) {
                braceEscaped = false;
                isBrace = token.isBrace = true;
                finished = true;
                break;
              }
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_FORWARD_SLASH) {
          slashes.push(index);
          tokens.push(token);
          token = { value: "", depth: 0, isGlob: false };
          if (finished === true) continue;
          if (prev === CHAR_DOT && index === start + 1) {
            start += 2;
            continue;
          }
          lastIndex = index + 1;
          continue;
        }
        if (opts.noext !== true) {
          const isExtglobChar = code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK;
          if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
            isGlob = token.isGlob = true;
            isExtglob = token.isExtglob = true;
            finished = true;
            if (code === CHAR_EXCLAMATION_MARK && index === start) {
              negatedExtglob = true;
            }
            if (scanToEnd === true) {
              while (eos() !== true && (code = advance())) {
                if (code === CHAR_BACKWARD_SLASH) {
                  backslashes = token.backslashes = true;
                  code = advance();
                  continue;
                }
                if (code === CHAR_RIGHT_PARENTHESES) {
                  isGlob = token.isGlob = true;
                  finished = true;
                  break;
                }
              }
              continue;
            }
            break;
          }
        }
        if (code === CHAR_ASTERISK) {
          if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_QUESTION_MARK) {
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_LEFT_SQUARE_BRACKET) {
          while (eos() !== true && (next = advance())) {
            if (next === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              isBracket = token.isBracket = true;
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
          negated = token.negated = true;
          start++;
          continue;
        }
        if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;
          if (scanToEnd === true) {
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_LEFT_PARENTHESES) {
                backslashes = token.backslashes = true;
                code = advance();
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES) {
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }
        if (isGlob === true) {
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
      if (opts.noext === true) {
        isExtglob = false;
        isGlob = false;
      }
      let base = str2;
      let prefix = "";
      let glob = "";
      if (start > 0) {
        prefix = str2.slice(0, start);
        str2 = str2.slice(start);
        lastIndex -= start;
      }
      if (base && isGlob === true && lastIndex > 0) {
        base = str2.slice(0, lastIndex);
        glob = str2.slice(lastIndex);
      } else if (isGlob === true) {
        base = "";
        glob = str2;
      } else {
        base = str2;
      }
      if (base && base !== "" && base !== "/" && base !== str2) {
        if (isPathSeparator(base.charCodeAt(base.length - 1))) {
          base = base.slice(0, -1);
        }
      }
      if (opts.unescape === true) {
        if (glob) glob = utils.removeBackslashes(glob);
        if (base && backslashes === true) {
          base = utils.removeBackslashes(base);
        }
      }
      const state = {
        prefix,
        input,
        start,
        base,
        glob,
        isBrace,
        isBracket,
        isGlob,
        isExtglob,
        isGlobstar,
        negated,
        negatedExtglob
      };
      if (opts.tokens === true) {
        state.maxDepth = 0;
        if (!isPathSeparator(code)) {
          tokens.push(token);
        }
        state.tokens = tokens;
      }
      if (opts.parts === true || opts.tokens === true) {
        let prevIndex;
        for (let idx = 0; idx < slashes.length; idx++) {
          const n = prevIndex ? prevIndex + 1 : start;
          const i = slashes[idx];
          const value = input.slice(n, i);
          if (opts.tokens) {
            if (idx === 0 && start !== 0) {
              tokens[idx].isPrefix = true;
              tokens[idx].value = prefix;
            } else {
              tokens[idx].value = value;
            }
            depth(tokens[idx]);
            state.maxDepth += tokens[idx].depth;
          }
          if (idx !== 0 || value !== "") {
            parts.push(value);
          }
          prevIndex = i;
        }
        if (prevIndex && prevIndex + 1 < input.length) {
          const value = input.slice(prevIndex + 1);
          parts.push(value);
          if (opts.tokens) {
            tokens[tokens.length - 1].value = value;
            depth(tokens[tokens.length - 1]);
            state.maxDepth += tokens[tokens.length - 1].depth;
          }
        }
        state.slashes = slashes;
        state.parts = parts;
      }
      return state;
    };
    module2.exports = scan;
  }
});

// node_modules/micromatch/node_modules/picomatch/lib/parse.js
var require_parse2 = __commonJS({
  "node_modules/micromatch/node_modules/picomatch/lib/parse.js"(exports2, module2) {
    "use strict";
    var constants = require_constants2();
    var utils = require_utils2();
    var {
      MAX_LENGTH,
      POSIX_REGEX_SOURCE,
      REGEX_NON_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_BACKREF,
      REPLACEMENTS
    } = constants;
    var expandRange = (args, options2) => {
      if (typeof options2.expandRange === "function") {
        return options2.expandRange(...args, options2);
      }
      args.sort();
      const value = `[${args.join("-")}]`;
      try {
        new RegExp(value);
      } catch (ex) {
        return args.map((v) => utils.escapeRegex(v)).join("..");
      }
      return value;
    };
    var syntaxError = (type, char) => {
      return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
    };
    var parse2 = (input, options2) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected a string");
      }
      input = REPLACEMENTS[input] || input;
      const opts = { ...options2 };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      let len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      const bos = { type: "bos", value: "", output: opts.prepend || "" };
      const tokens = [bos];
      const capture = opts.capture ? "" : "?:";
      const win32 = utils.isWindows(options2);
      const PLATFORM_CHARS = constants.globChars(win32);
      const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
      const {
        DOT_LITERAL,
        PLUS_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOT_SLASH,
        NO_DOTS_SLASH,
        QMARK,
        QMARK_NO_DOT,
        STAR,
        START_ANCHOR
      } = PLATFORM_CHARS;
      const globstar = (opts2) => {
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const nodot = opts.dot ? "" : NO_DOT;
      const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
      let star = opts.bash === true ? globstar(opts) : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      if (typeof opts.noext === "boolean") {
        opts.noextglob = opts.noext;
      }
      const state = {
        input,
        index: -1,
        start: 0,
        dot: opts.dot === true,
        consumed: "",
        output: "",
        prefix: "",
        backtrack: false,
        negated: false,
        brackets: 0,
        braces: 0,
        parens: 0,
        quotes: 0,
        globstar: false,
        tokens
      };
      input = utils.removePrefix(input, state);
      len = input.length;
      const extglobs = [];
      const braces = [];
      const stack = [];
      let prev = bos;
      let value;
      const eos = () => state.index === len - 1;
      const peek = state.peek = (n = 1) => input[state.index + n];
      const advance = state.advance = () => input[++state.index] || "";
      const remaining = () => input.slice(state.index + 1);
      const consume = (value2 = "", num = 0) => {
        state.consumed += value2;
        state.index += num;
      };
      const append = (token) => {
        state.output += token.output != null ? token.output : token.value;
        consume(token.value);
      };
      const negate = () => {
        let count = 1;
        while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
          advance();
          state.start++;
          count++;
        }
        if (count % 2 === 0) {
          return false;
        }
        state.negated = true;
        state.start++;
        return true;
      };
      const increment = (type) => {
        state[type]++;
        stack.push(type);
      };
      const decrement = (type) => {
        state[type]--;
        stack.pop();
      };
      const push = (tok) => {
        if (prev.type === "globstar") {
          const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
          const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
          if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
            state.output = state.output.slice(0, -prev.output.length);
            prev.type = "star";
            prev.value = "*";
            prev.output = star;
            state.output += prev.output;
          }
        }
        if (extglobs.length && tok.type !== "paren") {
          extglobs[extglobs.length - 1].inner += tok.value;
        }
        if (tok.value || tok.output) append(tok);
        if (prev && prev.type === "text" && tok.type === "text") {
          prev.value += tok.value;
          prev.output = (prev.output || "") + tok.value;
          return;
        }
        tok.prev = prev;
        tokens.push(tok);
        prev = tok;
      };
      const extglobOpen = (type, value2) => {
        const token = { ...EXTGLOB_CHARS[value2], conditions: 1, inner: "" };
        token.prev = prev;
        token.parens = state.parens;
        token.output = state.output;
        const output = (opts.capture ? "(" : "") + token.open;
        increment("parens");
        push({ type, value: value2, output: state.output ? "" : ONE_CHAR });
        push({ type: "paren", extglob: true, value: advance(), output });
        extglobs.push(token);
      };
      const extglobClose = (token) => {
        let output = token.close + (opts.capture ? ")" : "");
        let rest;
        if (token.type === "negate") {
          let extglobStar = star;
          if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
            extglobStar = globstar(opts);
          }
          if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
            output = token.close = `)$))${extglobStar}`;
          }
          if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
            const expression = parse2(rest, { ...options2, fastpaths: false }).output;
            output = token.close = `)${expression})${extglobStar})`;
          }
          if (token.prev.type === "bos") {
            state.negatedExtglob = true;
          }
        }
        push({ type: "paren", extglob: true, value, output });
        decrement("parens");
      };
      if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
        let backslashes = false;
        let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
          if (first === "\\") {
            backslashes = true;
            return m;
          }
          if (first === "?") {
            if (esc) {
              return esc + first + (rest ? QMARK.repeat(rest.length) : "");
            }
            if (index === 0) {
              return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
            }
            return QMARK.repeat(chars.length);
          }
          if (first === ".") {
            return DOT_LITERAL.repeat(chars.length);
          }
          if (first === "*") {
            if (esc) {
              return esc + first + (rest ? star : "");
            }
            return star;
          }
          return esc ? m : `\\${m}`;
        });
        if (backslashes === true) {
          if (opts.unescape === true) {
            output = output.replace(/\\/g, "");
          } else {
            output = output.replace(/\\+/g, (m) => {
              return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
            });
          }
        }
        if (output === input && opts.contains === true) {
          state.output = input;
          return state;
        }
        state.output = utils.wrapOutput(output, state, options2);
        return state;
      }
      while (!eos()) {
        value = advance();
        if (value === "\0") {
          continue;
        }
        if (value === "\\") {
          const next = peek();
          if (next === "/" && opts.bash !== true) {
            continue;
          }
          if (next === "." || next === ";") {
            continue;
          }
          if (!next) {
            value += "\\";
            push({ type: "text", value });
            continue;
          }
          const match = /^\\+/.exec(remaining());
          let slashes = 0;
          if (match && match[0].length > 2) {
            slashes = match[0].length;
            state.index += slashes;
            if (slashes % 2 !== 0) {
              value += "\\";
            }
          }
          if (opts.unescape === true) {
            value = advance();
          } else {
            value += advance();
          }
          if (state.brackets === 0) {
            push({ type: "text", value });
            continue;
          }
        }
        if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
          if (opts.posix !== false && value === ":") {
            const inner = prev.value.slice(1);
            if (inner.includes("[")) {
              prev.posix = true;
              if (inner.includes(":")) {
                const idx = prev.value.lastIndexOf("[");
                const pre = prev.value.slice(0, idx);
                const rest2 = prev.value.slice(idx + 2);
                const posix = POSIX_REGEX_SOURCE[rest2];
                if (posix) {
                  prev.value = pre + posix;
                  state.backtrack = true;
                  advance();
                  if (!bos.output && tokens.indexOf(prev) === 1) {
                    bos.output = ONE_CHAR;
                  }
                  continue;
                }
              }
            }
          }
          if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") {
            value = `\\${value}`;
          }
          if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
            value = `\\${value}`;
          }
          if (opts.posix === true && value === "!" && prev.value === "[") {
            value = "^";
          }
          prev.value += value;
          append({ value });
          continue;
        }
        if (state.quotes === 1 && value !== '"') {
          value = utils.escapeRegex(value);
          prev.value += value;
          append({ value });
          continue;
        }
        if (value === '"') {
          state.quotes = state.quotes === 1 ? 0 : 1;
          if (opts.keepQuotes === true) {
            push({ type: "text", value });
          }
          continue;
        }
        if (value === "(") {
          increment("parens");
          push({ type: "paren", value });
          continue;
        }
        if (value === ")") {
          if (state.parens === 0 && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("opening", "("));
          }
          const extglob = extglobs[extglobs.length - 1];
          if (extglob && state.parens === extglob.parens + 1) {
            extglobClose(extglobs.pop());
            continue;
          }
          push({ type: "paren", value, output: state.parens ? ")" : "\\)" });
          decrement("parens");
          continue;
        }
        if (value === "[") {
          if (opts.nobracket === true || !remaining().includes("]")) {
            if (opts.nobracket !== true && opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("closing", "]"));
            }
            value = `\\${value}`;
          } else {
            increment("brackets");
          }
          push({ type: "bracket", value });
          continue;
        }
        if (value === "]") {
          if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          if (state.brackets === 0) {
            if (opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("opening", "["));
            }
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          decrement("brackets");
          const prevValue = prev.value.slice(1);
          if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
            value = `/${value}`;
          }
          prev.value += value;
          append({ value });
          if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
            continue;
          }
          const escaped = utils.escapeRegex(prev.value);
          state.output = state.output.slice(0, -prev.value.length);
          if (opts.literalBrackets === true) {
            state.output += escaped;
            prev.value = escaped;
            continue;
          }
          prev.value = `(${capture}${escaped}|${prev.value})`;
          state.output += prev.value;
          continue;
        }
        if (value === "{" && opts.nobrace !== true) {
          increment("braces");
          const open = {
            type: "brace",
            value,
            output: "(",
            outputIndex: state.output.length,
            tokensIndex: state.tokens.length
          };
          braces.push(open);
          push(open);
          continue;
        }
        if (value === "}") {
          const brace = braces[braces.length - 1];
          if (opts.nobrace === true || !brace) {
            push({ type: "text", value, output: value });
            continue;
          }
          let output = ")";
          if (brace.dots === true) {
            const arr = tokens.slice();
            const range = [];
            for (let i = arr.length - 1; i >= 0; i--) {
              tokens.pop();
              if (arr[i].type === "brace") {
                break;
              }
              if (arr[i].type !== "dots") {
                range.unshift(arr[i].value);
              }
            }
            output = expandRange(range, opts);
            state.backtrack = true;
          }
          if (brace.comma !== true && brace.dots !== true) {
            const out = state.output.slice(0, brace.outputIndex);
            const toks = state.tokens.slice(brace.tokensIndex);
            brace.value = brace.output = "\\{";
            value = output = "\\}";
            state.output = out;
            for (const t of toks) {
              state.output += t.output || t.value;
            }
          }
          push({ type: "brace", value, output });
          decrement("braces");
          braces.pop();
          continue;
        }
        if (value === "|") {
          if (extglobs.length > 0) {
            extglobs[extglobs.length - 1].conditions++;
          }
          push({ type: "text", value });
          continue;
        }
        if (value === ",") {
          let output = value;
          const brace = braces[braces.length - 1];
          if (brace && stack[stack.length - 1] === "braces") {
            brace.comma = true;
            output = "|";
          }
          push({ type: "comma", value, output });
          continue;
        }
        if (value === "/") {
          if (prev.type === "dot" && state.index === state.start + 1) {
            state.start = state.index + 1;
            state.consumed = "";
            state.output = "";
            tokens.pop();
            prev = bos;
            continue;
          }
          push({ type: "slash", value, output: SLASH_LITERAL });
          continue;
        }
        if (value === ".") {
          if (state.braces > 0 && prev.type === "dot") {
            if (prev.value === ".") prev.output = DOT_LITERAL;
            const brace = braces[braces.length - 1];
            prev.type = "dots";
            prev.output += value;
            prev.value += value;
            brace.dots = true;
            continue;
          }
          if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
            push({ type: "text", value, output: DOT_LITERAL });
            continue;
          }
          push({ type: "dot", value, output: DOT_LITERAL });
          continue;
        }
        if (value === "?") {
          const isGroup = prev && prev.value === "(";
          if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("qmark", value);
            continue;
          }
          if (prev && prev.type === "paren") {
            const next = peek();
            let output = value;
            if (next === "<" && !utils.supportsLookbehinds()) {
              throw new Error("Node.js v10 or higher is required for regex lookbehinds");
            }
            if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) {
              output = `\\${value}`;
            }
            push({ type: "text", value, output });
            continue;
          }
          if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
            push({ type: "qmark", value, output: QMARK_NO_DOT });
            continue;
          }
          push({ type: "qmark", value, output: QMARK });
          continue;
        }
        if (value === "!") {
          if (opts.noextglob !== true && peek() === "(") {
            if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
              extglobOpen("negate", value);
              continue;
            }
          }
          if (opts.nonegate !== true && state.index === 0) {
            negate();
            continue;
          }
        }
        if (value === "+") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("plus", value);
            continue;
          }
          if (prev && prev.value === "(" || opts.regex === false) {
            push({ type: "plus", value, output: PLUS_LITERAL });
            continue;
          }
          if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
            push({ type: "plus", value });
            continue;
          }
          push({ type: "plus", value: PLUS_LITERAL });
          continue;
        }
        if (value === "@") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            push({ type: "at", extglob: true, value, output: "" });
            continue;
          }
          push({ type: "text", value });
          continue;
        }
        if (value !== "*") {
          if (value === "$" || value === "^") {
            value = `\\${value}`;
          }
          const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
          if (match) {
            value += match[0];
            state.index += match[0].length;
          }
          push({ type: "text", value });
          continue;
        }
        if (prev && (prev.type === "globstar" || prev.star === true)) {
          prev.type = "star";
          prev.star = true;
          prev.value += value;
          prev.output = star;
          state.backtrack = true;
          state.globstar = true;
          consume(value);
          continue;
        }
        let rest = remaining();
        if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
          extglobOpen("star", value);
          continue;
        }
        if (prev.type === "star") {
          if (opts.noglobstar === true) {
            consume(value);
            continue;
          }
          const prior = prev.prev;
          const before = prior.prev;
          const isStart = prior.type === "slash" || prior.type === "bos";
          const afterStar = before && (before.type === "star" || before.type === "globstar");
          if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
            push({ type: "star", value, output: "" });
            continue;
          }
          const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
          const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
          if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
            push({ type: "star", value, output: "" });
            continue;
          }
          while (rest.slice(0, 3) === "/**") {
            const after = input[state.index + 4];
            if (after && after !== "/") {
              break;
            }
            rest = rest.slice(3);
            consume("/**", 3);
          }
          if (prior.type === "bos" && eos()) {
            prev.type = "globstar";
            prev.value += value;
            prev.output = globstar(opts);
            state.output = prev.output;
            state.globstar = true;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
            prev.value += value;
            state.globstar = true;
            state.output += prior.output + prev.output;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
            const end = rest[1] !== void 0 ? "|$" : "";
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
            prev.value += value;
            state.output += prior.output + prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          if (prior.type === "bos" && rest[0] === "/") {
            prev.type = "globstar";
            prev.value += value;
            prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
            state.output = prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = "globstar";
          prev.output = globstar(opts);
          prev.value += value;
          state.output += prev.output;
          state.globstar = true;
          consume(value);
          continue;
        }
        const token = { type: "star", value, output: star };
        if (opts.bash === true) {
          token.output = ".*?";
          if (prev.type === "bos" || prev.type === "slash") {
            token.output = nodot + token.output;
          }
          push(token);
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
          token.output = value;
          push(token);
          continue;
        }
        if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
          if (prev.type === "dot") {
            state.output += NO_DOT_SLASH;
            prev.output += NO_DOT_SLASH;
          } else if (opts.dot === true) {
            state.output += NO_DOTS_SLASH;
            prev.output += NO_DOTS_SLASH;
          } else {
            state.output += nodot;
            prev.output += nodot;
          }
          if (peek() !== "*") {
            state.output += ONE_CHAR;
            prev.output += ONE_CHAR;
          }
        }
        push(token);
      }
      while (state.brackets > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
        state.output = utils.escapeLast(state.output, "[");
        decrement("brackets");
      }
      while (state.parens > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
        state.output = utils.escapeLast(state.output, "(");
        decrement("parens");
      }
      while (state.braces > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
        state.output = utils.escapeLast(state.output, "{");
        decrement("braces");
      }
      if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
        push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?` });
      }
      if (state.backtrack === true) {
        state.output = "";
        for (const token of state.tokens) {
          state.output += token.output != null ? token.output : token.value;
          if (token.suffix) {
            state.output += token.suffix;
          }
        }
      }
      return state;
    };
    parse2.fastpaths = (input, options2) => {
      const opts = { ...options2 };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      const len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      input = REPLACEMENTS[input] || input;
      const win32 = utils.isWindows(options2);
      const {
        DOT_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOTS,
        NO_DOTS_SLASH,
        STAR,
        START_ANCHOR
      } = constants.globChars(win32);
      const nodot = opts.dot ? NO_DOTS : NO_DOT;
      const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
      const capture = opts.capture ? "" : "?:";
      const state = { negated: false, prefix: "" };
      let star = opts.bash === true ? ".*?" : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      const globstar = (opts2) => {
        if (opts2.noglobstar === true) return star;
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const create = (str2) => {
        switch (str2) {
          case "*":
            return `${nodot}${ONE_CHAR}${star}`;
          case ".*":
            return `${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*.*":
            return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*/*":
            return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
          case "**":
            return nodot + globstar(opts);
          case "**/*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
          case "**/*.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "**/.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
          default: {
            const match = /^(.*?)\.(\w+)$/.exec(str2);
            if (!match) return;
            const source2 = create(match[1]);
            if (!source2) return;
            return source2 + DOT_LITERAL + match[2];
          }
        }
      };
      const output = utils.removePrefix(input, state);
      let source = create(output);
      if (source && opts.strictSlashes !== true) {
        source += `${SLASH_LITERAL}?`;
      }
      return source;
    };
    module2.exports = parse2;
  }
});

// node_modules/micromatch/node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS({
  "node_modules/micromatch/node_modules/picomatch/lib/picomatch.js"(exports2, module2) {
    "use strict";
    var path14 = require("path");
    var scan = require_scan();
    var parse2 = require_parse2();
    var utils = require_utils2();
    var constants = require_constants2();
    var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
    var picomatch = (glob, options2, returnState = false) => {
      if (Array.isArray(glob)) {
        const fns = glob.map((input) => picomatch(input, options2, returnState));
        const arrayMatcher = (str2) => {
          for (const isMatch of fns) {
            const state2 = isMatch(str2);
            if (state2) return state2;
          }
          return false;
        };
        return arrayMatcher;
      }
      const isState = isObject(glob) && glob.tokens && glob.input;
      if (glob === "" || typeof glob !== "string" && !isState) {
        throw new TypeError("Expected pattern to be a non-empty string");
      }
      const opts = options2 || {};
      const posix = utils.isWindows(options2);
      const regex = isState ? picomatch.compileRe(glob, options2) : picomatch.makeRe(glob, options2, false, true);
      const state = regex.state;
      delete regex.state;
      let isIgnored = () => false;
      if (opts.ignore) {
        const ignoreOpts = { ...options2, ignore: null, onMatch: null, onResult: null };
        isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
      }
      const matcher = (input, returnObject = false) => {
        const { isMatch, match, output } = picomatch.test(input, regex, options2, { glob, posix });
        const result = { glob, state, regex, posix, input, output, match, isMatch };
        if (typeof opts.onResult === "function") {
          opts.onResult(result);
        }
        if (isMatch === false) {
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (isIgnored(input)) {
          if (typeof opts.onIgnore === "function") {
            opts.onIgnore(result);
          }
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (typeof opts.onMatch === "function") {
          opts.onMatch(result);
        }
        return returnObject ? result : true;
      };
      if (returnState) {
        matcher.state = state;
      }
      return matcher;
    };
    picomatch.test = (input, regex, options2, { glob, posix } = {}) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected input to be a string");
      }
      if (input === "") {
        return { isMatch: false, output: "" };
      }
      const opts = options2 || {};
      const format = opts.format || (posix ? utils.toPosixSlashes : null);
      let match = input === glob;
      let output = match && format ? format(input) : input;
      if (match === false) {
        output = format ? format(input) : input;
        match = output === glob;
      }
      if (match === false || opts.capture === true) {
        if (opts.matchBase === true || opts.basename === true) {
          match = picomatch.matchBase(input, regex, options2, posix);
        } else {
          match = regex.exec(output);
        }
      }
      return { isMatch: Boolean(match), match, output };
    };
    picomatch.matchBase = (input, glob, options2, posix = utils.isWindows(options2)) => {
      const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options2);
      return regex.test(path14.basename(input));
    };
    picomatch.isMatch = (str2, patterns, options2) => picomatch(patterns, options2)(str2);
    picomatch.parse = (pattern, options2) => {
      if (Array.isArray(pattern)) return pattern.map((p) => picomatch.parse(p, options2));
      return parse2(pattern, { ...options2, fastpaths: false });
    };
    picomatch.scan = (input, options2) => scan(input, options2);
    picomatch.compileRe = (state, options2, returnOutput = false, returnState = false) => {
      if (returnOutput === true) {
        return state.output;
      }
      const opts = options2 || {};
      const prepend = opts.contains ? "" : "^";
      const append = opts.contains ? "" : "$";
      let source = `${prepend}(?:${state.output})${append}`;
      if (state && state.negated === true) {
        source = `^(?!${source}).*$`;
      }
      const regex = picomatch.toRegex(source, options2);
      if (returnState === true) {
        regex.state = state;
      }
      return regex;
    };
    picomatch.makeRe = (input, options2 = {}, returnOutput = false, returnState = false) => {
      if (!input || typeof input !== "string") {
        throw new TypeError("Expected a non-empty string");
      }
      let parsed = { negated: false, fastpaths: true };
      if (options2.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
        parsed.output = parse2.fastpaths(input, options2);
      }
      if (!parsed.output) {
        parsed = parse2(input, options2);
      }
      return picomatch.compileRe(parsed, options2, returnOutput, returnState);
    };
    picomatch.toRegex = (source, options2) => {
      try {
        const opts = options2 || {};
        return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
      } catch (err) {
        if (options2 && options2.debug === true) throw err;
        return /$^/;
      }
    };
    picomatch.constants = constants;
    module2.exports = picomatch;
  }
});

// node_modules/micromatch/node_modules/picomatch/index.js
var require_picomatch2 = __commonJS({
  "node_modules/micromatch/node_modules/picomatch/index.js"(exports2, module2) {
    "use strict";
    module2.exports = require_picomatch();
  }
});

// node_modules/micromatch/index.js
var require_micromatch = __commonJS({
  "node_modules/micromatch/index.js"(exports2, module2) {
    "use strict";
    var util2 = require("util");
    var braces = require_braces();
    var picomatch = require_picomatch2();
    var utils = require_utils2();
    var isEmptyString = (v) => v === "" || v === "./";
    var hasBraces = (v) => {
      const index = v.indexOf("{");
      return index > -1 && v.indexOf("}", index) > -1;
    };
    var micromatch = (list, patterns, options2) => {
      patterns = [].concat(patterns);
      list = [].concat(list);
      let omit = /* @__PURE__ */ new Set();
      let keep = /* @__PURE__ */ new Set();
      let items = /* @__PURE__ */ new Set();
      let negatives = 0;
      let onResult = (state) => {
        items.add(state.output);
        if (options2 && options2.onResult) {
          options2.onResult(state);
        }
      };
      for (let i = 0; i < patterns.length; i++) {
        let isMatch = picomatch(String(patterns[i]), { ...options2, onResult }, true);
        let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
        if (negated) negatives++;
        for (let item of list) {
          let matched = isMatch(item, true);
          let match = negated ? !matched.isMatch : matched.isMatch;
          if (!match) continue;
          if (negated) {
            omit.add(matched.output);
          } else {
            omit.delete(matched.output);
            keep.add(matched.output);
          }
        }
      }
      let result = negatives === patterns.length ? [...items] : [...keep];
      let matches = result.filter((item) => !omit.has(item));
      if (options2 && matches.length === 0) {
        if (options2.failglob === true) {
          throw new Error(`No matches found for "${patterns.join(", ")}"`);
        }
        if (options2.nonull === true || options2.nullglob === true) {
          return options2.unescape ? patterns.map((p) => p.replace(/\\/g, "")) : patterns;
        }
      }
      return matches;
    };
    micromatch.match = micromatch;
    micromatch.matcher = (pattern, options2) => picomatch(pattern, options2);
    micromatch.isMatch = (str2, patterns, options2) => picomatch(patterns, options2)(str2);
    micromatch.any = micromatch.isMatch;
    micromatch.not = (list, patterns, options2 = {}) => {
      patterns = [].concat(patterns).map(String);
      let result = /* @__PURE__ */ new Set();
      let items = [];
      let onResult = (state) => {
        if (options2.onResult) options2.onResult(state);
        items.push(state.output);
      };
      let matches = new Set(micromatch(list, patterns, { ...options2, onResult }));
      for (let item of items) {
        if (!matches.has(item)) {
          result.add(item);
        }
      }
      return [...result];
    };
    micromatch.contains = (str2, pattern, options2) => {
      if (typeof str2 !== "string") {
        throw new TypeError(`Expected a string: "${util2.inspect(str2)}"`);
      }
      if (Array.isArray(pattern)) {
        return pattern.some((p) => micromatch.contains(str2, p, options2));
      }
      if (typeof pattern === "string") {
        if (isEmptyString(str2) || isEmptyString(pattern)) {
          return false;
        }
        if (str2.includes(pattern) || str2.startsWith("./") && str2.slice(2).includes(pattern)) {
          return true;
        }
      }
      return micromatch.isMatch(str2, pattern, { ...options2, contains: true });
    };
    micromatch.matchKeys = (obj, patterns, options2) => {
      if (!utils.isObject(obj)) {
        throw new TypeError("Expected the first argument to be an object");
      }
      let keys = micromatch(Object.keys(obj), patterns, options2);
      let res = {};
      for (let key of keys) res[key] = obj[key];
      return res;
    };
    micromatch.some = (list, patterns, options2) => {
      let items = [].concat(list);
      for (let pattern of [].concat(patterns)) {
        let isMatch = picomatch(String(pattern), options2);
        if (items.some((item) => isMatch(item))) {
          return true;
        }
      }
      return false;
    };
    micromatch.every = (list, patterns, options2) => {
      let items = [].concat(list);
      for (let pattern of [].concat(patterns)) {
        let isMatch = picomatch(String(pattern), options2);
        if (!items.every((item) => isMatch(item))) {
          return false;
        }
      }
      return true;
    };
    micromatch.all = (str2, patterns, options2) => {
      if (typeof str2 !== "string") {
        throw new TypeError(`Expected a string: "${util2.inspect(str2)}"`);
      }
      return [].concat(patterns).every((p) => picomatch(p, options2)(str2));
    };
    micromatch.capture = (glob, input, options2) => {
      let posix = utils.isWindows(options2);
      let regex = picomatch.makeRe(String(glob), { ...options2, capture: true });
      let match = regex.exec(posix ? utils.toPosixSlashes(input) : input);
      if (match) {
        return match.slice(1).map((v) => v === void 0 ? "" : v);
      }
    };
    micromatch.makeRe = (...args) => picomatch.makeRe(...args);
    micromatch.scan = (...args) => picomatch.scan(...args);
    micromatch.parse = (patterns, options2) => {
      let res = [];
      for (let pattern of [].concat(patterns || [])) {
        for (let str2 of braces(String(pattern), options2)) {
          res.push(picomatch.parse(str2, options2));
        }
      }
      return res;
    };
    micromatch.braces = (pattern, options2) => {
      if (typeof pattern !== "string") throw new TypeError("Expected a string");
      if (options2 && options2.nobrace === true || !hasBraces(pattern)) {
        return [pattern];
      }
      return braces(pattern, options2);
    };
    micromatch.braceExpand = (pattern, options2) => {
      if (typeof pattern !== "string") throw new TypeError("Expected a string");
      return micromatch.braces(pattern, { ...options2, expand: true });
    };
    micromatch.hasBraces = hasBraces;
    module2.exports = micromatch;
  }
});

// node_modules/fast-glob/out/utils/pattern.js
var require_pattern = __commonJS({
  "node_modules/fast-glob/out/utils/pattern.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isAbsolute = exports2.partitionAbsoluteAndRelative = exports2.removeDuplicateSlashes = exports2.matchAny = exports2.convertPatternsToRe = exports2.makeRe = exports2.getPatternParts = exports2.expandBraceExpansion = exports2.expandPatternsWithBraceExpansion = exports2.isAffectDepthOfReadingPattern = exports2.endsWithSlashGlobStar = exports2.hasGlobStar = exports2.getBaseDirectory = exports2.isPatternRelatedToParentDirectory = exports2.getPatternsOutsideCurrentDirectory = exports2.getPatternsInsideCurrentDirectory = exports2.getPositivePatterns = exports2.getNegativePatterns = exports2.isPositivePattern = exports2.isNegativePattern = exports2.convertToNegativePattern = exports2.convertToPositivePattern = exports2.isDynamicPattern = exports2.isStaticPattern = void 0;
    var path14 = require("path");
    var globParent = require_glob_parent();
    var micromatch = require_micromatch();
    var GLOBSTAR = "**";
    var ESCAPE_SYMBOL = "\\";
    var COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
    var REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[[^[]*]/;
    var REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/;
    var GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\([^(]*\)/;
    var BRACE_EXPANSION_SEPARATORS_RE = /,|\.\./;
    var DOUBLE_SLASH_RE = /(?!^)\/{2,}/g;
    function isStaticPattern(pattern, options2 = {}) {
      return !isDynamicPattern(pattern, options2);
    }
    exports2.isStaticPattern = isStaticPattern;
    function isDynamicPattern(pattern, options2 = {}) {
      if (pattern === "") {
        return false;
      }
      if (options2.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) {
        return true;
      }
      if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) {
        return true;
      }
      if (options2.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) {
        return true;
      }
      if (options2.braceExpansion !== false && hasBraceExpansion(pattern)) {
        return true;
      }
      return false;
    }
    exports2.isDynamicPattern = isDynamicPattern;
    function hasBraceExpansion(pattern) {
      const openingBraceIndex = pattern.indexOf("{");
      if (openingBraceIndex === -1) {
        return false;
      }
      const closingBraceIndex = pattern.indexOf("}", openingBraceIndex + 1);
      if (closingBraceIndex === -1) {
        return false;
      }
      const braceContent = pattern.slice(openingBraceIndex, closingBraceIndex);
      return BRACE_EXPANSION_SEPARATORS_RE.test(braceContent);
    }
    function convertToPositivePattern(pattern) {
      return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
    }
    exports2.convertToPositivePattern = convertToPositivePattern;
    function convertToNegativePattern(pattern) {
      return "!" + pattern;
    }
    exports2.convertToNegativePattern = convertToNegativePattern;
    function isNegativePattern(pattern) {
      return pattern.startsWith("!") && pattern[1] !== "(";
    }
    exports2.isNegativePattern = isNegativePattern;
    function isPositivePattern(pattern) {
      return !isNegativePattern(pattern);
    }
    exports2.isPositivePattern = isPositivePattern;
    function getNegativePatterns(patterns) {
      return patterns.filter(isNegativePattern);
    }
    exports2.getNegativePatterns = getNegativePatterns;
    function getPositivePatterns(patterns) {
      return patterns.filter(isPositivePattern);
    }
    exports2.getPositivePatterns = getPositivePatterns;
    function getPatternsInsideCurrentDirectory(patterns) {
      return patterns.filter((pattern) => !isPatternRelatedToParentDirectory(pattern));
    }
    exports2.getPatternsInsideCurrentDirectory = getPatternsInsideCurrentDirectory;
    function getPatternsOutsideCurrentDirectory(patterns) {
      return patterns.filter(isPatternRelatedToParentDirectory);
    }
    exports2.getPatternsOutsideCurrentDirectory = getPatternsOutsideCurrentDirectory;
    function isPatternRelatedToParentDirectory(pattern) {
      return pattern.startsWith("..") || pattern.startsWith("./..");
    }
    exports2.isPatternRelatedToParentDirectory = isPatternRelatedToParentDirectory;
    function getBaseDirectory(pattern) {
      return globParent(pattern, { flipBackslashes: false });
    }
    exports2.getBaseDirectory = getBaseDirectory;
    function hasGlobStar(pattern) {
      return pattern.includes(GLOBSTAR);
    }
    exports2.hasGlobStar = hasGlobStar;
    function endsWithSlashGlobStar(pattern) {
      return pattern.endsWith("/" + GLOBSTAR);
    }
    exports2.endsWithSlashGlobStar = endsWithSlashGlobStar;
    function isAffectDepthOfReadingPattern(pattern) {
      const basename7 = path14.basename(pattern);
      return endsWithSlashGlobStar(pattern) || isStaticPattern(basename7);
    }
    exports2.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
    function expandPatternsWithBraceExpansion(patterns) {
      return patterns.reduce((collection, pattern) => {
        return collection.concat(expandBraceExpansion(pattern));
      }, []);
    }
    exports2.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
    function expandBraceExpansion(pattern) {
      const patterns = micromatch.braces(pattern, { expand: true, nodupes: true, keepEscaping: true });
      patterns.sort((a, b) => a.length - b.length);
      return patterns.filter((pattern2) => pattern2 !== "");
    }
    exports2.expandBraceExpansion = expandBraceExpansion;
    function getPatternParts(pattern, options2) {
      let { parts } = micromatch.scan(pattern, Object.assign(Object.assign({}, options2), { parts: true }));
      if (parts.length === 0) {
        parts = [pattern];
      }
      if (parts[0].startsWith("/")) {
        parts[0] = parts[0].slice(1);
        parts.unshift("");
      }
      return parts;
    }
    exports2.getPatternParts = getPatternParts;
    function makeRe(pattern, options2) {
      return micromatch.makeRe(pattern, options2);
    }
    exports2.makeRe = makeRe;
    function convertPatternsToRe(patterns, options2) {
      return patterns.map((pattern) => makeRe(pattern, options2));
    }
    exports2.convertPatternsToRe = convertPatternsToRe;
    function matchAny(entry, patternsRe) {
      return patternsRe.some((patternRe) => patternRe.test(entry));
    }
    exports2.matchAny = matchAny;
    function removeDuplicateSlashes(pattern) {
      return pattern.replace(DOUBLE_SLASH_RE, "/");
    }
    exports2.removeDuplicateSlashes = removeDuplicateSlashes;
    function partitionAbsoluteAndRelative(patterns) {
      const absolute = [];
      const relative5 = [];
      for (const pattern of patterns) {
        if (isAbsolute2(pattern)) {
          absolute.push(pattern);
        } else {
          relative5.push(pattern);
        }
      }
      return [absolute, relative5];
    }
    exports2.partitionAbsoluteAndRelative = partitionAbsoluteAndRelative;
    function isAbsolute2(pattern) {
      return path14.isAbsolute(pattern);
    }
    exports2.isAbsolute = isAbsolute2;
  }
});

// node_modules/merge2/index.js
var require_merge2 = __commonJS({
  "node_modules/merge2/index.js"(exports2, module2) {
    "use strict";
    var Stream = require("stream");
    var PassThrough = Stream.PassThrough;
    var slice = Array.prototype.slice;
    module2.exports = merge2;
    function merge2() {
      const streamsQueue = [];
      const args = slice.call(arguments);
      let merging = false;
      let options2 = args[args.length - 1];
      if (options2 && !Array.isArray(options2) && options2.pipe == null) {
        args.pop();
      } else {
        options2 = {};
      }
      const doEnd = options2.end !== false;
      const doPipeError = options2.pipeError === true;
      if (options2.objectMode == null) {
        options2.objectMode = true;
      }
      if (options2.highWaterMark == null) {
        options2.highWaterMark = 64 * 1024;
      }
      const mergedStream = PassThrough(options2);
      function addStream() {
        for (let i = 0, len = arguments.length; i < len; i++) {
          streamsQueue.push(pauseStreams(arguments[i], options2));
        }
        mergeStream();
        return this;
      }
      function mergeStream() {
        if (merging) {
          return;
        }
        merging = true;
        let streams = streamsQueue.shift();
        if (!streams) {
          process.nextTick(endStream);
          return;
        }
        if (!Array.isArray(streams)) {
          streams = [streams];
        }
        let pipesCount = streams.length + 1;
        function next() {
          if (--pipesCount > 0) {
            return;
          }
          merging = false;
          mergeStream();
        }
        function pipe(stream) {
          function onend() {
            stream.removeListener("merge2UnpipeEnd", onend);
            stream.removeListener("end", onend);
            if (doPipeError) {
              stream.removeListener("error", onerror);
            }
            next();
          }
          function onerror(err) {
            mergedStream.emit("error", err);
          }
          if (stream._readableState.endEmitted) {
            return next();
          }
          stream.on("merge2UnpipeEnd", onend);
          stream.on("end", onend);
          if (doPipeError) {
            stream.on("error", onerror);
          }
          stream.pipe(mergedStream, { end: false });
          stream.resume();
        }
        for (let i = 0; i < streams.length; i++) {
          pipe(streams[i]);
        }
        next();
      }
      function endStream() {
        merging = false;
        mergedStream.emit("queueDrain");
        if (doEnd) {
          mergedStream.end();
        }
      }
      mergedStream.setMaxListeners(0);
      mergedStream.add = addStream;
      mergedStream.on("unpipe", function(stream) {
        stream.emit("merge2UnpipeEnd");
      });
      if (args.length) {
        addStream.apply(null, args);
      }
      return mergedStream;
    }
    function pauseStreams(streams, options2) {
      if (!Array.isArray(streams)) {
        if (!streams._readableState && streams.pipe) {
          streams = streams.pipe(PassThrough(options2));
        }
        if (!streams._readableState || !streams.pause || !streams.pipe) {
          throw new Error("Only readable stream can be merged.");
        }
        streams.pause();
      } else {
        for (let i = 0, len = streams.length; i < len; i++) {
          streams[i] = pauseStreams(streams[i], options2);
        }
      }
      return streams;
    }
  }
});

// node_modules/fast-glob/out/utils/stream.js
var require_stream = __commonJS({
  "node_modules/fast-glob/out/utils/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.merge = void 0;
    var merge2 = require_merge2();
    function merge(streams) {
      const mergedStream = merge2(streams);
      streams.forEach((stream) => {
        stream.once("error", (error) => mergedStream.emit("error", error));
      });
      mergedStream.once("close", () => propagateCloseEventToSources(streams));
      mergedStream.once("end", () => propagateCloseEventToSources(streams));
      return mergedStream;
    }
    exports2.merge = merge;
    function propagateCloseEventToSources(streams) {
      streams.forEach((stream) => stream.emit("close"));
    }
  }
});

// node_modules/fast-glob/out/utils/string.js
var require_string = __commonJS({
  "node_modules/fast-glob/out/utils/string.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isEmpty = exports2.isString = void 0;
    function isString(input) {
      return typeof input === "string";
    }
    exports2.isString = isString;
    function isEmpty(input) {
      return input === "";
    }
    exports2.isEmpty = isEmpty;
  }
});

// node_modules/fast-glob/out/utils/index.js
var require_utils3 = __commonJS({
  "node_modules/fast-glob/out/utils/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.string = exports2.stream = exports2.pattern = exports2.path = exports2.fs = exports2.errno = exports2.array = void 0;
    var array = require_array();
    exports2.array = array;
    var errno = require_errno();
    exports2.errno = errno;
    var fs11 = require_fs();
    exports2.fs = fs11;
    var path14 = require_path();
    exports2.path = path14;
    var pattern = require_pattern();
    exports2.pattern = pattern;
    var stream = require_stream();
    exports2.stream = stream;
    var string = require_string();
    exports2.string = string;
  }
});

// node_modules/fast-glob/out/managers/tasks.js
var require_tasks = __commonJS({
  "node_modules/fast-glob/out/managers/tasks.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.convertPatternGroupToTask = exports2.convertPatternGroupsToTasks = exports2.groupPatternsByBaseDirectory = exports2.getNegativePatternsAsPositive = exports2.getPositivePatterns = exports2.convertPatternsToTasks = exports2.generate = void 0;
    var utils = require_utils3();
    function generate(input, settings) {
      const patterns = processPatterns(input, settings);
      const ignore = processPatterns(settings.ignore, settings);
      const positivePatterns = getPositivePatterns(patterns);
      const negativePatterns = getNegativePatternsAsPositive(patterns, ignore);
      const staticPatterns = positivePatterns.filter((pattern) => utils.pattern.isStaticPattern(pattern, settings));
      const dynamicPatterns = positivePatterns.filter((pattern) => utils.pattern.isDynamicPattern(pattern, settings));
      const staticTasks = convertPatternsToTasks(
        staticPatterns,
        negativePatterns,
        /* dynamic */
        false
      );
      const dynamicTasks = convertPatternsToTasks(
        dynamicPatterns,
        negativePatterns,
        /* dynamic */
        true
      );
      return staticTasks.concat(dynamicTasks);
    }
    exports2.generate = generate;
    function processPatterns(input, settings) {
      let patterns = input;
      if (settings.braceExpansion) {
        patterns = utils.pattern.expandPatternsWithBraceExpansion(patterns);
      }
      if (settings.baseNameMatch) {
        patterns = patterns.map((pattern) => pattern.includes("/") ? pattern : `**/${pattern}`);
      }
      return patterns.map((pattern) => utils.pattern.removeDuplicateSlashes(pattern));
    }
    function convertPatternsToTasks(positive, negative, dynamic) {
      const tasks = [];
      const patternsOutsideCurrentDirectory = utils.pattern.getPatternsOutsideCurrentDirectory(positive);
      const patternsInsideCurrentDirectory = utils.pattern.getPatternsInsideCurrentDirectory(positive);
      const outsideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsOutsideCurrentDirectory);
      const insideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsInsideCurrentDirectory);
      tasks.push(...convertPatternGroupsToTasks(outsideCurrentDirectoryGroup, negative, dynamic));
      if ("." in insideCurrentDirectoryGroup) {
        tasks.push(convertPatternGroupToTask(".", patternsInsideCurrentDirectory, negative, dynamic));
      } else {
        tasks.push(...convertPatternGroupsToTasks(insideCurrentDirectoryGroup, negative, dynamic));
      }
      return tasks;
    }
    exports2.convertPatternsToTasks = convertPatternsToTasks;
    function getPositivePatterns(patterns) {
      return utils.pattern.getPositivePatterns(patterns);
    }
    exports2.getPositivePatterns = getPositivePatterns;
    function getNegativePatternsAsPositive(patterns, ignore) {
      const negative = utils.pattern.getNegativePatterns(patterns).concat(ignore);
      const positive = negative.map(utils.pattern.convertToPositivePattern);
      return positive;
    }
    exports2.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
    function groupPatternsByBaseDirectory(patterns) {
      const group = {};
      return patterns.reduce((collection, pattern) => {
        const base = utils.pattern.getBaseDirectory(pattern);
        if (base in collection) {
          collection[base].push(pattern);
        } else {
          collection[base] = [pattern];
        }
        return collection;
      }, group);
    }
    exports2.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
    function convertPatternGroupsToTasks(positive, negative, dynamic) {
      return Object.keys(positive).map((base) => {
        return convertPatternGroupToTask(base, positive[base], negative, dynamic);
      });
    }
    exports2.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
    function convertPatternGroupToTask(base, positive, negative, dynamic) {
      return {
        dynamic,
        positive,
        negative,
        base,
        patterns: [].concat(positive, negative.map(utils.pattern.convertToNegativePattern))
      };
    }
    exports2.convertPatternGroupToTask = convertPatternGroupToTask;
  }
});

// node_modules/@nodelib/fs.stat/out/providers/async.js
var require_async = __commonJS({
  "node_modules/@nodelib/fs.stat/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.read = void 0;
    function read(path14, settings, callback) {
      settings.fs.lstat(path14, (lstatError, lstat) => {
        if (lstatError !== null) {
          callFailureCallback(callback, lstatError);
          return;
        }
        if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
          callSuccessCallback(callback, lstat);
          return;
        }
        settings.fs.stat(path14, (statError, stat5) => {
          if (statError !== null) {
            if (settings.throwErrorOnBrokenSymbolicLink) {
              callFailureCallback(callback, statError);
              return;
            }
            callSuccessCallback(callback, lstat);
            return;
          }
          if (settings.markSymbolicLink) {
            stat5.isSymbolicLink = () => true;
          }
          callSuccessCallback(callback, stat5);
        });
      });
    }
    exports2.read = read;
    function callFailureCallback(callback, error) {
      callback(error);
    }
    function callSuccessCallback(callback, result) {
      callback(null, result);
    }
  }
});

// node_modules/@nodelib/fs.stat/out/providers/sync.js
var require_sync = __commonJS({
  "node_modules/@nodelib/fs.stat/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.read = void 0;
    function read(path14, settings) {
      const lstat = settings.fs.lstatSync(path14);
      if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
        return lstat;
      }
      try {
        const stat5 = settings.fs.statSync(path14);
        if (settings.markSymbolicLink) {
          stat5.isSymbolicLink = () => true;
        }
        return stat5;
      } catch (error) {
        if (!settings.throwErrorOnBrokenSymbolicLink) {
          return lstat;
        }
        throw error;
      }
    }
    exports2.read = read;
  }
});

// node_modules/@nodelib/fs.stat/out/adapters/fs.js
var require_fs2 = __commonJS({
  "node_modules/@nodelib/fs.stat/out/adapters/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createFileSystemAdapter = exports2.FILE_SYSTEM_ADAPTER = void 0;
    var fs11 = require("fs");
    exports2.FILE_SYSTEM_ADAPTER = {
      lstat: fs11.lstat,
      stat: fs11.stat,
      lstatSync: fs11.lstatSync,
      statSync: fs11.statSync
    };
    function createFileSystemAdapter(fsMethods) {
      if (fsMethods === void 0) {
        return exports2.FILE_SYSTEM_ADAPTER;
      }
      return Object.assign(Object.assign({}, exports2.FILE_SYSTEM_ADAPTER), fsMethods);
    }
    exports2.createFileSystemAdapter = createFileSystemAdapter;
  }
});

// node_modules/@nodelib/fs.stat/out/settings.js
var require_settings = __commonJS({
  "node_modules/@nodelib/fs.stat/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fs11 = require_fs2();
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
        this.fs = fs11.createFileSystemAdapter(this._options.fs);
        this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
      }
      _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
      }
    };
    exports2.default = Settings;
  }
});

// node_modules/@nodelib/fs.stat/out/index.js
var require_out = __commonJS({
  "node_modules/@nodelib/fs.stat/out/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.statSync = exports2.stat = exports2.Settings = void 0;
    var async = require_async();
    var sync = require_sync();
    var settings_1 = require_settings();
    exports2.Settings = settings_1.default;
    function stat5(path14, optionsOrSettingsOrCallback, callback) {
      if (typeof optionsOrSettingsOrCallback === "function") {
        async.read(path14, getSettings(), optionsOrSettingsOrCallback);
        return;
      }
      async.read(path14, getSettings(optionsOrSettingsOrCallback), callback);
    }
    exports2.stat = stat5;
    function statSync(path14, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      return sync.read(path14, settings);
    }
    exports2.statSync = statSync;
    function getSettings(settingsOrOptions = {}) {
      if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
      }
      return new settings_1.default(settingsOrOptions);
    }
  }
});

// node_modules/queue-microtask/index.js
var require_queue_microtask = __commonJS({
  "node_modules/queue-microtask/index.js"(exports2, module2) {
    var promise;
    module2.exports = typeof queueMicrotask === "function" ? queueMicrotask.bind(typeof window !== "undefined" ? window : global) : (cb) => (promise || (promise = Promise.resolve())).then(cb).catch((err) => setTimeout(() => {
      throw err;
    }, 0));
  }
});

// node_modules/run-parallel/index.js
var require_run_parallel = __commonJS({
  "node_modules/run-parallel/index.js"(exports2, module2) {
    module2.exports = runParallel;
    var queueMicrotask2 = require_queue_microtask();
    function runParallel(tasks, cb) {
      let results, pending, keys;
      let isSync = true;
      if (Array.isArray(tasks)) {
        results = [];
        pending = tasks.length;
      } else {
        keys = Object.keys(tasks);
        results = {};
        pending = keys.length;
      }
      function done(err) {
        function end() {
          if (cb) cb(err, results);
          cb = null;
        }
        if (isSync) queueMicrotask2(end);
        else end();
      }
      function each(i, err, result) {
        results[i] = result;
        if (--pending === 0 || err) {
          done(err);
        }
      }
      if (!pending) {
        done(null);
      } else if (keys) {
        keys.forEach(function(key) {
          tasks[key](function(err, result) {
            each(key, err, result);
          });
        });
      } else {
        tasks.forEach(function(task, i) {
          task(function(err, result) {
            each(i, err, result);
          });
        });
      }
      isSync = false;
    }
  }
});

// node_modules/@nodelib/fs.scandir/out/constants.js
var require_constants3 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.IS_SUPPORT_READDIR_WITH_FILE_TYPES = void 0;
    var NODE_PROCESS_VERSION_PARTS = process.versions.node.split(".");
    if (NODE_PROCESS_VERSION_PARTS[0] === void 0 || NODE_PROCESS_VERSION_PARTS[1] === void 0) {
      throw new Error(`Unexpected behavior. The 'process.versions.node' variable has invalid value: ${process.versions.node}`);
    }
    var MAJOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
    var MINOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
    var SUPPORTED_MAJOR_VERSION = 10;
    var SUPPORTED_MINOR_VERSION = 10;
    var IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
    var IS_MATCHED_BY_MAJOR_AND_MINOR = MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
    exports2.IS_SUPPORT_READDIR_WITH_FILE_TYPES = IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;
  }
});

// node_modules/@nodelib/fs.scandir/out/utils/fs.js
var require_fs3 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/utils/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createDirentFromStats = void 0;
    var DirentFromStats = class {
      constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
      }
    };
    function createDirentFromStats(name, stats) {
      return new DirentFromStats(name, stats);
    }
    exports2.createDirentFromStats = createDirentFromStats;
  }
});

// node_modules/@nodelib/fs.scandir/out/utils/index.js
var require_utils4 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/utils/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.fs = void 0;
    var fs11 = require_fs3();
    exports2.fs = fs11;
  }
});

// node_modules/@nodelib/fs.scandir/out/providers/common.js
var require_common = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/providers/common.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.joinPathSegments = void 0;
    function joinPathSegments(a, b, separator) {
      if (a.endsWith(separator)) {
        return a + b;
      }
      return a + separator + b;
    }
    exports2.joinPathSegments = joinPathSegments;
  }
});

// node_modules/@nodelib/fs.scandir/out/providers/async.js
var require_async2 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.readdir = exports2.readdirWithFileTypes = exports2.read = void 0;
    var fsStat = require_out();
    var rpl = require_run_parallel();
    var constants_1 = require_constants3();
    var utils = require_utils4();
    var common = require_common();
    function read(directory, settings, callback) {
      if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        readdirWithFileTypes(directory, settings, callback);
        return;
      }
      readdir3(directory, settings, callback);
    }
    exports2.read = read;
    function readdirWithFileTypes(directory, settings, callback) {
      settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
        if (readdirError !== null) {
          callFailureCallback(callback, readdirError);
          return;
        }
        const entries = dirents.map((dirent) => ({
          dirent,
          name: dirent.name,
          path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
        }));
        if (!settings.followSymbolicLinks) {
          callSuccessCallback(callback, entries);
          return;
        }
        const tasks = entries.map((entry) => makeRplTaskEntry(entry, settings));
        rpl(tasks, (rplError, rplEntries) => {
          if (rplError !== null) {
            callFailureCallback(callback, rplError);
            return;
          }
          callSuccessCallback(callback, rplEntries);
        });
      });
    }
    exports2.readdirWithFileTypes = readdirWithFileTypes;
    function makeRplTaskEntry(entry, settings) {
      return (done) => {
        if (!entry.dirent.isSymbolicLink()) {
          done(null, entry);
          return;
        }
        settings.fs.stat(entry.path, (statError, stats) => {
          if (statError !== null) {
            if (settings.throwErrorOnBrokenSymbolicLink) {
              done(statError);
              return;
            }
            done(null, entry);
            return;
          }
          entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
          done(null, entry);
        });
      };
    }
    function readdir3(directory, settings, callback) {
      settings.fs.readdir(directory, (readdirError, names) => {
        if (readdirError !== null) {
          callFailureCallback(callback, readdirError);
          return;
        }
        const tasks = names.map((name) => {
          const path14 = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
          return (done) => {
            fsStat.stat(path14, settings.fsStatSettings, (error, stats) => {
              if (error !== null) {
                done(error);
                return;
              }
              const entry = {
                name,
                path: path14,
                dirent: utils.fs.createDirentFromStats(name, stats)
              };
              if (settings.stats) {
                entry.stats = stats;
              }
              done(null, entry);
            });
          };
        });
        rpl(tasks, (rplError, entries) => {
          if (rplError !== null) {
            callFailureCallback(callback, rplError);
            return;
          }
          callSuccessCallback(callback, entries);
        });
      });
    }
    exports2.readdir = readdir3;
    function callFailureCallback(callback, error) {
      callback(error);
    }
    function callSuccessCallback(callback, result) {
      callback(null, result);
    }
  }
});

// node_modules/@nodelib/fs.scandir/out/providers/sync.js
var require_sync2 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.readdir = exports2.readdirWithFileTypes = exports2.read = void 0;
    var fsStat = require_out();
    var constants_1 = require_constants3();
    var utils = require_utils4();
    var common = require_common();
    function read(directory, settings) {
      if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(directory, settings);
      }
      return readdir3(directory, settings);
    }
    exports2.read = read;
    function readdirWithFileTypes(directory, settings) {
      const dirents = settings.fs.readdirSync(directory, { withFileTypes: true });
      return dirents.map((dirent) => {
        const entry = {
          dirent,
          name: dirent.name,
          path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
        };
        if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) {
          try {
            const stats = settings.fs.statSync(entry.path);
            entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
          } catch (error) {
            if (settings.throwErrorOnBrokenSymbolicLink) {
              throw error;
            }
          }
        }
        return entry;
      });
    }
    exports2.readdirWithFileTypes = readdirWithFileTypes;
    function readdir3(directory, settings) {
      const names = settings.fs.readdirSync(directory);
      return names.map((name) => {
        const entryPath = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
        const stats = fsStat.statSync(entryPath, settings.fsStatSettings);
        const entry = {
          name,
          path: entryPath,
          dirent: utils.fs.createDirentFromStats(name, stats)
        };
        if (settings.stats) {
          entry.stats = stats;
        }
        return entry;
      });
    }
    exports2.readdir = readdir3;
  }
});

// node_modules/@nodelib/fs.scandir/out/adapters/fs.js
var require_fs4 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/adapters/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createFileSystemAdapter = exports2.FILE_SYSTEM_ADAPTER = void 0;
    var fs11 = require("fs");
    exports2.FILE_SYSTEM_ADAPTER = {
      lstat: fs11.lstat,
      stat: fs11.stat,
      lstatSync: fs11.lstatSync,
      statSync: fs11.statSync,
      readdir: fs11.readdir,
      readdirSync: fs11.readdirSync
    };
    function createFileSystemAdapter(fsMethods) {
      if (fsMethods === void 0) {
        return exports2.FILE_SYSTEM_ADAPTER;
      }
      return Object.assign(Object.assign({}, exports2.FILE_SYSTEM_ADAPTER), fsMethods);
    }
    exports2.createFileSystemAdapter = createFileSystemAdapter;
  }
});

// node_modules/@nodelib/fs.scandir/out/settings.js
var require_settings2 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path14 = require("path");
    var fsStat = require_out();
    var fs11 = require_fs4();
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
        this.fs = fs11.createFileSystemAdapter(this._options.fs);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path14.sep);
        this.stats = this._getValue(this._options.stats, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
        this.fsStatSettings = new fsStat.Settings({
          followSymbolicLink: this.followSymbolicLinks,
          fs: this.fs,
          throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
        });
      }
      _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
      }
    };
    exports2.default = Settings;
  }
});

// node_modules/@nodelib/fs.scandir/out/index.js
var require_out2 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Settings = exports2.scandirSync = exports2.scandir = void 0;
    var async = require_async2();
    var sync = require_sync2();
    var settings_1 = require_settings2();
    exports2.Settings = settings_1.default;
    function scandir(path14, optionsOrSettingsOrCallback, callback) {
      if (typeof optionsOrSettingsOrCallback === "function") {
        async.read(path14, getSettings(), optionsOrSettingsOrCallback);
        return;
      }
      async.read(path14, getSettings(optionsOrSettingsOrCallback), callback);
    }
    exports2.scandir = scandir;
    function scandirSync(path14, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      return sync.read(path14, settings);
    }
    exports2.scandirSync = scandirSync;
    function getSettings(settingsOrOptions = {}) {
      if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
      }
      return new settings_1.default(settingsOrOptions);
    }
  }
});

// node_modules/reusify/reusify.js
var require_reusify = __commonJS({
  "node_modules/reusify/reusify.js"(exports2, module2) {
    "use strict";
    function reusify(Constructor) {
      var head = new Constructor();
      var tail = head;
      function get() {
        var current = head;
        if (current.next) {
          head = current.next;
        } else {
          head = new Constructor();
          tail = head;
        }
        current.next = null;
        return current;
      }
      function release(obj) {
        tail.next = obj;
        tail = obj;
      }
      return {
        get,
        release
      };
    }
    module2.exports = reusify;
  }
});

// node_modules/fastq/queue.js
var require_queue = __commonJS({
  "node_modules/fastq/queue.js"(exports2, module2) {
    "use strict";
    var reusify = require_reusify();
    function fastqueue(context, worker, _concurrency) {
      if (typeof context === "function") {
        _concurrency = worker;
        worker = context;
        context = null;
      }
      if (!(_concurrency >= 1)) {
        throw new Error("fastqueue concurrency must be equal to or greater than 1");
      }
      var cache = reusify(Task);
      var queueHead = null;
      var queueTail = null;
      var _running = 0;
      var errorHandler = null;
      var self = {
        push,
        drain: noop,
        saturated: noop,
        pause,
        paused: false,
        get concurrency() {
          return _concurrency;
        },
        set concurrency(value) {
          if (!(value >= 1)) {
            throw new Error("fastqueue concurrency must be equal to or greater than 1");
          }
          _concurrency = value;
          if (self.paused) return;
          for (; queueHead && _running < _concurrency; ) {
            _running++;
            release();
          }
        },
        running,
        resume,
        idle,
        length,
        getQueue,
        unshift,
        empty: noop,
        kill,
        killAndDrain,
        error,
        abort
      };
      return self;
      function running() {
        return _running;
      }
      function pause() {
        self.paused = true;
      }
      function length() {
        var current = queueHead;
        var counter = 0;
        while (current) {
          current = current.next;
          counter++;
        }
        return counter;
      }
      function getQueue() {
        var current = queueHead;
        var tasks = [];
        while (current) {
          tasks.push(current.value);
          current = current.next;
        }
        return tasks;
      }
      function resume() {
        if (!self.paused) return;
        self.paused = false;
        if (queueHead === null) {
          _running++;
          release();
          return;
        }
        for (; queueHead && _running < _concurrency; ) {
          _running++;
          release();
        }
      }
      function idle() {
        return _running === 0 && self.length() === 0;
      }
      function push(value, done) {
        var current = cache.get();
        current.context = context;
        current.release = release;
        current.value = value;
        current.callback = done || noop;
        current.errorHandler = errorHandler;
        if (_running >= _concurrency || self.paused) {
          if (queueTail) {
            queueTail.next = current;
            queueTail = current;
          } else {
            queueHead = current;
            queueTail = current;
            self.saturated();
          }
        } else {
          _running++;
          worker.call(context, current.value, current.worked);
        }
      }
      function unshift(value, done) {
        var current = cache.get();
        current.context = context;
        current.release = release;
        current.value = value;
        current.callback = done || noop;
        current.errorHandler = errorHandler;
        if (_running >= _concurrency || self.paused) {
          if (queueHead) {
            current.next = queueHead;
            queueHead = current;
          } else {
            queueHead = current;
            queueTail = current;
            self.saturated();
          }
        } else {
          _running++;
          worker.call(context, current.value, current.worked);
        }
      }
      function release(holder) {
        if (holder) {
          cache.release(holder);
        }
        var next = queueHead;
        if (next && _running <= _concurrency) {
          if (!self.paused) {
            if (queueTail === queueHead) {
              queueTail = null;
            }
            queueHead = next.next;
            next.next = null;
            worker.call(context, next.value, next.worked);
            if (queueTail === null) {
              self.empty();
            }
          } else {
            _running--;
          }
        } else if (--_running === 0) {
          self.drain();
        }
      }
      function kill() {
        queueHead = null;
        queueTail = null;
        self.drain = noop;
      }
      function killAndDrain() {
        queueHead = null;
        queueTail = null;
        self.drain();
        self.drain = noop;
      }
      function abort() {
        var current = queueHead;
        queueHead = null;
        queueTail = null;
        while (current) {
          var next = current.next;
          var callback = current.callback;
          var errorHandler2 = current.errorHandler;
          var val = current.value;
          var context2 = current.context;
          current.value = null;
          current.callback = noop;
          current.errorHandler = null;
          if (errorHandler2) {
            errorHandler2(new Error("abort"), val);
          }
          callback.call(context2, new Error("abort"));
          current.release(current);
          current = next;
        }
        self.drain = noop;
      }
      function error(handler) {
        errorHandler = handler;
      }
    }
    function noop() {
    }
    function Task() {
      this.value = null;
      this.callback = noop;
      this.next = null;
      this.release = noop;
      this.context = null;
      this.errorHandler = null;
      var self = this;
      this.worked = function worked(err, result) {
        var callback = self.callback;
        var errorHandler = self.errorHandler;
        var val = self.value;
        self.value = null;
        self.callback = noop;
        if (self.errorHandler) {
          errorHandler(err, val);
        }
        callback.call(self.context, err, result);
        self.release(self);
      };
    }
    function queueAsPromised(context, worker, _concurrency) {
      if (typeof context === "function") {
        _concurrency = worker;
        worker = context;
        context = null;
      }
      function asyncWrapper(arg, cb) {
        worker.call(this, arg).then(function(res) {
          cb(null, res);
        }, cb);
      }
      var queue = fastqueue(context, asyncWrapper, _concurrency);
      var pushCb = queue.push;
      var unshiftCb = queue.unshift;
      queue.push = push;
      queue.unshift = unshift;
      queue.drained = drained;
      return queue;
      function push(value) {
        var p = new Promise(function(resolve, reject) {
          pushCb(value, function(err, result) {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          });
        });
        p.catch(noop);
        return p;
      }
      function unshift(value) {
        var p = new Promise(function(resolve, reject) {
          unshiftCb(value, function(err, result) {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          });
        });
        p.catch(noop);
        return p;
      }
      function drained() {
        var p = new Promise(function(resolve) {
          process.nextTick(function() {
            if (queue.idle()) {
              resolve();
            } else {
              var previousDrain = queue.drain;
              queue.drain = function() {
                if (typeof previousDrain === "function") previousDrain();
                resolve();
                queue.drain = previousDrain;
              };
            }
          });
        });
        return p;
      }
    }
    module2.exports = fastqueue;
    module2.exports.promise = queueAsPromised;
  }
});

// node_modules/@nodelib/fs.walk/out/readers/common.js
var require_common2 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/readers/common.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.joinPathSegments = exports2.replacePathSegmentSeparator = exports2.isAppliedFilter = exports2.isFatalError = void 0;
    function isFatalError(settings, error) {
      if (settings.errorFilter === null) {
        return true;
      }
      return !settings.errorFilter(error);
    }
    exports2.isFatalError = isFatalError;
    function isAppliedFilter(filter, value) {
      return filter === null || filter(value);
    }
    exports2.isAppliedFilter = isAppliedFilter;
    function replacePathSegmentSeparator(filepath, separator) {
      return filepath.split(/[/\\]/).join(separator);
    }
    exports2.replacePathSegmentSeparator = replacePathSegmentSeparator;
    function joinPathSegments(a, b, separator) {
      if (a === "") {
        return b;
      }
      if (a.endsWith(separator)) {
        return a + b;
      }
      return a + separator + b;
    }
    exports2.joinPathSegments = joinPathSegments;
  }
});

// node_modules/@nodelib/fs.walk/out/readers/reader.js
var require_reader = __commonJS({
  "node_modules/@nodelib/fs.walk/out/readers/reader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var common = require_common2();
    var Reader = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
      }
    };
    exports2.default = Reader;
  }
});

// node_modules/@nodelib/fs.walk/out/readers/async.js
var require_async3 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/readers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var events_1 = require("events");
    var fsScandir = require_out2();
    var fastq = require_queue();
    var common = require_common2();
    var reader_1 = require_reader();
    var AsyncReader = class extends reader_1.default {
      constructor(_root, _settings) {
        super(_root, _settings);
        this._settings = _settings;
        this._scandir = fsScandir.scandir;
        this._emitter = new events_1.EventEmitter();
        this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
        this._isFatalError = false;
        this._isDestroyed = false;
        this._queue.drain = () => {
          if (!this._isFatalError) {
            this._emitter.emit("end");
          }
        };
      }
      read() {
        this._isFatalError = false;
        this._isDestroyed = false;
        setImmediate(() => {
          this._pushToQueue(this._root, this._settings.basePath);
        });
        return this._emitter;
      }
      get isDestroyed() {
        return this._isDestroyed;
      }
      destroy() {
        if (this._isDestroyed) {
          throw new Error("The reader is already destroyed");
        }
        this._isDestroyed = true;
        this._queue.killAndDrain();
      }
      onEntry(callback) {
        this._emitter.on("entry", callback);
      }
      onError(callback) {
        this._emitter.once("error", callback);
      }
      onEnd(callback) {
        this._emitter.once("end", callback);
      }
      _pushToQueue(directory, base) {
        const queueItem = { directory, base };
        this._queue.push(queueItem, (error) => {
          if (error !== null) {
            this._handleError(error);
          }
        });
      }
      _worker(item, done) {
        this._scandir(item.directory, this._settings.fsScandirSettings, (error, entries) => {
          if (error !== null) {
            done(error, void 0);
            return;
          }
          for (const entry of entries) {
            this._handleEntry(entry, item.base);
          }
          done(null, void 0);
        });
      }
      _handleError(error) {
        if (this._isDestroyed || !common.isFatalError(this._settings, error)) {
          return;
        }
        this._isFatalError = true;
        this._isDestroyed = true;
        this._emitter.emit("error", error);
      }
      _handleEntry(entry, base) {
        if (this._isDestroyed || this._isFatalError) {
          return;
        }
        const fullpath = entry.path;
        if (base !== void 0) {
          entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
          this._emitEntry(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
          this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
        }
      }
      _emitEntry(entry) {
        this._emitter.emit("entry", entry);
      }
    };
    exports2.default = AsyncReader;
  }
});

// node_modules/@nodelib/fs.walk/out/providers/async.js
var require_async4 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var async_1 = require_async3();
    var AsyncProvider = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._storage = [];
      }
      read(callback) {
        this._reader.onError((error) => {
          callFailureCallback(callback, error);
        });
        this._reader.onEntry((entry) => {
          this._storage.push(entry);
        });
        this._reader.onEnd(() => {
          callSuccessCallback(callback, this._storage);
        });
        this._reader.read();
      }
    };
    exports2.default = AsyncProvider;
    function callFailureCallback(callback, error) {
      callback(error);
    }
    function callSuccessCallback(callback, entries) {
      callback(null, entries);
    }
  }
});

// node_modules/@nodelib/fs.walk/out/providers/stream.js
var require_stream2 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/providers/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var stream_1 = require("stream");
    var async_1 = require_async3();
    var StreamProvider = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._stream = new stream_1.Readable({
          objectMode: true,
          read: () => {
          },
          destroy: () => {
            if (!this._reader.isDestroyed) {
              this._reader.destroy();
            }
          }
        });
      }
      read() {
        this._reader.onError((error) => {
          this._stream.emit("error", error);
        });
        this._reader.onEntry((entry) => {
          this._stream.push(entry);
        });
        this._reader.onEnd(() => {
          this._stream.push(null);
        });
        this._reader.read();
        return this._stream;
      }
    };
    exports2.default = StreamProvider;
  }
});

// node_modules/@nodelib/fs.walk/out/readers/sync.js
var require_sync3 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/readers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fsScandir = require_out2();
    var common = require_common2();
    var reader_1 = require_reader();
    var SyncReader = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._scandir = fsScandir.scandirSync;
        this._storage = [];
        this._queue = /* @__PURE__ */ new Set();
      }
      read() {
        this._pushToQueue(this._root, this._settings.basePath);
        this._handleQueue();
        return this._storage;
      }
      _pushToQueue(directory, base) {
        this._queue.add({ directory, base });
      }
      _handleQueue() {
        for (const item of this._queue.values()) {
          this._handleDirectory(item.directory, item.base);
        }
      }
      _handleDirectory(directory, base) {
        try {
          const entries = this._scandir(directory, this._settings.fsScandirSettings);
          for (const entry of entries) {
            this._handleEntry(entry, base);
          }
        } catch (error) {
          this._handleError(error);
        }
      }
      _handleError(error) {
        if (!common.isFatalError(this._settings, error)) {
          return;
        }
        throw error;
      }
      _handleEntry(entry, base) {
        const fullpath = entry.path;
        if (base !== void 0) {
          entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
          this._pushToStorage(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
          this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
        }
      }
      _pushToStorage(entry) {
        this._storage.push(entry);
      }
    };
    exports2.default = SyncReader;
  }
});

// node_modules/@nodelib/fs.walk/out/providers/sync.js
var require_sync4 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var sync_1 = require_sync3();
    var SyncProvider = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new sync_1.default(this._root, this._settings);
      }
      read() {
        return this._reader.read();
      }
    };
    exports2.default = SyncProvider;
  }
});

// node_modules/@nodelib/fs.walk/out/settings.js
var require_settings3 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path14 = require("path");
    var fsScandir = require_out2();
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.basePath = this._getValue(this._options.basePath, void 0);
        this.concurrency = this._getValue(this._options.concurrency, Number.POSITIVE_INFINITY);
        this.deepFilter = this._getValue(this._options.deepFilter, null);
        this.entryFilter = this._getValue(this._options.entryFilter, null);
        this.errorFilter = this._getValue(this._options.errorFilter, null);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path14.sep);
        this.fsScandirSettings = new fsScandir.Settings({
          followSymbolicLinks: this._options.followSymbolicLinks,
          fs: this._options.fs,
          pathSegmentSeparator: this._options.pathSegmentSeparator,
          stats: this._options.stats,
          throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
        });
      }
      _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
      }
    };
    exports2.default = Settings;
  }
});

// node_modules/@nodelib/fs.walk/out/index.js
var require_out3 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Settings = exports2.walkStream = exports2.walkSync = exports2.walk = void 0;
    var async_1 = require_async4();
    var stream_1 = require_stream2();
    var sync_1 = require_sync4();
    var settings_1 = require_settings3();
    exports2.Settings = settings_1.default;
    function walk(directory, optionsOrSettingsOrCallback, callback) {
      if (typeof optionsOrSettingsOrCallback === "function") {
        new async_1.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
        return;
      }
      new async_1.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
    }
    exports2.walk = walk;
    function walkSync(directory, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      const provider = new sync_1.default(directory, settings);
      return provider.read();
    }
    exports2.walkSync = walkSync;
    function walkStream(directory, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      const provider = new stream_1.default(directory, settings);
      return provider.read();
    }
    exports2.walkStream = walkStream;
    function getSettings(settingsOrOptions = {}) {
      if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
      }
      return new settings_1.default(settingsOrOptions);
    }
  }
});

// node_modules/fast-glob/out/readers/reader.js
var require_reader2 = __commonJS({
  "node_modules/fast-glob/out/readers/reader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path14 = require("path");
    var fsStat = require_out();
    var utils = require_utils3();
    var Reader = class {
      constructor(_settings) {
        this._settings = _settings;
        this._fsStatSettings = new fsStat.Settings({
          followSymbolicLink: this._settings.followSymbolicLinks,
          fs: this._settings.fs,
          throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
        });
      }
      _getFullEntryPath(filepath) {
        return path14.resolve(this._settings.cwd, filepath);
      }
      _makeEntry(stats, pattern) {
        const entry = {
          name: pattern,
          path: pattern,
          dirent: utils.fs.createDirentFromStats(pattern, stats)
        };
        if (this._settings.stats) {
          entry.stats = stats;
        }
        return entry;
      }
      _isFatalError(error) {
        return !utils.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
      }
    };
    exports2.default = Reader;
  }
});

// node_modules/fast-glob/out/readers/stream.js
var require_stream3 = __commonJS({
  "node_modules/fast-glob/out/readers/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var stream_1 = require("stream");
    var fsStat = require_out();
    var fsWalk = require_out3();
    var reader_1 = require_reader2();
    var ReaderStream = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._walkStream = fsWalk.walkStream;
        this._stat = fsStat.stat;
      }
      dynamic(root, options2) {
        return this._walkStream(root, options2);
      }
      static(patterns, options2) {
        const filepaths = patterns.map(this._getFullEntryPath, this);
        const stream = new stream_1.PassThrough({ objectMode: true });
        stream._write = (index, _enc, done) => {
          return this._getEntry(filepaths[index], patterns[index], options2).then((entry) => {
            if (entry !== null && options2.entryFilter(entry)) {
              stream.push(entry);
            }
            if (index === filepaths.length - 1) {
              stream.end();
            }
            done();
          }).catch(done);
        };
        for (let i = 0; i < filepaths.length; i++) {
          stream.write(i);
        }
        return stream;
      }
      _getEntry(filepath, pattern, options2) {
        return this._getStat(filepath).then((stats) => this._makeEntry(stats, pattern)).catch((error) => {
          if (options2.errorFilter(error)) {
            return null;
          }
          throw error;
        });
      }
      _getStat(filepath) {
        return new Promise((resolve, reject) => {
          this._stat(filepath, this._fsStatSettings, (error, stats) => {
            return error === null ? resolve(stats) : reject(error);
          });
        });
      }
    };
    exports2.default = ReaderStream;
  }
});

// node_modules/fast-glob/out/readers/async.js
var require_async5 = __commonJS({
  "node_modules/fast-glob/out/readers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fsWalk = require_out3();
    var reader_1 = require_reader2();
    var stream_1 = require_stream3();
    var ReaderAsync = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._walkAsync = fsWalk.walk;
        this._readerStream = new stream_1.default(this._settings);
      }
      dynamic(root, options2) {
        return new Promise((resolve, reject) => {
          this._walkAsync(root, options2, (error, entries) => {
            if (error === null) {
              resolve(entries);
            } else {
              reject(error);
            }
          });
        });
      }
      async static(patterns, options2) {
        const entries = [];
        const stream = this._readerStream.static(patterns, options2);
        return new Promise((resolve, reject) => {
          stream.once("error", reject);
          stream.on("data", (entry) => entries.push(entry));
          stream.once("end", () => resolve(entries));
        });
      }
    };
    exports2.default = ReaderAsync;
  }
});

// node_modules/fast-glob/out/providers/matchers/matcher.js
var require_matcher = __commonJS({
  "node_modules/fast-glob/out/providers/matchers/matcher.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var Matcher = class {
      constructor(_patterns, _settings, _micromatchOptions) {
        this._patterns = _patterns;
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this._storage = [];
        this._fillStorage();
      }
      _fillStorage() {
        for (const pattern of this._patterns) {
          const segments = this._getPatternSegments(pattern);
          const sections = this._splitSegmentsIntoSections(segments);
          this._storage.push({
            complete: sections.length <= 1,
            pattern,
            segments,
            sections
          });
        }
      }
      _getPatternSegments(pattern) {
        const parts = utils.pattern.getPatternParts(pattern, this._micromatchOptions);
        return parts.map((part) => {
          const dynamic = utils.pattern.isDynamicPattern(part, this._settings);
          if (!dynamic) {
            return {
              dynamic: false,
              pattern: part
            };
          }
          return {
            dynamic: true,
            pattern: part,
            patternRe: utils.pattern.makeRe(part, this._micromatchOptions)
          };
        });
      }
      _splitSegmentsIntoSections(segments) {
        return utils.array.splitWhen(segments, (segment) => segment.dynamic && utils.pattern.hasGlobStar(segment.pattern));
      }
    };
    exports2.default = Matcher;
  }
});

// node_modules/fast-glob/out/providers/matchers/partial.js
var require_partial = __commonJS({
  "node_modules/fast-glob/out/providers/matchers/partial.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var matcher_1 = require_matcher();
    var PartialMatcher = class extends matcher_1.default {
      match(filepath) {
        const parts = filepath.split("/");
        const levels = parts.length;
        const patterns = this._storage.filter((info) => !info.complete || info.segments.length > levels);
        for (const pattern of patterns) {
          const section = pattern.sections[0];
          if (!pattern.complete && levels > section.length) {
            return true;
          }
          const match = parts.every((part, index) => {
            const segment = pattern.segments[index];
            if (segment.dynamic && segment.patternRe.test(part)) {
              return true;
            }
            if (!segment.dynamic && segment.pattern === part) {
              return true;
            }
            return false;
          });
          if (match) {
            return true;
          }
        }
        return false;
      }
    };
    exports2.default = PartialMatcher;
  }
});

// node_modules/fast-glob/out/providers/filters/deep.js
var require_deep = __commonJS({
  "node_modules/fast-glob/out/providers/filters/deep.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var partial_1 = require_partial();
    var DeepFilter = class {
      constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
      }
      getFilter(basePath, positive, negative) {
        const matcher = this._getMatcher(positive);
        const negativeRe = this._getNegativePatternsRe(negative);
        return (entry) => this._filter(basePath, entry, matcher, negativeRe);
      }
      _getMatcher(patterns) {
        return new partial_1.default(patterns, this._settings, this._micromatchOptions);
      }
      _getNegativePatternsRe(patterns) {
        const affectDepthOfReadingPatterns = patterns.filter(utils.pattern.isAffectDepthOfReadingPattern);
        return utils.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
      }
      _filter(basePath, entry, matcher, negativeRe) {
        if (this._isSkippedByDeep(basePath, entry.path)) {
          return false;
        }
        if (this._isSkippedSymbolicLink(entry)) {
          return false;
        }
        const filepath = utils.path.removeLeadingDotSegment(entry.path);
        if (this._isSkippedByPositivePatterns(filepath, matcher)) {
          return false;
        }
        return this._isSkippedByNegativePatterns(filepath, negativeRe);
      }
      _isSkippedByDeep(basePath, entryPath) {
        if (this._settings.deep === Infinity) {
          return false;
        }
        return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
      }
      _getEntryLevel(basePath, entryPath) {
        const entryPathDepth = entryPath.split("/").length;
        if (basePath === "") {
          return entryPathDepth;
        }
        const basePathDepth = basePath.split("/").length;
        return entryPathDepth - basePathDepth;
      }
      _isSkippedSymbolicLink(entry) {
        return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
      }
      _isSkippedByPositivePatterns(entryPath, matcher) {
        return !this._settings.baseNameMatch && !matcher.match(entryPath);
      }
      _isSkippedByNegativePatterns(entryPath, patternsRe) {
        return !utils.pattern.matchAny(entryPath, patternsRe);
      }
    };
    exports2.default = DeepFilter;
  }
});

// node_modules/fast-glob/out/providers/filters/entry.js
var require_entry = __commonJS({
  "node_modules/fast-glob/out/providers/filters/entry.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var EntryFilter = class {
      constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this.index = /* @__PURE__ */ new Map();
      }
      getFilter(positive, negative) {
        const [absoluteNegative, relativeNegative] = utils.pattern.partitionAbsoluteAndRelative(negative);
        const patterns = {
          positive: {
            all: utils.pattern.convertPatternsToRe(positive, this._micromatchOptions)
          },
          negative: {
            absolute: utils.pattern.convertPatternsToRe(absoluteNegative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true })),
            relative: utils.pattern.convertPatternsToRe(relativeNegative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true }))
          }
        };
        return (entry) => this._filter(entry, patterns);
      }
      _filter(entry, patterns) {
        const filepath = utils.path.removeLeadingDotSegment(entry.path);
        if (this._settings.unique && this._isDuplicateEntry(filepath)) {
          return false;
        }
        if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) {
          return false;
        }
        const isMatched = this._isMatchToPatternsSet(filepath, patterns, entry.dirent.isDirectory());
        if (this._settings.unique && isMatched) {
          this._createIndexRecord(filepath);
        }
        return isMatched;
      }
      _isDuplicateEntry(filepath) {
        return this.index.has(filepath);
      }
      _createIndexRecord(filepath) {
        this.index.set(filepath, void 0);
      }
      _onlyFileFilter(entry) {
        return this._settings.onlyFiles && !entry.dirent.isFile();
      }
      _onlyDirectoryFilter(entry) {
        return this._settings.onlyDirectories && !entry.dirent.isDirectory();
      }
      _isMatchToPatternsSet(filepath, patterns, isDirectory) {
        const isMatched = this._isMatchToPatterns(filepath, patterns.positive.all, isDirectory);
        if (!isMatched) {
          return false;
        }
        const isMatchedByRelativeNegative = this._isMatchToPatterns(filepath, patterns.negative.relative, isDirectory);
        if (isMatchedByRelativeNegative) {
          return false;
        }
        const isMatchedByAbsoluteNegative = this._isMatchToAbsoluteNegative(filepath, patterns.negative.absolute, isDirectory);
        if (isMatchedByAbsoluteNegative) {
          return false;
        }
        return true;
      }
      _isMatchToAbsoluteNegative(filepath, patternsRe, isDirectory) {
        if (patternsRe.length === 0) {
          return false;
        }
        const fullpath = utils.path.makeAbsolute(this._settings.cwd, filepath);
        return this._isMatchToPatterns(fullpath, patternsRe, isDirectory);
      }
      _isMatchToPatterns(filepath, patternsRe, isDirectory) {
        if (patternsRe.length === 0) {
          return false;
        }
        const isMatched = utils.pattern.matchAny(filepath, patternsRe);
        if (!isMatched && isDirectory) {
          return utils.pattern.matchAny(filepath + "/", patternsRe);
        }
        return isMatched;
      }
    };
    exports2.default = EntryFilter;
  }
});

// node_modules/fast-glob/out/providers/filters/error.js
var require_error = __commonJS({
  "node_modules/fast-glob/out/providers/filters/error.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var ErrorFilter = class {
      constructor(_settings) {
        this._settings = _settings;
      }
      getFilter() {
        return (error) => this._isNonFatalError(error);
      }
      _isNonFatalError(error) {
        return utils.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
      }
    };
    exports2.default = ErrorFilter;
  }
});

// node_modules/fast-glob/out/providers/transformers/entry.js
var require_entry2 = __commonJS({
  "node_modules/fast-glob/out/providers/transformers/entry.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var EntryTransformer = class {
      constructor(_settings) {
        this._settings = _settings;
      }
      getTransformer() {
        return (entry) => this._transform(entry);
      }
      _transform(entry) {
        let filepath = entry.path;
        if (this._settings.absolute) {
          filepath = utils.path.makeAbsolute(this._settings.cwd, filepath);
          filepath = utils.path.unixify(filepath);
        }
        if (this._settings.markDirectories && entry.dirent.isDirectory()) {
          filepath += "/";
        }
        if (!this._settings.objectMode) {
          return filepath;
        }
        return Object.assign(Object.assign({}, entry), { path: filepath });
      }
    };
    exports2.default = EntryTransformer;
  }
});

// node_modules/fast-glob/out/providers/provider.js
var require_provider = __commonJS({
  "node_modules/fast-glob/out/providers/provider.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path14 = require("path");
    var deep_1 = require_deep();
    var entry_1 = require_entry();
    var error_1 = require_error();
    var entry_2 = require_entry2();
    var Provider = class {
      constructor(_settings) {
        this._settings = _settings;
        this.errorFilter = new error_1.default(this._settings);
        this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
        this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
        this.entryTransformer = new entry_2.default(this._settings);
      }
      _getRootDirectory(task) {
        return path14.resolve(this._settings.cwd, task.base);
      }
      _getReaderOptions(task) {
        const basePath = task.base === "." ? "" : task.base;
        return {
          basePath,
          pathSegmentSeparator: "/",
          concurrency: this._settings.concurrency,
          deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
          entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
          errorFilter: this.errorFilter.getFilter(),
          followSymbolicLinks: this._settings.followSymbolicLinks,
          fs: this._settings.fs,
          stats: this._settings.stats,
          throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
          transform: this.entryTransformer.getTransformer()
        };
      }
      _getMicromatchOptions() {
        return {
          dot: this._settings.dot,
          matchBase: this._settings.baseNameMatch,
          nobrace: !this._settings.braceExpansion,
          nocase: !this._settings.caseSensitiveMatch,
          noext: !this._settings.extglob,
          noglobstar: !this._settings.globstar,
          posix: true,
          strictSlashes: false
        };
      }
    };
    exports2.default = Provider;
  }
});

// node_modules/fast-glob/out/providers/async.js
var require_async6 = __commonJS({
  "node_modules/fast-glob/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var async_1 = require_async5();
    var provider_1 = require_provider();
    var ProviderAsync = class extends provider_1.default {
      constructor() {
        super(...arguments);
        this._reader = new async_1.default(this._settings);
      }
      async read(task) {
        const root = this._getRootDirectory(task);
        const options2 = this._getReaderOptions(task);
        const entries = await this.api(root, task, options2);
        return entries.map((entry) => options2.transform(entry));
      }
      api(root, task, options2) {
        if (task.dynamic) {
          return this._reader.dynamic(root, options2);
        }
        return this._reader.static(task.patterns, options2);
      }
    };
    exports2.default = ProviderAsync;
  }
});

// node_modules/fast-glob/out/providers/stream.js
var require_stream4 = __commonJS({
  "node_modules/fast-glob/out/providers/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var stream_1 = require("stream");
    var stream_2 = require_stream3();
    var provider_1 = require_provider();
    var ProviderStream = class extends provider_1.default {
      constructor() {
        super(...arguments);
        this._reader = new stream_2.default(this._settings);
      }
      read(task) {
        const root = this._getRootDirectory(task);
        const options2 = this._getReaderOptions(task);
        const source = this.api(root, task, options2);
        const destination = new stream_1.Readable({ objectMode: true, read: () => {
        } });
        source.once("error", (error) => destination.emit("error", error)).on("data", (entry) => destination.emit("data", options2.transform(entry))).once("end", () => destination.emit("end"));
        destination.once("close", () => source.destroy());
        return destination;
      }
      api(root, task, options2) {
        if (task.dynamic) {
          return this._reader.dynamic(root, options2);
        }
        return this._reader.static(task.patterns, options2);
      }
    };
    exports2.default = ProviderStream;
  }
});

// node_modules/fast-glob/out/readers/sync.js
var require_sync5 = __commonJS({
  "node_modules/fast-glob/out/readers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fsStat = require_out();
    var fsWalk = require_out3();
    var reader_1 = require_reader2();
    var ReaderSync = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._walkSync = fsWalk.walkSync;
        this._statSync = fsStat.statSync;
      }
      dynamic(root, options2) {
        return this._walkSync(root, options2);
      }
      static(patterns, options2) {
        const entries = [];
        for (const pattern of patterns) {
          const filepath = this._getFullEntryPath(pattern);
          const entry = this._getEntry(filepath, pattern, options2);
          if (entry === null || !options2.entryFilter(entry)) {
            continue;
          }
          entries.push(entry);
        }
        return entries;
      }
      _getEntry(filepath, pattern, options2) {
        try {
          const stats = this._getStat(filepath);
          return this._makeEntry(stats, pattern);
        } catch (error) {
          if (options2.errorFilter(error)) {
            return null;
          }
          throw error;
        }
      }
      _getStat(filepath) {
        return this._statSync(filepath, this._fsStatSettings);
      }
    };
    exports2.default = ReaderSync;
  }
});

// node_modules/fast-glob/out/providers/sync.js
var require_sync6 = __commonJS({
  "node_modules/fast-glob/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var sync_1 = require_sync5();
    var provider_1 = require_provider();
    var ProviderSync = class extends provider_1.default {
      constructor() {
        super(...arguments);
        this._reader = new sync_1.default(this._settings);
      }
      read(task) {
        const root = this._getRootDirectory(task);
        const options2 = this._getReaderOptions(task);
        const entries = this.api(root, task, options2);
        return entries.map(options2.transform);
      }
      api(root, task, options2) {
        if (task.dynamic) {
          return this._reader.dynamic(root, options2);
        }
        return this._reader.static(task.patterns, options2);
      }
    };
    exports2.default = ProviderSync;
  }
});

// node_modules/fast-glob/out/settings.js
var require_settings4 = __commonJS({
  "node_modules/fast-glob/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
    var fs11 = require("fs");
    var os = require("os");
    var CPU_COUNT = Math.max(os.cpus().length, 1);
    exports2.DEFAULT_FILE_SYSTEM_ADAPTER = {
      lstat: fs11.lstat,
      lstatSync: fs11.lstatSync,
      stat: fs11.stat,
      statSync: fs11.statSync,
      readdir: fs11.readdir,
      readdirSync: fs11.readdirSync
    };
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.absolute = this._getValue(this._options.absolute, false);
        this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
        this.braceExpansion = this._getValue(this._options.braceExpansion, true);
        this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
        this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
        this.cwd = this._getValue(this._options.cwd, process.cwd());
        this.deep = this._getValue(this._options.deep, Infinity);
        this.dot = this._getValue(this._options.dot, false);
        this.extglob = this._getValue(this._options.extglob, true);
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
        this.fs = this._getFileSystemMethods(this._options.fs);
        this.globstar = this._getValue(this._options.globstar, true);
        this.ignore = this._getValue(this._options.ignore, []);
        this.markDirectories = this._getValue(this._options.markDirectories, false);
        this.objectMode = this._getValue(this._options.objectMode, false);
        this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
        this.onlyFiles = this._getValue(this._options.onlyFiles, true);
        this.stats = this._getValue(this._options.stats, false);
        this.suppressErrors = this._getValue(this._options.suppressErrors, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
        this.unique = this._getValue(this._options.unique, true);
        if (this.onlyDirectories) {
          this.onlyFiles = false;
        }
        if (this.stats) {
          this.objectMode = true;
        }
        this.ignore = [].concat(this.ignore);
      }
      _getValue(option, value) {
        return option === void 0 ? value : option;
      }
      _getFileSystemMethods(methods = {}) {
        return Object.assign(Object.assign({}, exports2.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
      }
    };
    exports2.default = Settings;
  }
});

// node_modules/fast-glob/out/index.js
var require_out4 = __commonJS({
  "node_modules/fast-glob/out/index.js"(exports2, module2) {
    "use strict";
    var taskManager = require_tasks();
    var async_1 = require_async6();
    var stream_1 = require_stream4();
    var sync_1 = require_sync6();
    var settings_1 = require_settings4();
    var utils = require_utils3();
    async function FastGlob(source, options2) {
      assertPatternsInput(source);
      const works = getWorks(source, async_1.default, options2);
      const result = await Promise.all(works);
      return utils.array.flatten(result);
    }
    (function(FastGlob2) {
      FastGlob2.glob = FastGlob2;
      FastGlob2.globSync = sync;
      FastGlob2.globStream = stream;
      FastGlob2.async = FastGlob2;
      function sync(source, options2) {
        assertPatternsInput(source);
        const works = getWorks(source, sync_1.default, options2);
        return utils.array.flatten(works);
      }
      FastGlob2.sync = sync;
      function stream(source, options2) {
        assertPatternsInput(source);
        const works = getWorks(source, stream_1.default, options2);
        return utils.stream.merge(works);
      }
      FastGlob2.stream = stream;
      function generateTasks(source, options2) {
        assertPatternsInput(source);
        const patterns = [].concat(source);
        const settings = new settings_1.default(options2);
        return taskManager.generate(patterns, settings);
      }
      FastGlob2.generateTasks = generateTasks;
      function isDynamicPattern(source, options2) {
        assertPatternsInput(source);
        const settings = new settings_1.default(options2);
        return utils.pattern.isDynamicPattern(source, settings);
      }
      FastGlob2.isDynamicPattern = isDynamicPattern;
      function escapePath(source) {
        assertPatternsInput(source);
        return utils.path.escape(source);
      }
      FastGlob2.escapePath = escapePath;
      function convertPathToPattern(source) {
        assertPatternsInput(source);
        return utils.path.convertPathToPattern(source);
      }
      FastGlob2.convertPathToPattern = convertPathToPattern;
      let posix;
      (function(posix2) {
        function escapePath2(source) {
          assertPatternsInput(source);
          return utils.path.escapePosixPath(source);
        }
        posix2.escapePath = escapePath2;
        function convertPathToPattern2(source) {
          assertPatternsInput(source);
          return utils.path.convertPosixPathToPattern(source);
        }
        posix2.convertPathToPattern = convertPathToPattern2;
      })(posix = FastGlob2.posix || (FastGlob2.posix = {}));
      let win32;
      (function(win322) {
        function escapePath2(source) {
          assertPatternsInput(source);
          return utils.path.escapeWindowsPath(source);
        }
        win322.escapePath = escapePath2;
        function convertPathToPattern2(source) {
          assertPatternsInput(source);
          return utils.path.convertWindowsPathToPattern(source);
        }
        win322.convertPathToPattern = convertPathToPattern2;
      })(win32 = FastGlob2.win32 || (FastGlob2.win32 = {}));
    })(FastGlob || (FastGlob = {}));
    function getWorks(source, _Provider, options2) {
      const patterns = [].concat(source);
      const settings = new settings_1.default(options2);
      const tasks = taskManager.generate(patterns, settings);
      const provider = new _Provider(settings);
      return tasks.map(provider.read, provider);
    }
    function assertPatternsInput(input) {
      const source = [].concat(input);
      const isValidSource = source.every((item) => utils.string.isString(item) && !utils.string.isEmpty(item));
      if (!isValidSource) {
        throw new TypeError("Patterns must be a string (non empty) or an array of strings");
      }
    }
    module2.exports = FastGlob;
  }
});

// node_modules/kind-of/index.js
var require_kind_of = __commonJS({
  "node_modules/kind-of/index.js"(exports2, module2) {
    var toString = Object.prototype.toString;
    module2.exports = function kindOf(val) {
      if (val === void 0) return "undefined";
      if (val === null) return "null";
      var type = typeof val;
      if (type === "boolean") return "boolean";
      if (type === "string") return "string";
      if (type === "number") return "number";
      if (type === "symbol") return "symbol";
      if (type === "function") {
        return isGeneratorFn(val) ? "generatorfunction" : "function";
      }
      if (isArray(val)) return "array";
      if (isBuffer(val)) return "buffer";
      if (isArguments(val)) return "arguments";
      if (isDate(val)) return "date";
      if (isError(val)) return "error";
      if (isRegexp(val)) return "regexp";
      switch (ctorName(val)) {
        case "Symbol":
          return "symbol";
        case "Promise":
          return "promise";
        // Set, Map, WeakSet, WeakMap
        case "WeakMap":
          return "weakmap";
        case "WeakSet":
          return "weakset";
        case "Map":
          return "map";
        case "Set":
          return "set";
        // 8-bit typed arrays
        case "Int8Array":
          return "int8array";
        case "Uint8Array":
          return "uint8array";
        case "Uint8ClampedArray":
          return "uint8clampedarray";
        // 16-bit typed arrays
        case "Int16Array":
          return "int16array";
        case "Uint16Array":
          return "uint16array";
        // 32-bit typed arrays
        case "Int32Array":
          return "int32array";
        case "Uint32Array":
          return "uint32array";
        case "Float32Array":
          return "float32array";
        case "Float64Array":
          return "float64array";
      }
      if (isGeneratorObj(val)) {
        return "generator";
      }
      type = toString.call(val);
      switch (type) {
        case "[object Object]":
          return "object";
        // iterators
        case "[object Map Iterator]":
          return "mapiterator";
        case "[object Set Iterator]":
          return "setiterator";
        case "[object String Iterator]":
          return "stringiterator";
        case "[object Array Iterator]":
          return "arrayiterator";
      }
      return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
    };
    function ctorName(val) {
      return typeof val.constructor === "function" ? val.constructor.name : null;
    }
    function isArray(val) {
      if (Array.isArray) return Array.isArray(val);
      return val instanceof Array;
    }
    function isError(val) {
      return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
    }
    function isDate(val) {
      if (val instanceof Date) return true;
      return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
    }
    function isRegexp(val) {
      if (val instanceof RegExp) return true;
      return typeof val.flags === "string" && typeof val.ignoreCase === "boolean" && typeof val.multiline === "boolean" && typeof val.global === "boolean";
    }
    function isGeneratorFn(name, val) {
      return ctorName(name) === "GeneratorFunction";
    }
    function isGeneratorObj(val) {
      return typeof val.throw === "function" && typeof val.return === "function" && typeof val.next === "function";
    }
    function isArguments(val) {
      try {
        if (typeof val.length === "number" && typeof val.callee === "function") {
          return true;
        }
      } catch (err) {
        if (err.message.indexOf("callee") !== -1) {
          return true;
        }
      }
      return false;
    }
    function isBuffer(val) {
      if (val.constructor && typeof val.constructor.isBuffer === "function") {
        return val.constructor.isBuffer(val);
      }
      return false;
    }
  }
});

// node_modules/is-extendable/index.js
var require_is_extendable = __commonJS({
  "node_modules/is-extendable/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function isExtendable(val) {
      return typeof val !== "undefined" && val !== null && (typeof val === "object" || typeof val === "function");
    };
  }
});

// node_modules/extend-shallow/index.js
var require_extend_shallow = __commonJS({
  "node_modules/extend-shallow/index.js"(exports2, module2) {
    "use strict";
    var isObject = require_is_extendable();
    module2.exports = function extend(o) {
      if (!isObject(o)) {
        o = {};
      }
      var len = arguments.length;
      for (var i = 1; i < len; i++) {
        var obj = arguments[i];
        if (isObject(obj)) {
          assign(o, obj);
        }
      }
      return o;
    };
    function assign(a, b) {
      for (var key in b) {
        if (hasOwn(b, key)) {
          a[key] = b[key];
        }
      }
    }
    function hasOwn(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }
  }
});

// node_modules/section-matter/index.js
var require_section_matter = __commonJS({
  "node_modules/section-matter/index.js"(exports2, module2) {
    "use strict";
    var typeOf = require_kind_of();
    var extend = require_extend_shallow();
    module2.exports = function(input, options2) {
      if (typeof options2 === "function") {
        options2 = { parse: options2 };
      }
      var file = toObject(input);
      var defaults = { section_delimiter: "---", parse: identity };
      var opts = extend({}, defaults, options2);
      var delim = opts.section_delimiter;
      var lines = file.content.split(/\r?\n/);
      var sections = null;
      var section = createSection();
      var content = [];
      var stack = [];
      function initSections(val) {
        file.content = val;
        sections = [];
        content = [];
      }
      function closeSection(val) {
        if (stack.length) {
          section.key = getKey(stack[0], delim);
          section.content = val;
          opts.parse(section, sections);
          sections.push(section);
          section = createSection();
          content = [];
          stack = [];
        }
      }
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var len = stack.length;
        var ln = line.trim();
        if (isDelimiter(ln, delim)) {
          if (ln.length === 3 && i !== 0) {
            if (len === 0 || len === 2) {
              content.push(line);
              continue;
            }
            stack.push(ln);
            section.data = content.join("\n");
            content = [];
            continue;
          }
          if (sections === null) {
            initSections(content.join("\n"));
          }
          if (len === 2) {
            closeSection(content.join("\n"));
          }
          stack.push(ln);
          continue;
        }
        content.push(line);
      }
      if (sections === null) {
        initSections(content.join("\n"));
      } else {
        closeSection(content.join("\n"));
      }
      file.sections = sections;
      return file;
    };
    function isDelimiter(line, delim) {
      if (line.slice(0, delim.length) !== delim) {
        return false;
      }
      if (line.charAt(delim.length + 1) === delim.slice(-1)) {
        return false;
      }
      return true;
    }
    function toObject(input) {
      if (typeOf(input) !== "object") {
        input = { content: input };
      }
      if (typeof input.content !== "string" && !isBuffer(input.content)) {
        throw new TypeError("expected a buffer or string");
      }
      input.content = input.content.toString();
      input.sections = [];
      return input;
    }
    function getKey(val, delim) {
      return val ? val.slice(delim.length).trim() : "";
    }
    function createSection() {
      return { key: "", data: "", content: "" };
    }
    function identity(val) {
      return val;
    }
    function isBuffer(val) {
      if (val && val.constructor && typeof val.constructor.isBuffer === "function") {
        return val.constructor.isBuffer(val);
      }
      return false;
    }
  }
});

// node_modules/js-yaml/lib/js-yaml/common.js
var require_common3 = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/common.js"(exports2, module2) {
    "use strict";
    function isNothing(subject) {
      return typeof subject === "undefined" || subject === null;
    }
    function isObject(subject) {
      return typeof subject === "object" && subject !== null;
    }
    function toArray(sequence) {
      if (Array.isArray(sequence)) return sequence;
      else if (isNothing(sequence)) return [];
      return [sequence];
    }
    function extend(target, source) {
      var index, length, key, sourceKeys;
      if (source) {
        sourceKeys = Object.keys(source);
        for (index = 0, length = sourceKeys.length; index < length; index += 1) {
          key = sourceKeys[index];
          target[key] = source[key];
        }
      }
      return target;
    }
    function repeat(string, count) {
      var result = "", cycle;
      for (cycle = 0; cycle < count; cycle += 1) {
        result += string;
      }
      return result;
    }
    function isNegativeZero(number) {
      return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
    }
    module2.exports.isNothing = isNothing;
    module2.exports.isObject = isObject;
    module2.exports.toArray = toArray;
    module2.exports.repeat = repeat;
    module2.exports.isNegativeZero = isNegativeZero;
    module2.exports.extend = extend;
  }
});

// node_modules/js-yaml/lib/js-yaml/exception.js
var require_exception = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/exception.js"(exports2, module2) {
    "use strict";
    function YAMLException(reason, mark) {
      Error.call(this);
      this.name = "YAMLException";
      this.reason = reason;
      this.mark = mark;
      this.message = (this.reason || "(unknown reason)") + (this.mark ? " " + this.mark.toString() : "");
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error().stack || "";
      }
    }
    YAMLException.prototype = Object.create(Error.prototype);
    YAMLException.prototype.constructor = YAMLException;
    YAMLException.prototype.toString = function toString(compact) {
      var result = this.name + ": ";
      result += this.reason || "(unknown reason)";
      if (!compact && this.mark) {
        result += " " + this.mark.toString();
      }
      return result;
    };
    module2.exports = YAMLException;
  }
});

// node_modules/js-yaml/lib/js-yaml/mark.js
var require_mark = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/mark.js"(exports2, module2) {
    "use strict";
    var common = require_common3();
    function Mark(name, buffer, position, line, column) {
      this.name = name;
      this.buffer = buffer;
      this.position = position;
      this.line = line;
      this.column = column;
    }
    Mark.prototype.getSnippet = function getSnippet(indent, maxLength) {
      var head, start, tail, end, snippet;
      if (!this.buffer) return null;
      indent = indent || 4;
      maxLength = maxLength || 75;
      head = "";
      start = this.position;
      while (start > 0 && "\0\r\n\x85\u2028\u2029".indexOf(this.buffer.charAt(start - 1)) === -1) {
        start -= 1;
        if (this.position - start > maxLength / 2 - 1) {
          head = " ... ";
          start += 5;
          break;
        }
      }
      tail = "";
      end = this.position;
      while (end < this.buffer.length && "\0\r\n\x85\u2028\u2029".indexOf(this.buffer.charAt(end)) === -1) {
        end += 1;
        if (end - this.position > maxLength / 2 - 1) {
          tail = " ... ";
          end -= 5;
          break;
        }
      }
      snippet = this.buffer.slice(start, end);
      return common.repeat(" ", indent) + head + snippet + tail + "\n" + common.repeat(" ", indent + this.position - start + head.length) + "^";
    };
    Mark.prototype.toString = function toString(compact) {
      var snippet, where = "";
      if (this.name) {
        where += 'in "' + this.name + '" ';
      }
      where += "at line " + (this.line + 1) + ", column " + (this.column + 1);
      if (!compact) {
        snippet = this.getSnippet();
        if (snippet) {
          where += ":\n" + snippet;
        }
      }
      return where;
    };
    module2.exports = Mark;
  }
});

// node_modules/js-yaml/lib/js-yaml/type.js
var require_type = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type.js"(exports2, module2) {
    "use strict";
    var YAMLException = require_exception();
    var TYPE_CONSTRUCTOR_OPTIONS = [
      "kind",
      "resolve",
      "construct",
      "instanceOf",
      "predicate",
      "represent",
      "defaultStyle",
      "styleAliases"
    ];
    var YAML_NODE_KINDS = [
      "scalar",
      "sequence",
      "mapping"
    ];
    function compileStyleAliases(map) {
      var result = {};
      if (map !== null) {
        Object.keys(map).forEach(function(style) {
          map[style].forEach(function(alias) {
            result[String(alias)] = style;
          });
        });
      }
      return result;
    }
    function Type(tag, options2) {
      options2 = options2 || {};
      Object.keys(options2).forEach(function(name) {
        if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
          throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
        }
      });
      this.tag = tag;
      this.kind = options2["kind"] || null;
      this.resolve = options2["resolve"] || function() {
        return true;
      };
      this.construct = options2["construct"] || function(data) {
        return data;
      };
      this.instanceOf = options2["instanceOf"] || null;
      this.predicate = options2["predicate"] || null;
      this.represent = options2["represent"] || null;
      this.defaultStyle = options2["defaultStyle"] || null;
      this.styleAliases = compileStyleAliases(options2["styleAliases"] || null);
      if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
        throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
      }
    }
    module2.exports = Type;
  }
});

// node_modules/js-yaml/lib/js-yaml/schema.js
var require_schema = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema.js"(exports2, module2) {
    "use strict";
    var common = require_common3();
    var YAMLException = require_exception();
    var Type = require_type();
    function compileList(schema, name, result) {
      var exclude = [];
      schema.include.forEach(function(includedSchema) {
        result = compileList(includedSchema, name, result);
      });
      schema[name].forEach(function(currentType) {
        result.forEach(function(previousType, previousIndex) {
          if (previousType.tag === currentType.tag && previousType.kind === currentType.kind) {
            exclude.push(previousIndex);
          }
        });
        result.push(currentType);
      });
      return result.filter(function(type, index) {
        return exclude.indexOf(index) === -1;
      });
    }
    function compileMap() {
      var result = {
        scalar: {},
        sequence: {},
        mapping: {},
        fallback: {}
      }, index, length;
      function collectType(type) {
        result[type.kind][type.tag] = result["fallback"][type.tag] = type;
      }
      for (index = 0, length = arguments.length; index < length; index += 1) {
        arguments[index].forEach(collectType);
      }
      return result;
    }
    function Schema(definition) {
      this.include = definition.include || [];
      this.implicit = definition.implicit || [];
      this.explicit = definition.explicit || [];
      this.implicit.forEach(function(type) {
        if (type.loadKind && type.loadKind !== "scalar") {
          throw new YAMLException("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
        }
      });
      this.compiledImplicit = compileList(this, "implicit", []);
      this.compiledExplicit = compileList(this, "explicit", []);
      this.compiledTypeMap = compileMap(this.compiledImplicit, this.compiledExplicit);
    }
    Schema.DEFAULT = null;
    Schema.create = function createSchema() {
      var schemas, types;
      switch (arguments.length) {
        case 1:
          schemas = Schema.DEFAULT;
          types = arguments[0];
          break;
        case 2:
          schemas = arguments[0];
          types = arguments[1];
          break;
        default:
          throw new YAMLException("Wrong number of arguments for Schema.create function");
      }
      schemas = common.toArray(schemas);
      types = common.toArray(types);
      if (!schemas.every(function(schema) {
        return schema instanceof Schema;
      })) {
        throw new YAMLException("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");
      }
      if (!types.every(function(type) {
        return type instanceof Type;
      })) {
        throw new YAMLException("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      }
      return new Schema({
        include: schemas,
        explicit: types
      });
    };
    module2.exports = Schema;
  }
});

// node_modules/js-yaml/lib/js-yaml/type/str.js
var require_str = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/str.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    module2.exports = new Type("tag:yaml.org,2002:str", {
      kind: "scalar",
      construct: function(data) {
        return data !== null ? data : "";
      }
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/seq.js
var require_seq = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/seq.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    module2.exports = new Type("tag:yaml.org,2002:seq", {
      kind: "sequence",
      construct: function(data) {
        return data !== null ? data : [];
      }
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/map.js
var require_map = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/map.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    module2.exports = new Type("tag:yaml.org,2002:map", {
      kind: "mapping",
      construct: function(data) {
        return data !== null ? data : {};
      }
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/schema/failsafe.js
var require_failsafe = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema/failsafe.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      explicit: [
        require_str(),
        require_seq(),
        require_map()
      ]
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/null.js
var require_null = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/null.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveYamlNull(data) {
      if (data === null) return true;
      var max = data.length;
      return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
    }
    function constructYamlNull() {
      return null;
    }
    function isNull(object) {
      return object === null;
    }
    module2.exports = new Type("tag:yaml.org,2002:null", {
      kind: "scalar",
      resolve: resolveYamlNull,
      construct: constructYamlNull,
      predicate: isNull,
      represent: {
        canonical: function() {
          return "~";
        },
        lowercase: function() {
          return "null";
        },
        uppercase: function() {
          return "NULL";
        },
        camelcase: function() {
          return "Null";
        }
      },
      defaultStyle: "lowercase"
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/bool.js
var require_bool = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/bool.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveYamlBoolean(data) {
      if (data === null) return false;
      var max = data.length;
      return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
    }
    function constructYamlBoolean(data) {
      return data === "true" || data === "True" || data === "TRUE";
    }
    function isBoolean(object) {
      return Object.prototype.toString.call(object) === "[object Boolean]";
    }
    module2.exports = new Type("tag:yaml.org,2002:bool", {
      kind: "scalar",
      resolve: resolveYamlBoolean,
      construct: constructYamlBoolean,
      predicate: isBoolean,
      represent: {
        lowercase: function(object) {
          return object ? "true" : "false";
        },
        uppercase: function(object) {
          return object ? "TRUE" : "FALSE";
        },
        camelcase: function(object) {
          return object ? "True" : "False";
        }
      },
      defaultStyle: "lowercase"
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/int.js
var require_int = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/int.js"(exports2, module2) {
    "use strict";
    var common = require_common3();
    var Type = require_type();
    function isHexCode(c) {
      return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
    }
    function isOctCode(c) {
      return 48 <= c && c <= 55;
    }
    function isDecCode(c) {
      return 48 <= c && c <= 57;
    }
    function resolveYamlInteger(data) {
      if (data === null) return false;
      var max = data.length, index = 0, hasDigits = false, ch;
      if (!max) return false;
      ch = data[index];
      if (ch === "-" || ch === "+") {
        ch = data[++index];
      }
      if (ch === "0") {
        if (index + 1 === max) return true;
        ch = data[++index];
        if (ch === "b") {
          index++;
          for (; index < max; index++) {
            ch = data[index];
            if (ch === "_") continue;
            if (ch !== "0" && ch !== "1") return false;
            hasDigits = true;
          }
          return hasDigits && ch !== "_";
        }
        if (ch === "x") {
          index++;
          for (; index < max; index++) {
            ch = data[index];
            if (ch === "_") continue;
            if (!isHexCode(data.charCodeAt(index))) return false;
            hasDigits = true;
          }
          return hasDigits && ch !== "_";
        }
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (!isOctCode(data.charCodeAt(index))) return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      if (ch === "_") return false;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (ch === ":") break;
        if (!isDecCode(data.charCodeAt(index))) {
          return false;
        }
        hasDigits = true;
      }
      if (!hasDigits || ch === "_") return false;
      if (ch !== ":") return true;
      return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
    }
    function constructYamlInteger(data) {
      var value = data, sign = 1, ch, base, digits = [];
      if (value.indexOf("_") !== -1) {
        value = value.replace(/_/g, "");
      }
      ch = value[0];
      if (ch === "-" || ch === "+") {
        if (ch === "-") sign = -1;
        value = value.slice(1);
        ch = value[0];
      }
      if (value === "0") return 0;
      if (ch === "0") {
        if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
        if (value[1] === "x") return sign * parseInt(value, 16);
        return sign * parseInt(value, 8);
      }
      if (value.indexOf(":") !== -1) {
        value.split(":").forEach(function(v) {
          digits.unshift(parseInt(v, 10));
        });
        value = 0;
        base = 1;
        digits.forEach(function(d) {
          value += d * base;
          base *= 60;
        });
        return sign * value;
      }
      return sign * parseInt(value, 10);
    }
    function isInteger(object) {
      return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
    }
    module2.exports = new Type("tag:yaml.org,2002:int", {
      kind: "scalar",
      resolve: resolveYamlInteger,
      construct: constructYamlInteger,
      predicate: isInteger,
      represent: {
        binary: function(obj) {
          return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
        },
        octal: function(obj) {
          return obj >= 0 ? "0" + obj.toString(8) : "-0" + obj.toString(8).slice(1);
        },
        decimal: function(obj) {
          return obj.toString(10);
        },
        /* eslint-disable max-len */
        hexadecimal: function(obj) {
          return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
        }
      },
      defaultStyle: "decimal",
      styleAliases: {
        binary: [2, "bin"],
        octal: [8, "oct"],
        decimal: [10, "dec"],
        hexadecimal: [16, "hex"]
      }
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/float.js
var require_float = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/float.js"(exports2, module2) {
    "use strict";
    var common = require_common3();
    var Type = require_type();
    var YAML_FLOAT_PATTERN = new RegExp(
      // 2.5e4, 2.5 and integers
      "^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
    );
    function resolveYamlFloat(data) {
      if (data === null) return false;
      if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
      // Probably should update regexp & check speed
      data[data.length - 1] === "_") {
        return false;
      }
      return true;
    }
    function constructYamlFloat(data) {
      var value, sign, base, digits;
      value = data.replace(/_/g, "").toLowerCase();
      sign = value[0] === "-" ? -1 : 1;
      digits = [];
      if ("+-".indexOf(value[0]) >= 0) {
        value = value.slice(1);
      }
      if (value === ".inf") {
        return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      } else if (value === ".nan") {
        return NaN;
      } else if (value.indexOf(":") >= 0) {
        value.split(":").forEach(function(v) {
          digits.unshift(parseFloat(v, 10));
        });
        value = 0;
        base = 1;
        digits.forEach(function(d) {
          value += d * base;
          base *= 60;
        });
        return sign * value;
      }
      return sign * parseFloat(value, 10);
    }
    var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
    function representYamlFloat(object, style) {
      var res;
      if (isNaN(object)) {
        switch (style) {
          case "lowercase":
            return ".nan";
          case "uppercase":
            return ".NAN";
          case "camelcase":
            return ".NaN";
        }
      } else if (Number.POSITIVE_INFINITY === object) {
        switch (style) {
          case "lowercase":
            return ".inf";
          case "uppercase":
            return ".INF";
          case "camelcase":
            return ".Inf";
        }
      } else if (Number.NEGATIVE_INFINITY === object) {
        switch (style) {
          case "lowercase":
            return "-.inf";
          case "uppercase":
            return "-.INF";
          case "camelcase":
            return "-.Inf";
        }
      } else if (common.isNegativeZero(object)) {
        return "-0.0";
      }
      res = object.toString(10);
      return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
    }
    function isFloat(object) {
      return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
    }
    module2.exports = new Type("tag:yaml.org,2002:float", {
      kind: "scalar",
      resolve: resolveYamlFloat,
      construct: constructYamlFloat,
      predicate: isFloat,
      represent: representYamlFloat,
      defaultStyle: "lowercase"
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/schema/json.js
var require_json = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema/json.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      include: [
        require_failsafe()
      ],
      implicit: [
        require_null(),
        require_bool(),
        require_int(),
        require_float()
      ]
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/schema/core.js
var require_core = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema/core.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      include: [
        require_json()
      ]
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/timestamp.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var YAML_DATE_REGEXP = new RegExp(
      "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
    );
    var YAML_TIMESTAMP_REGEXP = new RegExp(
      "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
    );
    function resolveYamlTimestamp(data) {
      if (data === null) return false;
      if (YAML_DATE_REGEXP.exec(data) !== null) return true;
      if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
      return false;
    }
    function constructYamlTimestamp(data) {
      var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
      match = YAML_DATE_REGEXP.exec(data);
      if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
      if (match === null) throw new Error("Date resolve error");
      year = +match[1];
      month = +match[2] - 1;
      day = +match[3];
      if (!match[4]) {
        return new Date(Date.UTC(year, month, day));
      }
      hour = +match[4];
      minute = +match[5];
      second = +match[6];
      if (match[7]) {
        fraction = match[7].slice(0, 3);
        while (fraction.length < 3) {
          fraction += "0";
        }
        fraction = +fraction;
      }
      if (match[9]) {
        tz_hour = +match[10];
        tz_minute = +(match[11] || 0);
        delta = (tz_hour * 60 + tz_minute) * 6e4;
        if (match[9] === "-") delta = -delta;
      }
      date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
      if (delta) date.setTime(date.getTime() - delta);
      return date;
    }
    function representYamlTimestamp(object) {
      return object.toISOString();
    }
    module2.exports = new Type("tag:yaml.org,2002:timestamp", {
      kind: "scalar",
      resolve: resolveYamlTimestamp,
      construct: constructYamlTimestamp,
      instanceOf: Date,
      represent: representYamlTimestamp
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/merge.js
var require_merge = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/merge.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveYamlMerge(data) {
      return data === "<<" || data === null;
    }
    module2.exports = new Type("tag:yaml.org,2002:merge", {
      kind: "scalar",
      resolve: resolveYamlMerge
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/binary.js
var require_binary = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/binary.js"(exports2, module2) {
    "use strict";
    var NodeBuffer;
    try {
      _require = require;
      NodeBuffer = _require("buffer").Buffer;
    } catch (__) {
    }
    var _require;
    var Type = require_type();
    var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
    function resolveYamlBinary(data) {
      if (data === null) return false;
      var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;
      for (idx = 0; idx < max; idx++) {
        code = map.indexOf(data.charAt(idx));
        if (code > 64) continue;
        if (code < 0) return false;
        bitlen += 6;
      }
      return bitlen % 8 === 0;
    }
    function constructYamlBinary(data) {
      var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map = BASE64_MAP, bits = 0, result = [];
      for (idx = 0; idx < max; idx++) {
        if (idx % 4 === 0 && idx) {
          result.push(bits >> 16 & 255);
          result.push(bits >> 8 & 255);
          result.push(bits & 255);
        }
        bits = bits << 6 | map.indexOf(input.charAt(idx));
      }
      tailbits = max % 4 * 6;
      if (tailbits === 0) {
        result.push(bits >> 16 & 255);
        result.push(bits >> 8 & 255);
        result.push(bits & 255);
      } else if (tailbits === 18) {
        result.push(bits >> 10 & 255);
        result.push(bits >> 2 & 255);
      } else if (tailbits === 12) {
        result.push(bits >> 4 & 255);
      }
      if (NodeBuffer) {
        return NodeBuffer.from ? NodeBuffer.from(result) : new NodeBuffer(result);
      }
      return result;
    }
    function representYamlBinary(object) {
      var result = "", bits = 0, idx, tail, max = object.length, map = BASE64_MAP;
      for (idx = 0; idx < max; idx++) {
        if (idx % 3 === 0 && idx) {
          result += map[bits >> 18 & 63];
          result += map[bits >> 12 & 63];
          result += map[bits >> 6 & 63];
          result += map[bits & 63];
        }
        bits = (bits << 8) + object[idx];
      }
      tail = max % 3;
      if (tail === 0) {
        result += map[bits >> 18 & 63];
        result += map[bits >> 12 & 63];
        result += map[bits >> 6 & 63];
        result += map[bits & 63];
      } else if (tail === 2) {
        result += map[bits >> 10 & 63];
        result += map[bits >> 4 & 63];
        result += map[bits << 2 & 63];
        result += map[64];
      } else if (tail === 1) {
        result += map[bits >> 2 & 63];
        result += map[bits << 4 & 63];
        result += map[64];
        result += map[64];
      }
      return result;
    }
    function isBinary(object) {
      return NodeBuffer && NodeBuffer.isBuffer(object);
    }
    module2.exports = new Type("tag:yaml.org,2002:binary", {
      kind: "scalar",
      resolve: resolveYamlBinary,
      construct: constructYamlBinary,
      predicate: isBinary,
      represent: representYamlBinary
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/omap.js
var require_omap = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/omap.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var _toString = Object.prototype.toString;
    function resolveYamlOmap(data) {
      if (data === null) return true;
      var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        pairHasKey = false;
        if (_toString.call(pair) !== "[object Object]") return false;
        for (pairKey in pair) {
          if (_hasOwnProperty.call(pair, pairKey)) {
            if (!pairHasKey) pairHasKey = true;
            else return false;
          }
        }
        if (!pairHasKey) return false;
        if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
        else return false;
      }
      return true;
    }
    function constructYamlOmap(data) {
      return data !== null ? data : [];
    }
    module2.exports = new Type("tag:yaml.org,2002:omap", {
      kind: "sequence",
      resolve: resolveYamlOmap,
      construct: constructYamlOmap
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/pairs.js
var require_pairs = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/pairs.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var _toString = Object.prototype.toString;
    function resolveYamlPairs(data) {
      if (data === null) return true;
      var index, length, pair, keys, result, object = data;
      result = new Array(object.length);
      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        if (_toString.call(pair) !== "[object Object]") return false;
        keys = Object.keys(pair);
        if (keys.length !== 1) return false;
        result[index] = [keys[0], pair[keys[0]]];
      }
      return true;
    }
    function constructYamlPairs(data) {
      if (data === null) return [];
      var index, length, pair, keys, result, object = data;
      result = new Array(object.length);
      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        keys = Object.keys(pair);
        result[index] = [keys[0], pair[keys[0]]];
      }
      return result;
    }
    module2.exports = new Type("tag:yaml.org,2002:pairs", {
      kind: "sequence",
      resolve: resolveYamlPairs,
      construct: constructYamlPairs
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/set.js
var require_set = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/set.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    function resolveYamlSet(data) {
      if (data === null) return true;
      var key, object = data;
      for (key in object) {
        if (_hasOwnProperty.call(object, key)) {
          if (object[key] !== null) return false;
        }
      }
      return true;
    }
    function constructYamlSet(data) {
      return data !== null ? data : {};
    }
    module2.exports = new Type("tag:yaml.org,2002:set", {
      kind: "mapping",
      resolve: resolveYamlSet,
      construct: constructYamlSet
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/schema/default_safe.js
var require_default_safe = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema/default_safe.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      include: [
        require_core()
      ],
      implicit: [
        require_timestamp(),
        require_merge()
      ],
      explicit: [
        require_binary(),
        require_omap(),
        require_pairs(),
        require_set()
      ]
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/js/undefined.js
var require_undefined = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/js/undefined.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveJavascriptUndefined() {
      return true;
    }
    function constructJavascriptUndefined() {
      return void 0;
    }
    function representJavascriptUndefined() {
      return "";
    }
    function isUndefined(object) {
      return typeof object === "undefined";
    }
    module2.exports = new Type("tag:yaml.org,2002:js/undefined", {
      kind: "scalar",
      resolve: resolveJavascriptUndefined,
      construct: constructJavascriptUndefined,
      predicate: isUndefined,
      represent: representJavascriptUndefined
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/js/regexp.js
var require_regexp = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/js/regexp.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveJavascriptRegExp(data) {
      if (data === null) return false;
      if (data.length === 0) return false;
      var regexp = data, tail = /\/([gim]*)$/.exec(data), modifiers = "";
      if (regexp[0] === "/") {
        if (tail) modifiers = tail[1];
        if (modifiers.length > 3) return false;
        if (regexp[regexp.length - modifiers.length - 1] !== "/") return false;
      }
      return true;
    }
    function constructJavascriptRegExp(data) {
      var regexp = data, tail = /\/([gim]*)$/.exec(data), modifiers = "";
      if (regexp[0] === "/") {
        if (tail) modifiers = tail[1];
        regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
      }
      return new RegExp(regexp, modifiers);
    }
    function representJavascriptRegExp(object) {
      var result = "/" + object.source + "/";
      if (object.global) result += "g";
      if (object.multiline) result += "m";
      if (object.ignoreCase) result += "i";
      return result;
    }
    function isRegExp(object) {
      return Object.prototype.toString.call(object) === "[object RegExp]";
    }
    module2.exports = new Type("tag:yaml.org,2002:js/regexp", {
      kind: "scalar",
      resolve: resolveJavascriptRegExp,
      construct: constructJavascriptRegExp,
      predicate: isRegExp,
      represent: representJavascriptRegExp
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/js/function.js
var require_function = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/js/function.js"(exports2, module2) {
    "use strict";
    var esprima;
    try {
      _require = require;
      esprima = _require("esprima");
    } catch (_) {
      if (typeof window !== "undefined") esprima = window.esprima;
    }
    var _require;
    var Type = require_type();
    function resolveJavascriptFunction(data) {
      if (data === null) return false;
      try {
        var source = "(" + data + ")", ast = esprima.parse(source, { range: true });
        if (ast.type !== "Program" || ast.body.length !== 1 || ast.body[0].type !== "ExpressionStatement" || ast.body[0].expression.type !== "ArrowFunctionExpression" && ast.body[0].expression.type !== "FunctionExpression") {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    function constructJavascriptFunction(data) {
      var source = "(" + data + ")", ast = esprima.parse(source, { range: true }), params = [], body;
      if (ast.type !== "Program" || ast.body.length !== 1 || ast.body[0].type !== "ExpressionStatement" || ast.body[0].expression.type !== "ArrowFunctionExpression" && ast.body[0].expression.type !== "FunctionExpression") {
        throw new Error("Failed to resolve function");
      }
      ast.body[0].expression.params.forEach(function(param) {
        params.push(param.name);
      });
      body = ast.body[0].expression.body.range;
      if (ast.body[0].expression.body.type === "BlockStatement") {
        return new Function(params, source.slice(body[0] + 1, body[1] - 1));
      }
      return new Function(params, "return " + source.slice(body[0], body[1]));
    }
    function representJavascriptFunction(object) {
      return object.toString();
    }
    function isFunction(object) {
      return Object.prototype.toString.call(object) === "[object Function]";
    }
    module2.exports = new Type("tag:yaml.org,2002:js/function", {
      kind: "scalar",
      resolve: resolveJavascriptFunction,
      construct: constructJavascriptFunction,
      predicate: isFunction,
      represent: representJavascriptFunction
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/schema/default_full.js
var require_default_full = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema/default_full.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = Schema.DEFAULT = new Schema({
      include: [
        require_default_safe()
      ],
      explicit: [
        require_undefined(),
        require_regexp(),
        require_function()
      ]
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/loader.js
var require_loader = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/loader.js"(exports2, module2) {
    "use strict";
    var common = require_common3();
    var YAMLException = require_exception();
    var Mark = require_mark();
    var DEFAULT_SAFE_SCHEMA = require_default_safe();
    var DEFAULT_FULL_SCHEMA = require_default_full();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var CONTEXT_FLOW_IN = 1;
    var CONTEXT_FLOW_OUT = 2;
    var CONTEXT_BLOCK_IN = 3;
    var CONTEXT_BLOCK_OUT = 4;
    var CHOMPING_CLIP = 1;
    var CHOMPING_STRIP = 2;
    var CHOMPING_KEEP = 3;
    var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
    var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
    var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
    var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
    var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
    function _class(obj) {
      return Object.prototype.toString.call(obj);
    }
    function is_EOL(c) {
      return c === 10 || c === 13;
    }
    function is_WHITE_SPACE(c) {
      return c === 9 || c === 32;
    }
    function is_WS_OR_EOL(c) {
      return c === 9 || c === 32 || c === 10 || c === 13;
    }
    function is_FLOW_INDICATOR(c) {
      return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
    }
    function fromHexCode(c) {
      var lc;
      if (48 <= c && c <= 57) {
        return c - 48;
      }
      lc = c | 32;
      if (97 <= lc && lc <= 102) {
        return lc - 97 + 10;
      }
      return -1;
    }
    function escapedHexLen(c) {
      if (c === 120) {
        return 2;
      }
      if (c === 117) {
        return 4;
      }
      if (c === 85) {
        return 8;
      }
      return 0;
    }
    function fromDecimalCode(c) {
      if (48 <= c && c <= 57) {
        return c - 48;
      }
      return -1;
    }
    function simpleEscapeSequence(c) {
      return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
    }
    function charFromCodepoint(c) {
      if (c <= 65535) {
        return String.fromCharCode(c);
      }
      return String.fromCharCode(
        (c - 65536 >> 10) + 55296,
        (c - 65536 & 1023) + 56320
      );
    }
    function setProperty(object, key, value) {
      if (key === "__proto__") {
        Object.defineProperty(object, key, {
          configurable: true,
          enumerable: true,
          writable: true,
          value
        });
      } else {
        object[key] = value;
      }
    }
    var simpleEscapeCheck = new Array(256);
    var simpleEscapeMap = new Array(256);
    for (i = 0; i < 256; i++) {
      simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
      simpleEscapeMap[i] = simpleEscapeSequence(i);
    }
    var i;
    function State(input, options2) {
      this.input = input;
      this.filename = options2["filename"] || null;
      this.schema = options2["schema"] || DEFAULT_FULL_SCHEMA;
      this.onWarning = options2["onWarning"] || null;
      this.legacy = options2["legacy"] || false;
      this.json = options2["json"] || false;
      this.listener = options2["listener"] || null;
      this.implicitTypes = this.schema.compiledImplicit;
      this.typeMap = this.schema.compiledTypeMap;
      this.length = input.length;
      this.position = 0;
      this.line = 0;
      this.lineStart = 0;
      this.lineIndent = 0;
      this.documents = [];
    }
    function generateError(state, message) {
      return new YAMLException(
        message,
        new Mark(state.filename, state.input, state.position, state.line, state.position - state.lineStart)
      );
    }
    function throwError(state, message) {
      throw generateError(state, message);
    }
    function throwWarning(state, message) {
      if (state.onWarning) {
        state.onWarning.call(null, generateError(state, message));
      }
    }
    var directiveHandlers = {
      YAML: function handleYamlDirective(state, name, args) {
        var match, major, minor;
        if (state.version !== null) {
          throwError(state, "duplication of %YAML directive");
        }
        if (args.length !== 1) {
          throwError(state, "YAML directive accepts exactly one argument");
        }
        match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
        if (match === null) {
          throwError(state, "ill-formed argument of the YAML directive");
        }
        major = parseInt(match[1], 10);
        minor = parseInt(match[2], 10);
        if (major !== 1) {
          throwError(state, "unacceptable YAML version of the document");
        }
        state.version = args[0];
        state.checkLineBreaks = minor < 2;
        if (minor !== 1 && minor !== 2) {
          throwWarning(state, "unsupported YAML version of the document");
        }
      },
      TAG: function handleTagDirective(state, name, args) {
        var handle, prefix;
        if (args.length !== 2) {
          throwError(state, "TAG directive accepts exactly two arguments");
        }
        handle = args[0];
        prefix = args[1];
        if (!PATTERN_TAG_HANDLE.test(handle)) {
          throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
        }
        if (_hasOwnProperty.call(state.tagMap, handle)) {
          throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
        }
        if (!PATTERN_TAG_URI.test(prefix)) {
          throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
        }
        state.tagMap[handle] = prefix;
      }
    };
    function captureSegment(state, start, end, checkJson) {
      var _position, _length, _character, _result;
      if (start < end) {
        _result = state.input.slice(start, end);
        if (checkJson) {
          for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
            _character = _result.charCodeAt(_position);
            if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
              throwError(state, "expected valid JSON character");
            }
          }
        } else if (PATTERN_NON_PRINTABLE.test(_result)) {
          throwError(state, "the stream contains non-printable characters");
        }
        state.result += _result;
      }
    }
    function mergeMappings(state, destination, source, overridableKeys) {
      var sourceKeys, key, index, quantity;
      if (!common.isObject(source)) {
        throwError(state, "cannot merge mappings; the provided source object is unacceptable");
      }
      sourceKeys = Object.keys(source);
      for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
        key = sourceKeys[index];
        if (!_hasOwnProperty.call(destination, key)) {
          setProperty(destination, key, source[key]);
          overridableKeys[key] = true;
        }
      }
    }
    function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
      var index, quantity;
      if (Array.isArray(keyNode)) {
        keyNode = Array.prototype.slice.call(keyNode);
        for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
          if (Array.isArray(keyNode[index])) {
            throwError(state, "nested arrays are not supported inside keys");
          }
          if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
            keyNode[index] = "[object Object]";
          }
        }
      }
      if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
        keyNode = "[object Object]";
      }
      keyNode = String(keyNode);
      if (_result === null) {
        _result = {};
      }
      if (keyTag === "tag:yaml.org,2002:merge") {
        if (Array.isArray(valueNode)) {
          for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
            mergeMappings(state, _result, valueNode[index], overridableKeys);
          }
        } else {
          mergeMappings(state, _result, valueNode, overridableKeys);
        }
      } else {
        if (!state.json && !_hasOwnProperty.call(overridableKeys, keyNode) && _hasOwnProperty.call(_result, keyNode)) {
          state.line = startLine || state.line;
          state.position = startPos || state.position;
          throwError(state, "duplicated mapping key");
        }
        setProperty(_result, keyNode, valueNode);
        delete overridableKeys[keyNode];
      }
      return _result;
    }
    function readLineBreak(state) {
      var ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 10) {
        state.position++;
      } else if (ch === 13) {
        state.position++;
        if (state.input.charCodeAt(state.position) === 10) {
          state.position++;
        }
      } else {
        throwError(state, "a line break is expected");
      }
      state.line += 1;
      state.lineStart = state.position;
    }
    function skipSeparationSpace(state, allowComments, checkIndent) {
      var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (allowComments && ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (ch !== 10 && ch !== 13 && ch !== 0);
        }
        if (is_EOL(ch)) {
          readLineBreak(state);
          ch = state.input.charCodeAt(state.position);
          lineBreaks++;
          state.lineIndent = 0;
          while (ch === 32) {
            state.lineIndent++;
            ch = state.input.charCodeAt(++state.position);
          }
        } else {
          break;
        }
      }
      if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
        throwWarning(state, "deficient indentation");
      }
      return lineBreaks;
    }
    function testDocumentSeparator(state) {
      var _position = state.position, ch;
      ch = state.input.charCodeAt(_position);
      if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
        _position += 3;
        ch = state.input.charCodeAt(_position);
        if (ch === 0 || is_WS_OR_EOL(ch)) {
          return true;
        }
      }
      return false;
    }
    function writeFoldedLines(state, count) {
      if (count === 1) {
        state.result += " ";
      } else if (count > 1) {
        state.result += common.repeat("\n", count - 1);
      }
    }
    function readPlainScalar(state, nodeIndent, withinFlowCollection) {
      var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
      ch = state.input.charCodeAt(state.position);
      if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
        return false;
      }
      if (ch === 63 || ch === 45) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
          return false;
        }
      }
      state.kind = "scalar";
      state.result = "";
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
      while (ch !== 0) {
        if (ch === 58) {
          following = state.input.charCodeAt(state.position + 1);
          if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
            break;
          }
        } else if (ch === 35) {
          preceding = state.input.charCodeAt(state.position - 1);
          if (is_WS_OR_EOL(preceding)) {
            break;
          }
        } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
          break;
        } else if (is_EOL(ch)) {
          _line = state.line;
          _lineStart = state.lineStart;
          _lineIndent = state.lineIndent;
          skipSeparationSpace(state, false, -1);
          if (state.lineIndent >= nodeIndent) {
            hasPendingContent = true;
            ch = state.input.charCodeAt(state.position);
            continue;
          } else {
            state.position = captureEnd;
            state.line = _line;
            state.lineStart = _lineStart;
            state.lineIndent = _lineIndent;
            break;
          }
        }
        if (hasPendingContent) {
          captureSegment(state, captureStart, captureEnd, false);
          writeFoldedLines(state, state.line - _line);
          captureStart = captureEnd = state.position;
          hasPendingContent = false;
        }
        if (!is_WHITE_SPACE(ch)) {
          captureEnd = state.position + 1;
        }
        ch = state.input.charCodeAt(++state.position);
      }
      captureSegment(state, captureStart, captureEnd, false);
      if (state.result) {
        return true;
      }
      state.kind = _kind;
      state.result = _result;
      return false;
    }
    function readSingleQuotedScalar(state, nodeIndent) {
      var ch, captureStart, captureEnd;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 39) {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      state.position++;
      captureStart = captureEnd = state.position;
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        if (ch === 39) {
          captureSegment(state, captureStart, state.position, true);
          ch = state.input.charCodeAt(++state.position);
          if (ch === 39) {
            captureStart = state.position;
            state.position++;
            captureEnd = state.position;
          } else {
            return true;
          }
        } else if (is_EOL(ch)) {
          captureSegment(state, captureStart, captureEnd, true);
          writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
          captureStart = captureEnd = state.position;
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
          throwError(state, "unexpected end of the document within a single quoted scalar");
        } else {
          state.position++;
          captureEnd = state.position;
        }
      }
      throwError(state, "unexpected end of the stream within a single quoted scalar");
    }
    function readDoubleQuotedScalar(state, nodeIndent) {
      var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 34) {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      state.position++;
      captureStart = captureEnd = state.position;
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        if (ch === 34) {
          captureSegment(state, captureStart, state.position, true);
          state.position++;
          return true;
        } else if (ch === 92) {
          captureSegment(state, captureStart, state.position, true);
          ch = state.input.charCodeAt(++state.position);
          if (is_EOL(ch)) {
            skipSeparationSpace(state, false, nodeIndent);
          } else if (ch < 256 && simpleEscapeCheck[ch]) {
            state.result += simpleEscapeMap[ch];
            state.position++;
          } else if ((tmp = escapedHexLen(ch)) > 0) {
            hexLength = tmp;
            hexResult = 0;
            for (; hexLength > 0; hexLength--) {
              ch = state.input.charCodeAt(++state.position);
              if ((tmp = fromHexCode(ch)) >= 0) {
                hexResult = (hexResult << 4) + tmp;
              } else {
                throwError(state, "expected hexadecimal character");
              }
            }
            state.result += charFromCodepoint(hexResult);
            state.position++;
          } else {
            throwError(state, "unknown escape sequence");
          }
          captureStart = captureEnd = state.position;
        } else if (is_EOL(ch)) {
          captureSegment(state, captureStart, captureEnd, true);
          writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
          captureStart = captureEnd = state.position;
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
          throwError(state, "unexpected end of the document within a double quoted scalar");
        } else {
          state.position++;
          captureEnd = state.position;
        }
      }
      throwError(state, "unexpected end of the stream within a double quoted scalar");
    }
    function readFlowCollection(state, nodeIndent) {
      var readNext = true, _line, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = {}, keyNode, keyTag, valueNode, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 91) {
        terminator = 93;
        isMapping = false;
        _result = [];
      } else if (ch === 123) {
        terminator = 125;
        isMapping = true;
        _result = {};
      } else {
        return false;
      }
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(++state.position);
      while (ch !== 0) {
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === terminator) {
          state.position++;
          state.tag = _tag;
          state.anchor = _anchor;
          state.kind = isMapping ? "mapping" : "sequence";
          state.result = _result;
          return true;
        } else if (!readNext) {
          throwError(state, "missed comma between flow collection entries");
        }
        keyTag = keyNode = valueNode = null;
        isPair = isExplicitPair = false;
        if (ch === 63) {
          following = state.input.charCodeAt(state.position + 1);
          if (is_WS_OR_EOL(following)) {
            isPair = isExplicitPair = true;
            state.position++;
            skipSeparationSpace(state, true, nodeIndent);
          }
        }
        _line = state.line;
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        keyTag = state.tag;
        keyNode = state.result;
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if ((isExplicitPair || state.line === _line) && ch === 58) {
          isPair = true;
          ch = state.input.charCodeAt(++state.position);
          skipSeparationSpace(state, true, nodeIndent);
          composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
          valueNode = state.result;
        }
        if (isMapping) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
        } else if (isPair) {
          _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode));
        } else {
          _result.push(keyNode);
        }
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === 44) {
          readNext = true;
          ch = state.input.charCodeAt(++state.position);
        } else {
          readNext = false;
        }
      }
      throwError(state, "unexpected end of the stream within a flow collection");
    }
    function readBlockScalar(state, nodeIndent) {
      var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 124) {
        folding = false;
      } else if (ch === 62) {
        folding = true;
      } else {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      while (ch !== 0) {
        ch = state.input.charCodeAt(++state.position);
        if (ch === 43 || ch === 45) {
          if (CHOMPING_CLIP === chomping) {
            chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
          } else {
            throwError(state, "repeat of a chomping mode identifier");
          }
        } else if ((tmp = fromDecimalCode(ch)) >= 0) {
          if (tmp === 0) {
            throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
          } else if (!detectedIndent) {
            textIndent = nodeIndent + tmp - 1;
            detectedIndent = true;
          } else {
            throwError(state, "repeat of an indentation width identifier");
          }
        } else {
          break;
        }
      }
      if (is_WHITE_SPACE(ch)) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (is_WHITE_SPACE(ch));
        if (ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (!is_EOL(ch) && ch !== 0);
        }
      }
      while (ch !== 0) {
        readLineBreak(state);
        state.lineIndent = 0;
        ch = state.input.charCodeAt(state.position);
        while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }
        if (!detectedIndent && state.lineIndent > textIndent) {
          textIndent = state.lineIndent;
        }
        if (is_EOL(ch)) {
          emptyLines++;
          continue;
        }
        if (state.lineIndent < textIndent) {
          if (chomping === CHOMPING_KEEP) {
            state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
          } else if (chomping === CHOMPING_CLIP) {
            if (didReadContent) {
              state.result += "\n";
            }
          }
          break;
        }
        if (folding) {
          if (is_WHITE_SPACE(ch)) {
            atMoreIndented = true;
            state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
          } else if (atMoreIndented) {
            atMoreIndented = false;
            state.result += common.repeat("\n", emptyLines + 1);
          } else if (emptyLines === 0) {
            if (didReadContent) {
              state.result += " ";
            }
          } else {
            state.result += common.repeat("\n", emptyLines);
          }
        } else {
          state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        }
        didReadContent = true;
        detectedIndent = true;
        emptyLines = 0;
        captureStart = state.position;
        while (!is_EOL(ch) && ch !== 0) {
          ch = state.input.charCodeAt(++state.position);
        }
        captureSegment(state, captureStart, state.position, false);
      }
      return true;
    }
    function readBlockSequence(state, nodeIndent) {
      var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        if (ch !== 45) {
          break;
        }
        following = state.input.charCodeAt(state.position + 1);
        if (!is_WS_OR_EOL(following)) {
          break;
        }
        detected = true;
        state.position++;
        if (skipSeparationSpace(state, true, -1)) {
          if (state.lineIndent <= nodeIndent) {
            _result.push(null);
            ch = state.input.charCodeAt(state.position);
            continue;
          }
        }
        _line = state.line;
        composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
        _result.push(state.result);
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
          throwError(state, "bad indentation of a sequence entry");
        } else if (state.lineIndent < nodeIndent) {
          break;
        }
      }
      if (detected) {
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = "sequence";
        state.result = _result;
        return true;
      }
      return false;
    }
    function readBlockMapping(state, nodeIndent, flowIndent) {
      var following, allowCompact, _line, _pos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = {}, keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        following = state.input.charCodeAt(state.position + 1);
        _line = state.line;
        _pos = state.position;
        if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
          if (ch === 63) {
            if (atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
              keyTag = keyNode = valueNode = null;
            }
            detected = true;
            atExplicitKey = true;
            allowCompact = true;
          } else if (atExplicitKey) {
            atExplicitKey = false;
            allowCompact = true;
          } else {
            throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
          }
          state.position += 1;
          ch = following;
        } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
          if (state.line === _line) {
            ch = state.input.charCodeAt(state.position);
            while (is_WHITE_SPACE(ch)) {
              ch = state.input.charCodeAt(++state.position);
            }
            if (ch === 58) {
              ch = state.input.charCodeAt(++state.position);
              if (!is_WS_OR_EOL(ch)) {
                throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
              }
              if (atExplicitKey) {
                storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
                keyTag = keyNode = valueNode = null;
              }
              detected = true;
              atExplicitKey = false;
              allowCompact = false;
              keyTag = state.tag;
              keyNode = state.result;
            } else if (detected) {
              throwError(state, "can not read an implicit mapping pair; a colon is missed");
            } else {
              state.tag = _tag;
              state.anchor = _anchor;
              return true;
            }
          } else if (detected) {
            throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
          } else {
            state.tag = _tag;
            state.anchor = _anchor;
            return true;
          }
        } else {
          break;
        }
        if (state.line === _line || state.lineIndent > nodeIndent) {
          if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
            if (atExplicitKey) {
              keyNode = state.result;
            } else {
              valueNode = state.result;
            }
          }
          if (!atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _pos);
            keyTag = keyNode = valueNode = null;
          }
          skipSeparationSpace(state, true, -1);
          ch = state.input.charCodeAt(state.position);
        }
        if (state.lineIndent > nodeIndent && ch !== 0) {
          throwError(state, "bad indentation of a mapping entry");
        } else if (state.lineIndent < nodeIndent) {
          break;
        }
      }
      if (atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
      }
      if (detected) {
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = "mapping";
        state.result = _result;
      }
      return detected;
    }
    function readTagProperty(state) {
      var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 33) return false;
      if (state.tag !== null) {
        throwError(state, "duplication of a tag property");
      }
      ch = state.input.charCodeAt(++state.position);
      if (ch === 60) {
        isVerbatim = true;
        ch = state.input.charCodeAt(++state.position);
      } else if (ch === 33) {
        isNamed = true;
        tagHandle = "!!";
        ch = state.input.charCodeAt(++state.position);
      } else {
        tagHandle = "!";
      }
      _position = state.position;
      if (isVerbatim) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && ch !== 62);
        if (state.position < state.length) {
          tagName = state.input.slice(_position, state.position);
          ch = state.input.charCodeAt(++state.position);
        } else {
          throwError(state, "unexpected end of the stream within a verbatim tag");
        }
      } else {
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          if (ch === 33) {
            if (!isNamed) {
              tagHandle = state.input.slice(_position - 1, state.position + 1);
              if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
                throwError(state, "named tag handle cannot contain such characters");
              }
              isNamed = true;
              _position = state.position + 1;
            } else {
              throwError(state, "tag suffix cannot contain exclamation marks");
            }
          }
          ch = state.input.charCodeAt(++state.position);
        }
        tagName = state.input.slice(_position, state.position);
        if (PATTERN_FLOW_INDICATORS.test(tagName)) {
          throwError(state, "tag suffix cannot contain flow indicator characters");
        }
      }
      if (tagName && !PATTERN_TAG_URI.test(tagName)) {
        throwError(state, "tag name cannot contain such characters: " + tagName);
      }
      if (isVerbatim) {
        state.tag = tagName;
      } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
        state.tag = state.tagMap[tagHandle] + tagName;
      } else if (tagHandle === "!") {
        state.tag = "!" + tagName;
      } else if (tagHandle === "!!") {
        state.tag = "tag:yaml.org,2002:" + tagName;
      } else {
        throwError(state, 'undeclared tag handle "' + tagHandle + '"');
      }
      return true;
    }
    function readAnchorProperty(state) {
      var _position, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 38) return false;
      if (state.anchor !== null) {
        throwError(state, "duplication of an anchor property");
      }
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (state.position === _position) {
        throwError(state, "name of an anchor node must contain at least one character");
      }
      state.anchor = state.input.slice(_position, state.position);
      return true;
    }
    function readAlias(state) {
      var _position, alias, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 42) return false;
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (state.position === _position) {
        throwError(state, "name of an alias node must contain at least one character");
      }
      alias = state.input.slice(_position, state.position);
      if (!_hasOwnProperty.call(state.anchorMap, alias)) {
        throwError(state, 'unidentified alias "' + alias + '"');
      }
      state.result = state.anchorMap[alias];
      skipSeparationSpace(state, true, -1);
      return true;
    }
    function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
      var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, type, flowIndent, blockIndent;
      if (state.listener !== null) {
        state.listener("open", state);
      }
      state.tag = null;
      state.anchor = null;
      state.kind = null;
      state.result = null;
      allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
      if (allowToSeek) {
        if (skipSeparationSpace(state, true, -1)) {
          atNewLine = true;
          if (state.lineIndent > parentIndent) {
            indentStatus = 1;
          } else if (state.lineIndent === parentIndent) {
            indentStatus = 0;
          } else if (state.lineIndent < parentIndent) {
            indentStatus = -1;
          }
        }
      }
      if (indentStatus === 1) {
        while (readTagProperty(state) || readAnchorProperty(state)) {
          if (skipSeparationSpace(state, true, -1)) {
            atNewLine = true;
            allowBlockCollections = allowBlockStyles;
            if (state.lineIndent > parentIndent) {
              indentStatus = 1;
            } else if (state.lineIndent === parentIndent) {
              indentStatus = 0;
            } else if (state.lineIndent < parentIndent) {
              indentStatus = -1;
            }
          } else {
            allowBlockCollections = false;
          }
        }
      }
      if (allowBlockCollections) {
        allowBlockCollections = atNewLine || allowCompact;
      }
      if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
        if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
          flowIndent = parentIndent;
        } else {
          flowIndent = parentIndent + 1;
        }
        blockIndent = state.position - state.lineStart;
        if (indentStatus === 1) {
          if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
            hasContent = true;
          } else {
            if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
              hasContent = true;
            } else if (readAlias(state)) {
              hasContent = true;
              if (state.tag !== null || state.anchor !== null) {
                throwError(state, "alias node should not have any properties");
              }
            } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
              hasContent = true;
              if (state.tag === null) {
                state.tag = "?";
              }
            }
            if (state.anchor !== null) {
              state.anchorMap[state.anchor] = state.result;
            }
          }
        } else if (indentStatus === 0) {
          hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
        }
      }
      if (state.tag !== null && state.tag !== "!") {
        if (state.tag === "?") {
          if (state.result !== null && state.kind !== "scalar") {
            throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
          }
          for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
            type = state.implicitTypes[typeIndex];
            if (type.resolve(state.result)) {
              state.result = type.construct(state.result);
              state.tag = type.tag;
              if (state.anchor !== null) {
                state.anchorMap[state.anchor] = state.result;
              }
              break;
            }
          }
        } else if (_hasOwnProperty.call(state.typeMap[state.kind || "fallback"], state.tag)) {
          type = state.typeMap[state.kind || "fallback"][state.tag];
          if (state.result !== null && type.kind !== state.kind) {
            throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
          }
          if (!type.resolve(state.result)) {
            throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
          } else {
            state.result = type.construct(state.result);
            if (state.anchor !== null) {
              state.anchorMap[state.anchor] = state.result;
            }
          }
        } else {
          throwError(state, "unknown tag !<" + state.tag + ">");
        }
      }
      if (state.listener !== null) {
        state.listener("close", state);
      }
      return state.tag !== null || state.anchor !== null || hasContent;
    }
    function readDocument(state) {
      var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
      state.version = null;
      state.checkLineBreaks = state.legacy;
      state.tagMap = {};
      state.anchorMap = {};
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if (state.lineIndent > 0 || ch !== 37) {
          break;
        }
        hasDirectives = true;
        ch = state.input.charCodeAt(++state.position);
        _position = state.position;
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        directiveName = state.input.slice(_position, state.position);
        directiveArgs = [];
        if (directiveName.length < 1) {
          throwError(state, "directive name must not be less than one character in length");
        }
        while (ch !== 0) {
          while (is_WHITE_SPACE(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          if (ch === 35) {
            do {
              ch = state.input.charCodeAt(++state.position);
            } while (ch !== 0 && !is_EOL(ch));
            break;
          }
          if (is_EOL(ch)) break;
          _position = state.position;
          while (ch !== 0 && !is_WS_OR_EOL(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          directiveArgs.push(state.input.slice(_position, state.position));
        }
        if (ch !== 0) readLineBreak(state);
        if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
          directiveHandlers[directiveName](state, directiveName, directiveArgs);
        } else {
          throwWarning(state, 'unknown document directive "' + directiveName + '"');
        }
      }
      skipSeparationSpace(state, true, -1);
      if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
      } else if (hasDirectives) {
        throwError(state, "directives end mark is expected");
      }
      composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
      skipSeparationSpace(state, true, -1);
      if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
        throwWarning(state, "non-ASCII line breaks are interpreted as content");
      }
      state.documents.push(state.result);
      if (state.position === state.lineStart && testDocumentSeparator(state)) {
        if (state.input.charCodeAt(state.position) === 46) {
          state.position += 3;
          skipSeparationSpace(state, true, -1);
        }
        return;
      }
      if (state.position < state.length - 1) {
        throwError(state, "end of the stream or a document separator is expected");
      } else {
        return;
      }
    }
    function loadDocuments(input, options2) {
      input = String(input);
      options2 = options2 || {};
      if (input.length !== 0) {
        if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
          input += "\n";
        }
        if (input.charCodeAt(0) === 65279) {
          input = input.slice(1);
        }
      }
      var state = new State(input, options2);
      var nullpos = input.indexOf("\0");
      if (nullpos !== -1) {
        state.position = nullpos;
        throwError(state, "null byte is not allowed in input");
      }
      state.input += "\0";
      while (state.input.charCodeAt(state.position) === 32) {
        state.lineIndent += 1;
        state.position += 1;
      }
      while (state.position < state.length - 1) {
        readDocument(state);
      }
      return state.documents;
    }
    function loadAll(input, iterator, options2) {
      if (iterator !== null && typeof iterator === "object" && typeof options2 === "undefined") {
        options2 = iterator;
        iterator = null;
      }
      var documents = loadDocuments(input, options2);
      if (typeof iterator !== "function") {
        return documents;
      }
      for (var index = 0, length = documents.length; index < length; index += 1) {
        iterator(documents[index]);
      }
    }
    function load(input, options2) {
      var documents = loadDocuments(input, options2);
      if (documents.length === 0) {
        return void 0;
      } else if (documents.length === 1) {
        return documents[0];
      }
      throw new YAMLException("expected a single document in the stream, but found more");
    }
    function safeLoadAll(input, iterator, options2) {
      if (typeof iterator === "object" && iterator !== null && typeof options2 === "undefined") {
        options2 = iterator;
        iterator = null;
      }
      return loadAll(input, iterator, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options2));
    }
    function safeLoad(input, options2) {
      return load(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options2));
    }
    module2.exports.loadAll = loadAll;
    module2.exports.load = load;
    module2.exports.safeLoadAll = safeLoadAll;
    module2.exports.safeLoad = safeLoad;
  }
});

// node_modules/js-yaml/lib/js-yaml/dumper.js
var require_dumper = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/dumper.js"(exports2, module2) {
    "use strict";
    var common = require_common3();
    var YAMLException = require_exception();
    var DEFAULT_FULL_SCHEMA = require_default_full();
    var DEFAULT_SAFE_SCHEMA = require_default_safe();
    var _toString = Object.prototype.toString;
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var CHAR_TAB = 9;
    var CHAR_LINE_FEED = 10;
    var CHAR_CARRIAGE_RETURN = 13;
    var CHAR_SPACE = 32;
    var CHAR_EXCLAMATION = 33;
    var CHAR_DOUBLE_QUOTE = 34;
    var CHAR_SHARP = 35;
    var CHAR_PERCENT = 37;
    var CHAR_AMPERSAND = 38;
    var CHAR_SINGLE_QUOTE = 39;
    var CHAR_ASTERISK = 42;
    var CHAR_COMMA = 44;
    var CHAR_MINUS = 45;
    var CHAR_COLON = 58;
    var CHAR_EQUALS = 61;
    var CHAR_GREATER_THAN = 62;
    var CHAR_QUESTION = 63;
    var CHAR_COMMERCIAL_AT = 64;
    var CHAR_LEFT_SQUARE_BRACKET = 91;
    var CHAR_RIGHT_SQUARE_BRACKET = 93;
    var CHAR_GRAVE_ACCENT = 96;
    var CHAR_LEFT_CURLY_BRACKET = 123;
    var CHAR_VERTICAL_LINE = 124;
    var CHAR_RIGHT_CURLY_BRACKET = 125;
    var ESCAPE_SEQUENCES = {};
    ESCAPE_SEQUENCES[0] = "\\0";
    ESCAPE_SEQUENCES[7] = "\\a";
    ESCAPE_SEQUENCES[8] = "\\b";
    ESCAPE_SEQUENCES[9] = "\\t";
    ESCAPE_SEQUENCES[10] = "\\n";
    ESCAPE_SEQUENCES[11] = "\\v";
    ESCAPE_SEQUENCES[12] = "\\f";
    ESCAPE_SEQUENCES[13] = "\\r";
    ESCAPE_SEQUENCES[27] = "\\e";
    ESCAPE_SEQUENCES[34] = '\\"';
    ESCAPE_SEQUENCES[92] = "\\\\";
    ESCAPE_SEQUENCES[133] = "\\N";
    ESCAPE_SEQUENCES[160] = "\\_";
    ESCAPE_SEQUENCES[8232] = "\\L";
    ESCAPE_SEQUENCES[8233] = "\\P";
    var DEPRECATED_BOOLEANS_SYNTAX = [
      "y",
      "Y",
      "yes",
      "Yes",
      "YES",
      "on",
      "On",
      "ON",
      "n",
      "N",
      "no",
      "No",
      "NO",
      "off",
      "Off",
      "OFF"
    ];
    function compileStyleMap(schema, map) {
      var result, keys, index, length, tag, style, type;
      if (map === null) return {};
      result = {};
      keys = Object.keys(map);
      for (index = 0, length = keys.length; index < length; index += 1) {
        tag = keys[index];
        style = String(map[tag]);
        if (tag.slice(0, 2) === "!!") {
          tag = "tag:yaml.org,2002:" + tag.slice(2);
        }
        type = schema.compiledTypeMap["fallback"][tag];
        if (type && _hasOwnProperty.call(type.styleAliases, style)) {
          style = type.styleAliases[style];
        }
        result[tag] = style;
      }
      return result;
    }
    function encodeHex(character) {
      var string, handle, length;
      string = character.toString(16).toUpperCase();
      if (character <= 255) {
        handle = "x";
        length = 2;
      } else if (character <= 65535) {
        handle = "u";
        length = 4;
      } else if (character <= 4294967295) {
        handle = "U";
        length = 8;
      } else {
        throw new YAMLException("code point within a string may not be greater than 0xFFFFFFFF");
      }
      return "\\" + handle + common.repeat("0", length - string.length) + string;
    }
    function State(options2) {
      this.schema = options2["schema"] || DEFAULT_FULL_SCHEMA;
      this.indent = Math.max(1, options2["indent"] || 2);
      this.noArrayIndent = options2["noArrayIndent"] || false;
      this.skipInvalid = options2["skipInvalid"] || false;
      this.flowLevel = common.isNothing(options2["flowLevel"]) ? -1 : options2["flowLevel"];
      this.styleMap = compileStyleMap(this.schema, options2["styles"] || null);
      this.sortKeys = options2["sortKeys"] || false;
      this.lineWidth = options2["lineWidth"] || 80;
      this.noRefs = options2["noRefs"] || false;
      this.noCompatMode = options2["noCompatMode"] || false;
      this.condenseFlow = options2["condenseFlow"] || false;
      this.implicitTypes = this.schema.compiledImplicit;
      this.explicitTypes = this.schema.compiledExplicit;
      this.tag = null;
      this.result = "";
      this.duplicates = [];
      this.usedDuplicates = null;
    }
    function indentString(string, spaces) {
      var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
      while (position < length) {
        next = string.indexOf("\n", position);
        if (next === -1) {
          line = string.slice(position);
          position = length;
        } else {
          line = string.slice(position, next + 1);
          position = next + 1;
        }
        if (line.length && line !== "\n") result += ind;
        result += line;
      }
      return result;
    }
    function generateNextLine(state, level) {
      return "\n" + common.repeat(" ", state.indent * level);
    }
    function testImplicitResolving(state, str2) {
      var index, length, type;
      for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
        type = state.implicitTypes[index];
        if (type.resolve(str2)) {
          return true;
        }
      }
      return false;
    }
    function isWhitespace(c) {
      return c === CHAR_SPACE || c === CHAR_TAB;
    }
    function isPrintable(c) {
      return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== 65279 || 65536 <= c && c <= 1114111;
    }
    function isNsChar(c) {
      return isPrintable(c) && !isWhitespace(c) && c !== 65279 && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
    }
    function isPlainSafe(c, prev) {
      return isPrintable(c) && c !== 65279 && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_COLON && (c !== CHAR_SHARP || prev && isNsChar(prev));
    }
    function isPlainSafeFirst(c) {
      return isPrintable(c) && c !== 65279 && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
    }
    function needIndentIndicator(string) {
      var leadingSpaceRe = /^\n* /;
      return leadingSpaceRe.test(string);
    }
    var STYLE_PLAIN = 1;
    var STYLE_SINGLE = 2;
    var STYLE_LITERAL = 3;
    var STYLE_FOLDED = 4;
    var STYLE_DOUBLE = 5;
    function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
      var i;
      var char, prev_char;
      var hasLineBreak = false;
      var hasFoldableLine = false;
      var shouldTrackWidth = lineWidth !== -1;
      var previousLineBreak = -1;
      var plain = isPlainSafeFirst(string.charCodeAt(0)) && !isWhitespace(string.charCodeAt(string.length - 1));
      if (singleLineOnly) {
        for (i = 0; i < string.length; i++) {
          char = string.charCodeAt(i);
          if (!isPrintable(char)) {
            return STYLE_DOUBLE;
          }
          prev_char = i > 0 ? string.charCodeAt(i - 1) : null;
          plain = plain && isPlainSafe(char, prev_char);
        }
      } else {
        for (i = 0; i < string.length; i++) {
          char = string.charCodeAt(i);
          if (char === CHAR_LINE_FEED) {
            hasLineBreak = true;
            if (shouldTrackWidth) {
              hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
              i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
              previousLineBreak = i;
            }
          } else if (!isPrintable(char)) {
            return STYLE_DOUBLE;
          }
          prev_char = i > 0 ? string.charCodeAt(i - 1) : null;
          plain = plain && isPlainSafe(char, prev_char);
        }
        hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
      }
      if (!hasLineBreak && !hasFoldableLine) {
        return plain && !testAmbiguousType(string) ? STYLE_PLAIN : STYLE_SINGLE;
      }
      if (indentPerLevel > 9 && needIndentIndicator(string)) {
        return STYLE_DOUBLE;
      }
      return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
    }
    function writeScalar(state, string, level, iskey) {
      state.dump = (function() {
        if (string.length === 0) {
          return "''";
        }
        if (!state.noCompatMode && DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1) {
          return "'" + string + "'";
        }
        var indent = state.indent * Math.max(1, level);
        var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
        var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
        function testAmbiguity(string2) {
          return testImplicitResolving(state, string2);
        }
        switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity)) {
          case STYLE_PLAIN:
            return string;
          case STYLE_SINGLE:
            return "'" + string.replace(/'/g, "''") + "'";
          case STYLE_LITERAL:
            return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
          case STYLE_FOLDED:
            return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
          case STYLE_DOUBLE:
            return '"' + escapeString(string, lineWidth) + '"';
          default:
            throw new YAMLException("impossible error: invalid scalar style");
        }
      })();
    }
    function blockHeader(string, indentPerLevel) {
      var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
      var clip = string[string.length - 1] === "\n";
      var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
      var chomp = keep ? "+" : clip ? "" : "-";
      return indentIndicator + chomp + "\n";
    }
    function dropEndingNewline(string) {
      return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
    }
    function foldString(string, width) {
      var lineRe = /(\n+)([^\n]*)/g;
      var result = (function() {
        var nextLF = string.indexOf("\n");
        nextLF = nextLF !== -1 ? nextLF : string.length;
        lineRe.lastIndex = nextLF;
        return foldLine(string.slice(0, nextLF), width);
      })();
      var prevMoreIndented = string[0] === "\n" || string[0] === " ";
      var moreIndented;
      var match;
      while (match = lineRe.exec(string)) {
        var prefix = match[1], line = match[2];
        moreIndented = line[0] === " ";
        result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
        prevMoreIndented = moreIndented;
      }
      return result;
    }
    function foldLine(line, width) {
      if (line === "" || line[0] === " ") return line;
      var breakRe = / [^ ]/g;
      var match;
      var start = 0, end, curr = 0, next = 0;
      var result = "";
      while (match = breakRe.exec(line)) {
        next = match.index;
        if (next - start > width) {
          end = curr > start ? curr : next;
          result += "\n" + line.slice(start, end);
          start = end + 1;
        }
        curr = next;
      }
      result += "\n";
      if (line.length - start > width && curr > start) {
        result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
      } else {
        result += line.slice(start);
      }
      return result.slice(1);
    }
    function escapeString(string) {
      var result = "";
      var char, nextChar;
      var escapeSeq;
      for (var i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        if (char >= 55296 && char <= 56319) {
          nextChar = string.charCodeAt(i + 1);
          if (nextChar >= 56320 && nextChar <= 57343) {
            result += encodeHex((char - 55296) * 1024 + nextChar - 56320 + 65536);
            i++;
            continue;
          }
        }
        escapeSeq = ESCAPE_SEQUENCES[char];
        result += !escapeSeq && isPrintable(char) ? string[i] : escapeSeq || encodeHex(char);
      }
      return result;
    }
    function writeFlowSequence(state, level, object) {
      var _result = "", _tag = state.tag, index, length;
      for (index = 0, length = object.length; index < length; index += 1) {
        if (writeNode(state, level, object[index], false, false)) {
          if (index !== 0) _result += "," + (!state.condenseFlow ? " " : "");
          _result += state.dump;
        }
      }
      state.tag = _tag;
      state.dump = "[" + _result + "]";
    }
    function writeBlockSequence(state, level, object, compact) {
      var _result = "", _tag = state.tag, index, length;
      for (index = 0, length = object.length; index < length; index += 1) {
        if (writeNode(state, level + 1, object[index], true, true)) {
          if (!compact || index !== 0) {
            _result += generateNextLine(state, level);
          }
          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
            _result += "-";
          } else {
            _result += "- ";
          }
          _result += state.dump;
        }
      }
      state.tag = _tag;
      state.dump = _result || "[]";
    }
    function writeFlowMapping(state, level, object) {
      var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
      for (index = 0, length = objectKeyList.length; index < length; index += 1) {
        pairBuffer = "";
        if (index !== 0) pairBuffer += ", ";
        if (state.condenseFlow) pairBuffer += '"';
        objectKey = objectKeyList[index];
        objectValue = object[objectKey];
        if (!writeNode(state, level, objectKey, false, false)) {
          continue;
        }
        if (state.dump.length > 1024) pairBuffer += "? ";
        pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
        if (!writeNode(state, level, objectValue, false, false)) {
          continue;
        }
        pairBuffer += state.dump;
        _result += pairBuffer;
      }
      state.tag = _tag;
      state.dump = "{" + _result + "}";
    }
    function writeBlockMapping(state, level, object, compact) {
      var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
      if (state.sortKeys === true) {
        objectKeyList.sort();
      } else if (typeof state.sortKeys === "function") {
        objectKeyList.sort(state.sortKeys);
      } else if (state.sortKeys) {
        throw new YAMLException("sortKeys must be a boolean or a function");
      }
      for (index = 0, length = objectKeyList.length; index < length; index += 1) {
        pairBuffer = "";
        if (!compact || index !== 0) {
          pairBuffer += generateNextLine(state, level);
        }
        objectKey = objectKeyList[index];
        objectValue = object[objectKey];
        if (!writeNode(state, level + 1, objectKey, true, true, true)) {
          continue;
        }
        explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
        if (explicitPair) {
          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
            pairBuffer += "?";
          } else {
            pairBuffer += "? ";
          }
        }
        pairBuffer += state.dump;
        if (explicitPair) {
          pairBuffer += generateNextLine(state, level);
        }
        if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
          continue;
        }
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          pairBuffer += ":";
        } else {
          pairBuffer += ": ";
        }
        pairBuffer += state.dump;
        _result += pairBuffer;
      }
      state.tag = _tag;
      state.dump = _result || "{}";
    }
    function detectType(state, object, explicit) {
      var _result, typeList, index, length, type, style;
      typeList = explicit ? state.explicitTypes : state.implicitTypes;
      for (index = 0, length = typeList.length; index < length; index += 1) {
        type = typeList[index];
        if ((type.instanceOf || type.predicate) && (!type.instanceOf || typeof object === "object" && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {
          state.tag = explicit ? type.tag : "?";
          if (type.represent) {
            style = state.styleMap[type.tag] || type.defaultStyle;
            if (_toString.call(type.represent) === "[object Function]") {
              _result = type.represent(object, style);
            } else if (_hasOwnProperty.call(type.represent, style)) {
              _result = type.represent[style](object, style);
            } else {
              throw new YAMLException("!<" + type.tag + '> tag resolver accepts not "' + style + '" style');
            }
            state.dump = _result;
          }
          return true;
        }
      }
      return false;
    }
    function writeNode(state, level, object, block, compact, iskey) {
      state.tag = null;
      state.dump = object;
      if (!detectType(state, object, false)) {
        detectType(state, object, true);
      }
      var type = _toString.call(state.dump);
      if (block) {
        block = state.flowLevel < 0 || state.flowLevel > level;
      }
      var objectOrArray = type === "[object Object]" || type === "[object Array]", duplicateIndex, duplicate;
      if (objectOrArray) {
        duplicateIndex = state.duplicates.indexOf(object);
        duplicate = duplicateIndex !== -1;
      }
      if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
        compact = false;
      }
      if (duplicate && state.usedDuplicates[duplicateIndex]) {
        state.dump = "*ref_" + duplicateIndex;
      } else {
        if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
          state.usedDuplicates[duplicateIndex] = true;
        }
        if (type === "[object Object]") {
          if (block && Object.keys(state.dump).length !== 0) {
            writeBlockMapping(state, level, state.dump, compact);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + state.dump;
            }
          } else {
            writeFlowMapping(state, level, state.dump);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + " " + state.dump;
            }
          }
        } else if (type === "[object Array]") {
          var arrayLevel = state.noArrayIndent && level > 0 ? level - 1 : level;
          if (block && state.dump.length !== 0) {
            writeBlockSequence(state, arrayLevel, state.dump, compact);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + state.dump;
            }
          } else {
            writeFlowSequence(state, arrayLevel, state.dump);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + " " + state.dump;
            }
          }
        } else if (type === "[object String]") {
          if (state.tag !== "?") {
            writeScalar(state, state.dump, level, iskey);
          }
        } else {
          if (state.skipInvalid) return false;
          throw new YAMLException("unacceptable kind of an object to dump " + type);
        }
        if (state.tag !== null && state.tag !== "?") {
          state.dump = "!<" + state.tag + "> " + state.dump;
        }
      }
      return true;
    }
    function getDuplicateReferences(object, state) {
      var objects = [], duplicatesIndexes = [], index, length;
      inspectNode(object, objects, duplicatesIndexes);
      for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
        state.duplicates.push(objects[duplicatesIndexes[index]]);
      }
      state.usedDuplicates = new Array(length);
    }
    function inspectNode(object, objects, duplicatesIndexes) {
      var objectKeyList, index, length;
      if (object !== null && typeof object === "object") {
        index = objects.indexOf(object);
        if (index !== -1) {
          if (duplicatesIndexes.indexOf(index) === -1) {
            duplicatesIndexes.push(index);
          }
        } else {
          objects.push(object);
          if (Array.isArray(object)) {
            for (index = 0, length = object.length; index < length; index += 1) {
              inspectNode(object[index], objects, duplicatesIndexes);
            }
          } else {
            objectKeyList = Object.keys(object);
            for (index = 0, length = objectKeyList.length; index < length; index += 1) {
              inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
            }
          }
        }
      }
    }
    function dump(input, options2) {
      options2 = options2 || {};
      var state = new State(options2);
      if (!state.noRefs) getDuplicateReferences(input, state);
      if (writeNode(state, 0, input, true, true)) return state.dump + "\n";
      return "";
    }
    function safeDump(input, options2) {
      return dump(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options2));
    }
    module2.exports.dump = dump;
    module2.exports.safeDump = safeDump;
  }
});

// node_modules/js-yaml/lib/js-yaml.js
var require_js_yaml = __commonJS({
  "node_modules/js-yaml/lib/js-yaml.js"(exports2, module2) {
    "use strict";
    var loader = require_loader();
    var dumper = require_dumper();
    function deprecated(name) {
      return function() {
        throw new Error("Function " + name + " is deprecated and cannot be used.");
      };
    }
    module2.exports.Type = require_type();
    module2.exports.Schema = require_schema();
    module2.exports.FAILSAFE_SCHEMA = require_failsafe();
    module2.exports.JSON_SCHEMA = require_json();
    module2.exports.CORE_SCHEMA = require_core();
    module2.exports.DEFAULT_SAFE_SCHEMA = require_default_safe();
    module2.exports.DEFAULT_FULL_SCHEMA = require_default_full();
    module2.exports.load = loader.load;
    module2.exports.loadAll = loader.loadAll;
    module2.exports.safeLoad = loader.safeLoad;
    module2.exports.safeLoadAll = loader.safeLoadAll;
    module2.exports.dump = dumper.dump;
    module2.exports.safeDump = dumper.safeDump;
    module2.exports.YAMLException = require_exception();
    module2.exports.MINIMAL_SCHEMA = require_failsafe();
    module2.exports.SAFE_SCHEMA = require_default_safe();
    module2.exports.DEFAULT_SCHEMA = require_default_full();
    module2.exports.scan = deprecated("scan");
    module2.exports.parse = deprecated("parse");
    module2.exports.compose = deprecated("compose");
    module2.exports.addConstructor = deprecated("addConstructor");
  }
});

// node_modules/js-yaml/index.js
var require_js_yaml2 = __commonJS({
  "node_modules/js-yaml/index.js"(exports2, module2) {
    "use strict";
    var yaml2 = require_js_yaml();
    module2.exports = yaml2;
  }
});

// node_modules/gray-matter/lib/engines.js
var require_engines = __commonJS({
  "node_modules/gray-matter/lib/engines.js"(exports, module) {
    "use strict";
    var yaml = require_js_yaml2();
    var engines = exports = module.exports;
    engines.yaml = {
      parse: yaml.safeLoad.bind(yaml),
      stringify: yaml.safeDump.bind(yaml)
    };
    engines.json = {
      parse: JSON.parse.bind(JSON),
      stringify: function(obj, options2) {
        const opts = Object.assign({ replacer: null, space: 2 }, options2);
        return JSON.stringify(obj, opts.replacer, opts.space);
      }
    };
    engines.javascript = {
      parse: function parse(str, options, wrap) {
        try {
          if (wrap !== false) {
            str = "(function() {\nreturn " + str.trim() + ";\n}());";
          }
          return eval(str) || {};
        } catch (err) {
          if (wrap !== false && /(unexpected|identifier)/i.test(err.message)) {
            return parse(str, options, false);
          }
          throw new SyntaxError(err);
        }
      },
      stringify: function() {
        throw new Error("stringifying JavaScript is not supported");
      }
    };
  }
});

// node_modules/strip-bom-string/index.js
var require_strip_bom_string = __commonJS({
  "node_modules/strip-bom-string/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function(str2) {
      if (typeof str2 === "string" && str2.charAt(0) === "\uFEFF") {
        return str2.slice(1);
      }
      return str2;
    };
  }
});

// node_modules/gray-matter/lib/utils.js
var require_utils5 = __commonJS({
  "node_modules/gray-matter/lib/utils.js"(exports2) {
    "use strict";
    var stripBom = require_strip_bom_string();
    var typeOf = require_kind_of();
    exports2.define = function(obj, key, val) {
      Reflect.defineProperty(obj, key, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: val
      });
    };
    exports2.isBuffer = function(val) {
      return typeOf(val) === "buffer";
    };
    exports2.isObject = function(val) {
      return typeOf(val) === "object";
    };
    exports2.toBuffer = function(input) {
      return typeof input === "string" ? Buffer.from(input) : input;
    };
    exports2.toString = function(input) {
      if (exports2.isBuffer(input)) return stripBom(String(input));
      if (typeof input !== "string") {
        throw new TypeError("expected input to be a string or buffer");
      }
      return stripBom(input);
    };
    exports2.arrayify = function(val) {
      return val ? Array.isArray(val) ? val : [val] : [];
    };
    exports2.startsWith = function(str2, substr, len) {
      if (typeof len !== "number") len = substr.length;
      return str2.slice(0, len) === substr;
    };
  }
});

// node_modules/gray-matter/lib/defaults.js
var require_defaults = __commonJS({
  "node_modules/gray-matter/lib/defaults.js"(exports2, module2) {
    "use strict";
    var engines2 = require_engines();
    var utils = require_utils5();
    module2.exports = function(options2) {
      const opts = Object.assign({}, options2);
      opts.delimiters = utils.arrayify(opts.delims || opts.delimiters || "---");
      if (opts.delimiters.length === 1) {
        opts.delimiters.push(opts.delimiters[0]);
      }
      opts.language = (opts.language || opts.lang || "yaml").toLowerCase();
      opts.engines = Object.assign({}, engines2, opts.parsers, opts.engines);
      return opts;
    };
  }
});

// node_modules/gray-matter/lib/engine.js
var require_engine = __commonJS({
  "node_modules/gray-matter/lib/engine.js"(exports2, module2) {
    "use strict";
    module2.exports = function(name, options2) {
      let engine = options2.engines[name] || options2.engines[aliase(name)];
      if (typeof engine === "undefined") {
        throw new Error('gray-matter engine "' + name + '" is not registered');
      }
      if (typeof engine === "function") {
        engine = { parse: engine };
      }
      return engine;
    };
    function aliase(name) {
      switch (name.toLowerCase()) {
        case "js":
        case "javascript":
          return "javascript";
        case "coffee":
        case "coffeescript":
        case "cson":
          return "coffee";
        case "yaml":
        case "yml":
          return "yaml";
        default: {
          return name;
        }
      }
    }
  }
});

// node_modules/gray-matter/lib/stringify.js
var require_stringify2 = __commonJS({
  "node_modules/gray-matter/lib/stringify.js"(exports2, module2) {
    "use strict";
    var typeOf = require_kind_of();
    var getEngine = require_engine();
    var defaults = require_defaults();
    module2.exports = function(file, data, options2) {
      if (data == null && options2 == null) {
        switch (typeOf(file)) {
          case "object":
            data = file.data;
            options2 = {};
            break;
          case "string":
            return file;
          default: {
            throw new TypeError("expected file to be a string or object");
          }
        }
      }
      const str2 = file.content;
      const opts = defaults(options2);
      if (data == null) {
        if (!opts.data) return file;
        data = opts.data;
      }
      const language = file.language || opts.language;
      const engine = getEngine(language, opts);
      if (typeof engine.stringify !== "function") {
        throw new TypeError('expected "' + language + '.stringify" to be a function');
      }
      data = Object.assign({}, file.data, data);
      const open = opts.delimiters[0];
      const close = opts.delimiters[1];
      const matter6 = engine.stringify(data, options2).trim();
      let buf = "";
      if (matter6 !== "{}") {
        buf = newline(open) + newline(matter6) + newline(close);
      }
      if (typeof file.excerpt === "string" && file.excerpt !== "") {
        if (str2.indexOf(file.excerpt.trim()) === -1) {
          buf += newline(file.excerpt) + newline(close);
        }
      }
      return buf + newline(str2);
    };
    function newline(str2) {
      return str2.slice(-1) !== "\n" ? str2 + "\n" : str2;
    }
  }
});

// node_modules/gray-matter/lib/excerpt.js
var require_excerpt = __commonJS({
  "node_modules/gray-matter/lib/excerpt.js"(exports2, module2) {
    "use strict";
    var defaults = require_defaults();
    module2.exports = function(file, options2) {
      const opts = defaults(options2);
      if (file.data == null) {
        file.data = {};
      }
      if (typeof opts.excerpt === "function") {
        return opts.excerpt(file, opts);
      }
      const sep5 = file.data.excerpt_separator || opts.excerpt_separator;
      if (sep5 == null && (opts.excerpt === false || opts.excerpt == null)) {
        return file;
      }
      const delimiter = typeof opts.excerpt === "string" ? opts.excerpt : sep5 || opts.delimiters[0];
      const idx = file.content.indexOf(delimiter);
      if (idx !== -1) {
        file.excerpt = file.content.slice(0, idx);
      }
      return file;
    };
  }
});

// node_modules/gray-matter/lib/to-file.js
var require_to_file = __commonJS({
  "node_modules/gray-matter/lib/to-file.js"(exports2, module2) {
    "use strict";
    var typeOf = require_kind_of();
    var stringify = require_stringify2();
    var utils = require_utils5();
    module2.exports = function(file) {
      if (typeOf(file) !== "object") {
        file = { content: file };
      }
      if (typeOf(file.data) !== "object") {
        file.data = {};
      }
      if (file.contents && file.content == null) {
        file.content = file.contents;
      }
      utils.define(file, "orig", utils.toBuffer(file.content));
      utils.define(file, "language", file.language || "");
      utils.define(file, "matter", file.matter || "");
      utils.define(file, "stringify", function(data, options2) {
        if (options2 && options2.language) {
          file.language = options2.language;
        }
        return stringify(file, data, options2);
      });
      file.content = utils.toString(file.content);
      file.isEmpty = false;
      file.excerpt = "";
      return file;
    };
  }
});

// node_modules/gray-matter/lib/parse.js
var require_parse3 = __commonJS({
  "node_modules/gray-matter/lib/parse.js"(exports2, module2) {
    "use strict";
    var getEngine = require_engine();
    var defaults = require_defaults();
    module2.exports = function(language, str2, options2) {
      const opts = defaults(options2);
      const engine = getEngine(language, opts);
      if (typeof engine.parse !== "function") {
        throw new TypeError('expected "' + language + '.parse" to be a function');
      }
      return engine.parse(str2, opts);
    };
  }
});

// node_modules/gray-matter/index.js
var require_gray_matter = __commonJS({
  "node_modules/gray-matter/index.js"(exports2, module2) {
    "use strict";
    var fs11 = require("fs");
    var sections = require_section_matter();
    var defaults = require_defaults();
    var stringify = require_stringify2();
    var excerpt = require_excerpt();
    var engines2 = require_engines();
    var toFile = require_to_file();
    var parse2 = require_parse3();
    var utils = require_utils5();
    function matter6(input, options2) {
      if (input === "") {
        return { data: {}, content: input, excerpt: "", orig: input };
      }
      let file = toFile(input);
      const cached = matter6.cache[file.content];
      if (!options2) {
        if (cached) {
          file = Object.assign({}, cached);
          file.orig = cached.orig;
          return file;
        }
        matter6.cache[file.content] = file;
      }
      return parseMatter(file, options2);
    }
    function parseMatter(file, options2) {
      const opts = defaults(options2);
      const open = opts.delimiters[0];
      const close = "\n" + opts.delimiters[1];
      let str2 = file.content;
      if (opts.language) {
        file.language = opts.language;
      }
      const openLen = open.length;
      if (!utils.startsWith(str2, open, openLen)) {
        excerpt(file, opts);
        return file;
      }
      if (str2.charAt(openLen) === open.slice(-1)) {
        return file;
      }
      str2 = str2.slice(openLen);
      const len = str2.length;
      const language = matter6.language(str2, opts);
      if (language.name) {
        file.language = language.name;
        str2 = str2.slice(language.raw.length);
      }
      let closeIndex = str2.indexOf(close);
      if (closeIndex === -1) {
        closeIndex = len;
      }
      file.matter = str2.slice(0, closeIndex);
      const block = file.matter.replace(/^\s*#[^\n]+/gm, "").trim();
      if (block === "") {
        file.isEmpty = true;
        file.empty = file.content;
        file.data = {};
      } else {
        file.data = parse2(file.language, file.matter, opts);
      }
      if (closeIndex === len) {
        file.content = "";
      } else {
        file.content = str2.slice(closeIndex + close.length);
        if (file.content[0] === "\r") {
          file.content = file.content.slice(1);
        }
        if (file.content[0] === "\n") {
          file.content = file.content.slice(1);
        }
      }
      excerpt(file, opts);
      if (opts.sections === true || typeof opts.section === "function") {
        sections(file, opts.section);
      }
      return file;
    }
    matter6.engines = engines2;
    matter6.stringify = function(file, data, options2) {
      if (typeof file === "string") file = matter6(file, options2);
      return stringify(file, data, options2);
    };
    matter6.read = function(filepath, options2) {
      const str2 = fs11.readFileSync(filepath, "utf8");
      const file = matter6(str2, options2);
      file.path = filepath;
      return file;
    };
    matter6.test = function(str2, options2) {
      return utils.startsWith(str2, defaults(options2).delimiters[0]);
    };
    matter6.language = function(str2, options2) {
      const opts = defaults(options2);
      const open = opts.delimiters[0];
      if (matter6.test(str2)) {
        str2 = str2.slice(open.length);
      }
      const language = str2.slice(0, str2.search(/\r?\n/));
      return {
        raw: language,
        name: language ? language.trim() : ""
      };
    };
    matter6.cache = {};
    matter6.clearCache = function() {
      matter6.cache = {};
    };
    module2.exports = matter6;
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode5 = __toESM(require("vscode"));

// src/commands/index.ts
var path8 = __toESM(require("path"));
var vscode2 = __toESM(require("vscode"));

// src/core/constants.ts
var STAGES = ["inbox", "plan", "code", "audit", "completed"];
var KANBAN_FOLDER = ".kanban2code";
var INBOX_FOLDER = "inbox";
var PROJECTS_FOLDER = "projects";
var AGENTS_FOLDER = "_agents";
var CONTEXT_FOLDER = "_context";
var PROVIDERS_FOLDER = "_providers";

// src/services/scanner.ts
var import_fast_glob = __toESM(require_out4());
var path2 = __toESM(require("path"));

// src/services/frontmatter.ts
var import_gray_matter = __toESM(require_gray_matter());
var fs = __toESM(require("fs/promises"));
var path = __toESM(require("path"));
var defaultWarn = (message, error) => console.warn(message, error);
function inferProjectAndPhase(filePath) {
  const segments = filePath.split(path.sep).filter(Boolean);
  const projectIndex = segments.lastIndexOf(PROJECTS_FOLDER);
  if (projectIndex !== -1 && segments.length > projectIndex + 1) {
    const project = segments[projectIndex + 1];
    const fileName = segments[segments.length - 1];
    const maybePhase = segments[projectIndex + 2];
    const phase = maybePhase && maybePhase !== fileName ? maybePhase : void 0;
    return { project, phase };
  }
  return { project: void 0, phase: void 0 };
}
function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : void 0;
}
function parseTaskContent(content, filePath, options2 = {}) {
  let data = {};
  let body = content;
  try {
    const parsed = (0, import_gray_matter.default)(content);
    data = parsed.data ?? {};
    body = parsed.content;
  } catch (error) {
    const warn = options2.warn ?? defaultWarn;
    warn(`Invalid frontmatter in ${filePath}; using defaults.`, error);
  }
  const stage = STAGES.includes(data.stage) ? data.stage : "inbox";
  const { project, phase } = inferProjectAndPhase(filePath);
  let contexts = Array.isArray(data.contexts) ? data.contexts.map(String) : [];
  const skills = Array.isArray(data.skills) ? data.skills.map(String) : [];
  const migratedContexts = [];
  for (const ctx of contexts) {
    if (ctx.startsWith("_context/skills/") || ctx.startsWith("skills/")) {
      const basename7 = path.basename(ctx, ".md");
      if (!skills.includes(basename7)) {
        skills.push(basename7);
      }
    } else {
      migratedContexts.push(ctx);
    }
  }
  contexts = migratedContexts;
  const task = {
    id: path.basename(filePath, ".md"),
    filePath,
    title: extractTitle(body) || path.basename(filePath, ".md"),
    stage,
    project,
    phase,
    agent: typeof data.agent === "string" ? data.agent : void 0,
    provider: typeof data.provider === "string" ? data.provider : void 0,
    parent: typeof data.parent === "string" ? data.parent : void 0,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    contexts,
    skills,
    order: typeof data.order === "number" ? data.order : void 0,
    created: typeof data.created === "string" ? data.created : void 0,
    attempts: typeof data.attempts === "number" ? data.attempts : void 0,
    content: body
  };
  return task;
}
async function parseTaskFile(filePath, options2 = {}) {
  const content = await fs.readFile(filePath, "utf-8");
  return parseTaskContent(content, filePath, options2);
}
function stringifyTaskFile(task, originalContent, options2 = {}) {
  let existingData = {};
  if (originalContent) {
    try {
      const parsed = (0, import_gray_matter.default)(originalContent);
      existingData = parsed.data ?? {};
    } catch (error) {
      const warn = options2.warn ?? defaultWarn;
      warn(
        `Invalid frontmatter while serializing ${task.filePath}; preserving known fields only.`,
        error
      );
    }
  }
  const data = {
    ...existingData,
    stage: task.stage,
    agent: task.agent,
    provider: task.provider,
    parent: task.parent,
    tags: task.tags ?? [],
    contexts: task.contexts ?? [],
    skills: task.skills ?? [],
    order: task.order,
    created: task.created,
    attempts: task.attempts
  };
  delete data.project;
  delete data.phase;
  Object.keys(data).forEach((key) => {
    if (data[key] === void 0) {
      delete data[key];
    }
  });
  return import_gray_matter.default.stringify(task.content, data);
}

// src/services/scanner.ts
async function findAllTaskFiles(kanbanRoot) {
  const patterns = [
    path2.join(kanbanRoot, INBOX_FOLDER, "*.md"),
    path2.join(kanbanRoot, PROJECTS_FOLDER, "**", "*.md"),
    path2.join(kanbanRoot, "phase-*", "*.md")
  ];
  const normalizePattern = (p) => p.split(path2.sep).join("/");
  const files = await (0, import_fast_glob.default)(patterns.map(normalizePattern), {
    ignore: ["**/_context.md"],
    absolute: true,
    cwd: kanbanRoot
  });
  return files;
}
async function loadAllTasks(kanbanRoot) {
  const files = await findAllTaskFiles(kanbanRoot);
  const tasks = [];
  const errors = [];
  await Promise.all(
    files.map(async (file) => {
      try {
        const task = await parseTaskFile(file);
        tasks.push(task);
      } catch (err) {
        console.error(`Failed to load task: ${file}`, err);
        errors.push(err);
      }
    })
  );
  return sortTasks(tasks);
}
function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const aOrder = a.order ?? Infinity;
    const bOrder = b.order ?? Infinity;
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    return a.id.localeCompare(b.id);
  });
}
async function findTaskById(kanbanRoot, taskId) {
  const tasks = await loadAllTasks(kanbanRoot);
  return tasks.find((t) => t.id === taskId);
}

// src/services/scaffolder.ts
var fs2 = __toESM(require("fs/promises"));
var path3 = __toESM(require("path"));

// src/assets/agents.ts
var BUNDLED_AGENTS = {
  "01-\u{1F5FA}\uFE0Froadmapper.md": "---\nname: roadmapper\ndescription: Idea exploration and vision document creation\ntype: robot\ncreated: '2025-12-17'\n---\n\n# Roadmapper Agent\n\n## Purpose\n\nTurn raw ideas into a structured roadmap document that captures the what and why.\n\n## Rules\n\n- No architecture, phases, or tasks (Architect handles that)\n- No implementation code\n- No tech decisions without user input\n- Ask clarifying questions only when needed\n\n## Input\n\nUser idea or a task file with an idea to explore.\n\n## Output\n\nSave a roadmap to `.kanban2code/projects/<project-name>/<roadmap-name>.md`:\n\n```markdown\n# [Vision Title]\n\n## Overview\n\n[2-3 paragraph summary]\n\n## Problem Statement\n\n[What problem this solves and why]\n\n## Goals\n\n- [Goal]\n\n## Non-Goals (Out of Scope)\n\n- [Not included]\n\n## User Stories\n\n- As a [user], I want [feature] so that [benefit]\n\n## Success Criteria\n\n- [Measurable outcome]\n\n## Open Questions\n\n- [Unresolved decision]\n\n## Notes\n\n[Constraints or context]\n```\n\n## Workflow\n\n1. Clarify the idea with minimal questions\n2. Expand the vision and edge cases\n3. Write the roadmap using the template\n4. Review with the user\n5. Create an Architect task and mark your task complete\n\n## Handoff Protocol\n\nWhen roadmap is complete and approved:\n\n1. **Update your task file** to mark complete:\n\n```yaml\n---\nstage: completed\nagent: roadmapper\n---\n```\n\n2. **Create an Architect task** in `.kanban2code/projects/<project-name>/`:\n\n```yaml\n---\nstage: inbox\ntags: [architecture, p0, missing-architecture, missing-decomposition]\nagent: architect\ncontexts: []\nparent: <your-task-id>\n---\n\n# Architecture: [Vision Title]\n\n## Goal\nAdd technical design, phases, and tasks to the roadmap.\n\n## Input\nRoadmap: `.kanban2code/projects/<project-name>/<roadmap-name>.md`\n```\n\n## CRITICAL: Stage Transition\n\n**You MUST update your task file frontmatter when done:**\n\n```yaml\n---\nstage: completed\nagent: roadmapper\n---\n```\n\nDo not just mention completion - actually edit the frontmatter!\n",
  "02-\u{1F3DB}\uFE0Farchitect.md": '---\nname: architect\ndescription: Technical design, phases, tasks, and context\ntype: robot\ncreated: \'2025-12-17\'\n---\n\n# Architect Agent\n\n## Purpose\n\nTransform roadmap visions into actionable implementation plans. Edit the existing roadmap to add architecture, phases, tasks, tests, files to touch, and context.\n\n## Rules\n\n- Edit the existing roadmap only; do not create new files\n- Append the required sections in the exact order shown\n- Use concise, unambiguous wording\n- Keep names consistent across phases, tasks, and files\n- Review available skills in `_context/skills/` and specify relevant ones for each task\n\n## Do Not\n\n- Generate individual task files (Splitter does this)\n- Write implementation code\n- Make major technology decisions without user input\n\n## Input\n\nRoadmap document from Roadmapper (vision, goals, stories, success criteria).\n\n## Output\n\nYou **edit the same roadmap file** to append technical architecture sections:\n\n```markdown\n---\n## Technical Architecture\n\n### Overview\n[High-level technical approach]\n\n### Components\n- [Component 1]: [Purpose]\n- [Component 2]: [Purpose]\n\n### Data Flow\n[How data moves through the system]\n\n### Dependencies\n- [External dependency]: [Why needed]\n\n### Constraints\n- [Technical constraint]: [Reason]\n\n---\n\n## Phases\n\n### Phase 1: [Name]\n\n[Description of this phase]\n\n#### Task 1.1: [Task Name]\n\n**Definition of Done:**\n\n- [ ] [Checkpoint 1]\n- [ ] [Checkpoint 2]\n\n**Files:**\n\n- `path/to/file.ts` - [create/modify] - [reason]\n\n**Tests:**\n\n- [ ] [Test case 1]\n- [ ] [Test case 2]\n\n**Skills:**\n\n- `skills/[skill-name]` - [reason why this skill is needed]\n\n#### Task 1.2: [Task Name]\n\n...\n\n### Phase 2: [Name]\n\n...\n\n---\n\n## Context\n\n### Relevant Patterns\n\n[Existing patterns in codebase to follow]\n\n### Related Files\n\n- `path/to/related.ts` - [why relevant]\n\n### Gotchas\n\n- [Potential pitfall]: [How to avoid]\n```\n\n## Skills System\n\n### What are skills?\n\nSkills are reusable context files in `_context/skills/` that provide framework-specific conventions, patterns, and best practices. They ensure consistent code generation across tasks.\n\n### Available skills\n\nBefore architecting, check `_context/skills/` for relevant skills:\n\n- **Framework skills**: `react-core-skills.md`, `nextjs-core-skills.md`, `python-core-skills.md`\n- **Specialized skills**: `skill-caching-data-fetching.md`, `skill-metadata-seo.md`, `skill-routing-layouts.md`, `skill-server-actions-mutations.md`, `skill-typescript-config.md`\n\n### When to specify skills\n\nFor each task in your phase breakdown, specify relevant skills:\n\n- Task involves React/Next.js/Python \u2192 specify framework skill\n- Task involves specific patterns (routing, caching, etc.) \u2192 specify specialized skill\n- Multiple skills may apply \u2192 specify all relevant ones\n\n### How to specify skills\n\nAdd a **Skills:** section to each task showing which skills the Splitter should add:\n\n```markdown\n**Skills:**\n\n- `skills/react-core-skills` - Task involves React components\n- `skills/skill-routing-layouts` - Task modifies routing structure\n```\n\n## Workflow\n\n1. Read the roadmap\n2. Check `_context/skills/` to understand available skills\n3. Explore the codebase for patterns and constraints\n4. Define architecture (overview, components, data flow, dependencies, constraints)\n5. Plan phases and tasks with definition of done, files, tests, and skills\n6. Add context (patterns, related files, gotchas)\n7. Review with user, then hand off to Splitter\n\n## Task Quality\n\n- Atomic, testable, actionable\n- Avoid vague tasks ("Implement the feature", "Fix bug", "Update files")\n- List unit/integration/e2e tests as applicable\n\n## Handoff Protocol\n\nWhen architecture is complete and approved:\n\n1. **Update the roadmap file** with all architecture sections\n\n2. **Remove `missing-architecture` tag** from your own task\n\n3. **Create a Splitter task** in the same project folder:\n\n   ```yaml\n   ---\n   stage: inbox\n   tags: [decomposition, missing-decomposition]\n   agent: splitter\n   contexts: []\n   parent: <your-task-id>\n   ---\n\n   # Split: [Vision Title]\n\n   ## Goal\n   Generate individual task files from the roadmap.\n\n   ## Input\n   Roadmap: `.kanban2code/projects/<project-name>/<roadmap-name>.md`\n   ```\n\n4. **Mark your task complete** (move to audit \u2192 completed)\n\n## Quality Checklist\n\n- [ ] Architecture is sound and explained\n- [ ] Every task has definition of done, files, and tests\n- [ ] Context includes patterns, related files, and gotchas\n- [ ] User approved the architecture\n- [ ] `missing-architecture` tag removed from your task\n\n## CRITICAL: Stage Transition\n\n**You MUST update your task file frontmatter when done:**\n\n```yaml\n---\nstage: completed\nagent: architect\n---\n```\n\nDo not just mention completion - actually edit the frontmatter!\n',
  "03-\u2702\uFE0Fsplitter.md": "---\nname: splitter\ndescription: Generates individual task files from roadmaps\ntype: robot\ncreated: '2025-12-17'\n---\n\n# Splitter Agent\n\n## Purpose\n\nGenerate task files from an architected roadmap.\n\n## Rules\n\n- Read the roadmap only; do not modify it\n- Generate one file per task; do not add or remove tasks\n- Preserve definition of done items exactly\n- Use naming conventions, tags, and agent heuristics\n- Extract skills from each task's **Skills:** section and add to `contexts:` array\n\n## Input\n\nRoadmap with phases, tasks, files, tests, and context.\n\n## Output\n\nCreate folders and task files:\n\nFolder:\n\n```\n.kanban2code/projects/<project-name>/phase{number}-{kebab-case-name}/\n```\n\nTask file name:\n\n```\ntask{phase}.{number}-{kebab-case-name}.md\n```\n\nTask file format:\n\n```markdown\n---\nstage: plan\ntags: [feature, p1]\nagent: planner\ncontexts: [skills/react-core-skills, skills/skill-routing-layouts]\n---\n\n# [Task Title]\n\n## Goal\n\n[From roadmap]\n\n## Definition of Done\n\n- [ ] [Checkpoint]\n\n## Files\n\n- `path/to/file.ts` - [create/modify] - [reason]\n\n## Tests\n\n- [ ] [Test case]\n\n## Context\n\n[From roadmap]\n```\n\n**Important:** The `contexts:` array should include skills specified in the roadmap's **Skills:** section for each task. If the roadmap shows:\n\n```markdown\n**Skills:**\n\n- `skills/react-core-skills` - Task involves React components\n```\n\nThen add `skills/react-core-skills` to the `contexts:` array in the task frontmatter.\n\n## Heuristics\n\nTags:\n\n- Remove/Delete -> [refactor, p0] or [chore, p0]\n- Create/Add/Implement -> [feature, p1]\n- Update/Modify/Fix -> [refactor, p1]\n- Test/Verify -> [test, p2]\n- Document -> [docs, p2]\n- Audit/Review -> [chore, p1]\n\nAgents:\n\n- All tasks start with -> planner (stage: plan)\n- Planning/design tasks -> planner\n- Implementation/tests tasks -> planner (will move to coder)\n- Docs tasks -> planner\n- Review tasks -> planner (will move through pipeline)\n\nNote: All generated tasks should have agent: planner and stage: plan. The planner will move them to coder when ready.\n\n## Workflow\n\n1. Read the entire roadmap\n2. Create phase folders\n3. Create task files for every task\n4. Remove `missing-decomposition` tag, mark task complete, report summary\n\n## CRITICAL: Stage Transition\n\n**You MUST update your task file frontmatter when done:**\n\n```yaml\n---\nstage: completed\nagent: splitter\n---\n```\n\nDo not just mention completion - actually edit the frontmatter!\n",
  "04-\u{1F4CB}planner.md": '---\nname: planner\ndescription: Refines prompts, distills context, and gathers implementation-ready snippets\ntype: robot\nstage: plan\ncreated: \'2025-12-17\'\n---\n\n# Planner Agent\n\n## Purpose\nRefine tasks into implementation-ready prompts and distill high-signal context so the coder can start immediately with minimal exploration.\n\n## First contact\nSay exactly: "I\'m Planner Agent, I do not code, I only refine the prompt and gather context."\n\n## Stage\nWork on tasks in stage: `plan`. When done, move to stage: `code` and agent: `coder`.\n\n## Rules\n- Do not write implementation code\n- Do not make architecture decisions\n- Edit only the task file (append sections + required frontmatter updates)\n- No "I will...", no narration, no tool talk\n- Replace placeholders with real content (no bracketed text)\n- Redact secrets\n- If critical info is missing, add a Questions subsection under Refined Prompt and stop\n- Review available skills in `_context/skills/` and add relevant ones to task metadata\n\n## Input\nTask file with goal, definition of done, files to modify, and tests to write.\n\n## Output Contract\nAppend sections in this order:\n\n## Refined Prompt\nObjective: <one-line objective>\n\nImplementation approach:\n1. <step 1>\n2. <step 2>\n\nKey decisions:\n- <decision>: <rationale>\n\nEdge cases:\n- <edge case>\n\nQuestions (only if blocked):\n- <question>\n\n## Context\n\n### File Tree (scoped)\nExtract only the relevant subtree from `ARCHITECTURE.md` for files in scope.\n- Include parent directories for orientation\n- Include sibling files only if imported/exported by scoped files\n- Mark files as `<- modify`, `<- create`, or `<- read-only reference`\n- Max 20 lines\n\n### Architecture Excerpts\nExtract only architecture sections needed for this task.\n- Quote concise bullets/paragraphs with heading path reference\n- Include only conventions the coder must follow\n- Max 30 lines total\n\n### Skill Excerpts\nFor each skill in the task `contexts:` array:\n- Read the full skill file, extract only relevant sections\n- Include source skill path and section headers\n- Max 20 lines per skill excerpt\n- If none apply, write: "No specific skill guidance needed beyond general conventions."\n\n### Code Excerpts\nFor each file in task `## Files`, extract the minimum code needed to implement safely.\n- Include `path:line-line` for each excerpt\n- Include one line on why the excerpt matters\n- Prioritize signatures, types, exports, and usage shapes (not full implementations)\n- For files to modify: show current state that will change\n- For consumer files: show import/usage contract that must remain compatible\n- Max 15 lines per excerpt, max 5 excerpts total\n\n### Dependency Graph\nList files importing/from imported by modified files.\n- Use search results, do not guess\n- Limit to task domain (skip node_modules and unrelated features)\n- Flag consumers not listed in task `## Files`\n\n### Patterns to Follow\nBrief notes on conventions found in the codebase that the coder should match.\n\n### Test Patterns\nWhere to look and how tests are structured for similar features.\n\n### Gotchas\n- <pitfall>: <avoidance>\n\n### Scope Boundaries\nIf this task is part of a phase with multiple tasks, explicitly state what this task should NOT touch.\n- Read sibling tasks in the same phase to determine boundaries\n- Omit this section if no sibling tasks exist\n\n## Workflow\n1. Read the task file completely\n2. Read other task files in the same phase folder to understand scope boundaries\n3. Check `_context/skills/` and identify relevant skills\n4. Update task frontmatter to add skills to `contexts:` array\n5. Read `ARCHITECTURE.md` and extract relevant file tree and architecture sections\n6. Read each skill file in `contexts:` and extract relevant excerpts\n7. Read the actual codebase files listed in `## Files` and extract code excerpts\n8. Search for imports/consumers of modified files to build the dependency graph\n9. Write the refined prompt with implementation approach, decisions, and edge cases\n10. Write scope boundaries by cross-referencing other tasks in the phase\n11. Append all sections and update stage to `code` and agent to `coder`\n\n## Context tree\nFile Tree (scoped) \u2014 Max 20 lines\n\nExtract relevant subtree from ARCHITECTURE.md. Mark files: \u2190 modify, \u2190 create, \u2190 read-only reference.\n\nExample:\n\n\n	components/\n	\u251C\u2500\u2500 ui/                   # shadcn/ui components (use existing)\n	\u2514\u2500\u2500 reviews/\n	    \u251C\u2500\u2500 rating-input.tsx          # \u2190 modify\n	    \u251C\u2500\u2500 review-wizard.tsx         # \u2190 read-only reference\n	    \u2514\u2500\u2500 __tests__/\n	        \u2514\u2500\u2500 rating-input.test.tsx # \u2190 create\n\nArchitecture Excerpts \u2014 Max 30 lines total\n\nQuote only relevant sections with source path.\n\n## CRITICAL: Stage Transition\n\n**You MUST update the task file frontmatter when done:**\n```yaml\n---\nstage: code\nagent: coder\n---\n```\n\nDo not just mention the stage change - actually edit the frontmatter to set `stage: code` and `agent: coder`!\n',
  "05-\u2699\uFE0Fcoder.md": "---\nname: coder\ndescription: General-purpose coding agent for implementation\ntype: robot\nstage: code\ncreated: '2025-12-17'\n---\n\n# Coder Agent\n\n## Purpose\nImplement tasks from refined prompts and context. Produce code, tests, and task updates.\n\n## Stage\nWork on tasks in stage: code. Move to stage: audit and agent: auditor when complete.\n\n## Rules\n- Follow the refined prompt and context\n- Do not change architecture\n- Write tests as specified\n- Do not move to audit if build/tests fail\n\n## Input\nTask file containing goal, definition of done, refined prompt, context, files, and tests.\n\n## Output\n- Code changes and tests\n- Task file updated:\n  - stage: audit\n  - definition of done items checked\n  - Audit section listing touched files\n\n## Workflow\n1. Read the task completely\n2. Implement changes using existing patterns\n3. Write tests for required cases\n4. Verify build/tests\n5. Update the task file (stage to `audit`, agent to `auditor`)\n\n## Quality Standards\n- Follow project conventions\n- Keep functions small and readable\n- Use clear names; comment only when needed\n- TypeScript: avoid `any`, handle errors\n- React: hooks, accessibility, error/loading states\n- Tests: behavior-focused, cover edge cases\n\n## Task File Updates\n- Change `stage` to `audit` and `agent` to `auditor`\n- Check completed items in Definition of Done\n- Add `## Audit` with one file path per line\n\n## CRITICAL: Stage Transition\n\n**You MUST update the task file frontmatter when done:**\n```yaml\n---\nstage: audit\nagent: auditor\n---\n```\n\nDo not just mention the stage change - actually edit the frontmatter to set `stage: audit` and `agent: auditor`!\n\n## Blockers\nIf context is missing or requirements are ambiguous, note assumptions or ask for clarification. Do not move to audit with failing tests or unmet requirements.\n",
  "06-\u2705auditor.md": "---\nname: auditor\ndescription: Code review and quality rating\ntype: robot\nstage: audit\ncreated: '2025-12-17'\n---\n\n# Auditor Agent\n\n## Purpose\nReview implementations and assign a quality rating (1-10). 8+ is accepted.\n\n## Stage\nWork on tasks in stage: audit.\n- Rating 8-10 -> move to stage: completed (agent stays as auditor)\n- Rating 1-7 -> move to stage: code and agent: coder with feedback\n\n## Input\nTask file in stage: audit with goal, definition of done, Audit file list, and implementation.\n\n## Output\nAppend a Review section to the task file:\n\n```markdown\n---\n\n## Review\n\n**Rating: X/10**\n\n**Verdict: ACCEPTED** | **NEEDS WORK**\n\n### Summary\n[1-2 sentence summary]\n\n### Findings\n\n#### Blockers\n- [ ] [Issue]: [Description] - `file.ts:line`\n\n#### High Priority\n- [ ] [Issue]: [Description] - `file.ts:line`\n\n#### Medium Priority\n- [ ] [Issue]: [Description] - `file.ts:line`\n\n#### Low Priority / Nits\n- [ ] [Issue]: [Description] - `file.ts:line`\n\n### Test Assessment\n- Coverage: [Adequate/Needs improvement]\n- Missing tests: [List]\n\n### What's Good\n- [Positive observation]\n\n### Recommendations\n- [Optional suggestion]\n```\n\n## Review Focus\n- Correctness vs definition of done\n- Code quality and maintainability\n- Tests and coverage gaps\n- Security and accessibility\n- Performance concerns\n\n## Workflow\n1. Read task and definition of done\n2. Review files in the Audit section\n3. Assess tests\n4. Write review\n5. Update stage based on rating:\n   - If rating >= 8: set stage to `completed` (keep agent as `auditor`)\n   - If rating < 8: set stage to `code` and agent to `coder`\n6. **If rating >= 8 (ACCEPTED)**: Update `.kanban2code/_context/architecture.md` to add any new files created during the task implementation\n\n## Architecture Updates (On Acceptance)\n\nWhen a task passes (rating 8+), you MUST update the architecture documentation:\n\n1. Open `.kanban2code/_context/architecture.md`\n2. Add new files from the Audit section to the appropriate location in the directory structure\n3. Add brief descriptions for new services, components, or utilities\n4. Update any relevant sections that describe functionality affected by the changes\n\nThis ensures the architecture documentation stays current with the codebase.\n\n## CRITICAL: Stage Transition\n\n**You MUST update the task file frontmatter when changing stages:**\n```yaml\n---\nstage: completed   # or 'code' if needs work\nagent: auditor     # or 'coder' if needs work\n---\n```\n\nDo not just mention the stage change in your review - actually edit the frontmatter!\n",
  "07-\u{1F4AC}conversational.md": `---
name: conversational
description: Friendly colleague who brainstorms ideas and refines them into clear prompts
created: '2025-12-26'
---

# Conversational Agent

## Purpose
Talk through ideas like a colleague brainstorming together. Summarize what you heard, ask natural questions, and help refine the idea into a clear, actionable prompt.

## Core Behavior

**Listen and summarize first**
Start by reflecting what you understood in 1-2 sentences (not bulleted lists unless natural). This shows you're listening.

**Ask 1-2 questions naturally**
Don't force questions into a numbered list. Just ask what you need to know next, in the flow of conversation.

**Offer examples when paths aren't obvious**
If there are multiple ways to approach something, say so and offer to explain the options.

**Stay high-level until they go deeper**
Focus on: goals, audience, constraints, what "done" looks like. Don't dive into implementation unless they ask.

**Guide toward a refined prompt**
When you have enough clarity, naturally transition to proposing a refined prompt. Keep it conversational\u2014no formal approval gates unless it feels right in context.

## Hard Rules
- No code changes, no patches, no implementation unless explicitly told to implement
- Stay in planning/architecture mode
- Read referenced files first, then summarize context before proposing decisions
- Ask only high-leverage clarifying questions (max 3 at a time)
- Prefer concrete options + tradeoffs + a recommendation
- Do not drift into generic advice; anchor everything to this repo/workflow
- Keep responses structured and decision-oriented

## Response Format
1. What I heard
2. Current state (as-is)
3. Proposed direction (to-be)
4. Key decisions
5. Recommended next step (1-3 options)

## When to Produce a Refined Prompt

You're ready when you can describe:
- The goal in one sentence
- Who it's for or what it affects
- What "done" looks like
- Any key constraints

If something's missing, ask about it conversationally.

## Working with the Task File

When you're ready to update the task:
- Propose the refined prompt naturally (not in a rigid template)
- Ask if it captures what they want
- When they approve, add/update a \`## Refined Prompt\` section in the task file
- Don't change \`stage\` or \`agent\` unless they explicitly ask

## Project-Specific Lens
- Kanban2Code: staged workflow, filesystem tasks, orchestration pipeline
- We are redesigning automation, providers, and "modes" semantics
- Optimize for sequencing major changes safely before coding

## Anti-Patterns
- Forcing every response into "What I heard / Questions / Draft prompt" sections
- Using numbered question lists when one natural question works
- Over-formalizing the approval process
- Asking more than 3 questions at once
- Diving into technical details before understanding the high-level goal
`
};

// src/assets/providers.ts
var BUNDLED_PROVIDERS = {
  "codex-high.md": "---\ncli: codex\nsubcommand: exec\nmodel: gpt-5.3-codex\nunattended_flags:\n  - '--yolo'\noutput_flags:\n  - '--json'\nprompt_style: stdin\nprovider: openai\nconfig_overrides:\n  model_reasoning_effort: high\n---\n\n",
  "codex-low.md": "---\ncli: codex\nsubcommand: exec\nmodel: gpt-5.3-codex\nunattended_flags:\n  - '--yolo'\noutput_flags:\n  - '--json'\nprompt_style: stdin\nprovider: openai\nconfig_overrides:\n  model_reasoning_effort: low\n---\n\n",
  "codex-xhigh.md": "---\ncli: codex\nsubcommand: exec\nmodel: gpt-5.3-codex\nunattended_flags:\n  - '--yolo'\noutput_flags:\n  - '--json'\nprompt_style: stdin\nprovider: openai\nconfig_overrides:\n  model_reasoning_effort: xhigh\n---\n\n",
  "codex.md": "---\ncli: codex\nsubcommand: exec\nmodel: gpt-5.3-codex\nunattended_flags:\n  - '--yolo'\noutput_flags:\n  - '--json'\nprompt_style: stdin\nprovider: openai\nconfig_overrides:\n  model_reasoning_effort: medium\n---\n\n",
  "glm.md": "---\ncli: kilo\nsubcommand: run\nmodel: zai/glm-5\nunattended_flags:\n  - '--auto'\noutput_flags: []\nprompt_style: positional\nprovider: zai\n---\n",
  "haiku.md": "---\ncli: claude\nmodel: claude-haiku-4-5\nunattended_flags:\n  - '--dangerously-skip-permissions'\noutput_flags:\n  - '--output-format'\n  - json\nprompt_style: flag\nsafety:\n  max_turns: 20\n  max_budget_usd: 2\nprovider: anthropic\n---\n\n",
  "kimi.md": "---\ncli: kimi\nmodel: kimi-k2-thinking-turbo\nunattended_flags:\n  - '--print'\noutput_flags:\n  - '--quiet'\nprompt_style: flag\nprovider: moonshot\n---\n\n",
  "minimax.md": "---\ncli: minimax\nmodel: kimi-k2-5\nunattended_flags:\n  - '--print'\noutput_flags:\n  - '--quiet'\nprompt_style: flag\nprovider: minimax\n---\n",
  "opus.md": "---\ncli: claude\nmodel: claude-opus-4-6\nunattended_flags:\n  - '--dangerously-skip-permissions'\noutput_flags:\n  - '--output-format'\n  - json\nprompt_style: flag\nsafety:\n  max_turns: 20\n  max_budget_usd: 5\nprovider: anthropic\n---\n\n",
  "sonnet.md": "---\ncli: claude\nmodel: claude-sonnet-4-5\nunattended_flags:\n  - '--dangerously-skip-permissions'\noutput_flags:\n  - '--output-format'\n  - json\nprompt_style: flag\nsafety:\n  max_turns: 20\n  max_budget_usd: 3\nprovider: anthropic\n---\n\n"
};

// src/assets/contexts.ts
var BUNDLED_CONTEXTS = {
  "ai-guide.md": '---\nname: Kanban2Code AI Guide\ndescription: Operational guide for AI agents and providers in a Kanban2Code workspace.\nscope: global\ncreated: 2025-12-14\nupdated: 2026-02-12\n---\n\n# Kanban2Code AI Guide\n\nThis guide defines how to create, edit, and progress task files in Kanban2Code.\n\n## 1) Core Concepts\n\n- `stage`: where the task is in the lifecycle (`inbox`, `plan`, `code`, `audit`, `completed`)\n- `agent`: behavioral role/instructions (`planner`, `coder`, `auditor`, etc.)\n- `provider`: LLM provider runtime config (CLI + model + flags)\n\nRule of thumb:\n\n- Agent controls **how** the assistant behaves.\n- Provider controls **what runtime** executes the prompt.\n\n## 2) Workspace Layout\n\nKanban2Code stores data under `.kanban2code/`:\n\n- `inbox/` and `projects/**`: task files\n- `_agents/`: agent behavioral instructions\n- `_providers/`: provider CLI config files\n- `_context/`: shared context docs\n- `_archive/`: completed tasks\n- `config.json`: config and `providerDefaults`\n\n## 3) Task File Format\n\nTask files are markdown with optional YAML frontmatter.\n\n```md\n---\nstage: plan\nagent: planner\nprovider: sonnet\ntags: [feature, p1]\ncontexts: [ai-guide]\nattempts: 0\n---\n\n# Improve runner retry handling\n\n## Goal\n\nMake retry behavior clearer and safer.\n```\n\nFields commonly used:\n\n- `stage`: `inbox | plan | code | audit | completed`\n- `agent`: behavioral role (e.g. planner, coder, auditor)\n- `provider`: runtime/LLM config identifier (optional)\n- `attempts`: integer retry count for runner workflow\n- `tags`, `contexts`, `parent`, `order`, `created`\n\n## 4) Stage Progression\n\nDefault execution path:\n\n- `inbox -> plan -> code -> audit -> completed`\n\nAudit outcomes:\n\n- accepted audit -> `completed`\n- failed audit -> `code` with incremented `attempts`\n- failed audit with `attempts >= 2` -> runner hard stop for human review\n\n## 5) Context Assembly\n\nPrompt context is assembled in layers:\n\n1. global: `.kanban2code/how-it-works.md`, `.kanban2code/architecture.md`, `.kanban2code/project-details.md`\n2. agent/provider instructions: from `_agents/` first\n3. project context: `.kanban2code/projects/<project>/_context.md`\n4. phase context: `.kanban2code/projects/<project>/<phase>/_context.md`\n5. custom contexts: from `contexts:`\n\nWhen runner mode is active, prompt context includes:\n\n- `<runner automated="true" />`\n\n## 6) Dual-Mode Behavior (Manual vs Automated)\n\nAgent instructions must support two execution environments.\n\n### Manual mode (default)\n\n- Assistant can edit task frontmatter directly for stage handoff.\n- Assistant can follow legacy manual workflow actions.\n\n### Automated mode (runner flag present)\n\n- Assistant must **not** edit frontmatter.\n- Assistant must **not** commit.\n- Assistant outputs structured markers only.\n- Runner applies all transitions and commit operations.\n\n## 7) Structured Output Markers\n\nUse HTML comment markers so runner parser can detect outcomes.\n\n- Stage transition:\n  - `<!-- STAGE_TRANSITION: code -->`\n  - `<!-- STAGE_TRANSITION: audit -->`\n  - `<!-- STAGE_TRANSITION: completed -->`\n- Changed files:\n  - `<!-- FILES_CHANGED: src/a.ts, src/b.ts -->`\n- Audit result:\n  - `<!-- AUDIT_RATING: 8 -->`\n  - `<!-- AUDIT_VERDICT: ACCEPTED -->`\n  - `<!-- AUDIT_VERDICT: NEEDS_WORK -->`\n\n## 8) Planner/Coder/Auditor Expectations\n\n- Planner:\n  - Produce implementation-ready plan and clear tests\n  - When done, MUST change task stage to `code` and agent to `coder`\n  - In manual mode: edit frontmatter directly\n  - In automated mode: output `<!-- STAGE_TRANSITION: code -->`\n\n- Coder:\n  - Implement requested changes and tests\n  - When done, MUST change task stage to `audit` and agent to `auditor`\n  - In automated mode output both stage transition and files changed markers\n\n- Auditor:\n  - Prioritize correctness, regressions, and missing tests\n  - Use `.kanban2code/architecture.md` (root-level) for architecture updates\n  - When done with rating 8+: MUST change to `completed`\n  - When done with rating <8: MUST change to `code` with agent `coder`\n  - In automated mode output `AUDIT_RATING` + `AUDIT_VERDICT`\n  - Retry-awareness in automated mode: be slightly more lenient on attempt 2+, while keeping standards\n\n## 9) Practical Examples\n\nManual planner handoff (frontmatter edited directly):\n\n```md\n---\nstage: code\nagent: coder\nprovider: opus\ntags: [feature, p1]\n---\n\n# Add stage-aware provider picker\n\n## Goal\n\nImplement UI provider picker behavior for plan/code/audit tasks.\n```\n\nAutomated coder output snippet:\n\n```md\nImplemented provider picker and tests.\n\n<!-- STAGE_TRANSITION: audit -->\n<!-- FILES_CHANGED: src/webview/ui/components/ProviderPicker.tsx, tests/webview/components/ProviderPicker.test.tsx -->\n```\n\nAutomated auditor output snippet:\n\n```md\nNo blocking issues found.\n\n<!-- AUDIT_RATING: 9 -->\n<!-- AUDIT_VERDICT: ACCEPTED -->\n```\n\n## 10) Common Mistakes To Avoid\n\n- Editing frontmatter in automated mode\n- Omitting structured markers in automated mode\n- Writing architecture notes to `_context/architecture.md` instead of `.kanban2code/architecture.md`\n- Marking a task complete without confirming tests/build expectations\n',
  "architecture.md": '---\nname: Architecture\ndescription: Codebase and project description\nscope: global\ncreated: \'2025-12-17\'\nfile_references:\n  - docs/architecture.md\n---\n\n# Architecture Context\n\nThis context file links to the main architecture documentation. When the auditor accepts a task (rating 8+), they should update this file or the linked documentation to reflect any new files created.\n\nSee: [docs/architecture.md](docs/architecture.md) for the full architecture documentation including directory structure.\n\n## Accepted Task Updates\n\n- date: 2026-02-26\n  - task: `task11.1-minimax-adapter-provider-expansion`\n  - files-updated:\n    - `src/runner/adapter-factory.ts` (registered `minimax` adapter case)\n    - `src/orchestrator/openai-client.ts` (added configurable OpenAI-compatible base URL and provider label)\n    - `src/orchestrator/orchestrator.ts` (routes MiniMax providers to `https://api.minimax.chat` via OpenAI-compatible stream client)\n    - `src/assets/providers.ts` (regenerated bundled providers to include `minimax.md`)\n    - `tests/orchestrator.test.ts` (added coverage for MiniMax endpoint routing)\n  - new-files-created:\n    - `.kanban2code/_providers/minimax.md` - Provider configuration for MiniMax CLI using the Kimi K2 model profile\n    - `src/runner/adapters/minimax-adapter.ts` - MiniMax CLI adapter implementing flag-based prompt execution and response parsing\n    - `tests/minimax-adapter.test.ts` - Unit tests for MiniMax adapter command construction, parsing behavior, and factory resolution\n\n- date: 2026-02-26\n  - task: `task8.1-new-messaging-protocol`\n  - files-updated: none\n  - new-files-created:\n    - `src/webview/messaging.ts` - Defines V2 host/webview message contracts with strict Zod payload schemas, typed envelope helpers, and discriminated union validation\n    - `tests/webview/messaging.test.ts` - Verifies round-trip serialization/validation for all V2 message types plus invalid version/type/payload rejection and type inference checks\n\n- date: 2026-02-26\n  - task: `task6.1-task-file-generator`\n  - files-updated: none\n  - new-files-created:\n    - `src/types/task-proposal.ts` - Defines `TaskProposal` payload shape for orchestrator-generated task metadata\n    - `src/services/task-generator.ts` - Parses YAML/JSON task proposals and writes validated task markdown files into inbox/project paths\n    - `tests/task-generator.test.ts` - Verifies proposal parsing, file generation, and successful `parseTaskFile()` round-trip\n\n- date: 2026-02-26\n  - task: `task5.1-orchestrator-service`\n  - files-updated: none\n  - new-files-created:\n    - `src/orchestrator/orchestrator.ts` - Main stateless orchestrator service that resolves provider config, builds system prompt context, and streams model tokens\n    - `src/orchestrator/anthropic-client.ts` - Anthropic HTTP streaming client for `content_block_delta` SSE token extraction\n    - `src/orchestrator/openai-client.ts` - OpenAI HTTP streaming client for chat completion delta token extraction\n    - `src/orchestrator/system-prompt-builder.ts` - Workspace-aware system prompt builder with task/skill summaries and optional agent/custom prompt sections\n    - `src/types/orchestrator.ts` - Shared orchestrator call/message types for provider calls and context injection\n    - `tests/orchestrator.test.ts` - Unit tests covering system prompt content and Anthropic stream/error behavior\n\n- date: 2026-02-26\n  - task: `task4.1-skill-auto-selector`\n  - files-updated: none\n  - new-files-created:\n    - `src/services/skill-selector.ts` - Skill auto-selection service with framework detection, scoring, ordering, and content hydration\n    - `src/types/skill.ts` - Shared types for selected skills and skill index metadata\n    - `tests/skill-selector.test.ts` - Unit tests for framework detection, matching behavior, ordering, and hydration\n\n- date: 2026-02-26\n  - task: `task3.1-workspace-snapshot-service`\n  - files-updated: none\n  - new-files-created:\n    - `src/types/snapshot.ts` - Defines `WorkspaceSnapshot` types including stage-grouped tasks and metadata counts\n    - `src/services/workspace-snapshot.ts` - Builds aggregate workspace snapshot from config, tasks, agents, contexts, skills, and providers\n    - `tests/workspace-snapshot.test.ts` - Unit tests for populated workspace snapshot, empty workspace defaults, and invalid-root errors\n\n- date: 2026-02-26\n  - task: `task2.1-port-runner`\n  - files-updated: none\n  - new-files-created:\n    - `src/runner/cli-adapter.ts` - Base CLI adapter interface and shared response/command types\n    - `src/runner/adapter-factory.ts` - Adapter resolver by CLI executable\n    - `src/runner/adapters/claude-adapter.ts` - Claude CLI adapter with JSON parsing\n    - `src/runner/adapters/codex-adapter.ts` - Codex CLI adapter with JSONL stream parsing\n    - `src/runner/adapters/kimi-adapter.ts` - KIMI CLI adapter with plain-text parsing\n    - `src/runner/adapters/kilo-adapter.ts` - Kilo CLI adapter with JSONL stream parsing\n    - `src/runner/output-parser.ts` - Structured output marker extraction helpers\n    - `src/runner/runner-state.ts` - Runner runtime state event helpers\n    - `src/runner/runner-log.ts` - Markdown run report generation and persistence\n    - `src/runner/git-ops.ts` - Git cleanliness and auto-commit operations for runner flows\n    - `src/runner/runner-engine.ts` - Core stage pipeline execution engine\n    - `tests/runner-log.test.ts` - Unit coverage for runner log output/persistence\n    - `tests/runner-engine.test.ts` - Unit coverage for runner pipeline behavior\n    - `tests/e2e/setup.ts` - E2E workspace utilities for workflow tests\n    - `tests/e2e/core-workflows.test.ts` - E2E workflow coverage for core lifecycle behavior\n\n- date: 2026-02-26\n  - task: `task1.1-port-core-types-and-services`\n  - files-updated:\n    - `package.json` (added `fast-glob`, `gray-matter`, `zod`)\n  - new-files-created:\n    - `src/types/*.ts` (task, provider, config, errors, filters, context, copy)\n    - `src/core/*.ts` (constants, rules)\n    - `src/utils/text.ts`\n    - `src/workspace/*.ts` (state, validation)\n    - `src/services/scanner.ts` - Task file scanning and sorting\n    - `src/services/frontmatter.ts` - Frontmatter parsing/serialization\n    - `src/services/stage-manager.ts` - Task stage transitions\n    - `src/services/task-content.ts` - Task content reading/writing\n    - `src/services/task-watcher.ts` - File system watcher for tasks\n    - `src/services/projects.ts` - Project/phase management\n    - `src/services/archive.ts` - Archiving logic\n    - `src/services/delete-task.ts` - Task deletion\n    - `src/services/copy.ts` - Clipboard operations\n    - `src/services/fs-move.ts` - File system move helper\n    - `src/services/scaffolder.ts` - Workspace initialization\n    - `src/services/config.ts` - Configuration service\n    - `src/services/logging.ts` - Structured logging\n    - `src/services/error-recovery.ts` - Error handling\n    - `src/services/prompt-builder.ts` - Context assembly for prompts\n    - `src/services/context.ts` - Context file management\n    - `src/services/provider-service.ts` - Provider config management\n    - `src/assets/*.ts` (agents, providers, contexts, seed-content)\n    - `tests/setup.ts` - Global test setup\n    - `tests/vscode-stub.ts` - VS Code API stub\n    - `tests/*.test.ts` - Unit tests for all services\n\n- date: 2026-02-26\n  - task: `task0.1-clean-slate-bootstrap`\n  - files-updated:\n    - `build.ts` (simplified esbuild bootstrap for extension and webview bundles)\n    - `src/extension.ts` (minimal activation/deactivation with Output Channel logging)\n    - `vitest.config.ts` (baseline test config with VS Code alias and coverage defaults)\n    - `docs/architecture.md` (initialized architecture document with directory structure)\n  - new-files-created:\n    - `package.json` - Minimal VS Code extension manifest, activation events, and Bun scripts\n    - `tsconfig.json` - TypeScript compiler configuration for extension/webview sources\n    - `vitest.e2e.config.ts` - E2E test runner configuration baseline\n    - `.vscodeignore` - VSIX packaging exclusions\n    - `.prettierrc` - Project formatting rules\n    - `eslint.config.mjs` - Project linting configuration\n    - `src/webview/ui/main.tsx` - Minimal React entry that renders `Loading...`\n    - `src/webview/ui/vscodeApi.ts` - Singleton VS Code webview API accessor\n\n- date: 2026-02-11\n  - task: `task1.1-add-agent-and-attempts-fields-to-task-interface`\n  - files-updated:\n    - `src/types/task.ts` (`Task` now includes optional `agent?: string` and `attempts?: number`)\n    - `src/services/frontmatter.ts` (parse + stringify support for `agent` and `attempts`)\n  - new-files-created: none\n\n- date: 2026-02-11\n  - task: `task1.2-define-providerconfig-and-agentconfig-types-with-zod-schemas`\n  - files-updated: none\n  - new-files-created:\n    - `src/types/provider.ts` - Defines `ProviderConfig` interface and Zod schema for CLI configuration\n    - `src/types/agent.ts` - Defines `AgentConfig` interface and Zod schema for agent configuration\n    - `tests/provider-agent-schemas.test.ts` - Tests for the provider and agent schema validation\n\n- date: 2026-02-11\n  - task: `task1.3-add-agents-folder-and-logs-folder-constants`\n  - files-updated:\n    - `src/core/constants.ts` (added `AGENTS_FOLDER = \'_agents\'` and `LOGS_FOLDER = \'_logs\'`)\n  - new-files-created: none\n\n- date: 2026-02-11\n  - task: `task2.1-create-agentservice-crud-for-agents`\n  - files-updated:\n    - `docs/architecture.md` (added `agent-service.ts` to service list)\n  - new-files-created:\n    - `src/services/agent-service.ts` - Service for CRUD operations on agent files\n    - `tests/agent-service.test.ts` - Tests for agent files CRUD operations\n\n- date: 2026-02-11\n  - task: `task2.2-create-providerservice-crud-for-new-providers-cli-config-files`\n  - files-updated: none\n  - new-files-created:\n    - `src/services/provider-service.ts` - CRUD service for provider CLI configuration files in `_providers/`\n    - `tests/provider-service.test.ts` - Tests for provider CLI config CRUD operations\n\n- date: 2026-02-11\n  - task: `task2.3-update-frontmatter-parser-for-agent-and-attempts`\n  - files-updated:\n    - `src/services/frontmatter.ts` (parse/serialize `agent` and `attempts` fields)\n    - `src/services/task-content.ts` (`saveTaskWithMetadata` metadata interface now includes `agent`)\n    - `src/webview/KanbanPanel.ts` (threads `agent` through `FullTaskDataLoaded` and `SaveTaskWithMetadata`)\n    - `src/webview/SidebarProvider.ts` (threads `agent` through `FullTaskDataLoaded` and `SaveTaskWithMetadata`)\n    - `src/webview/ui/components/TaskEditorModal.tsx` (manages `agent` state, dirty checking, save)\n    - `tests/frontmatter.test.ts` (4 new tests for agent/attempts parsing, serialization, round-trip)\n  - new-files-created: none\n\n- date: 2026-02-11\n  - task: `task2.4-update-prompt-builder-for-agent-aware-context-loading`\n  - files-updated:\n    - `src/services/prompt-builder.ts` (added `loadAgentInstructions` with 3-step fallback chain, `buildRunnerPrompt` export, runner `<runner automated="true" />` injection)\n  - new-files-created: none\n  - tests-added:\n    - `tests/prompt-builder.test.ts` (5 new tests: agent loading, provider-to-agent fallback, provider fallback, runner prompt shape, runner automated flag)\n\n- date: 2026-02-11\n  - task: `task2.5-update-stage-manager-for-agent-aware-auto-assignment`\n  - files-updated:\n    - `src/services/stage-manager.ts` (added `AgentInfo`, `listAgentsWithStage`, `getDefaultAgentForStage`, `getDefaultProviderForAgent`, `shouldAutoUpdateAgent`; updated `updateTaskStage` to auto-set `agent` and `provider` from agent defaults with fallback to stage-based provider assignment)\n  - new-files-created: none\n  - tests-added:\n    - `tests/stage-manager.test.ts` (5 new tests: agent-for-stage lookup, provider-for-agent config lookup, auto-set agent+provider on code/audit stages, manual agent preservation)\n\n- date: 2026-02-11\n  - task: `task3.1-create-migration-service-providers-to-agents-new-providers`\n  - files-updated:\n    - `.kanban2code/.gitignore` (added `_logs/` entry)\n  - new-files-created:\n    - `src/services/migration.ts` - Atomic migration service for providers \u2192 agents transition\n    - `tests/migration.test.ts` - Tests for migration service functionality\n  - tests-added:\n    - 4 tests: migration success, idempotence, rollback, gitignore update\n\n- date: 2026-02-11\n  - task: `task3.2-update-build-script-to-bundle-agents`\n  - files-updated:\n    - `build.ts` (added `_agents/` directory reading to `generateBundledContent()`)\n  - new-files-created:\n    - `src/assets/agents.ts` - Auto-generated file containing bundled agent files\n\n- date: 2026-02-11\n  - task: `task3.3-update-scaffolder-for-agents-directory`\n  - files-updated:\n    - `src/services/scaffolder.ts` (added `_agents/` to scaffold and sync functions)\n    - `tests/scaffolder.test.ts` (added tests for agent scaffolding)\n  - new-files-created: none\n  - tests-added:\n    - 2 tests: scaffold creates agents, sync preserves existing agents\n\n- date: 2026-02-11\n  - task: `task3.4-register-migration-command-verify-file-watcher-coverage`\n  - files-updated:\n    - `src/commands/index.ts` (registered `kanban2code.migrateProvidersAgents` command with VS Code progress notification)\n    - `src/services/task-watcher.ts` (added `_agents/` and `_providers/` exclusion in `isTaskFile()`)\n    - `package.json` (added command declaration and activation event)\n  - new-files-created: none\n  - tests-added:\n    - 2 tests in `tests/task-watcher.test.ts`: `_agents/` and `_providers/` exclusion from task events\n\n- date: 2026-02-11\n  - task: `task4.0-deterministic-task-ordering-in-scanner`\n  - files-updated:\n    - `src/services/scanner.ts` (added `sortTasks` and `getOrderedTasksForStage` exports; `loadAllTasks` now returns sorted results)\n    - `tests/scanner.test.ts` (added 10 tests for deterministic ordering)\n  - new-files-created: none\n  - tests-added:\n    - 10 tests: order field sorting, undefined order handling, filename tiebreaker, stage filtering, immutability\n\n- date: 2026-02-11\n  - task: `task4.1-cli-adapter-interface-claude-adapter`\n  - files-updated: none\n  - new-files-created:\n    - `src/runner/cli-adapter.ts` - `CliAdapter` interface, `CliResponse`, `CliCommandResult`, `CliAdapterOptions` types\n    - `src/runner/adapters/claude-adapter.ts` - Claude CLI adapter implementation\n    - `tests/claude-adapter.test.ts` - Tests for Claude adapter\n\n- date: 2026-02-11\n  - task: `task4.2-codex-kimi-and-kilo-cli-adapters-adapter-factory`\n  - files-updated: none\n  - new-files-created:\n    - `src/runner/adapters/codex-adapter.ts` - Codex CLI adapter (stdin prompt, JSONL output)\n    - `src/runner/adapters/kimi-adapter.ts` - KIMI CLI adapter (-p flag, plain text output)\n    - `src/runner/adapters/kilo-adapter.ts` - Kilo CLI adapter (positional prompt, JSONL output)\n    - `src/runner/adapter-factory.ts` - Factory function `getAdapterForCli(cli) \u2192 CliAdapter`\n    - `tests/other-cli-adapters.test.ts` - Tests for Codex, KIMI, Kilo adapters and factory\n\n- date: 2026-02-11\n  - task: `task4.3-structured-output-parser`\n  - files-updated: none\n  - new-files-created:\n    - `src/runner/output-parser.ts` - Structured marker extraction for LLM output\n    - `tests/output-parser.test.ts` - Tests for output-parser\n  - tests-added:\n    - 8 tests: stage transitions, audit ratings, verdicts, file lists, and fallbacks\n\n- date: 2026-02-11\n  - task: `task4.5-git-operations-for-runner`\n  - files-updated: none\n  - new-files-created:\n    - `src/runner/git-ops.ts` - Git helper functions for runner (`isWorkingTreeClean`, `hasUncommittedChanges`, `commitRunnerChanges`)\n    - `tests/git-ops.test.ts` - Tests for git operations (3 tests)\n\n- date: 2026-02-11\n  - task: `task4.4-runner-execution-engine`\n  - files-updated: none\n  - new-files-created:\n    - `src/runner/runner-engine.ts` - Core runner execution engine with sequential pipeline logic\n    - `tests/runner-engine.test.ts` - Tests for RunnerEngine\n  - tests-added:\n    - 6 tests: pipeline execution, audit failure loops, CLI crash handling, dirty git check\n\n- date: 2026-02-11\n  - task: `task4.6-runner-log-report-generator`\n  - files-updated: none\n  - new-files-created:\n    - `src/runner/runner-log.ts` - `RunnerLog` class for generating markdown run reports\n    - `tests/runner-log.test.ts` - Tests for runner log generation and persistence\n  - tests-added:\n    - 4 tests: markdown headers, summary counts, per-task fields, zero-task handling\n\n- date: 2026-02-11\n  - task: `task4.7-register-runner-vs-code-commands`\n  - files-updated:\n    - `src/commands/index.ts` (registered runner commands)\n    - `src/extension.ts` (runner singleton lifecycle, progress API)\n    - `package.json` (added runner commands)\n  - new-files-created:\n    - `tests/runner-singleton.test.ts` - Tests for runner singleton and cancellation\n\n- date: 2026-02-11\n  - task: `task5.1-update-messaging-protocol-for-modes-and-runner`\n  - files-updated:\n    - `src/webview/messaging.ts` (added mode-management and runner-control message types; added `RunnerState` type/schema/parser)\n    - `tests/webview.test.ts` (added EnvelopeSchema coverage for new message types and RunnerState validation tests)\n  - new-files-created: none\n\n- date: 2026-02-11\n  - task: `task5.2-modepicker-component-update-agentpicker`\n  - files-updated:\n    - `src/webview/ui/components/AgentPicker.tsx` (Agent picker now targets LLM providers, updates label to "Agent (LLM Provider)", and keeps provider description hint behavior)\n    - `src/webview/ui/components/TaskEditorModal.tsx` (uses provider-based AgentPicker wiring)\n    - `src/webview/ui/components/TaskModal.tsx` (uses provider-based AgentPicker wiring)\n    - `tests/webview/components/AgentPicker.test.tsx` (covers provider rendering, label text, no-selection behavior, and canonical name resolution)\n  - new-files-created:\n    - `src/webview/ui/components/ModePicker.tsx` - Mode dropdown component with mode description hint and "Create new mode" action\n    - `tests/webview/components/ModePicker.test.tsx` - ModePicker component tests for rendering, selection, callbacks, and no-selection behavior\n\n- date: 2026-02-11\n  - task: `task5.3-runner-controls-on-column-headers`\n  - files-updated:\n    - `src/webview/ui/components/Column.tsx` (added runner control buttons: play, play-all, stop; visibility logic based on `isRunnerActive` and `stage`)\n    - `src/webview/ui/components/BoardHorizontal.tsx` (passed down runner control props to Column)\n    - `src/webview/ui/styles/main.css` (styles for runner controls and buttons)\n    - `tests/webview/column.test.tsx` (added 6 tests for runner control visibility, behavior, and callbacks)\n  - new-files-created: none\n\n- date: 2026-02-12\n  - task: `task5.4-update-taskcard-for-mode-runner-status`\n  - files-updated:\n    - `src/webview/ui/components/TaskCard.tsx` (footer now renders `mode | agent` when both exist, shows agent-only fallback, adds per-card run action and running-state indicator)\n    - `src/webview/ui/components/Icons.tsx` (added `PlayIcon` for card-level run action)\n    - `src/webview/ui/components/Column.tsx` (threads `runningTaskId` and `onRunTask` into TaskCard)\n    - `src/webview/ui/components/BoardHorizontal.tsx` (threads `runningTaskId` and `onRunTask` into Column)\n    - `src/webview/ui/styles/main.css` (added running card pulse border, spinner, and disabled action styling)\n    - `tests/webview/taskcard.test.tsx` (added tests for mode+agent footer display, run button stage visibility, and active runner indicator)\n  - new-files-created: none\n\n- date: 2026-02-12\n  - task: `task5.5-update-taskmodal-and-taskeditormodal-for-mode-field`\n  - files-updated:\n    - `src/webview/ui/components/TaskModal.tsx` (added ModePicker below AgentPicker, `mode` in form data and CreateTask payload)\n    - `src/webview/ui/components/TaskEditorModal.tsx` (added ModePicker to Assignment section, `mode` in metadata state, dirty checking, and SaveTaskWithMetadata payload)\n    - `src/webview/ui/components/Sidebar.tsx` (threads `modes` from `useTaskData` to `TaskModal`)\n    - `src/webview/ui/components/Board.tsx` (threads `modes` from `useTaskData` to `TaskModal`)\n    - `src/webview/ui/hooks/useTaskData.ts` (exposes `modes` in return value, handles `InitState` modes payload)\n    - `src/webview/SidebarProvider.ts` (loads modes via `listAvailableModes`, sends in `InitState` and `FullTaskDataLoaded`)\n    - `src/webview/KanbanPanel.ts` (loads modes via `listAvailableModes`, sends in `InitState` and `FullTaskDataLoaded`)\n    - `src/commands/index.ts` (writes `mode` to frontmatter in `newTask` command)\n    - `tests/webview/task-modal-create-project.test.tsx` (added tests for mode+agent picker rendering and CreateTask payload)\n    - `tests/webview/task-editor-modal.test.tsx` (added tests for mode+agent picker rendering, SaveTaskWithMetadata payload with mode, null mode backward compat)\n  - new-files-created: none\n\n- date: 2026-02-12\n  - task: `task5.6-wire-runner-messages-through-webview-hosts`\n  - files-updated:\n    - `src/webview/KanbanPanel.ts` (added `RunTask`, `RunColumn`, `StopRunner` message handlers; subscribes to `onRunnerStateChanged` and posts `RunnerStateChanged` to webview; includes runner state in `InitState`)\n    - `src/webview/SidebarProvider.ts` (added `RequestModes`, `CreateMode`, `RunTask`, `RunColumn`, `StopRunner` message handlers; subscribes to `onRunnerStateChanged` and posts `RunnerStateChanged` to webview; includes runner state in `InitState`)\n    - `src/webview/ui/hooks/useTaskData.ts` (exposes `modes`, `isRunnerActive`, `activeRunnerTaskId` in return value; handles `RunnerStateChanged` and `ModesLoaded` messages)\n  - new-files-created:\n    - `src/runner/runner-state.ts` - Simple event emitter module for runner state (get/set/subscribe)\n    - `tests/webview-host-runner.test.ts` - Tests for webview host runner message handling\n    - `tests/webview/useTaskData.runner.test.tsx` - Tests for useTaskData runner state tracking\n\n- date: 2026-02-12\n  - task: `task5.7-modemodal-component-create-edit-mode`\n  - files-updated:\n    - `src/webview/ui/components/index.ts` (added `ModeModal` barrel export)\n    - `src/webview/ui/styles/main.css` (added `.mode-modal` size class alongside `.agent-modal`)\n  - new-files-created:\n    - `src/webview/ui/components/ModeModal.tsx` - Modal for creating and editing mode files (glassmorphic pattern)\n    - `tests/webview/components/ModeModal.test.tsx` - Tests for ModeModal (field rendering, validation, edit mode pre-population)\n\n- date: 2026-02-12\n  - task: `task5.8-update-context-menu-for-mode-and-runner-actions`\n  - files-updated:\n    - `src/webview/ui/components/TaskContextMenu.tsx` (added "Run Task" action with runner-active/stage guard, "Change Mode" submenu, "Change Agent" submenu, and `updateTaskMetadata` helper for `SaveTaskWithMetadata`)\n    - `src/webview/ui/components/Sidebar.tsx` (passes `modes`, `agents`, `isRunnerActive` to TaskContextMenu)\n    - `src/webview/ui/components/Board.tsx` (passes `modes`, `agents`, `isRunnerActive` to TaskContextMenu)\n    - `tests/webview/components/TaskContextMenu.test.tsx` (4 tests: Run Task visibility, disabled state, mode submenu, agent submenu)\n  - new-files-created: none\n\n- date: 2026-02-12\n  - task: `task6.2-redesign-coder-mode-for-structured-output`\n  - files-updated:\n    - `.kanban2code/_modes/coder.md` (added dual-mode instructions: Mode Detection, Manual/Automated output and workflow sections; explicit no-commit rule in automated mode)\n  - new-files-created: none\n\n- date: 2026-02-12\n  - task: `refactor-mode-to-agent-and-agent-to-provider`\n  - description: Comprehensive refactoring to align terminology with industry standards.\n  - files-updated:\n    - `src/types/*.ts`, `src/services/*.ts`, `src/runner/*.ts`, `src/webview/*.tsx`, `tests/*.ts`\n    - `package.json`, `build.ts`, `scaffolder.ts`\n  - new-files-created:\n    - `.kanban2code/_providers/` (moved from defunct modes)\n    - `src/assets/providers.ts` (replaced `modes.ts`)\n  - status: completed\n\n- date: 2026-02-13\n  - task: `1770933535169-create-a-coming-soon-page`\n  - files-updated: none\n  - new-files-created:\n    - `docs/design/coming-soon.html` - Standalone modern glassmorphic landing page with hero, 6-feature teaser grid, preview placeholder, CTA, and footer\n\n- date: 2026-02-13\n  - task: `1771012835226-add-more-codex-providers`\n  - files-updated:\n    - `src/assets/providers.ts` (regenerated bundled providers now include codex reasoning-effort variants)\n    - `tests/provider-service.test.ts` (added coverage for parsing `config_overrides.model_reasoning_effort`)\n    - `tests/scaffolder.test.ts` (added assertions that new codex variant provider files scaffold correctly)\n  - new-files-created:\n    - `.kanban2code/_providers/codex-low.md` - Codex provider preset with `model_reasoning_effort: low`\n    - `.kanban2code/_providers/codex-high.md` - Codex provider preset with `model_reasoning_effort: high`\n    - `.kanban2code/_providers/codex-xhigh.md` - Codex provider preset with `model_reasoning_effort: xhigh`\n',
  "skills-index.json": `{
  "version": "1.0.0",
  "last_updated": "2026-02-19",
  "framework_detection": {
    "nextjs": {
      "files": ["next.config.js", "next.config.ts", "next.config.mjs"],
      "package_json_deps": ["next"],
      "keywords": ["next.js", "nextjs", "app router", "pages router"]
    },
    "react": {
      "files": ["*.tsx", "*.jsx"],
      "package_json_deps": ["react", "react-dom"],
      "keywords": ["react", "component", "hooks", "useState", "useEffect"]
    },
    "python": {
      "files": ["*.py", "pyproject.toml", "setup.py", "requirements.txt"],
      "keywords": ["python", "pandas", "numpy", "greykite", "sklearn", "fastapi", "flask", "django"]
    },
    "greykite": {
      "files": ["*.py", "pyproject.toml", "setup.py", "requirements.txt"],
      "keywords": ["greykite", "silverkite", "time series forecast", "anomaly detection", "changepoint detection", "linkedin forecasting"]
    }
  },
  "core_skills": [
    {
      "name": "Next.js 16 Core",
      "file": "_context/skills/nextjs-core-skills.md",
      "framework": "nextjs",
      "always_attach": true,
      "priority": 10,
      "description": "Mandatory baseline for Next.js 16. Covers async APIs (params, cookies, headers), proxy.ts migration, React 19 patterns (useActionState), and parallel route requirements."
    },
    {
      "name": "React + TypeScript Core",
      "file": "_context/skills/react-core-skills.md",
      "framework": "react",
      "always_attach": true,
      "priority": 9,
      "description": "React/TypeScript naming conventions and patterns. Enforces PascalCase components, camelCase variables, {Component}Props interfaces, and hook best practices."
    },
    {
      "name": "Python Core (PEP 8)",
      "file": "_context/skills/python-core-skills.md",
      "framework": "python",
      "always_attach": true,
      "priority": 9,
      "description": "Python naming conventions and best practices. Enforces PEP 8 snake_case, type hints, docstrings, and Pythonic patterns."
    }
  ],
  "conditional_skills": [
    {
      "name": "Caching & Data Fetching",
      "file": "_context/skills/skill-caching-data-fetching.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "cache",
          "caching",
          "fetch",
          "revalidate",
          "revalidateTag",
          "cacheTag",
          "cacheLife",
          "use cache",
          "unstable_cache",
          "ISR",
          "stale",
          "PPR",
          "partial prerendering"
        ],
        "files": [
          "**/use-cache.ts",
          "**/cache.ts",
          "**/data.ts",
          "**/lib/fetch*.ts"
        ],
        "task_patterns": [
          "performance",
          "slow page",
          "data not updating",
          "stale data",
          "caching strategy",
          "incremental static regeneration"
        ]
      },
      "description": "Deep dive into 'use cache' directive, cacheLife profiles (seconds/minutes/hours/days/weeks/max), cacheTag for invalidation, PPR patterns, and the 'uncached by default' paradigm shift."
    },
    {
      "name": "Server Actions & Mutations",
      "file": "_context/skills/skill-server-actions-mutations.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "server action",
          "use server",
          "useActionState",
          "useFormState",
          "useFormStatus",
          "form action",
          "FormData",
          "mutation",
          "submit",
          "zod",
          "validation",
          ".bind"
        ],
        "files": [
          "**/actions.ts",
          "**/actions/*.ts",
          "**/*-action.ts"
        ],
        "task_patterns": [
          "form submission",
          "create form",
          "update data",
          "delete record",
          "handle form",
          "validate input"
        ]
      },
      "description": "Security patterns (Zod validation mandatory), useActionState migration from useFormState, .bind() for secure argument passing, redirect() placement outside try/catch."
    },
    {
      "name": "Routing & Layouts",
      "file": "_context/skills/skill-routing-layouts.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "parallel route",
          "@modal",
          "@slot",
          "default.js",
          "default.tsx",
          "intercepting route",
          "(.)folder",
          "(..)folder",
          "layout.tsx",
          "loading.js",
          "error.js",
          "route group"
        ],
        "files": [
          "**/default.tsx",
          "**/default.js",
          "**/@*/page.tsx",
          "**/loading.tsx",
          "**/error.tsx"
        ],
        "task_patterns": [
          "modal",
          "sidebar",
          "navigation",
          "nested layout",
          "create page",
          "add route",
          "parallel slot"
        ]
      },
      "description": "Parallel routes (default.js requirement), intercepting routes syntax (.)/(..)/(...), async params in layouts, loading.js and error.js patterns."
    },
    {
      "name": "next-intl (App Router i18n)",
      "file": "_context/skills/skill-next-intl.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "next-intl",
          "i18n",
          "internationalization",
          "localization",
          "locale",
          "locales",
          "translations",
          "NextIntlClientProvider",
          "setRequestLocale",
          "defineRouting",
          "createNavigation",
          "getRequestConfig",
          "localePrefix"
        ],
        "files": [
          "**/i18n/routing.ts",
          "**/i18n/navigation.ts",
          "**/i18n/request.ts",
          "**/middleware.ts",
          "messages/*.json"
        ],
        "task_patterns": [
          "i18n setup",
          "localize routes",
          "localized navigation",
          "translate UI",
          "multi-language",
          "locale detection"
        ]
      },
      "description": "Next.js 16 App Router i18n with next-intl: async params, setRequestLocale, NextIntlClientProvider, defineRouting, middleware matcher, and navigation wrappers."
    },
    {
      "name": "Drizzle ORM (PostgreSQL)",
      "file": "_context/skills/skill-drizzle-orm.md",
      "framework": "node",
      "triggers": {
        "keywords": [
          "drizzle",
          "drizzle-orm",
          "drizzle-kit",
          "pgTable",
          "jsonb",
          "$type",
          "db:push",
          "db:generate",
          "db:migrate",
          "postgres",
          "postgresql",
          "migration"
        ],
        "files": [
          "**/drizzle.config.ts",
          "**/src/db/schema.ts",
          "**/src/db/client.ts",
          "drizzle/**/*.sql"
        ],
        "task_patterns": [
          "drizzle orm",
          "database schema",
          "postgres migrations",
          "jsonb handling",
          "connection pooling"
        ]
      },
      "description": "Drizzle ORM patterns for PostgreSQL: schema in TS, jsonb $type typing, pg Pool usage, indexes in pgTable callback, and dev/prod migration workflow."
    },
    {
      "name": "HTTP Security Headers (Next.js)",
      "file": "_context/skills/skill-http-security-headers.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "Content-Security-Policy",
          "CSP",
          "security headers",
          "headers()",
          "next.config",
          "X-Frame-Options",
          "X-Content-Type-Options",
          "Referrer-Policy",
          "Permissions-Policy",
          "clickjacking",
          "XSS",
          "nonce",
          "strict-dynamic"
        ],
        "files": [
          "**/next.config.ts",
          "**/next.config.js",
          "**/next.config.mjs",
          "**/proxy.ts",
          "**/middleware.ts"
        ],
        "task_patterns": [
          "security hardening",
          "post-incident",
          "add CSP",
          "configure headers",
          "prevent clickjacking",
          "tighten referrer policy"
        ]
      },
      "description": "Next.js HTTP response header hardening: baseline headers, CSP (static vs nonce), Report-Only rollout, and next.config headers() patterns."
    },
    {
      "name": "Tailwind CSS v4 (CSS-first)",
      "file": "_context/skills/skill-tailwindcss-v4.md",
      "framework": "react",
      "triggers": {
        "keywords": [
          "tailwind v4",
          "tailwindcss v4",
          "tailwindcss",
          "@theme",
          "@source",
          "@config",
          "@tailwindcss/postcss",
          "postcss.config",
          "globals.css",
          "tw-animate-css",
          "tailwind.config.js",
          "@tailwind base",
          "@tailwind utilities"
        ],
        "files": [
          "**/postcss.config.*",
          "**/app/globals.css",
          "**/src/app/globals.css",
          "**/*.css"
        ],
        "task_patterns": [
          "tailwind setup",
          "tailwind migration",
          "css-first",
          "design tokens",
          "theme variables",
          "animate utilities"
        ]
      },
      "description": "Tailwind CSS v4 CSS-first setup: @import \\"tailwindcss\\", @theme tokens, @tailwindcss/postcss, @source scan paths, legacy @config, and tw-animate-css integration."
    },
    {
      "name": "Testing Stack (Vitest + Playwright)",
      "file": "_context/skills/skill-vitest-playwright-testing.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "vitest",
          "playwright",
          "jsdom",
          "@vitejs/plugin-react",
          "vitest.config",
          "playwright.config",
          "*.test.ts",
          "*.test.tsx",
          "tests/*.spec.ts",
          "coverage",
          "next/headers",
          "cookies()",
          "headers()",
          "supabase",
          "vi.mock"
        ],
        "files": [
          "**/vitest.config.ts",
          "**/vitest.setup.ts",
          "**/playwright.config.ts",
          "tests/**/*.spec.ts"
        ],
        "task_patterns": [
          "testing stack",
          "add tests",
          "unit tests",
          "e2e tests",
          "coverage",
          "mock next headers",
          "mock supabase"
        ]
      },
      "description": "Conventions for Vitest (unit/component) + Playwright (E2E): file patterns, config baselines, coverage requirements, and mocking Next.js request scope and Supabase."
    },
    {
      "name": "Supabase Auth SSR (@supabase/ssr)",
      "file": "_context/skills/skill-supabase-ssr.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "@supabase/ssr",
          "supabase ssr",
          "supabase auth",
          "createServerClient",
          "createBrowserClient",
          "proxy.ts",
          "cookies.setAll",
          "next/headers",
          "getUser",
          "getClaims",
          "getSession",
          "RLS",
          "auth.uid",
          "@supabase/auth-helpers-nextjs"
        ],
        "files": [
          "proxy.ts",
          "**/lib/supabase/client.ts",
          "**/lib/supabase/server.ts",
          "**/lib/supabase/proxy.ts"
        ],
        "task_patterns": [
          "supabase auth",
          "ssr auth",
          "session leakage",
          "cookie handling",
          "rls policies",
          "nextjs supabase"
        ]
      },
      "description": "Security-first Supabase Auth for Next.js App Router using @supabase/ssr: browser vs server clients, cookie plumbing, proxy.ts session refresh, and RLS coordination."
    },
    {
      "name": "PostHog Analytics (Next.js)",
      "file": "_context/skills/skill-posthog-analytics.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "posthog",
          "posthog-js",
          "posthog-node",
          "@posthog/react",
          "analytics",
          "$pageview",
          "$pageleave",
          "autocapture",
          "server-only",
          "client-only",
          "runtime",
          "nodejs"
        ],
        "files": [
          "**/app/providers.tsx",
          "**/lib/posthog-server.ts",
          "**/lib/analytics/client.ts",
          "**/lib/analytics/server.ts"
        ],
        "task_patterns": [
          "add analytics",
          "posthog integration",
          "pageview tracking",
          "custom events",
          "server tracking",
          "client tracking"
        ]
      },
      "description": "PostHog integration patterns for Next.js App Router: strict client/server separation, provider setup, Node server tracking with flush/shutdown, pageview strategy, and standard event properties."
    },
    {
      "name": "Metadata & SEO",
      "file": "_context/skills/skill-metadata-seo.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "metadata",
          "generateMetadata",
          "SEO",
          "openGraph",
          "og:image",
          "opengraph-image",
          "sitemap",
          "robots",
          "meta tags",
          "title",
          "description",
          "ImageResponse"
        ],
        "files": [
          "**/opengraph-image.tsx",
          "**/twitter-image.tsx",
          "**/sitemap.ts",
          "**/robots.ts",
          "**/icon.tsx"
        ],
        "task_patterns": [
          "SEO optimization",
          "social sharing",
          "meta tags",
          "sitemap generation",
          "open graph image",
          "twitter card"
        ]
      },
      "description": "Async generateMetadata signature change, ImageResponse with async params, sitemap.ts and robots.ts dynamic generation, image remotePatterns security."
    },
    {
      "name": "TypeScript & Config",
      "file": "_context/skills/skill-typescript-config.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "next.config",
          "typescript",
          "type error",
          "Promise type",
          "tsconfig",
          "server-only",
          "experimental",
          "cacheComponents",
          "@types/react"
        ],
        "files": [
          "**/next.config.ts",
          "**/next.config.js",
          "**/tsconfig.json"
        ],
        "task_patterns": [
          "type error",
          "build error",
          "configuration",
          "setup project",
          "module resolution",
          "cannot be used as JSX"
        ]
      },
      "description": "next.config.ts (typed config), Promise prop type patterns, React 19 type compatibility, server-only module protection, module resolution settings."
    },
    {
      "name": "Greykite (Time Series Forecasting)",
      "file": "_context/skills/skill-greykite.md",
      "framework": "greykite",
      "triggers": {
        "keywords": [
          "greykite",
          "silverkite",
          "time series forecast",
          "anomaly detection",
          "changepoint detection",
          "linkedin forecasting",
          "forecast",
          "forecasting",
          "changepoint",
          "trend changepoint",
          "adaptive lasso"
        ],
        "files": [
          "**/forecast*.py",
          "**/anomaly*.py",
          "**/changepoint*.py",
          "**/greykite*.py"
        ],
        "task_patterns": [
          "time series forecast",
          "forecast model",
          "anomaly detection",
          "detect anomalies",
          "changepoint detection",
          "trend analysis",
          "business metric forecast",
          "monitoring alert"
        ]
      },
      "description": "Greykite time series forecasting and anomaly detection: Forecaster.run_forecast_config, ChangepointDetector, GreykiteDetector, model templates (AUTO/SILVERKITE/PROPHET/ARIMA), evaluation metrics, and visualization patterns."
    }
  ]
}
`,
  "skills/nextjs-core-skills.md": "---\nskill_name: nextjs-core-skills\nversion: \"16.0.10\"\nframework: Next.js\nreact_version: \"19\"\nlast_verified: \"2025-12-18\"\nalways_attach: true\npriority: 10\ntriggers:\n  - nextjs\n  - next.js\n  - app router\n  - react 19\n  - params\n  - cookies\n  - headers\n  - middleware\n  - proxy.ts\n---\n\n<!--\nLLM INSTRUCTION: This is a CORE skill file for Next.js 16.0.10.\nALWAYS apply these rules when generating Next.js code.\nYour training data likely contains v14/v15 patterns - OVERRIDE them with v16 patterns below.\nKey breaking changes: async params, proxy.ts, useActionState, uncached-by-default.\nWhen you see \u274C WRONG, that's what you might hallucinate. Use \u2705 CORRECT instead.\n-->\n\n# Next.js 16 Core Skills\n\n> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18\n\n## 1. What AI Models Get Wrong\n\n- **Synchronous params access** \u2192 LLMs generate `Page({ params }: { params: { slug: string } })` because training data from v14 used sync access. In v16, params is a Promise.\n- **Using `middleware.ts`** \u2192 LLMs create middleware.ts because it existed in v14/15. In v16, it's deprecated in favor of `proxy.ts`.\n- **Assuming fetch is cached** \u2192 LLMs expect fetch to cache by default (v14 behavior). In v16, all fetches are uncached by default.\n- **Using `useFormState`** \u2192 LLMs import from 'react-dom' using React 18 patterns. React 19 renames this to `useActionState`.\n- **Omitting `default.js` in parallel routes** \u2192 LLMs forget this file, causing build failures in v16 which strictly requires it for all @slots.\n\n## 2. Golden Rules\n\n### \u2705 DO\n- **Await all dynamic APIs** \u2192 `params`, `searchParams`, `cookies()`, `headers()` are Promises in v16\n- **Use `proxy.ts` for request interception** \u2192 Replaces middleware.ts, runs on Node.js by default\n- **Keep components Server by default** \u2192 Only add `'use client'` for interactivity (state, events, browser APIs)\n- **Create `default.js` for every parallel route slot** \u2192 Required fallback for soft navigation\n- **Use `useActionState` from 'react'** \u2192 React 19's replacement for useFormState\n\n### \u274C DON'T  \n- **Don't access params synchronously** \u2192 Causes runtime crash: \"params is a Promise\"\n- **Don't use `middleware.ts`** \u2192 Deprecated, use proxy.ts instead\n- **Don't use `useFormState` from 'react-dom'** \u2192 Renamed to useActionState in React 19\n- **Don't assume fetch caches** \u2192 v16 is uncached by default, opt-in with `'use cache'`\n- **Don't use `getServerSideProps`/`getStaticProps`** \u2192 Don't exist in App Router\n\n## 3. Critical Patterns\n\n### Async Params in Page Components\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// Sync access causes runtime crash in v16\nexport default function Page({ params }: { params: { slug: string } }) {\n  return <h1>{params.slug}</h1>; // Error: params is a Promise\n}\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\n// Await the Promise props\ninterface Props {\n  params: Promise<{ slug: string }>;\n  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;\n}\n\nexport default async function Page(props: Props) {\n  const params = await props.params;\n  const searchParams = await props.searchParams;\n  return <h1>{params.slug}</h1>;\n}\n```\n**Why:** v16's Partial Prerendering requires async access to support streaming dynamic content.\n\n---\n\n### Async Cookies and Headers\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// Sync access returns Promise object, not data\nimport { cookies, headers } from 'next/headers';\n\nexport default function Page() {\n  const cookieStore = cookies(); // Wrong: returns Promise\n  const token = cookieStore.get('token'); // undefined\n}\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\nimport { cookies, headers } from 'next/headers';\n\nexport default async function Page() {\n  const cookieStore = await cookies();\n  const token = cookieStore.get('auth-token');\n  \n  const headerList = await headers();\n  const userAgent = headerList.get('user-agent');\n}\n```\n**Why:** Request APIs are async to support Edge runtime and streaming.\n\n---\n\n### Proxy.ts Instead of Middleware\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// middleware.ts - DEPRECATED\nimport { NextResponse } from 'next/server';\nimport type { NextRequest } from 'next/server';\n\nexport function middleware(request: NextRequest) {\n  return NextResponse.next();\n}\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\n// proxy.ts - at project root or src/\nimport { NextResponse } from 'next/server';\nimport type { NextRequest } from 'next/server';\n\nexport async function proxy(request: NextRequest) {\n  const url = request.nextUrl;\n  \n  if (url.pathname === '/old') {\n    url.pathname = '/new';\n    return NextResponse.redirect(url);\n  }\n  \n  return NextResponse.next();\n}\n\nexport const config = {\n  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],\n};\n```\n**Why:** Renamed for clarity\u2014it's a proxy/interception layer, not middleware chain. Runs on Node.js by default.\n\n---\n\n### React 19 Form Pattern\n\n**\u274C WRONG (v14/React 18 - Hallucination Risk):**\n```typescript\n'use client';\nimport { useFormState } from 'react-dom'; // Wrong import\n\nexport function Form() {\n  const [state, action] = useFormState(submitAction, null);\n}\n```\n\n**\u2705 CORRECT (v16/React 19):**\n```typescript\n'use client';\nimport { useActionState } from 'react'; // Correct import\n\nexport function Form() {\n  const [state, formAction, isPending] = useActionState(submitAction, null);\n  \n  return (\n    <form action={formAction}>\n      <input name=\"email\" />\n      <button disabled={isPending}>Submit</button>\n      {state?.error && <p>{state.error}</p>}\n    </form>\n  );\n}\n```\n**Why:** React 19 renamed useFormState to useActionState and added isPending.\n\n---\n\n### Parallel Routes Default.js\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```\napp/\n\u251C\u2500\u2500 @modal/\n\u2502   \u2514\u2500\u2500 login/\n\u2502       \u2514\u2500\u2500 page.tsx\n\u2514\u2500\u2500 layout.tsx\n// Missing default.tsx causes 404 on soft navigation!\n```\n\n**\u2705 CORRECT (v16):**\n```\napp/\n\u251C\u2500\u2500 @modal/\n\u2502   \u251C\u2500\u2500 default.tsx  \u2190 REQUIRED\n\u2502   \u2514\u2500\u2500 login/\n\u2502       \u2514\u2500\u2500 page.tsx\n\u2514\u2500\u2500 layout.tsx\n```\n\n```typescript\n// app/@modal/default.tsx\nexport default function Default() {\n  return null; // Render nothing when no modal active\n}\n```\n**Why:** v16 strictly requires default.js as fallback when slot has no matching route during soft navigation.\n\n## 4. Quick Reference Table\n\n| Feature | \u274C Don't | \u2705 Do |\n|---------|---------|------|\n| Params | `{ params: { id: string } }` | `{ params: Promise<{ id: string }> }` |\n| Cookies | `const c = cookies()` | `const c = await cookies()` |\n| Headers | `const h = headers()` | `const h = await headers()` |\n| Middleware | `middleware.ts` | `proxy.ts` |\n| Form State | `useFormState` from 'react-dom' | `useActionState` from 'react' |\n| Caching | Assume cached by default | Use `'use cache'` explicitly |\n| Parallel Routes | Skip default.js | Create default.js for every @slot |\n| Config | `next.config.js` | `next.config.ts` (typed) |\n\n## 5. Checklist Before Coding\n\n- [ ] Verify Next.js version is 16.x and React 19 in package.json\n- [ ] All `params` and `searchParams` props typed as `Promise<...>` and awaited\n- [ ] All `cookies()` and `headers()` calls have `await`\n- [ ] Using `proxy.ts` not `middleware.ts` for request interception\n- [ ] Every parallel route @slot has a `default.tsx` file\n- [ ] Using `useActionState` not `useFormState` for forms\n",
  "skills/python-core-skills.md": '---\nskill_name: python-core-skills\nversion: "3.12.0"\nframework: Python\nlast_verified: "2025-12-18"\nalways_attach: true\npriority: 9\ntriggers:\n  - python\n  - py\n  - pyproject\n  - fastapi\n  - flask\n  - django\n  - pandas\n  - numpy\n  - sklearn\n  - pytorch\n  - tensorflow\n---\n\n<!--\nLLM INSTRUCTION: This is a CORE skill file for Python projects.\nALWAYS apply these rules when generating Python code.\nYour training data contains mixed conventions - ENFORCE PEP 8 naming below.\nKey focus: Naming consistency, type hints, docstrings, Pythonic patterns.\nWhen you see WRONG, that\'s inconsistent/bad practice. Use CORRECT instead.\n-->\n\n# Python Core Skills (PEP 8 + Modern Best Practices)\n\n> **Target:** Python 3.10+ | **Last Verified:** 2025-12-18\n\n## 1. What AI Models Get Wrong\n\n- **Inconsistent naming** \u2192 LLMs switch between `getUserData`, `get_user_data`, `GetUserData` randomly. Python uses snake_case for functions/variables.\n- **Missing type hints** \u2192 LLMs omit type annotations. Modern Python requires type hints for maintainability.\n- **Missing docstrings** \u2192 LLMs skip documentation. All public functions need docstrings.\n- **CamelCase variables** \u2192 LLMs use JavaScript-style `userName` instead of `user_name`.\n- **Single-letter variables** \u2192 LLMs use `x`, `d`, `l` instead of descriptive names.\n- **Bare except clauses** \u2192 LLMs write `except:` instead of specific exceptions.\n- **Mutable default arguments** \u2192 LLMs use `def func(items=[])` causing bugs.\n\n## 2. Naming Convention Rules\n\n### File Naming\n\n| Type | Convention | Example |\n|------|-----------|---------|\n| Modules | `snake_case.py` | `task_manager.py`, `data_utils.py` |\n| Packages | `snake_case/` | `data_processing/`, `ml_models/` |\n| Test files | `test_*.py` | `test_task_manager.py` |\n| Config files | `snake_case.py` | `config.py`, `settings.py` |\n\n### Code Naming\n\n| Type | Convention | Example |\n|------|-----------|---------|\n| Classes | `PascalCase` | `TaskManager`, `DataProcessor` |\n| Functions | `snake_case` | `get_user_data()`, `process_tasks()` |\n| Variables | `snake_case` | `user_name`, `filtered_tasks` |\n| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_URL` |\n| Private | `_leading_underscore` | `_internal_cache`, `_helper_func()` |\n| Protected | `_single_underscore` | `_protected_method()` |\n| Name mangling | `__double_underscore` | `__private_attr` (rare) |\n| Type variables | `PascalCase` | `T`, `ItemType`, `KeyType` |\n\n## 3. Golden Rules\n\n### DO\n- **Modules: snake_case.py** \u2192 `task_manager.py`, `data_utils.py`\n- **Classes: PascalCase** \u2192 `TaskManager`, `DataProcessor`\n- **Functions/variables: snake_case** \u2192 `get_data()`, `user_name`\n- **Constants: UPPER_SNAKE_CASE** \u2192 `MAX_RETRIES`, `DEFAULT_TIMEOUT`\n- **Private: _leading_underscore** \u2192 `_internal_func()`, `_cache`\n- **Type hints on all functions** \u2192 `def get_user(id: str) -> User:`\n- **Docstrings on all public functions** \u2192 Google or NumPy style\n- **Specific exception handling** \u2192 `except ValueError as e:`\n- **Use `None` as default, not mutable** \u2192 `def func(items: list | None = None):`\n\n### DON\'T\n- **Don\'t use camelCase** \u2192 No `getUserData`, use `get_user_data`\n- **Don\'t use PascalCase for functions** \u2192 No `GetUser()`, use `get_user()`\n- **Don\'t skip type hints** \u2192 Always annotate parameters and returns\n- **Don\'t use single letters** \u2192 No `d = {}`, use `data = {}`\n- **Don\'t use bare except** \u2192 No `except:`, specify the exception\n- **Don\'t use mutable defaults** \u2192 No `def func(items=[]):`\n\n## 4. Critical Patterns\n\n### Function and Variable Naming\n\n**WRONG (JavaScript-style):**\n```python\ndef getUserData(userId):  # camelCase (wrong)\n    userName = "John"     # camelCase (wrong)\n    return userName\n\nMaxRetries = 3  # PascalCase for constant (wrong)\n```\n\n**CORRECT (PEP 8):**\n```python\ndef get_user_data(user_id: str) -> str:  # snake_case + types\n    user_name = "John"                    # snake_case\n    return user_name\n\nMAX_RETRIES = 3  # UPPER_SNAKE_CASE for constants\n```\n\n---\n\n### Class Naming\n\n**WRONG:**\n```python\nclass task_manager:  # snake_case (wrong)\n    pass\n\nclass taskManager:   # camelCase (wrong)\n    pass\n```\n\n**CORRECT:**\n```python\nclass TaskManager:  # PascalCase\n    """Manages task operations."""\n\n    def __init__(self, config: Config) -> None:\n        self._config = config  # Private attribute\n        self.tasks: list[Task] = []\n```\n\n---\n\n### Type Hints (Required)\n\n**WRONG (No types):**\n```python\ndef process_data(items, threshold):\n    results = []\n    for item in items:\n        if item.value > threshold:\n            results.append(item)\n    return results\n```\n\n**CORRECT (Full types):**\n```python\nfrom typing import Sequence\n\ndef process_data(\n    items: Sequence[DataItem],\n    threshold: float\n) -> list[DataItem]:\n    """Process items above threshold.\n\n    Args:\n        items: Sequence of data items to process.\n        threshold: Minimum value threshold.\n\n    Returns:\n        List of items above threshold.\n    """\n    results: list[DataItem] = []\n    for item in items:\n        if item.value > threshold:\n            results.append(item)\n    return results\n```\n\n---\n\n### Docstrings (Google Style)\n\n**WRONG (No docstring):**\n```python\ndef calculate_forecast(data, horizon):\n    model = GreyKiteModel()\n    return model.predict(data, horizon)\n```\n\n**CORRECT (Google style docstring):**\n```python\ndef calculate_forecast(\n    data: pd.DataFrame,\n    horizon: int\n) -> pd.DataFrame:\n    """Calculate time series forecast using GreyKite.\n\n    Args:\n        data: Historical time series data with \'ds\' and \'y\' columns.\n        horizon: Number of periods to forecast.\n\n    Returns:\n        DataFrame with forecasted values and confidence intervals.\n\n    Raises:\n        ValueError: If data is missing required columns.\n\n    Example:\n        >>> df = pd.DataFrame({\'ds\': dates, \'y\': values})\n        >>> forecast = calculate_forecast(df, horizon=30)\n    """\n    model = GreyKiteModel()\n    return model.predict(data, horizon)\n```\n\n---\n\n### Exception Handling\n\n**WRONG (Bare except):**\n```python\ntry:\n    result = process_data(items)\nexcept:  # Catches everything including KeyboardInterrupt!\n    result = None\n```\n\n**CORRECT (Specific exceptions):**\n```python\ntry:\n    result = process_data(items)\nexcept ValueError as e:\n    logger.error(f"Invalid data: {e}")\n    result = None\nexcept ConnectionError as e:\n    logger.error(f"Connection failed: {e}")\n    raise\n```\n\n---\n\n### Mutable Default Arguments\n\n**WRONG (Mutable default):**\n```python\ndef add_item(item: str, items: list = []) -> list:  # BUG!\n    items.append(item)\n    return items\n\n# Bug: items list persists between calls!\nadd_item("a")  # [\'a\']\nadd_item("b")  # [\'a\', \'b\'] - unexpected!\n```\n\n**CORRECT (None default):**\n```python\ndef add_item(item: str, items: list[str] | None = None) -> list[str]:\n    if items is None:\n        items = []\n    items.append(item)\n    return items\n\n# Correct behavior\nadd_item("a")  # [\'a\']\nadd_item("b")  # [\'b\'] - fresh list each time\n```\n\n---\n\n### Private and Protected Members\n\n**WRONG (No convention):**\n```python\nclass DataProcessor:\n    def __init__(self):\n        self.cache = {}        # Public? Private?\n        self.helper_func()     # Internal? External?\n```\n\n**CORRECT (Clear convention):**\n```python\nclass DataProcessor:\n    """Process data with caching."""\n\n    def __init__(self) -> None:\n        self._cache: dict[str, Any] = {}  # Private (single underscore)\n        self._initialize()\n\n    def process(self, data: Data) -> Result:\n        """Public API method."""\n        return self._transform(data)\n\n    def _transform(self, data: Data) -> Result:\n        """Private helper method."""\n        return Result(data)\n\n    def _initialize(self) -> None:\n        """Private initialization."""\n        self._cache.clear()\n```\n\n## 5. Module Structure Template\n\n```python\n# File: task_processor.py\n"""Task processing module.\n\nThis module provides utilities for processing and validating tasks.\n\nExample:\n    >>> processor = TaskProcessor(config)\n    >>> result = processor.process(task)\n"""\n\nfrom __future__ import annotations\n\nimport logging\nfrom dataclasses import dataclass\nfrom typing import TYPE_CHECKING\n\nif TYPE_CHECKING:\n    from .config import Config\n\n# Constants\nMAX_RETRIES = 3\nDEFAULT_TIMEOUT = 30.0\n\n# Module logger\nlogger = logging.getLogger(__name__)\n\n\n@dataclass\nclass ProcessResult:\n    """Result of task processing.\n\n    Attributes:\n        success: Whether processing succeeded.\n        data: Processed data if successful.\n        error: Error message if failed.\n    """\n\n    success: bool\n    data: dict | None = None\n    error: str | None = None\n\n\nclass TaskProcessor:\n    """Process tasks with retry logic.\n\n    Args:\n        config: Configuration object.\n        max_retries: Maximum retry attempts.\n    """\n\n    def __init__(\n        self,\n        config: Config,\n        max_retries: int = MAX_RETRIES\n    ) -> None:\n        self._config = config\n        self._max_retries = max_retries\n        self._cache: dict[str, ProcessResult] = {}\n\n    def process(self, task: Task) -> ProcessResult:\n        """Process a single task.\n\n        Args:\n            task: Task to process.\n\n        Returns:\n            ProcessResult with success status and data.\n\n        Raises:\n            ValueError: If task is invalid.\n        """\n        if not task.is_valid():\n            raise ValueError(f"Invalid task: {task.id}")\n\n        return self._execute_with_retry(task)\n\n    def _execute_with_retry(self, task: Task) -> ProcessResult:\n        """Execute task with retry logic."""\n        for attempt in range(self._max_retries):\n            try:\n                result = self._execute(task)\n                return ProcessResult(success=True, data=result)\n            except ConnectionError as e:\n                logger.warning(f"Attempt {attempt + 1} failed: {e}")\n\n        return ProcessResult(success=False, error="Max retries exceeded")\n\n    def _execute(self, task: Task) -> dict:\n        """Execute task processing."""\n        # Implementation\n        return {"processed": True}\n```\n\n## 6. Quick Reference Table\n\n| Category | Convention | Examples |\n|----------|-----------|----------|\n| **Module files** | `snake_case.py` | `task_manager.py`, `data_utils.py` |\n| **Package dirs** | `snake_case/` | `data_processing/`, `ml_models/` |\n| **Classes** | `PascalCase` | `TaskManager`, `DataProcessor` |\n| **Functions** | `snake_case` | `get_user_data()`, `process_tasks()` |\n| **Variables** | `snake_case` | `user_name`, `filtered_items` |\n| **Constants** | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_URL` |\n| **Private** | `_underscore` | `_cache`, `_helper()` |\n| **Type vars** | `PascalCase` | `T`, `ItemType`, `KeyType` |\n| **Test files** | `test_*.py` | `test_processor.py` |\n\n## 7. Checklist Before Coding\n\n- [ ] Module files use snake_case.py\n- [ ] Classes use PascalCase\n- [ ] Functions and variables use snake_case\n- [ ] Constants use UPPER_SNAKE_CASE\n- [ ] Private members use _leading_underscore\n- [ ] All functions have type hints (params + return)\n- [ ] All public functions have docstrings (Google style)\n- [ ] No mutable default arguments (use None)\n- [ ] Specific exception handling (no bare except)\n- [ ] Imports organized: stdlib, third-party, local\n\n## 8. Common Mistakes\n\n```python\n# WRONG: camelCase\ndef getUserData(userId):\n    userName = data[userId]\n\n# CORRECT: snake_case\ndef get_user_data(user_id: str) -> str:\n    user_name = data[user_id]\n```\n\n```python\n# WRONG: mutable default\ndef add(item, items=[]):\n    items.append(item)\n\n# CORRECT: None default\ndef add(item: str, items: list | None = None) -> list:\n    if items is None:\n        items = []\n    items.append(item)\n```\n\n```python\n# WRONG: bare except\ntry:\n    result = fetch()\nexcept:\n    pass\n\n# CORRECT: specific exception\ntry:\n    result = fetch()\nexcept ConnectionError as e:\n    logger.error(e)\n```\n\n```python\n# WRONG: no types\ndef process(data, threshold):\n    return [x for x in data if x > threshold]\n\n# CORRECT: full types\ndef process(data: list[float], threshold: float) -> list[float]:\n    return [x for x in data if x > threshold]\n```\n\n## 9. ML/Data Science Conventions\n\nFor GreyKite, pandas, sklearn projects:\n\n```python\n# DataFrame variables: descriptive names\ndf_raw = pd.read_csv("data.csv")      # Not: df, d, data\ndf_cleaned = clean_data(df_raw)        # Not: df2, clean\ndf_features = extract_features(df_cleaned)\n\n# Model variables\nmodel_forecast = GreykiteModel()       # Not: m, model\nmodel_classifier = RandomForestClassifier()\n\n# Column names: snake_case strings\ndf.columns = ["user_id", "created_at", "value"]  # Not: userId, CreatedAt\n\n# Function naming for ML\ndef train_model(df_train: pd.DataFrame) -> Model:\ndef evaluate_model(model: Model, df_test: pd.DataFrame) -> Metrics:\ndef generate_forecast(model: Model, horizon: int) -> pd.DataFrame:\n```\n',
  "skills/react-core-skills.md": "---\nskill_name: react-core-skills\nversion: \"19.0.0\"\nframework: React\ntypescript_version: \"5.x\"\nlast_verified: \"2025-12-18\"\nalways_attach: true\npriority: 9\ntriggers:\n  - react\n  - tsx\n  - jsx\n  - component\n  - hooks\n  - usestate\n  - useeffect\n  - typescript\n---\n\n<!--\nLLM INSTRUCTION: This is a CORE skill file for React + TypeScript projects.\nALWAYS apply these rules when generating React/TypeScript code.\nYour training data contains mixed conventions - ENFORCE consistent naming below.\nKey focus: Naming consistency, component patterns, TypeScript safety, hooks best practices.\nWhen you see WRONG, that's inconsistent/bad practice. Use CORRECT instead.\n-->\n\n# React + TypeScript Core Skills\n\n> **Target:** React 19+ | **TypeScript:** 5.x | **Last Verified:** 2025-12-18\n\n## 1. What AI Models Get Wrong\n\n- **Inconsistent file naming** \u2192 LLMs randomly switch between `UserProfile.tsx`, `user-profile.tsx`, `user_profile.tsx` in the same project. Pick ONE convention and stick to it.\n- **Mixed variable naming** \u2192 LLMs use `userName`, `user_name`, `UserName` interchangeably. TypeScript/React uses camelCase for variables.\n- **Prop interfaces without suffix** \u2192 LLMs create `interface User` when it should be `UserProps` to distinguish from data types.\n- **Default exports without component name** \u2192 LLMs write `export default function() {}` losing type information.\n- **Using `any` type** \u2192 LLMs default to `any` when types are unclear. Always use proper types or `unknown`.\n- **Hooks outside components** \u2192 LLMs call hooks in helper functions or conditionally.\n- **Missing key prop** \u2192 LLMs forget `key` in `.map()` causing React warnings.\n\n## 2. Naming Convention Rules\n\n### File Naming\n\n| Type | Convention | Example |\n|------|-----------|---------|\n| Components | `PascalCase.tsx` | `TaskCard.tsx`, `UserProfile.tsx` |\n| Hooks | `useCamelCase.ts` | `useTaskData.ts`, `useKeyboard.ts` |\n| Services/Utils | `kebab-case.ts` | `task-service.ts`, `date-utils.ts` |\n| Types | `kebab-case.ts` or `PascalCase.ts` | `task.ts`, `filters.ts` |\n| Constants | `kebab-case.ts` | `constants.ts`, `api-endpoints.ts` |\n\n### Code Naming\n\n| Type | Convention | Example |\n|------|-----------|---------|\n| Components | `PascalCase` | `TaskCard`, `UserProfile` |\n| Props interfaces | `{Component}Props` | `TaskCardProps`, `UserProfileProps` |\n| Hooks | `useCamelCase` | `useTaskData()`, `useLocalStorage()` |\n| Variables | `camelCase` | `filteredTasks`, `isLoading` |\n| Functions | `camelCase` | `handleClick`, `formatDate` |\n| Constants | `UPPER_SNAKE_CASE` | `MAX_ITEMS`, `API_URL` |\n| Types/Interfaces | `PascalCase` | `Task`, `User`, `FilterState` |\n| Enums | `PascalCase` | `Status`, `Priority` |\n| CSS classes | `kebab-case` | `task-card`, `btn-primary` |\n\n## 3. Golden Rules\n\n### DO\n- **Component files: PascalCase.tsx** \u2192 `TaskCard.tsx`, `UserProfile.tsx`\n- **Props interfaces: {Component}Props** \u2192 `interface TaskCardProps`\n- **Hooks: use + PascalCase** \u2192 `useTaskData`, `useKeyboard`\n- **Variables/functions: camelCase** \u2192 `filteredTasks`, `handleClick`\n- **Constants: UPPER_SNAKE_CASE** \u2192 `MAX_ITEMS`, `DEFAULT_TIMEOUT`\n- **CSS classes: kebab-case** \u2192 `task-card`, `user-profile`\n- **One component per file** \u2192 File exports single component matching filename\n- **Type all props and state** \u2192 No implicit `any`\n- **Hooks at top level** \u2192 Never conditional, never in loops\n\n### DON'T\n- **Don't mix naming conventions** \u2192 No `user-profile.tsx` and `UserSettings.tsx` together\n- **Don't use `any` type** \u2192 Use `unknown` or define proper types\n- **Don't call hooks conditionally** \u2192 No `if (x) { useState() }`\n- **Don't mutate state directly** \u2192 Use setState, never `state.x = y`\n- **Don't use index as key** \u2192 Use `key={item.id}` not `key={index}`\n\n## 4. Critical Patterns\n\n### File and Component Naming\n\n**WRONG (Inconsistent):**\n```typescript\n// Mixed conventions in same project\nuser-profile.tsx          // kebab-case\nTaskCard.tsx             // PascalCase\nuser_settings.tsx        // snake_case\n\nexport default function() { ... }  // Anonymous\n```\n\n**CORRECT (Consistent):**\n```typescript\n// All components: PascalCase.tsx\nUserProfile.tsx\nTaskCard.tsx\nUserSettings.tsx\n\n// File: UserProfile.tsx\ninterface UserProfileProps {\n  userId: string;\n  onUpdate: (user: User) => void;\n}\n\nexport function UserProfile({ userId, onUpdate }: UserProfileProps) {\n  return <div>...</div>;\n}\n```\n\n---\n\n### Variable and Function Naming\n\n**WRONG (Inconsistent):**\n```typescript\nconst UserName = 'John';        // PascalCase (wrong)\nconst user_email = 'john@...';  // snake_case (wrong)\nconst HandleClick = () => {};   // PascalCase (wrong)\n```\n\n**CORRECT (Consistent):**\n```typescript\nconst userName = 'John';           // camelCase\nconst userEmail = 'john@...';      // camelCase\nconst handleClick = () => {};      // camelCase\n\nconst MAX_RETRIES = 3;             // UPPER_SNAKE_CASE for constants\nconst DEFAULT_TIMEOUT = 5000;\n```\n\n---\n\n### Props Interface Naming\n\n**WRONG (Ambiguous):**\n```typescript\ninterface Task {  // Is this data or props?\n  onComplete: () => void;\n}\n\nfunction TaskCard(props: any) {  // No type safety\n  return <div>{props.task.title}</div>;\n}\n```\n\n**CORRECT (Clear):**\n```typescript\n// Data type\ninterface Task {\n  id: string;\n  title: string;\n}\n\n// Props type (suffix: Props)\ninterface TaskCardProps {\n  task: Task;\n  onComplete: (id: string) => void;\n}\n\nfunction TaskCard({ task, onComplete }: TaskCardProps) {\n  return <div>{task.title}</div>;\n}\n```\n\n---\n\n### Hook Naming and Usage\n\n**WRONG:**\n```typescript\nfunction taskData() {  // Missing 'use' prefix\n  return useState([]);\n}\n\nfunction TaskList() {\n  if (condition) {\n    const [data] = useState([]);  // Conditional hook!\n  }\n}\n```\n\n**CORRECT:**\n```typescript\nexport function useTaskData() {  // use + PascalCase\n  const [data, setData] = useState<Task[]>([]);\n  return { data, setData };\n}\n\nfunction TaskList() {\n  const [data] = useState<Task[]>([]);  // Top level\n  if (!data) return null;  // Conditional RENDER, not hook\n  return <div>...</div>;\n}\n```\n\n---\n\n### CSS Class Naming\n\n**WRONG (Inconsistent):**\n```typescript\n<div className=\"TaskCard\">        // PascalCase\n<div className=\"task_card\">       // snake_case\n<div className=\"taskcard\">        // no separator\n```\n\n**CORRECT (Consistent):**\n```typescript\n<div className=\"task-card\">           // kebab-case\n  <h2 className=\"task-card-title\">    // kebab-case\n  <div className=\"task-card-actions\"> // kebab-case\n```\n\n## 5. Component Structure Template\n\n```typescript\n// File: TaskCard.tsx\nimport { useState } from 'react';\nimport type { Task } from '@/types/task';\nimport './TaskCard.css';\n\n// Constants\nconst MAX_TITLE_LENGTH = 100;\n\n// Props interface\ninterface TaskCardProps {\n  task: Task;\n  onEdit?: (task: Task) => void;\n  onDelete?: (id: string) => void;\n}\n\n// Component\nexport function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {\n  // Hooks at top\n  const [isExpanded, setIsExpanded] = useState(false);\n\n  // Handlers\n  const handleEdit = () => onEdit?.(task);\n  const handleDelete = () => onDelete?.(task.id);\n\n  // Early returns\n  if (!task) return null;\n\n  // Render\n  return (\n    <div className=\"task-card\">\n      <h3 className=\"task-card-title\">{task.title}</h3>\n      <div className=\"task-card-actions\">\n        <button onClick={handleEdit}>Edit</button>\n        <button onClick={handleDelete}>Delete</button>\n      </div>\n    </div>\n  );\n}\n```\n\n## 6. Quick Reference Table\n\n| Category | Convention | Examples |\n|----------|-----------|----------|\n| **Component files** | `PascalCase.tsx` | `TaskCard.tsx`, `UserProfile.tsx` |\n| **Component names** | `PascalCase` | `TaskCard`, `UserProfile` |\n| **Props interfaces** | `{Component}Props` | `TaskCardProps`, `UserProfileProps` |\n| **Hook files** | `useCamelCase.ts` | `useTaskData.ts`, `useKeyboard.ts` |\n| **Hook functions** | `useCamelCase` | `useTaskData()`, `useLocalStorage()` |\n| **Variables** | `camelCase` | `filteredTasks`, `isLoading` |\n| **Functions** | `camelCase` | `handleClick`, `formatDate` |\n| **Constants** | `UPPER_SNAKE_CASE` | `MAX_ITEMS`, `API_URL` |\n| **Types/Interfaces** | `PascalCase` | `Task`, `User`, `FilterState` |\n| **CSS classes** | `kebab-case` | `task-card`, `btn-primary` |\n| **Service files** | `kebab-case.ts` | `task-service.ts`, `date-utils.ts` |\n\n## 7. Checklist Before Coding\n\n- [ ] Component files use PascalCase.tsx\n- [ ] Component names match filename\n- [ ] Props have {Component}Props interface\n- [ ] Hooks use 'use' prefix, called at top level\n- [ ] Variables use camelCase, constants use UPPER_SNAKE_CASE\n- [ ] CSS classes use kebab-case\n- [ ] No `any` types\n- [ ] List items have unique `key` prop (not index)\n- [ ] Event handlers are typed (React.MouseEvent, etc.)\n\n## 8. Common Mistakes\n\n```typescript\n// WRONG: index as key\n{tasks.map((task, i) => <TaskCard key={i} />)}\n\n// CORRECT: unique ID\n{tasks.map((task) => <TaskCard key={task.id} />)}\n```\n\n```typescript\n// WRONG: state mutation\nitems.push(newItem);\n\n// CORRECT: immutable update\nsetItems([...items, newItem]);\n```\n\n```typescript\n// WRONG: conditional hook\nif (show) { const [x] = useState(); }\n\n// CORRECT: conditional render\nconst [x] = useState();\nif (!show) return null;\n```\n",
  "skills/skill-caching-data-fetching.md": "---\nskill_name: skill-caching-data-fetching\nversion: \"16.0.10\"\nframework: Next.js\nlast_verified: \"2025-12-18\"\nalways_attach: false\npriority: 8\ntriggers:\n  - cache\n  - fetch\n  - revalidate\n  - cacheTag\n  - cacheLife\n  - use cache\n  - unstable_cache\n  - ISR\n  - PPR\n  - stale data\n  - performance\n---\n\n<!--\nLLM INSTRUCTION: Apply when user mentions caching, data fetching, or performance.\nCRITICAL CHANGE: Next.js 16 is UNCACHED BY DEFAULT. fetch() does NOT cache.\nDo NOT use: unstable_cache, revalidate: 60 in fetch options.\nDO use: 'use cache' directive, cacheLife() profiles, cacheTag() for invalidation.\nYour v14 training assumed fetch cached by default - that's WRONG for v16.\n-->\n\n# Caching & Data Fetching\n\n> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18\n\n## 1. What AI Models Get Wrong\n\n- **Assuming fetch caches by default** \u2192 LLMs expect v14 behavior where fetch was cached. In v16, fetch is uncached by default.\n- **Using `unstable_cache`** \u2192 LLMs suggest this deprecated API. In v16, use `'use cache'` directive instead.\n- **Using `revalidate: 60` in fetch options** \u2192 LLMs still use this pattern. v16 prefers `'use cache'` with `cacheLife` profiles.\n- **Expecting Route Handler GET to be static** \u2192 LLMs assume GET routes cache. In v16, they're dynamic by default.\n- **Trying to cache in proxy.ts** \u2192 LLMs attempt fetch caching in proxy. This is explicitly not supported.\n\n## 2. Golden Rules\n\n### \u2705 DO\n- **Use `'use cache'` directive** \u2192 Opt-in caching for functions or files\n- **Use `cacheLife` profiles** \u2192 Semantic durations: `seconds`, `minutes`, `hours`, `days`, `weeks`, `max`\n- **Use `cacheTag` for invalidation** \u2192 Tag cached data for targeted revalidation\n- **Wrap dynamic content in `<Suspense>`** \u2192 Enables PPR static shell + streaming\n- **Call `revalidateTag` after mutations** \u2192 Purge cache in Server Actions\n\n### \u274C DON'T  \n- **Don't assume fetch is cached** \u2192 v16 defaults to uncached\n- **Don't use `unstable_cache`** \u2192 Deprecated, replaced by `'use cache'`\n- **Don't cache in proxy.ts** \u2192 Explicitly unsupported, all fetches run every request\n- **Don't use `getStaticProps` patterns** \u2192 Not available in App Router\n- **Don't forget UI refresh after mutations** \u2192 Use `router.refresh()` or revalidation\n\n## 3. Critical Patterns\n\n### Use Cache Directive\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// Assuming fetch caches automatically\nexport async function getProduct(id: string) {\n  const res = await fetch(`https://api.example.com/products/${id}`); // Not cached in v16!\n  return res.json();\n}\n\n// Or using deprecated unstable_cache\nimport { unstable_cache } from 'next/cache';\nconst getData = unstable_cache(async () => {\n  return { ok: true };\n}); // Deprecated\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\nimport { cacheLife } from 'next/cache';\n\nexport async function getProduct(id: string) {\n  'use cache'; // Directive enables caching\n  cacheLife('hours'); // Use semantic profile\n  \n  const res = await fetch(`https://api.example.com/products/${id}`);\n  return res.json();\n}\n```\n**Why:** v16 inverts caching\u2014uncached by default, explicit opt-in required.\n\n---\n\n### CacheLife Profiles\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// Using arbitrary seconds in fetch options\nconst res = await fetch(url, { \n  next: { revalidate: 3600 } // Old pattern\n});\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\nimport { cacheLife } from 'next/cache';\n\nexport async function getMarketingData() {\n  'use cache';\n  cacheLife('hours'); // Built-in: seconds, minutes, hours, days, weeks, max\n  \n  return fetch('https://api.example.com/marketing').then(r => r.json());\n}\n\n// Custom profiles in next.config.ts\nconst nextConfig: NextConfig = {\n  cacheLife: {\n    'marketing-pages': {\n      stale: 3600,      // Serve stale up to 1 hour\n      revalidate: 900,  // Check for updates every 15 mins\n      expire: 86400,    // Hard expire after 1 day\n    },\n  },\n};\n```\n**Why:** Semantic profiles are clearer and integrate with Next's SWR system.\n\n---\n\n### Tag-Based Invalidation\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// Not tagging data for invalidation\nasync function getPosts() {\n  return fetch('https://api.example.com/posts'); // No way to selectively invalidate\n}\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\nimport { cacheTag, revalidateTag } from 'next/cache';\n\n// Tag the cached data\nasync function getPosts() {\n  'use cache';\n  cacheTag('posts'); // Tag for invalidation\n  return db.posts.findMany();\n}\n\n// Invalidate in Server Action\n'use server';\nexport async function createPost(data: FormData) {\n  await db.posts.create({\n    title: String(data.get('title') ?? ''),\n    body: String(data.get('body') ?? ''),\n  });\n  revalidateTag('posts'); // Purge cache\n}\n```\n**Why:** Tags enable surgical cache invalidation without full revalidation.\n\n---\n\n### Partial Prerendering (PPR)\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// No Suspense boundary - entire page becomes dynamic\nexport default async function Page() {\n  const user = await getCurrentUser(); // Dynamic - cookies\n  const products = await getProducts(); // Could be static\n  \n  return (\n    <div>\n      <UserGreeting user={user} />\n      <ProductList products={products} />\n    </div>\n  ); // Entire page is dynamic\n}\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\nimport { Suspense } from 'react';\n\nexport default function Page() {\n  return (\n    <main>\n      <h1>Static Title (Instant Load)</h1>\n      <ProductList /> {/* Can be cached */}\n      \n      <Suspense fallback={<p>Loading user...</p>}>\n        <UserProfile /> {/* Dynamic - streams in */}\n      </Suspense>\n    </main>\n  );\n}\n```\n**Why:** PPR sends static shell immediately, streams dynamic \"holes\" via Suspense.\n\n---\n\n### Route Handler Caching\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// Assuming GET is cached/static\nexport async function GET() {\n  const data = await db.query('SELECT * FROM items');\n  return Response.json(data); // Dynamic in v16!\n}\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\n// Explicitly set caching behavior\nexport const dynamic = 'force-static'; // Or use 'use cache'\n\nexport async function GET() {\n  'use cache';\n  cacheLife('minutes');\n  \n  const data = await db.query('SELECT * FROM items');\n  return Response.json(data);\n}\n```\n**Why:** GET routes are uncached by default in v16. Explicit opt-in required.\n\n## 4. Quick Reference Table\n\n| Feature | \u274C Don't | \u2705 Do |\n|---------|---------|------|\n| Cache Data | Assume cached | Use `'use cache'` directive |\n| Revalidation | `revalidate: 60` in fetch | `cacheLife('minutes')` |\n| Old Cache API | `unstable_cache()` | `'use cache'` directive |\n| Invalidation | `revalidatePath` only | `cacheTag()` + `revalidateTag()` |\n| GET Routes | Assume static | Set `dynamic = 'force-static'` |\n| Dynamic Data | No Suspense | Wrap in `<Suspense>` for PPR |\n| Proxy.ts | Attempt caching | Move caching logic to pages |\n\n## 5. Checklist Before Coding\n\n- [ ] Enable `cacheComponents: true` in next.config.ts (default in 16.0.10)\n- [ ] Add `'use cache'` directive to functions that should be cached\n- [ ] Use semantic `cacheLife` profiles instead of raw seconds\n- [ ] Tag cached data with `cacheTag()` for selective invalidation\n- [ ] Call `revalidateTag()` in Server Actions after mutations\n- [ ] Wrap dynamic components in `<Suspense>` for PPR benefits\n",
  "skills/skill-dashboard-design.md": '---\nskill_name: skill-dashboard-design\nversion: "1.0"\nframework: UI/UX Design\nlast_verified: "2026-02-17"\nalways_attach: false\npriority: 5\ntriggers:\n  - dashboard design\n  - dashboard ui\n  - dashboard layout\n  - design system\n  - design cheatsheet\n  - icon size\n  - font weight\n  - border radius\n  - icon stroke\n  - huge_icons\n  - ui design\n  - frontend design\n---\n\n<!--\nLLM INSTRUCTION: Apply this skill when designing or reviewing dashboard UIs.\nEnforce: 14px base font, 16px base icon, 1.2px stroke width, 2 font weights max (regular + medium),\n8-12px border radius, and semantic color tokens from globals. Never use semibold except in rare\nemphasis cases. Prefer filled+stroke icons from huge_icons. Color values must come from design tokens.\n-->\n\n# Dashboard Design Skill\n\n> **Domain:** Frontend UI/UX | **Style:** Dashboard / Data interfaces | **Last Verified:** 2026-02-17\n\n## 1. What AI Models Get Wrong\n\n- **Using too many font weights** \u2014 more than 2 (regular + medium) creates visual noise.\n- **Ignoring icon stroke consistency** \u2014 mixing stroke widths breaks visual rhythm.\n- **Hardcoding colors** \u2014 all color values must come from design tokens (`globals.css` / CSS custom properties).\n- **Overusing large border radii** \u2014 going beyond 12px makes dashboards feel like mobile apps, not tools.\n- **Using semibold or bold freely** \u2014 semibold is reserved for rare, high-signal emphasis only.\n- **Scaling icons arbitrarily** \u2014 base size is 16px; deviations must be intentional and consistent.\n\n## 2. Golden Rules\n\n### Typography\n\n- **Base font size:** `14px` \u2014 all body text, labels, table cells, sidebar items.\n- **Only 2 weights:**\n  - `regular` (400) \u2014 body text, secondary labels, descriptions.\n  - `medium` (500) \u2014 headings, section titles, emphasis, interactive labels.\n  - `semibold` (600) \u2014 **very rare**; only for critical callouts or KPI values that must stand out.\n- Do not use `bold` (700) or `light` (300) in dashboard contexts.\n\n### Icons\n\n- **Library:** `huge_icons` \u2014 filled + stroke style.\n- **Base size:** `16px` \u2014 default for inline icons, sidebar nav, action buttons.\n- **Stroke widths (use one per context, never mix within a component):**\n  - `1px` \u2014 light, decorative, background icons.\n  - `1.2px` \u2014 **default**; use for all standard UI icons.\n  - `1.5px` \u2014 stronger emphasis; use for primary CTAs or active state icons.\n- Filled variant: use for active/selected states.\n- Stroke variant: use for default/inactive states.\n\n### Colors\n\n- **Always use design tokens** \u2014 never hardcode hex or rgb values.\n- Source: `globals.css` (or equivalent CSS custom property file for the project).\n- Semantic token pattern: `--color-text-primary`, `--color-surface-muted`, `--color-border`, etc.\n- Limit to 3\u20135 active colors per view; use muted/subtle variants for non-critical elements.\n\n### Border Radius\n\n- **Range: `8px` to `12px`** \u2014 no exceptions without explicit design approval.\n  - `8px` \u2014 compact elements: badges, tags, small inputs, table cells.\n  - `10px` \u2014 standard cards, modals, dropdowns.\n  - `12px` \u2014 featured cards, hero panels, primary containers.\n- Do not use `4px` (too sharp) or `16px+` (too rounded for dashboards).\n\n## 3. Component Patterns\n\n### Stat / KPI Card\n\n```tsx\n// Correct: medium weight for value, regular for label, 10px radius, 16px icon\n<div className="rounded-[10px] p-4 bg-[var(--color-surface)]">\n  <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-[14px] font-normal">\n    <Icon name="chart-bar" size={16} strokeWidth={1.2} />\n    <span>Total Revenue</span>\n  </div>\n  <p className="text-[24px] font-medium text-[var(--color-text-primary)] mt-1">$48,200</p>\n</div>\n```\n\n### Sidebar Nav Item\n\n```tsx\n// Active: filled icon, medium text. Inactive: stroke icon, regular text.\n<NavItem\n  icon={isActive ? <FilledIcon size={16} /> : <StrokeIcon size={16} strokeWidth={1.2} />}\n  label="Analytics"\n  weight={isActive ? "medium" : "regular"}\n/>\n```\n\n### Data Table Cell\n\n```tsx\n// 14px, regular weight, tokens for color\n<td className="text-[14px] font-normal text-[var(--color-text-primary)] px-3 py-2">\n  John Doe\n</td>\n```\n\n## 4. \u2705 DO / \u274C DON\'T\n\n### \u2705 DO\n- Use `14px` for all body/label text.\n- Use `16px` as the default icon size.\n- Use `1.2px` stroke width unless intentionally signaling emphasis.\n- Use `regular` + `medium` weights only (semibold max once per page).\n- Pull all colors from CSS custom properties (`var(--color-...)`).\n- Use `8px`\u2013`12px` radius range consistently per element type.\n- Use `huge_icons` filled variant for active/selected states, stroke for default.\n\n### \u274C DON\'T\n- Don\'t use `bold`, `light`, or `thin` font weights.\n- Don\'t hardcode `#hex` or `rgb()` values; use tokens.\n- Don\'t exceed `12px` border radius for dashboard components.\n- Don\'t go below `8px` border radius unless for a chip/micro-badge.\n- Don\'t mix stroke widths (`1px`, `1.2px`, `1.5px`) within the same component.\n- Don\'t use icon sizes other than 16px without a deliberate layout reason.\n\n## 5. Quick Reference Cheatsheet\n\n| Token         | Value              | Notes                                 |\n|---------------|--------------------|---------------------------------------|\n| Font size     | `14px`             | Base for all dashboard text           |\n| Font weights  | `400`, `500`       | Regular + medium; semibold = rare     |\n| Icon library  | `huge_icons`       | Filled (active) + Stroke (default)    |\n| Icon size     | `16px`             | Base; scale intentionally             |\n| Stroke width  | `1.2px`            | Default; 1px light, 1.5px emphasis    |\n| Border radius | `8px` \u2013 `12px`     | 8 compact / 10 standard / 12 featured |\n| Colors        | CSS custom props   | Always via `var(--color-...)`         |\n\n## 6. Checklist\n\n- [ ] All text is `14px` base size.\n- [ ] Only `regular` and `medium` weights used (semibold count = 0\u20131 per page).\n- [ ] Icons are from `huge_icons`, sized at `16px`, `1.2px` stroke by default.\n- [ ] Stroke variants used for inactive states, filled for active/selected.\n- [ ] All colors reference CSS custom properties \u2014 no hardcoded values.\n- [ ] Border radius stays within `8px`\u2013`12px`.\n- [ ] No mixed stroke widths within a single component.\n',
  "skills/skill-drizzle-orm.md": "---\nskill_name: skill-drizzle-orm\nversion: \"1.x\"\nframework: Node.js\nlast_verified: \"2025-12-26\"\nalways_attach: false\npriority: 6\ntriggers:\n  - drizzle\n  - drizzle-orm\n  - drizzle-kit\n  - pgTable\n  - jsonb\n  - $type\n  - db:push\n  - db:generate\n  - db:migrate\n  - migration\n  - postgres\n  - postgresql\n---\n\n<!--\nLLM INSTRUCTION: Use for PostgreSQL + Drizzle ORM. Avoid Prisma/TypeORM patterns.\nSchema lives in TypeScript with pgTable. Indexes defined in the pgTable callback.\nUse jsonb.$type<T>() for compile-time typing only (no runtime validation).\nUse pg Pool with a single shared connection pool.\nMigrations: db:push for dev; db:generate + db:migrate for prod.\nAdvanced indexes (GIN/where/using) may require custom SQL migrations.\n-->\n\n# Drizzle ORM (PostgreSQL)\n\n> **Target:** Drizzle ORM + PostgreSQL | **Last Verified:** 2025-12-26\n\n## 1. What AI Models Get Wrong\n\n- **Mixing ORMs** (Prisma schema, TypeORM decorators).\n- **Missing pgTable callback** for indexes/constraints.\n- **Assuming $type validates at runtime** (it does not).\n- **Creating a Pool per request** instead of a shared Pool.\n- **Using db:push in prod** instead of migrations.\n\n## 2. Golden Rules\n\n### \u2705 DO\n- **Define schema in TS** with `pgTable` and column builders.\n- **Use jsonb.$type<T>()** to lock TypeScript types (compile-time only).\n- **Define indexes** in the `pgTable(..., (t) => [ ... ])` callback.\n- **Use a shared `pg.Pool`** and pass it to `drizzle({ client: pool })`.\n- **Dev:** `db:push`. **Prod:** `db:generate` + `db:migrate`.\n\n### \u274C DON'T\n- **Don't add Prisma/TypeORM files** (`schema.prisma`, `@Entity()`).\n- **Don't expect $type to validate data** at runtime.\n- **Don't rely on advanced index features** without verifying drizzle-kit output.\n\n## 3. Minimal Setup (Files)\n\n```\nsrc/db/client.ts\nsrc/db/schema.ts\ndrizzle.config.ts\n```\n\n## 4. Core Patterns\n\n### Postgres client (`src/db/client.ts`)\n```ts\nimport { drizzle } from 'drizzle-orm/node-postgres';\nimport { Pool } from 'pg';\nimport * as schema from './schema';\n\nconst pool = new Pool({\n  connectionString: process.env.DATABASE_URL,\n  max: 10,\n  idleTimeoutMillis: 30_000,\n  connectionTimeoutMillis: 2_000\n});\n\nexport const db = drizzle({ client: pool, schema });\n```\n\n### Schema + JSONB typing (`src/db/schema.ts`)\n```ts\nimport { pgTable, text, jsonb, uuid, index } from 'drizzle-orm/pg-core';\n\ntype UserSettings = {\n  theme: 'light' | 'dark';\n  marketingOptIn: boolean;\n};\n\nexport const users = pgTable(\n  'users',\n  {\n    id: uuid('id').defaultRandom().primaryKey(),\n    email: text('email').notNull(),\n    settings: jsonb('settings').$type<UserSettings>().notNull()\n  },\n  (t) => [index('users_email_idx').on(t.email)]\n);\n```\n\n### JSONB query with sql\n```ts\nimport { sql, eq } from 'drizzle-orm';\nimport { users } from './schema';\n\nawait db\n  .select()\n  .from(users)\n  .where(eq(sql`${users.settings} ->> 'theme'`, 'dark'));\n```\n\n### Migration scripts\n```json\n{\n  \"scripts\": {\n    \"db:push\": \"drizzle-kit push\",\n    \"db:generate\": \"drizzle-kit generate\",\n    \"db:migrate\": \"drizzle-kit migrate\"\n  }\n}\n```\n\n## 5. Checklist\n\n- [ ] Schema uses `pgTable` + TS columns.\n- [ ] JSONB uses `.$type<T>()` for compile-time typing.\n- [ ] Indexes defined in the `pgTable` callback.\n- [ ] Shared `pg.Pool` passed to `drizzle`.\n- [ ] Dev uses `db:push`; prod uses `db:generate` + `db:migrate`.\n",
  "skills/skill-frontend-design.md": '---\nskill_name: skill-frontend-design\nversion: "1.0"\nframework: Frontend UI/UX\nlast_verified: "2026-02-17"\nalways_attach: false\npriority: 4\ntriggers:\n  - frontend design\n  - web design\n  - ui design\n  - landing page\n  - component design\n  - page design\n  - beautiful ui\n  - modern design\n  - design skill\n  - aesthetic\n  - visual design\n  - creative ui\n  - polished ui\n  - production-grade ui\n  - distinctive design\n---\n\n<!--\nLLM INSTRUCTION: Use this skill when the user asks to build web components, pages, artifacts,\nposters, or applications with high design quality. This skill guides creation of distinctive,\nproduction-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real\nworking code with exceptional attention to aesthetic details and creative choices.\nThe user primarily works with Tailwind CSS + shadcn/ui but expects designs that transcend\ntypical component library defaults. Push beyond stock shadcn patterns into genuinely modern,\nmemorable interfaces.\n-->\n\n# Frontend Design Skill\n\n> **Domain:** Frontend UI/UX Design | **Stack:** Tailwind CSS, shadcn/ui, React | **Last Verified:** 2026-02-17\n\n## 1. What AI Models Get Wrong\n\n- **Defaulting to generic aesthetics** \u2014 Inter font, purple gradients on white, predictable card grids. This is "AI slop."\n- **Treating shadcn as a ceiling** \u2014 shadcn is a foundation, not a finished design. Override tokens, extend components, break the defaults.\n- **Using safe, committee-approved palettes** \u2014 timid color distributions with no dominant voice.\n- **Ignoring motion entirely** \u2014 or sprinkling random transitions without choreography.\n- **Symmetric, predictable layouts** \u2014 centered hero, 3-column features grid, footer. Every AI output looks identical.\n- **Skipping atmosphere** \u2014 flat solid backgrounds with no depth, texture, or visual interest.\n- **Converging on the same fonts** \u2014 Space Grotesk, Inter, Roboto appear in nearly every AI-generated UI.\n\n## 2. Design Thinking Process\n\nBefore writing any code, commit to a direction:\n\n### Step 1: Context\n- **Purpose** \u2014 What problem does this interface solve? Who uses it?\n- **Tone** \u2014 Commit to a distinct aesthetic direction. Starting points (not limits):\n  - Brutally minimal / Swiss precision\n  - Maximalist chaos / information-dense\n  - Luxury / refined / editorial\n  - Lo-fi / zine / raw\n  - Dark / moody / cinematic\n  - Soft / pastel / dreamy\n  - Retro-futuristic / synthwave\n  - Organic / natural / handcrafted\n  - Art deco / geometric / structured\n  - Playful / whimsical / toy-like\n  - Industrial / utilitarian / blueprint\n- **Constraints** \u2014 Framework, performance budget, accessibility requirements.\n\n### Step 2: Differentiation\nAsk: *What makes this UNFORGETTABLE? What is the one thing someone will remember?*\n\n### Step 3: Execute with conviction\nBold maximalism and refined minimalism both work. The key is **intentionality, not intensity**. Every detail must serve the chosen direction.\n\n## 3. Aesthetics Guidelines\n\n### Typography\n\nTypography carries the design\'s singular voice. It is the most impactful design decision.\n\n**Rules:**\n- **Never default** to Arial, Inter, Roboto, system stacks, or Space Grotesk. These signal default thinking.\n- **Choose fonts with personality** \u2014 the typeface should be inseparable from the aesthetic direction.\n- **Display type should be expressive**, even risky. Body text should be legible and refined.\n- **Pair like actors in a scene** \u2014 a bold display font with a quiet body font creates tension and hierarchy.\n- **Work the full typographic range** \u2014 size, weight, letter-spacing, text-transform, line-height all contribute.\n\n**Font discovery sources:**\n- Google Fonts (filter by category + trending)\n- Fontshare (free, high-quality variable fonts)\n- Fontsource (npm-installable, tree-shakable)\n\n**Pairing examples (vary every time \u2014 never repeat across projects):**\n- Display: `Clash Display` / Body: `Satoshi`\n- Display: `Cabinet Grotesk` / Body: `General Sans`\n- Display: `Playfair Display` / Body: `Source Serif 4`\n- Display: `Syne` / Body: `Work Sans`\n- Display: `Space Mono` / Body: `IBM Plex Sans`\n\n### Color & Theme\n\nCommit to a cohesive position. Palettes must take a stance.\n\n**Rules:**\n- Lead with a **dominant color**, punctuate with **sharp accents**.\n- Avoid timid, evenly-distributed palettes where every color gets equal weight.\n- Use **CSS custom properties** for all color values (Tailwind `@theme` tokens or `globals.css`).\n- Bold + saturated, moody + restrained, or high-contrast + minimal \u2014 pick one and commit.\n- Dark themes are not just "invert the colors" \u2014 they need their own palette with adjusted saturation and contrast.\n\n**Tailwind + shadcn approach:**\n```css\n/* Override shadcn defaults in globals.css \u2014 don\'t just use the stock theme */\n@theme {\n  --color-accent: oklch(0.72 0.18 145);\n  --color-surface: oklch(0.14 0.01 260);\n  --color-surface-raised: oklch(0.18 0.01 260);\n  --color-text-primary: oklch(0.95 0 0);\n  --color-text-muted: oklch(0.55 0.01 260);\n  --color-border: oklch(0.25 0.01 260);\n}\n```\n\n### Motion & Animation\n\nMotion should feel choreographed, not scattered.\n\n**Rules:**\n- **One well-orchestrated page load** with staggered reveals (`animation-delay`) creates more delight than random micro-interactions.\n- **CSS-only first** \u2014 use `@keyframes`, `transition`, `animation-delay` for HTML/CSS projects.\n- **Motion library (framer-motion)** for React when orchestration or gesture-based interaction is needed.\n- **Scroll-triggered animations** \u2014 use `IntersectionObserver` or motion\'s `whileInView`.\n- **Hover states that surprise** \u2014 not just `opacity: 0.8`. Think scale, translate, color shift, blur, clip-path reveals.\n\n**Stagger pattern (Tailwind + CSS):**\n```css\n.stagger-in > * {\n  opacity: 0;\n  transform: translateY(12px);\n  animation: fadeUp 0.5s ease-out forwards;\n}\n.stagger-in > *:nth-child(1) { animation-delay: 0ms; }\n.stagger-in > *:nth-child(2) { animation-delay: 80ms; }\n.stagger-in > *:nth-child(3) { animation-delay: 160ms; }\n.stagger-in > *:nth-child(4) { animation-delay: 240ms; }\n\n@keyframes fadeUp {\n  to { opacity: 1; transform: translateY(0); }\n}\n```\n\n### Spatial Composition & Layout\n\nBreak expectations. Layouts should have a point of view.\n\n**Techniques:**\n- **Asymmetry** \u2014 off-center hero text, unequal column splits (40/60, 30/70).\n- **Overlap and z-depth** \u2014 elements layered with negative margins, `z-index`, absolute positioning.\n- **Diagonal flow** \u2014 skewed sections, rotated elements, angled dividers.\n- **Grid-breaking elements** \u2014 items that bleed outside their container or span unexpected areas.\n- **Dramatic scale jumps** \u2014 120px display heading next to 14px body. Not gradual \u2014 dramatic.\n- **Full-bleed moments** \u2014 edge-to-edge images, color blocks, or sections.\n- **Generous negative space OR controlled density** \u2014 both are valid, but commit to one.\n\n### Backgrounds & Visual Depth\n\nFlat solid backgrounds are the hallmark of generic AI output. Create atmosphere.\n\n**Techniques:**\n- Gradient meshes and multi-stop radial gradients\n- Noise and grain overlays (`background-image: url("data:image/svg+xml,...")` or CSS `filter`)\n- Geometric patterns (CSS `repeating-linear-gradient`, SVG patterns)\n- Layered transparencies and glassmorphism (`backdrop-filter: blur()`)\n- Dramatic or soft shadows and glows (`box-shadow` layering, colored shadows)\n- Decorative borders, `clip-path` shapes, SVG masks\n- Print-inspired textures: halftone, duotone, stipple\n- Knockout typography (text as mask over images/gradients)\n\n**Grain overlay (reusable):**\n```css\n.grain::after {\n  content: \'\';\n  position: fixed;\n  inset: 0;\n  opacity: 0.04;\n  pointer-events: none;\n  background-image: url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E");\n}\n```\n\n## 4. Tailwind + shadcn: Beyond Defaults\n\nshadcn/ui provides unstyled primitives. The design layer is your responsibility.\n\n### Override, don\'t accept\n```tsx\n// WRONG: stock shadcn button\n<Button variant="default">Submit</Button>\n\n// RIGHT: designed button with intent\n<Button\n  className="bg-[var(--color-accent)] text-black font-medium tracking-tight\n             rounded-[10px] px-6 py-3 text-[15px]\n             hover:brightness-110 hover:scale-[1.02]\n             active:scale-[0.98] transition-all duration-150"\n>\n  Submit\n</Button>\n```\n\n### Extend component variants\nCreate project-specific variants via `cva` or className overrides that match your aesthetic:\n```tsx\nconst buttonVariants = cva(\n  "inline-flex items-center justify-center transition-all duration-150 font-medium tracking-tight",\n  {\n    variants: {\n      intent: {\n        primary: "bg-[var(--color-accent)] text-black rounded-[10px] hover:brightness-110",\n        ghost: "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]",\n        danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-[10px]",\n      },\n      size: {\n        sm: "text-[13px] px-3 py-1.5 rounded-[8px]",\n        md: "text-[15px] px-5 py-2.5 rounded-[10px]",\n        lg: "text-[17px] px-7 py-3.5 rounded-[12px]",\n      },\n    },\n    defaultVariants: { intent: "primary", size: "md" },\n  }\n);\n```\n\n### Theme token overrides\nAlways customize the shadcn theme tokens in `globals.css` \u2014 the default theme is intentionally neutral:\n```css\n@layer base {\n  :root {\n    /* Replace with your aesthetic\'s palette */\n    --background: 0 0% 4%;\n    --foreground: 0 0% 95%;\n    --card: 0 0% 7%;\n    --primary: 145 60% 45%;\n    --primary-foreground: 0 0% 2%;\n    --muted: 0 0% 12%;\n    --muted-foreground: 0 0% 50%;\n    --border: 0 0% 14%;\n    --radius: 0.625rem;\n  }\n}\n```\n\n## 5. DO / DON\'T\n\n### DO\n- Choose a bold aesthetic direction and execute every detail in service of it.\n- Pick distinctive, characterful fonts \u2014 different for every project.\n- Lead with a dominant color; use accents sparingly but decisively.\n- Choreograph motion \u2014 staggered load, purposeful hover, scroll-triggered reveals.\n- Create visual depth with gradients, noise, shadows, layered elements.\n- Override shadcn defaults aggressively \u2014 tokens, spacing, radius, components.\n- Use asymmetric layouts, dramatic scale contrasts, and intentional negative space.\n- Vary between light/dark themes, different aesthetics \u2014 no two projects should look the same.\n\n### DON\'T\n- Don\'t use Inter, Roboto, Arial, Space Grotesk, or system font stacks.\n- Don\'t use purple-gradient-on-white or any palette that screams "AI generated this."\n- Don\'t accept stock shadcn themes without customization.\n- Don\'t create symmetric, predictable layouts (centered hero > 3-col grid > CTA > footer).\n- Don\'t add `opacity: 0.8` hover states as your only interaction.\n- Don\'t use flat solid backgrounds with no depth or texture.\n- Don\'t scatter random micro-interactions \u2014 choreograph motion intentionally.\n- Don\'t converge on familiar choices across projects \u2014 actively explore the full range.\n\n## 6. Implementation Complexity Matching\n\nMatch code complexity to the aesthetic vision:\n\n| Direction | Code Approach |\n|-----------|---------------|\n| Maximalist / chaos | Elaborate keyframes, layered pseudo-elements, SVG animations, complex gradients, multiple overlapping elements |\n| Refined / minimal | Precise spacing, perfect typography scale, subtle transitions, restraint in every detail, fewer elements but each one perfect |\n| Editorial / magazine | CSS Grid with named areas, art-directed image placement, pull quotes, typographic hierarchy with 4+ size steps |\n| Dark / moody | Colored shadows, glow effects, grain overlays, deep layered backgrounds, selective light sources |\n| Retro-futuristic | Custom fonts, scanline effects, neon glows, CRT curvature, monospace accents |\n\nExcellence comes from executing the vision well \u2014 not from adding more effects.\n\n## 7. Checklist\n\n- [ ] Aesthetic direction chosen and stated before coding.\n- [ ] Fonts are distinctive and project-specific (not Inter/Roboto/Arial/Space Grotesk).\n- [ ] Color palette takes a clear position \u2014 dominant + accent, via CSS tokens.\n- [ ] shadcn theme tokens overridden in `globals.css` to match the direction.\n- [ ] Layout has a point of view \u2014 asymmetry, scale contrast, or intentional density.\n- [ ] Motion is choreographed \u2014 staggered load, purposeful hover/scroll interactions.\n- [ ] Backgrounds have depth \u2014 gradients, noise, patterns, or layered effects.\n- [ ] No generic "AI slop" patterns (purple gradients, symmetric grids, stock components).\n- [ ] Implementation complexity matches the aesthetic ambition.\n- [ ] The design is memorable \u2014 someone could describe what makes it unique.\n',
  "skills/skill-greykite.md": '---\nskill_name: greykite\nversion: "1.0.0"\nframework: Python\nlast_verified: "2026-02-19"\nalways_attach: false\npriority: 7\ntriggers:\n  - greykite\n  - silverkite\n  - time series forecast\n  - anomaly detection\n  - changepoint detection\n  - linkedin forecasting\n---\n\n<!--\nLLM INSTRUCTION: This is a skill file for Greykite - LinkedIn\'s time series forecasting and anomaly detection library.\nApply these patterns when working with Greykite for forecasting, anomaly detection, and changepoint analysis.\n-->\n\n# Greykite: Time Series Forecasting & Anomaly Detection\n\n> **Framework:** Greykite (LinkedIn) | **Last Verified:** 2026-02-19\n\n## 1. Overview\n\nGreykite is a Python library developed by LinkedIn for flexible, intuitive, and fast time series forecasting and anomaly detection. The flagship algorithm, Silverkite, excels at handling time series with changepoints in trend or seasonality, event and holiday effects, and temporal dependencies.\n\n### Key Features\n\n- **Multiple algorithms**: Silverkite (native), Facebook Prophet, Auto ARIMA\n- **Automatic model selection**: AUTO template for out-of-the-box performance\n- **Changepoint detection**: Adaptive lasso with automatic regularization\n- **Anomaly detection**: Greykite AD with optimized thresholds\n- **Unified interface**: Consistent API across all models\n- **Sklearn integration**: Works with scikit-learn pipelines\n- **Interactive visualization**: Plotly-based charts\n\n## 2. Core APIs\n\n### 2.1 Forecaster.run_forecast_config - High-level forecasting\n\nThe primary entry point for creating forecasts with automatic model selection, cross-validation, and backtesting.\n\n```python\nfrom greykite.common.data_loader import DataLoader\nfrom greykite.framework.templates.autogen.forecast_config import ForecastConfig\nfrom greykite.framework.templates.autogen.forecast_config import MetadataParam\nfrom greykite.framework.templates.forecaster import Forecaster\nfrom greykite.framework.templates.model_templates import ModelTemplateEnum\n\n# Load sample data\ndata_loader = DataLoader()\ndf = data_loader.load_peyton_manning()\n\n# Configure metadata\nmetadata = MetadataParam(\n    time_col="ts",\n    value_col="y",\n    freq="D"\n)\n\n# Create forecast configuration\nconfig = ForecastConfig(\n    model_template=ModelTemplateEnum.AUTO.name,\n    forecast_horizon=365,\n    coverage=0.95,\n    metadata_param=metadata\n)\n\n# Run forecast\nforecaster = Forecaster()\nresult = forecaster.run_forecast_config(df=df, config=config)\n\n# Access results\nprint(result.forecast.df.head())\nprint(result.backtest.test_evaluation)\nprint(result.model[-1].summary())\n```\n\n### 2.2 ChangepointDetector.find_trend_changepoints - Detect trend shifts\n\nIdentifies points in time where the trend changes using adaptive lasso.\n\n```python\nfrom greykite.algo.changepoint.adalasso.changepoint_detector import ChangepointDetector\nfrom greykite.common.data_loader import DataLoader\n\n# Load data\ndata_loader = DataLoader()\ndf = data_loader.load_peyton_manning()\n\n# Initialize detector\ndetector = ChangepointDetector()\n\n# Detect trend changepoints\nresult = detector.find_trend_changepoints(\n    df=df,\n    time_col="ts",\n    value_col="y",\n    yearly_seasonality_order=10,\n    resample_freq="7D",\n    potential_changepoint_n=25,\n    regularization_strength=0.5,\n    actual_changepoint_min_distance="30D",\n    no_changepoint_distance_from_end="90D"\n)\n\n# View detected changepoints\nprint(result["trend_changepoints"])\n\n# Visualize\nfig = detector.plot()\nfig.show()\n```\n\n### 2.3 GreykiteDetector - Anomaly detection\n\nCombines forecasting with automatic threshold optimization.\n\n```python\nfrom greykite.detection.detector.config import ADConfig\nfrom greykite.detection.detector.data import DetectorData\nfrom greykite.detection.detector.greykite import GreykiteDetector\nfrom greykite.framework.templates.autogen.forecast_config import ForecastConfig\nfrom greykite.framework.templates.autogen.forecast_config import MetadataParam\nfrom greykite.framework.templates.model_templates import ModelTemplateEnum\n\n# Configure forecast model\nmetadata = MetadataParam(time_col="ts", value_col="y", freq="D")\nforecast_config = ForecastConfig(\n    model_template=ModelTemplateEnum.AUTO.name,\n    forecast_horizon=7,\n    coverage=None,\n    metadata_param=metadata\n)\n\n# Configure anomaly detection\nad_config = ADConfig(\n    volatility_features_list=[\n        ["dow"],\n        ["is_weekend"],\n        ["dow", "hour"]\n    ],\n    coverage_grid=[0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 0.99]\n)\n\n# Initialize and train detector\ndetector = GreykiteDetector(\n    forecast_config=forecast_config,\n    ad_config=ad_config\n)\n\ntrain_data = DetectorData(df=train_df)\ndetector.fit(data=train_data)\n\n# Predict anomalies\ntest_data = DetectorData(df=test_df)\ntest_data = detector.predict(test_data)\n\n# View results\nprint(detector.pred_df[["ts", "y", "y_pred", "y_pred_lower", "y_pred_upper", "anomaly"]].head())\n```\n\n### 2.4 DataLoader - Sample datasets\n\nProvides easy access to built-in time series datasets.\n\n```python\nfrom greykite.common.data_loader import DataLoader\n\ndata_loader = DataLoader()\n\n# View available datasets\nprint(data_loader.available_datasets)\n\n# Load datasets\ndf_peyton = data_loader.load_peyton_manning()  # Daily Wikipedia page views\ndf_bikes = data_loader.load_bikesharing()        # Hourly bike rentals\ndf_parking = data_loader.load_parking()          # Hourly parking data\n```\n\n## 3. Naming Conventions\n\n### 3.1 Variable Naming\n\n| Type | Convention | Example |\n|------|-----------|---------|\n| DataFrames | `df_*` | `df_raw`, `df_cleaned`, `df_features` |\n| Models | `model_*` | `model_forecast`, `model_classifier` |\n| Configs | `config_*` | `config_forecast`, `config_ad` |\n| Results | `result_*` | `result_forecast`, `result_changepoints` |\n| Detectors | `detector_*` | `detector_changepoint`, `detector_anomaly` |\n| Metadata | `metadata_*` | `metadata_param` |\n\n### 3.2 Function Naming\n\n```python\n# Forecasting functions\ndef generate_forecast(df: pd.DataFrame, horizon: int) -> pd.DataFrame:\n    """Generate time series forecast."""\n    pass\n\ndef evaluate_forecast(result: ForecastResult) -> dict:\n    """Evaluate forecast performance metrics."""\n    pass\n\ndef plot_forecast(result: ForecastResult) -> go.Figure:\n    """Plot forecast with confidence intervals."""\n    pass\n\n# Anomaly detection functions\ndef detect_anomalies(df: pd.DataFrame, config: ADConfig) -> pd.DataFrame:\n    """Detect anomalies in time series data."""\n    pass\n\ndef optimize_thresholds(df: pd.DataFrame, labels: pd.Series) -> dict:\n    """Optimize detection thresholds based on labeled data."""\n    pass\n\n# Changepoint detection functions\ndef find_changepoints(df: pd.DataFrame, params: dict) -> list:\n    """Find trend changepoints in time series."""\n    pass\n\ndef plot_changepoints(df: pd.DataFrame, changepoints: list) -> go.Figure:\n    """Plot time series with detected changepoints."""\n    pass\n```\n\n## 4. Common Patterns\n\n### 4.1 Basic Forecasting Workflow\n\n```python\nfrom greykite.common.data_loader import DataLoader\nfrom greykite.framework.templates.autogen.forecast_config import ForecastConfig\nfrom greykite.framework.templates.autogen.forecast_config import MetadataParam\nfrom greykite.framework.templates.forecaster import Forecaster\nfrom greykite.framework.templates.model_templates import ModelTemplateEnum\n\ndef run_basic_forecast(\n    df: pd.DataFrame,\n    time_col: str,\n    value_col: str,\n    forecast_horizon: int = 30,\n    coverage: float = 0.95\n) -> ForecastResult:\n    """Run basic forecast with AUTO model selection.\n\n    Args:\n        df: Input DataFrame with time series data.\n        time_col: Name of timestamp column.\n        value_col: Name of value column.\n        forecast_horizon: Number of periods to forecast.\n        coverage: Prediction interval coverage.\n\n    Returns:\n        ForecastResult with predictions and metrics.\n    """\n    # Configure metadata\n    metadata = MetadataParam(\n        time_col=time_col,\n        value_col=value_col,\n        freq="D"\n    )\n\n    # Create forecast configuration\n    config = ForecastConfig(\n        model_template=ModelTemplateEnum.AUTO.name,\n        forecast_horizon=forecast_horizon,\n        coverage=coverage,\n        metadata_param=metadata\n    )\n\n    # Run forecast\n    forecaster = Forecaster()\n    result = forecaster.run_forecast_config(df=df, config=config)\n\n    return result\n```\n\n### 4.2 Advanced Forecast Configuration\n\n```python\nfrom greykite.framework.templates.autogen.forecast_config import (\n    ForecastConfig,\n    MetadataParam,\n    ModelComponentsParam,\n    EvaluationPeriodParam,\n    ComputationParam\n)\n\ndef create_advanced_config(\n    forecast_horizon: int = 365,\n    coverage: float = 0.95\n) -> ForecastConfig:\n    """Create advanced forecast configuration with custom parameters.\n\n    Args:\n        forecast_horizon: Number of periods to forecast.\n        coverage: Prediction interval coverage.\n\n    Returns:\n        Configured ForecastConfig object.\n    """\n    config = ForecastConfig(\n        model_template=ModelTemplateEnum.SILVERKITE.name,\n        metadata_param=MetadataParam(\n            time_col="ts",\n            value_col="y",\n            freq="D"\n        ),\n        forecast_horizon=forecast_horizon,\n        coverage=coverage,\n        model_components_param=ModelComponentsParam(\n            growth={"growth_term": "linear"},\n            seasonality={\n                "yearly_seasonality": 15,\n                "quarterly_seasonality": 5,\n                "monthly_seasonality": 5,\n                "weekly_seasonality": 4\n            },\n            events={\n                "holidays_to_model_separately": ["New Year\'s Day", "Christmas Day"],\n                "holiday_lookup_countries": ["US"],\n                "holiday_pre_num_days": 2,\n                "holiday_post_num_days": 2\n            },\n            changepoints={\n                "changepoints_dict": {\n                    "method": "auto",\n                    "regularization_strength": 0.6,\n                    "potential_changepoint_n": 25,\n                    "no_changepoint_proportion_from_end": 0.2\n                }\n            },\n            autoregression={"autoreg_dict": "auto"}\n        ),\n        evaluation_period_param=EvaluationPeriodParam(\n            test_horizon=90,\n            cv_horizon=90,\n            cv_min_train_periods=365,\n            cv_expanding_window=True,\n            cv_periods_between_splits=90\n        ),\n        computation_param=ComputationParam(\n            verbose=1,\n            n_jobs=-1\n        )\n    )\n\n    return config\n```\n\n### 4.3 Anomaly Detection Pipeline\n\n```python\nfrom greykite.detection.detector.config import ADConfig\nfrom greykite.detection.detector.data import DetectorData\nfrom greykite.detection.detector.greykite import GreykiteDetector\n\ndef run_anomaly_detection(\n    df_train: pd.DataFrame,\n    df_test: pd.DataFrame,\n    time_col: str,\n    value_col: str\n) -> pd.DataFrame:\n    """Run anomaly detection with optimized thresholds.\n\n    Args:\n        df_train: Training data for model fitting.\n        df_test: Test data for anomaly detection.\n        time_col: Name of timestamp column.\n        value_col: Name of value column.\n\n    Returns:\n        DataFrame with anomaly flags and predictions.\n    """\n    # Configure forecast model\n    metadata = MetadataParam(time_col=time_col, value_col=value_col, freq="D")\n    forecast_config = ForecastConfig(\n        model_template=ModelTemplateEnum.AUTO.name,\n        forecast_horizon=7,\n        coverage=None,\n        metadata_param=metadata\n    )\n\n    # Configure anomaly detection\n    ad_config = ADConfig(\n        volatility_features_list=[\n            ["dow"],\n            ["is_weekend"],\n            ["dow", "hour"]\n        ],\n        coverage_grid=[0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 0.99]\n    )\n\n    # Initialize and train detector\n    detector = GreykiteDetector(\n        forecast_config=forecast_config,\n        ad_config=ad_config\n    )\n\n    train_data = DetectorData(df=df_train)\n    detector.fit(data=train_data)\n\n    # Predict anomalies\n    test_data = DetectorData(df=df_test)\n    test_data = detector.predict(test_data)\n\n    return detector.pred_df\n```\n\n### 4.4 Changepoint Detection\n\n```python\nfrom greykite.algo.changepoint.adalasso.changepoint_detector import ChangepointDetector\n\ndef detect_trend_changepoints(\n    df: pd.DataFrame,\n    time_col: str,\n    value_col: str,\n    regularization_strength: float = 0.5\n) -> dict:\n    """Detect trend changepoints in time series.\n\n    Args:\n        df: Input DataFrame with time series data.\n        time_col: Name of timestamp column.\n        value_col: Name of value column.\n        regularization_strength: Regularization strength (0.0-1.0).\n\n    Returns:\n        Dictionary with detected changepoints and trend estimation.\n    """\n    detector = ChangepointDetector()\n\n    result = detector.find_trend_changepoints(\n        df=df,\n        time_col=time_col,\n        value_col=value_col,\n        yearly_seasonality_order=10,\n        resample_freq="7D",\n        potential_changepoint_n=25,\n        regularization_strength=regularization_strength,\n        actual_changepoint_min_distance="30D",\n        no_changepoint_distance_from_end="90D"\n    )\n\n    return result\n```\n\n## 5. Model Templates\n\n### 5.1 Available Templates\n\n| Template | Description | Use Case |\n|----------|-------------|----------|\n| `AUTO` | Automatic model selection | Default, unknown data patterns |\n| `SILVERKITE` | Native Greykite algorithm | Complex seasonality, changepoints |\n| `PROPHET` | Facebook Prophet | Holiday effects, business cycles |\n| `ARIMA` | Auto ARIMA | Simple patterns, quick forecasts |\n\n### 5.2 Template Selection\n\n```python\nfrom greykite.framework.templates.model_templates import ModelTemplateEnum\n\n# Automatic selection (recommended for most cases)\nconfig = ForecastConfig(\n    model_template=ModelTemplateEnum.AUTO.name,\n    ...\n)\n\n# Silverkite for complex patterns\nconfig = ForecastConfig(\n    model_template=ModelTemplateEnum.SILVERKITE.name,\n    ...\n)\n\n# Prophet for holiday-heavy data\nconfig = ForecastConfig(\n    model_template=ModelTemplateEnum.PROPHET.name,\n    ...\n)\n\n# ARIMA for simple patterns\nconfig = ForecastConfig(\n    model_template=ModelTemplateEnum.ARIMA.name,\n    ...\n)\n```\n\n## 6. Evaluation Metrics\n\n### 6.1 Available Metrics\n\n```python\n# Access backtest metrics\nresult = forecaster.run_forecast_config(df=df, config=config)\n\n# Common metrics\nmetrics = result.backtest.test_evaluation\n\n# Available metrics:\n# - MAPE: Mean Absolute Percentage Error\n# - RMSE: Root Mean Squared Error\n# - MAE: Mean Absolute Error\n# - SMAPE: Symmetric Mean Absolute Percentage Error\n# - Quantile losses: For prediction intervals\n\nprint(f"MAPE: {metrics[\'MAPE\']:.2f}%")\nprint(f"RMSE: {metrics[\'RMSE\']:.2f}")\nprint(f"MAE: {metrics[\'MAE\']:.2f}")\n```\n\n### 6.2 Cross-Validation\n\n```python\n# Configure cross-validation\nconfig = ForecastConfig(\n    ...\n    evaluation_period_param=EvaluationPeriodParam(\n        test_horizon=90,              # Holdout test set size\n        cv_horizon=90,                # Cross-validation fold size\n        cv_min_train_periods=365,     # Minimum training size\n        cv_expanding_window=True,     # Expanding vs rolling window\n        cv_periods_between_splits=90  # Gap between CV splits\n    )\n)\n\n# Access CV results\nresult = forecaster.run_forecast_config(df=df, config=config)\ncv_results = result.backtest.cv_evaluation\n```\n\n## 7. Visualization\n\n### 7.1 Plotting Forecasts\n\n```python\nimport plotly.io as pio\n\n# Plot timeseries\nfig = result.timeseries.plot()\npio.show(fig)\n\n# Plot backtest results\nfig_backtest = result.backtest.plot()\npio.show(fig_backtest)\n\n# Plot future forecast\nfig_forecast = result.forecast.plot()\npio.show(fig_forecast)\n\n# Plot component breakdown\nfig_components = result.forecast.plot_components()\npio.show(fig_components)\n```\n\n### 7.2 Plotting Anomalies\n\n```python\n# Plot predictions with anomaly flags\nfig = detector.plot(phase="predict", title="Anomaly Detection Results")\nfig.show()\n```\n\n### 7.3 Plotting Changepoints\n\n```python\n# Visualize changepoints\nfig = detector.plot()\nfig.show()\n```\n\n## 8. Best Practices\n\n### 8.1 Data Preparation\n\n```python\n# Ensure proper column names\ndf = df.rename(columns={"date": "ts", "value": "y"})\n\n# Ensure proper datetime format\ndf["ts"] = pd.to_datetime(df["ts"])\n\n# Handle missing values\ndf = df.dropna(subset=["ts", "y"])\n\n# Sort by time\ndf = df.sort_values("ts")\n\n# Remove duplicates\ndf = df.drop_duplicates(subset=["ts"])\n```\n\n### 8.2 Model Selection\n\n```python\n# Start with AUTO template\nconfig = ForecastConfig(\n    model_template=ModelTemplateEnum.AUTO.name,\n    ...\n)\n\n# If performance is poor, try specific templates\n# - SILVERKITE for complex seasonality\n# - PROPHET for strong holiday effects\n# - ARIMA for simple patterns\n```\n\n### 8.3 Hyperparameter Tuning\n\n```python\n# Adjust regularization strength for changepoints\nconfig = ForecastConfig(\n    ...\n    model_components_param=ModelComponentsParam(\n        changepoints={\n            "changepoints_dict": {\n                "regularization_strength": 0.6,  # Higher = fewer changepoints\n                "potential_changepoint_n": 25\n            }\n        }\n    )\n)\n\n# Adjust seasonality orders\nconfig = ForecastConfig(\n    ...\n    model_components_param=ModelComponentsParam(\n        seasonality={\n            "yearly_seasonality": 15,  # Higher = more flexible\n            "weekly_seasonality": 4\n        }\n    )\n)\n```\n\n### 8.4 Performance Optimization\n\n```python\n# Use parallel processing\nconfig = ForecastConfig(\n    ...\n    computation_param=ComputationParam(\n        n_jobs=-1  # Use all cores\n    )\n)\n\n# Reduce CV folds for faster training\nconfig = ForecastConfig(\n    ...\n    evaluation_period_param=EvaluationPeriodParam(\n        cv_horizon=30,  # Smaller folds\n        cv_periods_between_splits=30\n    )\n)\n```\n\n## 9. Common Use Cases\n\n### 9.1 Business Metric Forecasting\n\n```python\ndef forecast_business_metric(\n    df: pd.DataFrame,\n    metric_name: str,\n    forecast_horizon: int = 90\n) -> dict:\n    """Forecast business metrics like revenue, users, etc.\n\n    Args:\n        df: Historical metric data.\n        metric_name: Name of the metric being forecasted.\n        forecast_horizon: Number of periods to forecast.\n\n    Returns:\n        Dictionary with forecast and metrics.\n    """\n    result = run_basic_forecast(\n        df=df,\n        time_col="ts",\n        value_col="y",\n        forecast_horizon=forecast_horizon\n    )\n\n    return {\n        "metric_name": metric_name,\n        "forecast": result.forecast.df,\n        "metrics": result.backtest.test_evaluation,\n        "model_summary": result.model[-1].summary()\n    }\n```\n\n### 9.2 Monitoring Anomaly Detection\n\n```python\ndef detect_monitoring_anomalies(\n    df: pd.DataFrame,\n    metric_name: str,\n    train_ratio: float = 0.8\n) -> pd.DataFrame:\n    """Detect anomalies in monitoring metrics.\n\n    Args:\n        df: Time series monitoring data.\n        metric_name: Name of the metric.\n        train_ratio: Ratio of data to use for training.\n\n    Returns:\n        DataFrame with anomaly flags.\n    """\n    split_idx = int(len(df) * train_ratio)\n    df_train = df[:split_idx].reset_index(drop=True)\n    df_test = df[split_idx:].reset_index(drop=True)\n\n    result = run_anomaly_detection(\n        df_train=df_train,\n        df_test=df_test,\n        time_col="ts",\n        value_col="y"\n    )\n\n    return result\n```\n\n### 9.3 Hierarchical Forecast Reconciliation\n\n```python\nfrom greykite.algo.reconcile.convex.reconcile_forecasts import ReconcileAdditiveForecasts\n\ndef reconcile_hierarchical_forecasts(\n    forecasts_df: pd.DataFrame,\n    constraint_matrix: pd.DataFrame\n) -> pd.DataFrame:\n    """Reconcile hierarchical forecasts to satisfy additivity constraints.\n\n    Args:\n        forecasts_df: DataFrame with hierarchical forecasts.\n        constraint_matrix: Constraint matrix defining relationships.\n\n    Returns:\n        Reconciled forecasts satisfying constraints.\n    """\n    reconciler = ReconcileAdditiveForecasts()\n\n    reconciled = reconciler.reconcile_forecasts(\n        forecasts=forecasts_df,\n        constraint_matrix=constraint_matrix,\n        unbiased=True,\n        weight="MLE"\n    )\n\n    return reconciled["reconciled_forecasts"]\n```\n\n## 10. Quick Reference\n\n### 10.1 Import Patterns\n\n```python\n# Core imports\nfrom greykite.common.data_loader import DataLoader\nfrom greykite.framework.templates.forecaster import Forecaster\nfrom greykite.framework.templates.autogen.forecast_config import (\n    ForecastConfig,\n    MetadataParam,\n    ModelComponentsParam\n)\nfrom greykite.framework.templates.model_templates import ModelTemplateEnum\n\n# Changepoint detection\nfrom greykite.algo.changepoint.adalasso.changepoint_detector import ChangepointDetector\n\n# Anomaly detection\nfrom greykite.detection.detector.greykite import GreykiteDetector\nfrom greykite.detection.detector.config import ADConfig\nfrom greykite.detection.detector.data import DetectorData\n\n# Reconciliation\nfrom greykite.algo.reconcile.convex.reconcile_forecasts import ReconcileAdditiveForecasts\n```\n\n### 10.2 Common Parameters\n\n| Parameter | Description | Default | Common Values |\n|-----------|-------------|---------|---------------|\n| `forecast_horizon` | Periods to forecast | - | 30, 90, 365 |\n| `coverage` | Prediction interval | 0.95 | 0.8, 0.9, 0.95, 0.99 |\n| `regularization_strength` | Changepoint regularization | 0.6 | 0.3, 0.5, 0.7, 0.9 |\n| `yearly_seasonality` | Fourier order for yearly | 15 | 5, 10, 15, 20 |\n| `weekly_seasonality` | Fourier order for weekly | 4 | 2, 4, 6, 8 |\n\n### 10.3 Result Access\n\n```python\n# Forecast results\nresult.forecast.df              # Future predictions\nresult.forecast.plot()          # Plot forecast\nresult.forecast.plot_components()  # Plot components\n\n# Backtest results\nresult.backtest.test_evaluation  # Test set metrics\nresult.backtest.cv_evaluation    # CV metrics\nresult.backtest.plot()           # Plot backtest\n\n# Model results\nresult.model[-1].summary()       # Model summary\nresult.model.predict(df)         # Make predictions\nresult.timeseries.make_future_dataframe(periods=30)  # Future dates\n```\n\n## 11. Troubleshooting\n\n### 11.1 Common Issues\n\n**Issue: Poor forecast accuracy**\n- Solution: Try different model templates (SILVERKITE, PROPHET)\n- Solution: Adjust seasonality orders\n- Solution: Check for data quality issues\n\n**Issue: Too many/few changepoints**\n- Solution: Adjust `regularization_strength` (higher = fewer)\n- Solution: Set `potential_changepoint_n` appropriately\n- Solution: Use `actual_changepoint_min_distance`\n\n**Issue: Too many false anomalies**\n- Solution: Adjust `coverage_grid` range\n- Solution: Add volatility features\n- Solution: Use labeled data for threshold optimization\n\n**Issue: Slow training**\n- Solution: Use `n_jobs=-1` for parallel processing\n- Solution: Reduce CV folds\n- Solution: Use simpler model template\n\n### 11.2 Debugging Tips\n\n```python\n# Enable verbose output\nconfig = ForecastConfig(\n    ...\n    computation_param=ComputationParam(verbose=2)\n)\n\n# Check data quality\nprint(df.info())\nprint(df.describe())\nprint(df.isnull().sum())\n\n# Validate model fit\nmodel = result.model[-1]\nprint(model.summary())\n\n# Plot residuals\nfig = result.forecast.plot_components()\npio.show(fig)\n```\n',
  "skills/skill-http-security-headers.md": "---\nskill_name: skill-http-security-headers\nversion: \"1.0\"\nframework: Next.js\nlast_verified: \"2025-12-26\"\nalways_attach: false\npriority: 8\ntriggers:\n  - csp\n  - content-security-policy\n  - security headers\n  - headers()\n  - next.config\n  - x-frame-options\n  - x-content-type-options\n  - referrer-policy\n  - permissions-policy\n  - clickjacking\n  - xss\n  - nonce\n  - strict-dynamic\n---\n\n<!--\nLLM INSTRUCTION: Use for Next.js HTTP response header hardening.\nPrefer CSP frame-ancestors over X-Frame-Options, but set both for defense-in-depth.\nIf using nonce-based CSP, it must be per-request (not a static next.config.ts string).\nStatic export (output: 'export') cannot use next.config headers(); configure at CDN/host instead.\n-->\n\n# Next.js HTTP Security Headers\n\n> **Target:** Next.js (App Router or Pages Router) | **Last Verified:** 2025-12-26\n\n## 1. What AI Models Get Wrong\n\n- **Static nonce CSP in `next.config.*`** (nonces must be generated per request).\n- **Allowing `unsafe-inline`/`unsafe-eval` in production**.\n- **Using X-Frame-Options alone** (modern control is CSP `frame-ancestors`).\n- **Forgetting static export limits** (`headers()` doesn\u2019t apply to `output: 'export'`).\n- **Over-broad allowlists** (`connect-src *`, `script-src *`) that nullify CSP.\n\n## 2. Golden Rules\n\n### \u2705 DO\n- **Set baseline security headers** via `next.config.*` `headers()` when you have a server runtime.\n- **Use CSP `frame-ancestors`** to prevent clickjacking (keep XFO as legacy defense).\n- **Roll out CSP using Report-Only first** if unsure what will break.\n- **Generate CSP nonces per request** when you need strict CSP.\n\n### \u274C DON'T\n- **Don\u2019t ship `unsafe-eval` in production** (dev-only if absolutely required).\n- **Don\u2019t use a single static nonce**.\n- **Don\u2019t rely on `headers()` for static export**.\n\n## 3. Baseline Headers (Good Defaults)\n\nUse these unless a requirement forces deviation:\n\n- `X-Content-Type-Options: nosniff`\n- `Referrer-Policy: strict-origin-when-cross-origin`\n- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()`\n- `X-Frame-Options: DENY` (or `SAMEORIGIN` if you must embed yourself)\n- `Content-Security-Policy: ...` (see below)\n\n## 4. Implementing via `next.config.*` (Static Header Values)\n\n```ts\n// next.config.ts\nimport type { NextConfig } from 'next';\n\nconst securityHeaders = [\n  { key: 'X-Content-Type-Options', value: 'nosniff' },\n  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },\n  {\n    key: 'Permissions-Policy',\n    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()'\n  },\n  { key: 'X-Frame-Options', value: 'DENY' }\n];\n\nconst nextConfig: NextConfig = {\n  poweredByHeader: false,\n  async headers() {\n    return [\n      {\n        source: '/:path*',\n        headers: [\n          ...securityHeaders,\n          {\n            key: 'Content-Security-Policy',\n            value: \"default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; upgrade-insecure-requests;\"\n          }\n        ]\n      }\n    ];\n  }\n};\n\nexport default nextConfig;\n```\n\n## 5. CSP: When to Use Nonces\n\nUse nonce-based CSP when you need strong XSS mitigation without allowing inline scripts.\n\n### Strict CSP shape (conceptual)\n\n- `script-src 'self' 'nonce-<NONCE>' 'strict-dynamic'`\n- `style-src 'self' 'nonce-<NONCE>'`\n- keep `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`\n\n### Next.js pattern: generate nonce per request\n\n```ts\n// proxy.ts (example)\nimport { NextRequest, NextResponse } from 'next/server';\n\nexport function proxy(request: NextRequest) {\n  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');\n\n  const csp = `default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; frame-ancestors 'none'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; style-src 'self' 'nonce-${nonce}'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; upgrade-insecure-requests;`;\n\n  const requestHeaders = new Headers(request.headers);\n  requestHeaders.set('x-nonce', nonce);\n\n  const response = NextResponse.next({ request: { headers: requestHeaders } });\n  response.headers.set('Content-Security-Policy', csp);\n  return response;\n}\n```\n\nUse the nonce for third-party scripts:\n\n```tsx\nimport { headers } from 'next/headers';\nimport Script from 'next/script';\n\nexport default async function Page() {\n  const nonce = (await headers()).get('x-nonce') ?? undefined;\n\n  return <Script src=\"https://example.com/script.js\" nonce={nonce} />;\n}\n```\n\n## 6. Static Export Caveat\n\nIf using `output: 'export'`, set headers at the hosting layer (CDN, reverse proxy). `next.config.*` `headers()` won\u2019t apply.\n\n## 7. Checklist\n\n- [ ] Baseline headers set for all routes.\n- [ ] CSP includes `frame-ancestors`.\n- [ ] No `unsafe-eval`/`unsafe-inline` in production.\n- [ ] If using nonces, they are per request and passed to scripts.\n- [ ] Static export handled at CDN/host.\n",
  "skills/skill-metadata-seo.md": "---\nskill_name: skill-metadata-seo\nversion: \"16.0.10\"\nframework: Next.js\nlast_verified: \"2025-12-18\"\nalways_attach: false\npriority: 6\ntriggers:\n  - metadata\n  - generateMetadata\n  - SEO\n  - openGraph\n  - og:image\n  - opengraph-image\n  - sitemap\n  - robots\n  - meta tags\n---\n\n<!--\nLLM INSTRUCTION: Apply when user works on SEO, metadata, or social sharing.\ngenerateMetadata params are PROMISES - must await them.\nopengraph-image.tsx also receives async params.\nDo NOT use next/head - App Router uses export const metadata or generateMetadata.\nUse sitemap.ts and robots.ts for dynamic generation, not static files.\nImage remotePatterns: localhost is BLOCKED by default (SSRF prevention).\n-->\n\n# Metadata & SEO\n\n> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18\n\n## 1. What AI Models Get Wrong\n\n- **Using sync params in generateMetadata** \u2192 LLMs use `{ params: { id: string } }`. In v16, params is a Promise.\n- **Using `next/head` in App Router** \u2192 LLMs suggest the old Head component. App Router uses metadata exports.\n- **Sync params in ImageResponse** \u2192 LLMs forget opengraph-image.tsx also receives async params.\n- **Using sitemap.xml file** \u2192 LLMs create static XML. v16 prefers sitemap.ts with dynamic generation.\n- **Missing parent metadata extension** \u2192 LLMs don't await parent to extend existing metadata.\n\n## 2. Golden Rules\n\n### \u2705 DO\n- **Await params in generateMetadata** \u2192 First argument is `{ params: Promise<...> }`\n- **Use `export const metadata` or `generateMetadata`** \u2192 App Router's metadata API\n- **Await params in opengraph-image.tsx** \u2192 Image routes also receive async params\n- **Use sitemap.ts for dynamic sitemaps** \u2192 Return `MetadataRoute.Sitemap` array\n- **Await `parent` for extending metadata** \u2192 Access parent's openGraph images, etc.\n\n### \u274C DON'T  \n- **Don't use `next/head`** \u2192 Not available in App Router\n- **Don't access params synchronously** \u2192 They're Promises in generateMetadata\n- **Don't create static sitemap.xml** \u2192 Use sitemap.ts for dynamic generation\n- **Don't forget robots.ts** \u2192 Controls crawler behavior\n- **Don't use local IPs in remotePatterns** \u2192 Blocked by default for SSRF prevention\n\n## 3. Critical Patterns\n\n### Async generateMetadata\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\nimport type { Metadata } from 'next';\n\n// Sync params - CRASHES in v16\nexport async function generateMetadata({ \n  params \n}: { \n  params: { id: string } // Wrong type\n}): Promise<Metadata> {\n  const product = await fetch(`https://api.example.com/products/${params.id}`); // Error\n  return { title: product.name };\n}\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\nimport type { Metadata, ResolvingMetadata } from 'next';\n\ntype Props = {\n  params: Promise<{ id: string }>;\n  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;\n};\n\nexport async function generateMetadata(\n  { params, searchParams }: Props,\n  parent: ResolvingMetadata\n): Promise<Metadata> {\n  // 1. Await the params\n  const { id } = await params;\n  \n  // 2. Fetch data\n  const product = await fetch(`https://api.example.com/products/${id}`)\n    .then((res) => res.json());\n\n  // 3. Extend parent metadata\n  const previousImages = (await parent).openGraph?.images || [];\n\n  return {\n    title: product.title,\n    description: product.description,\n    openGraph: {\n      images: [product.image, ...previousImages],\n    },\n  };\n}\n```\n**Why:** v16's async params support PPR and streaming for metadata generation.\n\n---\n\n### OpenGraph Image with Async Params\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// app/blog/[slug]/opengraph-image.tsx\nimport { ImageResponse } from 'next/og';\n\n// Sync params - CRASHES\nexport default function Image({ params }: { params: { slug: string } }) {\n  return new ImageResponse(\n    <div>Post: {params.slug}</div>, // Error\n    { width: 1200, height: 600 }\n  );\n}\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\n// app/blog/[slug]/opengraph-image.tsx\nimport { ImageResponse } from 'next/og';\n\nexport const runtime = 'edge';\nexport const alt = 'Blog post image';\nexport const size = { width: 1200, height: 630 };\nexport const contentType = 'image/png';\n\nexport default async function Image({ \n  params \n}: { \n  params: Promise<{ slug: string }> \n}) {\n  const { slug } = await params;\n  \n  // Optionally fetch post data\n  const post = await fetch(`https://api.example.com/posts/${slug}`)\n    .then(r => r.json());\n  \n  return new ImageResponse(\n    (\n      <div\n        style={{\n          fontSize: 48,\n          background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',\n          color: 'white',\n          width: '100%',\n          height: '100%',\n          display: 'flex',\n          alignItems: 'center',\n          justifyContent: 'center',\n        }}\n      >\n        {post.title}\n      </div>\n    ),\n    { ...size }\n  );\n}\n```\n**Why:** Image routes follow the same async params pattern as pages.\n\n---\n\n### Dynamic Sitemap\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```xml\n<!-- public/sitemap.xml - Static, outdated -->\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n  <url>\n    <loc>https://example.com/</loc>\n  </url>\n</urlset>\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\n// app/sitemap.ts\nimport { MetadataRoute } from 'next';\n\nexport default async function sitemap(): Promise<MetadataRoute.Sitemap> {\n  const posts = await fetch('https://api.example.com/posts')\n    .then(r => r.json());\n\n  const postUrls = posts.map((post: { slug: string; updatedAt: string }) => ({\n    url: `https://example.com/blog/${post.slug}`,\n    lastModified: new Date(post.updatedAt),\n    changeFrequency: 'weekly' as const,\n    priority: 0.8,\n  }));\n\n  return [\n    {\n      url: 'https://example.com',\n      lastModified: new Date(),\n      changeFrequency: 'yearly',\n      priority: 1,\n    },\n    {\n      url: 'https://example.com/about',\n      lastModified: new Date(),\n      changeFrequency: 'monthly',\n      priority: 0.5,\n    },\n    ...postUrls,\n  ];\n}\n```\n**Why:** sitemap.ts generates dynamic XML at request time with fresh data.\n\n---\n\n### Robots.ts\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```\n# public/robots.txt - Static file\nUser-agent: *\nDisallow: /admin\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\n// app/robots.ts\nimport { MetadataRoute } from 'next';\n\nexport default function robots(): MetadataRoute.Robots {\n  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';\n  \n  return {\n    rules: [\n      {\n        userAgent: '*',\n        allow: '/',\n        disallow: ['/admin/', '/api/', '/private/'],\n      },\n      {\n        userAgent: 'Googlebot',\n        allow: '/',\n      },\n    ],\n    sitemap: `${baseUrl}/sitemap.xml`,\n    host: baseUrl,\n  };\n}\n```\n**Why:** robots.ts allows dynamic rules and environment-based URLs.\n\n---\n\n### Image Remote Patterns Security\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// next.config.ts\nconst config = {\n  images: {\n    remotePatterns: [\n      { hostname: 'localhost' }, // Blocked for SSRF prevention\n      { hostname: '127.0.0.1' }, // Blocked\n    ],\n  },\n};\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\n// next.config.ts\nimport type { NextConfig } from 'next';\n\nconst nextConfig: NextConfig = {\n  images: {\n    remotePatterns: [\n      {\n        protocol: 'https',\n        hostname: 'assets.example.com',\n        pathname: '/images/**',\n      },\n      {\n        protocol: 'https',\n        hostname: '*.cloudinary.com',\n      },\n    ],\n    // Only for development - NOT production\n    // dangerouslyAllowLocalIP: true,\n  },\n};\n\nexport default nextConfig;\n```\n**Why:** v16 blocks loopback IPs by default to prevent SSRF attacks.\n\n## 4. Quick Reference Table\n\n| Feature | \u274C Don't | \u2705 Do |\n|---------|---------|------|\n| Head Tags | `import Head from 'next/head'` | `export const metadata` or `generateMetadata` |\n| Metadata Params | `params: { id: string }` | `params: Promise<{ id: string }>` |\n| OG Image Params | Sync access | `await params` in async function |\n| Sitemap | Static `sitemap.xml` | Dynamic `sitemap.ts` |\n| Robots | Static `robots.txt` | Dynamic `robots.ts` |\n| Local Images | `localhost` in remotePatterns | Only production domains |\n| Parent Metadata | Ignore parent | `await parent` to extend |\n\n## 5. Checklist Before Coding\n\n- [ ] `generateMetadata` function awaits its `params` argument\n- [ ] `opengraph-image.tsx` is async and awaits params  \n- [ ] Using `export const metadata` or `generateMetadata` (not next/head)\n- [ ] `sitemap.ts` returns `MetadataRoute.Sitemap` array\n- [ ] `robots.ts` returns `MetadataRoute.Robots` object\n- [ ] Image `remotePatterns` only includes production domains (no localhost)\n",
  "skills/skill-next-intl.md": "---\nskill_name: skill-next-intl\nversion: \"3.x\"\nframework: Next.js\nlast_verified: \"2025-12-26\"\nalways_attach: false\npriority: 7\ntriggers:\n  - next-intl\n  - i18n\n  - internationalization\n  - locale\n  - locales\n  - translations\n  - NextIntlClientProvider\n  - setRequestLocale\n  - defineRouting\n  - createNavigation\n  - getRequestConfig\n---\n\n<!--\nLLM INSTRUCTION: Use for Next.js App Router i18n with next-intl.\nCRITICAL: In Next.js 16, params are Promises in layouts/pages. Always await.\nCRITICAL: In async server components, use getTranslations (async) from next-intl/server. NEVER use useTranslations hook in async functions.\nuseTranslations hook is ONLY for client components ('use client').\nAlways call setRequestLocale(locale) in every layout/page that uses params.\nUse NextIntlClientProvider in the root locale layout.\nUse createNavigation() wrappers; never use next/link or next/navigation directly for localized routes.\nDo NOT use next-intl/client or createSharedPathnamesNavigation (deprecated).\n-->\n\n# next-intl (Next.js 16 App Router)\n\n> **Target:** Next.js 16 | **Last Verified:** 2025-12-26\n\n## 1. What AI Models Get Wrong\n\n- **Sync params access** \u2192 Next.js 16 params are Promises; sync destructuring breaks.\n- **Missing setRequestLocale** \u2192 causes dynamic rendering errors or wrong locale.\n- **Using useTranslations in async server components** \u2192 hooks can't be called in async functions; use `getTranslations` from `next-intl/server` instead.\n- **Using next/link** \u2192 bypasses localized pathnames.\n- **No NextIntlClientProvider** \u2192 client hooks fail.\n- **Missing matcher for unprefixed routes** \u2192 localePrefix: 'as-needed' breaks.\n\n## 2. Golden Rules\n\n### \u2705 DO\n- **Type params as Promise** and `await` them in layouts/pages.\n- **Call setRequestLocale(locale)** before any server-side translations.\n- **Use `getTranslations` from `next-intl/server`** in async server components (pages/layouts).\n- **Use `useTranslations` from `next-intl`** only in client components (`'use client'`).\n- **Wrap with NextIntlClientProvider** in `[locale]/layout.tsx`.\n- **Use createNavigation wrappers** for Link/redirect/useRouter/usePathname.\n- **Validate locale** with hasLocale and fallback to defaultLocale.\n\n### \u274C DON'T\n- **Don't destructure params synchronously** (`{ params: { locale } }`).\n- **Don't use `useTranslations` in async server components** \u2192 use `getTranslations` instead.\n- **Don't import from next-intl/client** (deprecated).\n- **Don't use createSharedPathnamesNavigation** (superseded).\n- **Don't use next/link or next/navigation directly** for localized routes.\n\n## 3. Minimal Setup (Files)\n\n```\nsrc/\n\u251C\u2500\u2500 i18n/\n\u2502   \u251C\u2500\u2500 routing.ts\n\u2502   \u251C\u2500\u2500 navigation.ts\n\u2502   \u2514\u2500\u2500 request.ts\nproxy.ts\n\u2514\u2500\u2500 app/[locale]/layout.tsx\nmessages/\n\u2514\u2500\u2500 en.json\n```\n\n## 4. Core Patterns\n\n### Routing (`src/i18n/routing.ts`)\n```ts\nimport { defineRouting } from 'next-intl/routing';\n\nexport const routing = defineRouting({\n  locales: ['en', 'es'],\n  defaultLocale: 'en',\n  localePrefix: 'as-needed',\n  pathnames: {\n    '/': '/',\n    '/about': { en: '/about', es: '/acerca-de' }\n  }\n} as const);\n\nexport type Locale = (typeof routing.locales)[number];\n```\n\n### Navigation (`src/i18n/navigation.ts`)\n```ts\nimport { createNavigation } from 'next-intl/navigation';\nimport { routing } from './routing';\n\nexport const { Link, redirect, usePathname, useRouter, getPathname } =\n  createNavigation(routing);\n```\n\n### Request Config (`src/i18n/request.ts`)\n```ts\nimport { getRequestConfig } from 'next-intl/server';\nimport { hasLocale } from 'next-intl';\nimport { routing } from './routing';\n\nexport default getRequestConfig(async ({ requestLocale }) => {\n  const requested = await requestLocale;\n  const locale = hasLocale(routing.locales, requested)\n    ? requested\n    : routing.defaultLocale;\n\n  return {\n    locale,\n    messages: (await import(`../../messages/${locale}.json`)).default\n  };\n});\n```\n\n### Proxy (`proxy.ts`) \u2014 compose with other request interceptors\nIf you also use Supabase SSR (`@supabase/ssr`), run both i18n + session refresh in **one** `proxy.ts`.\n\n```ts\nimport type { NextRequest } from 'next/server';\nimport createIntlMiddleware from 'next-intl/middleware';\nimport { routing } from '@/i18n/routing';\nimport { updateSession } from '@/lib/supabase/proxy';\n\nconst handleI18n = createIntlMiddleware(routing);\n\nexport async function proxy(request: NextRequest) {\n  // 1) Refresh Supabase session (may set cookies)\n  const sessionResponse = await updateSession(request);\n\n  // 2) Apply i18n routing (may rewrite/redirect)\n  const i18nResponse = handleI18n(request);\n\n  // 3) Merge cookies into the final response\n  for (const cookie of sessionResponse.cookies.getAll()) {\n    i18nResponse.cookies.set(cookie);\n  }\n\n  return i18nResponse;\n}\n\nexport const config = {\n  matcher: ['/((?!api|trpc|_next|_vercel|.*\\\\..*).*)']\n};\n```\n\n### Locale Layout (`src/app/[locale]/layout.tsx`)\n```tsx\nimport { NextIntlClientProvider, hasLocale } from 'next-intl';\nimport { getMessages, setRequestLocale } from 'next-intl/server';\nimport { notFound } from 'next/navigation';\nimport { routing } from '@/i18n/routing';\n\nexport function generateStaticParams() {\n  return routing.locales.map((locale) => ({ locale }));\n}\n\nexport default async function LocaleLayout({\n  children,\n  params\n}: {\n  children: React.ReactNode;\n  params: Promise<{ locale: string }>;\n}) {\n  const { locale } = await params;\n  if (!hasLocale(routing.locales, locale)) notFound();\n\n  setRequestLocale(locale);\n  const messages = await getMessages();\n\n  return (\n    <html lang={locale}>\n      <body>\n        <NextIntlClientProvider messages={messages}>\n          {children}\n        </NextIntlClientProvider>\n      </body>\n    </html>\n  );\n}\n```\n\n### Server Component Page (`app/[locale]/page.tsx`)\n```tsx\nimport { getTranslations, setRequestLocale } from 'next-intl/server';\n\nexport default async function HomePage({\n  params\n}: {\n  params: Promise<{ locale: string }>;\n}) {\n  const { locale } = await params;\n  setRequestLocale(locale);\n\n  const t = await getTranslations('HomePage');\n  return <h1>{t('title')}</h1>;\n}\n```\n\n> **Note:** Use `getTranslations` (async) in server components. Use `useTranslations` (hook) only in client components.\n\n### Client Component (`'use client'`)\n```tsx\n'use client';\n\nimport { useTranslations } from 'next-intl';\nimport { Link, usePathname, useRouter } from '@/i18n/navigation';\n\nexport default function Navigation() {\n  const t = useTranslations('Nav');\n  const pathname = usePathname();\n  const router = useRouter();\n\n  return (\n    <nav>\n      <Link href=\"/about\">{t('about')}</Link>\n      <button onClick={() => router.push('/contact')}>{t('contact')}</button>\n    </nav>\n  );\n}\n```\n\n## 5. Checklist\n\n- [ ] Params typed as `Promise` and awaited in layouts/pages.\n- [ ] `setRequestLocale(locale)` called before server translations.\n- [ ] `NextIntlClientProvider` wraps app under `[locale]/layout.tsx`.\n- [ ] Navigation uses `@/i18n/navigation` wrappers.\n- [ ] Proxy matcher includes unprefixed routes.\n",
  "skills/skill-posthog-analytics.md": "---\nskill_name: skill-posthog-analytics\nversion: \"1.0\"\nframework: Next.js\nlast_verified: \"2025-12-26\"\nalways_attach: false\npriority: 5\ntriggers:\n  - posthog\n  - posthog-js\n  - posthog-node\n  - \"@posthog/react\"\n  - analytics\n  - pageview\n  - \"$pageview\"\n  - \"$pageleave\"\n  - autocapture\n  - server-only\n  - client-only\n  - runtime = 'nodejs'\n---\n\n<!--\nLLM INSTRUCTION: Use for PostHog analytics in Next.js App Router.\nStrictly separate client tracking (posthog-js/@posthog/react) from server tracking (posthog-node).\nMark server analytics modules as server-only and client analytics modules as client-only to prevent cross-imports.\nServer tracking must run in Node runtime (not Edge); set export const runtime = 'nodejs' where needed.\nPrefer PostHog SPA pageview auto-tracking; only use manual $pageview/$pageleave when required.\nAlways flush server events in short-lived runtimes (flushAt: 1, flushInterval: 0, shutdown()).\n-->\n\n# PostHog Analytics (Next.js App Router)\n\n> **Target:** Next.js App Router | **Last Verified:** 2025-12-26\n\n## 1. What AI Models Get Wrong\n\n- Importing `posthog-node` into client bundles (causes runtime/bundle issues).\n- Using browser-only APIs on the server (\u201Cwindow is not defined\u201D).\n- Running server tracking in Edge runtime.\n- Double-tracking pageviews (auto + manual).\n- Not flushing server events in serverless/short-lived execution.\n\n## 2. Golden Rules\n\n### \u2705 DO\n- **Client:** `posthog-js` + `@posthog/react` in `'use client'` components only.\n- **Server:** `posthog-node` in server-only modules only; flush events on completion.\n- Enforce separation with `import 'server-only'` and optionally `import 'client-only'`.\n- Prefer SPA pageview auto-tracking; standardize one approach.\n- For server handlers/actions using PostHog Node SDK, ensure `export const runtime = 'nodejs'` if your project uses Edge elsewhere.\n\n### \u274C DON'T\n- Don\u2019t import server tracking helpers in client components.\n- Don\u2019t rely on server tracking in Edge.\n- Don\u2019t mix auto and manual pageview capture without a clear reason.\n\n## 3. Environment Variables\n\nClient (public):\n\n```bash\nNEXT_PUBLIC_POSTHOG_KEY=phc_...\nNEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com\n```\n\nServer (keep separate names to avoid accidental client coupling):\n\n```bash\nPOSTHOG_SERVER_KEY=phc_...\nPOSTHOG_SERVER_HOST=https://us.i.posthog.com\n```\n\n## 4. Client Setup (Provider)\n\n```tsx\n// app/providers.tsx\n'use client';\n\nimport { useEffect } from 'react';\nimport posthog from 'posthog-js';\nimport { PostHogProvider as PHProvider } from '@posthog/react';\n\nexport function PostHogProvider({ children }: { children: React.ReactNode }) {\n  useEffect(() => {\n    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {\n      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,\n    });\n  }, []);\n\n  return <PHProvider client={posthog}>{children}</PHProvider>;\n}\n```\n\nWrap in `app/layout.tsx` without forcing full client rendering (boundary is fine).\n\n## 5. Pageview Tracking\n\n- Prefer built-in SPA pageview auto-tracking (don\u2019t manually capture unless you disable it).\n- If manual is required:\n  - disable auto (`capture_pageview: false`)\n  - capture both `$pageview` and `$pageleave` (use `sendBeacon` for leave).\n\n## 6. Server Setup (`posthog-node`)\n\n```ts\n// src/lib/posthog-server.ts\nimport 'server-only';\nimport { PostHog } from 'posthog-node';\n\nexport function PostHogServer() {\n  return new PostHog(process.env.POSTHOG_SERVER_KEY!, {\n    host: process.env.POSTHOG_SERVER_HOST!,\n    flushAt: 1,\n    flushInterval: 0\n  });\n}\n```\n\nUse in a route handler/action and `await posthog.shutdown()` in `finally`.\n\n## 7. Standard Event Shape (Recommended)\n\n- Event naming: `[object] [verb]` (e.g. `project created`, `invite sent`).\n- Include these properties on all custom events:\n  - `source: 'client' | 'server'`\n  - `app: 'web'`\n  - `router: 'app'`\n  - domain IDs (`org_id`, `project_id`, etc.)\n\n## 8. Checklist\n\n- [ ] Client and server analytics code is split and enforced via `server-only` / `client-only`.\n- [ ] Server tracking runs in Node runtime and flushes on completion.\n- [ ] Pageview strategy chosen (auto vs manual) and not duplicated.\n- [ ] Custom event naming and core properties standardized.\n",
  "skills/skill-routing-layouts.md": "---\nskill_name: skill-routing-layouts\nversion: \"16.0.10\"\nframework: Next.js\nlast_verified: \"2025-12-18\"\nalways_attach: false\npriority: 7\ntriggers:\n  - parallel route\n  - \"@modal\"\n  - \"@slot\"\n  - default.js\n  - default.tsx\n  - intercepting route\n  - layout.tsx\n  - loading.js\n  - error.js\n  - route group\n---\n\n<!--\nLLM INSTRUCTION: Apply when user creates pages, modals, layouts, or navigation.\nCRITICAL: Every parallel route @slot MUST have a default.tsx file (even if it returns null).\nParams in layouts are ALSO Promises - must await them just like in pages.\nIntercepting routes: (.) = same level, (..) = parent, (...) = root.\nerror.js MUST have 'use client' directive. loading.js is auto-Suspense.\nDo NOT use _app.js, _document.js, or next/router - those are Pages Router patterns.\n-->\n\n# Routing & Layouts\n\n> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18\n\n## 1. What AI Models Get Wrong\n\n- **Omitting `default.js` in parallel routes** \u2192 LLMs forget this file. v16 build fails without it for every @slot.\n- **Using sync params in layouts** \u2192 LLMs access params directly. In v16, layout params are Promises too.\n- **Confusing intercepting route syntax** \u2192 LLMs mix up `(.)` vs `(..)` vs `(...)` conventions.\n- **Using Pages Router patterns** \u2192 LLMs suggest `_app.js`, `_document.js`, `next/router` in App Router context.\n- **Creating page.tsx AND route.ts in same folder** \u2192 LLMs don't realize this causes conflicts.\n\n## 2. Golden Rules\n\n### \u2705 DO\n- **Create `default.js` for every parallel route @slot** \u2192 Required fallback for soft navigation\n- **Await params in layouts** \u2192 Layouts receive `Promise<{ slug: string }>` too\n- **Use `(.)` for same-level intercept, `(..)` for parent** \u2192 Precise routing semantics\n- **Use `loading.js` for Suspense boundaries** \u2192 Automatic loading UI per segment\n- **error.js must be 'use client'** \u2192 Error boundaries are client components\n\n### \u274C DON'T  \n- **Don't skip default.js** \u2192 Causes 404 or build failure in v16\n- **Don't access layout params synchronously** \u2192 They're Promises\n- **Don't use `_app.js`, `_document.js`** \u2192 App Router uses layout.tsx\n- **Don't use `next/router`** \u2192 Use `next/navigation` in App Router\n- **Don't have page.tsx and route.ts together** \u2192 Same segment conflict\n\n## 3. Critical Patterns\n\n### Parallel Routes with Default.js\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```\napp/\n\u251C\u2500\u2500 @modal/\n\u2502   \u2514\u2500\u2500 photo/\n\u2502       \u2514\u2500\u2500 [id]/\n\u2502           \u2514\u2500\u2500 page.tsx\n\u251C\u2500\u2500 layout.tsx\n\u2514\u2500\u2500 page.tsx\n// Missing default.tsx = BUILD FAILURE in v16\n```\n\n**\u2705 CORRECT (v16):**\n```\napp/\n\u251C\u2500\u2500 @modal/\n\u2502   \u251C\u2500\u2500 default.tsx      \u2190 REQUIRED\n\u2502   \u2514\u2500\u2500 photo/\n\u2502       \u2514\u2500\u2500 [id]/\n\u2502           \u2514\u2500\u2500 page.tsx\n\u251C\u2500\u2500 layout.tsx\n\u2514\u2500\u2500 page.tsx\n```\n\n```typescript\n// app/@modal/default.tsx\nexport default function Default() {\n  return null; // Render nothing when no modal matches\n}\n\n// app/layout.tsx\nexport default function Layout({\n  children,\n  modal,\n}: {\n  children: React.ReactNode;\n  modal: React.ReactNode;\n}) {\n  return (\n    <html>\n      <body>\n        {children}\n        {modal}\n      </body>\n    </html>\n  );\n}\n```\n**Why:** When navigating away from /photo/123, Next needs default.tsx to know what to render in @modal slot.\n\n---\n\n### Async Params in Layouts\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// Sync access in layout - CRASHES\nexport default function BlogLayout({\n  children,\n  params,\n}: {\n  children: React.ReactNode;\n  params: { slug: string }; // Wrong type\n}) {\n  return (\n    <div>\n      <h1>Blog: {params.slug}</h1> {/* Error: params is Promise */}\n      {children}\n    </div>\n  );\n}\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\nexport default async function BlogLayout({\n  children,\n  params,\n}: {\n  children: React.ReactNode;\n  params: Promise<{ slug: string }>; // Promise type\n}) {\n  const { slug } = await params; // Await required\n  \n  return (\n    <div className=\"blog-layout\">\n      <aside>Current Post: {slug}</aside>\n      {children}\n    </div>\n  );\n}\n```\n**Why:** All params are Promises in v16 to support PPR streaming.\n\n---\n\n### Intercepting Routes Syntax\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```\napp/\n\u251C\u2500\u2500 feed/\n\u2502   \u2514\u2500\u2500 (..)photo/      \u2190 Wrong: should match route structure\n\u2502       \u2514\u2500\u2500 [id]/\n\u2502           \u2514\u2500\u2500 page.tsx\n\u2514\u2500\u2500 photo/\n    \u2514\u2500\u2500 [id]/\n        \u2514\u2500\u2500 page.tsx\n```\n\n**\u2705 CORRECT (v16):**\n```\napp/\n\u251C\u2500\u2500 @modal/\n\u2502   \u2514\u2500\u2500 (.)photo/       \u2190 (.) = same level intercept\n\u2502       \u2514\u2500\u2500 [id]/\n\u2502           \u2514\u2500\u2500 page.tsx\n\u251C\u2500\u2500 feed/\n\u2502   \u2514\u2500\u2500 (..)photo/      \u2190 (..) = one level up intercept  \n\u2502       \u2514\u2500\u2500 [id]/\n\u2502           \u2514\u2500\u2500 page.tsx\n\u251C\u2500\u2500 photo/\n\u2502   \u2514\u2500\u2500 [id]/\n\u2502       \u2514\u2500\u2500 page.tsx    \u2190 Full page (hard navigation)\n\u2514\u2500\u2500 layout.tsx\n```\n\n**Syntax Reference:**\n- `(.)` - Intercept from same level\n- `(..)` - Intercept from one level up\n- `(..)(..)` - Two levels up\n- `(...)` - Intercept from app root\n\n**Why:** Soft navigation shows intercepted modal; hard refresh shows full page.\n\n---\n\n### Loading.js and Error.js\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// Manual loading state in page\n'use client';\nexport default function Page() {\n  const [loading, setLoading] = useState(true);\n  // ... manual spinner logic\n}\n\n// error.js as Server Component\nexport default function Error({ error }) { // Missing 'use client'\n  return <div>Error: {error.message}</div>;\n}\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\n// app/dashboard/loading.tsx - Automatic Suspense\nexport default function Loading() {\n  return <div className=\"skeleton\">Loading dashboard...</div>;\n}\n\n// app/dashboard/error.tsx - MUST be 'use client'\n'use client';\n\nimport { useEffect } from 'react';\n\nexport default function Error({\n  error,\n  reset,\n}: {\n  error: Error & { digest?: string };\n  reset: () => void;\n}) {\n  useEffect(() => {\n    console.error(error);\n  }, [error]);\n\n  return (\n    <div>\n      <h2>Something went wrong!</h2>\n      <button onClick={() => reset()}>Try again</button>\n    </div>\n  );\n}\n```\n**Why:** loading.js auto-wraps in Suspense. error.js must be client for reset() interactivity.\n\n---\n\n### Default.js with Async Params\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// Sync params in default.js\nexport default function Default({ params }: { params: { id: string } }) {\n  return <div>Fallback for {params.id}</div>; // Crashes\n}\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\n// app/@sidebar/default.tsx\nexport default async function Default({ \n  params \n}: { \n  params: Promise<{ id: string }> \n}) {\n  const { id } = await params;\n  return <div>Default sidebar for {id}</div>;\n}\n```\n**Why:** default.js follows the same async params contract as page.tsx.\n\n## 4. Quick Reference Table\n\n| Feature | \u274C Don't | \u2705 Do |\n|---------|---------|------|\n| Parallel Routes | Skip default.js | Create default.js for every @slot |\n| Layout Params | `params: { slug: string }` | `params: Promise<{ slug: string }>` |\n| Same-level Intercept | Random folder | `(.)folder` syntax |\n| Parent-level Intercept | `(.)folder` | `(..)folder` syntax |\n| Error Boundary | Server Component | `'use client'` directive |\n| Loading UI | Manual useState | `loading.js` file |\n| Global Layout | `_app.js` | `app/layout.tsx` |\n| Navigation | `next/router` | `next/navigation` |\n\n## 5. Checklist Before Coding\n\n- [ ] Every parallel route @slot has a `default.tsx` file\n- [ ] Layout components are `async` and `await` their params\n- [ ] Using correct intercept syntax: `(.)` same, `(..)` parent, `(...)` root\n- [ ] `error.js` files have `'use client'` at top\n- [ ] No `_app.js`, `_document.js`, or `next/router` usage\n- [ ] No page.tsx and route.ts in the same folder\n",
  "skills/skill-server-actions-mutations.md": "---\nskill_name: skill-server-actions-mutations\nversion: \"16.0.10\"\nframework: Next.js\nreact_version: \"19\"\nlast_verified: \"2025-12-18\"\nalways_attach: false\npriority: 8\ntriggers:\n  - server action\n  - use server\n  - useActionState\n  - useFormState\n  - form action\n  - FormData\n  - mutation\n  - submit\n  - zod\n  - validation\n---\n\n<!--\nLLM INSTRUCTION: Apply when user creates forms or server-side mutations.\nSECURITY: Server Actions are PUBLIC HTTP endpoints. ALWAYS validate with Zod.\nREACT 19 CHANGE: useFormState is RENAMED to useActionState. Import from 'react' not 'react-dom'.\nCRITICAL: redirect() throws an error intentionally - NEVER catch it in try/catch.\nUse .bind() for passing IDs, NOT hidden inputs (which are tamperable).\n-->\n\n# Server Actions & Mutations\n\n> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18\n\n## 1. What AI Models Get Wrong\n\n- **Using `useFormState` from 'react-dom'** \u2192 LLMs use React 18 import. React 19 renames to `useActionState` from 'react'.\n- **Skipping Zod validation** \u2192 LLMs trust FormData directly. Server Actions are public endpoints\u2014validation is mandatory.\n- **Placing `redirect()` inside try/catch** \u2192 LLMs catch the redirect error. redirect() throws intentionally and must not be caught.\n- **Defining actions in 'use client' files** \u2192 LLMs put 'use server' inside client components. Actions must be in server files.\n- **Using hidden inputs for IDs** \u2192 LLMs use `<input type=\"hidden\">` for passing IDs. Use `.bind()` for secure argument passing.\n\n## 2. Golden Rules\n\n### \u2705 DO\n- **Validate ALL input with Zod** \u2192 Server Actions are public HTTP endpoints\n- **Use `useActionState` from 'react'** \u2192 React 19's renamed hook with isPending\n- **Use `.bind()` for secure argument passing** \u2192 Prevents client tampering\n- **Place `redirect()` outside try/catch** \u2192 It throws to trigger navigation\n- **Call `revalidateTag()` after mutations** \u2192 Update cached data\n\n### \u274C DON'T  \n- **Don't trust FormData** \u2192 Always validate server-side\n- **Don't use `useFormState`** \u2192 Renamed to useActionState in React 19\n- **Don't catch redirect/notFound errors** \u2192 They throw intentionally\n- **Don't define 'use server' in 'use client' files** \u2192 Invalid, actions must be separate\n- **Don't use hidden inputs for sensitive IDs** \u2192 Use .bind() instead\n\n## 3. Critical Patterns\n\n### Secure Server Action with Zod\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n'use server';\n\nexport async function createUser(formData: FormData) {\n  // Trusting raw FormData - SECURITY RISK\n  const email = formData.get('email') as string;\n  const role = formData.get('role') as string;\n  \n  await db.user.create({ email, role }); // No validation!\n}\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\n'use server';\n\nimport { z } from 'zod';\nimport { auth } from '@/lib/auth';\nimport { redirect } from 'next/navigation';\n\nconst schema = z.object({\n  email: z.string().email(),\n  role: z.enum(['user', 'admin']),\n});\n\ntype CreateUserState =\n  | {\n      error: string;\n      issues?: Record<string, string[]>;\n    }\n  | null;\n\nexport async function createUser(_prevState: CreateUserState, formData: FormData): Promise<CreateUserState> {\n  // 1. Authentication\n  const session = await auth();\n  if (!session?.user) {\n    return { error: 'Unauthorized' };\n  }\n\n  // 2. Validation (MANDATORY)\n  const parsed = schema.safeParse({\n    email: formData.get('email'),\n    role: formData.get('role'),\n  });\n\n  if (!parsed.success) {\n    return { error: 'Invalid input', issues: parsed.error.flatten().fieldErrors };\n  }\n\n  // 3. Mutation\n  try {\n    await db.user.create({ data: parsed.data });\n  } catch (e) {\n    return { error: 'Database error' };\n  }\n\n  // 4. Redirect (OUTSIDE try/catch)\n  redirect('/users');\n}\n```\n**Why:** Server Actions are public endpoints. Zod validation is non-negotiable security.\n\n---\n\n### useActionState (React 19)\n\n**\u274C WRONG (v14/React 18 - Hallucination Risk):**\n```typescript\n'use client';\nimport { useFormState } from 'react-dom'; // WRONG import\n\nexport function UserForm() {\n  const [state, action] = useFormState(createUser, null); // Missing isPending\n  \n  return <form action={action}>...</form>;\n}\n```\n\n**\u2705 CORRECT (v16/React 19):**\n```typescript\n'use client';\nimport { useActionState } from 'react'; // Correct import\nimport { createUser } from './actions';\n\nexport function UserForm() {\n  // React 19: [state, dispatch, isPending]\n  const [state, formAction, isPending] = useActionState(createUser, null);\n\n  return (\n    <form action={formAction}>\n      <input name=\"email\" type=\"email\" required />\n      \n      {state?.issues?.email && (\n        <span className=\"error\">{state.issues.email}</span>\n      )}\n      \n      <button type=\"submit\" disabled={isPending}>\n        {isPending ? 'Creating...' : 'Create User'}\n      </button>\n      \n      {state?.error && <div className=\"error\">{state.error}</div>}\n    </form>\n  );\n}\n```\n**Why:** React 19 renamed useFormState to useActionState and added isPending as third return value.\n\n---\n\n### Secure Argument Binding\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// Hidden inputs can be tampered with in DevTools\nexport function DeleteButton({ userId }: { userId: string }) {\n  return (\n    <form action={deleteUser}>\n      <input type=\"hidden\" name=\"userId\" value={userId} /> {/* Tamperable! */}\n      <button>Delete</button>\n    </form>\n  );\n}\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\n// Server Component - .bind() is secure\nexport function DeleteButton({ userId }: { userId: string }) {\n  const deleteUserWithId = deleteUser.bind(null, userId);\n  \n  return (\n    <form action={deleteUserWithId}>\n      <button>Delete</button>\n    </form>\n  );\n}\n\n// actions.ts\n'use server';\nexport async function deleteUser(userId: string, formData: FormData) {\n  // userId is bound server-side, client cannot tamper\n  await db.user.delete({ where: { id: userId } });\n  revalidateTag('users');\n}\n```\n**Why:** .bind() serializes arguments in the React Server Components closure, not in client HTML.\n\n---\n\n### Redirect Outside Try/Catch\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n'use server';\n\nexport async function submitForm(formData: FormData) {\n  try {\n    await db.insert(formData);\n    redirect('/success'); // CAUGHT by catch block!\n  } catch (e) {\n    return { error: 'Failed' }; // Redirect never happens\n  }\n}\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\n'use server';\nimport { redirect } from 'next/navigation';\n\nexport async function submitForm(formData: FormData) {\n  let success = false;\n  \n  try {\n    await db.insert(formData);\n    success = true;\n  } catch (e) {\n    return { error: 'Database error' };\n  }\n\n  // Redirect OUTSIDE try/catch\n  if (success) {\n    redirect('/success');\n  }\n}\n```\n**Why:** redirect() throws a NEXT_REDIRECT error to trigger navigation. Catching it prevents the redirect.\n\n---\n\n### useFormStatus for Submit Buttons\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// Prop drilling isPending to button\nexport function Form({ isPending }: { isPending: boolean }) {\n  return (\n    <form>\n      <SubmitButton disabled={isPending} />\n    </form>\n  );\n}\n```\n\n**\u2705 CORRECT (v16/React 19):**\n```typescript\n'use client';\nimport { useFormStatus } from 'react-dom';\n\nexport function SubmitButton() {\n  const { pending, data, method, action } = useFormStatus();\n  \n  return (\n    <button type=\"submit\" disabled={pending}>\n      {pending ? 'Submitting...' : 'Submit'}\n    </button>\n  );\n}\n\n// Usage - no prop drilling needed\nexport function Form() {\n  return (\n    <form action={submitAction}>\n      <input name=\"email\" />\n      <SubmitButton /> {/* Reads pending from parent form */}\n    </form>\n  );\n}\n```\n**Why:** useFormStatus reads status from the nearest parent form without prop drilling.\n\n## 4. Quick Reference Table\n\n| Feature | \u274C Don't | \u2705 Do |\n|---------|---------|------|\n| Form Hook | `useFormState` from 'react-dom' | `useActionState` from 'react' |\n| Validation | Trust raw FormData | Validate with Zod (mandatory) |\n| Pass IDs | `<input type=\"hidden\">` | `.bind(null, id)` |\n| Redirect | Inside try/catch | Outside try/catch block |\n| Action Files | 'use server' in 'use client' file | Separate actions.ts file |\n| Button State | Prop drilling isPending | `useFormStatus` hook |\n| After Mutation | Forget cache | `revalidateTag()` or `router.refresh()` |\n\n## 5. Checklist Before Coding\n\n- [ ] Server Action file has `'use server'` at top (not inside 'use client' file)\n- [ ] All input validated with Zod before any database operations\n- [ ] Using `useActionState` from 'react' (not useFormState from 'react-dom')\n- [ ] `redirect()` and `notFound()` calls are outside try/catch blocks\n- [ ] Using `.bind()` for passing IDs instead of hidden inputs\n- [ ] Calling `revalidateTag()` or `router.refresh()` after mutations\n",
  "skills/skill-supabase-ssr.md": "---\nskill_name: skill-supabase-ssr\nversion: \"1.0\"\nframework: Next.js\nlast_verified: \"2025-12-29\"\nalways_attach: false\npriority: 8\ntriggers:\n  - \"@supabase/ssr\"\n  - supabase ssr\n  - supabase auth\n  - createServerClient\n  - createBrowserClient\n  - proxy.ts\n  - cookies.setAll\n  - next/headers\n  - getUser\n  - getClaims\n  - getSession\n  - rls\n  - auth.uid()\n  - \"@supabase/auth-helpers-nextjs\"\n---\n\n<!--\nLLM INSTRUCTION: Use for Supabase Auth in Next.js App Router with @supabase/ssr.\nFORBID: @supabase/auth-helpers-nextjs (deprecated; don't mix with @supabase/ssr).\nUse separate clients: createBrowserClient (client components) and createServerClient (server).\nServer Components may throw on setting cookies: wrap cookies.setAll in try/catch.\nUse a Proxy (proxy.ts) to refresh sessions and write cookies to BOTH request and response to avoid desync.\nNever rely on getSession() for server-side protection; prefer getClaims() (JWT verification) or getUser() (server revalidation).\nCoordinate RLS policies with schema: policies depend on columns like user_id/tenant_id and auth.uid().\n-->\n\n# Supabase Auth (SSR) for Next.js App Router\n\n> **Target:** Next.js + `@supabase/ssr` | **Last Verified:** 2025-12-29\n\n## 1. What AI Models Get Wrong\n\n- Using `@supabase/auth-helpers-nextjs` (deprecated) or mixing it with `@supabase/ssr`.\n- Creating a server client as a module singleton (can bleed cookie state across requests).\n- Forgetting the Proxy session refresh step (tokens drift; server components can\u2019t reliably set cookies).\n- Not updating both `request.cookies` and `response.cookies` in the Proxy.\n- Trusting `getSession()` for server-side authorization decisions.\n\n## 2. Golden Rules\n\n### \u2705 DO\n- Use `@supabase/ssr` only; uninstall `@supabase/auth-helpers-nextjs`.\n- Use **two clients**:\n  - `createBrowserClient` for Client Components.\n  - `createServerClient` for Server Components/Actions/Route Handlers with cookie plumbing.\n- In Server Components, implement `cookies.getAll()` + `cookies.setAll()` and **catch `setAll` errors**.\n- Use `proxy.ts` to refresh sessions early and keep cookies consistent per request.\n- For server-side protection, use `getClaims()` (recommended) or `getUser()` (strongest, revalidated).\n\n### \u274C DON'T\n- Don\u2019t trust `getSession()` in server code for protection.\n- Don\u2019t set cookies in Server Components without guarding for runtime errors.\n- Don\u2019t ship schema changes without matching RLS updates.\n\n## 3. Minimal File Layout\n\n```\nproxy.ts                    # Root Next.js middleware entrypoint\nlib/supabase/client.ts      # Browser client (createBrowserClient)\nlib/supabase/server.ts      # Server client (createServerClient)\nlib/supabase/proxy.ts       # Session refresh with getClaims()\n```\n\n## 4. Client Component: Browser Client\n\n```ts\n// lib/supabase/client.ts\nimport { createBrowserClient } from '@supabase/ssr';\n\nexport function createClient() {\n  return createBrowserClient(\n    process.env.NEXT_PUBLIC_SUPABASE_URL!,\n    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!\n  );\n}\n```\n\n## 5. Server: Per-request Client + Cookie Safety\n\n```ts\n// lib/supabase/server.ts\nimport { createServerClient } from '@supabase/ssr';\nimport { cookies } from 'next/headers';\n\nexport function createClient() {\n  const cookieStore = cookies();\n\n  return createServerClient(\n    process.env.NEXT_PUBLIC_SUPABASE_URL!,\n    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,\n    {\n      cookies: {\n        getAll() {\n          return cookieStore.getAll();\n        },\n        setAll(cookiesToSet) {\n          try {\n            cookiesToSet.forEach(({ name, value, options }) => {\n              cookieStore.set(name, value, options);\n            });\n          } catch {\n            // Server Components can throw on cookie writes.\n            // Safe to ignore IF proxy.ts refreshes sessions.\n          }\n        }\n      }\n    }\n  );\n}\n```\n\n## 6. Proxy Session Refresh (Required)\n\n### Root `proxy.ts`\n```ts\nimport type { NextRequest } from 'next/server';\nimport { updateSession } from '@/lib/supabase/proxy';\n\nexport async function proxy(request: NextRequest) {\n  return updateSession(request);\n}\n\nexport const config = {\n  matcher: [\n    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'\n  ]\n};\n```\n\n### Session updater (`lib/supabase/proxy.ts`)\n```ts\nimport { createServerClient } from '@supabase/ssr';\nimport { NextResponse, type NextRequest } from 'next/server';\n\nexport async function updateSession(request: NextRequest) {\n  let response = NextResponse.next({ request });\n\n  const supabase = createServerClient(\n    process.env.NEXT_PUBLIC_SUPABASE_URL!,\n    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,\n    {\n      cookies: {\n        getAll() {\n          return request.cookies.getAll();\n        },\n        setAll(cookiesToSet) {\n          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));\n          response = NextResponse.next({ request });\n          cookiesToSet.forEach(({ name, value, options }) => {\n            response.cookies.set(name, value, options);\n          });\n        }\n      }\n    }\n  );\n\n  // IMPORTANT: Avoid writing logic between createServerClient(...) and getClaims().\n  // IMPORTANT: Don't remove getClaims(); it both validates and keeps sessions/cookies in sync.\n  await supabase.auth.getClaims();\n\n  return response;\n}\n```\n\n## 7. Authorization Guidance (Server-side)\n\n- **Never** rely on `supabase.auth.getSession()` for server protection (it reads from storage/cookies and is not a strong guarantee).\n- Use `supabase.auth.getClaims()` to protect pages/user data when JWT validation is sufficient (verifies against JWKS/public keys; commonly used in middleware/proxy).\n- Use `supabase.auth.getUser()` when you need the strongest server-side check (revalidated with Supabase Auth).\n\n## 8. RLS + Schema Coordination (Security Invariant)\n\n- RLS is the enforcement layer; without policies it is effectively default-deny.\n- Policies commonly use `auth.uid()`; schema must include the columns used by policies (`user_id`, `tenant_id`, etc.).\n- Ship table changes and RLS policy updates together (same PR/migration unit).\n\n## 9. Checklist\n\n- [ ] `@supabase/auth-helpers-nextjs` removed and not used.\n- [ ] Browser code uses `createBrowserClient`.\n- [ ] Server code uses per-request `createServerClient` with `getAll/setAll` cookie plumbing.\n- [ ] `setAll` errors are caught in Server Components.\n- [ ] `proxy.ts` refreshes sessions and updates both request and response cookies.\n- [ ] Server protection uses `getClaims()` or `getUser()` (not `getSession()`).\n- [ ] RLS policies and schema evolve together.\n",
  "skills/skill-tailwindcss-v4.md": '---\nskill_name: skill-tailwindcss-v4\nversion: "4.x"\nframework: Tailwind CSS\nlast_verified: "2025-12-26"\nalways_attach: false\npriority: 6\ntriggers:\n  - tailwind v4\n  - tailwindcss v4\n  - tailwindcss\n  - "@theme"\n  - "@source"\n  - "@config"\n  - "@tailwindcss/postcss"\n  - postcss.config\n  - globals.css\n  - tw-animate-css\n  - tailwind.config.js\n---\n\n<!--\nLLM INSTRUCTION: Use for Tailwind CSS v4 (CSS-first). Prevent generating tailwind.config.js by default.\nv4 entry is @import "tailwindcss"; (do not emit @tailwind base/components/utilities).\nTheme tokens live in @theme as CSS custom properties; use :root only for non-Tailwind vars.\nPostCSS plugin is @tailwindcss/postcss.\nFor extra scan sources, prefer @source in CSS over a JS config.\nOnly create a JS config when explicitly required; load it via @config (not auto-detected).\ntw-animate-css is CSS-first; import it in CSS.\n-->\n\n# Tailwind CSS v4 (CSS-first)\n\n> **Target:** Tailwind CSS v4 | **Last Verified:** 2025-12-26\n\n## 1. What AI Models Get Wrong\n\n- **Generating `tailwind.config.js` by default** (v4 is CSS-first; avoid JS config unless required).\n- **Using v3 directives** (`@tailwind base/components/utilities`) instead of `@import "tailwindcss";`.\n- **Putting design tokens in JS** instead of `@theme` variables.\n- **Adding a `content: []` scan array** (prefer auto-detection; use `@source` when needed).\n- **Using `theme()`** (prefer generated CSS variables).\n\n## 2. Golden Rules\n\n### \u2705 DO\n- Use `@import "tailwindcss";` as the Tailwind entry in `globals.css`.\n- Define Tailwind tokens in `@theme { --color-...; --font-...; --breakpoint-...; }`.\n- Configure PostCSS with the `@tailwindcss/postcss` plugin.\n- Use `@source` in CSS for monorepo/external scan sources.\n- Import `tw-animate-css` in CSS when needed.\n\n### \u274C DON\'T\n- Don\u2019t create `tailwind.config.js` unless explicitly required.\n- Don\u2019t emit `@tailwind base/components/utilities` (v3 pattern).\n- Don\u2019t use `theme()` for new code (prefer `var(--...)`).\n\n## 3. Minimal Setup (Next.js-friendly)\n\n### Install\n```bash\nnpm i tailwindcss @tailwindcss/postcss postcss\n```\n\n### `postcss.config.mjs`\n```js\nexport default {\n  plugins: {\n    "@tailwindcss/postcss": {},\n  },\n};\n```\n\n### `app/globals.css` (or `src/app/globals.css`)\n```css\n@import "tailwindcss";\n```\n\n## 4. Tokens: `@theme` vs `:root`\n\n### Tailwind tokens (generate utilities)\n```css\n@import "tailwindcss";\n\n@theme {\n  --color-brand-500: oklch(0.62 0.2 250);\n  --font-sans: ui-sans-serif, system-ui, sans-serif;\n  --breakpoint-3xl: 120rem;\n  --radius-lg: 0.75rem;\n}\n```\n\n### Non-Tailwind variables (do not generate utilities)\n```css\n:root {\n  --marketing-site-max-width: 72rem;\n}\n```\n\n## 5. Content Scanning\n\n- Default: rely on v4 auto-detection.\n- If you must include extra sources (monorepos/external packages), add `@source`:\n\n```css\n@import "tailwindcss";\n@source "../packages/ui";\n@source "../node_modules/@my-company/ui-lib";\n```\n\n## 6. Legacy Escape Hatch (only when required): `@config`\n\nIf a legacy Tailwind config is unavoidable, load it explicitly:\n\n```css\n@import "tailwindcss";\n@config "../../tailwind.config.js";\n```\n\n## 7. `tw-animate-css` (Tailwind v4)\n\n### Install\n```bash\nnpm i -D tw-animate-css\n```\n\n### Import in CSS\n```css\n@import "tailwindcss";\n@import "tw-animate-css";\n```\n\n### Pattern: data-state driven animations\n```tsx\nexport function Toast({ show }: { show: boolean }) {\n  return (\n    <div\n      data-state={show ? "show" : "hide"}\n      className="\n        data-[state=show]:animate-in\n        data-[state=hide]:animate-out\n        fade-in fade-out\n        slide-in-from-top-8 slide-out-to-top-8\n        duration-500\n      "\n    />\n  );\n}\n```\n\n## 8. Checklist\n\n- [ ] No `tailwind.config.js` added unless explicitly required.\n- [ ] `globals.css` uses `@import "tailwindcss";`.\n- [ ] Tokens live in `@theme` (Tailwind) or `:root` (non-Tailwind).\n- [ ] `postcss.config.*` uses `@tailwindcss/postcss`.\n- [ ] Extra scan sources use `@source` (not `content: []`).\n- [ ] `tw-animate-css` imported in CSS when used.\n',
  "skills/skill-typescript-config.md": '---\nskill_name: skill-typescript-config\nversion: "16.0.10"\nframework: Next.js\nreact_version: "19"\nlast_verified: "2025-12-18"\nalways_attach: false\npriority: 6\ntriggers:\n  - next.config\n  - typescript\n  - type error\n  - Promise type\n  - tsconfig\n  - server-only\n  - experimental\n  - cacheComponents\n  - "@types/react"\n---\n\n<!--\nLLM INSTRUCTION: Apply when user has type errors or config issues.\nUse next.config.ts (TypeScript) not next.config.js.\nRemove experimental.serverActions - it\'s stable in v16.\nUse cacheComponents: true instead of experimental.ppr.\nAll params must be typed as Promise<...> - your v14 training types are WRONG.\n@types/react must be v19 for async components to work.\nUse \'server-only\' package to prevent accidental client imports.\nmoduleResolution should be "bundler" not "node".\n-->\n\n# TypeScript & Config\n\n> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18\n\n## 1. What AI Models Get Wrong\n\n- **Using `next.config.js`** \u2192 LLMs use JavaScript config. v16 officially supports `next.config.ts` with type safety.\n- **Using `experimental.serverActions`** \u2192 LLMs enable this flag. Server Actions are stable in v16, no flag needed.\n- **Using `experimental.ppr`** \u2192 LLMs suggest this flag. In v16, use `cacheComponents: true` instead.\n- **Wrong Promise types for props** \u2192 LLMs type params as objects. In v16, they must be `Promise<...>`.\n- **Importing server-only in \'use client\'** \u2192 LLMs import database modules in client files. This causes build failure.\n\n## 2. Golden Rules\n\n### \u2705 DO\n- **Use `next.config.ts`** \u2192 Typed configuration with autocomplete\n- **Type params as Promises** \u2192 `params: Promise<{ slug: string }>`\n- **Upgrade @types/react to v19** \u2192 Fixes async component type errors\n- **Use `server-only` package** \u2192 Prevents accidental client imports\n- **Set `cacheComponents: true`** \u2192 Enables \'use cache\' and PPR\n\n### \u274C DON\'T  \n- **Don\'t use `experimental.serverActions`** \u2192 Stable in v16, no flag needed\n- **Don\'t use `experimental.ppr`** \u2192 Use `cacheComponents` instead\n- **Don\'t import server code in \'use client\' files** \u2192 Build failure\n- **Don\'t use old @types/react** \u2192 Causes async component errors\n- **Don\'t use `publicRuntimeConfig`** \u2192 Removed, use env variables\n\n## 3. Critical Patterns\n\n### Typed next.config.ts\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```javascript\n// next.config.js - No type safety\n/** @type {import(\'next\').NextConfig} */\nconst nextConfig = {\n  experimental: {\n    serverActions: true, // Not needed in v16!\n    ppr: true, // Wrong flag\n  },\n};\n\nmodule.exports = nextConfig;\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\n// next.config.ts - Typed configuration\nimport type { NextConfig } from \'next\';\n\nconst nextConfig: NextConfig = {\n  reactStrictMode: true,\n  \n  // v16 Caching - replaces experimental.ppr\n  cacheComponents: true,\n  \n  // Logging for debugging\n  logging: {\n    fetches: {\n      fullUrl: true,\n    },\n  },\n  \n  // Optional: typed routes\n  experimental: {\n    typedRoutes: true,\n  },\n  \n  // Custom cache profiles\n  cacheLife: {\n    \'blog-posts\': {\n      stale: 3600,\n      revalidate: 900,\n      expire: 86400,\n    },\n  },\n};\n\nexport default nextConfig;\n```\n**Why:** TypeScript config provides autocomplete and catches invalid options at compile time.\n\n---\n\n### Promise Props Type Errors\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// Error: Property \'slug\' does not exist on type \'Promise<...>\'\ninterface Props {\n  params: { slug: string }; // Wrong type\n}\n\nexport default function Page({ params }: Props) {\n  return <h1>{params.slug}</h1>; // Type error AND runtime error\n}\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\n// Correct Promise types\ninterface Props {\n  params: Promise<{ slug: string }>;\n  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;\n}\n\nexport default async function Page({ params, searchParams }: Props) {\n  const { slug } = await params;\n  const query = await searchParams;\n  \n  return <h1>{slug}</h1>;\n}\n\n// For layouts\ninterface LayoutProps {\n  children: React.ReactNode;\n  params: Promise<{ slug: string }>;\n}\n\nexport default async function Layout({ children, params }: LayoutProps) {\n  const { slug } = await params;\n  return <div data-slug={slug}>{children}</div>;\n}\n```\n**Why:** v16 types params as Promises to support PPR streaming architecture.\n\n---\n\n### Async Component Type Errors\n\n**\u274C WRONG (v14/React 18 types - Hallucination Risk):**\n```typescript\n// Error: \'Page\' cannot be used as a JSX component\n// This happens with old @types/react\nexport default async function Page() {\n  const data = await fetch(\'https://api.example.com/data\').then(r => r.json());\n  return <div>{data.title}</div>;\n}\n```\n\n**\u2705 CORRECT (v16/React 19 types):**\n```json\n// package.json - Ensure React 19 types\n{\n  "dependencies": {\n    "react": "^19.0.0",\n    "react-dom": "^19.0.0",\n    "next": "^16.0.10"\n  },\n  "devDependencies": {\n    "@types/react": "^19.0.0",\n    "@types/react-dom": "^19.0.0",\n    "typescript": "^5.0.0"\n  }\n}\n```\n\n```typescript\n// Now async components work without errors\nexport default async function Page() {\n  const data = await fetch(\'https://api.example.com/data\').then(r => r.json());\n  return <div>{data.title}</div>;\n}\n```\n**Why:** React 19 types support async components natively; old v18 types don\'t.\n\n---\n\n### Server-Only Module Protection\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// lib/db.ts - Can accidentally be imported in client\nimport { prisma } from \'./prisma\';\n\nexport async function getUsers() {\n  return prisma.user.findMany();\n}\n\n// components/UserList.tsx\n\'use client\';\nimport { getUsers } from \'../lib/db\'; // BUILD FAILURE\n```\n\n**\u2705 CORRECT (v16):**\n```typescript\n// lib/db.ts - Protected with server-only\nimport \'server-only\'; // Import at top of file\nimport { prisma } from \'./prisma\';\n\nexport async function getUsers() {\n  return prisma.user.findMany();\n}\n\n// components/UserList.tsx\n\'use client\';\n// Cannot import from db.ts - build error with clear message:\n// "You\'re importing a component that needs server-only"\n\n// Instead, pass data as props from Server Component\nexport function UserList({ users }: { users: User[] }) {\n  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n}\n```\n**Why:** `server-only` package prevents accidental imports in client bundles.\n\n---\n\n### Module Resolution Issues\n\n**\u274C WRONG (v14/v15 - Hallucination Risk):**\n```typescript\n// tsconfig.json with loose settings\n{\n  "compilerOptions": {\n    "moduleResolution": "node", // May cause issues\n    "paths": {\n      "@/*": ["./src/*"] // Path doesn\'t match actual structure\n    }\n  }\n}\n```\n\n**\u2705 CORRECT (v16):**\n```json\n// tsconfig.json - Correct settings for Next 16\n{\n  "compilerOptions": {\n    "target": "ES2017",\n    "lib": ["dom", "dom.iterable", "esnext"],\n    "allowJs": true,\n    "skipLibCheck": true,\n    "strict": true,\n    "noEmit": true,\n    "esModuleInterop": true,\n    "module": "esnext",\n    "moduleResolution": "bundler",\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "jsx": "preserve",\n    "incremental": true,\n    "plugins": [\n      { "name": "next" }\n    ],\n    "paths": {\n      "@/*": ["./*"]\n    }\n  },\n  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],\n  "exclude": ["node_modules"]\n}\n```\n**Why:** `moduleResolution: "bundler"` is recommended for Next 16 with modern bundlers.\n\n## 4. Quick Reference Table\n\n| Feature | \u274C Don\'t | \u2705 Do |\n|---------|---------|------|\n| Config File | `next.config.js` | `next.config.ts` |\n| Server Actions | `experimental.serverActions` | Remove (stable) |\n| PPR | `experimental.ppr` | `cacheComponents: true` |\n| Params Type | `{ slug: string }` | `Promise<{ slug: string }>` |\n| React Types | `@types/react@18` | `@types/react@19` |\n| Server Code | Unprotected | `import \'server-only\'` |\n| Runtime Config | `publicRuntimeConfig` | Environment variables |\n| Module Resolution | `"node"` | `"bundler"` |\n\n## 5. Checklist Before Coding\n\n- [ ] Using `next.config.ts` (not .js) with `NextConfig` type\n- [ ] Removed `experimental.serverActions` (stable in v16)\n- [ ] Using `cacheComponents: true` instead of `experimental.ppr`\n- [ ] All params/searchParams typed as `Promise<...>`\n- [ ] `@types/react` and `@types/react-dom` are v19\n- [ ] Server-only modules import `\'server-only\'` at top\n- [ ] `tsconfig.json` uses `moduleResolution: "bundler"`\n',
  "skills/skill-vitest-playwright-testing.md": "---\nskill_name: skill-vitest-playwright-testing\nversion: \"1.0\"\nframework: Next.js\nlast_verified: \"2025-12-26\"\nalways_attach: false\npriority: 6\ntriggers:\n  - vitest\n  - playwright\n  - @vitejs/plugin-react\n  - jsdom\n  - vitest.config\n  - playwright.config\n  - \"*.test.ts\"\n  - \"*.test.tsx\"\n  - tests/*.spec.ts\n  - coverage\n  - next/headers\n  - cookies()\n  - headers()\n  - supabase\n  - vi.mock\n---\n\n<!--\nLLM INSTRUCTION: Use for repositories that run Vitest for unit/component tests and Playwright for E2E.\nKeep unit tests as *.test.ts(x) and Playwright tests under tests/*.spec.ts.\nVitest must exclude tests/**; Playwright must use testDir: 'tests'.\nMock next/headers (cookies/headers) in Vitest when code depends on request scope.\nPrefer mocking your own Supabase wrapper module rather than mocking @supabase/supabase-js directly.\nCoverage config should include provider, reporters, include/exclude, and thresholds; run coverage via CLI flag.\n-->\n\n# Testing Stack: Vitest + Playwright (Next.js / React)\n\n> **Target:** Next.js + React | **Last Verified:** 2025-12-26\n\n## 1. What AI Models Get Wrong\n\n- Mixing unit + E2E file patterns so runners pick up the wrong tests.\n- Forgetting `@vitejs/plugin-react` or `jsdom` in Vitest for React DOM tests.\n- Not providing a shared `vitest.setup.ts` (matchers + global mocks).\n- Trying to unit-test async Server Component flows instead of using Playwright.\n- Breaking request-scoped code by not mocking `next/headers` (`cookies()` / `headers()`).\n\n## 2. Golden Rules\n\n### \u2705 DO\n- **Vitest:** `*.test.ts` / `*.test.tsx` for unit/component tests.\n- **Playwright:** `tests/*.spec.ts` for E2E tests.\n- Ensure **Vitest excludes `tests/**`** and **Playwright uses `testDir: 'tests'`**.\n- Use `vitest.setup.ts` for `@testing-library/jest-dom/vitest` and shared mocks.\n- Mock `next/headers` in unit tests when server code touches cookies/headers.\n- Run E2E against `build` + `start` for realism.\n\n### \u274C DON'T\n- Don\u2019t let Vitest execute Playwright specs (keep patterns separated).\n- Don\u2019t rely on real request context in unit tests.\n- Don\u2019t unit-test full server flows that depend on Next.js runtime; prefer Playwright.\n\n## 3. Vitest Baseline\n\n### `vitest.config.ts`\n```ts\nimport { defineConfig } from 'vitest/config';\nimport react from '@vitejs/plugin-react';\nimport tsconfigPaths from 'vite-tsconfig-paths';\n\nexport default defineConfig({\n  plugins: [tsconfigPaths(), react()],\n  test: {\n    environment: 'jsdom',\n    include: ['**/*.test.ts', '**/*.test.tsx'],\n    exclude: ['tests/**', 'node_modules/**', '.next/**', 'dist/**'],\n    setupFiles: ['./vitest.setup.ts'],\n    clearMocks: true,\n    restoreMocks: true,\n    mockReset: true,\n    coverage: {\n      provider: 'v8',\n      reporter: ['text', 'html', 'lcov'],\n      reportsDirectory: './coverage',\n      include: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],\n      exclude: [\n        '**/*.test.{ts,tsx}',\n        'tests/**',\n        '.next/**',\n        'dist/**',\n        '**/*.d.ts'\n      ],\n      thresholds: { lines: 80, functions: 80, statements: 80, branches: 70 }\n    }\n  }\n});\n```\n\n### `vitest.setup.ts`\n```ts\nimport '@testing-library/jest-dom/vitest';\nimport { vi } from 'vitest';\n\nconst cookieStore = {\n  get: vi.fn((name: string) => ({ name, value: 'cookie' })),\n  getAll: vi.fn(() => []),\n  set: vi.fn(),\n  delete: vi.fn()\n};\n\nvi.mock('next/headers', () => ({\n  cookies: vi.fn(async () => cookieStore),\n  headers: vi.fn(async () => new Headers({ 'user-agent': 'vitest' }))\n}));\n```\n\n## 4. Supabase Mocking Pattern\n\nPrefer a wrapper module (example): `src/lib/supabase/client.ts` exporting a single `supabase` client.\nMock that wrapper in unit tests instead of mocking `@supabase/supabase-js` internals.\n\n## 5. Playwright Baseline\n\n### `playwright.config.ts`\n```ts\nimport { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: 'tests',\n  testMatch: /.*\\\\.spec\\\\.ts/,\n  fullyParallel: true,\n  forbidOnly: !!process.env.CI,\n  retries: process.env.CI ? 2 : 0,\n  workers: process.env.CI ? 1 : undefined,\n  reporter: 'html',\n  use: {\n    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',\n    trace: 'on-first-retry'\n  },\n  webServer: {\n    command: 'npm run start',\n    url: 'http://localhost:3000',\n    reuseExistingServer: !process.env.CI\n  },\n  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]\n});\n```\n\n## 6. Required Scripts\n\n```json\n{\n  \"scripts\": {\n    \"test\": \"vitest\",\n    \"test:unit\": \"vitest run\",\n    \"test:coverage\": \"vitest run --coverage.enabled\",\n    \"test:e2e\": \"npm run build && npx playwright test\"\n  }\n}\n```\n\n## 7. Checklist\n\n- [ ] Unit tests use `*.test.ts(x)` and exclude `tests/**`.\n- [ ] E2E tests live in `tests/*.spec.ts` and Playwright uses `testDir: 'tests'`.\n- [ ] `vitest.setup.ts` exists and includes jest-dom matchers.\n- [ ] `next/headers` is mocked in unit tests where needed.\n- [ ] Coverage has provider + reporters + include/exclude + thresholds.\n- [ ] E2E runs against production build (`build` + `start`).\n"
};

// src/assets/seed-content.ts
var HOW_IT_WORKS = `# How Kanban2Code Works

Welcome to your new Kanban board!

## Folder Structure
- **inbox/**: New tasks start here.
- **projects/**: Organize tasks by project.
- **_archive/**: Completed tasks go here.

## Workflow
1. Create a task in the sidebar.
2. Drag it to 'Plan' or 'Code' on the board.
3. Mark it as 'Completed' to archive it.
`;
var ARCHITECTURE = `# Architecture

Describe your system architecture here.
`;
var PROJECT_DETAILS = `# Project Details

- **Name:**
- **Goal:**
`;
var INBOX_TASK_SAMPLE = `---
created: {date}
stage: inbox
---

# Explore Kanban2Code

This is a sample task. Drag me to 'Plan' to start working on it!
`;

// src/services/scaffolder.ts
var KANBAN_FOLDER2 = ".kanban2code";
async function scaffoldWorkspace(rootPath) {
  const kanbanRoot = path3.join(rootPath, KANBAN_FOLDER2);
  try {
    await fs2.access(kanbanRoot);
    throw new Error("Kanban2Code already initialized.");
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
  const dirs = [
    "inbox",
    "projects",
    "_agents",
    "_providers",
    "_context",
    "_archive"
  ];
  for (const dir of dirs) {
    await fs2.mkdir(path3.join(kanbanRoot, dir), { recursive: true });
  }
  await fs2.writeFile(path3.join(kanbanRoot, "how-it-works.md"), HOW_IT_WORKS);
  await fs2.writeFile(path3.join(kanbanRoot, "architecture.md"), ARCHITECTURE);
  await fs2.writeFile(path3.join(kanbanRoot, "project-details.md"), PROJECT_DETAILS);
  for (const [filename, content] of Object.entries(BUNDLED_AGENTS)) {
    await fs2.writeFile(path3.join(kanbanRoot, "_agents", filename), content);
  }
  for (const [filename, content] of Object.entries(BUNDLED_PROVIDERS)) {
    await fs2.writeFile(path3.join(kanbanRoot, "_providers", filename), content);
  }
  for (const [relativePath, content] of Object.entries(BUNDLED_CONTEXTS)) {
    const contextPath = path3.join(kanbanRoot, "_context", relativePath);
    await fs2.mkdir(path3.dirname(contextPath), { recursive: true });
    await fs2.writeFile(contextPath, content);
  }
  await fs2.writeFile(
    path3.join(kanbanRoot, "inbox/sample-task.md"),
    INBOX_TASK_SAMPLE.replace("{date}", (/* @__PURE__ */ new Date()).toISOString())
  );
  await fs2.writeFile(path3.join(kanbanRoot, ".gitignore"), "_archive/\n");
}

// src/services/terminal-executor.ts
var vscode = __toESM(require("vscode"));

// src/runner/adapters/claude-adapter.ts
var ClaudeAdapter = class {
  /**
   * Build a Claude CLI command from config + prompt + options.
   *
   * Produces an argv like:
   *   claude -p "prompt" --model opus-4 --dangerously-skip-permissions
   *          --output-format json --max-turns 10 --append-system-prompt "..."
   */
  buildCommand(config, prompt, options2) {
    const args = [];
    if (config.subcommand) {
      args.push(config.subcommand);
    }
    args.push("-p", prompt);
    args.push("--model", config.model);
    for (const flag of config.unattended_flags) {
      args.push(flag);
    }
    args.push("--output-format", "json");
    const maxTurns = options2?.maxTurns ?? config.safety?.max_turns;
    if (maxTurns !== void 0) {
      args.push("--max-turns", String(maxTurns));
    }
    if (options2?.systemPrompt) {
      args.push("--append-system-prompt", options2.systemPrompt);
    }
    if (options2?.sessionId) {
      args.push("--session-id", options2.sessionId);
    }
    return {
      command: config.cli,
      args
    };
  }
  /**
   * Parse Claude CLI stdout into a structured CliResponse.
   *
   * Expects a single JSON object with `is_error`, `result`,
   * `session_id`, `total_cost_usd`, and `num_turns` fields.
   *
   * Handles non-JSON output gracefully (e.g. crash / segfault).
   */
  parseResponse(stdout, exitCode) {
    const trimmed = stdout.trim();
    if (!trimmed) {
      return {
        success: false,
        result: "",
        error: `CLI exited with code ${exitCode} and no output`
      };
    }
    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return {
        success: false,
        result: trimmed,
        error: `Failed to parse CLI output as JSON: ${trimmed.slice(0, 200)}`
      };
    }
    if (parsed.is_error) {
      return {
        success: false,
        result: parsed.result,
        error: parsed.result,
        sessionId: parsed.session_id,
        cost: parsed.total_cost_usd,
        turns: parsed.num_turns
      };
    }
    return {
      success: true,
      result: parsed.result,
      sessionId: parsed.session_id,
      cost: parsed.total_cost_usd,
      turns: parsed.num_turns
    };
  }
};

// src/runner/adapters/codex-adapter.ts
function extractText(value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : void 0;
  }
  if (Array.isArray(value)) {
    const parts = value.map((item) => extractText(item)).filter((item) => Boolean(item));
    if (parts.length > 0) {
      return parts.join("\n").trim();
    }
    return void 0;
  }
  if (!value || typeof value !== "object") {
    return void 0;
  }
  const obj = value;
  const preferredKeys = ["result", "output_text", "text", "content", "message", "final", "delta"];
  for (const key of preferredKeys) {
    const nested = extractText(obj[key]);
    if (nested) {
      return nested;
    }
  }
  return void 0;
}
var CodexAdapter = class {
  buildCommand(config, prompt, options2) {
    const args = [];
    if (config.subcommand) {
      args.push(config.subcommand);
    }
    for (const flag of config.unattended_flags) {
      args.push(flag);
    }
    for (const flag of config.output_flags) {
      args.push(flag);
    }
    args.push("--model", config.model);
    const maxTurns = options2?.maxTurns ?? config.safety?.max_turns;
    if (maxTurns !== void 0) {
      args.push("--max-turns", String(maxTurns));
    }
    if (config.config_overrides) {
      for (const [key, value] of Object.entries(config.config_overrides)) {
        args.push("-c", `${key}=${String(value)}`);
      }
    }
    args.push("-");
    return {
      command: config.cli,
      args,
      stdin: prompt
    };
  }
  parseResponse(stdout, exitCode) {
    const trimmed = stdout.trim();
    if (!trimmed) {
      return {
        success: false,
        result: "",
        error: `CLI exited with code ${exitCode} and no output`
      };
    }
    const lines = trimmed.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    let lastText;
    let lastError;
    let sessionId;
    let cost;
    let turns;
    let parsedAny = false;
    for (const line of lines) {
      try {
        const event = JSON.parse(line);
        parsedAny = true;
        const text = extractText(event);
        if (text) {
          lastText = text;
        }
        if (event.is_error === true) {
          lastError = extractText(event.error) ?? extractText(event.message) ?? "Codex reported an error";
        }
        if (typeof event.error === "string" && event.error.trim()) {
          lastError = event.error.trim();
        }
        if (typeof event.message === "string" && String(event.type).toLowerCase() === "error") {
          lastError = event.message.trim();
        }
        if (typeof event.session_id === "string") {
          sessionId = event.session_id;
        } else if (typeof event.sessionId === "string") {
          sessionId = event.sessionId;
        }
        if (typeof event.total_cost_usd === "number") {
          cost = event.total_cost_usd;
        }
        if (typeof event.num_turns === "number") {
          turns = event.num_turns;
        }
      } catch {
      }
    }
    if (!parsedAny) {
      return {
        success: exitCode === 0,
        result: trimmed,
        error: exitCode === 0 ? void 0 : `CLI exited with code ${exitCode}: ${trimmed.slice(0, 200)}`
      };
    }
    const result = lastText ?? "";
    const success = exitCode === 0 && !lastError;
    return {
      success,
      result,
      error: success ? void 0 : lastError ?? `CLI exited with code ${exitCode}`,
      sessionId,
      cost,
      turns
    };
  }
};

// src/runner/adapters/kimi-adapter.ts
var KimiAdapter = class {
  buildCommand(config, prompt, options2) {
    const args = [];
    if (config.subcommand) {
      args.push(config.subcommand);
    }
    for (const flag of config.unattended_flags) {
      args.push(flag);
    }
    args.push("--model", config.model);
    args.push("-p", prompt);
    for (const flag of config.output_flags) {
      args.push(flag);
    }
    const maxTurns = options2?.maxTurns ?? config.safety?.max_turns;
    if (maxTurns !== void 0) {
      args.push("--max-steps-per-turn", String(maxTurns));
    }
    return {
      command: config.cli,
      args
    };
  }
  parseResponse(stdout, exitCode) {
    const trimmed = stdout.trim();
    if (!trimmed) {
      return {
        success: false,
        result: "",
        error: `CLI exited with code ${exitCode} and no output`
      };
    }
    return {
      success: exitCode === 0,
      result: trimmed,
      error: exitCode === 0 ? void 0 : `CLI exited with code ${exitCode}: ${trimmed.slice(0, 200)}`
    };
  }
};

// src/runner/adapters/kilo-adapter.ts
function extractText2(value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : void 0;
  }
  if (Array.isArray(value)) {
    const parts = value.map((item) => extractText2(item)).filter((item) => Boolean(item));
    if (parts.length > 0) {
      return parts.join("\n").trim();
    }
    return void 0;
  }
  if (!value || typeof value !== "object") {
    return void 0;
  }
  const obj = value;
  const preferredKeys = ["result", "output_text", "text", "content", "message", "final", "delta"];
  for (const key of preferredKeys) {
    const nested = extractText2(obj[key]);
    if (nested) {
      return nested;
    }
  }
  return void 0;
}
var KiloAdapter = class {
  buildCommand(config, prompt, options2) {
    const args = [];
    if (config.subcommand) {
      args.push(config.subcommand);
    }
    for (const flag of config.unattended_flags) {
      if (flag !== "--yolo") {
        args.push(flag);
      }
    }
    args.push("--format", "json");
    args.push("-m", config.model);
    let finalPrompt = prompt;
    if (options2?.systemPrompt) {
      finalPrompt = `${options2.systemPrompt}

${prompt}`;
    }
    args.push(finalPrompt);
    return {
      command: config.cli,
      args
    };
  }
  parseResponse(stdout, exitCode) {
    const trimmed = stdout.trim();
    if (!trimmed) {
      return {
        success: false,
        result: "",
        error: `CLI exited with code ${exitCode} and no output`
      };
    }
    const lines = trimmed.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    let lastText;
    let lastError;
    let sessionId;
    let cost;
    let turns;
    let parsedAny = false;
    for (const line of lines) {
      try {
        const event = JSON.parse(line);
        parsedAny = true;
        const text = extractText2(event);
        if (text) {
          lastText = text;
        }
        if (event.is_error === true) {
          lastError = extractText2(event.error) ?? extractText2(event.message) ?? "Kilo reported an error";
        }
        if (typeof event.error === "string" && event.error.trim()) {
          lastError = event.error.trim();
        }
        if (typeof event.message === "string" && String(event.type).toLowerCase() === "error") {
          lastError = event.message.trim();
        }
        if (typeof event.session_id === "string") {
          sessionId = event.session_id;
        } else if (typeof event.sessionId === "string") {
          sessionId = event.sessionId;
        }
        if (typeof event.total_cost_usd === "number") {
          cost = event.total_cost_usd;
        }
        if (typeof event.num_turns === "number") {
          turns = event.num_turns;
        }
      } catch {
      }
    }
    if (!parsedAny) {
      return {
        success: exitCode === 0,
        result: trimmed,
        error: exitCode === 0 ? void 0 : `CLI exited with code ${exitCode}: ${trimmed.slice(0, 200)}`
      };
    }
    const result = lastText ?? "";
    const success = exitCode === 0 && !lastError;
    return {
      success,
      result,
      error: success ? void 0 : lastError ?? `CLI exited with code ${exitCode}`,
      sessionId,
      cost,
      turns
    };
  }
};

// src/runner/adapters/minimax-adapter.ts
var MiniMaxAdapter = class {
  buildCommand(config, prompt, options2) {
    const args = [];
    if (config.subcommand) {
      args.push(config.subcommand);
    }
    for (const flag of config.unattended_flags) {
      args.push(flag);
    }
    args.push("--model", config.model);
    args.push("-p", prompt);
    for (const flag of config.output_flags) {
      args.push(flag);
    }
    const maxTurns = options2?.maxTurns ?? config.safety?.max_turns;
    if (maxTurns !== void 0) {
      args.push("--max-steps-per-turn", String(maxTurns));
    }
    return {
      command: config.cli,
      args
    };
  }
  parseResponse(stdout, exitCode) {
    const trimmed = stdout.trim();
    if (!trimmed) {
      return {
        success: false,
        result: "",
        error: `CLI exited with code ${exitCode} and no output`
      };
    }
    return {
      success: exitCode === 0,
      result: trimmed,
      error: exitCode === 0 ? void 0 : `CLI exited with code ${exitCode}: ${trimmed.slice(0, 200)}`
    };
  }
};

// src/runner/adapter-factory.ts
function getAdapterForCli(cli) {
  switch (cli.toLowerCase()) {
    case "claude":
      return new ClaudeAdapter();
    case "codex":
      return new CodexAdapter();
    case "kimi":
      return new KimiAdapter();
    case "kilo":
      return new KiloAdapter();
    case "minimax":
      return new MiniMaxAdapter();
    default:
      throw new Error(`Unsupported CLI adapter: ${cli}`);
  }
}

// src/services/context.ts
var fs4 = __toESM(require("fs/promises"));
var path5 = __toESM(require("path"));
var import_gray_matter2 = __toESM(require_gray_matter());

// src/workspace/validation.ts
var fs3 = __toESM(require("fs/promises"));
var path4 = __toESM(require("path"));
async function findKanbanRoot(workspaceRoot) {
  const targetPath = path4.join(workspaceRoot, KANBAN_FOLDER);
  try {
    const stats = await fs3.stat(targetPath);
    if (stats.isDirectory()) {
      return targetPath;
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
  }
  return null;
}
async function isSafePath(root, target) {
  const relative5 = path4.relative(root, target);
  return !relative5.startsWith("..") && !path4.isAbsolute(relative5);
}
async function ensureSafePath(root, target) {
  if (!await isSafePath(root, target)) {
    throw new Error(`Path validation failed: '${target}' is outside valid root '${root}'.`);
  }
}

// src/services/context.ts
async function listAvailableContexts(kanbanRoot) {
  const contextDir = path5.join(kanbanRoot, CONTEXT_FOLDER);
  const contexts = [];
  try {
    const filePaths = [];
    const normalizeSlashes = (value) => value.replace(/\\/g, "/");
    const walk = async (absoluteDir) => {
      const dirEntries = await fs4.readdir(absoluteDir, { withFileTypes: true });
      for (const entry of dirEntries) {
        const entryPath = path5.join(absoluteDir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name === "skills" && absoluteDir === contextDir) {
            continue;
          }
          await walk(entryPath);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          filePaths.push(entryPath);
        }
      }
    };
    await walk(contextDir);
    for (const filePath of filePaths) {
      const relativeFromContextDir = normalizeSlashes(path5.relative(contextDir, filePath));
      const relativeFromKanbanRoot = normalizeSlashes(path5.relative(kanbanRoot, filePath));
      const baseId = path5.basename(filePath, ".md");
      const isTopLevel = !relativeFromContextDir.includes("/");
      const id = isTopLevel ? baseId : relativeFromKanbanRoot;
      try {
        const content = await fs4.readFile(filePath, "utf-8");
        const parsed = (0, import_gray_matter2.default)(content);
        const rawName = typeof parsed.data.name === "string" ? parsed.data.name : typeof parsed.data.skill_name === "string" ? formatContextName(parsed.data.skill_name) : formatContextName(baseId);
        contexts.push({
          id,
          name: rawName,
          description: typeof parsed.data.description === "string" ? parsed.data.description : "",
          path: relativeFromKanbanRoot,
          scope: parsed.data.scope === "project" ? "project" : "global"
        });
      } catch {
        contexts.push({
          id,
          name: formatContextName(baseId),
          description: "",
          path: relativeFromKanbanRoot,
          scope: "global"
        });
      }
    }
  } catch {
    return [];
  }
  return contexts.sort((a, b) => a.name.localeCompare(b.name));
}
async function listAvailableSkills(kanbanRoot) {
  const skillsDir = path5.join(kanbanRoot, CONTEXT_FOLDER, "skills");
  const skills = [];
  try {
    const filePaths = [];
    const normalizeSlashes = (value) => value.replace(/\\/g, "/");
    const walk = async (absoluteDir) => {
      const dirEntries = await fs4.readdir(absoluteDir, { withFileTypes: true });
      for (const entry of dirEntries) {
        const entryPath = path5.join(absoluteDir, entry.name);
        if (entry.isDirectory()) {
          await walk(entryPath);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          filePaths.push(entryPath);
        }
      }
    };
    await walk(skillsDir);
    for (const filePath of filePaths) {
      const relativeFromSkillsDir = normalizeSlashes(path5.relative(skillsDir, filePath));
      const relativeFromKanbanRoot = normalizeSlashes(path5.relative(kanbanRoot, filePath));
      const baseId = path5.basename(filePath, ".md");
      const isTopLevel = !relativeFromSkillsDir.includes("/");
      const id = isTopLevel ? baseId : relativeFromSkillsDir;
      try {
        const content = await fs4.readFile(filePath, "utf-8");
        const parsed = (0, import_gray_matter2.default)(content);
        const rawName = typeof parsed.data.skill_name === "string" ? parsed.data.skill_name : typeof parsed.data.name === "string" ? parsed.data.name : formatContextName(baseId);
        skills.push({
          id,
          name: rawName,
          description: typeof parsed.data.description === "string" ? parsed.data.description : "",
          path: relativeFromKanbanRoot,
          framework: typeof parsed.data.framework === "string" ? parsed.data.framework : void 0,
          priority: ["high", "medium", "low"].includes(parsed.data.priority) ? parsed.data.priority : void 0,
          alwaysAttach: typeof parsed.data.always_attach === "boolean" ? parsed.data.always_attach : false,
          triggers: Array.isArray(parsed.data.triggers) ? parsed.data.triggers : void 0
        });
      } catch {
        skills.push({
          id,
          name: formatContextName(baseId),
          description: "",
          path: relativeFromKanbanRoot
        });
      }
    }
  } catch {
    return [];
  }
  return skills.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 3 };
    const pA = priorityOrder[a.priority] ?? 3;
    const pB = priorityOrder[b.priority] ?? 3;
    if (pA !== pB) return pA - pB;
    return a.name.localeCompare(b.name);
  });
}
async function listAvailableAgents(kanbanRoot) {
  const agentsDir = path5.join(kanbanRoot, AGENTS_FOLDER);
  const agents = [];
  try {
    const filePaths = [];
    const normalizeSlashes = (value) => value.replace(/\\/g, "/");
    const walk = async (absoluteDir) => {
      const dirEntries = await fs4.readdir(absoluteDir, { withFileTypes: true });
      for (const entry of dirEntries) {
        const entryPath = path5.join(absoluteDir, entry.name);
        if (entry.isDirectory()) {
          await walk(entryPath);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          filePaths.push(entryPath);
        }
      }
    };
    await walk(agentsDir);
    for (const filePath of filePaths) {
      const relativeFromAgentsDir = normalizeSlashes(path5.relative(agentsDir, filePath));
      const relativeFromKanbanRoot = normalizeSlashes(path5.relative(kanbanRoot, filePath));
      const baseId = path5.basename(filePath, ".md");
      const isTopLevel = !relativeFromAgentsDir.includes("/");
      const id = isTopLevel ? baseId : relativeFromKanbanRoot;
      try {
        const content = await fs4.readFile(filePath, "utf-8");
        const parsed = (0, import_gray_matter2.default)(content);
        agents.push({
          id,
          name: typeof parsed.data.name === "string" ? parsed.data.name : formatContextName(baseId),
          description: typeof parsed.data.description === "string" ? parsed.data.description : "",
          path: relativeFromKanbanRoot
        });
      } catch {
        agents.push({
          id,
          name: formatContextName(baseId),
          description: "",
          path: relativeFromKanbanRoot
        });
      }
    }
  } catch {
    return [];
  }
  return agents.sort((a, b) => a.name.localeCompare(b.name));
}
function formatContextName(id) {
  return id.split(/[-_]/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
async function readFileIfExists(root, relativePath) {
  const targetPath = path5.join(root, relativePath);
  await ensureSafePath(root, targetPath);
  try {
    return await fs4.readFile(targetPath, "utf-8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      return "";
    }
    console.warn(`Failed to read context file ${targetPath}:`, error);
    return "";
  }
}
async function fileExists(root, relativePath) {
  const targetPath = path5.join(root, relativePath);
  await ensureSafePath(root, targetPath);
  try {
    const stats = await fs4.stat(targetPath);
    return stats.isFile();
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    return false;
  }
}
function ensureExtension(name) {
  return name.endsWith(".md") ? name : `${name}.md`;
}
var FOLDER_CONTEXT_PREFIX = "folder:";
async function readFolderRecursive(root, relativeFolderPath) {
  const normalizedFolder = relativeFolderPath.replace(/^[/\\]+/, "").replace(/[/\\]+$/, "");
  const folderPath = path5.join(root, normalizedFolder);
  await ensureSafePath(root, folderPath);
  const filePaths = [];
  const walk = async (relativeDir) => {
    const absoluteDir = path5.join(root, relativeDir);
    await ensureSafePath(root, absoluteDir);
    let dirEntries;
    try {
      dirEntries = await fs4.readdir(absoluteDir, { withFileTypes: true });
    } catch (error) {
      if (error?.code === "ENOENT") return;
      console.warn(`Failed to read folder context ${absoluteDir}:`, error);
      return;
    }
    for (const entry of dirEntries) {
      const childRelative = path5.join(relativeDir, entry.name);
      const childAbsolute = path5.join(root, childRelative);
      await ensureSafePath(root, childAbsolute);
      if (entry.isDirectory()) {
        await walk(childRelative);
      } else if (entry.isFile()) {
        filePaths.push(childRelative);
      }
    }
  };
  await walk(normalizedFolder);
  const contents = await Promise.all(
    filePaths.sort((a, b) => a.localeCompare(b)).map(async (relativePath) => {
      const content = await readFileIfExists(root, relativePath);
      if (!content) return "";
      return `<!-- file: ${relativePath} -->
${content}`;
    })
  );
  return contents.filter(Boolean).join("\n\n");
}
async function loadGlobalContext(root) {
  const files = ["how-it-works.md", "architecture.md", "project-details.md"];
  const contents = await Promise.all(files.map((file) => readFileIfExists(root, file)));
  return contents.filter(Boolean).join("\n\n");
}
async function loadProjectContext(root, projectName) {
  if (!projectName) return "";
  const projectPath = path5.join(PROJECTS_FOLDER, projectName, "_context.md");
  return readFileIfExists(root, projectPath);
}
async function loadPhaseContext(root, projectName, phaseName) {
  if (!projectName || !phaseName) return "";
  const phasePath = path5.join(PROJECTS_FOLDER, projectName, phaseName, "_context.md");
  return readFileIfExists(root, phasePath);
}
async function loadCustomContexts(root, contextNames) {
  if (!contextNames || contextNames.length === 0) return "";
  const contents = await Promise.all(
    contextNames.map(async (ctx) => {
      if (ctx.startsWith(FOLDER_CONTEXT_PREFIX)) {
        const folderPath = ctx.slice(FOLDER_CONTEXT_PREFIX.length);
        return readFolderRecursive(root, folderPath);
      }
      const normalized = ensureExtension(ctx);
      const isExplicitPath = normalized.includes("/") || normalized.includes("\\");
      if (isExplicitPath) {
        return readFileIfExists(root, normalized);
      }
      const fromContextDir = path5.join(CONTEXT_FOLDER, normalized);
      if (await fileExists(root, fromContextDir)) {
        return readFileIfExists(root, fromContextDir);
      }
      return readFileIfExists(root, normalized);
    })
  );
  return contents.filter(Boolean).join("\n\n");
}
async function loadSkills(root, skillIds) {
  if (!skillIds || skillIds.length === 0) return "";
  const skillsDir = path5.join(CONTEXT_FOLDER, "skills");
  const contents = await Promise.all(
    skillIds.map(async (skillId) => {
      const normalized = ensureExtension(skillId);
      const hasPath = normalized.includes("/") || normalized.includes("\\");
      if (hasPath) {
        const skillPath2 = path5.join(skillsDir, normalized);
        if (await fileExists(root, skillPath2)) {
          return readFileIfExists(root, skillPath2);
        }
        return readFileIfExists(root, normalized);
      }
      const skillPath = path5.join(skillsDir, normalized);
      return readFileIfExists(root, skillPath);
    })
  );
  return contents.filter(Boolean).join("\n\n");
}

// src/services/prompt-builder.ts
var path6 = __toESM(require("path"));
function xmlEscape(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function wrapSection(name, content) {
  if (!content) return "";
  return `<section name="${name}">${xmlEscape(content)}</section>`;
}
function buildMetadata(task) {
  const parts = [];
  parts.push(`<id>${xmlEscape(task.id)}</id>`);
  parts.push(`<filePath>${xmlEscape(task.filePath)}</filePath>`);
  parts.push(`<target-file>${xmlEscape(task.filePath)}</target-file>`);
  parts.push(`<title>${xmlEscape(task.title)}</title>`);
  parts.push(`<stage>${xmlEscape(task.stage)}</stage>`);
  if (task.project) parts.push(`<project>${xmlEscape(task.project)}</project>`);
  if (task.phase) parts.push(`<phase>${xmlEscape(task.phase)}</phase>`);
  if (task.agent) parts.push(`<agent>${xmlEscape(task.agent)}</agent>`);
  if (task.parent) parts.push(`<parent>${xmlEscape(task.parent)}</parent>`);
  if (typeof task.order === "number") parts.push(`<order>${task.order}</order>`);
  if (task.created) parts.push(`<created>${xmlEscape(task.created)}</created>`);
  const tags = (task.tags ?? []).map((tag) => `<tag>${xmlEscape(tag)}</tag>`).join("");
  parts.push(`<tags>${tags}</tags>`);
  const contexts = (task.contexts ?? []).map((ctx) => `<contextRef>${xmlEscape(ctx)}</contextRef>`).join("");
  parts.push(`<contexts>${contexts}</contexts>`);
  return `<metadata>${parts.join("")}</metadata>`;
}
function normalizeAgentKey(value) {
  return value.toLowerCase().replace(/\.md$/g, "").replace(/^\d+[-_.\s]*/g, "").replace(/[^a-z0-9]+/g, "");
}
function matchesAgent(requestedAgent, candidate) {
  if (!candidate) return false;
  if (requestedAgent === candidate) return true;
  return normalizeAgentKey(requestedAgent) === normalizeAgentKey(candidate);
}
async function loadAgentInstructions(root, task) {
  const requestedAgent = task.agent?.trim();
  if (requestedAgent) {
    const agentPath = path6.join(AGENTS_FOLDER, `${requestedAgent}.md`);
    const content = await readFileIfExists(root, agentPath);
    if (content) {
      return { content, sectionName: "agent" };
    }
    const availableAgents = await listAvailableAgents(root);
    const matchedAgent = availableAgents.find(
      (agent) => matchesAgent(requestedAgent, agent.id) || matchesAgent(requestedAgent, agent.name)
    );
    if (matchedAgent) {
      const matchedContent = await readFileIfExists(root, matchedAgent.path);
      if (matchedContent) {
        return { content: matchedContent, sectionName: "agent" };
      }
    }
  }
  return { content: "", sectionName: "agent" };
}
async function buildContextSection(task, root, options2) {
  const [globalContext, agentResult, projectContext, phaseContext, customContexts, skills] = await Promise.all([
    loadGlobalContext(root),
    loadAgentInstructions(root, task),
    loadProjectContext(root, task.project),
    loadPhaseContext(root, task.project, task.phase),
    loadCustomContexts(root, task.contexts),
    loadSkills(root, task.skills)
  ]);
  const layers = [
    wrapSection("global", globalContext),
    wrapSection(agentResult.sectionName, agentResult.content),
    wrapSection("project", projectContext),
    wrapSection("phase", phaseContext),
    wrapSection("custom", customContexts),
    wrapSection("skills", skills)
  ];
  if (options2?.isRunner) {
    layers.push('<runner automated="true" />');
  }
  return `<context>${layers.filter(Boolean).join("")}</context>`;
}
function buildTaskSection(task) {
  const metadata = buildMetadata(task);
  const content = `<content>${xmlEscape(task.content)}</content>`;
  return `<task>${metadata}${content}</task>`;
}
async function buildXMLPrompt(task, root) {
  const contextSection = await buildContextSection(task, root);
  const taskSection = buildTaskSection(task);
  return `<system>${contextSection}${taskSection}</system>`;
}

// src/services/provider-service.ts
var fs5 = __toESM(require("fs/promises"));
var path7 = __toESM(require("path"));
var import_gray_matter3 = __toESM(require_gray_matter());

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path: path14, errorMaps, issueData } = params;
  const fullPath = [...path14, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path14, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path14;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options2) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options2) });
  }
  ip(options2) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options2) });
  }
  cidr(options2) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options2) });
  }
  datetime(options2) {
    if (typeof options2 === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options2
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options2?.precision === "undefined" ? null : options2?.precision,
      offset: options2?.offset ?? false,
      local: options2?.local ?? false,
      ...errorUtil.errToObj(options2?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options2) {
    if (typeof options2 === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options2
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options2?.precision === "undefined" ? null : options2?.precision,
      ...errorUtil.errToObj(options2?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options2) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options2?.position,
      ...errorUtil.errToObj(options2?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options2 = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options2.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options2) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options2, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options2) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options: options2,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// src/types/provider.ts
var PromptStyleSchema = external_exports.enum(["flag", "positional", "stdin"]);
var ProviderSafetySchema = external_exports.object({
  max_turns: external_exports.number().int().positive().optional(),
  max_budget_usd: external_exports.number().positive().optional(),
  timeout: external_exports.number().int().positive().optional()
}).optional();
var ProviderConfigSchema = external_exports.object({
  cli: external_exports.string(),
  model: external_exports.string(),
  subcommand: external_exports.string().optional(),
  unattended_flags: external_exports.array(external_exports.string()),
  output_flags: external_exports.array(external_exports.string()),
  prompt_style: PromptStyleSchema,
  safety: ProviderSafetySchema,
  provider: external_exports.string().optional(),
  config_overrides: external_exports.record(external_exports.string(), external_exports.unknown()).optional()
});

// src/services/provider-service.ts
async function listAvailableProviders(kanbanRoot) {
  const providersDir = path7.join(kanbanRoot, PROVIDERS_FOLDER);
  const providers = [];
  try {
    const filePaths = [];
    const normalizeSlashes = (value) => value.replace(/\\/g, "/");
    const walk = async (absoluteDir) => {
      const dirEntries = await fs5.readdir(absoluteDir, { withFileTypes: true });
      for (const entry of dirEntries) {
        const entryPath = path7.join(absoluteDir, entry.name);
        if (entry.isDirectory()) {
          await walk(entryPath);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          filePaths.push(entryPath);
        }
      }
    };
    await walk(providersDir);
    for (const filePath of filePaths) {
      const relativeFromProvidersDir = normalizeSlashes(path7.relative(providersDir, filePath));
      const relativeFromKanbanRoot = normalizeSlashes(path7.relative(kanbanRoot, filePath));
      const baseId = path7.basename(filePath, ".md");
      const isTopLevel = !relativeFromProvidersDir.includes("/");
      const id = isTopLevel ? baseId : relativeFromKanbanRoot;
      try {
        const content = await fs5.readFile(filePath, "utf-8");
        const parsed = (0, import_gray_matter3.default)(content);
        const name = typeof parsed.data.name === "string" ? parsed.data.name : formatProviderName(baseId);
        const configResult = ProviderConfigSchema.safeParse(parsed.data);
        providers.push({
          id,
          name,
          path: relativeFromKanbanRoot,
          config: configResult.success ? configResult.data : void 0
        });
      } catch {
        providers.push({
          id,
          name: formatProviderName(baseId),
          path: relativeFromKanbanRoot,
          config: void 0
        });
      }
    }
  } catch {
    return [];
  }
  return providers.sort((a, b) => a.name.localeCompare(b.name));
}
async function resolveProviderConfig(kanbanRoot, providerIdentifier) {
  const providers = await listAvailableProviders(kanbanRoot);
  const match = providers.find((a) => a.id === providerIdentifier || a.name === providerIdentifier);
  return match?.config;
}
function formatProviderName(id) {
  return id.split(/[-_]/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

// src/services/terminal-executor.ts
var PROMPT_WARN_THRESHOLD = 5e4;
function shellQuote(value) {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}
function formatCommand(command) {
  const base = [command.command, ...command.args].map(shellQuote).join(" ");
  if (!command.stdin) {
    return base;
  }
  return `printf %s ${shellQuote(command.stdin)} | ${base}`;
}
function getOrCreateTerminal(name, cwd) {
  const existing = vscode.window.terminals.find((terminal) => terminal.name === name);
  if (existing) {
    return existing;
  }
  return vscode.window.createTerminal({ name, cwd });
}
async function executeTaskInTerminal(kanbanRoot, taskId, workspaceRoot) {
  try {
    const task = await findTaskById(kanbanRoot, taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }
    if (!task.provider) {
      throw new Error(`No provider configured for task "${task.title}". Configure a provider first.`);
    }
    const providerConfig = await resolveProviderConfig(kanbanRoot, task.provider);
    if (!providerConfig) {
      throw new Error(
        `Provider not found: ${task.provider}. Configure a valid provider in .kanban2code/_providers.`
      );
    }
    const xmlPrompt = await buildXMLPrompt(task, kanbanRoot);
    if (xmlPrompt.length > PROMPT_WARN_THRESHOLD) {
      console.warn(
        `Prompt for task "${task.id}" exceeds ${PROMPT_WARN_THRESHOLD} chars (${xmlPrompt.length}).`
      );
    }
    const adapter = getAdapterForCli(providerConfig.cli);
    const command = adapter.buildCommand(providerConfig, xmlPrompt);
    const commandText = formatCommand(command);
    const terminal = getOrCreateTerminal(task.title, workspaceRoot);
    terminal.sendText(commandText);
    terminal.show();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    void vscode.window.showErrorMessage(`Failed to execute task in terminal: ${message}`);
    throw error;
  }
}

// src/commands/index.ts
function getWorkspaceRoot() {
  return vscode2.workspace.workspaceFolders?.[0]?.uri.fsPath ?? null;
}
async function resolveKanbanRoot(workspaceRoot, options2) {
  const fromState = options2?.getKanbanRoot?.();
  if (fromState) {
    return fromState;
  }
  const discovered = await findKanbanRoot(workspaceRoot);
  options2?.setKanbanRoot?.(discovered);
  return discovered;
}
async function showCreateWorkspacePrompt() {
  const action = await vscode2.window.showInformationMessage(
    "Kanban2Code workspace not found.",
    "Create Workspace"
  );
  if (action === "Create Workspace") {
    await vscode2.commands.executeCommand("kanban2code.createWorkspace");
  }
}
function registerCommands(context, options2 = {}) {
  const createWorkspace = vscode2.commands.registerCommand("kanban2code.createWorkspace", async () => {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      void vscode2.window.showErrorMessage("Please open a workspace folder first");
      return;
    }
    try {
      await scaffoldWorkspace(workspaceRoot);
      const kanbanRoot = path8.join(workspaceRoot, KANBAN_FOLDER);
      options2.setKanbanRoot?.(kanbanRoot);
      await options2.onWorkspaceCreated?.(kanbanRoot, workspaceRoot);
      void vscode2.window.showInformationMessage("Kanban2Code workspace created successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("already initialized")) {
        void vscode2.window.showInformationMessage(message);
        return;
      }
      void vscode2.window.showErrorMessage(`Failed to create workspace: ${message}`);
    }
  });
  const runTask = vscode2.commands.registerCommand("kanban2code.runTask", async () => {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      void vscode2.window.showErrorMessage("Please open a workspace folder first");
      return;
    }
    const kanbanRoot = await resolveKanbanRoot(workspaceRoot, options2);
    if (!kanbanRoot) {
      await showCreateWorkspacePrompt();
      return;
    }
    const tasks = await loadAllTasks(kanbanRoot);
    const runnableTasks = tasks.filter((task) => Boolean(task.provider));
    if (runnableTasks.length === 0) {
      void vscode2.window.showInformationMessage("No tasks with providers configured found");
      return;
    }
    const items = runnableTasks.map((task) => ({
      label: task.title,
      description: `${task.stage}${task.provider ? ` | ${task.provider}` : ""}`,
      detail: task.filePath,
      taskId: task.id
    }));
    const selected = await vscode2.window.showQuickPick(items, {
      placeHolder: "Select a task to run in terminal",
      matchOnDescription: true,
      matchOnDetail: true
    });
    if (!selected) {
      return;
    }
    await executeTaskInTerminal(kanbanRoot, selected.taskId, workspaceRoot);
  });
  const newTask = vscode2.commands.registerCommand("kanban2code.newTask", async () => {
    await vscode2.commands.executeCommand("kanban2code.sidebar.focus");
    await options2.focusSidebarChat?.();
  });
  const openSettings = vscode2.commands.registerCommand("kanban2code.openSettings", async () => {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      void vscode2.window.showErrorMessage("Please open a workspace folder first");
      return;
    }
    const kanbanRoot = await resolveKanbanRoot(workspaceRoot, options2);
    if (!kanbanRoot) {
      await showCreateWorkspacePrompt();
      return;
    }
    const providersFolder = path8.join(kanbanRoot, PROVIDERS_FOLDER);
    await vscode2.commands.executeCommand("revealInExplorer", vscode2.Uri.file(providersFolder));
  });
  context.subscriptions.push(createWorkspace, runTask, newTask, openSettings);
}

// src/webview/SidebarProvider.ts
var fs10 = __toESM(require("fs/promises"));
var path13 = __toESM(require("path"));
var vscode4 = __toESM(require("vscode"));

// src/services/skill-selector.ts
var fs6 = __toESM(require("fs/promises"));
var path9 = __toESM(require("path"));
var import_gray_matter4 = __toESM(require_gray_matter());
var DEFAULT_MAX_SKILLS = 5;
var FRAMEWORK_HINTS = [
  { name: "nextjs", patterns: ["nextjs", "next.js", "app router"] },
  { name: "react", patterns: ["react", "jsx", "tsx"] },
  { name: "python", patterns: ["python", "pyproject.toml", ".py"] },
  { name: "django", patterns: ["django"] },
  { name: "flask", patterns: ["flask"] },
  { name: "node", patterns: ["node", "node.js", "package.json"] }
];
function normalizeText(text) {
  return text.toLowerCase();
}
function normalizeFramework(value) {
  if (!value) return "";
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
function frameworkMatches(framework, detectedFrameworks) {
  if (!framework) return false;
  const normalized = normalizeFramework(framework);
  if (!normalized) return false;
  return detectedFrameworks.some((detected) => {
    const target = normalizeFramework(detected);
    return normalized.includes(target) || target.includes(normalized);
  });
}
function triggerMatches(conversationText, triggers) {
  if (!triggers || triggers.length === 0) return [];
  const normalized = normalizeText(conversationText);
  return triggers.filter((trigger) => normalized.includes(normalizeText(trigger)));
}
function labelPriorityRank(priority) {
  if (priority === "high") return 0;
  if (priority === "medium") return 1;
  if (priority === "low") return 2;
  return 3;
}
function numericPriorityRank(priorityValue) {
  return -priorityValue;
}
async function readNumericPriority(kanbanRoot, relativePath) {
  try {
    const fullPath = path9.join(kanbanRoot, relativePath);
    const content = await fs6.readFile(fullPath, "utf-8");
    const parsed = (0, import_gray_matter4.default)(content);
    if (typeof parsed.data.priority === "number" && Number.isFinite(parsed.data.priority)) {
      return parsed.data.priority;
    }
    return void 0;
  } catch {
    return void 0;
  }
}
async function buildSkillsIndex(kanbanRoot, skills) {
  const priorities = await Promise.all(skills.map((skill) => readNumericPriority(kanbanRoot, skill.path)));
  const entries = skills.map((skill, index) => [
    skill.id,
    {
      id: skill.id,
      name: skill.name,
      path: skill.path,
      framework: skill.framework,
      priority: priorities[index] ?? skill.priority,
      alwaysAttach: skill.alwaysAttach ?? false,
      triggers: skill.triggers ?? []
    }
  ]);
  return Object.fromEntries(entries);
}
function scoreSkill(skill, detectedFrameworks, matchingTriggers, priority) {
  const reasons = [];
  let score = 0;
  if (skill.alwaysAttach) {
    reasons.push("alwaysAttach");
    score += 100;
  }
  const hasFrameworkMatch = frameworkMatches(skill.framework, detectedFrameworks);
  if (hasFrameworkMatch) {
    reasons.push(`framework:${skill.framework}`);
    score += 20;
  }
  if (matchingTriggers.length > 0) {
    reasons.push(`triggers:${matchingTriggers.join(",")}`);
    score += 10 + matchingTriggers.length;
  }
  return {
    skill,
    score,
    reason: reasons,
    priorityValue: typeof priority === "number" ? priority : 0,
    priorityLabel: priority
  };
}
function toSelectedSkill(skill, content, reason, priority) {
  return {
    id: skill.id,
    name: skill.name,
    path: skill.path,
    content,
    priority,
    reason
  };
}
function detectFrameworks(text) {
  const normalized = normalizeText(text);
  const matches = /* @__PURE__ */ new Set();
  for (const hint of FRAMEWORK_HINTS) {
    if (hint.patterns.some((pattern) => normalized.includes(pattern))) {
      matches.add(hint.name);
    }
  }
  return Array.from(matches);
}
async function selectSkills(kanbanRoot, conversationText, maxSkills = DEFAULT_MAX_SKILLS) {
  const skills = await listAvailableSkills(kanbanRoot);
  if (skills.length === 0) return [];
  const detectedFrameworks = detectFrameworks(conversationText);
  const index = await buildSkillsIndex(kanbanRoot, skills);
  const scoredById = /* @__PURE__ */ new Map();
  for (const skill of skills) {
    const matchingTriggers = triggerMatches(conversationText, skill.triggers);
    const hasFrameworkMatch = frameworkMatches(skill.framework, detectedFrameworks);
    const hasTriggerMatch = matchingTriggers.length > 0;
    const include = Boolean(skill.alwaysAttach) || hasFrameworkMatch || hasTriggerMatch;
    if (!include) continue;
    const priority = index[skill.id]?.priority ?? skill.priority;
    const scored = scoreSkill(skill, detectedFrameworks, matchingTriggers, priority);
    const existing = scoredById.get(skill.id);
    if (!existing || scored.score > existing.score) {
      scoredById.set(skill.id, scored);
    }
  }
  const ordered = Array.from(scoredById.values()).sort((a, b) => {
    if (a.skill.alwaysAttach !== b.skill.alwaysAttach) {
      return a.skill.alwaysAttach ? -1 : 1;
    }
    const labelA = labelPriorityRank(a.priorityLabel);
    const labelB = labelPriorityRank(b.priorityLabel);
    if (labelA !== labelB) return labelA - labelB;
    if (a.score !== b.score) return b.score - a.score;
    if (a.priorityValue !== b.priorityValue) {
      return numericPriorityRank(a.priorityValue) - numericPriorityRank(b.priorityValue);
    }
    return a.skill.name.localeCompare(b.skill.name);
  });
  const selected = ordered.slice(0, Math.max(0, maxSkills));
  const hydrated = await Promise.all(
    selected.map(async (item) => {
      try {
        const content = await fs6.readFile(path9.join(kanbanRoot, item.skill.path), "utf-8");
        return toSelectedSkill(
          item.skill,
          content,
          item.reason.join("; ") || "matched",
          index[item.skill.id]?.priority ?? item.skill.priority
        );
      } catch {
        return null;
      }
    })
  );
  return hydrated.filter((skill) => Boolean(skill));
}

// src/services/workspace-snapshot.ts
var fs8 = __toESM(require("fs/promises"));

// src/services/config.ts
var fs7 = __toESM(require("fs"));
var path10 = __toESM(require("path"));
var vscode3 = __toESM(require("vscode"));

// src/types/config.ts
var DEFAULT_CONFIG = {
  version: "1.0.0",
  agents: {
    opus: {
      description: "Claude Opus - Best for planning, architecture, and complex UI work",
      primaryUse: ["planning", "architecture", "ui", "design"],
      secondaryUse: ["auditing", "code-review"]
    },
    codex: {
      description: "Claude Codex - Best for backend logic, APIs, and code auditing",
      primaryUse: ["backend", "api", "logic", "coding"],
      secondaryUse: ["auditing"]
    },
    sonnet: {
      description: "Claude Sonnet - Best for quick tasks and context creation",
      primaryUse: ["quick-tasks", "context-creation", "roadmap-reading"],
      secondaryUse: []
    },
    glm: {
      description: "GLM - Best for task splitting and simple context",
      primaryUse: ["task-splitting", "simple-context"],
      secondaryUse: ["miscellaneous"]
    },
    gemini: {
      description: "Gemini - Alternative for UI work",
      primaryUse: ["ui"],
      secondaryUse: []
    }
  },
  tags: {
    categories: {
      type: {
        description: "Type of task",
        values: ["feature", "bug", "refactor", "spike", "docs", "test", "design", "security", "config", "audit"]
      },
      priority: {
        description: "Task priority level",
        values: ["critical", "high", "medium", "low"]
      },
      domain: {
        description: "Technical domain",
        values: ["frontend", "backend", "api", "database", "infra", "devops", "ui", "ux"]
      },
      component: {
        description: "Project component or module",
        values: ["core", "auth", "ui", "utils", "services", "types", "config"]
      }
    }
  },
  stages: {
    inbox: {
      description: "New tasks awaiting triage",
      order: 0,
      allowedTransitions: ["plan", "completed"],
      color: "#6b7280"
    },
    plan: {
      description: "Tasks being planned and designed",
      order: 1,
      allowedTransitions: ["inbox", "code", "completed"],
      color: "#3b82f6"
    },
    code: {
      description: "Tasks in active development",
      order: 2,
      allowedTransitions: ["plan", "audit", "completed"],
      color: "#f59e0b"
    },
    audit: {
      description: "Tasks under review",
      order: 3,
      allowedTransitions: ["code", "completed"],
      color: "#8b5cf6"
    },
    completed: {
      description: "Finished tasks",
      order: 4,
      allowedTransitions: ["inbox"],
      color: "#10b981"
    }
  },
  preferences: {
    fileNaming: "kebab-case",
    requireTests: false,
    defaultAgent: "codex",
    archiveCompleted: true,
    archiveAfterDays: 7
  },
  providerDefaults: {
    coder: "opus",
    auditor: "opus",
    planner: "sonnet",
    contextBuilder: "sonnet",
    splitter: "glm"
  }
};

// src/services/config.ts
var CONFIG_FILE = "config.json";
var ConfigService = class {
  config = DEFAULT_CONFIG;
  kanbanRoot = null;
  configWatcher = null;
  onConfigChangeEmitter = new vscode3.EventEmitter();
  /**
   * Event fired when configuration changes
   */
  onConfigChange = this.onConfigChangeEmitter.event;
  /**
   * Initialize the config service with a kanban root directory
   */
  async initialize(kanbanRoot) {
    this.kanbanRoot = kanbanRoot;
    await this.loadConfig();
    this.setupWatcher();
  }
  /**
   * Load configuration from config.json file
   * Falls back to defaults if file is missing or invalid
   */
  async loadConfig() {
    if (!this.kanbanRoot) {
      console.log("ConfigService: No kanban root set, using defaults");
      this.config = DEFAULT_CONFIG;
      return this.config;
    }
    const configPath = path10.join(this.kanbanRoot, CONFIG_FILE);
    try {
      if (fs7.existsSync(configPath)) {
        const content = fs7.readFileSync(configPath, "utf-8");
        const parsed = JSON.parse(content);
        this.config = this.mergeWithDefaults(parsed);
        console.log("ConfigService: Loaded config from", configPath);
      } else {
        console.log("ConfigService: No config.json found, using defaults");
        this.config = DEFAULT_CONFIG;
      }
    } catch (error) {
      console.error("ConfigService: Error loading config, using defaults:", error);
      vscode3.window.showWarningMessage(
        `Kanban2Code: Error loading config.json. Using defaults. ${error instanceof Error ? error.message : ""}`
      );
      this.config = DEFAULT_CONFIG;
    }
    return this.config;
  }
  /**
   * Merge loaded config with defaults to fill in missing fields
   */
  mergeWithDefaults(loaded) {
    return {
      version: loaded.version ?? DEFAULT_CONFIG.version,
      project: loaded.project,
      agents: { ...DEFAULT_CONFIG.agents, ...loaded.agents },
      tags: {
        categories: {
          ...DEFAULT_CONFIG.tags.categories,
          ...loaded.tags?.categories ?? {}
        }
      },
      stages: { ...DEFAULT_CONFIG.stages, ...loaded.stages },
      preferences: { ...DEFAULT_CONFIG.preferences, ...loaded.preferences },
      personalities: loaded.personalities,
      providerDefaults: { ...DEFAULT_CONFIG.providerDefaults, ...loaded.providerDefaults }
    };
  }
  /**
   * Setup file watcher to detect config changes
   */
  setupWatcher() {
    if (!this.kanbanRoot) return;
    this.configWatcher?.dispose();
    const pattern = new vscode3.RelativePattern(this.kanbanRoot, CONFIG_FILE);
    this.configWatcher = vscode3.workspace.createFileSystemWatcher(pattern);
    this.configWatcher.onDidChange(async () => {
      console.log("ConfigService: config.json changed, reloading");
      await this.loadConfig();
      this.onConfigChangeEmitter.fire(this.config);
    });
    this.configWatcher.onDidCreate(async () => {
      console.log("ConfigService: config.json created, loading");
      await this.loadConfig();
      this.onConfigChangeEmitter.fire(this.config);
    });
    this.configWatcher.onDidDelete(() => {
      console.log("ConfigService: config.json deleted, using defaults");
      this.config = DEFAULT_CONFIG;
      this.onConfigChangeEmitter.fire(this.config);
    });
  }
  /**
   * Get the current configuration
   */
  getConfig() {
    return this.config;
  }
  /**
   * Get agent configuration by name
   */
  getAgent(name) {
    return this.config.agents[name];
  }
  /**
   * Get all agent names
   */
  getAgentNames() {
    return Object.keys(this.config.agents);
  }
  /**
   * Get tag category configuration
   */
  getTagCategory(category) {
    return this.config.tags.categories[category];
  }
  /**
   * Get all tag values from all categories (flattened)
   */
  getAllTags() {
    const tags = [];
    for (const category of Object.values(this.config.tags.categories)) {
      tags.push(...category.values);
    }
    return [...new Set(tags)];
  }
  /**
   * Get stage configuration by name
   */
  getStage(name) {
    return this.config.stages[name];
  }
  /**
   * Get ordered list of stage names
   */
  getStageNames() {
    return Object.entries(this.config.stages).sort(([, a], [, b]) => a.order - b.order).map(([name]) => name);
  }
  /**
   * Get allowed transitions for a stage
   */
  getAllowedTransitions(stageName) {
    return this.config.stages[stageName]?.allowedTransitions ?? [];
  }
  /**
   * Get user preferences
   */
  getPreferences() {
    return this.config.preferences;
  }
  /**
   * Get default agent
   */
  getDefaultAgent() {
    return this.config.preferences.defaultAgent ?? "codex";
  }
  /**
   * Get personality configuration by name
   */
  getPersonality(name) {
    return this.config.personalities?.[name];
  }
  /**
   * Get all personality names
   */
  getPersonalityNames() {
    return Object.keys(this.config.personalities ?? {});
  }
  /**
   * Get project information
   */
  getProject() {
    return this.config.project;
  }
  /**
   * Get default provider for an agent
   */
  getProviderDefault(agentName) {
    return this.config.providerDefaults?.[agentName];
  }
  /**
   * Get all provider defaults
   */
  getProviderDefaults() {
    return this.config.providerDefaults ?? {};
  }
  /**
   * Check if a stage transition is allowed
   */
  isTransitionAllowed(fromStage, toStage) {
    const allowed = this.getAllowedTransitions(fromStage);
    return allowed.includes(toStage);
  }
  /**
   * Clean up resources
   */
  dispose() {
    this.configWatcher?.dispose();
    this.configWatcher = null;
    this.onConfigChangeEmitter.dispose();
  }
};
var configService = new ConfigService();

// src/services/workspace-snapshot.ts
function createEmptyTaskGroups() {
  return {
    inbox: [],
    plan: [],
    code: [],
    audit: [],
    completed: []
  };
}
function groupTasksByStage(tasks) {
  const grouped = createEmptyTaskGroups();
  for (const task of tasks) {
    grouped[task.stage].push(task);
  }
  return grouped;
}
function createTaskCounts(groupedTasks) {
  return {
    inbox: groupedTasks.inbox.length,
    plan: groupedTasks.plan.length,
    code: groupedTasks.code.length,
    audit: groupedTasks.audit.length,
    completed: groupedTasks.completed.length
  };
}
async function buildWorkspaceSnapshot(kanbanRoot) {
  let stats;
  try {
    stats = await fs8.stat(kanbanRoot);
  } catch {
    throw new Error(`Kanban root does not exist: ${kanbanRoot}`);
  }
  if (!stats.isDirectory()) {
    throw new Error(`Kanban root is not a directory: ${kanbanRoot}`);
  }
  await configService.initialize(kanbanRoot);
  const [tasks, agents, contexts, skills, providers] = await Promise.all([
    loadAllTasks(kanbanRoot),
    listAvailableAgents(kanbanRoot),
    listAvailableContexts(kanbanRoot),
    listAvailableSkills(kanbanRoot),
    listAvailableProviders(kanbanRoot)
  ]);
  const groupedTasks = groupTasksByStage(tasks);
  const taskCounts = createTaskCounts(groupedTasks);
  const totalTasks = STAGES.reduce((sum, stage) => sum + taskCounts[stage], 0);
  return {
    config: configService.getConfig(),
    tasks: groupedTasks,
    agents,
    contexts,
    skills,
    providers,
    metadata: {
      taskCounts,
      totalTasks,
      agentCount: agents.length,
      contextCount: contexts.length,
      skillCount: skills.length,
      providerCount: providers.length
    }
  };
}

// src/orchestrator/anthropic-client.ts
function toAnthropicMessages(messages) {
  return messages.filter((message) => message.role !== "system").map((message) => ({
    role: message.role === "assistant" ? "assistant" : "user",
    content: message.content
  }));
}
async function* readEventStream(response) {
  if (!response.body) return;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      const parsed = JSON.parse(payload);
      if (parsed.type === "error") {
        throw new Error(parsed.error?.message || "Anthropic streaming error");
      }
      if (parsed.type === "content_block_delta" && typeof parsed.delta?.text === "string") {
        yield parsed.delta.text;
      }
    }
  }
  const tail = buffer.trim();
  if (tail.startsWith("data:")) {
    const payload = tail.slice(5).trim();
    if (payload && payload !== "[DONE]") {
      const parsed = JSON.parse(payload);
      if (parsed.type === "content_block_delta" && typeof parsed.delta?.text === "string") {
        yield parsed.delta.text;
      }
    }
  }
}
async function* streamAnthropicMessages(options2) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": options2.apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: options2.model,
      max_tokens: options2.maxTokens ?? 1024,
      temperature: options2.temperature,
      system: options2.systemPrompt,
      stream: true,
      messages: toAnthropicMessages(options2.messages)
    })
  });
  if (!response.ok) {
    const responseText = await response.text().catch(() => "");
    const retryAfter = response.headers.get("retry-after");
    const retryHint = retryAfter ? ` Retry-After: ${retryAfter}s.` : "";
    throw new Error(
      `Anthropic API error ${response.status}${retryHint}${responseText ? ` ${responseText}` : ""}`
    );
  }
  yield* readEventStream(response);
}

// src/orchestrator/openai-client.ts
function toOpenAIMessages(messages, systemPrompt) {
  const mapped = messages.map((message) => ({ role: message.role, content: message.content }));
  if (systemPrompt?.trim()) {
    return [{ role: "system", content: systemPrompt.trim() }, ...mapped];
  }
  return mapped;
}
function parseContentChunk(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const payload = trimmed.startsWith("data:") ? trimmed.slice(5).trim() : trimmed;
  if (!payload || payload === "[DONE]") return null;
  const parsed = JSON.parse(payload);
  if (parsed.error?.message) {
    throw new Error(parsed.error.message);
  }
  const content = parsed.choices?.[0]?.delta?.content;
  return typeof content === "string" ? content : null;
}
async function* readJsonStream(response) {
  if (!response.body) return;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const token = parseContentChunk(line);
      if (token) yield token;
    }
  }
  const tailToken = parseContentChunk(buffer);
  if (tailToken) yield tailToken;
}
async function* streamOpenAIMessages(options2) {
  const apiBaseUrl = options2.apiBaseUrl?.replace(/\/+$/, "") || "https://api.openai.com";
  const endpoint = `${apiBaseUrl}/v1/chat/completions`;
  const providerLabel = options2.providerLabel?.trim() || "OpenAI";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${options2.apiKey}`
    },
    body: JSON.stringify({
      model: options2.model,
      stream: true,
      temperature: options2.temperature,
      max_tokens: options2.maxTokens,
      messages: toOpenAIMessages(options2.messages, options2.systemPrompt)
    })
  });
  if (!response.ok) {
    const responseText = await response.text().catch(() => "");
    const retryAfter = response.headers.get("retry-after");
    const retryHint = retryAfter ? ` Retry-After: ${retryAfter}s.` : "";
    throw new Error(
      `${providerLabel} API error ${response.status}${retryHint}${responseText ? ` ${responseText}` : ""}`
    );
  }
  yield* readJsonStream(response);
}

// src/orchestrator/system-prompt-builder.ts
function summarizeTaskTitles(titles, limit) {
  if (titles.length === 0) return "(none)";
  const selected = titles.slice(0, limit).map((title) => `- ${title}`);
  const remaining = titles.length - Math.min(titles.length, limit);
  if (remaining > 0) {
    selected.push(`- ...and ${remaining} more`);
  }
  return selected.join("\n");
}
function summarizeSkills(snapshot, limit) {
  if (snapshot.skills.length === 0) return "(none)";
  return snapshot.skills.slice(0, limit).map((skill) => {
    const description = skill.description.trim();
    return description ? `- ${skill.name}: ${description}` : `- ${skill.name}`;
  }).join("\n");
}
function summarizeSelectedSkills(skills) {
  if (skills.length === 0) return "(none)";
  return skills.map((skill) => {
    const reason = skill.reason.trim() || "selected";
    return `- ${skill.name} (${reason})`;
  }).join("\n");
}
function buildOrchestratorSystemPrompt(options2) {
  const {
    snapshot,
    selectedSkills = [],
    customSystemPrompt,
    agentInstructions,
    maxTasksPerStage = 5,
    maxSkills = 12
  } = options2;
  const taskSections = {
    inbox: summarizeTaskTitles(
      snapshot.tasks.inbox.map((task) => task.title),
      maxTasksPerStage
    ),
    plan: summarizeTaskTitles(
      snapshot.tasks.plan.map((task) => task.title),
      maxTasksPerStage
    ),
    code: summarizeTaskTitles(
      snapshot.tasks.code.map((task) => task.title),
      maxTasksPerStage
    ),
    audit: summarizeTaskTitles(
      snapshot.tasks.audit.map((task) => task.title),
      maxTasksPerStage
    ),
    completed: summarizeTaskTitles(
      snapshot.tasks.completed.map((task) => task.title),
      maxTasksPerStage
    )
  };
  const sections = [
    "You are the Kanban2Code orchestrator assistant.",
    "Use workspace state, task priorities, and available skills to produce useful responses.",
    "",
    "Workspace Task Summary:",
    `- total tasks: ${snapshot.metadata.totalTasks}`,
    `- inbox (${snapshot.tasks.inbox.length}):
${taskSections.inbox}`,
    `- plan (${snapshot.tasks.plan.length}):
${taskSections.plan}`,
    `- code (${snapshot.tasks.code.length}):
${taskSections.code}`,
    `- audit (${snapshot.tasks.audit.length}):
${taskSections.audit}`,
    `- completed (${snapshot.tasks.completed.length}):
${taskSections.completed}`,
    "",
    "Available Skills Summary:",
    summarizeSkills(snapshot, maxSkills),
    "",
    "Selected Skills:",
    summarizeSelectedSkills(selectedSkills)
  ];
  if (agentInstructions?.trim()) {
    sections.push("", "Agent Instructions:", agentInstructions.trim());
  }
  if (customSystemPrompt?.trim()) {
    sections.push("", "Additional System Prompt:", customSystemPrompt.trim());
  }
  return sections.join("\n");
}

// src/orchestrator/orchestrator.ts
function inferProviderFamily(config) {
  const providerHint = (config.provider || "").toLowerCase();
  const cliHint = config.cli.toLowerCase();
  if (providerHint.includes("anthropic") || cliHint.includes("claude") || cliHint.includes("anthropic")) {
    return "anthropic";
  }
  if (providerHint.includes("openai") || providerHint.includes("minimax") || cliHint.includes("openai") || cliHint.includes("minimax") || cliHint.includes("gpt") || cliHint.includes("codex")) {
    return "openai";
  }
  throw new Error(
    `Unknown provider '${config.provider ?? config.cli}'. Supported providers: anthropic, openai.`
  );
}
function resolveOpenAICompatSettings(config) {
  const providerHint = (config.provider || "").toLowerCase();
  const cliHint = config.cli.toLowerCase();
  if (providerHint.includes("minimax") || cliHint.includes("minimax")) {
    return {
      apiBaseUrl: "https://api.minimax.chat",
      providerLabel: "MiniMax"
    };
  }
  return {
    providerLabel: "OpenAI"
  };
}
function resolveApiKey(family, override) {
  if (override?.trim()) return override.trim();
  const key = family === "anthropic" ? process.env.ANTHROPIC_API_KEY : process.env.OPENAI_API_KEY;
  if (!key?.trim()) {
    const variable = family === "anthropic" ? "ANTHROPIC_API_KEY" : "OPENAI_API_KEY";
    throw new Error(`Missing API key for ${family}. Set ${variable} or pass apiKey in options.`);
  }
  return key.trim();
}
function buildConversationText(messages) {
  return messages.filter((message) => message.role === "user").map((message) => message.content).join("\n");
}
async function resolveConfig(options2) {
  if (options2.providerConfig) {
    return options2.providerConfig;
  }
  const resolved = await resolveProviderConfig(options2.kanbanRoot, options2.provider);
  if (!resolved) {
    throw new Error(`Provider config not found for '${options2.provider}'.`);
  }
  return resolved;
}
async function* sendMessage(options2) {
  const providerConfig = await resolveConfig(options2);
  const family = inferProviderFamily(providerConfig);
  const apiKey = resolveApiKey(family, options2.apiKey);
  const snapshot = options2.workspaceSnapshot ?? await buildWorkspaceSnapshot(options2.kanbanRoot);
  const selectedSkills = options2.selectedSkills ?? await selectSkills(options2.kanbanRoot, buildConversationText(options2.messages));
  const systemPrompt = buildOrchestratorSystemPrompt({
    snapshot,
    selectedSkills,
    customSystemPrompt: options2.systemPrompt,
    agentInstructions: options2.agentInstructions
  });
  try {
    if (family === "anthropic") {
      yield* streamAnthropicMessages({
        apiKey,
        model: providerConfig.model,
        messages: options2.messages,
        systemPrompt,
        temperature: options2.temperature,
        maxTokens: options2.maxTokens
      });
      return;
    }
    const openAICompat = resolveOpenAICompatSettings(providerConfig);
    yield* streamOpenAIMessages({
      apiKey,
      model: providerConfig.model,
      messages: options2.messages,
      systemPrompt,
      temperature: options2.temperature,
      maxTokens: options2.maxTokens,
      apiBaseUrl: openAICompat.apiBaseUrl,
      providerLabel: openAICompat.providerLabel
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown orchestrator error";
    yield `[ERROR: ${message}]`;
  }
}

// src/services/task-generator.ts
var import_gray_matter5 = __toESM(require_gray_matter());
var fs9 = __toESM(require("fs/promises"));
var path11 = __toESM(require("path"));
function slugifyTitle(title) {
  const base = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50).replace(/-+$/g, "");
  return base || "untitled-task";
}
function buildTaskContent(title, description) {
  const trimmed = description.trim();
  if (!trimmed) {
    return `# ${title}
`;
  }
  if (/^\s*#\s+.+/m.test(trimmed.split("\n")[0] ?? "")) {
    return `${trimmed}
`;
  }
  return `# ${title}

${trimmed}
`;
}
async function getUniqueFileName(targetDir, baseName) {
  let counter = 0;
  while (true) {
    const fileName = counter === 0 ? `${baseName}.md` : `${baseName}-${counter}.md`;
    const fullPath = path11.join(targetDir, fileName);
    try {
      await fs9.access(fullPath);
      counter += 1;
    } catch {
      return fileName;
    }
  }
}
async function generateTaskFile(kanbanRoot, proposal) {
  const folderParts = [kanbanRoot];
  if (proposal.project) {
    folderParts.push(PROJECTS_FOLDER, proposal.project);
    if (proposal.phase) {
      folderParts.push(proposal.phase);
    }
  } else {
    folderParts.push(INBOX_FOLDER);
  }
  const targetDir = path11.join(...folderParts);
  await ensureSafePath(kanbanRoot, targetDir);
  await fs9.mkdir(targetDir, { recursive: true });
  const baseName = slugifyTitle(proposal.title);
  const fileName = await getUniqueFileName(targetDir, baseName);
  const filePath = path11.join(targetDir, fileName);
  await ensureSafePath(kanbanRoot, filePath);
  const task = {
    id: path11.basename(fileName, ".md"),
    filePath,
    title: proposal.title,
    stage: proposal.stage,
    agent: proposal.agent,
    tags: proposal.tags ?? [],
    contexts: proposal.contexts ?? [],
    skills: proposal.skills ?? [],
    content: buildTaskContent(proposal.title, proposal.description)
  };
  const serialized = stringifyTaskFile(task);
  await fs9.writeFile(filePath, serialized, "utf-8");
  return path11.relative(kanbanRoot, filePath);
}

// src/services/task-watcher.ts
var import_events = require("events");
var path12 = __toESM(require("path"));
var DEFAULT_DEBOUNCE_MS = 300;
function isTaskFile(filePath) {
  const isMarkdown = filePath.endsWith(".md");
  const fileName = path12.basename(filePath);
  if (!isMarkdown || fileName === "_context.md") return false;
  const sep5 = path12.sep;
  if (filePath.includes(`${sep5}${PROVIDERS_FOLDER}${sep5}`) || filePath.includes(`${sep5}${AGENTS_FOLDER}${sep5}`)) {
    return false;
  }
  return true;
}
function createVsCodeWatcher(root) {
  const vscode6 = require("vscode");
  const pattern = new vscode6.RelativePattern(root, "**/*.md");
  const watcher = vscode6.workspace.createFileSystemWatcher(pattern);
  return {
    onDidCreate: (listener) => watcher.onDidCreate((uri) => listener(uri.fsPath)),
    onDidChange: (listener) => watcher.onDidChange((uri) => listener(uri.fsPath)),
    onDidDelete: (listener) => watcher.onDidDelete((uri) => listener(uri.fsPath)),
    dispose: () => watcher.dispose()
  };
}
var TaskWatcher = class extends import_events.EventEmitter {
  constructor(root, options2 = {}) {
    super();
    this.root = root;
    this.debounceMs = options2.debounceMs ?? DEFAULT_DEBOUNCE_MS;
    this.watcherFactory = options2.watcherFactory ?? createVsCodeWatcher;
  }
  watcher;
  debounceTimers = /* @__PURE__ */ new Map();
  lastDeleted = null;
  debounceMs;
  watcherFactory;
  start() {
    if (this.watcher) return;
    this.watcher = this.watcherFactory(this.root);
    this.watcher.onDidCreate((uri) => this.handleEvent("created", uri));
    this.watcher.onDidChange((uri) => this.handleEvent("updated", uri));
    this.watcher.onDidDelete((uri) => this.handleEvent("deleted", uri));
  }
  dispose() {
    this.watcher?.dispose();
    this.debounceTimers.forEach((t) => clearTimeout(t));
    this.debounceTimers.clear();
    this.lastDeleted = null;
  }
  handleEvent(type, filePath) {
    if (!filePath.includes(KANBAN_FOLDER) || !isTaskFile(filePath)) return;
    const previousDeletion = this.lastDeleted;
    const now = Date.now();
    if (type === "deleted") {
      this.lastDeleted = { path: filePath, at: now };
    } else if (previousDeletion && now - previousDeletion.at <= this.debounceMs) {
      this.emitDebounced(`move-${previousDeletion.path}->${filePath}`, () => {
        this.emit("event", { type: "moved", from: previousDeletion.path, to: filePath });
      });
      this.lastDeleted = null;
      return;
    }
    this.emitDebounced(`${type}:${filePath}`, () => {
      this.emit("event", { type, path: filePath });
    });
  }
  emitDebounced(key, fn) {
    const existing = this.debounceTimers.get(key);
    if (existing) {
      clearTimeout(existing);
    }
    const timer = setTimeout(() => {
      this.debounceTimers.delete(key);
      fn();
    }, this.debounceMs);
    this.debounceTimers.set(key, timer);
  }
};

// src/webview/messaging.ts
var MESSAGE_VERSION = 2;
var StageSchema = external_exports.enum(["inbox", "plan", "code", "audit", "completed"]);
var TaskCountsSchema = external_exports.object({
  inbox: external_exports.number().int().nonnegative(),
  plan: external_exports.number().int().nonnegative(),
  code: external_exports.number().int().nonnegative(),
  audit: external_exports.number().int().nonnegative(),
  completed: external_exports.number().int().nonnegative()
}).strict();
var WorkspaceSnapshotSchema = external_exports.object({
  config: external_exports.unknown(),
  tasks: external_exports.object({
    inbox: external_exports.array(external_exports.unknown()),
    plan: external_exports.array(external_exports.unknown()),
    code: external_exports.array(external_exports.unknown()),
    audit: external_exports.array(external_exports.unknown()),
    completed: external_exports.array(external_exports.unknown())
  }).strict(),
  agents: external_exports.array(external_exports.unknown()),
  contexts: external_exports.array(external_exports.unknown()),
  skills: external_exports.array(external_exports.unknown()),
  providers: external_exports.array(external_exports.unknown()),
  metadata: external_exports.object({
    taskCounts: TaskCountsSchema,
    totalTasks: external_exports.number().int().nonnegative(),
    agentCount: external_exports.number().int().nonnegative(),
    contextCount: external_exports.number().int().nonnegative(),
    skillCount: external_exports.number().int().nonnegative(),
    providerCount: external_exports.number().int().nonnegative()
  }).strict()
}).strict();
var ChatMessageSchema = external_exports.object({
  role: external_exports.enum(["system", "user", "assistant"]),
  content: external_exports.string()
}).strict();
var ActiveProviderSchema = ProviderConfigSchema.strict();
var InitStatePayloadSchema = external_exports.object({
  kanbanRootExists: external_exports.boolean(),
  workspaceSnapshot: WorkspaceSnapshotSchema,
  activeProvider: ActiveProviderSchema.nullable()
}).strict();
var StreamChunkPayloadSchema = external_exports.object({
  token: external_exports.string()
}).strict();
var MessageCompletePayloadSchema = external_exports.object({}).strict();
var TaskGeneratedPayloadSchema = external_exports.object({
  path: external_exports.string(),
  title: external_exports.string()
}).strict();
var WorkspaceUpdatedPayloadSchema = external_exports.object({
  workspaceSnapshot: WorkspaceSnapshotSchema
}).strict();
var ErrorPayloadSchema = external_exports.object({
  message: external_exports.string()
}).strict();
var RequestStatePayloadSchema = external_exports.object({}).strict();
var SendMessagePayloadSchema = ChatMessageSchema;
var GenerateTaskPayloadSchema = external_exports.object({
  title: external_exports.string().min(1),
  description: external_exports.string(),
  stage: StageSchema,
  agent: external_exports.string().optional(),
  tags: external_exports.array(external_exports.string()).optional(),
  project: external_exports.string().optional(),
  phase: external_exports.string().optional(),
  contexts: external_exports.array(external_exports.string()).optional(),
  skills: external_exports.array(external_exports.string()).optional()
}).strict();
var RunTaskPayloadSchema = external_exports.object({
  taskFilePath: external_exports.string()
}).strict();
var SaveTaskPayloadSchema = external_exports.object({
  taskFilePath: external_exports.string(),
  title: external_exports.string().min(1),
  stage: StageSchema,
  content: external_exports.string(),
  agent: external_exports.string().optional(),
  provider: external_exports.string().optional(),
  tags: external_exports.array(external_exports.string()).optional(),
  contexts: external_exports.array(external_exports.string()).optional(),
  skills: external_exports.array(external_exports.string()).optional(),
  project: external_exports.string().optional(),
  phase: external_exports.string().optional()
}).strict();
var CancelStreamPayloadSchema = external_exports.object({}).strict();
var InitStateEnvelopeSchema = external_exports.object({
  version: external_exports.literal(MESSAGE_VERSION),
  type: external_exports.literal("InitState"),
  payload: InitStatePayloadSchema
}).strict();
var StreamChunkEnvelopeSchema = external_exports.object({
  version: external_exports.literal(MESSAGE_VERSION),
  type: external_exports.literal("StreamChunk"),
  payload: StreamChunkPayloadSchema
}).strict();
var MessageCompleteEnvelopeSchema = external_exports.object({
  version: external_exports.literal(MESSAGE_VERSION),
  type: external_exports.literal("MessageComplete"),
  payload: MessageCompletePayloadSchema
}).strict();
var TaskGeneratedEnvelopeSchema = external_exports.object({
  version: external_exports.literal(MESSAGE_VERSION),
  type: external_exports.literal("TaskGenerated"),
  payload: TaskGeneratedPayloadSchema
}).strict();
var WorkspaceUpdatedEnvelopeSchema = external_exports.object({
  version: external_exports.literal(MESSAGE_VERSION),
  type: external_exports.literal("WorkspaceUpdated"),
  payload: WorkspaceUpdatedPayloadSchema
}).strict();
var ErrorEnvelopeSchema = external_exports.object({
  version: external_exports.literal(MESSAGE_VERSION),
  type: external_exports.literal("Error"),
  payload: ErrorPayloadSchema
}).strict();
var RequestStateEnvelopeSchema = external_exports.object({
  version: external_exports.literal(MESSAGE_VERSION),
  type: external_exports.literal("RequestState"),
  payload: RequestStatePayloadSchema
}).strict();
var SendMessageEnvelopeSchema = external_exports.object({
  version: external_exports.literal(MESSAGE_VERSION),
  type: external_exports.literal("SendMessage"),
  payload: SendMessagePayloadSchema
}).strict();
var GenerateTaskEnvelopeSchema = external_exports.object({
  version: external_exports.literal(MESSAGE_VERSION),
  type: external_exports.literal("GenerateTask"),
  payload: GenerateTaskPayloadSchema
}).strict();
var RunTaskEnvelopeSchema = external_exports.object({
  version: external_exports.literal(MESSAGE_VERSION),
  type: external_exports.literal("RunTask"),
  payload: RunTaskPayloadSchema
}).strict();
var SaveTaskEnvelopeSchema = external_exports.object({
  version: external_exports.literal(MESSAGE_VERSION),
  type: external_exports.literal("SaveTask"),
  payload: SaveTaskPayloadSchema
}).strict();
var CancelStreamEnvelopeSchema = external_exports.object({
  version: external_exports.literal(MESSAGE_VERSION),
  type: external_exports.literal("CancelStream"),
  payload: CancelStreamPayloadSchema
}).strict();
var EnvelopeSchema = external_exports.discriminatedUnion("type", [
  InitStateEnvelopeSchema,
  StreamChunkEnvelopeSchema,
  MessageCompleteEnvelopeSchema,
  TaskGeneratedEnvelopeSchema,
  WorkspaceUpdatedEnvelopeSchema,
  ErrorEnvelopeSchema,
  RequestStateEnvelopeSchema,
  SendMessageEnvelopeSchema,
  GenerateTaskEnvelopeSchema,
  RunTaskEnvelopeSchema,
  SaveTaskEnvelopeSchema,
  CancelStreamEnvelopeSchema
]);
function createEnvelope(type, payload) {
  return {
    version: MESSAGE_VERSION,
    type,
    payload
  };
}
function validateEnvelope(data) {
  const result = EnvelopeSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid message envelope: ${result.error.message}`);
  }
  return result.data;
}

// src/webview/SidebarProvider.ts
var SidebarProvider = class {
  constructor(extensionUri, options2) {
    this.extensionUri = extensionUri;
    this.options = options2;
    this.watcher = new TaskWatcher(options2.kanbanRoot);
    this.watcher.on("event", () => {
      void this.refreshSnapshotAndBroadcast();
    });
    this.watcher.start();
  }
  static viewType = "kanban2code.sidebar";
  view;
  snapshot = null;
  activeProvider = null;
  selectedProviderId = null;
  chatHistory = [];
  streamGeneration = 0;
  watcher;
  resolveWebviewView(webviewView, _context, _token) {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode4.Uri.joinPath(this.extensionUri, "dist")]
    };
    webviewView.webview.html = this.getWebviewContent(webviewView.webview);
    webviewView.webview.onDidReceiveMessage(async (data) => {
      await this.handleWebviewMessage(data);
    });
    webviewView.onDidDispose(() => {
      this.watcher.dispose();
    });
    void this.sendInitState();
  }
  async handleWebviewMessage(data) {
    try {
      const envelope = validateEnvelope(data);
      switch (envelope.type) {
        case "RequestState":
          await this.sendInitState();
          break;
        case "SendMessage":
          await this.handleSendMessage(envelope.payload);
          break;
        case "GenerateTask": {
          const relativePath = await generateTaskFile(this.options.kanbanRoot, envelope.payload);
          this.postMessage(createEnvelope("TaskGenerated", {
            path: relativePath,
            title: envelope.payload.title
          }));
          await this.refreshSnapshotAndBroadcast();
          break;
        }
        case "RunTask": {
          const taskId = path13.basename(envelope.payload.taskFilePath, ".md");
          await executeTaskInTerminal(this.options.kanbanRoot, taskId, this.options.workspaceRoot);
          break;
        }
        case "SaveTask":
          await this.handleSaveTask(envelope.payload);
          break;
        case "CancelStream":
          this.streamGeneration += 1;
          this.postMessage(createEnvelope("MessageComplete", {}));
          break;
        default:
          break;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.postMessage(createEnvelope("Error", { message }));
    }
  }
  async handleSendMessage(userMessage) {
    const snapshot = this.snapshot ?? await buildWorkspaceSnapshot(this.options.kanbanRoot);
    this.snapshot = snapshot;
    const providerId = this.selectedProviderId ?? this.resolveDefaultProviderId(snapshot);
    if (!providerId) {
      throw new Error("No provider configured. Add a provider in .kanban2code/_providers.");
    }
    this.selectedProviderId = providerId;
    this.chatHistory.push(userMessage);
    const generation = ++this.streamGeneration;
    let assistantContent = "";
    for await (const token of sendMessage({
      kanbanRoot: this.options.kanbanRoot,
      provider: providerId,
      messages: this.chatHistory,
      workspaceSnapshot: snapshot
    })) {
      if (generation !== this.streamGeneration) {
        return;
      }
      assistantContent += token;
      this.postMessage(createEnvelope("StreamChunk", { token }));
    }
    if (generation !== this.streamGeneration) {
      return;
    }
    this.chatHistory.push({ role: "assistant", content: assistantContent });
    this.postMessage(createEnvelope("MessageComplete", {}));
  }
  async handleSaveTask(payload) {
    const snapshot = this.snapshot ?? await buildWorkspaceSnapshot(this.options.kanbanRoot);
    const existing = this.findTaskByFilePath(snapshot, payload.taskFilePath);
    if (!existing) {
      throw new Error(`Task not found: ${payload.taskFilePath}`);
    }
    const fileName = path13.basename(existing.filePath);
    const targetDir = payload.project ? path13.join(this.options.kanbanRoot, "projects", payload.project, payload.phase ?? "") : path13.join(this.options.kanbanRoot, "inbox");
    const normalizedTargetDir = targetDir.endsWith(path13.sep) ? targetDir.slice(0, -1) : targetDir;
    const targetPath = path13.join(normalizedTargetDir, fileName);
    await ensureSafePath(this.options.kanbanRoot, targetPath);
    await fs10.mkdir(path13.dirname(targetPath), { recursive: true });
    let original = "";
    try {
      original = await fs10.readFile(existing.filePath, "utf8");
    } catch {
      original = "";
    }
    const updated = {
      ...existing,
      filePath: targetPath,
      title: payload.title,
      stage: payload.stage,
      agent: payload.agent,
      provider: payload.provider,
      tags: payload.tags ?? [],
      contexts: payload.contexts ?? [],
      skills: payload.skills ?? [],
      project: payload.project,
      phase: payload.phase,
      content: payload.content
    };
    const serialized = stringifyTaskFile(updated, original);
    await fs10.writeFile(targetPath, serialized, "utf8");
    if (targetPath !== existing.filePath) {
      await fs10.rm(existing.filePath, { force: true });
    }
    await this.refreshSnapshotAndBroadcast();
  }
  findTaskByFilePath(snapshot, taskFilePath) {
    for (const stage of ["inbox", "plan", "code", "audit", "completed"]) {
      const found = snapshot.tasks[stage].find((task) => task.filePath === taskFilePath);
      if (found) return found;
    }
    return null;
  }
  resolveDefaultProviderId(snapshot) {
    const defaultProvider = snapshot.config.providerDefaults?.coder;
    if (defaultProvider) {
      const exact = snapshot.providers.find((provider) => provider.id === defaultProvider);
      if (exact) return exact.id;
    }
    const firstValid = snapshot.providers.find((provider) => provider.config);
    return firstValid?.id ?? null;
  }
  async sendInitState() {
    try {
      const snapshot = await buildWorkspaceSnapshot(this.options.kanbanRoot);
      this.snapshot = snapshot;
      const providerId = this.selectedProviderId ?? this.resolveDefaultProviderId(snapshot);
      this.selectedProviderId = providerId;
      this.activeProvider = providerId ? await resolveProviderConfig(this.options.kanbanRoot, providerId) ?? null : null;
      this.postMessage(createEnvelope("InitState", {
        kanbanRootExists: true,
        workspaceSnapshot: snapshot,
        activeProvider: this.activeProvider
      }));
    } catch {
      const emptySnapshot = {
        config: {
          version: "1.0.0",
          agents: {},
          tags: { categories: {} },
          stages: {},
          preferences: {}
        },
        tasks: { inbox: [], plan: [], code: [], audit: [], completed: [] },
        agents: [],
        contexts: [],
        skills: [],
        providers: [],
        metadata: {
          taskCounts: { inbox: 0, plan: 0, code: 0, audit: 0, completed: 0 },
          totalTasks: 0,
          agentCount: 0,
          contextCount: 0,
          skillCount: 0,
          providerCount: 0
        }
      };
      this.postMessage(createEnvelope("InitState", {
        kanbanRootExists: false,
        workspaceSnapshot: emptySnapshot,
        activeProvider: null
      }));
    }
  }
  async refreshSnapshotAndBroadcast() {
    const snapshot = await buildWorkspaceSnapshot(this.options.kanbanRoot);
    this.snapshot = snapshot;
    this.postMessage(createEnvelope("WorkspaceUpdated", { workspaceSnapshot: snapshot }));
  }
  postMessage(message) {
    this.view?.webview.postMessage(message);
  }
  getWebviewContent(webview) {
    const scriptUri = webview.asWebviewUri(vscode4.Uri.joinPath(this.extensionUri, "dist", "webview.js"));
    const nonce = getNonce();
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';" />
  <title>Kanban2Code</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
};
function getNonce() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let value = "";
  for (let i = 0; i < 32; i += 1) {
    value += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return value;
}

// src/workspace/state.ts
var WorkspaceState = class {
  static _kanbanRoot = null;
  static _filterState = null;
  static get kanbanRoot() {
    return this._kanbanRoot;
  }
  static setKanbanRoot(path14) {
    this._kanbanRoot = path14;
  }
  static get filterState() {
    return this._filterState;
  }
  static setFilterState(state) {
    this._filterState = state;
  }
};

// src/extension.ts
async function activate(context) {
  let sidebarProvider;
  const registerSidebarProvider = (kanbanRoot2, workspaceRoot2) => {
    if (sidebarProvider) {
      return;
    }
    sidebarProvider = new SidebarProvider(context.extensionUri, {
      kanbanRoot: kanbanRoot2,
      workspaceRoot: workspaceRoot2
    });
    const registration = vscode5.window.registerWebviewViewProvider(
      SidebarProvider.viewType,
      sidebarProvider
    );
    context.subscriptions.push(registration);
  };
  const workspaceRoot = vscode5.workspace.workspaceFolders?.[0]?.uri.fsPath ?? null;
  let kanbanRoot = null;
  if (workspaceRoot) {
    kanbanRoot = await findKanbanRoot(workspaceRoot);
    WorkspaceState.setKanbanRoot(kanbanRoot);
    if (kanbanRoot) {
      registerSidebarProvider(kanbanRoot, workspaceRoot);
    }
  }
  registerCommands(context, {
    getKanbanRoot: () => WorkspaceState.kanbanRoot,
    setKanbanRoot: (nextKanbanRoot) => WorkspaceState.setKanbanRoot(nextKanbanRoot),
    onWorkspaceCreated: (createdKanbanRoot, createdWorkspaceRoot) => {
      registerSidebarProvider(createdKanbanRoot, createdWorkspaceRoot);
    }
  });
  if (workspaceRoot && !kanbanRoot) {
    const action = await vscode5.window.showInformationMessage(
      "Kanban2Code workspace not found.",
      "Create Workspace"
    );
    if (action === "Create Workspace") {
      await vscode5.commands.executeCommand("kanban2code.createWorkspace");
    }
  }
}
function deactivate() {
  WorkspaceState.setKanbanRoot(null);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
/*! Bundled license information:

is-extglob/index.js:
  (*!
   * is-extglob <https://github.com/jonschlinkert/is-extglob>
   *
   * Copyright (c) 2014-2016, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

is-glob/index.js:
  (*!
   * is-glob <https://github.com/jonschlinkert/is-glob>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   *)

is-number/index.js:
  (*!
   * is-number <https://github.com/jonschlinkert/is-number>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Released under the MIT License.
   *)

to-regex-range/index.js:
  (*!
   * to-regex-range <https://github.com/micromatch/to-regex-range>
   *
   * Copyright (c) 2015-present, Jon Schlinkert.
   * Released under the MIT License.
   *)

fill-range/index.js:
  (*!
   * fill-range <https://github.com/jonschlinkert/fill-range>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

queue-microtask/index.js:
  (*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

run-parallel/index.js:
  (*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

is-extendable/index.js:
  (*!
   * is-extendable <https://github.com/jonschlinkert/is-extendable>
   *
   * Copyright (c) 2015, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

strip-bom-string/index.js:
  (*!
   * strip-bom-string <https://github.com/jonschlinkert/strip-bom-string>
   *
   * Copyright (c) 2015, 2017, Jon Schlinkert.
   * Released under the MIT License.
   *)
*/
//# sourceMappingURL=extension.js.map
