import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css';
import abi from './contracts/PokeNFT.json'
import metadata from './_metadata.json';
function App() {
  const contractABI = abi.abi;
  const CID = 'QmT98DkjBkctn18CwuDXXe3xyHgodzxeyKqkHnPJzRgmFc'
  const contractAddress = '0xD16A85d48C298bAE286cb82e370Ae9b19ca50059';



  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [WalletAddress, setWalletAddress] = useState('');
  const [nftSupply, setNftSupply] = useState(0);
  const [nftMintPrice, setNftMintPrice] = useState(0);
  const [mintStatus, setMintStatus] = useState("");
  const [openSeaProfile, setOpenSeaProfile] = useState('');

  // const provider = new ethers.providers.Web3Provider(window.ethereum)
  // const signer = provider.getSigner()
  // const enrollContract = new ethers.Contract(contractAddress, contractABI, signer)
  const handleWalletConnection = async () => {
    if (window.ethereum) {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setIsWalletConnected(true)
      setWalletAddress(account)
      setupEventListener()
    }
  }
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setWalletAddress(account)
      setIsWalletConnected(true)
      const { ethereum } = window;
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const goerliChainId = "0x5";
      if (chainId !== goerliChainId) {
        alert("You are not connected to the Goerli Test Network!");
      }

      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener()
    } else {
      console.log("No authorized account found")
    }
  }
  const getContractInfo = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(contractAddress, contractABI, signer);
      const nftSupply = await nftContract.MAX_SUPPLY();
      const mintPrice = await nftContract.MINT_PRICE();
      console.log('Total NFTS', parseInt(nftSupply));
      console.log('Mint price', parseInt(mintPrice));
      setNftSupply(parseInt(nftSupply));
      setNftMintPrice(ethers.utils.formatEther((mintPrice)));
      console.log(ethers.utils.formatEther((mintPrice)), "precio");
    } catch (error) {
      console.log(error);
    }
  }
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(contractAddress, contractABI, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          // alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${contractAddress}/${tokenId.toNumber()}`)
          alert(`Pixxiti: https://goerli.pixxiti.com/nfts/${contractAddress}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const mintToken = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makePokeNFT({ value: ethers.utils.parseEther(nftMintPrice.toString()) });

        console.log("Mining...please wait.")
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    getContractInfo()

  }, [isWalletConnected])

  return (
    <div>
      {
        isWalletConnected ? (
          <button onClick={() => {
            mintToken()
          }} >Mint nft </button>

        ) : (
          <button onClick={() => {
            handleWalletConnection()
          }} >Connect wallet </button>
        )
      }

    </div>
  );
}

export default App;
