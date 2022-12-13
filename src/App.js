import {useEffect, useState} from 'react';
import './App.css';
import logo from './logo.svg';
import { ethers } from "ethers";


function App() {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [signature, setSignature] = useState(null);

    const checkWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have Metamask installed!");
            return;
        } else {
            console.log("Wallet exists! We're ready to go!")
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account: ", account);
            setCurrentAccount(account);
        } else {
            console.log("No authorized account found");
        }
    }

    const connectWalletHandler = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Please install Metamask!");
        }

        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
            console.log("Found an account! Address:", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (err) {
            console.log(err)
        }
    }


    const signMessageHandler = async () => {
        const msg = document.getElementById("msg").value;

        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                let signature = await signer.signMessage(msg);
                console.log(signature);
                // let alertMsg = "Signature:\n" + signature;
                setSignature(signature);

                // alert("Signature:\n" + signature)
                // Alert.alert(alertMsg)
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const connectWalletButton = () => {
        return (
            <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
                Connect Wallet
            </button>
        )
    }

    const signMessageButton = () => {
        return (
            <div>
                <label className={"signInput"}>
                    Message:
                    <input inputMode={"text"} id={"msg"} className={"input"} alt={"input the message"}/>
                </label>
                <br/>
                <label className={"signResult"}>
                    Signature is:
                    <br/>
                    {signature}
                </label>
                <br/>
                <button onClick={() => signMessageHandler()} className='cta-button sign-message-button'>
                    Sign Message
                </button>
            </div>
        )
    }

    // 忽略大小写比较两个字符串
    // String.prototype.compare = function(str) {
    //     if (this.toLowerCase() === str.toLowerCase()) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    // String.prototype.compare = function(str) {
    //     return this.toLowerCase() === str.toLowerCase();
    // }

    const verifySignatureHandler = () => {

        const signature = document.getElementById('inputSignature').value;
        const address = document.getElementById('inputAddr').value;
        const message = document.getElementById("signedMsg").value;
        const signer = ethers.utils.verifyMessage(message, signature)
        console.log("Signature:", signature)
        console.log("message:",message)
        console.log("The signer is:", signer)
        // alert("The signer is:\n" + signer)

        // if (address.compare(signer)) {
        if (address.toLowerCase() === signer.toLowerCase()) {
            alert("Signature verification success!")
        } else {
            alert("The address is not the singer!")
        }

    };

    const verifySignatureButton = () => {
        return (
            <div>
                <label className={"verify"}>
                    <p>&ensp;Address:<input inputMode={"text"} id={"inputAddr"} className={"input"} alt={"input the signature address"}/></p>
                    <p>Signature:
                        <input inputMode={"text"} id={"inputSignature"} className={"input"} alt={"input the signature"}/>
                    </p>
                    <p>&ensp;Message:
                        <input inputMode={"text"} id={"signedMsg"} className={"input"} alt={"input the message"}/>
                    </p>
                </label>
                <p>
                    <button onClick={verifySignatureHandler} className='cta-button verify-signature-button'>
                        Verify Signer
                    </button>
                </p>
            </div>
        )
    }

    useEffect(() => {
        checkWalletIsConnected().then();
    }, [])


    return (
    <div className="App">
        <div>
            <img src={logo} className="App-logo" alt="logo" />
        </div>
        <div className={"sign-message"}>
            {currentAccount ? signMessageButton() : connectWalletButton()}
        </div>
        <div className={"verify-signature"}>
            {verifySignatureButton()}
        </div>
    </div>
  );
}

export default App;
