package com.ibm.codey.loyalty;

import java.net.MalformedURLException;
import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.StringJoiner;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.ibm.codey.loyalty.external.appid.AppIDService;
import com.ibm.codey.loyalty.external.appid.AppIDServiceGetUserRoleResponse;
import com.ibm.codey.loyalty.external.appid.AppIDServiceGetUsersResponse;
import com.ibm.codey.loyalty.external.iam.IAMTokenService;
import com.ibm.codey.loyalty.external.iam.IAMTokenServiceResponse;

import org.eclipse.microprofile.rest.client.RestClientBuilder;

// This code deletes any App ID user who is no longer registered for the loyalty program.
public class AccountDeletionProcessor {

    private static final Logger log = Logger.getLogger(AccountDeletionProcessor.class.getName());

    private static final String PROVIDER = "cloud_directory";

    private static final int USERS_COUNT = 20;

    private static URL IAM_SERVICE_URL;
    private static String IAM_APIKEY;

    private static URL APPID_SERVICE_URL;
    private static String APPID_TENANTID;

    private static String DB_SERVERNAME;
    private static String DB_PORTNUMBER;
    private static String DB_DATABASENAME;
    private static String DB_USER;
    private static String DB_PASSWORD;

    private static int LAST_LOGIN_HOURS;

    private Connection con;

    private AppIDService appIdService;
    
    private String authHeader;

    public static void main(String[] args) {
        // Gather environment variables
        try {
            IAM_SERVICE_URL = new URL(getEnvVar("IAM_SERVICE_URL"));
            APPID_SERVICE_URL = new URL(getEnvVar("APPID_SERVICE_URL"));
        } catch(MalformedURLException mue) {
            mue.printStackTrace();
            System.exit(1);
        }
        IAM_APIKEY = getEnvVar("IAM_APIKEY");
        APPID_TENANTID = getEnvVar("APPID_TENANTID");
        DB_SERVERNAME = getEnvVar("DB_SERVERNAME");
        DB_PORTNUMBER = getEnvVar("DB_PORTNUMBER");
        DB_DATABASENAME = getEnvVar("DB_DATABASENAME");
        DB_USER = getEnvVar("DB_USER");
        DB_PASSWORD = getEnvVar("DB_PASSWORD");
        LAST_LOGIN_HOURS = Integer.valueOf(getEnvVar("LAST_LOGIN_HOURS"));
        new AccountDeletionProcessor().run();
    }

    public void run() {
        // Connect to database
        getDBConnection();
        // Set up auth header for App Id with IAM token.
        authHeader = "Bearer " + getIamToken();
        // Set up client proxy to App Id service.
        appIdService = RestClientBuilder.newBuilder().baseUrl(APPID_SERVICE_URL).build(AppIDService.class);
        try {
            // Iterate through all App Id users a page at a time.  Identify and collect unregistered users by provider id.
            Set<String> unregisteredUserProviderIds = new HashSet<String>();
            int startIndex = 0;
            AppIDServiceGetUsersResponse usersResponse;
            do {
                // Get a page of users.  Collect the user's profile id and corresponding provider id.
                Map<String, String> profileIdToProviderIdMap = new HashMap<String,String>(USERS_COUNT);
                log.log(Level.INFO, "Obtaining a page of user data");
                usersResponse = appIdService.getUsers(authHeader, APPID_TENANTID, AppIDService.DATASCOPE_FULL, startIndex, USERS_COUNT);
                int numberOfUsersOnThisPage = usersResponse.getItemsPerPage();
                for (int i=0; i<usersResponse.getItemsPerPage() ; i++) {
                    AppIDServiceGetUsersResponse.User user = usersResponse.getUsers()[i];
                    AppIDServiceGetUsersResponse.Identity[] identities = user.getIdentities();
                    if (identities != null && identities.length == 1 && identities[0].getProvider().equals(PROVIDER)) {
                        // If the user hasn't recently logged in, save the profile id and provider id for further examination.
                        if (!isRecentlyModified(identities[0].getIdpUserInfo().getMeta().getLastModified())) {
                            profileIdToProviderIdMap.put(user.getProfileId(), identities[0].getProviderId());
                        }
                    }
                }
                startIndex += numberOfUsersOnThisPage;
                log.log(Level.INFO, "App Id users: " + profileIdToProviderIdMap.toString());
                // If there are no users on this page that weren't recently modified, continue to next page.
                if (profileIdToProviderIdMap.isEmpty()) {
                    continue;
                }
                // Query users table for subjects matching these profile ids.
                Set<String> registeredProfileIds = queryUsers(profileIdToProviderIdMap.keySet());
                log.log(Level.INFO, "Registered users: " + registeredProfileIds.toString());
                // Remove from the map those users who are still registered in the users table.
                for(String profileId : registeredProfileIds) {
                    profileIdToProviderIdMap.remove(profileId);
                }
                // Remove from the map those users who are admins.
                Iterator<Map.Entry<String, String>>  iter = profileIdToProviderIdMap.entrySet().iterator();
                while (iter.hasNext()) {
                    Map.Entry<String,String> entry = iter.next();
                    String profileId = entry.getKey();
                    if (isAdmin(profileId)) {
                        log.log(Level.INFO, "Admin: " + profileId);
                        iter.remove();
                    }
                }
                // Whatever is left is an unregistered user.  Save for deletion after completing the paged scan.
                unregisteredUserProviderIds.addAll(profileIdToProviderIdMap.values());
            } while(startIndex < usersResponse.getTotalResults());
            // Remove all unregistered users.
            if (unregisteredUserProviderIds.isEmpty()) {
                log.log(Level.INFO, "No App ID users need to be removed");
            } else {
                for(String providerId : unregisteredUserProviderIds) {
                    log.log(Level.INFO, "Removing user: " + providerId);
                    appIdService.removeUser(authHeader, APPID_TENANTID, providerId);
                }
            }
        } finally {
            try {
                appIdService.close();
            } catch(Exception e) {
                e.printStackTrace();
            }
            closeDBConnection();
        }
    }

