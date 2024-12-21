---
title: 如何解决自托管 Harbor 的证书问题
tags:
  - Harbor
  - Self Hosted Certificate
  - CA
  - x509
---

# 如何解决自托管 Harbor 的证书问题

当我们在推送镜像到我们自己的 Harbor 仓库里时，有时会遇到证书问题。这可能是因为我们使用了自签名证书或者自托管的证书。在这篇文章中，我们将讨论如何解决这些问题。

## 问题描述

问题: `x509: certificate relies on legacy Common Name field, use SANs instead`

这个错误通常出现当证书未使用"主题备用名称"(SANs)而仅仅依赖于过时的"通用名称"(CN)字段时。现代的 TLS 安全性要求使用 SANs 来标识证书适用的域名或 IP 地址。

## 解决方案

解决这个问题的关键是生成包含 SANs 的正确证书。以下是一个详细的步骤，包括必要的 shell 脚本，以帮助你生成和配置符合现代安全标准的证书。

### 生成新证书

首先，我们需要在 Harbor 服务器上生成一个新的证书，这个过程涉及到创建密钥、生成证书签名请求(CSR)，并最终创建包含 SANs 的证书。

#### 脚本解析

1. **清理旧证书文件**：脚本开始先清理任何现存的证书文件，以确保不会有旧的或无效的证书干扰新证书的创建。
2. **生成私钥和证书**：接着，使用 `openssl` 命令生成一个新的 4096 位 RSA 私钥和自签名证书。这一步骤还包括了生成 CSR 和处理 SANs，确保新证书满足现代 TLS 标准。
3. **部署证书到正确的位置**：生成的新证书及其私钥会被复制到 Harbor 服务器和 Docker 的相关目录中，以便正确地被服务器和客户端使用。
4. **信任新证书**：最后，脚本更新系统的 CA 信任库，并重启 Docker 服务以应用新的证书配置。

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

### 客户端配置

在服务器端配置完毕后，我们还需要确保客户端信任新的自签名证书。对于不同的操作系统，这可能涉及到不同的步餤。下面以 CentOS 为例，描述如何将新证书添加到客户端的信任列表中。

#### 脚本解析

1. **添加证书到信任列表**：通过将证书复制到系统指定的证书存储位置，然后运行系统命令来更新证书库，使系统信任新的 Harbor 证书。
2. **登录并推送镜像到 Harbor**：一旦证书被信任，接下来的步骤展示了如何登录到 Harbor，并推送一个 Docker 镜像到仓库。

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
