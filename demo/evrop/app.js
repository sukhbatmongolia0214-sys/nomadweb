(()=>{
'use strict';
document.documentElement.classList.add('js');
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Math.round(n).toLocaleString('en-US')+'₮';
const store={get(k,d){try{const v=localStorage.getItem('ev_'+k);return v?JSON.parse(v):d}catch(_){return d}},set(k,v){try{localStorage.setItem('ev_'+k,JSON.stringify(v));return true}catch(_){return false}},del(k){try{localStorage.removeItem('ev_'+k)}catch(_){}}};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- business constants ----------
const C={phone:'96651068',phoneLbl:'9665-1068',chat:'https://m.me/100068681297166',fb:'https://www.facebook.com/profile.php?id=100068681297166',map:'https://www.facebook.com/reel/1551812060086753',addr:'Нарантуул, Өргөтгөл · 25, 26-р агуулах'};
const RULE={min:100000,free:300000,fee:10000}; // жишээ нөхцөл
const DISTRICTS=['Баянзүрх','Сүхбаатар','Чингэлтэй','Баянгол','Хан-Уул','Сонгинохайрхан','Налайх','Багануур','Багахангай','Орон нутаг (унаанд тавина)'];
const STATUS={new:'Шинэ',wait:'Төлбөр хүлээгдэж буй',paid:'Төлбөр орсон',prep:'Бэлтгэж байна',ship:'Хүргэлтэд гарсан',done:'Хүргэгдсэн'};
const FLOW=['new','paid','prep','ship','done'];
const BANKS=['Хаан банк','Голомт банк','Худалдаа хөгжлийн банк','Төрийн банк','Хас банк','Капитрон банк','М банк','Ариг банк'];
const DRIVERS=['Бат-Эрдэнэ','Ганбаатар','Төмөрхүү'];
const UNITS=['ш','лааз','шил','сав','блок','уут','кг','хайрцаг'];
const DEMO={store:'Хүслэн дэлгүүр',phone:'99112233',district:'Баянзүрх',khoroo:'8-р хороо',addr:'Нарны зам, 15-р байрны 1 давхар',credit:true};

// ---------- icons ----------
const sv=(p,f)=>`<svg class="i" viewBox="0 0 24 24" fill="${f?'currentColor':'none'}" stroke="${f?'none':'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I={
 search:sv('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
 cart:sv('<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>'),
 user:sv('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
 lock:sv('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
 plus:sv('<path d="M12 5v14M5 12h14"/>'),
 pin:sv('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
 chat:sv('<path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3 21l1.5-5.2A8.5 8.5 0 1 1 21 12z"/>'),
 phone:sv('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
 fb:sv('<path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5.5v4H8v7h4v-7h3l1-4h-4V7.8c0-.7.5-1.3 1.3-1.3H16V3z"/>',true),
 arrow:sv('<path d="M5 12h14M13 6l6 6-6 6"/>'),
 cartMk:sv('<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><path d="M10 8l1.5 4M14 8l-.5 4"/><circle cx="10" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>'),
 medal:sv('<circle cx="12" cy="9" r="6"/><path d="m9 14-2 7 5-3 5 3-2-7"/><path d="m12 6 1 2 2 .3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1L9 8.3l2-.3z"/>'),
 pct:sv('<circle cx="12" cy="12" r="9"/><path d="m9 15 6-6"/><circle cx="9.3" cy="9.3" r=".8"/><circle cx="14.7" cy="14.7" r=".8"/>'),
 truck:sv('<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>'),
 leaf:sv('<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15"/><path d="M5 19c3-4 6-6 10-8"/>'),
 tag:sv('<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>'),
 shield:sv('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>'),
 basket:sv('<path d="M4 10h16l-1.5 9a2 2 0 0 1-2 1.7h-9a2 2 0 0 1-2-1.7z"/><path d="m8 10 3-6M16 10l-3-6M9 14v3M12 14v3M15 14v3"/>'),
 heart:sv('<path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10z"/>'),
 edit:sv('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>'),
 trash:sv('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
 grid:sv('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>')
};
const euStars=()=>{let s='';for(let k=0;k<12;k++){const a=k/12*Math.PI*2;const x=24+15*Math.sin(a),y=24-15*Math.cos(a);s+=`<path transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(.95)" d="M0-3l.9 2 2.1.2-1.6 1.4.5 2.1L0 1.6-1.9 2.7l.5-2.1L-3-.8l2.1-.2z" fill="#FFC81E"/>`}return `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#123A86"/>${s}</svg>`};

// ---------- state ----------
const base=window.EV_PRODUCTS.map(p=>({active:true,...p}));
let P=store.get('products2',null)||base.map(p=>({...p}));
let CATS=store.get('cats2',null)||window.EV_CATS.map(c=>({...c}));
const byId=id=>P.find(p=>p.id===id);
let user=store.get('user',null),cart=store.get('cart',{}),admin=store.get('admin',false);
let ui={cat:'all',q:'',sort:'pop',view:store.get('view','grid')};
const today=new Date();
const dstr=d=>d.toISOString().slice(0,10);
function seedOrders(){
 const mk=(id,st,district,mins,status,items,pay)=>{const d=new Date(today.getTime()-mins*60000);const sub=items.reduce((s,[pid,q])=>{const p=byId(pid);return s+(p?p.price*p.pack*q:0)},0);const fee=sub>=RULE.free?0:RULE.fee;return {id,store:st,district,at:d.toISOString(),status,items:items.map(([pid,q])=>({id:pid,q})),sub,fee,total:sub+fee,pay:pay||'qpay',method:'delivery',driver:''}};
 return [
  mk('EV-2611-0048','Сүлд-7 дэлгүүр','Сүхбаатар',18,'new',[['p37',3],['p33',2],['p13',2]]),
  mk('EV-2611-0047','Энхжин хүнс','Чингэлтэй',42,'paid',[['p41',2],['p42',2],['p32',3]]),
  mk('EV-2611-0046','Мөнх-Оргил маркет','Сонгинохайрхан',75,'wait',[['p26',2],['p29',2]],'bank'),
  mk('EV-2611-0045','Наранхүү дэлгүүр','Баянгол',130,'prep',[['p11',4],['p13',3],['p34',2]]),
  mk('EV-2611-0044','Тэмүүлэн 24','Хан-Уул',190,'prep',[['p15',2],['p20',3],['p16',1]]),
  mk('EV-2611-0043','Ундрам минимаркет','Баянзүрх',260,'ship',[['p38',4],['p36',2],['p35',2]]),
  mk('EV-2611-0042','Хонгор хүнс (Дархан)','Орон нутаг (унаанд тавина)',400,'ship',[['p05',3],['p10',3],['p07',2],['p28',2]]),
  mk('EV-2511-0039','Хүслэн дэлгүүр','Баянзүрх',60*26,'done',[['p37',2],['p33',1],['p11',3],['p32',2]]),
  mk('EV-2511-0031','Хүслэн дэлгүүр','Баянзүрх',60*24*4,'done',[['p40',2],['p26',2],['p13',2]]),
  mk('EV-2511-0028','Сүлд-7 дэлгүүр','Сүхбаатар',60*24*5,'done',[['p44',2],['p43',2]])
 ];
}
let orders=store.get('orders',null)||seedOrders();
let customers=store.get('customers',null)||[
 {store:'Хүслэн дэлгүүр',phone:'99112233',district:'Баянзүрх',status:'ok',tier:'Бөөний'},
 {store:'Сүлд-7 дэлгүүр',phone:'88014422',district:'Сүхбаатар',status:'ok',tier:'Бөөний'},
 {store:'Энхжин хүнс',phone:'95117730',district:'Чингэлтэй',status:'ok',tier:'Гэрээт (зээлтэй)'},
 {store:'Мөнх-Оргил маркет',phone:'89904512',district:'Сонгинохайрхан',status:'ok',tier:'Бөөний'},
 {store:'Наранхүү дэлгүүр',phone:'99458801',district:'Баянгол',status:'ok',tier:'Бөөний'},
 {store:'Тэмүүлэн 24',phone:'80236655',district:'Хан-Уул',status:'ok',tier:'Бөөний'},
 {store:'Ундрам минимаркет',phone:'94401288',district:'Баянзүрх',status:'ok',tier:'Гэрээт (зээлтэй)'},
 {store:'Хонгор хүнс (Дархан)',phone:'99372210',district:'Орон нутаг (унаанд тавина)',status:'ok',tier:'Бөөний'},
 {store:'Шинэ-Ирээдүй дэлгүүр',phone:'88771205',district:'Налайх',status:'wait',tier:'Бөөний'},
 {store:'Гэгээ маркет',phone:'99025566',district:'Сонгинохайрхан',status:'wait',tier:'Бөөний'}
];
function save(){const ok=store.set('products2',P);store.set('cats2',CATS);store.set('cart',cart);store.set('orders',orders);store.set('customers',customers);store.set('user',user);store.set('admin',admin);store.set('view',ui.view);if(!ok)toast('Хөтчийн санах ой дүүрлээ — зургийг жижиг хэмжээгээр оруулна уу')}

// ---------- helpers ----------
const catOf=id=>CATS.find(c=>c.id===id)||{name:'',img:''};
const boxPrice=p=>p.price*p.pack;
const im=p=>p.img||`img/${p.id}.webp`;
const mnDate=d=>`${d.getFullYear()} оны ${d.getMonth()+1}-р сарын ${d.getDate()}`;
const hm=d=>{d=new Date(d);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
const cartLines=()=>Object.entries(cart).filter(([id,q])=>q>0&&byId(id)).map(([id,q])=>({p:byId(id),q}));
function totals(method){const lines=cartLines();const sub=lines.reduce((s,l)=>s+boxPrice(l.p)*l.q,0);const boxes=lines.reduce((s,l)=>s+l.q,0);const fee=method==='pickup'||sub===0||sub>=RULE.free?0:RULE.fee;return {lines,sub,boxes,fee,total:sub+fee}}
let tt=0;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),1900)}
const ext=(href,inner,cls)=>`<a class="${cls||''}" href="${href}" target="_blank" rel="noopener">${inner}</a>`;

