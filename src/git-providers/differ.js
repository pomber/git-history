import { diffLines } from "diff";
import tokenize from "./tokenizer";
const newlineRe = /\r\n|\r|\n/;

function myDiff(oldCode, newCode) {
  const changes = diffLines(oldCode || "", newCode);

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

function slideDiff(lines, codes, slideIndex, language) {
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

  const tokenLines = tokenize(currCode, language);
  const currLines = lines.filter(l => l.slides.includes(slideIndex));
  currLines.forEach((line, index) => (line.tokens = tokenLines[index]));
}

export function parseLines(codes, language) {
  const lines = [];
  for (let slideIndex = 0; slideIndex < codes.length; slideIndex++) {
    slideDiff(lines, codes, slideIndex, language);
  }
  return lines;
}

export function getSlides(codes, language) {
  // codes are in reverse cronological order
  const lines = parseLines(codes, language);
  // console.log("lines", lines);
  return codes.map((_, slideIndex) => {
    return lines
      .map((line, lineIndex) => ({
        content: line.content,
        tokens: line.tokens,
        left: line.slides.includes(slideIndex + 1),
        middle: line.slides.includes(slideIndex),
        right: line.slides.includes(slideIndex - 1),
        key: lineIndex
      }))
      .filter(line => line.middle || line.left || line.right);
  });
}

export function getChanges(lines) {
  const changes = [];
  let currentChange = null;
  let i = 0;
  const isNewLine = i => !lines[i].left && lines[i].middle;
  while (i < lines.length) {
    if (isNewLine(i)) {
      if (!currentChange) {
        currentChange = { start: i };
      }
    } else {
      if (currentChange) {
        currentChange.end = i - 1;
        changes.push(currentChange);
        currentChange = null;
      }
    }
    i++;
  }

  if (currentChange) {
    currentChange.end = i - 1;
    changes.push(currentChange);
    currentChange = null;
  }

  return changes;
}
