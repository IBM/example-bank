package it.com.ibm.codey.loyalty.util;

import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.cxf.jaxrs.provider.jsrjsonp.JsrJsonpProvider;

public class TestSecurityHelper {

    private static String APPID_SERVICE_URL;

    private static String APPID_TENANTID;

    private static String IAM_APIKEY;

    private static String IAM_SERVICE_URL;

    private static String OIDC_ISSUERIDENTIFIER;

    private static String OIDC_CLIENTID;

    private static String OIDC_CLIENTPASSWORD;

    private static String iamAuthHeader;

    private static String oidcAuthHeader;

    static {
        APPID_SERVICE_URL = System.getenv("APPID_SERVICE_URL");
        APPID_TENANTID = System.getenv("APPID_TENANTID");
        IAM_APIKEY = System.getenv("IAM_APIKEY");
        IAM_SERVICE_URL = System.getenv("IAM_SERVICE_URL");
        OIDC_ISSUERIDENTIFIER = System.getenv("OIDC_ISSUERIDENTIFIER");
        OIDC_CLIENTID = System.getenv("OIDC_CLIENTID");
        OIDC_CLIENTPASSWORD = System.getenv("OIDC_CLIENTPASSWORD");
        String oidcClientCredentials = OIDC_CLIENTID + ":" + OIDC_CLIENTPASSWORD;
        oidcAuthHeader = "Basic " + Base64.getEncoder().encodeToString(oidcClientCredentials.getBytes(StandardCharsets.UTF_8));
    }

    public static void createUser(String user, String password) {
        Client client = ClientBuilder.newClient();
        client.register(JsrJsonpProvider.class);
        // Get IAM bearer token when creating the first user.  The token can be reused after that.
        if (iamAuthHeader == null) {
            Form form = new Form();
            form.param("grant_type", "urn:ibm:params:oauth:grant-type:apikey");
            form.param("apikey", IAM_APIKEY);
            String iamToken;
            try (Response response = client.target(IAM_SERVICE_URL).request(MediaType.APPLICATION_JSON).buildPost(Entity.form(form)).invoke()) {
                if (response.getStatus() != Response.Status.OK.getStatusCode()) {
                    throw new RuntimeException("TEST CASE FAILURE. Cannot obtain IAM access token. Status code " + response.getStatus() + " Response =" + response.readEntity(JsonObject.class));
                }
                JsonObject obj = response.readEntity(JsonObject.class);
                iamToken = obj.getString("access_token");
            }
            iamAuthHeader = "Bearer " + iamToken;
        }
        // Create the user
        JsonObject request = Json.createObjectBuilder()
            .add("userName", user)
            .add("password", password)
            .add("active", true)
            .add("emails", Json.createArrayBuilder()
                .add(Json.createObjectBuilder()
                   .add("value", "ibmtestloyalty@yopmail.com")
                   .add("primary", true))
            ).build();
            String createUserURL = APPID_SERVICE_URL + "/management/v4/" + APPID_TENANTID + "/cloud_directory/Users";
            try (Response response = client.target(createUserURL).request(MediaType.APPLICATION_JSON).header(HttpHeaders.AUTHORIZATION, iamAuthHeader).buildPost(Entity.json(request)).invoke()) {
                if (response.getStatus() != Response.Status.CREATED.getStatusCode()) {
                    throw new RuntimeException("TEST CASE FAILURE. Cannot create user. Status code " + response.getStatus() + " Response =" + response.readEntity(JsonObject.class));
                }
            }
    }

    public static String signOn(String user, String password) {
        String url = OIDC_ISSUERIDENTIFIER + "/token";
        Form form = new Form();
        form.param("grant_type", "password");
        form.param("username", user);
        form.param("password", password);
        Client client = ClientBuilder.newClient();
        client.register(JsrJsonpProvider.class);
        try (Response response = client.target(url).request(MediaType.APPLICATION_JSON).header(HttpHeaders.AUTHORIZATION, oidcAuthHeader).buildPost(Entity.form(form)).invoke()) {
            if (response.getStatus() != Response.Status.OK.getStatusCode()) {
                throw new RuntimeException("TEST CASE FAILURE. Cannot obtain access token. Status code " + response.getStatus() + " Response =" + response.readEntity(JsonObject.class));
            }
            JsonObject obj = response.readEntity(JsonObject.class);
            return obj.getString("access_token");
        }
    }

}