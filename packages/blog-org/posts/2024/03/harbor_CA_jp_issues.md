---
タイトル: 自己ホスト型HarborでのCA問題を解決する方法
タグ:
  - Harbor
  - 自己ホスト証明書
  - CA
  - x509
---

# 自己ホスト型 Harbor での CA 問題を解決する方法

自己の Harbor リポジトリにイメージをプッシュする際、CA 問題に遭遇することがよくあります。これは、自己署名証明書または自己ホスト証明書を使用しているためかもしれません。この記事では、これらの問題を解決する方法について説明します。

## 問題の説明

問題: `x509: 証明書はレガシーなCommon Nameフィールドに依存しています、代わりにSANを使用してください`

このエラーは通常、証明書が「主題代替名」(SANs)を使用せず、時代遅れの「共通名」(CN)フィールドに依存している場合に発生します。現代の TLS セキュリティでは、証明書が有効なドメイン名や IP アドレスを識別するために SANs の使用が要求されます。

## 解決策

この問題を解決する鍵は、SAN を含む正しい証明書を生成することです。ここでは、現代のセキュリティ基準を満たす証明書を生成および構成するための詳細な手順と必要なシェルスクリプトをご紹介します。

### 新しい証明書の生成

まず、Harbor サーバーで新しい証明書を生成する必要があります。このプロセスには、キーの作成、証明書署名要求(CSR)の生成、そして SAN を含む証明書の最終的な作成が含まれます。

#### スクリプトの説明

1. **古い証明書ファイルのクリーンアップ**: スクリプトは、新しい証明書の作成に古いまたは無効な証明書が干渉しないように、既存の証明書ファイルをクリーンアップすることから始まります。
2. **プライベートキーと証明書の生成**: 次に、`openssl`コマンドを使用して新しい 4096 ビット RSA プライベートキーと自己署名証明書を生成します。このステップには、CSR の生成と SAN の扱いも含まれ、新しい証明書が現代の TLS 基準を満たすことを確実にします。
3. **証明書を正しい場所にデプロイする**: 新しく生成された証明書とそのプライベートキーを、Harbor サーバーおよび Docker 上の関連ディレクトリにコピーして、サーバーとクライアントによって正しく使用されるようにします。
4. **新しい証明書を信頼する**: 最後に、システムの CA 信頼ストアを更新し、新しい証明書の構成を適用するために Docker サービスを再起動します。

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

### クライアントの設定

サーバー側の設定が完了した後、クライアントが新しい自己署名証明書を信頼することも確実にする必要があります。オペレーティングシステムによって、これには異なる手順が関わる場合があります。以下では、例として CentOS を使用し、新しい証明書をクライアントの信頼リストに追加する方法を説明します。

#### スクリプトの説明

1. **証明書を信頼リストに追加する**: 証明書をシステム指定の証明書保管場所にコピーし、その後システムコマンドを実行して証明書ストアを更新することにより、システムは新しい Harbor 証明書を信頼します。
2. **Harbor にログインしてイメージをプッシュする**: 証明書が信頼されると、以下の手順で Harbor にログインし、Docker イメージをリポジトリにプッシュする方法を示します。

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
