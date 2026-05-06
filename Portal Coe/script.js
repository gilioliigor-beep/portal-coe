// ── EMAILJS CONFIG ────────────────────────────────────────────────────────────
try { emailjs.init('QpQ7cDG5C3v13sXbk'); } catch(e) { console.warn('EmailJS não carregado:', e); }

const EMAILJS_SERVICE_ID           = 'service_rp0tj4j';
const EMAILJS_TEMPLATE_SOLICITANTE = 'template_pj10o6s';
const EMAILJS_TEMPLATE_RESPONSAVEL = 'template_s4ceuus';
const EMAILJS_TEMPLATE_LEMBRETE    = 'template_lembrete'; // ← crie este template no EmailJS
const EMAILJS_TEMPLATE_CANCELAMENTO = 'template_cancelamento';

// Mapeamento de tipos → responsável (KPIs)
const responsaveisPorTipo = {
  'KPIs': { nome: 'Igor Gilioli', email: 'igor_gilioli2@bracell.com' },
};

// Mapeamento de sistemas → responsável (SISTEMAS)
const responsaveisPorSistema = {
  'SAP':   { nome: 'Igor Renan',    email: 'igor.renan@bracell.com'    },
  'IBID':  { nome: 'Vinicius Bruno', email: 'vinicius.bruno@bracell.com' },
  'ARIBA': { nome: 'Vinicius Bruno', email: 'vinicius.bruno@bracell.com' },
  'Outro': { nome: 'Vinicius Bruno', email: 'vinicius.bruno@bracell.com' },
};

// Fallback caso sistema não mapeado
const responsavelDefault = { nome: 'Vinicius Bruno', email: 'vinicius.bruno@bracell.com' };

const usuarios = {
  'solicitante': { nome: 'João Silva', email: 'joao.silva@bracell.com' },
  'coe':         { nome: 'Igor Gilioli',   email: 'igor_gilioli2@bracell.com'   },
};

// ── ESTADO DA APLICAÇÃO ───────────────────────────────────────────────────────
let currentRole = 'solicitante';
let currentUser = { name: 'João Silva', initials: 'JS' };
let wizardStep  = 0;
let newTicketData = {};

const tickets = [
  { id:'COE-2025-001', title:'Erro no SAP ao gerar relatório de custo', type:'SISTEMAS', system:'SAP', area:'Financeiro', bu:'BSP', priority:'Alta', status:'andamento', sla:'ok', responsible:'Igor Renan', owner:'João Silva', created:'02/05/2025 09:14', description:'Ao tentar gerar o relatório de custo pelo módulo CO do SAP, o sistema apresenta erro "Dump ABAP" e encerra o processo.', flowStep:4,
    timeline:[
      {actor:'Sistema',  icon:'🤖',color:'blue',  time:'02/05 09:14', text:'Chamado criado automaticamente. Protocolo COE-2025-001 gerado.'},
      {actor:'Sistema',  icon:'⚙️',color:'blue',  time:'02/05 09:14', text:'Classificado como SISTEMAS / SAP. Prioridade: Alta. SLA: 1 dia útil.'},
      {actor:'Sistema',  icon:'📨',color:'gray',  time:'02/05 09:14', text:'E-mail de confirmação enviado ao solicitante João Silva.'},
      {actor:'Igor Gilioli', icon:'🎧',color:'orange',time:'02/05 10:22', text:'Chamado recebido na fila. Iniciando análise.'},
      {actor:'Igor Gilioli', icon:'🔄',color:'orange',time:'02/05 10:45', text:'Atendimento iniciado. Verificando parametrização do relatório no SAP.', status:'Em andamento'},
    ]},
  { id:'COE-2025-002', title:'KPI de OTD fora do padrão esperado', type:'KPIs', system:'Control Tower › Procurement SLA', area:'Logística', bu:'BSPF', priority:'Normal', status:'aguardando', sla:'warn', responsible:'Igor Gilioli', owner:'Maria Santos', created:'30/04/2025 14:30', description:'O indicador OTD do mês de Abril está divergindo do cálculo manual realizado pela área de Logística.', flowStep:3,
    timeline:[
      {actor:'Sistema',     icon:'🤖',color:'blue',  time:'30/04 14:30', text:'Chamado criado. Protocolo COE-2025-002.'},
      {actor:'Sistema',     icon:'⚙️',color:'blue',  time:'30/04 14:30', text:'Classificado como KPI. SLA: 3 dias úteis.'},
      {actor:'Carlos Mota', icon:'🎧',color:'orange',time:'30/04 15:10', text:'Análise iniciada.'},
      {actor:'Carlos Mota', icon:'❓',color:'yellow',time:'30/04 16:00', text:'Informações solicitadas: enviar planilha com cálculo manual do OTD de Abril.', status:'Aguardando informações'},
    ]},
  { id:'COE-2025-003', title:'Acesso bloqueado no ARIBA', type:'SISTEMAS', system:'ARIBA', area:'Compras', bu:'BSC', priority:'Crítica', status:'resolvido', sla:'ok', responsible:'Vinicius Bruno', owner:'Pedro Rocha', created:'28/04/2025 08:00', description:'Usuário sem acesso ao módulo de compras no ARIBA após troca de senha.', flowStep:5,
    timeline:[
      {actor:'Sistema',  icon:'🤖',color:'blue',  time:'28/04 08:00', text:'Chamado criado. Protocolo COE-2025-003.'},
      {actor:'Sistema',  icon:'⚙️',color:'blue',  time:'28/04 08:00', text:'Prioridade Crítica. SLA: 4 horas.'},
      {actor:'Igor Gilioli', icon:'🎧',color:'orange',time:'28/04 08:15', text:'Atendimento iniciado imediatamente.'},
      {actor:'Igor Gilioli', icon:'✅',color:'green', time:'28/04 09:45', text:'Acesso reativado no ARIBA. Perfil restaurado.', status:'Resolvido'},
    ]},
  { id:'COE-2025-004', title:'Dashboard de NPS não atualiza', type:'KPIs', system:'Stock Management › Panel Stockout', area:'Comercial', bu:'BPN', priority:'Normal', status:'aberto', sla:'ok', responsible:'Igor Gilioli', owner:'João Silva', created:'04/05/2025 08:45', description:'O dashboard de NPS no Power BI não atualiza desde ontem às 18h.', flowStep:1,
    timeline:[
      {actor:'Sistema', icon:'🤖',color:'blue',time:'04/05 08:45', text:'Chamado criado. Protocolo COE-2025-004.'},
      {actor:'Sistema', icon:'⚙️',color:'blue',time:'04/05 08:45', text:'Classificado como KPI. SLA: 3 dias úteis. Aguardando atribuição.'},
    ]},
];

const notifs = [
  {icon:'📨', title:'Chamado COE-2025-004 aberto',         text:'Seu chamado foi recebido e está na fila.',          time:'Há 10 minutos', read:false},
  {icon:'🔄', title:'Atualização – COE-2025-001',          text:'Igor Gilioli iniciou o atendimento.',                   time:'Há 2 horas',    read:true},
  {icon:'❓', title:'Informações solicitadas – COE-2025-002', text:'Carlos Mota solicitou a planilha de OTD.',        time:'Há 1 dia',      read:true},
];

const flowStepLabels = [
  {label:'Chamado Aberto',        icon:'📝'},
  {label:'Classificação e SLA',   icon:'⚙️'},
  {label:'Na fila do responsável',icon:'📥'},
  {label:'Em análise',            icon:'🔍'},
  {label:'Em atendimento',        icon:'🔧'},
  {label:'Resolvido',             icon:'✅'},
  {label:'Fechado',               icon:'🔒'},
];

// ── INDICADORES KPIs ──────────────────────────────────────────────────────────
const indicadoresKPI = {
  'Control Tower': [
    'Backlog',
    'Procurement SLA',
    'Purchasing Automation',
    'Spend',
    'Contracts Panel',
  ],
  'Procurement Efficiency': [
    'Fuga de contrato visão RC',
    'Fuga de contrato visão PC',
    'PMP negociado por Suprimentos',
    'Range de análise de pedido de compras',
    'Req 2 Pay',
  ],
  'Stock Management': [
    'Stock Planning',
    'Stock Value MRO',
    'Panel Stockout',
  ],
};

// ── CHART.JS HELPERS ─────────────────────────────────────────────────────────
const AREA_COLORS = {
  'Financeiro':'#0E49A4','Logística':'#ACDC64','Comercial':'#ea580c',
  'TI':'#7c3aed','RH':'#0891b2','Compras':'#16a34a','Não informada':'#94a394',
};
const RESP_COLORS = ['#0E49A4','#ACDC64','#ea580c','#7c3aed','#0891b2','#ca8a04'];
const CJ_PAL     = ['#0E49A4','#ACDC64','#ea580c','#dc2626','#ca8a04','#7c3aed','#0891b2','#16a34a','#94a394'];

// Instâncias globais dos gráficos
const CI = {};
function killChart(k)    { if(CI[k]){ CI[k].destroy(); delete CI[k]; } }
function killCharts(...ks){ ks.forEach(killChart); }

function cjDefaults() {
  if (typeof Chart === 'undefined') return;
  Chart.defaults.font.family = "'Sora','Arial',sans-serif";
  Chart.defaults.font.size   = 11;
  Chart.defaults.color       = '#64748b';
}

function mkDoughnut(id, labels, data, colors) {
  killChart(id);
  const ctx = document.getElementById(id);
  if (!ctx || typeof Chart === 'undefined') return;
  const total = data.reduce((a,b)=>a+b,0);
  CI[id] = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors||CJ_PAL, borderWidth:2, borderColor:'#fff', hoverOffset:6 }] },
    options: {
      responsive: true, cutout: '62%',
      plugins: {
        legend: { position:'right', labels:{ boxWidth:10, padding:10, font:{size:11} } },
        tooltip: { callbacks: { label: c=>' '+c.label+': '+c.raw+' ('+((c.raw/total)*100).toFixed(0)+'%)' } }
      }
    }
  });
}

function mkBar(id, labels, data, colors, horizontal) {
  killChart(id);
  const ctx = document.getElementById(id);
  if (!ctx || typeof Chart === 'undefined') return;
  CI[id] = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ data, backgroundColor: colors||labels.map((_,i)=>CJ_PAL[i%CJ_PAL.length]), borderRadius:5, borderSkipped:false }] },
    options: {
      indexAxis: horizontal ? 'y' : 'x',
      responsive: true,
      plugins: { legend:{ display:false } },
      scales: {
        x: { grid:{ display:!horizontal }, ticks:{ font:{size:11} } },
        y: { grid:{ display:!!horizontal }, ticks:{ font:{size:11} }, beginAtZero:true }
      }
    }
  });
}

function mkStackedBar(id, labels, datasets) {
  killChart(id);
  const ctx = document.getElementById(id);
  if (!ctx || typeof Chart === 'undefined') return;
  CI[id] = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: { legend:{ position:'top', labels:{ boxWidth:10, font:{size:11} } } },
      scales: {
        x: { stacked:true, ticks:{font:{size:11}} },
        y: { stacked:true, ticks:{stepSize:1, font:{size:11}}, beginAtZero:true }
      }
    }
  });
}
// ─────────────────────────────────────────────────────────────────────────────

// ── HELPERS DE DISPLAY ───────────────────────────────────────────────────────
// Retorna só o último nível da cadeia KPI (ex: "Control Tower › Backlog" → "Backlog")
function shortSystem(s) {
  if (!s || s === '—') return '—';
  const parts = s.split('›');
  return parts[parts.length - 1].trim();
}
// ─────────────────────────────────────────────────────────────────────────────