// ---------- shell ----------
const app=$('#app');
app.innerHTML=`<div class="util" id="util"><div class="wrap">
 <span class="addr">${I.pin}<span>${C.addr}</span></span>
 ${ext(C.map,`${I.pin}<span class="lbl">Байршил</span>`)}
 ${ext(C.chat,`${I.chat}<span class="lbl">Чат</span>`)}
 <a href="tel:${C.phone}">${I.phone}<span class="ph">${C.phoneLbl}</span></a>
 ${ext(C.fb,`${I.fb}<span class="lbl">Facebook</span>`)}
</div></div>
<header class="top" id="top"><div class="wrap">
 <a class="logo" href="#/"><span class="mk">${I.cartMk}</span><span><b>ЕВРОП БАРАА</b><span>Бөөний худалдаа</span></span></a>
 <label class="search"><span class="sr">Бараа хайх</span>${I.search}<input id="q" type="search" placeholder="Бараа, брэнд хайх — жишээ нь Love Day" autocomplete="off"></label>
 <nav class="tnav" id="tnav"></nav>
</div></header><main id="view"></main>`;
function renderNav(){
 const t=totals();
 $('#tnav').innerHTML=(user?`<a class="tbtn" href="#/orders">${I.user}<span class="lbl">${esc(user.store)}</span></a>`:`<button class="tbtn" type="button" data-login>${I.user}<span class="lbl">Нэвтрэх</span></button>`)+
 `<button class="tbtn cart" type="button" data-cart id="cartbtn">${I.cart}<span class="num">${fmt(t.sub)}</span>${t.boxes?`<span class="cnt">${t.boxes}</span>`:''}</button>`;
 const mb=$('#mbar');mb.innerHTML=`<span>${I.cart}${t.boxes} хайрцаг</span><span class="num">${fmt(t.sub)} →</span>`;
 const h=location.hash,show=t.boxes>0&&!h.startsWith('#/admin')&&!h.startsWith('#/checkout')&&!h.startsWith('#/pay');
 mb.classList.toggle('on',show);$('#fab').classList.toggle('up',show);
 $('#fab').style.display=h.startsWith('#/admin')?'none':'';
}
$('#q').addEventListener('input',e=>{ui.q=e.target.value.trim();if(route().name!=='home'){location.hash='#/';return}renderCatalog();const c=$('#catalog');if(c&&ui.q&&c.getBoundingClientRect().top>220)c.scrollIntoView({behavior:reduce?'auto':'smooth'})});

