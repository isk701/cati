/* CATI Forest 2.0 — original, non-standardised self-exploration questionnaire. */
(function(root){
  'use strict';
  const VERSION='2.0';
  const CONTENT=root.CatiContent||(typeof require==='function'?require('./content.js'):null);
  const DIMS = [
    {id:'social',name:'社交能量',low:'独处充电',high:'互动充电',short:'社交',color:'#729580',lowText:'你可能需要独处来恢复精力，喜欢有选择地参与社交。',highText:'交流和共同活动可能让你更有精神，你喜欢把想法带进人群。',tipLow:'把独处时间提前告诉身边的人，让安静不必被误读。',tipHigh:'约人之前问问彼此的精力，也给自己保留不用回应的时间。'},
    {id:'bond',name:'亲近节奏',low:'自在留白',high:'频繁联结',short:'联结',color:'#c68e70',lowText:'你倾向于给关系留出空间，联系频率不一定代表在意程度。',highText:'你倾向于通过分享和陪伴感受联结，日常回应对你有意义。',tipLow:'可以直接说明：我需要自己的空间，也同样在意这段关系。',tipHigh:'把希望得到的回应说具体，也一起商量双方舒服的频率。'},
    {id:'explore',name:'探索倾向',low:'熟悉安心',high:'尝鲜好奇',short:'探索',color:'#b6a26c',lowText:'熟悉的环境与做法让你更自在，你愿意把喜欢的事情做深。',highText:'你容易被新的经验和点子吸引，喜欢为日常打开不同入口。',tipLow:'如果想尝试变化，可以从一个小而可控的新体验开始。',tipHigh:'给新点子排个顺序，把最想尝试的一件真正做完。'},
    {id:'order',name:'生活结构',low:'灵活随兴',high:'计划有序',short:'秩序',color:'#879aab',lowText:'你习惯留出调整空间，愿意根据当下的情况改变安排。',highText:'明确的安排和节奏能减少你的负担，你喜欢提前心里有数。',tipLow:'给必要的截止时间留一个提醒，让自由也有支点。',tipHigh:'安排里留一点缓冲，变化不必意味着原本的计划失败。'},
    {id:'express',name:'表达方式',low:'含蓄内敛',high:'直接表达',short:'表达',color:'#bd8d9a',lowText:'你可能会先在心里整理感受，再用比较含蓄的方式表达。',highText:'你倾向于把感受和需要说出来，让别人知道你正在经历什么。',tipLow:'可以先说一句简短的需要，不必等到完全想清楚才开口。',tipHigh:'表达时给对方一点回应的时间，也区分感受与推断。'},
    {id:'care',name:'支持风格',low:'尊重自主',high:'主动照料',short:'照料',color:'#9b9e71',lowText:'你更愿意相信对方能够处理事情，支持常体现为尊重和留白。',highText:'你会主动留意他人的需要，支持常体现为具体的关心与行动。',tipLow:'有时一句“需要我陪你吗”就能让留白变得更温暖。',tipHigh:'先问对方想要陪伴、建议还是实际帮助，让照顾更合适。'},
    {id:'sensitive',name:'感受敏锐度',low:'较少受扰',high:'细腻感知',short:'感知',color:'#a797b0',lowText:'你较少被细微的气氛变化牵动，容易把注意力放在眼前的事上。',highText:'你容易注意到语气、气氛或环境的变化，内在体验可能很丰富。',tipLow:'遇到不理解的反应时，可以多问一句对方当时的感受。',tipHigh:'把观察和猜测分开，给不确定的信号留几种解释。'},
    {id:'pace',name:'行动节奏',low:'从容蓄力',high:'即刻启动',short:'行动',color:'#c39b67',lowText:'你喜欢先消化、再行动，以自己的节奏慢慢进入状态。',highText:'想法容易转化为行动，你习惯先开始，再在过程中调整。',tipLow:'把第一步缩小到容易开始的程度，不用一次准备好全部。',tipHigh:'在重要决定前留一个短暂停顿，确认资源和边界。'}
  ];
  const RAW = [
    ['social',[
      ['和熟悉的人聊完天后，我通常比聊天前更有精神。',1,'朋友'],
      ['连续参加几次聚会后，我需要较长的独处时间来恢复。',-1,'日常'],
      ['面对不熟悉的小组，我通常愿意先开启话题。',1,'学习 / 工作'],
      ['即使有空，我也常更想独自度过一个周末。',-1,'日常'],
      ['遇到有趣的事情，我倾向于马上找人一起交流。',1,'朋友'],
      ['一个没有安排的休息日下午，你通常更想怎样度过？',['自己待着，不安排交流','主要自己待着，偶尔回消息','独处或见人都可以','找一两个人一起做点事','组织大家见面或一起活动'],'日常']
    ]],
    ['bond',[
      ['在亲近的关系里，我希望经常分享日常的小事。',1,'亲近关系'],
      ['即使和在意的人暂时不联系，我也能自在地过好自己的日子。',-1,'亲近关系'],
      ['一起做普通的小事，也会让我觉得关系更亲近。',1,'亲近关系'],
      ['我希望亲近的人各自保留较多不必同步的时间。',-1,'亲近关系'],
      ['遇到好消息时，尽快告诉在意的人对我很重要。',1,'亲近关系'],
      ['你与一位很亲近的人各自忙了一周。周末你更希望？',['各自休息，有事再联系','简单问候，主要各自安排','商量双方此刻更想怎么过','留出一段时间好好相处','多待在一起，分享这一周'],'亲近关系']
    ]],
    ['explore',[
      ['有机会时，我愿意尝试从没接触过的活动。',1,'日常'],
      ['选择吃饭或出游地点时，我常优先选熟悉可靠的地方。',-1,'日常'],
      ['遇到不同于自己的观点，我常想继续了解。',1,'学习 / 工作'],
      ['我更愿意沿用已经顺手的方法，而不是尝试新的工具。',-1,'学习 / 工作'],
      ['新鲜的题材或体验很容易吸引我的注意。',1,'日常'],
      ['有一整天可以自由探索一座城市，你会更偏向？',['去以前熟悉、喜欢的地方','围绕熟悉的活动安排一天','熟悉的和新鲜的各占一些','主要尝试未体验过的地方','把时间留给完全陌生的路线'],'日常']
    ]],
    ['order',[
      ['有几件事要做时，我习惯先确定顺序或时间。',1,'学习 / 工作'],
      ['我喜欢在出发之后，再决定当天的具体安排。',-1,'日常'],
      ['清楚知道接下来要做什么，会让我感到轻松。',1,'日常'],
      ['比起固定流程，我更习惯临场调整做事方式。',-1,'学习 / 工作'],
      ['重要任务开始前，我通常会整理所需的材料或步骤。',1,'学习 / 工作'],
      ['和朋友安排一个短途旅行时，你理想中的准备是？',['只定目的地，其他到时再说','准备少量信息，随时调整','只把最重要的部分定下来','提前列好大部分行程','把时间、路线和备选方案都梳理好'],'朋友']
    ]],
    ['express',[
      ['我通常能直接告诉别人自己希望怎样被对待。',1,'亲近关系'],
      ['有情绪时，我更习惯让对方通过细节慢慢察觉。',-1,'亲近关系'],
      ['当我欣赏一个人时，我愿意明确告诉对方。',1,'朋友'],
      ['在讨论中，即使有不同想法，我也常先保留在心里。',-1,'学习 / 工作'],
      ['计划不合我的意愿时，我通常会把自己的偏好说出来。',1,'朋友'],
      ['朋友的一个做法让你有些不舒服，你更可能？',['先放在心里，通常不提','用比较委婉的暗示表达','看关系和事情的重要性决定','找合适的时机说明感受','尽快清楚地说出感受和希望'],'朋友']
    ]],
    ['care',[
      ['发现朋友可能需要帮助时，我通常会主动询问。',1,'朋友'],
      ['别人遇到困难时，我倾向于等对方提出需要后再介入。',-1,'朋友'],
      ['我经常通过准备食物、整理资料等小行动表达关心。',1,'亲近关系'],
      ['与主动替别人安排相比，我更愿意让对方自己处理。',-1,'学习 / 工作'],
      ['亲近的人忙不过来时，我愿意主动分担一些具体事务。',1,'亲近关系'],
      ['朋友说最近很忙、精力不足，你第一反应更接近？',['相信对方会安排好，给足空间','告诉对方有需要可以找我','先问对方此刻需要什么','主动提出一项可以分担的事','征得同意后帮着安排具体的支持'],'朋友']
    ]],
    ['sensitive',[
      ['我容易注意到别人语气中细微的变化。',1,'朋友'],
      ['周围的气氛有些变化时，我通常不会被明显影响。',-1,'学习 / 工作'],
      ['音乐、文字或画面经常带给我很细致的感受。',1,'日常'],
      ['一段普通的对话结束后，我通常不会反复回想其中的细节。',-1,'朋友'],
      ['环境中的声音、光线或拥挤程度会明显影响我的体验。',1,'日常'],
      ['一次普通见面后，对方的语气与平时有点不同，你通常？',['可能不会留意，继续做自己的事','注意到了，但很快放下','留意到，等有更多信息再判断','会想一想是否有什么事情','对这种变化感受明显，会反复琢磨'],'亲近关系']
    ]],
    ['pace',[
      ['有一个可行的点子时，我通常愿意先动手试试。',1,'学习 / 工作'],
      ['即使是很小的决定，我也喜欢先留一点消化的时间。',-1,'日常'],
      ['遇到临时出现的机会，我往往能很快进入行动。',1,'日常'],
      ['开始一项新任务前，我通常需要一段时间慢慢进入状态。',-1,'学习 / 工作'],
      ['想到要做的事情，我常在当下就迈出第一步。',1,'日常'],
      ['你有一个不需要太多成本的新想法，通常会？',['先放着，让想法慢慢沉淀','想清楚大致方向后再开始','看当时的精力和条件决定','尽快找个时间做个小尝试','现在就做一个最小的版本'],'日常']
    ]]
  ];
  const LEGACY_QUESTIONS=RAW.flatMap(([dim,rows])=>rows.map(([text,key,context],i)=>({id:dim+'-'+i,dim,text,context,reverse:key===-1,type:Array.isArray(key)?'scenario':'scale',options:Array.isArray(key)?key:null,slot:i})));
  const QUESTIONS=RAW.flatMap(([dim,rows])=>[
    ...rows.slice(0,2).map(([text,key,context],slot)=>({id:`v2-${dim}-${slot}`,dim,text,context,reverse:key===-1,type:'scale',options:null,slot})),
    ...CONTENT.SCENARIOS[dim].map(([text,context,choices],i)=>({id:`v2-${dim}-${i+2}`,dim,text,context,reverse:false,type:'scenario',options:choices.map(c=>c[0]),values:choices.map(c=>c[1]),slot:i+2}))
  ]);
  const PROFILES=[
    {id:'golden',name:'金渐层',title:'把平凡日子过成小确幸',color:'#d9b56e',ink:'#63512e',pattern:'gold',tags:['温暖陪伴','稳稳接住'],vector:[.58,.73,.42,.7,.6,.78,.45,.45],desc:'喜欢熟悉的温度，也愿意用细水长流的陪伴经营关系。你不必总是热闹，可靠的小行动已经很有分量。'},
    {id:'black',name:'孟买猫',title:'安静，是我的充电方式',color:'#555a56',ink:'#303b35',pattern:'black',tags:['自在留白','慢慢靠近'],vector:[.2,.28,.55,.55,.28,.4,.56,.35],desc:'习惯保留一块自己的空间，亲近通常需要一点时间。你的在意可能藏在细节里，而不总是挂在嘴边。'},
    {id:'orange',name:'橘猫',title:'今天，也要慢悠悠地快乐',color:'#df9d65',ink:'#735036',pattern:'stripe',tags:['松弛日常','从容蓄力'],vector:[.55,.52,.4,.23,.55,.46,.25,.25],desc:'愿意把生活过得舒服，不急着把每一分钟都填满。你可能擅长享受此刻，也给身边的人留出喘息的空间。'},
    {id:'ragdoll',name:'布偶猫',title:'喜欢和你共享小小日常',color:'#b1b9c6',ink:'#5d6576',pattern:'point',tags:['亲近联结','细腻感受'],vector:[.48,.88,.35,.45,.65,.67,.8,.3],desc:'日常的分享与陪伴对你很重要，你容易留意关系里的细微感受。舒服的联结，也包括可以坦白说出各自的需要。'},
    {id:'cow',name:'奶牛猫',title:'有我在，日常就有新剧情',color:'#e9e7dd',ink:'#42483f',pattern:'cow',tags:['直接表达','即兴灵感'],vector:[.83,.6,.88,.22,.88,.45,.5,.88],desc:'点子来得快，表达也鲜活，常给日常带来意想不到的变化。兴致勃勃的你，也可以给重要的事情留一点收尾时间。'},
    {id:'tabby',name:'狸花猫',title:'自己的路，踏踏实实地走',color:'#a29178',ink:'#544c3d',pattern:'stripe',tags:['独立行动','心里有数'],vector:[.32,.35,.5,.85,.58,.65,.35,.78],desc:'喜欢自己拿主意，也愿意把事情一件件做好。你可能通过实际行动支持别人，而不是用很多话证明在意。'},
    {id:'siamese',name:'暹罗猫',title:'关心你这件事，我很主动',color:'#d4bba0',ink:'#665142',pattern:'point',tags:['主动关心','热络联结'],vector:[.8,.82,.6,.62,.88,.88,.65,.7],desc:'乐于交流和表达关心，常主动把人连接起来。让照顾从询问开始，你的热情就更容易落在对方需要的地方。'},
    {id:'silver',name:'银渐层',title:'脑海里，住着一座小宇宙',color:'#bbc4bd',ink:'#56685d',pattern:'silver',tags:['好奇观察','含蓄表达'],vector:[.35,.42,.88,.45,.28,.4,.8,.48],desc:'对新鲜想法很敏锐，也享受在自己的世界里慢慢探索。你不一定急着说出来，观察和想象已经很丰富。'},
    {id:'calico',name:'三花猫',title:'认真感受，也认真说出来',color:'#d1a087',ink:'#775746',pattern:'calico',tags:['鲜活感受','表达自我'],vector:[.65,.65,.72,.45,.88,.6,.88,.65],desc:'容易捕捉生活和关系里的细节，也愿意表达真实感受。丰富的体验是你的底色，不必为了保持一致而压平每一面。'},
    {id:'white',name:'白猫',title:'留一点安静，给自己',color:'#e7e6dc',ink:'#7d8377',pattern:'white',tags:['安静有序','边界清晰'],vector:[.18,.28,.3,.83,.35,.35,.63,.28],desc:'清楚的节奏与安静的空间让你自在。比起频繁打扰，你可能更喜欢彼此理解、各有留白的关系。'},
    {id:'blue',name:'蓝猫',title:'不慌不忙，也很有主意',color:'#8d9eab',ink:'#485e6c',pattern:'blue',tags:['稳稳当当','独立节奏'],vector:[.28,.4,.35,.68,.52,.45,.2,.43],desc:'习惯用自己的节奏判断事情，不容易被周围的波动带着走。稳定是一种力量，偶尔说出感受也会让人更了解你。'},
    {id:'curl',name:'卷毛猫',title:'世界这么大，先试一小步',color:'#bda585',ink:'#6a5841',pattern:'curl',tags:['探索新意','行动派'],vector:[.7,.4,.95,.4,.65,.4,.4,.9],desc:'新体验常让你跃跃欲试，你喜欢让想法很快发生。给热情找一个小而具体的起点，就能积累真正属于你的经历。'}
  ];
  function getQuestions(mode='full',version=VERSION){
    if(version==='1.0'){
      const slots=mode==='quick'?[0,1,5]:[0,1,2,3,4,5];
      return slots.flatMap(slot=>DIMS.map(d=>LEGACY_QUESTIONS.find(q=>q.dim===d.id&&q.slot===slot)));
    }
    const rounds=mode==='quick'?[[2,0,3]]:[[2,0,3],[4,1,5]];
    return rounds.flatMap(slots=>DIMS.flatMap((d,i)=>slots.map((slot,j)=>QUESTIONS.find(q=>q.dim===DIMS[(i+[0,3,5][j])%8].id&&q.slot===slot))));
  }
  function score(mode,answers,version=VERSION){
    const qs=getQuestions(mode,version);let answered=0,skipped=0,contextual=0;
    const dimensions=DIMS.map(dim=>{
      const entries=qs.filter(q=>q.dim===dim.id).flatMap(q=>{
        const a=answers[q.id];if(!a)return[];
        if(a.value===null){skipped++;return[];}
        const max=q.type==='scale'?6:4;
        if(!Number.isInteger(a.value)||a.value<0||a.value>max)return[];
        answered++;if(a.contextual)contextual++;
        const v=q.values?q.values[a.value]:(a.value/max*2-1)*(q.reverse?-1:1);return[{v,q,a}];
      });
      const n=entries.length,mean=n?entries.reduce((s,e)=>s+e.v,0)/n:0;
      const mixed=entries.some(e=>e.v>=2/3-.00001)&&entries.some(e=>e.v<=-2/3+.00001);
      return{...dim,n,total:qs.filter(q=>q.dim===dim.id).length,score:n?Math.round((mean+1)*50):null,mixed,contextual:entries.filter(e=>e.a.contextual).length};
    });
    const enough=dimensions.every(d=>d.n>=2)&&answered>=Math.ceil(qs.length*.6);
    const ranked=enough?PROFILES.map(p=>({...p,distance:Math.sqrt(dimensions.reduce((sum,d,i)=>sum+(d.score/100-p.vector[i])**2,0)/8)})).sort((a,b)=>a.distance-b.distance||a.id.localeCompare(b.id)):[];
    const nearest=ranked.length?ranked.filter(p=>p.distance-ranked[0].distance<=.025):[];
    const numeric=qs.filter(q=>q.type==='scale').map(q=>answers[q.id]?.value).filter(v=>Number.isInteger(v));
    const uniform=numeric.length>=8&&numeric.every(v=>v===numeric[0]);
    return{mode,dimensions,answered,skipped,contextual,enough,ranked,nearest,uniform,total:qs.length,version};
  }
  function validateDraft(value){
    if(!value||!['1.0',VERSION].includes(value.version)||!['quick','full'].includes(value.mode)||typeof value.answers!=='object'||!value.answers)return null;
    const qs=getQuestions(value.mode,value.version),answers={};
    for(const q of qs){const a=value.answers[q.id];if(!a)continue;const max=q.type==='scale'?6:4;if(a.value===null||Number.isInteger(a.value)&&a.value>=0&&a.value<=max)answers[q.id]={value:a.value,contextual:a.contextual===true};}
    return{version:value.version,mode:value.mode,answers,index:Number.isInteger(value.index)?Math.max(0,Math.min(value.index,qs.length-1)):0};
  }
  function getReflection(d){
    if(d.n<2||d.score===null)return{intro:'这一维还没有足够的回答，我们先为它留一点空白。不了解的部分可以慢慢补充，你不需要为了得到一个完整的标签而勉强选择。',strength:'此刻不急着解释，也是在尊重你的真实感受。',care:'愿意时可以回到题目，挑选真正贴近自己的做法；不适用的情境继续跳过就好。',words:'“这一部分的我，还想再认识一下。”',notes:[]};
    const band=d.score<40?'low':d.score>60?'high':'middle';
    const [intro,strength,care,words]=CONTENT.REFLECTIONS[d.id][band];
    const notes=[];
    if(d.mixed)notes.push('这一维里，你在不同题目中选择过不同方向的做法。这可能和对象、场合或最近的精力有关，也可能是题目理解上的差别。不必急着让所有回答整齐一致，可以回想：在谁面前、什么时候，你会更靠近哪一端？');
    if(d.contextual)notes.push(`你还为这一维的 ${d.contextual} 道题标记了“很看情境”。上面的文字只是一个起点，你对具体生活的了解，比这张轮廓更完整。`);
    return{intro,strength,care,words,notes};
  }
  function getRelationshipLetter(result){
    if(!result.enough)return{heading:'写给还在认识自己的你',text:'这次的回答还没有拼出足够完整的轮廓，我们就先不急着用一种猫咪称呼你。和你相处的人，可以多听一听你此刻想靠近什么、又想为自己留出哪些空间，而不是让一个尚未完成的分数替你说话。你也可以慢慢回到那些难以选择的场景：有些做法会随着对象、心情和经历改变，这并不需要被立即整理成标准答案。愿意继续探索时，我们再往前走一点；想停在这里，也可以把真正贴近自己的那几句话带走。你对自己的了解，会比这一份问卷更长、更具体。'};
    const phrases={
      social:{low:'和你靠近时，请给安静也留一个位置。你也许会在相聚之后想独处一会儿，那是在找回自己的精力，提前说一句，就能让在意你的人安心等待。',middle:'你既可以走进热闹，也可以回到自己的小天地。相处时允许彼此今天和昨天需要不同的距离，会让陪伴更轻松。',high:'你可能会在交流和一起做小事时感到精神明亮。愿意听你分享、也能坦白说出各自精力的人，会更容易和你找到舒服的节奏。'},
      bond:{low:'你珍惜各自完整的生活，也愿意让亲近慢慢发生。偶尔主动说一句“我一直记得你”，就能让留白里的在意被看见。',middle:'你想要亲近，也想要关系里可以自由呼吸的空间。把此刻想见面还是想歇一歇说出来，陪伴就不必总靠猜测。',high:'分享日常、被回应、被记得，对你可能有特别的分量。你可以坦然说出想念，也和对方一起商量一个双方都舒服的联系频率。'},
      explore:{low:'熟悉的小店和重复的小习惯，可能就是你感到安稳的地方。愿意陪你把普通日子认真过好，也是一种动人的靠近。',middle:'给你们的日常留一点熟悉，也添一点新意就很好。要不要尝试新东西，可以随着当时的好奇和精力一起商量。',high:'请给你的好奇留一点生长的地方。你也许会想分享一条新路线、一个新点子；有人愿意听听为什么让你心动，就已经是一种陪伴。'},
      order:{low:'你可能更喜欢在相处里留些随兴的余地。重要的约定先说好，其余的小变化不妨一起边走边商量，让自在也有一个安心的落点。',middle:'你需要一点可以依靠的安排，也希望生活还有转弯的余地。先把最重要的约定说清楚，就可以把剩下的时间过得松一点。',high:'清楚的安排和提前的告知，可能会让你心里稳下来。你可以表达这份需要，也不必独自扛住所有临时变化，让对方和你一起想办法。'},
      express:{low:'很多感受可能要在你心里停留一会儿，才慢慢找到合适的语言。你可以从一句“我还没想好怎么说”开始，不必等自己完全整理好才被倾听。',middle:'有些话你会坦白说出来，有些则想先消化一下。相处时约好一个之后再聊的时刻，就能给表达时间，也让彼此知道这段对话仍被认真放在心上。',high:'你愿意把喜欢和需要讲清楚，这能让关系少一点猜测。也给对方留一点理解和回应的时间，让直白的话语带着彼此都能接住的温度。'},
      care:{low:'你倾向于尊重对方自己的步调，在被需要时出现。偶尔主动问一句“想要我陪着吗”，可以让这份信任和关心一起被感受到。',middle:'你会在实际帮忙和安静陪伴之间寻找合适的位置。可以一起问清楚今天需要哪一种支持，也把自己的时间和余力算进去。',high:'你可能很自然地想照顾身边的人，把在意落实成一件件小事。也请记得问问对方真正需要什么，并把同样的照顾留一点给自己。'},
      sensitive:{low:'你较少被细小的波动带走，这份稳定可以成为相处里的一块落脚地。遇到感受不同的时刻，先多听一听，就能让平静也带着理解。',middle:'有些细节会让你留心，有些事情又能轻轻放下。把真正挂心的部分说给对方听，比要求自己对一切都敏锐或都洒脱更自在。',high:'细微的语气和气氛可能会在你心里停留更久。你可以温和地确认对方的意思，也允许自己暂时没有答案，不必一个人解读每一个信号。'},
      pace:{low:'你可能需要一点时间，才能从想法走到行动。亲近你的人可以给你一个从容的开头；你也可以把正在准备的那一小步说出来，让等待有了方向。',middle:'你有时愿意马上试试，有时又想先缓一缓。把当下的节奏告诉对方，比勉强自己永远迅速或永远稳妥更适合长久相处。',high:'有了可行的念头，你可能很快就想行动。拉着对方一起出发前，先问问彼此是否准备好，会让你的热情更容易变成共同的快乐。'}
    };
    const priority=['bond','social','express','sensitive','care','order','explore','pace'];
    const valid=result.dimensions.filter(d=>d.n>=2&&d.score!==null);
    const bond=valid.find(d=>d.id==='bond');
    const rest=valid.filter(d=>d!==bond).sort((a,b)=>Math.abs(b.score-50)-Math.abs(a.score-50)||priority.indexOf(a.id)-priority.indexOf(b.id));
    const selected=[...(bond?[bond]:[]),...rest.slice(0,bond?2:3)].sort((a,b)=>priority.indexOf(a.id)-priority.indexOf(b.id));
    const mixed=result.nearest.length>1;
    const heading=mixed?'写给多面小猫的你':`写给${result.ranked[0].name}的你`;
    const opening=mixed?'你身上有几种猫咪的影子，也给关系留了不止一种节奏。':'如果把这次的你写成一份相处说明，我想从一句话开始：靠近你的方式，可以慢慢一起找到。';
    const body=selected.map(d=>phrases[d.id][d.score<40?'low':d.score>60?'high':'middle']).join('');
    const context=selected.some(d=>d.mixed||d.contextual)?'不同场合里的你，也值得被耐心了解，不需要为了符合一个名字而把自己变成始终一样的人。':'';
    const ending='也请把一点温柔留给自己：相处是两个人共同摸索的事，你可以表达需要、保留边界，也可以偶尔说“今天我想被照顾一下”。愿你遇见愿意理解你的人，也越来越懂得怎样和自己好好相处。';
    return{heading,text:opening+body+context+ending};
  }
  const api={VERSION,DIMS,QUESTIONS,LEGACY_QUESTIONS,PROFILES,getQuestions,score,validateDraft,getReflection,getRelationshipLetter};root.CatiEngine=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
