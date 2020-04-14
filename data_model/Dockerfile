FROM postgres
COPY schema_data.sql /tmp
CMD /usr/bin/psql postgres://$DB_USER:$DB_PASSWORD@$DB_SERVERNAME:$DB_PORTNUMBER -f /tmp/schema_data.sql
