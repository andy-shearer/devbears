import styles from "../styles/Home.module.css"
import Footer from "../components/Footer"
import Head from "next/head"
import Image from 'next/image'
import { Contract, providers, utils } from "ethers"
import { useEffect, useState, useRef } from "react"
import Web3Modal from "web3modal"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants"

export default function Home() {
  const [ walletConnected, setWalletConnected ] = useState(false);
  const [ bearsMinted, setBearsMinted ] = useState("0");
  const [ loading, setLoading ] = useState(false);
  const web3ModalRef = useRef();

  useEffect(() => {
    if(!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false
      });
    }

    connectWallet();
  }, [walletConnected]);

  /**
   * Attempt to obtain the provider, which will prompt wallet connection when used for the first time
   */
  const connectWallet = async () => {
    try {
      const provider = await getProviderOrSigner(false);
      setWalletConnected(true);
      console.debug("Wallet has been successfully connected");
    } catch (err) {
      window.alert("An error occurred, see console for details");
      console.log(err);
    }
  }

  const getProviderOrSigner = async (signer) => {
    const instance = await web3ModalRef.current.connect();
    const provider = new providers.Web3Provider(instance);

    // If user is not connected to the Mumbai test network, let them know and throw an error
    const { chainId } = await provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Matic Mumbai (test network) and reload");
      throw new Error("Change the network to Matic Mumbai (test network)");
    }

    return signer ? await provider.getSigner() : provider;
  }

  const getNumBearsMinted = async () => {
    const provider = await getProviderOrSigner(false);
    const bearsContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const numBears = await bearsContract.tokenId();
    setBearsMinted(numBears.toString());
  }

  const mintBear = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const bearsContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      let tx = await bearsContract.mint(
        "5678",
        {
          value: utils.parseEther("0.05"),
        }
      );
      setLoading(true);
      await tx.wait();
    } catch (err) {
        window.alert("An error occurred - see console for details");
        console.log(err);
    }

    setLoading(false);
    await getNumBearsMinted();
  }

  const renderMintButton = () => {
    return (
      <button disabled={loading} onClick={mintBear}>{loading ? "Minting..." : "Mint!"}</button>
    )
  }

  const renderLoading = () => {
    return (
      <section className={styles.loading}>
        <h3 className={styles.loadingItem}>Please wait...</h3>
        <img src="/loading.gif" alt="Loading spinner image" className={styles.loadingItem} />
      </section>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>WorldCongress Dev Bears</title>
      </Head>

      <main className={styles.main}>
        Number of WorldCongress Dev Bears minted: {bearsMinted}
        {renderMintButton()}
        {loading && renderLoading()}
      </main>

      <Footer />
    </div>
  )
}
