import { readFileSync } from 'node:fs';
const event=JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH,'utf8')),pr=event.pull_request;
async function api(path) {
 const response=await fetch('https://api.github.com'+path,{headers:{Authorization:`Bearer ${process.env.GH_TOKEN}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw new Error(`GitHub API HTTP ${response.status}`);return response.json();
}
function requireThat(condition,message){if(!condition)throw new Error(message);}
requireThat(pr&&!pr.base.repo.private&&!pr.head.repo.private,'Public PR required');
const root=`/repos/${pr.base.repo.full_name}`;
const files=await api(root+`/pulls/${pr.number}/files?per_page=100`);
requireThat(files.length===1&&files[0].status==='added'&&/^contributors\/[a-zA-Z0-9-]+\.yml$/.test(files[0].filename),'Only add one contributors/<username>.yml file');
const blob=await api(`/repos/${pr.head.repo.full_name}/contents/${encodeURIComponent(files[0].filename)}?ref=${pr.head.sha}`);
requireThat(blob.type==='file'&&blob.size<=4096&&blob.encoding==='base64','Small regular text file required');
const fields={};
for(const line of Buffer.from(blob.content,'base64').toString('utf8').trim().split(/\r?\n/)){
 const m=/^(github|session|learning): ([^\r\n]+)$/.exec(line);requireThat(m&&!fields[m[1]],'Use simple unique github/session/learning fields');fields[m[1]]=m[2];
}
requireThat(/^[a-zA-Z0-9-]+$/.test(fields.github||'')&&files[0].filename===`contributors/${fields.github}.yml`,'GitHub name must match filename');
requireThat(/^[a-f0-9-]{36}$/.test(fields.session||''),'Session UUID required');
requireThat(pr.body?.includes(`<!-- sandbox:${fields.session} -->`),'PR must include sandbox task marker');
if(fields.learning)requireThat(fields.learning.length<=500,'Learning note too long');
console.log('PASS: contribution structure valid. Maintainer review checks identity and the learning revision.');
