/* ===== Mini-JS per il carousel ===== */
const imgs=document.querySelectorAll('.carousel-img');
let idx=0;
document.getElementById('prev').onclick=()=>change(-1);
document.getElementById('next').onclick=()=>change(1);
function change(step){
  imgs[idx].classList.remove('active');
  idx=(idx+step+imgs.length)%imgs.length;
  imgs[idx].classList.add('active');
} 