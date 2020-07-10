package it.com.ibm.codey.loyalty;

import java.lang.reflect.Type;
import java.util.Map;

import javax.json.bind.Jsonb;
import javax.json.bind.JsonbBuilder;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MultivaluedHashMap;
import javax.ws.rs.core.Response;

import static org.junit.Assert.fail;

import com.ibm.codey.loyalty.accounts.json.UserRegistration;

import it.com.ibm.codey.loyalty.util.TestSecurityHelper;

public class EndpointTestBase {

    protected static String USERS_BASEURL;
    protected static String EVENTS_BASEURL;

    protected static String TEST_USER_PREFIX;
    protected static String TEST_USER;
    protected static String TEST_PASSWORD;
    protected static String userAccessToken;

    protected static String TEST_ADMIN_USER;
    protected static String TEST_ADMIN_PASSWORD;
    protected static String adminAccessToken;

    protected static final String USERS_ENDPOINT = "/loyalty/v1/users";
    protected static final String USERS_SELF_ENDPOINT = "/loyalty/v1/users/self";
    protected static final String USER_EVENTS_ENDPOINT = "/loyalty/v1/userEvents";
    protected static final String USER_EVENTS_SELF_ENDPOINT = "/loyalty/v1/userEvents/self";
    protected static final String USER_EVENTS_SELF_INFO_ENDPOINT = "/loyalty/v1/userEvents/self/info";
    protected static final String EVENTS_ENDPOINT = "/loyalty/v1/events";

    protected static boolean CONSENT_GIVEN = true;
    protected static boolean CONSENT_NOT_GIVEN = false;

    static {
        USERS_BASEURL = System.getenv("USERS_BASEURL");
        EVENTS_BASEURL = System.getenv("EVENTS_BASEURL");
        TEST_USER_PREFIX = System.getenv("TEST_USER_PREFIX");
        TEST_PASSWORD = System.getenv("TEST_PASSWORD");
        TEST_ADMIN_USER = System.getenv("TEST_ADMIN_USER");
        TEST_ADMIN_PASSWORD = System.getenv("TEST_ADMIN_PASSWORD");
    }

    private Client client;

    protected void setup() {
        client = ClientBuilder.newClient();
        TEST_USER = TEST_USER_PREFIX + (int) ((Math.random() * 999999) + 1);
    }

    protected void teardown() {
        client.close();
    }

    protected <T> T get(String baseUrl, String endpoint, Map<String, Object> queryParams, String accessToken, Response.Status expectedStatusCode, Type returnType) {
        String url = baseUrl + endpoint;
        WebTarget target = client.target(url);
        if (queryParams != null) {
            for (String key: queryParams.keySet()) {
                target = target.queryParam(key, queryParams.get(key));
            }
        }
        MultivaluedHashMap<String,Object> headers = new MultivaluedHashMap<String,Object>();
        if (accessToken != null) {
            String authHeader = "Bearer " + accessToken;
            headers.putSingle(HttpHeaders.AUTHORIZATION, authHeader);
        }
        try (Response response = target.request().headers(headers).get()) {
            checkStatusCode(url, response, expectedStatusCode);
            if (returnType == Void.class) {
                return null;
            }
            String jsonString = response.readEntity(String.class);
            if (returnType.equals(String.class)) {
                return (T)jsonString;
            }
            Jsonb jsonb = JsonbBuilder.create();
            return jsonb.fromJson(jsonString, returnType);
        }
    }

    protected <T> T put(String baseUrl, String endpoint, Object body, String accessToken, Response.Status expectedStatusCode, Class<T> returnType) {
        String url = baseUrl + endpoint;
        Jsonb jsonb = JsonbBuilder.create();
        String jsonBody = jsonb.toJson(body);
        MultivaluedHashMap<String,Object> headers = new MultivaluedHashMap<String,Object>();
        if (accessToken != null) {
            String authHeader = "Bearer " + accessToken;
            headers.putSingle(HttpHeaders.AUTHORIZATION, authHeader);
        }
        try (Response response = client.target(url).request().headers(headers).buildPut(Entity.json(jsonBody)).invoke()) {
            checkStatusCode(url, response, expectedStatusCode);
            if (returnType == Void.class) {
                return null;
            }
            String jsonString = response.readEntity(String.class);
            if (returnType.equals(String.class)) {
                return (T)jsonString;
            }
            return jsonb.fromJson(jsonString, returnType);
        }
    }

    protected <T> T post(String baseUrl, String endpoint, Object body, String accessToken, Response.Status expectedStatusCode, Class<T> returnType) {
        String url = baseUrl + endpoint;
        Jsonb jsonb = JsonbBuilder.create();
        String jsonBody = jsonb.toJson(body);
        MultivaluedHashMap<String,Object> headers = new MultivaluedHashMap<String,Object>();
        if (accessToken != null) {
            String authHeader = "Bearer " + accessToken;
            headers.putSingle(HttpHeaders.AUTHORIZATION, authHeader);
        }
        try (Response response = client.target(url).request().headers(headers).buildPost(Entity.json(jsonBody)).invoke()) {
            checkStatusCode(url, response, expectedStatusCode);
            if (returnType == Void.class) {
                return null;
            }
            String jsonString = response.readEntity(String.class);
            if (returnType.equals(String.class)) {
                return (T)jsonString;
            }
            return jsonb.fromJson(jsonString, returnType);
        }
    }

    protected void delete(String baseUrl, String endpoint, String accessToken, Response.Status expectedStatusCode) {
        String url = baseUrl + endpoint;
        MultivaluedHashMap<String,Object> headers = new MultivaluedHashMap<String,Object>();
        if (accessToken != null) {
            String authHeader = "Bearer " + accessToken;
            headers.putSingle(HttpHeaders.AUTHORIZATION, authHeader);
        }
        try (Response response = client.target(url).request().headers(headers).buildDelete().invoke()) {
            checkStatusCode(url, response, expectedStatusCode);
        }
    }

    protected void setupUser() {
        // Create a user in the user registry.
        TestSecurityHelper.createUser(TEST_USER, TEST_PASSWORD);

        // Log the user in and obtain an access token for invoking the API.
        userAccessToken = TestSecurityHelper.signOn(TEST_USER, TEST_PASSWORD);

        // Create user registration
        UserRegistration userRegistration = new UserRegistration();
        userRegistration.setConsentGiven(CONSENT_GIVEN);
        post(USERS_BASEURL, USERS_ENDPOINT, userRegistration, userAccessToken, Response.Status.NO_CONTENT, Void.class);
    }

    protected void removeUser() {
        // Use DELETE to remove user registration.
        delete(USERS_BASEURL, USERS_SELF_ENDPOINT, userAccessToken, Response.Status.NO_CONTENT);
    }

    private void checkStatusCode(String url, Response response, Response.Status expectedStatusCode) {
        if (expectedStatusCode.getStatusCode() != response.getStatus()) {
            fail("Unexpected response code " + response.getStatus() +
                 " (expected " + expectedStatusCode.getStatusCode() +
                 ") from " + url + " Response=" + response.readEntity(String.class));
        }
    }

}