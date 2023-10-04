import { Component, onMounted, xml } from "@odoo/owl";
import { Modal } from "bootstrap";

import { components, template } from "../../core/components";
import { useService } from "../../core/utils/hooks";
import { Wallet, useWallet } from "../../core/wallet";
import {Dialog} from "../../core/dialog";


import "./navbar.scss";
import "./navbar.xml";

@template(xml`
<Dialog header="false" footer="false" size="'md'" contentClass="'o_command_psassalette mt-5'">
<h1>Test casd</h1>
</Dialog>`)
@components({Dialog})
class TestPalet extends Component { }

@template("components.topbar")
export class Navbar extends Component {

    wallet: Wallet;
    accountInfoModal: Modal;
    selectProviderModal: Modal;

    dialog: any;

    setup() {
        this.wallet = useWallet();
        onMounted(() => {
            // TODO: replace with dialog
            this.accountInfoModal = new Modal(document.getElementById('accountInfoModal'));
            this.selectProviderModal = new Modal(document.getElementById('selectProviderModal'));
        });
        this.dialog = useService("dialog");
    }

    unlockWallet() {
        this.selectProviderModal.show();
    }

    showAccountInfo() {
        //this.accountInfoModal.show();
        this.dialog.add(
            TestPalet,
            {},
            {
                onClose: () => {
                    alert('hi');
                },
            }
        );
    }

    connectWallet() {
        this.wallet.connect()
            .then(() => {
                this.selectProviderModal.hide();
            });
    }

    disconnect() {
        this.wallet.disconnect();
    }
}
