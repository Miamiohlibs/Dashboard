#!/bin/bash
DIR=`dirname $0`
echo ${DIR}

# get major codes
MC="${DIR}/../models/majorCodes.js"
touch ${MC}
echo "const majorCodes = " > ${MC}
curl -X GET --header 'Accept: application/json' 'https://ws.apps.miamioh.edu/api/areaOfStudy/v1/major' >> ${MC}
echo "; module.exports = majorCodes;" >> ${MC}
ls -ltr ${MC}

# get dept codes 
DC="${DIR}/../models/deptCodes.js"
touch ${DC}
echo "const deptCodes = " > ${DC}
curl -X GET --header 'Accept: application/json' 'https://community.miamioh.edu/directory-accounts/api/prefixDetails?type=dpt' >> ${DC}
echo "; module.exports = deptCodes;" >> ${DC}
ls -ltr ${DC}

# get registrar codes
echo "There is no API for getting registrar codes"

