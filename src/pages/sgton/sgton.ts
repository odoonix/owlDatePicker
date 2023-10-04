/*
TODO: add documents

*/
import { Component, useState } from "@odoo/owl";
import { enableStaking, logo, route, template, title } from "../../core/pages";
import { switchChain, useContract, useWallet } from "../../core/wallet";


import sGTONABI from "./abi-sgton.json";
import "./sgton.scss";
import "./sgton.xml";


const genzAdderss = "0xeff66b4a84c8a6b69b99eb1c5e39af8fc35d13db";
const testAddress = "0xeFF66B4A84C8a6b69b99EB1C5e39aF8fc35d13db";
const sGTONContract = "0xeff66b4a84c8a6b69b99eb1c5e39af8fc35d13db";
const weiRate = 1000000000000000000;
const testnetChainId = "0x1";
const mainnetChainId = "0x1";


@route('/staking/sGTON')
@title('sGTON (sGTON)')
@logo('./img/networks-logo/sgton.svg')
@template('pages.sGTON')
@enableStaking()
export class SgtonStaking extends Component {

    wallet = useWallet();
    state = useState({
        staking: false,
        unstaking: false,
        value: 0,
        unstakeVal: 0
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
            await switchChain(mainnetChainId, 'eth mainent', 'https://mainnet.infura.io/v3/')
            return;
        }
        this.state.staking = true;
        let contract = useContract(this.wallet.chainId, sGTONContract, sGTONABI);
        var amount = this.state.value * weiRate;
        return contract.methods
            .stake("0x" + amount.toString(16), this.getVerifierAddress(),)
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
        var amount = this.state.unstakeVal * weiRate;
        this.state.unstaking = true;
        let contract = useContract(this.wallet.chainId, sGTONContract, sGTONABI);
        contract.handleRevert = true
        contract.methods
            .unstake(this.getVerifierAddress(), "0x" + amount.toString(16))
            .send({
                from: this.wallet.account
            }).catch(ex => {
                alert("Fail to unstake!!");
            }).finally(async () => {

                this.state.unstaking = false;
            });
        this.withdrawStaking()
    }
    withdrawStaking() {
        let contract = useContract(this.wallet.chainId, sGTONContract, sGTONABI);
        return contract.methods
            .withdrawStaking(this.getVerifierAddress())
            .send({
                from: this.wallet.account
            }).catch(ex => {
                alert("Fail to unstake!!", ex);
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









