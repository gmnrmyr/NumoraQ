# NUMORAQ - Roadmap MVP Simplificado 🚀

## Filosofia: "Funciona Primeiro, Bonito Depois"

### Princípios Realistas
- **Bugs Críticos Primeiro**: Se não funciona, não vale nada
- **1 Ambiente Só**: Produção funcionando 100%
- **MVP Funcional**: Usuário paga → recebe acesso → fica feliz
- **Sem Over-Engineering**: Soluções simples que funcionam

---

## 🔴 FASE 1: CONSERTAR O QUE ESTÁ QUEBRADO
**Duração: 2-3 semanas**
**Objetivo**: Sistema de pagamento funcionando + bugs críticos resolvidos

### Sprint 1: Stripe & Pagamentos (Semana 1)
**Prioridade: CRÍTICA - PERDA DE RECEITA**

- [ ] **PRIMEIRO: Configurar MCP + Cursor Integration**
  - Seguir tutorial: https://youtu.be/6eUL1Wo9ZRc?t=1621
  - Conectar Cursor ao Supabase database
  - Testar se consegue ler tabelas e estrutura
  - **SEM ISSO = DESENVOLVIMENTO CEGO**

- [ ] **Corrigir Stripe Integration**
  - Debugar lógica de stacking de tempo premium
  - Webhook de confirmação funcionando
  - Teste: Comprar plano → receber acesso → tempo certo
  - Conversão automática: compras → pontos → tier

- [ ] **Corrigir Sistema de Códigos Admin**
  - Permitir uso múltiplo de códigos
  - Distribuição para outros usuários
  - Feedback visual: "Código aplicado com sucesso"

### Sprint 2: Admin & Segurança Básica (Semana 2)
**Prioridade: ALTA**

- [ ] **Unificar Painéis Admin**
  - 1 painel admin só (sem cms separado)
  - Melhorar CTRL+SHIFT+E existente
  - Interface de pontos funcionando para qualquer usuário
  - Feedback visual para todas as ações

- [ ] **Implementar Backups Básicos**
  - Ativar backup automático Supabase (já existe)
  - Processo de restore documentado
  - Sem ambiente de test por agora

### Sprint 3: RLS & Estabilidade (Semana 3)
**Prioridade: MÉDIA-ALTA**

- [ ] **Implementar RLS Básico**
  - Tabelas críticas: `user_premium_status`, `user_points`
  - Dados financeiros protegidos
  - Sem over-engineering

---

## 🟡 FASE 2: MELHORAR UX EXISTENTE
**Duração: 3-4 semanas**
**Objetivo**: Usuário consegue usar o app sem confusão

### Sprint 4: Dashboard Principal (Semana 4)
**Prioridade: ALTA**

- [ ] **Decidir Interface Principal**
  - Simple Dashboard como padrão
  - Advanced Dashboard como "Modo Pro"
  - Toggle simples entre os dois

- [ ] **Reativar Onboarding Simples**
  - Fluxo básico: nome → email → pronto
  - Tutorial opcional (não obrigatório)
  - Sem A/B testing complexo

### Sprint 5: Funcionalidades Core (Semana 5-6)
**Prioridade: MÉDIA-ALTA**

- [ ] **Melhorar Tracking Existente**
  - Adicionar assets manualmente funcionando bem
  - Categorias de expense funcionando
  - Projeções básicas funcionando

- [ ] **Gamificação Básica**
  - XP por check-in diário
  - Streaks simples
  - Tier system funcionando

### Sprint 6: Polish & Bugs (Semana 7)
**Prioridade: MÉDIA**

- [ ] **Corrigir Bugs Menores**
  - Interface responsiva
  - Botões que não funcionam
  - Textos em português/inglês consistentes

---

## 🔵 FASE 3: UMA FEATURE NOVA POR VEZ
**Duração: 4-6 semanas**
**Objetivo**: Adicionar valor sem quebrar o que funciona

### Sprint 7: Wallet Integration (Semana 8-9)
**Prioridade: MÉDIA-ALTA**

