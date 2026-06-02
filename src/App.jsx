import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

const IMPRESSORAS = [
  { marca:"Creality", serie:"Ender", modelo:"Ender 2 Pro", watts:120 },
  { marca:"Creality", serie:"Ender", modelo:"Ender 3", watts:270 },
  { marca:"Creality", serie:"Ender", modelo:"Ender 3 V2", watts:270 },
  { marca:"Creality", serie:"Ender", modelo:"Ender 3 Neo", watts:270 },
  { marca:"Creality", serie:"Ender", modelo:"Ender 3 V2 Neo", watts:270 },
  { marca:"Creality", serie:"Ender", modelo:"Ender 3 S1", watts:350 },
  { marca:"Creality", serie:"Ender", modelo:"Ender 3 S1 Pro", watts:350 },
  { marca:"Creality", serie:"Ender", modelo:"Ender 3 S1 Plus", watts:400 },
  { marca:"Creality", serie:"Ender", modelo:"Ender 3 Max", watts:350 },
  { marca:"Creality", serie:"Ender", modelo:"Ender 3 Max Neo", watts:350 },
  { marca:"Creality", serie:"Ender", modelo:"Ender 3 V3 SE", watts:300 },
  { marca:"Creality", serie:"Ender", modelo:"Ender 3 V3 KE", watts:300 },
  { marca:"Creality", serie:"Ender", modelo:"Ender 3 V3", watts:350 },
  { marca:"Creality", serie:"Ender", modelo:"Ender 3 V3 Plus", watts:400 },
  { marca:"Creality", serie:"Ender 5", modelo:"Ender 5", watts:270 },
  { marca:"Creality", serie:"Ender 5", modelo:"Ender 5 Pro", watts:270 },
  { marca:"Creality", serie:"Ender 5", modelo:"Ender 5 Plus", watts:400 },
  { marca:"Creality", serie:"Ender 5", modelo:"Ender 5 S1", watts:350 },
  { marca:"Creality", serie:"CR", modelo:"CR-6 SE", watts:270 },
  { marca:"Creality", serie:"CR", modelo:"CR-6 Max", watts:400 },
  { marca:"Creality", serie:"CR", modelo:"CR-10", watts:350 },
  { marca:"Creality", serie:"CR", modelo:"CR-10S", watts:350 },
  { marca:"Creality", serie:"CR", modelo:"CR-10 V2", watts:400 },
  { marca:"Creality", serie:"CR", modelo:"CR-10 V3", watts:400 },
  { marca:"Creality", serie:"CR", modelo:"CR-10 Smart", watts:350 },
  { marca:"Creality", serie:"CR", modelo:"CR-10 Smart Pro", watts:400 },
  { marca:"Creality", serie:"CR", modelo:"CR-10 SE", watts:400 },
  { marca:"Creality", serie:"CR", modelo:"CR-M4", watts:750 },
  { marca:"Creality", serie:"K", modelo:"K1", watts:350 },
  { marca:"Creality", serie:"K", modelo:"K1 SE", watts:300 },
  { marca:"Creality", serie:"K", modelo:"K1C", watts:350 },
  { marca:"Creality", serie:"K", modelo:"K1 Max", watts:500 },
  { marca:"Creality", serie:"K", modelo:"K2 Plus", watts:800 },
  { marca:"Creality", serie:"Hi", modelo:"Creality Hi", watts:350 },
  { marca:"Creality", serie:"Hi", modelo:"Creality Hi Combo", watts:400 },
  { marca:"Creality", serie:"Sermoon", modelo:"Sermoon D1", watts:200 },
  { marca:"Creality", serie:"Sermoon", modelo:"Sermoon D3", watts:350 },
  { marca:"Creality", serie:"Sermoon", modelo:"Sermoon V1 Pro", watts:150 },
  { marca:"Creality", serie:"Halot (Resina)", modelo:"Halot One", watts:40 },
  { marca:"Creality", serie:"Halot (Resina)", modelo:"Halot One Pro", watts:40 },
  { marca:"Creality", serie:"Halot (Resina)", modelo:"Halot One Plus", watts:50 },
  { marca:"Creality", serie:"Halot (Resina)", modelo:"Halot Mage", watts:100 },
  { marca:"Creality", serie:"Halot (Resina)", modelo:"Halot Mage Pro", watts:100 },
  { marca:"Creality", serie:"Halot (Resina)", modelo:"Halot Mage S", watts:100 },
  { marca:"Creality", serie:"Halot (Resina)", modelo:"Halot Sky", watts:80 },
  { marca:"Bambu Lab", serie:"A1", modelo:"A1 Mini", watts:220 },
  { marca:"Bambu Lab", serie:"A1", modelo:"A1", watts:350 },
  { marca:"Bambu Lab", serie:"P1", modelo:"P1P", watts:350 },
  { marca:"Bambu Lab", serie:"P1", modelo:"P1S", watts:350 },
  { marca:"Bambu Lab", serie:"X1", modelo:"X1", watts:350 },
  { marca:"Bambu Lab", serie:"X1", modelo:"X1 Carbon", watts:350 },
  { marca:"Bambu Lab", serie:"X1", modelo:"X1E", watts:400 },
  { marca:"Bambu Lab", serie:"Acessorios", modelo:"AMS", watts:10 },
  { marca:"Bambu Lab", serie:"Acessorios", modelo:"AMS Lite", watts:5 },
  { marca:"Bambu Lab", serie:"Acessorios", modelo:"AMS 2 Pro", watts:10 },
  { marca:"Flashforge", serie:"Adventurer", modelo:"Adventurer 3", watts:150 },
  { marca:"Flashforge", serie:"Adventurer", modelo:"Adventurer 3 Pro", watts:150 },
  { marca:"Flashforge", serie:"Adventurer", modelo:"Adventurer 4", watts:200 },
  { marca:"Flashforge", serie:"Adventurer", modelo:"Adventurer 4 Pro", watts:200 },
  { marca:"Flashforge", serie:"Adventurer", modelo:"Adventurer 5M", watts:350 },
  { marca:"Flashforge", serie:"Adventurer", modelo:"Adventurer 5M Pro", watts:350 },
  { marca:"Flashforge", serie:"Adventurer", modelo:"Adventurer 5X", watts:400 },
  { marca:"Flashforge", serie:"Creator", modelo:"Creator Pro", watts:270 },
  { marca:"Flashforge", serie:"Creator", modelo:"Creator Pro 2", watts:350 },
  { marca:"Flashforge", serie:"Creator", modelo:"Creator 3", watts:600 },
  { marca:"Flashforge", serie:"Creator", modelo:"Creator 4", watts:800 },
  { marca:"Flashforge", serie:"Guider", modelo:"Guider 2", watts:600 },
  { marca:"Flashforge", serie:"Guider", modelo:"Guider 2S", watts:600 },
  { marca:"Flashforge", serie:"Guider", modelo:"Guider 3", watts:800 },
  { marca:"Flashforge", serie:"Guider", modelo:"Guider 3 Ultra", watts:1000 },
  { marca:"Flashforge", serie:"Dreamer", modelo:"Dreamer", watts:350 },
  { marca:"Flashforge", serie:"Dreamer", modelo:"Dreamer NX", watts:350 },
  { marca:"Flashforge", serie:"Finder", modelo:"Finder", watts:80 },
  { marca:"Flashforge", serie:"Finder", modelo:"Finder 3", watts:100 },
  { marca:"Flashforge", serie:"Foto (Resina)", modelo:"Foto 6.0", watts:40 },
  { marca:"Flashforge", serie:"Foto (Resina)", modelo:"Foto 8.9", watts:60 },
  { marca:"Flashforge", serie:"Foto (Resina)", modelo:"Foto 9.25", watts:80 },
  { marca:"Flashforge", serie:"Foto (Resina)", modelo:"Foto 13.3", watts:120 },
];

