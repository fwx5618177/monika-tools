---
title: MD Plugin Test
date: 2024-04-01
tags: [PlantUML, Test, codesandbox, react-component]
---

# MD Plugin Test

it's a `js` sample.

```plantuml
class SimplePlantUMLPlugin {
    + transform(syntaxTree: AST): AST
}
```

```rust codesandbox=new?name=/test.rs&external="https://codesandbox.io/p/sandbox/fork-syscall-example-7giodp?file=/src/main.rs"
pub const a = 1;
```

```react codesandbox=new?name=/App.js
export default function Example() {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">Ready to dive in?</span>
          <span className="block text-indigo-600">Start your free trial today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
            >
              Get started
            </a>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
```

```javascript
const a = 1;
```

```bash
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

sudo rm -rf /etc/docker/certs.d/144.34.183.86/harbor.pem
sudo rm -rf /etc/docker/certs.d/144.34.183.86/harbor.key
sudo rm -rf /etc/docker/certs.d/144.34.183.86/harbor.crt
sudo rm -rf /etc/docker/certs.d/144.34.183.86/harbor.cert

sudo rm -rf /etc/pki/ca-trust/source/anchors/harbor.crt
sudo rm -rf /etc/pki/ca-trust/source/anchors/harbor.cert
sudo rm -rf /etc/pki/ca-trust/source/anchors/harbor.pem

echo "Generating a private key"

# Generate a private key
openssl genrsa -out /data/cert/harbor.key 4096

openssl req -x509 -new -nodes -sha512 -days 3650 \
 -subj "/C=CN/ST=Beijing/L=Beijing/O=GameSale/OU=Personal/CN=144.34.183.86" \
 -key /data/cert/harbor.key \
 -out /data/cert/harbor.crt

openssl req -sha512 -new \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=GameSale/OU=Personal/CN=144.34.183.86" \
    -key /data/cert/harbor.key \
    -out /data/cert/harbor.csr

cat > /data/cert/v3.ext <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1=144.34.183.86
IP.1=144.34.183.86
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

sudo cp /data/cert/harbor.crt /etc/docker/certs.d/144.34.183.86/
sudo cp /data/cert/harbor.cert /etc/docker/certs.d/144.34.183.86/
sudo cp /data/cert/harbor.pem /etc/docker/certs.d/144.34.183.86/harbor.pem
sudo cp /data/cert/harbor.key /etc/docker/certs.d/144.34.183.86/

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

docker-compose down -v
docker-compose up -d

echo "end."
```

This is a youtube video:

https://www.youtube.com/watch?v=aoLhACqJCUg

This is a photo:

https://www.flickr.com/photos/pedrocaetano/27432477888

This another photo:

http://www.23hq.com/mprove/photo/66422006

Check it out 👆

## js

这是测试:

```js
const a = 1;
const b = 2;
const c = 3;
```

加上`codesandbox=new`:

```react codesandbox=new
const a = 1;
```

加上`codesandbox=new?style=height:1000px;width:600px&name=App.tsx`:

```react codesandbox=new?style=height:1000px;width:600px
const a = 1;
```

```javascript
const a = 1;
```

```react codesandbox=new
const a = 1;
```

```react codesandbox=new?style=height:1000px;width:600px
const a = 1;
```

## React

```react
const a = 1;
```

```react codesandbox=new
const a = 1;
```

```react codesandbox=new?style=height:1000px;width:600px&theme=dark
const a = 1;
const a = 1;
const a = 1;
```
