Guia de Implantação do Numoraq

Este guia detalha como migrar o numoraq.online da Hostinger para o Vercel, configurar os subdomínios test.numoraq.online e cms.numoraq.online, corrigir erros de RLS no Supabase, implementar CI/CD, configurar backups, e planejar a migração para o DBeaver. Ele também inclui um esboço para o ascend-osrs.

Semana 1: Migrar para o Vercel e configurar o ambiente de teste
1. Verificar repositórios GitHub

Site (numoraq.online):
Repositório: seu-usuario/numoraq, branch main.
Clone: git clone <url-do-repositorio> && cd <nome-do-repositorio> && npm install.
Configure .env.local:NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key


Teste: npm run dev, acesse http://localhost:3000.


Novo CMS:
Repositório: separado, gerado pelo Lovable.
Clone e teste localmente, verificando a interface (Ctrl+Shift+E).



2. Corrigir erros de RLS (CMS atual)

No Supabase, vá para Authentication > Policies.
Adicione política para admin:CREATE POLICY "Admin can edit all data" ON public.users
FOR ALL
TO authenticated
USING (auth.role() = 'admin')
WITH CHECK (auth.role() = 'admin');


Teste o CMS atual em numoraq.online via Ctrl+Shift+E.

3. Configurar schemas no Supabase

No Supabase, vá para SQL Editor:CREATE SCHEMA prod;
CREATE SCHEMA test;
CREATE SCHEMA cms;
CREATE TABLE prod.users (id UUID PRIMARY KEY, name TEXT);
CREATE TABLE test.users (id UUID PRIMARY KEY, name TEXT);
CREATE TABLE cms.users (id UUID PRIMARY KEY, name TEXT);
ALTER TABLE prod.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE test.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CMS can edit test data" ON test.users
FOR ALL
TO authenticated
USING (auth.role() = 'admin')
WITH CHECK (auth.role() = 'admin');



4. Ativar integrações do Supabase

GitHub: Em Integrations > GitHub Connections, conecte os repositórios do site e do CMS.
Vercel: Em Integrations > Vercel Integration, instale e autorize.

5. Criar projetos Vercel

Produção (numoraq.online):
Crie projeto, conecte ao repositório do site (branch main).
Teste a URL temporária.


Teste (test.numoraq.online):
Crie branch test: git checkout -b test && git push origin test.
Atualize o código para usar o schema test:const { data, error } = await supabase.from('test.users').select('*');


Crie projeto Vercel, conecte ao branch test.
Adicione domínio test.numoraq.online.
Na Hostinger, adicione:Tipo: CNAME
Nome: test
Valor: cname.vercel-dns.com
TTL: 300





6. Migrar numoraq.online

No Vercel, adicione numoraq.online e www.numoraq.online em Settings > Domains.
Na Hostinger, anote os registros atuais (A @ 185.158.133.1, A www 185.158.133.1).
Remova os registros A e adicione:Tipo: CNAME
Nome: @
Valor: cname.vercel-dns.com
TTL: 300
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
TTL: 300


Teste após propagação.
Desative o deploy do Lovable na Hostinger (em Settings ou Integrations).

Semana 2: Configurar o novo CMS, CI/CD, backups, e DBeaver
1. Configurar o novo CMS (cms.numoraq.online)

No repositório do CMS, atualize o código:// pages/index.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CMS() {
  const handleUpdateTest = async () => {
    const { data, error } = await supabase
      .from('test.users')
      .insert([{ name: 'Test User' }]);
    if (error) console.error(error);
    else console.log('User added:', data);
  };

  const handlePromoteToProduction = async () => {
    const { data: testData } = await supabase.from('test.users').select('*');
    const { error } = await supabase.from('prod.users').insert(testData);
    if (error) console.error(error);
    else console.log('Promoted to production');
  };

  return (
    <div>
      <h1>CMS Numoraq</h1>
      <button onClick={handleUpdateTest}>Add Test User</button>
      <button onClick={handlePromoteToProduction}>Promote to Production</button>
    </div>
  );
}


Configure .env.local:NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key


Teste localmente: npm run dev.
Faça push: git add . && git commit -m "Configurar CMS" && git push origin main.
Crie projeto Vercel, conecte ao repositório do CMS, adicione cms.numoraq.online.
Na Hostinger, adicione:Tipo: CNAME
Nome: cms
Valor: cname.vercel-dns.com
TTL: 300



2. Configurar CI/CD

No repositório do site, crie .github/workflows/deploy.yml:name: Deploy to Vercel
on:
  push:
    branches: [main, test]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: ${{ github.ref == 'refs/heads/main' && '--prod' || '' }}
          scope: ${{ secrets.VERCEL_ORG_ID }}


No repositório do CMS, crie um arquivo semelhante.
Adicione Secrets no GitHub: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID.

3. Configurar backups

Crie .github/workflows/backup.yml:name: Weekly Supabase Backup
on:
  schedule:
    - cron: '0 0 * * 0'
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Install Supabase CLI
        run: npm install -g @supabase/supabase
      - name: Run Supabase Dump
        env:
          SUPABASE_DB_URL: ${{ secrets.SUPABASE_DB_URL }}
        run: npx supabase db dump --db-url $SUPABASE_DB_URL > backup-$(date +%Y%m%d).sql
      - name: Upload Backup
        uses: actions/upload-artifact@v3
        with:
          name: supabase-backup
          path: backup-*.sql


Adicione SUPABASE_DB_URL no GitHub Secrets.

4. Planejar migração para DBeaver

Escolha um provedor PostgreSQL gratuito (ex.: Neon.tech).
Exporte o banco do Supabase:npx supabase db dump --db-url <sua-url-do-supabase> > numoraq.sql


Importe no novo banco:psql -h <host> -U <user> -d <database> < numoraq.sql


Atualize as variáveis no Vercel:NEXT_PUBLIC_DATABASE_URL=<novo-url-do-postgresql>


Configure o DBeaver para gerenciar o banco.
Teste em um projeto Vercel separado antes de migrar.

Ascend OSRS

Repita o processo: migre para o Vercel, configure repositório GitHub, use Supabase com schemas prod e test, implemente CI/CD e backups, planeje migração para DBeaver.
Ajuste para funções mais simples, sem CMS se não necessário.
