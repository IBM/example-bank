package com.ibm.codey.loyalty.catalog;

import java.util.List;
import java.util.Map;

import javax.enterprise.context.Dependent;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.PathParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import com.ibm.codey.loyalty.catalog.json.EventDefinition;

@Dependent
@RegisterRestClient
public interface EventService {

    @GET
    @Path("{eventId}")
    @Produces(MediaType.APPLICATION_JSON)
    public EventDefinition getEvent(@HeaderParam("Authorization") String authorizationHeader, @PathParam("eventId") String eventId);

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, EventDefinition> getEvents(@HeaderParam("Authorization") String authorizationHeader, @QueryParam("id") List<String> idList);

}