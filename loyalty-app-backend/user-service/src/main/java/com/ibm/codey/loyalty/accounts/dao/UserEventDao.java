package com.ibm.codey.loyalty.accounts.dao;

import java.util.List;

import javax.enterprise.context.RequestScoped;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;

import com.ibm.codey.loyalty.accounts.models.UserEvent;

@RequestScoped
public class UserEventDao {

    @PersistenceContext(name = "jpa-unit")
    private EntityManager em;

    public void createUserEvent(UserEvent userEvent) {
        em.persist(userEvent);
    }

    public UserEvent findUserEvent(String userId, String eventId) {
        try {
            return em.createNamedQuery("UserEvent.findUserEvent", UserEvent.class)
                .setParameter("userId", userId).setParameter("eventId", eventId).getSingleResult();
        } catch(NoResultException e) {
            return null;
        }
    }

    // This method returns the UserEvent model for each event attended by the user (so no event details are available).
    public List<UserEvent> findUserEventsByUserId(String userId) {
        return em.createNamedQuery("UserEvent.findUserEventsByUserId", UserEvent.class)
                .setParameter("userId", userId).getResultList();
    }

}