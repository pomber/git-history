import React from "react";

function App({ commits }) {
  return <pre>{JSON.stringify(commits, null, 2)}</pre>;
}

export default App;
