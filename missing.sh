#!/bin/bash

egrep  -o '/cache/subjects/[^ ]+' ./logs/missingSubjects.log | sed 's/\/cache\/subjects\///' | sort | uniq -c