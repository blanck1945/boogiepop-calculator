# Boogiepop · Calculadora (React MF)

Microfrontend **Calculadora** basado en [`boogiepop-react-seed`](https://gitlab.com/boogiepop-phatom/boogiepop-react-seed). Se despliega como remote Module Federation en **ECS** (path `/mf/` del ALB).

## Module Federation

| Campo | Valor |
|-------|--------|
| **Nombre remote** | `calculatorRemote` |
| **Expose** | `./Shell` |
| **Consumo en host** | `calculatorRemote/Shell` |

## Desarrollo local

```bash
npm ci
npm run dev    # http://localhost:8008
npm run build
npm run lint
```

Probar embebido en el hub: agregá entrada en `boogiepop-host/public/hub-apps-manifest.json` con `remoteEntry: http://localhost:8008/remoteEntry.js` y `mfScope: calculatorRemote`.

## Deploy (GitLab → ECS)

Push a **`main`** dispara CI: build ARM64 → ECR `boogiepop-remote:latest` → rollout `boogiepop-api-fe-remote-svc`.

Variables y checklist: [`docs/GITLAB-DEPLOY.md`](docs/GITLAB-DEPLOY.md).

**Nota:** el slot ECS `/mf/` sirve un solo remote a la vez. Otros remotes pueden vivir en S3 (`remotes/<id>/`).

## Requisitos

- Node.js ≥ 22
- Docker + AWS (solo para deploy manual o CI)
<!-- updated -->
