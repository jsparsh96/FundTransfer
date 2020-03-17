import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';

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
      </style>
    <section class="beneficiary">
        <h1>Beneficiary Details</h1>
        <paper-input id="beneficiaryName" label="Beneficiary Name" type="text"></paper-input>
        <paper-input id="beneficiaryAccountNumber" label="Beneficiary Account Number" type="text" allowed-pattern="[0-9]" minlength="6" maxlength="6"></paper-input>
        <paper-button raised label="Add" >Add</paper-button>
    </section>
    <section>
        <p>From Account:</p>
        
    </section>
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
}

window.customElements.define('transfer-page', TransferPage);
