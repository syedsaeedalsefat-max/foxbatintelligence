import React, { useEffect, useRef } from 'react';

interface Token {
  text: string;
  color: string;
}

interface CodeLine {
  indent: number;
  tokens: Token[];
}

interface Sprite {
  canvas: HTMLCanvasElement;
  w: number;
  h: number;
}

interface Particle {
  sprite: Sprite;
  x: number;
  y: number;
  vx: number;
  vy: number;
  spanW: number;
  spanH: number;
}

const PALETTE = {
  pink: '#f43f5e',
  cyan: '#00e5ff',
  blue: '#38bdf8',
  green: '#10b981',
  purple: '#c084fc',
  white: '#f8fafc',
  yellow: '#fbbf24',
  muted: '#64748b',
};

const CODE_SNIPPETS: CodeLine[][] = [
  // 1. Packet Inspection & Cryptographic Frame Signature
  [
    { indent: 0, tokens: [{ text: '#include ', color: PALETTE.pink }, { text: '<foxbat/sec_protocol.h>', color: PALETTE.green }] },
    { indent: 0, tokens: [{ text: 'uint32_t ', color: PALETTE.blue }, { text: 'verify_frame_digest', color: PALETTE.pink }, { text: '(const uint8_t *frame, size_t len)', color: PALETTE.white }] },
    { indent: 0, tokens: [{ text: '{', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'if ', color: PALETTE.pink }, { text: '(!sec_check_digest(frame, len, SEC_SHA256))', color: PALETTE.white }] },
    { indent: 2, tokens: [{ text: 'return ', color: PALETTE.pink }, { text: 'ERR_UNAUTHORIZED_PAYLOAD;', color: PALETTE.cyan }] },
    { indent: 1, tokens: [{ text: 'audit_log->emit', color: PALETTE.cyan }, { text: '("[FOXBAT] Zero-Trust Frame Integrity Verified");', color: PALETTE.green }] },
    { indent: 1, tokens: [{ text: 'return ', color: PALETTE.pink }, { text: 'STATUS_INTEGRITY_OK;', color: PALETTE.cyan }] },
    { indent: 0, tokens: [{ text: '}', color: PALETTE.white }] },
  ],
  // 2. Zero-Trust Token & Risk Anomaly Assessment
  [
    { indent: 0, tokens: [{ text: 'async function ', color: PALETTE.pink }, { text: 'auditSessionToken', color: PALETTE.blue }, { text: '(token: ', color: PALETTE.white }, { text: 'string', color: PALETTE.cyan }, { text: '): Promise<TrustScore> {', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'const ', color: PALETTE.pink }, { text: 'claims = ', color: PALETTE.white }, { text: 'await ', color: PALETTE.purple }, { text: 'cryptoEngine.verifyToken(token, FOXBAT_PUBKEY);', color: PALETTE.cyan }] },
    { indent: 1, tokens: [{ text: 'if ', color: PALETTE.pink }, { text: '(claims.anomalyScore > 0.04) {', color: PALETTE.white }] },
    { indent: 2, tokens: [{ text: 'telemetry.alert', color: PALETTE.yellow }, { text: '({ severity: ', color: PALETTE.white }, { text: '"CRITICAL"', color: PALETTE.pink }, { text: ', host: claims.origin });', color: PALETTE.white }] },
    { indent: 2, tokens: [{ text: 'throw new ', color: PALETTE.pink }, { text: 'UnauthorizedSecurityContextException();', color: PALETTE.purple }] },
    { indent: 1, tokens: [{ text: '}', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'return ', color: PALETTE.pink }, { text: '{ subject: claims.sub, verified: true, tier: 1 };', color: PALETTE.green }] },
    { indent: 0, tokens: [{ text: '}', color: PALETTE.white }] },
  ],
  // 3. Web Application Security AST Query Sanitizer
  [
    { indent: 0, tokens: [{ text: 'def ', color: PALETTE.pink }, { text: 'validate_query_ast', color: PALETTE.blue }, { text: '(raw_input: str, tenant_ctx: Context) -> SafeAST:', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'ast_tokens = ', color: PALETTE.white }, { text: 'sql_parser.lex_tokens', color: PALETTE.cyan }, { text: '(raw_input)', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'for ', color: PALETTE.pink }, { text: 'token in ast_tokens:', color: PALETTE.white }] },
    { indent: 2, tokens: [{ text: 'if ', color: PALETTE.pink }, { text: 'token.is_tautology() or token.has_stacked_query():', color: PALETTE.white }] },
    { indent: 3, tokens: [{ text: 'soc_pipeline.record_injection_attempt', color: PALETTE.pink }, { text: '(token.literal)', color: PALETTE.white }] },
    { indent: 3, tokens: [{ text: 'raise ', color: PALETTE.pink }, { text: 'InjectionNeutralizedAlert', color: PALETTE.purple }, { text: '("SQLi probe blocked")', color: PALETTE.green }] },
    { indent: 1, tokens: [{ text: 'return ', color: PALETTE.pink }, { text: 'ast_tokens.to_parameterized_tree()', color: PALETTE.cyan }] },
  ],
  // 4. Memory Boundary Guard & Canary Check
  [
    { indent: 0, tokens: [{ text: 'static inline ', color: PALETTE.pink }, { text: 'void *', color: PALETTE.blue }, { text: 'guarded_page_alloc(size_t alloc_sz) {', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'uint8_t *ptr = (uint8_t *)', color: PALETTE.white }, { text: 'mmap', color: PALETTE.blue }, { text: '(NULL, alloc_sz + 4096, PROT_READ|PROT_WRITE, MAP_ANON, -1, 0);', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'uint64_t *canary = (uint64_t *)(ptr + alloc_sz);', color: PALETTE.cyan }] },
    { indent: 1, tokens: [{ text: '*canary = ', color: PALETTE.white }, { text: '0xFOXBAT_GUARD_77F;', color: PALETTE.yellow }] },
    { indent: 1, tokens: [{ text: 'mprotect', color: PALETTE.blue }, { text: '(ptr + alloc_sz, 4096, PROT_NONE);', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'return ', color: PALETTE.pink }, { text: '(void *)ptr;', color: PALETTE.green }] },
    { indent: 0, tokens: [{ text: '}', color: PALETTE.white }] },
  ],
  // 5. Automated Recon & Security Headers Audit
  [
    { indent: 0, tokens: [{ text: 'type ', color: PALETTE.blue }, { text: 'SecurityAuditHeaderMap ', color: PALETTE.purple }, { text: 'map[string]HeaderExpectation', color: PALETTE.white }] },
    { indent: 0, tokens: [{ text: 'func ', color: PALETTE.pink }, { text: 'InspectSurfaceHeaders', color: PALETTE.blue }, { text: '(resp *http.Response) *PostureAudit {', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'posture := &PostureAudit{ Score: 100, Deficiencies: nil }', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'if ', color: PALETTE.pink }, { text: 'resp.Header.Get("Content-Security-Policy") == "" {', color: PALETTE.white }] },
    { indent: 2, tokens: [{ text: 'posture.Deduct(25, ', color: PALETTE.cyan }, { text: '"CSP_MISSING"', color: PALETTE.pink }, { text: ')', color: PALETTE.cyan }] },
    { indent: 1, tokens: [{ text: '}', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'if ', color: PALETTE.pink }, { text: 'resp.Header.Get("Strict-Transport-Security") == "" {', color: PALETTE.white }] },
    { indent: 2, tokens: [{ text: 'posture.Deduct(20, ', color: PALETTE.cyan }, { text: '"HSTS_ABSENT"', color: PALETTE.pink }, { text: ')', color: PALETTE.cyan }] },
    { indent: 1, tokens: [{ text: '}', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'return ', color: PALETTE.pink }, { text: 'posture', color: PALETTE.green }] },
    { indent: 0, tokens: [{ text: '}', color: PALETTE.white }] },
  ],
  // 6. Cryptographic AES-GCM Payload Envelope
  [
    { indent: 0, tokens: [{ text: 'const ', color: PALETTE.pink }, { text: 'sealPayload = ', color: PALETTE.white }, { text: 'async ', color: PALETTE.purple }, { text: '(envelope: SecurityEnvelope) => {', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'const ', color: PALETTE.pink }, { text: 'iv = crypto.getRandomValues(new Uint8Array(12));', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'const ', color: PALETTE.pink }, { text: 'ciphertext = await crypto.subtle.encrypt(', color: PALETTE.cyan }] },
    { indent: 2, tokens: [{ text: '{ name: "AES-GCM", iv, tagLength: 128 },', color: PALETTE.green }] },
    { indent: 2, tokens: [{ text: 'envelope.keyHandle,', color: PALETTE.white }] },
    { indent: 2, tokens: [{ text: 'new TextEncoder().encode(envelope.payload)', color: PALETTE.yellow }] },
    { indent: 1, tokens: [{ text: ');', color: PALETTE.cyan }] },
    { indent: 1, tokens: [{ text: 'return ', color: PALETTE.pink }, { text: '{ iv: toHex(iv), data: toHex(ciphertext) };', color: PALETTE.white }] },
    { indent: 0, tokens: [{ text: '};', color: PALETTE.white }] },
  ],
  // 7. eBPF Network Kernel Tracepoint
  [
    { indent: 0, tokens: [{ text: 'SEC("tracepoint/syscalls/sys_enter_connect")', color: PALETTE.purple }] },
    { indent: 0, tokens: [{ text: 'int ', color: PALETTE.blue }, { text: 'detect_outbound_c2_socket', color: PALETTE.pink }, { text: '(struct trace_event_raw_sys_enter *ctx) {', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'struct sockaddr_in user_addr;', color: PALETTE.cyan }] },
    { indent: 1, tokens: [{ text: 'bpf_probe_read_user(&user_addr, sizeof(user_addr), (void *)ctx->args[1]);', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'if ', color: PALETTE.pink }, { text: '(is_threat_intelligence_ip(user_addr.sin_addr.s_addr)) {', color: PALETTE.white }] },
    { indent: 2, tokens: [{ text: 'bpf_override_return(ctx, -EPERM);', color: PALETTE.pink }] },
    { indent: 2, tokens: [{ text: 'bpf_perf_event_output(ctx, &events, BPF_F_CURRENT_CPU, &alert, sizeof(alert));', color: PALETTE.yellow }] },
    { indent: 1, tokens: [{ text: '}', color: PALETTE.white }] },
    { indent: 1, tokens: [{ text: 'return ', color: PALETTE.pink }, { text: '0;', color: PALETTE.green }] },
    { indent: 0, tokens: [{ text: '}', color: PALETTE.white }] },
  ],
];

