#!/bin/sh

# http://killyridols.net/firewall.rules.html
# the initial setup for this firewall was setup by levy.pl
# check it out to create a skeleton for your firewall

# route packets between interfaces
# echo "1" > /proc/sys/net/ipv4/ip_forward

# chain policies
# set default policies
/sbin/iptables -P INPUT ACCEPT
/sbin/iptables -P OUTPUT ACCEPT
/sbin/iptables -P FORWARD ACCEPT  # Set to DROP if you're NOT doing NAT'ing!

# flush tables
/sbin/iptables -F
/sbin/iptables -F INPUT
/sbin/iptables -F OUTPUT
/sbin/iptables -F FORWARD
/sbin/iptables -F -t mangle
/sbin/iptables -X
/sbin/iptables -F -t nat
