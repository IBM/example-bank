package com.ibm.codey.loyalty.accounts.models;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserEventPK implements Serializable {

    private String userId;
 
    private String eventId;

}