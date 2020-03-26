package com.ibm.codey.loyalty.accounts;

import java.net.URL;
import java.util.ArrayList;
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
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.RestClientBuilder;

import com.ibm.codey.loyalty.BaseResource;
import com.ibm.codey.loyalty.accounts.dao.UserDao;
import com.ibm.codey.loyalty.accounts.dao.UserEventDao;
import com.ibm.codey.loyalty.accounts.models.User;
import com.ibm.codey.loyalty.accounts.models.UserEvent;
import com.ibm.codey.loyalty.accounts.json.UserEventCheckIn;
import com.ibm.codey.loyalty.accounts.json.UserEventInfo;
import com.ibm.codey.loyalty.catalog.EventService;
import com.ibm.codey.loyalty.catalog.json.EventDefinition;
import com.ibm.codey.loyalty.interceptor.LoggingInterceptor;

@RequestScoped
@Interceptors(LoggingInterceptor.class)
@Path("v1/userEvents")
public class UserEventResource extends BaseResource {

    @Inject
    private UserDao userDAO;

    @Inject
    private UserEventDao userEventDAO;

    @Inject
    @ConfigProperty(name = "EVENT_SERVICE_URL")
    private URL eventServiceURL;

    /**
     * This method checks a user into an event.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response eventCheckIn(UserEventCheckIn checkIn) {
        String subject = this.getCallerSubject();
        if (subject == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Missing subject").build();
        }
        User user = userDAO.findUserByRegistryId(subject);
        if (user == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("User is not registered").build();
        }
        if (!user.isConsentGiven()) {
            return Response.status(Response.Status.CONFLICT).entity("User has not consented to program").build();
        }
        // Validate event UUID is formatted correctly.
        String eventId = checkIn.getEventId();
        try {
            UUID.fromString(eventId);
        } catch(IllegalArgumentException iae) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid event id").build();
        }
        // Validate event with event service.
        EventService eventService = RestClientBuilder.newBuilder().baseUrl(eventServiceURL).build(EventService.class);
        try {
            eventService.getEvent(this.getCallerCredentials(), eventId);
        } catch(WebApplicationException wae) {
            int status = wae.getResponse().getStatus();
            if (status == Response.Status.NOT_FOUND.getStatusCode()) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Unregistered event id").build();
            } else {
                wae.printStackTrace();
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
            }
        }
        UserEvent newUserEvent = new UserEvent();
        newUserEvent.setUserId(user.getUserId());
        newUserEvent.setEventId(eventId);
        if (userEventDAO.findUserEvent(user.getUserId(), eventId) != null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("User is already checked in for this event").build();
        }
        userEventDAO.createUserEvent(newUserEvent);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    /**
     * This method returns the events that a user attended.
     */
    @GET
    @Path("self")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response getUserEvents() {
        String subject = this.getCallerSubject();
        if (subject == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Missing subject").build();
        }
        User prevUser = userDAO.findUserByRegistryId(subject);
        if (prevUser == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("User is not registered").build();
        }
        if (!prevUser.isConsentGiven()) {
            return Response.status(Response.Status.CONFLICT).entity("User has not consented to program").build();
        }
        List<UserEvent> userEvents = userEventDAO.findUserEventsByUserId(prevUser.getUserId());
        List<String> userEventsResponse = new ArrayList<String>(userEvents.size());
        for (UserEvent userEvent : userEvents) {
            userEventsResponse.add(userEvent.getEventId());
        }
        return Response.status(Response.Status.OK).entity(userEventsResponse).build();
    }

    /**
     * This method returns information about a user's usage of the loyalty program.
     */
    @GET
    @Path("self/info")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response getUserInfo() {
        String subject = this.getCallerSubject();
        if (subject == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Missing subject").build();
        }
        User prevUser = userDAO.findUserByRegistryId(subject);
        if (prevUser == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("User is not registered").build();
        }
        if (!prevUser.isConsentGiven()) {
            return Response.status(Response.Status.CONFLICT).entity("User has not consented to program").build();
        }
        List<UserEvent> userEvents = userEventDAO.findUserEventsByUserId(prevUser.getUserId());
        List<String> eventIds = new ArrayList<String>(userEvents.size());
        for (UserEvent userEvent : userEvents) {
            eventIds.add(userEvent.getEventId());
        }
        int eventPoints = 0;
        if (!eventIds.isEmpty()) {
            EventService eventService = RestClientBuilder.newBuilder().baseUrl(eventServiceURL).build(EventService.class);
            Map<String, EventDefinition> eventDefinitions = eventService.getEvents(this.getCallerCredentials(), eventIds);
            for (EventDefinition eventDefinition : eventDefinitions.values()) {
                eventPoints += eventDefinition.getPointValue();
            }
        }
        UserEventInfo userEventInfo = new UserEventInfo();
        userEventInfo.setEventCount(userEvents.size());
        userEventInfo.setPointsEarned(eventPoints);
        return Response.status(Response.Status.OK).entity(userEventInfo).build();
    }

}
