import React from "react";
import History from "./history";

function App({ commits }) {
  console.log(commits);
  return <History commits={commits} />;
}

export default App;
