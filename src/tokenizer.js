import Prism from "prismjs";

const newlineRe = /\r\n|\r|\n/;

// Take a list of nested tokens
// (token.content may contain an array of tokens)
// and flatten it so content is always a string
// and type the type of the leaf
function flattenTokens(tokens) {
  const flatList = [];
  tokens.forEach(token => {
    if (Array.isArray(token.content)) {
      flatList.push(...flattenTokens(token.content));
    } else {
      flatList.push(token);
    }
  });
  return flatList;
}

// Convert strings to tokens
function tokenizeStrings(prismTokens) {
  return prismTokens.map(pt =>
    typeof pt === "string"
      ? { type: "plain", content: pt }
      : {
          type: pt.type,
          content: Array.isArray(pt.content)
            ? tokenizeStrings(pt.content)
            : pt.content
        }
  );
}

export default function tokenize(code, language = "javascript") {
  const prismTokens = Prism.tokenize(code, Prism.languages[language]);
  const nestedTokens = tokenizeStrings(prismTokens);
  const tokens = flattenTokens(nestedTokens);

  let currentLine = [];
  const lines = [currentLine];
  tokens.forEach(token => {
    const contentLines = token.content.split(newlineRe);

    const firstContent = contentLines.shift();
    if (firstContent !== "") {
      currentLine.push({ type: token.type, content: firstContent });
    }
    contentLines.forEach(content => {
      currentLine = [];
      lines.push(currentLine);
      if (content !== "") {
        currentLine.push({ type: token.type, content });
      }
    });
  });
  return lines;
}
