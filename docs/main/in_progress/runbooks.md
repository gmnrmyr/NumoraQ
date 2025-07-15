NUMORAQ - Runbook: Estado Atual → Estado Desejado 📋
🎯 ESTADO ATUAL (Como está hoje)
Arquitetura Atual
GitHub (main branch) → Lovable CI/CD → numoraq.online
                            ↓
                    Supabase Database (prod)

Processo de Deploy Atual
Desenvolvimento: Você edita o código
Commit: git add . → git commit -m "..." → git push
Deploy: Lovable detecta push e publica automaticamente
Database: Migrations automáticas via Supabase
Rollback: Se der problema, você reverte commit anterior
Problemas Identificados
❌ Sem ambiente de teste: Mudanças vão direto para usuários
❌ Sem backup de deploy: Se Lovable falhar, você fica sem controle
❌ CMS integrado: Dificulta manutenção e atualizações
❌ Uma branch só: Não permite desenvolvimento paralelo
❌ Deploy manual: Depende do Lovable para tudo

🚀 ESTADO DESEJADO (Onde queremos chegar)
Arquitetura Desejada
GitHub (main)    → Vercel → numoraq.online (PROD)
       ↓                      ↓
GitHub (develop) → Vercel → test.numoraq.online (TEST)
                              ↓
                    cms.numoraq.online (CMS)
                              ↓
                    Supabase DB (prod + test)

Processo de Deploy Desejado
Desenvolvimento: Você edita em branch feature/xxx
Teste: Merge para develop → Auto-deploy em test.numoraq.online
Validação: Testa funcionalidades em staging
Produção: Merge para main → Auto-deploy em numoraq.online
Rollback: Revert via Vercel ou GitHub em segundos

📝 RUNBOOK DE MIGRAÇÃO
FASE 1: PREPARAÇÃO (1 dia)
Objetivo: Backup completo e setup inicial
1.1 Backup do Estado Atual
# 1. Backup do código
git checkout main
git pull origin main
git tag backup-lovable-$(date +%Y%m%d)
git push origin backup-lovable-$(date +%Y%m%d)

# 2. Backup do database
# Via Supabase Dashboard: Settings → Database → Create backup

1.2 Documentar Environment Variables
# No console do browser (numoraq.online):
console.log({
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  stripeKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  // Copie TODOS os valores e salve em local seguro
});

1.3 Criar Conta Vercel
Acesse vercel.com
Conecte com sua conta GitHub
Não importe o projeto ainda

FASE 2: AMBIENTE DE TESTE (2 dias)
Objetivo: Criar test.numoraq.online funcionando
2.1 Criar Database de Teste
-- 1. Novo projeto Supabase (test-numoraq)
-- 2. Clonar schema do prod:
-- Na dashboard: Settings → Database → Schema → Export
-- No novo projeto: Import schema
-- 3. Configurar RLS igual ao prod

2.2 Branch Strategy
# Criar branch de desenvolvimento
git checkout -b develop
git push -u origin develop

# Configurar proteção na main
# GitHub → Settings → Branches → Add rule
# Require pull request reviews: ON

2.3 Deploy de Teste
# 1. Vercel: Import Project → Escolher seu repo
# 2. Configurar:
#    - Branch: develop
#    - Framework: Vite
#    - Build: npm run build
#    - Output: dist

2.4 Configurar Env Variables (Teste)
# No Vercel Dashboard → Settings → Environment Variables
VITE_SUPABASE_URL=https://test-xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...test...
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
NODE_ENV=staging

2.5 Configurar Domínio
# Vercel → Settings → Domains
# Adicionar: test.numoraq.online
# Configurar DNS: CNAME test -> cname.vercel-dns.com


FASE 3: MIGRAÇÃO PRODUÇÃO (1 dia)
Objetivo: Migrar numoraq.online para Vercel
3.1 Configurar Produção no Vercel
# 1. Novo projeto Vercel
# 2. Configurar:
#    - Branch: main
#    - Same settings que teste

3.2 Configurar Env Variables (Produção)
# Usar as MESMAS variáveis que estão no Lovable
VITE_SUPABASE_URL=https://prod-xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...prod...
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
NODE_ENV=production

3.3 Teste de Migração
# 1. Deploy em preview primeiro
# 2. Testar funcionalidades críticas:
#    - Login/cadastro
#    - Pagamentos Stripe
#    - Dados do dashboard
#    - AI advisor

3.4 Migração do Domínio
# 1. Configurar numoraq.online no Vercel
# 2. Atualizar DNS para apontar para Vercel
# 3. Aguardar propagação (5-60 minutos)
# 4. Testar produção


