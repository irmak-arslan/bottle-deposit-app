const stores = [
  { id: 1, name: 'Greenway Market', kind: 'Grocery store', address: '128 Maple Street', distance: '0.3 mi', accepts: ['plastic', 'glass', 'cans'], status: 'Available', updated: '8 min ago' },
  { id: 2, name: 'Northside Co-op', kind: 'Food co-op', address: '45 Cedar Avenue', distance: '0.6 mi', accepts: ['plastic', 'glass'], status: 'Full', updated: '12 min ago' },
  { id: 3, name: 'QuickStop Central', kind: 'Convenience store', address: '302 Main Street', distance: '0.8 mi', accepts: ['plastic', 'cans'], status: 'Available', updated: '5 min ago' },
  { id: 4, name: 'Fresh Fields', kind: 'Grocery store', address: '77 Orchard Road', distance: '1.1 mi', accepts: ['plastic', 'glass', 'cans'], status: 'Out of Order', updated: '21 min ago' },
  { id: 5, name: 'Bottle & Can Depot', kind: 'Return center', address: '16 River Lane', distance: '1.4 mi', accepts: ['glass', 'cans'], status: 'Available', updated: '3 min ago' },
  { id: 6, name: 'Parkview Market', kind: 'Neighborhood market', address: '509 Pine Boulevard', distance: '1.8 mi', accepts: ['plastic', 'glass'], status: 'Available', updated: '16 min ago' }
];

const typeLabels = { plastic: 'Plastic', glass: 'Glass', cans: 'Cans' };
const grid = document.querySelector('#store-grid');
const resultCount = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');
const toast = document.querySelector('#toast');
const reportDialog = document.querySelector('#report-dialog');
const reportStoreName = document.querySelector('#report-store-name');
let activeFilter = 'all';
let toastTimer;
let reportingStoreId = null;

function statusClass(status) {
  if (status === 'Full') return 'status-full';
  if (status === 'Out of Order') return 'status-out';
  return 'status-available';
}

function renderStores() {
  const visibleStores = stores.filter((store) => activeFilter === 'all' || store.accepts.includes(activeFilter));
  grid.innerHTML = visibleStores.map((store) => `
    <article class="store-card" aria-label="${store.name}, machine ${store.status}">
      <div class="card-topline">
        <div><div class="store-type">${store.kind}</div><h3>${store.name}</h3></div>
        <span class="status-pill ${statusClass(store.status)}">${store.status}</span>
      </div>
      <p class="store-address"><span class="pin-icon" aria-hidden="true">⌖</span>${store.address}<span>·</span>${store.distance}</p>
      <div class="card-divider"></div>
      <div class="accept-label">ACCEPTS</div>
      <div class="type-tags">${store.accepts.map((type) => `<span class="type-tag">${typeLabels[type]}</span>`).join('')}</div>
      <div class="card-bottom"><span class="last-updated">Updated ${store.updated}</span><button class="report-button" type="button" data-store-id="${store.id}" aria-label="Report a machine issue at ${store.name}">Report an issue ↗</button></div>
    </article>
  `).join('');

  resultCount.innerHTML = `Showing <strong>${visibleStores.length} return ${visibleStores.length === 1 ? 'spot' : 'spots'}</strong>`;
  emptyState.hidden = visibleStores.length > 0;
  grid.hidden = visibleStores.length === 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

document.querySelectorAll('.filter-chip').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.filter-chip').forEach((chip) => {
      const selected = chip === button;
      chip.classList.toggle('active', selected);
      chip.setAttribute('aria-pressed', String(selected));
    });
    renderStores();
  });
});

document.querySelector('#reset-filter').addEventListener('click', () => {
  document.querySelector('[data-filter="all"]').click();
});

grid.addEventListener('click', (event) => {
  const button = event.target.closest('.report-button');
  if (!button) return;
  const store = stores.find((item) => item.id === Number(button.dataset.storeId));
  if (!store) return;
  reportingStoreId = store.id;
  reportStoreName.textContent = `${store.name} · ${store.address}`;
  reportDialog.showModal();
});

reportDialog.addEventListener('click', (event) => {
  const button = event.target.closest('[data-report-status]');
  if (!button || reportingStoreId === null) return;
  const store = stores.find((item) => item.id === reportingStoreId);
  const status = button.dataset.reportStatus;
  if (!store) return;
  store.status = status;
  store.updated = 'just now';
  reportDialog.close();
  reportingStoreId = null;
  renderStores();
  showToast(`Thanks for the update! ${store.name} is marked ${status}.`);
});

renderStores();
