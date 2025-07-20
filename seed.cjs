// seed.cjs - Script para popular o banco de dados (CommonJS)
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuração do cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontradas!');
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
          features: { backups: true, premium: true, points: true }
        }
      },
      {
        setting_key: 'premium_plans',
        setting_value: {
          plans: [
            { id: '1month', name: 'Plano Mensal', price: 9.99, duration: 30, features: ['Backups ilimitados', 'Sincronização em tempo real', 'Suporte prioritário'] },
            { id: '1year', name: 'Plano Anual', price: 99.99, duration: 365, features: ['Backups ilimitados', 'Sincronização em tempo real', 'Suporte prioritário', 'Desconto de 17%'] },
            { id: 'lifetime', name: 'Vitalício', price: 299.99, duration: null, features: ['Acesso vitalício', 'Backups ilimitados', 'Sincronização em tempo real', 'Suporte prioritário'] }
          ]
        }
      }
    ]);

    // 2. Inserir códigos premium
    console.log('Inserindo códigos premium...');
    await supabase.from('premium_codes').upsert([
      { code: 'TEST-LIFETIME-2025', code_type: 'lifetime', is_active: true, expires_at: '2025-12-31T23:59:59Z' },
      { code: 'TEST-1YEAR-2025', code_type: '1year',    is_active: true, expires_at: '2025-12-31T23:59:59Z' }
    ]);

    // 3. Criar múltiplos usuários de teste com relacionamentos
    console.log('Criando múltiplos usuários de teste...');
    const SEED_USER_COUNT = parseInt(process.env.SEED_USER_COUNT) || 10;
    // Criar um usuário admin para referência
    const { data: adminData, error: adminErr } = await supabase.auth.admin.createUser({
      email: 'admin@exemplo.com',
      password: 'senha123',
      email_confirm: true,
      user_metadata: { name: 'Admin Seed' }
    });
    if (adminErr) throw adminErr;
    const adminId = adminData.user.id;
    console.log(`✅ Admin criado com ID: ${adminId}`);

    for (let i = 1; i <= SEED_USER_COUNT; i++) {
      const email = `user${i}@exemplo.com`;
      console.log(`Criando usuário ${i}/${SEED_USER_COUNT}: ${email}`);
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password: 'senha123',
        email_confirm: true,
        user_metadata: { name: `Usuário ${i}` }
      });
      if (error) {
        console.warn(`⚠️ Falha ao criar ${email}:`, error.message);
        continue;
      }
      const uid = data.user.id;
      console.log(`✅ Usuário criado: ${email} (${uid})`);

      // Perfil
      await supabase.from('profiles').upsert({
        id: uid,
        name: `Usuário ${i}`,
        default_currency: 'BRL',
        language: 'pt-BR',
        live_data_enabled: true,
        admin_role: false,
        admin_level: 'standard'
      });

      // Financial data
      await supabase.from('financial_data').upsert({
        user_id: uid,
        data: {
          accounts: [
            { id: `acc${i}1`, name: 'Conta Corrente', type: 'checking', balance: 5000.00, currency: 'BRL' },
            { id: `acc${i}2`, name: 'Poupança',       type: 'savings',  balance: 15000.00, currency: 'BRL' }
          ],
          transactions: [
            { id: `t${i}1`, account_id: `acc${i}1`, amount: -150.00, category: 'food', description: 'Supermercado', date: new Date().toISOString().split('T')[0] },
            { id: `t${i}2`, account_id: `acc${i}1`, amount: 3000.00, category: 'income', description: 'Salário', date: new Date().toISOString().split('T')[0] }
          ]
        }
      });

      // User points
      const points = Math.floor(Math.random() * 1000);
      const totalDonated = parseFloat((Math.random() * 500).toFixed(2));
      const highestTier = points < 500 ? 'newcomer' : 'supporter';
      await supabase.from('user_points').upsert({
        user_id: uid,
        points,
        total_donated: totalDonated,
        highest_tier: highestTier,
        assigned_by_admin: adminId,
        activity_type: 'seed',
        activity_date: new Date().toISOString().split('T')[0],
        points_source: 'seed',
        source_details: {}
      });

      // User premium status
      const isPremium = i % 2 === 0;
      await supabase.from('user_premium_status').upsert({
        user_id: uid,
        is_premium: isPremium,
        premium_plan: isPremium ? '1month' : null,
        activation_source: 'seed',
        source_details: {}
      });
    }

    console.log('✅ Seed concluído para múltiplos usuários!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error.message || error);
    process.exit(1);
  }
}

seedDatabase(); 