FASE 4: CMS SEPARADO (3 dias)
Objetivo: Criar cms.numoraq.online
4.1 Criar Projeto CMS
# Novo repo GitHub: numoraq-cms
npx create-next-app@latest numoraq-cms --typescript --tailwind
cd numoraq-cms

# Instalar dependências
npm install @supabase/supabase-js
npm install @types/node

4.2 Configurar Conexões Duplas
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabaseProd = createClient(
  process.env.SUPABASE_PROD_URL!,
  process.env.SUPABASE_PROD_SERVICE_KEY!
)

export const supabaseTest = createClient(
  process.env.SUPABASE_TEST_URL!,
  process.env.SUPABASE_TEST_SERVICE_KEY!
)

4.3 Interface CMS
// components/AdminPanel.tsx
export default function AdminPanel() {
  const [environment, setEnvironment] = useState<'prod' | 'test'>('test')
  const supabase = environment === 'prod' ? supabaseProd : supabaseTest
  
  return (
    <div>
      <EnvironmentToggle value={environment} onChange={setEnvironment} />
      <UserManagement supabase={supabase} />
      <CodeGeneration supabase={supabase} />
      <DatabaseViewer supabase={supabase} />
    </div>
  )
}

4.4 Deploy CMS
# Deploy no Vercel
# Domínio: cms.numoraq.online


FASE 5: WORKFLOW FINAL (1 dia)
Objetivo: Documentar e testar processo completo
5.1 Processo de Desenvolvimento
# 1. Criar feature
git checkout develop
git pull origin develop
git checkout -b feature/nova-funcionalidade

# 2. Desenvolver
# ... código ...

# 3. Testar localmente
npm run dev

# 4. Push para teste
git push origin feature/nova-funcionalidade
# Criar PR para develop
# Testar em test.numoraq.online

# 5. Deploy produção
# Criar PR de develop para main
# Testar em numoraq.online

5.2 Configurar Webhooks
# GitHub → Settings → Webhooks
# Notificar Vercel sobre mudanças


🔧 FERRAMENTAS DE MONITORAMENTO
Logs e Alertas
// utils/monitoring.ts
export const logError = (error: Error, context: string) => {
  if (process.env.NODE_ENV === 'production') {
    // Enviar para serviço de logs
    console.error(`[${context}]`, error)
  }
}

Health Checks
// api/health.ts
export default async function handler(req, res) {
  const health = {
    database: await checkDatabase(),
    stripe: await checkStripe(),
    timestamp: new Date().toISOString()
  }
  
  res.json(health)
}


🚨 PLANO DE ROLLBACK
Código (Deploy)
# Opção 1: Vercel Dashboard
# Deployments → Promote previous deployment

# Opção 2: Git
git revert HEAD
git push origin main
# Vercel faz auto-deploy

# Opção 3: Emergency
# Temporariamente: Reativar Lovable

Database
-- Restore via Supabase Dashboard
-- Ou script automático


📊 CHECKLIST DE VALIDAÇÃO
Pré-Deploy
[ ] Backup completo realizado
[ ] Env vars documentadas
[ ] Testes em staging passando
[ ] Database de teste funcionando
Durante Deploy
[ ] DNS propagado
[ ] SSL funcionando
[ ] Env vars configuradas
[ ] Build successful
Pós-Deploy
[ ] Login funciona
[ ] Pagamentos funcionam
[ ] Dashboard carrega
[ ] AI advisor responde
[ ] Performance OK

🎯 CRONOGRAMA REALISTA
Semana 1 (Preparação)
Dia 1: Backup + setup Vercel
Dia 2: Database teste + deploy staging
Dia 3: Testes intensivos em staging
Semana 2 (Migração)
Dia 4: Migração produção
Dia 5: Testes e ajustes
Dia 6: CMS básico
Semana 3 (Polimento)
Dia 7: CMS avançado
Dia 8: Documentação
Dia 9: Treinamento e testes finais

💰 CUSTOS ESTIMADOS
Vercel
Hobby: $0 (limitado)
Pro: $20/mês (recomendado)
Supabase
Produção: $25/mês (Pro)
Teste: $0 (Free tier)
Domínios
Subdomínios: $0 (se já tem numoraq.online)
Total mensal: ~$45

🤝 PRÓXIMOS PASSOS
Confirmar plano: Você aprova essa estratégia?
Backup: Vamos começar com backup completo?
Vercel: Criar conta e primeiro teste?
Suporte: Quando precisa de ajuda prática?
Observação: Este runbook é conservador e seguro. Prioriza não quebrar o que funciona hoje, mas evoluir gradualmente para uma estrutura profissional.
Topa começar? 🚀

----

- need to be translated
- https://cms-numoraq.lovable.app/ <- frontend in progress>