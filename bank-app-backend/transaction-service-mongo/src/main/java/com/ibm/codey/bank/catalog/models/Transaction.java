package com.ibm.codey.bank.catalog.models;

import java.time.Instant;
import java.util.UUID;

import org.bson.types.Decimal128;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class Transaction {

  private UUID transactionId;

  private UUID userId;

  private String transactionName;

  private Decimal128 amount;

  private String category;

  private Decimal128 pointsEarned;

  private boolean processed;

  private Instant date;

  public Transaction() {
  }

}
