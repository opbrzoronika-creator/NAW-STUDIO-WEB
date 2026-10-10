const K = 'naw_files', C = 'naw_chat', DAY = 864e5;
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(d)); } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn('Storage penuh', e); } };
export const loadFiles = () => read(K, []).filter((f) => !(f.trashed && f.trashedAt < Date.now() - 30 * DAY));
export const saveFiles = (a) => write(K, a);
export const loadChat = () => read(C, []);
export const saveChat = (a) => write(C, a.slice(-40));
export const newFile = (prompt, mode, code) => ({
  id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
  name: (prompt || 'Scene').slice(0, 40), prompt: prompt || '', mode, code, ts: Date.now(), trashed: false,
});
