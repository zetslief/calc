// AST:
// Open: (
// CloseParenthesis:  )
// Minus: -
// Plus: +
// Mul: *
// Div: /
//
// Token: (name, start, end)
//
// expression types:
//  unary(type, operation, expression)
//  binary(type, operation, leftExpression, rightExpression)

const UNARY = "unary";
const BINARY = "binary";

const UNKNOWN = "unknown";
const PARENTHESIS = "parenthesis";
const PLUS = "plus";

function unary(operation) {
  return { type: UNARY, operation: operation, expression: null };
}

function binary(operation) {
  return {
    type: BINARY,
    operation: operation,
    leftExpression: unary(PARENTHESIS),
    rightExpression: unary(PARENTHESIS)
  };
}

function unknown(value) {
  return {type: UNKNOWN, expression: value};
}

function addExpression(ast, expression) {
  if (ast.type == UNARY) {
    ast.expression = expression;
  } else if (ast.leftExpression) {
    ast.leftExpression = expression;
  } else {
    ast.rightExpression = expression;
  }
  return expression;
}

function startBuildAst(lexes) {
  const root = buildAst(lexes);
  return root;
}

function nextExpression(lexes) {
  let parenCounter = 0;
  for (let index = 0; index < lexes.length; index += 1) {
    const lex = lexes[index];
    if (lex.name == "sign" && parenCounter == 0) {
      return [lexes.slice(0, index + 1), lexes.slice(index + 1, lexes.length)];
    } else if (lex.name == "start") {
      parenCounter += 1;
    } else if (lex.name == "end") {
      parenCounter -= 1;
    }
  }
  return [lexes, []];
}

function buildAst(lexes) {
  const [next, rest] = nextExpression(lexes);
  const lex = next[0];
  if (lex.name == "number") {
    if (next.length == 1) {
      return unknown(lex.value);
    }
    const plus = binary(next[1].value);
    plus.leftExpression = unknown(lex.value);
    plus.rightExpression = buildAst(rest);
    return plus;
  } else if (lex.name == "start") {
    const last = next[next.length - 1]
    if (last.name == "sign") {
      const sign = next[next.length -1 ];
      const b = binary(sign.value); 
      const [pNext, pRest] = nextExpression(rest);
      b.leftExpression = buildAst(next.slice(1, next.length - 2));
      b.rightExpression = buildAst(pNext.slice(0, pNext.length -1));
      const c = binary(pNext[pNext.length - 1].value)
      c.leftExpression = b;
      c.rightExpression = buildAst(pRest);
      return c;
    } else {
      return buildAst(next.slice(1, next.length - 1));
    }
  } else if (lex.name == "sign" && rest[0].name == "number") {
    rest[0].value = lex.value + rest[0].value;
    return buildAst(rest);
  }{
    throw Error("unexpected lex:" + lex.name + lex.value);
  }
}

function calculate(left, right, operation) {
  if (operation == "+") {
    return Number(left) + Number(right);
  } else if (operation == "-") {
    return Number(left) - Number(right);
  } else if (operation == "*") {
    return Number(left) * Number(right);
  } else {
    throw Error("Unknown operation " + operation, operation);
  }
}

export function calculateAst(ast) {
  if (ast.type == UNARY) {
    return calculateAst(ast.expression);
  } else if (ast.type == BINARY) {
    const left = calculateAst(ast.leftExpression);
    const right = calculateAst(ast.rightExpression);
    return calculate(left, right, ast.operation);
  } else if (ast.type == UNKNOWN) {
    return ast.expression;
  } else {
    console.error("ERROR: unknown ast type", ast);
  }
}

function isNumber(char) {
  return char >= "0" && char <= "9";
}

function lex(exp) {
  function token(name, value) {
    return { name, value };
  }

  const result = [];
  for (let index = 0; index < exp.length; index += 1) {
    const symbol = exp[index];
    if (symbol == "+") {
      result.push(token("sign", "+"));
    } else if (symbol == "-") {
      result.push(token("sign", "-"));
    } else if (symbol == "*") {
      result.push(token("sign", "*"));
    } else if (symbol == "(") {
      result.push(token("start", "("));
    } else if (symbol == ")") {
      result.push(token("end", ")"));
    } else if (isNumber(symbol)) {
      let currentSymbol = symbol;
      let number = "";
      while ((isNumber(currentSymbol) || currentSymbol == ".") && index < exp.length) {
        number += currentSymbol;
        index += 1;
        currentSymbol = exp[index];
      }
      index -= 1;
      result.push(token("number", number));
    }
  }
  return result;
}

export function drawAst(ast, offset) {
  if (ast.type == UNARY) {
    console.log(" ".repeat(offset) + "|u>", ast.operation);
    drawAst(ast.expression, offset + 2);
  } else if (ast.type == BINARY) {
    console.log(" ".repeat(offset) + "|b>", ast.operation);
    drawAst(ast.leftExpression, offset + 2);
    drawAst(ast.rightExpression, offset + 2);
  } else if (ast.type == UNKNOWN) {
    console.log(" ".repeat(offset) + "-u>", ast.expression);
    return;
  } else {
    console.error("UNKNOWN ERROR", ast, offset);
  }
}

export function buildExpression(expression) {
  const lexed = lex(expression);
  return startBuildAst(lexed);
}
