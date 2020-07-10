package com.ibm.codey.bank.catalog.dao;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.enterprise.context.RequestScoped;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;

import com.ibm.codey.bank.catalog.models.Category;
import com.ibm.codey.bank.catalog.models.Transaction;

@RequestScoped
public class TransactionDao {

    @PersistenceContext(name = "jpa-unit")
    private EntityManager em;

    public void createTransaction(Transaction transaction) {
        em.persist(transaction);
    }

    public void updateTransaction(Transaction transaction) {
        em.merge(transaction);
    }

    public List<Transaction> findTransactions() {
        return em.createNamedQuery("Transaction.findTransactions", Transaction.class)
                .getResultList();
    }

    public List<Transaction> findTransactionsByUser(String userId) {
        return em.createNamedQuery("Transaction.findTransactionsByUser", Transaction.class)
            .setParameter("userId", userId)
            .getResultList();
    }

    public Transaction findTransactionById(String transactionId) {
        try {
            return em.createNamedQuery("Transaction.findTransactionByIdOnly", Transaction.class)
            .setParameter("transactionId", transactionId)
            .getSingleResult();
        } catch(NoResultException e) {
            return null;
        }
    }

    public Transaction findTransactionById(String transactionId, String userId) {
        try {
            return em.createNamedQuery("Transaction.findTransactionById", Transaction.class)
            .setParameter("transactionId", transactionId)
            .setParameter("userId", userId)
            .getSingleResult();
        } catch(NoResultException e) {
            return null;
        }
    }

    public List<Category> groupCategoriesForUser(String userId) {
        try {
            List<Object[][]> rows = em.createNamedQuery("Transaction.groupCategoriesForUser", Object[][].class)
            .setParameter("userId", userId)
            .getResultList();
            List<Category> response = new ArrayList<>();
            for (Object[] row: rows) {
                if (row.length == 2) {
                    response.add(new Category(row[0].toString(), new BigDecimal(row[1].toString())));
                }
            }

            return response;
        } catch(NoResultException e) {
            return null;
        }
    }
}