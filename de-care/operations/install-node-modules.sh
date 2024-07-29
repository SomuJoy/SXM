#! /bin/sh

echo "registry=https://sxmartifactory.corp.siriusxm.com/artifactory/api/npm/siriusxm-de-npm/" > .npmrc
echo "node-options=--max_old_space_size=8192" >> .npmrc
echo "always-auth=true" >> .npmrc

echo "//sxmartifactory.corp.siriusxm.com/artifactory/api/npm/siriusxm-de-npm/:_authToken=$NPM_TOKEN" >> .npmrc

rm -f node_modules/@angular/compiler-cli/ngcc/__ngcc_lock_file__

npm i

rm -f .npmrc
