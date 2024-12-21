---
title: How to Solve CA Issues with Self-Hosted Harbor
tags:
  - Harbor
  - Self Hosted Certificate
  - CA
  - x509
---

# How to Solve CA Issues with Self-Hosted Harbor

When pushing images to our own Harbor repository, we often encounter CA issues. This maybe because we're using a self-signed certificate or a self-hosted certificate. In this article, we'll discuss how to resolve these issues.

## Problem Description

Issue: `x509: certificate relies on legacy Common Name field, use SANs instead`

This error typically occurs when a certificate does not use "Subject Alternative Names"(SANs) and relies on the outdated "Common Name"(CN) field. Modern TLS security requires the use of SANs to identify the domain names or IP addresses for which the certificate is valid.

## Solution

The key to solving this problem is to generate the correct certificate that includes SANs. Here are detailed steps, including the necessary shell scripts, to help you generate and configure a certificate that meets modern security standards.

### Generating a New Certificate

First, we need to generate a new certificate on the Harbor server. This process involves creating a key, generating a Certificate Signing Request (CSR), and finally creating a certificate that includes SANs.

#### Script Explanation

1. **Cleaning up old certificate files**: The script starts by cleaning up any existing certificate files to ensure that no old or invalid certificates interfere with the creation of the new certificate.
2. **Generating a private key and certificate**: Next, the `openssl` command is used to generate a new 4096-bit RSA private key and a self-signed certificate. This step also includes generating a CSR and handling SANs to ensure the new certificate meets modern TLS standards.
3. **Deploying the certificate to the correct locations**: The newly generated certificate and its private key are copied to the relevant directories on the Harbor server and Docker, to be correctly used by the server and clients.
4. **Trusting the new certificate**: Finally, the script updates the system's CA trust store and restarts the Docker service to apply the new certificate configuration.

```shell
#!/bin/bash

mkdir -p /etc/ssl/private

echo "Remove old key files."

# Remove old files
sudo rm -rf /data/cert/harbor.crt
sudo rm -rf /data/cert/harbor.key
sudo rm -rf /data/cert/harbor.pem
sudo rm -rf /data/cert/harbor.cert

echo "Remove old files."

# Remove the passphrase from the private key
sudo rm -rf /etc/ssl/private/harbor.pem
sudo rm -rf /etc/ssl/private/harbor.crt
sudo rm -rf /etc/ssl/private/harbor.cert
sudo rm -rf /etc/ssl/private/harbor.key

sudo rm -rf /etc/ssl/certs/harbor.pem
sudo rm -rf /etc/ssl/certs/harbor.crt
sudo rm -rf /etc/ssl/certs/harbor.cert
sudo rm -rf /etc/ssl/certs/harbor.key

sudo rm -rf /etc/docker/certs.d/x.x.x.x/harbor.pem
sudo rm -rf /etc/docker/certs.d/x.x.x.x/harbor.key
sudo rm -rf /etc/docker/certs.d/x.x.x.x/harbor.crt
sudo rm -rf /etc/docker/certs.d/x.x.x.x/harbor.cert

sudo rm -rf /etc/pki/ca-trust/source/anchors/harbor.crt
sudo rm -rf /etc/pki/ca-trust/source/anchors/harbor.cert
sudo rm -rf /etc/pki/ca-trust/source/anchors/harbor.pem

echo "Generating a private key"

# Generate a private key
openssl genrsa -out /data/cert/harbor.key 4096

openssl req -x509 -new -nodes -sha512 -days 3650 \
 -subj "/C=CN/ST=Beijing/L=Beijing/O=GameSale/OU=Personal/CN=x.x.x.x" \
 -key /data/cert/harbor.key \
 -out /data/cert/harbor.crt

openssl req -sha512 -new \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=GameSale/OU=Personal/CN=x.x.x.x" \
    -key /data/cert/harbor.key \
    -out /data/cert/harbor.csr

cat > /data/cert/v3.ext <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1=x.x.x.x
IP.1=x.x.x.x
EOF

openssl x509 -req -sha512 -days 3650 \
    -extfile /data/cert/v3.ext \
    -CA /data/cert/harbor.crt -CAkey /data/cert/harbor.key -CAcreateserial \
    -in /data/cert/harbor.csr \
    -out /data/cert/harbor.crt

openssl x509 -inform PEM -in /data/cert/harbor.crt -out /data/cert/harbor.cert
openssl x509 -in /data/cert/harbor.crt -out /data/cert/harbor.pem -outform PEM

# Copy files
echo "Copy files."

sudo cp /data/cert/harbor.crt /etc/ssl/private/
sudo cp /data/cert/harbor.cert /etc/ssl/private/
sudo cp /data/cert/harbor.pem /etc/ssl/private/harbor.pem
sudo cp /data/cert/harbor.key /etc/ssl/private/

sudo cp /data/cert/harbor.crt /etc/ssl/certs/
sudo cp /data/cert/harbor.cert /etc/ssl/certs/
sudo cp /data/cert/harbor.pem /etc/ssl/certs/harbor.pem
sudo cp /data/cert/harbor.key /etc/ssl/certs/

sudo cp /data/cert/harbor.crt /etc/docker/certs.d/x.x.x.x/
sudo cp /data/cert/harbor.cert /etc/docker/certs.d/x.x.x.x/
sudo cp /data/cert/harbor.pem /etc/docker/certs.d/x.x.x.x/harbor.pem
sudo cp /data/cert/harbor.key /etc/docker/certs.d/x.x.x.x/

sudo cp /data/cert/harbor.crt /etc/pki/ca-trust/source/anchors/
sudo cp /data/cert/harbor.cert /etc/pki/ca-trust/source/anchors/
sudo cp /data/cert/harbor.pem /etc/pki/ca-trust/source/anchors/harbor.pem

echo "Generating a private key successfully."

echo "restart"

sudo update-ca-trust

systemctl restart docker
sudo systemctl restart docker.service

cd /opt/harbor
./prepare

# docker-compose down -v
# docker-compose up -d


echo "end."
```

