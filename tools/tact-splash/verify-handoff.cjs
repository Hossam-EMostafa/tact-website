const {chromium}=require('/tmp/tact-browser/node_modules/playwright');
const fs=require('fs'),assert=require('assert');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const admin=await browser.newContext();await admin.addCookies(JSON.parse(fs.readFileSync('/tmp/tact-browser-cookies.json')));
 const settings=await admin.newPage();await settings.goto('http://tact.local/wp-admin/options-general.php?page=tact-splash',{waitUntil:'domcontentloaded'});
 const urls=await settings.locator('a.button').evaluateAll(links=>links.map(a=>a.href));
 const results=[],errors=[];
 for(const width of [1440,390])for(let i=0;i<5;i++){
  const page=await admin.newPage();await page.setViewportSize({width,height:900});page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   window.handoff={revealEvents:0,readyEvents:0,earlyExpose:0,first:null};
   addEventListener('tact:assembly-reveal',()=>{handoff.revealEvents++;queueMicrotask(()=>{
    const heading=Array.from(document.querySelectorAll('.tact-home h1')).find(el=>el.getClientRects().length);
    const animation=heading?.querySelector('.h-line>span')?.getAnimations()[0];
    handoff.atReveal={initialized:!!window.tactHomepage,headingAnimationTime:animation?.currentTime};
   });});
   addEventListener('tact:assembly-ready',()=>{handoff.readyEvents++;handoff.atReadyInstance=window.tactHomepage;});
   const monitor=()=>{
    const root=document.getElementById('tact-assembly-splash');
    if(root){const opening=root.getAnimations().some(a=>a.effect?.target===root&&!(a instanceof CSSAnimation)&&Number(a.currentTime)>0);if(opening&&!window.tactHomepage)handoff.earlyExpose++;}
    if(window.tactHomepage&&!handoff.first)handoff.first=window.tactHomepage;
    requestAnimationFrame(monitor);
   };requestAnimationFrame(monitor);
  });
  await page.goto(urls[i],{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.tactAssemblyReady&&window.tactHomepage);
  await page.waitForTimeout(700);
  const result=await page.evaluate(()=>({revealEvents:handoff.revealEvents,readyEvents:handoff.readyEvents,earlyExpose:handoff.earlyExpose,atReveal:handoff.atReveal,sameInstance:handoff.first===tactHomepage&&handoff.atReadyInstance===tactHomepage,overlay:!!document.getElementById('tact-assembly-splash')}));
  assert.equal(result.revealEvents,1);assert.equal(result.readyEvents,1);assert.equal(result.earlyExpose,0);
  assert(result.atReveal.initialized);assert(result.atReveal.headingAnimationTime<100,JSON.stringify(result));assert(result.sameInstance);assert(!result.overlay);
  results.push({style:'abcde'[i],width,...result});console.log(JSON.stringify(results.at(-1)));await page.close();
 }
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto('http://tact.local/',{waitUntil:'domcontentloaded'});await reduced.waitForFunction(()=>window.tactHomepage);assert.equal(await reduced.locator('#tact-assembly-splash').count(),0);
 assert.deepEqual(errors,[]);fs.writeFileSync(__dirname+'/handoff-verification.json',JSON.stringify({results,reducedMotion:true,errors},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
