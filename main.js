import { buildExpression, calculateAst, drawAst } from "./calc.js";

function main(expression) {
  const ast = buildExpression(expression);
  drawAst(ast);
  console.log("Result", calculateAst(ast));
}

const expression = "".concat(...process.argv.slice(2));
console.log(expression);
main(expression);
