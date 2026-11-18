(()=>{
 const root=document.getElementById('tact-assembly-splash'),loader=document.getElementById('tact-assembly-loading');
 if(!root||!loader)return;
 const style=root.dataset.tactDirection,spec=window.TactSplashDirections?.SPEC[style];
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let ready=false,revealing=false,timer,loaderAnimations=[];
 function beginReveal(){if(revealing)return;revealing=true;window.tactAssemblyRevealing=true;dispatchEvent(new Event('tact:assembly-reveal'));}
 function finish(){if(ready)return;beginReveal();ready=true;if(window.tactSplashSession){try{sessionStorage.setItem('tact-splash-seen','1');}catch(e){}}root.remove();window.tactAssemblyReady=true;dispatchEvent(new Event('tact:assembly-ready'));}
 function addFor(element,loop=false){return (selector,frames,options)=>{
  element.querySelectorAll(selector).forEach((el,i)=>{
   const keyframes=typeof frames==='function'?frames(el,i):frames;
   const opt={fill:'both',...(typeof options==='function'?options(el,i):options)};
   if(loop)opt.iterations=Infinity;
   const animation=el.animate(keyframes,opt);
   if(loop){animation.pause();loaderAnimations.push(animation);}
  });
 };}
 function scalePattern(){
  root.querySelectorAll('.tact-splash-pattern').forEach(el=>{const mobile=el.classList.contains('tact-splash-pattern-mobile');el.style.setProperty('--tact-pattern-scale',Math.max(innerWidth/(mobile?270:880),innerHeight/(mobile?560:495)));});
 }
 function reveal(){
  const easing='cubic-bezier(.77,0,.175,1)';let frames,options;
  if(style==='a'){frames=[{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 0 100% 0)'}];options={duration:950,delay:3350,easing};}
  else if(style==='b'){frames=[{opacity:1},{opacity:0}];options={duration:1000,delay:3350,easing:'cubic-bezier(.16,1,.3,1)'};}
  else if(style==='d'){frames=[{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 0 0 100%)'}];options={duration:1000,delay:3300,easing};}
  else if(style==='f'||style==='v57'){frames=[{opacity:1},{opacity:0}];options={duration:650,delay:3550,easing};}
  else{
   const center=style==='c'?'50% 44%':'50% 50%';
   root.style.maskImage=`radial-gradient(circle at ${center},transparent var(--tact-splash-radius),#000 calc(var(--tact-splash-radius) + 1px))`;
   frames=[{'--tact-splash-radius':'0px'},{'--tact-splash-radius':Math.hypot(innerWidth,innerHeight)*.8+'px'}];
   options={duration:style==='c'?1100:1000,delay:style==='c'?3300:3850,easing};
  }
  // Prepare the page synchronously while the splash is still fully opaque.
  // Only then start exposing it; never expose the server-rendered final state first.
  setTimeout(()=>{
   if(ready)return;
   beginReveal();
   root.animate(frames,{...options,delay:0,fill:'forwards'}).finished.then(finish).catch(finish);
  },options.delay);
  setTimeout(finish,options.delay+options.duration+250);
 }
 if(window.tactAssemblyReady||reduced.matches||!spec||!Element.prototype.animate){finish();if(spec&&!reduced.matches)spec.loader(addFor(loader,true));}
 else{
  try{scalePattern();spec.splash(addFor(root));reveal();spec.loader(addFor(loader,true));}
  catch(error){finish();}
 }
 root.addEventListener('animationend',e=>{if(e.animationName==='tact-splash-failsafe')finish();});
 function hide(){loader.hidden=true;clearTimeout(timer);loaderAnimations.forEach(a=>a.pause());}
 function show(){loader.hidden=false;clearTimeout(timer);if(!reduced.matches)loaderAnimations.forEach(a=>{a.currentTime=0;a.play();});timer=setTimeout(hide,10000);}
 addEventListener('resize',scalePattern);
 reduced.addEventListener('change',()=>{if(reduced.matches){finish();loaderAnimations.forEach(a=>a.cancel());}});
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=event.target.closest('a[href]');if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
  const url=new URL(link.href,location.href);
  if(url.origin!==location.origin||url.pathname.startsWith('/wp-admin')||/\.(pdf|zip|png|jpe?g|svg|webp|mp4)$/i.test(url.pathname))return;
  if(url.pathname===location.pathname&&url.search===location.search)return;
  show();
 });
 addEventListener('pageshow',event=>{hide();if(event.persisted)finish();});
 addEventListener('tact:loading',show);addEventListener('tact:loaded',hide);
})();