// ---------- product UI ----------
const specTxt=p=>`1×${p.pack}${p.unit==='блок'||p.unit==='уут'?' '+p.unit:''} · ${p.spec}`;
function qa(p){
 const q=cart[p.id]||0;
 if(!user)return `<button class="plus lock" type="button" data-login aria-label="Нэвтэрч захиалах">${I.lock}</button>`;
 if(p.stock<=0)return '';
 return q?`<div class="pill2"><button type="button" data-dec="${p.id}" aria-label="Хасах">−</button><input type="number" inputmode="numeric" min="0" value="${q}" data-qty="${p.id}" aria-label="Хайрцагны тоо"><button type="button" data-inc="${p.id}" aria-label="Нэмэх">+</button></div>`:`<button class="plus" type="button" data-inc="${p.id}" aria-label="1 хайрцаг нэмэх">${I.plus}</button>`;
}
const mathTxt=p=>{const q=cart[p.id]||0;return q?`${q} хайрцаг = ${q*p.pack} ${p.unit} · ${fmt(q*boxPrice(p))}`:''};
function card(p){
 const b=[];if(p.old)b.push(`<span class="bdg">−${Math.round((1-p.price/p.old)*100)}%</span>`);if(p.stock>0&&p.stock<15)b.push('<span class="bdg low">Цөөн үлдсэн</span>');if(p.stock<=0)b.push('<span class="bdg low">Дууссан</span>');if(user&&p.ex)b.push('<span class="bdg ex">жишээ үнэ</span>');
 return `<article class="pc rv"><div class="ph"><button class="pimg" type="button" data-open="${p.id}" aria-label="${esc(p.name)}"><img loading="lazy" src="${im(p)}" alt="${esc((p.brand?p.brand+' ':'')+p.name)}"></button><div class="badges">${b.join('')}</div><div class="qa" data-ctl="${p.id}">${qa(p)}</div></div>
 <div class="bd"><div class="meta"><span>${esc(p.brand||catOf(p.cat).name)}</span><span class="sp">${esc(specTxt(p))}</span></div><h3><button type="button" data-open="${p.id}">${esc(p.name)}</button></h3>
 ${user?`<div class="price"><b>${fmt(p.price)}</b><small>/ ${p.unit}</small>${p.old?`<s>${fmt(p.old)}</s>`:''}</div><div class="boxp">Хайрцаг ${fmt(boxPrice(p))}</div><div class="math" data-math="${p.id}">${mathTxt(p)}</div>`:`<button class="locked" type="button" data-login>${I.lock} Нэвтэрч үнэ харах</button>`}</div></article>`;
}
function ctlList(p){const q=cart[p.id]||0;if(!user)return `<button class="locked" type="button" data-login>${I.lock} Нэвтрэх</button>`;return q?`<div class="step"><button type="button" data-dec="${p.id}" aria-label="Хасах">−</button><input type="number" inputmode="numeric" value="${q}" data-qty="${p.id}" aria-label="Хайрцаг"><button type="button" data-inc="${p.id}" aria-label="Нэмэх">+</button></div>`:`<button class="add" type="button" data-inc="${p.id}">Хайрцгаар сагслах</button>`}
function row(p){
 return `<div class="lr"><img loading="lazy" src="${im(p)}" alt=""><div class="nm"><b><button type="button" data-open="${p.id}" style="all:unset;cursor:pointer">${esc(p.brand?p.brand+' · ':'')}${esc(p.name)}</button></b><small>${esc(specTxt(p))}${user?` · ${fmt(p.price)}/${p.unit}`:''}</small><div class="math" data-math="${p.id}">${user?mathTxt(p):''}</div></div>
 <div class="r hide">${user?`<b class="num">${fmt(boxPrice(p))}</b>`:'—'}</div><div class="hide stk ${p.stock<15?'low':'ok'}">${p.stock} хайрцаг</div><div data-ctll="${p.id}">${ctlList(p)}</div></div>`;
}
function refresh(id){const p=byId(id);if(!p)return;$$(`[data-ctl="${id}"]`).forEach(el=>el.innerHTML=qa(p));$$(`[data-ctll="${id}"]`).forEach(el=>el.innerHTML=ctlList(p));$$(`[data-math="${id}"]`).forEach(el=>el.textContent=mathTxt(p));renderNav();if($('#cart').classList.contains('on'))renderCart();if(route().name==='checkout')renderView()}
function setQty(id,q){const p=byId(id);if(!p)return;q=Math.max(0,Math.min(999,parseInt(q)||0));if(q>p.stock){q=p.stock;toast(`Үлдэгдэл ${p.stock} хайрцаг байна`)}if(q)cart[id]=q;else delete cart[id];save();refresh(id)}
function fly(fromEl){
 if(reduce||!fromEl)return;const card=fromEl.closest('.pc,.lr,.pd,.sc');const img=card&&card.querySelector('img');const tgt=$('#mbar.on')||$('#cartbtn');if(!img||!tgt||!tgt.offsetParent)return;
 const a=img.getBoundingClientRect(),b=tgt.getBoundingClientRect();const c=img.cloneNode();c.className='fly';const s=Math.min(a.width,110);Object.assign(c.style,{left:a.left+a.width/2-s/2+'px',top:a.top+a.height/2-s/2+'px',width:s+'px',height:s+'px'});document.body.append(c);
 const dx=b.left+b.width/2-(a.left+a.width/2),dy=b.top+b.height/2-(a.top+a.height/2);
 c.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx*.5}px,${dy*.5-90}px) scale(.6)`,opacity:1,offset:.55},{transform:`translate(${dx}px,${dy}px) scale(.15)`,opacity:.3}],{duration:750,easing:'cubic-bezier(.5,0,.3,1)'}).onfinish=()=>{c.remove();const t=$('#cartbtn');t&&(t.classList.remove('bump'),void t.offsetWidth,t.classList.add('bump'))};
}

// ---------- views ----------
function visible(){
 let a=P.filter(p=>p.active);
 if(ui.cat==='sale')a=a.filter(p=>p.old);else if(ui.cat!=='all')a=a.filter(p=>p.cat===ui.cat);
 if(ui.q){const q=ui.q.toLowerCase();a=a.filter(p=>(p.name+' '+p.brand+' '+catOf(p.cat).name+' '+p.spec).toLowerCase().includes(q))}
 if(ui.sort==='low')a=[...a].sort((x,y)=>boxPrice(x)-boxPrice(y));else if(ui.sort==='high')a=[...a].sort((x,y)=>boxPrice(y)-boxPrice(x));else if(ui.sort==='az')a=[...a].sort((x,y)=>(x.brand+x.name).localeCompare(y.brand+y.name,'mn'));
 return a;
}
function renderCatalog(){
 const el=$('#catbody');if(!el)return;
 const act=P.filter(p=>p.active),a=visible();
 const tabs=[{id:'all',name:'Бүх бараа',n:act.length},{id:'sale',name:'Хямдрал',n:act.filter(p=>p.old).length,img:'img/p41.webp'},...CATS.map(c=>({id:c.id,name:c.name,n:act.filter(p=>p.cat===c.id).length,img:c.img}))].filter(t=>t.n||t.id==='all');
 $('#ctabs').innerHTML=tabs.map(t=>`<button type="button" class="tab ${ui.cat===t.id?'on':''}" data-cat="${t.id}">${t.img?`<img src="${t.img}" alt="">`:`<span class="all">${I.grid}</span>`}${esc(t.name)}<small>${t.n}</small></button>`).join('');
 $('#found').textContent=`${a.length} бараа`+(ui.q?` · “${ui.q}”`:'');
 $$('#seg button').forEach(b=>b.classList.toggle('on',b.dataset.view===ui.view));
 if(!a.length){el.innerHTML=`<div class="empty"><b>Илэрц олдсонгүй</b>Өөр үгээр хайгаад үзээрэй.</div>`;return}
 if(ui.view==='list')el.innerHTML=`<div class="list"><div class="lr hd"><span></span><span>Бараа</span><span class="r hide">Хайрцгийн үнэ</span><span class="hide">Үлдэгдэл</span><span>Захиалах</span></div>${a.map(row).join('')}</div>`;
 else if(ui.cat==='all'&&!ui.q&&ui.sort==='pop')el.innerHTML=CATS.map(c=>{const ps=a.filter(p=>p.cat===c.id);return ps.length?`<section class="grp"><div class="gh"><h3>${esc(c.name)}<small>${ps.length} бараа</small></h3><button class="link" type="button" data-cat="${c.id}">Зөвхөн энийг харах</button></div><div class="grid">${ps.map(card).join('')}</div></section>`:''}).join('');
 else el.innerHTML=`<div class="grid">${a.map(card).join('')}</div>`;
 reveal();
}
function home(){
 const sample=user&&orders.find(o=>o.store===user.store);
 const lines=(sample?sample.items:[{id:'p37',q:3},{id:'p33',q:2},{id:'p11',q:4}]).slice(0,3).map(i=>({p:byId(i.id),q:i.q})).filter(l=>l.p);
 const tot=lines.reduce((s,l)=>s+boxPrice(l.p)*l.q,0);
 const act=P.filter(p=>p.active),sale=act.filter(p=>p.old).slice(0,4);
 const bento=CATS.map(c=>({...c,n:act.filter(p=>p.cat===c.id).length})).filter(c=>c.n).slice(0,5);
 const seen=new Set(),brands=act.map(p=>(p.brand||'').replace(/^the\s+/i,'').trim()).filter(b=>b&&!seen.has(b.toLowerCase())&&seen.add(b.toLowerCase()));
 const mq=[...brands,...brands].map(b=>`<span>${esc(b)}</span>`).join('');
 return `<section class="hero"><picture><source media="(max-width:640px)" srcset="img/hero-m.webp"><img class="hbg" src="img/hero.webp" alt="" fetchpriority="high"></picture>
  <div class="wrap"><div class="hin">
   <span class="tagline ld" style="animation-delay:.1s">Чанартай бараа — найдвартай хамтын ажиллагаа</span>
   <h1><span class="ld" style="animation-delay:.22s">Хүнсний дэлгүүрүүдтэй</span><span class="ld" style="animation-delay:.34s">хамтран ажиллана</span></h1>
   <p class="lead ld" style="animation-delay:.46s">Нарантуул Өргөтгөлийн 25, 26-р агуулахын Европ барааг бөөний үнээр онлайнаар захиалж, QPay-ээр төлөөд, Улаанбаатар болон орон нутагт хүргүүлээрэй.</p>
   <div class="cta ld" style="animation-delay:.58s">${user?`<a class="btn y" href="#catalog" data-jump>Захиалга өгөх ${I.arrow}</a>${sample?`<button class="btn o" type="button" data-reorder="${sample.id}">Өмнөх захиалгаа давтах</button>`:''}`:`<button class="btn y" type="button" data-login>Харилцагчаар нэвтрэх ${I.arrow}</button><a class="btn o" href="#catalog" data-jump>Каталог үзэх</a>`}</div>
   <div class="qrow ld" style="animation-delay:.7s">${ext(C.map,`<span class="ic">${I.pin}</span>Байршил харах`,'qbtn')}${ext(C.chat,`<span class="ic">${I.chat}</span>Чатаар бичих`,'qbtn')}<a class="qbtn" href="tel:${C.phone}"><span class="ic">${I.phone}</span>${C.phoneLbl}</a>${ext(C.fb,`<span class="ic">${I.fb}</span>Facebook`,'qbtn')}</div>
  </div></div>
  <div class="slip ld" style="animation-delay:.9s" aria-hidden="true"><h4><span>${sample?'Таны сүүлийн захиалга':'Жишээ захиалга'}</span><span>${sample?esc(sample.id):'EV-2611-0050'}</span></h4>
   ${lines.map(l=>`<div class="sl"><img src="${im(l.p)}" alt=""><div><b>${esc(l.p.brand?l.p.brand+' ':'')}${esc(l.p.name)}</b><small>${l.q} хайрцаг · ${esc(specTxt(l.p))}</small></div><span class="num">${fmt(boxPrice(l.p)*l.q)}</span></div>`).join('')}
   <div class="tot"><span>Нийт</span><span class="num">${fmt(tot)}</span></div><span class="stamp">QPAY · ТӨЛСӨН</span></div>
 </section>
 <div class="dock"><div class="wrap"><div class="in rv">
  <div class="it"><span class="ic">${I.medal}</span><span><b>Чанартай Европ бараа</b><small>Шалгасан нийлүүлэгчид</small></span></div>
  <div class="it"><span class="ic">${I.pct}</span><span><b>Бөөний үнэ</b><small>Хайрцгаар захиална</small></span></div>
  <div class="it"><span class="ic">${I.truck}</span><span><b>Тогтмол нийлүүлэлт</b><small>Шинэ бараа тасралтгүй</small></span></div>
  <div class="it"><span class="ic">${I.pin}</span><span><b>УБ болон орон нутагт</b><small>Хүргэлт, унаанд тавина</small></span></div>
  <div class="eu">${euStars()}<span><i>European quality</i>for your store</span></div>
 </div></div></div>
 <div class="marq" aria-hidden="true"><div class="tr">${mq}</div></div>
 <section class="sec"><div class="wrap">
  <div class="sh rv"><div><span class="kick">Агуулахад байгаа</span><h2>Ангиллаар сонгох</h2></div><button class="link" type="button" data-jump>Бүх каталог →</button></div>
  <div class="bento">${bento.map(c=>`<button class="bt rv" type="button" data-cat="${c.id}" data-jumpcat><img loading="lazy" src="${c.img}" alt=""><span class="tx"><span><b>${esc(c.name)}</b><small>${c.n} төрлийн бараа</small></span><span class="ar">${I.arrow}</span></span></button>`).join('')}</div>
 </div></section>
 ${sale.length?`<section class="sec sale"><div class="wrap">
  <div class="sh rv"><div><span class="kick">Супер хямдрал</span><h2>Love Day дээд зэрэглэлийн цуврал</h2><p>8,500₮ байсан жигнэмэг одоо 7,900₮. Хайрцагтаа 12 ширхэг.</p></div><button class="btn y sm" type="button" data-cat="sale" data-jumpcat>Хямдралтай бүх бараа</button></div>
  <div class="srow">${sale.map(p=>`<article class="sc rv"><button class="ph" type="button" data-open="${p.id}"><img loading="lazy" src="${im(p)}" alt="${esc(p.name)}"></button><div class="bd"><h3>${esc(p.name)}</h3><div class="pr">${user?`<b>${fmt(p.price)}</b><s>${fmt(p.old)}</s>`:`<b>−${Math.round((1-p.price/p.old)*100)}%</b><span style="font-family:var(--m);font-size:13px;color:var(--mute)">${esc(specTxt(p))}</span>`}</div></div></article>`).join('')}</div>
 </div></section>`:''}
 <section id="catalog" style="padding-top:72px">
  <div class="wrap"><div class="sh"><div><span class="kick">Каталог</span><h2>${user?'Хайрцгаар захиалаарай':'Бөөний үнэ зөвхөн харилцагчдад'}</h2><p>${user?'Үнэ нэг ширхгээр, захиалга хайрцгаар. «+» дарахад 1 хайрцаг нэмэгдэнэ.':'Дэлгүүрээ бүртгүүлж нэвтэрсний дараа бөөний үнэ харагдаж, захиалга өгнө.'}</p></div></div></div>
  <div class="ctabs"><div class="wrap" id="ctabs"></div></div>
  <div class="wrap"><div class="bar"><span class="found" id="found"></span><label class="sr" for="sort">Эрэмбэ</label><select id="sort"><option value="pop">Ангиллаар</option><option value="low">Хайрцгийн үнэ ↑</option><option value="high">Хайрцгийн үнэ ↓</option><option value="az">Нэрээр А–Я</option></select><div class="seg" id="seg"><button type="button" data-view="grid">Карт</button><button type="button" data-view="list">Жагсаалт</button></div></div>
  <div id="catbody"></div></div>
 </section>
 <section class="sec"><div class="wrap why">
  <div class="wimg rv"><img loading="lazy" src="img/why.webp" alt="Европ бараа: жигнэмэг, шоколад, чанамал, жимс"><span class="chalk">Сайн бүтээгдэхүүн,<br>сайн амтыг<br>сонгоорой ♡</span><span class="wtag">Сайн хүнс — сайхан амьдрал</span></div>
  <div class="rv"><span class="kick">Зах дээрх олон лангуунаас</span><h2>Яагаад манайхыг сонгох ёстой вэ?</h2><p class="sub">Хүнсний худалдаанд үнэ чухал. Харин чанар, найдвартай байдал бүр ч чухал.</p>
   <ul class="wl">
    <li><span class="ic">${I.leaf}</span><span><b>Европ чанар</b><p>Голдуу Европын томоохон сүлжээ дэлгүүрүүдийн чанартай бараа.</p></span></li>
    <li><span class="ic">${I.tag}</span><span><b>Хямд, шударга үнэ</b><p>Чанартай барааг боломжийн үнээр санал болгож, таны төсөвт дэмжлэг үзүүлнэ.</p></span></li>
    <li><span class="ic">${I.shield}</span><span><b>Шалгасан, найдвартай</b><p>Бараа бүрийн чанарыг анхааралтай сонгож, итгэлтэйгээр нийлүүлдэг.</p></span></li>
    <li><span class="ic">${I.truck}</span><span><b>Тогтмол нийлүүлэлт</b><p>Шинэ бараа тасралтгүй ирдэг тул таны дэлгүүрт бүтээгдэхүүн үргэлж байна.</p></span></li>
    <li><span class="ic">${I.basket}</span><span><b>Өргөн сонголт</b><p>Өдөр тутмын хэрэглээнээс эхлээд онцгой амттан хүртэл.</p></span></li>
    <li><span class="ic">${I.heart}</span><span><b>Харилцагчдаа чухалчилдаг</b><p>Таны сэтгэл ханамж бидний хамгийн том урам зориг.</p></span></li>
   </ul>
   <p style="margin:30px 0 0;font-weight:700;font-size:18px">Тиймээс… манай лангууг сонгоорой!</p>
  </div>
 </div></section>
 <section class="sec" style="padding-top:0"><div class="wrap"><div class="band rv"><img loading="lazy" src="img/warehouse.webp" alt="Агуулахаас хүргэлтэд ачиж буй нь">
  <div class="in"><span class="kick" style="color:var(--sun)">Хүргэлт</span><h2>Улаанбаатар болон орон нутагт хүргэнэ</h2><p>Монгол орны хаана ч байрлах дэлгүүрүүдтэй хамтран ажиллана. Орон нутаг руу унаанд тавьж өгнө.</p>
   <ol class="how"><li><b>Нэвтрэх</b>Дэлгүүрээ бүртгүүлнэ</li><li><b>Сагслах</b>Хайрцгаар сонгоно</li><li><b>Төлөх</b>QPay, банкны апп</li><li><b>Хүлээн авах</b>Сонгосон өдөр, цагт</li></ol>
   <div class="cta">${ext(C.chat,`${I.chat} Бөөний үнийн жагсаалт авах`,'btn y')}<a class="btn o" href="tel:${C.phone}">${I.phone} ${C.phoneLbl}</a></div></div>
 </div></div></section>
 <section class="sec" id="contact" style="padding-top:0"><div class="wrap">
  <div class="sh rv"><div><span class="kick">Холбоо барих</span><h2>Бидэнтэй холбогдох</h2><p>${C.addr}. Бөөний үнийн жагсаалт болон дэлгэрэнгүй мэдээллийг чатаар аваарай.</p></div></div>
  <div class="cgrid">
   ${ext(C.map,`<span class="ic">${I.pin}</span><b>Байршил харах</b><small>Агуулах руу хэрхэн очих видео</small><span class="go">Нээх →</span>`,'cc rv')}
   ${ext(C.chat,`<span class="ic">${I.chat}</span><b>Чатаар бичих</b><small>Messenger-ээр шууд хариулна</small><span class="go">Бичих →</span>`,'cc rv')}
   <a class="cc rv" href="tel:${C.phone}"><span class="ic">${I.phone}</span><b>${C.phoneLbl}</b><small>Захиалга, лавлах утас</small><span class="go">Залгах →</span></a>
   ${ext(C.fb,`<span class="ic">${I.fb}</span><b>Facebook хуудас</b><small>Шинэ бараа, хямдралын мэдээ</small><span class="go">Зочлох →</span>`,'cc rv')}
  </div>
 </div></section>`+footer();
}
function footer(){return `<footer class="foot"><div class="wrap"><div class="big">ЕВРОП <i>БАРАА</i></div>
 <div class="cols"><div><h5>Агуулах</h5>Нарантуул, Өргөтгөл<br>25, 26-р агуулах<br>${ext(C.map,'Байршил харах →')}</div><div><h5>Захиалга, лавлах</h5><a href="tel:${C.phone}">${C.phoneLbl}</a><br>${ext(C.chat,'Messenger чат')}<br>${ext(C.fb,'Facebook хуудас')}</div><div><h5>Каталог</h5>${CATS.slice(0,4).map(c=>`<a href="#catalog" data-cat="${c.id}" data-jumpcat>${esc(c.name)}</a>`).join('<br>')}</div><div><h5>Харилцагчдад</h5><a href="#/orders">Миний захиалгууд</a><br><a href="#/admin">Админ</a></div></div>
 <div class="by"><span>© ${today.getFullYear()} Европ Бараа · Бөөний худалдаа</span><span>Демо хувилбар · Nomad Web Studio бэлтгэв</span></div></div></footer>`}

function checkout(){
 if(!user)return `<div class="page"><div class="wrap"><div class="empty"><b>Эхлээд нэвтэрнэ үү</b><button class="btn n" type="button" data-login style="margin-top:12px">Нэвтрэх</button></div></div></div>`;
 const f=store.get('co',{method:'delivery',pay:'qpay',day:0,time:'10:00–13:00'});
 const t=totals(f.method);
 if(!t.lines.length)return `<div class="page"><div class="wrap"><div class="empty"><b>Захиалгын хуудас хоосон</b>Каталогоос бараагаа хайрцгаар нэмнэ үү.<br><a class="btn n" href="#/" style="margin-top:16px">Каталог руу</a></div></div></div>`;
 const days=[1,2,3].map(n=>{const d=new Date(today.getTime()+n*864e5);return {lbl:n===1?'Маргааш':['Ням','Даваа','Мягмар','Лхагва','Пүрэв','Баасан','Бямба'][d.getDay()],d:`${d.getMonth()+1}/${d.getDate()}`}});
 const short=t.sub<RULE.min;
 return `<div class="page"><div class="wrap"><a class="back" href="#/">← Каталог руу буцах</a>
 <div class="co"><form id="coform" novalidate>
  <div class="panel"><h3><span class="n">1</span>Хүлээн авах</h3>
   <div class="opts" style="margin-bottom:16px">
    <label class="opt"><input type="radio" name="method" value="delivery" ${f.method==='delivery'?'checked':''}><span><b>Дэлгүүрт хүргүүлэх</b><small>${fmt(RULE.free)}-с дээш захиалгад хүргэлт үнэгүй, бусад тохиолдолд ${fmt(RULE.fee)}</small></span></label>
    <label class="opt"><input type="radio" name="method" value="pickup" ${f.method==='pickup'?'checked':''}><span><b>Агуулахаас очиж авах</b><small>${C.addr}</small></span></label>
   </div>
   <div class="g2"><div class="fld"><label for="f_store">Дэлгүүрийн нэр</label><input id="f_store" name="store" value="${esc(f.store||user.store)}" required></div><div class="fld"><label for="f_phone">Хүлээн авах хүний утас</label><input id="f_phone" name="phone" inputmode="tel" value="${esc(f.phone||user.phone)}" required></div></div>
   <div id="addr" ${f.method==='pickup'?'hidden':''}>
    <div class="g2"><div class="fld"><label for="f_dist">Дүүрэг</label><select id="f_dist" name="district">${DISTRICTS.map(d=>`<option ${d===(f.district||user.district)?'selected':''}>${d}</option>`).join('')}</select></div><div class="fld"><label for="f_kh">Хороо / сум</label><input id="f_kh" name="khoroo" value="${esc(f.khoroo??user.khoroo??'')}"></div></div>
    <div class="fld"><label for="f_addr">Дэлгэрэнгүй хаяг</label><input id="f_addr" name="addr" value="${esc(f.addr??user.addr??'')}" placeholder="Гудамж, байр, орц, тоот"></div>
   </div>
   <div class="fld"><label>${f.method==='pickup'?'Очиж авах өдөр':'Хүргүүлэх өдөр'}</label><div class="days">${days.map((d,i)=>`<label><input type="radio" name="day" value="${i}" ${+f.day===i?'checked':''}>${d.lbl}<small>${d.d}</small></label>`).join('')}</div></div>
   <div class="fld"><label for="f_time">Цаг</label><select id="f_time" name="time">${['10:00–13:00','13:00–17:00','17:00–20:00'].map(x=>`<option ${x===f.time?'selected':''}>${x}</option>`).join('')}</select></div>
   <div class="fld"><label for="f_note">Нэмэлт тайлбар</label><textarea id="f_note" name="note" placeholder="Жишээ нь: арын хаалгаар оруулах">${esc(f.note||'')}</textarea></div>
  </div>
  <div class="panel"><h3><span class="n">2</span>Төлбөр</h3><div class="opts">
   <label class="opt"><input type="radio" name="pay" value="qpay" ${f.pay==='qpay'?'checked':''}><span><b>QPay · банкны апп</b><small>QR уншуулах эсвэл банкны аппаар шууд төлнө. Төлбөр автоматаар баталгаажна.</small></span></label>
   <label class="opt"><input type="radio" name="pay" value="bank" ${f.pay==='bank'?'checked':''}><span><b>Дансаар шилжүүлэх</b><small>Гүйлгээний утгад захиалгын дугаараа бичнэ. Нягтлан шалгаж баталгаажуулна.</small></span></label>
   ${user.credit?`<label class="opt"><input type="radio" name="pay" value="credit" ${f.pay==='credit'?'checked':''}><span><b>Гэрээт харилцагч — дараа төлөх</b><small>Гэрээний дагуу 14 хоногийн дотор тооцоо хийнэ.</small></span></label>`:''}
  </div></div>
 </form>
 <aside class="side2"><div class="panel"><h3>Захиалгын хуудас <small class="mono" style="margin-left:auto;color:var(--mute);font-size:12px">${t.boxes} хайрцаг</small></h3>
  <div class="mini">${t.lines.map(l=>`<div class="ci"><img src="${im(l.p)}" alt=""><div><b>${esc(l.p.name)}</b><small>${l.q} × ${esc(specTxt(l.p))}</small></div><span class="num" style="font-family:var(--m);font-weight:700;font-size:14px">${fmt(boxPrice(l.p)*l.q)}</span></div>`).join('')}</div>
  <div class="sum" style="margin-top:14px"><div><span>Барааны дүн</span><span class="num">${fmt(t.sub)}</span></div><div><span>Хүргэлт</span><span class="num">${t.fee?fmt(t.fee):'Үнэгүй'}</span></div><div class="t"><span>Нийт</span><span class="num">${fmt(t.total)}</span></div></div>
  ${short?`<p class="hint warn">Хамгийн бага захиалга ${fmt(RULE.min)}. Дахиад ${fmt(RULE.min-t.sub)}-ийн бараа нэмнэ үү.</p>`:''}
  <button class="btn y" type="submit" form="coform" style="width:100%;margin-top:14px" ${short?'disabled':''}>Захиалга илгээх · ${fmt(t.total)}</button>
  <p class="hint" style="margin-top:10px">Үнэ, хүргэлтийн нөхцөл, хамгийн бага захиалгын дүн нь жишээ — танай бодлогоор тохируулна.</p>
 </div></aside></div></div></div>`;
}
function qrSvg(seed){
 const N=29;let h=7;for(const c of seed)h=(h*31+c.charCodeAt(0))>>>0;const rnd=()=>{h^=h<<13;h>>>=0;h^=h>>17;h^=h<<5;h>>>=0;return h/4294967296};
 let r='';const fin=(x,y)=>{r+=`<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x+1}" y="${y+1}" width="5" height="5" fill="#fff"/><rect x="${x+2}" y="${y+2}" width="3" height="3"/>`};
 const inF=(x,y)=>(x<8&&y<8)||(x>N-9&&y<8)||(x<8&&y>N-9);
 for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(!inF(x,y)&&rnd()>.52)r+=`<rect x="${x}" y="${y}" width="1" height="1"/>`;
 fin(0,0);fin(N-7,0);fin(0,N-7);
 return `<svg class="qr" viewBox="-1 -1 ${N+2} ${N+2}" shape-rendering="crispEdges" role="img" aria-label="QPay QR (демо)">${r}</svg>`;
}
function pay(id){
 const o=orders.find(x=>x.id===id);if(!o)return notFound();
 return `<div class="page"><div class="wrap" style="max-width:860px"><div class="panel">
  <h3 style="justify-content:space-between">QPay-ээр төлөх <span class="pill new">${esc(o.id)}</span></h3>
  <div class="qp">${qrSvg(o.id)}<div><p style="margin:0 0 4px;color:var(--mute)">Төлөх дүн</p><p class="num" style="margin:0 0 16px;font-size:34px;font-weight:700">${fmt(o.total)}</p>
   <p style="margin:0 0 10px;font-weight:700">Утсан дээрээ бол банкны аппаа сонгоно уу</p>
   <div class="banks">${BANKS.map(b=>`<button type="button" data-bank>${b}</button>`).join('')}</div>
   <button class="btn n" type="button" data-check="${o.id}" style="width:100%;margin-top:16px">Төлбөр шалгах</button>
   <p class="hint" style="margin-top:8px">Демо: QR код жинхэнэ биш. «Төлбөр шалгах» дарахад төлөгдсөн мэт харагдана. Бодит сайтад QPay мэдэгдэл ирэхэд автоматаар баталгаажна.</p></div></div>
 </div></div></div>`;
}
function done(id){
 const o=orders.find(x=>x.id===id);if(!o)return notFound();
 const idx=o.status==='wait'?0:Math.max(0,FLOW.indexOf(o.status));
 return `<div class="page"><div class="wrap"><div class="done panel" style="padding:40px 28px">
  <div class="ok">✓</div><h2>Захиалга хүлээн авлаа</h2>
  <p style="color:var(--mute);margin:10px 0 0">Захиалгын дугаар <b class="mono" style="color:var(--ink)">${esc(o.id)}</b> · ${fmt(o.total)}${o.status==='wait'?'<br>Гүйлгээний утгад захиалгын дугаараа бичээрэй. Төлбөр орсны дараа бэлтгэж эхэлнэ.':''}</p>
  <ol class="tl">${['Хүлээн авсан','Төлбөр','Бэлтгэж байна','Хүргэлтэд','Хүргэгдсэн'].map((s,i)=>`<li class="${i<=idx?'on':''}">${s}</li>`).join('')}</ol>
  <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:32px"><a class="btn n" href="#/orders">Миний захиалгууд</a><a class="btn l" href="#/">Каталог руу</a></div>
  <p class="hint" style="margin-top:18px">Бодит хувилбарт захиалгын төлөв өөрчлөгдөх бүрт дэлгүүрт SMS очно.</p>
 </div></div></div>`;
}
function myOrders(){
 if(!user)return checkout();
 const mine=orders.filter(o=>o.store===user.store);
 return `<div class="page"><div class="wrap" style="max-width:900px"><a class="back" href="#/">← Каталог руу</a>
  <div class="sh"><div><h2>${esc(user.store)}</h2><p>${esc(user.district)} · ${esc(user.phone)}</p></div><button class="btn l sm" type="button" data-logout>Гарах</button></div>
  <div class="panel" style="padding:0">${mine.length?mine.map(o=>`<div class="ord"><div><b class="mono">${esc(o.id)}</b><small>${new Date(o.at).toLocaleDateString('en-CA')} · ${o.items.reduce((s,i)=>s+i.q,0)} хайрцаг · ${fmt(o.total)}</small></div><span class="pill ${o.status}">${STATUS[o.status]}</span><button class="btn l sm" type="button" data-reorder="${o.id}">Дахин захиалах</button></div>`).join(''):`<div class="empty"><b>Захиалга алга</b>Анхны захиалгаа өгөөрэй.</div>`}</div>
 </div></div>`;
}
function notFound(){return `<div class="page"><div class="wrap"><div class="empty"><b>Хуудас олдсонгүй</b><a class="btn n" href="#/" style="margin-top:12px">Нүүр хуудас</a></div></div></div>`}

