package com.ibm.codey.loyalty.catalog.models;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Category {
  
  private String category;
  private int count;

  public Category(String category, int count) {
    this.category = category;
    this.count = count;
	}
}
