#!/bin/bash


set -e
BACKEND_DIR="$(cd "$(dirname "$0")" && pwd)"

<<<<<<< HEAD
=======
if lsof -ti tcp:8084 >/dev/null 2>&1; then
	echo "Auth Service is already running; run ./stop-all.sh before applying SMTP settings." >&2
	exit 1
fi

export MAIL_HOST="${MAIL_HOST:-smtp.gmail.com}"
export MAIL_PORT="${MAIL_PORT:-587}"

if [[ -z "${MAIL_USERNAME:-}" ]]; then
	read -r -p "SMTP sender Gmail address: " MAIL_USERNAME
fi

MAIL_PASSWORD=""
read -r -s -p "Google App Password (input hidden): " MAIL_PASSWORD
printf '\n'

MAIL_PASSWORD="${MAIL_PASSWORD//[[:space:]]/}"
if [[ -z "$MAIL_USERNAME" || -z "$MAIL_PASSWORD" ]]; then
	echo "SMTP sender address and Google App Password are required." >&2
	exit 1
fi

export MAIL_USERNAME MAIL_PASSWORD

>>>>>>> 713e2ec (Add New Feature in Forgot Password)
echo "Starting FoodShare Microservices..."

start_service() {
	local service="$1"
	local port

	case "$service" in
		service-registry) port=8761 ;;
		api-gateway) port=8079 ;;
		auth-service) port=8084 ;;
		user-service) port=8082 ;;
		food-service) port=8083 ;;
		request-service) port=8085 ;;
		esac

	if lsof -ti tcp:"$port" >/dev/null 2>&1; then
		echo "$service is already running on port $port; skipping."
		return
	fi

	(cd "$BACKEND_DIR/$service" && bash ./mvnw spring-boot:run > "$BACKEND_DIR/$service.log" 2>&1) &
}

start_service "service-registry"
sleep 10
start_service "api-gateway"
start_service "auth-service"
start_service "user-service"
start_service "food-service"
start_service "request-service"

echo "All services are starting..."
echo "Eureka       : http://localhost:8761"
echo "API Gateway  : http://localhost:8079"
echo "Auth Service : http://localhost:8084"
echo "User Service : http://localhost:8082"
echo "Food Service : http://localhost:8083"
echo "Request      : http://localhost:8085"