// ---------- cart drawer ----------
function renderCart(){
 const t=totals('delivery');const left=Math.max(0,RULE.free-t.sub);
 $('#cart').innerHTML=`<div class="dh"><div><h3>Захиалгын хуудас</h3><small>${t.boxes} хайрцаг · ${t.lines.length} төрөл</small></div><button class="x" type="button" data-close aria-label="Хаах">×</button></div>
 <div class="db">${t.lines.length?t.lines.map(l=>`<div class="ci"><img src="${im(l.p)}" alt=""><div><b>${esc(l.p.brand?l.p.brand+' · ':'')}${esc(l.p.name)}</b><small>${esc(specTxt(l.p))} · ${fmt(l.p.price)}/${l.p.unit}</small>
  <div class="row"><div class="step"><button type="button" data-dec="${l.p.id}" aria-label="Хасах">−</button><input type="number" inputmode="numeric" value="${l.q}" data-qty="${l.p.id}" aria-label="Хайрцаг"><button type="button" data-inc="${l.p.id}" aria-label="Нэмэх">+</button></div><span class="num" style="font-family:var(--m)">${fmt(boxPrice(l.p)*l.q)}</span></div>
  <small>${l.q} хайрцаг = ${l.q*l.p.pack} ${l.p.unit}</small></div></div>`).join(''):`<div class="empty"><b>Хоосон байна</b>Каталогоос бараагаа хайрцгаар нэмээрэй.</div>`}</div>
 ${t.lines.length?`<div class="df"><div class="sum"><div><span>Барааны дүн</span><span class="num">${fmt(t.sub)}</span></div></div>
  <div class="prog"><i style="width:${Math.min(100,t.sub/RULE.free*100)}%"></i></div>
  <p class="hint ${left?'':'ok'}" style="margin:0 0 12px">${left?`Үнэгүй хүргэлт хүртэл ${fmt(left)} дутуу байна`:'Хүргэлт үнэгүй ✓'}</p>
  <a class="btn y" href="#/checkout" style="width:100%" data-close>Захиалга баталгаажуулах</a></div>`:''}`;
}
function openCart(){renderCart();$('#cart').classList.add('on');$('#scrim').classList.add('on')}
function closeAll(){$('#cart').classList.remove('on');$('#modal').classList.remove('on');$('#scrim').classList.remove('on');const d=$('.det.on');d&&d.classList.remove('on')}

