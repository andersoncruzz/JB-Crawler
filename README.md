# Execução 


## Inicialização do serviço

``` sh
npm install

npm start
```

É possível adicionar a flag `--use-redis` para habilitar o storage do **redis** para servir de cache, o TTL padrão é 60 segundos.

```sh
npm install

npm start --use-redis
```

## Utilização
O serviço possui uma única rota

> [GET] `/rest/v1/inquiry/:process_id?[...params]`

**Parameters**
- `:process-id`: número do processo

# Testes

Utilizando Mocha com BDD

```sh
npm run test
```

**Porta padrão**: 3000
**Porta produção**: 8080 


---
> As etapas descritas abaixo são opcionais e são relativas somente à escalabilidade.
---

# Escalabilidade

O processo principal conta com o spread de N threads, sendo o número de thread definido pelo número de CPUs disponíveis.


### PM2 (Desenvolvimento)
É possível adicionar clusters em um gerenciador de processos, como o **PM2** 

```
npm install -g pm2

pm2 start index.js -i max
```

### Kubernetes com Minikube (Produção)

É possível também criar clusters em kubernetes, utilizei **Minikube** para facilitar o desenvolvimento.


#### 1. Minikube

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

#### 2. Docker

```sh
docker build -t jbcrawler .
docker tag jbcrawler jbcrawler:1.0.0

# para retornar o Docker Daemon para o controle local
eval $(minikube docker-env -u)
```

#### 3. Kubectl
Separei os serviços em 2 arquivos: 

 - redis.yaml
 - jbcrawler.yaml
 
 O arquivo `deploy.sh` possui a verificação do status do serviço `redis` para iniciar o serviço  e os pods da aplicação descrita em `jbcrawler.yaml` em seguida.
 
```sh
chmod +x deploy.sh && ./deploy.sh
```

O serviço estará exposto no IP do service mostrado no dashboard do Kubernete (`minikube dashboard`).


# Todo
| Item | Descrição | Status|
| --- | --- | --- |
| Organização do código | Arquitetura Repository & AbstractFactory| ![](https://progress-bar.dev/100) |
| Testes | Mocha | ![](https://progress-bar.dev/100) | 
| Facilidade ao rodar o projeto | NPM | ![](https://progress-bar.dev/100) | 
|Escalabilidade: o quao facil é escalar os crawlers. | PM2, Kubernetes e Containers | ![](https://progress-bar.dev/100) |
| Performance: o tempo para crawlear todo o processo juridico. | Detached Wrappers e Redis | ![](https://progress-bar.dev/100)| 
