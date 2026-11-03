const button=document.querySelector('#copy');
const status=document.querySelector('#copy-status');
button.addEventListener('click',async()=>{
  try{
    await navigator.clipboard.writeText(document.querySelector('#prompt').textContent);
    status.textContent='已复制，可以粘贴到你的代理对话中。';
  }catch{
    const selection=window.getSelection();const range=document.createRange();
    range.selectNodeContents(document.querySelector('#prompt'));selection.removeAllRanges();selection.addRange(range);
    status.textContent='已选中示例，请按 Ctrl+C 或使用系统复制。';
  }
});
