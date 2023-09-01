export VAULT_ADDR=https://vault-cluster.vault.09d0ee77-e81f-4008-b4dc-699a5efa44cc.aws.hashicorp.cloud:8200
export VAULT_TOKEN=
export VAULT_NAMESPACE=admin

1. use Web UI to create policy
2. select namesapce (usually admin)
3. select policies tab
4. create ACL policy, name it and put the following in it... `kv/data/gtx` is path to the secret

path "kv/data/gtx" {
capabilities = [ "read" ]
}

5. create role using the CLI on the Web UI
   vault write auth/approle/role/gtx-role token_policies="gtx-key" token_ttl=1h token_max_ttl=4h

6. get the role and secret id
   vault read auth/approle/role/gtx-role/role-id

- role_id a22e9b06-0d96-b716-44fe-a3411e65e29f
  vault write -force auth/approle/role/gtx-role/secret-id
- secret_id bd6f0f4d-42d4-e23c-31f3-f7d21ec001dd
- secret_id_accessor 385119c3-55d8-b814-b57a-2c40fd14a261
- secret_id_ttl 0

POST $VAULT_ADDR/v1/admin/auth/approle/login
{
"role_id": "5b5817f5-7db1-31ea-1943-1dbecf797ab3",
"secret_id": "4e692046-914a-e2d4-0cc7-08de52401b07"
}

{
"auth" : {
"client_token": "s.d1D1l86gypL6qu1zJPdUjRtu",
}
}

curl --header "X-Vault-Token: $APP_TOKEN" $VAULT_ADDR/v1/admin/kv/data/iwave

### Test Vault

POST https://vault-cluster.vault.09d0ee77-e81f-4008-b4dc-699a5efa44cc.aws.hashicorp.cloud:8200/v1/admin/auth/approle/login
content-type: application/json

{
"role_id": "be0b7e37-a9d5-1cde-e2cc-7396324d3d49",
"secret_id": "ce295fdf-3848-ccd3-275f-9b1289bf601f"
}

### auth.client_token

GET https://vault-cluster.vault.09d0ee77-e81f-4008-b4dc-699a5efa44cc.aws.hashicorp.cloud:8200/v1/admin/kv/data/iwave
X-Vault-Token: hvs.CAESIGwUanKbi58d4fRIjnVXH3Rr7a1r8xEXWz3tMDQAvs3xGigKImh2cy44ZnNDUHZBNXhGSnhWMEdZdDRGTUFkTjAuckl4SFkQ9tlf
