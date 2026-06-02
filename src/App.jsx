import { useState, useRef, useCallback } from "react";

const SECTIONS = [
  { id: "foto",      icon: "◈", label: "Produto",    step: "01" },
  { id: "dimensoes", icon: "⬡", label: "Dimensões",  step: "02" },
  { id: "filamento", icon: "◎", label: "Filamento",  step: "03" },
  { id: "tempo",     icon: "◷", label: "Tempo",      step: "04" },
  { id: "energia",   icon: "⚡", label: "Energia",    step: "05" },
  { id: "desgaste",  icon: "⚙", label: "Desgaste",   step: "06" },
  { id: "margem",    icon: "◈", label: "Margem",     step: "07" },
];

const init = {
  image: null, imagePreview: null,
  width: "", height: "", depth: "",
  filamentGrams: "", filamentKgPrice: "",
  printHours: "", printMinutes: "",
  printerWatts: "350", kwhPrice: "0.75",
  printerCost: "2200", printerLifespanHours: "5000",
  maintenanceMonthly: "50", marginPercent: "30",
};

function NumInput({ label, name, value, onChange, placeholder, hint, unit }) {
  return (
    <div className="group">
      <label style={styles.label}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={styles.input}
          onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
          onBlur={e => Object.assign(e.target.style, styles.inputBlur)}
        />
        {unit && (
          <span style={styles.inputUnit}>{unit}</span>
        )}
      </div>
      {hint && <p style={styles.hint}>{hint}</p>}
    </div>
  );
}

const C = {
  bg: "#07080a",
  surface: "#0e1014",
  surfaceHover: "#13161b",
  border: "#1c2028",
  borderHover: "#2a3040",
  accent: "#3b82f6",
  accentGlow: "rgba(59,130,246,0.15)",
  accentDim: "rgba(59,130,246,0.08)",
  gold: "#f0a445",
  goldGlow: "rgba(240,164,69,0.15)",
  text: "#e2e8f0",
  textMid: "#8896aa",
  textDim: "#3d4a5c",
  green: "#34d399",
};

const styles = {
  label: {
    display: "block",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: C.textMid,
    marginBottom: "8px",
    fontFamily: "'Syne', sans-serif",
  },
  input: {
    width: "100%",
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: "10px",
    padding: "12px 16px",
    color: C.text,
    fontSize: "14px",
    fontFamily: "'JetBrains Mono', monospace",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
  },
  inputFocus: {
    borderColor: C.accent,
    boxShadow: `0 0 0 3px ${C.accentGlow}`,
  },
  inputBlur: {
    borderColor: C.border,
    boxShadow: "none",
  },
  inputUnit: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "11px",
    color: C.textDim,
    fontFamily: "'JetBrains Mono', monospace",
    pointerEvents: "none",
  },
  hint: {
    fontSize: "10px",
    color: C.textDim,
    marginTop: "5px",
    fontFamily: "'Syne', sans-serif",
  },
};

