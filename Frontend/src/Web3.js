import Web3 from 'web3';
import { ethers } from 'ethers';
import PermitContract from './contracts/Permit.json';

class Web3Service {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.account = null;
        this.contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address
    }

    async connectWallet() {
        try {
            if (!window.ethereum) {
                throw new Error('MetaMask not installed');
            }

            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            this.account = accounts[0];

            // Initialize Web3
            this.web3 = new Web3(window.ethereum);

            // Initialize Contract
            this.contract = new this.web3.eth.Contract(
                PermitContract.abi,
                this.contractAddress
            );

            return true;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            return false;
        }
    }

    async mintPermit(ipfsUri) {
        try {
            if (!this.contract || !this.account) {
                throw new Error('Contract or account not initialized');
            }
            
            const formattedUri = ipfsUri.startsWith("ipfs://") ? ipfsUri : `ipfs://${ipfsUri}`;
            const transaction = await this.contract.methods
                .mintPermit(this.account, formattedUri)
                .send({ from: this.account });

            return transaction;
        } catch (error) {
            console.error('Error minting permit:', error);
            throw error;
        }
    }

    async getPermitDetails(ipfsHash) {
    try {
        if (!this.contract || !this.account) {
            throw new Error('Contract or account not initialized');
        }
        console.log("🔍 Hash yang diterima frontend:", ipfsHash);
        // Get the token ID associated with this IPFS hash
        const formattedHash = ipfsHash.startsWith("ipfs://") ? ipfsHash : `ipfs://${ipfsHash}`;
        const tokenId = await this.contract.methods.getTokenIdByHash(formattedHash).call();
        
        // Get permit details
        const permitURI = await this.contract.methods.tokenURI(tokenId).call();
        const response = await fetch(`https://ipfs.io/ipfs/${permitURI.replace('ipfs://', '')}`);
        const permitDetails = await response.blob();

        return {
            tokenId: tokenId,
            verifier: await this.contract.methods.ownerOf(tokenId).call(),
            ...permitDetails
        };
        } catch (error) {
            console.error('Error getting permit details:', error);
            throw error;
        }
    }
}



export default new Web3Service();