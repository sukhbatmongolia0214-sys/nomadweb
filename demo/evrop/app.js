(()=>{
'use strict';
document.documentElement.classList.add('js');
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Math.round(n).toLocaleString('en-US')+'₮';
const store={get(k,d){try{const v=localStorage.getItem('ev_'+k);return v?JSON.parse(v):d}catch(_){return d}},set(k,v){try{localStorage.setItem('ev_'+k,JSON.stringify(v))}catch(_){}}};

// ---------- rules (жишээ — захиалагчтай тохирно) ----------
const RULE={min:100000,free:300000,fee:10000};
const DISTRICTS=['Баянзүрх','Сүхбаатар','Чингэлтэй','Баянгол','Хан-Уул','Сонгинохайрхан','Налайх','Багануур','Багахангай','Орон нутаг (унаанд тавина)'];
const STATUS={new:'Шинэ',wait:'Төлбөр хүлээгдэж буй',paid:'Төлбөр орсон',prep:'Бэлтгэж байна',ship:'Хүргэлтэд гарсан',done:'Хүргэгдсэн'};
const FLOW=['new','paid','prep','ship','done'];
const BANKS=['Хаан банк','Голомт банк','Худалдаа хөгжлийн банк','Төрийн банк','Хас банк','Капитрон банк','М банк','Ариг банк'];
const DRIVERS=['Бат-Эрдэнэ','Ганбаатар','Төмөрхүү'];
const DEMO={store:'Хүслэн дэлгүүр',phone:'99112233',district:'Баянзүрх',khoroo:'8-р хороо',addr:'Нарны зам, 15-р байрны 1 давхар',credit:true};

// ---------- state ----------
const base=window.EV_PRODUCTS.map(p=>({active:true,...p}));
let P=store.get('products',null);
if(!P||P.length<base.length){P=base}
const byId=id=>P.find(p=>p.id===id);
let user=store.get('user',null), cart=store.get('cart',{}), admin=store.get('admin',false);
let ui={cat:'all',q:'',sort:'pop',view:store.get('view','grid')};

const today=new Date();
const dstr=(d)=>d.toISOString().slice(0,10);
function seedOrders(){
 const mk=(id,store_,district,mins,status,items,pay)=>{const d=new Date(today.getTime()-mins*60000);const sub=items.reduce((s,[pid,q])=>{const p=byId(pid);return s+(p?p.price*p.pack*q:0)},0);return {id,store:store_,district,at:d.toISOString(),status,items:items.map(([pid,q])=>({id:pid,q})),sub,fee:sub>=RULE.free?0:RULE.fee,total:sub+(sub>=RULE.free?0:RULE.fee),pay:pay||'qpay',method:'delivery',driver:''}};
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
const save=()=>{store.set('products',P);store.set('cart',cart);store.set('orders',orders);store.set('customers',customers);store.set('user',user);store.set('admin',admin);store.set('view',ui.view)};

// ---------- helpers ----------
const catName=id=>(window.EV_CATS.find(c=>c.id===id)||{}).name||'';
const boxPrice=p=>p.price*p.pack;
const im=p=>p.img||`img/${p.id}.webp`;
const mnDate=d=>`${d.getFullYear()} оны ${d.getMonth()+1}-р сарын ${d.getDate()}`;
const cartLines=()=>Object.entries(cart).filter(([id,q])=>q>0&&byId(id)).map(([id,q])=>({p:byId(id),q}));
function totals(method){const lines=cartLines();const sub=lines.reduce((s,l)=>s+boxPrice(l.p)*l.q,0);const boxes=lines.reduce((s,l)=>s+l.q,0);const fee=method==='pickup'||sub===0||sub>=RULE.free?0:RULE.fee;return {lines,sub,boxes,fee,total:sub+fee}}
const ico={
 search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
 cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>',
 user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
 lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
 box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/></svg>'
};
let tt=0;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),1800)}

// ---------- shell ----------
const app=$('#app');
app.innerHTML=`<header class="top" id="top"><div class="wrap">
 <a class="logo" href="#/"><b>ЕВРОП <i>БАРАА</i></b><span>Бөөний худалдаа · 25, 26-р агуулах</span></a>
 <label class="search"><span class="sr">Бараа хайх</span>${ico.search}<input id="q" type="search" placeholder="Бараа, брэнд хайх — жишээ нь Love Day" autocomplete="off"></label>
 <nav class="tnav" id="tnav"></nav>
</div></header><main id="view"></main>`;
function renderNav(){
 const t=totals();
 $('#tnav').innerHTML=(user?`<a class="tbtn" href="#/orders">${ico.user}<span class="lbl">${esc(user.store)}</span></a>`:`<button class="tbtn" type="button" data-login>${ico.user}<span class="lbl">Нэвтрэх</span></button>`)+
 `<button class="tbtn cart" type="button" data-cart>${ico.cart}<span class="num">${fmt(t.sub)}</span>${t.boxes?`<span class="cnt">${t.boxes}</span>`:''}</button>`;
 const mb=$('#mbar');mb.innerHTML=`<span>${ico.cart.replace('<svg','<svg width="20" height="20"')} ${t.boxes} хайрцаг</span><span class="num">${fmt(t.sub)} →</span>`;
 mb.classList.toggle('on',t.boxes>0&&!location.hash.startsWith('#/admin')&&!location.hash.startsWith('#/checkout'));
}
$('#q').addEventListener('input',e=>{ui.q=e.target.value.trim();if(route().name!=='home'){location.hash='#/';return}renderCatalog();const c=$('#catalog');if(c&&ui.q&&c.getBoundingClientRect().top>200)c.scrollIntoView({behavior:'smooth'})});

