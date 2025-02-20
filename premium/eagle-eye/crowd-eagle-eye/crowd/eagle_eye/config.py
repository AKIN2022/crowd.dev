import os

KUBE_MODE = os.environ.get("KUBE_MODE") is not None

IS_TEST_ENV = os.environ.get("SERVICE_ENV") == "test"
IS_DEV_ENV = os.environ.get("SERVICE_ENV") == "development" or \
             os.environ.get("SERVICE_ENV") == "docker" or \
             os.environ.get("SERVICE_ENV") is None
IS_PROD_ENV = os.environ.get("SERVICE_ENV") == "production"
IS_STAGING_ENV = os.environ.get("SERVICE_ENV") == "staging"

COHERE_API_KEY = os.environ.get("CROWD_COHERE_API_KEY")
VECTOR_API_KEY = os.environ.get("CROWD_VECTOR_API_KEY")
VECTOR_INDEX = os.environ.get("CROWD_VECTOR_INDEX")

SQS_HOST = os.environ.get("CROWD_SQS_HOST")
SQS_PORT = os.environ.get("CROWD_SQS_PORT")
SQS_ENDPOINT_URL = f"http://{SQS_HOST}:{SQS_PORT}" if IS_DEV_ENV else None
SQS_ACCESS_KEY_ID = os.environ.get("CROWD_SQS_AWS_ACCESS_KEY_ID")
SQS_SECRET_ACCESS_KEY = os.environ.get("CROWD_SQS_AWS_SECRET_ACCESS_KEY")
SQS_REGION = os.environ.get("CROWD_SQS_AWS_REGION")

PREMIUM_PYTHON_WORKER_QUEUE = os.environ.get("CROWD_SQS_PREMIUM_PYTHON_WORKER_QUEUE")