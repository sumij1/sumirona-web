(() => {
  'use strict';
  const dialog = document.getElementById('mobile-menu');
  const trigger = document.querySelector('.menu-toggle');
  if (dialog && trigger) {
  const close = () => { if (dialog.open) dialog.close(); };
  trigger.addEventListener('click', () => {
    dialog.showModal();
    trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    dialog.querySelector('.menu-close').focus();
  });
  dialog.querySelector('.menu-close').addEventListener('click', close);
  dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  dialog.addEventListener('close', () => {
    trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    trigger.focus({ preventScroll: true });
  });
  const desktop = matchMedia('(min-width: 768px)');
  desktop.addEventListener('change', event => { if (event.matches) close(); });
  window.addEventListener('pagehide', close);
  }

  const musicButton = document.getElementById('music-toggle');
  const music = document.getElementById('site-music');
  const status = document.getElementById('music-status');
  if (!musicButton || !music || !status) return;
  const config = window.SUMIVEX_CONFIG || {};
  const source = typeof config.musicSrc === 'string' ? config.musicSrc.trim() : '';
  if (source) music.src = source;
  music.volume = Number.isFinite(config.musicVolume) ? Math.min(1, Math.max(0, config.musicVolume)) : 0.35;
  const message = text => { status.textContent = text; status.hidden = !text; };
  const syncMusicButton = () => {
    const playing = !music.paused;
    musicButton.setAttribute('aria-pressed', String(playing));
    musicButton.textContent = playing ? '♫ 停止音乐' : '♫ 开始音乐';
  };
  music.addEventListener('play', syncMusicButton);
  music.addEventListener('pause', syncMusicButton);
  music.addEventListener('error', () => { message('老牧师站长的土豆代码/服务器让音乐炸了。'); syncMusicButton(); });
  const startMusic = async ({ fromUser = false } = {}) => {
    if (!source) { message('没有可播放的音乐文件。'); return; }
    try {
      await music.play();
      message('');
    } catch {
      message(fromUser ? '音乐暂时无法播放，请稍后重试。' : '浏览器阻止了自动播放，请点击“开始音乐”。');
    } finally {
      syncMusicButton();
    }
  };
  // 页面进入后立即尝试播放；若浏览器拦截，会保留开始按钮供用户手动播放。
  music.autoplay = true;
  startMusic();
  musicButton.addEventListener('click', async () => {
    if (!music.paused) { music.pause(); message(''); return; }
    musicButton.disabled = true;
    musicButton.setAttribute('aria-busy', 'true');
    await startMusic({ fromUser: true });
    musicButton.disabled = false;
    musicButton.setAttribute('aria-busy', 'false');
  });
  window.addEventListener('pagehide', () => music.pause());
})();
