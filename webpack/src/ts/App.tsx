import React from "react";
import { CircularProgress } from "@mui/material";

import Footer from "./Footer";
import GlobalStyle from "./GlobalStyle.css";

import css from "./App.css";

const worker = new Worker("worker.js");

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}

export default function App() {
  const publicKeyRef = React.useRef<HTMLInputElement | null>(null);
  const [fetchingSnapshot, setFetchingSnapshot] = React.useState(false);
  const [tableData, setTableData] = React.useState<null | any>(null);
  const [fingerPrint, setFingerPrint] = React.useState("");
  const [showError, setShowError] = React.useState("");
  const [learnMore, setLearnMore] = React.useState(false);
  const [progressBarWidth, setProgressBarWidth] = React.useState(0);
  const [lastIndex, setLastIndex] = React.useState();
  const publicKey = React.useRef();
  const balanceObject = React.useRef({});
  const rowCountLimit = React.useRef(0);

  function parseKeyFromUrl(key: string) {
    const parsedHash = new URLSearchParams(window.location.hash.substring(1));
    return parsedHash.get(key);
  }

  React.useEffect(() => {
    if (parseKeyFromUrl("publicKey")) {
      publicKey.current = parseKeyFromUrl("publicKey");
      worker.postMessage({ publicKeyText: publicKey.current, rowCountLimit: rowCountLimit.current });
      if (publicKeyRef.current) {
        publicKeyRef.current.value = parseKeyFromUrl("publicKey") as string;
        setTableData(null);
        setFetchingSnapshot(true);
        if (parseKeyFromUrl("fingerprint")) {
          setFingerPrint(parseKeyFromUrl("fingerprint") || "");
        }
      }
    }

    addEventListener("hashchange", (event) => {
      publicKey.current = parseKeyFromUrl("publicKey");
      publicKeyRef.current.value = publicKey.current;
      queryHash();
    });

    worker.onmessage = (messageEvent) => {
      const data = messageEvent.data;
      if (data.puzzleHashes) {
        if (data.error) {
          setShowError(data.error);
          setFetchingSnapshot(false);
        } else {
          let currentIndex = rowCountLimit.current;
          rowCountLimit.current = rowCountLimit.current + data.puzzleHashes.length;
          postData("/public-key", { puzzleHashes: data.puzzleHashes }).then((response) => {
            const newData = getTableArray(response.data);
            if (response.data.length) {
              setLastIndex(response.data[response.data.length - 1][5] + currentIndex);
            }
            setTableData(newData);
            setFetchingSnapshot(false);
          });
        }
      }
      if (data.numberOfHashes) {
        setProgressBarWidth((data.count / data.numberOfHashes) * 100);
      }
    };
  }, []);

  function queryHash() {
    setLastIndex(0);
    setShowError("");
    wipeTableData();
    if (!fetchingSnapshot) {
      const publicKeyText = publicKeyRef.current?.value;
      publicKey.current = publicKeyText;
      if (publicKeyText?.length !== 96) {
        setShowError("Public key should be 96 characters long.");
        setTableData(null);
        setFetchingSnapshot(false);
      } else {
        rowCountLimit.current = 0;
        worker.postMessage({ publicKeyText, rowCountLimit: rowCountLimit.current });
        setFetchingSnapshot(true);
        setTableData(null);
      }
    }
  }

  function renderWalletResults() {
    if (fetchingSnapshot) {
      return (
        <css.WalletResults>
          <css.ShadowedBox>
            <css.Gathering>
              <div>
                <CircularProgress color="inherit" disableShrink />
              </div>
              <div>Gathering on-chain data...</div>
              <css.ProgressBar>
                <div style={{ width: `${progressBarWidth}%` }}></div>
              </css.ProgressBar>
            </css.Gathering>
          </css.ShadowedBox>
        </css.WalletResults>
      );
    }
  }

  function getTableArray(responseData) {
    (responseData || []).forEach((row) => {
      const existing = balanceObject.current[row[1]];
      if (!existing) {
        balanceObject.current[row[1]] = [row[0], row[1], parseInt(row[2]), row[3], row[4]];
      } else {
        balanceObject.current[row[1]] = [existing[0], existing[1], existing[2] + parseInt(row[2]), existing[3], existing[4]];
      }
    });
    return Object.keys(balanceObject.current)
      .map((key) => {
        return balanceObject.current[key];
      })
      .sort((a, b) => {
        return a[3] > b[3] ? 1 : -1;
      });
  }

  function wipeTableData() {
    balanceObject.current = {};
    setTableData(null);
  }

  function renderTableRows() {
    return tableData.map((row, idx) => {
      const amount = Number(Number(row[2]) / 1000).toLocaleString();
      return (
        <tr key={row[0] + "|" + idx} onClick={() => window.open("https://www.taildatabase.com/tail/" + row[1], "_blank")}>
          <td>{row[4]}</td>
          <td>{row[3]}</td>
          <td>{amount}</td>
        </tr>
      );
    });
  }

  function renderWalletNumber() {
    if (!fingerPrint) return null;
    return (
      <css.WalletNumberContainer>
        <css.WalletNumber>Wallet {fingerPrint}</css.WalletNumber>
      </css.WalletNumberContainer>
    );
  }

  function renderShowMoreResults() {
    return (
      <css.MoreResults>
        <div>Searched through {rowCountLimit.current} receive addresses.</div>
        <div>
          Derivation index: <b>{lastIndex}</b>
        </div>
        <div>
          <span>Not seeing everything? Try searching additional wallet addresses</span>
          <button
            className="outline-green-button"
            onClick={() => {
              worker.postMessage({ publicKeyText: publicKey.current, rowCountLimit: rowCountLimit.current });
              setFetchingSnapshot(true);
            }}
          >
            Search next 1000
          </button>
        </div>
      </css.MoreResults>
    );
  }

  function renderTableContainer() {
    if (!tableData || fetchingSnapshot) {
      return null;
    } else {
      return (
        <css.WalletResults>
          {renderWalletNumber()}
          <css.ShadowedBox>
            {tableData.length ? (
              <css.TableStyled>
                <thead>
                  <tr>
                    <th>Token Name</th>
                    <th>Ticker Symbol</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </css.TableStyled>
            ) : (
              <div>No CATs found.</div>
            )}
          </css.ShadowedBox>
          {renderShowMoreResults()}
        </css.WalletResults>
      );
    }
  }

  function renderError() {
    if (showError) {
      return <css.ErrorMessage>Error: {showError}</css.ErrorMessage>;
    }
    return null;
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      location.hash = "#publicKey=" + publicKeyRef.current?.value;
      e.preventDefault();
    }
  }

  function renderLearnMoreBody() {
    if (!learnMore) return null;
    return (
      <css.LearnMore>
        <h2>Find your public key in the Chia App interface</h2>
        <h3>Step 1</h3>
        <h4>
          <css.TextEyeIcon>
            On the “Select Key” screen in the Chia app, click on the “See Private Key” icon <img src="/img/eye.svg" />
          </css.TextEyeIcon>
        </h4>
        <img src="/img/select-key.png" />
        <h3>Step 2</h3>
        <h4>Copy the Public Key from the list of keys available. </h4>
        <img src="/img/public-key.png" />
        <h2>Find your public key from the Command Line</h2>
        <h3>Step 1</h3>
        <h4>Type in “chia keys show”</h4>
        <h3>Step 2</h3>
        <h4>Copy the “Master Public Key” that is displayed as an output.</h4>
      </css.LearnMore>
    );
  }

  return (
    <css.Container>
      <GlobalStyle />
      <css.Header>
        <img src="/img/branding/chia-logo.svg" alt="Chia Network Logo" />
      </css.Header>
      <div className="pg-title">
        <div className="col-10-container">
          <h1>CAT1 Token balance</h1>
        </div>
      </div>
      <css.Content>
        <div className="col-8-container txt-col-blocks">
          <div className="full-width-col">
            <p className="lrg-txt">Chia's token standard has been updated to CAT2. As a result, the original issuers will airdrop the updated CAT tokens to your wallet starting July 26th, 2022, 17:00 UTC.</p>
            <p>This site will help you understand your balance at the time the snapshot was taken. Any transactions that settled after the snapshot won’t be accounted for in the balances reported here.</p>
          </div>
        </div>
      </css.Content>
      <css.SearchContainer>
        <css.Search>
          <p>Search for a wallet public key</p>
          <css.SearchInput>
            <input type="text" name="key" ref={publicKeyRef} onKeyDown={handleKeyDown} />
            <css.SearchButton
              onClick={() => {
                location.hash = "#publicKey=" + publicKeyRef.current?.value;
              }}
            >
              Get my snapshot
            </css.SearchButton>
          </css.SearchInput>
          {renderError()}
          <div>
            <p>This website only supports looking up wallets with observer keys. Any wallet created since 1.3 uses an observer key by default.</p>
            <css.LearnMoreLink onClick={() => setLearnMore(!learnMore)}>
              <span>Learn how to find your public key here.</span>
              <css.LearnMoreArrow src="/img/arrow_down.svg" alt="Chia Network Logo" learnMore={learnMore} />
            </css.LearnMoreLink>
            {renderLearnMoreBody()}
          </div>
          <p>
            Public keys are 96 characters long. It should look like this:
            <br />
            <css.Grey>a95db0f87574d1af5991f93df7d36f40ccadf6c403889ae5987f6013a28caa150d6bbc24493889c61a4829c1656d7e88</css.Grey>
          </p>
        </css.Search>
      </css.SearchContainer>
      {renderWalletResults()}
      {renderTableContainer()}
      <css.DownloadSnapshotDb>
        <small>
          You can also <a href="/cat1_snapshot_2311763.csv">download the snapshot database</a> if you want to explore deeper.
        </small>
      </css.DownloadSnapshotDb>

      <Footer />
    </css.Container>
  );
}