// ---------- product UI ----------
function spec(p){return `<div class="spec"><span>1 × ${p.pack}${p.unit==='блок'||p.unit==='уут'?' '+p.unit:''}</span><span>${esc(p.spec)}</span></div>`}
function ctl(p){
 const q=cart[p.id]||0;
 if(!user)return `<button class="locked" type="button" data-login>${ico.lock} Харилцагчаар нэвтэрч үнэ харах</button>`;
 if(p.stock<=0)return `<button class="add" type="button" disabled style="opacity:.5">Дууссан</button>`;
 return (q?`<div class="step"><button type="button" data-dec="${p.id}" aria-label="Хасах">−</button><input type="number" inputmode="numeric" min="0" value="${q}" data-qty="${p.id}" aria-label="Хайрцагны тоо"><button type="button" data-inc="${p.id}" aria-label="Нэмэх">+</button></div>`:`<button class="add" type="button" data-inc="${p.id}">Хайрцгаар сагслах</button>`)+
  `<div class="math">${q?`${q} хайрцаг = ${q*p.pack} ${p.unit} · ${fmt(q*boxPrice(p))}`:''}</div>`;
}
function priceBlock(p){
 if(!user)return '';
 return `<div class="price"><b>${fmt(p.price)}</b>${p.old?`<s>${fmt(p.old)}</s>`:''}<small>/ ${p.unit}</small>${p.ex?'<span class="ex">жишээ үнэ</span>':''}</div><div class="boxp">Хайрцаг: ${fmt(boxPrice(p))}</div>`;
}
function card(p){
 const tag=p.old?`<span class="tag">−${Math.round((1-p.price/p.old)*100)}%</span>`:(p.stock<15?`<span class="tag low">Цөөн үлдсэн</span>`:'');
 return `<article class="pc rv"><button class="ph" type="button" data-open="${p.id}" aria-label="${esc(p.name)} дэлгэрэнгүй"><img loading="lazy" src="${p.img||'img/'+p.id+'.webp'}" alt="${esc(p.brand+' '+p.name)}">${tag}</button>
 <div class="bd"><div class="br">${esc(p.brand)}</div><h3><button type="button" data-open="${p.id}">${esc(p.name)}</button></h3>${spec(p)}${priceBlock(p)}<div data-ctl="${p.id}">${ctl(p)}</div></div></article>`;
}
function row(p){
 return `<div class="lr"><img loading="lazy" src="${p.img||'img/'+p.id+'.webp'}" alt=""><div class="nm"><b><button type="button" data-open="${p.id}" style="all:unset;cursor:pointer">${esc(p.brand?p.brand+' · ':'')}${esc(p.name)}</button></b><small>1 × ${p.pack} · ${esc(p.spec)}${user?` · ${fmt(p.price)}/${p.unit}`:''}</small></div>
 <div class="r hide">${user?`<b class="num">${fmt(boxPrice(p))}</b>${p.ex?'<span class="ex">жишээ</span>':''}`:'—'}</div><div class="hide stk ${p.stock<15?'low':'ok'}">${p.stock} хайрцаг</div><div data-ctl="${p.id}">${ctl(p)}</div></div>`;
}
function refresh(id){$$(`[data-ctl="${id}"]`).forEach(el=>el.innerHTML=ctl(byId(id)));renderNav();if($('#cart').classList.contains('on'))renderCart();if(route().name==='checkout')renderView()}
function setQty(id,q){const p=byId(id);if(!p)return;q=Math.max(0,Math.min(999,parseInt(q)||0));if(q>p.stock){q=p.stock;toast(`Үлдэгдэл ${p.stock} хайрцаг байна`)}if(q)cart[id]=q;else delete cart[id];save();refresh(id)}

