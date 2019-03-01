const filenameRegex = [
  { lang: "js", regex: /\.js$/i },
  { lang: "jsx", regex: /\.jsx$/i },
  { lang: "typescript", regex: /\.ts$/i },
  { lang: "tsx", regex: /\.tsx$/i },
  { lang: "json", regex: /\.json$|.babelrc$/i },
  { lang: "yaml", regex: /\.yaml$|.yml$/i },
  { lang: "bash", regex: /\.sh$/i },
  { lang: "python", regex: /\.py$/i },
  { lang: "dart", regex: /\.dart$/i },
  { lang: "perl", regex: /\.pl$|.pm$/i },
  { lang: "assembly", regex: /\.asm$/i },
  { lang: "groovy", regex: /\.groovy$/i },
  { lang: "sql", regex: /\.sql$/i },
  { lang: "css", regex: /\.css$/i },
  { lang: "less", regex: /\.less$/i },
  { lang: "scss", regex: /\.scss$/i },
  { lang: "ini", regex: /\.ini$|.editorconfig$/i },
  { lang: "markup", regex: /\.xml$|\.html$|\.htm$|\.svg$|\.mathml$/i },
  { lang: "bat", regex: /\.bat$/i },
  { lang: "clojure", regex: /\.clj$/i },
  { lang: "coffeescript", regex: /\.coffee$/i },
  { lang: "cpp", regex: /\.cpp$|\.cc$/i },
  { lang: "csharp", regex: /\.cs$/i },
  { lang: "csp", regex: /\.csp$/i },
  { lang: "diff", regex: /\.diff$/i },
  { lang: "docker", regex: /dockerfile$/i },
  { lang: "fsharp", regex: /\.fsharp$/i },
  { lang: "go", regex: /\.go$/i },
  { lang: "handlebars", regex: /\.hbs$/i },
  { lang: "haskell", regex: /\.hs$/i },
  { lang: "java", regex: /\.java$/i },
  { lang: "kotlin", regex: /\.kt$/i },
  { lang: "lua", regex: /\.lua$/i },
  { lang: "markdown", regex: /\.md$/i },
  { lang: "msdax", regex: /\.msdax$/i },
  { lang: "sql", regex: /\.mysql$/i },
  { lang: "objective-c", regex: /\.objc$/i },
  { lang: "pgsql", regex: /\.pgsql$/i },
  { lang: "php", regex: /\.php$/i },
  { lang: "postiats", regex: /\.postiats$/i },
  { lang: "powershell", regex: /\.ps$/i },
  { lang: "pug", regex: /\.pug$/i },
  { lang: "r", regex: /\.r$/i },
  { lang: "razor", regex: /\.razor$/i },
  { lang: "reason", regex: /\.re$/i },
  { lang: "ruby", regex: /\.rb$/i },
  { lang: "rust", regex: /\.rs$/i },
  { lang: "small basic", regex: /\.smallbasic$/i },
  { lang: "scala", regex: /\.scala$/i },
  { lang: "scheme", regex: /\.scheme$/i },
  { lang: "solidity", regex: /\.solidity$/i },
  { lang: "st", regex: /\.st$/i },
  { lang: "swift", regex: /\.swift$/i },
  // { lang: "toml", regex: /\.toml$/i },
  { lang: "vb", regex: /\.vb$/i },
  { lang: "wasm", regex: /\.wasm$/i },
  // fallback
  { lang: "js", regex: /.*/i }
];

export function getLanguage(filename) {
  return filenameRegex.find(x => x.regex.test(filename)).lang;
}

const dependencies = {
  cpp: ["c"],
  tsx: ["jsx"],
  scala: ["java"]
};

export function getLanguageDependencies(lang) {
  return dependencies[lang];
}

export function loadLanguage(lang) {
  if (["js", "css", "html"].includes(lang)) {
    return Promise.resolve();
  }

  const deps = getLanguageDependencies(lang);

  let depPromise = import("prismjs");

  if (deps) {
    depPromise = depPromise.then(() =>
      Promise.all(deps.map(dep => import(`prismjs/components/prism-${dep}`)))
    );
  }

  return depPromise.then(() => import(`prismjs/components/prism-${lang}`));
}
