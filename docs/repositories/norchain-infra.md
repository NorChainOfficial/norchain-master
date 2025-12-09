# norchain-infra

> Infrastructure-as-Code for NorChain

## Overview

| Attribute | Value |
|-----------|-------|
| **Repository** | [NorChainOfficial/norchain-infra](https://github.com/NorChainOfficial/norchain-infra) |
| **Visibility** | 🟢 Public |
| **License** | MIT |
| **Created** | December 9, 2025 |
| **Default Branch** | main |
| **Category** | Infrastructure |

## Description

The `norchain-infra` repository contains all infrastructure-as-code (IaC) configurations for deploying and operating the NorChain network including:

- **Docker** - Container images and compose files
- **Kubernetes** - K8s manifests and Helm charts
- **Terraform** - Cloud infrastructure provisioning
- **Monitoring** - Prometheus, Grafana, alerting
- **CI/CD** - GitHub Actions workflows

## Architecture

```
norchain-infra/
├── docker/
│   ├── images/
│   │   ├── node/
│   │   │   ├── Dockerfile
│   │   │   └── entrypoint.sh
│   │   ├── api/
│   │   │   └── Dockerfile
│   │   └── explorer/
│   │       └── Dockerfile
│   └── compose/
│       ├── docker-compose.yml          # Production
│       ├── docker-compose.dev.yml      # Development
│       └── docker-compose.test.yml     # Testing
├── kubernetes/
│   ├── base/
│   │   ├── namespace.yaml
│   │   ├── node/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   ├── configmap.yaml
│   │   │   └── pvc.yaml
│   │   ├── api/
│   │   └── explorer/
│   ├── overlays/
│   │   ├── production/
│   │   │   ├── kustomization.yaml
│   │   │   └── patches/
│   │   ├── staging/
│   │   └── development/
│   └── helm/
│       └── norchain/
│           ├── Chart.yaml
│           ├── values.yaml
│           └── templates/
├── terraform/
│   ├── modules/
│   │   ├── vpc/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── eks/
│   │   ├── rds/
│   │   ├── redis/
│   │   ├── s3/
│   │   └── cloudfront/
│   └── environments/
│       ├── production/
│       │   ├── main.tf
│       │   ├── variables.tf
│       │   └── terraform.tfvars
│       ├── staging/
│       └── development/
├── monitoring/
│   ├── prometheus/
│   │   ├── prometheus.yml
│   │   ├── alerts/
│   │   │   ├── node-alerts.yml
│   │   │   └── api-alerts.yml
│   │   └── rules/
│   ├── grafana/
│   │   ├── provisioning/
│   │   └── dashboards/
│   │       ├── node-dashboard.json
│   │       ├── api-dashboard.json
│   │       └── network-dashboard.json
│   └── alertmanager/
│       └── alertmanager.yml
├── ci/
│   ├── github-actions/
│   │   ├── build.yml
│   │   ├── test.yml
│   │   ├── deploy-staging.yml
│   │   └── deploy-production.yml
│   └── scripts/
│       ├── build-images.sh
│       ├── deploy.sh
│       └── rollback.sh
├── scripts/
│   ├── setup-cluster.sh
│   ├── backup-database.sh
│   └── restore-database.sh
└── docs/
    ├── RUNBOOK.md
    ├── DISASTER_RECOVERY.md
    └── MONITORING.md
```

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Containers | Docker | 24+ |
| Orchestration | Kubernetes | 1.28+ |
| IaC | Terraform | 1.6+ |
| Monitoring | Prometheus | 2.47+ |
| Dashboards | Grafana | 10+ |
| CI/CD | GitHub Actions | - |
| Cloud | AWS (primary) | - |

## Docker

### Building Images

```bash
# Build all images
./scripts/build-images.sh all

# Build specific image
docker build -t norchain/node:latest -f docker/images/node/Dockerfile .

# Build with version tag
docker build -t norchain/node:v1.0.0 -f docker/images/node/Dockerfile .
```

### Docker Compose (Development)

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  node:
    build:
      context: .
      dockerfile: docker/images/node/Dockerfile
    ports:
      - "30303:30303"
      - "8545:8545"
    volumes:
      - node-data:/data
    environment:
      - NETWORK=devnet
      - RPC_ENABLED=true
    
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: norchain
      POSTGRES_USER: norchain
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    
  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

  api:
    build:
      context: .
      dockerfile: docker/images/api/Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
      - node
    environment:
      - DATABASE_URL=postgresql://norchain:${DB_PASSWORD}@postgres:5432/norchain
      - REDIS_URL=redis://redis:6379
      - NODE_RPC_URL=http://node:8545

volumes:
  node-data:
  postgres-data:
  redis-data:
```

### Running Locally

```bash
# Start all services
docker-compose -f docker/compose/docker-compose.dev.yml up -d

# View logs
docker-compose -f docker/compose/docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker/compose/docker-compose.dev.yml down
```

## Kubernetes

### Kustomize Structure

```yaml
# kubernetes/base/node/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: norchain-node
  labels:
    app: norchain-node
spec:
  replicas: 3
  selector:
    matchLabels:
      app: norchain-node
  template:
    metadata:
      labels:
        app: norchain-node
    spec:
      containers:
        - name: node
          image: norchain/node:latest
          ports:
            - containerPort: 30303
              name: p2p
            - containerPort: 8545
              name: rpc
          resources:
            requests:
              cpu: "2"
              memory: "8Gi"
            limits:
              cpu: "4"
              memory: "16Gi"
          volumeMounts:
            - name: data
              mountPath: /data
          livenessProbe:
            httpGet:
              path: /health
              port: 8545
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 8545
            initialDelaySeconds: 5
            periodSeconds: 5
```

### Deployment Commands

```bash
# Apply base configuration
kubectl apply -k kubernetes/base/

# Apply production overlay
kubectl apply -k kubernetes/overlays/production/

# Using Helm
helm install norchain kubernetes/helm/norchain \
  --namespace norchain \
  --values kubernetes/helm/norchain/values-production.yaml
```

### Helm Values

```yaml
# kubernetes/helm/norchain/values.yaml
global:
  environment: production
  
node:
  replicas: 5
  image:
    repository: norchain/node
    tag: v1.0.0
  resources:
    requests:
      cpu: "2"
      memory: "8Gi"
    limits:
      cpu: "4"
      memory: "16Gi"
  persistence:
    enabled: true
    size: 500Gi
    storageClass: gp3

api:
  replicas: 3
  image:
    repository: norchain/api
    tag: v1.0.0
  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 10

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: api.norchain.org
      paths:
        - path: /
          pathType: Prefix

monitoring:
  enabled: true
  serviceMonitor:
    enabled: true
```

## Terraform

### AWS Infrastructure

```hcl
# terraform/environments/production/main.tf
terraform {
  required_version = ">= 1.6.0"
  
  backend "s3" {
    bucket = "norchain-terraform-state"
    key    = "production/terraform.tfstate"
    region = "eu-west-1"
  }
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "../../modules/vpc"
  
  environment = "production"
  cidr_block  = "10.0.0.0/16"
  
  availability_zones = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
}

module "eks" {
  source = "../../modules/eks"
  
  cluster_name    = "norchain-production"
  cluster_version = "1.28"
  
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
  
  node_groups = {
    general = {
      instance_types = ["m6i.xlarge"]
      min_size       = 3
      max_size       = 10
      desired_size   = 5
    }
    compute = {
      instance_types = ["c6i.2xlarge"]
      min_size       = 2
      max_size       = 20
      desired_size   = 5
    }
  }
}

module "rds" {
  source = "../../modules/rds"
  
  identifier     = "norchain-production"
  engine_version = "15.4"
  instance_class = "db.r6g.xlarge"
  
  vpc_id             = module.vpc.vpc_id
  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [module.vpc.database_security_group_id]
  
  multi_az = true
}
```

### Terraform Commands

```bash
# Initialize
cd terraform/environments/production
terraform init

# Plan changes
terraform plan -out=plan.tfplan

# Apply changes
terraform apply plan.tfplan

# Destroy (caution!)
terraform destroy
```

## Monitoring

### Prometheus Configuration

```yaml
# monitoring/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - 'alerts/*.yml'
  - 'rules/*.yml'

scrape_configs:
  - job_name: 'norchain-node'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        regex: norchain-node
        action: keep

  - job_name: 'norchain-api'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        regex: norchain-api
        action: keep
```

### Alert Rules

```yaml
# monitoring/prometheus/alerts/node-alerts.yml
groups:
  - name: norchain-node
    rules:
      - alert: NodeDown
        expr: up{job="norchain-node"} == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Node {{ $labels.instance }} is down"
          
      - alert: NodeOutOfSync
        expr: norchain_sync_lag_blocks > 100
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Node {{ $labels.instance }} is out of sync"
          
      - alert: HighPeerDisconnects
        expr: rate(norchain_peer_disconnects_total[5m]) > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High peer disconnect rate on {{ $labels.instance }}"
```

### Grafana Dashboards

Pre-built dashboards available in `monitoring/grafana/dashboards/`:
- Node Performance Dashboard
- API Metrics Dashboard
- Network Overview Dashboard
- Transaction Analytics Dashboard

## CI/CD

### GitHub Actions Workflow

```yaml
# ci/github-actions/deploy-production.yml
name: Deploy to Production

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        
      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/norchainofficial/node:${{ github.ref_name }}
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure kubectl
        uses: azure/k8s-set-context@v3
        with:
          kubeconfig: ${{ secrets.KUBECONFIG }}
          
      - name: Deploy to Kubernetes
        run: |
          helm upgrade --install norchain kubernetes/helm/norchain \
            --namespace norchain \
            --set node.image.tag=${{ github.ref_name }}
```

## Operations Runbook

### Common Operations

```bash
# Scale nodes
kubectl scale deployment norchain-node --replicas=10 -n norchain

# View logs
kubectl logs -f -l app=norchain-node -n norchain

# Port forward for local debugging
kubectl port-forward svc/norchain-node 8545:8545 -n norchain

# Database backup
./scripts/backup-database.sh production

# Rollback deployment
./scripts/rollback.sh norchain-node v1.0.0
```

### Disaster Recovery

See [DISASTER_RECOVERY.md](docs/DISASTER_RECOVERY.md) for detailed recovery procedures.

## Dependencies

| Repository | Relationship |
|------------|--------------|
| `norchain-node` | Deploys node containers |
| `norchain-sdk` | Deploys API and frontend |
| `norchain-bridge-hub` | Deploys bridge services |

---

*Part of the [NorChain Organization](https://github.com/NorChainOfficial)*

