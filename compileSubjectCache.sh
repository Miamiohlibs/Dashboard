#!/bin/bash

# This script 
# 1. cleans the temporary librarian data into finalized librarian data by removing
#    personal widget styling and applying uniform dashboard styles
# 2. updates the subject caches using the Librarian, Database, and Guide info
#
# Use:
# 1. Usually, this script will be run by the ./getData script when refreshing
#    data from the LibGuides API
# 2. The script may be run on its own for dev purposes, but that is not likely to
#    be needed in the production environment


# after getting librarians (cache/LibrariansTemp), clean up the widgets 
node ./utilities/runCleanCache > ./cache/Librarians.js

# delete subject cache files
rm ./cache/subjects/*.json

# populate subjects cache
node ./utilities/updateSubjectCache

# copy custom subjects to subject cache
cp ./cache/custom/*.json ./cache/subjects

# delete and populate tagged guide cache
rm ./cache/taggedGuides/*
node ./utilities/updateTaggedGuides