package com.ibm.codey.bank.accounts.dao;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

import java.util.Arrays;

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;

@ApplicationScoped
public class MongoProducer {

    @Inject
    @ConfigProperty(name = "mongo.hostname", defaultValue = "mongo")
    String hostname;

    @Inject
    @ConfigProperty(name = "mongo.port", defaultValue = "27017")
    String port;

    @Inject
    @ConfigProperty(name = "mongo.dbname", defaultValue = "example")
    String dbName;

    // @Inject
    // @ConfigProperty(name = "mongo.user")
    // String user;

    // @Inject
    // @ConfigProperty(name = "mongo.pass")
    // String pass;

    @Produces
    public MongoClient createMongo() {
        CodecRegistry pojoCodecRegistry = fromRegistries(MongoClientSettings.getDefaultCodecRegistry(),
            fromProviders(PojoCodecProvider.builder().automatic(true).build()));

        // use local
        MongoClientSettings settings = MongoClientSettings.builder()
            .codecRegistry(pojoCodecRegistry)
            .applyToClusterSettings(builder ->
                            builder.hosts(Arrays.asList(new ServerAddress("mongo"))))
            .build();

        return MongoClients.create(settings);
    }

    @Produces
    public MongoDatabase createDB(MongoClient client) {
        return client.getDatabase("example");
    }

    public void close(@Disposes MongoClient toClose) {
        toClose.close();
    }
}