// ---------- views ----------
function visible(){
 let a=P.filter(p=>p.active);
 if(ui.cat==='sale')a=a.filter(p=>p.old);else if(ui.cat!=='all')a=a.filter(p=>p.cat===ui.cat);
 if(ui.q){const q=ui.q.toLowerCase();a=a.filter(p=>(p.name+' '+p.brand+' '+catName(p.cat)+' '+p.spec).toLowerCase().includes(q))}
 if(ui.sort==='low')a=[...a].sort((x,y)=>boxPrice(x)-boxPrice(y));else if(ui.sort==='high')a=[...a].sort((x,y)=>boxPrice(y)-boxPrice(x));else if(ui.sort==='az')a=[...a].sort((x,y)=>(x.brand+x.name).localeCompare(y.brand+y.name,'mn'));
 return a;
}
function renderCatalog(){
 const el=$('#catbody');if(!el)return;
 const a=visible();
 const cats=[{id:'all',name:'Бүх бараа',n:P.filter(p=>p.active).length},{id:'sale',name:'Хямдралтай',n:P.filter(p=>p.active&&p.old).length},...window.EV_CATS.map(c=>({id:c.id,name:c.name,n:P.filter(p=>p.active&&p.cat===c.id).length}))];
 $('#side').innerHTML=`<h3>Ангилал</h3>${cats.map(c=>`<button type="button" class="${ui.cat===c.id?'on':''}" data-cat="${c.id}">${esc(c.name)}<small>${c.n}</small></button>`).join('')}<div class="note">Энэ демо-д ${P.length} бараа байна. Бодит каталогоо (100–500 бараа) Excel файлаас нэг дор оруулна.</div>`;
 $('#chips').innerHTML=cats.map(c=>`<button type="button" class="${ui.cat===c.id?'on':''}" data-cat="${c.id}">${esc(c.name)}</button>`).join('');
 $('#found').textContent=`${a.length} бараа`+(ui.q?` · “${ui.q}”`:'');
 $$('#seg button').forEach(b=>b.classList.toggle('on',b.dataset.view===ui.view));
 if(!a.length){el.innerHTML=`<div class="empty"><b>Илэрц олдсонгүй</b>Өөр үгээр хайгаад үзээрэй.</div>`;return}
 el.innerHTML=ui.view==='list'?`<div class="list"><div class="lr hd"><span></span><span>Бараа</span><span class="r hide">Хайрцгийн үнэ</span><span class="hide">Үлдэгдэл</span><span>Захиалах</span></div>${a.map(row).join('')}</div>`:`<div class="grid">${a.map(card).join('')}</div>`;
 reveal();
}
function home(){
 const sample=user&&orders.find(o=>o.store===user.store);
 const lines=(sample?sample.items:[{id:'p37',q:3},{id:'p33',q:2},{id:'p11',q:4}]).slice(0,4).map(i=>({p:byId(i.id),q:i.q})).filter(l=>l.p);
 const tot=lines.reduce((s,l)=>s+boxPrice(l.p)*l.q,0);
 return `<section class="hero"><div class="wrap">
  <div>
   <h1>Дэлгүүрээ утаснаасаа нөөцөл.</h1>
   <p>Нарантуул Өргөтгөлийн 25, 26-р агуулахын Европ, Солонгос, Орос барааг бөөний үнээр хайрцгаар захиалаад QPay-ээр төлнө. Бид Улаанбаатар болон орон нутагт хүргэнэ.</p>
   <div class="cta">${user?`<a class="btn y" href="#catalog" data-jump>Захиалга эхлүүлэх</a>${sample?`<button class="btn o" type="button" data-reorder="${sample.id}">Өмнөх захиалгаа давтах</button>`:''}`:`<button class="btn y" type="button" data-login>Харилцагчаар нэвтрэх</button><a class="btn o" href="#catalog" data-jump>Каталог үзэх</a>`}</div>
   <div class="facts"><span>Чанартай Европ бараа</span><span>Бөөний үнэ</span><span>Тогтмол нийлүүлэлт</span><span>УБ болон орон нутаг</span></div>
  </div>
  <div class="slip" aria-hidden="true"><h4><span>${sample?'Таны сүүлийн захиалга':'Жишээ захиалга'}</span><span>${sample?esc(sample.id):'EV-2611-0050'}</span></h4>
   ${lines.map(l=>`<div class="sl"><img src="${im(l.p)}" alt=""><div><b>${esc(l.p.brand?l.p.brand+' ':'')}${esc(l.p.name)}</b><small>${l.q} хайрцаг × 1 × ${l.p.pack} · ${esc(l.p.spec)}</small></div><span class="num">${fmt(boxPrice(l.p)*l.q)}</span></div>`).join('')}
   <div class="tot"><span>Нийт</span><span class="num">${fmt(tot)}</span></div><span class="stamp">QPAY · ТӨЛСӨН</span></div>
 </div></section>
 <section class="sec"><div class="wrap">
  <div class="sh rv"><div><h2>Ангиллаар сонгох</h2><p>Агуулахад байгаа бараа, хайрцгийн савлагаатай нь.</p></div></div>
  <div class="cats">${window.EV_CATS.map(c=>`<button class="cat rv" type="button" data-cat="${c.id}" data-jumpcat><img loading="lazy" src="${c.img}" alt=""><span>${esc(c.name)}<small>${P.filter(p=>p.active&&p.cat===c.id).length} бараа</small></span></button>`).join('')}</div>
 </div></section>
 <section class="sec" id="catalog" style="padding-top:0"><div class="wrap">
  <div class="sh"><div><h2>Каталог</h2><p>${user?'Үнэ нэг ширхэгээр, захиалга хайрцгаар.':'Бөөний үнийг зөвхөн бүртгэлтэй дэлгүүрүүд харна.'}</p></div></div>
  <div class="catalog"><aside class="side" id="side"></aside><div>
   <div class="chips" id="chips"></div>
   <div class="bar"><span class="found" id="found"></span>
    <label class="sr" for="sort">Эрэмбэ</label><select id="sort"><option value="pop">Эрэлттэй нь эхэнд</option><option value="low">Хайрцгийн үнэ ↑</option><option value="high">Хайрцгийн үнэ ↓</option><option value="az">Нэрээр А–Я</option></select>
    <div class="seg" id="seg"><button type="button" data-view="grid">Карт</button><button type="button" data-view="list">Жагсаалт</button></div>
   </div>
   <div id="catbody"></div>
  </div></div>
 </div></section>
 <section class="sec" style="padding-top:24px"><div class="wrap">
  <div class="sh rv"><div><h2>Хэрхэн захиалах вэ</h2></div></div>
  <ol class="how rv"><li><b>Нэвтрэх</b><p>Дэлгүүрээ бүртгүүлээд утас, ПИН кодоороо нэвтэрнэ. Админ баталгаажуулна.</p></li><li><b>Хайрцгаар сагслах</b><p>Хэдэн хайрцаг, нийт хэдэн ширхэг болохыг шууд харна.</p></li><li><b>QPay-ээр төлөх</b><p>Банкны аппаараа QR уншуулна, эсвэл дансаар шилжүүлнэ.</p></li><li><b>Хүргэлт</b><p>Сонгосон өдөр, цагт дэлгүүрт тань хүргэнэ, эсвэл агуулахаас очиж авна.</p></li></ol>
 </div></section>`+footer();
}
function footer(){return `<footer class="foot"><div class="wrap"><div class="big">ЕВРОП <i>БАРАА</i></div>
 <div class="cols"><div><h5>Агуулах</h5>Нарантуул, Өргөтгөл<br>25, 26-р агуулах</div><div><h5>Захиалга, лавлах</h5><a href="tel:96651068">9665-1068</a><br><a href="https://www.facebook.com/profile.php?id=100068681297166" target="_blank" rel="noopener">Facebook хуудас</a></div><div><h5>Хамтран ажиллах</h5>Хүнсний дэлгүүр, минимаркет, кафе. УБ болон орон нутаг.</div></div>
 <div class="by">Демо хувилбар · Nomad Web Studio · nomadweb.mn</div></div></footer>`}

