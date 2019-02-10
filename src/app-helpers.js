import React, { useState, useEffect } from "react";
import { getLanguage, loadLanguage } from "./language-detector";

export function Center({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "0 40px"
      }}
    >
      {children}
    </div>
  );
}

export function Loading({ repo, path }) {
  return (
    <Center>
      <p>
        Loading <strong>{path}</strong> history {repo ? "from " + repo : ""}...
      </p>
    </Center>
  );
}

export function useLanguageLoader(path) {
  const [loadedLang, setLang] = useState(false);

  useEffect(() => {
    const lang = getLanguage(path);
    loadLanguage(lang).then(() => setLang(lang));
  }, [path, setLang]);

  return loadedLang;
}
