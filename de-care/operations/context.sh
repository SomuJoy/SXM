#! /bin/bash
token='HOST_CONTEXT_TOKEN_TO_REPLACE'
filePath='/usr/share/nginx/html'
indexFile='/usr/share/nginx/html/index.html'
nginxFile='/etc/nginx/conf.d/default.conf'
files=$(grep -ril $token $filePath)
# todo: end if no files found

if [ -z "$CONTEXT" ]
then
    sed -i s/"\/$token\/"/"\/"/g $files
    sed -i s/"$token\/"//g $nginxFile
    sed -i s/"$token"//g $nginxFile
    sed -i s#"//assets.adobedtm.com/launch-EN58fe6dd75d494580a6eda5b3c1a0b9a4-development.min.js"#"$AL_URL"#g $indexFile
    sed -ie s/"alias \/usr\/share\/nginx\/html\;"//g $nginxFile
    echo 'Removed '$token
else
    sed -i s/"$token"/"$CONTEXT"/g $files
    sed -i s/"$token"/"$CONTEXT"/g $nginxFile
    sed -i s#"//assets.adobedtm.com/launch-EN58fe6dd75d494580a6eda5b3c1a0b9a4-development.min.js"#"$AL_URL"#g $indexFile
    echo 'Replaced '$token' with '$CONTEXT
fi

if [ "$COUNTRY_CODE" == "ca" ]
then
    echo "Removing OneTrust library"
    sed -i '/<!-- OneTrust Cookies Consent Notice start -->/,/<!-- OneTrust Cookies Consent Notice end -->/d' $indexFile
fi


exec "$@"