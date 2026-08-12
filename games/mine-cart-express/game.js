const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const bgImage = $('#bgImage');
const cart = $('#cart');
const qWrap = $('#questionWrap');
const qText = $('#questionText');
const diamondCount = $('#diamondCount');
const progressCount = $('#progressCount');
const upperArrow = $('#upperArrow');
const lowerArrow = $('#lowerArrow');
const soundIcon = $('#soundIcon');
const answerFeedback = $('#answerFeedback');

const overlays = {
  start: $('#startOverlay'), topic: $('#topicOverlay'), help: $('#helpOverlay'), pause: $('#pauseOverlay'), result: $('#resultOverlay')
};

const TOPICS = {
  presentSimple: {
    bg:'assets/game/bg_do_does.png',
    questions:[
      ['___ you like pizza?','DO'],['___ she play tennis?','DOES'],['___ they live near here?','DO'],['___ Tom like cats?','DOES'],['___ your friends play Minecraft?','DO'],['___ he go to school by bus?','DOES'],['___ we need a map?','DO'],['___ Anna speak English?','DOES'],['___ your parents work on Saturdays?','DO'],['___ the dog sleep in your room?','DOES']
    ],
    options:{upper:'DO', lower:'DOES'}
  },
  presentContinuous: {
    bg:'assets/game/bg_is_are.png',
    questions:[
      ['___ she reading now?','IS'],['___ they playing football?','ARE'],['___ Tom sleeping?','IS'],['___ you listening to me?','ARE'],['___ the children watching TV?','ARE'],['___ your mum cooking?','IS'],['___ we going the right way?','ARE'],['___ the dog running?','IS'],['___ Anna and Kate studying?','ARE'],['___ he wearing a hat?','IS']
    ],
    options:{upper:'IS', lower:'ARE'}
  },
  thereIsAre: {
    bg:'assets/game/bg_is_are.png',
    questions:[
      ['___ there a book on the table?','IS'],['___ there two cats in the garden?','ARE'],['___ there a computer in your room?','IS'],['___ there any apples in the bag?','ARE'],['___ there a park near your house?','IS'],['___ there three windows in the classroom?','ARE'],['___ there any milk in the fridge?','IS'],['___ there many students at school today?','ARE'],['___ there a bus stop near here?','IS'],['___ there any flowers in the garden?','ARE']
    ],
    options:{upper:'IS', lower:'ARE'}
  },
  pastWasWere: {
    bg:'assets/game/bg_was_were.png',
    questions:[
      ['___ she at school yesterday?','WAS'],['___ they tired after the game?','WERE'],['___ Tom at home last night?','WAS'],['___ you happy with the result?','WERE'],['___ the children in the park?','WERE'],['___ your mum at work yesterday?','WAS'],['___ we late for class?','WERE'],['___ the film interesting?','WAS'],['___ Anna and Kate at the party?','WERE'],['___ it cold yesterday?','WAS']
    ],
    options:{upper:'WAS', lower:'WERE'}
  }
};

