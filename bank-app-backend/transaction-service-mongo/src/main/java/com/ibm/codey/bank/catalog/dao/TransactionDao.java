package com.ibm.codey.bank.catalog.dao;

import java.math.BigDecimal;
import java.net.URL;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.WebApplicationException;

import com.ibm.codey.bank.catalog.KnativeService;
import com.ibm.codey.bank.catalog.models.Category;
import com.ibm.codey.bank.catalog.models.Transaction;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.RestClientBuilder;

import static com.mongodb.client.model.Filters.*;

@ApplicationScoped
public class TransactionDao {

    @Inject
    MongoDatabase db;

    @Inject
    @ConfigProperty(name = "KNATIVE_SERVICE_URL")
    private URL knativeServiceURL;

    public void createTransaction(Transaction transaction) {
        MongoCollection<Transaction> collection = db.getCollection("transactions", Transaction.class);
        collection.insertOne(transaction);
        KnativeService knativeService = RestClientBuilder.newBuilder().baseUrl(knativeServiceURL).build(KnativeService.class);
        try {
            System.out.println(knativeServiceURL);
            knativeService.processTransaction(transaction.getTransactionId().toString(), transaction.getCategory(), transaction.getAmount().toString());
        } catch (WebApplicationException wae) {
            System.out.print("web app exception");
            wae.printStackTrace();
        }
        
    }

    public void updateTransaction(Transaction transaction) {
        MongoCollection<Transaction> collection = db.getCollection("transactions", Transaction.class);
        collection.replaceOne(eq("transactionId", transaction.getTransactionId()), transaction);
    }

    public List<Transaction> findTransactions() {
        MongoCollection<Transaction> collection = db.getCollection("transactions", Transaction.class);
        List<Transaction> list = new ArrayList<>();
        MongoCursor<Transaction> iterator = collection.find().iterator();
        while (iterator.hasNext()) {
            list.add(iterator.next());
        }
        return list;
    }

    public List<Transaction> findTransactionsByUser(String userId) {
        MongoCollection<Transaction> collection = db.getCollection("transactions", Transaction.class);
        List<Transaction> list = new ArrayList<>();
        collection.find(eq("userId", UUID.fromString(userId))).forEach(t -> list.add(t));
        return list;
    }

    public Transaction findTransactionById(String transactionId) {
        MongoCollection<Transaction> collection = db.getCollection("transactions", Transaction.class);
        return collection.find(eq("transactionId", UUID.fromString(transactionId))).first();
    }

    public List<Category> groupCategoriesForUser(String userId) {
        List<Category> list = new ArrayList<>();
        db.getCollection("transactions", Category.class).aggregate(Arrays.asList(
            Aggregates.match(eq("userId", UUID.fromString(userId))),
            Aggregates.group("$category", Accumulators.sum("amount", "$amount"))
        )).forEach(document -> list.add(document));
        return list;
    }
}