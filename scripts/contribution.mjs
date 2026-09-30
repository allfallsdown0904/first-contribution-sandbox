import {parseDocument,isMap,isScalar} from 'yaml';
export function contribution(text,login,session,{revision=false}={}) {
  if(typeof text!=='string'||Buffer.byteLength(text)>4096)throw Error('Contribution must be a small YAML file');
  const doc=parseDocument(text,{uniqueKeys:true,strict:true});
  if(doc.errors.length||doc.warnings.length||!isMap(doc.contents))throw Error('Invalid YAML mapping');
  for(const pair of doc.contents.items) {
    if(!isScalar(pair.key)||!isScalar(pair.value)||pair.key.anchor||pair.value.anchor||pair.value.tag)
      throw Error('Only simple string fields are allowed');
  }
  const fields=doc.toJS({maxAliasCount:0});
  const keys=['github','session','primary_language','learning_goal'];
  if(Object.keys(fields).some(k=>!keys.includes(k))||keys.some(k=>typeof fields[k]!=='string'||!fields[k].trim()))throw Error('Required fields: github, session, primary_language, learning_goal');
  if(fields.github!==login||fields.session!==session)throw Error('GitHub identity or session mismatch');
  if(fields.primary_language.length>80||fields.learning_goal.length>500)throw Error('Contribution field too long');
  if(revision&&fields.learning_goal.trim().length<20)throw Error('Please make learning_goal specific (20–500 characters)');
  return fields;
}
