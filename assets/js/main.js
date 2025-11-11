// Simple client-side JS to render the films list and add basic interactivity.
document.addEventListener('DOMContentLoaded', function () {
  const filmsListEl = document.getElementById('films-list');
  const filterInput = document.getElementById('filter');

  function renderFilms(films){
    if(!filmsListEl) return;
    filmsListEl.innerHTML = '';
    if(films.length === 0){
      filmsListEl.innerHTML = '<p class="note">No films match your search.</p>';
      return;
    }
    films.forEach(f => {
      const el = document.createElement('div');
      el.className = 'film';
      const img = f.image ? `<img class="thumb" loading="lazy" src="${escapeHtml(f.image)}" alt="${escapeHtml(f.title)}">` : '';
      el.innerHTML = `
        ${img}
        <div class="film-body">
          <h4>${escapeHtml(f.title)} <span class="meta">(${escapeHtml(f.year)})</span></h4>
          <div class="meta">Role: ${escapeHtml(f.role || '—')}</div>
          <div class="awards">${(f.awards||[]).map(a => `<span class="award">${escapeHtml(a)}</span>`).join('')}</div>
        </div>
      `;
      filmsListEl.appendChild(el);
    });
  }

  function loadFilms(){
    fetch('data/films.json')
      .then(r => r.json())
      .then(data => {
        window._films = data.films || [];
        renderFilms(window._films);
      })
      .catch(err => {
        if(filmsListEl) filmsListEl.innerHTML = '<p class="note">Could not load films data.</p>';
        console.error('Error loading films.json', err);
      });
  }

  function onFilter(){
    const q = filterInput ? filterInput.value.trim().toLowerCase() : '';
    if(!q){ renderFilms(window._films || []); return; }
    const filtered = (window._films||[]).filter(f => {
      return String(f.year).includes(q) || f.title.toLowerCase().includes(q) || (f.role||'').toLowerCase().includes(q);
    });
    renderFilms(filtered);
  }

  // small helper to avoid XSS when inserting plain text
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c];
    });
  }

  if(filterInput){
    filterInput.addEventListener('input', debounce(onFilter, 180));
  }

  loadFilms();

  // tiny debounce
  function debounce(fn, wait){
    let t;
    return function(){
      clearTimeout(t);
      const args = arguments; const ctx = this;
      t = setTimeout(()=>fn.apply(ctx,args), wait);
    }
  }
});
