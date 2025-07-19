// seed.js - Script para popular o banco de dados
// Salve este arquivo na raiz do seu projeto

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuração do cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('⚠️ Chave de serviço do Supabase não encontrada!');
  console.error('Crie um arquivo .env na raiz do projeto com SUPABASE_SERVICE_ROLE_KEY=sua_chave');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Iniciando o processo de seed do banco de dados...');

  try {
    // 1. Inserir configurações CMS
    console.log('Inserindo configurações CMS...');
    await supabase.from('cms_settings').upsert([
      {
        setting_key: 'app_settings',
        setting_value: {
          name: 'Wealth Dashboard Flow',
          version: '1.0.0',
          description: 'Uma plataforma para gerenciamento financeiro pessoal',
          features: {
            backups: true,
            premium: true,
            points: true
          }
        }
      },
      {
        setting_key: 'premium_plans',
        setting_value: {
          plans: [
            {
              id: '1month',
              name: 'Plano Mensal',
              price: 9.99,
              duration: 30,
              features: ['Backups ilimitados', 'Sincronização em tempo real', 'Suporte prioritário']
            },
            {
              id: '1year',
              name: 'Plano Anual',
              price: 99.99,
              duration: 365,
              features: ['Backups ilimitados', 'Sincronização em tempo real', 'Suporte prioritário', 'Desconto de 17%']
            },
            {
              id: 'lifetime',
              name: 'Vitalício',
              price: 299.99,
              duration: null,
              features: ['Acesso vitalício', 'Backups ilimitados', 'Sincronização em tempo real', 'Suporte prioritário']
            }
          ]
        }
      }
    ]);

    // 2. Inserir códigos premium
    console.log('Inserindo códigos premium...');
    await supabase.from('premium_codes').upsert([
      {
        code: 'TEST-LIFETIME-2025',
        code_type: 'lifetime',
        is_active: true,
        expires_at: '2025-12-31T23:59:59Z'
      },
      {
        code: 'TEST-1YEAR-2025',
        code_type: '1year',
        is_active: true,
        expires_at: '2025-12-31T23:59:59Z'
      }
    ]);

    // 3. Criar um usuário de teste (opcional - apenas se você tiver a chave de serviço)
    console.log('Criando usuário de teste...');
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'teste@exemplo.com',
      password: 'senha123',
      email_confirm: true,
      user_metadata: {
        name: 'Usuário de Teste'
      }
    });

    if (userError) {
      console.warn('⚠️ Não foi possível criar o usuário de teste:', userError.message);
      console.warn('Continuando com o resto do seed...');
    } else {
      const userId = userData.user.id;
      console.log(`✅ Usuário de teste criado com ID: ${userId}`);

      // 4. Inserir perfil para o usuário
      console.log('Inserindo perfil do usuário...');
      await supabase.from('profiles').upsert({
        id: userId,
        name: 'Usuário de Teste',
        default_currency: 'BRL',
        language: 'pt-BR',
        live_data_enabled: true,
        admin_role: true,
        admin_level: 'admin'
      });

      // 5. Inserir dados financeiros
      console.log('Inserindo dados financeiros...');
      await supabase.from('financial_data').upsert({
        user_id: userId,
        data: {
          accounts: [
            {
              id: 'acc1',
              name: 'Conta Corrente',
              type: 'checking',
              balance: 5000.00,
              currency: 'BRL'
            },
            {
              id: 'acc2',
              name: 'Poupança',
              type: 'savings',
              balance: 15000.00,
              currency: 'BRL'
            }
          ],
          transactions: [
            {
              id: 't1',
              account_id: 'acc1',
              amount: -150.00,
              category: 'food',
              description: 'Supermercado',
              date: '2025-07-15'
            },
            {
              id: 't2',
              account_id: 'acc1',
              amount: 3000.00,
              category: 'income',
              description: 'Salário',
              date: '2025-07-05'
            }
          ]
        }
      });
    }

    console.log('✅ Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  }
}

seedDatabase();