import Web3 from 'web3';
import { ethers } from 'ethers';
import PermitContract from './contracts/Permit.json';

class Web3Service {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.account = null;
        this.contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Replace with your deployed contract address
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

            const transaction = await this.contract.methods
                .mintPermit(this.account, ipfsUri)
                .send({ from: this.account });

            return transaction;
        } catch (error) {
            console.error('Error minting permit:', error);
            throw error;
        }
    }
}

export default new Web3Service();