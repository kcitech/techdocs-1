#!/bin/sh
# Startup script for Tomcat, the Apache Servlet Engine
#
# chkconfig: - 85 15
# description: Start Tomcat
#
# processname: tomcat
#
# Source function library.

. /etc/rc.d/init.d/functions

export JAVA_HOME=/usr/local/java/
export CATALINA_HOME=/usr/local/tomcat/
export PATH=$PATH:$JAVA_HOME/bin:$CATALINA_HOME/bin

# See how we were called.
case "$1" in
  start)
        echo  "Starting Tomcat Server: "
        $CATALINA_HOME/bin/startup.sh
        touch /var/lock/subsys/tomcat
        echo
        ;;
  stop)
        echo  "Shutting down Tomcat Server: "
        $CATALINA_HOME/bin/shutdown.sh
        rm -f /var/lock/subsys/tomcat
        echo
        ;;
  restart)
        $0 stop
        sleep 2
        $0 start
        ;;
  *)
        echo "Usage: $0 {start|stop|restart}"
        exit 1
esac

exit 0

