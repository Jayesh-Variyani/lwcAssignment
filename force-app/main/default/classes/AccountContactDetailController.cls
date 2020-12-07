public with sharing class AccountContactDetailController {
    public AccountContactDetailController() {
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String accId){
        try {
            return [SELECT ID,LastName, Title from Contact WHERE AccountId =:accId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
