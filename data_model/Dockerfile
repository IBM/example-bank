FROM postgres
COPY cc_schema.sql /tmp
CMD /usr/bin/psql postgres://$DB_USER:$DB_PASSWORD@$DB_SERVERNAME:$DB_PORTNUMBER -f /tmp/cc_schema.sql
