# Deploy Frontend no Vercel

## 1. Deploy Frontend (Vercel)

1. Acesse https://vercel.com
2. Clique em "Add New Project"
3. Importe o repositório do frontend (pasta `front`)
4. Nas configurações, adicione a variável de ambiente:
   - Key: `VITE_API_URL`
   - Value: `https://seu-backend.vercel.app` (URL do backend depois de deployar)
5. Clique em "Deploy"

O frontend será acessível em: `https://seu-frontend.vercel.app`

## 2. Deploy Backend (Railway/Render)

O backend precisa ficar em outro serviço como Railway ou Render:

### Railway:
1. Acesse https://railway.app
2. Importe o repositório (pasta `producaoBack`)
3. Configure as variáveis de ambiente no .env
4. Deploy

### Render:
1. Acesse https://render.com
2. New -> Web Service
3. Importe o repositório
4. Configure variáveis de ambiente
5. Deploy

## 3. Configuração

Depois de deployar ambos, atualize no Vercel:
- `VITE_API_URL=https://seu-backend-railway.up.railway.app` (ou URL do Render)

## Estrutura de Arquivos

- `dist/` - Build pronto para deploy
- `vercel.json` - Configuração do Vercel
- `.vercelignore` - Arquivos para ignorar
