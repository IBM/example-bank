FROM postgres
COPY schema_data.sql /tmp
RUN apt-get update && apt-get install -y curl
CMD /usr/bin/psql postgres://$DB_USER:$DB_PASSWORD@$DB_SERVERNAME:$DB_PORTNUMBER -f /tmp/schema_data.sql && curl -X POST http://localhost:15020/quitquitquit
