package it.com.ibm.codey.loyalty.catalog;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.HashMap;

import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang3.RandomStringUtils;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.ibm.codey.loyalty.catalog.json.EventDefinition;

import it.com.ibm.codey.loyalty.EndpointTestBase;
import it.com.ibm.codey.loyalty.util.TestSecurityHelper;

public class EventsEndpointTest extends EndpointTestBase {

    private String eventName;
    private int pointValue;
    private String eventDescription;
    private String eventLocation;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;

    @Before
    public void setup() {
        super.setup();
        // Set up a normal user to test methods which don't require admin.
        setupUser();
        // Set up an admin user.
        adminAccessToken = TestSecurityHelper.signOn(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
        // Set up event attributes.
        String suffix = RandomStringUtils.randomAlphabetic(8);
        eventName = "test event " + suffix;
        eventDescription = "all about " + suffix;
        eventLocation = "at " + suffix;
        startTime = OffsetDateTime.now();
        endTime = OffsetDateTime.now().plusHours(1);
        pointValue = (int) ((Math.random() * 99) + 1);
    }

    @After
    public void teardown() {
        removeUser();
        super.teardown();
    }

    @Test
    public void testCreateEvent() {
        // Use POST to create an event.
        EventDefinition eventDefinition = new EventDefinition();
        eventDefinition.setEventName(eventName);
        eventDefinition.setPointValue(pointValue);
        eventDefinition.setEventDescription(eventDescription);
        eventDefinition.setEventLocation(eventLocation);
        eventDefinition.setStartTime(startTime);
        eventDefinition.setEndTime(endTime);
        String eventId = post(EVENTS_BASEURL, EVENTS_ENDPOINT, eventDefinition, adminAccessToken, Response.Status.CREATED, String.class);
        // Use GET to get the event.  This method does not require admin.
        EventDefinition checkEventDefinition = get(EVENTS_BASEURL, EVENTS_ENDPOINT + '/' + eventId, null, userAccessToken, Response.Status.OK, EventDefinition.class);
        assertEquals("Event name is incorrect", eventName, checkEventDefinition.getEventName());
        assertEquals("Point value is incorrect", pointValue, checkEventDefinition.getPointValue());
        assertEquals("Event description is incorrect", eventDescription, checkEventDefinition.getEventDescription());
        assertEquals("Event location is incorrect", eventLocation, checkEventDefinition.getEventLocation());
        assertEquals("Event start time is incorrect", startTime.toInstant(), checkEventDefinition.getStartTime().toInstant());  // Use toInstant to normalize timezones
        assertEquals("Event end time is incorrect", endTime.toInstant(), checkEventDefinition.getEndTime().toInstant());
    }

    @Test
    public void testGetAllEvents() {
        // Use POST to create an event.  An admin user must do this.
        EventDefinition eventDefinition = new EventDefinition();
        eventDefinition.setEventName(eventName);
        eventDefinition.setPointValue(pointValue);
        eventDefinition.setEventDescription(eventDescription);
        eventDefinition.setEventLocation(eventLocation);
        eventDefinition.setStartTime(startTime);
        eventDefinition.setEndTime(endTime);
        String eventId = post(EVENTS_BASEURL, EVENTS_ENDPOINT, eventDefinition, adminAccessToken, Response.Status.CREATED, String.class);
        // Use GET to get all events.  This method does not require admin.
        GenericType<Map<String, EventDefinition>> eventDefinitionMapType = new GenericType<Map<String, EventDefinition>>() {};
        Map<String, EventDefinition> eventDefinitionsMap = get(EVENTS_BASEURL, EVENTS_ENDPOINT, null, userAccessToken, Response.Status.OK, eventDefinitionMapType.getType());
        assertNotNull("GET did not return any events", eventDefinitionsMap);
        EventDefinition checkEventDefinition = eventDefinitionsMap.get(eventId);
        assertNotNull("GET did not return the event that was just created", checkEventDefinition);
        assertEquals("Event name is incorrect", eventName, checkEventDefinition.getEventName());
        assertEquals("Point value is incorrect", pointValue, checkEventDefinition.getPointValue());
        assertEquals("Event description is incorrect", eventDescription, checkEventDefinition.getEventDescription());
        assertEquals("Event location is incorrect", eventLocation, checkEventDefinition.getEventLocation());
        assertEquals("Event start time is incorrect", startTime.toInstant(), checkEventDefinition.getStartTime().toInstant());  // Use toInstant to normalize timezones
        assertEquals("Event end time is incorrect", endTime.toInstant(), checkEventDefinition.getEndTime().toInstant());
    }

    @Test
    public void testSearchEvent() {
        // Use POST to create an event.  An admin user must do this.
        EventDefinition eventDefinition = new EventDefinition();
        eventDefinition.setEventName(eventName);
        eventDefinition.setPointValue(pointValue);
        eventDefinition.setEventDescription(eventDescription);
        eventDefinition.setEventLocation(eventLocation);
        eventDefinition.setStartTime(startTime);
        eventDefinition.setEndTime(endTime);
        String eventId = post(EVENTS_BASEURL, EVENTS_ENDPOINT, eventDefinition, adminAccessToken, Response.Status.CREATED, String.class);
        // Use GET to search for this event.  This method does not require admin.
        Map<String,Object> queryParams = Collections.singletonMap("id", eventId);
        GenericType<Map<String, EventDefinition>> eventDefinitionMapType = new GenericType<Map<String, EventDefinition>>() {};
        Map<String, EventDefinition> eventDefinitionsMap = get(EVENTS_BASEURL, EVENTS_ENDPOINT, queryParams, userAccessToken, Response.Status.OK, eventDefinitionMapType.getType());
        assertNotNull("GET did not return any events", eventDefinitionsMap);
        EventDefinition checkEventDefinition = eventDefinitionsMap.get(eventId);
        assertNotNull("GET did not return the event that was just created", checkEventDefinition);
        assertEquals("Event name is incorrect", eventName, checkEventDefinition.getEventName());
        assertEquals("Point value is incorrect", pointValue, checkEventDefinition.getPointValue());
        assertEquals("Event description is incorrect", eventDescription, checkEventDefinition.getEventDescription());
        assertEquals("Event location is incorrect", eventLocation, checkEventDefinition.getEventLocation());
        assertEquals("Event start time is incorrect", startTime.toInstant(), checkEventDefinition.getStartTime().toInstant());  // Use toInstant to normalize timezones
        assertEquals("Event end time is incorrect", endTime.toInstant(), checkEventDefinition.getEndTime().toInstant());
    }

    @Test
    public void testCreateAndUpdateEvent() {
        // Use POST to create an event.  An admin user must do this.
        EventDefinition eventDefinition = new EventDefinition();
        eventDefinition.setEventName(eventName);
        eventDefinition.setPointValue(pointValue);
        eventDefinition.setEventDescription(eventDescription);
        eventDefinition.setEventLocation(eventLocation);
        eventDefinition.setStartTime(startTime);
        eventDefinition.setEndTime(endTime);
        String eventId = post(EVENTS_BASEURL, EVENTS_ENDPOINT, eventDefinition, adminAccessToken, Response.Status.CREATED, String.class);
        // Use PUT to modify the event.  An admin user must do this.
        eventDefinition.setEventName(eventName + eventName);
        eventDefinition.setPointValue(pointValue*2);
        put(EVENTS_BASEURL, EVENTS_ENDPOINT + '/' + eventId, eventDefinition, adminAccessToken, Response.Status.NO_CONTENT, Void.class);
        // Use GET to get the event.  This method does not require admin.
        EventDefinition checkEventDefinition = get(EVENTS_BASEURL, EVENTS_ENDPOINT + '/' + eventId, null, userAccessToken, Response.Status.OK, EventDefinition.class);
        assertEquals("Event name is incorrect", eventDefinition.getEventName(), checkEventDefinition.getEventName());
        assertEquals("Point value is incorrect", eventDefinition.getPointValue(), checkEventDefinition.getPointValue());
        assertEquals("Event description is incorrect", eventDescription, checkEventDefinition.getEventDescription());
        assertEquals("Event location is incorrect", eventLocation, checkEventDefinition.getEventLocation());
        assertEquals("Event start time is incorrect", startTime.toInstant(), checkEventDefinition.getStartTime().toInstant());  // Use toInstant to normalize timezones
        assertEquals("Event end time is incorrect", endTime.toInstant(), checkEventDefinition.getEndTime().toInstant());
    }

    @Test
    public void testAuthenticationFailure() {
        // Make calls without an authentication header.
        EventDefinition eventDefinition = new EventDefinition();
        eventDefinition.setEventName(eventName);
        eventDefinition.setPointValue(pointValue);
        post(EVENTS_BASEURL, EVENTS_ENDPOINT, eventDefinition, null, Response.Status.UNAUTHORIZED, Void.class);
        put(EVENTS_BASEURL, EVENTS_ENDPOINT + "/deadbeef-0000-0000-0000-badbadbadbad", eventDefinition, null, Response.Status.UNAUTHORIZED, Void.class);
        get(EVENTS_BASEURL, EVENTS_ENDPOINT, null, null, Response.Status.UNAUTHORIZED, Void.class);
        get(EVENTS_BASEURL, EVENTS_ENDPOINT + "/deadbeef-0000-0000-0000-badbadbadbad", null, null, Response.Status.UNAUTHORIZED, Void.class);
    }

    @Test
    public void testAuthorizationFailure() {
        // Normal users do not have access to POST or PUT.
        EventDefinition eventDefinition = new EventDefinition();
        eventDefinition.setEventName(eventName);
        eventDefinition.setPointValue(pointValue);
        post(EVENTS_BASEURL, EVENTS_ENDPOINT, eventDefinition, userAccessToken, Response.Status.FORBIDDEN, Void.class);
        put(EVENTS_BASEURL, EVENTS_ENDPOINT + "/deadbeef-0000-0000-0000-badbadbadbad", eventDefinition, userAccessToken, Response.Status.FORBIDDEN, Void.class);
    }

}
