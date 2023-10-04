/*

Endpoint Information
Liberty 1.X
Field	Alphanet
Network Name	Shardeum Liberty 1.X
New RPC URL	https://liberty10.shardeum.org/
Chain ID	8080
Currency symbol (optional)	SHM
Block Explorer URL (optional)	https://explorer-liberty10.shardeum.org/


Liberty 2.X
Field	Alphanet
Network Name	Shardeum Liberty 2.X
New RPC URL	https://liberty20.shardeum.org/
Chain ID	8081
Currency symbol (optional)	SHM
Block Explorer URL (optional)	https://explorer-liberty20.shardeum.org/

https://etherscan.io/token/0xbebdab6da046bc49ffbb61fbd7b33157eb270d05#writeContract

*/
import { Component, useState } from "@odoo/owl";
import { switchChain, useContract, useWallet } from "../../core/wallet";
import { enableStaking, logo, route, symbol, template, title } from "../../core/pages";

import "./shardeum.scss";
import "./shardeum.xml";

import shardeumABI from "./abi-shardeum-shard.json";


const genzAdderss = "0x5a1b57f87b59e093d332c945c66b602843099f97"; //to be added
const testAddress = "0x42eAcf5b37540920914589a6B1b5e45d82D0C1ca";
const shardeumContract = "0xBeBdab6DA046Bc49ffBb61fbD7b33157Eb270D05";
const weiRate = 1000000000000000000;
const testnetChainId = "0x1F91";
const mainnetChainId = "0x1F90";


@route('/staking/shardeum')
@title('Shardeum (shard)')
@logo('./img/networks-logo/shard.svg')
@template('pages.shardeum')
@symbol('shardeum')
@enableStaking()
export class ShardeumStaking extends Component {

    wallet = useWallet();
    state = useState({
        staking: false,
        unstaking: false,
        value: 0,
    });

    testnetChainId: string;
    mainnetChainId: string;

    /**
     * Stake the amount value from the input
     * 
     * @returns promise | undefinde
     */
    async stakeit() {
        this.testnetChainId = testnetChainId;
        this.mainnetChainId = mainnetChainId;
        if (this.state.staking || !this._checkChainId()) {
            await switchChain(mainnetChainId, 'Shardeum', 'https://liberty10.shardeum.org/')
            return;
        }
        this.state.staking = true;
        let contract = useContract(this.wallet.chainId, shardeumContract, shardeumABI);
        var amount = this.state.value*weiRate;
        return contract.methods
            .delegate(this.getVerifierAddress())
            .send({
                from: this.wallet.account,
                // Minimum 1000m (1 m = 1000?)
                value: "0x" + amount.toString(16)
                
            }).catch(ex => {
                alert("Fail to performe the stake action");
                console.error(ex);
            }).finally(() => this.state.staking = false);
    }

    /**
     * Unstake all m from the default Validator
     * 
     * @returns promise to performe
     */
    unstakeit() {
        if (this.state.unstaking || !this._checkChainId()) {
            // wait for end 
            return;
        }
        this.state.unstaking = true;
        let contract = useContract(this.wallet.chainId, shardeumContract, shardeumABI);
        contract.handleRevert = true
        contract.methods
            .unstake(this.getVerifierAddress())
            .send({
                from: this.wallet.account
            }).catch(ex => {
                alert("Fail to unstake!!");
            }).finally(async() => {
                
                this.state.unstaking = false;
            });
            this.withdrawStaking()
    }
    withdrawStaking(){
        let contract = useContract(this.wallet.chainId, shardeumContract, shardeumABI);
        return contract.methods
            .withdrawStaking(this.getVerifierAddress())
            .send({
                from: this.wallet.account
            }).catch(ex => {
                alert("Fail to unstake!!",ex);
            });
    }

    _checkChainId() {
        if (this.wallet.chainId !== mainnetChainId && this.wallet.chainId !== testnetChainId) {
            alert("Unsupported Chain ID :" + this.wallet.chainId);
            return false;
        }
        return true;
    }

    getVerifierAddress() {
        if (this.wallet.chainId === mainnetChainId) {
            return genzAdderss;
        }
        return testAddress;
    }
}