// ---------- modals ----------
function modal(html,cls,focus){const b=$('#mbox');b.className='mbox '+(cls||'');b.innerHTML=html;$('#modal').classList.add('on');$('#scrim').classList.add('on');if(focus)setTimeout(()=>{const f=b.querySelector('input:not([type=hidden]):not([type=file])');f&&f.focus()},350)}
function openProduct(id){
 const p=byId(id);if(!p)return;
 modal(`<div class="pd"><div class="pi"><img src="${im(p)}" alt="${esc(p.name)}"></div><div class="pt"><button class="x" type="button" data-close aria-label="Хаах">×</button>
  <div class="meta"><span>${esc(p.brand||'')} · ${esc(catOf(p.cat).name)}</span></div>
  <h3>${esc(p.name)}</h3><p style="margin:0;color:var(--mute)">${esc(p.desc||'')}</p>
  <dl class="kv"><dt>Савлагаа</dt><dd>${esc(p.spec)}</dd><dt>Хайрцагт</dt><dd>${p.pack} ${p.unit}</dd>${user?`<dt>Нэгжийн үнэ</dt><dd>${fmt(p.price)}${p.old?` <s style="color:var(--mute);font-weight:500">${fmt(p.old)}</s>`:''}</dd><dt>Хайрцгийн үнэ</dt><dd>${fmt(boxPrice(p))}</dd>`:''}<dt>Үлдэгдэл</dt><dd class="stk ${p.stock<15?'low':'ok'}">${p.stock} хайрцаг</dd><dt>Код</dt><dd>EV-${esc(p.id.replace(/^\D+/,''))}</dd></dl>
  ${p.ex&&user?'<p class="hint warn" style="margin:0">Энэ барааны үнэ FB постод байгаагүй тул жишээ үнэ тавив.</p>':''}
  <div style="margin-top:auto;display:flex;align-items:center;gap:14px"><div class="qa" data-ctl="${p.id}">${qa(p)}</div><span class="math" data-math="${p.id}">${user?mathTxt(p):'Нэвтэрч захиална'}</span></div></div></div>`);
}
function openLogin(tab){
 tab=tab||'in';
 modal(`<div class="login"><button class="x" type="button" data-close aria-label="Хаах" style="float:right">×</button><h3>${tab==='in'?'Харилцагч нэвтрэх':'Харилцагч болох'}</h3><p>${tab==='in'?'Бүртгэлтэй дэлгүүрүүд бөөний үнэ харж, захиалга өгнө.':'Дэлгүүрээ бүртгүүлэхэд админ шалгаад баталгаажуулна.'}</p>
 <div class="tabs"><button type="button" class="${tab==='in'?'on':''}" data-ltab="in">Нэвтрэх</button><button type="button" class="${tab==='up'?'on':''}" data-ltab="up">Бүртгүүлэх</button></div>
 ${tab==='in'?`<div class="demo-hint">Демо: утас 9911-2233 · ПИН 1234</div><form id="lform"><div class="fld"><label for="l_ph">Утасны дугаар</label><input id="l_ph" inputmode="tel" autocomplete="tel" value="99112233" maxlength="8"></div><div class="fld"><label for="l_pin">ПИН код</label><input id="l_pin" type="password" inputmode="numeric" autocomplete="current-password" value="1234" maxlength="4"></div><button class="btn n" type="submit" style="width:100%">Нэвтрэх</button></form><p class="hint" style="margin-top:12px">Бодит хувилбарт утсанд SMS код ирж баталгаажуулна (сонголтоор).</p>`:
 `<form id="rform"><div class="fld"><label for="r_st">Дэлгүүрийн нэр</label><input id="r_st" required></div><div class="g2"><div class="fld"><label for="r_ph">Утас</label><input id="r_ph" inputmode="tel" required maxlength="8"></div><div class="fld"><label for="r_rd">Регистр / РД</label><input id="r_rd"></div></div><div class="fld"><label for="r_di">Дүүрэг</label><select id="r_di">${DISTRICTS.map(d=>`<option>${d}</option>`).join('')}</select></div><button class="btn n" type="submit" style="width:100%">Хүсэлт илгээх</button></form>`}</div>`,'login',true);
}

