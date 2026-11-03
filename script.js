const reveal=document.querySelector('#reveal');
const comparison=document.querySelector('.comparison');
reveal.addEventListener('input',()=>{
  comparison.style.setProperty('--reveal',`${reveal.value}%`);
  reveal.setAttribute('aria-valuetext',`迭代后画面显示 ${reveal.value}%`);
});
const scenes={house:{before:'原始工程：圆顶基础体块、简化门洞与遮阳板',after:'迭代后：细化屋体、拱形门框、窗框与连接完整的棚架'},village:{before:'原始工程：暖色村落与基础建筑',after:'迭代后：村落建筑、地面细节与远近线稿'}};
document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>{
  const name=button.dataset.scene;
  for(const stage of ['before','after']){
    const image=document.querySelector(`#${stage}-image`);
    image.src=`assets/${name}-${stage}.webp`;
    image.alt=scenes[name][stage];
    document.querySelector(`#${stage}-link`).href=image.src;
  }
  document.querySelectorAll('[data-scene]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
}));
const viewer=document.querySelector('#image-viewer');
const imageLinks=[...document.querySelectorAll('[data-viewer]')];
let currentImage=0;
function showImage(index){
  currentImage=(index+imageLinks.length)%imageLinks.length;
  const source=imageLinks[currentImage];
  document.querySelector('#viewer-image').src=source.href;
  document.querySelector('#viewer-image').alt=source.dataset.title;
  document.querySelector('#viewer-title').textContent=source.dataset.title;
  document.querySelector('#viewer-source').href=source.href;
}
imageLinks.forEach((link,index)=>link.addEventListener('click',event=>{
  if(typeof viewer.showModal!=='function'||event.metaKey||event.ctrlKey||event.shiftKey)return;
  event.preventDefault();showImage(index);viewer.showModal();
}));
document.querySelector('#viewer-close').addEventListener('click',()=>viewer.close());
document.querySelector('#viewer-prev').addEventListener('click',()=>showImage(currentImage-1));
document.querySelector('#viewer-next').addEventListener('click',()=>showImage(currentImage+1));
viewer.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'){event.preventDefault();showImage(currentImage-1);}
  if(event.key==='ArrowRight'){event.preventDefault();showImage(currentImage+1);}
});
const button=document.querySelector('#copy');
const status=document.querySelector('#copy-status');
button.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(document.querySelector('#prompt').textContent);status.textContent='已复制，可粘贴到代理对话中。';}
  catch{const range=document.createRange();range.selectNodeContents(document.querySelector('#prompt'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='已选中示例，请使用系统复制。';}
});
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('arrived');observer.unobserve(entry.target);}
  }),{threshold:.08});
  document.querySelectorAll('.work,.case-study,.skill-section').forEach(section=>observer.observe(section));
}

const divider=document.querySelector('.compare-divider');
function updateReveal(value){reveal.value=Math.max(0,Math.min(100,value));reveal.dispatchEvent(new Event('input'));}
divider.addEventListener('pointerdown',event=>{divider.setPointerCapture(event.pointerId);});
divider.addEventListener('pointermove',event=>{if(divider.hasPointerCapture(event.pointerId)){const rect=comparison.getBoundingClientRect();updateReveal((event.clientX-rect.left)/rect.width*100);}});
divider.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();updateReveal(Number(reveal.value)+(event.key==='ArrowRight'?5:-5));}});
