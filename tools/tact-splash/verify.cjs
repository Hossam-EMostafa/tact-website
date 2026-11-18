const {chromium}=require('/tmp/tact-browser/node_modules/playwright');
const fs=require('fs'),assert=require('assert');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const admin=await browser.newContext();await admin.addCookies(JSON.parse(fs.readFileSync('/tmp/tact-browser-cookies.json')));
 const settings=await admin.newPage();
 const url='http://tact.local/wp-admin/options-general.php?page=tact-splash';
 await settings.goto(url,{waitUntil:'domcontentloaded'});assert.equal(await settings.locator('input[type=radio]').count(),5);
 const results=[],errors=[];
 const context=await browser.newContext();const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const expected={a:4,b:4,c:5,d:6,e:1};
 async function save(style,enabled=true){
  await settings.locator('input[name="tact_splash_settings[style]"][value="'+style+'"]').check();
  await settings.locator('input[name="tact_splash_settings[enabled]"]').setChecked(enabled);
  await Promise.all([settings.waitForURL(/settings-updated=true/),settings.locator('#submit').click()]);
  await settings.waitForLoadState('domcontentloaded');
 }
 for(const style of ['a','b','c','d','e']){
  await settings.goto(url,{waitUntil:'domcontentloaded'});await save(style);
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:900});await page.goto('http://tact.local/',{waitUntil:'domcontentloaded'});
   await page.waitForTimeout(700);
   assert.equal(await page.locator('#tact-assembly-splash').count(),1,style+' splash ended early');
   assert.equal(await page.locator('#tact-assembly-splash').getAttribute('data-tact-direction'),style);
   const animations=await page.locator('#tact-assembly-splash').evaluate(el=>el.getAnimations({subtree:true}).length);assert(animations>7,style+' animations missing');
   await page.screenshot({path:__dirname+'/'+style+'-'+width+'.png'});
   await page.waitForFunction(()=>window.tactAssemblyReady===true);await page.waitForFunction(()=>window.tactHomepage);
   assert.equal(await page.locator('#tact-assembly-splash').count(),0);
   await page.evaluate(()=>dispatchEvent(new Event('tact:loading')));
   assert(await page.locator('#tact-assembly-loading').isVisible());
   const loops=await page.locator('#tact-assembly-loading').evaluate(el=>el.getAnimations({subtree:true}).filter(a=>a.playState==='running'&&a.effect.getTiming().iterations===Infinity).length);
   assert.equal(loops,expected[style]);
   await page.evaluate(()=>dispatchEvent(new Event('tact:loaded')));assert(!await page.locator('#tact-assembly-loading').isVisible());
   results.push({style,width,animations,loaderLoops:loops});console.log(JSON.stringify(results.at(-1)));
  }
 }
 // A preview must not change the selected style, and unauthorized queries must not override it.
 await settings.goto(url,{waitUntil:'domcontentloaded'});await save('a');
 const previewURL=await settings.locator('a.button').nth(1).getAttribute('href');
 const preview=await admin.newPage();await preview.goto(previewURL,{waitUntil:'domcontentloaded'});assert.equal(await preview.locator('#tact-assembly-splash').getAttribute('data-tact-direction'),'b');
 await page.goto('http://tact.local/?tact_splash_preview=e',{waitUntil:'domcontentloaded'});assert.equal(await page.locator('#tact-assembly-splash').getAttribute('data-tact-direction'),'a');
 await settings.goto(url,{waitUntil:'domcontentloaded'});await save('a',false);
 await page.goto('http://tact.local/',{waitUntil:'domcontentloaded'});assert.equal(await page.locator('#tact-assembly-splash').count(),0);await page.waitForFunction(()=>window.tactHomepage);
 await settings.goto(url,{waitUntil:'domcontentloaded'});await save('a',true);
 await settings.screenshot({path:__dirname+'/settings.png',fullPage:true});
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto('http://tact.local/',{waitUntil:'domcontentloaded'});await reduced.waitForFunction(()=>window.tactAssemblyReady);assert.equal(await reduced.locator('#tact-assembly-splash').count(),0);
 const nojs=await browser.newPage({javaScriptEnabled:false});await nojs.goto('http://tact.local/',{waitUntil:'domcontentloaded'});await nojs.waitForTimeout(6200);assert.equal(await nojs.locator('#tact-assembly-splash').evaluate(el=>getComputedStyle(el).visibility),'hidden');
 assert.deepEqual(errors,[]);
 fs.writeFileSync(__dirname+'/verification.json',JSON.stringify({results,adminSave:true,preview:true,previewPermission:true,disable:true,reducedMotion:true,noJsFallback:true,finalStyle:'a',errors},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
