import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-item/paper-item.js';
/**
 * @customElement
 * @polymer
 */
class TransferPage extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        #transferButton{
          background-color:green;
          color: white;
        }
        paper-button{
          background-color:green;
          color: white;
        }
        .customIndigo{
          float: right;
        }
        paper-input{
          width: 16%;
        }
        #buttons{
          width:100%
        }
      </style>
      <paper-button raised class="customIndigo" on-click="_handleLogout">Logout</paper-button>
      <paper-button raised  class="customIndigo" on-click="_handleBeneficiary">Beneficiary</paper-button>
      <paper-button raised class="customIndigo" on-click="_handleDashboard">Dashboard</paper-button>

   <section>
        <h1>From Account:{{accountNumber}}</h1>
        <paper-dropdown-menu id="beneficiary" label="Select Beneficiary">
        <paper-listbox slot="dropdown-content" selected="0">
        <template is="dom-repeat" items="{{beneficiaryList}}">
          <paper-item >{{item.beneficiaryAccountNumber}}</paper-item>
          </template>
        </paper-listbox>
      </paper-dropdown-menu>
        <paper-input id="transferAmount" type="text" allowed-pattern=[0-9] label="Enter Amount"></paper-input>
        <paper-button id="transferButton" on-click="_handleTransaction" raised>Transfer</paper-button>
    </section>
    <paper-toast id="invalidAmount" >Enter Valid Amount</paper-toast>
    <paper-dialog id="confirmation" modal>
    <p>Do you want to complete this transaction?</p>
    <div id="buttons">
    <paper-button on-click="_handleUpdate">Yes</paper-button>
    <paper-button  dialog-dismiss>No</paper-button>
        </div>
    </paper-dialog>
    <iron-ajax id='ajax' handle-as='json' on-response='_handleResponse' on-error='_handleError' content-type='application/json'></iron-ajax>

`;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'transfer-page'
      },
      beneficiaryList: {
        type: Array,
        value: []
      },
      action:{
        type:String,
        value:''
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    let user = JSON.parse(sessionStorage.getItem('userData'));
    this.accountNumber = user.accountNumber;
    this.userName = user.userName;
    this.balance = user.balance;
    this.action='List';
    this._makeAjaxCall(`http://localhost:3000/beneficiaries?userName=${this.userName}`, 'get', null);
  }
  // _handleClose(){
  //   this.$.confirmation.close();
  // }
  _handleLogout() {
    sessionStorage.clear();
    window.history.pushState({}, null, '#/login');
    window.dispatchEvent(new CustomEvent('location-changed'));
  }
  _handleDashboard() {
    window.history.pushState({}, null, '#/dashboard');
    window.dispatchEvent(new CustomEvent('location-changed'));
  }
  _handleBeneficiary() {
    window.history.pushState({}, null, '#/beneficiary');
    window.dispatchEvent(new CustomEvent('location-changed'));
  }
  _handleResponse(event) {
    switch(this.action){
      case 'List':{
        this.beneficiaryList = event.detail.response;
        console.log(this.beneficiaryList);
        break;
      }
      case 'Transfer':{
    this._makeAjaxCall(`http://localhost:3000/users?accountNumber=${this.$.beneficiary.value}`, 'get', null);
    console.log()
        this.action='Response';
        break;
      }
      case 'Response':{
        this.toCustomer = event.detail.response[0];
        this.customer = this.toCustomer;
        this.customer.balance = parseInt(this.customer.balance) + parseInt(this.$.transferAmount.value); 
        console.log(this.customer); 
        this._makeAjaxCall(`http://localhost:3000/users/${this.toCustomer.id}`, 'put', this.customer);
        this.$.confirmation.close();
        window.history.pushState({}, null, '#/dashboard');
        window.dispatchEvent(new CustomEvent('location-changed'));
        break;
      }
    }
  }
  _handleTransaction() {
    let amount = this.$.transferAmount.value;
    this.userDetails = JSON.parse(sessionStorage.getItem('userData'));
    if (amount<=0) {
      this.$.invalidAmount.open();
    }
    else if(amount < this.balance - 500){
      this.$.confirmation.open();
      let updatedBalance = this.balance - amount;
      this.userDetails.balance = updatedBalance;
      // this.dispatchEvent(new CustomEvent('balance-update', { detail: { updatedBalance } }));
    }
    else if (amount > this.balance) {
      alert('insufficient Funds');
    }
    else {
      alert('Minimum Balance is to be maintained');
    }

  }
  _handleUpdate(){
    console.log(this.userDetails);
    this._makeAjaxCall(`http://localhost:3000/users/${this.userDetails.id}`, 'put', this.userDetails);
    this.action='Transfer';

  }
  /**
   * reusable function to make ajax calls
   * @param {String} url 
   * @param {String} method 
   * @param {Object} postObj 
   */
  _makeAjaxCall(url, method, postObj) {
    let ajax = this.$.ajax;
    ajax.url = url;
    ajax.method = method;
    ajax.body = postObj ? JSON.stringify(postObj) : undefined;
    ajax.generateRequest();
  }
}

window.customElements.define('transfer-page', TransferPage);
