package com.ibm.codey.loyalty.external.appid;

import javax.json.bind.annotation.JsonbProperty;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AppIDServiceGetUserRoleResponse {

    @JsonbProperty("roles")
    private Role[] roles;

    @Getter @Setter
    public static class Role {

        @JsonbProperty("name")
        private String name;

    }

}