#!/bin/bash

set -u

if ! command -v lsof >/dev/null 2>&1; then
    echo "lsof is required to find the running FoodShare services." >&2
    exit 1
fi

ports=(8079 8084 8082 8083 8085 8086 8761)
services=(api-gateway auth-service user-service food-service request-service payment-service service-registry)
had_errors=0

for index in "${!ports[@]}"; do
    port="${ports[$index]}"
    service="${services[$index]}"
    pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"

    if [[ -z "$pids" ]]; then
        echo "$service is not running on port $port."
        continue
    fi

    while IFS= read -r pid; do
        [[ -n "$pid" ]] || continue
        if kill -TERM "$pid" 2>/dev/null; then
            echo "Stop signal sent to $service (PID $pid, port $port)."
        else
            echo "Could not stop $service (PID $pid, port $port)." >&2
            had_errors=1
        fi
    done <<< "$pids"
done

exit "$had_errors"