FROM postgres
COPY example_schema.sql /tmp
CMD /usr/bin/psql postgres://$DB_USER:$DB_PASSWORD@$DB_SERVERNAME:$DB_PORTNUMBER -f /tmp/example_schema.sql
