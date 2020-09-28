package com.ibm.codey.bank.accounts.models;

import java.util.UUID;

import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.types.ObjectId;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class User {

    private String userId;

    private String subject;

    private boolean consentGiven;

    private boolean deleteRequested;

    public User() {
        this.userId = UUID.randomUUID().toString();
    }

}