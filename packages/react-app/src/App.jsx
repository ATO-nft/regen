
import WalletConnectProvider from "@walletconnect/web3-provider";
//import Torus from "@toruslabs/torus-embed"
import WalletLink from "walletlink";
import { Alert, Button, Card, Col, Input, List, Menu, Row } from "antd";
import "antd/dist/antd.css";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { BrowserRouter, Link, Route, Switch, Redirect } from "react-router-dom";
import Web3Modal from "web3modal";
import "./App.css";
import { Account, Address, AddressInput, Contract, Faucet, GasGauge, Header , Ramp, ThemeSwitch, AlegraV3 } from "./components";
import { INFURA_ID, NETWORK, NETWORKS } from "./constants";
import { Transactor } from "./helpers";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  usePoller,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";

import { useContractConfig } from "./hooks";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
import Authereum from "authereum";

// svg
import createSvg from "./components/AlegraV3";

const { ethers } = require("ethers");
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/scaffold-eth/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

let startApp = true;

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.velas; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet, velas, ...)

// 😬 Sorry for all the console logging
const DEBUG = false;
const NETWORKCHECK = true;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544")
  : null;
const poktMainnetProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider(
      "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
    )
  : null;
const mainnetInfura = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
  : null;
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID
// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

// Coinbase walletLink init
const walletLink = new WalletLink({
  appName: "coinbase",
});

// WalletLink provider
const walletLinkProvider = walletLink.makeWeb3Provider(`https://mainnet.infura.io/v3/${INFURA_ID}`, 1);

// Portis ID: 6255fb2b-58c8-433b-a2c9-62098c05ddc9
/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  network: "tesnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
  cacheProvider: true, // optional
  theme: "light", // optional. Change to "dark" for a dark theme.
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        bridge: "https://polygon.bridge.walletconnect.org",
        infuraId: INFURA_ID,
        rpc: {
          1: `https://mainnet.infura.io/v3/${INFURA_ID}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
          4: `https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
          42: `https://kovan.infura.io/v3/${INFURA_ID}`,
          100: "https://dai.poa.network", // xDai,
          111: "https://evmexplorer.testnet.velas.com/rpc",
        },
      },
    },
    portis: {
      display: {
        logo: "https://user-images.githubusercontent.com/9419140/128913641-d025bc0c-e059-42de-a57b-422f196867ce.png",
        name: "Portis",
        description: "Connect to Portis App",
      },
      package: Portis,
      options: {
        id: "6255fb2b-58c8-433b-a2c9-62098c05ddc9",
      },
    },
    fortmatic: {
      package: Fortmatic, // required
      options: {
        key: "pk_live_5A7C91B2FC585A17", // required
      },
    },
    // torus: {
    //   package: Torus,
    //   options: {
    //     networkParams: {
    //       host: "https://localhost:8545", // optional
    //       chainId: 1337, // optional
    //       networkId: 1337 // optional
    //     },
    //     config: {
    //       buildEnv: "development" // optional
    //     },
    //   },
    // },
    "custom-walletlink": {
      display: {
        logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
        name: "Coinbase",
        description: "Connect to Coinbase Wallet (not Coinbase App)",
      },
      package: walletLinkProvider,
      connector: async (provider, _options) => {
        await provider.enable();
        return provider;
      },
    },
    authereum: {
      package: Authereum, // required
    },
  },
});

function App(props) {
  const mainnetProvider =
    poktMainnetProvider && poktMainnetProvider._isProvider
      ? poktMainnetProvider
      : scaffoldEthProvider && scaffoldEthProvider._network
      ? scaffoldEthProvider
      : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  const contractConfig = useContractConfig();

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // call every 1500 seconds.
/*   usePoller(() => {
    updateLoogieTanks();
  }, 1500000); */

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts, "DAI", "balanceOf", [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ]);

  // keep track of a variable from the contract in the local React state:
  const loogieBalance = useContractReader(readContracts, "Loogies", "balanceOf", [address]);
  console.log("🤗 loogie balance:", loogieBalance);

/*   const loogieTankBalance = useContractReader(readContracts, "LoogieTank", "balanceOf", [address]);
  console.log("🤗 loogie tank balance:", loogieTankBalance); */

  // 📟 Listen for broadcast events
  const loogieTransferEvents = useEventListener(readContracts, "Loogies", "Transfer", localProvider, 1);
  if (DEBUG) console.log("📟 Loogie Transfer events:", loogieTransferEvents);