export default function App() {
  const [form, setForm] = useState(init);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(null);
  const fileRef = useRef();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImage = file => {
    if (!file?.type.startsWith("image/")) return;
    setForm(f => ({ ...f, image: file, imagePreview: URL.createObjectURL(file) }));
  };

  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false);
    handleImage(e.dataTransfer.files[0]);
  }, []);

  const calcular = () => {
    const filamentKg = parseFloat(form.filamentGrams) / 1000 || 0;
    const filamentCost = filamentKg * (parseFloat(form.filamentKgPrice) || 0);
    const totalHours = (parseFloat(form.printHours) || 0) + (parseFloat(form.printMinutes) || 0) / 60;
    const energyCost = (parseFloat(form.printerWatts) || 200) / 1000 * totalHours * (parseFloat(form.kwhPrice) || 0.75);
    const wearCost = ((parseFloat(form.printerCost) || 2000) / (parseFloat(form.printerLifespanHours) || 5000)) * totalHours;
    const maintenanceCost = ((parseFloat(form.maintenanceMonthly) || 0) / (30 * 8)) * totalHours;
    const subtotal = filamentCost + energyCost + wearCost + maintenanceCost;
    const margin = (parseFloat(form.marginPercent) || 0) / 100;
    const totalPrice = subtotal * (1 + margin);
    setResult({ filamentCost, energyCost, wearCost, maintenanceCost, subtotal, totalPrice, totalHours, marginValue: totalPrice - subtotal });
  };

  const fmt = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const pct = (v, total) => total > 0 ? Math.round((v / total) * 100) : 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'Syne', sans-serif",
      color: C.text,
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.accent}; border-radius: 2px; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0; }
        input[type=number] { -moz-appearance: textfield; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes scanline {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100vh); }
        }
        @keyframes resultIn {
          from { opacity:0; transform: scale(0.97) translateY(12px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        .card { animation: fadeUp 0.5s ease both; }
        .result-anim { animation: resultIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .calc-btn:hover { background: #4f96ff !important; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(59,130,246,0.35) !important; }
        .calc-btn:active { transform: translateY(0); }
      `}</style>

      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `
          linear-gradient(${C.border} 1px, transparent 1px),
          linear-gradient(90deg, ${C.border} 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        opacity: 0.35,
      }} />

      {/* Accent glow top */}
      <div style={{
        position: "fixed", top: -120, left: "50%", transform: "translateX(-50%)",
        width: 600, height: 300,
        background: `radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)`,
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: C.accentDim, border: `1px solid rgba(59,130,246,0.2)`,
            borderRadius: 100, padding: "6px 16px", marginBottom: 20,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.2em", color: C.accent, fontWeight: 600 }}>
              FERRAMENTA DE PRECIFICAÇÃO
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(40px,8vw,72px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: "#fff",
            marginBottom: 8,
          }}>
            Calculadora<br />
            <span style={{
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundImage: `linear-gradient(135deg, ${C.accent} 0%, #818cf8 100%)`,
              backgroundClip: "text",
            }}>3D Print</span>
          </h1>
          <p style={{ color: C.textMid, fontSize: 14, marginTop: 16, fontFamily: "'JetBrains Mono', monospace" }}>
            Calcule o custo real de cada peça impressa
          </p>
        </div>

        {/* ── STEP PILLS ── */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}>
          {SECTIONS.map((s, i) => (
            <div key={s.id} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 100, padding: "5px 12px",
              fontSize: 11, color: C.textMid, fontWeight: 500,
              animation: `fadeUp 0.4s ${i * 0.05}s ease both`,
            }}>
              <span style={{ color: C.accent, fontSize: 9 }}>{s.step}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ── CARD HELPER ── */}
          {[
            // 01 Foto
            <Card key="foto" step="01" icon="◈" title="Foto do Produto" delay={0}>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current.click()}
                style={{
                  border: `2px dashed ${dragging ? C.accent : form.imagePreview ? "transparent" : C.border}`,
                  borderRadius: 14,
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "all 0.25s",
                  background: dragging ? C.accentDim : "transparent",
                  minHeight: form.imagePreview ? "auto" : 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => handleImage(e.target.files[0])} />
                {form.imagePreview ? (
                  <div style={{ position: "relative", width: "100%" }}>
                    <img src={form.imagePreview} alt="Produto"
                      style={{ width: "100%", maxHeight: 260, objectFit: "contain", borderRadius: 12, display: "block" }} />
                    <div style={{
                      position: "absolute", inset: 0, borderRadius: 12,
                      background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: 0, transition: "opacity 0.2s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0}
                    >
                      <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>↺ Trocar imagem</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: 32 }}>
                    <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.5 }}>⬡</div>
                    <p style={{ color: C.textMid, fontSize: 13 }}>Arraste ou clique para enviar</p>
                    <p style={{ color: C.textDim, fontSize: 11, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                      JPG · PNG · WEBP
                    </p>
                  </div>
                )}
              </div>
            </Card>,

            // 02 Dimensões
            <Card key="dim" step="02" icon="⬡" title="Dimensões do Produto" delay={1}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[["width","Largura X"],["height","Altura Z"],["depth","Prof. Y"]].map(([n,l]) => (
                  <NumInput key={n} label={l} name={n} value={form[n]} onChange={handleChange} placeholder="0" unit="mm" />
                ))}
              </div>
            </Card>,

            // 03 Filamento
            <Card key="fil" step="03" icon="◎" title="Filamento" delay={2}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <NumInput label="Filamento usado" name="filamentGrams" value={form.filamentGrams}
                  onChange={handleChange} placeholder="85" unit="g" />
                <NumInput label="Preço por kg" name="filamentKgPrice" value={form.filamentKgPrice}
                  onChange={handleChange} placeholder="120" unit="R$" />
              </div>
            </Card>,

            // 04 Tempo
            <Card key="tempo" step="04" icon="◷" title="Tempo de Produção" delay={3}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <NumInput label="Horas" name="printHours" value={form.printHours}
                  onChange={handleChange} placeholder="4" unit="h" />
                <NumInput label="Minutos" name="printMinutes" value={form.printMinutes}
                  onChange={handleChange} placeholder="30" unit="min" />
              </div>
            </Card>,

            // 05 Energia
            <Card key="energia" step="05" icon="⚡" title="Energia — 110v" delay={4}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <NumInput label="Consumo da impressora" name="printerWatts" value={form.printerWatts}
                  onChange={handleChange} placeholder="200" unit="W"
                  hint="Creality Hi ≈ 300–400W médio durante impressão" />
                <NumInput label="Tarifa kWh" name="kwhPrice" value={form.kwhPrice}
                  onChange={handleChange} placeholder="0.75" unit="R$"
                  hint="Média SP ≈ R$ 0,75" />
              </div>
            </Card>,

            // 06 Desgaste
            <Card key="desgaste" step="06" icon="⚙" title="Desgaste da Impressora" delay={5}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <NumInput label="Valor da impressora" name="printerCost" value={form.printerCost}
                  onChange={handleChange} placeholder="2000" unit="R$" />
                <NumInput label="Vida útil" name="printerLifespanHours" value={form.printerLifespanHours}
                  onChange={handleChange} placeholder="5000" unit="h" />
                <NumInput label="Manutenção/mês" name="maintenanceMonthly" value={form.maintenanceMonthly}
                  onChange={handleChange} placeholder="50" unit="R$" />
              </div>
            </Card>,

            // 07 Margem
            <Card key="margem" step="07" icon="◈" title="Margem de Lucro" delay={6}>
              <div style={{ maxWidth: 200 }}>
                <NumInput label="Margem desejada" name="marginPercent" value={form.marginPercent}
                  onChange={handleChange} placeholder="30" unit="%" />
              </div>
            </Card>,
          ]}

          {/* ── BOTÃO CALCULAR ── */}
          <button
            className="calc-btn"
            onClick={calcular}
            style={{
              width: "100%",
              padding: "18px 32px",
              background: C.accent,
              border: "none",
              borderRadius: 14,
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "'Syne', sans-serif",
              transition: "all 0.2s",
              boxShadow: `0 4px 24px ${C.accentGlow}`,
              animation: "fadeUp 0.5s 0.35s ease both",
            }}
          >
            Calcular Preço de Venda →
          </button>

          {/* ── RESULTADO ── */}
          {result && (
            <div className="result-anim" style={{
              background: C.surface,
              border: `1px solid rgba(240,164,69,0.3)`,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: `0 0 48px ${C.goldGlow}`,
            }}>
              {/* Topo dourado */}
              <div style={{
                background: `linear-gradient(135deg, rgba(240,164,69,0.12) 0%, rgba(240,164,69,0.04) 100%)`,
                borderBottom: `1px solid rgba(240,164,69,0.2)`,
                padding: "28px 32px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: 16,
              }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: "0.2em", color: C.gold, fontWeight: 600, marginBottom: 6 }}>
                    PREÇO SUGERIDO DE VENDA
                  </div>
                  <div style={{
                    fontSize: "clamp(36px,8vw,56px)",
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {fmt(result.totalPrice)}
                  </div>
                </div>
                {form.imagePreview && (
                  <img src={form.imagePreview} alt=""
                    style={{ width: 72, height: 72, objectFit: "contain", borderRadius: 12, border: `1px solid ${C.border}` }} />
                )}
              </div>

              {/* Detalhamento */}
              <div style={{ padding: "24px 32px" }}>

                {/* Barras de custo */}
                <div style={{ fontSize: 10, letterSpacing: "0.15em", color: C.textDim, fontWeight: 600, marginBottom: 16 }}>
                  COMPOSIÇÃO DO CUSTO
                </div>

                {[
                  { label: "Filamento", value: result.filamentCost, color: "#3b82f6", icon: "◎" },
                  { label: "Energia elétrica", value: result.energyCost, color: "#8b5cf6", icon: "⚡" },
                  { label: "Desgaste", value: result.wearCost, color: "#ec4899", icon: "⚙" },
                  { label: "Manutenção", value: result.maintenanceCost, color: "#06b6d4", icon: "◈" },
                ].map(item => (
                  <div key={item.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: item.color, fontSize: 12 }}>{item.icon}</span>
                        <span style={{ fontSize: 12, color: C.textMid }}>{item.label}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 10, color: C.textDim, fontFamily: "'JetBrains Mono', monospace" }}>
                          {pct(item.value, result.subtotal)}%
                        </span>
                        <span style={{ fontSize: 13, color: C.text, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
                          {fmt(item.value)}
                        </span>
                      </div>
                    </div>
                    <div style={{ height: 4, background: C.border, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${pct(item.value, result.subtotal)}%`,
                        background: item.color,
                        borderRadius: 4,
                        transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
                        boxShadow: `0 0 8px ${item.color}66`,
                      }} />
                    </div>
                  </div>
                ))}

                {/* Divisor */}
                <div style={{ borderTop: `1px solid ${C.border}`, margin: "20px 0" }} />

                {/* Subtotal + lucro */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Custo total", value: result.subtotal, color: C.textMid },
                    { label: `Lucro (${form.marginPercent}%)`, value: result.marginValue, color: C.green },
                  ].map(row => (
                    <div key={row.label} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <span style={{ fontSize: 13, color: C.textMid }}>{row.label}</span>
                      <span style={{
                        fontSize: 15, fontWeight: 600, color: row.color,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>{fmt(row.value)}</span>
                    </div>
                  ))}
                </div>

                {/* Info extra */}
                {(form.width || result.totalHours > 0) && (
                  <div style={{
                    marginTop: 20,
                    display: "flex", gap: 8, flexWrap: "wrap",
                  }}>
                    {form.width && form.height && form.depth && (
                      <Tag>{form.width}×{form.height}×{form.depth} mm</Tag>
                    )}
                    {result.totalHours > 0 && (
                      <Tag>
                        {Math.floor(result.totalHours)}h{Math.round((result.totalHours % 1) * 60).toString().padStart(2,"0")}min impressão
                      </Tag>
                    )}
                    {form.filamentGrams && (
                      <Tag>{form.filamentGrams}g de filamento</Tag>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        <p style={{
          textAlign: "center", color: C.textDim, fontSize: 11,
          marginTop: 40, fontFamily: "'JetBrains Mono', monospace",
        }}>
          valores são estimativas — ajuste conforme sua realidade
        </p>
      </div>
    </div>
  );
}

function Card({ step, icon, title, delay, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.surface,
        border: `1px solid ${hovered ? C.borderHover : C.border}`,
        borderRadius: 18,
        padding: "24px 24px 24px",
        transition: "all 0.25s",
        animationDelay: `${delay * 0.07}s`,
        boxShadow: hovered ? `0 8px 32px rgba(0,0,0,0.3)` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: C.accentDim, border: `1px solid rgba(59,130,246,0.2)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, color: C.accent,
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.2em", color: C.textDim, fontWeight: 600 }}>
            PASSO {step}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, letterSpacing: "0.02em" }}>
            {title}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function Tag({ children }) {
  return (
    <span style={{
      background: C.border,
      borderRadius: 100,
      padding: "4px 10px",
      fontSize: 10,
      color: C.textMid,
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.05em",
    }}>
      {children}
    </span>
  );
}
