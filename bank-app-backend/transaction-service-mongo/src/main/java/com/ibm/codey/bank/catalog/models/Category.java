package com.ibm.codey.bank.catalog.models;

import java.math.BigDecimal;

import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.bson.types.Decimal128;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class Category {
  
  @BsonProperty("_id")
  private String category;

  private Decimal128 amount;

  public Category() {
	}
}