let state = {
  topic:null, queue:[], index:0, diamonds:0, selected:null, currentAnimation:null,
  phase:'idle', paused:false, sound:true, music:true, wheelTimer:null, token:0
};
let chosenTopic = null;
let audioCtx;
const bgMusic = new Audio('assets/audio/background.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.13;
bgMusic.preload = 'auto';

function shuffle(arr){ return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }
function showOverlay(name){ Object.values(overlays).forEach(o=>o.classList.remove('show')); if(name) overlays[name].classList.add('show'); }
function updateHUD(){ diamondCount.textContent=state.diamonds; progressCount.textContent=`${state.index}/10`; }
function setArrowsEnabled(on){ upperArrow.disabled=!on; lowerArrow.disabled=!on; }
function updateBackground(){ if(state.topic) bgImage.src = TOPICS[state.topic].bg; }
function resetChoiceFX(){ upperArrow.classList.remove('correct','wrong'); lowerArrow.classList.remove('correct','wrong'); }
function showAnswerFeedback(correct){
  if(!answerFeedback) return;
  answerFeedback.textContent = correct ? '✓' : '✕';
  answerFeedback.classList.remove('show-correct','show-wrong');
  void answerFeedback.offsetWidth;
  answerFeedback.classList.add(correct ? 'show-correct' : 'show-wrong');
  setTimeout(()=>answerFeedback?.classList.remove('show-correct','show-wrong'),760);
}

function ctx(){ if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)(); return audioCtx; }
function tone(freq,dur=0.09,type='sine',gain=.06,when=0){ if(!state.sound) return; const c=ctx(); if(c.state==='suspended') c.resume().catch(()=>{}); const o=c.createOscillator(), g=c.createGain(); o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain,c.currentTime+when);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+when+dur);o.connect(g);g.connect(c.destination);o.start(c.currentTime+when);o.stop(c.currentTime+when+dur); }
function correctSound(){ tone(660,.14,'triangle',.12);tone(880,.18,'triangle',.12,.11); }
function wrongSound(){ tone(340,.13,'square',.18);tone(220,.18,'sawtooth',.16,.08);tone(125,.25,'square',.14,.20); }
function finalSound(){ tone(523,.20,'triangle',.12); tone(659,.20,'triangle',.12,.10); tone(784,.22,'triangle',.13,.20); tone(1047,.38,'sine',.13,.31); }
function playMusic(){ if(!state.music) return; const p=bgMusic.play(); if(p?.catch) p.catch(()=>{}); }
function pauseMusic(){ bgMusic.pause(); }
function clickClack(){ tone(150,.045,'square',.025);tone(115,.045,'square',.02,.14); }
function startWheels(){ stopWheels(); cart.classList.add('moving'); if(!state.sound || state.paused) return; clickClack(); state.wheelTimer=setInterval(clickClack,410); }
function stopWheels(){ cart.classList.remove('moving'); if(state.wheelTimer){ clearInterval(state.wheelTimer); state.wheelTimer=null; } }

async function animTo(left,top,duration,easing='linear',opacity=1){
  const a=cart.animate([
    {left:cart.style.left,top:cart.style.top,opacity:getComputedStyle(cart).opacity},
    {left,top,opacity}
  ],{duration,easing,fill:'forwards'});
  state.currentAnimation=a;
  try{ await a.finished; }catch(e){ return false; }
  cart.style.left=left;cart.style.top=top;cart.style.opacity=opacity;a.cancel();state.currentAnimation=null;return true;
}

async function newQuestion(){
  const token = ++state.token;
  state.selected = null;
  state.phase = 'approaching';
  setArrowsEnabled(true);
  resetChoiceFX();
  const [text] = state.queue[state.index];
  qText.textContent = text;
  qWrap.classList.remove('hidden');
  upperArrow.classList.remove('hidden');
  lowerArrow.classList.remove('hidden');
  cart.classList.remove('hidden');
  cart.style.left='108%';
  cart.style.top='54.8%';
  cart.style.opacity='1';
  startWheels();
  await animTo('51.5%','54.8%',6000,'linear');
  if(token!==state.token) return;
  stopWheels();
  state.phase='waiting';
  if(state.selected) depart(token);
}

function choose(which){
  if(!state.topic || state.selected || state.phase==='leaving' || state.paused) return;
  const answer = TOPICS[state.topic].options[which];
  state.selected = {which, answer};
  setArrowsEnabled(false);
  const correct = answer === state.queue[state.index][1];
  const btn = which==='upper' ? upperArrow : lowerArrow;
  btn.classList.add(correct?'correct':'wrong');
  if(correct){ state.diamonds++; correctSound(); }
  else wrongSound();
  showAnswerFeedback(correct);
  diamondCount.textContent = state.diamonds;
  if(state.phase==='waiting') depart(state.token);
}

