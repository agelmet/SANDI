(function(){
var d=document,w=window,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* header */
var hd=d.querySelector('.hd');
function hs(){if(hd)hd.classList.toggle('solid',scrollY>40)}
hs();addEventListener('scroll',hs,{passive:true});
/* dropdowns: tap to open on touch */
d.querySelectorAll('.nav>li>button').forEach(function(b){b.addEventListener('click',function(e){var li=b.parentNode,o=li.classList.contains('open');d.querySelectorAll('.nav>li.open').forEach(function(x){x.classList.remove('open')});if(!o)li.classList.add('open');b.setAttribute('aria-expanded',!o)})});
d.addEventListener('click',function(e){if(!e.target.closest('.nav'))d.querySelectorAll('.nav>li.open').forEach(function(x){x.classList.remove('open')})});
/* mobile menu */
var mm=d.getElementById('mm'),bg=d.querySelector('.burger');
function mmOpen(o){if(!mm)return;if(o){mm.hidden=false;requestAnimationFrame(function(){mm.classList.add('on')});d.body.style.overflow='hidden'}else{mm.classList.remove('on');d.body.style.overflow='';setTimeout(function(){mm.hidden=true},450)}if(bg)bg.setAttribute('aria-expanded',o)}
if(bg)bg.addEventListener('click',function(){mmOpen(true)});
d.querySelectorAll('[data-mmx]').forEach(function(x){x.addEventListener('click',function(){mmOpen(false)})});
d.querySelectorAll('.mm-list>li>button').forEach(function(b){b.addEventListener('click',function(){var li=b.parentNode;li.classList.toggle('open');b.setAttribute('aria-expanded',li.classList.contains('open'))})});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&mm&&!mm.hidden)mmOpen(false)});
/* hero */
var hero=d.querySelector('.hero');
function heroGo(){if(hero)hero.classList.add('go');d.querySelectorAll('.ph').forEach(function(p){p.classList.add('go')})}
var sl=d.querySelectorAll('.hero-slides>div');
if(sl.length>1&&!RM){var i=0;setInterval(function(){if(d.hidden)return;sl[i].classList.remove('on');i=(i+1)%sl.length;var n=sl[i],im=n.querySelector('img');if(im&&im.loading==='lazy')im.loading='eager';n.classList.add('on')},6500)}
/* intro (once per session) */
var intro=d.querySelector('.intro');
if(d.documentElement.classList.contains('intro-on')&&intro){
  try{sessionStorage.setItem('sandi-intro','1')}catch(e){}
  requestAnimationFrame(function(){intro.classList.add('a')});
  setTimeout(function(){intro.classList.add('out');setTimeout(heroGo,350);setTimeout(function(){d.documentElement.classList.remove('intro-on')},1300)},1500);
}else{requestAnimationFrame(function(){setTimeout(heroGo,60)})}
/* split section headings into words */
d.querySelectorAll('.h2r').forEach(function(h){var k=0;function walk(n){[].slice.call(n.childNodes).forEach(function(c){if(c.nodeType===3){var f=d.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(t){if(!t)return;if(/^\s+$/.test(t)){f.appendChild(d.createTextNode(' '));return}var a=d.createElement('span');a.className='w';var b=d.createElement('span');b.textContent=t;b.style.setProperty('--i',k++);a.appendChild(b);f.appendChild(a)});c.replaceWith(f)}else if(c.nodeType===1&&c.tagName!=='BR')walk(c)})}walk(h)});
/* statement words */
d.querySelectorAll('.statement').forEach(function(s){var t=s.textContent.trim().split(/\s+/);s.innerHTML=t.map(function(x){return'<span class="wd">'+x+'</span>'}).join(' ')});
/* reveals */
var els=d.querySelectorAll('.rv,.fig,.ln,.h2r');
if(RM||!('IntersectionObserver' in w)){els.forEach(function(e){e.classList.add('in')})}
else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.04});els.forEach(function(e){io.observe(e)})}
setTimeout(function(){if(d.hidden)els.forEach(function(e){e.classList.add('in')})},2500);
/* one scroll handler: statement lighting + CTA parallax */
var st=[].slice.call(d.querySelectorAll('.statement .wd')),ctas=[].slice.call(d.querySelectorAll('.cta img')),tk=false;
function sc(){tk=false;var vh=innerHeight;st.forEach(function(x){var r=x.getBoundingClientRect();x.classList.toggle('lit',r.top<vh*.72)});if(!RM)ctas.forEach(function(im){var r=im.parentNode.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;im.style.setProperty('--py',((r.top+r.height/2-vh/2)*-.12).toFixed(1)+'px')})}
if(st.length||ctas.length){addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(sc)}},{passive:true});sc()}
if(RM)st.forEach(function(x){x.classList.add('lit')});
/* map highlight */
d.querySelectorAll('[data-dest]').forEach(function(a){var g=d.querySelector('.map g[data-d="'+a.dataset.dest+'"]');if(!g)return;a.addEventListener('mouseenter',function(){g.classList.add('hi')});a.addEventListener('mouseleave',function(){g.classList.remove('hi')})});
/* portfolio filter */
d.querySelectorAll('.filters button').forEach(function(b){b.addEventListener('click',function(){var f=b.dataset.f;d.querySelectorAll('.filters button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});d.querySelectorAll('[data-cat]').forEach(function(c){c.hidden=!(f==='all'||c.dataset.cat===f)})})});
/* form */
var fm=d.getElementById('plan');
if(fm){
  var q=new URLSearchParams(location.search),t=q.get('type');
  if(t){var o=fm.querySelector('select[name="Type of Event"]');if(o)[].forEach.call(o.options,function(op){if(op.value===t)o.value=t})}
  var dst=q.get('destination');if(dst){var de=fm.querySelector('[name="Preferred Destination / Location"]');if(de)de.value=dst}
  fm.addEventListener('submit',function(e){
    e.preventDefault();var ok=true;
    fm.querySelectorAll('[required]').forEach(function(x){var f=x.closest('.fld,.consent');var bad=x.type==='checkbox'?!x.checked:!x.value.trim()||(x.type==='email'&&!/^\S+@\S+\.\S+$/.test(x.value));if(f)f.classList.toggle('err',bad);if(bad)ok=false});
    var msg=d.querySelector('.form-msg');
    if(!ok){if(msg){msg.textContent='Please complete the fields marked with *.';msg.classList.add('on')}var fe=fm.querySelector('.err input,.err select');if(fe)fe.focus();return}
    if(msg)msg.classList.remove('on');
    var data={};new FormData(fm).forEach(function(v,k){if(k==='_gotcha')return;data[k]=data[k]?data[k]+', '+v:v});
    if(fm._gotcha&&fm._gotcha.value)return;
    var btn=fm.querySelector('button[type=submit]');btn.disabled=true;
    function mail(){var body=Object.keys(data).map(function(k){return k+': '+data[k]}).join('\n');location.href='mailto:'+fm.dataset.to+'?subject='+encodeURIComponent('Plan Your Event — '+(data['Full Name']||''))+'&body='+encodeURIComponent(body);fm.closest('.form-wrap').classList.add('sent')}
    fetch('https://advonmedia.com/api/form',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({site:'sandi',kind:'Plan Your Event',fields:data})}).then(function(r){if(!r.ok)throw 0;fm.closest('.form-wrap').classList.add('sent')}).catch(mail).finally(function(){btn.disabled=false});
  });
}
/* lightbox */
var lb=d.createElement('div');lb.className='lbx';lb.hidden=true;lb.setAttribute('role','dialog');lb.setAttribute('aria-label','Image');lb.innerHTML='<img alt=""><p></p><button type="button" aria-label="Close"></button>';d.body.appendChild(lb);
var lbi=lb.querySelector('img'),lbp=lb.querySelector('p'),lastF=null;
function lbClose(){lb.classList.remove('on');setTimeout(function(){lb.hidden=true},400);if(lastF)lastF.focus()}
d.querySelectorAll('.fig').forEach(function(f){var im=f.querySelector('img');if(!im)return;f.tabIndex=0;f.setAttribute('role','button');f.setAttribute('aria-label','View image: '+im.alt);
 function op(){lastF=f;lbi.src=(im.currentSrc||im.src).replace(/-(800|1376)\.webp$/,'-1376.webp');lbi.alt=im.alt;lbp.textContent=im.alt;lb.hidden=false;requestAnimationFrame(function(){lb.classList.add('on')});lb.querySelector('button').focus()}
 f.addEventListener('click',op);f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();op()}})});
lb.addEventListener('click',function(e){if(e.target!==lbi)lbClose()});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!lb.hidden)lbClose()});
})();
