import { readFileSync } from 'node:fs';
import { contribution } from './contribution.mjs';
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
const marker=/<!-- sandbox:([a-f0-9-]{36}) -->/.exec(pr.body||'');
requireThat(marker&&pr.user?.login,'PR must include a session marker and author');
requireThat(files[0].filename===`contributors/${pr.user.login}.yml`,'Filename must match PR author');
contribution(Buffer.from(blob.content,'base64').toString('utf8'),pr.user.login,marker[1]);
console.log('PASS: contribution YAML, author, session and allowed file verified.');
