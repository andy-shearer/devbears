import styles from "../styles/Home.module.css"
import Footer from "../components/Footer"
import Textion from "../components/Textion"
import Carousel from "../components/Carousel"
import buildImage from "../utils/ImageBuilder";
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
  const [ srcBear, setSrcBear ] = useState("");
  const web3ModalRef = useRef();
  const [formData, setFormData] = useState(
      {
          area: "1",
          country: "1",
          lang: "1",
          os: "1"
      }
  )

  const handleChange = (event) => {
      const {name, value} = event.target;
      setFormData(prevFormData => {
          return {
              ...prevFormData,
              [name]: value
          }
      });
  }

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

  useEffect(() => {
    // Run the following every time the page is re-rendered
    getNumBearsMinted();
  }, []);

  /**
   * Attempt to obtain the provider, which will prompt wallet connection when used for the first time
   */
  const connectWallet = async () => {
    try {
      const provider = await getProviderOrSigner(false);
      setWalletConnected(true);
      console.debug("Wallet has been successfully connected");
    } catch (err) {
      if(err.code != -32002) { // Ignore the 'already processing eth_requestAccounts error
        console.log(err);
      }
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
    if(!walletConnected) {
      window.alert("You must connect a crypto wallet in order to mint. https://metamask.io/faqs/");
    }

    let minted = true;
    try {
      const signer = await getProviderOrSigner(true);
      const bearsContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const inputString = formData.area + formData.country + formData.lang + formData.os;
      let tx = await bearsContract.mint(
        inputString,
        {
          value: utils.parseEther("0.05"),
        }
      );
      setLoading(true);
      await tx.wait();
    } catch (err) {
        minted = false;
        if(err.code === 4001) {
          console.log("User rejected the transaction.");
        }
        /**
         * Allowed errors:
         *    -32002 "Already processing eth_requestAccounts. Please wait"
         */
        else if(err.code != -32002) {
          window.alert("An error occurred - see console for details");
          console.log(err);
        }
    }

    setLoading(false);
    if(minted) {
      window.alert("Minted!");
    }
    await getNumBearsMinted();
  }

  const renderMintButton = () => {
    return (
      <button disabled={loading} className={styles.button} onClick={mintBear}>{loading ? "Minting..." : "Mint this bear"}</button>
    )
  }

  const renderLoading = () => {
    return (
      <section className={styles.loading}>
        <h3 className={styles.loadingItem}>Minting...</h3>
        <img src="/loading.gif" alt="Spinner gif" className={styles.loadingItem} />
      </section>
    );
  }

  const generateBear = async () => {
    const inputString = formData.area + formData.country + formData.lang + formData.os;
    const built = await buildImage(false, inputString);
    setSrcBear(built);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>World Congress Dev Bears</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>World Congress Dev Bears</h1>

        <Carousel />
        <a
          href="https://testnets.opensea.io/collection/world-congress-bears-v4"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.a}
        >
          View the collection on OpenSea!
        </a>

        <Textion title="What is the World Congress? 🌎">
           The World Congress is an upcoming event hosted by WeAreDevelopers, hosted for the global developer community
           to meet in Berlin. The event is a chance to connect with peers and get recent insights on software development,
           best practices and future tech trends.
        </Textion>

        <Textion title="What are Dev Bears? 🐻">
           Dev Bears are a randomly generated NFT created to commemorate and celebrate the upcoming 2022 World Congress event.
           Bears are an iconic symbol of Berlin where the event is being hosted this year. Each Dev Bear has some characteristics
           that are picked based off some user input.
           <br /><br />
           A Dev Bear image can be generated on this page, and can be minted on the Polygon blockchain by connecting a crypto wallet such
           as MetaMask.
        </Textion>

        <Textion title="Which blockchain is used? ⛓">
           Dev Bear NFTs are minted to the Polygon (Matic) blockchain which is a Layer 2 blockchain running on top of Ethereum.
           Currently, the 'Matic Mumbai' is used, which means it is possible to interact with this app without spending any money
           whatsoever.<br /><br />
           Check out this blog post to get up and running on the Matic Mumbai test network:{" "}
           <a
             href="https://blog.cryptostars.is/adding-polygon-matic-mumbai-test-net-network-to-metamask-and-receiving-test-matic-tokens-be5381be2c53"
             target="_blank"
             rel="noopener noreferrer"
             className={styles.a}
           >
             Adding Mumbai Test Network to Metamask
           </a>

        </Textion>

        <section className={styles.formBox}>
          <h2 className={styles.textHeading}>Create your Dev Bear 👇</h2>
          Total number of Dev Bears minted so far: {bearsMinted}
          {loading && renderLoading()}

          <section className={styles.question}>
            <label htmlFor="area">What area does your Dev Bear work in?</label>
            <br />
            <select
                id="area"
                value={formData.area}
                onChange={handleChange}
                name="area"
            >
                <option value="1">Developer</option>
                <option value="2">Architect</option>
                <option value="3">DevOps</option>
                <option value="4">Security</option>
                <option value="5">Product Owner</option>
            </select>
          </section>

          <section className={styles.question}>
            <label htmlFor="country">Which flag does your Dev Bear salute?</label>
            <br />
            <select
                id="country"
                value={formData.country}
                onChange={handleChange}
                name="country"
            >
                <option value="1">UK</option>
                <option value="2">Ireland</option>
                <option value="3">France</option>
                <option value="4">Germany</option>
                <option value="5">Netherlands</option>
                <option value="6">Italy</option>
                <option value="7">Belgium</option>
                <option value="8">Pirate</option>
                <option value="9">Anonymous</option>
            </select>
          </section>

          <section className={styles.question}>
            <label htmlFor="lang">What is your Dev Bear's chosen programming language/framework?</label>
            <br />
            <select
                id="lang"
                value={formData.lang}
                onChange={handleChange}
                name="lang"
            >
                <option value="1">JavaScript</option>
                <option value="2">React.js</option>
                <option value="3">Java</option>
                <option value="4">C</option>
                <option value="5">C++</option>
                <option value="6">C#</option>
                <option value="7">Rust</option>
                <option value="8">Solidity</option>
                <option value="9">Other</option>
            </select>
          </section>

          <section className={styles.question}>
            <label htmlFor="os">What is your Dev Bear's chosen Operating System?</label>
            <br />
            <select
                id="os"
                value={formData.os}
                onChange={handleChange}
                name="os"
            >
                <option value="1">Windows</option>
                <option value="2">Linux</option>
                <option value="3">MacOS</option>
                <option value="4">Other</option>
            </select>
          </section>

          <button className={styles.button} onClick={generateBear}>Generate Dev Bear!</button>
        </section>

        {srcBear && <img src={srcBear} className={styles.generatedBear} alt="Generated Bear" />}
        {srcBear && renderMintButton()}
      </main>

      <Footer />
    </div>
  )
}
