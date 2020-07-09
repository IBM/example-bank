package com.ibm.codey.loyalty.external.appid;

import javax.json.bind.annotation.JsonbProperty;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AppIDServiceGetUsersResponse {

    @JsonbProperty("totalResults")
    private int totalResults;

    @JsonbProperty("itemsPerPage")
    private int itemsPerPage;

    @JsonbProperty("users")
    private User[] users;

    @Getter @Setter
    public static class User {

        @JsonbProperty("id")
        private String profileId;

        @JsonbProperty("identities")
        private Identity[] identities;

    }

    @Getter @Setter
    public static class Identity {

        @JsonbProperty("provider")
        private String provider;

        @JsonbProperty("id")
        private String providerId;

        @JsonbProperty("idpUserInfo")
        private IdpUserInfo idpUserInfo;

    }

    @Getter @Setter
    public static class IdpUserInfo {

        @JsonbProperty("meta")
        private Meta meta;

    }

    @Getter @Setter
    public static class Meta {

        @JsonbProperty("lastModified")
        private String lastModified;

    }

}