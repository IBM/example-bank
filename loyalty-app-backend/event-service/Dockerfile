FROM open-liberty:19.0.0.12-kernel-java8-openj9

USER root
RUN apt-get update && apt-get upgrade -y e2fsprogs libgnutls30 libgcrypt20 libsasl2-2
USER 1001

COPY --chown=1001:0 src/main/liberty/config/ /config/
COPY --chown=1001:0 src/main/resources/security/ /config/resources/security/
COPY --chown=1001:0 target/*.war /config/apps/
COPY --chown=1001:0 target/jdbc/* /config/jdbc/
RUN configure.sh
