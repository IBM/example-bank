package com.ibm.codey.bank.interceptor;

import javax.annotation.Priority;
import javax.inject.Inject;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;
import javax.ws.rs.core.Response;

import org.eclipse.microprofile.jwt.Claim;

import com.ibm.codey.bank.interceptor.binding.RequiresAuthorization;

/*
 * This interceptor is used with the JAXRS resource classes to enforce a client scope for authorization purposes.
 */
@RequiresAuthorization @Interceptor
@Priority(Interceptor.Priority.APPLICATION)
public class SecurityInterceptor {

    @Inject
    @Claim("scope")
    private String scope;

    @AroundInvoke
    public Object checkScope(InvocationContext ctx) throws Exception {
        String[] scopeList = scope.split(" ");
        for(String hasScope : scopeList) {
            if (hasScope.equals("admin")) {
                Object result = ctx.proceed();
                return result;
            }
        }
        return Response.status(Response.Status.FORBIDDEN).entity("admin permission required").build();
    }


}