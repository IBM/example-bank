package com.ibm.codey.bank.accounts.models;

import java.io.Serializable;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@NamedQueries({
  @NamedQuery(name = "User.findUserByRegistryId", query = "SELECT e FROM User e WHERE e.subject = :subject"),
})
@Getter @Setter
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "user_id")
    @Id
    @Setter(AccessLevel.NONE)
    private String userId;

    @Column(name = "subject", unique=true)
    private String subject;

    @Column(name = "consent_given")
    private boolean consentGiven;

    @Column(name = "delete_requested")
    private boolean deleteRequested;

    public User() {
        this.userId = UUID.randomUUID().toString();
    }

}