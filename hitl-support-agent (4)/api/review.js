const {limit,store,isAdmin,decide}=require('../lib/core');
module.exports=async(req,res)=>{ try{
 if(!limit(req)) return res.status(429).json({error:'Too many requests'});
 if(!isAdmin(req)) return res.status(401).json({error:'Unauthorized'});
 if(req.method==='GET'){ const out=[]; for(const id of (await store.get('idx'))||[]){ const t=await store.get('t:'+id);
   if(t&&t.status==='pending') out.push({id:t.id,orderId:t.orderId,amount:t.amount,policy:t.policy,created:t.created}); } return res.json({pending:out}); }
 if(req.method!=='POST') return res.status(405).end();
 const {id,decision}=req.body||{};
 if(!/^[a-f0-9-]{36}$/.test(String(id))||!['approve','reject'].includes(decision)) return res.status(400).json({error:'Bad request'});
 const r=await decide(id,decision); res.status(r.code).json(r.error?{error:r.error}:{ok:true});
 }catch(e){ res.status(500).json({error:'Server error'}); } };
