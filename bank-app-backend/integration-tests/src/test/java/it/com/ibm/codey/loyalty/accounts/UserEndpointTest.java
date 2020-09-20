package it.com.ibm.codey.loyalty.accounts;

import javax.ws.rs.core.Response;

import static org.junit.Assert.assertEquals;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.ibm.codey.loyalty.accounts.json.UserRegistration;

import it.com.ibm.codey.loyalty.EndpointTestBase;
import it.com.ibm.codey.loyalty.util.TestSecurityHelper;

public class UserEndpointTest extends EndpointTestBase {

    @Before
    public void setup() {
        super.setup();
    }

    @After
    public void teardown() {
        super.teardown();
    }

    @Test
    public void testUserRegistrationAndDeletion() {
        try {
            setupUser();
            // Use GET to get the user registration.
            UserRegistration checkUserRegistration = get(USERS_BASEURL, USERS_SELF_ENDPOINT, null, userAccessToken, Response.Status.OK, UserRegistration.class);
            assertEquals("Consent flag is incorrect", CONSENT_GIVEN, checkUserRegistration.isConsentGiven());
        } finally {
            removeUser();
        }
    }

    @Test
    public void testUserRegistrationModificationAndDeletion() {
        try {
            setupUser();
            // Use PUT to change the user registration.
            UserRegistration userRegistration = new UserRegistration();
            userRegistration.setConsentGiven(CONSENT_NOT_GIVEN);
            put(USERS_BASEURL, USERS_SELF_ENDPOINT, userRegistration, userAccessToken, Response.Status.NO_CONTENT, Void.class);
            // Use GET to get the user registration.
            UserRegistration checkUserRegistration = get(USERS_BASEURL, USERS_SELF_ENDPOINT, null, userAccessToken, Response.Status.OK, UserRegistration.class);
            assertEquals("Consent flag is incorrect", CONSENT_NOT_GIVEN, checkUserRegistration.isConsentGiven());
        } finally {
            removeUser();
        }
    }

    @Test
    public void testAuthenticationFailure() {
        // Make calls without an authentication header and verify they are rejected.
        UserRegistration userRegistration = new UserRegistration();
        userRegistration.setConsentGiven(CONSENT_GIVEN);
        post(USERS_BASEURL, USERS_ENDPOINT, userRegistration, null, Response.Status.UNAUTHORIZED, Void.class);
        get(USERS_BASEURL, USERS_SELF_ENDPOINT, null, null, Response.Status.UNAUTHORIZED, Void.class);
        put(USERS_BASEURL, USERS_SELF_ENDPOINT, userRegistration, null, Response.Status.UNAUTHORIZED, Void.class);
        delete(USERS_BASEURL, USERS_SELF_ENDPOINT, null, Response.Status.UNAUTHORIZED);
    }

}
