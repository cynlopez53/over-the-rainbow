// Enhanced healing agent chat widget with consent, history load, typing indicator, and delete transcript
(function(){
  function createWidget(){
    const container = document.createElement('div');
    container.id = 'healing-agent-widget';
    container.innerHTML = `
      <style>
        #healing-agent-widget { position: fixed; right: 20px; bottom: 20px; z-index: 10000; font-family: sans-serif }
        #healing-agent-toggle { background:#6b4fcf;color:#fff;border:none;padding:12px;border-radius:999px;cursor:pointer }
        #healing-agent-modal { display:none; width:360px; max-width:90vw; background:#fff;border-radius:8px; box-shadow:0 8px 30px rgba(0,0,0,.2); overflow:hidden }
        #healing-agent-header { background:#6b4fcf;color:#fff;padding:10px;font-weight:600;display:flex;justify-content:space-between;align-items:center }
        #healing-agent-messages { height:260px; overflow:auto;padding:12px; background: #fbf9ff }
        .ha-msg { margin:6px 0;padding:10px;border-radius:10px;max-width:80%;line-height:1.3 }
        .ha-user { background:#eef2ff; margin-left:auto; text-align:right }
        .ha-agent { background:#f3f3f3 }
        #healing-agent-input { display:flex;border-top:1px solid #eee }
        #healing-agent-input input { flex:1;border:0;padding:12px;font-size:14px }
        #healing-agent-input button { border:0;background:#6b4fcf;color:#fff;padding:12px }
        #ha-consent { padding:10px; font-size:13px; background:#fff }
        #ha-controls { display:flex; gap:8px }
        #ha-delete { background:#fff;border:1px solid #e5d8ff;color:#7c3aed;padding:6px;border-radius:6px;cursor:pointer }
        #ha-delete:hover { background:#f9f5ff }
        .ha-typing { font-style:italic; color:#666 }
      </style>
      <button id="healing-agent-toggle" aria-label="Open support chat">💜</button>
      <div id="healing-agent-modal" role="dialog" aria-hidden="true">
        <div id="healing-agent-header">
          <div>Healing Support</div>
          <div id="ha-controls"><button id="ha-delete">Delete Transcript</button></div>
        </div>
        <div id="ha-consent">
          <label><input id="ha-consent-checkbox" type="checkbox"> I consent to sending messages to the healing assistant (no personal data shared)</label>
        </div>
        <div id="healing-agent-messages"></div>
        <div id="healing-agent-input">
          <input id="ha-input" placeholder="Write a thought or ask for support..." aria-label="message input" />
          <button id="ha-send">Send</button>
        </div>
      </div>
    `;
    document.body.appendChild(container);

    const toggle = document.getElementById('healing-agent-toggle');
    const modal = document.getElementById('healing-agent-modal');
    const messages = document.getElementById('healing-agent-messages');
    const input = document.getElementById('ha-input');
    const send = document.getElementById('ha-send');
    const consent = document.getElementById('ha-consent-checkbox');
    const delBtn = document.getElementById('ha-delete');

    let sessionId = localStorage.getItem('ha_session') || null;

    function setModal(open){
      modal.style.display = open ? 'block' : 'none';
      modal.setAttribute('aria-hidden', open ? 'false' : 'true');
    }

    toggle.addEventListener('click', ()=> setModal(modal.style.display !== 'block'));

    function append(role, text, opts){
      const el = document.createElement('div');
      el.className = 'ha-msg ' + (role === 'user' ? 'ha-user' : 'ha-agent');
      if (opts && opts.html) el.innerHTML = text; else el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
      return el;
    }

    async function loadHistory(){
      if (!sessionId) return;
      try {
        const resp = await fetch(`/api/agent/conversations/${sessionId}`);
        if (!resp.ok) return;
        const data = await resp.json();
        (data.messages || []).forEach(m => append(m.role, m.text));
      } catch (err) { console.warn('Could not load history', err); }
    }

    async function sendMessage(){
      if (!consent.checked) { alert('Please consent to send messages to the assistant.'); return; }
      const text = input.value.trim();
      if (!text) return;
      append('user', text);
      input.value = '';

      // typing indicator
      const typingEl = append('agent', 'The assistant is thinking...', { html: false });
      typingEl.classList.add('ha-typing');

      try {
        const resp = await fetch('/api/agent/agentai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_input: text, sessionId })
        });
        const data = await resp.json();
        if (data.sessionId) { sessionId = data.sessionId; localStorage.setItem('ha_session', sessionId); }
        typingEl.remove();
        append('agent', data.comfort || data.reply || 'Sorry, no response.');
      } catch (err){
        typingEl.remove();
        append('agent', 'Network error; please try again later.');
        console.error(err);
      }
    }

    delBtn.addEventListener('click', async ()=>{
      if (!sessionId) { messages.innerHTML=''; return; }
      if (!confirm('Delete your transcript from this site? This cannot be undone.')) return;
      try {
        const resp = await fetch(`/api/agent/conversations/${sessionId}`, { method: 'DELETE' });
        if (resp.ok) {
          localStorage.removeItem('ha_session');
          sessionId = null;
          messages.innerHTML = '';
          alert('Transcript deleted.');
        } else {
          alert('Could not delete transcript.');
        }
      } catch (err) { console.error(err); alert('Network error.'); }
    });

    send.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e)=>{ if (e.key === 'Enter') sendMessage(); });

    // load history if session exists
    if (sessionId) loadHistory();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') createWidget();
  else document.addEventListener('DOMContentLoaded', createWidget);
})();
