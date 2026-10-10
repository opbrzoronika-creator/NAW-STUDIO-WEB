import React, { useRef, useState } from 'react';

export default function Files({ t, lang, files, setFiles, onOpen, notify }) {
  const [sub, setSub] = useState('gen');
  const fileIn = useRef(null);
  const gen = files.filter((f) => !f.trashed), trash = files.filter((f) => f.trashed);
  const list = sub === 'gen' ? gen : trash;
  const upd = (id, patch) => setFiles((a) => a.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const del = (id) => setFiles((a) => a.filter((f) => f.id !== id));
  const rename = (f) => { const n = window.prompt(t('renamePrompt'), f.name); if (n && n.trim()) upd(f.id, { name: n.trim().slice(0, 60) }); };
  const forever = (id) => { if (window.confirm(t('confirmDel'))) del(id); };
  const emptyTrash = () => { if (trash.length && window.confirm(t('confirmDel'))) setFiles((a) => a.filter((f) => !f.trashed)); };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(files, null, 1)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'naw-copilot-backup.json'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };
  const importJson = async (e) => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return;
    try {
      const arr = JSON.parse(await file.text());
      if (!Array.isArray(arr) || arr.some((x) => typeof x.code !== 'string' || !x.id)) throw new Error('bad');
      setFiles((cur) => { const ids = new Set(cur.map((x) => x.id)); return [...cur, ...arr.filter((x) => !ids.has(x.id))]; });
      notify(t('imported'));
    } catch { notify(t('badFile')); }
  };

  return (
    <div>
      <div className="seg" style={{ marginTop: 4 }}>
        <button className={sub === 'gen' ? 'on' : ''} onClick={() => setSub('gen')}>📁 {t('filesGen')} ({gen.length})</button>
        <button className={sub === 'trash' ? 'on' : ''} onClick={() => setSub('trash')}>🗑 {t('filesTrash')} ({trash.length})</button>
      </div>
      {sub === 'trash' && <p className="msg" style={{ marginTop: 0 }}>{t('trashNote')}</p>}
      {list.length === 0 && <div className="empty">{sub === 'gen' ? t('emptyGen') : t('emptyTrash')}</div>}
      {list.map((f) => (
        <div className="file" key={f.id}>
          <div className={'thumb m' + f.mode}><span>{f.mode.toUpperCase()}</span></div>
          <div className="finfo">
            <b>{f.name}</b>
            <small>{new Date(f.ts).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })} · {f.prompt || '—'}</small>
            <div className="facts">
              {sub === 'gen' ? <>
                <button onClick={() => onOpen(f)}>{t('open')}</button>
                <button onClick={() => rename(f)}>{t('rename')}</button>
                <button className="dng" onClick={() => upd(f.id, { trashed: true, trashedAt: Date.now() })}>{t('del')}</button>
              </> : <>
                <button onClick={() => upd(f.id, { trashed: false, trashedAt: null })}>{t('restore')}</button>
                <button className="dng" onClick={() => forever(f.id)}>{t('delForever')}</button>
              </>}
            </div>
          </div>
        </div>
      ))}
      {sub === 'trash' && trash.length > 0 && <button className="btn o" style={{ width: '100%', marginTop: 8 }} onClick={emptyTrash}>{t('emptyBtn')}</button>}
      <div className="btns" style={{ marginTop: 14 }}>
        <button className="btn o" onClick={exportJson}>{t('backup')}</button>
        <button className="btn o" onClick={() => fileIn.current.click()}>{t('importBtn')}</button>
        <input ref={fileIn} type="file" accept="application/json,.json" hidden onChange={importJson} />
      </div>
    </div>
  );
}
