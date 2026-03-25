import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600;700;900&display=swap');

  * { box-sizing: border-box; }

  @keyframes bgShift {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  @keyframes floatCard {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-7px); }
  }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  @keyframes beam1 {
    0%,100%{transform:rotate(-35deg);opacity:0.2}
    30%    {transform:rotate(15deg); opacity:0.85}
    60%    {transform:rotate(-20deg);opacity:0.5}
  }
  @keyframes beam2 {
    0%,100%{transform:rotate(35deg); opacity:0.3}
    40%    {transform:rotate(-10deg);opacity:0.9}
    70%    {transform:rotate(25deg); opacity:0.4}
  }
  @keyframes beam3 {
    0%,100%{transform:rotate(0deg);  opacity:0.1}
    50%    {transform:rotate(-30deg);opacity:0.75}
  }

  @keyframes colorCycle {
    0%  {filter:hue-rotate(0deg)   brightness(1.3)}
    25% {filter:hue-rotate(60deg)  brightness(1.6)}
    50% {filter:hue-rotate(180deg) brightness(1.3)}
    75% {filter:hue-rotate(280deg) brightness(1.6)}
    100%{filter:hue-rotate(360deg) brightness(1.3)}
  }
  @keyframes glowPulse {
    0%,100%{box-shadow:0 0 20px rgba(192,38,211,0.35)}
    50%    {box-shadow:0 0 55px rgba(170,0,255,0.65),0 0 90px rgba(224,68,114,0.25)}
  }

  @keyframes bodyBob  {0%,100%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-7px) rotate(-2deg)} 75%{transform:translateY(-3px) rotate(2deg)}}
  @keyframes bodyBob2 {0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-5px) rotate(3deg)}  66%{transform:translateY(-8px) rotate(-1deg)}}
  @keyframes bodyBob3 {0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)}}
  @keyframes armL  {0%,100%{transform:rotate(-15deg)} 50%{transform:rotate(-75deg)}}
  @keyframes armR  {0%,100%{transform:rotate(15deg)}  50%{transform:rotate(75deg)}}
  @keyframes armL2 {0%,100%{transform:rotate(-30deg)} 50%{transform:rotate(10deg)}}
  @keyframes armR2 {0%,100%{transform:rotate(30deg)}  50%{transform:rotate(-10deg)}}
  @keyframes armUp {0%,100%{transform:rotate(-55deg)} 50%{transform:rotate(-110deg)}}
  @keyframes legL  {0%,100%{transform:rotate(-8deg)}  50%{transform:rotate(25deg)}}
  @keyframes legR  {0%,100%{transform:rotate(8deg)}   50%{transform:rotate(-25deg)}}
  @keyframes headNod {0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)}}
  @keyframes headBop {0%,100%{transform:rotate(6deg)}  50%{transform:rotate(-6deg)}}
  @keyframes drinkTip{0%,65%{transform:rotate(0deg)} 80%,100%{transform:rotate(-32deg)}}
  @keyframes bottleW {0%,100%{transform:rotate(-12deg)} 50%{transform:rotate(12deg)}}
  @keyframes wineRipple{0%,100%{transform:scaleX(1)} 50%{transform:scaleX(0.8)}}

  @keyframes sparkle {0%,100%{opacity:0;transform:scale(0) rotate(0deg)} 50%{opacity:1;transform:scale(1.2) rotate(180deg)}}
  @keyframes floatUp {0%{opacity:0.8;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-55px) scale(0.3)}}
  @keyframes twinkle {0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.3)}}

  @keyframes slideUp {from{opacity:0;transform:translateY(50px)} to{opacity:1;transform:translateY(0)}}
  @keyframes popIn   {0%{opacity:0;transform:scale(0.4) translateY(30px)} 65%{transform:scale(1.05) translateY(-5px)} 100%{opacity:1;transform:scale(1) translateY(0)}}
  @keyframes overlayIn {from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)}}
  @keyframes countDown {from{width:100%} to{width:0%}}
  @keyframes btnPulse{0%,100%{box-shadow:0 0 0 0 rgba(192,38,211,0.6)} 50%{box-shadow:0 0 0 14px rgba(192,38,211,0)}}
  @keyframes glitch  {0%,100%{text-shadow:2px 0 #e04472,-2px 0 #aa00ff} 30%{text-shadow:-2px 0 #e04472,2px 0 #c026d3} 70%{text-shadow:3px 2px #e04472,-3px -2px #7c3aed}}
  @keyframes disco   {0%{background:rgba(224,68,114,0.15)} 16%{background:rgba(192,38,211,0.15)} 33%{background:rgba(124,58,237,0.18)} 50%{background:rgba(109,40,217,0.15)} 66%{background:rgba(219,39,119,0.15)} 83%{background:rgba(170,0,255,0.15)} 100%{background:rgba(224,68,114,0.15)}}
  @keyframes floorGlow{0%,100%{background:rgba(224,68,114,0.07)} 33%{background:rgba(170,0,255,0.12)} 66%{background:rgba(124,58,237,0.09)}}
  @keyframes particle {0%{transform:translateY(0) rotate(0);opacity:0.9} 100%{transform:translateY(-90px) rotate(720deg);opacity:0}}

  .admin-input:focus {
    border-color: rgba(192,38,211,0.9) !important;
    box-shadow: 0 0 0 3px rgba(192,38,211,0.2), 0 0 22px rgba(192,38,211,0.3) !important;
    outline: none !important;
  }
  .admin-btn:hover:not(:disabled) {
    transform: scale(1.03) !important;
    box-shadow: 0 18px 55px rgba(192,38,211,0.65) !important;
  }
  .back-btn:hover  { background:rgba(255,255,255,0.1) !important; color:white !important; }
  .logout-btn:hover{ background:rgba(220,38,38,0.25) !important;  color:white !important; }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .admin-card { padding: 24px 16px !important; }
    .admin-logo-title { font-size: 32px !important; letter-spacing: 3px !important; }
    .admin-subtitle { font-size: 10px !important; letter-spacing: 3px !important; }
    .admin-party { display: none !important; }
    .admin-disco { display: none !important; }
    .admin-register-grid { grid-template-columns: 1fr !important; }
    .logout-box { padding: 24px 20px !important; min-width: unset !important; width: 90vw !important; }
    .toast-box { min-width: unset !important; width: 90vw !important; padding: 14px 18px !important; left: 5% !important; transform: none !important; }
  }
  @media (max-width: 360px) {
    .admin-card { padding: 18px 10px !important; }
  }
`;

/* ═══════════════════════════════
   SVG PERSON PRIMITIVES
═══════════════════════════════ */
const Dancer1 = ({ x, sc=1, flip=false, delay='0s', skin='#f4a261', shirt='#e04472', pants='#7c3aed' }) => (
  <g transform={`translate(${x},0) scale(${flip?-sc:sc},${sc})`}>
    <ellipse cx="0" cy="94" rx="16" ry="4" fill={shirt} opacity="0.25"/>
    <g style={{animation:`bodyBob 0.65s ease-in-out infinite`,animationDelay:delay,transformOrigin:'0px 60px'}}>
      <g style={{animation:`headNod 0.65s ease-in-out infinite`,animationDelay:delay,transformOrigin:'0px 18px'}}>
        <circle cx="0" cy="18" r="13" fill={skin}/>
        <circle cx="-4" cy="16" r="2.5" fill="#1a0030"/>
        <circle cx="4"  cy="16" r="2.5" fill="#1a0030"/>
        <path d="M-4 23 Q0 27 4 23" stroke="#1a0030" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="0" cy="7" rx="11" ry="5" fill="#2d1b00"/>
        <path d="M-13 15 Q-13 4 0 4 Q13 4 13 15" stroke="#aa00ff" strokeWidth="2.5" fill="none"/>
        <rect x="-16" y="12" width="6" height="8" rx="3" fill="#aa00ff"/>
        <rect x="10"  y="12" width="6" height="8" rx="3" fill="#aa00ff"/>
      </g>
      <rect x="-11" y="32" width="22" height="26" rx="6" fill={shirt} style={{animation:'disco 1.5s linear infinite'}}/>
      <g style={{animation:`armUp 0.65s ease-in-out infinite`,animationDelay:delay,transformOrigin:'-11px 36px'}}>
        <rect x="-27" y="20" width="18" height="7" rx="3.5" fill={shirt}/>
        <circle cx="-27" cy="23" r="5" fill={skin}/>
      </g>
      <g style={{animation:`armUp 0.65s ease-in-out infinite`,animationDelay:`calc(${delay} + 0.1s)`,transformOrigin:'11px 36px',transform:'scaleX(-1)'}}>
        <rect x="-27" y="20" width="18" height="7" rx="3.5" fill={shirt}/>
        <circle cx="-27" cy="23" r="5" fill={skin}/>
      </g>
      <g style={{animation:`legL 0.65s ease-in-out infinite`,animationDelay:delay,transformOrigin:'-5px 58px'}}>
        <rect x="-11" y="58" width="10" height="26" rx="5" fill={pants}/>
        <rect x="-14" y="80" width="13" height="7"  rx="3" fill="#e04472"/>
      </g>
      <g style={{animation:`legR 0.65s ease-in-out infinite`,animationDelay:`calc(${delay} + 0.32s)`,transformOrigin:'5px 58px'}}>
        <rect x="1"  y="58" width="10" height="26" rx="5" fill={pants}/>
        <rect x="1"  y="80" width="13" height="7"  rx="3" fill="#e04472"/>
      </g>
    </g>
  </g>
);

const WineDrinker = ({ x, sc=1, flip=false, delay='0s', skin='#d4845a', shirt='#c026d3', pants='#4c1d95' }) => (
  <g transform={`translate(${x},0) scale(${flip?-sc:sc},${sc})`}>
    <ellipse cx="0" cy="94" rx="15" ry="4" fill={shirt} opacity="0.22"/>
    <g style={{animation:`bodyBob2 0.8s ease-in-out infinite`,animationDelay:delay,transformOrigin:'0px 60px'}}>
      <g style={{animation:`headBop 0.8s ease-in-out infinite`,animationDelay:delay,transformOrigin:'0px 18px'}}>
        <circle cx="0" cy="18" r="12" fill={skin}/>
        <circle cx="-3.5" cy="16" r="2" fill="#1a0030"/>
        <circle cx="3.5"  cy="16" r="2" fill="#1a0030"/>
        <path d="M-3 23 Q0 26 3 23" stroke="#1a0030" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="0" cy="8" rx="10" ry="5" fill="#1a0030"/>
      </g>
      <rect x="-10" y="31" width="20" height="25" rx="5" fill={shirt}/>
      <g style={{animation:`drinkTip 2s ease-in-out infinite`,animationDelay:delay,transformOrigin:'10px 36px'}}>
        <rect x="8" y="30" width="17" height="7" rx="3.5" fill={shirt}/>
        <circle cx="25" cy="33" r="4.5" fill={skin}/>
        <g transform="translate(28,16)">
          <polygon points="0,-13 8,-13 5,1 -5,1" fill="rgba(220,38,38,0.6)" stroke="#ff6eb4" strokeWidth="1"/>
          <rect x="-1" y="1" width="2" height="9" fill="#ff6eb4" opacity="0.7"/>
          <rect x="-5" y="10" width="10" height="2" rx="1" fill="#ff6eb4" opacity="0.7"/>
          <ellipse cx="4" cy="-6" rx="3.5" ry="2" fill="rgba(139,0,0,0.8)" style={{animation:'wineRipple 1s ease-in-out infinite'}}/>
          <circle cx="10" cy="-2" r="1.5" fill="#e04472" opacity="0.8" style={{animation:'floatUp 1.5s ease-out infinite'}}/>
        </g>
      </g>
      <g style={{animation:`armL 0.8s ease-in-out infinite`,animationDelay:delay,transformOrigin:'-10px 36px'}}>
        <rect x="-25" y="30" width="17" height="7" rx="3.5" fill={shirt}/>
        <circle cx="-25" cy="33" r="4.5" fill={skin}/>
      </g>
      <g style={{animation:`legL 0.8s ease-in-out infinite`,animationDelay:delay,transformOrigin:'-4px 56px'}}>
        <rect x="-10" y="56" width="10" height="24" rx="5" fill={pants}/>
        <rect x="-13" y="77" width="12" height="6" rx="3" fill="#9d174d"/>
      </g>
      <g style={{animation:`legR 0.8s ease-in-out infinite`,animationDelay:`calc(${delay} + 0.4s)`,transformOrigin:'4px 56px'}}>
        <rect x="0" y="56" width="10" height="24" rx="5" fill={pants}/>
        <rect x="1" y="77" width="12" height="6" rx="3" fill="#9d174d"/>
      </g>
    </g>
  </g>
);

const BottleHolder = ({ x, sc=1, flip=false, delay='0s', skin='#c9a87c', shirt='#7c3aed', pants='#1e1b4b' }) => (
  <g transform={`translate(${x},0) scale(${flip?-sc:sc},${sc})`}>
    <ellipse cx="0" cy="94" rx="16" ry="4" fill={shirt} opacity="0.22"/>
    <g style={{animation:`bodyBob3 0.7s ease-in-out infinite`,animationDelay:delay,transformOrigin:'0px 60px'}}>
      <g style={{animation:`headNod 0.7s ease-in-out infinite`,animationDelay:delay,transformOrigin:'0px 18px'}}>
        <circle cx="0" cy="18" r="12" fill={skin}/>
        <circle cx="-3.5" cy="16" r="2.2" fill="#1a0030"/>
        <circle cx="3.5"  cy="16" r="2.2" fill="#1a0030"/>
        <path d="M-3 23 Q0 27 3 23" stroke="#1a0030" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M-10 10 Q0 4 10 10" fill="#3d1500"/>
      </g>
      <rect x="-10" y="31" width="20" height="25" rx="5" fill={shirt}/>
      <g style={{animation:`bottleW 0.7s ease-in-out infinite`,animationDelay:delay,transformOrigin:'-10px 36px'}}>
        <rect x="-28" y="22" width="20" height="7" rx="3.5" fill={shirt}/>
        <circle cx="-28" cy="25" r="4.5" fill={skin}/>
        <g transform="translate(-40,2)">
          <rect x="-4" y="-20" width="8"  height="24" rx="3"  fill="#14532d"/>
          <rect x="-2.5" y="-26" width="5" height="8" rx="2" fill="#14532d"/>
          <rect x="-1.5" y="-28" width="3" height="4" rx="1" fill="#666"/>
          <rect x="-3" y="-14" width="6" height="10" rx="1" fill="#ca8a04" opacity="0.9"/>
          <rect x="-3.5" y="-19" width="7" height="6" rx="2" fill="rgba(139,0,0,0.65)"/>
        </g>
      </g>
      <g style={{animation:`armR 0.7s ease-in-out infinite`,animationDelay:`calc(${delay} + 0.2s)`,transformOrigin:'10px 36px'}}>
        <rect x="8" y="30" width="19" height="7" rx="3.5" fill={shirt}/>
        <circle cx="27" cy="33" r="4.5" fill={skin}/>
      </g>
      <g style={{animation:`legL 0.7s ease-in-out infinite`,animationDelay:delay,transformOrigin:'-4px 56px'}}>
        <rect x="-10" y="56" width="10" height="25" rx="5" fill={pants}/>
        <rect x="-13" y="78" width="12" height="6" rx="3" fill="#7c3aed"/>
      </g>
      <g style={{animation:`legR 0.7s ease-in-out infinite`,animationDelay:`calc(${delay} + 0.35s)`,transformOrigin:'4px 56px'}}>
        <rect x="0" y="56" width="10" height="25" rx="5" fill={pants}/>
        <rect x="1" y="78" width="12" height="6" rx="3" fill="#7c3aed"/>
      </g>
    </g>
  </g>
);

const PartyScene = () => (
  <div className="admin-party" style={{width:'100%',maxWidth:'720px',margin:'0 auto',position:'relative',height:'130px'}}>
    <div style={{
      position:'absolute',bottom:0,left:'5%',right:'5%',height:'28px',
      background:'linear-gradient(to top,rgba(192,38,211,0.2),transparent)',
      borderRadius:'50%',filter:'blur(10px)',
      animation:'floorGlow 2s linear infinite',
    }}/>
    <svg viewBox="0 0 720 108" style={{width:'100%',height:'130px',overflow:'visible'}}>
      <line x1="10" y1="100" x2="710" y2="100" stroke="rgba(192,38,211,0.3)" strokeWidth="1" strokeDasharray="5 5"/>
      <Dancer1      x={52}  sc={0.76} delay="0s"    skin="#f4a261" shirt="#e04472" pants="#7c3aed"/>
      <WineDrinker  x={128} sc={0.78} delay="0.15s" skin="#d4845a" shirt="#c026d3" pants="#4c1d95"/>
      <BottleHolder x={203} sc={0.76} delay="0.3s"  skin="#c9a87c" shirt="#7c3aed" pants="#1e1b4b"/>
      <Dancer1      x={274} sc={0.75} flip delay="0.45s" skin="#e8b4a0" shirt="#db2777" pants="#6d28d9"/>
      <g transform="translate(360,12)" style={{animation:'colorCycle 3s linear infinite'}}>
        <polygon points="-20,-4 20,-4 13,32 -13,32" fill="rgba(220,38,38,0.45)" stroke="#ff6eb4" strokeWidth="1.5"/>
        <rect x="-2.5" y="32" width="5" height="22" fill="#ff6eb4" opacity="0.65"/>
        <rect x="-11" y="54" width="22" height="4" rx="2" fill="#ff6eb4" opacity="0.65"/>
        <ellipse cx="0" cy="10" rx="15" ry="5" fill="rgba(139,0,0,0.65)" style={{animation:'wineRipple 1.2s ease-in-out infinite'}}/>
        <text x="0" y="18" fontSize="16" textAnchor="middle">🍷</text>
      </g>
      <Dancer1      x={448} sc={0.75} flip delay="0.6s"  skin="#a0785a" shirt="#e04472" pants="#5b21b6"/>
      <BottleHolder x={520} sc={0.77} flip delay="0.75s" skin="#f0c090" shirt="#9333ea" pants="#312e81"/>
      <WineDrinker  x={594} sc={0.78} flip delay="0.9s"  skin="#cc8866" shirt="#ec4899" pants="#4c1d95"/>
      <Dancer1      x={664} sc={0.76} flip delay="1.05s" skin="#d4a574" shirt="#be185d" pants="#4338ca"/>
      {[70,155,240,480,560,640].map((cx,i)=>(
        <text key={i} x={cx} y={58-(i%3)*14} fontSize="11" opacity="0.65"
          style={{animation:`floatUp ${1.4+i*0.3}s ease-out infinite`,animationDelay:`${i*0.4}s`}}>
          {['🎵','❤️','🍇','✨','🎶','💜'][i]}
        </text>
      ))}
    </svg>
    {Array.from({length:10}).map((_,i)=>(
      <div key={i} style={{
        position:'absolute',
        top:`${[12,25,52,72,32,62,18,48,82,7][i]}%`,
        left:`${[4,14,24,40,54,70,80,88,93,97][i]}%`,
        width:'4px',height:'4px',borderRadius:'50%',
        background:['#e04472','#aa00ff','#c026d3','#7c3aed','#ec4899'][i%5],
        animation:`twinkle ${0.8+i*0.2}s ease-in-out infinite`,
        animationDelay:`${i*0.15}s`,
        boxShadow:'0 0 6px 3px currentColor',
      }}/>
    ))}
  </div>
);

const DJLights = () => {
  const beams = [
    {color:'#e04472',anim:'beam1',dur:'1.0s',left:'8%', delay:'0s'},
    {color:'#c026d3',anim:'beam2',dur:'0.85s',left:'26%',delay:'0.2s'},
    {color:'#7c3aed',anim:'beam3',dur:'1.2s', left:'50%',delay:'0.4s'},
    {color:'#aa00ff',anim:'beam1',dur:'0.9s', left:'72%',delay:'0.6s'},
    {color:'#db2777',anim:'beam2',dur:'1.1s', left:'90%',delay:'0.1s'},
  ];
  return (
    <div className="admin-disco" style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'38%',background:'linear-gradient(to top,rgba(112,26,117,0.1),transparent)',animation:'floorGlow 3s linear infinite'}}/>
      {beams.map((b,i)=>(
        <div key={i} style={{
          position:'absolute',top:0,left:b.left,
          width:'2.5px',height:'65vh',
          background:`linear-gradient(to bottom,${b.color} 0%,${b.color}99 30%,transparent 100%)`,
          transformOrigin:'top center',
          animation:`${b.anim} ${b.dur} ease-in-out infinite`,
          animationDelay:b.delay,
          filter:`blur(1.5px) drop-shadow(0 0 10px ${b.color})`,
        }}>
          <div style={{width:'14px',height:'14px',borderRadius:'50%',background:b.color,marginLeft:'-6px',boxShadow:`0 0 25px 10px ${b.color}`,animation:`colorCycle ${b.dur} linear infinite`,animationDelay:b.delay}}/>
        </div>
      ))}
      {Array.from({length:20}).map((_,i)=>(
        <div key={i} style={{
          position:'absolute',
          top:`${20+(i*13)%60}%`,
          left:`${(i*17+5)%95}%`,
          width:'3px',height:'3px',borderRadius:'50%',
          background:['#e04472','#c026d3','#7c3aed','#aa00ff','#db2777'][i%5],
          animation:`particle ${1.2+(i%4)*0.5}s linear infinite`,
          animationDelay:`${(i*0.3)%2}s`,
          boxShadow:'0 0 4px 2px currentColor',
        }}/>
      ))}
    </div>
  );
};

const DiscoBall = () => (
  <div className="admin-disco" style={{position:'fixed',top:'-38px',left:'50%',transform:'translateX(-50%)',width:'76px',height:'76px',zIndex:3,animation:'spin 5s linear infinite'}}>
    <svg viewBox="0 0 76 76" style={{width:'100%',height:'100%'}}>
      <defs>
        <radialGradient id="dg" cx="35%" cy="30%">
          <stop offset="0%" stopColor="white"/>
          <stop offset="60%" stopColor="#bbb"/>
          <stop offset="100%" stopColor="#555"/>
        </radialGradient>
      </defs>
      <circle cx="38" cy="38" r="36" fill="url(#dg)"/>
      {Array.from({length:30}).map((_,i)=>(
        <rect key={i} x={12+(i%6)*9} y={12+Math.floor(i/6)*9} width="6" height="6" rx="1"
          fill={`hsl(${i*30},100%,70%)`} opacity="0.72"/>
      ))}
      <ellipse cx="26" cy="24" rx="9" ry="5" fill="white" opacity="0.3"/>
    </svg>
    <div style={{position:'absolute',top:'-44px',left:'50%',width:'1px',height:'44px',background:'linear-gradient(to bottom,transparent,rgba(255,255,255,0.35))',transform:'translateX(-50%)'}}/>
  </div>
);

const LogoutOverlay = () => (
  <div style={{
    position:'fixed',inset:0,
    background:'linear-gradient(135deg,#0d001f 0%,#1a0035 50%,#0d001f 100%)',
    display:'flex',flexDirection:'column',
    alignItems:'center',justifyContent:'center',
    zIndex:99999,
    animation:'overlayIn 0.4s ease forwards',
    padding:'16px',
  }}>
    {Array.from({length:14}).map((_,i)=>(
      <div key={i} style={{
        position:'absolute',
        top:`${15+(i*11)%70}%`,left:`${(i*19+3)%94}%`,
        width:'5px',height:'5px',borderRadius:'50%',
        background:['#e04472','#c026d3','#7c3aed','#aa00ff','#ec4899'][i%5],
        animation:`particle ${1+i*0.2}s linear infinite`,
        animationDelay:`${i*0.1}s`,
        boxShadow:'0 0 6px 3px currentColor',
      }}/>
    ))}
    <div style={{fontSize:'clamp(48px,10vw,80px)',marginBottom:'24px',animation:'colorCycle 2s linear infinite'}}>👋</div>
    <div className="logout-box" style={{
      background:'rgba(10,0,25,0.95)',
      border:'2px solid rgba(192,38,211,0.6)',
      borderRadius:'24px',padding:'36px 48px',
      textAlign:'center',
      boxShadow:'0 0 80px rgba(192,38,211,0.5),0 30px 80px rgba(0,0,0,0.9)',
      animation:'overlayIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
      minWidth:'320px',
      width:'clamp(280px,90vw,420px)',
      boxSizing:'border-box',
    }}>
      <div style={{fontSize:'clamp(28px,6vw,42px)',marginBottom:'12px'}}>🚪</div>
      <h2 style={{
        color:'white',fontSize:'clamp(20px,5vw,28px)',fontWeight:'900',
        fontFamily:"'Bebas Neue',sans-serif",
        letterSpacing:'4px',margin:'0 0 8px',
        textShadow:'2px 0 #e04472,-2px 0 #aa00ff',
      }}>LOGGED OUT</h2>
      <p style={{color:'#c026d3',fontSize:'clamp(12px,3vw,15px)',fontWeight:'600',margin:'0 0 6px',fontFamily:"'Outfit',sans-serif"}}>
        Logout Successful! 🎉
      </p>
      <p style={{color:'#6b21a8',fontSize:'clamp(10px,2vw,12px)',letterSpacing:'2px',margin:'0',fontFamily:"'Outfit',sans-serif",textTransform:'uppercase'}}>
        Redirecting to shop...
      </p>
      <div style={{marginTop:'20px',height:'4px',background:'rgba(255,255,255,0.1)',borderRadius:'4px',overflow:'hidden'}}>
        <div style={{height:'100%',background:'linear-gradient(90deg,#e04472,#c026d3,#7c3aed)',borderRadius:'4px',animation:'countDown 2s linear forwards'}}/>
      </div>
    </div>
    {['🍷','🍇','🥂','🍾','✨'].map((e,i)=>(
      <div key={i} style={{position:'absolute',top:'-10%',left:`${10+i*18}%`,fontSize:'28px',animation:`particle ${1.5+i*0.3}s ease-in infinite`,animationDelay:`${i*0.2}s`}}>{e}</div>
    ))}
  </div>
);

const Toast = ({ message, type }) => (
  <div className="toast-box" style={{
    position:'fixed',top:'28px',left:'50%',transform:'translateX(-50%)',
    background:type==='success'?'linear-gradient(135deg,#134e2a,#065f46)':'linear-gradient(135deg,#7f1d1d,#991b1b)',
    border:`1.5px solid ${type==='success'?'#10b981':'#ef4444'}`,
    borderRadius:'18px',padding:'18px 34px',
    display:'flex',alignItems:'center',gap:'14px',
    boxShadow:`0 25px 70px rgba(0,0,0,0.85),0 0 40px ${type==='success'?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'}`,
    zIndex:9999,
    width:'clamp(280px,90vw,400px)',
    minWidth:'unset',
    justifyContent:'center',
    animation:'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
    fontFamily:"'Outfit',sans-serif",
    boxSizing:'border-box',
  }}>
    <span style={{fontSize:'clamp(22px,5vw,32px)'}}>{type==='success'?'🎉':'❌'}</span>
    <div>
      <div style={{color:'white',fontWeight:'800',fontSize:'clamp(13px,3vw,16px)',letterSpacing:'0.5px'}}>{message}</div>
      <div style={{color:type==='success'?'#6ee7b7':'#fca5a5',fontSize:'clamp(10px,2vw,12px)',marginTop:'3px'}}>
        {type==='success'?'Welcome! Redirecting to admin...':'Check your credentials and try again.'}
      </div>
    </div>
  </div>
);