/*   const loogieTankTransferEvents = useEventListener(readContracts, "LoogieTank", "Transfer", localProvider, 1);
  console.log("📟 Loogie Tank Transfer events:", loogieTankTransferEvents); */

  //
  // 🧠 This effect will update yourCollectibles by polling when your balance changes
  //
  const yourLoogieBalance = loogieBalance && loogieBalance.toNumber && loogieBalance.toNumber();
  const [yourLoogies, setYourLoogies] = useState();

  /* const yourLoogieTankBalance = loogieTankBalance && loogieTankBalance.toNumber && loogieTankBalance.toNumber();
  const [yourLoogieTanks, setYourLoogieTanks] = useState();

  async function updateLoogieTanks() {
    const loogieTankUpdate = [];
    for (let tokenIndex = 0; tokenIndex < yourLoogieTankBalance; tokenIndex++) {
      try {
        console.log("Getting token index", tokenIndex);
        const tokenId = await readContracts.LoogieTank.tokenOfOwnerByIndex(address, tokenIndex);
        console.log("tokenId", tokenId);
        const tokenURI = await readContracts.LoogieTank.tokenURI(tokenId);
        console.log("tokenURI", tokenURI);
        const jsonManifestString = atob(tokenURI.substring(29));
        console.log("jsonManifestString", jsonManifestString);

        try {
          const jsonManifest = JSON.parse(jsonManifestString);
          console.log("jsonManifest", jsonManifest);
          loogieTankUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
        } catch (e) {
          console.log(e);
        }
      } catch (e) {
        console.log(e);
      }
    }
    setYourLoogieTanks(loogieTankUpdate.reverse());
  } */

  useEffect(() => {
    const updateYourCollectibles = async () => {
      const loogieUpdate = [];
      for (let tokenIndex = 0; tokenIndex < yourLoogieBalance; tokenIndex++) {
        try {
          console.log("Getting token index", tokenIndex);
          const tokenId = await readContracts.Loogies.tokenOfOwnerByIndex(address, tokenIndex);
          console.log("tokenId", tokenId);
          const tokenURI = await readContracts.Loogies.tokenURI(tokenId);
          console.log("tokenURI", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29));
          console.log("jsonManifestString", jsonManifestString);
        /*
          const ipfsHash = tokenURI.replace("https://ipfs.io/ipfs/", "");
          console.log("ipfsHash", ipfsHash);
          const jsonManifestBuffer = await getFromIPFS(ipfsHash);
        */
          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            console.log("jsonManifest", jsonManifest);
            loogieUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setYourLoogies(loogieUpdate.reverse());
/*       updateLoogieTanks(); */
    };
    updateYourCollectibles();
/*   }, [address, yourLoogieBalance, yourLoogieTankBalance]); */
}, [address, yourLoogieBalance]);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
  ]);

  let networkDisplay = "";
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network ID"
            description={
              <div>
                You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
                HardHat.
                <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    } else {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network"
            description={
              <div>
                You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
                <Button
                  onClick={async () => {
                    const ethereum = window.ethereum;
                    const data = [
                      {
                        chainId: "0x" + targetNetwork.chainId.toString(16),
                        chainName: targetNetwork.name,
                        nativeCurrency: targetNetwork.nativeCurrency,
                        rpcUrls: [targetNetwork.rpcUrl],
                        blockExplorerUrls: [targetNetwork.blockExplorer],
                      },
                    ];
                    console.log("data", data);

                    let switchTx;
                    // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
                    try {
                      switchTx = await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: data[0].chainId }],
                      });
                    } catch (switchError) {
                      // not checking specific error code, because maybe we're not using MetaMask
                      try {
                        switchTx = await ethereum.request({
                          method: "wallet_addEthereumChain",
                          params: data,
                        });
                      } catch (addError) {
                        // handle "add" error
                      }
                    }

                    if (switchTx) {
                      console.log(switchTx);
                    }
                  }}
                >
                  <b>{networkLocal && networkLocal.name}</b>
                </Button>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    }
  } /*else {
    networkDisplay = (
      <div style={{ right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
        {targetNetwork.name}
      </div>
    );
  }*/

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;
  /* let faucetHint = "";

  const [faucetClicked, setFaucetClicked] = useState(false);
  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId === 31337 &&
    yourLocalBalance &&
    ethers.utils.formatEther(yourLocalBalance) <= 0
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
  }*/

  
  const [clicked, setClicked] = useState('PopupColor NoPopupColor');

  let affColorPopup = false;
  let svgNumForm = 0;
  let svgSpeed = [3, 7, 10, 11, 13];
  //                    FACE TOP ;          FACE BOTTOM ;         BACKGROUND ;            DISK BOTTOM ;         DISK TOP
  let svgColor = ['#04006C', '#EE0C0E', '#04006C', '#00FFE8', '#04006C', '#2830FF' , '#04006C', '#FAEBF0', '#04006C', '#CFF0EB'];
  // FACE TOP : #04006C #640C98 #9C005E #E1005E #D3162E #EE0C0E
  // FACE BOTTOM : #04006C #0419D1 #00C4FF #00E6FF #00F8FF #00FFE8
  // BACKGROUND : #04006C #2000A2 #371BA4 #1114BF #0C0E80 #2830FF
  // DISK BOTTOM : #04006C #5647B2 #9991D1 #BBB6E0 #DDDAF0 #FAEBF0 
  // DISK TOP : #04006C #04466C #04909A #40C2AE #6FD1C2 #CFF0EB
  const colorsTabs = [
    ['#04006C', '#640C98', '#9C005E', '#E1005E', '#D3162E', '#EE0C0E'],
    ['#04006C', '#0419D1', '#00C4FF', '#00E6FF', '#00F8FF', '#00FFE8'],
    ['#04006C', '#2000A2', '#371BA4', '#1114BF', '#0C0E80', '#2830FF'],
    ['#04006C', '#5647B2', '#9991D1', '#BBB6E0', '#DDDAF0', '#FAEBF0'],
    ['#04006C', '#04466C', '#04909A', '#40C2AE', '#6FD1C2', '#CFF0EB']
  ];

  let svgSetSpeed = 0;
  let svgSetColorStart = '';
  let svgSetColorEnd = '';

  const handleChange = (svgData, e) => {
    if (svgData == 0) {
      svgSetSpeed = e.target.value;
    }
    if (svgData == 1) {
      svgSetColorStart = e.target.value;
    }
    if (svgData == 2) {
      svgSetColorEnd = e.target.value;
    }
  }

  const inputSpeed = useRef();

  const setColor = (numForm) => {
    //alert("Clic on setColor");
    setClicked('PopupColor');
    svgNumForm = numForm;
    console.log("numForm: " + numForm);

    console.log("inputSpeed defaultValue: " + inputSpeed.current.defaultValue);
    inputSpeed.current.defaultValue = svgSpeed[numForm];
    console.log("inputSpeed defaultValue next: " + inputSpeed.current.defaultValue);
    //useForceRender();
    //render();

    //defaultValue

    //affColorPopup = true;
    //colorPopup();
    //setState({});
/*
    popupColor = (
      <div style={{ position: "absolute", right: 100, top: 100 }} className="PopupColor">
        <span>Popup Color</span>
      </div>
    );
*/
  }

  const validColor = () => {
    setClicked('PopupColor NoPopupColor');
    svgSpeed[svgNumForm] = svgSetSpeed;
    svgColor[(svgNumForm * 2)] = svgSetColorStart;
    svgColor[(svgNumForm * 2) + 1] = svgSetColorEnd;
  }

  // modif svg pour setColorToForm
  //console.log(this.myRef.current.getValue());


  //colorPopup
  function colorPopup() {
    if (!affColorPopup) return(''); 
    alert("colorPopup");
      return (
      <div style={{ position: "absolute", right: 100, top: 100, backgroundColor: '#ff0000' }} className="PopupColor">
        <span>Popup Color</span>
      </div>
      );
    affColorPopup = false;
  }


  const [transferToAddresses, setTransferToAddresses] = useState({});
