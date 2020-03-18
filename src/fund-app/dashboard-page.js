import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/app-route/app-location.js';

/**
* @customElement
* @polymer
*/
class Dashboard extends PolymerElement {
  static get template() {
    return html`
<style>
  :host {
    display: block; 
  }
  table, td, th {  
    border: 1px solid rgb(0, 0, 0);
    text-align: left;
  }
  #tab {
    display:none;
    border-collapse: collapse;
    margin-top:20px;
    margin-bottom:20px;
  }
  
  th, td {
    padding: 15px;
  }
  #form {
    border: 2px solid black;
    width: 500px;
    margin-left: 400px;
  }

  form {
    margin-left: 20px;
    margin-right: 20px;
  }
  h2{
    text-align: center;
  }
  #buttons{
    position:absolute;
    top:50px;
    left:1000px;
  }
  h2{
    text-align:center;
    color:white;
    position:absolute;
    top:22px;
    left:300px;

}
  paper-button {
    text-align: center;
    background-color: green;
    color:white;
  }
  h1{
      text-align:center;
      padding-bottom:20px;
      padding-top:20px;
  }
  a{
    text-decoration:none;
    color:white;
  }
  .customIndigo{
    float:right;
  }
</style>

<app-location route={{route}}></app-location>
<div id="buttons">
<paper-button raised class="customIndigo" on-click="_handleLogout">Logout</paper-button>
<paper-button raised class="customIndigo" on-click="_handleTransfer">Transfer</paper-button>
<paper-button raised class="customIndigo" on-click="_handleBeneficiary">Beneficiary</paper-button>
</div>
<h3>User Name: {{userName}}</h3>
<h3>Account Number: {{accountNumber}}</h3>
<h3>Balance: {{balance}} INR</h3>
<paper-button raised on-click="_displayTable">Transaction History</paper-button>
<table id="tab" >
<tr>
<th>To Account</th>
<th>Type</th>
<th>Amount</th>
</tr>
    <template is="dom-repeat" items={{data}} as="data">
    <tr>
    <td>{{data.destinationAccountNumber}}</td>
    <td>{{data.transactionType}}</td>
    <td>{{data.transactionAmount}}</td>
    </tr>
    </template>
    </table>
    <iron-ajax id="ajax" handle-as="json" on-response="_handleResponse" 
    content-type="application/json" on-error="_handleError"></iron-ajax>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'Forex Transfer'
      },
      userName: {
        type: String,
        value: sessionStorage.getItem('userName')
      },
      accountNumber: {
        type: String,
        value: sessionStorage.getItem('accountNumber')
      },

      balance: {
        type: String,
        value: sessionStorage.getItem('balance')
      },

      bankName: {
        type: String,
        value: sessionStorage.getItem('bankName')
      },

      minimumBalance: {
        type: String,
        value: sessionStorage.getItem('minimumBalance')
      },      
      action: {
        type: String
      },
      data: Array,
      userData: Array
    };
  }
  //getting list of all the transasctions
  connectedCallback() {
    super.connectedCallback();
    let userObj = JSON.parse(sessionStorage.getItem('userData'));
    this.userName = userObj.userName;
    this.accountNumber = userObj.accountNumber;
    this.balance = userObj.balance;
    this._makeAjax(`http://localhost:3000/history`, 'get', null);
  }
  _handleLogout(){
    sessionStorage.clear();
    window.history.pushState({}, null, '#/login');
    window.dispatchEvent(new CustomEvent('location-changed'));
  }
  _displayTable(){
    this.$.tab.style.display='block';
  }
  // calling main ajax call method 
  _makeAjax(url, method, postObj) {
    let ajax = this.$.ajax;
    ajax.method = method;
    ajax.url = url;
    ajax.body = postObj ? JSON.stringify(postObj) : undefined;
    ajax.generateRequest();
  }
  //routing to the fund transfer section
  _handleTransfer() {
    window.history.pushState({}, null, '#/transfer');
    window.dispatchEvent(new CustomEvent('location-changed'));
  }

  _handleBeneficiary(){
    window.history.pushState({}, null, '#/beneficiary');
    window.dispatchEvent(new CustomEvent('location-changed'));
  }
  //handling the responses from the API call
  _handleResponse(event) {
    
      
        this.data = event.detail.response;
        console.log(this.data);

    
  }
  //if session storage is clear then it will be redirected to login page
  ready() {
    super.ready();
    let name = sessionStorage.getItem('userName');
    if (name === null) {
      this.set('route.path', './login-page')
    }
  }

}

window.customElements.define('dashboard-page', Dashboard);