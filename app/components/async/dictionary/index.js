import { registerAsyncComponent } from '../../../globalState.js'

function up(dir){
    const pieces = dir.split('/');
    pieces.pop();
    return pieces.join('/')
}
const __dirname = up(import.meta.url);
const defaultLang = 'en';

async function jsYaml(){
    try{
        const module = await fetch(`${up(__dirname)}/3rd-party/js-yaml.min.js`).then(r => r.text());
        const f = new Function('window', module);
        const exports = {};
        f(exports);
        return exports.jsyaml
    } catch(e){
        return new Proxy({}, { get: (_, p) => () => _ })
    }
}

async function getSrc(){
    try{
        return await fetch(`${__dirname}/${navigator.language.slice(0, 2)}.yml`).then(r => r.text())
    } catch(e){
        try{
            return await fetch(`${__dirname}/${defaultLang}.yml`).then(r => r.text())
        } catch(e){
            return ''
        }
    }
}

let dict;

registerAsyncComponent('translate', (async () => {
    const src = getSrc();
    const jsYamlModule = await jsYaml();
    return jsYamlModule.load(await src)
})().then(v => (
    dict = v,
    phrase => dictionaryRecursiveIterator(phrase.split('.'), dict, phrase)
)));

function dictionaryRecursiveIterator(phrase, currentSection, realPhrase){
    if(!currentSection) return 'Translation for ' + realPhrase + ' not found';
    if(!phrase.length) return currentSection;
    dictionaryRecursiveIterator(phrase, currentSection[phrase.shift()], realPhrase)
}
