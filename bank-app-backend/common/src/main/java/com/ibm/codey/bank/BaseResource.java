package com.ibm.codey.bank;

import javax.inject.Inject;

import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;

public class BaseResource {

    @Inject
    @Claim("sub")
    private String subject;
    
    @Inject
    @Claim(standard = Claims.raw_token)
    private String rawToken;

    protected String getCallerSubject() {
        return subject;
    }

    protected String getCallerCredentials() {
        return "Bearer " + rawToken;
    }

}