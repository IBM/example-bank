package com.ibm.codey.loyalty.accounts.models;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_event")
@IdClass(UserEventPK.class)
@NamedQueries({
  @NamedQuery(name = "UserEvent.findUserEvent", query = "SELECT e FROM UserEvent e WHERE e.userId = :userId AND e.eventId = :eventId"),
  @NamedQuery(name = "UserEvent.findUserEventsByUserId", query = "SELECT e FROM UserEvent e WHERE e.userId = :userId")
})
@Getter @Setter
public class UserEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "usr")
    @Id
    private String userId;

    @Column(name = "event")
    @Id
    private String eventId;

}