const C = {
  bg:"#07080a",surface:"#0e1014",border:"#1c2028",borderHover:"#2a3040",
  accent:"#3b82f6",accentGlow:"rgba(59,130,246,0.15)",accentDim:"rgba(59,130,246,0.08)",
  gold:"#f0a445",text:"#e2e8f0",textMid:"#8896aa",textDim:"#3d4a5c",
  green:"#34d399",red:"#f87171",
};

const sty = {
  label:{ display:"block",fontSize:"10px",fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",color:C.textMid,marginBottom:"8px",fontFamily:"'Syne',sans-serif" },
  input:{ width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:"10px",padding:"12px 16px",color:C.text,fontSize:"14px",fontFamily:"'JetBrains Mono',monospace",outline:"none",transition:"all 0.2s",boxSizing:"border-box" },
  inputFocus:{ borderColor:C.accent,boxShadow:`0 0 0 3px rgba(59,130,246,0.15)` },
  inputBlur:{ borderColor:C.border,boxShadow:"none" },
  unit:{ position:"absolute",right:"14px",top:"50%",transform:"translateY(-50%)",fontSize:"11px",color:C.textDim,fontFamily:"'JetBrains Mono',monospace",pointerEvents:"none" },
  hint:{ fontSize:"10px",color:C.textDim,marginTop:"5px",fontFamily:"'Syne',sans-serif" },
};

const init = {
  nomeProjeto:"",image:null,imagePreview:null,impressora:"",
  width:"",height:"",depth:"",filamentGrams:"",filamentKgPrice:"",
  printHours:"",printMinutes:"",printerWatts:"350",kwhPrice:"0.75",
  printerCost:"2200",printerLifespanHours:"5000",maintenanceMonthly:"50",marginPercent:"30",
};

const fmt = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const pct = (v,t) => t>0?Math.round((v/t)*100):0;

const getStorageKey = (email) => `calc3d_hist_${email}`;
const loadHist = (email) => { try { const s=localStorage.getItem(getStorageKey(email)); return s?JSON.parse(s):[]; } catch { return []; } };
const saveHist = (email,dados) => { try { localStorage.setItem(getStorageKey(email),JSON.stringify(dados)); } catch {} };
const loadUsers = () => { try { const s=localStorage.getItem("calc3d_users"); return s?JSON.parse(s):{}; } catch { return {}; } };
const saveUsers = (u) => { try { localStorage.setItem("calc3d_users",JSON.stringify(u)); } catch {} };

function NI({ label,name,value,onChange,placeholder,hint,unit }) {
  return (
    <div>
      <label style={sty.label}>{label}</label>
      <div style={{position:"relative"}}>
        <input type="number" name={name} value={value} onChange={onChange} placeholder={placeholder} style={sty.input}
          onFocus={e=>Object.assign(e.target.style,sty.inputFocus)} onBlur={e=>Object.assign(e.target.style,sty.inputBlur)} />
        {unit&&<span style={sty.unit}>{unit}</span>}
      </div>
      {hint&&<p style={sty.hint}>{hint}</p>}
    </div>
  );
}

function Card({ step,icon,title,delay,children }) {
  const [h,setH]=useState(false);
  return (
    <div className="card" onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:C.surface,border:`1px solid ${h?C.borderHover:C.border}`,borderRadius:18,padding:"24px",transition:"all 0.25s",animationDelay:`${delay*0.07}s`,boxShadow:h?"0 8px 32px rgba(0,0,0,0.3)":"none"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
        <div style={{width:32,height:32,borderRadius:8,background:C.accentDim,border:"1px solid rgba(59,130,246,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:C.accent}}>{icon}</div>
        <div>
          <div style={{fontSize:9,letterSpacing:"0.2em",color:C.textDim,fontWeight:600}}>PASSO {step}</div>
          <div style={{fontSize:13,fontWeight:700,color:C.text}}>{title}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function Tag({ children }) {
  return <span style={{background:C.border,borderRadius:100,padding:"4px 10px",fontSize:10,color:C.textMid,fontFamily:"'JetBrains Mono',monospace"}}>{children}</span>;
}

function PrinterSelector({ value,onChange }) {
  const [busca,setBusca]=useState("");
  const [aberto,setAberto]=useState(false);
  const [dropRect,setDropRect]=useState(null);
  const ref=useRef();
  const inputRef=useRef();

  useEffect(()=>{
    const h=(e)=>{ if(ref.current&&!ref.current.contains(e.target)) setAberto(false); };
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[]);

  const abrirDropdown=()=>{
    if(inputRef.current){
      const r=inputRef.current.getBoundingClientRect();
      setDropRect({top:r.bottom+window.scrollY+6,left:r.left+window.scrollX,width:r.width});
    }
    setAberto(true);
  };

  const filtradas = busca.trim()
    ? IMPRESSORAS.filter(p=>`${p.marca} ${p.serie} ${p.modelo}`.toLowerCase().includes(busca.toLowerCase()))
    : IMPRESSORAS;

  const grupos = filtradas.reduce((acc,p)=>{
    const k=`${p.marca} — ${p.serie}`;
    if(!acc[k]) acc[k]=[];
    acc[k].push(p);
    return acc;
  },{});

  const selecionar=(modelo)=>{ onChange(modelo); setBusca(""); setAberto(false); };

  return (
    <div ref={ref}>
      <label style={sty.label}>Impressora utilizada</label>
      <div style={{position:"relative"}}>
        <input
          ref={inputRef}
          type="text"
          value={aberto ? busca : (value || "")}
          placeholder="Buscar ou selecionar impressora..."
          onChange={e=>{setBusca(e.target.value);if(!aberto)abrirDropdown();}}
          onFocus={()=>{setBusca(""); abrirDropdown();}}
          style={{...sty.input,paddingRight:36, color: !aberto && value ? C.accent : C.text}}
        />
        <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:C.textDim,fontSize:11,pointerEvents:"none"}}>
          {aberto?"▲":"▼"}
        </span>
      </div>
      {value&&!aberto&&<p style={{...sty.hint,color:C.accent}}>Selecionada: {value}</p>}
      {aberto&&dropRect&&createPortal(
        <div style={{position:"absolute",top:dropRect.top,left:dropRect.left,width:dropRect.width,zIndex:9999,background:C.surface,border:`1px solid ${C.accent}44`,borderRadius:14,boxShadow:"0 16px 48px rgba(0,0,0,0.8)",maxHeight:300,overflowY:"auto"}}>
          {Object.keys(grupos).length===0?(
            <div style={{padding:"24px",textAlign:"center",color:C.textMid,fontSize:13}}>Nenhuma impressora encontrada</div>
          ):(
            Object.entries(grupos).map(([grupo,itens])=>(
              <div key={grupo}>
                <div style={{padding:"8px 16px 6px",fontSize:9,letterSpacing:"0.15em",color:C.textDim,fontWeight:700,background:C.bg,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0}}>
                  {grupo.toUpperCase()}
                </div>
                {itens.map(p=>(
                  <div key={p.modelo}
                    onMouseDown={e=>{ e.preventDefault(); selecionar(p.modelo); }}
                    style={{padding:"10px 16px",fontSize:13,color:value===p.modelo?C.accent:C.text,cursor:"pointer",background:value===p.modelo?C.accentDim:"transparent",transition:"background 0.1s",display:"flex",alignItems:"center",gap:8}}
                    onMouseEnter={e=>{ if(value!==p.modelo) e.currentTarget.style.background=C.accentDim+"88"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background=value===p.modelo?C.accentDim:"transparent"; }}
                  >
                    {value===p.modelo&&<span style={{fontSize:10}}>✓</span>}
                    {p.modelo}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [modo,setModo]=useState("login");
  const [email,setEmail]=useState("");
  const [senha,setSenha]=useState("");
  const [nome,setNome]=useState("");
  const [erro,setErro]=useState("");

  const handleLogin=()=>{
    setErro("");
    const users=loadUsers();
    if(!users[email]){ setErro("E-mail nao encontrado."); return; }
    if(users[email].senha!==senha){ setErro("Senha incorreta."); return; }
    onLogin({email,nome:users[email].nome});
  };
  const handleCadastro=()=>{
    setErro("");
    if(!nome.trim()){ setErro("Informe seu nome."); return; }
    if(!email.includes("@")){ setErro("E-mail invalido."); return; }
    if(senha.length<4){ setErro("Senha deve ter ao menos 4 caracteres."); return; }
    const users=loadUsers();
    if(users[email]){ setErro("E-mail ja cadastrado."); return; }
    users[email]={nome:nome.trim(),senha};
    saveUsers(users);
    onLogin({email,nome:nome.trim()});
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",padding:20}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontSize:36,fontWeight:800,color:"#fff",letterSpacing:"-0.03em",marginBottom:8}}>
            Calculadora
            <br/>
            <span style={{background:"linear-gradient(135deg,#3b82f6,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>3D Print</span>
          </div>
          <p style={{fontSize:12,color:C.textMid}}>Faca login para salvar seu historico</p>
        </div>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,padding:28}}>
          <div style={{display:"flex",gap:4,marginBottom:24,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:4}}>
            {[["login","Entrar"],["cadastro","Criar conta"]].map(([id,label])=>(
              <button key={id} onClick={()=>{setModo(id);setErro("");}} style={{flex:1,padding:"9px 12px",borderRadius:8,border:"none",cursor:"pointer",background:modo===id?C.accent:"transparent",color:modo===id?"#fff":C.textMid,fontSize:13,fontWeight:600,fontFamily:"'Syne',sans-serif",transition:"all 0.2s"}}>
                {label}
              </button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {modo==="cadastro"&&(
              <div>
                <label style={sty.label}>Seu nome</label>
                <input type="text" value={nome} onChange={e=>setNome(e.target.value)} placeholder="Como quer ser chamado?" style={sty.input}
                  onFocus={e=>Object.assign(e.target.style,sty.inputFocus)} onBlur={e=>Object.assign(e.target.style,sty.inputBlur)} />
              </div>
            )}
            <div>
              <label style={sty.label}>E-mail</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" style={sty.input}
                onFocus={e=>Object.assign(e.target.style,sty.inputFocus)} onBlur={e=>Object.assign(e.target.style,sty.inputBlur)} />
            </div>
            <div>
              <label style={sty.label}>Senha</label>
              <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="••••••" style={sty.input}
                onFocus={e=>Object.assign(e.target.style,sty.inputFocus)} onBlur={e=>Object.assign(e.target.style,sty.inputBlur)}
                onKeyDown={e=>e.key==="Enter"&&(modo==="login"?handleLogin():handleCadastro())} />
            </div>
            {erro&&(
              <div style={{background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:10,padding:"10px 14px",fontSize:12,color:C.red}}>{erro}</div>
            )}
            <button onClick={modo==="login"?handleLogin:handleCadastro}
              style={{width:"100%",padding:"14px",background:C.accent,border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:700,letterSpacing:"0.08em",cursor:"pointer",fontFamily:"'Syne',sans-serif",marginTop:4}}>
              {modo==="login"?"Entrar ->":"Criar conta ->"}
            </button>
          </div>
          <p style={{textAlign:"center",fontSize:11,color:C.textDim,marginTop:18}}>Os dados ficam salvos neste navegador</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [usuario,setUsuario]=useState(null);
  const [form,setForm]=useState(init);
  const [result,setResult]=useState(null);
  const [dragging,setDragging]=useState(false);
  const [aba,setAba]=useState("calculadora");
  const [historico,setHistorico]=useState([]);
  const [busca,setBusca]=useState("");
  const [expandido,setExpandido]=useState(null);
  const [salvoMsg,setSalvoMsg]=useState(false);
  const fileRef=useRef();

  const handleLogin=(user)=>{ setUsuario(user); setHistorico(loadHist(user.email)); };

  const persist=(novo)=>{ setHistorico(novo); if(usuario) saveHist(usuario.email,novo); };

  const handleChange=e=>{ const {name,value}=e.target; setForm(f=>({...f,[name]:value})); };
  const handleImage=f=>{ if(!f?.type.startsWith("image/")) return; setForm(x=>({...x,image:f,imagePreview:URL.createObjectURL(f)})); };
  const onDrop=useCallback(e=>{ e.preventDefault(); setDragging(false); handleImage(e.dataTransfer.files[0]); },[]);

  const calcular=()=>{
    const filamentKg=parseFloat(form.filamentGrams)/1000||0;
    const filamentCost=filamentKg*(parseFloat(form.filamentKgPrice)||0);
    const totalHours=(parseFloat(form.printHours)||0)+(parseFloat(form.printMinutes)||0)/60;
    const energyCost=(parseFloat(form.printerWatts)||350)/1000*totalHours*(parseFloat(form.kwhPrice)||0.75);
    const wearCost=((parseFloat(form.printerCost)||2200)/(parseFloat(form.printerLifespanHours)||5000))*totalHours;
    const maintenanceCost=((parseFloat(form.maintenanceMonthly)||0)/(30*8))*totalHours;
    const subtotal=filamentCost+energyCost+wearCost+maintenanceCost;
    const margin=(parseFloat(form.marginPercent)||0)/100;
    const totalPrice=subtotal*(1+margin);
    setResult({filamentCost,energyCost,wearCost,maintenanceCost,subtotal,totalPrice,totalHours,marginValue:totalPrice-subtotal});
  };

  const salvarProjeto=()=>{
    if(!result) return;
    const nome=form.nomeProjeto.trim()||`Projeto ${historico.length+1}`;
    const proj={
      id:Date.now(),nome,data:new Date().toLocaleDateString("pt-BR"),
      imagePreview:form.imagePreview||null,impressora:form.impressora||null,
      dimensoes:(form.width&&form.height&&form.depth)?`${form.width}x${form.height}x${form.depth}mm`:null,
      filamento:form.filamentGrams?`${form.filamentGrams}g`:null,
      tempo:result.totalHours>0?`${Math.floor(result.totalHours)}h${Math.round((result.totalHours%1)*60).toString().padStart(2,"0")}min`:null,
      totalPrice:result.totalPrice,subtotal:result.subtotal,marginValue:result.marginValue,
      filamentCost:result.filamentCost,energyCost:result.energyCost,wearCost:result.wearCost,
      maintenanceCost:result.maintenanceCost,marginPercent:form.marginPercent,
    };
    persist([proj,...historico]);
    setSalvoMsg(true);
    setTimeout(()=>setSalvoMsg(false),2500);
  };

  const deletar=id=>{ persist(historico.filter(p=>p.id!==id)); if(expandido===id) setExpandido(null); };
  const filtrado=historico.filter(p=>p.nome.toLowerCase().includes(busca.toLowerCase()));

  if(!usuario) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Syne',sans-serif",color:C.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-track{background:${C.bg};} ::-webkit-scrollbar-thumb{background:${C.accent};border-radius:2px;}
        input[type=number]::-webkit-inner-spin-button{opacity:0;} input[type=number]{-moz-appearance:textfield;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes resultIn{from{opacity:0;transform:scale(.97) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(.9) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .card{animation:fadeUp .5s ease both;}
        .result-anim{animation:resultIn .5s cubic-bezier(.16,1,.3,1) both;}
        .calc-btn:hover{background:#4f96ff!important;transform:translateY(-1px);box-shadow:0 8px 32px rgba(59,130,246,.35)!important;}
        .save-btn:hover{background:rgba(52,211,153,.15)!important;border-color:#34d399!important;}
        .del-btn:hover{background:rgba(248,113,113,.15)!important;color:#f87171!important;}
        .proj-card:hover{border-color:${C.borderHover}!important;}
        .toast{animation:popIn .3s ease both;}
        .logout-btn:hover{color:${C.red}!important;border-color:rgba(248,113,113,.3)!important;}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,backgroundSize:"48px 48px",opacity:.35}} />
      <div style={{position:"fixed",top:-120,left:"50%",transform:"translateX(-50%)",width:600,height:300,background:"radial-gradient(ellipse,rgba(59,130,246,.12) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}} />

      {salvoMsg&&(
        <div className="toast" style={{position:"fixed",bottom:32,left:"50%",transform:"translateX(-50%)",background:C.green,color:"#000",borderRadius:100,padding:"12px 24px",fontSize:13,fontWeight:700,zIndex:999,boxShadow:"0 8px 32px rgba(52,211,153,.4)"}}>
          Projeto salvo no historico!
        </div>
      )}

      <div style={{position:"relative",zIndex:1,maxWidth:680,margin:"0 auto",padding:"48px 20px 80px"}}>

        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:C.accentDim,border:"1px solid rgba(59,130,246,.2)",borderRadius:100,padding:"6px 16px",marginBottom:20}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:C.accent,animation:"pulse 2s infinite"}} />
            <span style={{fontSize:10,letterSpacing:"0.2em",color:C.accent,fontWeight:600}}>FERRAMENTA DE PRECIFICACAO</span>
          </div>
          <h1 style={{fontSize:"clamp(40px,8vw,72px)",fontWeight:800,letterSpacing:"-0.03em",lineHeight:1,color:"#fff",marginBottom:8}}>
            Calculadora<br/>
            <span style={{background:"linear-gradient(135deg,#3b82f6 0%,#818cf8 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>3D Print</span>
          </h1>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginTop:14}}>
            <div style={{background:C.accentDim,border:"1px solid rgba(59,130,246,.2)",borderRadius:100,padding:"6px 14px",fontSize:12,color:C.accent,fontWeight:600}}>
              {usuario.nome}
            </div>
            <button className="logout-btn" onClick={()=>{setUsuario(null);setHistorico([]);setForm(init);setResult(null);setAba("calculadora");}}
              style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:100,padding:"6px 14px",fontSize:11,color:C.textMid,cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:600,transition:"all 0.2s"}}>
              Sair
            </button>
          </div>
        </div>

        <div style={{display:"flex",gap:4,marginBottom:32,background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:4}}>
          {[{id:"calculadora",icon:"O",label:"Calculadora"},{id:"historico",icon:"H",label:`Historico${historico.length>0?` (${historico.length})`:""}`}].map(tab=>(
            <button key={tab.id} onClick={()=>setAba(tab.id)} style={{flex:1,padding:"10px 16px",borderRadius:10,border:"none",cursor:"pointer",background:aba===tab.id?C.accent:"transparent",color:aba===tab.id?"#fff":C.textMid,fontSize:13,fontWeight:600,fontFamily:"'Syne',sans-serif",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              {tab.label}
            </button>
          ))}
        </div>

        {aba==="calculadora"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            <Card step="00" icon="*" title="Nome do Projeto" delay={0}>
              <div>
                <label style={sty.label}>Nome para identificar a cotacao</label>
                <input type="text" name="nomeProjeto" value={form.nomeProjeto} onChange={handleChange}
                  placeholder="ex: Suporte de celular, Miniatura dragao..." style={sty.input}
                  onFocus={e=>Object.assign(e.target.style,sty.inputFocus)} onBlur={e=>Object.assign(e.target.style,sty.inputBlur)} />
              </div>
            </Card>

            <Card step="01" icon="+" title="Foto do Produto" delay={1}>
              <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={onDrop} onClick={()=>fileRef.current.click()}
                style={{border:`2px dashed ${dragging?C.accent:form.imagePreview?"transparent":C.border}`,borderRadius:14,cursor:"pointer",overflow:"hidden",transition:"all 0.25s",background:dragging?C.accentDim:"transparent",minHeight:form.imagePreview?"auto":140,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleImage(e.target.files[0])} />
                {form.imagePreview?(
                  <div style={{position:"relative",width:"100%"}}>
                    <img src={form.imagePreview} alt="" style={{width:"100%",maxHeight:260,objectFit:"contain",borderRadius:12,display:"block"}} />
                    <div style={{position:"absolute",inset:0,borderRadius:12,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity .2s"}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0}>
                      <span style={{color:"#fff",fontSize:12,fontWeight:600}}>Trocar imagem</span>
                    </div>
                  </div>
                ):(
                  <div style={{textAlign:"center",padding:32}}>
                    <div style={{fontSize:32,marginBottom:10,opacity:.5}}>+</div>
                    <p style={{color:C.textMid,fontSize:13}}>Arraste ou clique para enviar</p>
                    <p style={{color:C.textDim,fontSize:11,marginTop:4,fontFamily:"'JetBrains Mono',monospace"}}>JPG / PNG / WEBP</p>
                  </div>
                )}
              </div>
            </Card>

            <Card step="02" icon="P" title="Impressora" delay={2}>
              <PrinterSelector value={form.impressora} onChange={v=>{
                const p = IMPRESSORAS.find(x=>x.modelo===v);
                setForm(f=>({...f, impressora:v, printerWatts: p ? String(p.watts) : f.printerWatts }));
              }} />
            </Card>

            <Card step="03" icon="#" title="Dimensoes do Produto" delay={3}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                {[["width","Largura X"],["height","Altura Z"],["depth","Prof. Y"]].map(([n,l])=>(
                  <NI key={n} label={l} name={n} value={form[n]} onChange={handleChange} placeholder="0" unit="mm" />
                ))}
              </div>
            </Card>

            <Card step="04" icon="F" title="Filamento" delay={4}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <NI label="Filamento usado" name="filamentGrams" value={form.filamentGrams} onChange={handleChange} placeholder="85" unit="g" />
                <NI label="Preco por kg" name="filamentKgPrice" value={form.filamentKgPrice} onChange={handleChange} placeholder="120" unit="R$" />
              </div>
            </Card>

            <Card step="05" icon="T" title="Tempo de Producao" delay={5}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <NI label="Horas" name="printHours" value={form.printHours} onChange={handleChange} placeholder="4" unit="h" />
                <NI label="Minutos" name="printMinutes" value={form.printMinutes} onChange={handleChange} placeholder="30" unit="min" />
              </div>
            </Card>

            <Card step="06" icon="E" title="Energia" delay={6}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <NI label="Consumo da impressora" name="printerWatts" value={form.printerWatts} onChange={handleChange} placeholder="350" unit="W" hint={form.impressora ? `Preenchido automaticamente para ${form.impressora}` : "Selecione uma impressora ou preencha manualmente"} />
                <NI label="Tarifa kWh" name="kwhPrice" value={form.kwhPrice} onChange={handleChange} placeholder="0.75" unit="R$" hint="Media SP aprox R$ 0,75" />
              </div>
            </Card>

            <Card step="07" icon="D" title="Desgaste da Impressora" delay={7}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                <NI label="Valor da impressora" name="printerCost" value={form.printerCost} onChange={handleChange} placeholder="2200" unit="R$" />
                <NI label="Vida util" name="printerLifespanHours" value={form.printerLifespanHours} onChange={handleChange} placeholder="5000" unit="h" />
                <NI label="Manutencao/mes" name="maintenanceMonthly" value={form.maintenanceMonthly} onChange={handleChange} placeholder="50" unit="R$" />
              </div>
            </Card>

            <Card step="08" icon="%" title="Margem de Lucro" delay={8}>
              <div style={{maxWidth:200}}>
                <NI label="Margem desejada" name="marginPercent" value={form.marginPercent} onChange={handleChange} placeholder="30" unit="%" />
              </div>
            </Card>

            <button className="calc-btn" onClick={calcular} style={{width:"100%",padding:"18px 32px",background:C.accent,border:"none",borderRadius:14,color:"#fff",fontSize:14,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Syne',sans-serif",transition:"all 0.2s",boxShadow:`0 4px 24px rgba(59,130,246,.15)`}}>
              Calcular Preco de Venda
            </button>

            {result&&(
              <div className="result-anim" style={{background:C.surface,border:"1px solid rgba(240,164,69,.3)",borderRadius:20,overflow:"hidden",boxShadow:"0 0 48px rgba(240,164,69,.15)"}}>
                <div style={{background:"linear-gradient(135deg,rgba(240,164,69,.12) 0%,rgba(240,164,69,.04) 100%)",borderBottom:"1px solid rgba(240,164,69,.2)",padding:"28px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
                  <div>
                    <div style={{fontSize:10,letterSpacing:"0.2em",color:C.gold,fontWeight:600,marginBottom:6}}>PRECO SUGERIDO DE VENDA</div>
                    <div style={{fontSize:"clamp(36px,8vw,56px)",fontWeight:800,color:"#fff",letterSpacing:"-0.03em",lineHeight:1,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(result.totalPrice)}</div>
                    {form.nomeProjeto&&<div style={{fontSize:12,color:C.textMid,marginTop:6,fontFamily:"'JetBrains Mono',monospace"}}>{form.nomeProjeto}</div>}
                    {form.impressora&&<div style={{fontSize:11,color:C.accent,marginTop:4,fontFamily:"'JetBrains Mono',monospace"}}>{form.impressora}</div>}
                  </div>
                  {form.imagePreview&&<img src={form.imagePreview} alt="" style={{width:72,height:72,objectFit:"contain",borderRadius:12,border:`1px solid ${C.border}`}} />}
                </div>
                <div style={{padding:"24px 32px"}}>
                  <div style={{fontSize:10,letterSpacing:"0.15em",color:C.textDim,fontWeight:600,marginBottom:16}}>COMPOSICAO DO CUSTO</div>
                  {[
                    {label:"Filamento",value:result.filamentCost,color:"#3b82f6"},
                    {label:"Energia eletrica",value:result.energyCost,color:"#8b5cf6"},
                    {label:"Desgaste",value:result.wearCost,color:"#ec4899"},
                    {label:"Manutencao",value:result.maintenanceCost,color:"#06b6d4"},
                  ].map(item=>(
                    <div key={item.label} style={{marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                        <span style={{fontSize:12,color:C.textMid}}>{item.label}</span>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:10,color:C.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{pct(item.value,result.subtotal)}%</span>
                          <span style={{fontSize:13,color:C.text,fontFamily:"'JetBrains Mono',monospace",fontWeight:500}}>{fmt(item.value)}</span>
                        </div>
                      </div>
                      <div style={{height:4,background:C.border,borderRadius:4,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pct(item.value,result.subtotal)}%`,background:item.color,borderRadius:4,transition:"width 1s cubic-bezier(.16,1,.3,1)"}} />
                      </div>
                    </div>
                  ))}
                  <div style={{borderTop:`1px solid ${C.border}`,margin:"20px 0"}} />
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                    {[{label:"Custo total",value:result.subtotal,color:C.textMid},{label:`Lucro (${form.marginPercent}%)`,value:result.marginValue,color:C.green}].map(row=>(
                      <div key={row.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:13,color:C.textMid}}>{row.label}</span>
                        <span style={{fontSize:15,fontWeight:600,color:row.color,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(row.value)}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
                    {form.width&&form.height&&form.depth&&<Tag>{form.width}x{form.height}x{form.depth}mm</Tag>}
                    {result.totalHours>0&&<Tag>{Math.floor(result.totalHours)}h{Math.round((result.totalHours%1)*60).toString().padStart(2,"0")}min</Tag>}
                    {form.filamentGrams&&<Tag>{form.filamentGrams}g de filamento</Tag>}
                    {form.impressora&&<Tag>{form.impressora}</Tag>}
                  </div>
                  <button className="save-btn" onClick={salvarProjeto} style={{width:"100%",padding:"14px 24px",background:"rgba(52,211,153,.08)",border:"1px solid rgba(52,211,153,.3)",borderRadius:12,color:C.green,fontSize:13,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Syne',sans-serif",transition:"all 0.2s"}}>
                    Salvar no Historico
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {aba==="historico"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{position:"relative"}}>
              <input type="text" value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar projeto pelo nome..." style={{...sty.input,paddingLeft:16}}
                onFocus={e=>Object.assign(e.target.style,sty.inputFocus)} onBlur={e=>Object.assign(e.target.style,sty.inputBlur)} />
            </div>
            {filtrado.length===0?(
              <div style={{textAlign:"center",padding:"60px 20px"}}>
                <div style={{fontSize:48,marginBottom:16,opacity:.3}}>O</div>
                <p style={{fontSize:14,color:C.textMid}}>{busca?"Nenhum projeto encontrado":"Nenhum projeto salvo ainda"}</p>
                <p style={{fontSize:12,color:C.textDim,marginTop:8}}>{busca?"Tente outro nome":"Calcule e clique em Salvar no Historico"}</p>
              </div>
            ):(
              filtrado.map(proj=>(
                <div key={proj.id} className="proj-card" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:18,overflow:"hidden",transition:"all 0.2s"}}>
                  <div onClick={()=>setExpandido(expandido===proj.id?null:proj.id)} style={{padding:"18px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
                    {proj.imagePreview?(
                      <img src={proj.imagePreview} alt="" style={{width:52,height:52,objectFit:"contain",borderRadius:10,border:`1px solid ${C.border}`,flexShrink:0}} />
                    ):(
                      <div style={{width:52,height:52,borderRadius:10,background:C.accentDim,border:"1px solid rgba(59,130,246,.2)",display:"flex",alignItems:"center",justifyContent:"center",color:C.accent,fontSize:22,flexShrink:0}}>+</div>
                    )}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{proj.nome}</div>
                      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                        <span style={{fontSize:10,color:C.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{proj.data}</span>
                        {proj.impressora&&<span style={{fontSize:10,color:C.accent,fontFamily:"'JetBrains Mono',monospace"}}>{proj.impressora}</span>}
                        {proj.dimensoes&&<span style={{fontSize:10,color:C.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{proj.dimensoes}</span>}
                        {proj.tempo&&<span style={{fontSize:10,color:C.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{proj.tempo}</span>}
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:20,fontWeight:700,color:C.gold,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(proj.totalPrice)}</div>
                      <div style={{fontSize:10,color:C.textDim,marginTop:2}}>{expandido===proj.id?"fechar":"detalhes"}</div>
                    </div>
                  </div>
                  {expandido===proj.id&&(
                    <div style={{borderTop:`1px solid ${C.border}`,padding:"16px 20px"}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                        {[{label:"Filamento",value:proj.filamentCost,color:"#3b82f6"},{label:"Energia",value:proj.energyCost,color:"#8b5cf6"},{label:"Desgaste",value:proj.wearCost,color:"#ec4899"},{label:"Manutencao",value:proj.maintenanceCost,color:"#06b6d4"}].map(item=>(
                          <div key={item.label} style={{background:C.bg,borderRadius:10,padding:"10px 14px"}}>
                            <div style={{fontSize:9,color:C.textDim,letterSpacing:"0.1em",marginBottom:3}}>{item.label.toUpperCase()}</div>
                            <div style={{fontSize:13,fontWeight:600,color:item.color,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(item.value)}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                        <div style={{display:"flex",gap:16}}>
                          <span style={{fontSize:12,color:C.textMid}}>Custo: <span style={{color:C.text,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(proj.subtotal)}</span></span>
                          <span style={{fontSize:12,color:C.textMid}}>Lucro: <span style={{color:C.green,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(proj.marginValue)}</span></span>
                        </div>
                        <button className="del-btn" onClick={()=>deletar(proj.id)} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 14px",color:C.textMid,fontSize:11,cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:600,transition:"all 0.2s"}}>
                          Deletar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        <p style={{textAlign:"center",color:C.textDim,fontSize:11,marginTop:40,fontFamily:"'JetBrains Mono',monospace"}}>valores sao estimativas - ajuste conforme sua realidade</p>
      </div>
    </div>
  );
}
