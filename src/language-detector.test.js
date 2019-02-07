import { getLanguage, getLanguageDependencies } from "./language-detector";

describe("Can detect language", () => {
  test("javascript", () => {
    expect(getLanguage("my-file.js")).toBe("js");
  });

  test("jsx", () => {
    expect(getLanguage("my-file.jsx")).toBe("jsx");
  });

  test("typescript", () => {
    expect(getLanguage("my-file.ts")).toBe("typescript");
  });

  test("tsx", () => {
    expect(getLanguage("my-file.tsx")).toBe("tsx");
  });

  describe("json:", () => {
    test("json", () => {
      expect(getLanguage("my-file.json")).toBe("json");
    });
    test("babelrc", () => {
      expect(getLanguage("my-file.babelrc")).toBe("json");
    });
  });

  describe("markup", () => {
    test("html", () => {
      expect(getLanguage("my-file.html")).toBe("markup");
    });

    test("htm", () => {
      expect(getLanguage("my-file.htm")).toBe("markup");
    });

    test("svg", () => {
      expect(getLanguage("my-file.svg")).toBe("markup");
    });
    test("xml", () => {
      expect(getLanguage("my-file.xml")).toBe("markup");
    });
  });

  describe("yaml", () => {
    test("yaml", () => {
      expect(getLanguage("my-file.yaml")).toBe("yaml");
    });

    test("yml", () => {
      expect(getLanguage("my-file.yml")).toBe("yaml");
    });
  });

  test("bash", () => {
    expect(getLanguage("my-file.sh")).toBe("bash");
  });

  test("pyhton", () => {
    expect(getLanguage("my-file.py")).toBe("python");
  });

  test("sql", () => {
    expect(getLanguage("my-file.sql")).toBe("sql");
  });

  test("css", () => {
    expect(getLanguage("my-file.css")).toBe("css");
  });

  test("less", () => {
    expect(getLanguage("my-file.less")).toBe("less");
  });

  test("scss", () => {
    expect(getLanguage("my-file.scss")).toBe("scss");
  });

  describe("ini", () => {
    test("ini", () => {
      expect(getLanguage("my-file.ini")).toBe("ini");
    });

    test("editorconfig", () => {
      expect(getLanguage("my-file.editorconfig")).toBe("ini");
    });
  });

  test("bat", () => {
    expect(getLanguage("my-file.bat")).toBe("bat");
  });

  test("clojure", () => {
    expect(getLanguage("my-file.clj")).toBe("clojure");
  });

  test("coffeescript", () => {
    expect(getLanguage("my-file.coffee")).toBe("coffeescript");
  });

  test("clojure", () => {
    expect(getLanguage("my-file.clj")).toBe("clojure");
  });

  describe("cpp", () => {
    test("cpp", () => {
      expect(getLanguage("my-file.cpp")).toBe("cpp");
    });

    test("cc", () => {
      expect(getLanguage("my-file.cc")).toBe("cpp");
    });
  });

  test("csharp", () => {
    expect(getLanguage("my-file.cs")).toBe("csharp");
  });

  test("csp", () => {
    expect(getLanguage("my-file.csp")).toBe("csp");
  });

  test("diff", () => {
    expect(getLanguage("my-file.diff")).toBe("diff");
  });

  describe("docker", () => {
    test("long dockerfile", () => {
      expect(getLanguage("my-file.dockerfile")).toBe("docker");
    });

    test("dockerfile", () => {
      expect(getLanguage("Dockerfile")).toBe("docker");
    });
  });

  test("fsharp", () => {
    expect(getLanguage("my-file.fsharp")).toBe("fsharp");
  });

  test("go", () => {
    expect(getLanguage("my-file.go")).toBe("go");
  });

  test("haskell", () => {
    expect(getLanguage("my-file.hs")).toBe("haskell");
  });

  test("java", () => {
    expect(getLanguage("my-file.java")).toBe("java");
  });

  test("kotlin", () => {
    expect(getLanguage("my-file.kt")).toBe("kotlin");
  });

  test("lua", () => {
    expect(getLanguage("my-file.lua")).toBe("lua");
  });

  test("markdown", () => {
    expect(getLanguage("my-file.md")).toBe("markdown");
  });

  test("msdax", () => {
    expect(getLanguage("my-file.msdax")).toBe("msdax");
  });

  test("sql", () => {
    expect(getLanguage("my-file.mysql")).toBe("sql");
  });

  test("objective-c", () => {
    expect(getLanguage("my-file.objc")).toBe("objective-c");
  });

  test("pgsql", () => {
    expect(getLanguage("my-file.pgsql")).toBe("pgsql");
  });

  test("php", () => {
    expect(getLanguage("my-file.php")).toBe("php");
  });

  test("postiats", () => {
    expect(getLanguage("my-file.postiats")).toBe("postiats");
  });

  test("powershell", () => {
    expect(getLanguage("my-file.ps")).toBe("powershell");
  });

  test("pug", () => {
    expect(getLanguage("my-file.pug")).toBe("pug");
  });

  test("r", () => {
    expect(getLanguage("my-file.r")).toBe("r");
  });

  test("razor", () => {
    expect(getLanguage("my-file.razor")).toBe("razor");
  });

  test("reason", () => {
    expect(getLanguage("my-file.re")).toBe("reason");
  });

  test("ruby", () => {
    expect(getLanguage("my-file.rb")).toBe("ruby");
  });

  test("rust", () => {
    expect(getLanguage("my-file.rs")).toBe("rust");
  });

  test("small basic", () => {
    expect(getLanguage("my-file.smallbasic")).toBe("small basic");
  });

  test("scala", () => {
    expect(getLanguage("my-file.scala")).toBe("scala");
  });

  test("scheme", () => {
    expect(getLanguage("my-file.scheme")).toBe("scheme");
  });

  test("solidity", () => {
    expect(getLanguage("my-file.solidity")).toBe("solidity");
  });

  test("swift", () => {
    expect(getLanguage("my-file.swift")).toBe("swift");
  });

  test("toml", () => {
    expect(getLanguage("my-file.toml")).toBe("toml");
  });

  test("vb", () => {
    expect(getLanguage("my-file.vb")).toBe("vb");
  });

  test("wasm", () => {
    expect(getLanguage("my-file.wasm")).toBe("wasm");
  });
});

describe("Fallback scenarios", () => {
  test("Random file extension", () => {
    expect(getLanguage("my-file.nonsense")).toBe("js");
  });

  test("No file extension", () => {
    expect(getLanguage("my-file")).toBe("js");
  });

  test("Empty string", () => {
    expect(getLanguage("")).toBe("js");
  });
});

describe("Dependencies", () => {
  test("tsx", () => {
    expect(getLanguageDependencies("tsx")).toEqual(["jsx"]);
  });

  test("cpp", () => {
    expect(getLanguageDependencies("cpp")).toEqual(["c"]);
  });
});
