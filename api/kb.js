const {limit,isAdmin,addDoc,listDocs,delDoc}=require('../lib/core');
module.exports=async(req,res)=>{ try{
 if(!limit(req)) return res.status(429).json({error:'Too many requests'});
 if(!isAdmin(req)) return res.status(401).json({error:'Unauthorized'});
 if(req.method==='GET') return res.json({files:await listDocs()});
 if(req.method==='POST'){ const {name,text}=req.body||{}; const r=await addDoc(name,text); return res.status(r.code).json(r.error?{error:r.error}:{file:r.file}); }
 if(req.method==='DELETE'){ const id=String((req.query&&req.query.id)||''); if(!/^[a-f0-9-]{36}$/.test(id)) return res.status(400).json({error:'Bad id'});
  const r=await delDoc(id); return res.status(r.code).json(r.error?{error:r.error}:{ok:true}); }
 res.status(405).end();
 }catch(e){ res.status(500).json({error:'Server error'}); } };
