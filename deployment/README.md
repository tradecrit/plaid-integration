Notes for installation into Kubernetes

Namespace creation with optional istio label for sidecar injection
```bash
kubectl create namespace plaid-integration
kubectl label namespace plaid-integration istio-injection=enabled
```

## Example for Vault setup

```bash
export VAULT_TOKEN="mytoken"
export VAULT_ADDR="https://vault.vault:8200"
export VAULT_SKIP_VERIFY=TRUE
export SERVICE="plaid-integration"
export SERVICE_ACCOUNT="plaid-integration"
export NAMESPACE="plaid-integration"

vault login $VAULT_TOKEN;
```

At this point you should see some output similar to the following:
```text
Success! You are now authenticated. The token information displayed below
is already stored in the token helper. You do NOT need to run "vault login"
again. Future Vault requests will automatically use this token.
```

Create the policies for the service like so.
```bash
vault policy write default - <<EOF
  path "auth/kubernetes/login" {
    capabilities = ["create", "read", "update"]
  }

  path "auth/token/renew-self" {
    capabilities = [ "update" ]
  }

  path "auth/token/lookup-self" {
    capabilities = [ "read" ]
  }
EOF

vault policy write $SERVICE - <<EOF
path "services/$SERVICE/*" {
  capabilities = ["read"]
}
EOF
```

Create the role for the service account (this is the service account from the helm chart)
```bash
vault write auth/kubernetes/role/$SERVICE_ACCOUNT \
bound_service_account_names=$SERVICE_ACCOUNT \
bound_service_account_namespaces=$NAMESPACE \
policies="$SERVICE,default" \
ttl=1h;
```

Create the secret for the service to connect to Plaid.
```bash
vault kv put services/$SERVICE/plaid-credentials \
client_id="" \
client_secret=""
```

Create our auth secrets.
```bash
vault kv put services/$SERVICE/auth-credentials \
client_id="" \
client_secret=""
```

helm upgrade --install \
plaid-integration \
--namespace plaid-integration \
-f deployment/development
../helm-charts/webserver
```
