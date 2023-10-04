import { Component, useState } from "@odoo/owl";
import { enableStaking, logo, route, symbol, template, title } from "../../core/pages";
import { switchChain, useContract, useWallet } from "../../core/wallet";


import MaticABI from "./abi-polygon-matic.json";
import "./polygon.scss";
import "./polygon.xml";


const genzAdderss = "0x5a1b57f87b59e093d332c945c66b602843099f97";
const testAddress = "0x42eAcf5b37540920914589a6B1b5e45d82D0C1ca";
const MaticContract = "0x0000000000000000000000000000000000001010";
const weiRate = 1000000000000000000;
const testnetChainId = "0x13881";
const mainnetChainId = "0x89";


@route('/staking/matic')
@title('Polygon (MATIC)')
@logo('./img/networks-logo/polygon.svg')
@template('pages.polygon')
@symbol('MATIC')
@enableStaking()
export class MaticStaking extends Component {

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
            await switchChain(mainnetChainId, 'Polygon', 'https://mainnet.infura.io/v3/')
            return;
        }
        this.state.staking = true;
        let contract = useContract(this.wallet.chainId, MaticContract, MaticABI);
        var amount = this.state.value*weiRate;
        return contract.methods
            .deposit(this.getVerifierAddress(),"0x" + amount.toString(16))
            .send({
                from: this.wallet.account,
                // Minimum 1000m (1 m = 1000?)
                
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
        let contract = useContract(this.wallet.chainId, MaticContract, MaticABI);
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
        let contract = useContract(this.wallet.chainId, MaticContract, MaticABI);
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









