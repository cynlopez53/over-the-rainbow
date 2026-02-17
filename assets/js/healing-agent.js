// // Enhanced healing agent chat widget - FIXED VERSION
(function(){
  function createWidget(){
    const container = document.createElement('div');
    container.id = 'healing-agent-widget';
    container.innerHTML = `
      <style>
        #healing-agent-widget { 
          position: fixed; 
          right: 20px; 
          bottom: 20px; 
          z-index: 10000; 
          font-family: 'Cormorant Garamond', serif;
        }
        #healing-agent-toggle { 
          background: #5D3FD3;
          color: #fff;
          border: none;
          padding: 15px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(93, 63, 211, 0.3);
          transition: all 0.3s ease;
        }
        #healing-agent-toggle:hover {
          background: #7a5bff;
          transform: scale(1.1);
        }
        #healing-agent-modal { 
          display: none; 
          width: 400px; 
          max-width: 90vw; 
          background: #fff;
          border-radius: 12px; 
          box-shadow: 0 8px 30px rgba(0,0,0,.3); 
          overflow: hidden;
          border: 1px solid rgba(93, 63, 211, 0.2);
        }
        #healing-agent-header { 
          background: #5D3FD3;
          color: #fff;
          padding: 15px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        #healing-agent-messages { 
          height: 300px; 
          overflow-y: auto;
          padding: 15px; 
          background: #fbf9ff;
        }
        .ha-msg { 
          margin: 10px 0;
          padding: 12px;
          border-radius: 12px;
          max-width: 85%;
          line-height: 1.4;
          font-size: 14px;
        }
        .ha-user { 
          background: #eef2ff; 
          margin-left: auto; 
          text-align: right;
          border-bottom-right-radius: 4px;
        }
        .ha-agent { 
          background: #f8f5ff;
          border-bottom-left-radius: 4px;
        }
        #healing-agent-input { 
          display: flex;
          border-top: 1px solid #eee;
          background: #fff;
        }
        #ha-input { 
          flex: 1;
          border: 0;
          padding: 15px;
          font-size: 14px;
          font-family: inherit;
        }
        #ha-input:focus {
          outline: none;
        }
        #ha-send { 
          border: 0;
          background: #5D3FD3;
          color: #fff;
          padding: 15px 20px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        #ha-send:hover {
          background: #7a5bff;
        }
        #ha-consent { 
          padding: 12px; 
          font-size: 13px; 
          background: #f9f7ff;
          border-bottom: 1px solid #eee;
        }
        #ha-controls { 
          display: flex; 
          gap: 8px;
        }
        #ha-delete { 
          background: #fff;
          border: 1px solid rgba(255,255,255,0.3);
          color: #fff;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
        }
        #ha-delete:hover { 
          background: rgba(255,255,255,0.2);
        }
        .ha-typing { 
          font-style: italic; 
          color: #666;
          background: #f8f5ff !important;
        }
        .ha-error {
          color: #e74c3c;
          background: #fdf2f2 !important;
          text-align: center;
          font-size: 12px;
        }
      </style>
      <button id="healing-agent-toggle" aria-label="Open healing support chat">💜 Healing Support</button>
      <div id="healing-agent-modal" role="dialog" aria-hidden="true">
        <div id="healing-agent-header">
          <div>💜 Healing Support Agent</div>
          <div id="ha-controls">
            <button id="ha-delete">Clear Chat</button>
          </div>
        </div>
        <div id="ha-consent">
          <label>
            <input id="ha-consent-checkbox" type="checkbox"> 
            I consent to chat with the healing assistant
          </label>
        </div>
        <div id="healing-agent-messages">
          <div class="ha-msg ha-agent">
            Hello, I'm here to provide comfort and support. Please share what's on your heart.
          </div>
        </div>
        <div id="healing-agent-input">
          <input id="ha-input" placeholder="Share your thoughts or ask for support..." aria-label="message input" />
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

    let chatHistory = [];

    function setModal(open){
      modal.style.display = open ? 'block' : 'none';
      modal.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) {
        input.focus();
      }
    }

    toggle.addEventListener('click', () => {
      const isOpen = modal.style.display === 'block';
      setModal(!isOpen);
    });

    function append(role, text, isError = false){
      const el = document.createElement('div');
      el.className = `ha-msg ${role === 'user' ? 'ha-user' : 'ha-agent'} ${isError ? 'ha-error' : ''}`;
      el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
      return el;
    }

    async function sendMessage(){
      if (!consent.checked) { 
        append('agent', 'Please check the consent box to chat.', true);
        return; 
      }
      
      const text = input.value.trim();
      if (!text) return;
      
      append('user', text);
      input.value = '';
      input.disabled = true;
      send.disabled = true;

      // Add typing indicator
      const typingEl = append('agent', 'The healing agent is thinking...');
      typingEl.classList.add('ha-typing');

      try {
        const response = await fetch('https://polished-frost-d1d8.btcam2019.workers.dev', {

          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            message: text 
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Remove typing indicator
        typingEl.remove();
        
        if (data.reply) {
          append('agent', data.reply);
          // Save to local history
          chatHistory.push({ role: 'user', text: text });
          chatHistory.push({ role: 'agent', text: data.reply });
          localStorage.setItem('ha_chat_history', JSON.stringify(chatHistory));
        } else {
          append('agent', 'No response received. Please try again.', true);
        }
        
      } catch (err) {
        console.error('Error:', err);
        typingEl.remove();
        append('agent', 'Sorry, there was an error connecting to the healing agent. Please try again.', true);
      } finally {
        input.disabled = false;
        send.disabled = false;
        input.focus();
      }
    }

    // Load chat history from localStorage
    function loadHistory() {
      try {
        const saved = localStorage.getItem('ha_chat_history');
        if (saved) {
          chatHistory = JSON.parse(saved);
          // Clear existing messages except the welcome message
          const welcomeMsg = messages.querySelector('.ha-msg');
          messages.innerHTML = '';
          if (welcomeMsg) messages.appendChild(welcomeMsg);
          
          // Add saved messages
          chatHistory.forEach(msg => append(msg.role, msg.text));
        }
      } catch (err) {
        console.warn('Could not load chat history:', err);
      }
    }

    delBtn.addEventListener('click', () => {
      if (!confirm('Clear all chat history? This cannot be undone.')) return;
      
      messages.innerHTML = '<div class="ha-msg ha-agent">Hello, I\'m here to provide comfort and support. Please share what\'s on your heart.</div>';
      chatHistory = [];
      localStorage.removeItem('ha_chat_history');
    });

    send.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) setModal(false);
    });

    // Load history when widget is created
    loadHistory();
  }

  // Initialize when page loads
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    createWidget();
  } else {
    document.addEventListener('DOMContentLoaded', createWidget);
  }
})();
