#!/bin/sh

# 기본 IP등 서버에 설정되어 있는 값.
IP="192.168.2.3"
PRIVATE_IP="192.168.9.124"
ANY="0.0.0.0/0"

/sbin/iptables -F
/sbin/iptables -t nat -F
/sbin/iptables -t mangle -F
/sbin/iptables -P INPUT DROP
/sbin/iptables -P FORWARD ACCEPT
/sbin/iptables -P OUTPUT ACCEPT
/sbin/iptables -t nat -A POSTROUTING -o eth0 -j SNAT --to $IP

# turn on Source Address Verification and get spoof protection on all current
# and future interfaces. (from IPCHAINS-HOWTO)
if [ -e /proc/sys/net/ipv4/conf/all/rp_filter ]; then
    for f in /proc/sys/net/ipv4/conf/*/rp_filter; do
        echo 1 > $f
    done
fi


#################################################################
#								                                                                                                #
#		1. basic rule					                                                                                    #
#								                                                                                                #
#################################################################
# Keep State
/sbin/iptables -A INPUT -p tcp -m state --state INVALID -j DROP
/sbin/iptables -A INPUT -p tcp -m state --state ESTABLISHED,RELATED -j ACCEPT

# ping
/sbin/iptables -A INPUT -p icmp -j ACCEPT

# lo device
/sbin/iptables -A INPUT -i lo -j ACCEPT

# auth
/sbin/iptables -A INPUT -p tcp -d $ANY --dport auth -j ACCEPT

# 내부 network에 대한 것은 열어준다.
/sbin/iptables -A INPUT -p all -s 192.168.9.0/24 -d $PRIVATE_IP -j ACCEPT
/sbin/iptables -A INPUT -p all -s 192.168.9.0/24 -d $IP -j ACCEPT

# www
/sbin/iptables -A INPUT -p tcp -d $IP --dport 80 -j ACCEPT
/sbin/iptables -A INPUT -p tcp -d $IP --dport 8888 -j ACCEPT
/sbin/iptables -A INPUT -p tcp -d $IP --dport 8099 -j ACCEPT
/sbin/iptables -A INPUT -p tcp -d $IP --dport 443 -j ACCEPT
/sbin/iptables -A INPUT -p tcp -d $IP --dport 8080 -j ACCEPT
/sbin/iptables -A INPUT -p udp -d $IP --dport 161 -j ACCEPT

# ssh
/sbin/iptables -A INPUT -p tcp --sport 1024: --dport 22 -s 0.0.0.0/0 -d $IP -j ACCEPT

# dns(dns접속해서 host정보 알려면)
/sbin/iptables -A INPUT -p tcp -s $ANY --sport 53 -d $IP --dport 0: -j ACCEPT
/sbin/iptables -A INPUT -p udp -s $ANY --sport 53 -d $IP --dport 0: -j ACCEPT

# NameServer 일때..
/sbin/iptables -A INPUT -p tcp -s $ANY -d $IP --dport 53 -j ACCEPT
/sbin/iptables -A INPUT -p udp -s $ANY -d $IP --dport 53 -j ACCEPT

# new dns
#/sbin/iptables -A INPUT -p tcp -i eth0 --sport 53 -j ACCEPT
#/sbin/iptables -A INPUT -p udp -i eth0 --sport 53 -j ACCEPT

# smtp
/sbin/iptables -A INPUT -p tcp -s $ANY -d $IP --dport 25 -j ACCEPT

# imap
/sbin/iptables -A INPUT -p tcp -s $ANY -d $IP --dport 143 -j ACCEPT

# pop3
/sbin/iptables -A INPUT -p tcp -s $ANY -d $IP --dport 110 -j ACCEPT

# mysql
/sbin/iptables -A INPUT -p tcp -s $ANY -d $IP --dport 3306 -j ACCEPT

# DROP IP.
/sbin/iptables -A INPUT -i eth0 -s Q.Q.Q.Q -j DROP
/sbin/iptables -A INPUT -i eth0 -s U.U.U.U -j DROP

#################################################################
#								                                                                                                #
#		2. redirect(forward) rule			                                                                            #
#								                                                                                                #
#################################################################

echo "1" > /proc/sys/net/ipv4/ip_forward
echo "1" > /proc/sys/net/ipv4/conf/all/rp_filter

/sbin/iptables -I FORWARD -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu

/sbin/modprobe ip_nat_ftp 2> /dev/null

# FTP Port Forwarding
/sbin/iptables -t nat -A PREROUTING -p tcp -d $IP --dport 20 -j DNAT --to 192.168.9.104:20
/sbin/iptables -t nat -A PREROUTING -p tcp -d $IP --dport 21 -j DNAT --to 192.168.9.104:21
/sbin/iptables -t nat -A PREROUTING -p tcp -d $IP --dport 2120 -j DNAT --to 192.168.9.104:2120
/sbin/iptables -t nat -A PREROUTING -p tcp -d $IP --dport 2121 -j DNAT --to 192.168.9.104:2121

# www
/sbin/iptables -t nat -A PREROUTING -p tcp -d $IP --dport 80 -j DNAT --to 192.168.9.104:80

# htts
/sbin/iptables -t nat -A PREROUTING -p tcp -d $IP --dport 443 -j DNAT --to 192.168.9.104:443

# remote desktop
/sbin/iptables -t nat -A PREROUTING -p tcp -s X.X.X.X -d $IP --dport 3389 -j DNAT --to 192.168.9.104:3389

# MSSQL Enterprise
/sbin/iptables -t nat -A PREROUTING -p tcp -s Y.Y.Y.Y -d $IP --dport 1433 -j DNAT --to 192.168.9.104:1433

# rsync
/sbin/iptables -t nat -A PREROUTING -p tcp -s Z.Z.Z.Z -d $IP --dport 873 -j DNAT --to 192.168.9.104:873

# vnc
/sbin/iptables -t nat -A PREROUTING -p tcp -s A.A.A.A -d $IP --dport 5800 -j DNAT --to 192.168.9.104:5800
/sbin/iptables -t nat -A PREROUTING -p tcp -s B.B.B.B -d $IP --dport 5900 -j DNAT --to 192.168.9.104:5900

# Symantec
/sbin/iptables -t nat -A PREROUTING -p tcp -s C.C.C.C -d $IP --dport 2967 -j DNAT --to 192.168.9.104:2967
/sbin/iptables -t nat -A PREROUTING -p tcp -s C.C.C.C -d $IP --dport 2967 -j DNAT --to 192.168.9.104:2967