// ── TEMPLATE REGRAS DE NEGÓCIO (base64 embutido) ──────────────────────────────
const TEMPLATE_REGRAS_B64 = 'UEsDBAoAAAAAADW8pVwAAAAAAAAAAAAAAAAFAAAAd29yZC9QSwMECgAAAAAANbylXAAAAAAAAAAAAAAAAAsAAAB3b3JkL19yZWxzL1BLAwQKAAAACAA1vKVcyQDaMAcBAAChBAAAHAAAAHdvcmQvX3JlbHMvZG9jdW1lbnQueG1sLnJlbHOtlM1uAiEUhV9lwr7DjLXWNKKbxsRtM30AhDs/cfgJXJv69qXRUWwM6YLlPcA5X25OWG2+1Vh8gfOD0YzUZUUK0MLIQXeMfDbbpyXZrFcfMHIMN3w/WF+EJ9oz0iPaN0q96EFxXxoLOpy0ximOYXQdtVwceAd0VlUL6mIPcu9Z7CQjbidrUjQnC//xNm07CHg34qhA44MI6vE0gg+O3HWAjJznMvgQ+jh+ljNeH9UeXNjjjeAqpSCec0K0xqA2GK/hKqUg5jkhQMs/DJOSQnjJ2gVADHuP23BRUgiLnAjCqN+jCGFSUgivORF64BLcDeA816n8Zd42amz4foS4jRdpgqB3f836B1BLAwQKAAAACAA1vKVcys8fXYILAADE6QAAEQAAAHdvcmQvZG9jdW1lbnQueG1s7V1Lb+PIEf4rDR2CZLFjipIsy854FhpJnijYsQXbO8m1TbakniXZnG5Stue0iwTIMQGyAXId5LDYw54GizyO0T+ZP5C/kGo+RMuSbUryzFJSGYb4ELvYj6++KharW0+/uHIdMmJSceEdlsydcokwzxI29waHpa/Oj540SkQF1LOpIzx2WLpmqvTFs6eXB7awQpd5AXGtg+7AE5JeOPD9pVkjl+YuufTNWomAcE8dXPrWYWkYBP6BYShryFyqdlxuSaFEP9ixhGuIfp9bzLgU0jYqZbMc7flSWEwpqEmLeiOqUnHurDThMw++7Avp0gAO5cBwqfw69J+AdJ8G/II7PLgG2eV6KkYclkLpHSQinkwqpIscxBVKNmkJmee+cZF20jvRHQ3JHKiD8NSQ+1kzlpUGXw5TIaP7GjFynWwIzNpqY9CW9BI2mcA81bfjQq4T1/x+iWY5x4hoEZMSeaowfc+0Ji7lXnbjpbrmRueau4sJqNwW4A9WG5wXUoR+Jo2vJq3rfT2RpXV+AVnJIN9smlqtMmdD6k800LrKJyzBnZZXM6whlQG7ymSYCwvZNfaNxqygyhKCoIEVc1ZUdWFRdUPXakZQTizfEgS1mpGUE9S3Jc1pXH05SZVZSXvLSarOSmosJ2kGTkAkXy8himc6Rt2qvbCEPcMVNnOqGRmadYvlVI9U1xqJshpW1h4th+esTyqnPpHDb9ZnucrcEKDswB4uJKWScrOhy9KADqka3pS4GJ2Bvqbirl3oI+34XAj7Wm/96KMn9Ub51IKBIZcHtB8w8BPq4EfBpQwsEdyxWi6XjGdPjcn18UeyfyS8QOmiyuLA3E3JqaNLW+rGAaMqaCpOb5waNj01ud6IqhZ/tlS0tYQjJFw3os5hqdyp7Tdr8WXqbXq2Vk7PtNT0OWNSv0D3XtRCaIkvmWJyxErPjsDGhs74neSC2IycsoGkSu8ds8H4vcWFFhHEguKmL9hpn6bLpjqptre7W9+/3UmVymwnxece7KQz4XCLB3T8/fgfUTcdi5EgXc/mFrXhvh+++Y60TjrkLPQl1x6eUA92m//cljEOg0C4aYW0qXRY1Ae6RdDGVrtVr+kT6i10bbQTV89MOzYRNDMOYMZvDkRlGr25hrIxJcEsKv5XGNqWcAUJA3iueEslYSpgJH0kmg/94MJJNoncC+d3cM/g2ge59hXVTQKPdr9aT5QSLngO5APPZtGR8O8caxoGIh3ppI0O6weLXP8AmuaUkHwwXOgWHIbLZr9ZvMir/EWM6W4zpvv7heS23h3AtiWcuMNrjaS/p842Go1yJjAtGMSSrPgzkWvNG8aJ1MCaP4gePE7faMlR9Je2pTw7iHmunx7EPCWmBvHhAsat9qihDV/3uQOl261O46hRSoVZDqMy7YKXVGbNv91VjenW3v7a3L3dursEpI25Q4IxqYmRjd5NFnttTSoPWszkxnGWOYeYjAzPD6M61YoNh3XhAfuRsHgDZHMcw0pOxxC8HUrA2xGXniOoDW6PNo5Uvgk5OD+eiDyenpABdQgVhF5ILknoEniwcsEr0m7SL96EIvj1tLMUn9u5G8LGhJ+RpZGl15elK8jSyNIfm6V7kjEPGJcEwobndvhXDJ5Sf2KKWNAbgrjjd1fcjdjYZkDVQ6Z2SIu6voiv+OVnvyJKP9UK4O8BDcbvJRcK6RnpecPpuYr0jPT8sen5jDojBiyces2M9BO3OvQjpxrc6MRf/px4lABD+1RzddNjV3lo2JgEpJaILSY6RX6e2KJ5S0SjXFCOqc8Z/nq+B/UdMjWCG9GobrtzfN496raa4z+N/3BC2ieke9yGw/bJ6eIvC8zaFApqnwYEPP6c11/12l6t8fx2f5mN2f6Kzz3YXx/++O///evPhExcNfC8bFD46C0Lt8G68j48GsfvFnwqKZHQBMmoTnaBC3VAOiWJeYRwiSHpgoakgRXnxaSr9bmharM+9+pKebUIdlaJu9yUmba3y+29TjVtvZlj2OeWeGDg55a5f+jnFLnPC8/s24JeuFle1auZSMjt1kAlmw4feHPd7nXw0BNf8vGcp+gpdVUvPVM2hD/Cf53g3/Wi/MfIL1hVCzLbglqAWrBOWvAoRiD1oRD+CP/1gn8+I7BETH6LHwvWKDifXyEKE1haHuvHwo1iHVle5Wfo/S+N8iy0X3iU34flR0EWus9IlhtGluNvJaMkTUyHhq5OllvsJSNZ5iFLdDOROdefOR+VM9HBXAd8o4NZXBghTRaTJts0iDKRpuY+oouJdIkuZmEwhdxZTO7sSREIfQs9RwpdTORMdDGRJpEmZ2mSvhWkDYevqY2+JfLkJ/Et9QanTBR1dkFlE6dMnDz/bee8++qEdMAhPD7v/P78ZA5McaZEMlMCLIIl2UhPk/Kl8MfvFQ/0QgSETzIDGHkTUofYzOIqWZPJSxasIszRc11HjFBfcCpxzsRazZmozZ0FUd+vrzYLora13i9mAK51BmBT+cyauxbZQt5xqkCoAKgA66UAkTfAP0IG7PaaBAyIFDMgcnLxmgV6nYCe5J7FffBwV85Q2GLix7DIvWGRzbwVGgQ0CBtjEHpSXDjMpeRNyAicFc6IoUFAg4AsvY3wRZYuJku30yi0Zuko6IwcjRyNHL2N8EWOLiZH98b/uXC4JZ40nREG05GeMdVk61NNqpuYatLuHHWPu7gyZ56+yvJNooXRCSX98Xv9c2iUML1KpyV5MP5Br4eu80us8TvHCh2xQ87Ya52b4lKuCNOvZ8c/9sG0EF8oNf5xxBxMOcGUk212gvGN+1q/ce847K7fv0M3GTVgCzQg9gjoA1qAkRGMjBTliWF5rB+lPq9BWomLi1knGCHZgAA2xsqLrSloEYppEY5Dl0k9zQatAFoBpOZthC9SczGpuc084XIPyRnJGcl5W+GL5FxMcv7KS36vj5GXzIZ9jKMgSSNzFghTyJzFZM4z/Suotpj69Q+kzoVgXjgAfyKYTgGztre7W99/RGB++PtfCHlJOdxi/ANxmTOEvfgv/gqex+74Ch7VAhmtTBO6lPQpv7pnWkBC43GuyaTLMGGwULl1tU1MGOyddl52z86aZ6RDTjsvTmGn3SHHnRfjv7a6uEzVPWmDX3IVMBIImyoC/5YAyzX+fvwTU58TcDdA+RVhhF1ZLD4bTQ/SC1O5BCTp63Vum4x+CtwTWX7h3D7H5EFMHtxc5wVTpzYmdeqcr/57rVvmuiP6Nwb9uFjVo2sExmyKGbPpSeZypcDzxSg3RrnX/1XkZt4KTQ6anI0xOUdJVIX6TvSOQKHhQcOz9hSN1qDYmoLWoJjWoJNF1g0CB06o9AHaBLQJa0/UaBOKrSloE4ppE3pMcmFza5KIaQkZ4JK5aBJwva+tT9/Z3cT0nVfNL7vtZrzeV4c0e6cnr/TR3zpnc70KTCMpZhpJ1Ux5Kc9pc7d+32njcrmkk+xuW2fm8LX7Wr92Pxbuyk4eoh/Rv57ob1E5EMQg428lW3np+cy2oBqgGqyTGjQVAIAGoUQdQB3YUh1o0+DhWUb4TIChrwVxVYhXFIhYROwmInaL3Q1ELCIWEYuI/bSJC+giIHyLAl9ELCJ2ExGLLgIiFhGLiEXEruDU6s3SCWXNVrtV//QJZbcK/UxB9xzLgplzsq7MfFlXrZMOOQt9yaNfCFLkv/8kzyVc4zh6d2pYP1oL71ny6NHb2xZWGDVVr1rU5zbzLKgH+fDNdyRUgnA9rN68FQ/gbswKYtlDRoF7TlmfSSjPMmVnfRo6QYnIA24flmTX3osr6g/O3iYsYO6XIwAPdZUb1SjzWkgOVYJqChlIyoO0ENAEifhKl6tGChCxS3YYK052rNkrO4rreVjaK0e36QsR3DgchEF0WE5vdxy659CO6MgWlk670iK5x3o8sKDC1UlWVtoXhq6CfR3t2EnXPvs/UEsDBAoAAAAIADW8pVwDgtopFAMAADERAAAPAAAAd29yZC9zdHlsZXMueG1s5VdbT9swFP4rUd4hlyYFKgrqChVI01Yx0J5dx2ksEjuzHUr362cnTlpyoYUGJm1Pjc85+fx95xK755fPSWw8IcYxJWPTObZNAxFIA0yWY/PhfnZ0ahpcABKAmBI0NteIm5cX56sRF+sYcSOBo9sloQwsYuldOZ6xcnzTkKiEjxI4NiMh0pFlcRihBPBjmiIinSFlCRByyZZWAthjlh5BmqRA4AWOsVhbrm0PSxi2DwoNQwzRFYVZgojI37cYiiUiJTzCKS/RVvugrSgLUkYh4lxmIokLvARgUsE4XgMowZBRTkNxLMVoRjmUfN2x86ck3gD4bwNwSwCV/oDCKxSCLBZcLdmc6aVe5T8zSgQ3ViPAIcZjc8IwkNuvRpBvLRDgYsIx2DJFE8KreCuv9m9pfgLx2HTd0jLlL22W3tiq00mrVRFV4553koQS61S2UAoYWDKQRopI7roNxuY9FjHKhROQoHLfwprTWQCOgu+k9HxTtdTcCXoWbfZfs7zg1lbGNjL9YVNmYduSmdPbV8INAmqqnIYK7TCcPpVAGlNW1ef6xPvi1ys5aKnkoF7J90h0OyW6nyzRbami20cVB50SBx8m0Zl5VyenDYlei0SvB4lep0SvT4k4X+Apt16p6YFS/E4p/ic05IHkh53kh5/Qau8l/0MwSpYN6trcI+9FgZX3z3vJfsVczCtPnbPyGhv3Lu4bjt00YCThoEDsZcGlj8WYPDYrXnnadteHaUVRHftFYIbnDFMmL1Rl7NmZ9pAIB+hnhMiDxOpsBNsfDqb6YMpKo7oSFefu7oS3K51RKggV6A6FiMn7ZvNoD3WEwaqQvqRzlOAbHASI7MiEvBaLSYyX1W48k2XgkOFUHDIbpfp72eXdwoXy7mo21ROlfRt2KtN+eB5SfStKAVTfG3mRDGUlZVcoOXJrpI6aanGXqb8AIBNUJ0e/3rhbuXbLkWX30U+V9HpWywBDRRib7OzdTl2J7q3ZPjI91yR4fdpQEfAvDpvW3jprpew3j9oW6H82aXXl9ZRqfy9ztl26vztm5RO/+ANQSwMECgAAAAAANbylXAAAAAAAAAAAAAAAAAkAAABkb2NQcm9wcy9QSwMECgAAAAgANbylXKuARV47AQAAgwIAABEAAABkb2NQcm9wcy9jb3JlLnhtbJWSXWvCMBSG/0rJfZt+zCKhjbANryYMpmzsLiRHDWvSkGRW//3Sql1l3gx6k75PH95z0mpxVE10AOtkq2uUJSmKQPNWSL2r0Wa9jOcocp5pwZpWQ41O4NCCVtwQ3lp4ta0B6yW4KHi0I9zUaO+9IRg7vgfFXBIIHcJtaxXz4Wh32DD+xXaA8zQtsQLPBPMM98LYjEZ0UQo+Ks23bQaB4BgaUKC9w1mS4V/Wg1Xu7gdDMiGV9CcDd9FrONJHJ0ew67qkKwY09M/wx+rlbRg1lrrfFAdEK8EJt8B8a+lGx5opEBWevOwX2DDnV2HTWwni8TTh/mY9buEg+1ui2UCMx+oy9NkNIgplyXm0a/JePD2vl4jmaV7G6Sw867wgRUEeiqSc5Z99tRvHr1RdSvzXWs4n1quEDs1vfxz6A1BLAwQKAAAACAA1vKVcHinpWnACAABkDAAAEgAAAHdvcmQvbnVtYmVyaW5nLnhtbM2XS27bMBCGryJw71By5AeEKEHbIIWLvoCmB6Al2ibCF0hKis/QRXfttmfrSTqULPlRILBlBPDGtDgz3/wUOUPo5u5Z8KCkxjIlUxRdhSigMlM5k8sUfX98GExRYB2ROeFK0hStqUV3tzdVIgsxpwbcApEls6VUhsw5OFRRHFTRKKh0FKMA6NImlc5StHJOJxjbbEUFsVeCZUZZtXBXmRJYLRYso7hSJsfDMArrf9qojFoLOd4RWRLb4sT/NKWpBONCGUEcPJolFsQ8FXoAdE0cmzPO3BrY4bjFqBQVRiYbxKAT5EOSRtBmaCPMMXmbkHuVFYJKV2fEhnLQoKRdMb1dRl8aGFctpHxpEaXg2y2I4vP24N6QCoYt8Bj5eRMkeKP8ZWIUHrEjHtFFHCNhP2erRBAmt4l7vZqdlxuNTgMMDwF6ed7mvDeq0FsaO482k08dyxf9CazNJu8uzZ4n5tuKaIp8yyFz6wzJ3OdCBHtPsxxaF/JtJzEUupXxk013erNw1Lw1lDylKKwpouCOfaQl5Y9rTQFUEg4K13PD8k/exr0NYe/LSw4ODAYfXSdwUIZQyyX1Kb1Pna/FRE0cNMcH0U3OC86p64iP9Lkz/f39s5v/kLWznC427vqr8QOTOdj8dIomQ68kWRG5rJv09Tj0vnjjjGvWofjodcT/OFV8FMc91A9fRf2vP6eqH0bjHuqvL+TgDKfTHurjCzk5ILaH+tGFnJz4uk/Vji/k5IzCPlU7uRT1kz5VO70Q9eP4uKrFezfiRlVQ/zbX48ENOssPFgGUL/AhALcg3bnzuiXv2LZReC+sfpY+Od75Prj9B1BLAwQKAAAAAAA1vKVcAAAAAAAAAAAAAAAABgAAAF9yZWxzL1BLAwQKAAAACAA1vKVcH6OSluYAAADOAgAACwAAAF9yZWxzLy5yZWxzrZLPSgMxEIdfJcy9O9tWRKRpL1LoTaQ+QEhmd4PNHyZTrW9vKIpW6tpDj5n85ss3QxarQ9ipV+LiU9QwbVpQFG1yPvYanrfryR2slosn2hmpiTL4XFRtiUXDIJLvEYsdKJjSpEyx3nSJg5F65B6zsS+mJ5y17S3yTwacMtXGaeCNm4Lavme6hJ26zlt6SHYfKMqZJ34lKtlwT6LhLbFD91luKhbwvM3scpu/J8VAYpwRgzYxTTLXbhZP5VuoujzWcjkmxoTm11wPHYSiIzeuZHIeM7q5ppHdF0nhnxUdM19KePIxlx9QSwMECgAAAAgANbylXNJ3/LdtAAAAewAAABsAAAB3b3JkL19yZWxzL2hlYWRlcjEueG1sLnJlbHNNjEEOAiEMRa9CuneKLowxw8xuDmD0AA1WIA6FUGI8vixd/rz3/rx+824+3DQVcXCcLBgWX55JgoPHfTtcYF3mG+/Uh6ExVTUjEXUQe69XRPWRM+lUKssgr9Iy9TFbwEr+TYHxZO0Z2/8H4PIDUEsDBAoAAAAIADW8pVyowdMJdQMAAFYQAAAQAAAAd29yZC9oZWFkZXIxLnhtbOWYzXLTMBDHX8XjeyvbTUKaadoJKQUOfAwt5azKSiyQJY2kJC0nHoI34BE4cKdvwpOw/o7jlNopMMOQg2V97M/739VanhydXMfcWVJtmBRj19/3XIcKIkMm5mP37cXZ3tA9OT5ajaJQO7BUmNFKkbEbWatGCBkS0Rib/ZgRLY2c2X0iYyRnM0YoWkkdosDzvfROaUmoMcCdYrHExs1xcZMmFRUwOZM6xha6eo5irD8s1B7QFbbsinFmb4DtDQqMHLsLLUY5Yq90KDEZZQ7lTWGh2zw3MzmVZBFTYdMnIk05+CCFiZiqZOxKg8mogCx/JWIZc7dMgd97WA5ONV5BUwHbuB9mRjHPPP810fdaZCRBlBZtXKg/s/AkxkxUD94pNGvB9fvdAMEmQM0flpynWi5URWMPoz0XH0qWoJ1YeZLXpZmHOXMeYVVWILluB8v3XcLrIRJhbel1xfA7Q/roEA2boGAHEAgM/CbqoDNqgBKvGqCWe3kDBF41SC039SZpi7jBbqSgSXq0G+mgSRruRmpsp5U/ICzstseLIkFgucYx3WoNNlOOMTcxOJQcuvaK581rnd+8c6C5UcAOr7ELHXhtHh4MPBflCx4DBI7ztCcVLFhiPnaT2uM0WU8kl3D04YWVSdd8HLu9zJjTme2y/kpaK+MuFprNo06PYMKwkD7rbnLZ3gTVw4bq8X6qWZjczqGdSp4FfDD08oDXhoN+lgdUs7QZimTXHEy25bHCWrI9jUKKdS1n6a9Q4zXT2GZ9PY1tLGppvN8AbegxUQjTM8bB2nvSO5z03AJGOMW6CMELrCv5m7Hyvbrcxnx/U96dhELOHQhU+oKqBKrUML1kA/pMCmvAEBvC4MSeaIZ5Ghez1qHY2IlheG0omsCGLfqZx9l1atI2jWsRnzy66YT5WIwGQTEyNfUxVPpnkxfTyChMQKPS1FC9pO7x9NUT57XUFnPn+zfnfKE0Sz5NpXEea1jKeSo6A6VX9afV1/ROpqfTQW9Trz9s6s3G7tV7QWMFX+/U+fHps/OGzjU2Tkidl3R++5UwmQThpVxK57kIGcGh1Fv0o6qa76/p4p3wH9V0nrR/o6bByQlnc1F6C7uf6nLNWrWr7P492bo0n/37r4Qg7OFC9W8pkUtI6e0X6fj7XlIOgRf07y4ClJ1vKP9WQekfBcc/AVBLAwQKAAAACAA1vKVciaL+MagBAAC4CAAAEwAAAFtDb250ZW50X1R5cGVzXS54bWy1Vstu2zAQ/BVB18Ci3UNRFH4c2vrY+pB+AE2uZLYilyBXrvP3XUq2ASWW48TRTcuZ2RlxV4Dmq4Otsz2EaNAt8lkxzTNwCrVx1SL//biefMlXy/njk4eYMdXFRb4j8l+FiGoHVsYCPThGSgxWEpehEl6qv7IC8Wk6/SwUOgJHE0o98uX8O5SyqSn71p2n1ovc2MT3rsqzHwc+7uKkWlxV/PHQl7QHb9a8Jtla31Ok+rqiMmVPkerririvHvgeeyo+G1RJ72ujJDFR7J1+NofJcQZFgLrlxJ3x8YUBo/Emh+fCVL8zGZalUaBRNZYlBW7LJjIb9Jqb9ExQE7XX9os3NBgN9/j8w6B9QAUx8nLbujgjVhrX3cxGBvopLfcWiS7OlOPrjpIj0lMN8XKADrvL/rQICgNM2NhDIHPBjwNuGI0iET/yhVUTCe1t1i31I80hbZMGfZM9tx510q6xWwj8fHnYZ3jUECUiOaShjTvDo4bgmVzJcELH/eyAiJ+GPrwjOmoEhTYBAxFO6MjbwI3ktoahbTjCo4bYgdQQLifosNnJX7S/Isv/UEsDBAoAAAAIADW8pVxYedsikgAAAOQAAAATAAAAZG9jUHJvcHMvY3VzdG9tLnhtbJ3OQQrCMBCF4auU2dtUFyKlaTfi2kV1H9JpG2hmQiYt9vZGBA/g8vHDx2u6l1+KDaM4Jg3HsoICyfLgaNLw6G+HCxSSDA1mYUINOwp0bXOPHDAmh1JkgETDnFKolRI7ozdS5ky5jBy9SXnGSfE4OotXtqtHSupUVWdlV0nsD+HHwdert/QvObD9vJNnv4fsqfYNUEsDBAoAAAAIADW8pVzi/J3akwAAAOYAAAAQAAAAZG9jUHJvcHMvYXBwLnhtbJ3OQQrCMBCF4auE7G2qC5HStBtx7aK6D8m0DTQzIRNLe3sjggdw+fjh47X9FhaxQmJPqOWxqqUAtOQ8Tlo+htvhIgVng84shKDlDiz7rr0nipCyBxYFQNZyzjk2SrGdIRiuSsZSRkrB5DLTpGgcvYUr2VcAzOpU12cFWwZ04A7xB8qv2Kz5X9SR/fzj57DH4qnuDVBLAwQKAAAACAA1vKVcnInJkc4BAACtBgAAEgAAAHdvcmQvZm9vdG5vdGVzLnhtbNWUzU7jMBDHXyXyvXVSAVpFTTmAQNwQ3X0A4ziNhe2xbCehb7+TxE26LKoKPXGJv2Z+85+Z2Ovbd62SVjgvwRQkW6YkEYZDKc2uIH9+Pyx+kcQHZkqmwIiC7IUnt5t1l1cAwUAQPkGC8XlneUHqEGxOqee10MwvteQOPFRhyUFTqCrJBe3AlXSVZukwsw648B7D3THTMk8iTv9PAysMHlbgNAu4dDuqmXtr7ALplgX5KpUMe2SnNwcMFKRxJo+IxSSod8lHQXE4eLhz4o4u98AbLUwYIlInFGoA42tp5zS+S8PD+gBpTyXRakWmFmRXl/Xg3rEOhxl4jvxydNJqVH6amKVndKRHTB7nSPg35kGJZtLMgb9VmqPiZtdfA6w+AuzusuY8OmjsTJOX0Z7M28TqL/YXWLHJx6n5y8Rsa2bxBmqeP+0MOPaqUBG2LMGqJ/1vTY6fnKTLw96ihReWORbAEdySZUEW2WBoh8+z6wdvGccIaMCqIPB2p72xkn3Oq6tp8dL0IVkTgNDNmk7u4yfOt2Gv+ugtUwV5iGpeRCUcvpkiOkbjaj6O+xNukj0d0EEznb0+TZeDCdI0wyuz/Zh6+hMy/zSDU1U4WvjNX1BLAwQKAAAACAA1vKVc0nf8t20AAAB7AAAAHQAAAHdvcmQvX3JlbHMvZm9vdG5vdGVzLnhtbC5yZWxzTYxBDgIhDEWvQrp3ii6MMcPMbg5g9AANViAOhVBiPL4sXf689/68fvNuPtw0FXFwnCwYFl+eSYKDx307XGBd5hvv1IehMVU1IxF1EHuvV0T1kTPpVCrLIK/SMvUxW8BK/k2B8WTtGdv/B+DyA1BLAwQKAAAACAA1vKVcP0qOjcEBAACSBgAAEQAAAHdvcmQvZW5kbm90ZXMueG1szZTbbuMgEIZfxeI+wY661cqK04seVr2rmt0HoBjHqMAgwPbm7Xd8CM62VZQ2N70xp5lv/pkxrG/+apW0wnkJpiDZMiWJMBxKaXYF+fP7YfGT3GzWXS5MaSAIn6C98XlneUHqEGxOqee10MwvteQOPFRhyUFTqCrJBe3AlXSVZukwsw648B7ht8y0zJMJp9/TwAqDhxU4zQIu3Y5q5l4bu0C6ZUG+SCXDHtnp9QEDBWmcySfEIgrqXfJR0DQcPNw5cUeXO+CNFiYMEakTCjWA8bW0cxpfpeFhfYC0p5JotSKxBdnVZT24c6zDYQaeI78cnbQalZ8mZukZHekR0eMcCf/HPCjRTJo58JdKc1Tc7MfnAKu3ALu7rDm/HDR2psnLaI/mNbKM+BRravJxav4yMduaWbyBmuePOwOOvShUhC1LsOpJ/1uToxcn6fKwt2jghWWOBXAEt2RZkEU22Nnh8+T6wVvGMQAasCoIvNxpb6xkn/LqKi6emz4iawIQulnT6D5+pvk27FUfvWWqIPejmGdRCYfvo5j8JlsRT6ftCIui4wEdFNPo9FGqHEyQphkemO3btNPvn/WH+k9UYJ77zT9QSwMECgAAAAgANbylXNJ3/LdtAAAAewAAABwAAAB3b3JkL19yZWxzL2VuZG5vdGVzLnhtbC5yZWxzTYxBDgIhDEWvQrp3ii6MMcPMbg5g9AANViAOhVBiPL4sXf689/68fvNuPtw0FXFwnCwYFl+eSYKDx307XGBd5hvv1IehMVU1IxF1EHuvV0T1kTPpVCrLIK/SMvUxW8BK/k2B8WTtGdv/B+DyA1BLAwQKAAAACAA1vKVcTZ/KyqEBAABzBQAAEQAAAHdvcmQvc2V0dGluZ3MueG1spZTdbtswDIVfxdB9IrtYi8GoW3Qr1vVi2EW3B2Al2RYiUYIk28vbj47juD9AkTRXkkHxO0ekxevbf9ZkvQpRO6xYsc5ZplA4qbGp2N8/P1ZfWRYToATjUFVsqyK7vbkeyqhSokMxIwDGcvCiYm1KvuQ8ilZZiGurRXDR1WktnOWurrVQfHBB8ou8yHc7H5xQMRLoO2APke1x9j3NeYUUrF2wkOgzNNxC2HR+RXQPST9ro9OW2PnVjHEV6wKWe8TqYGhMKSdD+2XOCMfoTin3TnRWYdop8qAMeXAYW+2Xa3yWRsF2hvQfXaK3hh1aUHw5rwf3AQZaFuAx9uWUZM3k/GNikR/RkRFxyDjGwmvN2YkFjYvwp0rzorjF5WmAi7cA35zXnIfgOr/Q9Hm0R9wcWOO7PoG1b/LLq8XzzDy14OkFWlE+NugCPBtyRC3LqOrZ+FuzceJIHb2B7TcQm4ZqgXKXxseQ6hXeofwt5U8FkqZZNpQ9mIrVYKJiuzPTlFh2T9MAm08Wl4y2CJakXw2UX06qMdSFE0o+SvJFky/z8uY/UEsDBAoAAAAIADW8pVyLhjnExQEAAMYIAAARAAAAd29yZC9jb21tZW50cy54bWyl1N1y4iAYBuBbcThXklhTN9O0J53t9HjbC6CAwjT8DKDRu19SJUmXnU6CR+ok35OX18DD00k0iyM1litZg3yVgQWVWBEu9zV4f/u93IKFdUgS1ChJa3CmFjw9PrQVVkJQ6ezCA9JW+FQD5pyuILSYUYHsSnBslFU7t/L3QrXbcUwhMaj1Niyy/A5ihoyjJ9Ab+WxkA3/BbQwVCVCewSKPqfVsqoRdqgi6S4J8qkjapEn/WVyZJhWxdJ8mrWNpmyZFr5PAEaQ0lf7iThmBnP9p9lAg83nQSw9r5PgHb7g7ezMrA4O4/ExI5Kd6QazJbOEeCkVosyZBUTU4GFld55f9fBe9usxfP8KEmbL+y8izwoduO3+tHBra+C6UtIxr29eZqvmLLCDHnxZxFE24r9X5xO3SKkO6vrKvb9ooTK31HT5fqhzAKfGv/YvmkvxnMc8m/CMd0U9MifD9mSGJ8G/h8OCkakbl5hMPkAAUEVBiOvHAD8b2akA87NDO4RO3RnDK3uFk5KSFGQGWOMJmKUXoFXazyCGGLBuLdF6oTc+dxagjvb9tI7wYddCDxm/TXodjrZXzFpiV/7au7W1h/jCkKYCPfwFQSwMECgAAAAgANbylXNJ3/LdtAAAAewAAABwAAAB3b3JkL19yZWxzL2NvbW1lbnRzLnhtbC5yZWxzTYxBDgIhDEWvQrp3ii6MMcPMbg5g9AANViAOhVBiPL4sXf689/68fvNuPtw0FXFwnCwYFl+eSYKDx307XGBd5hvv1IehMVU1IxF1EHuvV0T1kTPpVCrLIK/SMvUxW8BK/k2B8WTtGdv/B+DyA1BLAwQKAAAACAA1vKVcY+1e1h0BAABDAwAAEgAAAHdvcmQvZm9udFRhYmxlLnhtbJ3R3W7CIBQH8Fch3Cu1mY1prN4sS3a/PQACtUQOp+Hg1LcfrbZr4o3dFRDy/+V8bPdXcOzHBLLoK75aZpwZr1Bbf6z499fHYsMZRem1dOhNxW+G+H63vZQ1+kgspT2VoCrexNiWQpBqDEhaYmt8+qwxgIzpGY4CZDid24VCaGW0B+tsvIk8ywr+YMIrCta1VeYd1RmMj31eBOOSiJ4a29KgXV7RLhh0G1AZotQxuLsH0vqRWb09QWBVQMI6LlMzj4p6KsVXWX8D9wes5wH5E1Aoc51nbB6GSMmpY/U8pxgdqyfO/4qZAKSjbmYp+TBX0WVllI2kZiqaeUWtR+4G3YxAlZ9Hj0EeXJLS1llaHOthdp9cd7D7MtjQAhe7X1BLAwQKAAAACAA1vKVc0nf8t20AAAB7AAAAHQAAAHdvcmQvX3JlbHMvZm9udFRhYmxlLnhtbC5yZWxzTYxBDgIhDEWvQrp3ii6MMcPMbg5g9AANViAOhVBiPL4sXf689/68fvNuPtw0FXFwnCwYFl+eSYKDx307XGBd5hvv1IehMVU1IxF1EHuvV0T1kTPpVCrLIK/SMvUxW8BK/k2B8WTtGdv/B+DyA1BLAQIUAAoAAAAAADW8pVwAAAAAAAAAAAAAAAAFAAAAAAAAAAAAEAAAAAAAAAB3b3JkL1BLAQIUAAoAAAAAADW8pVwAAAAAAAAAAAAAAAALAAAAAAAAAAAAEAAAACMAAAB3b3JkL19yZWxzL1BLAQIUAAoAAAAIADW8pVzJANowBwEAAKEEAAAcAAAAAAAAAAAAAAAAAEwAAAB3b3JkL19yZWxzL2RvY3VtZW50LnhtbC5yZWxzUEsBAhQACgAAAAgANbylXMrPH12CCwAAxOkAABEAAAAAAAAAAAAAAAAAjQEAAHdvcmQvZG9jdW1lbnQueG1sUEsBAhQACgAAAAgANbylXAOC2ikUAwAAMREAAA8AAAAAAAAAAAAAAAAAPg0AAHdvcmQvc3R5bGVzLnhtbFBLAQIUAAoAAAAAADW8pVwAAAAAAAAAAAAAAAAJAAAAAAAAAAAAEAAAAH8QAABkb2NQcm9wcy9QSwECFAAKAAAACAA1vKVcq4BFXjsBAACDAgAAEQAAAAAAAAAAAAAAAACmEAAAZG9jUHJvcHMvY29yZS54bWxQSwECFAAKAAAACAA1vKVcHinpWnACAABkDAAAEgAAAAAAAAAAAAAAAAAQEgAAd29yZC9udW1iZXJpbmcueG1sUEsBAhQACgAAAAAANbylXAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAQAAAAsBQAAF9yZWxzL1BLAQIUAAoAAAAIADW8pVwfo5KW5gAAAM4CAAALAAAAAAAAAAAAAAAAANQUAABfcmVscy8ucmVsc1BLAQIUAAoAAAAIADW8pVzSd/y3bQAAAHsAAAAbAAAAAAAAAAAAAAAAAOMVAAB3b3JkL19yZWxzL2hlYWRlcjEueG1sLnJlbHNQSwECFAAKAAAACAA1vKVcqMHTCXUDAABWEAAAEAAAAAAAAAAAAAAAAACJFgAAd29yZC9oZWFkZXIxLnhtbFBLAQIUAAoAAAAIADW8pVyJov4xqAEAALgIAAATAAAAAAAAAAAAAAAAACwaAABbQ29udGVudF9UeXBlc10ueG1sUEsBAhQACgAAAAgANbylXFh52yKSAAAA5AAAABMAAAAAAAAAAAAAAAAABRwAAGRvY1Byb3BzL2N1c3RvbS54bWxQSwECFAAKAAAACAA1vKVc4vyd2pMAAADmAAAAEAAAAAAAAAAAAAAAAADIHAAAZG9jUHJvcHMvYXBwLnhtbFBLAQIUAAoAAAAIADW8pVycicmRzgEAAK0GAAASAAAAAAAAAAAAAAAAAIkdAAB3b3JkL2Zvb3Rub3Rlcy54bWxQSwECFAAKAAAACAA1vKVc0nf8t20AAAB7AAAAHQAAAAAAAAAAAAAAAACHHwAAd29yZC9fcmVscy9mb290bm90ZXMueG1sLnJlbHNQSwECFAAKAAAACAA1vKVcP0qOjcEBAACSBgAAEQAAAAAAAAAAAAAAAAAvIAAAd29yZC9lbmRub3Rlcy54bWxQSwECFAAKAAAACAA1vKVc0nf8t20AAAB7AAAAHAAAAAAAAAAAAAAAAAAfIgAAd29yZC9fcmVscy9lbmRub3Rlcy54bWwucmVsc1BLAQIUAAoAAAAIADW8pVxNn8rKoQEAAHMFAAARAAAAAAAAAAAAAAAAAMYiAAB3b3JkL3NldHRpbmdzLnhtbFBLAQIUAAoAAAAIADW8pVyLhjnExQEAAMYIAAARAAAAAAAAAAAAAAAAAJYkAAB3b3JkL2NvbW1lbnRzLnhtbFBLAQIUAAoAAAAIADW8pVzSd/y3bQAAAHsAAAAcAAAAAAAAAAAAAAAAAIomAAB3b3JkL19yZWxzL2NvbW1lbnRzLnhtbC5yZWxzUEsBAhQACgAAAAgANbylXGPtXtYdAQAAQwMAABIAAAAAAAAAAAAAAAAAMScAAHdvcmQvZm9udFRhYmxlLnhtbFBLAQIUAAoAAAAIADW8pVzSd/y3bQAAAHsAAAAdAAAAAAAAAAAAAAAAAH4oAAB3b3JkL19yZWxzL2ZvbnRUYWJsZS54bWwucmVsc1BLBQYAAAAAGAAYAAMGAAAmKQAAAAA=';

