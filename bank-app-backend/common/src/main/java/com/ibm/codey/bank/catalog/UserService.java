package com.ibm.codey.bank.catalog;

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

import com.ibm.codey.bank.accounts.json.UserRegistration;
import com.ibm.codey.bank.accounts.json.UserRegistrationInfo;

@Dependent
@RegisterRestClient
public interface UserService {

    @GET
    @Path("self")
    @Produces(MediaType.APPLICATION_JSON)
    public UserRegistrationInfo getUserConsent(@HeaderParam("Authorization") String authorizationHeader);

}