// Helper to pre-render a code snippet to an offscreen canvas
function renderCodeSprite(
  snippet: CodeLine[],
  scaleRatio: number,
  blurPx: number,
  alpha: number,
  dpr: number
): Sprite {
  const canvas = document.createElement('canvas');
  const pad = Math.ceil(blurPx * 3 + 14);
  const fontSize = Math.round(13.5 * scaleRatio);
  const lineHeight = Math.round(20 * scaleRatio);
  const targetW = Math.round(520 * scaleRatio) + pad * 2;
  const targetH = snippet.length * lineHeight + pad * 2;

  canvas.width = Math.ceil(targetW * dpr);
  canvas.height = Math.ceil(targetH * dpr);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { canvas, w: targetW, h: targetH };
  }

  ctx.save();
  ctx.scale(dpr, dpr);
  if (blurPx > 0) {
    ctx.filter = `blur(${blurPx}px)`;
  }
  ctx.globalAlpha = alpha;
  ctx.font = `600 ${fontSize}px "JetBrains Mono", Consolas, monospace`;
  ctx.textBaseline = 'top';

  snippet.forEach((line, lineIdx) => {
    let curX = pad + line.indent * Math.round(22 * scaleRatio);
    const curY = pad + lineIdx * lineHeight;

    line.tokens.forEach((token) => {
      ctx.fillStyle = token.color;
      ctx.shadowColor = token.color;
      ctx.shadowBlur = blurPx === 0 ? 8 : 4;
      ctx.fillText(token.text, curX, curY);
      curX += ctx.measureText(token.text).width;
    });
  });

  ctx.restore();
  return { canvas, w: targetW, h: targetH };
}

