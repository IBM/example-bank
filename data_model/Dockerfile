FROM postgres
COPY cc_schema.sql /tmp
CMD PGPASSWORD=$DB_PASSWORD /usr/bin/psql -h $DB_SERVERNAME -p $DB_PORTNUMBER -U $DB_USER $DB_DATABASENAME -f /tmp/cc_schema.sql 