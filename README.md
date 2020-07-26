# Execução 

``` sh
npm install

npm start
```

É possível adicionar a flag `--use-redis` para habilitar o storage do **redis** para servir de cache, o TTL padrão é 60 segundos.

```sh
npm install

npm start --use-redis
```


# Testes

```sh
npm test
```

**Porta padrão**: 3000
**Porta produção**: 8080 

# Escalabilidade

O processo principal conta com o spread de N threads, sendo o número de thread definido pelo número de CPUs disponíveis.


## PM2 (Desenvolvimento)
É possível adicionar clusters em um gerenciador de processos, como o **PM2** 

```
npm install -g pm2

pm2 start index.js -i max
```

## Kubernetes com Minikube (Produção)

É possível também criar clusters em kubernetes, utilizei **Minikube** para facilitar o desenvolvimento.


### 1. Minikube

Essa etapa é opcional, mas serve para executar kubernetes localmente, então a etapa do docker vai ter uma etapa extra para adicionar as etapas na própria VM do Kubernete que está sendo executado pelo Minikube

```sh
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube

sudo mkdir -p /usr/local/bin

sudo install minicube /usr/local/bin

minikube start --driver=docker

# para ter as imagens docker armazenadas lá como um "docker image registry" de testes. Isso demultiplexa o Docker Daemon para o que está em execução dentro da VM do Kubernetes
eval $(minikube docker-env)

```

### 2. Docker

```sh
docker build -t jbcrawler .
docker tag jbcrawler jbcrawler:1.0.0

# para retornar o Docker Daemon para o controle local
eval $(minikube docker-env -u)
```

### 3. Kubectl

```sh
kubectl create -f kubernetes.yaml
minikube tunnel
```

O serviço estará exposto no IP do service mostrado no dashboard do Kubernete (`minikube dashboard`).
