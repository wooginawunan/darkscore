import { useState } from "react";
import React from 'react';
import PlotlyPlot from './PlotlyPlot';

let SERVER: string = process.env.REACT_APP_SERVER_ADDRESS || "";


async function fetchSearchResults(query: string): Promise<Array<SearchResult>> {
  const response = await fetch(SERVER + "/tochatgpt", {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({ query }),
  });
  const responseJson = await response.json();
  if (responseJson.error !== null) {
    console.log("Fetch error:", responseJson.error);
    return [];
  } else {
    return responseJson.result;
  }
}

interface SearchResult {
    name: string;
    traits: string[];
    traitDescr: string[];
    scores: number[];
    ranks: number[];
  }

function App() {
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<Array<SearchResult>>([]);
  const [running, setRunning] = useState<boolean>(false);

  const runSearch: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (query.length > 0) {
      setData([]);
      setRunning(true);
      fetchSearchResults(query).then((data) => {
        setData(data);
      });
    }
  };

  return (
    <>
      <h1>Compare your Darkness to ChatGPT's</h1>
        <p> This is a tool to visualize your darkscore versus <a href="https://openai.com/chatgpt" target="_blank">ChatGPT</a>'s. </p>
        <p> Get your scores from <a href="https://qst.darkfactor.org/" target="_blank"> QST </a>  and submit your URL below (70 statements version survey required). </p>
        <p> No data saved and your privacy is preserved. </p>
        <br></br>

      <form onSubmit={runSearch}>
        <input
          type="text"
          placeholder="Put your URL here e.g.: https://qst.darkfactor.org/?site=pFBNzMyRHFSaWJ0MkY4TTUvTHlJdHRWUXJHY29WckpoaWhWNUhaNUFQTTMrR2htRW1tdkMyVkVQNDRSNVFjb2R2eQ "
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <input type="submit" value="Compare" />
      </form>
      <div className="result">
        {data.length > 0 && <PlotlyPlot userData={data} />}
      </div>
      <div className="footer">
        © 2023{" "}
        <a
          href="https://wooginawunan.github.io/"
          target="_blank"
          rel="noreferrer"
        >
           Nan Wu
        </a>
        . All rights reserved.
      </div>
    </>
  );
}

export default App;
