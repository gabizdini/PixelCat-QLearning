(() => {
  'use strict';

  /* =========================================================
     1. DEFINIÇÃO DOS PERSONAGENS (PIXEL ART 16x16 ORIGINAL)
     Nota: A escolha visual muda o personagem e suas cores,
     sem alterar o funcionamento do algoritmo Q-Learning.
  ========================================================= */
  const SPRITE_FRAMES = {
    run1: [
      '....HH....HH....',
      '...HBBH..HBBH...',
      '...HBBBBBBBBH...',
      '..HBBBBBBBBBBH..',
      '..HBEEBBBBEEBH..',
      '..HBBBNBBBNBBH..',
      '...HBBBBBBBBH...',
      '..CCBBBBBBBBCC..',
      '.CC.HBBBBBBH....',
      '....HBBBBBBH..TT',
      '...HBBBBBBBBHTT.',
      '...HBBBBBBBBHT..',
      '....HBB..BBH....',
      '...HBB....BBH...',
      '...PP......PP...',
      '................'
    ],
    run2: [
      '....HH....HH....',
      '...HBBH..HBBH...',
      '...HBBBBBBBBH...',
      '..HBBBBBBBBBBH..',
      '..HBEEBBBBEEBH..',
      '..HBBBNBBBNBBH..',
      '...HBBBBBBBBH...',
      '..CCBBBBBBBBCC..',
      '....HBBBBBBH.TT.',
      '....HBBBBBBHTT..',
      '...HBBBBBBBBH...',
      '...HBBBBBBBBH...',
      '.....HBB.BBH....',
      '.....PP...PP....',
      '................',
      '................'
    ],
    jump: [
      '....HH....HH....',
      '...HBBH..HBBH...',
      '...HBBBBBBBBH...',
      '..HBBBBBBBBBBH..',
      '..HBEEBBBBEEBH..',
      '..HBBBNBBBNBBH..',
      '...HBBBBBBBBH...',
      '..CCBBBBBBBBCC..',
      '.CC.HBBBBBBH..TT',
      '....HBBBBBBHTT..',
      '...HBBBBBBBBH...',
      '..PPBBBBBBBBPP..',
      '..PP........PP..',
      '................',
      '................',
      '................'
    ],
    hit: [
      '....HH....HH....',
      '...HBBH..HBBH...',
      '...HBBBBBBBBH...',
      '..HBBBBBBBBBBH..',
      '..HBXXBBBBXXBH..',
      '..HBBBNBBBNBBH..',
      '...HBBBBBBBBH...',
      '..CCBBBBBBBBCC..',
      '....HBBBBBBH....',
      '...HBBBBBBBBH.TT',
      '..THBBBBBBBBHT..',
      '....HBB..BBH....',
      '...PP......PP...',
      '................',
      '................',
      '................'
    ]
  };

  // Variações exclusivas de detalhes por personagem (sobreposição 16x16)
  const CHARACTERS = [
    {
      id: 'frajola',
      name: 'Gato Ernesto Explorador',
      shortName: 'Frajola',
      tag: 'Aventureiro',
      tagBg: '#E0F2FE',
      tagColor: '#0369A1',
      cardBg: '#F0F9FF',
      accent: '#38BDF8',
      description: 'Preto e branco com lenço turquesa e espírito desbravador.',
      palette: {
        H: '#181424', // contorno/preto
        B: '#1F1A2E', // pelo escuro
        C: '#38BDF8', // lenço explorador
        E: '#34D399', // olhos esmeralda
        N: '#F472B6', // focinho rosa
        T: '#1F1A2E', // rabo
        P: '#FFFFFF', // patinhas brancas
        X: '#EF4444'  // olho colisão
      },
      patchPixels: [
        // Manchinha branca no rosto e peito estilo frajola + aba de chapéu
        { x: 5, y: 1, c: '#C88A4B' }, { x: 6, y: 1, c: '#C88A4B' }, { x: 7, y: 1, c: '#C88A4B' },
        { x: 8, y: 1, c: '#C88A4B' }, { x: 9, y: 1, c: '#C88A4B' }, { x: 10, y: 1, c: '#C88A4B' },
        { x: 7, y: 5, c: '#FFFFFF' }, { x: 8, y: 5, c: '#FFFFFF' },
        { x: 6, y: 6, c: '#FFFFFF' }, { x: 7, y: 6, c: '#FFFFFF' }, { x: 8, y: 6, c: '#FFFFFF' }, { x: 9, y: 6, c: '#FFFFFF' },
        { x: 6, y: 8, c: '#FFFFFF' }, { x: 7, y: 8, c: '#FFFFFF' }, { x: 8, y: 8, c: '#FFFFFF' }, { x: 9, y: 8, c: '#FFFFFF' },
        { x: 6, y: 9, c: '#FFFFFF' }, { x: 7, y: 9, c: '#FFFFFF' }, { x: 8, y: 9, c: '#FFFFFF' }, { x: 9, y: 9, c: '#FFFFFF' }
      ]
    },
    {
      id: 'tricolor',
      name: 'Gata Mel Raivosa',
      shortName: 'Tricolor',
      tag: 'Determinada',
      tagBg: '#FFEDD5',
      tagColor: '#C2410C',
      cardBg: '#FFF7ED',
      accent: '#F97316',
      description: 'Manchas laranja e pretas, sobrancelha franzida e muita atitude.',
      palette: {
        H: '#3E2723',
        B: '#FFFDF8', // base branca
        C: '#F97316', // laranja
        E: '#F59E0B', // olhos âmbar
        N: '#FB7185', // focinho
        T: '#F97316', // rabo laranja
        P: '#272038', // patinhas escuras
        X: '#DC2626'
      },
      patchPixels: [
        // Manchas tricolor + sobrancelha "raivosa"
        { x: 4, y: 2, c: '#F97316' }, { x: 5, y: 2, c: '#F97316' }, { x: 6, y: 2, c: '#F97316' },
        { x: 10, y: 2, c: '#272038' }, { x: 11, y: 2, c: '#272038' },
        { x: 10, y: 3, c: '#272038' }, { x: 11, y: 3, c: '#272038' },
        { x: 4, y: 3, c: '#272038' }, { x: 5, y: 3, c: '#F97316' }, // sobrancelha esquerda
        { x: 10, y: 3, c: '#272038' }, // sobrancelha direita
        { x: 5, y: 9, c: '#F97316' }, { x: 6, y: 9, c: '#F97316' },
        { x: 9, y: 10, c: '#272038' }, { x: 10, y: 10, c: '#272038' }
      ]
    },
    {
      id: 'preto',
      name: 'Gato Pretinho Curioso',
      shortName: 'Gato Preto',
      tag: 'Observador',
      tagBg: '#F3E8FF',
      tagColor: '#6B21A8',
      cardBg: '#FAF5FF',
      accent: '#B69AE8',
      description: 'Olhos dourados arregalados e coleira verde sempre atento ao perigo.',
      palette: {
        H: '#130E1F',
        B: '#231A38',
        C: '#3ecc3a', // coleira lilás
        E: '#FDE047', // olhos bem brilhantes
        N: '#E8A5C8',
        T: '#231A38',
        P: '#2F234B',
        X: '#F43F5E'
      },
      patchPixels: [
        // Orelha interna lilás e guizo dourado na coleira
        { x: 4, y: 1, c: '#B69AE8' }, { x: 11, y: 1, c: '#B69AE8' },
        { x: 4, y: 4, c: '#FDE047' }, { x: 11, y: 4, c: '#FDE047' }, // olhos maiores
        { x: 7, y: 7, c: '#FACC15' }, { x: 8, y: 7, c: '#FACC15' }    // guizo
      ]
    },
    {
      id: 'laranja',
      name: 'Gato Raia Cientista',
      shortName: 'Cientista',
      tag: 'Estrategista',
      tagBg: '#FCE7F3',
      tagColor: '#9D174D',
      cardBg: '#FDF2F8',
      accent: '#FB923C',
      description: 'Tigrado com óculos de laboratório, calculando recompensas futuras.',
      palette: {
        H: '#9A3412',
        B: '#FB923C',
        C: '#FFFFFF', // jaleco branco
        E: '#38BDF8', // lentes azuis
        N: '#F43F5E',
        T: '#EA580C',
        P: '#FFEDD5',
        X: '#DC2626'
      },
      patchPixels: [
        // Listras e armação de óculos
        { x: 7, y: 2, c: '#C2410C' }, { x: 8, y: 2, c: '#C2410C' },
        { x: 3, y: 4, c: '#312E81' }, { x: 6, y: 4, c: '#312E81' },
        { x: 7, y: 4, c: '#312E81' }, { x: 8, y: 4, c: '#312E81' },
        { x: 9, y: 4, c: '#312E81' }, { x: 12, y: 4, c: '#312E81' },
        { x: 7, y: 8, c: '#FFFFFF' }, { x: 8, y: 8, c: '#FFFFFF' },
        { x: 7, y: 9, c: '#FFFFFF' }, { x: 8, y: 9, c: '#FFFFFF' },
        { x: 7, y: 10, c: '#7952A0' } // gravata roxa
      ]
    }
  ];

  function drawPixelCharacter(ctx, charObj, frameKey, x, y, pixelSize) {
    const lines = SPRITE_FRAMES[frameKey] || SPRITE_FRAMES.run1;
    const palette = charObj.palette;

    for (let row = 0; row < lines.length; row++) {
      const line = lines[row];
      for (let col = 0; col < line.length; col++) {
        const ch = line[col];
        if (ch === '.') continue;
        const color = palette[ch];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(
          Math.round(x + col * pixelSize),
          Math.round(y + row * pixelSize),
          pixelSize,
          pixelSize
        );
      }
    }

    // Aplica manchas/acessórios apenas nos frames em pé/correndo/pulando
    if (charObj.patchPixels) {
      for (let i = 0; i < charObj.patchPixels.length; i++) {
        const px = charObj.patchPixels[i];
        // Em colisão não sobrescreve olhos em X
        if (frameKey === 'hit' && px.y === 4 && (px.x === 4 || px.x === 5 || px.x === 10 || px.x === 11)) {
          continue;
        }
        ctx.fillStyle = px.c;
        ctx.fillRect(
          Math.round(x + px.x * pixelSize),
          Math.round(y + px.y * pixelSize),
          pixelSize,
          pixelSize
        );
      }
    }
  }

  /* =========================================================
     2. ALGORITMO Q-LEARNING VERDADEIRO
  ========================================================= */
  const STATES = [
    'LONGE_CHAO',
    'MEDIA_CHAO',
    'PERTO_CHAO',
    'LONGE_AR',
    'MEDIA_AR',
    'PERTO_AR'
  ];

  const STATE_LABELS = {
    LONGE_CHAO: 'LONGE | NO CHÃO',
    MEDIA_CHAO: 'MÉDIA | NO CHÃO',
    PERTO_CHAO: 'PERTO | NO CHÃO',
    LONGE_AR:   'LONGE | NO AR',
    MEDIA_AR:   'MÉDIA | NO AR',
    PERTO_AR:   'PERTO | NO AR'
  };

  const ACTIONS = ['CORRER', 'PULAR'];

  // Limites (em px) que discretizam a distância em PERTO / MÉDIA / LONGE.
  // Usados pelo estado, pela penalidade de salto desnecessário e pelos sensores.
  // O salto só ultrapassa o obstáculo se começar entre ~25px e ~140px dele
  // (depende da velocidade). Com PERTO <= 120 todo o estado PERTO fica dentro
  // dessa janela; com 145 o estado misturava distâncias boas e ruins para pular,
  // e o agente não conseguia aprender quando saltar.
  const DIST_NEAR = 120;
  const DIST_MEDIUM = 300;

  // Penalidade por salto desnecessário (longe do obstáculo ou já no ar).
  // Com -0.1 o custo era tão pequeno que o agente ficava pulando sem parar
  // e pousava em distâncias ruins; com -3 ele aprende a esperar o obstáculo
  // (em simulação, 29 de 30 treinos de 400 episódios aprenderam a não bater).
  const JUMP_PENALTY = -3;

  class QLearningAgent {
    constructor() {
      this.alpha = 0.1;         // Taxa de aprendizado
      this.gamma = 0.9;         // Fator de desconto
      this.epsilon = 1.0;       // Taxa de exploração inicial
      this.epsilonMin = 0.05;   // Mínimo de exploração
      this.epsilonDecay = 0.96; // Decaimento gradual por episódio
      this.qTable = this.createEmptyTable();
    }

    createEmptyTable() {
      const table = {};
      for (const s of STATES) {
        table[s] = { CORRER: 0, PULAR: 0 };
      }
      return table;
    }

    reset() {
      this.epsilon = 1.0;
      this.qTable = this.createEmptyTable();
    }

    getState(distancePx, onGround) {
      let distLabel = 'LONGE';
      if (distancePx <= DIST_NEAR) {
        distLabel = 'PERTO';
      } else if (distancePx <= DIST_MEDIUM) {
        distLabel = 'MEDIA';
      }
      const groundLabel = onGround ? 'CHAO' : 'AR';
      return `${distLabel}_${groundLabel}`;
    }

    getBestAction(state) {
      const row = this.qTable[state];
      if (row.PULAR > row.CORRER) return 'PULAR';
      if (row.CORRER > row.PULAR) return 'CORRER';
      return 'EMPATE';
    }

    chooseAction(state, greedyOnly = false) {
      const explore = !greedyOnly && Math.random() < this.epsilon;
      if (explore) {
        const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
        return { action, strategy: 'EXPLORACAO' };
      }

      const row = this.qTable[state];
      let action;
      if (row.PULAR > row.CORRER) {
        action = 'PULAR';
      } else if (row.CORRER > row.PULAR) {
        action = 'CORRER';
      } else {
        // Desempate aleatório quando os valores Q ainda são idênticos
        action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      }
      return { action, strategy: 'APROVEITAMENTO' };
    }

    // Equação exata do Q-Learning:
    // Q(s,a) = Q(s,a) + α [r + γ max Q(s',a') - Q(s,a)]
    update(state, action, reward, nextState, done = false) {
      const currentQ = this.qTable[state][action];
      const maxNextQ = done
        ? 0
        : Math.max(this.qTable[nextState].CORRER, this.qTable[nextState].PULAR);
      const target = reward + this.gamma * maxNextQ;
      const newQ = currentQ + this.alpha * (target - currentQ);
      this.qTable[state][action] = newQ;
      return { oldQ: currentQ, newQ, changed: Math.abs(newQ - currentQ) > 1e-6 };
    }

    decayEpsilon() {
      this.epsilon = Math.max(this.epsilonMin, this.epsilon * this.epsilonDecay);
    }
  }

  /* =========================================================
     3. RENDERIZAÇÃO DOS GRÁFICOS (CANVAS 2D PURO)
  ========================================================= */
  class ChartsRenderer {
    constructor() {
      this.canvases = {
        rewards: document.getElementById('chart-rewards'),
        success: document.getElementById('chart-success'),
        qvalues: document.getElementById('chart-qvalues'),
        epsilon: document.getElementById('chart-epsilon')
      };
    }

    renderAll(history) {
      this.drawRewardsChart(history);
      this.drawSuccessChart(history);
      this.drawQValuesChart(history);
      this.drawEpsilonChart(history);
    }

    // Ajusta a resolução interna do canvas ao tamanho real na tela (nitidez em telas HiDPI)
    prepareCanvas(canvas) {
      const ctx = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = Math.round(canvas.clientWidth) || 420;
      const cssH = Math.max(170, Math.round(cssW * 0.5));
      const pxW = Math.round(cssW * dpr);
      const pxH = Math.round(cssH * dpr);
      if (canvas.width !== pxW || canvas.height !== pxH) {
        canvas.width = pxW;
        canvas.height = pxH;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, cssW, cssH);
      return { ctx, w: cssW, h: cssH };
    }

    drawEmptyMessage(ctx, w, h, text) {
      ctx.fillStyle = '#8C7FA6';
      ctx.font = '600 13px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, w / 2, h / 2, w - 24);
    }

    // firstEp / lastEp: números reais dos episódios exibidos (o histórico salvo pode ter sido truncado)
    drawGrid(ctx, pad, w, h, minY, maxY, firstEp, lastEp, unitSuffix = '') {
      const plotH = h - pad.top - pad.bottom;

      ctx.strokeStyle = '#EDE6F7';
      ctx.lineWidth = 1;
      ctx.fillStyle = '#6E6188';
      ctx.font = '600 10px Consolas, monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const steps = 4;
      for (let i = 0; i <= steps; i++) {
        const ratio = i / steps;
        const y = Math.round(pad.top + plotH * (1 - ratio)) + 0.5;
        const val = minY + (maxY - minY) * ratio;

        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();

        const label = Math.abs(val) >= 100 || Number.isInteger(val)
          ? `${Math.round(val)}${unitSuffix}`
          : `${val.toFixed(1)}${unitSuffix}`;
        ctx.fillText(label, pad.left - 6, y);
      }

      // Linha do zero (referência entre valores positivos e negativos)
      if (minY < 0 && maxY > 0) {
        const zy = Math.round(pad.top + plotH * (1 - (0 - minY) / (maxY - minY))) + 0.5;
        ctx.save();
        ctx.strokeStyle = '#B9A8D6';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(pad.left, zy);
        ctx.lineTo(w - pad.right, zy);
        ctx.stroke();
        ctx.restore();
      }

      // Eixo X
      ctx.strokeStyle = '#D7C9EE';
      ctx.beginPath();
      ctx.moveTo(pad.left, h - pad.bottom + 0.5);
      ctx.lineTo(w - pad.right, h - pad.bottom + 0.5);
      ctx.stroke();

      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.fillText(`Ep. ${firstEp}`, pad.left, h - pad.bottom + 6);
      if (lastEp > firstEp) {
        ctx.textAlign = 'right';
        ctx.fillText(`Ep. ${lastEp}`, w - pad.right, h - pad.bottom + 6);
      }
    }

    tracePath(ctx, values, getX, getY) {
      ctx.beginPath();
      for (let i = 0; i < values.length; i++) {
        const x = getX(i);
        const y = getY(values[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    }

    drawLineSeries(ctx, values, pad, w, h, minY, maxY, color, lineWidth = 2, fillColor = null) {
      if (values.length === 0) return;
      const plotW = w - pad.left - pad.right;
      const plotH = h - pad.top - pad.bottom;
      const rangeY = maxY - minY || 1;

      const getX = (i) =>
        values.length === 1
          ? pad.left + plotW / 2
          : pad.left + (i / (values.length - 1)) * plotW;

      const getY = (v) =>
        pad.top + plotH * (1 - (v - minY) / rangeY);

      // Área preenchida (opcional) abaixo da linha
      if (fillColor && values.length > 1) {
        this.tracePath(ctx, values, getX, getY);
        ctx.lineTo(getX(values.length - 1), h - pad.bottom);
        ctx.lineTo(getX(0), h - pad.bottom);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
      }

      this.tracePath(ctx, values, getX, getY);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();

      // Ponto final em destaque
      const lastX = getX(values.length - 1);
      const lastY = getY(values[values.length - 1]);
      ctx.beginPath();
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.stroke();
    }

    getEpisodeRange(history) {
      const first = history[0].episode || 1;
      const last = history[history.length - 1].episode || history.length;
      return { first, last };
    }

    drawRewardsChart(history) {
      const { ctx, w, h } = this.prepareCanvas(this.canvases.rewards);
      if (history.length === 0) {
        this.drawEmptyMessage(ctx, w, h, 'Execute episódios para visualizar as recompensas');
        return;
      }

      const raw = history.map((e) => e.totalReward);
      const ma = history.map((_, idx) => {
        const slice = raw.slice(Math.max(0, idx - 9), idx + 1);
        return slice.reduce((a, b) => a + b, 0) / slice.length;
      });

      const minVal = Math.min(-100, ...raw);
      const maxVal = Math.max(20, ...raw);
      const pad = { top: 14, right: 14, bottom: 26, left: 46 };
      const { first, last } = this.getEpisodeRange(history);

      this.drawGrid(ctx, pad, w, h, minVal, maxVal, first, last);
      this.drawLineSeries(ctx, raw, pad, w, h, minVal, maxVal, '#B69AE8', 1.6);
      this.drawLineSeries(ctx, ma, pad, w, h, minVal, maxVal, '#7952A0', 2.8);
    }

    drawSuccessChart(history) {
      const { ctx, w, h } = this.prepareCanvas(this.canvases.success);
      if (history.length === 0) {
        this.drawEmptyMessage(ctx, w, h, 'Aguardando episódios para calcular taxa de sucesso');
        return;
      }

      const values = history.map((e) => e.successRate);
      const pad = { top: 14, right: 14, bottom: 26, left: 46 };
      const { first, last } = this.getEpisodeRange(history);

      this.drawGrid(ctx, pad, w, h, 0, 100, first, last, '%');
      this.drawLineSeries(ctx, values, pad, w, h, 0, 100, '#D96BA5', 2.6, 'rgba(232, 165, 200, 0.25)');
    }

    drawQValuesChart(history) {
      const { ctx, w, h } = this.prepareCanvas(this.canvases.qvalues);
      if (history.length === 0) {
        this.drawEmptyMessage(ctx, w, h, 'Aguardando atualizações da Tabela Q');
        return;
      }

      const qJump = history.map((e) => e.qPertoJump);
      const qRun = history.map((e) => e.qPertoRun);
      const minVal = Math.min(-25, ...qJump, ...qRun);
      const maxVal = Math.max(15, ...qJump, ...qRun);
      const pad = { top: 14, right: 14, bottom: 26, left: 46 };
      const { first, last } = this.getEpisodeRange(history);

      this.drawGrid(ctx, pad, w, h, minVal, maxVal, first, last);
      this.drawLineSeries(ctx, qRun, pad, w, h, minVal, maxVal, '#DC2626', 2.4);
      this.drawLineSeries(ctx, qJump, pad, w, h, minVal, maxVal, '#059669', 2.6);
    }

    drawEpsilonChart(history) {
      const { ctx, w, h } = this.prepareCanvas(this.canvases.epsilon);
      if (history.length === 0) {
        this.drawEmptyMessage(ctx, w, h, 'Exploração inicia em 1.00 e reduz gradualmente');
        return;
      }

      const eps = history.map((e) => e.epsilon);
      const pad = { top: 14, right: 14, bottom: 26, left: 46 };
      const { first, last } = this.getEpisodeRange(history);

      this.drawGrid(ctx, pad, w, h, 0, 1, first, last);
      this.drawLineSeries(ctx, eps, pad, w, h, 0, 1, '#211638', 2.5, 'rgba(121, 82, 160, 0.1)');
    }
  }

  /* =========================================================
     4. MOTOR DO JOGO + INTEGRAÇÃO COM Q-LEARNING
  ========================================================= */
  class RunAndLearnApp {
    constructor() {
      this.STORAGE_KEY = 'run_and_learn_qlearning_v2'; // v2: novos limites de estado

      // Referências DOM principais
      this.startScreen = document.getElementById('start-screen');
      this.appMain = document.getElementById('app-main');
      this.characterGrid = document.getElementById('character-grid');
      this.gameCanvas = document.getElementById('game-canvas');
      this.ctx = this.gameCanvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = false;

      // Estado da aplicação
      this.selectedCharId = 'frajola';
      this.mode = 'ai'; // 'ai' ou 'manual'
      this.isRunning = false;
      this.isPaused = false;
      this.simSpeed = 1;
      this.showSensors = true;
      this.greedyOnly = false;

      // Treinamento em lote
      this.batchRemaining = 0;
      this.batchTotal = 60;

      // Dimensões lógicas do canvas
      this.W = this.gameCanvas.width;
      this.H = this.gameCanvas.height;
      this.groundY = 228;

      // Agente & Métricas globais
      this.agent = new QLearningAgent();
      this.charts = new ChartsRenderer();
      this.episodes = 0;
      this.bestScore = 0;
      this.totalObstaclesCleared = 0;
      this.history = [];
      this.lastUpdatedCell = null;
      this.updateCounts = this.createEmptyCounts(); // nº de atualizações de Bellman por estado
      this.qUpdateSeq = 0;      // incrementa a cada atualização real da Tabela Q
      this.renderedQSeq = 0;    // última atualização já destacada na interface
      this.toastTimer = null;

      // Estado do episódio atual
      this.resetEpisodeEntities();

      // Inicialização
      this.loadFromStorage();
      this.renderCharacterCards();
      this.buildQTable();
      this.bindEvents();
      this.updateCharacterVisuals();
      this.renderQTable(false);
      this.charts.renderAll(this.history);
      this.updateAIPanel();
      this.drawGame();

      // Loop principal com passo fixo (60 Hz lógico)
      this.lastFrameTime = performance.now();
      this.accumulator = 0;
      requestAnimationFrame((t) => this.loop(t));
    }

    getSelectedCharacter() {
      return CHARACTERS.find((c) => c.id === this.selectedCharId) || CHARACTERS[0];
    }

    createEmptyCounts() {
      const counts = {};
      for (const s of STATES) counts[s] = 0;
      return counts;
    }

    // Aplica a equação do Q-Learning e registra a atualização para a interface
    applyQUpdate(state, action, reward, nextState, done) {
      const res = this.agent.update(state, action, reward, nextState, done);
      this.updateCounts[state]++;
      if (res.changed) {
        this.qUpdateSeq++;
        this.lastUpdatedCell = { state, action, seq: this.qUpdateSeq };
      }
      return res;
    }

    /* -------------------------------------------------------
       PERSISTÊNCIA (localStorage)
    ------------------------------------------------------- */
    saveToStorage() {
      try {
        const payload = {
          selectedCharId: this.selectedCharId,
          episodes: this.episodes,
          bestScore: this.bestScore,
          totalObstaclesCleared: this.totalObstaclesCleared,
          epsilon: this.agent.epsilon,
          qTable: this.agent.qTable,
          updateCounts: this.updateCounts,
          history: this.history.slice(-250) // mantém últimos 250 episódios para performance
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
      } catch (err) {
        // Ignora caso localStorage esteja bloqueado
      }
    }

    loadFromStorage() {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data.selectedCharId && CHARACTERS.some((c) => c.id === data.selectedCharId)) {
          this.selectedCharId = data.selectedCharId;
        }
        if (typeof data.episodes === 'number') this.episodes = data.episodes;
        if (typeof data.bestScore === 'number') this.bestScore = data.bestScore;
        if (typeof data.totalObstaclesCleared === 'number') {
          this.totalObstaclesCleared = data.totalObstaclesCleared;
        }
        if (typeof data.epsilon === 'number') {
          this.agent.epsilon = Math.max(this.agent.epsilonMin, Math.min(1, data.epsilon));
        }
        if (data.qTable) {
          for (const s of STATES) {
            if (data.qTable[s]) {
              this.agent.qTable[s] = {
                CORRER: Number(data.qTable[s].CORRER) || 0,
                PULAR: Number(data.qTable[s].PULAR) || 0
              };
            }
          }
        }
        if (data.updateCounts) {
          for (const s of STATES) {
            this.updateCounts[s] = Math.max(0, Math.floor(Number(data.updateCounts[s]) || 0));
          }
        }
        if (Array.isArray(data.history)) {
          // Mantém apenas entradas válidas para não quebrar os gráficos
          this.history = data.history.filter(
            (e) => e && typeof e.totalReward === 'number' && typeof e.epsilon === 'number'
          );
        }
        if (this.episodes > 0) {
          document.getElementById('saved-progress-note').hidden = false;
          document.getElementById('saved-episodes-count').textContent = String(this.episodes);
        }
      } catch (err) {
        // Dados inválidos ignorados com segurança
      }
    }

    /* -------------------------------------------------------
       SELEÇÃO DE PERSONAGEM & INICIALIZAÇÃO DE UI
    ------------------------------------------------------- */
    renderCharacterCards() {
      this.characterGrid.innerHTML = '';
      this.previewCanvases = [];

      CHARACTERS.forEach((char, index) => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.dataset.charId = char.id;
        card.setAttribute('role', 'radio');
        card.setAttribute('aria-label', `${char.name} — ${char.tag}`);

        card.innerHTML = `
          <div class="char-avatar-wrap" style="background: ${char.cardBg};">
            <canvas width="64" height="64" data-char-preview="${char.id}" aria-hidden="true"></canvas>
          </div>
          <h3 class="char-name">${char.name}</h3>
          <span class="char-tag" style="background: ${char.tagBg}; color: ${char.tagColor};">${char.tag}</span>
          <p class="char-desc">${char.description}</p>
        `;

        card.addEventListener('click', () => this.selectCharacter(char.id));
        card.addEventListener('dblclick', () => this.enterLab());
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.selectCharacter(char.id);
          } else if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
            // Navegação por setas, padrão de acessibilidade para radiogroup
            e.preventDefault();
            const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
            const next = CHARACTERS[(index + dir + CHARACTERS.length) % CHARACTERS.length];
            this.selectCharacter(next.id, true);
          }
        });

        this.characterGrid.appendChild(card);
        const canvas = card.querySelector('canvas');
        this.previewCanvases.push({ canvas, char });
      });

      this.updateCharacterSelectionUI();
      this.drawPreviewSprites(0);
    }

    // Atualiza apenas as classes dos cartões (sem recriar o DOM, preservando o foco)
    updateCharacterSelectionUI(focusSelected = false) {
      this.characterGrid.querySelectorAll('.char-card').forEach((card) => {
        const selected = card.dataset.charId === this.selectedCharId;
        card.classList.toggle('selected', selected);
        card.setAttribute('aria-checked', String(selected));
        card.tabIndex = selected ? 0 : -1;
        if (selected && focusSelected) card.focus();
      });
    }

    selectCharacter(id, focusSelected = false) {
      if (!CHARACTERS.some((c) => c.id === id)) return;
      this.selectedCharId = id;
      this.updateCharacterSelectionUI(focusSelected);
      this.updateCharacterVisuals();
      this.saveToStorage();
      this.drawGame();
    }

    drawPreviewSprites(tick) {
      if (!this.previewCanvases) return;
      const frame = Math.floor(tick / 12) % 2 === 0 ? 'run1' : 'run2';
      for (const item of this.previewCanvases) {
        const ctx = item.canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, 64, 64);
        drawPixelCharacter(ctx, item.char, frame, 0, 2, 4);
      }
    }

    updateCharacterVisuals() {
      const char = this.getSelectedCharacter();
      document.getElementById('header-char-name').textContent = char.shortName;
      const hCanvas = document.getElementById('header-char-preview');
      const hCtx = hCanvas.getContext('2d');
      hCtx.imageSmoothingEnabled = false;
      // Pixel inteiro (2px) evita serrilhado/borrão no sprite do cabeçalho
      hCtx.clearRect(0, 0, hCanvas.width, hCanvas.height);
      drawPixelCharacter(hCtx, char, 'run1', 0, 2, 2);
    }

    /* -------------------------------------------------------
       ENTIDADES E FÍSICA DO JOGO
    ------------------------------------------------------- */
    resetEpisodeEntities() {
      this.player = {
        x: 92,
        y: this.groundY - 48,
        width: 48,
        height: 48,
        vy: 0,
        gravity: 0.85,
        jumpForce: -14.5,
        onGround: true,
        collided: false
      };

      this.speed = 6.5;
      this.tickCount = 0;
      this.score = 0;
      this.obstaclesClearedInEp = 0;
      this.episodeReward = 0;
      this.lastReward = 0;
      this.currentAction = 'CORRER';
      this.currentStrategy = 'EXPLORACAO';

      // Variáveis de controle de passo do Q-Learning
      this.lastDecisionState = null;
      this.lastDecisionAction = null;
      this.pendingReward = 0;
      this.ticksSinceDecision = 0;
      this.survivalTickCounter = 0;

      // Efeitos visuais (não interferem no aprendizado)
      this.respawnTimer = 0;   // ticks exibindo a colisão antes do próximo episódio
      this.hitFlash = 0;       // intensidade do flash vermelho ao colidir
      this.floatTexts = [];    // textos "+10" flutuantes

      // Partículas e cenário
      this.particles = [];
      this.groundOffset = 0;
      this.cloudOffset = 0;
      this.hillOffset = 0;

      // Obstáculos iniciais
      this.obstacles = [];
      this.spawnObstacle(640);
      this.spawnObstacle(1100);

      // Estado inicial lido
      const dist = this.getNextObstacleDistance();
      this.currentState = this.agent.getState(dist, true);
    }

    spawnObstacle(xPos) {
      const types = ['crystal', 'barrier', 'neonCactus'];
      const type = types[Math.floor(Math.random() * types.length)];
      const width = type === 'barrier' ? 34 : 28;
      const height = type === 'crystal' ? 44 : type === 'barrier' ? 38 : 46;

      this.obstacles.push({
        x: xPos,
        y: this.groundY - height,
        width,
        height,
        type,
        passed: false
      });
    }

    getNextObstacle() {
      for (let i = 0; i < this.obstacles.length; i++) {
        const obs = this.obstacles[i];
        if (obs.x + obs.width > this.player.x + 6) {
          return obs;
        }
      }
      return null;
    }

    getNextObstacleDistance() {
      const nextObs = this.getNextObstacle();
      if (!nextObs) return 600;
      // Distância da frente do personagem até a borda esquerda do obstáculo
      return Math.max(0, Math.round(nextObs.x - (this.player.x + this.player.width - 8)));
    }

    triggerJump() {
      if (this.player.onGround && !this.player.collided) {
        this.player.vy = this.player.jumpForce;
        this.player.onGround = false;
        this.emitParticles(this.player.x + 20, this.groundY, 6, '#B69AE8');
        return true;
      }
      return false;
    }

    emitParticles(x, y, count, color) {
      if (this.batchRemaining > 0) return; // Economiza CPU no modo turbo
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 3.5 - 1,
          vy: -Math.random() * 3.2 - 0.4,
          size: Math.random() * 4 + 3,
          life: 18 + Math.random() * 10,
          color
        });
      }
    }

    checkCollision() {
      // Hitbox justa (levemente menor que o sprite visual 48x48)
      const px = this.player.x + 10;
      const py = this.player.y + 6;
      const pw = this.player.width - 20;
      const ph = this.player.height - 8;

      for (let i = 0; i < this.obstacles.length; i++) {
        const o = this.obstacles[i];
        const ox = o.x + 4;
        const oy = o.y + 4;
        const ow = o.width - 8;
        const oh = o.height - 4;

        if (px < ox + ow && px + pw > ox && py < oy + oh && py + ph > oy) {
          return true;
        }
      }
      return false;
    }

    /* -------------------------------------------------------
       PASSO DE SIMULAÇÃO (1 TICK LÓGICO)
    ------------------------------------------------------- */
    updateEffects() {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.life--;
        if (p.life <= 0) this.particles.splice(i, 1);
      }
      for (let i = this.floatTexts.length - 1; i >= 0; i--) {
        const f = this.floatTexts[i];
        f.y -= 0.9;
        f.life--;
        if (f.life <= 0) this.floatTexts.splice(i, 1);
      }
      if (this.hitFlash > 0) this.hitFlash--;
    }

    stepTick() {
      if (this.player.collided) {
        // Pausa curta mostrando a colisão antes de iniciar o próximo episódio da IA
        this.updateEffects();
        if (this.respawnTimer > 0) {
          this.respawnTimer--;
          if (this.respawnTimer === 0) this.resetEpisodeEntities();
        }
        return;
      }

      this.tickCount++;
      this.ticksSinceDecision++;
      this.survivalTickCounter++;

      // 1) Se estamos no modo IA, decide ação no primeiro tick do episódio
      if (this.mode === 'ai' && this.lastDecisionState === null) {
        const dist = this.getNextObstacleDistance();
        const s = this.agent.getState(dist, this.player.onGround);
        const choice = this.agent.chooseAction(s, this.greedyOnly);
        this.lastDecisionState = s;
        this.lastDecisionAction = choice.action;
        this.currentState = s;
        this.currentAction = choice.action;
        this.currentStrategy = choice.strategy;
        this.executeAIAction(choice.action, dist);
      }

      // 2) Física do personagem
      if (!this.player.onGround) {
        this.player.vy += this.player.gravity;
        this.player.y += this.player.vy;
        if (this.player.y >= this.groundY - this.player.height) {
          this.player.y = this.groundY - this.player.height;
          this.player.vy = 0;
          this.player.onGround = true;
          this.emitParticles(this.player.x + 22, this.groundY, 4, '#E8A5C8');
        }
      }

      // 3) Movimento dos obstáculos e cenário
      this.groundOffset = (this.groundOffset + this.speed) % 32;
      this.hillOffset = (this.hillOffset + this.speed * 0.25) % 400;
      this.cloudOffset = (this.cloudOffset + this.speed * 0.12) % 800;

      for (let i = 0; i < this.obstacles.length; i++) {
        const obs = this.obstacles[i];
        obs.x -= this.speed;

        // Verifica se ultrapassou o obstáculo (+10 recompensa)
        if (!obs.passed && obs.x + obs.width < this.player.x + 6) {
          obs.passed = true;
          this.obstaclesClearedInEp++;
          this.totalObstaclesCleared++;
          this.score += 10;
          this.speed = Math.min(9.5, 6.5 + this.obstaclesClearedInEp * 0.12);

          if (this.mode === 'ai') {
            this.addReward(10);
          }
          if (this.batchRemaining === 0) {
            this.floatTexts.push({ x: this.player.x + 24, y: this.player.y - 6, text: '+10', life: 40 });
          }
        }
      }

      // Remove obstáculos antigos e gera novos com espaçamento justo
      if (this.obstacles.length > 0 && this.obstacles[0].x + this.obstacles[0].width < -40) {
        this.obstacles.shift();
      }
      const lastObs = this.obstacles[this.obstacles.length - 1];
      if (!lastObs || lastObs.x < this.W + 120) {
        const minGap = 390 + this.speed * 10;
        const maxGap = 560 + this.speed * 12;
        const gap = minGap + Math.random() * (maxGap - minGap);
        const startX = lastObs ? Math.max(this.W + 40, lastObs.x + gap) : this.W + 100;
        this.spawnObstacle(startX);
      }

      // Atualiza partículas e efeitos
      this.updateEffects();

      // Pontuação por distância sobrevivida
      if (this.tickCount % 12 === 0) {
        this.score += 1;
        if (this.score > this.bestScore) {
          this.bestScore = this.score;
        }
      }

      // Recompensa de sobrevivência (+1 por intervalo de 6 ticks)
      if (this.survivalTickCounter >= 6) {
        this.survivalTickCounter = 0;
        if (this.mode === 'ai') {
          this.addReward(1);
        }
      }

      // 4) Checa colisão (-100 recompensa e fim do episódio)
      const distAfterMove = this.getNextObstacleDistance();
      const newState = this.agent.getState(distAfterMove, this.player.onGround);
      this.currentState = newState;

      if (this.checkCollision()) {
        this.player.collided = true;
        this.emitParticles(this.player.x + 24, this.player.y + 24, 14, '#EF4444');
        if (this.batchRemaining === 0) this.hitFlash = 14;

        if (this.mode === 'ai') {
          this.addReward(-100);
          if (this.lastDecisionState !== null) {
            // Estado terminal: done = true (sem valor futuro)
            this.applyQUpdate(
              this.lastDecisionState,
              this.lastDecisionAction,
              this.pendingReward,
              newState,
              true
            );
            this.pendingReward = 0;
          }
          this.finishAIEpisode();
        } else {
          this.finishManualRun();
        }
        return;
      }

      // 5) Passo de atualização do Q-Learning (a cada 6 ticks ou mudança de estado)
      if (this.mode === 'ai') {
        if (this.ticksSinceDecision >= 6 || newState !== this.lastDecisionState) {
          this.applyQUpdate(
            this.lastDecisionState,
            this.lastDecisionAction,
            this.pendingReward,
            newState,
            false
          );

          this.pendingReward = 0;
          this.ticksSinceDecision = 0;

          const choice = this.agent.chooseAction(newState, this.greedyOnly);
          this.lastDecisionState = newState;
          this.lastDecisionAction = choice.action;
          this.currentAction = choice.action;
          this.currentStrategy = choice.strategy;
          this.executeAIAction(choice.action, distAfterMove);
        }
      }
    }

    executeAIAction(action, distancePx) {
      if (action === 'PULAR') {
        if (this.player.onGround) {
          this.triggerJump();
          // Salto desnecessário se o obstáculo ainda não está PERTO
          // (mesmo limite usado para discretizar o estado)
          if (distancePx > DIST_NEAR) {
            this.addReward(JUMP_PENALTY);
          }
        } else {
          // Tentar pular já estando no ar é desnecessário
          this.addReward(JUMP_PENALTY);
        }
      }
    }

    addReward(val) {
      this.pendingReward += val;
      this.episodeReward += val;
      this.lastReward = val;
    }

    finishAIEpisode() {
      this.episodes++;
      this.agent.decayEpsilon();

      // Calcula taxa de sucesso nos últimos 10 episódios:
      // obstáculos ultrapassados / (obstáculos ultrapassados + colisões)
      const recentSlice = this.history.slice(-9);
      const recentCleared =
        recentSlice.reduce((sum, item) => sum + item.obstacles, 0) + this.obstaclesClearedInEp;
      const recentCollisions = recentSlice.length + 1;
      const successRate = (recentCleared / (recentCleared + recentCollisions)) * 100;

      this.history.push({
        episode: this.episodes,
        totalReward: Number(this.episodeReward.toFixed(1)),
        obstacles: this.obstaclesClearedInEp,
        epsilon: Number(this.agent.epsilon.toFixed(4)),
        qPertoJump: Number(this.agent.qTable.PERTO_CHAO.PULAR.toFixed(2)),
        qPertoRun: Number(this.agent.qTable.PERTO_CHAO.CORRER.toFixed(2)),
        successRate: Number(successRate.toFixed(1))
      });

      this.saveToStorage();

      // Controle de treinamento em lote vs contínuo
      if (this.batchRemaining > 0) {
        this.batchRemaining--;
        this.updateBatchProgressUI();

        if (this.batchRemaining === 0) {
          this.simSpeed = 1;
          this.updateSpeedChips();
          this.resetEpisodeEntities();
          this.renderQTable(false);
          this.charts.renderAll(this.history);
          this.updateAIPanel();
          this.updateControlStates();
          const last = this.history[this.history.length - 1];
          this.showToast(
            `Treino concluído! ${this.batchTotal} episódios · ε = ${this.agent.epsilon.toFixed(3)} · sucesso ${last.successRate.toFixed(0)}%`
          );
          return;
        }

        // Durante o lote o próximo episódio começa imediatamente
        this.resetEpisodeEntities();
        if (this.episodes % 2 === 0) {
          this.charts.renderAll(this.history);
        }
        return;
      }

      // Modo observação: mantém a colisão visível por um instante antes de reiniciar
      this.respawnTimer = 30;
      this.renderQTable(true);
      this.charts.renderAll(this.history);
    }

    finishManualRun() {
      this.isRunning = false;
      this.isPaused = false;
      this.saveToStorage();
      this.updateAIPanel();
      this.updateControlStates();
      const isRecord = this.score > 0 && this.score >= this.bestScore;
      this.showOverlay(
        isRecord ? 'Novo Recorde!' : 'Fim de Tentativa!',
        `Você fez ${this.score} pontos e ultrapassou ${this.obstaclesClearedInEp} obstáculo(s). Será que a IA consegue fazer melhor?`,
        'Jogar Novamente',
        isRecord ? '★' : '✖'
      );
    }

    /* -------------------------------------------------------
       LOOP DE RENDERIZAÇÃO
    ------------------------------------------------------- */
    loop(now) {
      const elapsed = Math.min(100, now - this.lastFrameTime);
      this.lastFrameTime = now;

      // Anima previews da tela inicial se visível
      if (!this.startScreen.classList.contains('hidden')) {
        this.previewAnimTick = (this.previewAnimTick || 0) + 1;
        this.drawPreviewSprites(this.previewAnimTick);
      }

      if (this.isRunning && !this.isPaused) {
        if (this.batchRemaining > 0) {
          // Modo turbo controlado para treinamento fluido com visualização ao vivo
          const ticksPerFrame = 180;
          for (let i = 0; i < ticksPerFrame; i++) {
            if (this.batchRemaining <= 0) break;
            this.stepTick();
          }
          this.updateAIPanel();
          this.renderQTable(false);
        } else {
          const tickDuration = 1000 / 60;
          this.accumulator += elapsed * (this.mode === 'ai' ? this.simSpeed : 1);
          let steps = 0;
          const maxSteps = 30;
          while (this.accumulator >= tickDuration && steps < maxSteps) {
            this.stepTick();
            this.accumulator -= tickDuration;
            steps++;
            if (!this.isRunning || this.isPaused) break;
          }
          if (steps > 0) {
            this.updateAIPanel();
            if (this.mode === 'ai') {
              this.renderQTable(true);
            }
          }
        }
      } else if (!this.isRunning && this.player.collided) {
        // Mantém partículas/flash animando após o fim da tentativa manual
        this.updateEffects();
      }

      // Só desenha a arena quando ela está visível
      if (!this.appMain.classList.contains('hidden')) {
        this.drawGame();
      }
      requestAnimationFrame((t) => this.loop(t));
    }

    /* -------------------------------------------------------
       DESENHO DA ARENA DO JOGO (CANVAS)
    ------------------------------------------------------- */
    drawGame() {
      const ctx = this.ctx;
      const W = this.W;
      const H = this.H;
      const char = this.getSelectedCharacter();

      // 1) Céu gradiente roxo/lilás
      const skyGrad = ctx.createLinearGradient(0, 0, 0, this.groundY);
      skyGrad.addColorStop(0, '#211638');
      skyGrad.addColorStop(0.6, '#482F73');
      skyGrad.addColorStop(1, '#7952A0');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, this.groundY);

      // Estrelas sutis (cintilando suavemente)
      const twinkleT = performance.now() / 700;
      const stars = [
        [60, 32], [140, 58], [230, 26], [340, 68], [450, 30],
        [540, 52], [650, 24], [740, 64], [780, 38]
      ];
      for (let i = 0; i < stars.length; i++) {
        const [sx, sy] = stars[i];
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + 0.25 * (1 + Math.sin(twinkleT + i * 1.7)) / 2})`;
        ctx.fillRect(sx, sy, 3, 3);
      }

      // Nuvens pixeladas em paralaxe
      ctx.fillStyle = 'rgba(182, 154, 232, 0.25)';
      for (let i = 0; i < 3; i++) {
        const cx = ((i * 290 - this.cloudOffset + 800) % 900) - 80;
        const cy = 44 + (i % 2) * 28;
        ctx.fillRect(cx, cy, 56, 14);
        ctx.fillRect(cx + 12, cy - 10, 32, 10);
      }

      // Montanhas tecnológicas ao fundo
      ctx.fillStyle = '#332154';
      for (let i = -1; i < 4; i++) {
        const hx = i * 400 - this.hillOffset;
        ctx.beginPath();
        ctx.moveTo(hx, this.groundY);
        ctx.lineTo(hx + 120, this.groundY - 58);
        ctx.lineTo(hx + 250, this.groundY);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(hx + 180, this.groundY);
        ctx.lineTo(hx + 300, this.groundY - 42);
        ctx.lineTo(hx + 420, this.groundY);
        ctx.closePath();
        ctx.fill();
      }

      // 2) Sensores didáticos da IA no chão (opcional)
      if (this.showSensors) {
        const frontX = this.player.x + this.player.width - 8;
        // Faixa PERTO (0..DIST_NEAR)
        ctx.fillStyle = 'rgba(239, 68, 68, 0.22)';
        ctx.fillRect(frontX, this.groundY - 6, DIST_NEAR, 6);
        // Faixa MÉDIA (DIST_NEAR..DIST_MEDIUM)
        ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.fillRect(frontX + DIST_NEAR, this.groundY - 6, DIST_MEDIUM - DIST_NEAR, 6);
        // Faixa LONGE (DIST_MEDIUM+)
        ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
        ctx.fillRect(frontX + DIST_MEDIUM, this.groundY - 6, W - (frontX + DIST_MEDIUM), 6);

        // Rótulos das faixas
        ctx.font = '700 9px Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = 'rgba(252, 165, 165, 0.75)';
        ctx.fillText('PERTO', frontX + DIST_NEAR / 2, this.groundY - 10);
        ctx.fillStyle = 'rgba(253, 211, 77, 0.7)';
        ctx.fillText('MÉDIA', frontX + (DIST_NEAR + DIST_MEDIUM) / 2, this.groundY - 10);
        ctx.fillStyle = 'rgba(110, 231, 183, 0.65)';
        ctx.fillText('LONGE', frontX + DIST_MEDIUM + 60, this.groundY - 10);
      }

      // 3) Chão pixelado
      ctx.fillStyle = '#2B1D4A';
      ctx.fillRect(0, this.groundY, W, H - this.groundY);
      ctx.fillStyle = '#B69AE8';
      ctx.fillRect(0, this.groundY, W, 4);

      // Blocos decorativos na pista
      ctx.fillStyle = '#4A3475';
      for (let gx = -this.groundOffset; gx < W; gx += 32) {
        ctx.fillRect(Math.round(gx), this.groundY + 14, 16, 4);
        ctx.fillRect(Math.round(gx + 16), this.groundY + 30, 10, 4);
      }

      // 4) Obstáculos
      for (let i = 0; i < this.obstacles.length; i++) {
        this.drawObstacle(ctx, this.obstacles[i]);
      }

      // 5) Linha do sensor de distância até o próximo obstáculo
      if (this.showSensors) {
        const nextObs = this.getNextObstacle();
        if (nextObs) {
          const sx = this.player.x + this.player.width - 8;
          const ex = nextObs.x;
          const sy = this.groundY - 22;
          if (ex > sx) {
            ctx.save();
            ctx.strokeStyle = '#E8A5C8';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, sy);
            ctx.stroke();
            ctx.restore();

            const dist = Math.round(ex - sx);
            const midX = Math.min(Math.max((sx + ex) / 2, sx + 26), W - 30);
            ctx.fillStyle = 'rgba(33, 22, 56, 0.85)';
            this.fillRoundRect(ctx, midX - 26, sy - 18, 52, 16, 4);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '700 10px Consolas, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText(`${dist}px`, midX, sy - 7);
          }
        }
      }

      // 6) Partículas
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life / 25);
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }
      ctx.globalAlpha = 1;

      // Sombra do personagem (diminui quando ele está no ar)
      const airHeight = this.groundY - this.player.height - this.player.y;
      const shadowScale = Math.max(0.35, 1 - airHeight / 140);
      ctx.fillStyle = 'rgba(10, 6, 20, 0.35)';
      ctx.beginPath();
      ctx.ellipse(this.player.x + 24, this.groundY + 2, 18 * shadowScale, 4 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // 7) Personagem (pixel art 16x16 x 3 = 48x48)
      let frameKey = 'run1';
      if (this.player.collided) {
        frameKey = 'hit';
      } else if (!this.player.onGround) {
        frameKey = 'jump';
      } else if (Math.floor(this.tickCount / 7) % 2 === 1) {
        frameKey = 'run2';
      }

      drawPixelCharacter(ctx, char, frameKey, this.player.x, this.player.y, 3);

      // Balãozinho de decisão da IA acima do personagem
      if (this.mode === 'ai' && this.isRunning && this.batchRemaining === 0 && !this.player.collided) {
        const isJump = this.currentAction === 'PULAR';
        const label = isJump ? 'PULAR!' : 'CORRER';
        const bx = this.player.x - 4;
        const by = this.player.y - 26;
        ctx.fillStyle = isJump ? '#E8A5C8' : '#B69AE8';
        this.fillRoundRect(ctx, bx, by, 56, 18, 6);
        // "rabinho" do balão
        ctx.beginPath();
        ctx.moveTo(bx + 22, by + 18);
        ctx.lineTo(bx + 28, by + 24);
        ctx.lineTo(bx + 34, by + 18);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#211638';
        ctx.font = '800 10px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(label, this.player.x + 24, by + 13);
        // Indicador de exploração (decisão aleatória)
        if (this.currentStrategy === 'EXPLORACAO') {
          ctx.fillStyle = '#FDE047';
          ctx.font = '900 11px "Segoe UI", sans-serif';
          ctx.fillText('?', bx + 60, by + 6);
        }
      }

      // Textos flutuantes (+10)
      for (let i = 0; i < this.floatTexts.length; i++) {
        const f = this.floatTexts[i];
        ctx.globalAlpha = Math.max(0, f.life / 40);
        ctx.fillStyle = '#6EE7B7';
        ctx.font = '900 14px Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(f.text, f.x, f.y);
      }
      ctx.globalAlpha = 1;

      // Flash vermelho de colisão
      if (this.hitFlash > 0) {
        ctx.fillStyle = `rgba(239, 68, 68, ${(this.hitFlash / 14) * 0.28})`;
        ctx.fillRect(0, 0, W, H);
      }

      // 8) HUD dentro do canvas
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = 'rgba(20, 12, 36, 0.78)';
      this.fillRoundRect(ctx, 14, 12, 232, 30, 8);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 12px Consolas, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`PTS: ${String(this.score).padStart(4, '0')}  |  REC: ${String(this.bestScore).padStart(4, '0')}`, 24, 31);

      let hudRight = 'MODO MANUAL';
      if (this.mode === 'ai') {
        hudRight = `EPISÓDIO #${this.episodes + 1}${this.greedyOnly ? '  ε=0' : ''}`;
      }
      ctx.fillStyle = 'rgba(20, 12, 36, 0.78)';
      this.fillRoundRect(ctx, W - 194, 12, 180, 30, 8);
      ctx.fillStyle = '#E8A5C8';
      ctx.textAlign = 'right';
      ctx.fillText(hudRight, W - 24, 31);
    }

    fillRoundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.fill();
    }

    drawObstacle(ctx, obs) {
      const { x, y, width, height, type } = obs;
      const rx = Math.round(x);
      const ry = Math.round(y);

      if (type === 'crystal') {
        // Cristal tecnológico rosa/roxo
        ctx.fillStyle = '#E8A5C8';
        ctx.beginPath();
        ctx.moveTo(rx + width / 2, ry);
        ctx.lineTo(rx + width, ry + height * 0.45);
        ctx.lineTo(rx + width - 3, ry + height);
        ctx.lineTo(rx + 3, ry + height);
        ctx.lineTo(rx, ry + height * 0.45);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#B69AE8';
        ctx.beginPath();
        ctx.moveTo(rx + width / 2, ry);
        ctx.lineTo(rx + width, ry + height * 0.45);
        ctx.lineTo(rx + width - 3, ry + height);
        ctx.lineTo(rx + width / 2, ry + height);
        ctx.closePath();
        ctx.fill();
      } else if (type === 'barrier') {
        // Barreira de laboratório listrada
        ctx.fillStyle = '#7952A0';
        ctx.fillRect(rx, ry, width, height);
        ctx.fillStyle = '#E8A5C8';
        ctx.fillRect(rx + 2, ry + 6, width - 4, 8);
        ctx.fillRect(rx + 2, ry + 20, width - 4, 8);
        ctx.fillStyle = '#211638';
        ctx.fillRect(rx + 4, ry + height - 6, 6, 6);
        ctx.fillRect(rx + width - 10, ry + height - 6, 6, 6);
      } else {
        // Cacto digital estilizado
        ctx.fillStyle = '#34D399';
        ctx.fillRect(rx + 9, ry, 10, height);
        ctx.fillRect(rx, ry + 12, 9, 8);
        ctx.fillRect(rx, ry + 6, 6, 12);
        ctx.fillRect(rx + 19, ry + 16, 9, 8);
        ctx.fillRect(rx + 22, ry + 10, 6, 12);
        ctx.fillStyle = '#059669';
        ctx.fillRect(rx + 14, ry + 2, 4, height - 2);
      }
    }

    /* -------------------------------------------------------
       ATUALIZAÇÕES DE INTERFACE (PAINEL, TABELA Q, CONTROLES)
    ------------------------------------------------------- */
    // Cache de elementos usados a cada quadro (evita buscas repetidas no DOM)
    $(id) {
      if (!this.elCache) this.elCache = {};
      if (!this.elCache[id]) this.elCache[id] = document.getElementById(id);
      return this.elCache[id];
    }

    setText(id, text) {
      const el = this.$(id);
      if (el.textContent !== text) el.textContent = text;
    }

    setClass(id, className) {
      const el = this.$(id);
      if (el.className !== className) el.className = className;
    }

    updateAIPanel() {
      const dist = this.getNextObstacleDistance();
      const isAI = this.mode === 'ai';

      this.setText('ai-state', STATE_LABELS[this.currentState] || this.currentState);
      this.setText('ai-distance', `${dist} px`);

      this.setText('ai-action', isAI ? this.currentAction : 'MANUAL');
      this.setClass(
        'ai-action',
        `metric-value ${isAI ? (this.currentAction === 'PULAR' ? 'action-jump' : 'action-run') : ''}`
      );

      this.setText(
        'ai-reward',
        isAI
          ? (this.lastReward >= 0 ? `+${this.lastReward.toFixed(1)}` : this.lastReward.toFixed(1))
          : '--'
      );
      this.setClass(
        'ai-reward',
        `metric-value mono ${isAI && this.lastReward > 0 ? 'val-pos' : isAI && this.lastReward < 0 ? 'val-neg' : ''}`
      );

      this.setText('ai-ep-reward', isAI ? this.episodeReward.toFixed(1) : '--');
      this.setClass(
        'ai-ep-reward',
        `metric-value mono ${isAI && this.episodeReward > 0 ? 'val-pos' : isAI && this.episodeReward < 0 ? 'val-neg' : ''}`
      );

      this.setText('ai-episodes', String(this.episodes));
      this.setText('ai-score', `${this.score} / ${this.bestScore}`);
      this.setText('ai-obstacles', `${this.obstaclesClearedInEp} / ${this.totalObstaclesCleared}`);
      this.setText('ai-epsilon', this.greedyOnly ? '0.000 (Teste)' : this.agent.epsilon.toFixed(3));
      this.$('ai-epsilon-bar').style.width = `${(this.greedyOnly ? 0 : this.agent.epsilon) * 100}%`;
      this.setText('ai-alpha', this.agent.alpha.toFixed(2));
      this.setText('ai-gamma', this.agent.gamma.toFixed(2));

      // Pílula de estratégia (Exploração vs Aproveitamento)
      if (!isAI) {
        this.setText('ai-strategy-pill', 'Controle Humano');
        this.setClass('ai-strategy-pill', 'strategy-pill');
      } else if (!this.isRunning) {
        this.setText('ai-strategy-pill', 'Aguardando');
        this.setClass('ai-strategy-pill', 'strategy-pill');
      } else if (this.currentStrategy === 'EXPLORACAO') {
        this.setText('ai-strategy-pill', 'Explorando (Aleatório)');
        this.setClass('ai-strategy-pill', 'strategy-pill explore');
      } else {
        this.setText('ai-strategy-pill', 'Aproveitando (Tabela Q)');
        this.setClass('ai-strategy-pill', 'strategy-pill exploit');
      }

      // Resumo acima dos gráficos
      if (this.history.length > 0) {
        const recent = this.history.slice(-10);
        const avgRew = recent.reduce((a, b) => a + b.totalReward, 0) / recent.length;
        const lastSuccess = this.history[this.history.length - 1].successRate;
        this.setText('stat-avg-reward', avgRew.toFixed(1));
        this.setText('stat-success-rate', `${lastSuccess.toFixed(0)}%`);
      } else {
        this.setText('stat-avg-reward', '0.0');
        this.setText('stat-success-rate', '0%');
      }
    }

    /* -------------------------------------------------------
       TABELA Q: as linhas são criadas uma única vez e depois
       apenas os valores são atualizados (lidos direto de agent.qTable)
    ------------------------------------------------------- */
    buildQTable() {
      const tbody = this.$('q-table-body');
      tbody.innerHTML = '';
      this.qRows = {};

      for (const state of STATES) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span class="q-state-badge mono">${STATE_LABELS[state]}<span class="q-now-tag">AGORA</span></span></td>
          <td><span class="q-val mono zero" data-action="CORRER">0.00</span></td>
          <td><span class="q-val mono zero" data-action="PULAR">0.00</span></td>
          <td><span class="best-action-tag tie">EMPATE</span></td>
          <td><span class="q-visits mono">0</span></td>
        `;
        tbody.appendChild(tr);
        this.qRows[state] = {
          tr,
          run: tr.querySelector('[data-action="CORRER"]'),
          jump: tr.querySelector('[data-action="PULAR"]'),
          best: tr.querySelector('.best-action-tag'),
          visits: tr.querySelector('.q-visits'),
          bestKey: null
        };
      }
    }

    formatQ(v) {
      // Mostra mais casas quando o valor é muito pequeno, para não exibir "-0.00"
      if (v !== 0 && Math.abs(v) < 0.01) return v.toFixed(4);
      return v.toFixed(2);
    }

    updateQCell(el, value, isBest) {
      const text = this.formatQ(value);
      if (el.textContent !== text) el.textContent = text;
      const sign = value > 0.005 ? 'pos' : value < -0.005 ? 'neg' : 'zero';
      el.classList.toggle('pos', sign === 'pos');
      el.classList.toggle('neg', sign === 'neg');
      el.classList.toggle('zero', sign === 'zero');
      el.classList.toggle('best', isBest);
      el.title = `Valor exato: ${value.toFixed(6)}`;
    }

    renderQTable(enableFlash = true) {
      if (!this.qRows) return;

      for (const state of STATES) {
        const row = this.agent.qTable[state];
        const refs = this.qRows[state];
        const best = this.agent.getBestAction(state);

        refs.tr.classList.toggle('active-row', this.currentState === state);
        this.updateQCell(refs.run, row.CORRER, best === 'CORRER');
        this.updateQCell(refs.jump, row.PULAR, best === 'PULAR');

        if (refs.bestKey !== best) {
          refs.bestKey = best;
          if (best === 'PULAR') {
            refs.best.className = 'best-action-tag jump';
            refs.best.textContent = 'PULAR';
          } else if (best === 'CORRER') {
            refs.best.className = 'best-action-tag run';
            refs.best.textContent = 'CORRER';
          } else {
            refs.best.className = 'best-action-tag tie';
            refs.best.textContent = 'EMPATE';
          }
        }

        const visits = String(this.updateCounts[state] || 0);
        if (refs.visits.textContent !== visits) refs.visits.textContent = visits;
      }

      // Destaca a célula que acabou de ser atualizada pela equação de Bellman
      if (this.lastUpdatedCell && this.lastUpdatedCell.seq !== this.renderedQSeq) {
        this.renderedQSeq = this.lastUpdatedCell.seq;
        if (enableFlash) {
          const refs = this.qRows[this.lastUpdatedCell.state];
          const el = this.lastUpdatedCell.action === 'PULAR' ? refs.jump : refs.run;
          el.classList.remove('q-cell-flash');
          void el.offsetWidth; // reinicia a animação
          el.classList.add('q-cell-flash');
        }
      }
    }

    updateControlStates() {
      const btnStart = this.$('btn-start-pause');
      const btnToggle = this.$('btn-toggle-mode');
      const btnTrain = this.$('btn-train-batch');
      const badgeRun = this.$('badge-run-state');
      const training = this.batchRemaining > 0;

      if (!this.isRunning) {
        btnStart.innerHTML = '<span class="btn-ico" aria-hidden="true">▶</span> Iniciar';
        badgeRun.textContent = 'PRONTO';
        badgeRun.className = 'badge badge-state';
      } else if (this.isPaused) {
        btnStart.innerHTML = '<span class="btn-ico" aria-hidden="true">▶</span> Continuar';
        badgeRun.textContent = 'PAUSADO';
        badgeRun.className = 'badge badge-state paused';
      } else if (training) {
        btnStart.innerHTML = '<span class="btn-ico" aria-hidden="true">❚❚</span> Pausar';
        badgeRun.textContent = 'TREINANDO TURBO';
        badgeRun.className = 'badge badge-state training';
      } else {
        btnStart.innerHTML = '<span class="btn-ico" aria-hidden="true">❚❚</span> Pausar';
        badgeRun.textContent = 'EM EXECUÇÃO';
        badgeRun.className = 'badge badge-state running';
      }

      btnTrain.disabled = training;
      btnTrain.classList.toggle('is-busy', training);
      btnTrain.innerHTML = training
        ? '<span class="btn-ico" aria-hidden="true">⚡</span> Treinando...'
        : '<span class="btn-ico" aria-hidden="true">⚡</span> TREINAR AGENTE (+60 Ep.)';

      if (this.mode === 'ai') {
        this.setText('badge-mode', 'MODO IA');
        this.setClass('badge-mode', 'badge badge-mode');
        btnToggle.innerHTML = '<span class="btn-ico" aria-hidden="true">⇄</span> Alternar p/ Modo Manual';
        this.setText(
          'mode-description',
          'Modo Treinamento Automático: o agente escolhe as ações e atualiza a Tabela Q em tempo real.'
        );
        this.$('manual-controls-bar').classList.add('hidden');
        this.$('speed-selector').classList.remove('hidden');
      } else {
        this.setText('badge-mode', 'MODO MANUAL');
        this.setClass('badge-mode', 'badge badge-mode manual');
        btnToggle.innerHTML = '<span class="btn-ico" aria-hidden="true">⇄</span> Alternar p/ Modo IA';
        this.setText(
          'mode-description',
          'Modo Manual: você controla os saltos do personagem para testar o desafio pessoalmente.'
        );
        this.$('manual-controls-bar').classList.remove('hidden');
        this.$('speed-selector').classList.add('hidden');
      }

      this.updateBatchProgressUI();
    }

    updateBatchProgressUI() {
      const wrap = this.$('batch-progress-wrap');

      if (this.batchRemaining > 0) {
        wrap.classList.remove('hidden');
        const done = this.batchTotal - this.batchRemaining;
        this.setText('batch-progress-count', `${done} / ${this.batchTotal} episódios`);
        this.$('batch-progress-fill').style.width = `${(done / this.batchTotal) * 100}%`;
      } else {
        wrap.classList.add('hidden');
      }
    }

    updateSpeedChips() {
      document.querySelectorAll('#speed-selector .chip').forEach((btn) => {
        const active = Number(btn.dataset.speed) === this.simSpeed;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
    }

    showOverlay(title, text, btnText, icon = '❚❚') {
      this.$('overlay-icon').textContent = icon;
      this.$('overlay-title').textContent = title;
      this.$('overlay-text').textContent = text;
      this.$('btn-overlay-action').textContent = btnText;
      this.$('canvas-overlay').classList.remove('hidden');
    }

    hideOverlay() {
      this.$('canvas-overlay').classList.add('hidden');
    }

    showReadyOverlay() {
      if (this.mode === 'manual') {
        this.showOverlay(
          'Modo Manual',
          'Pressione Espaço, ↑ ou toque no cenário para pular. Desvie do máximo de obstáculos!',
          'Começar',
          '▲'
        );
      } else {
        this.showOverlay(
          'Pronto para treinar?',
          'Inicie para observar o agente, ou use "Treinar Agente" para 60 episódios em alta velocidade.',
          'Iniciar',
          '▶'
        );
      }
    }

    showToast(message) {
      const toast = this.$('toast');
      toast.textContent = message;
      toast.classList.add('show');
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
    }

    /* -------------------------------------------------------
       NAVEGAÇÃO ENTRE TELAS
    ------------------------------------------------------- */
    enterLab(targetHash) {
      const wasHidden = this.appMain.classList.contains('hidden');
      this.startScreen.classList.add('hidden');
      this.appMain.classList.remove('hidden');
      this.updateControlStates();
      this.updateAIPanel();
      this.renderQTable(false);
      this.drawGame();

      if (!this.isRunning) {
        this.showReadyOverlay();
      } else if (this.isPaused) {
        this.showOverlay(
          'Simulação Pausada',
          'Você voltou ao laboratório. Continue de onde parou.',
          'Continuar'
        );
      }

      // Os gráficos precisam do layout visível para medir a largura real
      requestAnimationFrame(() => {
        this.charts.renderAll(this.history);
        const target = targetHash ? document.querySelector(targetHash) : null;
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        } else if (wasHidden) {
          window.scrollTo({ top: 0 });
        }
      });
    }

    goHome() {
      if (this.isRunning) this.isPaused = true;
      if (this.batchRemaining > 0) {
        this.batchRemaining = 0;
        this.showToast('Treino em lote interrompido.');
      }
      this.hideOverlay();
      this.updateControlStates();
      this.appMain.classList.add('hidden');
      this.startScreen.classList.remove('hidden');
      this.updateCharacterSelectionUI();
      window.scrollTo({ top: 0 });
    }

    togglePause() {
      if (!this.isRunning) {
        this.hideOverlay();
        if (this.player.collided) this.resetEpisodeEntities();
        this.isRunning = true;
        this.isPaused = false;
      } else {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
          this.showOverlay(
            'Simulação Pausada',
            'Você pode inspecionar a Tabela Q atual ou retomar a corrida.',
            'Continuar'
          );
        } else {
          this.hideOverlay();
        }
      }
      this.updateControlStates();
      this.updateAIPanel();
    }

    restartRun() {
      this.hideOverlay();
      this.batchRemaining = 0;
      this.resetEpisodeEntities();
      this.isRunning = true;
      this.isPaused = false;
      this.updateControlStates();
      this.updateAIPanel();
    }

    toggleMode() {
      this.hideOverlay();
      this.batchRemaining = 0;
      this.mode = this.mode === 'ai' ? 'manual' : 'ai';
      this.resetEpisodeEntities();
      this.isPaused = false;
      if (this.mode === 'manual') {
        // Dá ao jogador tempo para se preparar antes de começar
        this.isRunning = false;
        this.showReadyOverlay();
      } else {
        this.isRunning = true;
      }
      this.updateControlStates();
      this.updateAIPanel();
      this.renderQTable(false);
    }

    /* -------------------------------------------------------
       EVENTOS DE INTERAÇÃO DO USUÁRIO
    ------------------------------------------------------- */
    bindEvents() {
      // Navegação entre tela inicial e laboratório
      this.$('btn-enter-lab').addEventListener('click', () => this.enterLab());

      this.$('btn-open-select').addEventListener('click', () => this.goHome());
      const brand = this.$('brand-home');
      brand.addEventListener('click', () => this.goHome());
      brand.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.goHome();
        }
      });

      // Links do menu funcionam também a partir da tela inicial
      document.querySelectorAll('.topnav .nav-link').forEach((link) => {
        link.addEventListener('click', (e) => {
          const hash = link.getAttribute('href');
          if (this.appMain.classList.contains('hidden')) {
            e.preventDefault();
            this.enterLab(hash);
          }
        });
      });
      this.observeSections();

      // Iniciar / Pausar
      this.$('btn-start-pause').addEventListener('click', () => this.togglePause());

      // Overlay ação
      this.$('btn-overlay-action').addEventListener('click', () => {
        this.hideOverlay();
        if (this.player.collided) {
          this.resetEpisodeEntities();
        }
        this.isRunning = true;
        this.isPaused = false;
        this.updateControlStates();
        this.updateAIPanel();
      });

      // Reiniciar tentativa atual
      this.$('btn-restart-run').addEventListener('click', () => this.restartRun());

      // Alternar Modo Manual <-> Modo IA
      this.$('btn-toggle-mode').addEventListener('click', () => this.toggleMode());

      // Botão TREINAR AGENTE (+60 episódios automáticos)
      this.$('btn-train-batch').addEventListener('click', () => {
        if (this.batchRemaining > 0) return;
        this.hideOverlay();
        this.mode = 'ai';
        this.greedyOnly = false;
        this.$('chk-greedy-only').checked = false;
        this.resetEpisodeEntities();
        this.batchTotal = 60;
        this.batchRemaining = 60;
        this.isRunning = true;
        this.isPaused = false;
        this.updateControlStates();
        this.updateAIPanel();
      });

      // Botão Observar Agente em velocidade normal (1x)
      this.$('btn-observe-agent').addEventListener('click', () => {
        this.hideOverlay();
        this.batchRemaining = 0;
        this.mode = 'ai';
        this.simSpeed = 1;
        this.updateSpeedChips();
        this.resetEpisodeEntities();
        this.isRunning = true;
        this.isPaused = false;
        this.updateControlStates();
        this.updateAIPanel();
      });

      // Seletor de velocidade IA
      document.querySelectorAll('#speed-selector .chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          this.simSpeed = Number(chip.dataset.speed) || 1;
          this.updateSpeedChips();
        });
      });

      // Checkboxes
      this.$('chk-show-sensors').addEventListener('change', (e) => {
        this.showSensors = e.target.checked;
        this.drawGame();
      });

      this.$('chk-greedy-only').addEventListener('change', (e) => {
        this.greedyOnly = e.target.checked;
        this.updateAIPanel();
      });

      // Resetar todo o treinamento (zera Tabela Q, histórico e localStorage)
      this.$('btn-reset-training').addEventListener('click', () => {
        const ok = window.confirm(
          'Resetar todo o treinamento?\n\nA Tabela Q, o histórico de episódios e o recorde serão apagados.'
        );
        if (!ok) return;

        this.batchRemaining = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.agent.reset();
        this.episodes = 0;
        this.bestScore = 0;
        this.totalObstaclesCleared = 0;
        this.history = [];
        this.lastUpdatedCell = null;
        this.updateCounts = this.createEmptyCounts();
        this.resetEpisodeEntities();

        try {
          localStorage.removeItem(this.STORAGE_KEY);
        } catch (err) {
          // Ignora
        }
        this.saveToStorage();
        this.$('saved-progress-note').hidden = true;

        this.renderQTable(false);
        this.charts.renderAll(this.history);
        this.updateAIPanel();
        this.updateControlStates();
        this.showReadyOverlay();
        this.drawGame();
        this.showToast('Treinamento resetado: a Tabela Q voltou a zero.');
      });

      // Controles Manuais (teclado, toque/clique no canvas e botão na tela)
      const handleManualJump = () => {
        if (this.appMain.classList.contains('hidden')) return;
        if (this.mode !== 'manual') return;
        if (!this.isRunning) {
          this.hideOverlay();
          if (this.player.collided) this.resetEpisodeEntities();
          this.isRunning = true;
          this.isPaused = false;
          this.updateControlStates();
        }
        if (!this.isPaused) {
          this.triggerJump();
        }
      };

      this.$('btn-manual-jump').addEventListener('click', handleManualJump);

      // pointerdown responde imediatamente ao toque (sem o atraso do "click" no celular)
      this.gameCanvas.addEventListener('pointerdown', (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        if (this.mode === 'manual') {
          e.preventDefault();
          handleManualJump();
        } else if (!this.isRunning) {
          this.togglePause();
          this.hideOverlay();
        }
      });

      window.addEventListener('keydown', (e) => {
        if (this.appMain.classList.contains('hidden')) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const tag = e.target && e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
          if (this.mode === 'manual') {
            // Evita rolar a página ou "clicar" no botão focado ao pular
            e.preventDefault();
            handleManualJump();
          }
        } else if (!e.repeat && e.code === 'KeyP') {
          this.togglePause();
        } else if (!e.repeat && e.code === 'KeyR') {
          this.restartRun();
        } else if (!e.repeat && e.code === 'KeyM') {
          this.toggleMode();
        }
      });

      // Pausa automática no modo manual ao trocar de aba
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && this.mode === 'manual' && this.isRunning && !this.isPaused) {
          this.togglePause();
        }
      });

      // Redesenha os gráficos ao redimensionar a janela (mantém nitidez e proporção)
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (!this.appMain.classList.contains('hidden')) {
            this.charts.renderAll(this.history);
          }
        }, 150);
      });
    }

    // Destaca no menu a seção visível no momento
    observeSections() {
      if (!('IntersectionObserver' in window)) return;
      const links = Array.from(document.querySelectorAll('.topnav .nav-link'));
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = `#${entry.target.id}`;
            links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === id));
          });
        },
        { rootMargin: '-45% 0px -50% 0px' }
      );
      document.querySelectorAll('.section-block').forEach((sec) => observer.observe(sec));
    }
  }

  // Inicializa aplicação após carregamento do DOM
  window.addEventListener('DOMContentLoaded', () => {
    new RunAndLearnApp();
  });
})();