// ---------- admin ----------
function adminView(sub){
 if(!admin)return `<div class="page"><div class="wrap" style="max-width:440px"><div class="panel"><h3>Админ нэвтрэх</h3><div class="demo-hint">Демо: шууд нэвтэрнэ</div><div class="fld"><label for="a_u">Нэвтрэх нэр</label><input id="a_u" value="admin"></div><div class="fld"><label for="a_p">Нууц үг</label><input id="a_p" type="password" value="demo1234"></div><button class="btn n" type="button" data-admin-in style="width:100%">Нэвтрэх</button><a class="back" href="#/" style="margin:14px 0 0">← Дэлгүүр рүү</a></div></div></div>`;
 const waitC=customers.filter(c=>c.status==='wait').length,newO=orders.filter(o=>o.status==='new'||o.status==='wait').length;
 const tabs=[['','Хянах самбар'],['orders','Захиалга',newO],['products','Бараа'],['customers','Харилцагч',waitC],['delivery','Хүргэлт']];
 const body=sub===''?aDash():sub==='orders'?aOrders():sub==='products'?aProducts():sub==='customers'?aCustomers():aDelivery();
 return `<div class="adm"><aside class="anav"><a class="logo" href="#/"><span class="mk">${I.cartMk}</span><span><b>ЕВРОП БАРАА</b><span>Админ</span></span></a>${tabs.map(([k,n,c])=>`<button type="button" class="${sub===k?'on':''}" data-anav="${k}">${n}${c?`<small>${c}</small>`:''}</button>`).join('')}<div class="sp">Демо өгөгдөл · <button type="button" data-reset style="all:unset;cursor:pointer;text-decoration:underline">Эхлэлд оруулах</button></div></aside>
  <div><div class="amob">${tabs.map(([k,n])=>`<button type="button" class="${sub===k?'on':''}" data-anav="${k}">${n}</button>`).join('')}<button type="button" data-home>Дэлгүүр</button></div><div class="amain">${body}</div></div></div><aside class="det" id="det"></aside>`;
}
const isToday=o=>dstr(new Date(o.at))===dstr(today);
function oRow(o,c){const when=isToday(o)?hm(o.at):(new Date(o.at).getMonth()+1)+'/'+new Date(o.at).getDate()+' '+hm(o.at);return `<tr class="click" data-order="${o.id}"><td class="mono num">${o.id}</td><td class="nw">${esc(o.store)}</td>${c?'':`<td class="nw">${esc(o.district.replace(' (унаанд тавина)',''))}</td>`}<td class="mono">${when}</td><td class="r mono num">${fmt(o.total)}</td>${c?'':`<td>${o.pay==='qpay'?'QPay':o.pay==='bank'?'Данс':'Зээл'}</td>`}<td class="nw"><span class="pill ${o.status}">${STATUS[o.status]}</span></td></tr>`}
const oHead='<thead><tr><th>№</th><th>Дэлгүүр</th><th>Дүүрэг</th><th>Цаг</th><th class="r">Дүн</th><th>Төлбөр</th><th>Төлөв</th></tr></thead>';
function aDash(){
 const td=orders.filter(isToday),rev=td.filter(o=>o.status!=='wait'&&o.status!=='new').reduce((s,o)=>s+o.total,0);
 const low=P.filter(p=>p.stock<15).sort((a,b)=>a.stock-b.stock);
 return `<div class="ahd"><div><h1>Хянах самбар</h1><p>${mnDate(today)} · жишээ өгөгдөл</p></div><a class="abtn" href="#/">Дэлгүүрийг харах ↗</a></div>
 <div class="kpis"><div class="kpi"><small>Өнөөдрийн захиалга</small><b>${td.length}</b><span>${td.filter(o=>o.status==='new').length} шинэ</span></div><div class="kpi"><small>Төлөгдсөн борлуулалт</small><b>${fmt(rev)}</b><span>өнөөдөр</span></div><div class="kpi"><small>Бэлтгэх захиалга</small><b>${orders.filter(o=>o.status==='paid'||o.status==='prep').length}</b><span>агуулахад</span></div><div class="kpi"><small>Харилцагчийн хүсэлт</small><b>${customers.filter(c=>c.status==='wait').length}</b><span>батлах шаардлагатай</span></div></div>
 <div class="acols"><div class="acard"><h3>Сүүлийн захиалгууд <button class="abtn sm" type="button" data-anav="orders">Бүгд</button></h3><div class="tw"><table class="t"><thead><tr><th>№</th><th>Дэлгүүр</th><th>Цаг</th><th class="r">Дүн</th><th>Төлөв</th></tr></thead><tbody>${orders.slice(0,7).map(o=>oRow(o,true)).join('')}</tbody></table></div></div>
 <div class="acard"><h3>Үлдэгдэл багатай <button class="abtn sm" type="button" data-anav="products">Бараа</button></h3><div class="tw"><table class="t"><tbody>${low.slice(0,8).map(p=>`<tr><td><img src="${im(p)}" alt=""></td><td>${esc(p.name)}<br><small class="mono" style="color:#6B7280">${esc(p.spec)}</small></td><td class="r mono num" style="color:${p.stock<10?'var(--sale)':'var(--warn)'}">${p.stock}</td></tr>`).join('')}</tbody></table></div></div></div>`;
}
let oFilter='all';
function aOrders(){
 const list=orders.filter(o=>oFilter==='all'||o.status===oFilter);
 return `<div class="ahd"><div><h1>Захиалга</h1><p>Мөр дээр дарж дэлгэрэнгүй харж, төлөв шилжүүлнэ.</p></div></div>
 <div class="afl" style="margin-bottom:12px">${[['all','Бүгд'],...Object.entries(STATUS)].map(([k,n])=>`<button type="button" class="${oFilter===k?'on':''}" data-ofl="${k}">${n} <span class="mono">${k==='all'?orders.length:orders.filter(o=>o.status===k).length}</span></button>`).join('')}</div>
 <div class="acard"><div class="tw"><table class="t">${oHead}<tbody>${list.map(o=>oRow(o)).join('')||'<tr><td colspan="7" style="text-align:center;color:#6B7280;padding:30px">Захиалга алга</td></tr>'}</tbody></table></div></div>`;
}
function orderDet(id){
 const o=orders.find(x=>x.id===id);if(!o)return;
 const next={new:['paid','Төлбөр баталгаажуулах'],wait:['paid','Төлбөр орсныг батлах'],paid:['prep','Бэлтгэж эхлэх'],prep:['ship','Хүргэлтэд гаргах'],ship:['done','Хүргэгдсэн гэж тэмдэглэх']}[o.status];
 $('#det').innerHTML=`<div class="dh"><div><h3 class="mono">${o.id}</h3><small>${new Date(o.at).toLocaleDateString('en-CA')} ${hm(o.at)}</small></div><button class="x" type="button" data-close aria-label="Хаах">×</button></div>
 <div class="db"><p style="margin:12px 0"><span class="pill ${o.status}">${STATUS[o.status]}</span></p>
  <dl class="kv" style="margin-bottom:16px"><dt>Дэлгүүр</dt><dd style="font-family:var(--f)">${esc(o.store)}</dd><dt>Хаяг</dt><dd style="font-family:var(--f);font-weight:600">${esc(o.method==='pickup'?'Агуулахаас очиж авна':o.district+(o.addr?', '+o.addr:''))}</dd>${o.when?`<dt>Хүргэх</dt><dd style="font-family:var(--f);font-weight:600">${esc(o.when)}</dd>`:''}<dt>Төлбөр</dt><dd>${o.pay==='qpay'?'QPay':o.pay==='bank'?'Дансаар':'Гэрээт / зээл'}</dd>${o.note?`<dt>Тайлбар</dt><dd style="font-family:var(--f);font-weight:500">${esc(o.note)}</dd>`:''}</dl>
  <table class="t"><thead><tr><th>Бараа</th><th class="r">Хайрцаг</th><th class="r">Дүн</th></tr></thead><tbody>${o.items.map(i=>{const p=byId(i.id);return p?`<tr><td>${esc(p.name)}<br><small class="mono" style="color:#6B7280">${esc(specTxt(p))}</small></td><td class="r mono">${i.q}</td><td class="r mono num">${fmt(boxPrice(p)*i.q)}</td></tr>`:`<tr><td colspan="3" style="color:#6B7280">Устгагдсан бараа</td></tr>`}).join('')}</tbody></table>
  <div class="sum" style="margin-top:12px"><div><span>Барааны дүн</span><span class="mono">${fmt(o.sub)}</span></div><div><span>Хүргэлт</span><span class="mono">${o.fee?fmt(o.fee):'Үнэгүй'}</span></div><div class="t"><span>Нийт</span><span class="mono">${fmt(o.total)}</span></div></div>
 </div><div class="df" style="display:flex;gap:8px;flex-wrap:wrap">${next?`<button class="abtn g" type="button" data-adv="${o.id}" data-to="${next[0]}">${next[1]}</button>`:''}<button class="abtn" type="button" data-print="${o.id}">Падаан хэвлэх</button></div>`;
 $('#det').classList.add('on');$('#scrim').classList.add('on');
}
let pq='',pcat='all';
function aProducts(){
 const list=P.filter(p=>(pcat==='all'||p.cat===pcat)&&(!pq||(p.name+' '+p.brand).toLowerCase().includes(pq.toLowerCase())));
 return `<div class="ahd"><div><h1>Бараа <span class="mono" style="font-size:15px;color:#6B7280">${P.length}</span></h1><p>Нэмэх, засах, устгах. Үнэ, үлдэгдлийг мөрөн дээр нь шууд засна — дэлгүүрт тэр дор нь шинэчлэгдэнэ.</p></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="abtn" type="button" data-csv>CSV татах</button><button class="abtn" type="button" data-import>Excel-ээс оруулах</button><button class="abtn p" type="button" data-pedit="">${I.plus} Шинэ бараа</button></div></div>
 <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px"><input id="pq" type="search" value="${esc(pq)}" placeholder="Бараа хайх" style="height:38px;border:1px solid #D1D5DB;border-radius:8px;padding:0 12px;width:min(320px,100%)"><div class="afl">${[['all','Бүгд'],...CATS.map(c=>[c.id,c.name])].map(([k,n])=>`<button type="button" class="${pcat===k?'on':''}" data-pcat="${k}">${esc(n)}</button>`).join('')}</div></div>
 <div class="acard"><div class="tw"><table class="t"><thead><tr><th></th><th>Бараа</th><th>Ангилал</th><th>Савлагаа</th><th class="r">Нэгж үнэ ₮</th><th class="r">Үлдэгдэл</th><th>Харагдах</th><th class="r">Үйлдэл</th></tr></thead><tbody>${list.map(p=>`<tr><td><img src="${im(p)}" alt=""></td><td><b>${esc(p.name)}</b><br><small class="mono" style="color:#6B7280">${esc(p.brand||'—')}${p.old?` · <span style="color:var(--sale)">хямдрал</span>`:''}</small></td><td class="nw">${esc(catOf(p.cat).name)}</td><td class="mono">${esc(specTxt(p))}</td><td class="r"><input class="inl" type="number" value="${p.price}" data-pprice="${p.id}" aria-label="Үнэ"></td><td class="r"><input class="inl" type="number" value="${p.stock}" data-pstock="${p.id}" aria-label="Үлдэгдэл" style="width:76px"></td><td><button type="button" class="sw ${p.active?'on':''}" data-pact="${p.id}" aria-label="Дэлгүүрт харагдах"></button></td><td><div class="acts"><button class="abtn sm" type="button" data-pedit="${p.id}">${I.edit} Засах</button><button class="abtn sm d" type="button" data-pdel="${p.id}" aria-label="Устгах">${I.trash}</button></div></td></tr>`).join('')||'<tr><td colspan="8" style="text-align:center;color:#6B7280;padding:30px">Бараа олдсонгүй</td></tr>'}</tbody></table></div></div>`;
}
let editImg=null;
function productForm(id){
 const p=id?byId(id):{id:'',cat:CATS[0].id,brand:'',name:'',spec:'',pack:12,unit:'ш',price:'',old:'',stock:20,desc:'',active:true};
 editImg=null;
 modal(`<form class="pform" id="pform" data-id="${esc(p.id)}"><button class="x" type="button" data-close style="float:right" aria-label="Хаах">×</button><h3 style="margin:0 0 4px;font-size:22px">${id?'Бараа засах':'Шинэ бараа'}</h3><p class="hint" style="margin:0 0 18px">${id?'EV-'+esc(p.id.replace(/^\D+/,'')):'Зураг, нэр, үнэ, савлагаагаа оруулна уу.'}</p>
 <div class="grid2"><div><label class="upl" id="upl">${id?`<img src="${im(p)}" alt="">`:''}<span>Зураг сонгох<br><small style="font-weight:500">JPG, PNG · утаснаас ч болно</small></span><input type="file" accept="image/*" id="p_img" aria-label="Зураг">${id?'<span class="chg">Зураг солих</span>':''}</label>
  <label style="margin-top:14px;display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600"><input type="checkbox" id="p_act" ${p.active?'checked':''} style="width:18px;height:18px;accent-color:var(--navy)"> Дэлгүүрт харагдана</label></div>
 <div><div class="fld"><label for="p_nm">Барааны нэр</label><input id="p_nm" value="${esc(p.name)}" required></div>
  <div class="g2"><div class="fld"><label for="p_br">Брэнд</label><input id="p_br" value="${esc(p.brand)}"></div><div class="fld"><label for="p_ct">Ангилал</label><select id="p_ct">${CATS.map(c=>`<option value="${c.id}" ${c.id===p.cat?'selected':''}>${esc(c.name)}</option>`).join('')}</select></div></div>
  <div class="g3"><div class="fld"><label for="p_sp">Савлагаа</label><input id="p_sp" value="${esc(p.spec)}" placeholder="250г" required></div><div class="fld"><label for="p_pk">Хайрцагт</label><input id="p_pk" type="number" min="1" value="${p.pack}" required></div><div class="fld"><label for="p_un">Нэгж</label><select id="p_un">${UNITS.map(u=>`<option ${u===p.unit?'selected':''}>${u}</option>`).join('')}</select></div></div>
  <div class="g3"><div class="fld"><label for="p_pr">Нэгж үнэ ₮</label><input id="p_pr" type="number" min="0" value="${p.price}" required></div><div class="fld"><label for="p_old">Хуучин үнэ ₮</label><input id="p_old" type="number" min="0" value="${p.old||''}" placeholder="хямдрал бол"></div><div class="fld"><label for="p_st">Үлдэгдэл (хайрцаг)</label><input id="p_st" type="number" min="0" value="${p.stock}"></div></div>
  <div class="fld"><label for="p_ds">Тайлбар</label><textarea id="p_ds">${esc(p.desc||'')}</textarea></div>
  <div style="display:flex;gap:8px;justify-content:space-between;align-items:center;flex-wrap:wrap;margin-top:6px"><span class="hint" id="p_box">${p.price?`Хайрцгийн үнэ: ${fmt(p.price*p.pack)}`:''}</span><span style="display:flex;gap:8px">${id?`<button class="abtn d" type="button" data-pdel="${p.id}">${I.trash} Устгах</button>`:''}<button class="abtn p" type="submit">${id?'Хадгалах':'Нэмэх'}</button></span></div></div></div></form>`,'',!id);
}
function confirmDel(id){
 const p=byId(id);if(!p)return;
 modal(`<div class="confirm"><div class="ic">${I.trash}</div><h3>Барааг устгах уу?</h3><p>«${esc(p.name)}» каталогоос бүрмөсөн устна. Түр нуух бол «Харагдах» товчийг унтраана уу.</p><div class="row"><button class="abtn" type="button" data-close>Болих</button><button class="abtn d" type="button" data-pdelok="${p.id}" style="background:var(--sale);color:#fff;border-color:var(--sale)">Устгах</button></div></div>`);
}
function shrink(file){return new Promise((res,rej)=>{const r=new FileReader();r.onerror=rej;r.onload=()=>{const img=new Image();img.onerror=rej;img.onload=()=>{const M=700,s=Math.min(1,M/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.8))};img.src=r.result};r.readAsDataURL(file)})}
function aCustomers(){
 const stat=c=>{const os=orders.filter(o=>o.store===c.store);return [os.length,os.reduce((s,o)=>s+o.total,0)]};
 return `<div class="ahd"><div><h1>Харилцагч дэлгүүрүүд</h1><p>Шинэ дэлгүүр бүртгүүлэхэд энд хүсэлт ирнэ. Баталсны дараа нэвтэрч үнэ харна.</p></div></div>
 <div class="acard"><div class="tw"><table class="t"><thead><tr><th>Дэлгүүр</th><th>Утас</th><th>Дүүрэг</th><th>Нөхцөл</th><th class="r">Захиалга</th><th class="r">Нийт дүн</th><th>Төлөв</th></tr></thead><tbody>${customers.map((c,i)=>{const [n,s]=stat(c);return `<tr><td class="nw"><b>${esc(c.store)}</b></td><td class="mono">${esc(c.phone)}</td><td class="nw">${esc(c.district.replace(' (унаанд тавина)',''))}</td><td class="nw">${esc(c.tier)}</td><td class="r mono">${n}</td><td class="r mono num">${fmt(s)}</td><td>${c.status==='ok'?'<span class="pill done">Идэвхтэй</span>':`<button class="abtn g sm" type="button" data-approve="${i}">Батлах</button>`}</td></tr>`}).join('')}</tbody></table></div></div>`;
}
function aDelivery(){
 const act=orders.filter(o=>['paid','prep','ship'].includes(o.status)&&o.method!=='pickup');
 const groups={};act.forEach(o=>{(groups[o.district]=groups[o.district]||[]).push(o)});
 return `<div class="ahd"><div><h1>Хүргэлт</h1><p>Төлбөр орсон захиалгууд дүүргээр. Жолооч оноож, маршрутаа хэвлэнэ.</p></div></div>
 <div class="zone">${Object.entries(groups).map(([d,os])=>`<div class="acard"><h3>${esc(d.replace(' (унаанд тавина)',''))}<span class="mono" style="font-size:12px;color:#6B7280">${os.length} захиалга</span></h3><ul>${os.map(o=>`<li><span><b class="mono">${o.id}</b><br>${esc(o.store)}</span><span style="text-align:right"><span class="pill ${o.status}">${STATUS[o.status]}</span><br><select data-driver="${o.id}" style="margin-top:6px;height:32px;border:1px solid #D1D5DB;border-radius:6px"><option value="">Жолооч</option>${DRIVERS.map(n=>`<option ${o.driver===n?'selected':''}>${n}</option>`).join('')}</select></span></li>`).join('')}</ul></div>`).join('')||'<div class="acard" style="padding:30px;text-align:center;color:#6B7280">Хүргэх захиалга алга</div>'}</div>`;
}
function printSlip(id){
 const o=orders.find(x=>x.id===id);if(!o)return;
 $('#print').innerHTML=`<h2>Падаан ${o.id}</h2><p>${esc(o.store)} · ${esc(o.district)} · ${new Date(o.at).toLocaleDateString('en-CA')} ${hm(o.at)}</p><table><tr><th>#</th><th>Бараа</th><th>Савлагаа</th><th>Хайрцаг</th><th>Ширхэг</th><th>Дүн</th></tr>${o.items.map((i,n)=>{const p=byId(i.id);return p?`<tr><td>${n+1}</td><td>${esc(p.name)}</td><td>${esc(specTxt(p))}</td><td>${i.q}</td><td>${i.q*p.pack}</td><td>${fmt(boxPrice(p)*i.q)}</td></tr>`:''}).join('')}<tr><td colspan="5"><b>Нийт</b></td><td><b>${fmt(o.total)}</b></td></tr></table><p style="margin-top:40px">Хүлээлгэн өгсөн: ____________ &nbsp;&nbsp; Хүлээн авсан: ____________</p>`;
 window.print();
}

