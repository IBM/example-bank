package com.ibm.codey.bank.accounts.json;

import javax.json.bind.annotation.JsonbProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class UserRegistration {

    @JsonbProperty
    private boolean consentGiven;

}