function checkout(){
 if(!user)return `<div class="page"><div class="wrap"><div class="empty"><b>Эхлээд нэвтэрнэ үү</b><button class="btn n" type="button" data-login style="margin-top:12px">Нэвтрэх</button></div></div></div>`;
 const f=store.get('co',{method:'delivery',pay:'qpay',day:0,time:'10:00–13:00'});
 const t=totals(f.method);
 if(!t.lines.length)return `<div class="page"><div class="wrap"><div class="empty"><b>Захиалгын хуудас хоосон</b>Каталогоос бараагаа хайрцгаар нэмнэ үү.<br><a class="btn n" href="#/" style="margin-top:16px">Каталог руу</a></div></div></div>`;
 const days=[1,2,3].map(n=>{const d=new Date(today.getTime()+n*864e5);return {n,lbl:n===1?'Маргааш':['Ням','Даваа','Мягмар','Лхагва','Пүрэв','Баасан','Бямба'][d.getDay()],d:`${d.getMonth()+1}/${d.getDate()}`}});
 const short=t.sub<RULE.min;
 return `<div class="page"><div class="wrap"><a class="back" href="#/">← Каталог руу буцах</a>
 <div class="co"><form id="coform" novalidate>
  <div class="panel"><h3><span class="n">1</span>Хүлээн авах</h3>
   <div class="opts" style="margin-bottom:16px">
    <label class="opt"><input type="radio" name="method" value="delivery" ${f.method==='delivery'?'checked':''}><span><b>Дэлгүүрт хүргүүлэх</b><small>${fmt(RULE.free)}-с дээш захиалгад хүргэлт үнэгүй, бусад тохиолдолд ${fmt(RULE.fee)}</small></span></label>
    <label class="opt"><input type="radio" name="method" value="pickup" ${f.method==='pickup'?'checked':''}><span><b>Агуулахаас очиж авах</b><small>Нарантуул, Өргөтгөл 25, 26-р агуулах</small></span></label>
   </div>
   <div class="g2"><div class="fld"><label for="f_store">Дэлгүүрийн нэр</label><input id="f_store" name="store" value="${esc(f.store||user.store)}" required></div><div class="fld"><label for="f_phone">Хүлээн авах хүний утас</label><input id="f_phone" name="phone" inputmode="tel" value="${esc(f.phone||user.phone)}" required pattern="[0-9]{8}"></div></div>
   <div id="addr" ${f.method==='pickup'?'hidden':''}>
    <div class="g2"><div class="fld"><label for="f_dist">Дүүрэг</label><select id="f_dist" name="district">${DISTRICTS.map(d=>`<option ${d===(f.district||user.district)?'selected':''}>${d}</option>`).join('')}</select></div><div class="fld"><label for="f_kh">Хороо / сум</label><input id="f_kh" name="khoroo" value="${esc(f.khoroo??user.khoroo??'')}"></div></div>
    <div class="fld"><label for="f_addr">Дэлгэрэнгүй хаяг</label> <input id="f_addr" name="addr" value="${esc(f.addr??user.addr??'')}" placeholder="Гудамж, байр, орц, тоот"></div>
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
  <div class="mini">${t.lines.map(l=>`<div class="ci"><img src="${im(l.p)}" alt=""><div><b>${esc(l.p.name)}</b><small>${l.q} × 1 × ${l.p.pack} · ${esc(l.p.spec)}</small></div><span class="num" style="font-family:var(--m);font-weight:700;font-size:14px">${fmt(boxPrice(l.p)*l.q)}</span></div>`).join('')}</div>
  <div class="sum" style="margin-top:14px"><div><span>Барааны дүн</span><span class="num">${fmt(t.sub)}</span></div><div><span>Хүргэлт</span><span class="num">${t.fee?fmt(t.fee):'Үнэгүй'}</span></div><div class="t"><span>Нийт</span><span class="num">${fmt(t.total)}</span></div></div>
  ${short?`<p class="hint warn">Хамгийн бага захиалга ${fmt(RULE.min)}. Дахиад ${fmt(RULE.min-t.sub)}-ийн бараа нэмнэ үү.</p>`:''}
  <button class="btn y" type="submit" form="coform" style="width:100%;margin-top:14px" ${short?'disabled':''}>Захиалга илгээх · ${fmt(t.total)}</button>
  <p class="hint" style="margin-top:10px">Үнэ, хүргэлтийн нөхцөл, хамгийн бага захиалгын дүн нь жишээ — танай бодлогоор тохируулна.</p>
 </div></aside></div></div></div>`;
}
function qrSvg(seed){
 const N=29;let h=0;for(const c of seed)h=(h*31+c.charCodeAt(0))>>>0;const rnd=()=>{h^=h<<13;h>>>=0;h^=h>>17;h^=h<<5;h>>>=0;return h/4294967296};
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
 <div class="db">${t.lines.length?t.lines.map(l=>`<div class="ci"><img src="${im(l.p)}" alt=""><div><b>${esc(l.p.brand?l.p.brand+' · ':'')}${esc(l.p.name)}</b><small>1 × ${l.p.pack} · ${esc(l.p.spec)} · ${fmt(l.p.price)}/${l.p.unit}</small>
  <div class="row"><div class="step"><button type="button" data-dec="${l.p.id}" aria-label="Хасах">−</button><input type="number" inputmode="numeric" value="${l.q}" data-qty="${l.p.id}" aria-label="Хайрцаг"><button type="button" data-inc="${l.p.id}" aria-label="Нэмэх">+</button></div><span class="num" style="font-family:var(--m)">${fmt(boxPrice(l.p)*l.q)}</span></div>
  <small>${l.q} хайрцаг = ${l.q*l.p.pack} ${l.p.unit}</small></div></div>`).join(''):`<div class="empty"><b>Хоосон байна</b>Каталогоос бараагаа хайрцгаар нэмээрэй.</div>`}</div>
 ${t.lines.length?`<div class="df"><div class="sum"><div><span>Барааны дүн</span><span class="num">${fmt(t.sub)}</span></div></div>
  <div class="prog"><i style="width:${Math.min(100,t.sub/RULE.free*100)}%"></i></div>
  <p class="hint ${left?'':'ok'}" style="margin:0 0 12px">${left?`Үнэгүй хүргэлт хүртэл ${fmt(left)} дутуу байна`:'Хүргэлт үнэгүй ✓'}</p>
  <a class="btn y" href="#/checkout" style="width:100%" data-close>Захиалга баталгаажуулах</a></div>`:''}`;
}
function openCart(){renderCart();$('#cart').classList.add('on');$('#scrim').classList.add('on')}
function closeAll(){$('#cart').classList.remove('on');$('#modal').classList.remove('on');$('#scrim').classList.remove('on');$('.det.on')&&$('.det.on').classList.remove('on')}

// ---------- modals ----------
function modal(html,cls){const b=$('#mbox');b.className='mbox '+(cls||'');b.innerHTML=html;$('#modal').classList.add('on');$('#scrim').classList.add('on');setTimeout(()=>{const f=b.querySelector('input:not([type=hidden])');if(f&&cls==='login')f.focus()},350)}
function openProduct(id){
 const p=byId(id);if(!p)return;
 modal(`<div class="pd"><div class="pi"><img src="${im(p)}" alt="${esc(p.name)}"></div><div class="pt"><button class="x" type="button" data-close aria-label="Хаах">×</button>
  <div class="br" style="font-family:var(--m);font-size:12px;letter-spacing:.1em;color:var(--mute);text-transform:uppercase">${esc(p.brand)} · ${esc(catName(p.cat))}</div>
  <h3>${esc(p.name)}</h3>${spec(p)}<p style="margin:0;color:var(--mute)">${esc(p.desc)}</p>
  <dl class="kv"><dt>Савлагаа</dt><dd>${esc(p.spec)}</dd><dt>Хайрцагт</dt><dd>${p.pack} ${p.unit}</dd>${user?`<dt>Нэгжийн үнэ</dt><dd>${fmt(p.price)}${p.old?` <s style="color:var(--mute);font-weight:500">${fmt(p.old)}</s>`:''}</dd><dt>Хайрцгийн үнэ</dt><dd>${fmt(boxPrice(p))}</dd>`:''}<dt>Үлдэгдэл</dt><dd class="stk ${p.stock<15?'low':'ok'}">${p.stock} хайрцаг</dd><dt>Код</dt><dd>EV-${p.id.slice(1)}</dd></dl>
  ${p.ex&&user?'<p class="hint warn" style="margin:0">Энэ барааны үнэ FB постод байгаагүй тул жишээ үнэ тавив.</p>':''}
  <div data-ctl="${p.id}" style="margin-top:auto">${ctl(p)}</div></div></div>`);
}
function openLogin(tab){
 tab=tab||'in';
 modal(`<button class="x" type="button" data-close aria-label="Хаах" style="float:right">×</button><h3>${tab==='in'?'Харилцагч нэвтрэх':'Харилцагч болох'}</h3><p>${tab==='in'?'Бүртгэлтэй дэлгүүрүүд бөөний үнэ харж, захиалга өгнө.':'Дэлгүүрээ бүртгүүлэхэд админ шалгаад баталгаажуулна.'}</p>
 <div class="tabs"><button type="button" class="${tab==='in'?'on':''}" data-ltab="in">Нэвтрэх</button><button type="button" class="${tab==='up'?'on':''}" data-ltab="up">Бүртгүүлэх</button></div>
 ${tab==='in'?`<div class="demo-hint">Демо: утас 9911-2233 · ПИН 1234</div><form id="lform"><div class="fld"><label for="l_ph">Утасны дугаар</label><input id="l_ph" inputmode="tel" autocomplete="tel" value="99112233" maxlength="8"></div><div class="fld"><label for="l_pin">ПИН код</label><input id="l_pin" type="password" inputmode="numeric" autocomplete="current-password" value="1234" maxlength="4"></div><button class="btn n" type="submit" style="width:100%">Нэвтрэх</button></form><p class="hint" style="margin-top:12px">Бодит хувилбарт утсанд SMS код ирж баталгаажуулна (сонголтоор).</p>`:
 `<form id="rform"><div class="fld"><label for="r_st">Дэлгүүрийн нэр</label><input id="r_st" required></div><div class="g2"><div class="fld"><label for="r_ph">Утас</label><input id="r_ph" inputmode="tel" required maxlength="8"></div><div class="fld"><label for="r_rd">Регистр / РД</label><input id="r_rd"></div></div><div class="fld"><label for="r_di">Дүүрэг</label><select id="r_di">${DISTRICTS.map(d=>`<option>${d}</option>`).join('')}</select></div><button class="btn n" type="submit" style="width:100%">Хүсэлт илгээх</button></form>`}`,'login');
}

// ---------- admin ----------
function adminView(sub){
 if(!admin)return `<div class="page"><div class="wrap" style="max-width:440px"><div class="panel"><h3>Админ нэвтрэх</h3><div class="demo-hint">Демо: шууд нэвтэрнэ</div><div class="fld"><label for="a_u">Нэвтрэх нэр</label><input id="a_u" value="admin"></div><div class="fld"><label for="a_p">Нууц үг</label><input id="a_p" type="password" value="demo1234"></div><button class="btn n" type="button" data-admin-in style="width:100%">Нэвтрэх</button><a class="back" href="#/" style="margin:14px 0 0">← Дэлгүүр рүү</a></div></div></div>`;
 const waitC=customers.filter(c=>c.status==='wait').length,newO=orders.filter(o=>o.status==='new'||o.status==='wait').length;
 const tabs=[['','Хянах самбар'],['orders','Захиалга',newO],['products','Бараа'],['customers','Харилцагч',waitC],['delivery','Хүргэлт']];
 const nav=tabs.map(([k,n,c])=>`<button type="button" class="${sub===k?'on':''}" data-anav="${k}">${n}${c?`<small>${c}</small>`:''}</button>`).join('');
 let body='';
 if(sub==='')body=aDash();else if(sub==='orders')body=aOrders();else if(sub==='products')body=aProducts();else if(sub==='customers')body=aCustomers();else body=aDelivery();
 return `<div class="adm"><aside class="anav"><a class="logo" href="#/"><b>ЕВРОП <i>БАРАА</i></b><span>Админ</span></a>${nav}<div class="sp">Демо өгөгдөл · <button type="button" data-reset style="all:unset;cursor:pointer;text-decoration:underline">Эхлэлд оруулах</button></div></aside>
  <div><div class="amob">${tabs.map(([k,n])=>`<button type="button" class="${sub===k?'on':''}" data-anav="${k}">${n}</button>`).join('')}<button type="button" onclick="location.hash='#/'">Дэлгүүр</button></div><div class="amain">${body}</div></div></div><aside class="det" id="det"></aside>`;
}
const isToday=o=>dstr(new Date(o.at))===dstr(today);
const hm=d=>{d=new Date(d);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
function oRow(o,c){const when=isToday(o)?hm(o.at):(new Date(o.at).getMonth()+1)+'/'+new Date(o.at).getDate()+' '+hm(o.at);return `<tr class="click" data-order="${o.id}"><td class="mono num">${o.id}</td><td class="nw">${esc(o.store)}</td>${c?'':`<td class="nw">${esc(o.district.replace(' (унаанд тавина)',''))}</td>`}<td class="mono">${when}</td><td class="r mono num">${fmt(o.total)}</td>${c?'':`<td>${o.pay==='qpay'?'QPay':o.pay==='bank'?'Данс':'Зээл'}</td>`}<td class="nw"><span class="pill ${o.status}">${STATUS[o.status]}</span></td></tr>`}
const oHead='<thead><tr><th>№</th><th>Дэлгүүр</th><th>Дүүрэг</th><th>Цаг</th><th class="r">Дүн</th><th>Төлбөр</th><th>Төлөв</th></tr></thead>';
function aDash(){
 const td=orders.filter(isToday),rev=td.filter(o=>o.status!=='wait'&&o.status!=='new').reduce((s,o)=>s+o.total,0);
 const low=P.filter(p=>p.stock<15).sort((a,b)=>a.stock-b.stock);
 return `<div class="ahd"><div><h1>Хянах самбар</h1><p>${mnDate(today)} · жишээ өгөгдөл</p></div><a class="abtn" href="#/">Дэлгүүрийг харах ↗</a></div>
 <div class="kpis"><div class="kpi"><small>Өнөөдрийн захиалга</small><b>${td.length}</b><span>${td.filter(o=>o.status==='new').length} шинэ</span></div><div class="kpi"><small>Төлөгдсөн борлуулалт</small><b>${fmt(rev)}</b><span>өнөөдөр</span></div><div class="kpi"><small>Бэлтгэх захиалга</small><b>${orders.filter(o=>o.status==='paid'||o.status==='prep').length}</b><span>агуулахад</span></div><div class="kpi"><small>Харилцагчийн хүсэлт</small><b>${customers.filter(c=>c.status==='wait').length}</b><span>батлах шаардлагатай</span></div></div>
 <div class="acols"><div class="acard"><h3>Сүүлийн захиалгууд <button class="abtn" type="button" data-anav="orders">Бүгд</button></h3><div class="tw"><table class="t"><thead><tr><th>№</th><th>Дэлгүүр</th><th>Цаг</th><th class="r">Дүн</th><th>Төлөв</th></tr></thead><tbody>${orders.slice(0,7).map(o=>oRow(o,true)).join('')}</tbody></table></div></div>
 <div class="acard"><h3>Үлдэгдэл багатай</h3><div class="tw"><table class="t"><tbody>${low.slice(0,8).map(p=>`<tr><td><img src="${im(p)}" alt=""></td><td>${esc(p.name)}<br><small class="mono" style="color:#6B7280">${esc(p.spec)}</small></td><td class="r mono num" style="color:${p.stock<10?'var(--sale)':'var(--warn)'}">${p.stock}</td></tr>`).join('')}</tbody></table></div></div></div>`;
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
  <table class="t"><thead><tr><th>Бараа</th><th class="r">Хайрцаг</th><th class="r">Дүн</th></tr></thead><tbody>${o.items.map(i=>{const p=byId(i.id);return p?`<tr><td>${esc(p.name)}<br><small class="mono" style="color:#6B7280">1×${p.pack} · ${esc(p.spec)}</small></td><td class="r mono">${i.q}</td><td class="r mono num">${fmt(boxPrice(p)*i.q)}</td></tr>`:''}).join('')}</tbody></table>
  <div class="sum" style="margin-top:12px"><div><span>Барааны дүн</span><span class="mono">${fmt(o.sub)}</span></div><div><span>Хүргэлт</span><span class="mono">${o.fee?fmt(o.fee):'Үнэгүй'}</span></div><div class="t"><span>Нийт</span><span class="mono">${fmt(o.total)}</span></div></div>
 </div><div class="df" style="display:flex;gap:8px;flex-wrap:wrap">${next?`<button class="abtn g" type="button" data-adv="${o.id}" data-to="${next[0]}">${next[1]}</button>`:''}<button class="abtn" type="button" data-print="${o.id}">Падаан хэвлэх</button></div>`;
 $('#det').classList.add('on');$('#scrim').classList.add('on');
}
let pq='';
function aProducts(){
 const list=P.filter(p=>!pq||(p.name+p.brand).toLowerCase().includes(pq.toLowerCase()));
 return `<div class="ahd"><div><h1>Бараа</h1><p>Үнэ, үлдэгдлийг энд засахад дэлгүүрт шууд шинэчлэгдэнэ.</p></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="abtn" type="button" data-csv>CSV татах</button><button class="abtn" type="button" data-import>Excel-ээс оруулах</button><button class="abtn p" type="button" data-newp>+ Шинэ бараа</button></div></div>
 <div style="margin-bottom:12px"><input id="pq" type="search" value="${esc(pq)}" placeholder="Бараа хайх" style="height:40px;border:1px solid #D1D5DB;border-radius:8px;padding:0 12px;width:min(360px,100%)"></div>
 <div class="acard"><div class="tw"><table class="t"><thead><tr><th></th><th>Бараа</th><th>Ангилал</th><th>Савлагаа</th><th class="r">Нэгж үнэ ₮</th><th class="r">Үлдэгдэл (хайрцаг)</th><th>Идэвхтэй</th></tr></thead><tbody>${list.map(p=>`<tr><td><img src="${im(p)}" alt=""></td><td><b>${esc(p.name)}</b><br><small class="mono" style="color:#6B7280">${esc(p.brand||'—')} · EV-${p.id.slice(1)}</small></td><td>${esc(catName(p.cat))}</td><td class="mono">1×${p.pack} ${p.unit} · ${esc(p.spec)}</td><td class="r"><input class="inl" type="number" value="${p.price}" data-pprice="${p.id}" aria-label="Үнэ"></td><td class="r"><input class="inl" type="number" value="${p.stock}" data-pstock="${p.id}" aria-label="Үлдэгдэл"></td><td><button type="button" class="sw ${p.active?'on':''}" data-pact="${p.id}" aria-label="Идэвхтэй"></button></td></tr>`).join('')}</tbody></table></div></div>`;
}
function aCustomers(){
 const stat=c=>{const os=orders.filter(o=>o.store===c.store);return [os.length,os.reduce((s,o)=>s+o.total,0)]};
 return `<div class="ahd"><div><h1>Харилцагч дэлгүүрүүд</h1><p>Шинэ дэлгүүр бүртгүүлэхэд энд хүсэлт ирнэ. Баталсны дараа нэвтэрч үнэ харна.</p></div></div>
 <div class="acard"><div class="tw"><table class="t"><thead><tr><th>Дэлгүүр</th><th>Утас</th><th>Дүүрэг</th><th>Нөхцөл</th><th class="r">Захиалга</th><th class="r">Нийт дүн</th><th>Төлөв</th></tr></thead><tbody>${customers.map((c,i)=>{const [n,s]=stat(c);return `<tr><td><b>${esc(c.store)}</b></td><td class="mono">${esc(c.phone)}</td><td>${esc(c.district.replace(' (унаанд тавина)',''))}</td><td>${esc(c.tier)}</td><td class="r mono">${n}</td><td class="r mono num">${fmt(s)}</td><td>${c.status==='ok'?'<span class="pill done">Идэвхтэй</span>':`<button class="abtn g" type="button" data-approve="${i}" style="height:32px">Батлах</button>`}</td></tr>`}).join('')}</tbody></table></div></div>`;
}
function aDelivery(){
 const act=orders.filter(o=>['paid','prep','ship'].includes(o.status)&&o.method!=='pickup');
 const groups={};act.forEach(o=>{(groups[o.district]=groups[o.district]||[]).push(o)});
 return `<div class="ahd"><div><h1>Хүргэлт</h1><p>Төлбөр орсон захиалгууд дүүргээр. Жолооч оноож, маршрутаа хэвлэнэ.</p></div></div>
 <div class="zone">${Object.entries(groups).map(([d,os])=>`<div class="acard"><h3>${esc(d.replace(' (унаанд тавина)',''))}<span class="mono" style="font-size:12px;color:#6B7280">${os.length} захиалга</span></h3><ul>${os.map(o=>`<li><span><b class="mono">${o.id}</b><br>${esc(o.store)}</span><span style="text-align:right"><span class="pill ${o.status}">${STATUS[o.status]}</span><br><select data-driver="${o.id}" style="margin-top:6px;height:32px;border:1px solid #D1D5DB;border-radius:6px"><option value="">Жолооч</option>${DRIVERS.map(n=>`<option ${o.driver===n?'selected':''}>${n}</option>`).join('')}</select></span></li>`).join('')}</ul></div>`).join('')||'<div class="acard" style="padding:30px;text-align:center;color:#6B7280">Хүргэх захиалга алга</div>'}</div>`;
}
function printSlip(id){
 const o=orders.find(x=>x.id===id);if(!o)return;
 $('#print').innerHTML=`<h2>Падаан ${o.id}</h2><p>${esc(o.store)} · ${esc(o.district)} · ${new Date(o.at).toLocaleDateString('en-CA')} ${hm(o.at)}</p><table><tr><th>#</th><th>Бараа</th><th>Савлагаа</th><th>Хайрцаг</th><th>Ширхэг</th><th>Дүн</th></tr>${o.items.map((i,n)=>{const p=byId(i.id);return p?`<tr><td>${n+1}</td><td>${esc(p.name)}</td><td>1×${p.pack} · ${esc(p.spec)}</td><td>${i.q}</td><td>${i.q*p.pack}</td><td>${fmt(boxPrice(p)*i.q)}</td></tr>`:''}).join('')}<tr><td colspan="5"><b>Нийт</b></td><td><b>${fmt(o.total)}</b></td></tr></table><p style="margin-top:40px">Хүлээлгэн өгсөн: ____________ &nbsp;&nbsp; Хүлээн авсан: ____________</p>`;
 window.print();
}