- [ ] **Conectar Wallet Básico**
  - Phantom + MetaMask
  - Mostrar saldo básico
  - Sem auto-sync complexo (manual refresh)

### Sprint 8: GPT Básico (Semana 10-11)
**Prioridade: MÉDIA**

- [ ] **GPT Advisory Simples**
  - 1 persona só (balanceada)
  - Rate limiting simples por tier
  - Sem análise contextual complexa

### Sprint 9: Polish & Preparação (Semana 12)
**Prioridade: BAIXA**

- [ ] **Preparar para Crescimento**
  - Monitoramento básico
  - Documentação essencial
  - Processo de deploy estável

---

## 📊 Métricas de Sucesso Realistas

### Fase 1 - Estabilização
- [ ] ✅ Sistema de pagamento: 0 bugs críticos
- [ ] ✅ Usuário compra plano → recebe acesso (100% success rate)
- [ ] ✅ Admin consegue dar pontos/códigos
- [ ] ✅ Backup automático funcionando

### Fase 2 - UX
- [ ] ✅ Onboarding completo sem travar
- [ ] ✅ Dashboard principal escolhido e funcionando
- [ ] ✅ Gamificação básica funcionando

### Fase 3 - Features
- [ ] ✅ Wallet conecta e mostra saldo
- [ ] ✅ GPT responde perguntas básicas
- [ ] ✅ Sistema estável para crescimento

---

## 🚨 O QUE NÃO VAMOS FAZER (POR AGORA)

### ❌ Infraestrutura Complexa
- Ambiente de test separado
- CMS domínio separado
- CI/CD avançado
- Múltiplas fontes de preço

### ❌ Features Avançadas
- Machine learning
- Portfolio history avançado
- NFT integration complexa
- Mobile app
- Open banking

### ❌ Over-Engineering
- Microservices
- Arquitetura complexa
- Otimizações prematuras
- Sharding de database

---

## 🎯 Próximos Passos Imediatos

### Esta Semana
1. **🔥 PRIMEIRO: Configurar MCP + Cursor** - sem isso não consegue debugar
2. **Testar sistema Stripe** - comprar plano você mesmo
3. **Documentar bugs** - lista exata do que não funciona
4. **Priorizar por impacto** - receita primeiro, UX depois

### Próxima Semana
1. **Corrigir 1 bug crítico por dia**
2. **Testar correções** - você mesmo como usuário
3. **Não adicionar features novas** - foco total em bugs

### Próximo Mês
1. **Sistema de pagamento 100% funcional**
2. **Admin tools funcionando**
3. **Usuários conseguindo usar sem suporte**

---

## 💡 Regras de Ouro

### ✅ FAZER
- Corrigir bugs antes de features novas
- Testar você mesmo como usuário
- Soluções simples que funcionam
- Documentar o mínimo necessário

### ❌ NÃO FAZER
- Adicionar complexidade desnecessária
- Ambientes múltiplos sem necessidade
- Features que ninguém pediu
- Otimizações prematuras

---

## 🚀 Visão de Longo Prazo

**Depois do MVP estável:**
- Aí sim considerar ambiente de test
- Aí sim migrar CMS
- Aí sim features avançadas
- Aí sim contratar devs

**Mas primeiro:** MVP que funciona, usuários pagando, bugs zerados.

---

## 📝 Notas para Consultoria

**Perguntas para o dev:**
- "🔥 Como configurar MCP + Cursor corretamente?"
- "Como corrigir o Stripe da forma mais simples?"
- "Preciso de ambiente de test para corrigir esses bugs?"
- "Qual a ordem mais eficiente para essas correções?"

**Evitar perguntas:**
- "Como implementar CI/CD avançado?"
- "Devo migrar para microservices?"
- "Como otimizar performance?"

**Foco:** Funcionalidade básica primeiro, arquitetura depois.

---

**Timeline total:** 12 semanas para MVP estável e funcional
**Depois:** Crescimento orgânico baseado em feedback real de usuários