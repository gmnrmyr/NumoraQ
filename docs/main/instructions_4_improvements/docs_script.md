# Automação de Documentação

## Objetivo
Automatizar o processo de conversão de documentos Word (Google Docs) para Markdown com tradução automática PT-BR → EN, eliminando o trabalho manual repetitivo.

## Problema Atual
- Edição manual do documento Word
- Tradução manual para português (documento separado)
- Conversão manual para Markdown
- Processo exaustivo e propenso a erros

## Soluções Propostas

### Opção 1: Google Docs API + Translate API (Recomendada)

**Vantagens:**
- Mantém formatação original
- Funciona diretamente da nuvem
- Preserva estilos (negrito, itálico, títulos)
- Pode ser executado automaticamente

**Setup:**

1. **Instalação de dependências:**
   ```bash
   pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib googletrans==3.1.0a0
   ```

2. **Configuração Google API:**
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um novo projeto
   - Ative a Google Docs API
   - Crie credenciais (OAuth 2.0)
   - Baixe como `credentials.json`

3. **Obter ID do documento:**
   - URL do Google Doc: `https://docs.google.com/document/d/SEU_ID_AQUI/edit`
   - Copie o ID entre `/d/` e `/edit`

4. **Configuração do script:**
   - Coloque o script `docs_automation.py` na raiz do projeto
   - Coloque `credentials.json` na mesma pasta
   - Edite as variáveis no script:
     ```python
     DOCS_FOLDER = './docs'
     GOOGLE_DOC_ID = 'SEU_DOCUMENT_ID_AQUI'
     ```

5. **Execução:**
   ```bash
   python docs_automation.py
   ```

### Opção 2: GitHub Actions (CI/CD Automatizado)

**Vantagens:**
- Totalmente automatizado
- Executa na nuvem
- Pode ser agendado
- Integrado com Git

**Setup:**

1. **Configurar secrets no GitHub:**
   - `GOOGLE_CREDENTIALS`: Conteúdo do arquivo `credentials.json`
   - `GOOGLE_DOC_ID`: ID do documento fonte

2. **Criar workflow:**
   - Salve o arquivo YAML em `.github/workflows/update-docs.yml`

3. **Execução:**
   - Automática: a cada push na main
   - Manual: através da aba Actions
   - Agendada: a cada 6 horas (configurável)

### Opção 3: Pandoc (Mais Simples)

**Vantagens:**
- Configuração mais simples
- Funciona offline
- Não requer API keys
- Boa para documentos locais

**Setup:**

1. **Instalação:**
   ```bash
   # Ubuntu/Debian
   sudo apt install pandoc
   
   # macOS
   brew install pandoc
   
   # Windows
   # Baixar do site oficial: https://pandoc.org/installing.html
   ```

2. **Dependências Python:**
   ```bash
   pip install googletrans==3.1.0a0
   ```

3. **Configuração:**
   - Salve o script como `converter.sh`
   - Torne executável: `chmod +x converter.sh`
   - Edite as variáveis no script:
     ```bash
     WORD_FILE="documento_fonte.docx"
     OUTPUT_EN="README.md"
     OUTPUT_PT="README_pt.md"
     ```

4. **Execução:**
   ```bash
   ./converter.sh --commit  # Para fazer commit automático
   ```

## Estrutura de Arquivos Sugerida

```
projeto/
├── docs/
│   ├── README.md (inglês)
│   ├── README_pt.md (português)
│   └── API_DOCS.md
├── scripts/
│   ├── docs_automation.py
│   └── converter.sh
├── .github/
│   └── workflows/
│       └── update-docs.yml
├── credentials.json (não commitar)
└── instructions4nextsteps/
    └── docs_automation.md
```

## Fluxo de Trabalho Recomendado

1. **Documento fonte:** Google Docs (source of truth)
2. **Edição:** Fazer alterações apenas no Google Docs
3. **Automação:** Script busca alterações e atualiza repositório
4. **Resultado:** Documentação sempre sincronizada em PT e EN

## Configurações Adicionais

### Ignorar arquivos no Git
Adicione ao `.gitignore`:
```
credentials.json
token.pickle
__pycache__/
*.pyc
```

### Configurar múltiplos documentos
No script principal, configure um array:
```python
docs_config = [
    {
        'doc_id': 'ID_DO_README',
        'output_en': 'README.md',
        'output_pt': 'README_pt.md'
    },
    {
        'doc_id': 'ID_DA_API_DOC',
        'output_en': 'API_DOCS.md',
        'output_pt': 'API_DOCS_pt.md'
    }
]
```

## Próximos Passos

1. **Escolher uma das opções** baseada nas necessidades do projeto
2. **Configurar ambiente** seguindo o setup da opção escolhida
3. **Testar** com um documento pequeno primeiro
4. **Configurar automação** (se escolher opção 2)
5. **Documentar o processo** para outros membros da equipe

## Troubleshooting

### Problemas comuns:

- **Erro de autenticação Google:** Verificar se as credenciais estão corretas
- **Limite de API:** Google Translate tem limite diário
- **Formatação perdida:** Verificar se o documento tem estrutura consistente
- **Encoding:** Garantir que arquivos estejam em UTF-8

### Alternativas de tradução:

- **DeepL API:** Melhor qualidade, mas paga
- **Azure Translator:** Integração com Microsoft
- **Manual:** Para documentos críticos

## Manutenção

- **Verificar logs** regularmente
- **Atualizar dependências** periodicamente
- **Backup** dos documentos fonte
- **Testar** após mudanças no Google Docs

---

*Última atualização: [Data atual]*
*Responsável: [Seu nome]*