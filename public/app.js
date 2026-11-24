const $=s=>document.querySelector(s);
const sid=localStorage.sid||(localStorage.sid=crypto.randomUUID());let tok=sessionStorage.tok||'',n=-1;
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const api=async(u,o={})=>{const r=await fetch(u,{...o,headers:{'Content-Type':'application/json',...(tok&&{Authorization:'Bearer '+tok})}});return{ok:r.ok,d:await r.json().catch(()=>({}))}};
async function chat(){const{d}=await api('/api/chat?sid='+sid);const m=d.msgs||[];if(m.length===n)return;n=m.length;
 $('#log').replaceChildren(...m.map(x=>el('div','m '+x.role,x.text)));$('#log').scrollTop=1e9}
async function queue(){if(!tok)return;const{ok,d}=await api('/api/review');const q=$('#q');q.replaceChildren();
 if(!ok){q.append(el('p','hint','Invalid token.'));tok='';sessionStorage.tok='';return}
 if(!d.pending.length)q.append(el('p','hint','No refunds awaiting approval.'));
 d.pending.forEach(t=>{const c=el('div','tk');c.append(el('small',0,'Order '+t.orderId),el('b',0,'Refund $'+t.amount),el('small',0,t.policy));
  const b=el('div');for(const[k,l,cl]of[['approve','Approve','ok'],['reject','Reject','no']]){const x=el('button',cl,l);
   x.onclick=async()=>{x.disabled=true;await api('/api/review',{method:'POST',body:JSON.stringify({id:t.id,decision:k})});queue();chat()};b.append(x)}
  c.append(b);q.append(c)})}
$('#f').onsubmit=async e=>{e.preventDefault();const v=$('#in').value.trim();if(!v)return;$('#in').value='';
 await api('/api/chat',{method:'POST',body:JSON.stringify({sid,message:v})});await chat();queue()};
$('#t').onsubmit=e=>{e.preventDefault();tok=sessionStorage.tok=$('#tok').value;$('#tok').value='';queue()};
chat();queue();setInterval(()=>{chat();queue()},4000);
