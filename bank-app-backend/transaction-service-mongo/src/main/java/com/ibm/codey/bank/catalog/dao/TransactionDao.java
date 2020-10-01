package com.ibm.codey.bank.catalog.dao;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import com.ibm.codey.bank.catalog.models.Category;
import com.ibm.codey.bank.catalog.models.Transaction;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;

import static com.mongodb.client.model.Filters.*;

@RequestScoped
public class TransactionDao {

    @Inject
    MongoDatabase db;

    public void createTransaction(Transaction transaction) {
        MongoCollection<Transaction> collection = db.getCollection("transactions", Transaction.class);
        collection.insertOne(transaction);
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