    private static String getEnvVar(String name) {
        String s = System.getenv(name);
        if (s == null) {
            throw new RuntimeException("Missing environment variable " + name);
        }
        return s;
    }

    private void getDBConnection() {
        try {
            // Load the driver
            log.log(Level.INFO, "Loading the JDBC driver");
            Class.forName("org.postgresql.Driver");
            // Create the connection
            String url = "jdbc:postgresql://" + DB_SERVERNAME + ":" + DB_PORTNUMBER + "/" + DB_DATABASENAME;
            log.log(Level.INFO, "Creating a JDBC connection to " + url);
            Properties props = new Properties();
            props.setProperty("user", DB_USER);
            props.setProperty("password", DB_PASSWORD);
            props.setProperty("sslfactory","org.postgresql.ssl.NonValidatingFactory");
            con = DriverManager.getConnection(url, props);
        } catch (ClassNotFoundException e) {
            System.err.println("Could not load JDBC driver");
            e.printStackTrace();
            throw new RuntimeException(e);
        } catch(SQLException sqlex) {
            System.err.println("SQLException information");
            System.err.println ("Error msg: " + sqlex.getMessage());
            System.err.println ("SQLSTATE: " + sqlex.getSQLState());
            System.err.println ("Error code: " + sqlex.getErrorCode());
            sqlex.printStackTrace();
            throw new RuntimeException(sqlex);
        }
    }

    private Set<String> queryUsers(Set<String> profileIds) {
        Set<String> registeredProfileIds = new HashSet<String>();
        try {
            // Create query statement
            StringJoiner sj = new StringJoiner(",", "(", ")");
            for(String id : profileIds) {
                sj.add("?");
            }
            String query = "SELECT SUBJECT FROM BANK.USERS WHERE SUBJECT IN " + sj.toString();
            // Execute query statement
            log.log(Level.INFO, "Querying database");
            PreparedStatement ps = con.prepareStatement(query);
            int index = 1;
            for(String id : profileIds) {
                ps.setString(index, id);
                index++;
            }
            ResultSet rs = ps.executeQuery();
            while(rs.next()) {
                registeredProfileIds.add(rs.getString("subject"));
            }
            // Close the ResultSet
            rs.close();
            // Close the PreparedStatement
            ps.close();
        }
        catch(SQLException sqlex) {
            System.err.println("SQLException information");
            System.err.println ("Error msg: " + sqlex.getMessage());
            System.err.println ("SQLSTATE: " + sqlex.getSQLState());
            System.err.println ("Error code: " + sqlex.getErrorCode());
            sqlex.printStackTrace();
            throw new RuntimeException(sqlex);
        }
        return registeredProfileIds;
    }

    private void closeDBConnection() {
        try {
            con.close();
        }
        catch(SQLException sqlex) {
            System.err.println("SQLException information");
            System.err.println ("Error msg: " + sqlex.getMessage());
            System.err.println ("SQLSTATE: " + sqlex.getSQLState());
            System.err.println ("Error code: " + sqlex.getErrorCode());
            sqlex.printStackTrace();
            throw new RuntimeException(sqlex);
        }
    }

    private String getIamToken() {
        // Get an IAM token for authentication to App ID API.
        log.log(Level.INFO, "Obtaining IAM access token");
        IAMTokenServiceResponse tokenResponse;
        try ( IAMTokenService iamTokenService = RestClientBuilder.newBuilder().baseUrl(IAM_SERVICE_URL).build(IAMTokenService.class) ) {
            tokenResponse = iamTokenService.getIAMTokenFromAPIKey(IAMTokenService.GRANT_TYPE_APIKEY, IAM_APIKEY);
        } catch(Exception e) {
            throw new RuntimeException(e);
        }
        return tokenResponse.getAccessToken();
    }

    private boolean isRecentlyModified(String lastModifiedString) {
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime lastModified = ZonedDateTime.parse(lastModifiedString);
        Duration duration = Duration.between(lastModified, now);
        long diffHours = (long) duration.getSeconds() / (60*60);
        return (diffHours < LAST_LOGIN_HOURS);
    }

    private boolean isAdmin(String profileId) {
        boolean admin = false;
        AppIDServiceGetUserRoleResponse userProfileResponse = appIdService.getUserRoles(authHeader, APPID_TENANTID, profileId);
        for (AppIDServiceGetUserRoleResponse.Role role : userProfileResponse.getRoles()) {
            if (role.getName().equals("admin")) {
                admin = true;
                break;
            }
        }
        return admin;
    }
}
