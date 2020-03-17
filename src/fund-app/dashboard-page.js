import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

/**
 * @customElement
 * @polymer
 */
class DashboardPage extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
    <p>Account Holder Name:{{userName}}</p>
    <p>Account Number:{{accountNumber}}</p>
    <p>Account Balance:{{accountBalance}}</p>
    <p>Contact Number:{{contactNumber}}</p>

    <h3>Transaction Summary</h3>
    <table width="100%">
    <thead>
    <tr>
    <td>To Account</td>
    <td>Transaction Type</td>
    <td>Amount</td>
    <td>Date</td>
    </tr>
    </thead>
    </table>

`;
  }
  static get properties() {
    return {
      userName: {
        type: String,
        value: ''
      },
      accountNumber: {
        type: Number,
        value: 0
      },
      accountBalance: {
        type: Number,
        value: 0
      },
      contactNumber: {
        type: Number,
        value: 0
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    let user = JSON.parse(sessionStorage.getItem('userData'));
    console.log("hgghjk", user);
    this.userName = user[0].userName;
    this.accountNumber = user[0].accountNumber;
    this.accountBalance = user[0].balance;
    this.contactNumber = user[0].contactNumber;
  }
}

window.customElements.define('dashboard-page', DashboardPage);
