const fs=require('fs'),vm=require('vm');
const sourceDir='/home/hossam/Downloads/Tact website UIUX design v5.3.1/Tact website UIUX designFinal';
const target='/home/hossam/Local Sites/tact/app/public/wp-content/plugins/tact-splash';
const source=fs.readFileSync(sourceDir+'/Tact Splash Options.dc.html','utf8');
const code=source.slice(source.indexOf('const EO ='),source.indexOf('class Component extends DCLogic'));
const data=vm.runInNewContext(code+';({PIECES,LETTERS,FRAMES})');
fs.writeFileSync(target+'/assets/directions.js','(()=>{\n'+code+'\nwindow.TactSplashDirections={SPEC};\n})();');
for(const name of ['tact-logo.svg','tact-logo-light.svg'])fs.copyFileSync(sourceDir+'/assets/'+name,target+'/assets/'+name);
function paths(draw=false){return data.PIECES.map(p=>`<path data-p="${p.k}" d="${p.d}" fill="${p.c}" ${draw?'pathLength="1"':''} style="transform-box:fill-box;transform-origin:${p.o}"></path>`).join('');}
for(const style of ['a','b','c','d','e']){
 const light=['b','d'].includes(style),draw=style==='d';
 const mark=`<svg data-mark viewBox="0 0 119 78" aria-hidden="true">${paths(draw)}</svg>`;
 let tiles='';
 if(style==='b')for(const f of data.FRAMES){tiles+=`<div class="tact-splash-pattern tact-splash-pattern-${f.kind}">`+f.tiles.map(t=>`<div data-t data-d="${t.d}" data-r="${t.r}" style="left:${t.x}px;top:${t.y}px;width:${t.s}px;height:${t.s}px;border-radius:${t.br};background:${t.bg};border:${t.bd};transform:rotate(${t.r}deg)"></div>`).join('')+'</div>';}
 const html=`<div id="tact-assembly-splash" class="tact-splash-overlay tact-splash-${style}${draw?' tact-splash-draw':''}" data-tact-direction="${style}" aria-hidden="true">${tiles}<div data-lockup class="tact-splash-lockup">${mark}<div data-word class="tact-splash-word"><svg viewBox="0 0 106 41" aria-hidden="true">${data.LETTERS.map(d=>`<path data-l d="${d}" fill="#e85d2c" ${draw?'pathLength="1"':''}></path>`).join('')}</svg><div data-desc class="tact-splash-desc"><img src="{{ASSETS}}tact-logo${light?'':'-light'}.svg" alt=""></div></div></div></div><div id="tact-assembly-loading" class="tact-splash-loading tact-splash-${style}${draw?' tact-splash-draw':''}" data-tact-direction="${style}" hidden role="status"><div class="tact-splash-loader">${mark}</div><span class="tact-splash-sr tact-splash-en">Loading page</span><span class="tact-splash-sr tact-splash-ar">جارٍ تحميل الصفحة</span></div>`;
 fs.writeFileSync(target+'/assets/'+style+'.html',html);
}
for(const name of ['tact-splash.php','readme.txt'])fs.copyFileSync(__dirname+'/'+name,target+'/'+name);
for(const name of ['splash.css','splash.js'])fs.copyFileSync(__dirname+'/'+name,target+'/assets/'+name);
console.log('Built standalone Tact Splash plugin with five source directions.');
