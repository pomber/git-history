import { nextIndex, prevIndex } from "./utils";

describe("nextIndex", () => {
  const fiveItems = [1, 2, 3, 4, 5];
  test("works with middle index", () => {
    expect(nextIndex(fiveItems, 2)).toBe(3);
  });
  test("works with last index", () => {
    expect(nextIndex(fiveItems, 4)).toBe(4);
  });
  test("works with fractions", () => {
    expect(nextIndex(fiveItems, 1.1)).toBe(2);
    expect(nextIndex(fiveItems, 1.9)).toBe(2);
  });
});

describe("prevIndex", () => {
  const fiveItems = [1, 2, 3, 4, 5];
  test("works with middle index", () => {
    expect(prevIndex(fiveItems, 2)).toBe(1);
  });
  test("works with start index", () => {
    expect(prevIndex(fiveItems, 0)).toBe(0);
  });
  test("works with fractions", () => {
    expect(prevIndex(fiveItems, 1.1)).toBe(1);
    expect(prevIndex(fiveItems, 1.9)).toBe(1);
  });
});