function downloadTemplateRegras() {
  const bytes = atob(TEMPLATE_REGRAS_B64);
  const arr   = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  const blob  = new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const url   = URL.createObjectURL(blob);
  const a     = document.createElement('a');
  a.href      = url;
  a.download  = 'Template_Regras_Negocio_COE.docx';
  a.click();
  URL.revokeObjectURL(url);
  showToast('success', '⬇️ Download iniciado', 'Template_Regras_Negocio_COE.docx');
}
// ─────────────────────────────────────────────────────────────────────────────

// ── DIAS ÚTEIS E VERIFICAÇÃO AUTOMÁTICA ──────────────────────────────────────

function diasUteisEntre(dataInicio, dataFim) {
  let count = 0;
  const d = new Date(dataInicio);
  while (d < dataFim) {
    d.setDate(d.getDate() + 1);
    const dia = d.getDay();
    if (dia !== 0 && dia !== 6) count++;
  }
  return count;
}

function parseDateFromTimeline(str) {
  try {
    const [datePart] = str.split(' ');
    const [day, month] = datePart.split('/');
    return new Date(new Date().getFullYear(), parseInt(month) - 1, parseInt(day));
  } catch { return new Date(); }
}

function buscarEmailSolicitante(nome) {
  const found = Object.values(usuarios).find(u => u.nome === nome);
  return found ? found.email : null;
}

