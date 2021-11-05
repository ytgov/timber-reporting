#!/bin/bash

if [ "$1" != "" ]; then
	IP=$1
elif [ -f /usr/sbin/ipconfig ]; then
	IP=$(ipconfig getifaddr en0)
else
	IP=$(hostname -I | awk '{print $1}')
fi

echo DEV_HOST_IP=$IP > .env
