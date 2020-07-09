package com.ibm.codey.bank.catalog.json;

import java.math.BigDecimal;

import javax.json.bind.annotation.JsonbProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class RewardTransactionDefinition {

    @JsonbProperty
    private BigDecimal pointsEarned;

}
