// CONFIGURAÇÃO DO CATÁLOGO.
const CONFIG = {
  moeda: 'BRL'
};

// CATÁLOGO DE EXEMPLO: substitua fotos, descrições e preços pelas peças reais.
// Fotos demonstrativas externas: requerem internet.
const produtos = [
  {id:1,nome:'Colar Ponto de Luz',categoria:'colares',preco:89.90,selo:'Mais vendido',foto:'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=85'},
  {id:2,nome:'Brinco Gota Dourada',categoria:'brincos',preco:69.90,selo:'Novo',foto:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85'},
  {id:3,nome:'Pulseira Elegance',categoria:'pulseiras',preco:79.90,selo:'',foto:'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=85'},
  {id:4,nome:'Anel Solitário',categoria:'aneis',preco:119.90,selo:'Favorito',foto:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85'},
  {id:5,nome:'Colar Minimalista',categoria:'colares',preco:99.90,selo:'',foto:'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85'},
  {id:6,nome:'Brinco Pérola Clássica',categoria:'brincos',preco:59.90,selo:'Novo',foto:'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=85'},
  {id:7,nome:'Pulseira Delicata',categoria:'pulseiras',preco:74.90,selo:'',foto:'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=85'},
  {id:8,nome:'Anel Coração',categoria:'aneis',preco:84.90,selo:'',foto:'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=85'},
  {id:9,nome:'Colar Lua',categoria:'colares',preco:95.90,selo:'',foto:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85'},
  {id:10,nome:'Brinco Argola Fina',categoria:'brincos',preco:54.90,selo:'',foto:'https://images.unsplash.com/photo-1635767798638-3665a9b7b4ee?auto=format&fit=crop&w=900&q=85'},
  {id:11,nome:'Pulseira Brilho',categoria:'pulseiras',preco:109.90,selo:'',foto:'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=85'},
  {id:12,nome:'Anel Dourado',categoria:'aneis',preco:89.90,selo:'',foto:'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=85'}
];

const categoriaLabel = {colares:'Colares',brincos:'Brincos',pulseiras:'Pulseiras',aneis:'Anéis'};
const formatarPreco = valor => new Intl.NumberFormat('pt-BR',{style:'currency',currency:CONFIG.moeda}).format(valor);
let filtroAtual='todos';
let mostrarTodos=false;
let apenasFavoritos=false;
const favoritos=new Set();
const grid=document.getElementById('productGrid');
const showMore=document.getElementById('showMore');
const toast=document.getElementById('toast');
let toastTimer;

function avisar(mensagem){
  toast.textContent=mensagem;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('visible'),2500);
}
function atualizarFavoritos(){
  const contador=document.getElementById('favCount');
  contador.textContent=favoritos.size;
  contador.hidden=!favoritos.size;
}
function renderizar(){
  let lista=produtos.filter(p=>(filtroAtual==='todos'||p.categoria===filtroAtual)&&(!apenasFavoritos||favoritos.has(p.id)));
  const exibidos=mostrarTodos?lista:lista.slice(0,8);
  document.getElementById('productTotal').textContent=`${lista.length} ${lista.length===1?'peça':'peças'}`;
  grid.innerHTML=exibidos.map(p=>`
    <article class="product-card">
      <div class="product-image">
        <img src="${p.foto}" alt="${p.nome}" loading="lazy" onerror="this.style.opacity='.15'">
        ${p.selo?`<span class="product-badge">${p.selo}</span>`:''}
        <button class="heart ${favoritos.has(p.id)?'selected':''}" data-favorite="${p.id}" aria-pressed="${favoritos.has(p.id)}" aria-label="${favoritos.has(p.id)?'Remover':'Adicionar'} ${p.nome} ${favoritos.has(p.id)?'das':'às'} favoritas"><svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg></button>
      </div>
      <div class="product-details"><span class="product-category">${categoriaLabel[p.categoria]}</span><h3>${p.nome}</h3><div class="product-price">${formatarPreco(p.preco)}</div><button class="product-buy" type="button" data-demo-contact aria-label="Demonstrar interesse em ${p.nome}">Tenho interesse <span>↗</span></button></div>
    </article>`).join('') || `<p class="empty-state">Nenhuma peça encontrada nesta seleção. ♡</p>`;
  showMore.hidden=lista.length<=8;
  showMore.innerHTML=mostrarTodos?'Ver menos peças <span>↑</span>':'Ver mais peças <span>↗</span>';
  document.querySelectorAll('.filter').forEach(b=>{
    const ativo=b.dataset.filter===filtroAtual&&!apenasFavoritos;
    b.classList.toggle('active',ativo);
    b.setAttribute('aria-pressed',ativo);
  });
  document.getElementById('favoritesTrigger').setAttribute('aria-pressed',apenasFavoritos);
}
function escolherCategoria(cat){filtroAtual=cat;mostrarTodos=false;apenasFavoritos=false;renderizar()}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>escolherCategoria(b.dataset.filter)));
document.querySelectorAll('[data-category-link]').forEach(a=>a.addEventListener('click',()=>escolherCategoria(a.dataset.categoryLink)));
showMore.addEventListener('click',()=>{mostrarTodos=!mostrarTodos;renderizar();if(!mostrarTodos)document.getElementById('produtos').scrollIntoView({behavior:'smooth'})});
grid.addEventListener('click',e=>{
  const btn=e.target.closest('[data-favorite]');if(!btn)return;
  const id=Number(btn.dataset.favorite);
  if(favoritos.has(id)){favoritos.delete(id);avisar('Peça removida das favoritas')}else{favoritos.add(id);avisar('Peça adicionada às favoritas ♡')}
  atualizarFavoritos();renderizar();
});
document.getElementById('favoritesTrigger').addEventListener('click',()=>{
  apenasFavoritos=!apenasFavoritos;filtroAtual='todos';mostrarTodos=true;
  renderizar();document.getElementById('produtos').scrollIntoView({behavior:'smooth'});
  if(apenasFavoritos&&!favoritos.size)avisar('Toque no coração das peças que mais gostar!');
});
document.addEventListener('click',e=>{
  if(e.target.closest('[data-demo-contact]')){
    avisar('Vitrine de demonstração. Nenhuma mensagem será enviada.');
  }
});
document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.getElementById('nav'),toggle=document.getElementById('menuToggle');
toggle.addEventListener('click',()=>{const aberto=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',aberto);toggle.setAttribute('aria-label',aberto?'Fechar menu':'Abrir menu')});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu')}));
renderizar();
