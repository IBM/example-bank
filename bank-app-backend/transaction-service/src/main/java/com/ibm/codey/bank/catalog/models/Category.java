package com.ibm.codey.bank.catalog.models;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Category {
  
  private String category;
  private BigDecimal amount;

  public Category(String category, BigDecimal amount) {
    this.category = category;
    this.amount = amount;
	}
}
