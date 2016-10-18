#!/bin/bash
clear
docker run -v `pwd`:/src hypnza/node_security_scan
