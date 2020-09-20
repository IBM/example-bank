package com.ibm.codey.bank.catalog;

import java.net.URL;
import java.time.OffsetDateTime;
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
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.RestClientBuilder;

import com.ibm.codey.bank.BaseResource;
import com.ibm.codey.bank.accounts.json.UserRegistration;
import com.ibm.codey.bank.accounts.json.UserRegistrationInfo;
import com.ibm.codey.bank.catalog.dao.TransactionDao;
import com.ibm.codey.bank.catalog.json.CreateTransactionDefinition;
import com.ibm.codey.bank.catalog.json.RewardTransactionDefinition;
import com.ibm.codey.bank.catalog.models.Category;
import com.ibm.codey.bank.catalog.models.Transaction;
import com.ibm.codey.bank.interceptor.LoggingInterceptor;
import com.ibm.codey.bank.interceptor.binding.RequiresAuthorization;

@RequestScoped
@Interceptors(LoggingInterceptor.class)
@Path("v1/transactions")
public class TransactionResource extends BaseResource {

    @Inject
    private TransactionDao transactionDao;

    @Inject
    @ConfigProperty(name = "USER_SERVICE_URL")
    private URL userServiceURL;

    /**
     * This method creates a transaction.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createTransaction(CreateTransactionDefinition createTransactionDefinition) {

        Transaction newTransaction = new Transaction();
        // create new uuid for new transaction
        String transactionId = UUID.randomUUID().toString();

        // get subject
        String subject = this.getCallerSubject();
        // get user
        UserService userService = RestClientBuilder.newBuilder().baseUrl(userServiceURL).build(UserService.class);
        try {
            UserRegistrationInfo userRegistration = userService.getUserConsent(this.getCallerCredentials());
            if (!userRegistration.isConsentGiven()) {
                return Response.status(Response.Status.CONFLICT).entity("User has not consented to program").build();
            }

            newTransaction.setTransactionId(transactionId);
            newTransaction.setUserId(userRegistration.getUserId());
            newTransaction.setTransactionName(createTransactionDefinition.getTransactionName());
            newTransaction.setCategory(createTransactionDefinition.getCategory());
            newTransaction.setAmount(createTransactionDefinition.getAmount());
            newTransaction.setProcessed(false);
            newTransaction.setDate(OffsetDateTime.now());
            transactionDao.createTransaction(newTransaction);

            return Response.status(Response.Status.NO_CONTENT).build();
        } catch(WebApplicationException wae) {
            int status = wae.getResponse().getStatus();
            if (status == Response.Status.NOT_FOUND.getStatusCode()) {
                return Response.status(Response.Status.NOT_FOUND).entity("User not registered").build();
            } else {
                wae.printStackTrace();
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
            }
        }
    }

    /**
     * This method gets the transactions of a user.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response getTransactions() {
        // get subject
        String subject = this.getCallerSubject();
        // get user
        UserService userService = RestClientBuilder.newBuilder().baseUrl(userServiceURL).build(UserService.class);
        try {
            UserRegistrationInfo userRegistration = userService.getUserConsent(this.getCallerCredentials());
            if (!userRegistration.isConsentGiven()) {
                return Response.status(Response.Status.CONFLICT).entity("User has not consented to program").build();
            }

            List<Transaction> transactions = transactionDao.findTransactionsByUser(userRegistration.getUserId());
            return Response.status(Response.Status.OK).entity(transactions).build();
        } catch(WebApplicationException wae) {
            int status = wae.getResponse().getStatus();
            if (status == Response.Status.NOT_FOUND.getStatusCode()) {
                return Response.status(Response.Status.NOT_FOUND).entity("User not registered").build();
            } else {
                wae.printStackTrace();
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
            }
        }
    }

    /**
     * This method gets the spending categories of a user.
     */
    @GET
    @Path("spending")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response getCategory() {
        // get subject
        String subject = this.getCallerSubject();
        // get user
        UserService userService = RestClientBuilder.newBuilder().baseUrl(userServiceURL).build(UserService.class);
        try {
            UserRegistrationInfo userRegistration = userService.getUserConsent(this.getCallerCredentials());
            if (!userRegistration.isConsentGiven()) {
                return Response.status(Response.Status.CONFLICT).entity("User has not consented to program").build();
            }

            List<Category> categories = transactionDao.groupCategoriesForUser(userRegistration.getUserId());
            return Response.status(Response.Status.OK).entity(categories).build();
        } catch(WebApplicationException wae) {
            int status = wae.getResponse().getStatus();
            if (status == Response.Status.NOT_FOUND.getStatusCode()) {
                return Response.status(Response.Status.NOT_FOUND).entity("User not registered").build();
            } else {
                wae.printStackTrace();
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
            }
        }
    }

    // TODO: require admin scope
    /**
     * This method updates a transaction.
     */
    @PUT
    @Path("reward/{transactionId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    @RequiresAuthorization
    public Response updateTransaction(@PathParam("transactionId") String transactionId, RewardTransactionDefinition rewardTransactionDefinition) {
        // Validate UUID is formatted correctly.
        try {
            UUID.fromString(transactionId);
        } catch(IllegalArgumentException iae) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid transaction id").build();
        }

        Transaction transaction = transactionDao.findTransactionById(transactionId);
        if (transaction == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Transaction not found").build();
        }
        
        if (transaction.isProcessed()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Transaction already processed").build();
        }

        transaction.setPointsEarned(rewardTransactionDefinition.getPointsEarned());
        transaction.setProcessed(true);
        transactionDao.updateTransaction(transaction);

        return Response.status(Response.Status.NO_CONTENT).build();
    }

}