// ---------- router ----------
function route(){const h=location.hash.replace(/^#\/?/,'');const [a,b]=h.split('/');if(!a||a==='catalog')return {name:'home'};if(a==='admin')return {name:'admin',sub:b||''};return {name:a,arg:b}}
let lastRoute='';
function renderView(){
 const r=route(),v=$('#view');
 $('#top').style.display=r.name==='admin'?'none':'';
 if(r.name==='home'){v.innerHTML=home();$('#sort').value=ui.sort;renderCatalog()}
 else if(r.name==='checkout')v.innerHTML=checkout();
 else if(r.name==='pay')v.innerHTML=pay(r.arg);
 else if(r.name==='done')v.innerHTML=done(r.arg);
 else if(r.name==='orders')v.innerHTML=myOrders();
 else if(r.name==='admin')v.innerHTML=adminView(r.sub);
 else v.innerHTML=notFound();
 renderNav();reveal();
 const key=r.name+(r.sub||'')+(r.arg||'');if(key!==lastRoute){if(location.hash!=='#catalog')window.scrollTo(0,0);lastRoute=key}
}
addEventListener('hashchange',()=>{if(location.hash==='#catalog'){history.replaceState(null,'','#/');jumpCatalog();return}closeAll();renderView()});
function jumpCatalog(){if(route().name!=='home'){location.hash='#/';setTimeout(jumpCatalog,60);return}const c=$('#catalog');c&&c.scrollIntoView({behavior:'smooth'})}

// ---------- reveal ----------
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px'}):null;
function reveal(){$$('.rv:not(.in)').forEach((el,i)=>{if(!io){el.classList.add('in');return}el.style.transitionDelay=Math.min(i%8,7)*40+'ms';io.observe(el)})}

// ---------- events ----------
document.addEventListener('click',e=>{
 const t=e.target.closest('button,a,[data-order],#scrim');if(!t)return;const d=t.dataset;
 if(t.id==='scrim'){closeAll();return}
 if(d.close!==undefined){closeAll();if(t.tagName!=='A')return}
 if(d.login!==undefined){e.preventDefault();openLogin('in');return}
 if(d.ltab){openLogin(d.ltab);return}
 if(d.cart!==undefined||t.id==='mbar'){openCart();return}
 if(d.inc){const p=byId(d.inc);setQty(d.inc,(cart[d.inc]||0)+1);if(!cart[d.inc]||cart[d.inc]===1)toast(`${p.name} — 1 хайрцаг нэмлээ`);return}
 if(d.dec){setQty(d.dec,(cart[d.dec]||0)-1);return}
 if(d.open){openProduct(d.open);return}
 if(d.cat){ui.cat=d.cat;renderCatalog();if(d.jumpcat!==undefined)jumpCatalog();return}
 if(d.view){ui.view=d.view;save();renderCatalog();return}
 if(d.jump!==undefined){e.preventDefault();jumpCatalog();return}
 if(d.reorder){const o=orders.find(x=>x.id===d.reorder);if(o){o.items.forEach(i=>{const p=byId(i.id);if(p&&p.active&&p.stock>0)cart[i.id]=Math.min(p.stock,(cart[i.id]||0)+i.q)});save();renderNav();openCart();toast('Өмнөх захиалгыг сагсанд нэмлээ')}return}
 if(d.logout!==undefined){user=null;cart={};save();location.hash='#/';renderView();toast('Гарлаа');return}
 if(d.check){t.disabled=true;t.textContent='Шалгаж байна…';setTimeout(()=>{const o=orders.find(x=>x.id===d.check);if(o){o.status='paid';save()}location.hash='#/done/'+d.check},1200);return}
 if(d.bank!==undefined){toast('Бодит сайтад тухайн банкны апп нээгдэнэ');return}
 // admin
 if(d.adminIn!==undefined){admin=true;save();renderView();return}
 if(d.anav!==undefined){location.hash='#/admin'+(d.anav?'/'+d.anav:'');return}
 if(d.order&&t.tagName==='TR'){orderDet(d.order);return}
 if(d.ofl){oFilter=d.ofl;renderView();return}
 if(d.adv){const o=orders.find(x=>x.id===d.adv);if(o){o.status=d.to;save();renderView();orderDet(o.id);toast(`${o.id}: ${STATUS[o.status]}`)}return}
 if(d.print){printSlip(d.print);return}
 if(d.pact){const p=byId(d.pact);p.active=!p.active;save();t.classList.toggle('on',p.active);toast(p.active?'Дэлгүүрт харагдана':'Дэлгүүрээс нуулаа');return}
 if(d.approve!==undefined){customers[+d.approve].status='ok';save();renderView();toast('Харилцагчийг баталлаа · SMS илгээгдэнэ');return}
 if(d.csv!==undefined){const rows=[['code','brand','name','category','pack','unit','spec','price','stock'],...P.map(p=>['EV-'+p.id.slice(1),p.brand,p.name,catName(p.cat),p.pack,p.unit,p.spec,p.price,p.stock])];const csv='﻿'+rows.map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='evrop-baraa-products.csv';a.click();return}
 if(d.import!==undefined){modal(`<div class="login" style="width:min(560px,100%)"><button class="x" type="button" data-close style="float:right">×</button><h3>Excel-ээс бараа оруулах</h3><p>100–500 барааг нэг дор оруулна. Файлын баганууд:</p><table class="t" style="margin-bottom:14px"><tr><th>code</th><th>name</th><th>category</th><th>pack</th><th>price</th><th>stock</th></tr><tr><td class="mono">EV-101</td><td>Love Day 250г</td><td>Жигнэмэг</td><td class="mono">12</td><td class="mono">6700</td><td class="mono">84</td></tr></table><p class="hint">Зургийг кодоор нь (EV-101.jpg) нэг хавтсаар оруулахад автоматаар холбогдоно. Демо-д файл хадгалагдахгүй.</p><button class="btn n" type="button" data-close style="width:100%;margin-top:10px">Ойлголоо</button></div>`);return}
 if(d.newp!==undefined){modal(`<form class="login" id="npform" style="width:min(520px,100%)"><button class="x" type="button" data-close style="float:right">×</button><h3>Шинэ бараа</h3><p>Демо-д зураг ангиллын зургаар харагдана.</p><div class="fld"><label for="n_nm">Нэр</label><input id="n_nm" required></div><div class="g2"><div class="fld"><label for="n_br">Брэнд</label><input id="n_br"></div><div class="fld"><label for="n_ct">Ангилал</label><select id="n_ct">${window.EV_CATS.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select></div></div><div class="g2"><div class="fld"><label for="n_sp">Савлагаа</label><input id="n_sp" placeholder="250г" required></div><div class="fld"><label for="n_pk">Хайрцагт (ш)</label><input id="n_pk" type="number" value="12" required></div></div><div class="g2"><div class="fld"><label for="n_pr">Нэгж үнэ ₮</label><input id="n_pr" type="number" required></div><div class="fld"><label for="n_st">Үлдэгдэл (хайрцаг)</label><input id="n_st" type="number" value="20"></div></div><button class="btn n" type="submit" style="width:100%">Нэмэх</button></form>`);return}
 if(d.reset!==undefined){['products','cart','orders','customers','co'].forEach(k=>{try{localStorage.removeItem('ev_'+k)}catch(_){}});location.reload();return}
},false);
document.addEventListener('change',e=>{
 const t=e.target,d=t.dataset;
 if(d.qty){setQty(d.qty,t.value);return}
 if(t.id==='sort'){ui.sort=t.value;renderCatalog();return}
 if(d.pprice){const p=byId(d.pprice);p.price=Math.max(0,+t.value||0);delete p.ex;save();toast('Үнэ шинэчлэгдлээ');return}
 if(d.pstock){const p=byId(d.pstock);p.stock=Math.max(0,+t.value||0);save();toast('Үлдэгдэл шинэчлэгдлээ');return}
 if(d.driver){const o=orders.find(x=>x.id===d.driver);if(o){o.driver=t.value;save();toast(t.value?`${o.id} → ${t.value}`:'Жолооч хаслаа')}return}
 if(t.form&&t.form.id==='coform'){const fd=new FormData(t.form);const f={method:fd.get('method'),pay:fd.get('pay'),day:fd.get('day'),time:fd.get('time'),note:fd.get('note'),store:fd.get('store'),phone:fd.get('phone'),district:fd.get('district'),khoroo:fd.get('khoroo'),addr:fd.get('addr')};store.set('co',f);if(t.name==='method'||t.name==='pay')renderView()}
});
document.addEventListener('input',e=>{if(e.target.id==='pq'){pq=e.target.value;const pos=e.target.selectionStart;renderView();const n=$('#pq');n.focus();n.setSelectionRange(pos,pos)}});
document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target;
 if(f.id==='lform'){const ph=$('#l_ph').value.replace(/\D/g,''),pin=$('#l_pin').value;if(ph==='99112233'&&pin==='1234'){user={...DEMO};save();closeAll();renderView();toast('Тавтай морил, '+user.store)}else if(customers.some(c=>c.phone===ph&&c.status==='wait')){toast('Таны хүсэлтийг админ хараахан батлаагүй байна')}else toast('Утас эсвэл ПИН буруу байна (демо: 99112233 / 1234)');return}
 if(f.id==='rform'){const st=$('#r_st').value.trim(),ph=$('#r_ph').value.replace(/\D/g,'');if(!st||ph.length!==8){toast('Дэлгүүрийн нэр, 8 оронтой утсаа бичнэ үү');return}customers.push({store:st,phone:ph,district:$('#r_di').value,status:'wait',tier:'Бөөний'});save();closeAll();toast('Хүсэлт илгээгдлээ. Админ баталсны дараа SMS-ээр мэдэгдэнэ.');return}
 if(f.id==='npform'){const id='n'+Date.now().toString(36);const cat=$('#n_ct').value;P.push({id,cat,brand:$('#n_br').value.trim(),name:$('#n_nm').value.trim(),spec:$('#n_sp').value.trim(),pack:Math.max(1,+$('#n_pk').value||1),unit:'ш',price:Math.max(0,+$('#n_pr').value||0),stock:Math.max(0,+$('#n_st').value||0),desc:'',active:true,img:(window.EV_CATS.find(c=>c.id===cat)||{}).img});save();closeAll();renderView();toast('Бараа нэмэгдлээ — дэлгүүрт харагдана');return}
 if(f.id==='coform'){
  const fd=new FormData(f);const method=fd.get('method'),payM=fd.get('pay');const t=totals(method);
  if(t.sub<RULE.min){toast(`Хамгийн бага захиалга ${fmt(RULE.min)}`);return}
  const phone=String(fd.get('phone')||'').replace(/\D/g,'');if(phone.length!==8){toast('Утасны дугаар 8 оронтой байна');$('#f_phone').focus();return}
  if(method==='delivery'&&!String(fd.get('addr')||'').trim()){toast('Хүргэх хаягаа бичнэ үү');$('#f_addr').focus();return}
  const n=String(orders.length+49).padStart(4,'0');const id=`EV-${String(today.getDate()).padStart(2,'0')}${String(today.getMonth()+1).padStart(2,'0')}-${n}`;
  const day=new Date(today.getTime()+(+fd.get('day')+1)*864e5);
  const o={id,store:String(fd.get('store')).trim()||user.store,district:method==='pickup'?'Агуулахаас авна':fd.get('district'),addr:[fd.get('khoroo'),fd.get('addr')].filter(Boolean).join(', '),at:new Date().toISOString(),status:payM==='qpay'?'new':payM==='bank'?'wait':'paid',items:t.lines.map(l=>({id:l.p.id,q:l.q})),sub:t.sub,fee:t.fee,total:t.total,pay:payM,method,when:`${day.getMonth()+1}/${day.getDate()} · ${fd.get('time')}`,note:fd.get('note'),driver:''};
  orders.unshift(o);t.lines.forEach(l=>{l.p.stock=Math.max(0,l.p.stock-l.q)});cart={};save();renderNav();
  location.hash=payM==='qpay'?'#/pay/'+id:'#/done/'+id;return}
});
addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});

renderView();
})();