function verificarAguardando() {
  const agora = new Date();

  tickets.forEach(t => {
    if (t.status !== 'aguardando') return;

    // Marca quando entrou em aguardando (só uma vez)
    if (!t.aguardandoDesde) {
      const ev = [...t.timeline].reverse()
        .find(e => e.status === 'Aguardando informações');
      t.aguardandoDesde = ev ? parseDateFromTimeline(ev.time) : agora;
    }

    const diasEsperados = diasUteisEntre(t.aguardandoDesde, agora);

    // ── 3+ dias úteis sem retorno → cancelar automaticamente ───────────────
    if (diasEsperados >= 3) {
      t.status   = 'cancelado';
      t.flowStep = 6;
      t.timeline.push({
        actor:'Sistema', icon:'⏱️', color:'gray', time: now(),
        text:'Chamado cancelado automaticamente por ausência de retorno após 3 dias úteis.',
        status:'Cancelado'
      });
      notifs.unshift({
        icon:'⏱️',
        title:`${t.id} cancelado automaticamente`,
        text:'Sem retorno por 3 dias úteis. O chamado foi encerrado.',
        time:'Agora mesmo', read:false
      });
      document.getElementById('badge-notifs').style.display = 'inline';
      showToast('warning', `⏱️ ${t.id} cancelado`, 'Sem retorno por 3 dias úteis.');

      // E-mail ao solicitante
      const emailSol = buscarEmailSolicitante(t.owner);
      if (emailSol) {
        try {
          emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CANCELAMENTO, {
            to_name:       t.owner,
            to_email:      emailSol,
            protocolo:     t.id,
            titulo:        t.title,
            cancelado_por: 'Sistema (cancelamento automático)',
            motivo:        'Chamado cancelado após 3 dias úteis sem retorno do solicitante.',
          });
        } catch(e) { console.warn('EmailJS indisponível:', e); }
      }

    // ── 1 ou 2 dias esperando → enviar lembrete (uma vez por sessão) ───────
    } else if (diasEsperados >= 1 && !t._lembreteEnviado) {
      const emailSol = buscarEmailSolicitante(t.owner);
      if (emailSol) {
        try {
          emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_LEMBRETE, {
            to_name:        t.owner,
            to_email:       emailSol,
            protocolo:      t.id,
            titulo:         t.title,
            responsavel:    t.responsible,
            dias_espera:    diasEsperados,
            dias_restantes: 3 - diasEsperados,
          });
          t._lembreteEnviado = true;
        } catch(e) { console.warn('EmailJS indisponível:', e); }
      }
    }
  });
}
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CANCELAVEL = ['aberto', 'andamento', 'aguardando'];

// ── FILTRO ATIVO DO DASHBOARD ─────────────────────────────────────────────────
let dashFilter = null; // null = todos

// ── LOGIN / LOGOUT ────────────────────────────────────────────────────────────
function selectRole(el, role) {
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  currentRole = role;
}

function atualizarBadgeMeus() {
  const count = currentRole === 'solicitante'
    ? tickets.filter(t => t.owner === currentUser.name && t.status !== 'fechado' && t.status !== 'cancelado').length
    : 0;
  const el = document.getElementById('badge-meus');
  if (el) {
    el.textContent   = count;
    el.style.display = count > 0 ? 'inline' : 'none';
  }
}

function atualizarBadgeFila() {
  const count = tickets.filter(t => t.status !== 'fechado' && t.status !== 'cancelado').length;
  const el = document.getElementById('badge-fila');
  if (el) {
    el.textContent   = count;
    el.style.display = count > 0 ? 'inline' : 'none';
  }
}

function doLogin() {
  currentUser = currentRole === 'coe'
    ? { name: 'Igor Gilioli',   initials: 'AL' }
    : { name: 'João Silva', initials: 'JS' };
  document.getElementById('avatarInitial').textContent    = currentUser.initials;
  document.getElementById('sidebarUserName').textContent  = currentUser.name;
  document.getElementById('sidebarUserRole').textContent  = currentRole === 'coe' ? 'Time COE' : 'Solicitante';
  if (currentRole === 'coe') {
    document.getElementById('nav-fila').style.display      = 'flex';
    document.getElementById('nav-novo').style.display      = 'none';
    document.getElementById('btnNovoTop').style.display    = 'none';
    document.getElementById('badge-meus').style.display    = 'none';
  } else {
    document.getElementById('nav-dashboards').style.display = 'none';
  }
  showScreen('app');
  verificarAguardando();
  renderDashboard();
  atualizarBadgeMeus();
  atualizarBadgeFila();
  showToast('success', '✅ Login realizado', `Bem-vindo(a), ${currentUser.name}!`);
}

function doLogout() {
  showScreen('login');
  currentRole = 'solicitante';
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.role-btn')[0].classList.add('selected');
  document.getElementById('nav-fila').style.display      = 'none';
  document.getElementById('nav-novo').style.display      = 'flex';
  document.getElementById('btnNovoTop').style.display    = '';
  document.getElementById('badge-meus').style.display    = '';
  document.getElementById('nav-dashboards').style.display = 'flex';
}

function showScreen(s) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  document.getElementById('screen-' + s).classList.add('active');
}

