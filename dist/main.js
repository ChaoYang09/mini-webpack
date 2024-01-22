(function (graph) {
      function require(moduleId) {
        function localRequire(relativePath) {
          return require(graph[moduleId].dependences[relativePath]);
        }
        const exports = {};
        (function (require, exports, code) {
          eval(code);
        })(localRequire, exports, graph[moduleId].code);
        return exports;
      }
      require('./src/index.js');
    })({"./src/index.js":{"dependences":{"./add.js":"./src/add.js","./minus.js":"./src/minus.js"},"code":"\"use strict\";\n\nvar _add = require(\"./add.js\");\nvar _minus = require(\"./minus.js\");\nvar sum = 0;\nvar res = 0;\nres = (0, _add.add)(sum, 10);\nres = (0, _minus.minus)(res, 5);\nconsole.log(res);"},"./src/add.js":{"dependences":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.add = add;\nfunction add(sum, num) {\n  return sum += num;\n}"},"./src/minus.js":{"dependences":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.minus = minus;\nfunction minus(sum, num) {\n  return sum -= num;\n}"}})