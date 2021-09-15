#!/bin/bash

# create a "die" function
die() { echo "$*" 1>&2 ; exit 1; }

# setup directories if needed 
CACHE=./cache/
SUBJ=./cache/subjects
if [ ! -d "$CACHE" ]; then 
    mkdir $CACHE;
fi
if [ ! -d "$SUBJ" ]; then
    mkdir $SUBJ;
fi


# get configuration variables
source .env # defines $KEY and $SITE_ID
if [ -z "$KEY" ] || [ $KEY = "" ] # if key is missing or empty
    then die "Fatal error: KEY not defined in .env"
fi
if [ -z "$SITE_ID" ] || [ $SITE_ID = "" ] # if key is missing or empty
    then die "Fatal error: SITE_ID not defined in .env"
fi
AUTH="&site_id=$SITE_ID&key=$KEY"
BAK="./cache/Subjects.bak.js"
FILE="./cache/Subjects.js"

# if Subjects file exists already, create backup before downloading a new one
if [ -f ${FILE} ]
then
    cp ${FILE} ${BAK}
fi

URL="https://lgapi-us.libapps.com/1.1/subjects?$AUTH"
if hash json_pp 2>/dev/null; then
    CONTENT=$(curl -gL $URL | json_pp)
else 
    CONTENT=$(curl -gL $URL)
fi
echo "const subjects = $CONTENT;" > $FILE
echo "module.exports = subjects;" >> $FILE

FILE="./cache/LibrariansTemp.js"
URL="https://lgapi-us.libapps.com/1.1/accounts?expand[]=subjects&expand[]=profile$AUTH"
if hash json_pp 2>/dev/null; then
    CONTENT=$(curl -gL $URL | json_pp)
else 
    CONTENT=$(curl -gL $URL)
fi
echo "const librarians = $CONTENT;" > $FILE
echo "module.exports = librarians;" >> $FILE

FILE="./cache/Guides.js"
URL="https://lgapi-us.libapps.com/1.1/guides?expand=subjects,tags$AUTH"
if hash json_pp 2>/dev/null; then
    CONTENT=$(curl -gL $URL | json_pp)
else 
    CONTENT=$(curl -gL $URL)
fi
echo "const guides = $CONTENT;" > $FILE
echo "module.exports = guides;" >> $FILE

FILE="./cache/Databases.js"
URL="https://lgapi-us.libapps.com/1.1/assets?expand=subjects,friendly_url$AUTH"
if hash json_pp 2>/dev/null; then
    CONTENT=$(curl -gL $URL | json_pp)
else 
    CONTENT=$(curl -gL $URL)
fi
echo "const databases = $CONTENT;" > $FILE
echo "module.exports = databases;" >> $FILE

./compileSubjectCache.sh

node ./utilities/compareLGSubjects.js
node ./utilities/checkSubjectCodes.js
