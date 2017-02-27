FROM registry-e.idahive.sg/nectar/iron3.4-node

COPY . ${HOME}
WORKDIR ${HOME}

######### This may needs to be used in subsequent Dockerfile that runs in OpenShift too #########
######### Layer to fix permission for OSE https://github.com/sclorg/s2i-base-container/blob/master/bin/fix-permissions. #########
USER ${ROOT_UID}
# You can add additional folders to fix-permission. e.g. 'RUN container-fix-permission "/{your-folder1} /{your-folder2}"'
RUN container-fix-permission > /dev/null
USER ${APP_UID}

RUN npm set progress=false
RUN rm -Rf node_modules
RUN npm install

EXPOSE 3001

CMD npm start