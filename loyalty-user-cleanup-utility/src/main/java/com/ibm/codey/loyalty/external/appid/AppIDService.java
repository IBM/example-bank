package com.ibm.codey.loyalty.external.appid;

import javax.ws.rs.HeaderParam;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

public interface AppIDService extends AutoCloseable {

    public static String DATASCOPE_FULL = "full";

    @GET
    @Path("/management/v4/{tenantId}/users")
    @Produces({MediaType.APPLICATION_JSON})
    public AppIDServiceGetUsersResponse getUsers(
      @HeaderParam("Authorization") String authorizationHeader,
      @PathParam("tenantId") String tenantId,
      @QueryParam("dataScope") String dataScope,
      @QueryParam("startIndex") int startIndex,
      @QueryParam("count") int count
    );

    @GET
    @Path("/management/v4/{tenantId}/users/{id}/roles")
    @Produces({MediaType.APPLICATION_JSON})
    public AppIDServiceGetUserRoleResponse getUserRoles(
      @HeaderParam("Authorization") String authorizationHeader,
      @PathParam("tenantId") String tenantId,
      @PathParam("id") String profileId
    );

    @DELETE
    @Path("/management/v4/{tenantId}/cloud_directory/remove/{userId}")
    public void removeUser(
      @HeaderParam("Authorization") String authorizationHeader,
      @PathParam("tenantId") String tenantId,
      @PathParam("userId") String userId
    );

}