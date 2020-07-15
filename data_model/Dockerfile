FROM postgres
COPY cc_schema.sql /tmp
RUN apt-get update && apt-get install -y curl
CMD /usr/bin/psql postgres://$DB_USER:$DB_PASSWORD@$DB_SERVERNAME:$DB_PORTNUMBER -f /tmp/cc_schema.sql && curl -X POST http://localhost:15020/quitquitquit
