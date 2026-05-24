# Variables GitLab CI/CD — boogiepop-calculator

Configurá estas variables en **GitLab → boogiepop-calculator → Settings → CI/CD → Variables**.

Podés copiar los mismos valores que ya usa **`boogiepop-react-seed`** o **`boogiepop-host`** en el grupo `boogiepop-phatom`.

| Variable | Valor | Protected | Masked |
|----------|--------|-----------|--------|
| `ECR_REGISTRY` | `653876198281.dkr.ecr.us-east-1.amazonaws.com` | sí (main) | no |
| `AWS_ACCESS_KEY_ID` | *(igual que host/backend)* | sí | sí |
| `AWS_SECRET_ACCESS_KEY` | *(igual que host/backend)* | sí | sí |
| `VITE_REMOTE_BASE` | `http://boogiepop-api-alb-1499079717.us-east-1.elb.amazonaws.com/mf/` | sí | no |

Sin `ECR_REGISTRY`, el job `docker-publish-remote-prod` no corre en push a `main`.

Tras configurar variables, un push a `main` ejecuta build + deploy automático (ver [`GITLAB-DEPLOY.md`](GITLAB-DEPLOY.md)).