// Helper to render cyber circuit/telemetry blocks (like F2 in reference)
function renderPulseBlockSprite(seed: number, dpr: number): Sprite {
  const canvas = document.createElement('canvas');
  const w = 380;
  const h = 240;
  canvas.width = Math.ceil(w * dpr);
  canvas.height = Math.ceil(h * dpr);

  const ctx = canvas.getContext('2d');
  if (!ctx) return { canvas, w, h };

  const colors = [PALETTE.cyan, PALETTE.blue, PALETTE.green, PALETTE.pink, PALETTE.purple, PALETTE.white];
  let rng = seed * 9301 + 49297;
  const nextRng = () => {
    rng = (rng * 9301 + 49297) % 233280;
    return rng / 233280;
  };

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.filter = 'blur(2.5px)';

  for (let row = 0; row < 14; row++) {
    const y = 14 + row * 16;
    let x = 16 + Math.floor(nextRng() * 3) * 16;
    const count = 2 + Math.floor(nextRng() * 4);

    for (let c = 0; c < count; c++) {
      const barLen = 18 + nextRng() * 70;
      const barColor = colors[Math.floor(nextRng() * colors.length)];
      ctx.fillStyle = barColor;
      ctx.globalAlpha = 0.18 + nextRng() * 0.26;
      ctx.fillRect(x, y, barLen, 4);
      x += barLen + 8 + nextRng() * 16;
      if (x > 350) break;
    }
  }

  ctx.restore();
  return { canvas, w, h };
}

