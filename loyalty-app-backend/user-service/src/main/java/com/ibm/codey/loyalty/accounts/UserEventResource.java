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
import com.ibm.codey.loyalty.interceptor.LoggingInterceptor;

@RequestScoped
@Interceptors(LoggingInterceptor.class)
@Path("v1/userEvents")
public class UserEventResource extends BaseResource {

    @Inject
    private UserDao userDAO;

    @Inject
    private UserEventDao userEventDAO;

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

}
