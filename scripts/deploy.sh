#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# Define the tag to use
TAG="latest" # Or use something dynamic like TAG=$(git rev-parse --short HEAD)

# Determine which service we're deploying based on current directory
if [[ $PWD == */backend ]]; then
    REGISTRY_NAME=$BACKEND_REPOSITORY_NAME
elif [[ $PWD == */frontend ]]; then
    REGISTRY_NAME=$FRONTEND_REPOSITORY_NAME
else
    echo "Error: Must be run from frontend/ or backend/ directory"
    exit 1
fi

# Check if REGISTRY_NAME is set (ensure env vars are loaded)
if [ -z "$REGISTRY_NAME" ]; then
    echo "Error: REGISTRY_NAME could not be determined. Ensure BACKEND_REPOSITORY_NAME or FRONTEND_REPOSITORY_NAME is set in your environment."
    exit 1
fi

# Check if AWS variables are set
if [ -z "$AWS_ACCOUNT_ID" ] || [ -z "$AWS_REGION" ]; then
    echo "Error: AWS_ACCOUNT_ID or AWS_REGION environment variables are not set."
    exit 1
fi

# Construct the full image names
LOCAL_IMAGE_NAME="$REGISTRY_NAME:$TAG"
REMOTE_IMAGE_NAME="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REGISTRY_NAME:$TAG"

echo "Deploying $LOCAL_IMAGE_NAME to $REMOTE_IMAGE_NAME..."

echo "Logging in to ECR"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "Building image"
# Build directly with the local tag. Ensure '.' context path is correct.
docker build --no-cache --platform=linux/amd64 -t $LOCAL_IMAGE_NAME .

echo "Tagging image for ECR"
# Tag the locally built image (LOCAL_IMAGE_NAME) for the remote repository (REMOTE_IMAGE_NAME)
docker tag $LOCAL_IMAGE_NAME $REMOTE_IMAGE_NAME

echo "Pushing image to ECR"
# Push the correctly tagged remote image name
docker push $REMOTE_IMAGE_NAME

echo "Deployment complete for $REMOTE_IMAGE_NAME"