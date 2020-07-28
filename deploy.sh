#!/bin/bash

kubectl create -f redis.yaml

pod_name=$(kubectl get pods -l app=node-redis | grep "redis" | awk '{print $1}')

# check whether redis server is ready or not
while true; do
  pong=$(kubectl exec -it "$pod_name" -- redis-cli ping)
  if [[ "$pong" == *"PONG"* ]]; then
    echo ok
    break
    else
      sleep 2
  fi
done

kubectl create -f jbcrawler.yaml
