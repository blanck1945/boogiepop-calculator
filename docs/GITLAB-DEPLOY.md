# GitLab CI/CD — Calculadora MF (`boogiepop-calculator`)

Remote React (Module Federation) desplegado en **ECR** `boogiepop-remote` + **ECS** `boogiepop-api-fe-remote-svc` detrás del ALB en path `/mf/`.

## Flujo por rama

| Momento | Pipeline | Deploy |
|---------|----------|--------|
| **MR → `main`** | `lint` + `vite-build` | — |
| **Push a `main`** | lint + build + **`docker-publish-remote-prod`** + **`deploy-remote-ecs-prod`** | **Automático** → ECR `:latest` + rollout ECS |
| **Push a `develop`** | lint + build + jobs **manual** | Staging opcional (`:develop`) |

## Variables obligatorias (Settings → CI/CD → Variables)

| Variable | Valor producción |
|----------|------------------|
| **`ECR_REGISTRY`** | `653876198281.dkr.ecr.us-east-1.amazonaws.com` |
| **`AWS_ACCESS_KEY_ID`** / **`AWS_SECRET_ACCESS_KEY`** | Mismas credenciales que host/backend |
| **`VITE_REMOTE_BASE`** | `http://boogiepop-api-alb-1499079717.us-east-1.elb.amazonaws.com/mf/` |

Opcionales (defaults en `.gitlab-ci.yml`):

| Variable | Default |
|----------|---------|
| `ECS_CLUSTER_NAME` | `boogiepop-api-cluster` |
| `ECS_FRONT_REMOTE_SERVICE_NAME` | `boogiepop-api-fe-remote-svc` |
| `REMOTE_ECR_REPOSITORY` | `boogiepop-remote` |

## Manifest del hub (manual)

Este repo **no** actualiza el manifest. Registrá la app en el dashboard o S3 con:

| Campo | Valor |
|-------|--------|
| `id` | `calculator` |
| `kind` | `react-mf` |
| `mfScope` | `calculatorRemote` |
| `mfExpose` | `Shell` |
| `remoteEntry` | `http://boogiepop-api-alb-1499079717.us-east-1.elb.amazonaws.com/mf/remoteEntry.js` |

## Verificación post-deploy

```bash
curl -I http://boogiepop-api-alb-1499079717.us-east-1.elb.amazonaws.com/mf/remoteEntry.js

aws ecs describe-services \
  --cluster boogiepop-api-cluster \
  --services boogiepop-api-fe-remote-svc \
  --query 'services[0].deployments'
```