/*   const [transferToTankId, setTransferToTankId] = useState({}); */

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header 
          address={address}
          localProvider={localProvider}
          userSigner={userSigner}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
          faucetTx={faucetTx}
          targetNetworkName={targetNetwork.name}
          targetNetworkColor={targetNetwork.color}
          gasPrice={gasPrice}/>
      {networkDisplay}

      <BrowserRouter>
        {/*
        <Menu style={{ textAlign: "center" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link
              onClick={() => {
                setRoute("/");
              }}
              to="/"
            >
              Loogies
            </Link>
          </Menu.Item>
          <Menu.Item key="/loogietank">
            <Link
              onClick={() => {
                setRoute("/loogietank");
              }}
              to="/loogietank"
            >
              Loogie Tank
            </Link>
          </Menu.Item>
          <Menu.Item key="/mintloogies">
            <Link
              onClick={() => {
                setRoute("/mintloogies");
              }}
              to="/mintloogies"
            >
              Mint Loogies
            </Link>
          </Menu.Item>
          <Menu.Item key="/mintloogietank">
            <Link
              onClick={() => {
                setRoute("/mintloogietank");
              }}
              to="/mintloogietank"
            >
              Mint Loogie Tank
            </Link>
          </Menu.Item>
        </Menu> */}

        <Switch>
          <Route exact path="/">
            {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}

            <Contract
              name="Loogies"
              customContract={writeContracts && writeContracts.Loogies}
              signer={userSigner}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
              contractConfig={contractConfig}
            />
            <Redirect from="/" to="mintloogies"/>
          </Route>
          {/* <Route exact path="/loogietank">
            <Contract
              name="LoogieTank"
              signer={userSigner}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
              contractConfig={contractConfig}
            />
          </Route> data:image/svg+xml;base64,*/}
         <Route exact path="/mintloogies">

            <div style={{ maxWidth: 400, margin: "auto", paddingBottom: 10 }}>
              <div className="ListImage" style={{minHeight: 100}}>
                <img src={createSvg()} />
              </div>
            </div>

            {/*svgNumForm*/}
            <div style={{ maxWidth: 400, margin: "auto", paddingBottom: 10 }}  className={clicked} >
              <div style={{ paddingTop: 10, paddingBottom: 10 }}><h4>Animate Color</h4></div>
              <div className="row" style={{marginBottom: 10}}>
                <div className="col-6 justify-content-end" style={{ paddingRight: 10 }} ><label>Speed:</label></div>
                <div className="col-6 justify-content-start">
                  <input ref={inputSpeed} style={{ color: '#000', width: '50%' }} type="number" min="0" max="30" defaultValue="8" onChange={(e) => { handleChange(0, e); }} />
                </div>
              </div>

              <div className="row style={{marginBottom: 5}}">
                <div className="col-6 justify-content-end"><label style={{ paddingRight: 10 }} >Color Start:</label></div>
                <div className="col-3 justify-content-start">
                  <select style={{ color: '#000', width: '90%' }} defaultValue="0" onChange={(e) => { handleChange(1, e); }} >

                    <option value={0} key={0}>
                      {'years'}
                    </option>

                  </select>
                  </div>
                  <div className="col-3 justify-content-start" style={{ backgroundColor: 'blue', minWith: 50, maxWidth: 70, border: 'solid', borderWidth: '1px', borderColor: 'white' }}>&nbsp;</div>
              </div>

              <div><span>btn Color</span></div>
              
              <div className="row" style={{marginBottom: 20}} >
              <div className="col-6 justify-content-end">
              <Button style={{ marginTop: 20, marginRight: 20 }} type={"primary"} onClick={() => {
                setClicked('PopupColor NoPopupColor')
              }}>Cancel</Button>
              </div>
              <div className="col-6 justify-content-start">
              <Button style={{ marginTop: 20, marginLeft: 20 }} type={"primary"} onClick={() => {
                validColor()
              }}>Valid</Button>
              </div>
              </div>

            </div>
            <div>
            {/*colorPopup()*/}
            </div>