// ---------- router ----------
function route(){const h=location.hash.replace(/^#\/?/,'');const [a,b]=h.split('/');if(!a||a==='catalog')return {name:'home'};if(a==='admin')return {name:'admin',sub:b||''};return {name:a,arg:b}}
let lastRoute='';
function renderView(){
 const r=route(),v=$('#view');
 $('#top').style.display=$('#util').style.display=r.name==='admin'?'none':'';
 if(r.name==='home'){v.innerHTML=home();$('#sort').value=ui.sort;renderCatalog()}
 else if(r.name==='checkout')v.innerHTML=checkout();
 else if(r.name==='pay')v.innerHTML=pay(r.arg);
 else if(r.name==='done')v.innerHTML=done(r.arg);
 else if(r.name==='orders')v.innerHTML=myOrders();
 else if(r.name==='admin')v.innerHTML=adminView(r.sub);
 else v.innerHTML=notFound();
 renderNav();reveal();
 const key=r.name+(r.sub||'')+(r.arg||'');if(key!==lastRoute){window.scrollTo(0,0);lastRoute=key}
 setTimeout(()=>document.body.classList.remove('load'),1800);
}
addEventListener('hashchange',()=>{if(location.hash==='#catalog'){history.replaceState(null,'','#/');jumpCatalog();return}closeAll();renderView()});
function jumpCatalog(){if(route().name!=='home'){location.hash='#/';setTimeout(jumpCatalog,80);return}const c=$('#catalog');c&&c.scrollIntoView({behavior:reduce?'auto':'smooth'})}

// ---------- reveal ----------
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px'}):null;
function reveal(){$$('.rv:not(.in)').forEach((el,i)=>{if(!io){el.classList.add('in');return}el.style.transitionDelay=Math.min(i%6,5)*55+'ms';io.observe(el)})}

// ---------- events ----------
document.addEventListener('click',e=>{
 const t=e.target.closest('button,a,[data-order],#scrim');if(!t)return;const d=t.dataset;
 if(t.id==='scrim'){closeAll();return}
 if(d.close!==undefined){closeAll();if(t.tagName!=='A')return}
 if(d.login!==undefined){e.preventDefault();openLogin('in');return}
 if(d.ltab){openLogin(d.ltab);return}
 if(d.cart!==undefined||t.id==='mbar'){openCart();return}
 if(d.inc){const was=cart[d.inc]||0;setQty(d.inc,was+1);if((cart[d.inc]||0)>was)fly(t);if(!was&&cart[d.inc])toast(`${byId(d.inc).name} — 1 хайрцаг нэмлээ`);return}
 if(d.dec){setQty(d.dec,(cart[d.dec]||0)-1);return}
 if(d.open){openProduct(d.open);return}
 if(d.cat){e.preventDefault();ui.cat=d.cat;if(route().name!=='home'){location.hash='#/';setTimeout(()=>{renderCatalog();jumpCatalog()},80);return}renderCatalog();if(d.jumpcat!==undefined)jumpCatalog();return}
 if(d.view){ui.view=d.view;save();renderCatalog();return}
 if(d.jump!==undefined){e.preventDefault();jumpCatalog();return}
 if(d.reorder){const o=orders.find(x=>x.id===d.reorder);if(o){o.items.forEach(i=>{const p=byId(i.id);if(p&&p.active&&p.stock>0)cart[i.id]=Math.min(p.stock,(cart[i.id]||0)+i.q)});save();renderNav();openCart();toast('Өмнөх захиалгыг сагсанд нэмлээ')}return}
 if(d.logout!==undefined){user=null;cart={};save();location.hash='#/';renderView();toast('Гарлаа');return}
 if(d.check){t.disabled=true;t.textContent='Шалгаж байна…';setTimeout(()=>{const o=orders.find(x=>x.id===d.check);if(o){o.status='paid';save()}location.hash='#/done/'+d.check},1200);return}
 if(d.bank!==undefined){toast('Бодит сайтад тухайн банкны апп нээгдэнэ');return}
 if(d.home!==undefined){location.hash='#/';return}
 // admin
 if(d.adminIn!==undefined){admin=true;save();renderView();return}
 if(d.anav!==undefined){location.hash='#/admin'+(d.anav?'/'+d.anav:'');return}
 if(d.order&&t.tagName==='TR'){orderDet(d.order);return}
 if(d.ofl){oFilter=d.ofl;renderView();return}
 if(d.adv){const o=orders.find(x=>x.id===d.adv);if(o){o.status=d.to;save();renderView();orderDet(o.id);toast(`${o.id}: ${STATUS[o.status]}`)}return}
 if(d.print){printSlip(d.print);return}
 if(d.pact){const p=byId(d.pact);p.active=!p.active;save();t.classList.toggle('on',p.active);toast(p.active?'Дэлгүүрт харагдана':'Дэлгүүрээс нуулаа');return}
 if(d.pcat){pcat=d.pcat;renderView();return}
 if(d.pedit!==undefined){productForm(d.pedit);return}
 if(d.pdel){confirmDel(d.pdel);return}
 if(d.pdelok){const p=byId(d.pdelok);P=P.filter(x=>x.id!==d.pdelok);delete cart[d.pdelok];save();closeAll();renderView();toast(`«${p?p.name:''}» устгагдлаа`);return}
 if(d.approve!==undefined){customers[+d.approve].status='ok';save();renderView();toast('Харилцагчийг баталлаа · SMS илгээгдэнэ');return}
 if(d.csv!==undefined){const rows=[['code','brand','name','category','pack','unit','spec','price','old_price','stock'],...P.map(p=>['EV-'+p.id.replace(/^\D+/,''),p.brand,p.name,catOf(p.cat).name,p.pack,p.unit,p.spec,p.price,p.old||'',p.stock])];const csv='﻿'+rows.map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='evrop-baraa-products.csv';a.click();return}
 if(d.import!==undefined){modal(`<div class="login" style="width:min(580px,100%)"><button class="x" type="button" data-close style="float:right">×</button><h3>Excel-ээс бараа оруулах</h3><p>100–500 барааг нэг дор оруулна. Файлын баганууд:</p><div class="tw"><table class="t" style="margin-bottom:14px"><tr><th>code</th><th>name</th><th>category</th><th>pack</th><th>price</th><th>stock</th></tr><tr><td class="mono">EV-101</td><td>Love Day 250г</td><td>Жигнэмэг</td><td class="mono">12</td><td class="mono">6700</td><td class="mono">84</td></tr></table></div><p class="hint">Зургийг кодоор нь (EV-101.jpg) нэг хавтсаар оруулахад автоматаар холбогдоно. «CSV татах» товчоор одоогийн жагсаалтыг загвар болгон авч болно. Демо-д файл оруулах хэсэг идэвхгүй.</p><button class="btn n" type="button" data-close style="width:100%;margin-top:10px">Ойлголоо</button></div>`);return}
 if(d.reset!==undefined){['products2','cats2','cart','orders','customers','co'].forEach(store.del);location.reload();return}
},false);
document.addEventListener('change',async e=>{
 const t=e.target,d=t.dataset;
 if(d.qty){setQty(d.qty,t.value);return}
 if(t.id==='sort'){ui.sort=t.value;renderCatalog();return}
 if(d.pprice){const p=byId(d.pprice);p.price=Math.max(0,+t.value||0);delete p.ex;save();toast('Үнэ шинэчлэгдлээ');return}
 if(d.pstock){const p=byId(d.pstock);p.stock=Math.max(0,+t.value||0);save();toast('Үлдэгдэл шинэчлэгдлээ');return}
 if(d.driver){const o=orders.find(x=>x.id===d.driver);if(o){o.driver=t.value;save();toast(t.value?`${o.id} → ${t.value}`:'Жолооч хаслаа')}return}
 if(t.id==='p_img'&&t.files&&t.files[0]){try{editImg=await shrink(t.files[0]);const u=$('#upl');let i=u.querySelector('img');if(!i){i=document.createElement('img');u.prepend(i)}i.src=editImg}catch(_){toast('Зургийг уншиж чадсангүй')}return}
 if(t.form&&t.form.id==='coform'){const fd=new FormData(t.form);const f={};['method','pay','day','time','note','store','phone','district','khoroo','addr'].forEach(k=>f[k]=fd.get(k));store.set('co',f);if(t.name==='method'||t.name==='pay')renderView()}
});
document.addEventListener('input',e=>{
 if(e.target.id==='pq'){pq=e.target.value;const pos=e.target.selectionStart;renderView();const n=$('#pq');n.focus();n.setSelectionRange(pos,pos);return}
 if(e.target.id==='p_pr'||e.target.id==='p_pk'){const pr=+$('#p_pr').value||0,pk=+$('#p_pk').value||0;$('#p_box').textContent=pr&&pk?`Хайрцгийн үнэ: ${fmt(pr*pk)}`:''}
});
document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target;
 if(f.id==='lform'){const ph=$('#l_ph').value.replace(/\D/g,''),pin=$('#l_pin').value;if(ph==='99112233'&&pin==='1234'){user={...DEMO};save();closeAll();renderView();toast('Тавтай морил, '+user.store)}else if(customers.some(c=>c.phone===ph&&c.status==='wait'))toast('Таны хүсэлтийг админ хараахан батлаагүй байна');else toast('Утас эсвэл ПИН буруу байна (демо: 99112233 / 1234)');return}
 if(f.id==='rform'){const st=$('#r_st').value.trim(),ph=$('#r_ph').value.replace(/\D/g,'');if(!st||ph.length!==8){toast('Дэлгүүрийн нэр, 8 оронтой утсаа бичнэ үү');return}customers.push({store:st,phone:ph,district:$('#r_di').value,status:'wait',tier:'Бөөний'});save();closeAll();toast('Хүсэлт илгээгдлээ. Админ баталсны дараа SMS-ээр мэдэгдэнэ.');return}
 if(f.id==='pform'){
  const nm=$('#p_nm').value.trim(),sp=$('#p_sp').value.trim(),pr=Math.max(0,+$('#p_pr').value||0);
  if(!nm||!sp||!pr){toast('Нэр, савлагаа, үнээ бөглөнө үү');return}
  const id=f.dataset.id;const old=+$('#p_old').value||0;
  const data={cat:$('#p_ct').value,brand:$('#p_br').value.trim(),name:nm,spec:sp,pack:Math.max(1,+$('#p_pk').value||1),unit:$('#p_un').value,price:pr,stock:Math.max(0,+$('#p_st').value||0),desc:$('#p_ds').value.trim(),active:$('#p_act').checked};
  if(old>pr)data.old=old;
  if(id){const p=byId(id);Object.assign(p,data);if(!(old>pr))delete p.old;delete p.ex;if(editImg)p.img=editImg}
  else P.unshift({id:'n'+Date.now().toString(36),...data,img:editImg||catOf(data.cat).img});
  save();closeAll();renderView();toast(id?'Хадгаллаа — дэлгүүрт шинэчлэгдлээ':'Бараа нэмэгдлээ — дэлгүүрт харагдана');return}
 if(f.id==='coform'){
  const fd=new FormData(f);const method=fd.get('method'),payM=fd.get('pay');const t=totals(method);
  if(t.sub<RULE.min){toast(`Хамгийн бага захиалга ${fmt(RULE.min)}`);return}
  const phone=String(fd.get('phone')||'').replace(/\D/g,'');if(phone.length!==8){toast('Утасны дугаар 8 оронтой байна');$('#f_phone').focus();return}
  if(method==='delivery'&&!String(fd.get('addr')||'').trim()){toast('Хүргэх хаягаа бичнэ үү');$('#f_addr').focus();return}
  const id=`EV-${String(today.getDate()).padStart(2,'0')}${String(today.getMonth()+1).padStart(2,'0')}-${String(orders.length+49).padStart(4,'0')}`;
  const day=new Date(today.getTime()+(+fd.get('day')+1)*864e5);
  const o={id,store:String(fd.get('store')).trim()||user.store,district:method==='pickup'?'Агуулахаас авна':fd.get('district'),addr:[fd.get('khoroo'),fd.get('addr')].filter(Boolean).join(', '),at:new Date().toISOString(),status:payM==='qpay'?'new':payM==='bank'?'wait':'paid',items:t.lines.map(l=>({id:l.p.id,q:l.q})),sub:t.sub,fee:t.fee,total:t.total,pay:payM,method,when:`${day.getMonth()+1}/${day.getDate()} · ${fd.get('time')}`,note:fd.get('note'),driver:''};
  orders.unshift(o);t.lines.forEach(l=>{l.p.stock=Math.max(0,l.p.stock-l.q)});cart={};save();renderNav();
  location.hash=payM==='qpay'?'#/pay/'+id:'#/done/'+id;return}
});
addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
renderView();
})();
