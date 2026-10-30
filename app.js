(function(){
  'use strict';
  const E=window.CatiEngine,$=s=>document.querySelector(s),app=$('#app');
  const KEY='cati-forest-draft-v2',LEGACY_KEY='cati-forest-draft-v1',SESSION_KEY='cati-forest-session-v2';
  const SHARE_URL=(()=>{const p=location.pathname.replace(/index\.html$/,'');return location.origin+(p.endsWith('/')?p:p+'/');})();
  const SCALE=['完全不符','比较不符','略不符合','中间状态','略微符合','比较符合','完全符合'];
  const S={version:E.VERSION,mode:'full',answers:{},index:0,save:false,demo:false,result:null};
  let selectedMode='full',saveChoice=false,filter='all',draft=null,draftSave=false,toastTimer;
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  try{const saved=JSON.parse(sessionStorage.getItem(SESSION_KEY));draft=E.validateDraft(saved);draftSave=!!draft&&saved.save===true;}catch{}
  if(!draft)try{draft=E.validateDraft(JSON.parse(localStorage.getItem(KEY)))||E.validateDraft(JSON.parse(localStorage.getItem(LEGACY_KEY)));draftSave=!!draft;}catch{}
  if(draft){
    Object.assign(S,{version:draft.version,mode:draft.mode,answers:{...draft.answers},index:draft.index,save:draftSave});
    selectedMode=draft.mode;saveChoice=draftSave;
  }
  function catSVG(p,variant=0){
    const dark=p.ink||'#64553a',fill=p.color||'#d7b371';
    const light=['black','blue'].includes(p.pattern)?fill:'#f1e6cc';
    const head=['black','blue','silver','curl'].includes(p.pattern)?fill:light;
    const outlines=`stroke="${dark}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"`;
    let pattern='';
    if(p.pattern==='gold'||p.pattern==='stripe')pattern=`<path d="M104 75q9 12 12 27M148 67v29M189 75q-9 12-12 27" fill="none" stroke="${fill}" stroke-width="10" stroke-linecap="round"/><path d="m79 126 22 5m-20 13 21-1m119-17-22 5m20 13-21-1" fill="none" stroke="${fill}" stroke-width="6" stroke-linecap="round"/>`;
    if(p.pattern==='point')pattern=`<path d="M72 114Q73 91 89 82q29 12 33 40-4 25-31 27-17-12-19-35M228 114q-1-23-17-32-29 12-33 40 4 25 31 27 17-12 19-35" fill="${dark}" opacity=".65"/>`;
    if(p.pattern==='cow')pattern=`<path d="M73 112q2-30 30-42 35 2 30 31 0 23-27 35-21 12-33-24" fill="${dark}"/><path d="M175 66q34 0 48 30-16 25-35 16-21-12-13-46" fill="${dark}"/>`;
    if(p.pattern==='calico')pattern=`<path d="M73 112q2-30 30-42 35 2 30 31 0 23-27 35-21 12-33-24" fill="#bc805a"/><path d="M175 66q34 0 48 30-16 25-35 16-21-12-13-46" fill="#61645a"/>`;
    if(p.pattern==='silver')pattern=`<path d="M89 84q11-17 27-17m13-5q21-4 42 0m13 6q17 6 28 23" fill="none" stroke="#8f9f93" stroke-width="10" stroke-linecap="round"/>`;
    if(p.pattern==='curl')pattern=`<g fill="none" stroke="${dark}" stroke-width="2" opacity=".5"><path d="M97 82q-7-12 4-13t7 12M132 70q-7-12 4-13t7 12M171 70q-7-12 4-13t7 12M202 85q-7-12 4-13t7 12M91 154q-7-12 4-13t7 12M208 151q-7-12 4-13t7 12"/></g>`;
    const eyes=variant===1?`<g class="cat-eye" stroke="${dark}" stroke-width="3.4" fill="none" stroke-linecap="round"><path d="m105 120 13 6-13 6m89-12-13 6 13 6"/></g>`:`<g class="cat-eye" fill="none" stroke="${['black','cow'].includes(p.pattern)?'#b2bf93':dark}" stroke-width="3.5" stroke-linecap="round"><path d="M103 123q9-8 18 0m58 0q9-8 18 0"/></g>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" aria-hidden="true"><ellipse cx="150" cy="269" rx="91" ry="9" fill="#7d8e5d" opacity=".12"/><path class="cat-tail" d="M205 241q70 11 57-51-8-29-20-15-8 9 0 27 8 27-29 22" fill="${fill}" ${outlines}/><path d="M108 169q-24 32-23 74 0 22 26 22h77q26-2 26-24-2-42-23-72" fill="${head}" ${outlines}/><ellipse cx="150" cy="223" rx="38" ry="33" fill="${['black','blue'].includes(p.pattern)?'#d4d8c8':light}" opacity=".55"/><path d="M122 220q-11 31-6 42m64-42q11 31 6 42" fill="none" ${outlines}/><path d="M113 262h21m32 0h21" fill="none" ${outlines}/><g class="cat-head"><path d="M77 102 67 39q-1-10 9-5l49 32m49 0 49-32q10-5 9 5l-10 63" fill="${head}" ${outlines}/><path d="m81 52 5 36 24-16m109-20-5 36-24-16" fill="#d8b6a5" opacity=".8"/><path d="M73 112Q72 63 149 63q79 0 79 49 13 68-78 75-91-7-77-75" fill="${head}" ${outlines}/>${pattern}<ellipse cx="99" cy="143" rx="12" ry="6" fill="#dc9d8a" opacity=".45"/><ellipse cx="201" cy="143" rx="12" ry="6" fill="#dc9d8a" opacity=".45"/>${eyes}<path d="m144 138 6 4 6-4" fill="${dark}" stroke="${dark}" stroke-width="2.5" stroke-linejoin="round"/><path d="M150 142v6q-7 10-13 0m13 0q7 10 13 0" fill="none" ${outlines}/><path d="m64 131 25 6m-27 9 26-1m148-14-25 6m27 9-26-1" fill="none" ${outlines}/></g><path d="M136 186q14 7 28 0" fill="none" stroke="${p.pattern==='gold'?'#a3ad7a':dark}" stroke-width="5"/><circle cx="150" cy="192" r="6" fill="#c6a566" stroke="${dark}" stroke-width="1.4"/><path d="M150 190v4" stroke="${dark}" stroke-width="1.3"/></svg>`;
  }
  function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3200);}
  function has(id){return Object.prototype.hasOwnProperty.call(S.answers,id);}
  function persist(){
    if(S.demo)return;
    const value={version:S.version,mode:S.mode,index:S.index,answers:S.answers,save:S.save};
    draft=E.validateDraft(value);draftSave=S.save;
    try{sessionStorage.setItem(SESSION_KEY,JSON.stringify(value));}catch{}
    if(S.save)try{localStorage.setItem(S.version==='1.0'?LEGACY_KEY:KEY,JSON.stringify(value));}catch{S.save=false;draftSave=false;toast('浏览器无法保存长期进度，本次仍可继续作答。');}
  }
  function go(route){if(location.hash==='#'+route)render();else location.hash=route;}
  function home(){
    const memory=Object.keys(S.answers).length>0;
    const saved=memory?{version:S.version,mode:S.mode,answers:S.answers,index:S.index}:draft;
    const savedN=saved?Object.keys(saved.answers).length:0;
    app.innerHTML=`<div class="wrap"><section class="hero"><div class="hero-copy"><div class="mini-badge"><b>✦</b> 一场关于你的，猫系性格探索</div><h1>每个你，<br>都有一点<span>猫。</span></h1><p class="hero-lead">有时热闹，有时只想晒晒太阳。<br>不急着给自己贴标签，来森林里走一走，<br>遇见那个<strong>多面、真实，又有一点可爱的你。</strong></p><div class="hero-metrics"><div class="metric"><b>48</b><span>道原创题目<br>多一点细腻</span></div><div class="metric"><b>8</b><span>个观察维度<br>多一种理解</span></div><div class="metric"><b>12</b><span>种猫系原型<br>不止一面</span></div></div></div><div class="hero-art" aria-label="两只在森林里休息的小猫插画" role="img"><div class="art-backdrop"></div><div class="orbit"></div><div class="art-note">你好呀，新朋友</div><div class="hero-cat">${catSVG(E.PROFILES[0])}</div><div class="floating-cat">${catSVG(E.PROFILES[4],1)}</div><span class="art-sticker"><i>☀</i> 正在加载你的松弛感…</span><span class="art-sticker right">允许自己，多面一点 ♡</span><span class="spark one">✧</span><span class="spark two">✳</span><span class="spark three">✧</span><span class="art-caption">STAY CURIOUS. STAY YOURSELF.</span></div></section>
    <section class="begin-panel" aria-labelledby="begin-title"><div class="panel-intro"><div class="eyebrow">YOUR LITTLE EXPEDITION</div><h2 id="begin-title">选一个节奏，认识自己。</h2><p>没有标准答案，也没有更好的性格。<br>按照最近三个月里，通常的你来选择就好。</p><div class="privacy">◈ 答案仅在浏览器中计算，不上传问卷</div></div><div>${savedN?`<div class="resume-box"><span>${saved.version==='1.0'?'你保留了一份旧版':'你还有一份'}${saved.mode==='quick'?'轻量':'完整'}探索 · 已选择 ${savedN}/${E.getQuestions(saved.mode,saved.version).length} 题</span><button class="text-button" data-action="resume">${savedN===E.getQuestions(saved.mode,saved.version).length?'查看我的报告':'继续探索'} →</button></div>`:''}<div class="mode-picker" role="group" aria-label="选择探索模式"><button class="mode-card ${selectedMode==='quick'?'selected':''}" aria-pressed="${selectedMode==='quick'}" data-mode="quick"><span class="mode-top"><strong>轻量漫步</strong><small>24 题</small><span class="mode-radio"></span></span><p>8 道评分 + 16 道情境 · 约 5–8 分钟</p></button><button class="mode-card ${selectedMode==='full'?'selected':''}" aria-pressed="${selectedMode==='full'}" data-mode="full"><span class="mode-top"><strong>深入森林</strong><small>48 题 · 推荐</small><span class="mode-radio"></span></span><p>16 道评分 + 32 道情境 · 约 10–15 分钟</p></button></div><div class="mode-action"><button class="primary" data-action="start">${savedN?'开始新的探索':'出发，遇见猫系的我'} <span>↗</span></button><button class="text-button" data-action="demo">先看看示例报告</button></div><label class="save-label"><input id="save-choice" type="checkbox" ${saveChoice?'checked':''}> 在这台设备保存答题进度（可随时清除）</label></div></section>
    <section class="intro-strip" aria-label="探索特点"><div class="intro-item"><span class="intro-icon">◌</span><div><h3>三分之二情境，选你会怎么做</h3><p>散步、分享、相处小事，让文字带你认识自己。</p></div></div><div class="intro-item"><span class="intro-icon">♧</span><div><h3>八个维度，看见多面的你</h3><p>先理解偏好，再遇见相似的猫咪原型。</p></div></div><div class="intro-item"><span class="intro-icon">✧</span><div><h3>保留模糊，也是一种认真</h3><p>混合类型、情境变化和信息不足都会说明。</p></div></div></section>
    <section class="peek"><div class="section-heading"><div><h2>森林里，会遇见谁？</h2><p>猫咪只是比喻，每一种性格都有自己的可爱。</p></div><a class="small-link" href="#atlas">认识全部 12 种小猫 ↗</a></div><div class="peek-grid">${[E.PROFILES[0],E.PROFILES[1],E.PROFILES[2],E.PROFILES[4]].map(p=>`<button class="peek-cat" data-cat="${p.id}">${catSVG(p)}<span><strong>${p.name}</strong><small>${p.tags[0]} · ${p.tags[1]}</small></span></button>`).join('')}</div></section><section class="invite-panel"><div><div class="eyebrow">GOOD THINGS ARE BETTER SHARED</div><h2>也许，你的朋友也是一只小猫。</h2><p>把森林入口留给他们，各自走一走，再交换彼此的小发现。</p></div><button class="primary" data-action="share">邀请朋友来测 <span>↗</span></button></section></div>`;
  }
  function start(){Object.assign(S,{version:E.VERSION,mode:selectedMode,answers:{},index:0,save:saveChoice,demo:false,result:null});if(!S.save){try{localStorage.removeItem(KEY);draft=null;}catch{}}persist();go('quiz');}
  function resume(){
    if(Object.keys(S.answers).length){S.demo=false;if(Object.keys(S.answers).length===E.getQuestions(S.mode,S.version).length){S.result=E.score(S.mode,S.answers,S.version);go('result');}else{S.result=null;go('quiz');}return;}
    if(!draft){toast('没有找到可以继续的进度。');return;}
    Object.assign(S,{version:draft.version,mode:draft.mode,answers:{...draft.answers},index:draft.index,save:draftSave,demo:false,result:null});if(Object.keys(S.answers).length===E.getQuestions(S.mode,S.version).length){S.result=E.score(S.mode,S.answers,S.version);go('result');}else go('quiz');
  }
  function quiz(){
    const qs=E.getQuestions(S.mode,S.version);S.index=Math.min(S.index,qs.length-1);const q=qs[S.index],a=S.answers[q.id];
    const n=Object.keys(S.answers).length;
    app.innerHTML=`<section class="quiz-shell"><div class="quiz-meta"><span>${S.mode==='full'?'深入森林':'轻量漫步'}</span><span>第 ${S.index+1} / ${qs.length} 题 · 已选择 ${n} 题</span><button class="text-button" data-action="home">暂歇一下 ↗</button></div><div class="progress-track" role="progressbar" aria-label="已选择题目" aria-valuemin="0" aria-valuemax="${qs.length}" aria-valuenow="${n}"><div class="progress-fill" style="width:${n/qs.length*100}%"></div></div><div class="quiz-paper"><div class="q-top"><span class="q-number">${String(S.index+1).padStart(2,'0')}<span style="font-size:18px"> /</span></span><span class="context-tag">${q.type==='scale'?'评分小停顿':'情境小故事'} · ${q.context}</span></div><h1 class="question" id="question-text" tabindex="-1">${q.text}</h1><p class="q-instruction">${q.type==='scale'?'回想最近三个月：这句话在多大程度上符合通常的你？':'把自己放进这个小场景，选一个最像你会做的回应。每一种选择都可以。'}</p><div class="${q.type==='scale'?'scale':'scenario-options'}" role="radiogroup" aria-labelledby="question-text">${(q.type==='scale'?SCALE:q.options).map((label,i)=>`<button class="${q.type==='scale'?'scale-option':'scenario-option'} ${a?.value===i?'selected':''}" role="radio" aria-checked="${a?.value===i}" tabindex="${a?.value===i||(!a||a.value===null)&&i===0?0:-1}" data-answer="${i}"><span class="${q.type==='scale'?'circle':''}">${q.type==='scale'?i+1:String.fromCharCode(65+i)}</span><span>${label}</span></button>`).join('')}</div><button class="skip-option ${a?.value===null?'selected':''}" aria-pressed="${a?.value===null}" data-answer="skip">${a?.value===null?'✓ ':''}不确定 / 不适用（不计入分数）</button><label class="context-check"><input id="context-check" type="checkbox" ${a?.contextual?'checked':''}> 这道题很看情境，我在不同场合会不一样</label><div class="quiz-controls"><button class="secondary" data-action="previous" ${S.index===0?'disabled':''}>← 上一题</button><button class="primary" data-action="next" ${!has(q.id)?'disabled':''}>${S.index===qs.length-1?'生成我的探索报告':'下一题'} <span>→</span></button></div></div><p class="quiz-note">可以返回修改 · 中间状态会计分，不确定不会计分<br>${S.save?'已开启本机保存；答案不会发送至服务器。':'本标签页临时保留进度，可刷新后继续；跨次访问请开启本机保存。'}</p><details class="question-map"><summary>查看答题地图 / 跳转题目（${n}/${qs.length}）</summary><div class="map-grid">${qs.map((item,i)=>`<button class="map-button ${S.answers[item.id]?.value===null?'skipped':has(item.id)?'answered':''} ${i===S.index?'current':''}" aria-label="第 ${i+1} 题${S.answers[item.id]?.value===null?'，已选不确定':has(item.id)?'，已回答':'，未回答'}" data-question="${i}">${i+1}</button>`).join('')}</div></details></section>`;
  }
  function next(){
    const qs=E.getQuestions(S.mode,S.version);if(!has(qs[S.index].id))return;
    if(S.index<qs.length-1){S.index++;persist();quiz();$('#question-text').focus({preventScroll:true});window.scrollTo({top:0,left:0,behavior:'instant'});return;}
    const missing=qs.findIndex(q=>!has(q.id));if(missing>=0){S.index=missing;persist();quiz();$('#question-text').focus({preventScroll:true});window.scrollTo({top:0,left:0,behavior:'instant'});toast('还有未选择的题目；不适用时可以选“不确定”。');return;}
    S.result=E.score(S.mode,S.answers,S.version);S.demo=false;persist();go('result');
  }
  function demo(){
    const answers={};E.getQuestions('full').forEach((q,i)=>{const vector=E.PROFILES[0].vector[E.DIMS.findIndex(d=>d.id===q.dim)];const v=Math.max(0,Math.min(1,vector+([-.12,.04,.14,-.05,.08,0][q.slot])));answers[q.id]={value:q.values?q.values.reduce((best,x,j)=>Math.abs(x-(v*2-1))<Math.abs(q.values[best]-(v*2-1))?j:best,0):Math.round((q.reverse?1-v:v)*6),contextual:i===2||i===19};});
    S.result=E.score('full',answers);S.demo=true;go('result');
  }
  function qualityLines(r){
    const lines=[`有效回答 ${r.answered}/${r.total} 题；不确定 / 不适用 ${r.skipped} 题。`];
    if(!r.enough)lines.push('有些场景还没有留下足够的回答，我们先保留这些空白，不急着为你贴上猫咪标签。');
    if(r.mode==='quick')lines.push('轻量模式每维只有 3 题，结果仅描绘初步轮廓。');
    const thin=r.dimensions.filter(d=>d.n<d.total/2+1).map(d=>d.name);if(thin.length)lines.push(`${thin.join('、')}的有效题目较少，请少做确定推断。`);
    const mixed=r.dimensions.filter(d=>d.mixed).map(d=>d.name);if(mixed.length)lines.push(`${mixed.join('、')}中出现了方向不同的回答，可能与场合或题意有关。`);
    if(r.contextual)lines.push(`你标记了 ${r.contextual} 道“很看情境”的题目；标记用于补充说明，不参与计分。`);
    if(r.uniform)lines.push('量表题选择了同一档。它可能反映真实偏好，也可能遗漏题目方向的变化，可以回看确认。');
    if(r.ranked.length&&r.ranked[0].distance>.3)lines.push('你的维度组合与现有原型仍有较大距离，猫咪标签的参考价值有限。');
    lines.push('上述提示是答题覆盖与差异的描述，不是统计置信度，也不是测验效度证明。');return lines;
  }
  function dimHtml(d,detail=true){
    const reflection=detail?E.getReflection(d):null;
    return `<div class="dim-item"><div class="dim-head"><b>${d.name}${d.mixed?'<small class="dim-status">情境差异</small>':''}</b><span>${d.score===null?'暂无分数':d.score+' / 100'} · ${d.n}/${d.total} 题</span></div><div class="dim-track">${d.score===null?'':`<span class="dim-marker" style="left:${d.score}%;--dim-color:${d.color}"></span>`}</div><div class="dim-labels"><span>${d.low}</span><span>${d.high}</span></div>${detail?`<details class="dim-detail"><summary>这意味着什么？<span>读一封关于自己的小信</span></summary><div class="reflection-body"><p>${reflection.intro}</p><h4>这份偏好的温度</h4><p>${reflection.strength}</p><h4>也照顾一下自己</h4><p>${reflection.care}</p><h4>想表达需要时，可以借用这句话</h4><blockquote>${reflection.words}</blockquote>${reflection.notes.map(note=>`<p class="reflection-note">${note}</p>`).join('')}</div></details>`:''}</div>`;
  }
  function result(){
    const r=S.result;if(!r){app.innerHTML=`<div class="result-wrap"><div class="empty-report"><h1>还没有属于你的报告</h1><p>选择一个节奏，从一份小小的问卷开始吧。</p><a class="primary" href="#home">回到森林入口 ↗</a></div></div>`;return;}
    const p=r.ranked[0],mixed=r.nearest.length>1;
    const letter=E.getRelationshipLetter(r);
    const quality=qualityLines(r);
    const title=!r.enough?'先保留，你的多种可能':mixed?'你是一只，混合系小猫':p.name;
    const subtitle=!r.enough?'信息还不够，不急着下结论':mixed?r.nearest.map(p=>p.name).join(' × '):p.title;
    app.innerHTML=`<div class="result-wrap">${S.demo?'<div class="report-banner">✧ 这是演示数据生成的示例报告，不代表你的性格。<button class="text-button" data-action="home">开始我的探索 →</button></div>':''}<section class="report-top"><div><div class="eyebrow">${S.demo?'SAMPLE EXPLORATION':'YOUR CATI PORTRAIT'} · ${r.mode==='quick'?'LIGHT':'FULL'}</div><h1>${title}</h1><p class="report-sub">${subtitle}</p><p class="report-desc">${!r.enough?'你已经提供了一些线索，下面保留可用的维度信息。补充更多有效回答后，再看看与哪些猫咪更相似。':mixed?'几种猫咪与你的维度组合距离接近，没必要硬分出唯一答案。下面的八维轮廓，比一个名字更能描述你。':p.desc}</p>${p?`<div class="tag-row">${(mixed?['不止一种节奏','保留多面性']:p.tags).map(t=>`<span class="tag">${t}</span>`).join('')}</div>`:''}<div class="report-actions"><button class="primary" data-action="share">邀请朋友来测 ↗</button><button class="secondary" data-action="export">保存文字报告 ↓</button>${p?'<button class="secondary" data-action="postcard">保存猫咪卡片 ↓</button>':''}${!S.demo?'<button class="secondary" data-action="review">回看并修改</button>':''}<button class="secondary" data-action="home">返回入口</button></div></div><div class="result-art">${catSVG(p||E.PROFILES[7])}</div></section><div class="report-grid"><section class="report-card"><h2>你的八维性格轮廓</h2><p class="card-caption">0 与 100 表示两端偏好，无好坏之分。<br>这是回答的换算指数，不是人群百分位或准确率。</p><div class="reflection-controls"><button class="text-button" data-action="expand-reflections">展开全部解读</button><button class="text-button" data-action="collapse-reflections">收起解读</button></div>${r.dimensions.map(d=>dimHtml(d)).join('')}</section><div><section class="report-card"><h2>与你相近的猫咪</h2><p class="card-caption">这些小猫与你的回答有相近的气质。<br>你可以同时像好几只，每一面都有自己的可爱。</p>${r.ranked.length?r.ranked.slice(0,Math.max(3,r.nearest.length)).map((p,i)=>`<div class="prototype-item">${catSVG(p,i===2?1:0)}<div><h3>${p.name}${r.nearest.includes(p)?' · 相近原型':''}</h3><p>${p.tags.join(' · ')}</p></div><div class="prototype-index">${Math.round((1-p.distance)*100)}<small>贴近指数 / 100</small></div></div>`).join(''):'<p class="no-type">信息不足，暂不分配猫系类型。</p>'}<a class="small-link" href="#atlas">原型只是比喻，去看看图鉴 ↗</a></section><section class="report-card relationship-letter" style="margin-top:23px"><h2>一份相处使用说明</h2><h3>${letter.heading}</h3><p class="relationship-paragraph">${letter.text}</p><span class="letter-signature">愿每一种节奏，都被温柔理解。</span></section></div><section class="report-card report-wide"><h2>这次探索的小记录</h2><div class="quality"><h3>把不确定，也写进报告</h3>${quality.map(line=>`<p>${line}</p>`).join('')}</div><p class="card-caption">本问卷为原创探索工具，尚无常模、信效度验证或诊断用途。猫名不是生物学性格结论，也不能预测谁与你最适合。</p>${!S.demo?`<div class="report-actions"><button class="secondary" data-action="review">返回补充 / 修改答案</button><button class="text-button" data-action="clear">清除本机保存的进度</button></div>`:''}</section></div><p class="report-end">保留你的变化，也保留你的可爱。 · CATI 森林</p></div>`;
  }
  function atlas(){
    const profiles=E.PROFILES.filter(p=>filter==='all'||filter==='social'&&p.vector[0]>.6||filter==='quiet'&&p.vector[0]<.4||filter==='middle'&&p.vector[0]>=.4&&p.vector[0]<=.6);
    app.innerHTML=`<div class="wrap"><div class="page-head"><div class="eyebrow">THE CATI FIELD GUIDE</div><h1>十二只猫，十二种可爱。</h1><p>它们是帮助理解偏好的原创比喻，不是固定分类，也不是猫品种的真实性格结论。你可以同时像好几只，也可以和它们都不太一样。</p></div><div class="filter-row" role="group" aria-label="按原型社交偏好筛选">${[['all','所有小猫'],['social','偏互动充电'],['quiet','偏独处充电'],['middle','居中节奏']].map(([id,label])=>`<button class="filter ${filter===id?'selected':''}" data-filter="${id}" aria-pressed="${filter===id}">${label}</button>`).join('')}</div><div class="atlas-grid">${profiles.map(p=>`<button class="cat-card" data-cat="${p.id}" aria-label="查看${p.name}原型详情"><div class="card-art" style="--cat-bg:${p.color}25"><span class="serial">CAT. ${String(E.PROFILES.indexOf(p)+1).padStart(2,'0')}</span>${catSVG(p,E.PROFILES.indexOf(p)%3===1?1:0)}</div><div class="card-body"><h2>${p.name} <span style="font:12px var(--sans);float:right;color:#99a486">↗</span></h2><p>${p.title}</p><div class="tag-row">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div></div></button>`).join('')}</div></div>`;
  }
  function showCat(id){
    const p=E.PROFILES.find(x=>x.id===id);if(!p)return;
    $('#dialog-body').innerHTML=`<div class="dialog-hero">${catSVG(p)}<div><div class="eyebrow">CATI ARCHETYPE</div><h2 id="dialog-title">${p.name}</h2><p>${p.title}</p><div class="tag-row">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div></div></div><p class="dialog-desc">${p.desc}</p><p class="dialog-note">猫咪是一种温柔的比喻。你可以同时像好几只，也可以和它们都不太一样。</p>`;
    $('#cat-dialog').setAttribute('aria-labelledby','dialog-title');$('#cat-dialog').showModal();
  }
  function download(name,content,type){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);toast('已开始下载，请查看浏览器的下载列表。');}
  function exportReport(){
    const r=S.result;if(!r)return;
    const title=r.enough?r.nearest.map(p=>p.name).join(' × '):'信息不足，暂不分配类型';
    const lines=[`# CATI 森林 · ${S.demo?'示例报告（演示数据）':'猫系探索报告'}`,'',`问卷版本：${r.version} | 模式：${r.mode==='full'?'48 题完整模式':'24 题轻量模式'}`,`生成时间：${new Date().toLocaleString('zh-CN')}`,'',`猫系原型：${title}`,'','本报告为原创非标准化自我探索工具，不是心理诊断。','','## 一份相处使用说明',E.getRelationshipLetter(r).heading,E.getRelationshipLetter(r).text,'',...r.dimensions.flatMap(d=>[`## ${d.name}`,`${d.low} ← ${d.score??'无分数'} / 100 → ${d.high}`,`有效题量 ${d.n}/${d.total}${d.mixed?'；存在情境差异':''}${d.contextual?'；有“很看情境”标记':''}`,E.getReflection(d).intro,'这份偏好的温度：'+E.getReflection(d).strength,'也照顾一下自己：'+E.getReflection(d).care,'可以这样说：'+E.getReflection(d).words,...E.getReflection(d).notes,'']),'## 相近原型（贴近指数不是概率）',...r.ranked.slice(0,Math.max(3,r.nearest.length)).map(p=>`- ${p.name}：${Math.round((1-p.distance)*100)} / 100`),'','## 这次探索的小记录',...qualityLines(r).map(x=>'- '+x),'','八维框架与猫咪原型均未经信效度验证。无常模，无准确率声明；不用于诊断、招聘、能力或伴侣匹配。'];
    download(`CATI森林_${S.demo?'示例报告':'探索报告'}.md`,lines.join('\n'),'text/markdown;charset=utf-8');
  }
  function postcard(){
    const r=S.result;if(!r?.ranked.length)return;const p=r.ranked[0],mixed=r.nearest.length>1;
    const title=mixed?'混合系小猫':p.name,sub=mixed?r.nearest.map(x=>x.name).join(' × '):p.title;
    const cat=catSVG(p).replace(/<svg[^>]*>/,'<svg x="150" y="180" width="500" height="500" viewBox="0 0 300 300">');
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect width="800" height="1000" rx="35" fill="#f5f4eb"/><rect x="30" y="30" width="740" height="940" rx="22" fill="none" stroke="#d8decc"/><text x="65" y="92" fill="#526f55" font-family="sans-serif" font-size="28" font-weight="bold">cati+ 森林</text><text x="735" y="90" text-anchor="end" fill="#8d9980" font-family="sans-serif" font-size="15">${S.demo?'演示数据 · 示例卡片':'MY LITTLE CATI PORTRAIT'}</text><circle cx="400" cy="421" r="235" fill="#e7ecdc"/>${cat}<text x="400" y="735" text-anchor="middle" fill="#3a4c39" font-family="serif" font-size="55">${esc(title)}</text><text x="400" y="792" text-anchor="middle" fill="#7d8d6e" font-family="sans-serif" font-size="22">${esc(sub)}</text><text x="400" y="872" text-anchor="middle" fill="#929c85" font-family="sans-serif" font-size="17">每一种节奏，都值得被温柔理解。</text><text x="400" y="930" text-anchor="middle" fill="#a0a791" font-family="sans-serif" font-size="13">CATI Forest ${r.version} · 趣味自我探索 · 非标准化心理测量</text></svg>`;
    download(`CATI森林_${title}${S.demo?'_示例':''}.svg`,svg,'image/svg+xml;charset=utf-8');
  }
  function clearSaved(){try{localStorage.removeItem(KEY);localStorage.removeItem(LEGACY_KEY);sessionStorage.removeItem(SESSION_KEY);draft=null;draftSave=false;S.save=false;saveChoice=false;toast('本机保存的进度已清除，当前页面仍可继续作答。');if(location.hash==='#home')home();}catch{toast('浏览器未允许清除存储，可在站点设置中处理。');}}
  function render(){
    const requested=location.hash.slice(1)||'home';const route=['home','quiz','atlas','result'].includes(requested)?requested:'home';if(route!==requested)history.replaceState(null,'','#home');document.querySelectorAll('[data-nav]').forEach(a=>{a.classList.toggle('active',a.dataset.nav===route);if(a.dataset.nav===route)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    if(route==='quiz'){if(S.demo){S.demo=false;S.result=null;}quiz();}else if(route==='atlas')atlas();else if(route==='result'){
      if(!S.demo)S.result=Object.keys(S.answers).length===E.getQuestions(S.mode,S.version).length?E.score(S.mode,S.answers,S.version):null;
      result();
    }else home();
    document.title=({atlas:'猫咪图鉴',quiz:'正在探索',result:S.demo?'示例报告':'我的探索报告'}[route]||'每个你，都有一点猫')+' · CATI 森林';
    window.scrollTo({top:0,left:0,behavior:'instant'});
  }
  app.addEventListener('click',e=>{
    const el=e.target.closest('button,a');if(!el||el.disabled)return;
    if(el.dataset.mode){selectedMode=el.dataset.mode;home();return;}
    if(el.dataset.cat){showCat(el.dataset.cat);return;}
    if(el.dataset.filter){filter=el.dataset.filter;atlas();return;}
    if(el.dataset.question!==undefined){S.index=Number(el.dataset.question);persist();quiz();window.scrollTo({top:0,left:0,behavior:'instant'});return;}
    if(el.dataset.answer!==undefined){const q=E.getQuestions(S.mode,S.version)[S.index];S.answers[q.id]={value:el.dataset.answer==='skip'?null:Number(el.dataset.answer),contextual:$('#context-check').checked};S.result=null;persist();const scroll=window.scrollY;quiz();window.scrollTo(0,scroll);const chosen=app.querySelector(`[data-answer="${el.dataset.answer}"]`);chosen?.focus({preventScroll:true});return;}
    const action=el.dataset.action;
    if(action==='share')openShare();else if(action==='start')start();else if(action==='resume')resume();else if(action==='home')go('home');else if(action==='next')next();else if(action==='previous'){if(S.index>0){S.index--;persist();quiz();window.scrollTo({top:0,left:0,behavior:'instant'});}}else if(action==='demo')demo();else if(action==='review'){S.demo=false;S.index=0;persist();go('quiz');}else if(action==='export')exportReport();else if(action==='postcard')postcard();else if(action==='clear')clearSaved();else if(action==='expand-reflections'||action==='collapse-reflections'){app.querySelectorAll('.dim-detail').forEach(detail=>detail.open=action==='expand-reflections');}
  });
  app.addEventListener('change',e=>{if(e.target.id==='save-choice'){saveChoice=e.target.checked;}else if(e.target.id==='context-check'){const q=E.getQuestions(S.mode,S.version)[S.index];if(has(q.id)){S.answers[q.id].contextual=e.target.checked;persist();}}});
  app.addEventListener('keydown',e=>{
    const target=e.target.closest('[role="radio"]');if(!target)return;
    if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key)){
      e.preventDefault();const opts=[...app.querySelectorAll('[role="radio"]')],i=opts.indexOf(target),nextIndex=e.key==='Home'?0:e.key==='End'?opts.length-1:(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+opts.length)%opts.length;opts[nextIndex].click();
    }
  });
  function openShare(){
    $('#share-url').value=SHARE_URL;$('#share-copy-status').textContent='';
    $('#native-share').hidden=typeof navigator.share!=='function';
    $('#share-dialog').showModal();
  }
  async function copyTestLink(){
    const field=$('#share-url');let copied=false;
    if(navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(SHARE_URL);copied=true;}catch{}
    if(!copied){field.focus();field.select();field.setSelectionRange(0,field.value.length);try{copied=document.execCommand('copy');}catch{}}
    $('#share-copy-status').textContent=copied?'链接已复制，粘贴给朋友就可以邀请他们来测试。':'链接已选中，可以长按或使用浏览器的复制功能。';
    if(copied)toast('测试首页链接已复制。');
  }
  $('#copy-test-link').addEventListener('click',copyTestLink);
  $('#native-share').addEventListener('click',async()=>{
    try{await navigator.share({title:'测测你是什么小猫 · CATI 森林',text:'24 / 48 题，在生活中的选择里遇见你的猫系人格。你也来森林里走一走吧。',url:SHARE_URL});}
    catch(error){if(error?.name!=='AbortError')$('#share-copy-status').textContent='暂时无法打开系统分享，可以用复制链接邀请朋友。';}
  });
  $('#share-dialog .close-share').addEventListener('click',()=>$('#share-dialog').close());
  $('#share-dialog').addEventListener('click',e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close();}});
  $('#cat-dialog .close-dialog').addEventListener('click',()=>$('#cat-dialog').close());
  $('#cat-dialog').addEventListener('click',e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close();}});
  window.addEventListener('hashchange',render);render();
})();