const AdminLogin = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [toast,       setToast]       = useState(null);
  const [showLogout,  setShowLogout]  = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [regForm, setRegForm] = useState({ fullName:'', email:'', password:'', role:'Staff' });

  const { login } = useAuth();
  const navigate  = useNavigate();

  useEffect(()=>{
    if(!document.getElementById('admin-login-styles')){
      const s=document.createElement('style');
      s.id='admin-login-styles';
      s.textContent=STYLES;
      document.head.appendChild(s);
    }
    setTimeout(()=>setMounted(true),60);
  },[]);

  const showToast=(msg,type)=>{ setToast({message:msg,type}); setTimeout(()=>setToast(null),3200); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await login(email, password);
      if (data.role === 'Admin' || data.role === 'Staff') {
        showToast('Login Successful!', 'success');
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        setError('You are not authorized to access admin panel.');
      }
    } catch {
      showToast('Invalid email or password.', 'error');
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!regForm.fullName || !regForm.email || !regForm.password) { showToast('Please fill all fields!', 'error'); return; }
    setRegistering(true);
    try {
      const { default: axiosInstance } = await import('../api/axios');
      await axiosInstance.post('/auth/register', { fullName:regForm.fullName, email:regForm.email, password:regForm.password, role:regForm.role, phone:'', address:'' });
      showToast(`${regForm.role} added successfully!`, 'success');
      setRegForm({ fullName:'', email:'', password:'', role:'Staff' });
      setShowRegister(false);
    } catch {
      showToast('Email already exists!', 'error');
    } finally {
      setRegistering(false);
    }
  };

  const handleLogout=()=>{ setShowLogout(true); setTimeout(()=>navigate('/'),2200); };

  const inputStyle = {
    width:'100%',background:'rgba(255,255,255,0.04)',
    border:'1.5px solid rgba(192,38,211,0.25)',
    borderRadius:'12px',padding:'13px 16px',
    color:'white',outline:'none',
    fontSize:'clamp(13px,2.5vw,14px)',
    boxSizing:'border-box',transition:'all 0.3s',
    fontFamily:"'Outfit',sans-serif",
  };

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg,#0d001f 0%,#1a0035 25%,#2e0050 50%,#1a0035 75%,#0d001f 100%)',
      backgroundSize:'400% 400%',
      animation:'bgShift 8s ease infinite',
      display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',
      padding:'clamp(12px,4vw,24px)',
      position:'relative',
      fontFamily:"'Outfit',sans-serif",
      overflow:'hidden',
    }}>
      <DJLights/>
      <DiscoBall/>
      {showLogout && <LogoutOverlay/>}
      {toast && <Toast message={toast.message} type={toast.type}/>}

      {/* Party Scene */}
      <div style={{
        width:'100%',maxWidth:'720px',zIndex:2,
        opacity:mounted?1:0,
        animation:mounted?'slideUp 0.6s ease forwards':'none',
        marginBottom:'-8px',
      }}>
        <PartyScene/>
      </div>

      {/* Logo */}
      <div style={{
        textAlign:'center',zIndex:2,
        marginBottom:'clamp(8px,2vw,14px)',
        opacity:mounted?1:0,
        animation:mounted?'slideUp 0.7s ease 0.1s forwards':'none',
      }}>
        <div style={{fontSize:'clamp(36px,8vw,50px)',animation:'colorCycle 3s linear infinite'}}>🍷</div>
        <h1 className="admin-logo-title" style={{
          color:'white',margin:'4px 0 0',
          fontSize:'clamp(28px,7vw,42px)',fontWeight:'900',
          fontFamily:"'Bebas Neue',sans-serif",
          letterSpacing:'6px',
          animation:'glitch 4s ease-in-out infinite',
          textShadow:'2px 0 #e04472,-2px 0 #aa00ff',
        }}>WINE SHOP</h1>
        <p className="admin-subtitle" style={{
          color:'#c026d3',
          fontSize:'clamp(9px,2vw,11px)',
          letterSpacing:'5px',
          textTransform:'uppercase',margin:'4px 0 0',fontWeight:'600',
        }}>✦ Admin Portal ✦</p>
      </div>

      {/* Card */}
      <div style={{
        width:'100%',maxWidth:'420px',zIndex:2,
        opacity:mounted?1:0,
        animation:mounted?'slideUp 0.8s ease 0.2s forwards':'none',
      }}>
        <div className="admin-card" style={{
          background:'rgba(10,0,25,0.93)',
          border:'1px solid rgba(192,38,211,0.4)',
          borderRadius:'24px',
          padding:'clamp(20px,5vw,36px)',
          boxShadow:'0 30px 80px rgba(0,0,0,0.9),inset 0 1px 0 rgba(255,255,255,0.06)',
          animation:'floatCard 4s ease-in-out infinite,glowPulse 3s ease-in-out infinite',
          backdropFilter:'blur(24px)',
        }}>
          <h2 style={{
            color:'white',
            fontSize:'clamp(14px,3vw,18px)',
            fontWeight:'700',marginBottom:'24px',
            textAlign:'center',letterSpacing:'1px',
          }}>
            🔐 Admin Sign In
          </h2>

          {error && (
            <div style={{
              background:'rgba(220,38,38,0.15)',border:'1px solid rgba(220,38,38,0.5)',
              color:'#fca5a5',padding:'12px 16px',borderRadius:'12px',
              marginBottom:'16px',fontSize:'clamp(11px,2.5vw,13px)',
              animation:'slideUp 0.3s ease',
            }}>⚠️ {error}</div>
          )}

          <div style={{marginBottom:'16px'}}>
            <label style={{color:'#a78bfa',fontSize:'clamp(9px,2vw,11px)',display:'block',marginBottom:'6px',letterSpacing:'2px',textTransform:'uppercase',fontWeight:'600'}}>
              Admin Email
            </label>
            <input className="admin-input" type="email" placeholder="admin@wineshop.com"
              value={email} onChange={e=>setEmail(e.target.value)} required style={inputStyle}
            />
          </div>
          <div style={{marginBottom:'clamp(16px,4vw,28px)'}}>
            <label style={{color:'#a78bfa',fontSize:'clamp(9px,2vw,11px)',display:'block',marginBottom:'6px',letterSpacing:'2px',textTransform:'uppercase',fontWeight:'600'}}>
              Password
            </label>
            <input className="admin-input" type="password" placeholder="••••••••"
              value={password} onChange={e=>setPassword(e.target.value)} required style={inputStyle}
            />
          </div>
          <button
            onClick={handleSubmit}
            className="admin-btn" disabled={loading}
            style={{
              width:'100%',padding:'clamp(11px,3vw,15px)',
              background:loading?'rgba(192,38,211,0.4)':'linear-gradient(135deg,#e04472 0%,#c026d3 50%,#7c3aed 100%)',
              border:'none',borderRadius:'14px',color:'white',fontWeight:'800',
              cursor:loading?'not-allowed':'pointer',
              fontSize:'clamp(13px,2.5vw,15px)',
              letterSpacing:'1px',fontFamily:"'Outfit',sans-serif",
              transition:'all 0.25s',
              animation:loading?'none':'btnPulse 2.5s ease-in-out infinite',
              boxShadow:'0 8px 30px rgba(192,38,211,0.45)',
            }}>
            {loading?'⏳ Signing in...':'🔐 Sign In'}
          </button>

          <div style={{display:'flex',alignItems:'center',gap:'12px',margin:'22px 0 18px'}}>
            <div style={{flex:1,height:'1px',background:'rgba(192,38,211,0.2)'}}/>
            <span style={{color:'#6b21a8',fontSize:'11px',letterSpacing:'1px'}}>or</span>
            <div style={{flex:1,height:'1px',background:'rgba(192,38,211,0.2)'}}/>
          </div>

          <button className="back-btn" onClick={()=>navigate('/')} style={{
            width:'100%',background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.1)',
            color:'#9ca3af',cursor:'pointer',
            fontSize:'clamp(11px,2.5vw,13px)',
            borderRadius:'10px',padding:'11px',
            fontFamily:"'Outfit',sans-serif",transition:'all 0.2s',fontWeight:'600',
          }}>← Back to Shop</button>
        </div>

        {/* Add New User */}
        <div style={{marginTop:'16px'}}>
          <button onClick={()=>setShowRegister(!showRegister)} style={{
            width:'100%',
            background:showRegister?'rgba(220,38,38,0.1)':'rgba(192,38,211,0.1)',
            border:`1px solid ${showRegister?'rgba(220,38,38,0.3)':'rgba(192,38,211,0.3)'}`,
            borderRadius:'12px',padding:'12px',
            color:showRegister?'#f87171':'#c026d3',
            cursor:'pointer',fontSize:'clamp(11px,2.5vw,13px)',fontWeight:'700',
            fontFamily:"'Outfit',sans-serif",letterSpacing:'1px',transition:'all 0.2s',
          }}>
            {showRegister?'✕ Cancel':'➕ Add New User'}
          </button>

          {showRegister && (
            <div style={{
              marginTop:'12px',background:'rgba(10,0,25,0.95)',
              border:'1px solid rgba(192,38,211,0.3)',
              borderRadius:'16px',padding:'clamp(16px,4vw,24px)',
              boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
            }}>
              <h3 style={{
                color:'white',fontSize:'clamp(12px,3vw,15px)',fontWeight:'700',
                marginBottom:'20px',textAlign:'center',
                letterSpacing:'2px',textTransform:'uppercase',
                fontFamily:"'Outfit',sans-serif",
              }}>➕ Add New User</h3>

              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                {[
                  {label:'Full Name',key:'fullName',type:'text',placeholder:'John Doe'},
                  {label:'Email',key:'email',type:'email',placeholder:'user@wineshop.com'},
                  {label:'Password',key:'password',type:'password',placeholder:'••••••••'},
                ].map(({label,key,type,placeholder})=>(
                  <div key={key}>
                    <label style={{color:'#a78bfa',fontSize:'clamp(9px,2vw,11px)',display:'block',marginBottom:'6px',letterSpacing:'2px',textTransform:'uppercase',fontWeight:'600'}}>
                      {label}
                    </label>
                    <input type={type} placeholder={placeholder} value={regForm[key]}
                      onChange={e=>setRegForm({...regForm,[key]:e.target.value})}
                      style={{...inputStyle,background:'rgba(255,255,255,0.05)'}}
                    />
                  </div>
                ))}

                <div>
                  <label style={{color:'#a78bfa',fontSize:'clamp(9px,2vw,11px)',display:'block',marginBottom:'8px',letterSpacing:'2px',textTransform:'uppercase',fontWeight:'600'}}>
                    Role
                  </label>
                  <div className="admin-register-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
                    {[
                      {role:'Admin',icon:'👑',desc:'Full Access'},
                      {role:'Staff',icon:'👔',desc:'Limited Access'},
                      {role:'Customer',icon:'🛒',desc:'Shop Only'},
                    ].map(({role,icon,desc})=>(
                      <div key={role} onClick={()=>setRegForm({...regForm,role})} style={{
                        padding:'clamp(6px,2vw,10px) 6px',borderRadius:'10px',
                        textAlign:'center',cursor:'pointer',
                        background:regForm.role===role?'rgba(192,38,211,0.25)':'rgba(255,255,255,0.04)',
                        border:`1.5px solid ${regForm.role===role?'#c026d3':'rgba(255,255,255,0.1)'}`,
                        transition:'all 0.2s',
                      }}>
                        <div style={{fontSize:'clamp(14px,4vw,20px)',marginBottom:'4px'}}>{icon}</div>
                        <p style={{color:regForm.role===role?'white':'#9ca3af',fontSize:'clamp(9px,2vw,11px)',fontWeight:'700',margin:'0 0 2px'}}>{role}</p>
                        <p style={{color:'#6b21a8',fontSize:'clamp(8px,1.5vw,10px)',margin:0}}>{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={handleRegister} disabled={registering} style={{
                  width:'100%',padding:'clamp(10px,3vw,13px)',marginTop:'4px',
                  background:registering?'rgba(192,38,211,0.4)':'linear-gradient(135deg,#e04472,#c026d3,#7c3aed)',
                  border:'none',borderRadius:'12px',color:'white',fontWeight:'800',
                  cursor:registering?'not-allowed':'pointer',
                  fontSize:'clamp(12px,2.5vw,14px)',letterSpacing:'1px',
                  fontFamily:"'Outfit',sans-serif",
                  boxShadow:'0 4px 20px rgba(192,38,211,0.4)',
                }}>
                  {registering?'⏳ Adding User...':'✅ Add User'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{
          textAlign:'center',color:'#4b2670',
          fontSize:'clamp(9px,2vw,11px)',
          marginTop:'16px',letterSpacing:'2px',
        }}>
          🔒 SECURE ADMIN ACCESS • WINE SHOP CMS
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;