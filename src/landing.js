import React from "react";
import demo from "./demo.gif";

export default function Landing() {
  const url = `${window.location.protocol}//${
    window.location.host
  }/babel/babel/blob/master/packages/babel-core/test/browserify.js`;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        padding: "10px 20px 0",
        boxSizing: "border-box"
      }}
    >
      <img src={demo} alt="demo" style={{ width: 900, maxWidth: "100%" }} />
      <h1>Git History</h1>
      <div>
        <div>
          Quickly browse the history of any GitHub file (GitLab and Bitbucket{" "}
          <a href="https://github.com/pomber/git-history/issues/14">
            coming soon
          </a>
          ):
          <ol>
            <li>
              Replace <strong>github.com</strong> with{" "}
              <strong>github.githistory.xyz</strong> in any file url
            </li>
            <li>There's no step two</li>
          </ol>
          <a href={url}>Try it</a>
        </div>
        <p>
          You can also add an <strong>Open in Git History</strong> button to
          GitHub with the{" "}
          <a href="https://chrome.google.com/webstore/detail/github-history-browser-ex/laghnmifffncfonaoffcndocllegejnf">
            Chrome
          </a>{" "}
          and{" "}
          <a href="https://addons.mozilla.org/es/firefox/addon/github-history/">
            Firefox
          </a>{" "}
          extensions.
        </p>
        <h2>CLI</h2>
        For local git repos use the{" "}
        <a href="https://github.com/pomber/git-history/tree/master/cli">CLI</a>.
        <h2>Sponsors</h2>
        <p>
          No sponsors yet.{" "}
          <a href="https://opencollective.com/git-history/donate">
            Become a sponsor
          </a>{" "}
          to help us ship more features!
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "20px"
          }}
        >
          <a
            href="https://opencollective.com/git-history/donate"
            target="_blank"
          >
            <img
              src="https://opencollective.com/git-history/donate/button.png?color=white"
              width="300"
              alt="donate"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
