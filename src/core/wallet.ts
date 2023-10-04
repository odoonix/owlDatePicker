import { reactive, useState } from "@odoo/owl";
import Web3 from "web3";

export class Wallet {
    _provider: any;
    _account: any;
    public chainId: string | undefined;
    web3?: Web3;

    public set account(account) {
        this._account = account;
        // update chain id if account changed
        if (this.isConnected) {
            window.ethereum.request({
                method: 'eth_chainId'
            }).then((chinId: string) => {
                this.chainId = chinId
                
            });
        } else {
            this.chainId = undefined;
        }
    }

    public get account() {
        return this._account;
    }

    public get isConnected() {
        return this._account;
    }

    public get unlocked() {
        return this.account;
    }

    public set provider(provider) {
        this._provider = provider;
        this.web3 = new Web3(this._provider);
    }

    public get provider() {
        return this._provider;
    }

    /**
     * Connect wallet to the current provider
     */
    public connect() {
        return this.provider.request({
            method: 'eth_requestAccounts'
        }).then((accounts: any[]) => {
            this.account = (accounts?.length > 0) ? accounts[0] : undefined;
        });
    }

    /***
     * disconnect wallet from current providet
     */
    public async disconnect(){
        await this.provider.disconnect();
    }
}

/**
 * Global wallet store.
 */
const wallet = reactive(new Wallet());


if (window.ethereum?.isMetaMask) {
    _connectToMetaMask(wallet);
} else if (window.ethereum?.isCoinbaseWallet) {
    _connectToCoinbaseWallet(wallet);
}


/**
 * Creates and publish new store of the wallet.
 * 
 * @returns wallet store
 */
function useWallet() {
    return useState(wallet);
}


/*
Add listener to MetaMask and follows changes.
*/
function _connectToMetaMask(wallet: any) {
    wallet.isMetaMask = true;
    wallet.provider = window.ethereum;
    // Check current account
    wallet.provider.request({
        method: 'eth_accounts'
    }).then((accounts: any[]) => {
        wallet.account = (accounts?.length > 0) ? accounts[0] : undefined;
    });

    // handle account change
    wallet.provider.on('accountsChanged', (accounts: any[]) => {
        wallet.account = (accounts?.length > 0) ? accounts[0] : undefined;
    });

    // TODO: handle chain id change from metamask
    wallet.provider.on('chainChanged', (chainId:string) => {
        wallet.chainId = chainId;
    });

    wallet.provider.on('disconnect', (error) => {

    });
}


/*
Add listener to CoinbaseWallet and follows changes.
*/
function _connectToCoinbaseWallet(wallet:any) {
    wallet.isCoinbaseWallet = true;
    wallet.provider = window.ethereum;
}

function useContract(id:any, addr:any, abi:any) {
    if (wallet.chainId !== id) {
        throw {
            message: `Current chain id (${wallet.chainId}) deffers from requested (${id})`
        };
    }
    return new wallet.web3.eth.Contract(abi, addr);
}


async function switchChain(chainId, chainName, rpc){
    try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainId }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: chainId,
                  chainName: chainName,
                  rpcUrls: [rpc] /* ... */,
                },
              ],
            });
          } catch (addError) {
            // handle "add" error
          }
        }
        // handle other "switch" errors
      }
}

export {
    useContract,
    useWallet,
    switchChain
}