{/*
            <div style={{ maxWidth: 400, margin: "auto", paddingBottom: 10 }}>
              <div className="ListImage" style={{minHeight: 100}}>
                <img src={createSvg()} />
              </div>
            </div>
*/}

            <div style={{ maxWidth: 800, margin: "auto" }}>
              <Button style={{ marginTop: 10 }} type={"primary"} onClick={() => {
                setColor(2)
              }}>Background Color</Button>
              <Button style={{ marginLeft: 10, marginTop: 10 }} type={"primary"} onClick={() => {
                setColor(0)
              }}>Face Top Color</Button>
              <Button style={{ marginLeft: 10, marginTop: 10 }} type={"primary"} onClick={() => {
                setColor(1)
              }}>Face Bottom Color</Button>
              <Button style={{ marginLeft: 10, marginTop: 10 }} type={"primary"} onClick={() => {
                setColor(4)
              }}>Disk Top Color</Button>
              <Button style={{ marginLeft: 10, marginTop: 10 }} type={"primary"} onClick={() => {
                setColor(3)
              }}>Disk Bottom Color</Button>
            </div>


            <div style={{ maxWidth: 400, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
              <Button type={"primary"} onClick={() => {
                tx(writeContracts.Loogies.mintItem())
              }}>MINT</Button>
            </div>
            {/* */}
            <div style={{ maxWidth: 400, margin: "auto", paddingBottom: 256 }}>
              <List
                /*bordered*/
                dataSource={yourLoogies}
                renderItem={item => {
                  const id = item.id.toNumber();

                  if (DEBUG) console.log("IMAGE",item.image);

                  return (
                    <div className="ListImage">
                    <List.Item key={id + "_" + item.uri + "_" + item.owner} className="justify-content-center">
                      <div>
                        <div>
                          <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                        </div>
                        <img src={item.image} />
                        <div>{item.description}</div>
                      </div>

                      {/* <div>
                        owner:{" "}
                        <Address
                          address={item.owner}
                          ensProvider={mainnetProvider}
                          blockExplorer={blockExplorer}
                          fontSize={16}
                        />
                        <AddressInput
                          ensProvider={mainnetProvider}
                          placeholder="transfer to address"
                          value={transferToAddresses[id]}
                          onChange={newValue => {
                            const update = {};
                            update[id] = newValue;
                            setTransferToAddresses({ ...transferToAddresses, ...update });
                          }}
                        />
                        <Button
                          onClick={() => {
                            console.log("writeContracts", writeContracts);
                            tx(writeContracts.Loogies.transferFrom(address, transferToAddresses[id], id));
                          }}
                        >
                          Transfer
                        </Button>
                        <br/><br/>
                        Transfer to Loogie Tank:{" "}
                        <Address
                          address={readContracts.LoogieTank.address}
                          blockExplorer={blockExplorer}
                          fontSize={16}
                        />
                        <Input
                          placeholder="Tank ID"
                          // value={transferToTankId[id]}
                          onChange={newValue => {
                            console.log("newValue", newValue.target.value);
                            const update = {};
                            update[id] = newValue.target.value;
                            setTransferToTankId({ ...transferToTankId, ...update});
                          }}
                        />
                        <Button
                          onClick={() => {
                            console.log("writeContracts", writeContracts);
                            console.log("transferToTankId[id]", transferToTankId[id]);
                            console.log(parseInt(transferToTankId[id]));

                            const tankIdInBytes = "0x" + parseInt(transferToTankId[id]).toString(16).padStart(64,'0');
                            console.log(tankIdInBytes);

                            tx(writeContracts.Loogies["safeTransferFrom(address,address,uint256,bytes)"](address, readContracts.LoogieTank.address, id, tankIdInBytes));
                          }}>
                          Transfer
                        </Button>
                      </div> */}
                    </List.Item>
                    </div>
                  );
                }}
              />
            </div>
            {/* */}

            
          </Route>
           {/* <Route exact path="/mintloogietank"> */}
            {/*<div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
              <Button type={"primary"} onClick={() => {
                tx(writeContracts.LoogieTank.mintItem())
              }}>MINT</Button>
              <Button onClick={() => updateLoogieTanks()}>Refresh</Button>
            </div>

             <div style={{ width: 820, margin: "auto", paddingBottom: 256 }}>
              <List
                bordered
                dataSource={yourLoogieTanks}
                renderItem={item => {
                  const id = item.id.toNumber();

                  console.log("IMAGE",item.image);

                  return (
                    <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                      <Card
                        title={
                          <div>
                            <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                          </div>
                        }
                      >
                        <img src={item.image} />
                        <div>{item.description}</div>
                      </Card>

                      <div>
                        owner:{" "}
                        <Address
                          address={item.owner}
                          ensProvider={mainnetProvider}
                          blockExplorer={blockExplorer}
                          fontSize={16}
                        />
                        <AddressInput
                          ensProvider={mainnetProvider}
                          placeholder="transfer to address"
                          value={transferToAddresses[id]}
                          onChange={newValue => {
                            const update = {};
                            update[id] = newValue;
                            setTransferToAddresses({ ...transferToAddresses, ...update });
                          }}
                        />
                        <Button
                          onClick={() => {
                            console.log("writeContracts", writeContracts);
                            tx(writeContracts.Loogies.transferFrom(address, transferToAddresses[id], id));
                          }}
                        >
                          Transfer
                        </Button>
                        <br/><br/>
                        <Button
                          onClick={() => {
                            tx(writeContracts.LoogieTank.returnAllLoogies(id))
                          }}>
                          Eject Loogies
                        </Button>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </div> */}
         {/*  </Route> */}
        </Switch>
      </BrowserRouter>

      <ThemeSwitch />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      {/* <div style={{position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
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
      </div> */}

    </div>
  );
}

export default App;