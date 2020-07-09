package com.ibm.codey.bank.catalog.models;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class TransactionPK implements Serializable {

    private String transactionId;
 
    private String userId;

}