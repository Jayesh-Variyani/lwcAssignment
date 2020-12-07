import { LightningElement, track, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getContacts from '@salesforce/apex/AccountContactDetailController.getContacts';

export default class AccountContactDetails extends LightningElement {
    @track contacts
    @api recordId;
    @api FieldNames;
    @track customerSuccessData = [];
    @track applicationDeveloperData = [];
    fieldNameList = [];
    @track fieldValues = [];
    @track totalContacts;
    @api account;

    @wire(getRecord, { recordId: '$recordId', fields:'$fieldNameList'})
    wiredAccount(result) {
        this.account = result.data;
        this.fieldValues = [];
        if (result.data) {
            for (var key in this.fieldNameList) {
                 this.fieldValues.push(getFieldValue(result.data, this.fieldNameList[key]));
            }
        }
    }

    getFieldData(fieldName) {
        return getFieldValue(this.account.data, fieldName);
    }

    @wire(getContacts, { accId: '$recordId' })
    wiredContacts(result) {
        this.contacts = result;
        if (result.data) {
            this.totalContacts = result.data.length;
            var csData = [];
            var adData = [];
            var currentData = result.data;
            for (var key in currentData) {
                if (currentData[key].Title === 'Customer Success') {
                    csData.push(currentData[key]);
                } else if (currentData[key].Title == 'Application Developer') {
                     adData.push(currentData[key]);
                }
            }
            this.customerSuccessData = csData;
            this.applicationDeveloperData = adData;
        } else if (result.error) {

        }
    }
    @track columns = [{ label: 'Title', fieldName: 'Title', type: 'text', sortable: 'true' },
    { label: 'Last Name', fieldName: 'LastName', type: 'text', sortable: 'true' }];

    connectedCallback() {
        var fieldData = this.FieldNames.length>1?this.FieldNames.split(','):this.FieldNames;
        this.fieldNameList= [];
        for (var key in fieldData) {
            this.fieldNameList.push('Account.'+fieldData[key]);
        }
    }
    handleRefresh(){
        refreshApex(this.contacts);
    }

    handleToggleSection() {
        refreshApex(this.contacts);
    }

}