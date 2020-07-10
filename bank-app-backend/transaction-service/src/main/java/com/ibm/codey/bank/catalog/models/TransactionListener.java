package com.ibm.codey.bank.catalog.models;

import java.net.URL;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.persistence.PostPersist;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.RestClientBuilder;

import com.ibm.codey.bank.catalog.KnativeService;

@RequestScoped
public class TransactionListener {

  @Inject
  @ConfigProperty(name = "KNATIVE_SERVICE_URL")
  private URL knativeServiceURL;

  @PostPersist
  public void sendToProcessing(Transaction transaction) {
    KnativeService knativeService = RestClientBuilder.newBuilder().baseUrl(knativeServiceURL).build(KnativeService.class);
    
    try {
      knativeService.processTransaction(transaction.getTransactionId(), transaction.getCategory(), transaction.getAmount().toString());
    } catch (WebApplicationException wae) {
      System.out.print("web app exception");
      int status = wae.getResponse().getStatus();
      if (status == Response.Status.NOT_FOUND.getStatusCode()) {
        // TODO: ..
      } else {
        wae.printStackTrace();
      }
    }
  }

}
