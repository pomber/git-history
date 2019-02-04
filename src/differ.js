import * as diff from "diff";
import tokenize from "./tokenizer";
const newlineRe = /\r\n|\r|\n/;

function myDiff(oldCode, newCode) {
  const changes = diff.diffLines(oldCode || "", newCode);

  let oldIndex = -1;
  return changes.map(({ value, count, removed, added }) => {
    const lines = value.split(newlineRe);
    // check if last line is empty, if it is, remove it
    const lastLine = lines.pop();
    if (lastLine) {
      lines.push(lastLine);
    }
    const result = {
      oldIndex,
      lines,
      count,
      removed,
      added
    };
    if (!added) {
      oldIndex += count;
    }
    return result;
  });
}

function insert(array, index, elements) {
  return array.splice(index, 0, ...elements);
}

function slideDiff(lines, codes, slideIndex) {
  const prevLines = lines.filter(l => l.slides.includes(slideIndex - 1));
  const prevCode = codes[slideIndex - 1] || "";
  const currCode = codes[slideIndex];

  const changes = myDiff(prevCode, currCode);

  changes.forEach(change => {
    if (change.added) {
      const prevLine = prevLines[change.oldIndex];
      const addAtIndex = lines.indexOf(prevLine) + 1;
      const addLines = change.lines.map(content => ({
        content,
        slides: [slideIndex]
      }));
      insert(lines, addAtIndex, addLines);
    } else if (!change.removed) {
      for (let j = 1; j <= change.count; j++) {
        prevLines[change.oldIndex + j].slides.push(slideIndex);
      }
    }
  });

  const tokenLines = tokenize(currCode);
  const currLines = lines.filter(l => l.slides.includes(slideIndex));
  currLines.forEach((line, index) => (line.tokens = tokenLines[index]));
}

export function parseLines(codes) {
  const lines = [];
  for (let slideIndex = 0; slideIndex < codes.length; slideIndex++) {
    slideDiff(lines, codes, slideIndex);
  }
  return lines;
}

export function getSlides(codes) {
  const lines = parseLines(codes);
  // console.log("lines", lines);
  return codes.map((_, slideIndex) => {
    return lines
      .map((line, lineIndex) => ({
        content: line.content,
        tokens: line.tokens,
        left: line.slides.includes(slideIndex - 1),
        middle: line.slides.includes(slideIndex),
        right: line.slides.includes(slideIndex + 1),
        key: lineIndex
      }))
      .filter(line => line.middle || line.left || line.right);
  });
}

//

function getLines(change) {
  return change.value
    .trimRight(newlineRe)
    .split(newlineRe)
    .map(content => ({
      content
    }));
}

export function tripleDiff(left, middle, right) {
  const leftDiff = diff.diffLines(left, middle);
  const rightDiff = diff.diffLines(middle, right);

  let x = leftDiff
    .map(change =>
      change.value
        .trimRight(newlineRe)
        .split(newlineRe)
        .map(content => ({
          content,
          left: !change.added,
          middle: !change.removed
        }))
    )
    .flat();
  // console.log(JSON.stringify(leftDiff, null, 2));
  // console.log(JSON.stringify(x, null, 2));

  let i = 0;
  // console.log(rightDiff);
  rightDiff.forEach(change => {
    let mx = x.filter(l => l.middle || l.right);
    if (change.added) {
      const lines = change.value
        .trimRight(newlineRe)
        .split(newlineRe)
        .map(content => ({
          content,
          left: false,
          middle: false,
          right: true
        }));
      insert(x, i, lines);
    } else if (!change.removed) {
      // console.log(change);
      for (let j = 0; j < change.count; j++) {
        mx[i + j].right = true;
      }
    }
    i += change.count;
  });
  // console.log(JSON.stringify(rightDiff, null, 2));
  // console.log(JSON.stringify(x, null, 2));
  return x;
}
