package com.ibm.codey.bank.accounts.dao;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import com.ibm.codey.bank.accounts.models.User;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import static com.mongodb.client.model.Filters.*;

import java.util.UUID;

@ApplicationScoped
public class UserDao {

    @Inject
    MongoDatabase db;

    public void createUser(final User user) {
        MongoCollection<User> collection = db.getCollection("users", User.class);
        collection.insertOne(user);
    }

    public void updateUser(final User user) {
        MongoCollection<User> collection = db.getCollection("users", User.class);
        collection.replaceOne(eq("userId", user.getUserId()), user);
    }

    public User findUserByRegistryId(final String subject) {
        return db.getCollection("users", User.class).find(eq("subject", UUID.fromString(subject))).first();
    }

}