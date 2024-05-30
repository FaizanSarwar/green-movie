#!/bin/bash -e

# Frontend Codebuild
echo "Installing Deployment Environment: ${DeploymentEnvironmentName}"

# Escape a string for sed replacements
function sed_escape() {
    RES="${1//$'\n'/\\n}"
    RES="${RES//./\\.}"
    RES="${RES//\//\\/}"
    RES="${RES// /\\ }"
    RES="${RES//!/\\!}"
    RES="${RES//-/\\-}"
    RES="${RES//,/\\,}"
    RES="${RES//&/\\&}"
    echo "${RES}"
}

function ec2lm_get_secret() {
    aws secretsmanager get-secret-value --secret-id "$1" --query SecretString --output text
}

# ec2lm_replace_secret_in_file_from_json <secret id> <replace pattern> <file> <secret name>
function ec2lm_replace_secret_in_file_from_json() {
    SECRET_ID=$1
    SED_PATTERN=$2
    REPLACE_FILE=$3
    SECRET_KEY=$4
    SECRET_JSON=$(ec2lm_get_secret $SECRET_ID)
    SECRET=$(echo $SECRET_JSON | jq -r ".${SECRET_KEY}")
    sed -i -e "s/$SED_PATTERN/$(sed_escape $SECRET)/" $REPLACE_FILE
}

# Copy .env file
if [ "${DeploymentEnvironmentName}" == "dev" ] ; then
    cp aws-deploy/dev-env .env
elif [ "${DeploymentEnvironmentName}" == "prod" ] ; then
    cp aws-deploy/prod-env .env    
fi


# Preshared key
SECRETS_MANAGER_REF="netenv.tgc.${DeploymentEnvironmentName}.us-west-2.secrets_manager.site.frontend.server"
CONFIG_FILE=".env"
echo ec2lm_replace_secret_in_file_from_json ${SECRETS_MANAGER_REF} "#TGC_API_PSK#" ${CONFIG_FILE} TGC_API_PSK
ec2lm_replace_secret_in_file_from_json ${SECRETS_MANAGER_REF} "#TGC_API_PSK#" ${CONFIG_FILE} TGC_API_PSK
echo ec2lm_replace_secret_in_file_from_json ${SECRETS_MANAGER_REF} "#STRIPE_PUBLIC_KEY#" ${CONFIG_FILE} STRIPE_PUBLIC_KEY
ec2lm_replace_secret_in_file_from_json ${SECRETS_MANAGER_REF} "#STRIPE_PUBLIC_KEY#" ${CONFIG_FILE} STRIPE_PUBLIC_KEY

# Copy CodeDeploy Spec
cp aws-deploy/appspec.yml .

# NPM
echo "NPM install"
npm install

echo "NPM build"
npm run build
