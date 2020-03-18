import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';

/**
 * @customElement
 * @polymer
 */
class BeneficiaryPage extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          display: block;
        }
        paper-button{
            background-color: green;
            color: white;
        }
        #addBeneficiary{
            display: block;
            width: 50%;
        }
        .customIndigo{
          float: right;
        }
      </style>
        <paper-button raised class="customIndigo" on-click="_handleLogout">Logout</paper-button>
        <paper-button raised class="customIndigo" on-click="_handleTransfer">Transfer</paper-button>
        <paper-button raised class="customIndigo" on-click="_handleDashboard">Dashboard</paper-button>

 
    <section id="addBeneficiary">
    <h1>Beneficiary Details</h1>
    <paper-input id="beneficiaryName" label="Beneficiary Name" type="text"></paper-input>
    <paper-input id="beneficiaryAccountNumber" label="Beneficiary Account Number" type="text" allowed-pattern="[0-9]" minlength="6" maxlength="6"></paper-input>
    <paper-button raised label="Add" on-click="_addBeneficiary">Add</paper-button>
</section>
<h2>Beneficiary List</h2>
<section id="beneficiaryList">
        <table>
            <thead>
                <tr>
                    <td>Beneficiary Name</td>
                    <td>Beneficiary Account Number</td>
                </tr>
            </thead>
            <tbody>
            <template  is="dom-repeat" items={{beneficiariesList}}>
                <tr>
                    <td>{{item.beneficiaryName}}</td>
                    <td>{{item.beneficiaryAccountNumber}}</td>
                </tr>
                </template>
            </tbody>
        </table>
</section>
<iron-ajax id='ajax' handle-as='json' on-response='_handleResponse' on-error='_handleError' content-type='application/json'></iron-ajax>


`;
    }
    static get properties() {
        return {
            prop1: {
                type: String,
                value: 'transfer-page'
            }
        };
    }
    _addBeneficiary(){
        let beneficiaryName = this.$.beneficiaryName.value;
        let beneficiaryAccountNumber = this.$.beneficiaryAccountNumber.value;
        let beneficairyObj = {beneficiaryName:beneficiaryName,beneficiaryAccountNumber:beneficiaryAccountNumber,userName:this.userName};
        this._makeAjaxCall(`http://localhost:3000/beneficiaries`, 'post', beneficairyObj);
    }
    _handleTransfer() {
        window.history.pushState({}, null, '#/transfer');
        window.dispatchEvent(new CustomEvent('location-changed'));
      }
      _handleDashboard(){
      window.history.pushState({}, null, '#/dashboard');
      window.dispatchEvent(new CustomEvent('location-changed'));
      }
      connectedCallback(){
        super.connectedCallback();
        let {userName} = JSON.parse(sessionStorage.getItem('userData'));
        this.userName = userName;
        this._makeAjaxCall(`http://localhost:3000/beneficiaries?userName=${this.userName}`,'get',null);
    }
    _handleLogout(){
        sessionStorage.clear();
        window.history.pushState({}, null, '#/login');
        window.dispatchEvent(new CustomEvent('location-changed'));
      }
    _handleResponse(event){
        this.beneficiariesList = event.detail.response;
        this.beneficiaryName = this.beneficiariesList.beneficiaryName;
        this.beneficiaryAccountNumber = this.beneficiariesList.beneficiaryAccountNumber;
        console.log(this.beneficiariesList);
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

window.customElements.define('beneficiary-page', BeneficiaryPage);