// ── NAVEGAÇÃO ─────────────────────────────────────────────────────────────────
function navTo(view, el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  const titles = {
    dashboard:  ['Visão Geral',         'Resumo e volumetria dos chamados'],
    novo:       ['Novo Chamado',          'Abrir uma nova solicitação'],
    meus:       ['Meus Chamados',         'Histórico das suas solicitações'],
    dashboards: ['Atendimentos',          'Análise de SLA e performance'],
    fila:       ['Fila de Atendimento',   'Chamados aguardando resposta do COE'],
    notifs:     ['Notificações',          'Atualizações dos seus chamados'],
    detail:     ['Detalhe do Chamado',    ''],
  };
  const [t, s] = titles[view] || ['', ''];
  document.getElementById('topbarTitle').textContent = t;
  document.getElementById('topbarSub').textContent   = s;
  if (view === 'dashboard')  { dashFilter = null; renderDashboard(); }
  if (view === 'novo')       initWizard();
  if (view === 'meus')       renderMeus();
  if (view === 'dashboards') renderDashboards();
  if (view === 'fila')       renderFila();
  if (view === 'notifs')     renderNotifs();
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function renderDashboard() {
  const my = currentRole === 'solicitante'
    ? tickets.filter(t => t.owner === currentUser.name)
    : tickets;

  const stats = [
    { label:'Total de Chamados', value: my.length,
      sub:'todos os status', cls:'blue', filter: null },
    { label:'Em Andamento',      value: my.filter(t => t.status === 'andamento').length,
      sub:'aguardando resolução', cls:'orange', filter: 'andamento' },
    { label:'Resolvidos',        value: my.filter(t => t.status === 'resolvido' || t.status === 'fechado').length,
      sub:'este mês', cls:'green', filter: 'resolvido' },
    { label:'SLA em Risco',      value: my.filter(t => t.sla === 'warn' || t.sla === 'breach').length,
      sub:'requer atenção', cls:'red', filter: 'sla_risco' },
    { label:'Cancelados',        value: my.filter(t => t.status === 'cancelado').length,
      sub:'encerrados pelo usuário', cls:'gray', filter: 'cancelado' },
  ];

  document.getElementById('statsGrid').innerHTML = stats.map(s => {
    const filterArg = s.filter === null ? 'null' : `'${s.filter}'`;
    const isActive  = dashFilter === s.filter;
    const activeStyle = isActive ? 'outline:2px solid #0E49A4;transform:translateY(-4px);box-shadow:0 8px 24px rgba(0,0,0,.13);' : '';
    return `<div class="stat-card ${s.cls}" style="cursor:pointer;${activeStyle}" onclick="setDashFilter(${filterArg})">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-sub">${s.sub}</div>
    </div>`;
  }).join('');

  // ── Limpar área de gráficos (movidos para Atendimentos) ────────────────────
  const chartsEl = document.getElementById('dashCharts');
  if (chartsEl) chartsEl.innerHTML = '';
  ['cjTipo','cjStatus','cjArea','cjSistema'].forEach(killChart);

  renderTable();
}

function setDashFilter(filter) {
  dashFilter = dashFilter === filter ? null : filter; // clique duplo limpa o filtro
  renderDashboard();
  document.getElementById('dashTableCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderTable() {
  let my = currentRole === 'solicitante'
    ? tickets.filter(t => t.owner === currentUser.name)
    : tickets;

  // Aplica filtro do card clicado
  let filterLabel = 'Todos os chamados';
  if (dashFilter === 'andamento') {
    my = my.filter(t => t.status === 'andamento');
    filterLabel = '🟠 Em Andamento';
  } else if (dashFilter === 'resolvido') {
    my = my.filter(t => t.status === 'resolvido' || t.status === 'fechado');
    filterLabel = '🟢 Resolvidos';
  } else if (dashFilter === 'sla_risco') {
    my = my.filter(t => t.sla === 'warn' || t.sla === 'breach');
    filterLabel = '🔴 SLA em Risco';
  } else if (dashFilter === 'cancelado') {
    my = my.filter(t => t.status === 'cancelado');
    filterLabel = '✕ Cancelados';
  }

  const clearBtn = dashFilter
    ? `<button class="btn btn-outline btn-sm" onclick="setDashFilter(null)" style="font-size:14px">✕ Limpar filtro</button>`
    : `<button class="btn btn-outline btn-sm" onclick="renderTable()">↻ Atualizar</button>`;

  const labelEl = document.getElementById('dashFilterLabel');
  const clearEl = document.getElementById('dashFilterClear');
  if (labelEl) labelEl.textContent = filterLabel;
  if (clearEl) clearEl.innerHTML   = clearBtn;

  document.getElementById('dashTableBody').innerHTML = my.length === 0
    ? `<tr><td colspan="9" style="text-align:center;color:var(--gray5);padding:32px">Nenhum chamado encontrado para este filtro.</td></tr>`
    : my.map(t =>
        `<tr onclick="openDetail('${t.id}')">
          <td><span class="protocol">${t.id}</span></td>
          <td style="max-width:180px;font-weight:600">${t.title}</td>
          <td>${t.type}</td>
          <td style="font-size:15px;color:var(--gray7)">${shortSystem(t.system)}</td>
          <td><span class="priority-badge prio-${t.priority.toLowerCase()}">${t.priority}</span></td>
          <td>${statusBadge(t.status)}</td>
          <td>${slaBadge(t.sla)}</td>
          <td>${t.responsible}</td>
          <td style="color:var(--gray5);font-size:15px">${t.created}</td>
        </tr>`
      ).join('');
}

function renderMeus() {
  const my = currentRole === 'solicitante'
    ? tickets.filter(t => t.owner === currentUser.name)
    : tickets;
  document.getElementById('meusTitle').textContent = currentRole === 'coe' ? 'Todos os Chamados' : 'Meus Chamados';
  document.getElementById('meusTableBody').innerHTML = my.map(t =>
    `<tr onclick="openDetail('${t.id}')">
      <td><span class="protocol">${t.id}</span></td>
      <td style="font-weight:600">${t.title}</td>
      <td>${t.type}</td>
      <td style="font-size:15px;color:var(--gray7)">${shortSystem(t.system)}</td>
      <td>${statusBadge(t.status)}</td>
      <td>${slaBadge(t.sla)}</td>
      <td style="color:var(--gray5);font-size:15px">${t.created}</td>
    </tr>`
  ).join('');
}

function renderFila() {
  // Exclui chamados já encerrados (fechado e cancelado)
  const q = tickets.filter(t => t.status !== 'fechado' && t.status !== 'cancelado');
  document.getElementById('filaTableBody').innerHTML = q.map(t =>
    `<tr onclick="openDetail('${t.id}')">
      <td><span class="protocol">${t.id}</span></td>
      <td style="font-weight:600">${t.title}</td>
      <td>${t.type}</td>
      <td style="font-size:15px;color:var(--gray7)">${shortSystem(t.system)}</td>
      <td><span class="priority-badge prio-${t.priority.toLowerCase()}">${t.priority}</span></td>
      <td>${statusBadge(t.status)}</td>
      <td>${slaBadge(t.sla)}</td>
      <td>${t.owner}</td>
      <td><button class="btn btn-blue btn-sm" onclick="event.stopPropagation();openDetail('${t.id}')">Abrir →</button></td>
    </tr>`
  ).join('');
}

function renderNotifs() {
  const temNotifs = notifs.length > 0;
  document.getElementById('notifsList').innerHTML = !temNotifs
    ? `<div style="text-align:center;padding:40px;color:var(--gray5);font-size:16px">
        ✅ Nenhuma notificação no momento.
      </div>`
    : notifs.map(n =>
        `<div style="display:flex;gap:14px;align-items:flex-start;padding:14px 0;border-bottom:1px solid var(--gray3);${n.read ? 'opacity:.55' : ''}">
          <div style="font-size:24px;flex-shrink:0;margin-top:2px">${n.icon}</div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:17px;color:var(--gray9);margin-bottom:2px">${n.title}</div>
            <div style="font-size:16px;color:var(--gray6)">${n.text}</div>
            <div style="font-size:15px;color:var(--gray4);margin-top:4px">${n.time}</div>
          </div>
          ${!n.read ? '<span class="badge badge-aberto" style="flex-shrink:0">Novo</span>' : ''}
        </div>`
      ).join('');

  document.getElementById('badge-notifs').style.display = 'none';

  // Atualiza botão de limpar
  const btnLimpar = document.getElementById('btnLimparNotifs');
  if (btnLimpar) btnLimpar.style.display = temNotifs ? 'inline-flex' : 'none';
}

function limparNotifs() {
  notifs.length = 0;
  document.getElementById('badge-notifs').style.display = 'none';
  showToast('success', '🗑️ Notificações limpas', 'Todas as notificações foram removidas.');
  renderNotifs();
}

// ── ATENDIMENTOS ─────────────────────────────────────────────────────────────
let atFiltros = { tipo:'all', bu:'all', resp:'all', crit:'all' };

function renderDashboards() {
  const all = currentRole === 'solicitante'
    ? tickets.filter(t => t.owner === currentUser.name)
    : tickets;

  atFiltros = { tipo:'all', bu:'all', resp:'all', crit:'all' };

  const resps = [...new Set(all.map(t=>t.responsible).filter(r=>r&&r!=='—'))].sort();
  const bus   = [...new Set(all.map(t=>t.bu).filter(b=>b&&b!=='—'))].sort();

  document.getElementById('dashboardsContent').innerHTML = `
    <!-- Filtros -->
    <div class="chart-card" style="margin-bottom:14px;padding:12px 18px">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:12px;font-weight:700;color:#475569">🔍 Filtros:</span>
        <select id="atFiltroTipo" class="form-select" style="width:auto;padding:6px 12px;font-size:12px">
          <option value="all">Todos os Tipos</option>
          <option value="SISTEMAS">Sistemas</option>
          <option value="KPIs">KPI</option>
          <option value="NOVO_INDICADOR">Novo Indicador</option>
        </select>
        <select id="atFiltroBU" class="form-select" style="width:auto;padding:6px 12px;font-size:12px">
          <option value="all">Todas as BUs</option>
          ${bus.map(b=>`<option value="${b}">${b}</option>`).join('')}
        </select>
        <select id="atFiltroResp" class="form-select" style="width:auto;padding:6px 12px;font-size:12px">
          <option value="all">Todos os Responsáveis</option>
          ${resps.map(r=>`<option value="${r}">${r}</option>`).join('')}
        </select>
        <select id="atFiltroCrit" class="form-select" style="width:auto;padding:6px 12px;font-size:12px">
          <option value="all">Todas as Criticidades</option>
          ${['Baixa','Normal','Alta','Crítica'].map(c=>`<option value="${c}">${c}</option>`).join('')}
        </select>
        <button class="btn btn-outline btn-sm" onclick="limparFiltrosAt(all)">✕ Limpar</button>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-row" id="atKPIs"></div>

    <!-- Linha 1: Volume mensal + SLA global -->
    <div class="charts-row" style="margin-bottom:14px">
      <div class="chart-card"><div class="chart-title">📅 Volume por Mês</div><canvas id="cjMensal" height="200"></canvas></div>
      <div class="chart-card"><div class="chart-title">🎯 SLA Global</div><canvas id="cjSLAGlobal" height="200"></canvas></div>
    </div>

    <!-- Linha 2: SLA por criticidade + Volume por responsável -->
    <div class="charts-row" style="margin-bottom:14px">
      <div class="chart-card"><div class="chart-title">⚡ SLA por Criticidade</div><canvas id="cjSLACrit" height="200"></canvas></div>
      <div class="chart-card"><div class="chart-title">👤 Volume por Responsável</div><canvas id="cjResp" height="200"></canvas></div>
    </div>

    <!-- Linha 3: Por BU + Taxa SLA por Responsável -->
    <div class="charts-row" style="margin-bottom:14px">
      <div class="chart-card"><div class="chart-title">🏢 Volume por Unidade de Negócio</div><canvas id="cjBU" height="180"></canvas></div>
      <div class="chart-card"><div class="chart-title">📈 Taxa de SLA por Responsável (%)</div><canvas id="cjTaxaResp" height="180"></canvas></div>
    </div>

    <!-- Linha 4: Visão por Categoria -->
    <div style="margin:18px 0 12px;font-size:15px;font-weight:700;color:var(--gray9);padding-bottom:8px;border-bottom:2px solid var(--gray3)">
      📊 Visão por Categoria
    </div>
    <div class="charts-row" style="margin-bottom:14px">
      <div class="chart-card"><div class="chart-title">Por Tipo de Chamado</div><canvas id="cjTipo" height="200"></canvas></div>
      <div class="chart-card"><div class="chart-title">Por Status</div><canvas id="cjStatus" height="200"></canvas></div>
    </div>
    <div class="charts-row" style="margin-bottom:0">
      <div class="chart-card"><div class="chart-title">📍 Volume por Área Solicitante</div><canvas id="cjArea" height="200"></canvas></div>
      <div class="chart-card"><div class="chart-title">🖥️ Volume por Sistema / Indicador</div><canvas id="cjSistema" height="200"></canvas></div>
    </div>`;

  // Listeners dos filtros
  ['atFiltroTipo','atFiltroBU','atFiltroResp','atFiltroCrit'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => {
      atFiltros.tipo = document.getElementById('atFiltroTipo').value;
      atFiltros.bu   = document.getElementById('atFiltroBU').value;
      atFiltros.resp = document.getElementById('atFiltroResp').value;
      atFiltros.crit = document.getElementById('atFiltroCrit').value;
      renderAtCharts(all);
    });
  });

  cjDefaults();
  renderAtCharts(all);
}

function limparFiltrosAt(all) {
  atFiltros = { tipo:'all', bu:'all', resp:'all', crit:'all' };
  renderDashboards();
}

function renderAtCharts(all) {
  // Aplicar filtros
  const data = all.filter(t =>
    (atFiltros.tipo === 'all' || t.type          === atFiltros.tipo) &&
    (atFiltros.bu   === 'all' || t.bu            === atFiltros.bu)   &&
    (atFiltros.resp === 'all' || t.responsible   === atFiltros.resp) &&
    (atFiltros.crit === 'all' || t.priority      === atFiltros.crit)
  );

  const total  = data.length;
  const ok     = data.filter(t=>t.sla==='ok').length;
  const warn   = data.filter(t=>t.sla==='warn').length;
  const breach = data.filter(t=>t.sla==='breach').length;
  const taxa   = total > 0 ? Math.round(ok/total*100) : 0;
  const taxaC  = taxa>=80?'#4a6e00':taxa>=50?'#ca8a04':'#dc2626';

  // ── KPI cards ──────────────────────────────────────────────────────────────
  const kpisEl = document.getElementById('atKPIs');
  if (kpisEl) kpisEl.innerHTML = `
    <div class="kpi-card blue" ><div class="kpi-num" style="color:#0E49A4">${total}</div><div class="kpi-label">Total</div><div class="kpi-sub">chamados</div></div>
    <div class="kpi-card green"><div class="kpi-num" style="color:#4a6e00">${ok}</div><div class="kpi-label">✓ No Prazo</div><div class="kpi-sub">${total?Math.round(ok/total*100):0}%</div></div>
    <div class="kpi-card yellow"><div class="kpi-num" style="color:#ca8a04">${warn}</div><div class="kpi-label">⚠ Em Risco</div><div class="kpi-sub">${total?Math.round(warn/total*100):0}%</div></div>
    <div class="kpi-card red"  ><div class="kpi-num" style="color:#dc2626">${breach}</div><div class="kpi-label">✗ Vencidos</div><div class="kpi-sub">${total?Math.round(breach/total*100):0}%</div></div>
    <div class="kpi-card blue" style="border-color:${taxaC}"><div class="kpi-num" style="color:${taxaC}">${taxa}%</div><div class="kpi-label">Taxa SLA</div><div class="kpi-sub">cumprimento</div></div>`;

  // ── Volume por Mês ─────────────────────────────────────────────────────────
  const mesOrder = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const mesMap   = {};
  data.forEach(t => {
    if (!t.created) return;
    const parts = t.created.split('/');
    if (parts.length >= 2) { const m=parseInt(parts[1])-1; if(!isNaN(m)) mesMap[mesOrder[m]]=(mesMap[mesOrder[m]]||0)+1; }
  });
  const mesLabels = mesOrder.filter(m=>mesMap[m]);
  killChart('cjMensal');
  mkBar('cjMensal', mesLabels, mesLabels.map(m=>mesMap[m]),
        mesLabels.map((_,i)=>CJ_PAL[i%CJ_PAL.length]));

  // ── SLA Global doughnut ────────────────────────────────────────────────────
  killChart('cjSLAGlobal');
  if (total > 0) {
    const slaL = ['No Prazo','Em Risco','Vencidos'].filter((_,i)=>[ok,warn,breach][i]>0);
    const slaD = [ok,warn,breach].filter(v=>v>0);
    const slaC = ['#ACDC64','#ca8a04','#dc2626'].filter((_,i)=>[ok,warn,breach][i]>0);
    mkDoughnut('cjSLAGlobal', slaL, slaD, slaC);
  }

  // ── SLA por Criticidade (stacked bar) ──────────────────────────────────────
  const prios = ['Crítica','Alta','Normal','Baixa'];
  killChart('cjSLACrit');
  mkStackedBar('cjSLACrit', prios, [
    { label:'No Prazo', backgroundColor:'#ACDC64', borderRadius:3, data: prios.map(p=>data.filter(t=>t.priority===p&&t.sla==='ok').length) },
    { label:'Em Risco', backgroundColor:'#ca8a04', borderRadius:3, data: prios.map(p=>data.filter(t=>t.priority===p&&t.sla==='warn').length) },
    { label:'Vencido',  backgroundColor:'#dc2626', borderRadius:3, data: prios.map(p=>data.filter(t=>t.priority===p&&t.sla==='breach').length) },
  ]);

  // ── Volume por Responsável ─────────────────────────────────────────────────
  const respMap = {};
  data.forEach(t=>{ if(t.responsible&&t.responsible!=='—') respMap[t.responsible]=(respMap[t.responsible]||0)+1; });
  const respEnt = Object.entries(respMap).sort((a,b)=>b[1]-a[1]);
  killChart('cjResp');
  mkBar('cjResp', respEnt.map(e=>e[0]), respEnt.map(e=>e[1]), respEnt.map((_,i)=>CJ_PAL[i%CJ_PAL.length]));

  // ── Volume por BU ──────────────────────────────────────────────────────────
  const buMap = {};
  data.forEach(t=>{ if(t.bu&&t.bu!=='—') buMap[t.bu]=(buMap[t.bu]||0)+1; });
  const buEnt = Object.entries(buMap).sort((a,b)=>b[1]-a[1]);
  killChart('cjBU');
  mkBar('cjBU', buEnt.map(e=>e[0]), buEnt.map(e=>e[1]), buEnt.map((_,i)=>CJ_PAL[i%CJ_PAL.length]));

  // ── Taxa SLA por Responsável ───────────────────────────────────────────────
  const taxaResp = Object.keys(respMap).map(r => {
    const ts = data.filter(t=>t.responsible===r);
    return { r, v: ts.length>0 ? Math.round(ts.filter(t=>t.sla==='ok').length/ts.length*100) : 0 };
  }).sort((a,b)=>b.v-a.v);
  killChart('cjTaxaResp');
  mkBar('cjTaxaResp',
    taxaResp.map(r=>r.r),
    taxaResp.map(r=>r.v),
    taxaResp.map(r=>r.v>=80?'#ACDC64':r.v>=50?'#ca8a04':'#dc2626')
  );

  // ── Visão por Categoria ────────────────────────────────────────────────────
  const tipoLabels = ['Sistemas','KPI','Novo Indicador'];
  const tipoData   = [data.filter(t=>t.type==='SISTEMAS').length, data.filter(t=>t.type==='KPIs').length, data.filter(t=>t.type==='NOVO_INDICADOR').length];
  const tipoColors = ['#0E49A4','#ACDC64','#ea580c'];
  killChart('cjTipo');
  mkDoughnut('cjTipo', tipoLabels.filter((_,i)=>tipoData[i]>0), tipoData.filter(v=>v>0), tipoColors.filter((_,i)=>tipoData[i]>0));

  const stKeys   = ['aberto','andamento','aguardando','resolvido','fechado','cancelado'];
  const stLabels = ['Aberto','Em andamento','Aguardando','Resolvido','Fechado','Cancelado'];
  const stColors = ['#0E49A4','#ea580c','#ca8a04','#ACDC64','#94a394','#dc2626'];
  const stData   = stKeys.map(k=>data.filter(t=>t.status===k).length);
  killChart('cjStatus');
  mkDoughnut('cjStatus', stLabels.filter((_,i)=>stData[i]>0), stData.filter(v=>v>0), stColors.filter((_,i)=>stData[i]>0));

  const areaMapC = {}; data.forEach(t=>{ const a=t.area||'Não informada'; areaMapC[a]=(areaMapC[a]||0)+1; });
  const areaEnt  = Object.entries(areaMapC).sort((a,b)=>b[1]-a[1]).slice(0,8);
  killChart('cjArea');
  mkBar('cjArea', areaEnt.map(e=>e[0]), areaEnt.map(e=>e[1]), areaEnt.map((_,i)=>CJ_PAL[i%CJ_PAL.length]), true);

  const sysMapC = {}; data.forEach(t=>{ const s=shortSystem(t.system)||'—'; sysMapC[s]=(sysMapC[s]||0)+1; });
  const sysEnt  = Object.entries(sysMapC).sort((a,b)=>b[1]-a[1]).slice(0,6);
  killChart('cjSistema');
  mkBar('cjSistema', sysEnt.map(e=>e[0]), sysEnt.map(e=>e[1]), sysEnt.map((_,i)=>CJ_PAL[i%CJ_PAL.length]), true);
}
// ─────────────────────────────────────────────────────────────────────────────

