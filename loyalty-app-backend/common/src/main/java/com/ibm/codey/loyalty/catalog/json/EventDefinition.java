package com.ibm.codey.loyalty.catalog.json;

import java.time.OffsetDateTime;

import javax.json.bind.annotation.JsonbProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class EventDefinition {

    @JsonbProperty
    private String eventName;

    @JsonbProperty
    private int pointValue;

    @JsonbProperty
    private String eventLocation;

    @JsonbProperty
    private String eventDescription;

    @JsonbProperty
    private OffsetDateTime startTime;

    @JsonbProperty
    private OffsetDateTime endTime;

}