### Client Configuration

After configuring the server side, we also need to ensure the client trusts the new self-signed certificate. Depending on the operating system, this may involve different steps. Below, using CentOS as an example, we describe how to add the new certificate to the client's trust list.

#### Script Explanation

1. **Adding the certificate to the trust list**: By copying the certificate to the system-specified certificate storage location and then running a system command to update the certificate store, the system trusts the new Harbor certificate.
2. **Logging in and pushing an image to Harbor**: Once the certificate is trusted, the following steps show how to log into Harbor and push a Docker image to the repository.

```yaml
- name: Trust self-signed certificate
  run: |
    echo "${{ env.CERTIFICATE }}" > harbor.crt
    sudo mkdir -p /usr/local/share/ca-certificates/harbor
    sudo mkdir -p /etc/docker/certs.d/${{ env.HARBOR_URL }}
    sudo mkdir -p /usr/local/share/ca-certificates/extra
    sudo mkdir -p /etc/ssl/certs
    sudo cp harbor.crt /usr/local/share/ca-certificates/harbor/harbor.crt
    sudo cp harbor.crt /etc/docker/certs.d/${{ env.HARBOR_URL }}/ca.crt
    sudo cp harbor.crt /usr/local/share/ca-certificates/extra/harbor.crt
    sudo cp harbor.crt /etc/ssl/certs/harbor.crt
    sudo update-ca-certificates
    sudo systemctl restart docker

- name: Login to Harbor
    run: |
        echo $HARBOR_PASSWORD | docker login $HARBOR_URL --username $HARBOR_USERNAME --password-stdin
        docker build -t $HARBOR_URL/$IMAGE_NAME:$VERSION .
        docker push $HARBOR_URL/$IMAGE_NAME:$VERSION
    env:
        HARBOR_USERNAME: ${{ env.HARBOR_USERNAME }}
        HARBOR_PASSWORD: ${{ env.HARBOR_PASSWORD }}
        HARBOR_URL: ${{ env.HARBOR_URL }}
        IMAGE_NAME: ${{ env.APP_NAME }}
        VERSION: ${{ env.VERSION }}
```