async function depart(token){
  if(state.phase==='leaving') return;
  state.phase='leaving';
  startWheels();
  const upper = state.selected.which === 'upper';
  if(upper) await animTo('38%','39.1%',1150,'ease-in-out');
  else await animTo('38%','72.5%',1150,'ease-in-out');
  if(token!==state.token) return;
  if(upper) await animTo('15.2%','39.1%',1150,'linear');
  else await animTo('15.2%','72.5%',1150,'linear');
  if(token!==state.token) return;
  if(upper) await animTo('15.2%','39.1%',120,'linear',0);
  else await animTo('15.2%','72.5%',120,'linear',0);
  if(token!==state.token) return;
  stopWheels();
  cart.classList.add('hidden');
  state.index++;
  updateHUD();
  await new Promise(r=>setTimeout(r,350));
  if(state.index>=10){
    $('#resultScore').textContent = `${state.diamonds} / 10`;
    qWrap.classList.add('hidden');
    cart.classList.add('hidden');
    upperArrow.classList.add('hidden');
    lowerArrow.classList.add('hidden');
    finalSound();
    try {
      localStorage.setItem('hgm_pending_minigame_result', JSON.stringify({
        sessionId: `mine-cart-express-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        gameId: 'mine-cart-express',
        gameName: 'Mine Cart Express',
        topic: chosenTopic,
        gemsEarned: state.diamonds,
        stats: { correctAnswers: state.diamonds, attemptedAnswers: 10, ghostsDefeated: 0, blocksMined: 0 },
        completedAt: new Date().toISOString()
      }));
    } catch (_) {}
    showOverlay('result');
  } else {
    newQuestion();
  }
}

function beginGame(topic){
  state.token++;
  state.topic = topic;
  state.queue = shuffle([...TOPICS[topic].questions]);
  state.index = 0;
  state.diamonds = 0;
  state.selected = null;
  state.paused = false;
  updateBackground();
  updateHUD();
  showOverlay(null);
  newQuestion();
}

function resetToStart(){
  stopWheels();
  state.token++;
  state.topic = null;
  state.queue = [];
  state.index = 0;
  state.diamonds = 0;
  state.selected = null;
  state.paused = false;
  state.phase = 'idle';
  bgImage.src = 'assets/game/bg_do_does.png';
  qWrap.classList.add('hidden');
  cart.classList.add('hidden');
  upperArrow.classList.add('hidden');
  lowerArrow.classList.add('hidden');
  resetChoiceFX();
  setArrowsEnabled(false);
  updateHUD();
  chosenTopic = null;
  $$('.topic-btn').forEach(x=>x.classList.remove('selected'));
  $('#letsGoBtn').classList.add('disabled');
  showOverlay('start');
}

function pauseGame(show=true){
  if(state.paused || !state.topic) return;
  state.paused = true;
  state.currentAnimation?.pause();
  stopWheels();
  pauseMusic();
  setArrowsEnabled(false);
  if(show) showOverlay('pause');
}
function resumeGame(show=true){
  if(!state.paused) return;
  state.paused = false;
  state.currentAnimation?.play();
  if(state.currentAnimation) startWheels();
  if(state.music) playMusic();
  if(!state.selected) setArrowsEnabled(true);
  if(show) showOverlay(null);
}

$('#startBtn').onclick = () => { playMusic(); showOverlay('topic'); };
$('#howBtn').onclick = () => showOverlay('help');
$('#backBtn').onclick = () => { window.location.href = '../../index.html'; };
$('#helpBtn').onclick = () => { if(state.topic) pauseGame(false); showOverlay('help'); };
$('#pauseBtn').onclick = () => pauseGame(true);
$('#resumeBtn').onclick = () => resumeGame(true);
$('#exitBtn').onclick = () => { window.location.href = '../../index.html'; };
$('#playAgainBtn').onclick = () => { chosenTopic = null; $$('.topic-btn').forEach(x=>x.classList.remove('selected')); $('#letsGoBtn').classList.add('disabled'); showOverlay('topic'); };
$('#campBtn').onclick = () => { window.location.href = '../../index.html'; };

$$('[data-close="help"]').forEach(btn => btn.onclick = () => { showOverlay(state.paused ? 'pause' : state.topic ? null : 'start'); if(state.paused) return; });
$$('[data-close="topic"]').forEach(btn => btn.onclick = () => showOverlay('start'));

upperArrow.onclick = () => choose('upper');
lowerArrow.onclick = () => choose('lower');

$$('.topic-btn').forEach(btn => {
  btn.onclick = () => {
    $$('.topic-btn').forEach(x=>x.classList.remove('selected'));
    btn.classList.add('selected');
    chosenTopic = btn.dataset.topic;
    $('#letsGoBtn').classList.remove('disabled');
    bgImage.src = TOPICS[chosenTopic].bg;
  };
});

$('#letsGoBtn').onclick = () => {
  if(!chosenTopic) return;
  if(audioCtx?.state === 'suspended') audioCtx.resume();
  playMusic();
  beginGame(chosenTopic);
};

$('#soundBtn').onclick = () => {
  state.music = !state.music;
  soundIcon.src = state.music ? 'assets/ui/music_on.png' : 'assets/ui/music_off.png';
  if(state.music) playMusic();
  else pauseMusic();
};

updateHUD();
setArrowsEnabled(false);
