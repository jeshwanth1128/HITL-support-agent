const c=require('../lib/core');
module.exports=async(req,res)=>{ if(!c.limit(req)) return res.status(429).json({error:'Too many requests'});
 let store='memory'; if(process.env.UPSTASH_REDIS_REST_URL){ try{ await c.store.set('ping',1,30); store=(await c.store.get('ping'))===1?'upstash:ok':'upstash:error'; }catch(e){ store='upstash:error'; } }
 res.json({store,engine:c.engineInfo(),llm:c.llmOn()?'configured':'none',admin:!!(process.env.ADMIN_TOKEN&&process.env.ADMIN_TOKEN.length>=16)}); };