export const CyberBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // Pre-render sprites across layers with rich vivid cyber visibility
    const pulseSprites = [1, 2, 3, 4].map((id) => renderPulseBlockSprite(id, dpr));

    // Layer 1: Deep background blurred code
    const bgSprites = CODE_SNIPPETS.map((snip) => renderCodeSprite(snip, 0.68, 2.0, 0.35, dpr));

    // Layer 2: Midground semi-sharp code
    const midSprites = CODE_SNIPPETS.map((snip) => renderCodeSprite(snip, 0.82, 0.8, 0.58, dpr));

    // Layer 3: Foreground vibrant sharp code
    const fgSprites = CODE_SNIPPETS.map((snip) => renderCodeSprite(snip, 0.98, 0, 0.78, dpr));

    let particles: Particle[] = [];

    const setupScene = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = [];
      const spanW = Math.max(width * 1.35, 800);
      const spanH = Math.max(height * 1.35, 700);

      // Pulse telemetry bars
      const numPulse = width < 768 ? 8 : 18;
      for (let i = 0; i < numPulse; i++) {
        const sprite = pulseSprites[i % pulseSprites.length];
        particles.push({
          sprite,
          x: ((i * 211) % spanW) - 140,
          y: ((i * 137) % spanH) - 100,
          vx: -(14 + (i % 4) * 3),
          vy: -1.8,
          spanW,
          spanH,
        });
      }

      // Background code layer
      const numBg = width < 768 ? 6 : 10;
      for (let i = 0; i < numBg; i++) {
        const sprite = bgSprites[i % bgSprites.length];
        particles.push({
          sprite,
          x: (i / numBg) * spanW - 160,
          y: ((i * 193) % spanH) - 110,
          vx: -(24 + (i % 3) * 4),
          vy: -3.2,
          spanW,
          spanH,
        });
      }

      // Midground code layer
      const numMid = width < 768 ? 5 : 8;
      for (let i = 0; i < numMid; i++) {
        const sprite = midSprites[(i + 2) % midSprites.length];
        particles.push({
          sprite,
          x: (i / numMid) * spanW - 180,
          y: ((i * 241 + 60) % spanH) - 100,
          vx: -(38 + (i % 3) * 5),
          vy: -4.8,
          spanW,
          spanH,
        });
      }

      // Foreground code layer
      const numFg = width < 768 ? 4 : 6;
      for (let i = 0; i < numFg; i++) {
        const sprite = fgSprites[(i + 4) % fgSprites.length];
        particles.push({
          sprite,
          x: (i / numFg) * spanW - 150,
          y: ((i * 179 + 30) % spanH) - 80,
          vx: -(54 + (i % 3) * 6),
          vy: -6.2,
          spanW,
          spanH,
        });
      }
    };

    setupScene();
    window.addEventListener('resize', setupScene);

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      // Base cyber linear gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#040614');
      grad.addColorStop(0.48, '#08102e');
      grad.addColorStop(1, '#040717');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Radial cyber glow centered around upper right/center
      const radial = ctx.createRadialGradient(
        width * 0.65,
        height * 0.45,
        20,
        width * 0.65,
        height * 0.45,
        Math.max(width, height) * 0.7
      );
      radial.addColorStop(0, 'rgba(42, 76, 185, 0.38)');
      radial.addColorStop(0.45, 'rgba(28, 42, 115, 0.22)');
      radial.addColorStop(1, 'rgba(4, 6, 20, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Render all moving code sprites
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Wrap around when moving off screen
        if (p.x + p.sprite.w < -140) {
          p.x += p.spanW + 140;
        }
        if (p.y + p.sprite.h < -140) {
          p.y += p.spanH + 140;
        }

        // Only draw if within visible viewport bounds
        if (p.x < width + 50 && p.x + p.sprite.w > -50 && p.y < height + 50 && p.y + p.sprite.h > -50) {
          ctx.drawImage(p.sprite.canvas, p.x, p.y, p.sprite.w, p.sprite.h);
        }
      }

      animId = window.requestAnimationFrame(render);
    };

    animId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animId);
      window.removeEventListener('resize', setupScene);
    };
  }, []);

  return (
    <div className="cyber-bg-container" aria-hidden="true">
      <canvas ref={canvasRef} className="cyber-canvas" />
      <div className="cyber-scrim-overlay" />
      <div className="cyber-scanlines-overlay" />
      <div className="cyber-vignette-overlay" />
    </div>
  );
};

