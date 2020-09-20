package com.ibm.codey.bank.catalog;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletionStage;

import javax.enterprise.context.Dependent;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@Dependent
@RegisterRestClient
public interface KnativeService {

    @POST
    @Path("process")
    public CompletionStage<String> processTransaction(@QueryParam("transactionId") String transactionId, @QueryParam("category") String category, @QueryParam("amount") String amount);

}