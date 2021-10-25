
import { PageHeader } from "antd";
//import React from "react";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "antd";

import { Account, GasGauge } from "../components";
const { ethers } = require("ethers");

// displays a page header

export default function Header({
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
  faucetTx,
  targetNetworkName,
  targetNetworkColor,
  gasPrice,
}) {

  let faucetHint = "";
  //const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  const [faucetClicked, setFaucetClicked] = useState(false);
  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId === 31337 /*&&
    yourLocalBalance &&
    ethers.utils.formatEther(yourLocalBalance) <= 0*/
  ) {
    faucetHint = (
      <div style={{ padding: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            faucetTx({
              to: address,
              value: ethers.utils.parseEther("0.01"),
            });
            setFaucetClicked(true);
          }}
        >
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    );
  }

  return (
    <div className="row">
    <div className="col-6">
    <a href="https://github.com/julienbrg/regen" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🏗 regen"
        subTitle="Regen Generative Art NFT"
        style={{ cursor: "pointer" }}
      />
    </a>
    <div style={{ padding: 10, color: targetNetworkColor ,fontSize: '20px' }}>{targetNetworkName}&nbsp;&nbsp;&nbsp;<GasGauge gasPrice={gasPrice}/></div>
    </div>
      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{textAlign: "right", right: 0, top: 0, padding: 10 }} className="col-6">
        <Account
          address={address}
          localProvider={localProvider}
          userSigner={userSigner}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
        {faucetHint}
      </div>
    </div>
  );
}
