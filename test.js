import { buildExpression, calculateAst, drawAst} from "./main.js";

const expressions = [
  ["1 + 1", 2],
  ["1 - 1", 0],
  ["1 * 0", 0],
  ["(2 + 1) * 2 - 6", 0],
  ["-1 + 1", 0],
]

function main() {
  for (const [expression, expectedResult] of expressions) {
    const ast = buildExpression(expression);
    const result = calculateAst(ast);
    if (result == expectedResult) {
      console.log("✓", expression, "=", result);
    } else {
      console.log("❌", "Failed to calculate:", expression);
      console.log("\t", "Expected:", expectedResult);
      console.log("\t", "Actual:", result);
      console.log(drawAst(ast));
    }
  }
}

main();
