package com.ibm.codey.loyalty.catalog;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.interceptor.Interceptors;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.ibm.codey.loyalty.catalog.dao.EventDao;
import com.ibm.codey.loyalty.catalog.json.EventDefinition;
import com.ibm.codey.loyalty.catalog.models.Event;
import com.ibm.codey.loyalty.interceptor.LoggingInterceptor;
import com.ibm.codey.loyalty.interceptor.binding.RequiresAuthorization;

@RequestScoped
@Interceptors(LoggingInterceptor.class)
@Path("v1/events")
public class EventResource {

    @Inject
    private EventDao eventDAO;

    /**
     * This method creates an event in the catalog.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    @RequiresAuthorization
    public Response createEvent(EventDefinition eventDefinition) {
        Event newEvent = new Event();
        String eventId = UUID.randomUUID().toString();
        newEvent.setEventId(eventId);
        newEvent.setEventName(eventDefinition.getEventName());
        newEvent.setPointValue(eventDefinition.getPointValue());
        newEvent.setEventLocation(eventDefinition.getEventLocation());
        newEvent.setStartTime(eventDefinition.getStartTime());
        newEvent.setEndTime(eventDefinition.getEndTime());
        newEvent.setEventDescription(eventDefinition.getEventDescription());
        eventDAO.createEvent(newEvent);
        return Response.status(Response.Status.CREATED).entity(eventId).build();
    }

    /**
     * This method returns an event.
     */
    @GET
    @Path("{eventId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response getEvent(@PathParam("eventId") String eventId) {
        // Validate UUID is formatted correctly.
        try {
            UUID.fromString(eventId);
        } catch(IllegalArgumentException iae) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid event id").build();
        }
        Event event = eventDAO.findEvent(eventId);
        if (event == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Event not found").build();
        }
        EventDefinition eventDefinition = new EventDefinition();
        eventDefinition.setEventName(event.getEventName());
        eventDefinition.setPointValue(event.getPointValue());
        eventDefinition.setEventLocation(event.getEventLocation());
        eventDefinition.setStartTime(event.getStartTime());
        eventDefinition.setEndTime(event.getEndTime());
        eventDefinition.setEventDescription(event.getEventDescription());
        return Response.status(Response.Status.OK).entity(eventDefinition).build();
    }

    /**
     * This method updates a event.
     */
    @PUT
    @Path("{eventId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    @RequiresAuthorization
    public Response updateEvent(@PathParam("eventId") String eventId, EventDefinition eventDefinition) {
        // Validate UUID is formatted correctly.
        try {
            UUID.fromString(eventId);
        } catch(IllegalArgumentException iae) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid event id").build();
        }
        Event event = eventDAO.findEvent(eventId);
        if (event == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Event not found").build();
        }
        event.setEventName(eventDefinition.getEventName());
        event.setPointValue(eventDefinition.getPointValue());
        event.setEventLocation(eventDefinition.getEventLocation());
        event.setStartTime(eventDefinition.getStartTime());
        event.setEndTime(eventDefinition.getEndTime());
        event.setEventDescription(eventDefinition.getEventDescription());
        eventDAO.updateEvent(event);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    /**
     * This method returns the events.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response getEvents(@QueryParam("id") List<String> idList) {
        List<Event> events;
        if (idList == null || idList.size() == 0) {
            events = eventDAO.findEvents();
        } else {
            events = eventDAO.findEventsById(idList);
        }
        Map<String, EventDefinition> eventsResponse = new HashMap<String, EventDefinition>(events.size());
        for (Event event : events) {
            EventDefinition eventDefinition = new EventDefinition();
            eventDefinition.setEventName(event.getEventName());
            eventDefinition.setPointValue(event.getPointValue());
            eventDefinition.setEventLocation(event.getEventLocation());
            eventDefinition.setStartTime(event.getStartTime());
            eventDefinition.setEndTime(event.getEndTime());
            eventDefinition.setEventDescription(event.getEventDescription());
            eventsResponse.put(event.getEventId(), eventDefinition);
        }
        return Response.status(Response.Status.OK).entity(eventsResponse).build();
    }

}
