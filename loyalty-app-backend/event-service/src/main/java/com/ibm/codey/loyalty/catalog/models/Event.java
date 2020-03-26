package com.ibm.codey.loyalty.catalog.models;

import java.io.Serializable;
import java.time.OffsetDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "events")
@NamedQueries({
  @NamedQuery(name = "Event.findEvents", query = "SELECT e FROM Event e"),
  @NamedQuery(name = "Event.findEventsById", query = "SELECT e FROM Event e WHERE e.eventId IN :idList")
})
@Getter @Setter
public class Event implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "event_id")
    @Id
    private String eventId;

    @Column(name = "event_name")
    private String eventName;

    @Column(name = "description")
    private String eventDescription;

    @Column(name = "location")
    private String eventLocation;

    @Column(name = "start_time")
    private OffsetDateTime startTime;

    @Column(name = "end_time")
    private OffsetDateTime endTime;

    @Column(name = "point_value")
    private int pointValue;

    public Event() {
    }

}
