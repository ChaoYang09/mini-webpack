const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("@babel/core");

module.exports = {
  //获取抽象语法树
  getAst: function (path) {
    const content = fs.readFileSync(path, "utf-8");
    const ast = parser.parse(content, {
      sourceType: "module",
    });
    // console.log(ast);
    return ast;
  },
  //获取依赖
  getDependecies: function (ast, filename) {
    const dep = {};
    traverse(ast, {
      ImportDeclaration({ node }) {
        const dirname = path.dirname(filename);
        const value = node.source.value;
        const filepath = "./" + path.join(dirname, value);
        dep[value] = filepath;
      },
    });
    return dep;
  },
  //获取代码
  getCode: function (ast) {
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"],
    });
    // console.log(code);
    return code;
  },
};
