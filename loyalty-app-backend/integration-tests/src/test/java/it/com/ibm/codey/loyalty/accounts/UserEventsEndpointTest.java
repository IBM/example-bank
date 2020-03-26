package it.com.ibm.codey.loyalty.accounts;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import javax.ws.rs.core.Response;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.ibm.codey.loyalty.accounts.json.UserEventCheckIn;
import com.ibm.codey.loyalty.accounts.json.UserEventInfo;
import com.ibm.codey.loyalty.accounts.json.UserRegistration;
import com.ibm.codey.loyalty.catalog.json.EventDefinition;

import it.com.ibm.codey.loyalty.EndpointTestBase;
import it.com.ibm.codey.loyalty.util.TestSecurityHelper;

public class UserEventsEndpointTest extends EndpointTestBase {

    private static String normalPointsEventId, doublePointsEventId;

    private static final int NORMAL_POINTS = 10;
    private static final int DOUBLE_POINTS = NORMAL_POINTS*2;

    private static final String NORMAL_POINTS_EVENT_NAME = "test event normal points";
    private static final String DOUBLE_POINTS_EVENT_NAME = "test event double points";

    private static boolean eventsCreated = false;

    @Before
    public void setup() {
        super.setup();
        // Create events.  These are reused for all tests.
        // This isn't done in a BeforeClass method because it depends on the non-static post() method in the superclass.
        if (!eventsCreated) {
            adminAccessToken = TestSecurityHelper.signOn(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
            normalPointsEventId = createEvent(NORMAL_POINTS_EVENT_NAME, NORMAL_POINTS);
            doublePointsEventId = createEvent(DOUBLE_POINTS_EVENT_NAME, DOUBLE_POINTS);
            eventsCreated = true;
        }
    }

    @After
    public void teardown() {
        super.teardown();
    }

    @Test
    public void testEventCheckin() {
        try {
            setupUser();

            // Verify no events attended or points earned yet
            UserEventInfo userEventInfo = get(USERS_BASEURL, USER_EVENTS_SELF_INFO_ENDPOINT, null, userAccessToken, Response.Status.OK, UserEventInfo.class);
            assertEquals("initial event count is incorrect", 0, userEventInfo.getEventCount());
            assertEquals("initial points earned is incorrect", 0, userEventInfo.getPointsEarned());

            // Check in to first event
            UserEventCheckIn checkIn1 = new UserEventCheckIn();
            checkIn1.setEventId(normalPointsEventId);
            post(USERS_BASEURL, USER_EVENTS_ENDPOINT, checkIn1, userAccessToken, Response.Status.NO_CONTENT, Void.class);

            // Verify check in to first event
            String[] eventIds = get(USERS_BASEURL, USER_EVENTS_SELF_ENDPOINT, null, userAccessToken, Response.Status.OK, String[].class);
            assertEquals("GET returned incorrect number of events checked in", 1, eventIds.length);
            assertEquals("Event id is incorrect", normalPointsEventId, eventIds[0]);

            // Verify points earned
            UserEventInfo userEventInfo2 = get(USERS_BASEURL, USER_EVENTS_SELF_INFO_ENDPOINT, null, userAccessToken, Response.Status.OK, UserEventInfo.class);
            assertEquals("event count is incorrect", 1, userEventInfo2.getEventCount());
            assertEquals("points earned is incorrect", NORMAL_POINTS, userEventInfo2.getPointsEarned());

            // Check in to second event
            UserEventCheckIn checkIn2 = new UserEventCheckIn();
            checkIn2.setEventId(doublePointsEventId);
            post(USERS_BASEURL, USER_EVENTS_ENDPOINT, checkIn2, userAccessToken, Response.Status.NO_CONTENT, Void.class);

            // Verify check in to both events
            String[] eventIds2 = get(USERS_BASEURL, USER_EVENTS_SELF_ENDPOINT, null, userAccessToken, Response.Status.OK, String[].class);
            assertEquals("GET returned incorrect number of events checked in", 2, eventIds2.length);
            if (eventIds2[0].equals(normalPointsEventId)) {
                assertEquals("Event id [1] is incorrect", doublePointsEventId, eventIds2[1]);
            } else {
                assertEquals("Event id [0] is incorrect", doublePointsEventId, eventIds2[0]);
                assertEquals("Event id [1] is incorrect", normalPointsEventId, eventIds2[1]);
            }

            // Verify points earned
            UserEventInfo userEventInfo3 = get(USERS_BASEURL, USER_EVENTS_SELF_INFO_ENDPOINT, null, userAccessToken, Response.Status.OK, UserEventInfo.class);
            assertEquals("event count is incorrect", 2, userEventInfo3.getEventCount());
            assertEquals("points earned is incorrect", NORMAL_POINTS+DOUBLE_POINTS, userEventInfo3.getPointsEarned());
        } finally {
            removeUser();
        }
    }

    @Test
    public void testDuplicateEventCheckin() {
        try {
            setupUser();
            // Check in to first event
            UserEventCheckIn checkIn1 = new UserEventCheckIn();
            checkIn1.setEventId(normalPointsEventId);
            post(USERS_BASEURL, USER_EVENTS_ENDPOINT, checkIn1, userAccessToken, Response.Status.NO_CONTENT, Void.class);
            // Check in to first event again
            post(USERS_BASEURL, USER_EVENTS_ENDPOINT, checkIn1, userAccessToken, Response.Status.BAD_REQUEST, Void.class);
        } finally {
            removeUser();
        }
    }

    @Test
    public void testWithNonConsentedUser() {
        try {
            setupUser();
            // Use PUT to change user registration to withdraw consent
            UserRegistration userRegistration = new UserRegistration();
            userRegistration.setConsentGiven(CONSENT_NOT_GIVEN);
            put(USERS_BASEURL, USERS_SELF_ENDPOINT, userRegistration, userAccessToken, Response.Status.NO_CONTENT, Void.class);
            // Try to check into an event or get information
            UserEventCheckIn checkIn1 = new UserEventCheckIn();
            checkIn1.setEventId(normalPointsEventId);
            post(USERS_BASEURL, USER_EVENTS_ENDPOINT, checkIn1, userAccessToken, Response.Status.CONFLICT, Void.class);
            get(USERS_BASEURL, USER_EVENTS_SELF_ENDPOINT, null, userAccessToken, Response.Status.CONFLICT, Void.class);
            get(USERS_BASEURL, USER_EVENTS_SELF_INFO_ENDPOINT, null, userAccessToken, Response.Status.CONFLICT, Void.class);
        } finally {
            removeUser();
        }
    }

    @Test
    public void testWithUnregisteredUser() {
        setupUser();
        removeUser();
        // Try to check into an event or get information
        UserEventCheckIn checkIn1 = new UserEventCheckIn();
        checkIn1.setEventId(normalPointsEventId);
        post(USERS_BASEURL, USER_EVENTS_ENDPOINT, checkIn1, userAccessToken, Response.Status.BAD_REQUEST, Void.class);
        get(USERS_BASEURL, USER_EVENTS_SELF_ENDPOINT, null, userAccessToken, Response.Status.BAD_REQUEST, Void.class);
        get(USERS_BASEURL, USER_EVENTS_SELF_INFO_ENDPOINT, null, userAccessToken, Response.Status.BAD_REQUEST, Void.class);
    }

    @Test
    public void testAuthenticationFailure() {
        // Make calls without an authentication header
        UserEventCheckIn checkIn1 = new UserEventCheckIn();
        checkIn1.setEventId(normalPointsEventId);
        post(USERS_BASEURL, USER_EVENTS_ENDPOINT, checkIn1, null, Response.Status.UNAUTHORIZED, Void.class);
        get(USERS_BASEURL, USER_EVENTS_SELF_ENDPOINT, null, null, Response.Status.UNAUTHORIZED, Void.class);
        get(USERS_BASEURL, USER_EVENTS_SELF_INFO_ENDPOINT, null, null, Response.Status.UNAUTHORIZED, Void.class);
    }

    @Test
    public void testBadEventId() {
        String badEventId1 = "1";
        String badEventId2 = "/deadbeef-0000-0000-0000-badbadbadbad";
        UserEventCheckIn checkIn1 = new UserEventCheckIn();
        checkIn1.setEventId(badEventId1);
        post(USERS_BASEURL, USER_EVENTS_ENDPOINT, checkIn1, userAccessToken, Response.Status.BAD_REQUEST, Void.class);
        UserEventCheckIn checkIn2 = new UserEventCheckIn();
        checkIn2.setEventId(badEventId2);
        post(USERS_BASEURL, USER_EVENTS_ENDPOINT, checkIn2, userAccessToken, Response.Status.BAD_REQUEST, Void.class);
    }

    private String createEvent(String eventName, int pointValue) {
        EventDefinition eventDefinition = new EventDefinition();
        eventDefinition.setEventName(eventName);
        eventDefinition.setPointValue(pointValue);
        String eventId = post(EVENTS_BASEURL, EVENTS_ENDPOINT, eventDefinition, adminAccessToken, Response.Status.CREATED, String.class);
        return eventId;
    }

}