#!/bin/bash

export PATH=/bin:/sbin:/usr/bin:/usr/sbin

GEODB_URL="http://geolite.maxmind.com/download/geoip/database/"
GEO_BIN="geoipdb.bin"
GEO_IDX="geoipdb.idx"
GEO_ZIP="GeoIPCountryCSV.zip"
GEO_CSV="GeoIPCountryWhois.csv"
GEO_DIR="/var/geoip/"

if [[ ! -d /var/geoip ]]; then
	mkdir /var/geoip
	chmod 755 /var/geoip
	chown root.root /var/geoip
fi

cd /tmp
rm -rf $GEO_ZIP*
wget $GEODB_URL$GEO_ZIP

cd $GEO_DIR
rm -rf $GEO_ZIP* $GEI_CSV*
mv /tmp/$GEO_ZIP $GEO_DIR

unzip $GEO_ZIP
csv2bin $GEO_CSV
