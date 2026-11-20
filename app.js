(function () {
  'use strict';

  const config = window.DASHBOARD_CONFIG;
  const invoices = window.SAMPLE_INVOICES;

  // The four steps every invoice goes through, in order.
  const STEP_NAMES = ['ERP', 'Our ASP', 'Buyer’s ASP', 'FTA'];
  const STEP_WORDS = { done: 'done', failed: 'rejected', pending: 'waiting' };

  // What the page remembers while someone uses it.
  const state = {
    filter: 'all', // which number in the strip is selected
    query: '',     // what is typed in the search box
    openId: null   // which row has its next step open
  };

  // Short helper to find one element.
  const $ = (selector) => document.querySelector(selector);

  // Make text safe before putting it into HTML.
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // An invoice is "near deadline" when it is not done and has 5 days or less left.
  function isUrgent(inv) {
    return inv.bucket !== 'done' && inv.days <= 5;
  }

  // The five views in the number strip.
  const VIEWS = {
    all: {
      label: 'All invoices',
      hint: 'Invoices that need action are listed first.',
      match: () => true
    },
    action: {
      label: 'Needs action',
      hint: 'Each one was rejected. Fix it in the ERP, then resend it.',
      match: (inv) => inv.bucket === 'action'
    },
    progress: {
      label: 'In progress',
      hint: 'These are on their way. Nothing to do yet.',
      match: (inv) => inv.bucket === 'progress'
    },
    done: {
      label: 'Done',
      hint: 'The buyer has these, and the FTA has the tax data.',
      match: (inv) => inv.bucket === 'done'
    },
    deadline: {
      label: 'Near deadline',
      hint: 'Not done yet, with 5 days or less left.',
      match: isUrgent
    }
  };
  const VIEW_ORDER = ['all', 'action', 'progress', 'done', 'deadline'];

  // ---------- Header ----------

  function renderHeader() {
    $('#subtitle').textContent =
      'Sample data for ' + config.companyName + ', sent through ' + config.aspName + '.';
    $('#updated').textContent = config.updatedAt;
  }

  // ---------- Health line or failed-run alert ----------

  function renderHealth() {
    if (config.showFailedRunAlert) {
      $('#health').innerHTML =
        '<div class="alert" role="alert">' +
          '<span class="alert-text"><strong>The 02:00 run failed, so invoices are not moving.</strong> ' +
          'If this is a system failure, tell the FTA within 2 business days.</span>' +
          '<button type="button" class="btn btn-alert" id="failure-log">View failure log</button>' +
        '</div>';
    } else {
      $('#health').innerHTML =
        '<div class="health">' +
          '<span class="dot" aria-hidden="true"></span>' +
          '<span>Connected to ' + escapeHtml(config.aspName) + '. Next run at ' + escapeHtml(config.nextRun) + '.</span>' +
        '</div>';
    }
  }

  // ---------- Number strip ----------

  function renderStrip() {
    $('#strip').innerHTML = VIEW_ORDER.map(function (key) {
      const view = VIEWS[key];
      const count = invoices.filter(view.match).length;
      const selected = state.filter === key;
      const attention = (key === 'action' || key === 'deadline') && count > 0;
      return (
        '<button type="button" class="seg' + (selected ? ' is-selected' : '') + '" ' +
          'data-filter="' + key + '" aria-pressed="' + selected + '">' +
          '<span class="seg-label">' + view.label + '</span>' +
          '<span class="seg-count' + (attention ? ' is-attention' : '') + '">' + count + '</span>' +
        '</button>'
      );
    }).join('');
  }

  // ---------- List heading ----------

  function renderListHead() {
    $('#list-title').textContent = VIEWS[state.filter].label;
    $('#list-hint').textContent = VIEWS[state.filter].hint;
  }

  // ---------- Table rows ----------

  function badgeHtml(bucket) {
    if (bucket === 'action') return '<span class="badge badge-action">Needs action</span>';
    if (bucket === 'progress') return '<span class="badge badge-progress">In progress</span>';
    return '<span class="badge badge-done">Done</span>';
  }

  function trackHtml(steps) {
    return steps.map(function (step, i) {
      return '<span class="bar bar-' + step + '" title="' + STEP_NAMES[i] + ': ' + STEP_WORDS[step] + '"></span>';
    }).join('');
  }

  function rowHtml(inv) {
    const id = escapeHtml(inv.id);
    const open = state.openId === inv.id;

    const nextStep = inv.bucket === 'done'
      ? '<span class="muted">Nothing to do</span>'
      : '<button type="button" class="link-btn" data-action="toggle-step" data-id="' + id + '" aria-expanded="' + open + '">' +
          (open ? 'Hide next step' : 'See next step') +
        '</button>';

    const daysText = inv.bucket === 'done' ? '—' : String(inv.days);
    const daysClass = isUrgent(inv) ? 'days-urgent' : 'muted';

    const action = inv.bucket === 'action'
      ? '<button type="button" class="btn btn-primary" data-action="resend" data-id="' + id + '">Resend</button>'
      : '';

    const panel = open
      ? '<div class="step-panel">' +
          '<strong>' + escapeHtml(inv.todo) + '</strong>' +
          '<span class="small muted">' + escapeHtml(inv.reason) + '</span>' +
        '</div>'
      : '';

    return (
      '<div class="row">' +
        '<div class="row-grid">' +
          '<div class="stack">' +
            '<span class="num strong">' + id + '</span>' +
            '<span class="small muted">' + escapeHtml(inv.date) + '</span>' +
          '</div>' +
          '<span>' + escapeHtml(inv.buyer) + '</span>' +
          '<span class="right num">' + escapeHtml(inv.amount) + '</span>' +
          '<div class="status">' +
            '<div class="status-top">' +
              badgeHtml(inv.bucket) +
              '<span class="track" aria-hidden="true">' + trackHtml(inv.steps) + '</span>' +
            '</div>' +
            '<span class="small muted">' + escapeHtml(inv.detail) + '</span>' +
          '</div>' +
          '<div>' + nextStep + '</div>' +
          '<div class="right"><span class="num ' + daysClass + '">' + daysText + '</span></div>' +
          '<div class="actions">' + action + '</div>' +
        '</div>' +
        panel +
      '</div>'
    );
  }

  function renderRows() {
    const q = state.query.trim().toLowerCase();
    const rows = invoices
      .filter(VIEWS[state.filter].match)
      .filter(function (inv) {
        return !q || inv.id.toLowerCase().includes(q) || inv.buyer.toLowerCase().includes(q);
      });

    if (rows.length === 0) {
      const message = q
        ? 'No invoices match your search. Try another invoice number or buyer name.'
        : 'No invoices in this view. Pick another number above to see more.';
      const clearButton = q
        ? '<button type="button" class="btn" data-action="clear-search">Clear search</button>'
        : '';
      $('#rows').innerHTML = '<div class="empty"><span>' + message + '</span>' + clearButton + '</div>';
      return;
    }

    $('#rows').innerHTML = rows.map(rowHtml).join('');
  }

  // ---------- Draw everything ----------

  function render() {
    renderHeader();
    renderHealth();
    renderStrip();
    renderListHead();
    renderRows();
  }

  // ---------- Clicks and typing ----------

  // Click a number in the strip to filter the table.
  $('#strip').addEventListener('click', function (event) {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    state.filter = button.dataset.filter;
    state.openId = null;
    renderStrip();
    renderListHead();
    renderRows();
    $('[data-filter="' + state.filter + '"]').focus();
  });

  // Type in the search box to filter by invoice number or buyer.
  $('#invoice-search').addEventListener('input', function (event) {
    state.query = event.target.value;
    renderRows();
  });

  // Buttons inside the table.
  $('#rows').addEventListener('click', function (event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;

    if (action === 'toggle-step') {
      const id = button.dataset.id;
      state.openId = state.openId === id ? null : id;
      renderRows();
      const again = document.querySelector('[data-action="toggle-step"][data-id="' + id + '"]');
      if (again) again.focus();
    }

    if (action === 'resend') {
      // Later: call your middleware API here to resend this invoice.
      button.textContent = 'Queued';
      button.disabled = true;
    }

    if (action === 'clear-search') {
      state.query = '';
      $('#invoice-search').value = '';
      renderRows();
      $('#invoice-search').focus();
    }
  });

  // Refresh button.
  $('#refresh').addEventListener('click', function () {
    // Later: fetch fresh invoices from your middleware API here, then call render().
    render();
  });

  render();
})();
