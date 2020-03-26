package com.ibm.codey.loyalty.accounts.json;

import javax.json.bind.annotation.JsonbProperty;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserEventInfo {

    @JsonbProperty
    private int pointsEarned;

    @JsonbProperty
    private int eventCount;

}