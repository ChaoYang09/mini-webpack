const fs = require("fs");
const path = require("path");
const Parser = require("./Parser");

class Compiler {
  constructor(options) {
    this.entry = options.entry;
    this.output = options.output;
    this.modules = [];
  }
  run() {
    const info = this.build(this.entry);
    this.modules.push(info);
    for (let i = 0; i < this.modules.length; i++) {
      const m = this.modules[i];
      const deps = m.dependences;
      if (deps) {
        for (let key in deps) {
          this.modules.push(this.build(deps[key]));
        }
      }
    }
    const dependencyGraph = this.modules.reduce((pre, cur) => {
      return {
        ...pre,
        [cur.filename]: {
          dependences: cur.dependences,
          code: cur.code,
        },
      };
    }, {});
    this.generate(dependencyGraph);
  }
  build(filename) {
    const { getAst, getDependecies, getCode } = Parser;
    const ast = getAst(filename);
    const dependences = getDependecies(ast, filename);
    const code = getCode(ast);
    return {
      filename,
      dependences,
      code,
    };
  }
  generate(code) {
    // console.log(code);
    const filepath = path.join(this.output.path, this.output.filename);
    const bundle = `(function (graph) {
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
      require('${this.entry}');
    })(${JSON.stringify(code)})`;
    fs.writeFileSync(filepath, bundle);
  }
}
module.exports = Compiler;
