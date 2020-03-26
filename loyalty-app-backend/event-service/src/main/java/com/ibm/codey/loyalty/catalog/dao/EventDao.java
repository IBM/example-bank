package com.ibm.codey.loyalty.catalog.dao;

import java.util.List;

import javax.enterprise.context.RequestScoped;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.ibm.codey.loyalty.catalog.models.Event;

@RequestScoped
public class EventDao {

    @PersistenceContext(name = "jpa-unit")
    private EntityManager em;

    public void createEvent(Event event) {
        em.persist(event);
    }

    public void updateEvent(Event event) {
        em.merge(event);
    }

    public Event findEvent(String eventId) {
        return em.find(Event.class, eventId);
    }

    public List<Event> findEvents() {
        return em.createNamedQuery("Event.findEvents", Event.class)
                .getResultList();
    }

    public List<Event> findEventsById(List<String> eventIds) {
        return em.createNamedQuery("Event.findEventsById", Event.class)
                .setParameter("idList", eventIds).getResultList();
    }

}