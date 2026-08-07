# SafeWork Hub

Crie um protótipo de alta fidelidade para uma plataforma web responsiva de Gestão de Segurança do Trabalho, chamada SafeWork.

O objetivo da plataforma é auxiliar empresas no gerenciamento de Equipamentos de Proteção Individual (EPIs), promovendo a prevenção de acidentes e facilitando a comunicação entre colaboradores e gestores.

O design deve ser moderno, minimalista e corporativo, utilizando uma paleta em tons de azul, branco e cinza, transmitindo confiança e segurança. Utilize ícones simples e uma interface intuitiva.

Fluxo de acesso

Login

Campos:

 CPF/Matrícula

 Senha

 Botão "Entrar"

 Link "Primeiro acesso / Esqueci minha senha"

Primeiro acesso / Esqueci minha senha

Fluxo:

 Informar CPF, matrícula ou e-mail corporativo.

 Receber código de verificação.

 Criar nova senha.

 Mensagem de sucesso.

 Retornar para o login.

Área do Colaborador

Tela "Meus EPIs"

Exibir:

 Nome do colaborador

 Cargo

 Status "Em dia"

Lista dos EPIs obrigatórios:

 Capacete

 Óculos de proteção

 Luvas

 Botina

Cada EPI deve possuir um indicador de obrigatório.

Ao final da tela:

Checkbox

"Confirmo que estou utilizando todos os EPIs obrigatórios."

Botão

"Confirmar"

Botões inferiores:

 Registrar observação

 Histórico

Tela "Registrar Observação"

Campos:

Selecionar EPI

Opções:

 Danificado

 Desgastado

 Desconfortável

 Outro

Campo de texto para descrição.

Botões:

Cancelar

Enviar

Área do Gestor

Criar uma dashboard inicial contendo quatro cards principais.

Card 1

Cadastro de Colaboradores

Descrição:

Cadastrar, editar e remover colaboradores.

Card 2

Cadastro de EPIs

Descrição:

Cadastrar EPIs, associar funções e cadastrar Certificados de Aprovação (CA).

Card 3

Monitoramento de Certificados de Aprovação

Descrição:

Controlar validade dos CAs e histórico de entrega dos EPIs.

Card 4

Observações dos EPIs

Descrição:

Consultar ocorrências registradas pelos colaboradores.

Tela Cadastro de Colaboradores

Campos:

Nome

CPF

Matrícula

Cargo

Setor

E-mail corporativo

Perfil de acesso:

 Colaborador

 Gestor

 Administrador

Botão:

Cadastrar

Tela Cadastro de EPIs

Campos:

Nome do EPI

Categoria

Número do CA

Função

Validade do CA

Botão:

Salvar

Tela Monitoramento dos Certificados de Aprovação

A tela deve possuir aparência de dashboard.

Na parte superior:

Cards com indicadores:

🔴 CAs vencidos

🟡 CAs próximos do vencimento

🟢 CAs vigentes

Abaixo:

Campo de pesquisa por:

 colaborador

 matrícula

 EPI

Cada registro deve exibir:

Nome do colaborador

Matrícula

Cargo

Nome do EPI

Número do CA

Data de entrega do EPI

Validade do CA

Status:

Verde = Vigente

Amarelo = Próximo do vencimento

Vermelho = Vencido

Adicionar um botão para:

"Registrar nova entrega"

Tela Observações dos EPIs

A tela deve funcionar como um painel de chamados.

Campo de pesquisa.

Filtros:

 Todos

 Pendentes

 Em análise

 Resolvidos

Cada observação deve mostrar:

Nome do colaborador

Matrícula

EPI

Descrição da observação

Data

Status

Botão:

Visualizar

Tela Detalhes da Observação

Exibir:

Nome do colaborador

Cargo

Matrícula

EPI

Descrição completa

Data do registro

Status:

 Pendente

 Em análise

 Resolvido

Campo:

"Ação tomada"

Botão:

Salvar alterações

Requisitos visuais

 Interface moderna inspirada em sistemas SaaS.

 Sidebar lateral para navegação na área do gestor.

 Header com nome do usuário e foto de perfil.

 Ícones do Lucide Icons.

 Bordas arredondadas.

 Cards com leve sombra.

 Layout totalmente responsivo.

 Utilizar componentes semelhantes aos do Shadcn UI.

 Tipografia limpa e profissional.

 Foco em usabilidade para ambientes corporativos.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://safework-protokoll.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ebb8d484-24a9-4ba2-b740-231ce918487c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
