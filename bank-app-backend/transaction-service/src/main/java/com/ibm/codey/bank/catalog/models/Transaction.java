package com.ibm.codey.bank.catalog.models;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "transactions")
@IdClass(TransactionPK.class)
@NamedQueries({
  @NamedQuery(name = "Transaction.findTransactions", query = "SELECT t FROM Transaction t"),
  @NamedQuery(name = "Transaction.findTransactionsByUser", query = "SELECT t FROM Transaction t WHERE t.userId = :userId"),
  @NamedQuery(name = "Transaction.findTransactionById", query = "SELECT t FROM Transaction t WHERE t.transactionId = :transactionId AND t.userId = :userId"),
  @NamedQuery(name = "Transaction.findTransactionByIdOnly", query = "SELECT t FROM Transaction t WHERE t.transactionId = :transactionId"),
  @NamedQuery(name = "Transaction.groupCategoriesForUser", query = "SELECT COALESCE(t.category, 'Uncategorized'), SUM (t.amount) FROM Transaction t WHERE t.userId = :userId GROUP BY t.category")
})
@Getter @Setter
@EntityListeners(TransactionListener.class)
public class Transaction implements Serializable {

  private static final long serialVersionUID = 1L;

  @Column(name = "transaction_id")
  @Id
  private String transactionId;

  @Id
  @Column(name = "usr")
  private String userId;

  @Column(name = "transaction_name")
  private String transactionName;

  @Column(name = "amount")
  private BigDecimal amount;

  @Column(name = "category")
  private String category;

  @Column(name = "points_earned")
  private BigDecimal pointsEarned;

  @Column(name = "processed")
  private boolean processed;

  @Column(name = "date")
  private OffsetDateTime date;

  public Transaction() {
  }

}