function openDetail(id) {
  const t = tickets.find(x => x.id === id);
  if (!t) return;
  document.getElementById('topbarTitle').textContent = t.id;
  document.getElementById('topbarSub').textContent   = t.title;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-detail').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const canAct    = currentRole === 'coe';
  const cancelavel = STATUS_CANCELAVEL.includes(t.status);

  const flowHtml = flowStepLabels.map((s, i) => {
    let cls = '';
    if (i < t.flowStep)  cls = 'done';
    if (i === t.flowStep) cls = 'current';
    return `<div class="flow-step ${cls}">
      <span>${cls === 'done' ? '✅' : cls === 'current' ? '▶️' : s.icon}</span>${s.label}
    </div>`;
  }).join('');

  const tlHtml = t.timeline.map(e =>
    `<div class="tl-item">
      <div class="tl-line"></div>
      <div class="tl-dot ${e.color}">${e.icon}</div>
      <div class="tl-content">
        <div class="tl-head">
          <span class="tl-actor">${e.actor}</span>
          <span class="tl-time">${e.time}</span>
        </div>
        <div class="tl-text">${e.text}</div>
        ${e.status ? `<div class="tl-badge">${statusBadge(e.status.toLowerCase().replace(/\s+/g,''))}</div>` : ''}
      </div>
    </div>`
  ).join('');

  // ── Barra de ações COE ────────────────────────────────────────────────────
  const coeBar = canAct ? `
    <div class="coe-action-bar">
      <span class="action-title">Ações COE:</span>
      ${t.status === 'aberto'     ? `<button class="btn btn-blue btn-sm"   onclick="coeAction('${t.id}','iniciar')">▶ Iniciar Atendimento</button>` : ''}
      ${t.status === 'andamento'  ? `<button class="btn btn-orange btn-sm" onclick="openModal('solicitar','${t.id}')">❓ Solicitar Informações</button>
                                     <button class="btn btn-green btn-sm"  onclick="coeAction('${t.id}','resolver')">✅ Marcar como Resolvido</button>` : ''}
      ${t.status === 'aguardando' ? `<button class="btn btn-blue btn-sm"   onclick="coeAction('${t.id}','retomar')">↩ Retomar Atendimento</button>` : ''}
      ${t.status === 'resolvido'  ? `<button class="btn btn-outline btn-sm" onclick="coeAction('${t.id}','fechar')">🔒 Fechar Chamado</button>` : ''}
      ${cancelavel                ? `<button class="btn btn-red btn-sm"    onclick="openModal('cancelar','${t.id}')">✕ Cancelar Chamado</button>` : ''}
    </div>` : '';

  // ── Barra de ações Solicitante ────────────────────────────────────────────
  const solBar = !canAct ? `
    ${t.status === 'aguardando' ? `
      <div class="coe-action-bar" style="border-left:4px solid var(--yellow);background:#fffbeb">
        <span class="action-title" style="color:var(--yellow)">⚠️ Aguardando sua resposta:</span>
        <button class="btn btn-blue btn-sm" onclick="openModal('responder','${t.id}')">💬 Responder ao COE</button>
      </div>` : ''}
    ${t.status === 'resolvido' ? `
      <div class="coe-action-bar">
        <span class="action-title">Problema resolvido?</span>
        <button class="btn btn-green btn-sm" onclick="openModal('confirm','${t.id}')">✅ Sim, confirmar</button>
        <button class="btn btn-red btn-sm"   onclick="reopenTicket('${t.id}')">↩ Não, reabrir</button>
      </div>` : ''}
    ${cancelavel ? `
      <div class="coe-action-bar">
        <span class="action-title">Ações:</span>
        <button class="btn btn-red btn-sm" onclick="openModal('cancelar','${t.id}')">✕ Cancelar Chamado</button>
      </div>` : ''}
  ` : '';

  document.getElementById('detailContent').innerHTML = `
    <div style="margin-bottom:16px">
      <button class="btn btn-outline btn-sm" onclick="navTo('dashboard',document.getElementById('nav-dashboard'))">← Voltar</button>
    </div>
    ${coeBar}${solBar}
    <div class="detail-grid">
      <div class="detail-main">
        <div class="card">
          <div class="card-title">📝 Descrição</div>
          <p style="font-size:17px;color:var(--gray7);line-height:1.7">${t.description}</p>
        </div>
        <div class="card">
          <div class="card-title">⏱️ Histórico</div>
          <div>${tlHtml}</div>
        </div>
        <div class="card">
          <div class="card-title">📎 Anexos</div>
          ${t.anexos && t.anexos.length > 0
            ? t.anexos.map(a => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#F8FAF8;border-radius:8px;border:1px solid var(--gray3)">
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-size:20px">📄</span>
                  <span style="font-size:13px;font-weight:600;color:var(--gray9)">${a.nome}</span>
                </div>
                <a href="${a.data}" download="${a.nome}"
                  style="background:#0E49A4;color:#fff;padding:6px 14px;border-radius:7px;font-size:12px;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:5px">
                  ⬇️ Baixar
                </a>
              </div>`).join('')
            : `<p style="font-size:13px;color:var(--gray5);font-style:italic">Nenhum anexo neste chamado.</p>`
          }
        </div>
          <textarea class="form-textarea" id="commentInput-${t.id}" placeholder="Digite um comentário..." style="min-height:80px;margin-bottom:12px"></textarea>
          <div style="display:flex;justify-content:flex-end">
            <button class="btn btn-blue btn-sm" onclick="addComment('${t.id}')">Enviar</button>
          </div>
        </div>
      </div>
      <div class="detail-side">
        <div class="card">
          <div class="card-title">📌 Informações</div>
          ${infoRow('Protocolo', `<span class="protocol">${t.id}</span>`)}
          ${infoRow('Status',    statusBadge(t.status))}
          ${infoRow('Unid. de Negócio', t.bu || '—')}
          ${infoRow('Tipo',      t.type)}
          ${infoRow('Sistema',   t.system)}
          ${infoRow('Prioridade',`<span class="priority-badge prio-${t.priority.toLowerCase()}">${t.priority}</span>`)}
          ${infoRow('SLA',       slaBadge(t.sla))}
          ${infoRow('Responsável', t.responsible)}
          ${infoRow('Solicitante', t.owner)}
          ${infoRow('Abertura',    t.created)}
        </div>
        <div class="card">
          <div class="card-title">🗺️ Etapa do Fluxo</div>
          <div class="flow-steps">${flowHtml}</div>
        </div>
      </div>
    </div>`;
}

function infoRow(l, v) {
  return `<div class="info-row"><span class="info-label">${l}</span><span class="info-value">${v}</span></div>`;
}

// ── AÇÕES COE ─────────────────────────────────────────────────────────────────
function coeAction(id, action) {
  const t = tickets.find(x => x.id === id);
  if (!t) return;
  const n = now();
  if (action === 'iniciar') {
    t.status = 'andamento'; t.responsible = currentUser.name; t.flowStep = 4;
    t.timeline.push({ actor: currentUser.name, icon:'▶️', color:'orange', time: n, text:'Atendimento iniciado.', status:'Em andamento' });
    showToast('info', '▶ Atendimento iniciado', `Chamado ${id}.`);
  } else if (action === 'resolver') {
    t.status = 'resolvido'; t.flowStep = 5;
    t.timeline.push({ actor: currentUser.name, icon:'✅', color:'green', time: n, text:'Chamado marcado como resolvido. Aguardando confirmação do solicitante.', status:'Resolvido' });
    showToast('success', '✅ Resolvido', 'Aguardando confirmação.');
  } else if (action === 'retomar') {
    t.status = 'andamento'; t.flowStep = 4;
    t.timeline.push({ actor: currentUser.name, icon:'↩️', color:'orange', time: n, text:'Atendimento retomado.', status:'Em andamento' });
    showToast('info', '↩ Retomado', `Chamado ${id}.`);
  } else if (action === 'fechar') {
    t.status = 'fechado'; t.flowStep = 6;
    t.timeline.push({ actor:'Sistema', icon:'🔒', color:'gray', time: n, text:'Chamado encerrado.', status:'Fechado' });
    showToast('success', '🔒 Fechado', `Protocolo ${id} encerrado.`);
  }
  openDetail(id);
}

function reopenTicket(id) {
  const t = tickets.find(x => x.id === id);
  t.status = 'andamento'; t.flowStep = 4;
  t.timeline.push({ actor: currentUser.name, icon:'↩️', color:'blue', time: now(), text:'Problema persiste. Chamado reaberto.', status:'Em andamento' });
  showToast('warning', '↩ Chamado reaberto', 'O time COE será notificado.');
  openDetail(id);
}

function addComment(id) {
  const el  = document.getElementById('commentInput-' + id);
  const txt = el ? el.value.trim() : '';
  if (!txt) { showToast('warning', '⚠️ Campo vazio', 'Digite um comentário.'); return; }
  const t = tickets.find(x => x.id === id);
  t.timeline.push({ actor: currentUser.name, icon:'💬', color:'purple', time: now(), text: txt });
  showToast('success', '💬 Comentário enviado', 'Atualização registrada.');
  openDetail(id);
}

// ── CANCELAMENTO ──────────────────────────────────────────────────────────────
function doCancel(id) {
  const txt = document.getElementById('modalText').value.trim();
  if (!txt) { showToast('warning', '⚠️ Obrigatório', 'Informe o motivo do cancelamento.'); return; }
  const t = tickets.find(x => x.id === id);
  t.status = 'cancelado'; t.flowStep = 6;
  t.timeline.push({
    actor: currentUser.name, icon:'✕', color:'gray', time: now(),
    text: `Chamado cancelado. Motivo: ${txt}`, status:'Cancelado'
  });
  t.timeline.push({
    actor:'Sistema', icon:'🔒', color:'gray', time: now(),
    text:'Chamado encerrado como cancelado.', status:'Cancelado'
  });
  notifs.unshift({
    icon:'✕', title:`Chamado ${id} cancelado`,
    text: `Motivo: ${txt}`, time:'Agora mesmo', read: false
  });
  document.getElementById('badge-notifs').style.display = 'inline';
  closeModal();
  showToast('warning', `✕ Chamado ${id} cancelado`, 'O protocolo foi encerrado.');
  openDetail(id);
}

// ── MODAIS ────────────────────────────────────────────────────────────────────
function openModal(type, id) {
  const overlay = document.getElementById('modalOverlay');
  const box     = document.getElementById('modalBox');
  overlay.classList.add('open');

  if (type === 'solicitar') {
    box.innerHTML = `
      <div class="modal-title">❓ Solicitar Informações</div>
      <div class="modal-sub">O solicitante será notificado e o chamado ficará aguardando resposta.</div>
      <textarea class="form-textarea" id="modalText" placeholder="Descreva quais informações são necessárias..."></textarea>
      <div class="modal-actions">
        <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-orange"  onclick="doSolicitar('${id}')">Enviar Solicitação</button>
      </div>`;

  } else if (type === 'confirm') {
    box.innerHTML = `
      <div class="modal-title">✅ Confirmar Resolução</div>
      <div class="modal-sub">O problema foi resolvido satisfatoriamente?</div>
      <div style="margin:10px 0 4px;font-size:16px;font-weight:600;color:var(--gray7)">Avalie o atendimento:</div>
      <div class="rating-stars">${[1,2,3,4,5].map(i=>`<span class="star" onclick="rateStar(${i})">⭐</span>`).join('')}</div>
      <textarea class="form-textarea" id="modalText" placeholder="Comentário opcional..." style="min-height:70px"></textarea>
      <div class="modal-actions">
        <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-green"   onclick="doConfirm('${id}')">Confirmar e Fechar</button>
      </div>`;

  } else if (type === 'responder') {
    box.innerHTML = `
      <div class="modal-title">💬 Responder ao COE</div>
      <div class="modal-sub">Sua resposta será enviada ao time COE e o chamado voltará para atendimento.</div>
      <textarea class="form-textarea" id="modalText"
        placeholder="Digite sua resposta aqui. Seja detalhado para agilizar o atendimento..."
        style="min-height:110px"></textarea>
      <div class="modal-actions">
        <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-blue" onclick="doResponder('${id}')">📨 Enviar Resposta</button>
      </div>`;

  } else if (type === 'cancelar') {
    box.innerHTML = `
      <div class="modal-title">✕ Cancelar Chamado</div>
      <div class="modal-sub">Atenção: esta ação não pode ser desfeita. O chamado será encerrado como cancelado.</div>
      <div style="margin:0 0 8px;font-size:16px;font-weight:600;color:var(--gray7)">Motivo do cancelamento: *</div>
      <textarea class="form-textarea" id="modalText" placeholder="Ex: Dúvida esclarecida internamente, problema resolvido sem necessidade de suporte..."></textarea>
      <div class="modal-actions">
        <button class="btn btn-outline" onclick="closeModal()">Voltar</button>
        <button class="btn btn-red"     onclick="doCancel('${id}')">Confirmar Cancelamento</button>
      </div>`;
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function doResponder(id) {
  const txt = document.getElementById('modalText').value.trim();
  if (!txt) { showToast('warning', '⚠️ Obrigatório', 'Digite sua resposta antes de enviar.'); return; }

  const t = tickets.find(x => x.id === id);
  t.status   = 'andamento';
  t.flowStep = 4;
  t.aguardandoDesde  = null;
  t._lembreteEnviado = false;

  t.timeline.push({
    actor: currentUser.name, icon:'💬', color:'blue', time: now(),
    text: `Resposta do solicitante: ${txt}`, status:'Em andamento'
  });
  t.timeline.push({
    actor:'Sistema', icon:'🔔', color:'orange', time: now(),
    text:`Chamado devolvido ao COE após resposta do solicitante. Responsável: ${t.responsible}.`
  });

  notifs.unshift({
    icon:'💬',
    title:`Resposta recebida — ${id}`,
    text:`${currentUser.name} respondeu a solicitação de informações.`,
    time:'Agora mesmo', read:false
  });
  document.getElementById('badge-notifs').style.display = 'inline';

  closeModal();
  showToast('success', '📨 Resposta enviada!', 'O time COE foi notificado.');
  openDetail(id);
}

function doSolicitar(id) {
  const txt = document.getElementById('modalText').value.trim();
  const t = tickets.find(x => x.id === id);
  t.status = 'aguardando'; t.flowStep = 3;
  t.aguardandoDesde = new Date(); // marca o início da espera
  t._lembreteEnviado = false;     // reseta o lembrete para nova espera
  t.timeline.push({ actor: currentUser.name, icon:'❓', color:'yellow', time: now(), text: txt, status:'Aguardando informações' });
  notifs.unshift({ icon:'❓', title:`Informações solicitadas – ${id}`, text: txt, time:'Agora mesmo', read: false });
  document.getElementById('badge-notifs').style.display = 'inline';
  closeModal();
  showToast('info', '❓ Solicitado', 'Solicitante notificado.');
  openDetail(id);
}

function doConfirm(id) {
  const t        = tickets.find(x => x.id === id);
  const txt      = document.getElementById('modalText').value.trim();
  const stars    = document.querySelectorAll('.star.active').length;
  const starsStr = stars > 0 ? ' ' + '⭐'.repeat(stars) : '';
  t.status = 'fechado'; t.flowStep = 6;
  t.timeline.push({ actor: currentUser.name, icon:'👤', color:'blue', time: now(), text:(txt || 'Problema confirmado como resolvido.') + starsStr });
  t.timeline.push({ actor:'Sistema', icon:'🔒', color:'gray', time: now(), text:'Chamado encerrado.', status:'Fechado' });
  closeModal();
  showToast('success', '🔒 Encerrado', 'Obrigado pela avaliação!');
  openDetail(id);
}

function rateStar(n) {
  document.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('active', i < n));
}

// ── WIZARD ────────────────────────────────────────────────────────────────────
const wizardDefs = ['Tipo de Solicitação', 'Detalhes', 'Arquivos', 'Revisão'];

function initWizard() { wizardStep = 0; newTicketData = {}; renderWizard(); }

function renderWizard() {
  document.getElementById('wizardSteps').innerHTML = wizardDefs.map((d, i) => {
    let cls = '';
    if (i < wizardStep)  cls = 'done';
    if (i === wizardStep) cls = 'active';
    return `<div class="wstep ${cls}"><div class="wstep-num">${i < wizardStep ? '✓' : i + 1}</div><span>${d}</span></div>`;
  }).join('');

  const c = document.getElementById('wizardContent');

  if (wizardStep === 0) {
    const macroSelecionado = newTicketData.kpiMacro || '';
    const subOpcoes = macroSelecionado ? indicadoresKPI[macroSelecionado] : [];

    c.innerHTML = `
      <div class="wizard-card">
        <div class="wizard-card-title">Qual tipo de solicitação?</div>
        <div class="wizard-card-sub">Selecione a categoria para direcionar ao especialista correto.</div>
        <div class="type-grid" style="grid-template-columns:1fr 1fr 1fr">
          <div class="type-card ${newTicketData.type === 'SISTEMAS' ? 'selected' : ''}" onclick="selectType('SISTEMAS',this)">
            <div class="type-card-icon">🖥️</div>
            <div class="type-card-title">Sistemas</div>
            <div class="type-card-sub">SAP, IBID, ARIBA e outros</div>
          </div>
          <div class="type-card ${newTicketData.type === 'KPIs' ? 'selected' : ''}" onclick="selectType('KPIs',this)">
            <div class="type-card-icon">📊</div>
            <div class="type-card-title">KPI</div>
            <div class="type-card-sub">Indicador existente com problema</div>
          </div>
          <div class="type-card ${newTicketData.type === 'NOVO_INDICADOR' ? 'selected' : ''}" onclick="selectType('NOVO_INDICADOR',this)">
            <div class="type-card-icon">📐</div>
            <div class="type-card-title">Novo Indicador</div>
            <div class="type-card-sub">Solicitar criação de KPI</div>
          </div>
        </div>

        ${newTicketData.type === 'SISTEMAS' ? `
          <div class="form-group-full">
            <label class="form-label">Sistema específico</label>
            <select class="form-select" onchange="
              newTicketData.system = this.value;
              const outroBox = document.getElementById('outroSistemaBox');
              if (this.value === 'Outro') {
                outroBox.style.display = 'block';
                newTicketData.system = '';
              } else {
                outroBox.style.display = 'none';
                newTicketData.sistemaCustom = '';
              }
            ">
              <option value="">Selecione...</option>
              <option ${newTicketData.system==='SAP'  ?'selected':''}>SAP</option>
              <option ${newTicketData.system==='ARIBA'?'selected':''}>ARIBA</option>
              <option ${newTicketData.system==='IBID' ?'selected':''}>IBID</option>
              <option ${newTicketData.system==='Outro'?'selected':''}>Outro</option>
            </select>
            <div id="outroSistemaBox" style="display:${newTicketData.system===''&&newTicketData.sistemaCustom?'block':'none'};margin-top:10px;">
              <input class="form-input"
                placeholder="Qual sistema? Ex: Power BI, Oracle, Protheus..."
                value="${newTicketData.sistemaCustom || ''}"
                oninput="newTicketData.sistemaCustom=this.value; newTicketData.system=this.value;" />
            </div>
          </div>` : ''}

        ${newTicketData.type === 'KPIs' ? `
          <div class="form-group-full">
            <label class="form-label">Painel / Dashboard</label>
            <select class="form-select" onchange="
              newTicketData.kpiMacro = this.value;
              newTicketData.kpiSub   = '';
              newTicketData.system   = this.value;
              renderWizard();
            ">
              <option value="">Selecione o painel...</option>
              ${Object.keys(indicadoresKPI).map(k =>
                `<option value="${k}" ${macroSelecionado===k?'selected':''}>${k}</option>`
              ).join('')}
            </select>
          </div>

          ${macroSelecionado ? `
          <div class="form-group-full">
            <label class="form-label">Indicador específico</label>
            <select class="form-select" onchange="newTicketData.kpiSub=this.value; newTicketData.system=newTicketData.kpiMacro+' › '+this.value;">
              <option value="">Selecione o indicador...</option>
              ${subOpcoes.map(s =>
                `<option value="${s}" ${newTicketData.kpiSub===s?'selected':''}>${s}</option>`
              ).join('')}
            </select>
          </div>` : ''}
        ` : ''}

        <div class="wizard-actions">
          <span></span>
          <button class="btn btn-blue" onclick="wizNext()" ${!newTicketData.type ? 'disabled' : ''}>Próximo →</button>
        </div>
      </div>`;
  }

  if (wizardStep === 1) {
    const isNovoIndicador = newTicketData.type === 'NOVO_INDICADOR';

    const camposBase = `
      <div class="form-group-full">
        <label class="form-label">Título *</label>
        <input class="form-input" placeholder="${isNovoIndicador ? 'Ex: Indicador de Giro de Estoque MRO' : 'Ex: Erro ao gerar relatório no SAP'}"
          value="${newTicketData.title || ''}" oninput="newTicketData.title=this.value"/>
      </div>
      <div class="form-row">
        <div>
          <label class="form-label">Unidade de Negócio *</label>
          <select class="form-select" onchange="newTicketData.bu=this.value">
            <option value="">Selecione a BU...</option>
            <option value="BSP">BSP</option>
            <option value="BSPF">BSPF</option>
            <option value="BPN">BPN</option>
            <option value="BSC">BSC</option>
            <option value="BSCF">BSCF</option>
            <option value="MSFC">MSFC</option>
          </select>
        </div>
        <div>
          <label class="form-label">Prioridade</label>
          <select class="form-select" onchange="newTicketData.priority=this.value">
            <option>Baixa</option><option>Normal</option><option>Alta</option><option>Crítica</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div>
          <label class="form-label">Área</label>
          <select class="form-select" onchange="newTicketData.area=this.value">
            <option value="">Selecione...</option>
            <optgroup label="── Suprimentos ──">
              <option>Capex</option>
              <option>Forestry Maint &amp; Harverst Services</option>
              <option>Forestry Service Silv. &amp; Viveiro</option>
              <option>Import</option>
              <option>MRO Forestry</option>
              <option>MRO Industry</option>
              <option>Planning MRO</option>
              <option>Processes and Governance</option>
              <option>Procurement Strategic MRO/SV + PSS</option>
              <option>Raw Material Forestry</option>
              <option>Raw Material Industry</option>
              <option>Services Industry</option>
              <option>Services Logistic Outbound/ Adm</option>
              <option>Systems &amp; KPIs</option>
            </optgroup>
            <optgroup label="── Outras Áreas ──">
              <option>Comercial</option>
              <option>Financeiro</option>
              <option>Logística</option>
              <option>RH</option>
              <option>TI</option>
            </optgroup>
          </select>
        </div>
      </div>`;

    const camposNovoIndicador = isNovoIndicador ? `
      <div style="background:var(--blue-pale);border-radius:8px;padding:12px 16px;margin-bottom:16px;border-left:3px solid #0E49A4">
        <div style="font-size:12px;font-weight:700;color:#0E49A4;margin-bottom:2px">📐 Formulário de Novo Indicador</div>
        <div style="font-size:11px;color:#0E49A4;opacity:.8">Preencha com o máximo de detalhes — isso garante que o COE execute sem idas e voltas.</div>
      </div>

      <div class="form-group-full">
        <label class="form-label">🎯 Objetivo do Indicador *</label>
        <textarea class="form-textarea" style="min-height:75px"
          placeholder="O que este indicador deve medir? Qual decisão ele apoia?"
          oninput="newTicketData.objetivo=this.value">${newTicketData.objetivo||''}</textarea>
      </div>

      <div class="form-group-full">
        <label class="form-label">📋 Premissas</label>
        <textarea class="form-textarea" style="min-height:75px"
          placeholder="Quais são as condições e considerações assumidas para o cálculo? Ex: Considera apenas pedidos aprovados, exclui cancelamentos..."
          oninput="newTicketData.premissas=this.value">${newTicketData.premissas||''}</textarea>
      </div>

      <div class="form-group-full">
        <label class="form-label">⚙️ Regras de Negócio *</label>
        <div style="border:2px solid #0E49A4;border-radius:10px;overflow:hidden">
          <!-- Cabeçalho azul -->
          <div style="background:#0E49A4;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
            <div>
              <div style="color:#fff;font-weight:700;font-size:13px">📄 Template de Regras de Negócio</div>
              <div style="color:rgba(255,255,255,.7);font-size:11px;margin-top:2px">Baixe, preencha e faça o upload do documento</div>
            </div>
            <button onclick="downloadTemplateRegras()"
              style="background:#ACDC64;color:#2d4a00;padding:8px 16px;border-radius:7px;font-size:12px;font-weight:700;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap">
              ⬇️ Baixar Template
            </button>
          </div>

          <!-- Área de upload -->
          <div style="padding:14px 16px;background:#F8FAF8">
            <div id="uploadRegrasBox" style="border:2px dashed #cbd5e1;border-radius:8px;padding:20px;text-align:center;cursor:pointer;transition:all .2s"
              onclick="document.getElementById('uploadRegrasInput').click()"
              ondragover="event.preventDefault();this.style.borderColor='#0E49A4';this.style.background='#dce8f8'"
              ondragleave="this.style.borderColor='#cbd5e1';this.style.background='transparent'"
              ondrop="handleRegrasUpload(event)">
              <div id="uploadRegrasInfo">
                <div style="font-size:26px;margin-bottom:6px">📎</div>
                <div style="font-size:13px;font-weight:600;color:#475569;margin-bottom:3px">Clique ou arraste o arquivo aqui</div>
                <div style="font-size:11px;color:#94a3b8">Arquivo .docx preenchido com as regras de negócio</div>
              </div>
            </div>
            <input type="file" id="uploadRegrasInput" accept=".docx,.doc,.pdf"
              style="display:none" onchange="handleRegrasInputChange(this)"/>
            <div id="uploadRegrasNome" style="display:none;margin-top:10px;padding:8px 12px;background:#edf8cc;border-radius:7px;display:flex;align-items:center;gap:8px;font-size:12px;color:#2d4a00;font-weight:600">
              ✅ <span id="uploadRegrasNomeTexto"></span>
              <button onclick="limparRegras()" style="margin-left:auto;background:none;border:none;color:#dc2626;cursor:pointer;font-size:12px;font-weight:700">✕ Remover</button>
            </div>
          </div>
        </div>
        <div style="font-size:11px;color:#94a3b8;margin-top:6px">* Obrigatório — preencha o template e faça o upload antes de prosseguir.</div>
      </div>

      <div class="form-row">
        <div>
          <label class="form-label">🔄 Frequência de Atualização</label>
          <select class="form-select" onchange="newTicketData.frequencia=this.value">
            <option value="">Selecione...</option>
            <option>Tempo real</option>
            <option>Diária</option>
            <option>Semanal</option>
            <option>Quinzenal</option>
            <option>Mensal</option>
          </select>
        </div>
        <div>
          <label class="form-label">📅 Prazo Desejado</label>
          <input class="form-input" type="date"
            value="${newTicketData.prazo||''}" oninput="newTicketData.prazo=this.value"/>
        </div>
      </div>` : `
      <div class="form-group-full">
        <label class="form-label">Descrição *</label>
        <textarea class="form-textarea"
          placeholder="Descreva o problema com detalhes: quando ocorreu, qual erro apareceu..."
          oninput="newTicketData.description=this.value">${newTicketData.description||''}</textarea>
      </div>`;

    c.innerHTML = `
      <div class="wizard-card">
        <div class="wizard-card-title">${isNovoIndicador ? '📐 Detalhes do Novo Indicador' : 'Detalhes da Solicitação'}</div>
        <div class="wizard-card-sub">${isNovoIndicador ? 'Quanto mais detalhes você fornecer, mais rápido e certeiro será o desenvolvimento.' : 'Quanto mais detalhes, mais rápido o atendimento.'}</div>
        ${camposBase}
        ${camposNovoIndicador}
        <div class="wizard-actions">
          <button class="btn btn-outline" onclick="wizBack()">← Voltar</button>
          <button class="btn btn-blue" onclick="wizNext()">Próximo →</button>
        </div>
      </div>`;
  }

  if (wizardStep === 2) {
    const temAnexo = !!newTicketData.anexoNome;
    c.innerHTML = `
      <div class="wizard-card">
        <div class="wizard-card-title">Anexar Arquivos</div>
        <div class="wizard-card-sub">Adicione prints, logs ou planilhas que ajudem o COE a entender o problema. (opcional)</div>

        <div id="uploadGeralBox"
          style="border:2px dashed ${temAnexo ? '#ACDC64' : 'var(--gray3)'};border-radius:8px;padding:28px;text-align:center;cursor:pointer;transition:all .2s;background:${temAnexo ? '#edf8cc' : 'transparent'}"
          onclick="document.getElementById('uploadGeralInput').click()"
          ondragover="event.preventDefault();this.style.borderColor='#0E49A4';this.style.background='var(--blue-pale)'"
          ondragleave="this.style.borderColor='${temAnexo ? '#ACDC64' : 'var(--gray3)'}';this.style.background='${temAnexo ? '#edf8cc' : 'transparent'}'"
          ondrop="handleGeralDrop(event)">
          ${temAnexo
            ? `<div style="font-size:26px;margin-bottom:6px">✅</div>
               <div style="font-size:13px;font-weight:700;color:#2d4a00;margin-bottom:3px">${newTicketData.anexoNome}</div>
               <div style="font-size:11px;color:#4a6e00">Clique para substituir o arquivo</div>`
            : `<div style="font-size:28px;margin-bottom:8px">📎</div>
               <div style="font-size:13px;font-weight:600;color:var(--gray5);margin-bottom:4px">Clique ou arraste o arquivo aqui</div>
               <div style="font-size:11px;color:var(--gray4)">PNG, JPG, PDF, XLSX, DOCX — até 20MB</div>`
          }
        </div>
        <input type="file" id="uploadGeralInput" accept=".png,.jpg,.jpeg,.pdf,.xlsx,.xls,.docx,.doc"
          style="display:none" onchange="handleGeralInput(this)"/>

        ${temAnexo ? `
          <div style="margin-top:10px;display:flex;justify-content:flex-end">
            <button onclick="limparAnexoGeral()" class="btn btn-outline btn-sm" style="color:var(--red);border-color:var(--red)">
              ✕ Remover anexo
            </button>
          </div>` : ''}

        <div class="wizard-actions">
          <button class="btn btn-outline" onclick="wizBack()">← Voltar</button>
          <button class="btn btn-blue" onclick="wizNext()">Próximo →</button>
        </div>
      </div>`;
  }

  if (wizardStep === 3) {
    const sla = getSLA(newTicketData.type, newTicketData.priority);
    const isNovo = newTicketData.type === 'NOVO_INDICADOR';

    const camposRevisao = isNovo ? `
      ${infoRow('Tipo', '📐 Novo Indicador')}
      ${infoRow('Unidade de Negócio', newTicketData.bu || '—')}
      ${infoRow('Título', newTicketData.title || '—')}
      ${infoRow('Área', newTicketData.area || '—')}
      ${infoRow('Prioridade', newTicketData.priority || 'Normal')}
      ${infoRow('SLA estimado', `<span class="sla-badge sla-ok">${sla}</span>`)}
      ${infoRow('Frequência', newTicketData.frequencia || '—')}
      ${infoRow('Prazo Desejado', newTicketData.prazo || '—')}
      ${infoRow('Regras de Negócio', newTicketData.regrasArquivoNome
          ? `<span style="color:#4a6e00;font-weight:700">📎 ${newTicketData.regrasArquivoNome}</span>`
          : '<span style="color:var(--red)">⚠ Não anexado</span>')}
      ${infoRow('Solicitante', currentUser.name)}
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--gray3)">
        ${newTicketData.objetivo  ? `<div style="margin-bottom:10px"><div style="font-size:11px;font-weight:700;color:var(--gray5);text-transform:uppercase;margin-bottom:3px">Objetivo</div><div style="font-size:13px;color:var(--gray7)">${newTicketData.objetivo}</div></div>` : ''}
        ${newTicketData.premissas ? `<div><div style="font-size:11px;font-weight:700;color:var(--gray5);text-transform:uppercase;margin-bottom:3px">Premissas</div><div style="font-size:13px;color:var(--gray7)">${newTicketData.premissas}</div></div>` : ''}
      </div>` : `
      ${infoRow('Tipo', newTicketData.type || '—')}
      ${infoRow('Unidade de Negócio', newTicketData.bu || '—')}
      ${infoRow('Título', newTicketData.title || '—')}
      ${infoRow('Prioridade', newTicketData.priority || 'Normal')}
      ${infoRow('SLA estimado', `<span class="sla-badge sla-ok">${sla}</span>`)}
      ${infoRow('Solicitante', currentUser.name)}`;

    c.innerHTML = `
      <div class="wizard-card">
        <div class="wizard-card-title">✅ Revisão e Envio</div>
        <div class="wizard-card-sub">Confirme os dados antes de enviar.</div>
        <div style="background:#F8FAF8;border-radius:8px;padding:16px;margin-bottom:18px;border:1px solid var(--gray3)">
          ${camposRevisao}
        </div>
        <div style="background:var(--blue-pale);border-radius:8px;padding:12px 14px;font-size:12px;color:#0E49A4;border:1px solid #bfdbfe;margin-bottom:4px">
          📧 Você receberá um e-mail de confirmação com o protocolo após o envio.
        </div>
        <div class="wizard-actions">
          <button class="btn btn-outline" onclick="wizBack()">← Voltar</button>
          <button class="btn btn-green"   onclick="submitTicket()">📤 Enviar Chamado</button>
        </div>
      </div>`;
  }
}

function handleGeralDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) aplicarAnexoGeral(file);
  event.currentTarget.style.borderColor = 'var(--gray3)';
  event.currentTarget.style.background  = 'transparent';
}

function handleGeralInput(input) {
  if (input.files[0]) aplicarAnexoGeral(input.files[0]);
}

function aplicarAnexoGeral(file) {
  if (file.size > 20 * 1024 * 1024) {
    showToast('warning', '⚠️ Arquivo muito grande', 'O limite é 20MB.'); return;
  }
  newTicketData.anexoNome = file.name;
  const reader = new FileReader();
  reader.onload = e => {
    newTicketData.anexoData = e.target.result;
    showToast('success', '📎 Arquivo anexado', file.name);
    renderWizard(); // re-renderiza para mostrar o arquivo
  };
  reader.readAsDataURL(file);
}

function limparAnexoGeral() {
  newTicketData.anexoNome = '';
  newTicketData.anexoData = null;
  renderWizard();
}

function handleRegrasUpload(event) {
  event.preventDefault();
  event.currentTarget.style.borderColor = '#cbd5e1';
  event.currentTarget.style.background  = 'transparent';
}

function handleRegrasInputChange(input) {
  if (input.files[0]) aplicarArquivoRegras(input.files[0]);
}

function aplicarArquivoRegras(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['docx','doc','pdf'].includes(ext)) {
    showToast('warning', '⚠️ Formato inválido', 'Use .docx, .doc ou .pdf'); return;
  }
  newTicketData.regrasArquivo     = file;
  newTicketData.regrasArquivoNome = file.name;

  // Converter para base64 para persistir no ticket
  const reader = new FileReader();
  reader.onload = e => { newTicketData.regrasArquivoData = e.target.result; };
  reader.readAsDataURL(file);

  const nomeEl = document.getElementById('uploadRegrasNome');
  const textoEl = document.getElementById('uploadRegrasNomeTexto');
  const boxEl   = document.getElementById('uploadRegrasBox');
  if (nomeEl && textoEl && boxEl) {
    textoEl.textContent    = file.name;
    nomeEl.style.display   = 'flex';
    boxEl.style.borderColor = '#ACDC64';
    boxEl.style.background  = '#edf8cc';
  }
  showToast('success', '📎 Arquivo anexado', file.name);
}

function limparRegras() {
  newTicketData.regrasArquivo     = null;
  newTicketData.regrasArquivoNome = '';
  const nomeEl = document.getElementById('uploadRegrasNome');
  const boxEl  = document.getElementById('uploadRegrasBox');
  const input  = document.getElementById('uploadRegrasInput');
  if (nomeEl) nomeEl.style.display   = 'none';
  if (boxEl)  { boxEl.style.borderColor = '#cbd5e1'; boxEl.style.background = 'transparent'; }
  if (input)  input.value = '';
}
function selectType(type, el) {
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  newTicketData.type = type;
  if (type === 'KPIs') newTicketData.system = 'Indicadores';
  if (type === 'NOVO_INDICADOR') { newTicketData.system = 'Novo Indicador'; newTicketData.kpiMacro = ''; newTicketData.kpiSub = ''; }
  renderWizard();
}
function wizNext() {
  if (wizardStep === 0) {
    if (newTicketData.type === 'SISTEMAS') {
      const outroAberto = document.getElementById('outroSistemaBox') &&
                          document.getElementById('outroSistemaBox').style.display === 'block';
      if (!newTicketData.system && !outroAberto) {
        showToast('warning', '⚠️ Campo obrigatório', 'Selecione o sistema específico.'); return;
      }
      if (outroAberto && !newTicketData.sistemaCustom) {
        showToast('warning', '⚠️ Campo obrigatório', 'Especifique o nome do sistema.'); return;
      }
    }
    if (newTicketData.type === 'KPIs') {
      if (!newTicketData.kpiMacro) {
        showToast('warning', '⚠️ Campo obrigatório', 'Selecione o painel / dashboard.'); return;
      }
      if (!newTicketData.kpiSub) {
        showToast('warning', '⚠️ Campo obrigatório', 'Selecione o indicador específico.'); return;
      }
    }
  }
  if (wizardStep === 1 && newTicketData.type === 'NOVO_INDICADOR') {
    if (!newTicketData.bu)             { showToast('warning', '⚠️ Obrigatório', 'Selecione a Unidade de Negócio.'); return; }
    if (!newTicketData.title)          { showToast('warning', '⚠️ Obrigatório', 'Informe o título do indicador.'); return; }
    if (!newTicketData.objetivo)       { showToast('warning', '⚠️ Obrigatório', 'Informe o objetivo do indicador.'); return; }
    if (!newTicketData.regrasArquivo)  { showToast('warning', '⚠️ Obrigatório', 'Faça o upload do Template de Regras de Negócio preenchido.'); return; }
  }
  if (wizardStep < 3) { wizardStep++; renderWizard(); }
}
function wizBack() { if (wizardStep > 0) { wizardStep--; renderWizard(); } }

// ── SUBMISSÃO ─────────────────────────────────────────────────────────────────
function submitTicket() {
  if (!newTicketData.title || !newTicketData.type) {
    showToast('warning', '⚠️ Incompleto', 'Preencha tipo e título.');
    return;
  }
  const proto       = 'COE-2025-00' + (tickets.length + 1);
  const prio        = newTicketData.priority || 'Normal';
  const sla         = getSLA(newTicketData.type, prio);
  const solicitante = usuarios[currentRole];

  // ── Roteamento automático por tipo/sistema ────────────────────────────────
  let responsavel;
  if (newTicketData.type === 'KPIs' || newTicketData.type === 'NOVO_INDICADOR') {
    responsavel = responsaveisPorTipo['KPIs'];
  } else {
    // SISTEMAS — roteia pelo sistema específico
    const sistema = newTicketData.sistemaCustom || newTicketData.system || '';
    responsavel = responsaveisPorSistema[sistema] || responsavelDefault;
  }
  // ─────────────────────────────────────────────────────────────────────────

  const descricaoFinal = newTicketData.type === 'NOVO_INDICADOR'
    ? [
        newTicketData.objetivo    ? `🎯 OBJETIVO:\n${newTicketData.objetivo}`         : '',
        newTicketData.premissas   ? `📋 PREMISSAS:\n${newTicketData.premissas}`       : '',
        newTicketData.regras      ? `⚙️ REGRAS DE NEGÓCIO:\n${newTicketData.regras}` : '',
        newTicketData.frequencia  ? `🔄 Frequência: ${newTicketData.frequencia}`     : '',
        newTicketData.prazo       ? `📅 Prazo Desejado: ${newTicketData.prazo}`      : '',
      ].filter(Boolean).join('\n\n')
    : (newTicketData.description || '(sem descrição)');

  tickets.unshift({
    id: proto, title: newTicketData.title, type: newTicketData.type,
    system: newTicketData.system || newTicketData.type, priority: prio,
    status:'aberto', sla:'ok', responsible: responsavel.nome,
    owner: solicitante.nome, created: now(),
    area: newTicketData.area || 'Não informada',
    bu:   newTicketData.bu   || '—',
    anexos: [
      ...(newTicketData.regrasArquivoData ? [{ nome: newTicketData.regrasArquivoNome, data: newTicketData.regrasArquivoData }] : []),
      ...(newTicketData.anexoData         ? [{ nome: newTicketData.anexoNome,         data: newTicketData.anexoData         }] : []),
    ],
    description: descricaoFinal, flowStep: 1,
    timeline:[
      { actor:'Sistema', icon:'🤖', color:'blue', time: now(), text:`Chamado criado. Protocolo ${proto} gerado.` },
      { actor:'Sistema', icon:'⚙️', color:'blue', time: now(), text:`Classificado como ${newTicketData.type}. Prioridade: ${prio}. SLA: ${sla}.` },
      { actor:'Sistema', icon:'📨', color:'gray', time: now(), text:`E-mail de confirmação enviado para ${solicitante.nome} e ${responsavel.nome}.` },
    ]
  });

  notifs.unshift({ icon:'📨', title:`Chamado ${proto} aberto`, text:'Seu chamado foi recebido com sucesso!', time:'Agora mesmo', read: false });
  document.getElementById('badge-notifs').style.display = 'inline';

  const params = {
    protocolo: proto, titulo: newTicketData.title, prioridade: prio, sla,
    solicitante_nome: solicitante.nome, responsavel_nome: responsavel.nome,
  };

  try {
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_SOLICITANTE, { ...params, to_name: solicitante.nome, to_email: solicitante.email })
      .then(() => showToast('success', '📧 E-mail enviado', `Confirmação enviada para ${solicitante.email}`))
      .catch(err => console.error('Erro e-mail solicitante:', err));

    if (responsavel.email) {
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_RESPONSAVEL, { ...params, to_name: responsavel.nome, to_email: responsavel.email })
        .then(() => showToast('success', '📧 E-mail enviado', `Notificação enviada para ${responsavel.email}`))
        .catch(err => console.error('Erro e-mail responsável:', err));
    }
  } catch(e) { console.warn('EmailJS indisponível:', e); }

  showToast('success', `✅ Chamado ${proto} aberto!`, `SLA: ${sla}`);
  atualizarBadgeMeus();
  atualizarBadgeFila();
  navTo('meus', document.getElementById('nav-meus'));
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function getSLA(type, prio) {
  if (prio === 'Crítica') return 'até 8 horas úteis';
  if (prio === 'Alta')    return '3 a 5 dias úteis';
  if (prio === 'Baixa')   return '10 dias úteis';
  return '7 a 10 dias úteis'; // Normal
}

function statusBadge(s) {
  const map = {
    aberto:               ['badge-aberto',     'Aberto'],
    andamento:            ['badge-andamento',  'Em andamento'],
    aguardando:           ['badge-aguardando', 'Aguardando info.'],
    resolvido:            ['badge-resolvido',  'Resolvido'],
    fechado:              ['badge-fechado',    'Fechado'],
    cancelado:            ['badge-cancelado',  'Cancelado'],
    emandamento:          ['badge-andamento',  'Em andamento'],
    aguardandoinformações:['badge-aguardando', 'Aguardando info.'],
  };
  const key = s.toLowerCase().replace(/\s+/g, '');
  const [cls, label] = map[key] || ['badge-fechado', s];
  return `<span class="badge ${cls}">${label}</span>`;
}

function slaBadge(s) {
  const map = { ok:['sla-ok','✓ OK'], warn:['sla-warn','⚠ Atenção'], breach:['sla-breach','✗ Vencido'] };
  const [cls, label] = map[s] || ['sla-ok', s];
  return `<span class="sla-badge ${cls}">${label}</span>`;
}

function now() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function showToast(type, title, text) {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = { success:'✅', warning:'⚠️', info:'ℹ️', error:'❌' };
  t.innerHTML = `<div class="toast-icon">${icons[type] || 'ℹ️'}</div><div><div class="toast-title">${title}</div><div class="toast-text">${text}</div></div>`;
  c.appendChild(t);
  setTimeout(() => {
    t.style.opacity   = '0';
    t.style.transform = 'translateX(40px)';
    t.style.transition = 'all .3s';
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});