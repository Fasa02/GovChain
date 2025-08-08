import Web3 from 'web3';
import PermitContract from './contracts/Permit.json';

class Web3Service {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.account = null;
        this.contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        this.ipfsGateway = "http://localhost:8081/ipfs/";
    }

    async connectWallet() {
        try {
            if (!window.ethereum) throw new Error('MetaMask not installed');

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.account = accounts[0];
            console.log("✅ Wallet connected:", this.account);

            this.web3 = new Web3(window.ethereum);
            this.contract = new this.web3.eth.Contract(
                PermitContract.abi,
                this.contractAddress
            );

            return true;
        } catch (error) {
            console.error('❌ Wallet connection failed:', error.message);
            return false;
        }
    }

    async mintPermit(ipfsUri) {
        try {
            if (!this.contract || !this.account) throw new Error('Contract or account not initialized');

            const formattedUri = ipfsUri.startsWith("ipfs://") ? ipfsUri : `ipfs://${ipfsUri}`;

            const tx = await this.contract.methods
                .mintPermit(this.account, formattedUri)
                .send({ from: this.account });

            const transferEvent = tx.events?.Transfer;
            if (!transferEvent?.returnValues?.tokenId) {
                throw new Error("❌ TokenId not found in Transfer event");
            }

            return {
                txHash: tx.transactionHash,
                ipfsHash: formattedUri,
                tokenId: transferEvent.returnValues.tokenId.toString()
            };
        } catch (error) {
            console.error('❌ Error minting permit:', error);
            throw error;
        }
    }

    async getPermitDetails(ipfsHash) {
        try {
            if (!this.contract || !this.account) throw new Error('Contract or account not initialized');

            const formattedHash = ipfsHash.startsWith("ipfs://") ? ipfsHash : `ipfs://${ipfsHash}`;
            const tokenId = await this.contract.methods.getTokenIdByHash(formattedHash).call();

            const permitURI = await this.contract.methods.tokenURI(tokenId).call();
            const cleanHash = permitURI.replace("ipfs://", "");
            const response = await fetch(`${this.ipfsGateway}${cleanHash}`);

            const text = await response.text();
            if (text.startsWith('<!DOCTYPE')) {
                throw new Error("IPFS gateway returned HTML. Is IPFS daemon running?");
            }

            const metadata = JSON.parse(text);

            return {
                tokenId,
                ipfsHash: permitURI,
                verifier: await this.contract.methods.ownerOf(tokenId).call(),
                metadata
            };
        } catch (error) {
            console.error('❌ Error getting permit details:', error);
            throw error;
        }
    }

    async getPermitDetailsByTokenId(tokenId) {
        try {
            const tokenURI = await this.contract.methods.tokenURI(tokenId).call();
            const owner = await this.contract.methods.ownerOf(tokenId).call();

            const cleanHash = tokenURI.replace("ipfs://", "");
            const response = await fetch(`${this.ipfsGateway}${cleanHash}`);

            const text = await response.text();
            if (text.startsWith('<!DOCTYPE')) {
                throw new Error("IPFS gateway returned HTML. Is IPFS daemon running?");
            }

            const metadata = JSON.parse(text);

            return {
                tokenId: tokenId.toString(),
                owner,
                ipfsHash: tokenURI,
                metadata
            };
        } catch (err) {
            console.error("❌ Error fetching details by tokenId", err);
            throw err;
        }
    }
}

export default new Web3Service();
