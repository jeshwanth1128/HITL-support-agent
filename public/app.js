const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const sid=localStorage.sid||(localStorage.sid=crypto.randomUUID());let tok=sessionStorage.tok||'',n=-1,tn=-1,z=10;
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const api=async(u,o={})=>{const r=await fetch(u,{...o,headers:{'Content-Type':'application/json',...(tok&&{Authorization:'Bearer '+tok})}});return{ok:r.ok,d:await r.json().catch(()=>({}))}};
// window manager
function front(w){w.style.zIndex=++z;$$('.win').forEach(x=>x.classList.toggle('on',x===w));tasks()}
function open(id){const w=$('#'+id);w.hidden=false;w.classList.remove('min');front(w);if(id==='w4')kb();$('#start').hidden=true}
function tasks(){$('#tasks').replaceChildren(...$$('.win:not([hidden])').map(w=>{const b=el('button',w.classList.contains('on')?'on':'',w.dataset.t);b.onclick=()=>open(w.id);return b}))}
$$('[data-w]').forEach(b=>b.onclick=()=>open(b.dataset.w));
$$('.bar button').forEach(b=>b.onclick=()=>{const w=b.closest('.win');if(b.dataset.a==='x')w.hidden=true;else w.classList.toggle('min');tasks()});
$$('.win').forEach(w=>w.addEventListener('pointerdown',()=>front(w)));
$$('.bar').forEach(b=>b.onpointerdown=e=>{if(e.target.closest('button'))return;const w=b.parentElement,r=w.getBoundingClientRect(),dx=e.clientX-r.left,dy=e.clientY-r.top;
 const mv=e=>{w.style.left=Math.max(0,e.clientX-dx)+'px';w.style.top=Math.max(0,e.clientY-dy)+'px'};
 const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up)};addEventListener('pointermove',mv);addEventListener('pointerup',up)});
$('#sb').onclick=e=>{e.stopPropagation();$('#start').hidden=!$('#start').hidden};addEventListener('click',e=>{if(!e.target.closest('#start'))$('#start').hidden=true});
const clk=()=>$('#clk').textContent=new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});clk();setInterval(clk,15000);
// chat
const who={user:'You:',bot:'Agent:',sys:'System:'};
async function chat(){const{d}=await api('/api/chat?sid='+sid);const m=d.msgs||[],t=d.trace||[];
 if(t.length!==tn){tn=t.length;$('#tr').replaceChildren(...t.map(x=>{const p=el('p','tl');p.append(el('b',0,new Date(x.at).toLocaleTimeString()+' '+x.step+' '),document.createTextNode(x.detail));return p}));$('#tr').scrollTop=1e9}
 if(m.length===n)return;n=m.length;
 $('#log').replaceChildren(...m.map(x=>{const p=el('p','m '+x.role);p.append(el('b',0,who[x.role]),document.createTextNode(x.text));return p}));
 $('#log').scrollTop=1e9;const l=m.filter(x=>x.role!=='user').pop();
 $('#st1').textContent=l&&/must approve|awaiting human/i.test(l.text)?'Waiting for human approval…':'Ready'}
async function queue(){if(!tok)return;const{ok,d}=await api('/api/review');const q=$('#q');q.replaceChildren();
 if(!ok){q.append(el('p',0,'Access denied. Check the token.'));$('#st2').textContent='Locked';tok='';sessionStorage.tok='';return}
 $('#st2').textContent='Unlocked · '+d.pending.length+' pending';
 if(!d.pending.length)q.append(el('p',0,'No refunds awaiting approval.'));
 d.pending.forEach(t=>{const c=el('fieldset','tk');c.append(el('legend',0,'Refund request'),el('div',0,'Order '+t.orderId+' · $'+t.amount),el('div',0,t.policy));
  const b=el('div');for(const[k,l]of[['approve','Approve'],['reject','Reject']]){const x=el('button',0,l);
   x.onclick=async()=>{x.disabled=true;await api('/api/review',{method:'POST',body:JSON.stringify({id:t.id,decision:k})});queue();chat()};b.append(x)}
  c.append(b);q.append(c)})}
$('#f').onsubmit=async e=>{e.preventDefault();const v=$('#in').value.trim();if(!v)return;$('#in').value='';$('#st1').textContent='Agent is thinking…';
 const r=await api('/api/chat',{method:'POST',body:JSON.stringify({sid,message:v})});if(!r.ok)$('#st1').textContent='Server error: open /api/health';await chat();queue()};
$('#t').onsubmit=e=>{e.preventDefault();tok=sessionStorage.tok=$('#tok').value;$('#tok').value='';queue();kb()};
async function kb(){const l=$('#kl');if(!tok){l.replaceChildren(el('p',0,'Unlock the Reviewer Console first.'));return}
 const{ok,d}=await api('/api/kb');l.replaceChildren();if(!ok){l.append(el('p',0,'Access denied.'));return}
 $('#st4').textContent=d.files.length+' uploaded file(s)';
 if(!d.files.length)l.append(el('p',0,'No uploads yet. Built-in docs are active.'));
 d.files.forEach(f=>{const r=el('div','file');r.append(el('span',0,'📄 '+f.name+' ('+Math.max(1,Math.ceil(f.size/1024))+' KB)'));
  const b=el('button',0,'Delete');b.onclick=async()=>{await api('/api/kb?id='+f.id,{method:'DELETE'});kb()};r.append(b);l.append(r)})}
async function up(files){let msg='';for(const f of files){if(f.size>50000){msg=f.name+': too large (max 50 KB)';continue}
 const{ok,d}=await api('/api/kb',{method:'POST',body:JSON.stringify({name:f.name,text:await f.text()})});msg=ok?'Uploaded '+f.name:f.name+': '+(d.error||'failed')}
 await kb();if(msg)$('#st4').textContent=msg}
$('#fi').onchange=e=>{up([...e.target.files]);e.target.value=''};
$('#kl').ondragover=e=>e.preventDefault();$('#kl').ondrop=e=>{e.preventDefault();up([...e.dataTransfer.files])};
front($('#w1'));chat();queue();setInterval(()=>{chat();queue()},4000);
fetch('/api/health').then(r=>r.json()).then(h=>{$('#st5').textContent='Engine: '+h.engine+' · LLM: '+(h.llm==='configured'?'tool-calling':'rules mode')+' · Store: '+h.store}).catch(()=>{$('#st5').textContent='Health check failed'});
