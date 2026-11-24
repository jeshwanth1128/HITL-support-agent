const {limit,store,runAgent}=require('../lib/core');
module.exports=async(req,res)=>{ try{
 if(!limit(req)) return res.status(429).json({error:'Too many requests'});
 const sid=String((req.query&&req.query.sid)||(req.body&&req.body.sid)||'');
 if(!/^[a-f0-9-]{36}$/.test(sid)) return res.status(400).json({error:'Bad session'});
 if(req.method==='GET'){ const s=await store.get('s:'+sid); return res.json({msgs:s?s.msgs:[],trace:s?(s.trace||[]):[]}); }
 if(req.method!=='POST') return res.status(405).end();
 const m=String(req.body&&req.body.message||'').trim();
 if(!m||m.length>500) return res.status(400).json({error:'Message must be 1-500 characters'});
 await runAgent(sid,m); res.json({ok:true});
 }catch(e){ res.status(500).json({error:'Server error'}); } };
