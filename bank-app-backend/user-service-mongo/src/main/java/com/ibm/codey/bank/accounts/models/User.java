package com.ibm.codey.bank.accounts.models;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class User {

    private UUID userId;

    private UUID subject;

    private boolean consentGiven;

    private boolean deleteRequested;

    public User() {
        this.userId = UUID.randomUUID();
    }
}