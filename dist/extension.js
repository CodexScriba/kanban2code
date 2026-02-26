"use strict";var sf=Object.create;var fr=Object.defineProperty;var af=Object.getOwnPropertyDescriptor;var of=Object.getOwnPropertyNames;var cf=Object.getPrototypeOf,lf=Object.prototype.hasOwnProperty;var g=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Ma=(e,t)=>{for(var n in t)fr(e,n,{get:t[n],enumerable:!0})},La=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of of(t))!lf.call(e,s)&&s!==n&&fr(e,s,{get:()=>t[s],enumerable:!(r=af(t,s))||r.enumerable});return e};var q=(e,t,n)=>(n=e!=null?sf(cf(e)):{},La(t||!e||!e.__esModule?fr(n,"default",{value:e,enumerable:!0}):n,e)),uf=e=>La(fr({},"__esModule",{value:!0}),e);var Fa=g(on=>{"use strict";Object.defineProperty(on,"__esModule",{value:!0});on.splitWhen=on.flatten=void 0;function df(e){return e.reduce((t,n)=>[].concat(t,n),[])}on.flatten=df;function pf(e,t){let n=[[]],r=0;for(let s of e)t(s)?(r++,n[r]=[]):n[r].push(s);return n}on.splitWhen=pf});var ja=g(mr=>{"use strict";Object.defineProperty(mr,"__esModule",{value:!0});mr.isEnoentCodeError=void 0;function ff(e){return e.code==="ENOENT"}mr.isEnoentCodeError=ff});var Ua=g(hr=>{"use strict";Object.defineProperty(hr,"__esModule",{value:!0});hr.createDirentFromStats=void 0;var ws=class{constructor(t,n){this.name=t,this.isBlockDevice=n.isBlockDevice.bind(n),this.isCharacterDevice=n.isCharacterDevice.bind(n),this.isDirectory=n.isDirectory.bind(n),this.isFIFO=n.isFIFO.bind(n),this.isFile=n.isFile.bind(n),this.isSocket=n.isSocket.bind(n),this.isSymbolicLink=n.isSymbolicLink.bind(n)}};function mf(e,t){return new ws(e,t)}hr.createDirentFromStats=mf});var $a=g(ee=>{"use strict";Object.defineProperty(ee,"__esModule",{value:!0});ee.convertPosixPathToPattern=ee.convertWindowsPathToPattern=ee.convertPathToPattern=ee.escapePosixPath=ee.escapeWindowsPath=ee.escape=ee.removeLeadingDotSegment=ee.makeAbsolute=ee.unixify=void 0;var hf=require("os"),gf=require("path"),qa=hf.platform()==="win32",yf=2,vf=/(\\?)([()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g,xf=/(\\?)([()[\]{}]|^!|[!+@](?=\())/g,_f=/^\\\\([.?])/,kf=/\\(?![!()+@[\]{}])/g;function bf(e){return e.replace(/\\/g,"/")}ee.unixify=bf;function wf(e,t){return gf.resolve(e,t)}ee.makeAbsolute=wf;function Sf(e){if(e.charAt(0)==="."){let t=e.charAt(1);if(t==="/"||t==="\\")return e.slice(yf)}return e}ee.removeLeadingDotSegment=Sf;ee.escape=qa?Ss:Cs;function Ss(e){return e.replace(xf,"\\$2")}ee.escapeWindowsPath=Ss;function Cs(e){return e.replace(vf,"\\$2")}ee.escapePosixPath=Cs;ee.convertPathToPattern=qa?Wa:Ha;function Wa(e){return Ss(e).replace(_f,"//$1").replace(kf,"/")}ee.convertWindowsPathToPattern=Wa;function Ha(e){return Cs(e)}ee.convertPosixPathToPattern=Ha});var Ga=g((gw,Ba)=>{Ba.exports=function(t){if(typeof t!="string"||t==="")return!1;for(var n;n=/(\\).|([@?!+*]\(.*\))/g.exec(t);){if(n[2])return!0;t=t.slice(n.index+n[0].length)}return!1}});var Ka=g((yw,Va)=>{var Cf=Ga(),za={"{":"}","(":")","[":"]"},Tf=function(e){if(e[0]==="!")return!0;for(var t=0,n=-2,r=-2,s=-2,i=-2,a=-2;t<e.length;){if(e[t]==="*"||e[t+1]==="?"&&/[\].+)]/.test(e[t])||r!==-1&&e[t]==="["&&e[t+1]!=="]"&&(r<t&&(r=e.indexOf("]",t)),r>t&&(a===-1||a>r||(a=e.indexOf("\\",t),a===-1||a>r)))||s!==-1&&e[t]==="{"&&e[t+1]!=="}"&&(s=e.indexOf("}",t),s>t&&(a=e.indexOf("\\",t),a===-1||a>s))||i!==-1&&e[t]==="("&&e[t+1]==="?"&&/[:!=]/.test(e[t+2])&&e[t+3]!==")"&&(i=e.indexOf(")",t),i>t&&(a=e.indexOf("\\",t),a===-1||a>i))||n!==-1&&e[t]==="("&&e[t+1]!=="|"&&(n<t&&(n=e.indexOf("|",t)),n!==-1&&e[n+1]!==")"&&(i=e.indexOf(")",n),i>n&&(a=e.indexOf("\\",n),a===-1||a>i))))return!0;if(e[t]==="\\"){var o=e[t+1];t+=2;var c=za[o];if(c){var l=e.indexOf(c,t);l!==-1&&(t=l+1)}if(e[t]==="!")return!0}else t++}return!1},Af=function(e){if(e[0]==="!")return!0;for(var t=0;t<e.length;){if(/[*?{}()[\]]/.test(e[t]))return!0;if(e[t]==="\\"){var n=e[t+1];t+=2;var r=za[n];if(r){var s=e.indexOf(r,t);s!==-1&&(t=s+1)}if(e[t]==="!")return!0}else t++}return!1};Va.exports=function(t,n){if(typeof t!="string"||t==="")return!1;if(Cf(t))return!0;var r=Tf;return n&&n.strict===!1&&(r=Af),r(t)}});var Za=g((vw,Ya)=>{"use strict";var Rf=Ka(),Pf=require("path").posix.dirname,Ef=require("os").platform()==="win32",Ts="/",Of=/\\/g,If=/[\{\[].*[\}\]]$/,Df=/(^|[^\\])([\{\[]|\([^\)]+$)/,Nf=/\\([\!\*\?\|\[\]\(\)\{\}])/g;Ya.exports=function(t,n){var r=Object.assign({flipBackslashes:!0},n);r.flipBackslashes&&Ef&&t.indexOf(Ts)<0&&(t=t.replace(Of,Ts)),If.test(t)&&(t+=Ts),t+="a";do t=Pf(t);while(Rf(t)||Df.test(t));return t.replace(Nf,"$1")}});var gr=g(Ee=>{"use strict";Ee.isInteger=e=>typeof e=="number"?Number.isInteger(e):typeof e=="string"&&e.trim()!==""?Number.isInteger(Number(e)):!1;Ee.find=(e,t)=>e.nodes.find(n=>n.type===t);Ee.exceedsLimit=(e,t,n=1,r)=>r===!1||!Ee.isInteger(e)||!Ee.isInteger(t)?!1:(Number(t)-Number(e))/Number(n)>=r;Ee.escapeNode=(e,t=0,n)=>{let r=e.nodes[t];r&&(n&&r.type===n||r.type==="open"||r.type==="close")&&r.escaped!==!0&&(r.value="\\"+r.value,r.escaped=!0)};Ee.encloseBrace=e=>e.type!=="brace"?!1:e.commas>>0+e.ranges>>0===0?(e.invalid=!0,!0):!1;Ee.isInvalidBrace=e=>e.type!=="brace"?!1:e.invalid===!0||e.dollar?!0:e.commas>>0+e.ranges>>0===0||e.open!==!0||e.close!==!0?(e.invalid=!0,!0):!1;Ee.isOpenOrClose=e=>e.type==="open"||e.type==="close"?!0:e.open===!0||e.close===!0;Ee.reduce=e=>e.reduce((t,n)=>(n.type==="text"&&t.push(n.value),n.type==="range"&&(n.type="text"),t),[]);Ee.flatten=(...e)=>{let t=[],n=r=>{for(let s=0;s<r.length;s++){let i=r[s];if(Array.isArray(i)){n(i);continue}i!==void 0&&t.push(i)}return t};return n(e),t}});var yr=g((_w,Ja)=>{"use strict";var Xa=gr();Ja.exports=(e,t={})=>{let n=(r,s={})=>{let i=t.escapeInvalid&&Xa.isInvalidBrace(s),a=r.invalid===!0&&t.escapeInvalid===!0,o="";if(r.value)return(i||a)&&Xa.isOpenOrClose(r)?"\\"+r.value:r.value;if(r.value)return r.value;if(r.nodes)for(let c of r.nodes)o+=n(c);return o};return n(e)}});var eo=g((kw,Qa)=>{"use strict";Qa.exports=function(e){return typeof e=="number"?e-e===0:typeof e=="string"&&e.trim()!==""?Number.isFinite?Number.isFinite(+e):isFinite(+e):!1}});var lo=g((bw,co)=>{"use strict";var to=eo(),Tt=(e,t,n)=>{if(to(e)===!1)throw new TypeError("toRegexRange: expected the first argument to be a number");if(t===void 0||e===t)return String(e);if(to(t)===!1)throw new TypeError("toRegexRange: expected the second argument to be a number.");let r={relaxZeros:!0,...n};typeof r.strictZeros=="boolean"&&(r.relaxZeros=r.strictZeros===!1);let s=String(r.relaxZeros),i=String(r.shorthand),a=String(r.capture),o=String(r.wrap),c=e+":"+t+"="+s+i+a+o;if(Tt.cache.hasOwnProperty(c))return Tt.cache[c].result;let l=Math.min(e,t),u=Math.max(e,t);if(Math.abs(l-u)===1){let _=e+"|"+t;return r.capture?`(${_})`:r.wrap===!1?_:`(?:${_})`}let d=oo(e)||oo(t),p={min:e,max:t,a:l,b:u},m=[],f=[];if(d&&(p.isPadded=d,p.maxLen=String(p.max).length),l<0){let _=u<0?Math.abs(u):1;f=no(_,Math.abs(l),p,r),l=p.a=0}return u>=0&&(m=no(l,u,p,r)),p.negatives=f,p.positives=m,p.result=Mf(f,m,r),r.capture===!0?p.result=`(${p.result})`:r.wrap!==!1&&m.length+f.length>1&&(p.result=`(?:${p.result})`),Tt.cache[c]=p,p.result};function Mf(e,t,n){let r=As(e,t,"-",!1,n)||[],s=As(t,e,"",!1,n)||[],i=As(e,t,"-?",!0,n)||[];return r.concat(i).concat(s).join("|")}function Lf(e,t){let n=1,r=1,s=so(e,n),i=new Set([t]);for(;e<=s&&s<=t;)i.add(s),n+=1,s=so(e,n);for(s=io(t+1,r)-1;e<s&&s<=t;)i.add(s),r+=1,s=io(t+1,r)-1;return i=[...i],i.sort(Uf),i}function Ff(e,t,n){if(e===t)return{pattern:e,count:[],digits:0};let r=jf(e,t),s=r.length,i="",a=0;for(let o=0;o<s;o++){let[c,l]=r[o];c===l?i+=c:c!=="0"||l!=="9"?i+=qf(c,l,n):a++}return a&&(i+=n.shorthand===!0?"\\d":"[0-9]"),{pattern:i,count:[a],digits:s}}function no(e,t,n,r){let s=Lf(e,t),i=[],a=e,o;for(let c=0;c<s.length;c++){let l=s[c],u=Ff(String(a),String(l),r),d="";if(!n.isPadded&&o&&o.pattern===u.pattern){o.count.length>1&&o.count.pop(),o.count.push(u.count[0]),o.string=o.pattern+ao(o.count),a=l+1;continue}n.isPadded&&(d=Wf(l,n,r)),u.string=d+u.pattern+ao(u.count),i.push(u),a=l+1,o=u}return i}function As(e,t,n,r,s){let i=[];for(let a of e){let{string:o}=a;!r&&!ro(t,"string",o)&&i.push(n+o),r&&ro(t,"string",o)&&i.push(n+o)}return i}function jf(e,t){let n=[];for(let r=0;r<e.length;r++)n.push([e[r],t[r]]);return n}function Uf(e,t){return e>t?1:t>e?-1:0}function ro(e,t,n){return e.some(r=>r[t]===n)}function so(e,t){return Number(String(e).slice(0,-t)+"9".repeat(t))}function io(e,t){return e-e%Math.pow(10,t)}function ao(e){let[t=0,n=""]=e;return n||t>1?`{${t+(n?","+n:"")}}`:""}function qf(e,t,n){return`[${e}${t-e===1?"":"-"}${t}]`}function oo(e){return/^-?(0+)\d/.test(e)}function Wf(e,t,n){if(!t.isPadded)return e;let r=Math.abs(t.maxLen-String(e).length),s=n.relaxZeros!==!1;switch(r){case 0:return"";case 1:return s?"0?":"0";case 2:return s?"0{0,2}":"00";default:return s?`0{0,${r}}`:`0{${r}}`}}Tt.cache={};Tt.clearCache=()=>Tt.cache={};co.exports=Tt});var Es=g((ww,yo)=>{"use strict";var Hf=require("util"),po=lo(),uo=e=>e!==null&&typeof e=="object"&&!Array.isArray(e),$f=e=>t=>e===!0?Number(t):String(t),Rs=e=>typeof e=="number"||typeof e=="string"&&e!=="",Wn=e=>Number.isInteger(+e),Ps=e=>{let t=`${e}`,n=-1;if(t[0]==="-"&&(t=t.slice(1)),t==="0")return!1;for(;t[++n]==="0";);return n>0},Bf=(e,t,n)=>typeof e=="string"||typeof t=="string"?!0:n.stringify===!0,Gf=(e,t,n)=>{if(t>0){let r=e[0]==="-"?"-":"";r&&(e=e.slice(1)),e=r+e.padStart(r?t-1:t,"0")}return n===!1?String(e):e},xr=(e,t)=>{let n=e[0]==="-"?"-":"";for(n&&(e=e.slice(1),t--);e.length<t;)e="0"+e;return n?"-"+e:e},zf=(e,t,n)=>{e.negatives.sort((o,c)=>o<c?-1:o>c?1:0),e.positives.sort((o,c)=>o<c?-1:o>c?1:0);let r=t.capture?"":"?:",s="",i="",a;return e.positives.length&&(s=e.positives.map(o=>xr(String(o),n)).join("|")),e.negatives.length&&(i=`-(${r}${e.negatives.map(o=>xr(String(o),n)).join("|")})`),s&&i?a=`${s}|${i}`:a=s||i,t.wrap?`(${r}${a})`:a},fo=(e,t,n,r)=>{if(n)return po(e,t,{wrap:!1,...r});let s=String.fromCharCode(e);if(e===t)return s;let i=String.fromCharCode(t);return`[${s}-${i}]`},mo=(e,t,n)=>{if(Array.isArray(e)){let r=n.wrap===!0,s=n.capture?"":"?:";return r?`(${s}${e.join("|")})`:e.join("|")}return po(e,t,n)},ho=(...e)=>new RangeError("Invalid range arguments: "+Hf.inspect(...e)),go=(e,t,n)=>{if(n.strictRanges===!0)throw ho([e,t]);return[]},Vf=(e,t)=>{if(t.strictRanges===!0)throw new TypeError(`Expected step "${e}" to be a number`);return[]},Kf=(e,t,n=1,r={})=>{let s=Number(e),i=Number(t);if(!Number.isInteger(s)||!Number.isInteger(i)){if(r.strictRanges===!0)throw ho([e,t]);return[]}s===0&&(s=0),i===0&&(i=0);let a=s>i,o=String(e),c=String(t),l=String(n);n=Math.max(Math.abs(n),1);let u=Ps(o)||Ps(c)||Ps(l),d=u?Math.max(o.length,c.length,l.length):0,p=u===!1&&Bf(e,t,r)===!1,m=r.transform||$f(p);if(r.toRegex&&n===1)return fo(xr(e,d),xr(t,d),!0,r);let f={negatives:[],positives:[]},_=oe=>f[oe<0?"negatives":"positives"].push(Math.abs(oe)),T=[],F=0;for(;a?s>=i:s<=i;)r.toRegex===!0&&n>1?_(s):T.push(Gf(m(s,F),d,p)),s=a?s-n:s+n,F++;return r.toRegex===!0?n>1?zf(f,r,d):mo(T,null,{wrap:!1,...r}):T},Yf=(e,t,n=1,r={})=>{if(!Wn(e)&&e.length>1||!Wn(t)&&t.length>1)return go(e,t,r);let s=r.transform||(p=>String.fromCharCode(p)),i=`${e}`.charCodeAt(0),a=`${t}`.charCodeAt(0),o=i>a,c=Math.min(i,a),l=Math.max(i,a);if(r.toRegex&&n===1)return fo(c,l,!1,r);let u=[],d=0;for(;o?i>=a:i<=a;)u.push(s(i,d)),i=o?i-n:i+n,d++;return r.toRegex===!0?mo(u,null,{wrap:!1,options:r}):u},vr=(e,t,n,r={})=>{if(t==null&&Rs(e))return[e];if(!Rs(e)||!Rs(t))return go(e,t,r);if(typeof n=="function")return vr(e,t,1,{transform:n});if(uo(n))return vr(e,t,0,n);let s={...r};return s.capture===!0&&(s.wrap=!0),n=n||s.step||1,Wn(n)?Wn(e)&&Wn(t)?Kf(e,t,n,s):Yf(e,t,Math.max(Math.abs(n),1),s):n!=null&&!uo(n)?Vf(n,s):vr(e,t,1,n)};yo.exports=vr});var _o=g((Sw,xo)=>{"use strict";var Zf=Es(),vo=gr(),Xf=(e,t={})=>{let n=(r,s={})=>{let i=vo.isInvalidBrace(s),a=r.invalid===!0&&t.escapeInvalid===!0,o=i===!0||a===!0,c=t.escapeInvalid===!0?"\\":"",l="";if(r.isOpen===!0)return c+r.value;if(r.isClose===!0)return console.log("node.isClose",c,r.value),c+r.value;if(r.type==="open")return o?c+r.value:"(";if(r.type==="close")return o?c+r.value:")";if(r.type==="comma")return r.prev.type==="comma"?"":o?r.value:"|";if(r.value)return r.value;if(r.nodes&&r.ranges>0){let u=vo.reduce(r.nodes),d=Zf(...u,{...t,wrap:!1,toRegex:!0,strictZeros:!0});if(d.length!==0)return u.length>1&&d.length>1?`(${d})`:d}if(r.nodes)for(let u of r.nodes)l+=n(u,r);return l};return n(e)};xo.exports=Xf});var wo=g((Cw,bo)=>{"use strict";var Jf=Es(),ko=yr(),cn=gr(),At=(e="",t="",n=!1)=>{let r=[];if(e=[].concat(e),t=[].concat(t),!t.length)return e;if(!e.length)return n?cn.flatten(t).map(s=>`{${s}}`):t;for(let s of e)if(Array.isArray(s))for(let i of s)r.push(At(i,t,n));else for(let i of t)n===!0&&typeof i=="string"&&(i=`{${i}}`),r.push(Array.isArray(i)?At(s,i,n):s+i);return cn.flatten(r)},Qf=(e,t={})=>{let n=t.rangeLimit===void 0?1e3:t.rangeLimit,r=(s,i={})=>{s.queue=[];let a=i,o=i.queue;for(;a.type!=="brace"&&a.type!=="root"&&a.parent;)a=a.parent,o=a.queue;if(s.invalid||s.dollar){o.push(At(o.pop(),ko(s,t)));return}if(s.type==="brace"&&s.invalid!==!0&&s.nodes.length===2){o.push(At(o.pop(),["{}"]));return}if(s.nodes&&s.ranges>0){let d=cn.reduce(s.nodes);if(cn.exceedsLimit(...d,t.step,n))throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");let p=Jf(...d,t);p.length===0&&(p=ko(s,t)),o.push(At(o.pop(),p)),s.nodes=[];return}let c=cn.encloseBrace(s),l=s.queue,u=s;for(;u.type!=="brace"&&u.type!=="root"&&u.parent;)u=u.parent,l=u.queue;for(let d=0;d<s.nodes.length;d++){let p=s.nodes[d];if(p.type==="comma"&&s.type==="brace"){d===1&&l.push(""),l.push("");continue}if(p.type==="close"){o.push(At(o.pop(),l,c));continue}if(p.value&&p.type!=="open"){l.push(At(l.pop(),p.value));continue}p.nodes&&r(p,s)}return l};return cn.flatten(r(e))};bo.exports=Qf});var Co=g((Tw,So)=>{"use strict";So.exports={MAX_LENGTH:1e4,CHAR_0:"0",CHAR_9:"9",CHAR_UPPERCASE_A:"A",CHAR_LOWERCASE_A:"a",CHAR_UPPERCASE_Z:"Z",CHAR_LOWERCASE_Z:"z",CHAR_LEFT_PARENTHESES:"(",CHAR_RIGHT_PARENTHESES:")",CHAR_ASTERISK:"*",CHAR_AMPERSAND:"&",CHAR_AT:"@",CHAR_BACKSLASH:"\\",CHAR_BACKTICK:"`",CHAR_CARRIAGE_RETURN:"\r",CHAR_CIRCUMFLEX_ACCENT:"^",CHAR_COLON:":",CHAR_COMMA:",",CHAR_DOLLAR:"$",CHAR_DOT:".",CHAR_DOUBLE_QUOTE:'"',CHAR_EQUAL:"=",CHAR_EXCLAMATION_MARK:"!",CHAR_FORM_FEED:"\f",CHAR_FORWARD_SLASH:"/",CHAR_HASH:"#",CHAR_HYPHEN_MINUS:"-",CHAR_LEFT_ANGLE_BRACKET:"<",CHAR_LEFT_CURLY_BRACE:"{",CHAR_LEFT_SQUARE_BRACKET:"[",CHAR_LINE_FEED:`
`,CHAR_NO_BREAK_SPACE:"\xA0",CHAR_PERCENT:"%",CHAR_PLUS:"+",CHAR_QUESTION_MARK:"?",CHAR_RIGHT_ANGLE_BRACKET:">",CHAR_RIGHT_CURLY_BRACE:"}",CHAR_RIGHT_SQUARE_BRACKET:"]",CHAR_SEMICOLON:";",CHAR_SINGLE_QUOTE:"'",CHAR_SPACE:" ",CHAR_TAB:"	",CHAR_UNDERSCORE:"_",CHAR_VERTICAL_LINE:"|",CHAR_ZERO_WIDTH_NOBREAK_SPACE:"\uFEFF"}});var Eo=g((Aw,Po)=>{"use strict";var em=yr(),{MAX_LENGTH:To,CHAR_BACKSLASH:Os,CHAR_BACKTICK:tm,CHAR_COMMA:nm,CHAR_DOT:rm,CHAR_LEFT_PARENTHESES:sm,CHAR_RIGHT_PARENTHESES:im,CHAR_LEFT_CURLY_BRACE:am,CHAR_RIGHT_CURLY_BRACE:om,CHAR_LEFT_SQUARE_BRACKET:Ao,CHAR_RIGHT_SQUARE_BRACKET:Ro,CHAR_DOUBLE_QUOTE:cm,CHAR_SINGLE_QUOTE:lm,CHAR_NO_BREAK_SPACE:um,CHAR_ZERO_WIDTH_NOBREAK_SPACE:dm}=Co(),pm=(e,t={})=>{if(typeof e!="string")throw new TypeError("Expected a string");let n=t||{},r=typeof n.maxLength=="number"?Math.min(To,n.maxLength):To;if(e.length>r)throw new SyntaxError(`Input length (${e.length}), exceeds max characters (${r})`);let s={type:"root",input:e,nodes:[]},i=[s],a=s,o=s,c=0,l=e.length,u=0,d=0,p,m=()=>e[u++],f=_=>{if(_.type==="text"&&o.type==="dot"&&(o.type="text"),o&&o.type==="text"&&_.type==="text"){o.value+=_.value;return}return a.nodes.push(_),_.parent=a,_.prev=o,o=_,_};for(f({type:"bos"});u<l;)if(a=i[i.length-1],p=m(),!(p===dm||p===um)){if(p===Os){f({type:"text",value:(t.keepEscaping?p:"")+m()});continue}if(p===Ro){f({type:"text",value:"\\"+p});continue}if(p===Ao){c++;let _;for(;u<l&&(_=m());){if(p+=_,_===Ao){c++;continue}if(_===Os){p+=m();continue}if(_===Ro&&(c--,c===0))break}f({type:"text",value:p});continue}if(p===sm){a=f({type:"paren",nodes:[]}),i.push(a),f({type:"text",value:p});continue}if(p===im){if(a.type!=="paren"){f({type:"text",value:p});continue}a=i.pop(),f({type:"text",value:p}),a=i[i.length-1];continue}if(p===cm||p===lm||p===tm){let _=p,T;for(t.keepQuotes!==!0&&(p="");u<l&&(T=m());){if(T===Os){p+=T+m();continue}if(T===_){t.keepQuotes===!0&&(p+=T);break}p+=T}f({type:"text",value:p});continue}if(p===am){d++;let T={type:"brace",open:!0,close:!1,dollar:o.value&&o.value.slice(-1)==="$"||a.dollar===!0,depth:d,commas:0,ranges:0,nodes:[]};a=f(T),i.push(a),f({type:"open",value:p});continue}if(p===om){if(a.type!=="brace"){f({type:"text",value:p});continue}let _="close";a=i.pop(),a.close=!0,f({type:_,value:p}),d--,a=i[i.length-1];continue}if(p===nm&&d>0){if(a.ranges>0){a.ranges=0;let _=a.nodes.shift();a.nodes=[_,{type:"text",value:em(a)}]}f({type:"comma",value:p}),a.commas++;continue}if(p===rm&&d>0&&a.commas===0){let _=a.nodes;if(d===0||_.length===0){f({type:"text",value:p});continue}if(o.type==="dot"){if(a.range=[],o.value+=p,o.type="range",a.nodes.length!==3&&a.nodes.length!==5){a.invalid=!0,a.ranges=0,o.type="text";continue}a.ranges++,a.args=[];continue}if(o.type==="range"){_.pop();let T=_[_.length-1];T.value+=o.value+p,o=T,a.ranges--;continue}f({type:"dot",value:p});continue}f({type:"text",value:p})}do if(a=i.pop(),a.type!=="root"){a.nodes.forEach(F=>{F.nodes||(F.type==="open"&&(F.isOpen=!0),F.type==="close"&&(F.isClose=!0),F.nodes||(F.type="text"),F.invalid=!0)});let _=i[i.length-1],T=_.nodes.indexOf(a);_.nodes.splice(T,1,...a.nodes)}while(i.length>0);return f({type:"eos"}),s};Po.exports=pm});var Do=g((Rw,Io)=>{"use strict";var Oo=yr(),fm=_o(),mm=wo(),hm=Eo(),Se=(e,t={})=>{let n=[];if(Array.isArray(e))for(let r of e){let s=Se.create(r,t);Array.isArray(s)?n.push(...s):n.push(s)}else n=[].concat(Se.create(e,t));return t&&t.expand===!0&&t.nodupes===!0&&(n=[...new Set(n)]),n};Se.parse=(e,t={})=>hm(e,t);Se.stringify=(e,t={})=>Oo(typeof e=="string"?Se.parse(e,t):e,t);Se.compile=(e,t={})=>(typeof e=="string"&&(e=Se.parse(e,t)),fm(e,t));Se.expand=(e,t={})=>{typeof e=="string"&&(e=Se.parse(e,t));let n=mm(e,t);return t.noempty===!0&&(n=n.filter(Boolean)),t.nodupes===!0&&(n=[...new Set(n)]),n};Se.create=(e,t={})=>e===""||e.length<3?[e]:t.expand!==!0?Se.compile(e,t):Se.expand(e,t);Io.exports=Se});var Hn=g((Pw,jo)=>{"use strict";var gm=require("path"),Be="\\\\/",No=`[^${Be}]`,Je="\\.",ym="\\+",vm="\\?",_r="\\/",xm="(?=.)",Mo="[^/]",Is=`(?:${_r}|$)`,Lo=`(?:^|${_r})`,Ds=`${Je}{1,2}${Is}`,_m=`(?!${Je})`,km=`(?!${Lo}${Ds})`,bm=`(?!${Je}{0,1}${Is})`,wm=`(?!${Ds})`,Sm=`[^.${_r}]`,Cm=`${Mo}*?`,Fo={DOT_LITERAL:Je,PLUS_LITERAL:ym,QMARK_LITERAL:vm,SLASH_LITERAL:_r,ONE_CHAR:xm,QMARK:Mo,END_ANCHOR:Is,DOTS_SLASH:Ds,NO_DOT:_m,NO_DOTS:km,NO_DOT_SLASH:bm,NO_DOTS_SLASH:wm,QMARK_NO_DOT:Sm,STAR:Cm,START_ANCHOR:Lo},Tm={...Fo,SLASH_LITERAL:`[${Be}]`,QMARK:No,STAR:`${No}*?`,DOTS_SLASH:`${Je}{1,2}(?:[${Be}]|$)`,NO_DOT:`(?!${Je})`,NO_DOTS:`(?!(?:^|[${Be}])${Je}{1,2}(?:[${Be}]|$))`,NO_DOT_SLASH:`(?!${Je}{0,1}(?:[${Be}]|$))`,NO_DOTS_SLASH:`(?!${Je}{1,2}(?:[${Be}]|$))`,QMARK_NO_DOT:`[^.${Be}]`,START_ANCHOR:`(?:^|[${Be}])`,END_ANCHOR:`(?:[${Be}]|$)`},Am={alnum:"a-zA-Z0-9",alpha:"a-zA-Z",ascii:"\\x00-\\x7F",blank:" \\t",cntrl:"\\x00-\\x1F\\x7F",digit:"0-9",graph:"\\x21-\\x7E",lower:"a-z",print:"\\x20-\\x7E ",punct:"\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",space:" \\t\\r\\n\\v\\f",upper:"A-Z",word:"A-Za-z0-9_",xdigit:"A-Fa-f0-9"};jo.exports={MAX_LENGTH:1024*64,POSIX_REGEX_SOURCE:Am,REGEX_BACKSLASH:/\\(?![*+?^${}(|)[\]])/g,REGEX_NON_SPECIAL_CHARS:/^[^@![\].,$*+?^{}()|\\/]+/,REGEX_SPECIAL_CHARS:/[-*+?.^${}(|)[\]]/,REGEX_SPECIAL_CHARS_BACKREF:/(\\?)((\W)(\3*))/g,REGEX_SPECIAL_CHARS_GLOBAL:/([-*+?.^${}(|)[\]])/g,REGEX_REMOVE_BACKSLASH:/(?:\[.*?[^\\]\]|\\(?=.))/g,REPLACEMENTS:{"***":"*","**/**":"**","**/**/**":"**"},CHAR_0:48,CHAR_9:57,CHAR_UPPERCASE_A:65,CHAR_LOWERCASE_A:97,CHAR_UPPERCASE_Z:90,CHAR_LOWERCASE_Z:122,CHAR_LEFT_PARENTHESES:40,CHAR_RIGHT_PARENTHESES:41,CHAR_ASTERISK:42,CHAR_AMPERSAND:38,CHAR_AT:64,CHAR_BACKWARD_SLASH:92,CHAR_CARRIAGE_RETURN:13,CHAR_CIRCUMFLEX_ACCENT:94,CHAR_COLON:58,CHAR_COMMA:44,CHAR_DOT:46,CHAR_DOUBLE_QUOTE:34,CHAR_EQUAL:61,CHAR_EXCLAMATION_MARK:33,CHAR_FORM_FEED:12,CHAR_FORWARD_SLASH:47,CHAR_GRAVE_ACCENT:96,CHAR_HASH:35,CHAR_HYPHEN_MINUS:45,CHAR_LEFT_ANGLE_BRACKET:60,CHAR_LEFT_CURLY_BRACE:123,CHAR_LEFT_SQUARE_BRACKET:91,CHAR_LINE_FEED:10,CHAR_NO_BREAK_SPACE:160,CHAR_PERCENT:37,CHAR_PLUS:43,CHAR_QUESTION_MARK:63,CHAR_RIGHT_ANGLE_BRACKET:62,CHAR_RIGHT_CURLY_BRACE:125,CHAR_RIGHT_SQUARE_BRACKET:93,CHAR_SEMICOLON:59,CHAR_SINGLE_QUOTE:39,CHAR_SPACE:32,CHAR_TAB:9,CHAR_UNDERSCORE:95,CHAR_VERTICAL_LINE:124,CHAR_ZERO_WIDTH_NOBREAK_SPACE:65279,SEP:gm.sep,extglobChars(e){return{"!":{type:"negate",open:"(?:(?!(?:",close:`))${e.STAR})`},"?":{type:"qmark",open:"(?:",close:")?"},"+":{type:"plus",open:"(?:",close:")+"},"*":{type:"star",open:"(?:",close:")*"},"@":{type:"at",open:"(?:",close:")"}}},globChars(e){return e===!0?Tm:Fo}}});var $n=g(ge=>{"use strict";var Rm=require("path"),Pm=process.platform==="win32",{REGEX_BACKSLASH:Em,REGEX_REMOVE_BACKSLASH:Om,REGEX_SPECIAL_CHARS:Im,REGEX_SPECIAL_CHARS_GLOBAL:Dm}=Hn();ge.isObject=e=>e!==null&&typeof e=="object"&&!Array.isArray(e);ge.hasRegexChars=e=>Im.test(e);ge.isRegexChar=e=>e.length===1&&ge.hasRegexChars(e);ge.escapeRegex=e=>e.replace(Dm,"\\$1");ge.toPosixSlashes=e=>e.replace(Em,"/");ge.removeBackslashes=e=>e.replace(Om,t=>t==="\\"?"":t);ge.supportsLookbehinds=()=>{let e=process.version.slice(1).split(".").map(Number);return e.length===3&&e[0]>=9||e[0]===8&&e[1]>=10};ge.isWindows=e=>e&&typeof e.windows=="boolean"?e.windows:Pm===!0||Rm.sep==="\\";ge.escapeLast=(e,t,n)=>{let r=e.lastIndexOf(t,n);return r===-1?e:e[r-1]==="\\"?ge.escapeLast(e,t,r-1):`${e.slice(0,r)}\\${e.slice(r)}`};ge.removePrefix=(e,t={})=>{let n=e;return n.startsWith("./")&&(n=n.slice(2),t.prefix="./"),n};ge.wrapOutput=(e,t={},n={})=>{let r=n.contains?"":"^",s=n.contains?"":"$",i=`${r}(?:${e})${s}`;return t.negated===!0&&(i=`(?:^(?!${i}).*$)`),i}});var zo=g((Ow,Go)=>{"use strict";var Uo=$n(),{CHAR_ASTERISK:Ns,CHAR_AT:Nm,CHAR_BACKWARD_SLASH:Bn,CHAR_COMMA:Mm,CHAR_DOT:Ms,CHAR_EXCLAMATION_MARK:Ls,CHAR_FORWARD_SLASH:Bo,CHAR_LEFT_CURLY_BRACE:Fs,CHAR_LEFT_PARENTHESES:js,CHAR_LEFT_SQUARE_BRACKET:Lm,CHAR_PLUS:Fm,CHAR_QUESTION_MARK:qo,CHAR_RIGHT_CURLY_BRACE:jm,CHAR_RIGHT_PARENTHESES:Wo,CHAR_RIGHT_SQUARE_BRACKET:Um}=Hn(),Ho=e=>e===Bo||e===Bn,$o=e=>{e.isPrefix!==!0&&(e.depth=e.isGlobstar?1/0:1)},qm=(e,t)=>{let n=t||{},r=e.length-1,s=n.parts===!0||n.scanToEnd===!0,i=[],a=[],o=[],c=e,l=-1,u=0,d=0,p=!1,m=!1,f=!1,_=!1,T=!1,F=!1,oe=!1,K=!1,Pe=!1,ie=!1,D=0,W,C,H={value:"",depth:0,isGlob:!1},ne=()=>l>=r,x=()=>c.charCodeAt(l+1),Y=()=>(W=C,c.charCodeAt(++l));for(;l<r;){C=Y();let pe;if(C===Bn){oe=H.backslashes=!0,C=Y(),C===Fs&&(F=!0);continue}if(F===!0||C===Fs){for(D++;ne()!==!0&&(C=Y());){if(C===Bn){oe=H.backslashes=!0,Y();continue}if(C===Fs){D++;continue}if(F!==!0&&C===Ms&&(C=Y())===Ms){if(p=H.isBrace=!0,f=H.isGlob=!0,ie=!0,s===!0)continue;break}if(F!==!0&&C===Mm){if(p=H.isBrace=!0,f=H.isGlob=!0,ie=!0,s===!0)continue;break}if(C===jm&&(D--,D===0)){F=!1,p=H.isBrace=!0,ie=!0;break}}if(s===!0)continue;break}if(C===Bo){if(i.push(l),a.push(H),H={value:"",depth:0,isGlob:!1},ie===!0)continue;if(W===Ms&&l===u+1){u+=2;continue}d=l+1;continue}if(n.noext!==!0&&(C===Fm||C===Nm||C===Ns||C===qo||C===Ls)===!0&&x()===js){if(f=H.isGlob=!0,_=H.isExtglob=!0,ie=!0,C===Ls&&l===u&&(Pe=!0),s===!0){for(;ne()!==!0&&(C=Y());){if(C===Bn){oe=H.backslashes=!0,C=Y();continue}if(C===Wo){f=H.isGlob=!0,ie=!0;break}}continue}break}if(C===Ns){if(W===Ns&&(T=H.isGlobstar=!0),f=H.isGlob=!0,ie=!0,s===!0)continue;break}if(C===qo){if(f=H.isGlob=!0,ie=!0,s===!0)continue;break}if(C===Lm){for(;ne()!==!0&&(pe=Y());){if(pe===Bn){oe=H.backslashes=!0,Y();continue}if(pe===Um){m=H.isBracket=!0,f=H.isGlob=!0,ie=!0;break}}if(s===!0)continue;break}if(n.nonegate!==!0&&C===Ls&&l===u){K=H.negated=!0,u++;continue}if(n.noparen!==!0&&C===js){if(f=H.isGlob=!0,s===!0){for(;ne()!==!0&&(C=Y());){if(C===js){oe=H.backslashes=!0,C=Y();continue}if(C===Wo){ie=!0;break}}continue}break}if(f===!0){if(ie=!0,s===!0)continue;break}}n.noext===!0&&(_=!1,f=!1);let G=c,ot="",y="";u>0&&(ot=c.slice(0,u),c=c.slice(u),d-=u),G&&f===!0&&d>0?(G=c.slice(0,d),y=c.slice(d)):f===!0?(G="",y=c):G=c,G&&G!==""&&G!=="/"&&G!==c&&Ho(G.charCodeAt(G.length-1))&&(G=G.slice(0,-1)),n.unescape===!0&&(y&&(y=Uo.removeBackslashes(y)),G&&oe===!0&&(G=Uo.removeBackslashes(G)));let v={prefix:ot,input:e,start:u,base:G,glob:y,isBrace:p,isBracket:m,isGlob:f,isExtglob:_,isGlobstar:T,negated:K,negatedExtglob:Pe};if(n.tokens===!0&&(v.maxDepth=0,Ho(C)||a.push(H),v.tokens=a),n.parts===!0||n.tokens===!0){let pe;for(let $=0;$<i.length;$++){let We=pe?pe+1:u,He=i[$],we=e.slice(We,He);n.tokens&&($===0&&u!==0?(a[$].isPrefix=!0,a[$].value=ot):a[$].value=we,$o(a[$]),v.maxDepth+=a[$].depth),($!==0||we!=="")&&o.push(we),pe=He}if(pe&&pe+1<e.length){let $=e.slice(pe+1);o.push($),n.tokens&&(a[a.length-1].value=$,$o(a[a.length-1]),v.maxDepth+=a[a.length-1].depth)}v.slashes=i,v.parts=o}return v};Go.exports=qm});var Yo=g((Iw,Ko)=>{"use strict";var kr=Hn(),Ce=$n(),{MAX_LENGTH:br,POSIX_REGEX_SOURCE:Wm,REGEX_NON_SPECIAL_CHARS:Hm,REGEX_SPECIAL_CHARS_BACKREF:$m,REPLACEMENTS:Vo}=kr,Bm=(e,t)=>{if(typeof t.expandRange=="function")return t.expandRange(...e,t);e.sort();let n=`[${e.join("-")}]`;try{new RegExp(n)}catch{return e.map(s=>Ce.escapeRegex(s)).join("..")}return n},ln=(e,t)=>`Missing ${e}: "${t}" - use "\\\\${t}" to match literal characters`,Us=(e,t)=>{if(typeof e!="string")throw new TypeError("Expected a string");e=Vo[e]||e;let n={...t},r=typeof n.maxLength=="number"?Math.min(br,n.maxLength):br,s=e.length;if(s>r)throw new SyntaxError(`Input length: ${s}, exceeds maximum allowed length: ${r}`);let i={type:"bos",value:"",output:n.prepend||""},a=[i],o=n.capture?"":"?:",c=Ce.isWindows(t),l=kr.globChars(c),u=kr.extglobChars(l),{DOT_LITERAL:d,PLUS_LITERAL:p,SLASH_LITERAL:m,ONE_CHAR:f,DOTS_SLASH:_,NO_DOT:T,NO_DOT_SLASH:F,NO_DOTS_SLASH:oe,QMARK:K,QMARK_NO_DOT:Pe,STAR:ie,START_ANCHOR:D}=l,W=A=>`(${o}(?:(?!${D}${A.dot?_:d}).)*?)`,C=n.dot?"":T,H=n.dot?K:Pe,ne=n.bash===!0?W(n):ie;n.capture&&(ne=`(${ne})`),typeof n.noext=="boolean"&&(n.noextglob=n.noext);let x={input:e,index:-1,start:0,dot:n.dot===!0,consumed:"",output:"",prefix:"",backtrack:!1,negated:!1,brackets:0,braces:0,parens:0,quotes:0,globstar:!1,tokens:a};e=Ce.removePrefix(e,x),s=e.length;let Y=[],G=[],ot=[],y=i,v,pe=()=>x.index===s-1,$=x.peek=(A=1)=>e[x.index+A],We=x.advance=()=>e[++x.index]||"",He=()=>e.slice(x.index+1),we=(A="",z=0)=>{x.consumed+=A,x.index+=z},lr=A=>{x.output+=A.output!=null?A.output:A.value,we(A.value)},nf=()=>{let A=1;for(;$()==="!"&&($(2)!=="("||$(3)==="?");)We(),x.start++,A++;return A%2===0?!1:(x.negated=!0,x.start++,!0)},ur=A=>{x[A]++,ot.push(A)},Ct=A=>{x[A]--,ot.pop()},U=A=>{if(y.type==="globstar"){let z=x.braces>0&&(A.type==="comma"||A.type==="brace"),b=A.extglob===!0||Y.length&&(A.type==="pipe"||A.type==="paren");A.type!=="slash"&&A.type!=="paren"&&!z&&!b&&(x.output=x.output.slice(0,-y.output.length),y.type="star",y.value="*",y.output=ne,x.output+=y.output)}if(Y.length&&A.type!=="paren"&&(Y[Y.length-1].inner+=A.value),(A.value||A.output)&&lr(A),y&&y.type==="text"&&A.type==="text"){y.value+=A.value,y.output=(y.output||"")+A.value;return}A.prev=y,a.push(A),y=A},dr=(A,z)=>{let b={...u[z],conditions:1,inner:""};b.prev=y,b.parens=x.parens,b.output=x.output;let L=(n.capture?"(":"")+b.open;ur("parens"),U({type:A,value:z,output:x.output?"":f}),U({type:"paren",extglob:!0,value:We(),output:L}),Y.push(b)},rf=A=>{let z=A.close+(n.capture?")":""),b;if(A.type==="negate"){let L=ne;if(A.inner&&A.inner.length>1&&A.inner.includes("/")&&(L=W(n)),(L!==ne||pe()||/^\)+$/.test(He()))&&(z=A.close=`)$))${L}`),A.inner.includes("*")&&(b=He())&&/^\.[^\\/.]+$/.test(b)){let Z=Us(b,{...t,fastpaths:!1}).output;z=A.close=`)${Z})${L})`}A.prev.type==="bos"&&(x.negatedExtglob=!0)}U({type:"paren",extglob:!0,value:v,output:z}),Ct("parens")};if(n.fastpaths!==!1&&!/(^[*!]|[/()[\]{}"])/.test(e)){let A=!1,z=e.replace($m,(b,L,Z,fe,re,bs)=>fe==="\\"?(A=!0,b):fe==="?"?L?L+fe+(re?K.repeat(re.length):""):bs===0?H+(re?K.repeat(re.length):""):K.repeat(Z.length):fe==="."?d.repeat(Z.length):fe==="*"?L?L+fe+(re?ne:""):ne:L?b:`\\${b}`);return A===!0&&(n.unescape===!0?z=z.replace(/\\/g,""):z=z.replace(/\\+/g,b=>b.length%2===0?"\\\\":b?"\\":"")),z===e&&n.contains===!0?(x.output=e,x):(x.output=Ce.wrapOutput(z,x,t),x)}for(;!pe();){if(v=We(),v==="\0")continue;if(v==="\\"){let b=$();if(b==="/"&&n.bash!==!0||b==="."||b===";")continue;if(!b){v+="\\",U({type:"text",value:v});continue}let L=/^\\+/.exec(He()),Z=0;if(L&&L[0].length>2&&(Z=L[0].length,x.index+=Z,Z%2!==0&&(v+="\\")),n.unescape===!0?v=We():v+=We(),x.brackets===0){U({type:"text",value:v});continue}}if(x.brackets>0&&(v!=="]"||y.value==="["||y.value==="[^")){if(n.posix!==!1&&v===":"){let b=y.value.slice(1);if(b.includes("[")&&(y.posix=!0,b.includes(":"))){let L=y.value.lastIndexOf("["),Z=y.value.slice(0,L),fe=y.value.slice(L+2),re=Wm[fe];if(re){y.value=Z+re,x.backtrack=!0,We(),!i.output&&a.indexOf(y)===1&&(i.output=f);continue}}}(v==="["&&$()!==":"||v==="-"&&$()==="]")&&(v=`\\${v}`),v==="]"&&(y.value==="["||y.value==="[^")&&(v=`\\${v}`),n.posix===!0&&v==="!"&&y.value==="["&&(v="^"),y.value+=v,lr({value:v});continue}if(x.quotes===1&&v!=='"'){v=Ce.escapeRegex(v),y.value+=v,lr({value:v});continue}if(v==='"'){x.quotes=x.quotes===1?0:1,n.keepQuotes===!0&&U({type:"text",value:v});continue}if(v==="("){ur("parens"),U({type:"paren",value:v});continue}if(v===")"){if(x.parens===0&&n.strictBrackets===!0)throw new SyntaxError(ln("opening","("));let b=Y[Y.length-1];if(b&&x.parens===b.parens+1){rf(Y.pop());continue}U({type:"paren",value:v,output:x.parens?")":"\\)"}),Ct("parens");continue}if(v==="["){if(n.nobracket===!0||!He().includes("]")){if(n.nobracket!==!0&&n.strictBrackets===!0)throw new SyntaxError(ln("closing","]"));v=`\\${v}`}else ur("brackets");U({type:"bracket",value:v});continue}if(v==="]"){if(n.nobracket===!0||y&&y.type==="bracket"&&y.value.length===1){U({type:"text",value:v,output:`\\${v}`});continue}if(x.brackets===0){if(n.strictBrackets===!0)throw new SyntaxError(ln("opening","["));U({type:"text",value:v,output:`\\${v}`});continue}Ct("brackets");let b=y.value.slice(1);if(y.posix!==!0&&b[0]==="^"&&!b.includes("/")&&(v=`/${v}`),y.value+=v,lr({value:v}),n.literalBrackets===!1||Ce.hasRegexChars(b))continue;let L=Ce.escapeRegex(y.value);if(x.output=x.output.slice(0,-y.value.length),n.literalBrackets===!0){x.output+=L,y.value=L;continue}y.value=`(${o}${L}|${y.value})`,x.output+=y.value;continue}if(v==="{"&&n.nobrace!==!0){ur("braces");let b={type:"brace",value:v,output:"(",outputIndex:x.output.length,tokensIndex:x.tokens.length};G.push(b),U(b);continue}if(v==="}"){let b=G[G.length-1];if(n.nobrace===!0||!b){U({type:"text",value:v,output:v});continue}let L=")";if(b.dots===!0){let Z=a.slice(),fe=[];for(let re=Z.length-1;re>=0&&(a.pop(),Z[re].type!=="brace");re--)Z[re].type!=="dots"&&fe.unshift(Z[re].value);L=Bm(fe,n),x.backtrack=!0}if(b.comma!==!0&&b.dots!==!0){let Z=x.output.slice(0,b.outputIndex),fe=x.tokens.slice(b.tokensIndex);b.value=b.output="\\{",v=L="\\}",x.output=Z;for(let re of fe)x.output+=re.output||re.value}U({type:"brace",value:v,output:L}),Ct("braces"),G.pop();continue}if(v==="|"){Y.length>0&&Y[Y.length-1].conditions++,U({type:"text",value:v});continue}if(v===","){let b=v,L=G[G.length-1];L&&ot[ot.length-1]==="braces"&&(L.comma=!0,b="|"),U({type:"comma",value:v,output:b});continue}if(v==="/"){if(y.type==="dot"&&x.index===x.start+1){x.start=x.index+1,x.consumed="",x.output="",a.pop(),y=i;continue}U({type:"slash",value:v,output:m});continue}if(v==="."){if(x.braces>0&&y.type==="dot"){y.value==="."&&(y.output=d);let b=G[G.length-1];y.type="dots",y.output+=v,y.value+=v,b.dots=!0;continue}if(x.braces+x.parens===0&&y.type!=="bos"&&y.type!=="slash"){U({type:"text",value:v,output:d});continue}U({type:"dot",value:v,output:d});continue}if(v==="?"){if(!(y&&y.value==="(")&&n.noextglob!==!0&&$()==="("&&$(2)!=="?"){dr("qmark",v);continue}if(y&&y.type==="paren"){let L=$(),Z=v;if(L==="<"&&!Ce.supportsLookbehinds())throw new Error("Node.js v10 or higher is required for regex lookbehinds");(y.value==="("&&!/[!=<:]/.test(L)||L==="<"&&!/<([!=]|\w+>)/.test(He()))&&(Z=`\\${v}`),U({type:"text",value:v,output:Z});continue}if(n.dot!==!0&&(y.type==="slash"||y.type==="bos")){U({type:"qmark",value:v,output:Pe});continue}U({type:"qmark",value:v,output:K});continue}if(v==="!"){if(n.noextglob!==!0&&$()==="("&&($(2)!=="?"||!/[!=<:]/.test($(3)))){dr("negate",v);continue}if(n.nonegate!==!0&&x.index===0){nf();continue}}if(v==="+"){if(n.noextglob!==!0&&$()==="("&&$(2)!=="?"){dr("plus",v);continue}if(y&&y.value==="("||n.regex===!1){U({type:"plus",value:v,output:p});continue}if(y&&(y.type==="bracket"||y.type==="paren"||y.type==="brace")||x.parens>0){U({type:"plus",value:v});continue}U({type:"plus",value:p});continue}if(v==="@"){if(n.noextglob!==!0&&$()==="("&&$(2)!=="?"){U({type:"at",extglob:!0,value:v,output:""});continue}U({type:"text",value:v});continue}if(v!=="*"){(v==="$"||v==="^")&&(v=`\\${v}`);let b=Hm.exec(He());b&&(v+=b[0],x.index+=b[0].length),U({type:"text",value:v});continue}if(y&&(y.type==="globstar"||y.star===!0)){y.type="star",y.star=!0,y.value+=v,y.output=ne,x.backtrack=!0,x.globstar=!0,we(v);continue}let A=He();if(n.noextglob!==!0&&/^\([^?]/.test(A)){dr("star",v);continue}if(y.type==="star"){if(n.noglobstar===!0){we(v);continue}let b=y.prev,L=b.prev,Z=b.type==="slash"||b.type==="bos",fe=L&&(L.type==="star"||L.type==="globstar");if(n.bash===!0&&(!Z||A[0]&&A[0]!=="/")){U({type:"star",value:v,output:""});continue}let re=x.braces>0&&(b.type==="comma"||b.type==="brace"),bs=Y.length&&(b.type==="pipe"||b.type==="paren");if(!Z&&b.type!=="paren"&&!re&&!bs){U({type:"star",value:v,output:""});continue}for(;A.slice(0,3)==="/**";){let pr=e[x.index+4];if(pr&&pr!=="/")break;A=A.slice(3),we("/**",3)}if(b.type==="bos"&&pe()){y.type="globstar",y.value+=v,y.output=W(n),x.output=y.output,x.globstar=!0,we(v);continue}if(b.type==="slash"&&b.prev.type!=="bos"&&!fe&&pe()){x.output=x.output.slice(0,-(b.output+y.output).length),b.output=`(?:${b.output}`,y.type="globstar",y.output=W(n)+(n.strictSlashes?")":"|$)"),y.value+=v,x.globstar=!0,x.output+=b.output+y.output,we(v);continue}if(b.type==="slash"&&b.prev.type!=="bos"&&A[0]==="/"){let pr=A[1]!==void 0?"|$":"";x.output=x.output.slice(0,-(b.output+y.output).length),b.output=`(?:${b.output}`,y.type="globstar",y.output=`${W(n)}${m}|${m}${pr})`,y.value+=v,x.output+=b.output+y.output,x.globstar=!0,we(v+We()),U({type:"slash",value:"/",output:""});continue}if(b.type==="bos"&&A[0]==="/"){y.type="globstar",y.value+=v,y.output=`(?:^|${m}|${W(n)}${m})`,x.output=y.output,x.globstar=!0,we(v+We()),U({type:"slash",value:"/",output:""});continue}x.output=x.output.slice(0,-y.output.length),y.type="globstar",y.output=W(n),y.value+=v,x.output+=y.output,x.globstar=!0,we(v);continue}let z={type:"star",value:v,output:ne};if(n.bash===!0){z.output=".*?",(y.type==="bos"||y.type==="slash")&&(z.output=C+z.output),U(z);continue}if(y&&(y.type==="bracket"||y.type==="paren")&&n.regex===!0){z.output=v,U(z);continue}(x.index===x.start||y.type==="slash"||y.type==="dot")&&(y.type==="dot"?(x.output+=F,y.output+=F):n.dot===!0?(x.output+=oe,y.output+=oe):(x.output+=C,y.output+=C),$()!=="*"&&(x.output+=f,y.output+=f)),U(z)}for(;x.brackets>0;){if(n.strictBrackets===!0)throw new SyntaxError(ln("closing","]"));x.output=Ce.escapeLast(x.output,"["),Ct("brackets")}for(;x.parens>0;){if(n.strictBrackets===!0)throw new SyntaxError(ln("closing",")"));x.output=Ce.escapeLast(x.output,"("),Ct("parens")}for(;x.braces>0;){if(n.strictBrackets===!0)throw new SyntaxError(ln("closing","}"));x.output=Ce.escapeLast(x.output,"{"),Ct("braces")}if(n.strictSlashes!==!0&&(y.type==="star"||y.type==="bracket")&&U({type:"maybe_slash",value:"",output:`${m}?`}),x.backtrack===!0){x.output="";for(let A of x.tokens)x.output+=A.output!=null?A.output:A.value,A.suffix&&(x.output+=A.suffix)}return x};Us.fastpaths=(e,t)=>{let n={...t},r=typeof n.maxLength=="number"?Math.min(br,n.maxLength):br,s=e.length;if(s>r)throw new SyntaxError(`Input length: ${s}, exceeds maximum allowed length: ${r}`);e=Vo[e]||e;let i=Ce.isWindows(t),{DOT_LITERAL:a,SLASH_LITERAL:o,ONE_CHAR:c,DOTS_SLASH:l,NO_DOT:u,NO_DOTS:d,NO_DOTS_SLASH:p,STAR:m,START_ANCHOR:f}=kr.globChars(i),_=n.dot?d:u,T=n.dot?p:u,F=n.capture?"":"?:",oe={negated:!1,prefix:""},K=n.bash===!0?".*?":m;n.capture&&(K=`(${K})`);let Pe=C=>C.noglobstar===!0?K:`(${F}(?:(?!${f}${C.dot?l:a}).)*?)`,ie=C=>{switch(C){case"*":return`${_}${c}${K}`;case".*":return`${a}${c}${K}`;case"*.*":return`${_}${K}${a}${c}${K}`;case"*/*":return`${_}${K}${o}${c}${T}${K}`;case"**":return _+Pe(n);case"**/*":return`(?:${_}${Pe(n)}${o})?${T}${c}${K}`;case"**/*.*":return`(?:${_}${Pe(n)}${o})?${T}${K}${a}${c}${K}`;case"**/.*":return`(?:${_}${Pe(n)}${o})?${a}${c}${K}`;default:{let H=/^(.*?)\.(\w+)$/.exec(C);if(!H)return;let ne=ie(H[1]);return ne?ne+a+H[2]:void 0}}},D=Ce.removePrefix(e,oe),W=ie(D);return W&&n.strictSlashes!==!0&&(W+=`${o}?`),W};Ko.exports=Us});var Xo=g((Dw,Zo)=>{"use strict";var Gm=require("path"),zm=zo(),qs=Yo(),Ws=$n(),Vm=Hn(),Km=e=>e&&typeof e=="object"&&!Array.isArray(e),Q=(e,t,n=!1)=>{if(Array.isArray(e)){let u=e.map(p=>Q(p,t,n));return p=>{for(let m of u){let f=m(p);if(f)return f}return!1}}let r=Km(e)&&e.tokens&&e.input;if(e===""||typeof e!="string"&&!r)throw new TypeError("Expected pattern to be a non-empty string");let s=t||{},i=Ws.isWindows(t),a=r?Q.compileRe(e,t):Q.makeRe(e,t,!1,!0),o=a.state;delete a.state;let c=()=>!1;if(s.ignore){let u={...t,ignore:null,onMatch:null,onResult:null};c=Q(s.ignore,u,n)}let l=(u,d=!1)=>{let{isMatch:p,match:m,output:f}=Q.test(u,a,t,{glob:e,posix:i}),_={glob:e,state:o,regex:a,posix:i,input:u,output:f,match:m,isMatch:p};return typeof s.onResult=="function"&&s.onResult(_),p===!1?(_.isMatch=!1,d?_:!1):c(u)?(typeof s.onIgnore=="function"&&s.onIgnore(_),_.isMatch=!1,d?_:!1):(typeof s.onMatch=="function"&&s.onMatch(_),d?_:!0)};return n&&(l.state=o),l};Q.test=(e,t,n,{glob:r,posix:s}={})=>{if(typeof e!="string")throw new TypeError("Expected input to be a string");if(e==="")return{isMatch:!1,output:""};let i=n||{},a=i.format||(s?Ws.toPosixSlashes:null),o=e===r,c=o&&a?a(e):e;return o===!1&&(c=a?a(e):e,o=c===r),(o===!1||i.capture===!0)&&(i.matchBase===!0||i.basename===!0?o=Q.matchBase(e,t,n,s):o=t.exec(c)),{isMatch:!!o,match:o,output:c}};Q.matchBase=(e,t,n,r=Ws.isWindows(n))=>(t instanceof RegExp?t:Q.makeRe(t,n)).test(Gm.basename(e));Q.isMatch=(e,t,n)=>Q(t,n)(e);Q.parse=(e,t)=>Array.isArray(e)?e.map(n=>Q.parse(n,t)):qs(e,{...t,fastpaths:!1});Q.scan=(e,t)=>zm(e,t);Q.compileRe=(e,t,n=!1,r=!1)=>{if(n===!0)return e.output;let s=t||{},i=s.contains?"":"^",a=s.contains?"":"$",o=`${i}(?:${e.output})${a}`;e&&e.negated===!0&&(o=`^(?!${o}).*$`);let c=Q.toRegex(o,t);return r===!0&&(c.state=e),c};Q.makeRe=(e,t={},n=!1,r=!1)=>{if(!e||typeof e!="string")throw new TypeError("Expected a non-empty string");let s={negated:!1,fastpaths:!0};return t.fastpaths!==!1&&(e[0]==="."||e[0]==="*")&&(s.output=qs.fastpaths(e,t)),s.output||(s=qs(e,t)),Q.compileRe(s,t,n,r)};Q.toRegex=(e,t)=>{try{let n=t||{};return new RegExp(e,n.flags||(n.nocase?"i":""))}catch(n){if(t&&t.debug===!0)throw n;return/$^/}};Q.constants=Vm;Zo.exports=Q});var Qo=g((Nw,Jo)=>{"use strict";Jo.exports=Xo()});var ic=g((Mw,sc)=>{"use strict";var tc=require("util"),nc=Do(),Ge=Qo(),Hs=$n(),ec=e=>e===""||e==="./",rc=e=>{let t=e.indexOf("{");return t>-1&&e.indexOf("}",t)>-1},V=(e,t,n)=>{t=[].concat(t),e=[].concat(e);let r=new Set,s=new Set,i=new Set,a=0,o=u=>{i.add(u.output),n&&n.onResult&&n.onResult(u)};for(let u=0;u<t.length;u++){let d=Ge(String(t[u]),{...n,onResult:o},!0),p=d.state.negated||d.state.negatedExtglob;p&&a++;for(let m of e){let f=d(m,!0);(p?!f.isMatch:f.isMatch)&&(p?r.add(f.output):(r.delete(f.output),s.add(f.output)))}}let l=(a===t.length?[...i]:[...s]).filter(u=>!r.has(u));if(n&&l.length===0){if(n.failglob===!0)throw new Error(`No matches found for "${t.join(", ")}"`);if(n.nonull===!0||n.nullglob===!0)return n.unescape?t.map(u=>u.replace(/\\/g,"")):t}return l};V.match=V;V.matcher=(e,t)=>Ge(e,t);V.isMatch=(e,t,n)=>Ge(t,n)(e);V.any=V.isMatch;V.not=(e,t,n={})=>{t=[].concat(t).map(String);let r=new Set,s=[],i=o=>{n.onResult&&n.onResult(o),s.push(o.output)},a=new Set(V(e,t,{...n,onResult:i}));for(let o of s)a.has(o)||r.add(o);return[...r]};V.contains=(e,t,n)=>{if(typeof e!="string")throw new TypeError(`Expected a string: "${tc.inspect(e)}"`);if(Array.isArray(t))return t.some(r=>V.contains(e,r,n));if(typeof t=="string"){if(ec(e)||ec(t))return!1;if(e.includes(t)||e.startsWith("./")&&e.slice(2).includes(t))return!0}return V.isMatch(e,t,{...n,contains:!0})};V.matchKeys=(e,t,n)=>{if(!Hs.isObject(e))throw new TypeError("Expected the first argument to be an object");let r=V(Object.keys(e),t,n),s={};for(let i of r)s[i]=e[i];return s};V.some=(e,t,n)=>{let r=[].concat(e);for(let s of[].concat(t)){let i=Ge(String(s),n);if(r.some(a=>i(a)))return!0}return!1};V.every=(e,t,n)=>{let r=[].concat(e);for(let s of[].concat(t)){let i=Ge(String(s),n);if(!r.every(a=>i(a)))return!1}return!0};V.all=(e,t,n)=>{if(typeof e!="string")throw new TypeError(`Expected a string: "${tc.inspect(e)}"`);return[].concat(t).every(r=>Ge(r,n)(e))};V.capture=(e,t,n)=>{let r=Hs.isWindows(n),i=Ge.makeRe(String(e),{...n,capture:!0}).exec(r?Hs.toPosixSlashes(t):t);if(i)return i.slice(1).map(a=>a===void 0?"":a)};V.makeRe=(...e)=>Ge.makeRe(...e);V.scan=(...e)=>Ge.scan(...e);V.parse=(e,t)=>{let n=[];for(let r of[].concat(e||[]))for(let s of nc(String(r),t))n.push(Ge.parse(s,t));return n};V.braces=(e,t)=>{if(typeof e!="string")throw new TypeError("Expected a string");return t&&t.nobrace===!0||!rc(e)?[e]:nc(e,t)};V.braceExpand=(e,t)=>{if(typeof e!="string")throw new TypeError("Expected a string");return V.braces(e,{...t,expand:!0})};V.hasBraces=rc;sc.exports=V});var hc=g(O=>{"use strict";Object.defineProperty(O,"__esModule",{value:!0});O.isAbsolute=O.partitionAbsoluteAndRelative=O.removeDuplicateSlashes=O.matchAny=O.convertPatternsToRe=O.makeRe=O.getPatternParts=O.expandBraceExpansion=O.expandPatternsWithBraceExpansion=O.isAffectDepthOfReadingPattern=O.endsWithSlashGlobStar=O.hasGlobStar=O.getBaseDirectory=O.isPatternRelatedToParentDirectory=O.getPatternsOutsideCurrentDirectory=O.getPatternsInsideCurrentDirectory=O.getPositivePatterns=O.getNegativePatterns=O.isPositivePattern=O.isNegativePattern=O.convertToNegativePattern=O.convertToPositivePattern=O.isDynamicPattern=O.isStaticPattern=void 0;var ac=require("path"),Ym=Za(),$s=ic(),oc="**",Zm="\\",Xm=/[*?]|^!/,Jm=/\[[^[]*]/,Qm=/(?:^|[^!*+?@])\([^(]*\|[^|]*\)/,eh=/[!*+?@]\([^(]*\)/,th=/,|\.\./,nh=/(?!^)\/{2,}/g;function cc(e,t={}){return!lc(e,t)}O.isStaticPattern=cc;function lc(e,t={}){return e===""?!1:!!(t.caseSensitiveMatch===!1||e.includes(Zm)||Xm.test(e)||Jm.test(e)||Qm.test(e)||t.extglob!==!1&&eh.test(e)||t.braceExpansion!==!1&&rh(e))}O.isDynamicPattern=lc;function rh(e){let t=e.indexOf("{");if(t===-1)return!1;let n=e.indexOf("}",t+1);if(n===-1)return!1;let r=e.slice(t,n);return th.test(r)}function sh(e){return wr(e)?e.slice(1):e}O.convertToPositivePattern=sh;function ih(e){return"!"+e}O.convertToNegativePattern=ih;function wr(e){return e.startsWith("!")&&e[1]!=="("}O.isNegativePattern=wr;function uc(e){return!wr(e)}O.isPositivePattern=uc;function ah(e){return e.filter(wr)}O.getNegativePatterns=ah;function oh(e){return e.filter(uc)}O.getPositivePatterns=oh;function ch(e){return e.filter(t=>!Bs(t))}O.getPatternsInsideCurrentDirectory=ch;function lh(e){return e.filter(Bs)}O.getPatternsOutsideCurrentDirectory=lh;function Bs(e){return e.startsWith("..")||e.startsWith("./..")}O.isPatternRelatedToParentDirectory=Bs;function uh(e){return Ym(e,{flipBackslashes:!1})}O.getBaseDirectory=uh;function dh(e){return e.includes(oc)}O.hasGlobStar=dh;function dc(e){return e.endsWith("/"+oc)}O.endsWithSlashGlobStar=dc;function ph(e){let t=ac.basename(e);return dc(e)||cc(t)}O.isAffectDepthOfReadingPattern=ph;function fh(e){return e.reduce((t,n)=>t.concat(pc(n)),[])}O.expandPatternsWithBraceExpansion=fh;function pc(e){let t=$s.braces(e,{expand:!0,nodupes:!0,keepEscaping:!0});return t.sort((n,r)=>n.length-r.length),t.filter(n=>n!=="")}O.expandBraceExpansion=pc;function mh(e,t){let{parts:n}=$s.scan(e,Object.assign(Object.assign({},t),{parts:!0}));return n.length===0&&(n=[e]),n[0].startsWith("/")&&(n[0]=n[0].slice(1),n.unshift("")),n}O.getPatternParts=mh;function fc(e,t){return $s.makeRe(e,t)}O.makeRe=fc;function hh(e,t){return e.map(n=>fc(n,t))}O.convertPatternsToRe=hh;function gh(e,t){return t.some(n=>n.test(e))}O.matchAny=gh;function yh(e){return e.replace(nh,"/")}O.removeDuplicateSlashes=yh;function vh(e){let t=[],n=[];for(let r of e)mc(r)?t.push(r):n.push(r);return[t,n]}O.partitionAbsoluteAndRelative=vh;function mc(e){return ac.isAbsolute(e)}O.isAbsolute=mc});var xc=g((Fw,vc)=>{"use strict";var xh=require("stream"),gc=xh.PassThrough,_h=Array.prototype.slice;vc.exports=kh;function kh(){let e=[],t=_h.call(arguments),n=!1,r=t[t.length-1];r&&!Array.isArray(r)&&r.pipe==null?t.pop():r={};let s=r.end!==!1,i=r.pipeError===!0;r.objectMode==null&&(r.objectMode=!0),r.highWaterMark==null&&(r.highWaterMark=64*1024);let a=gc(r);function o(){for(let u=0,d=arguments.length;u<d;u++)e.push(yc(arguments[u],r));return c(),this}function c(){if(n)return;n=!0;let u=e.shift();if(!u){process.nextTick(l);return}Array.isArray(u)||(u=[u]);let d=u.length+1;function p(){--d>0||(n=!1,c())}function m(f){function _(){f.removeListener("merge2UnpipeEnd",_),f.removeListener("end",_),i&&f.removeListener("error",T),p()}function T(F){a.emit("error",F)}if(f._readableState.endEmitted)return p();f.on("merge2UnpipeEnd",_),f.on("end",_),i&&f.on("error",T),f.pipe(a,{end:!1}),f.resume()}for(let f=0;f<u.length;f++)m(u[f]);p()}function l(){n=!1,a.emit("queueDrain"),s&&a.end()}return a.setMaxListeners(0),a.add=o,a.on("unpipe",function(u){u.emit("merge2UnpipeEnd")}),t.length&&o.apply(null,t),a}function yc(e,t){if(Array.isArray(e))for(let n=0,r=e.length;n<r;n++)e[n]=yc(e[n],t);else{if(!e._readableState&&e.pipe&&(e=e.pipe(gc(t))),!e._readableState||!e.pause||!e.pipe)throw new Error("Only readable stream can be merged.");e.pause()}return e}});var kc=g(Sr=>{"use strict";Object.defineProperty(Sr,"__esModule",{value:!0});Sr.merge=void 0;var bh=xc();function wh(e){let t=bh(e);return e.forEach(n=>{n.once("error",r=>t.emit("error",r))}),t.once("close",()=>_c(e)),t.once("end",()=>_c(e)),t}Sr.merge=wh;function _c(e){e.forEach(t=>t.emit("close"))}});var bc=g(un=>{"use strict";Object.defineProperty(un,"__esModule",{value:!0});un.isEmpty=un.isString=void 0;function Sh(e){return typeof e=="string"}un.isString=Sh;function Ch(e){return e===""}un.isEmpty=Ch});var Qe=g(ce=>{"use strict";Object.defineProperty(ce,"__esModule",{value:!0});ce.string=ce.stream=ce.pattern=ce.path=ce.fs=ce.errno=ce.array=void 0;var Th=Fa();ce.array=Th;var Ah=ja();ce.errno=Ah;var Rh=Ua();ce.fs=Rh;var Ph=$a();ce.path=Ph;var Eh=hc();ce.pattern=Eh;var Oh=kc();ce.stream=Oh;var Ih=bc();ce.string=Ih});var Tc=g(le=>{"use strict";Object.defineProperty(le,"__esModule",{value:!0});le.convertPatternGroupToTask=le.convertPatternGroupsToTasks=le.groupPatternsByBaseDirectory=le.getNegativePatternsAsPositive=le.getPositivePatterns=le.convertPatternsToTasks=le.generate=void 0;var Fe=Qe();function Dh(e,t){let n=wc(e,t),r=wc(t.ignore,t),s=Sc(n),i=Cc(n,r),a=s.filter(u=>Fe.pattern.isStaticPattern(u,t)),o=s.filter(u=>Fe.pattern.isDynamicPattern(u,t)),c=Gs(a,i,!1),l=Gs(o,i,!0);return c.concat(l)}le.generate=Dh;function wc(e,t){let n=e;return t.braceExpansion&&(n=Fe.pattern.expandPatternsWithBraceExpansion(n)),t.baseNameMatch&&(n=n.map(r=>r.includes("/")?r:`**/${r}`)),n.map(r=>Fe.pattern.removeDuplicateSlashes(r))}function Gs(e,t,n){let r=[],s=Fe.pattern.getPatternsOutsideCurrentDirectory(e),i=Fe.pattern.getPatternsInsideCurrentDirectory(e),a=zs(s),o=zs(i);return r.push(...Vs(a,t,n)),"."in o?r.push(Ks(".",i,t,n)):r.push(...Vs(o,t,n)),r}le.convertPatternsToTasks=Gs;function Sc(e){return Fe.pattern.getPositivePatterns(e)}le.getPositivePatterns=Sc;function Cc(e,t){return Fe.pattern.getNegativePatterns(e).concat(t).map(Fe.pattern.convertToPositivePattern)}le.getNegativePatternsAsPositive=Cc;function zs(e){let t={};return e.reduce((n,r)=>{let s=Fe.pattern.getBaseDirectory(r);return s in n?n[s].push(r):n[s]=[r],n},t)}le.groupPatternsByBaseDirectory=zs;function Vs(e,t,n){return Object.keys(e).map(r=>Ks(r,e[r],t,n))}le.convertPatternGroupsToTasks=Vs;function Ks(e,t,n,r){return{dynamic:r,positive:t,negative:n,base:e,patterns:[].concat(t,n.map(Fe.pattern.convertToNegativePattern))}}le.convertPatternGroupToTask=Ks});var Rc=g(Cr=>{"use strict";Object.defineProperty(Cr,"__esModule",{value:!0});Cr.read=void 0;function Nh(e,t,n){t.fs.lstat(e,(r,s)=>{if(r!==null){Ac(n,r);return}if(!s.isSymbolicLink()||!t.followSymbolicLink){Ys(n,s);return}t.fs.stat(e,(i,a)=>{if(i!==null){if(t.throwErrorOnBrokenSymbolicLink){Ac(n,i);return}Ys(n,s);return}t.markSymbolicLink&&(a.isSymbolicLink=()=>!0),Ys(n,a)})})}Cr.read=Nh;function Ac(e,t){e(t)}function Ys(e,t){e(null,t)}});var Pc=g(Tr=>{"use strict";Object.defineProperty(Tr,"__esModule",{value:!0});Tr.read=void 0;function Mh(e,t){let n=t.fs.lstatSync(e);if(!n.isSymbolicLink()||!t.followSymbolicLink)return n;try{let r=t.fs.statSync(e);return t.markSymbolicLink&&(r.isSymbolicLink=()=>!0),r}catch(r){if(!t.throwErrorOnBrokenSymbolicLink)return n;throw r}}Tr.read=Mh});var Ec=g(ct=>{"use strict";Object.defineProperty(ct,"__esModule",{value:!0});ct.createFileSystemAdapter=ct.FILE_SYSTEM_ADAPTER=void 0;var Ar=require("fs");ct.FILE_SYSTEM_ADAPTER={lstat:Ar.lstat,stat:Ar.stat,lstatSync:Ar.lstatSync,statSync:Ar.statSync};function Lh(e){return e===void 0?ct.FILE_SYSTEM_ADAPTER:Object.assign(Object.assign({},ct.FILE_SYSTEM_ADAPTER),e)}ct.createFileSystemAdapter=Lh});var Oc=g(Xs=>{"use strict";Object.defineProperty(Xs,"__esModule",{value:!0});var Fh=Ec(),Zs=class{constructor(t={}){this._options=t,this.followSymbolicLink=this._getValue(this._options.followSymbolicLink,!0),this.fs=Fh.createFileSystemAdapter(this._options.fs),this.markSymbolicLink=this._getValue(this._options.markSymbolicLink,!1),this.throwErrorOnBrokenSymbolicLink=this._getValue(this._options.throwErrorOnBrokenSymbolicLink,!0)}_getValue(t,n){return t??n}};Xs.default=Zs});var Rt=g(lt=>{"use strict";Object.defineProperty(lt,"__esModule",{value:!0});lt.statSync=lt.stat=lt.Settings=void 0;var Ic=Rc(),jh=Pc(),Js=Oc();lt.Settings=Js.default;function Uh(e,t,n){if(typeof t=="function"){Ic.read(e,Qs(),t);return}Ic.read(e,Qs(t),n)}lt.stat=Uh;function qh(e,t){let n=Qs(t);return jh.read(e,n)}lt.statSync=qh;function Qs(e={}){return e instanceof Js.default?e:new Js.default(e)}});var Mc=g((Vw,Nc)=>{var Dc;Nc.exports=typeof queueMicrotask=="function"?queueMicrotask.bind(typeof window<"u"?window:global):e=>(Dc||(Dc=Promise.resolve())).then(e).catch(t=>setTimeout(()=>{throw t},0))});var Fc=g((Kw,Lc)=>{Lc.exports=Hh;var Wh=Mc();function Hh(e,t){let n,r,s,i=!0;Array.isArray(e)?(n=[],r=e.length):(s=Object.keys(e),n={},r=s.length);function a(c){function l(){t&&t(c,n),t=null}i?Wh(l):l()}function o(c,l,u){n[c]=u,(--r===0||l)&&a(l)}r?s?s.forEach(function(c){e[c](function(l,u){o(c,l,u)})}):e.forEach(function(c,l){c(function(u,d){o(l,u,d)})}):a(null),i=!1}});var ei=g(Pr=>{"use strict";Object.defineProperty(Pr,"__esModule",{value:!0});Pr.IS_SUPPORT_READDIR_WITH_FILE_TYPES=void 0;var Rr=process.versions.node.split(".");if(Rr[0]===void 0||Rr[1]===void 0)throw new Error(`Unexpected behavior. The 'process.versions.node' variable has invalid value: ${process.versions.node}`);var jc=Number.parseInt(Rr[0],10),$h=Number.parseInt(Rr[1],10),Uc=10,Bh=10,Gh=jc>Uc,zh=jc===Uc&&$h>=Bh;Pr.IS_SUPPORT_READDIR_WITH_FILE_TYPES=Gh||zh});var qc=g(Er=>{"use strict";Object.defineProperty(Er,"__esModule",{value:!0});Er.createDirentFromStats=void 0;var ti=class{constructor(t,n){this.name=t,this.isBlockDevice=n.isBlockDevice.bind(n),this.isCharacterDevice=n.isCharacterDevice.bind(n),this.isDirectory=n.isDirectory.bind(n),this.isFIFO=n.isFIFO.bind(n),this.isFile=n.isFile.bind(n),this.isSocket=n.isSocket.bind(n),this.isSymbolicLink=n.isSymbolicLink.bind(n)}};function Vh(e,t){return new ti(e,t)}Er.createDirentFromStats=Vh});var ni=g(Or=>{"use strict";Object.defineProperty(Or,"__esModule",{value:!0});Or.fs=void 0;var Kh=qc();Or.fs=Kh});var ri=g(Ir=>{"use strict";Object.defineProperty(Ir,"__esModule",{value:!0});Ir.joinPathSegments=void 0;function Yh(e,t,n){return e.endsWith(n)?e+t:e+n+t}Ir.joinPathSegments=Yh});var zc=g(ut=>{"use strict";Object.defineProperty(ut,"__esModule",{value:!0});ut.readdir=ut.readdirWithFileTypes=ut.read=void 0;var Zh=Rt(),Wc=Fc(),Xh=ei(),Hc=ni(),$c=ri();function Jh(e,t,n){if(!t.stats&&Xh.IS_SUPPORT_READDIR_WITH_FILE_TYPES){Bc(e,t,n);return}Gc(e,t,n)}ut.read=Jh;function Bc(e,t,n){t.fs.readdir(e,{withFileTypes:!0},(r,s)=>{if(r!==null){Dr(n,r);return}let i=s.map(o=>({dirent:o,name:o.name,path:$c.joinPathSegments(e,o.name,t.pathSegmentSeparator)}));if(!t.followSymbolicLinks){si(n,i);return}let a=i.map(o=>Qh(o,t));Wc(a,(o,c)=>{if(o!==null){Dr(n,o);return}si(n,c)})})}ut.readdirWithFileTypes=Bc;function Qh(e,t){return n=>{if(!e.dirent.isSymbolicLink()){n(null,e);return}t.fs.stat(e.path,(r,s)=>{if(r!==null){if(t.throwErrorOnBrokenSymbolicLink){n(r);return}n(null,e);return}e.dirent=Hc.fs.createDirentFromStats(e.name,s),n(null,e)})}}function Gc(e,t,n){t.fs.readdir(e,(r,s)=>{if(r!==null){Dr(n,r);return}let i=s.map(a=>{let o=$c.joinPathSegments(e,a,t.pathSegmentSeparator);return c=>{Zh.stat(o,t.fsStatSettings,(l,u)=>{if(l!==null){c(l);return}let d={name:a,path:o,dirent:Hc.fs.createDirentFromStats(a,u)};t.stats&&(d.stats=u),c(null,d)})}});Wc(i,(a,o)=>{if(a!==null){Dr(n,a);return}si(n,o)})})}ut.readdir=Gc;function Dr(e,t){e(t)}function si(e,t){e(null,t)}});var Xc=g(dt=>{"use strict";Object.defineProperty(dt,"__esModule",{value:!0});dt.readdir=dt.readdirWithFileTypes=dt.read=void 0;var eg=Rt(),tg=ei(),Vc=ni(),Kc=ri();function ng(e,t){return!t.stats&&tg.IS_SUPPORT_READDIR_WITH_FILE_TYPES?Yc(e,t):Zc(e,t)}dt.read=ng;function Yc(e,t){return t.fs.readdirSync(e,{withFileTypes:!0}).map(r=>{let s={dirent:r,name:r.name,path:Kc.joinPathSegments(e,r.name,t.pathSegmentSeparator)};if(s.dirent.isSymbolicLink()&&t.followSymbolicLinks)try{let i=t.fs.statSync(s.path);s.dirent=Vc.fs.createDirentFromStats(s.name,i)}catch(i){if(t.throwErrorOnBrokenSymbolicLink)throw i}return s})}dt.readdirWithFileTypes=Yc;function Zc(e,t){return t.fs.readdirSync(e).map(r=>{let s=Kc.joinPathSegments(e,r,t.pathSegmentSeparator),i=eg.statSync(s,t.fsStatSettings),a={name:r,path:s,dirent:Vc.fs.createDirentFromStats(r,i)};return t.stats&&(a.stats=i),a})}dt.readdir=Zc});var Jc=g(pt=>{"use strict";Object.defineProperty(pt,"__esModule",{value:!0});pt.createFileSystemAdapter=pt.FILE_SYSTEM_ADAPTER=void 0;var dn=require("fs");pt.FILE_SYSTEM_ADAPTER={lstat:dn.lstat,stat:dn.stat,lstatSync:dn.lstatSync,statSync:dn.statSync,readdir:dn.readdir,readdirSync:dn.readdirSync};function rg(e){return e===void 0?pt.FILE_SYSTEM_ADAPTER:Object.assign(Object.assign({},pt.FILE_SYSTEM_ADAPTER),e)}pt.createFileSystemAdapter=rg});var Qc=g(ai=>{"use strict";Object.defineProperty(ai,"__esModule",{value:!0});var sg=require("path"),ig=Rt(),ag=Jc(),ii=class{constructor(t={}){this._options=t,this.followSymbolicLinks=this._getValue(this._options.followSymbolicLinks,!1),this.fs=ag.createFileSystemAdapter(this._options.fs),this.pathSegmentSeparator=this._getValue(this._options.pathSegmentSeparator,sg.sep),this.stats=this._getValue(this._options.stats,!1),this.throwErrorOnBrokenSymbolicLink=this._getValue(this._options.throwErrorOnBrokenSymbolicLink,!0),this.fsStatSettings=new ig.Settings({followSymbolicLink:this.followSymbolicLinks,fs:this.fs,throwErrorOnBrokenSymbolicLink:this.throwErrorOnBrokenSymbolicLink})}_getValue(t,n){return t??n}};ai.default=ii});var Nr=g(ft=>{"use strict";Object.defineProperty(ft,"__esModule",{value:!0});ft.Settings=ft.scandirSync=ft.scandir=void 0;var el=zc(),og=Xc(),oi=Qc();ft.Settings=oi.default;function cg(e,t,n){if(typeof t=="function"){el.read(e,ci(),t);return}el.read(e,ci(t),n)}ft.scandir=cg;function lg(e,t){let n=ci(t);return og.read(e,n)}ft.scandirSync=lg;function ci(e={}){return e instanceof oi.default?e:new oi.default(e)}});var nl=g((sS,tl)=>{"use strict";function ug(e){var t=new e,n=t;function r(){var i=t;return i.next?t=i.next:(t=new e,n=t),i.next=null,i}function s(i){n.next=i,n=i}return{get:r,release:s}}tl.exports=ug});var sl=g((iS,li)=>{"use strict";var dg=nl();function rl(e,t,n){if(typeof e=="function"&&(n=t,t=e,e=null),!(n>=1))throw new Error("fastqueue concurrency must be equal to or greater than 1");var r=dg(pg),s=null,i=null,a=0,o=null,c={push:_,drain:ye,saturated:ye,pause:u,paused:!1,get concurrency(){return n},set concurrency(D){if(!(D>=1))throw new Error("fastqueue concurrency must be equal to or greater than 1");if(n=D,!c.paused)for(;s&&a<n;)a++,F()},running:l,resume:m,idle:f,length:d,getQueue:p,unshift:T,empty:ye,kill:oe,killAndDrain:K,error:ie,abort:Pe};return c;function l(){return a}function u(){c.paused=!0}function d(){for(var D=s,W=0;D;)D=D.next,W++;return W}function p(){for(var D=s,W=[];D;)W.push(D.value),D=D.next;return W}function m(){if(c.paused){if(c.paused=!1,s===null){a++,F();return}for(;s&&a<n;)a++,F()}}function f(){return a===0&&c.length()===0}function _(D,W){var C=r.get();C.context=e,C.release=F,C.value=D,C.callback=W||ye,C.errorHandler=o,a>=n||c.paused?i?(i.next=C,i=C):(s=C,i=C,c.saturated()):(a++,t.call(e,C.value,C.worked))}function T(D,W){var C=r.get();C.context=e,C.release=F,C.value=D,C.callback=W||ye,C.errorHandler=o,a>=n||c.paused?s?(C.next=s,s=C):(s=C,i=C,c.saturated()):(a++,t.call(e,C.value,C.worked))}function F(D){D&&r.release(D);var W=s;W&&a<=n?c.paused?a--:(i===s&&(i=null),s=W.next,W.next=null,t.call(e,W.value,W.worked),i===null&&c.empty()):--a===0&&c.drain()}function oe(){s=null,i=null,c.drain=ye}function K(){s=null,i=null,c.drain(),c.drain=ye}function Pe(){var D=s;for(s=null,i=null;D;){var W=D.next,C=D.callback,H=D.errorHandler,ne=D.value,x=D.context;D.value=null,D.callback=ye,D.errorHandler=null,H&&H(new Error("abort"),ne),C.call(x,new Error("abort")),D.release(D),D=W}c.drain=ye}function ie(D){o=D}}function ye(){}function pg(){this.value=null,this.callback=ye,this.next=null,this.release=ye,this.context=null,this.errorHandler=null;var e=this;this.worked=function(n,r){var s=e.callback,i=e.errorHandler,a=e.value;e.value=null,e.callback=ye,e.errorHandler&&i(n,a),s.call(e.context,n,r),e.release(e)}}function fg(e,t,n){typeof e=="function"&&(n=t,t=e,e=null);function r(u,d){t.call(this,u).then(function(p){d(null,p)},d)}var s=rl(e,r,n),i=s.push,a=s.unshift;return s.push=o,s.unshift=c,s.drained=l,s;function o(u){var d=new Promise(function(p,m){i(u,function(f,_){if(f){m(f);return}p(_)})});return d.catch(ye),d}function c(u){var d=new Promise(function(p,m){a(u,function(f,_){if(f){m(f);return}p(_)})});return d.catch(ye),d}function l(){var u=new Promise(function(d){process.nextTick(function(){if(s.idle())d();else{var p=s.drain;s.drain=function(){typeof p=="function"&&p(),d(),s.drain=p}}})});return u}}li.exports=rl;li.exports.promise=fg});var Mr=g(ze=>{"use strict";Object.defineProperty(ze,"__esModule",{value:!0});ze.joinPathSegments=ze.replacePathSegmentSeparator=ze.isAppliedFilter=ze.isFatalError=void 0;function mg(e,t){return e.errorFilter===null?!0:!e.errorFilter(t)}ze.isFatalError=mg;function hg(e,t){return e===null||e(t)}ze.isAppliedFilter=hg;function gg(e,t){return e.split(/[/\\]/).join(t)}ze.replacePathSegmentSeparator=gg;function yg(e,t,n){return e===""?t:e.endsWith(n)?e+t:e+n+t}ze.joinPathSegments=yg});var pi=g(di=>{"use strict";Object.defineProperty(di,"__esModule",{value:!0});var vg=Mr(),ui=class{constructor(t,n){this._root=t,this._settings=n,this._root=vg.replacePathSegmentSeparator(t,n.pathSegmentSeparator)}};di.default=ui});var hi=g(mi=>{"use strict";Object.defineProperty(mi,"__esModule",{value:!0});var xg=require("events"),_g=Nr(),kg=sl(),Lr=Mr(),bg=pi(),fi=class extends bg.default{constructor(t,n){super(t,n),this._settings=n,this._scandir=_g.scandir,this._emitter=new xg.EventEmitter,this._queue=kg(this._worker.bind(this),this._settings.concurrency),this._isFatalError=!1,this._isDestroyed=!1,this._queue.drain=()=>{this._isFatalError||this._emitter.emit("end")}}read(){return this._isFatalError=!1,this._isDestroyed=!1,setImmediate(()=>{this._pushToQueue(this._root,this._settings.basePath)}),this._emitter}get isDestroyed(){return this._isDestroyed}destroy(){if(this._isDestroyed)throw new Error("The reader is already destroyed");this._isDestroyed=!0,this._queue.killAndDrain()}onEntry(t){this._emitter.on("entry",t)}onError(t){this._emitter.once("error",t)}onEnd(t){this._emitter.once("end",t)}_pushToQueue(t,n){let r={directory:t,base:n};this._queue.push(r,s=>{s!==null&&this._handleError(s)})}_worker(t,n){this._scandir(t.directory,this._settings.fsScandirSettings,(r,s)=>{if(r!==null){n(r,void 0);return}for(let i of s)this._handleEntry(i,t.base);n(null,void 0)})}_handleError(t){this._isDestroyed||!Lr.isFatalError(this._settings,t)||(this._isFatalError=!0,this._isDestroyed=!0,this._emitter.emit("error",t))}_handleEntry(t,n){if(this._isDestroyed||this._isFatalError)return;let r=t.path;n!==void 0&&(t.path=Lr.joinPathSegments(n,t.name,this._settings.pathSegmentSeparator)),Lr.isAppliedFilter(this._settings.entryFilter,t)&&this._emitEntry(t),t.dirent.isDirectory()&&Lr.isAppliedFilter(this._settings.deepFilter,t)&&this._pushToQueue(r,n===void 0?void 0:t.path)}_emitEntry(t){this._emitter.emit("entry",t)}};mi.default=fi});var il=g(yi=>{"use strict";Object.defineProperty(yi,"__esModule",{value:!0});var wg=hi(),gi=class{constructor(t,n){this._root=t,this._settings=n,this._reader=new wg.default(this._root,this._settings),this._storage=[]}read(t){this._reader.onError(n=>{Sg(t,n)}),this._reader.onEntry(n=>{this._storage.push(n)}),this._reader.onEnd(()=>{Cg(t,this._storage)}),this._reader.read()}};yi.default=gi;function Sg(e,t){e(t)}function Cg(e,t){e(null,t)}});var al=g(xi=>{"use strict";Object.defineProperty(xi,"__esModule",{value:!0});var Tg=require("stream"),Ag=hi(),vi=class{constructor(t,n){this._root=t,this._settings=n,this._reader=new Ag.default(this._root,this._settings),this._stream=new Tg.Readable({objectMode:!0,read:()=>{},destroy:()=>{this._reader.isDestroyed||this._reader.destroy()}})}read(){return this._reader.onError(t=>{this._stream.emit("error",t)}),this._reader.onEntry(t=>{this._stream.push(t)}),this._reader.onEnd(()=>{this._stream.push(null)}),this._reader.read(),this._stream}};xi.default=vi});var ol=g(ki=>{"use strict";Object.defineProperty(ki,"__esModule",{value:!0});var Rg=Nr(),Fr=Mr(),Pg=pi(),_i=class extends Pg.default{constructor(){super(...arguments),this._scandir=Rg.scandirSync,this._storage=[],this._queue=new Set}read(){return this._pushToQueue(this._root,this._settings.basePath),this._handleQueue(),this._storage}_pushToQueue(t,n){this._queue.add({directory:t,base:n})}_handleQueue(){for(let t of this._queue.values())this._handleDirectory(t.directory,t.base)}_handleDirectory(t,n){try{let r=this._scandir(t,this._settings.fsScandirSettings);for(let s of r)this._handleEntry(s,n)}catch(r){this._handleError(r)}}_handleError(t){if(Fr.isFatalError(this._settings,t))throw t}_handleEntry(t,n){let r=t.path;n!==void 0&&(t.path=Fr.joinPathSegments(n,t.name,this._settings.pathSegmentSeparator)),Fr.isAppliedFilter(this._settings.entryFilter,t)&&this._pushToStorage(t),t.dirent.isDirectory()&&Fr.isAppliedFilter(this._settings.deepFilter,t)&&this._pushToQueue(r,n===void 0?void 0:t.path)}_pushToStorage(t){this._storage.push(t)}};ki.default=_i});var cl=g(wi=>{"use strict";Object.defineProperty(wi,"__esModule",{value:!0});var Eg=ol(),bi=class{constructor(t,n){this._root=t,this._settings=n,this._reader=new Eg.default(this._root,this._settings)}read(){return this._reader.read()}};wi.default=bi});var ll=g(Ci=>{"use strict";Object.defineProperty(Ci,"__esModule",{value:!0});var Og=require("path"),Ig=Nr(),Si=class{constructor(t={}){this._options=t,this.basePath=this._getValue(this._options.basePath,void 0),this.concurrency=this._getValue(this._options.concurrency,Number.POSITIVE_INFINITY),this.deepFilter=this._getValue(this._options.deepFilter,null),this.entryFilter=this._getValue(this._options.entryFilter,null),this.errorFilter=this._getValue(this._options.errorFilter,null),this.pathSegmentSeparator=this._getValue(this._options.pathSegmentSeparator,Og.sep),this.fsScandirSettings=new Ig.Settings({followSymbolicLinks:this._options.followSymbolicLinks,fs:this._options.fs,pathSegmentSeparator:this._options.pathSegmentSeparator,stats:this._options.stats,throwErrorOnBrokenSymbolicLink:this._options.throwErrorOnBrokenSymbolicLink})}_getValue(t,n){return t??n}};Ci.default=Si});var Ur=g(Ve=>{"use strict";Object.defineProperty(Ve,"__esModule",{value:!0});Ve.Settings=Ve.walkStream=Ve.walkSync=Ve.walk=void 0;var ul=il(),Dg=al(),Ng=cl(),Ti=ll();Ve.Settings=Ti.default;function Mg(e,t,n){if(typeof t=="function"){new ul.default(e,jr()).read(t);return}new ul.default(e,jr(t)).read(n)}Ve.walk=Mg;function Lg(e,t){let n=jr(t);return new Ng.default(e,n).read()}Ve.walkSync=Lg;function Fg(e,t){let n=jr(t);return new Dg.default(e,n).read()}Ve.walkStream=Fg;function jr(e={}){return e instanceof Ti.default?e:new Ti.default(e)}});var qr=g(Ri=>{"use strict";Object.defineProperty(Ri,"__esModule",{value:!0});var jg=require("path"),Ug=Rt(),dl=Qe(),Ai=class{constructor(t){this._settings=t,this._fsStatSettings=new Ug.Settings({followSymbolicLink:this._settings.followSymbolicLinks,fs:this._settings.fs,throwErrorOnBrokenSymbolicLink:this._settings.followSymbolicLinks})}_getFullEntryPath(t){return jg.resolve(this._settings.cwd,t)}_makeEntry(t,n){let r={name:n,path:n,dirent:dl.fs.createDirentFromStats(n,t)};return this._settings.stats&&(r.stats=t),r}_isFatalError(t){return!dl.errno.isEnoentCodeError(t)&&!this._settings.suppressErrors}};Ri.default=Ai});var Oi=g(Ei=>{"use strict";Object.defineProperty(Ei,"__esModule",{value:!0});var qg=require("stream"),Wg=Rt(),Hg=Ur(),$g=qr(),Pi=class extends $g.default{constructor(){super(...arguments),this._walkStream=Hg.walkStream,this._stat=Wg.stat}dynamic(t,n){return this._walkStream(t,n)}static(t,n){let r=t.map(this._getFullEntryPath,this),s=new qg.PassThrough({objectMode:!0});s._write=(i,a,o)=>this._getEntry(r[i],t[i],n).then(c=>{c!==null&&n.entryFilter(c)&&s.push(c),i===r.length-1&&s.end(),o()}).catch(o);for(let i=0;i<r.length;i++)s.write(i);return s}_getEntry(t,n,r){return this._getStat(t).then(s=>this._makeEntry(s,n)).catch(s=>{if(r.errorFilter(s))return null;throw s})}_getStat(t){return new Promise((n,r)=>{this._stat(t,this._fsStatSettings,(s,i)=>s===null?n(i):r(s))})}};Ei.default=Pi});var pl=g(Di=>{"use strict";Object.defineProperty(Di,"__esModule",{value:!0});var Bg=Ur(),Gg=qr(),zg=Oi(),Ii=class extends Gg.default{constructor(){super(...arguments),this._walkAsync=Bg.walk,this._readerStream=new zg.default(this._settings)}dynamic(t,n){return new Promise((r,s)=>{this._walkAsync(t,n,(i,a)=>{i===null?r(a):s(i)})})}async static(t,n){let r=[],s=this._readerStream.static(t,n);return new Promise((i,a)=>{s.once("error",a),s.on("data",o=>r.push(o)),s.once("end",()=>i(r))})}};Di.default=Ii});var fl=g(Mi=>{"use strict";Object.defineProperty(Mi,"__esModule",{value:!0});var Gn=Qe(),Ni=class{constructor(t,n,r){this._patterns=t,this._settings=n,this._micromatchOptions=r,this._storage=[],this._fillStorage()}_fillStorage(){for(let t of this._patterns){let n=this._getPatternSegments(t),r=this._splitSegmentsIntoSections(n);this._storage.push({complete:r.length<=1,pattern:t,segments:n,sections:r})}}_getPatternSegments(t){return Gn.pattern.getPatternParts(t,this._micromatchOptions).map(r=>Gn.pattern.isDynamicPattern(r,this._settings)?{dynamic:!0,pattern:r,patternRe:Gn.pattern.makeRe(r,this._micromatchOptions)}:{dynamic:!1,pattern:r})}_splitSegmentsIntoSections(t){return Gn.array.splitWhen(t,n=>n.dynamic&&Gn.pattern.hasGlobStar(n.pattern))}};Mi.default=Ni});var ml=g(Fi=>{"use strict";Object.defineProperty(Fi,"__esModule",{value:!0});var Vg=fl(),Li=class extends Vg.default{match(t){let n=t.split("/"),r=n.length,s=this._storage.filter(i=>!i.complete||i.segments.length>r);for(let i of s){let a=i.sections[0];if(!i.complete&&r>a.length||n.every((c,l)=>{let u=i.segments[l];return!!(u.dynamic&&u.patternRe.test(c)||!u.dynamic&&u.pattern===c)}))return!0}return!1}};Fi.default=Li});var hl=g(Ui=>{"use strict";Object.defineProperty(Ui,"__esModule",{value:!0});var Wr=Qe(),Kg=ml(),ji=class{constructor(t,n){this._settings=t,this._micromatchOptions=n}getFilter(t,n,r){let s=this._getMatcher(n),i=this._getNegativePatternsRe(r);return a=>this._filter(t,a,s,i)}_getMatcher(t){return new Kg.default(t,this._settings,this._micromatchOptions)}_getNegativePatternsRe(t){let n=t.filter(Wr.pattern.isAffectDepthOfReadingPattern);return Wr.pattern.convertPatternsToRe(n,this._micromatchOptions)}_filter(t,n,r,s){if(this._isSkippedByDeep(t,n.path)||this._isSkippedSymbolicLink(n))return!1;let i=Wr.path.removeLeadingDotSegment(n.path);return this._isSkippedByPositivePatterns(i,r)?!1:this._isSkippedByNegativePatterns(i,s)}_isSkippedByDeep(t,n){return this._settings.deep===1/0?!1:this._getEntryLevel(t,n)>=this._settings.deep}_getEntryLevel(t,n){let r=n.split("/").length;if(t==="")return r;let s=t.split("/").length;return r-s}_isSkippedSymbolicLink(t){return!this._settings.followSymbolicLinks&&t.dirent.isSymbolicLink()}_isSkippedByPositivePatterns(t,n){return!this._settings.baseNameMatch&&!n.match(t)}_isSkippedByNegativePatterns(t,n){return!Wr.pattern.matchAny(t,n)}};Ui.default=ji});var gl=g(Wi=>{"use strict";Object.defineProperty(Wi,"__esModule",{value:!0});var mt=Qe(),qi=class{constructor(t,n){this._settings=t,this._micromatchOptions=n,this.index=new Map}getFilter(t,n){let[r,s]=mt.pattern.partitionAbsoluteAndRelative(n),i={positive:{all:mt.pattern.convertPatternsToRe(t,this._micromatchOptions)},negative:{absolute:mt.pattern.convertPatternsToRe(r,Object.assign(Object.assign({},this._micromatchOptions),{dot:!0})),relative:mt.pattern.convertPatternsToRe(s,Object.assign(Object.assign({},this._micromatchOptions),{dot:!0}))}};return a=>this._filter(a,i)}_filter(t,n){let r=mt.path.removeLeadingDotSegment(t.path);if(this._settings.unique&&this._isDuplicateEntry(r)||this._onlyFileFilter(t)||this._onlyDirectoryFilter(t))return!1;let s=this._isMatchToPatternsSet(r,n,t.dirent.isDirectory());return this._settings.unique&&s&&this._createIndexRecord(r),s}_isDuplicateEntry(t){return this.index.has(t)}_createIndexRecord(t){this.index.set(t,void 0)}_onlyFileFilter(t){return this._settings.onlyFiles&&!t.dirent.isFile()}_onlyDirectoryFilter(t){return this._settings.onlyDirectories&&!t.dirent.isDirectory()}_isMatchToPatternsSet(t,n,r){return!(!this._isMatchToPatterns(t,n.positive.all,r)||this._isMatchToPatterns(t,n.negative.relative,r)||this._isMatchToAbsoluteNegative(t,n.negative.absolute,r))}_isMatchToAbsoluteNegative(t,n,r){if(n.length===0)return!1;let s=mt.path.makeAbsolute(this._settings.cwd,t);return this._isMatchToPatterns(s,n,r)}_isMatchToPatterns(t,n,r){if(n.length===0)return!1;let s=mt.pattern.matchAny(t,n);return!s&&r?mt.pattern.matchAny(t+"/",n):s}};Wi.default=qi});var yl=g($i=>{"use strict";Object.defineProperty($i,"__esModule",{value:!0});var Yg=Qe(),Hi=class{constructor(t){this._settings=t}getFilter(){return t=>this._isNonFatalError(t)}_isNonFatalError(t){return Yg.errno.isEnoentCodeError(t)||this._settings.suppressErrors}};$i.default=Hi});var xl=g(Gi=>{"use strict";Object.defineProperty(Gi,"__esModule",{value:!0});var vl=Qe(),Bi=class{constructor(t){this._settings=t}getTransformer(){return t=>this._transform(t)}_transform(t){let n=t.path;return this._settings.absolute&&(n=vl.path.makeAbsolute(this._settings.cwd,n),n=vl.path.unixify(n)),this._settings.markDirectories&&t.dirent.isDirectory()&&(n+="/"),this._settings.objectMode?Object.assign(Object.assign({},t),{path:n}):n}};Gi.default=Bi});var Hr=g(Vi=>{"use strict";Object.defineProperty(Vi,"__esModule",{value:!0});var Zg=require("path"),Xg=hl(),Jg=gl(),Qg=yl(),ey=xl(),zi=class{constructor(t){this._settings=t,this.errorFilter=new Qg.default(this._settings),this.entryFilter=new Jg.default(this._settings,this._getMicromatchOptions()),this.deepFilter=new Xg.default(this._settings,this._getMicromatchOptions()),this.entryTransformer=new ey.default(this._settings)}_getRootDirectory(t){return Zg.resolve(this._settings.cwd,t.base)}_getReaderOptions(t){let n=t.base==="."?"":t.base;return{basePath:n,pathSegmentSeparator:"/",concurrency:this._settings.concurrency,deepFilter:this.deepFilter.getFilter(n,t.positive,t.negative),entryFilter:this.entryFilter.getFilter(t.positive,t.negative),errorFilter:this.errorFilter.getFilter(),followSymbolicLinks:this._settings.followSymbolicLinks,fs:this._settings.fs,stats:this._settings.stats,throwErrorOnBrokenSymbolicLink:this._settings.throwErrorOnBrokenSymbolicLink,transform:this.entryTransformer.getTransformer()}}_getMicromatchOptions(){return{dot:this._settings.dot,matchBase:this._settings.baseNameMatch,nobrace:!this._settings.braceExpansion,nocase:!this._settings.caseSensitiveMatch,noext:!this._settings.extglob,noglobstar:!this._settings.globstar,posix:!0,strictSlashes:!1}}};Vi.default=zi});var _l=g(Yi=>{"use strict";Object.defineProperty(Yi,"__esModule",{value:!0});var ty=pl(),ny=Hr(),Ki=class extends ny.default{constructor(){super(...arguments),this._reader=new ty.default(this._settings)}async read(t){let n=this._getRootDirectory(t),r=this._getReaderOptions(t);return(await this.api(n,t,r)).map(i=>r.transform(i))}api(t,n,r){return n.dynamic?this._reader.dynamic(t,r):this._reader.static(n.patterns,r)}};Yi.default=Ki});var kl=g(Xi=>{"use strict";Object.defineProperty(Xi,"__esModule",{value:!0});var ry=require("stream"),sy=Oi(),iy=Hr(),Zi=class extends iy.default{constructor(){super(...arguments),this._reader=new sy.default(this._settings)}read(t){let n=this._getRootDirectory(t),r=this._getReaderOptions(t),s=this.api(n,t,r),i=new ry.Readable({objectMode:!0,read:()=>{}});return s.once("error",a=>i.emit("error",a)).on("data",a=>i.emit("data",r.transform(a))).once("end",()=>i.emit("end")),i.once("close",()=>s.destroy()),i}api(t,n,r){return n.dynamic?this._reader.dynamic(t,r):this._reader.static(n.patterns,r)}};Xi.default=Zi});var bl=g(Qi=>{"use strict";Object.defineProperty(Qi,"__esModule",{value:!0});var ay=Rt(),oy=Ur(),cy=qr(),Ji=class extends cy.default{constructor(){super(...arguments),this._walkSync=oy.walkSync,this._statSync=ay.statSync}dynamic(t,n){return this._walkSync(t,n)}static(t,n){let r=[];for(let s of t){let i=this._getFullEntryPath(s),a=this._getEntry(i,s,n);a===null||!n.entryFilter(a)||r.push(a)}return r}_getEntry(t,n,r){try{let s=this._getStat(t);return this._makeEntry(s,n)}catch(s){if(r.errorFilter(s))return null;throw s}}_getStat(t){return this._statSync(t,this._fsStatSettings)}};Qi.default=Ji});var wl=g(ta=>{"use strict";Object.defineProperty(ta,"__esModule",{value:!0});var ly=bl(),uy=Hr(),ea=class extends uy.default{constructor(){super(...arguments),this._reader=new ly.default(this._settings)}read(t){let n=this._getRootDirectory(t),r=this._getReaderOptions(t);return this.api(n,t,r).map(r.transform)}api(t,n,r){return n.dynamic?this._reader.dynamic(t,r):this._reader.static(n.patterns,r)}};ta.default=ea});var Sl=g(fn=>{"use strict";Object.defineProperty(fn,"__esModule",{value:!0});fn.DEFAULT_FILE_SYSTEM_ADAPTER=void 0;var pn=require("fs"),dy=require("os"),py=Math.max(dy.cpus().length,1);fn.DEFAULT_FILE_SYSTEM_ADAPTER={lstat:pn.lstat,lstatSync:pn.lstatSync,stat:pn.stat,statSync:pn.statSync,readdir:pn.readdir,readdirSync:pn.readdirSync};var na=class{constructor(t={}){this._options=t,this.absolute=this._getValue(this._options.absolute,!1),this.baseNameMatch=this._getValue(this._options.baseNameMatch,!1),this.braceExpansion=this._getValue(this._options.braceExpansion,!0),this.caseSensitiveMatch=this._getValue(this._options.caseSensitiveMatch,!0),this.concurrency=this._getValue(this._options.concurrency,py),this.cwd=this._getValue(this._options.cwd,process.cwd()),this.deep=this._getValue(this._options.deep,1/0),this.dot=this._getValue(this._options.dot,!1),this.extglob=this._getValue(this._options.extglob,!0),this.followSymbolicLinks=this._getValue(this._options.followSymbolicLinks,!0),this.fs=this._getFileSystemMethods(this._options.fs),this.globstar=this._getValue(this._options.globstar,!0),this.ignore=this._getValue(this._options.ignore,[]),this.markDirectories=this._getValue(this._options.markDirectories,!1),this.objectMode=this._getValue(this._options.objectMode,!1),this.onlyDirectories=this._getValue(this._options.onlyDirectories,!1),this.onlyFiles=this._getValue(this._options.onlyFiles,!0),this.stats=this._getValue(this._options.stats,!1),this.suppressErrors=this._getValue(this._options.suppressErrors,!1),this.throwErrorOnBrokenSymbolicLink=this._getValue(this._options.throwErrorOnBrokenSymbolicLink,!1),this.unique=this._getValue(this._options.unique,!0),this.onlyDirectories&&(this.onlyFiles=!1),this.stats&&(this.objectMode=!0),this.ignore=[].concat(this.ignore)}_getValue(t,n){return t===void 0?n:t}_getFileSystemMethods(t={}){return Object.assign(Object.assign({},fn.DEFAULT_FILE_SYSTEM_ADAPTER),t)}};fn.default=na});var Al=g((ES,Tl)=>{"use strict";var Cl=Tc(),fy=_l(),my=kl(),hy=wl(),ra=Sl(),Oe=Qe();async function sa(e,t){je(e);let n=ia(e,fy.default,t),r=await Promise.all(n);return Oe.array.flatten(r)}(function(e){e.glob=e,e.globSync=t,e.globStream=n,e.async=e;function t(l,u){je(l);let d=ia(l,hy.default,u);return Oe.array.flatten(d)}e.sync=t;function n(l,u){je(l);let d=ia(l,my.default,u);return Oe.stream.merge(d)}e.stream=n;function r(l,u){je(l);let d=[].concat(l),p=new ra.default(u);return Cl.generate(d,p)}e.generateTasks=r;function s(l,u){je(l);let d=new ra.default(u);return Oe.pattern.isDynamicPattern(l,d)}e.isDynamicPattern=s;function i(l){return je(l),Oe.path.escape(l)}e.escapePath=i;function a(l){return je(l),Oe.path.convertPathToPattern(l)}e.convertPathToPattern=a;let o;(function(l){function u(p){return je(p),Oe.path.escapePosixPath(p)}l.escapePath=u;function d(p){return je(p),Oe.path.convertPosixPathToPattern(p)}l.convertPathToPattern=d})(o=e.posix||(e.posix={}));let c;(function(l){function u(p){return je(p),Oe.path.escapeWindowsPath(p)}l.escapePath=u;function d(p){return je(p),Oe.path.convertWindowsPathToPattern(p)}l.convertPathToPattern=d})(c=e.win32||(e.win32={}))})(sa||(sa={}));function ia(e,t,n){let r=[].concat(e),s=new ra.default(n),i=Cl.generate(r,s),a=new t(s);return i.map(a.read,a)}function je(e){if(![].concat(e).every(r=>Oe.string.isString(r)&&!Oe.string.isEmpty(r)))throw new TypeError("Patterns must be a string (non empty) or an array of strings")}Tl.exports=sa});var zn=g((OS,Pl)=>{var gy=Object.prototype.toString;Pl.exports=function(t){if(t===void 0)return"undefined";if(t===null)return"null";var n=typeof t;if(n==="boolean")return"boolean";if(n==="string")return"string";if(n==="number")return"number";if(n==="symbol")return"symbol";if(n==="function")return ky(t)?"generatorfunction":"function";if(yy(t))return"array";if(Sy(t))return"buffer";if(wy(t))return"arguments";if(xy(t))return"date";if(vy(t))return"error";if(_y(t))return"regexp";switch(Rl(t)){case"Symbol":return"symbol";case"Promise":return"promise";case"WeakMap":return"weakmap";case"WeakSet":return"weakset";case"Map":return"map";case"Set":return"set";case"Int8Array":return"int8array";case"Uint8Array":return"uint8array";case"Uint8ClampedArray":return"uint8clampedarray";case"Int16Array":return"int16array";case"Uint16Array":return"uint16array";case"Int32Array":return"int32array";case"Uint32Array":return"uint32array";case"Float32Array":return"float32array";case"Float64Array":return"float64array"}if(by(t))return"generator";switch(n=gy.call(t),n){case"[object Object]":return"object";case"[object Map Iterator]":return"mapiterator";case"[object Set Iterator]":return"setiterator";case"[object String Iterator]":return"stringiterator";case"[object Array Iterator]":return"arrayiterator"}return n.slice(8,-1).toLowerCase().replace(/\s/g,"")};function Rl(e){return typeof e.constructor=="function"?e.constructor.name:null}function yy(e){return Array.isArray?Array.isArray(e):e instanceof Array}function vy(e){return e instanceof Error||typeof e.message=="string"&&e.constructor&&typeof e.constructor.stackTraceLimit=="number"}function xy(e){return e instanceof Date?!0:typeof e.toDateString=="function"&&typeof e.getDate=="function"&&typeof e.setDate=="function"}function _y(e){return e instanceof RegExp?!0:typeof e.flags=="string"&&typeof e.ignoreCase=="boolean"&&typeof e.multiline=="boolean"&&typeof e.global=="boolean"}function ky(e,t){return Rl(e)==="GeneratorFunction"}function by(e){return typeof e.throw=="function"&&typeof e.return=="function"&&typeof e.next=="function"}function wy(e){try{if(typeof e.length=="number"&&typeof e.callee=="function")return!0}catch(t){if(t.message.indexOf("callee")!==-1)return!0}return!1}function Sy(e){return e.constructor&&typeof e.constructor.isBuffer=="function"?e.constructor.isBuffer(e):!1}});var Ol=g((IS,El)=>{"use strict";El.exports=function(t){return typeof t<"u"&&t!==null&&(typeof t=="object"||typeof t=="function")}});var Nl=g((DS,Dl)=>{"use strict";var Il=Ol();Dl.exports=function(t){Il(t)||(t={});for(var n=arguments.length,r=1;r<n;r++){var s=arguments[r];Il(s)&&Cy(t,s)}return t};function Cy(e,t){for(var n in t)Ty(t,n)&&(e[n]=t[n])}function Ty(e,t){return Object.prototype.hasOwnProperty.call(e,t)}});var Fl=g((NS,Ll)=>{"use strict";var Ay=zn(),Ry=Nl();Ll.exports=function(e,t){typeof t=="function"&&(t={parse:t});var n=Ey(e),r={section_delimiter:"---",parse:Iy},s=Ry({},r,t),i=s.section_delimiter,a=n.content.split(/\r?\n/),o=null,c=Ml(),l=[],u=[];function d(F){n.content=F,o=[],l=[]}function p(F){u.length&&(c.key=Oy(u[0],i),c.content=F,s.parse(c,o),o.push(c),c=Ml(),l=[],u=[])}for(var m=0;m<a.length;m++){var f=a[m],_=u.length,T=f.trim();if(Py(T,i)){if(T.length===3&&m!==0){if(_===0||_===2){l.push(f);continue}u.push(T),c.data=l.join(`
`),l=[];continue}o===null&&d(l.join(`
`)),_===2&&p(l.join(`
`)),u.push(T);continue}l.push(f)}return o===null?d(l.join(`
`)):p(l.join(`
`)),n.sections=o,n};function Py(e,t){return!(e.slice(0,t.length)!==t||e.charAt(t.length+1)===t.slice(-1))}function Ey(e){if(Ay(e)!=="object"&&(e={content:e}),typeof e.content!="string"&&!Dy(e.content))throw new TypeError("expected a buffer or string");return e.content=e.content.toString(),e.sections=[],e}function Oy(e,t){return e?e.slice(t.length).trim():""}function Ml(){return{key:"",data:"",content:""}}function Iy(e){return e}function Dy(e){return e&&e.constructor&&typeof e.constructor.isBuffer=="function"?e.constructor.isBuffer(e):!1}});var Et=g((MS,Pt)=>{"use strict";function jl(e){return typeof e>"u"||e===null}function Ny(e){return typeof e=="object"&&e!==null}function My(e){return Array.isArray(e)?e:jl(e)?[]:[e]}function Ly(e,t){var n,r,s,i;if(t)for(i=Object.keys(t),n=0,r=i.length;n<r;n+=1)s=i[n],e[s]=t[s];return e}function Fy(e,t){var n="",r;for(r=0;r<t;r+=1)n+=e;return n}function jy(e){return e===0&&Number.NEGATIVE_INFINITY===1/e}Pt.exports.isNothing=jl;Pt.exports.isObject=Ny;Pt.exports.toArray=My;Pt.exports.repeat=Fy;Pt.exports.isNegativeZero=jy;Pt.exports.extend=Ly});var mn=g((LS,Ul)=>{"use strict";function Vn(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=(this.reason||"(unknown reason)")+(this.mark?" "+this.mark.toString():""),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}Vn.prototype=Object.create(Error.prototype);Vn.prototype.constructor=Vn;Vn.prototype.toString=function(t){var n=this.name+": ";return n+=this.reason||"(unknown reason)",!t&&this.mark&&(n+=" "+this.mark.toString()),n};Ul.exports=Vn});var Hl=g((FS,Wl)=>{"use strict";var ql=Et();function aa(e,t,n,r,s){this.name=e,this.buffer=t,this.position=n,this.line=r,this.column=s}aa.prototype.getSnippet=function(t,n){var r,s,i,a,o;if(!this.buffer)return null;for(t=t||4,n=n||75,r="",s=this.position;s>0&&`\0\r
\x85\u2028\u2029`.indexOf(this.buffer.charAt(s-1))===-1;)if(s-=1,this.position-s>n/2-1){r=" ... ",s+=5;break}for(i="",a=this.position;a<this.buffer.length&&`\0\r
\x85\u2028\u2029`.indexOf(this.buffer.charAt(a))===-1;)if(a+=1,a-this.position>n/2-1){i=" ... ",a-=5;break}return o=this.buffer.slice(s,a),ql.repeat(" ",t)+r+o+i+`
`+ql.repeat(" ",t+this.position-s+r.length)+"^"};aa.prototype.toString=function(t){var n,r="";return this.name&&(r+='in "'+this.name+'" '),r+="at line "+(this.line+1)+", column "+(this.column+1),t||(n=this.getSnippet(),n&&(r+=`:
`+n)),r};Wl.exports=aa});var se=g((jS,Bl)=>{"use strict";var $l=mn(),Uy=["kind","resolve","construct","instanceOf","predicate","represent","defaultStyle","styleAliases"],qy=["scalar","sequence","mapping"];function Wy(e){var t={};return e!==null&&Object.keys(e).forEach(function(n){e[n].forEach(function(r){t[String(r)]=n})}),t}function Hy(e,t){if(t=t||{},Object.keys(t).forEach(function(n){if(Uy.indexOf(n)===-1)throw new $l('Unknown option "'+n+'" is met in definition of "'+e+'" YAML type.')}),this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(n){return n},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.defaultStyle=t.defaultStyle||null,this.styleAliases=Wy(t.styleAliases||null),qy.indexOf(this.kind)===-1)throw new $l('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')}Bl.exports=Hy});var Ot=g((US,zl)=>{"use strict";var Gl=Et(),$r=mn(),$y=se();function oa(e,t,n){var r=[];return e.include.forEach(function(s){n=oa(s,t,n)}),e[t].forEach(function(s){n.forEach(function(i,a){i.tag===s.tag&&i.kind===s.kind&&r.push(a)}),n.push(s)}),n.filter(function(s,i){return r.indexOf(i)===-1})}function By(){var e={scalar:{},sequence:{},mapping:{},fallback:{}},t,n;function r(s){e[s.kind][s.tag]=e.fallback[s.tag]=s}for(t=0,n=arguments.length;t<n;t+=1)arguments[t].forEach(r);return e}function hn(e){this.include=e.include||[],this.implicit=e.implicit||[],this.explicit=e.explicit||[],this.implicit.forEach(function(t){if(t.loadKind&&t.loadKind!=="scalar")throw new $r("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.")}),this.compiledImplicit=oa(this,"implicit",[]),this.compiledExplicit=oa(this,"explicit",[]),this.compiledTypeMap=By(this.compiledImplicit,this.compiledExplicit)}hn.DEFAULT=null;hn.create=function(){var t,n;switch(arguments.length){case 1:t=hn.DEFAULT,n=arguments[0];break;case 2:t=arguments[0],n=arguments[1];break;default:throw new $r("Wrong number of arguments for Schema.create function")}if(t=Gl.toArray(t),n=Gl.toArray(n),!t.every(function(r){return r instanceof hn}))throw new $r("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");if(!n.every(function(r){return r instanceof $y}))throw new $r("Specified list of YAML types (or a single Type object) contains a non-Type object.");return new hn({include:t,explicit:n})};zl.exports=hn});var Kl=g((qS,Vl)=>{"use strict";var Gy=se();Vl.exports=new Gy("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return e!==null?e:""}})});var Zl=g((WS,Yl)=>{"use strict";var zy=se();Yl.exports=new zy("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return e!==null?e:[]}})});var Jl=g((HS,Xl)=>{"use strict";var Vy=se();Xl.exports=new Vy("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return e!==null?e:{}}})});var Br=g(($S,Ql)=>{"use strict";var Ky=Ot();Ql.exports=new Ky({explicit:[Kl(),Zl(),Jl()]})});var tu=g((BS,eu)=>{"use strict";var Yy=se();function Zy(e){if(e===null)return!0;var t=e.length;return t===1&&e==="~"||t===4&&(e==="null"||e==="Null"||e==="NULL")}function Xy(){return null}function Jy(e){return e===null}eu.exports=new Yy("tag:yaml.org,2002:null",{kind:"scalar",resolve:Zy,construct:Xy,predicate:Jy,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"}},defaultStyle:"lowercase"})});var ru=g((GS,nu)=>{"use strict";var Qy=se();function ev(e){if(e===null)return!1;var t=e.length;return t===4&&(e==="true"||e==="True"||e==="TRUE")||t===5&&(e==="false"||e==="False"||e==="FALSE")}function tv(e){return e==="true"||e==="True"||e==="TRUE"}function nv(e){return Object.prototype.toString.call(e)==="[object Boolean]"}nu.exports=new Qy("tag:yaml.org,2002:bool",{kind:"scalar",resolve:ev,construct:tv,predicate:nv,represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"})});var iu=g((zS,su)=>{"use strict";var rv=Et(),sv=se();function iv(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function av(e){return 48<=e&&e<=55}function ov(e){return 48<=e&&e<=57}function cv(e){if(e===null)return!1;var t=e.length,n=0,r=!1,s;if(!t)return!1;if(s=e[n],(s==="-"||s==="+")&&(s=e[++n]),s==="0"){if(n+1===t)return!0;if(s=e[++n],s==="b"){for(n++;n<t;n++)if(s=e[n],s!=="_"){if(s!=="0"&&s!=="1")return!1;r=!0}return r&&s!=="_"}if(s==="x"){for(n++;n<t;n++)if(s=e[n],s!=="_"){if(!iv(e.charCodeAt(n)))return!1;r=!0}return r&&s!=="_"}for(;n<t;n++)if(s=e[n],s!=="_"){if(!av(e.charCodeAt(n)))return!1;r=!0}return r&&s!=="_"}if(s==="_")return!1;for(;n<t;n++)if(s=e[n],s!=="_"){if(s===":")break;if(!ov(e.charCodeAt(n)))return!1;r=!0}return!r||s==="_"?!1:s!==":"?!0:/^(:[0-5]?[0-9])+$/.test(e.slice(n))}function lv(e){var t=e,n=1,r,s,i=[];return t.indexOf("_")!==-1&&(t=t.replace(/_/g,"")),r=t[0],(r==="-"||r==="+")&&(r==="-"&&(n=-1),t=t.slice(1),r=t[0]),t==="0"?0:r==="0"?t[1]==="b"?n*parseInt(t.slice(2),2):t[1]==="x"?n*parseInt(t,16):n*parseInt(t,8):t.indexOf(":")!==-1?(t.split(":").forEach(function(a){i.unshift(parseInt(a,10))}),t=0,s=1,i.forEach(function(a){t+=a*s,s*=60}),n*t):n*parseInt(t,10)}function uv(e){return Object.prototype.toString.call(e)==="[object Number]"&&e%1===0&&!rv.isNegativeZero(e)}su.exports=new sv("tag:yaml.org,2002:int",{kind:"scalar",resolve:cv,construct:lv,predicate:uv,represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0"+e.toString(8):"-0"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}})});var cu=g((VS,ou)=>{"use strict";var au=Et(),dv=se(),pv=new RegExp("^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function fv(e){return!(e===null||!pv.test(e)||e[e.length-1]==="_")}function mv(e){var t,n,r,s;return t=e.replace(/_/g,"").toLowerCase(),n=t[0]==="-"?-1:1,s=[],"+-".indexOf(t[0])>=0&&(t=t.slice(1)),t===".inf"?n===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:t===".nan"?NaN:t.indexOf(":")>=0?(t.split(":").forEach(function(i){s.unshift(parseFloat(i,10))}),t=0,r=1,s.forEach(function(i){t+=i*r,r*=60}),n*t):n*parseFloat(t,10)}var hv=/^[-+]?[0-9]+e/;function gv(e,t){var n;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(au.isNegativeZero(e))return"-0.0";return n=e.toString(10),hv.test(n)?n.replace("e",".e"):n}function yv(e){return Object.prototype.toString.call(e)==="[object Number]"&&(e%1!==0||au.isNegativeZero(e))}ou.exports=new dv("tag:yaml.org,2002:float",{kind:"scalar",resolve:fv,construct:mv,predicate:yv,represent:gv,defaultStyle:"lowercase"})});var ca=g((KS,lu)=>{"use strict";var vv=Ot();lu.exports=new vv({include:[Br()],implicit:[tu(),ru(),iu(),cu()]})});var la=g((YS,uu)=>{"use strict";var xv=Ot();uu.exports=new xv({include:[ca()]})});var mu=g((ZS,fu)=>{"use strict";var _v=se(),du=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),pu=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function kv(e){return e===null?!1:du.exec(e)!==null||pu.exec(e)!==null}function bv(e){var t,n,r,s,i,a,o,c=0,l=null,u,d,p;if(t=du.exec(e),t===null&&(t=pu.exec(e)),t===null)throw new Error("Date resolve error");if(n=+t[1],r=+t[2]-1,s=+t[3],!t[4])return new Date(Date.UTC(n,r,s));if(i=+t[4],a=+t[5],o=+t[6],t[7]){for(c=t[7].slice(0,3);c.length<3;)c+="0";c=+c}return t[9]&&(u=+t[10],d=+(t[11]||0),l=(u*60+d)*6e4,t[9]==="-"&&(l=-l)),p=new Date(Date.UTC(n,r,s,i,a,o,c)),l&&p.setTime(p.getTime()-l),p}function wv(e){return e.toISOString()}fu.exports=new _v("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:kv,construct:bv,instanceOf:Date,represent:wv})});var gu=g((XS,hu)=>{"use strict";var Sv=se();function Cv(e){return e==="<<"||e===null}hu.exports=new Sv("tag:yaml.org,2002:merge",{kind:"scalar",resolve:Cv})});var xu=g((JS,vu)=>{"use strict";var It;try{yu=require,It=yu("buffer").Buffer}catch{}var yu,Tv=se(),ua=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function Av(e){if(e===null)return!1;var t,n,r=0,s=e.length,i=ua;for(n=0;n<s;n++)if(t=i.indexOf(e.charAt(n)),!(t>64)){if(t<0)return!1;r+=6}return r%8===0}function Rv(e){var t,n,r=e.replace(/[\r\n=]/g,""),s=r.length,i=ua,a=0,o=[];for(t=0;t<s;t++)t%4===0&&t&&(o.push(a>>16&255),o.push(a>>8&255),o.push(a&255)),a=a<<6|i.indexOf(r.charAt(t));return n=s%4*6,n===0?(o.push(a>>16&255),o.push(a>>8&255),o.push(a&255)):n===18?(o.push(a>>10&255),o.push(a>>2&255)):n===12&&o.push(a>>4&255),It?It.from?It.from(o):new It(o):o}function Pv(e){var t="",n=0,r,s,i=e.length,a=ua;for(r=0;r<i;r++)r%3===0&&r&&(t+=a[n>>18&63],t+=a[n>>12&63],t+=a[n>>6&63],t+=a[n&63]),n=(n<<8)+e[r];return s=i%3,s===0?(t+=a[n>>18&63],t+=a[n>>12&63],t+=a[n>>6&63],t+=a[n&63]):s===2?(t+=a[n>>10&63],t+=a[n>>4&63],t+=a[n<<2&63],t+=a[64]):s===1&&(t+=a[n>>2&63],t+=a[n<<4&63],t+=a[64],t+=a[64]),t}function Ev(e){return It&&It.isBuffer(e)}vu.exports=new Tv("tag:yaml.org,2002:binary",{kind:"scalar",resolve:Av,construct:Rv,predicate:Ev,represent:Pv})});var ku=g((QS,_u)=>{"use strict";var Ov=se(),Iv=Object.prototype.hasOwnProperty,Dv=Object.prototype.toString;function Nv(e){if(e===null)return!0;var t=[],n,r,s,i,a,o=e;for(n=0,r=o.length;n<r;n+=1){if(s=o[n],a=!1,Dv.call(s)!=="[object Object]")return!1;for(i in s)if(Iv.call(s,i))if(!a)a=!0;else return!1;if(!a)return!1;if(t.indexOf(i)===-1)t.push(i);else return!1}return!0}function Mv(e){return e!==null?e:[]}_u.exports=new Ov("tag:yaml.org,2002:omap",{kind:"sequence",resolve:Nv,construct:Mv})});var wu=g((eC,bu)=>{"use strict";var Lv=se(),Fv=Object.prototype.toString;function jv(e){if(e===null)return!0;var t,n,r,s,i,a=e;for(i=new Array(a.length),t=0,n=a.length;t<n;t+=1){if(r=a[t],Fv.call(r)!=="[object Object]"||(s=Object.keys(r),s.length!==1))return!1;i[t]=[s[0],r[s[0]]]}return!0}function Uv(e){if(e===null)return[];var t,n,r,s,i,a=e;for(i=new Array(a.length),t=0,n=a.length;t<n;t+=1)r=a[t],s=Object.keys(r),i[t]=[s[0],r[s[0]]];return i}bu.exports=new Lv("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:jv,construct:Uv})});var Cu=g((tC,Su)=>{"use strict";var qv=se(),Wv=Object.prototype.hasOwnProperty;function Hv(e){if(e===null)return!0;var t,n=e;for(t in n)if(Wv.call(n,t)&&n[t]!==null)return!1;return!0}function $v(e){return e!==null?e:{}}Su.exports=new qv("tag:yaml.org,2002:set",{kind:"mapping",resolve:Hv,construct:$v})});var gn=g((nC,Tu)=>{"use strict";var Bv=Ot();Tu.exports=new Bv({include:[la()],implicit:[mu(),gu()],explicit:[xu(),ku(),wu(),Cu()]})});var Ru=g((rC,Au)=>{"use strict";var Gv=se();function zv(){return!0}function Vv(){}function Kv(){return""}function Yv(e){return typeof e>"u"}Au.exports=new Gv("tag:yaml.org,2002:js/undefined",{kind:"scalar",resolve:zv,construct:Vv,predicate:Yv,represent:Kv})});var Eu=g((sC,Pu)=>{"use strict";var Zv=se();function Xv(e){if(e===null||e.length===0)return!1;var t=e,n=/\/([gim]*)$/.exec(e),r="";return!(t[0]==="/"&&(n&&(r=n[1]),r.length>3||t[t.length-r.length-1]!=="/"))}function Jv(e){var t=e,n=/\/([gim]*)$/.exec(e),r="";return t[0]==="/"&&(n&&(r=n[1]),t=t.slice(1,t.length-r.length-1)),new RegExp(t,r)}function Qv(e){var t="/"+e.source+"/";return e.global&&(t+="g"),e.multiline&&(t+="m"),e.ignoreCase&&(t+="i"),t}function ex(e){return Object.prototype.toString.call(e)==="[object RegExp]"}Pu.exports=new Zv("tag:yaml.org,2002:js/regexp",{kind:"scalar",resolve:Xv,construct:Jv,predicate:ex,represent:Qv})});var Du=g((iC,Iu)=>{"use strict";var Gr;try{Ou=require,Gr=Ou("esprima")}catch{typeof window<"u"&&(Gr=window.esprima)}var Ou,tx=se();function nx(e){if(e===null)return!1;try{var t="("+e+")",n=Gr.parse(t,{range:!0});return!(n.type!=="Program"||n.body.length!==1||n.body[0].type!=="ExpressionStatement"||n.body[0].expression.type!=="ArrowFunctionExpression"&&n.body[0].expression.type!=="FunctionExpression")}catch{return!1}}function rx(e){var t="("+e+")",n=Gr.parse(t,{range:!0}),r=[],s;if(n.type!=="Program"||n.body.length!==1||n.body[0].type!=="ExpressionStatement"||n.body[0].expression.type!=="ArrowFunctionExpression"&&n.body[0].expression.type!=="FunctionExpression")throw new Error("Failed to resolve function");return n.body[0].expression.params.forEach(function(i){r.push(i.name)}),s=n.body[0].expression.body.range,n.body[0].expression.body.type==="BlockStatement"?new Function(r,t.slice(s[0]+1,s[1]-1)):new Function(r,"return "+t.slice(s[0],s[1]))}function sx(e){return e.toString()}function ix(e){return Object.prototype.toString.call(e)==="[object Function]"}Iu.exports=new tx("tag:yaml.org,2002:js/function",{kind:"scalar",resolve:nx,construct:rx,predicate:ix,represent:sx})});var Kn=g((aC,Mu)=>{"use strict";var Nu=Ot();Mu.exports=Nu.DEFAULT=new Nu({include:[gn()],explicit:[Ru(),Eu(),Du()]})});var td=g((oC,Yn)=>{"use strict";var et=Et(),Hu=mn(),ax=Hl(),$u=gn(),ox=Kn(),gt=Object.prototype.hasOwnProperty,zr=1,Bu=2,Gu=3,Vr=4,da=1,cx=2,Lu=3,lx=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,ux=/[\x85\u2028\u2029]/,dx=/[,\[\]\{\}]/,zu=/^(?:!|!!|![a-z\-]+!)$/i,Vu=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Fu(e){return Object.prototype.toString.call(e)}function Ke(e){return e===10||e===13}function Nt(e){return e===9||e===32}function ve(e){return e===9||e===32||e===10||e===13}function yn(e){return e===44||e===91||e===93||e===123||e===125}function px(e){var t;return 48<=e&&e<=57?e-48:(t=e|32,97<=t&&t<=102?t-97+10:-1)}function fx(e){return e===120?2:e===117?4:e===85?8:0}function mx(e){return 48<=e&&e<=57?e-48:-1}function ju(e){return e===48?"\0":e===97?"\x07":e===98?"\b":e===116||e===9?"	":e===110?`
`:e===118?"\v":e===102?"\f":e===114?"\r":e===101?"\x1B":e===32?" ":e===34?'"':e===47?"/":e===92?"\\":e===78?"\x85":e===95?"\xA0":e===76?"\u2028":e===80?"\u2029":""}function hx(e){return e<=65535?String.fromCharCode(e):String.fromCharCode((e-65536>>10)+55296,(e-65536&1023)+56320)}function Ku(e,t,n){t==="__proto__"?Object.defineProperty(e,t,{configurable:!0,enumerable:!0,writable:!0,value:n}):e[t]=n}var Yu=new Array(256),Zu=new Array(256);for(Dt=0;Dt<256;Dt++)Yu[Dt]=ju(Dt)?1:0,Zu[Dt]=ju(Dt);var Dt;function gx(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||ox,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.documents=[]}function Xu(e,t){return new Hu(t,new ax(e.filename,e.input,e.position,e.line,e.position-e.lineStart))}function P(e,t){throw Xu(e,t)}function Kr(e,t){e.onWarning&&e.onWarning.call(null,Xu(e,t))}var Uu={YAML:function(t,n,r){var s,i,a;t.version!==null&&P(t,"duplication of %YAML directive"),r.length!==1&&P(t,"YAML directive accepts exactly one argument"),s=/^([0-9]+)\.([0-9]+)$/.exec(r[0]),s===null&&P(t,"ill-formed argument of the YAML directive"),i=parseInt(s[1],10),a=parseInt(s[2],10),i!==1&&P(t,"unacceptable YAML version of the document"),t.version=r[0],t.checkLineBreaks=a<2,a!==1&&a!==2&&Kr(t,"unsupported YAML version of the document")},TAG:function(t,n,r){var s,i;r.length!==2&&P(t,"TAG directive accepts exactly two arguments"),s=r[0],i=r[1],zu.test(s)||P(t,"ill-formed tag handle (first argument) of the TAG directive"),gt.call(t.tagMap,s)&&P(t,'there is a previously declared suffix for "'+s+'" tag handle'),Vu.test(i)||P(t,"ill-formed tag prefix (second argument) of the TAG directive"),t.tagMap[s]=i}};function ht(e,t,n,r){var s,i,a,o;if(t<n){if(o=e.input.slice(t,n),r)for(s=0,i=o.length;s<i;s+=1)a=o.charCodeAt(s),a===9||32<=a&&a<=1114111||P(e,"expected valid JSON character");else lx.test(o)&&P(e,"the stream contains non-printable characters");e.result+=o}}function qu(e,t,n,r){var s,i,a,o;for(et.isObject(n)||P(e,"cannot merge mappings; the provided source object is unacceptable"),s=Object.keys(n),a=0,o=s.length;a<o;a+=1)i=s[a],gt.call(t,i)||(Ku(t,i,n[i]),r[i]=!0)}function vn(e,t,n,r,s,i,a,o){var c,l;if(Array.isArray(s))for(s=Array.prototype.slice.call(s),c=0,l=s.length;c<l;c+=1)Array.isArray(s[c])&&P(e,"nested arrays are not supported inside keys"),typeof s=="object"&&Fu(s[c])==="[object Object]"&&(s[c]="[object Object]");if(typeof s=="object"&&Fu(s)==="[object Object]"&&(s="[object Object]"),s=String(s),t===null&&(t={}),r==="tag:yaml.org,2002:merge")if(Array.isArray(i))for(c=0,l=i.length;c<l;c+=1)qu(e,t,i[c],n);else qu(e,t,i,n);else!e.json&&!gt.call(n,s)&&gt.call(t,s)&&(e.line=a||e.line,e.position=o||e.position,P(e,"duplicated mapping key")),Ku(t,s,i),delete n[s];return t}function pa(e){var t;t=e.input.charCodeAt(e.position),t===10?e.position++:t===13?(e.position++,e.input.charCodeAt(e.position)===10&&e.position++):P(e,"a line break is expected"),e.line+=1,e.lineStart=e.position}function te(e,t,n){for(var r=0,s=e.input.charCodeAt(e.position);s!==0;){for(;Nt(s);)s=e.input.charCodeAt(++e.position);if(t&&s===35)do s=e.input.charCodeAt(++e.position);while(s!==10&&s!==13&&s!==0);if(Ke(s))for(pa(e),s=e.input.charCodeAt(e.position),r++,e.lineIndent=0;s===32;)e.lineIndent++,s=e.input.charCodeAt(++e.position);else break}return n!==-1&&r!==0&&e.lineIndent<n&&Kr(e,"deficient indentation"),r}function Yr(e){var t=e.position,n;return n=e.input.charCodeAt(t),!!((n===45||n===46)&&n===e.input.charCodeAt(t+1)&&n===e.input.charCodeAt(t+2)&&(t+=3,n=e.input.charCodeAt(t),n===0||ve(n)))}function fa(e,t){t===1?e.result+=" ":t>1&&(e.result+=et.repeat(`
`,t-1))}function yx(e,t,n){var r,s,i,a,o,c,l,u,d=e.kind,p=e.result,m;if(m=e.input.charCodeAt(e.position),ve(m)||yn(m)||m===35||m===38||m===42||m===33||m===124||m===62||m===39||m===34||m===37||m===64||m===96||(m===63||m===45)&&(s=e.input.charCodeAt(e.position+1),ve(s)||n&&yn(s)))return!1;for(e.kind="scalar",e.result="",i=a=e.position,o=!1;m!==0;){if(m===58){if(s=e.input.charCodeAt(e.position+1),ve(s)||n&&yn(s))break}else if(m===35){if(r=e.input.charCodeAt(e.position-1),ve(r))break}else{if(e.position===e.lineStart&&Yr(e)||n&&yn(m))break;if(Ke(m))if(c=e.line,l=e.lineStart,u=e.lineIndent,te(e,!1,-1),e.lineIndent>=t){o=!0,m=e.input.charCodeAt(e.position);continue}else{e.position=a,e.line=c,e.lineStart=l,e.lineIndent=u;break}}o&&(ht(e,i,a,!1),fa(e,e.line-c),i=a=e.position,o=!1),Nt(m)||(a=e.position+1),m=e.input.charCodeAt(++e.position)}return ht(e,i,a,!1),e.result?!0:(e.kind=d,e.result=p,!1)}function vx(e,t){var n,r,s;if(n=e.input.charCodeAt(e.position),n!==39)return!1;for(e.kind="scalar",e.result="",e.position++,r=s=e.position;(n=e.input.charCodeAt(e.position))!==0;)if(n===39)if(ht(e,r,e.position,!0),n=e.input.charCodeAt(++e.position),n===39)r=e.position,e.position++,s=e.position;else return!0;else Ke(n)?(ht(e,r,s,!0),fa(e,te(e,!1,t)),r=s=e.position):e.position===e.lineStart&&Yr(e)?P(e,"unexpected end of the document within a single quoted scalar"):(e.position++,s=e.position);P(e,"unexpected end of the stream within a single quoted scalar")}function xx(e,t){var n,r,s,i,a,o;if(o=e.input.charCodeAt(e.position),o!==34)return!1;for(e.kind="scalar",e.result="",e.position++,n=r=e.position;(o=e.input.charCodeAt(e.position))!==0;){if(o===34)return ht(e,n,e.position,!0),e.position++,!0;if(o===92){if(ht(e,n,e.position,!0),o=e.input.charCodeAt(++e.position),Ke(o))te(e,!1,t);else if(o<256&&Yu[o])e.result+=Zu[o],e.position++;else if((a=fx(o))>0){for(s=a,i=0;s>0;s--)o=e.input.charCodeAt(++e.position),(a=px(o))>=0?i=(i<<4)+a:P(e,"expected hexadecimal character");e.result+=hx(i),e.position++}else P(e,"unknown escape sequence");n=r=e.position}else Ke(o)?(ht(e,n,r,!0),fa(e,te(e,!1,t)),n=r=e.position):e.position===e.lineStart&&Yr(e)?P(e,"unexpected end of the document within a double quoted scalar"):(e.position++,r=e.position)}P(e,"unexpected end of the stream within a double quoted scalar")}function _x(e,t){var n=!0,r,s=e.tag,i,a=e.anchor,o,c,l,u,d,p={},m,f,_,T;if(T=e.input.charCodeAt(e.position),T===91)c=93,d=!1,i=[];else if(T===123)c=125,d=!0,i={};else return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=i),T=e.input.charCodeAt(++e.position);T!==0;){if(te(e,!0,t),T=e.input.charCodeAt(e.position),T===c)return e.position++,e.tag=s,e.anchor=a,e.kind=d?"mapping":"sequence",e.result=i,!0;n||P(e,"missed comma between flow collection entries"),f=m=_=null,l=u=!1,T===63&&(o=e.input.charCodeAt(e.position+1),ve(o)&&(l=u=!0,e.position++,te(e,!0,t))),r=e.line,xn(e,t,zr,!1,!0),f=e.tag,m=e.result,te(e,!0,t),T=e.input.charCodeAt(e.position),(u||e.line===r)&&T===58&&(l=!0,T=e.input.charCodeAt(++e.position),te(e,!0,t),xn(e,t,zr,!1,!0),_=e.result),d?vn(e,i,p,f,m,_):l?i.push(vn(e,null,p,f,m,_)):i.push(m),te(e,!0,t),T=e.input.charCodeAt(e.position),T===44?(n=!0,T=e.input.charCodeAt(++e.position)):n=!1}P(e,"unexpected end of the stream within a flow collection")}function kx(e,t){var n,r,s=da,i=!1,a=!1,o=t,c=0,l=!1,u,d;if(d=e.input.charCodeAt(e.position),d===124)r=!1;else if(d===62)r=!0;else return!1;for(e.kind="scalar",e.result="";d!==0;)if(d=e.input.charCodeAt(++e.position),d===43||d===45)da===s?s=d===43?Lu:cx:P(e,"repeat of a chomping mode identifier");else if((u=mx(d))>=0)u===0?P(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):a?P(e,"repeat of an indentation width identifier"):(o=t+u-1,a=!0);else break;if(Nt(d)){do d=e.input.charCodeAt(++e.position);while(Nt(d));if(d===35)do d=e.input.charCodeAt(++e.position);while(!Ke(d)&&d!==0)}for(;d!==0;){for(pa(e),e.lineIndent=0,d=e.input.charCodeAt(e.position);(!a||e.lineIndent<o)&&d===32;)e.lineIndent++,d=e.input.charCodeAt(++e.position);if(!a&&e.lineIndent>o&&(o=e.lineIndent),Ke(d)){c++;continue}if(e.lineIndent<o){s===Lu?e.result+=et.repeat(`
`,i?1+c:c):s===da&&i&&(e.result+=`
`);break}for(r?Nt(d)?(l=!0,e.result+=et.repeat(`
`,i?1+c:c)):l?(l=!1,e.result+=et.repeat(`
`,c+1)):c===0?i&&(e.result+=" "):e.result+=et.repeat(`
`,c):e.result+=et.repeat(`
`,i?1+c:c),i=!0,a=!0,c=0,n=e.position;!Ke(d)&&d!==0;)d=e.input.charCodeAt(++e.position);ht(e,n,e.position,!1)}return!0}function Wu(e,t){var n,r=e.tag,s=e.anchor,i=[],a,o=!1,c;for(e.anchor!==null&&(e.anchorMap[e.anchor]=i),c=e.input.charCodeAt(e.position);c!==0&&!(c!==45||(a=e.input.charCodeAt(e.position+1),!ve(a)));){if(o=!0,e.position++,te(e,!0,-1)&&e.lineIndent<=t){i.push(null),c=e.input.charCodeAt(e.position);continue}if(n=e.line,xn(e,t,Gu,!1,!0),i.push(e.result),te(e,!0,-1),c=e.input.charCodeAt(e.position),(e.line===n||e.lineIndent>t)&&c!==0)P(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break}return o?(e.tag=r,e.anchor=s,e.kind="sequence",e.result=i,!0):!1}function bx(e,t,n){var r,s,i,a,o=e.tag,c=e.anchor,l={},u={},d=null,p=null,m=null,f=!1,_=!1,T;for(e.anchor!==null&&(e.anchorMap[e.anchor]=l),T=e.input.charCodeAt(e.position);T!==0;){if(r=e.input.charCodeAt(e.position+1),i=e.line,a=e.position,(T===63||T===58)&&ve(r))T===63?(f&&(vn(e,l,u,d,p,null),d=p=m=null),_=!0,f=!0,s=!0):f?(f=!1,s=!0):P(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,T=r;else if(xn(e,n,Bu,!1,!0))if(e.line===i){for(T=e.input.charCodeAt(e.position);Nt(T);)T=e.input.charCodeAt(++e.position);if(T===58)T=e.input.charCodeAt(++e.position),ve(T)||P(e,"a whitespace character is expected after the key-value separator within a block mapping"),f&&(vn(e,l,u,d,p,null),d=p=m=null),_=!0,f=!1,s=!1,d=e.tag,p=e.result;else if(_)P(e,"can not read an implicit mapping pair; a colon is missed");else return e.tag=o,e.anchor=c,!0}else if(_)P(e,"can not read a block mapping entry; a multiline key may not be an implicit key");else return e.tag=o,e.anchor=c,!0;else break;if((e.line===i||e.lineIndent>t)&&(xn(e,t,Vr,!0,s)&&(f?p=e.result:m=e.result),f||(vn(e,l,u,d,p,m,i,a),d=p=m=null),te(e,!0,-1),T=e.input.charCodeAt(e.position)),e.lineIndent>t&&T!==0)P(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return f&&vn(e,l,u,d,p,null),_&&(e.tag=o,e.anchor=c,e.kind="mapping",e.result=l),_}function wx(e){var t,n=!1,r=!1,s,i,a;if(a=e.input.charCodeAt(e.position),a!==33)return!1;if(e.tag!==null&&P(e,"duplication of a tag property"),a=e.input.charCodeAt(++e.position),a===60?(n=!0,a=e.input.charCodeAt(++e.position)):a===33?(r=!0,s="!!",a=e.input.charCodeAt(++e.position)):s="!",t=e.position,n){do a=e.input.charCodeAt(++e.position);while(a!==0&&a!==62);e.position<e.length?(i=e.input.slice(t,e.position),a=e.input.charCodeAt(++e.position)):P(e,"unexpected end of the stream within a verbatim tag")}else{for(;a!==0&&!ve(a);)a===33&&(r?P(e,"tag suffix cannot contain exclamation marks"):(s=e.input.slice(t-1,e.position+1),zu.test(s)||P(e,"named tag handle cannot contain such characters"),r=!0,t=e.position+1)),a=e.input.charCodeAt(++e.position);i=e.input.slice(t,e.position),dx.test(i)&&P(e,"tag suffix cannot contain flow indicator characters")}return i&&!Vu.test(i)&&P(e,"tag name cannot contain such characters: "+i),n?e.tag=i:gt.call(e.tagMap,s)?e.tag=e.tagMap[s]+i:s==="!"?e.tag="!"+i:s==="!!"?e.tag="tag:yaml.org,2002:"+i:P(e,'undeclared tag handle "'+s+'"'),!0}function Sx(e){var t,n;if(n=e.input.charCodeAt(e.position),n!==38)return!1;for(e.anchor!==null&&P(e,"duplication of an anchor property"),n=e.input.charCodeAt(++e.position),t=e.position;n!==0&&!ve(n)&&!yn(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&P(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function Cx(e){var t,n,r;if(r=e.input.charCodeAt(e.position),r!==42)return!1;for(r=e.input.charCodeAt(++e.position),t=e.position;r!==0&&!ve(r)&&!yn(r);)r=e.input.charCodeAt(++e.position);return e.position===t&&P(e,"name of an alias node must contain at least one character"),n=e.input.slice(t,e.position),gt.call(e.anchorMap,n)||P(e,'unidentified alias "'+n+'"'),e.result=e.anchorMap[n],te(e,!0,-1),!0}function xn(e,t,n,r,s){var i,a,o,c=1,l=!1,u=!1,d,p,m,f,_;if(e.listener!==null&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,i=a=o=Vr===n||Gu===n,r&&te(e,!0,-1)&&(l=!0,e.lineIndent>t?c=1:e.lineIndent===t?c=0:e.lineIndent<t&&(c=-1)),c===1)for(;wx(e)||Sx(e);)te(e,!0,-1)?(l=!0,o=i,e.lineIndent>t?c=1:e.lineIndent===t?c=0:e.lineIndent<t&&(c=-1)):o=!1;if(o&&(o=l||s),(c===1||Vr===n)&&(zr===n||Bu===n?f=t:f=t+1,_=e.position-e.lineStart,c===1?o&&(Wu(e,_)||bx(e,_,f))||_x(e,f)?u=!0:(a&&kx(e,f)||vx(e,f)||xx(e,f)?u=!0:Cx(e)?(u=!0,(e.tag!==null||e.anchor!==null)&&P(e,"alias node should not have any properties")):yx(e,f,zr===n)&&(u=!0,e.tag===null&&(e.tag="?")),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):c===0&&(u=o&&Wu(e,_))),e.tag!==null&&e.tag!=="!")if(e.tag==="?"){for(e.result!==null&&e.kind!=="scalar"&&P(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),d=0,p=e.implicitTypes.length;d<p;d+=1)if(m=e.implicitTypes[d],m.resolve(e.result)){e.result=m.construct(e.result),e.tag=m.tag,e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);break}}else gt.call(e.typeMap[e.kind||"fallback"],e.tag)?(m=e.typeMap[e.kind||"fallback"][e.tag],e.result!==null&&m.kind!==e.kind&&P(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+m.kind+'", not "'+e.kind+'"'),m.resolve(e.result)?(e.result=m.construct(e.result),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):P(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")):P(e,"unknown tag !<"+e.tag+">");return e.listener!==null&&e.listener("close",e),e.tag!==null||e.anchor!==null||u}function Tx(e){var t=e.position,n,r,s,i=!1,a;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap={},e.anchorMap={};(a=e.input.charCodeAt(e.position))!==0&&(te(e,!0,-1),a=e.input.charCodeAt(e.position),!(e.lineIndent>0||a!==37));){for(i=!0,a=e.input.charCodeAt(++e.position),n=e.position;a!==0&&!ve(a);)a=e.input.charCodeAt(++e.position);for(r=e.input.slice(n,e.position),s=[],r.length<1&&P(e,"directive name must not be less than one character in length");a!==0;){for(;Nt(a);)a=e.input.charCodeAt(++e.position);if(a===35){do a=e.input.charCodeAt(++e.position);while(a!==0&&!Ke(a));break}if(Ke(a))break;for(n=e.position;a!==0&&!ve(a);)a=e.input.charCodeAt(++e.position);s.push(e.input.slice(n,e.position))}a!==0&&pa(e),gt.call(Uu,r)?Uu[r](e,r,s):Kr(e,'unknown document directive "'+r+'"')}if(te(e,!0,-1),e.lineIndent===0&&e.input.charCodeAt(e.position)===45&&e.input.charCodeAt(e.position+1)===45&&e.input.charCodeAt(e.position+2)===45?(e.position+=3,te(e,!0,-1)):i&&P(e,"directives end mark is expected"),xn(e,e.lineIndent-1,Vr,!1,!0),te(e,!0,-1),e.checkLineBreaks&&ux.test(e.input.slice(t,e.position))&&Kr(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&Yr(e)){e.input.charCodeAt(e.position)===46&&(e.position+=3,te(e,!0,-1));return}if(e.position<e.length-1)P(e,"end of the stream or a document separator is expected");else return}function Ju(e,t){e=String(e),t=t||{},e.length!==0&&(e.charCodeAt(e.length-1)!==10&&e.charCodeAt(e.length-1)!==13&&(e+=`
`),e.charCodeAt(0)===65279&&(e=e.slice(1)));var n=new gx(e,t),r=e.indexOf("\0");for(r!==-1&&(n.position=r,P(n,"null byte is not allowed in input")),n.input+="\0";n.input.charCodeAt(n.position)===32;)n.lineIndent+=1,n.position+=1;for(;n.position<n.length-1;)Tx(n);return n.documents}function Qu(e,t,n){t!==null&&typeof t=="object"&&typeof n>"u"&&(n=t,t=null);var r=Ju(e,n);if(typeof t!="function")return r;for(var s=0,i=r.length;s<i;s+=1)t(r[s])}function ed(e,t){var n=Ju(e,t);if(n.length!==0){if(n.length===1)return n[0];throw new Hu("expected a single document in the stream, but found more")}}function Ax(e,t,n){return typeof t=="object"&&t!==null&&typeof n>"u"&&(n=t,t=null),Qu(e,t,et.extend({schema:$u},n))}function Rx(e,t){return ed(e,et.extend({schema:$u},t))}Yn.exports.loadAll=Qu;Yn.exports.load=ed;Yn.exports.safeLoadAll=Ax;Yn.exports.safeLoad=Rx});var Sd=g((cC,ya)=>{"use strict";var Xn=Et(),Jn=mn(),Px=Kn(),Ex=gn(),ld=Object.prototype.toString,ud=Object.prototype.hasOwnProperty,Ox=9,Zn=10,Ix=13,Dx=32,Nx=33,Mx=34,dd=35,Lx=37,Fx=38,jx=39,Ux=42,pd=44,qx=45,fd=58,Wx=61,Hx=62,$x=63,Bx=64,md=91,hd=93,Gx=96,gd=123,zx=124,yd=125,ue={};ue[0]="\\0";ue[7]="\\a";ue[8]="\\b";ue[9]="\\t";ue[10]="\\n";ue[11]="\\v";ue[12]="\\f";ue[13]="\\r";ue[27]="\\e";ue[34]='\\"';ue[92]="\\\\";ue[133]="\\N";ue[160]="\\_";ue[8232]="\\L";ue[8233]="\\P";var Vx=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"];function Kx(e,t){var n,r,s,i,a,o,c;if(t===null)return{};for(n={},r=Object.keys(t),s=0,i=r.length;s<i;s+=1)a=r[s],o=String(t[a]),a.slice(0,2)==="!!"&&(a="tag:yaml.org,2002:"+a.slice(2)),c=e.compiledTypeMap.fallback[a],c&&ud.call(c.styleAliases,o)&&(o=c.styleAliases[o]),n[a]=o;return n}function nd(e){var t,n,r;if(t=e.toString(16).toUpperCase(),e<=255)n="x",r=2;else if(e<=65535)n="u",r=4;else if(e<=4294967295)n="U",r=8;else throw new Jn("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+n+Xn.repeat("0",r-t.length)+t}function Yx(e){this.schema=e.schema||Px,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=Xn.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=Kx(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function rd(e,t){for(var n=Xn.repeat(" ",t),r=0,s=-1,i="",a,o=e.length;r<o;)s=e.indexOf(`
`,r),s===-1?(a=e.slice(r),r=o):(a=e.slice(r,s+1),r=s+1),a.length&&a!==`
`&&(i+=n),i+=a;return i}function ma(e,t){return`
`+Xn.repeat(" ",e.indent*t)}function Zx(e,t){var n,r,s;for(n=0,r=e.implicitTypes.length;n<r;n+=1)if(s=e.implicitTypes[n],s.resolve(t))return!0;return!1}function ga(e){return e===Dx||e===Ox}function _n(e){return 32<=e&&e<=126||161<=e&&e<=55295&&e!==8232&&e!==8233||57344<=e&&e<=65533&&e!==65279||65536<=e&&e<=1114111}function Xx(e){return _n(e)&&!ga(e)&&e!==65279&&e!==Ix&&e!==Zn}function sd(e,t){return _n(e)&&e!==65279&&e!==pd&&e!==md&&e!==hd&&e!==gd&&e!==yd&&e!==fd&&(e!==dd||t&&Xx(t))}function Jx(e){return _n(e)&&e!==65279&&!ga(e)&&e!==qx&&e!==$x&&e!==fd&&e!==pd&&e!==md&&e!==hd&&e!==gd&&e!==yd&&e!==dd&&e!==Fx&&e!==Ux&&e!==Nx&&e!==zx&&e!==Wx&&e!==Hx&&e!==jx&&e!==Mx&&e!==Lx&&e!==Bx&&e!==Gx}function vd(e){var t=/^\n* /;return t.test(e)}var xd=1,_d=2,kd=3,bd=4,Zr=5;function Qx(e,t,n,r,s){var i,a,o,c=!1,l=!1,u=r!==-1,d=-1,p=Jx(e.charCodeAt(0))&&!ga(e.charCodeAt(e.length-1));if(t)for(i=0;i<e.length;i++){if(a=e.charCodeAt(i),!_n(a))return Zr;o=i>0?e.charCodeAt(i-1):null,p=p&&sd(a,o)}else{for(i=0;i<e.length;i++){if(a=e.charCodeAt(i),a===Zn)c=!0,u&&(l=l||i-d-1>r&&e[d+1]!==" ",d=i);else if(!_n(a))return Zr;o=i>0?e.charCodeAt(i-1):null,p=p&&sd(a,o)}l=l||u&&i-d-1>r&&e[d+1]!==" "}return!c&&!l?p&&!s(e)?xd:_d:n>9&&vd(e)?Zr:l?bd:kd}function e_(e,t,n,r){e.dump=(function(){if(t.length===0)return"''";if(!e.noCompatMode&&Vx.indexOf(t)!==-1)return"'"+t+"'";var s=e.indent*Math.max(1,n),i=e.lineWidth===-1?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-s),a=r||e.flowLevel>-1&&n>=e.flowLevel;function o(c){return Zx(e,c)}switch(Qx(t,a,e.indent,i,o)){case xd:return t;case _d:return"'"+t.replace(/'/g,"''")+"'";case kd:return"|"+id(t,e.indent)+ad(rd(t,s));case bd:return">"+id(t,e.indent)+ad(rd(t_(t,i),s));case Zr:return'"'+n_(t,i)+'"';default:throw new Jn("impossible error: invalid scalar style")}})()}function id(e,t){var n=vd(e)?String(t):"",r=e[e.length-1]===`
`,s=r&&(e[e.length-2]===`
`||e===`
`),i=s?"+":r?"":"-";return n+i+`
`}function ad(e){return e[e.length-1]===`
`?e.slice(0,-1):e}function t_(e,t){for(var n=/(\n+)([^\n]*)/g,r=(function(){var l=e.indexOf(`
`);return l=l!==-1?l:e.length,n.lastIndex=l,od(e.slice(0,l),t)})(),s=e[0]===`
`||e[0]===" ",i,a;a=n.exec(e);){var o=a[1],c=a[2];i=c[0]===" ",r+=o+(!s&&!i&&c!==""?`
`:"")+od(c,t),s=i}return r}function od(e,t){if(e===""||e[0]===" ")return e;for(var n=/ [^ ]/g,r,s=0,i,a=0,o=0,c="";r=n.exec(e);)o=r.index,o-s>t&&(i=a>s?a:o,c+=`
`+e.slice(s,i),s=i+1),a=o;return c+=`
`,e.length-s>t&&a>s?c+=e.slice(s,a)+`
`+e.slice(a+1):c+=e.slice(s),c.slice(1)}function n_(e){for(var t="",n,r,s,i=0;i<e.length;i++){if(n=e.charCodeAt(i),n>=55296&&n<=56319&&(r=e.charCodeAt(i+1),r>=56320&&r<=57343)){t+=nd((n-55296)*1024+r-56320+65536),i++;continue}s=ue[n],t+=!s&&_n(n)?e[i]:s||nd(n)}return t}function r_(e,t,n){var r="",s=e.tag,i,a;for(i=0,a=n.length;i<a;i+=1)Mt(e,t,n[i],!1,!1)&&(i!==0&&(r+=","+(e.condenseFlow?"":" ")),r+=e.dump);e.tag=s,e.dump="["+r+"]"}function s_(e,t,n,r){var s="",i=e.tag,a,o;for(a=0,o=n.length;a<o;a+=1)Mt(e,t+1,n[a],!0,!0)&&((!r||a!==0)&&(s+=ma(e,t)),e.dump&&Zn===e.dump.charCodeAt(0)?s+="-":s+="- ",s+=e.dump);e.tag=i,e.dump=s||"[]"}function i_(e,t,n){var r="",s=e.tag,i=Object.keys(n),a,o,c,l,u;for(a=0,o=i.length;a<o;a+=1)u="",a!==0&&(u+=", "),e.condenseFlow&&(u+='"'),c=i[a],l=n[c],Mt(e,t,c,!1,!1)&&(e.dump.length>1024&&(u+="? "),u+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),Mt(e,t,l,!1,!1)&&(u+=e.dump,r+=u));e.tag=s,e.dump="{"+r+"}"}function a_(e,t,n,r){var s="",i=e.tag,a=Object.keys(n),o,c,l,u,d,p;if(e.sortKeys===!0)a.sort();else if(typeof e.sortKeys=="function")a.sort(e.sortKeys);else if(e.sortKeys)throw new Jn("sortKeys must be a boolean or a function");for(o=0,c=a.length;o<c;o+=1)p="",(!r||o!==0)&&(p+=ma(e,t)),l=a[o],u=n[l],Mt(e,t+1,l,!0,!0,!0)&&(d=e.tag!==null&&e.tag!=="?"||e.dump&&e.dump.length>1024,d&&(e.dump&&Zn===e.dump.charCodeAt(0)?p+="?":p+="? "),p+=e.dump,d&&(p+=ma(e,t)),Mt(e,t+1,u,!0,d)&&(e.dump&&Zn===e.dump.charCodeAt(0)?p+=":":p+=": ",p+=e.dump,s+=p));e.tag=i,e.dump=s||"{}"}function cd(e,t,n){var r,s,i,a,o,c;for(s=n?e.explicitTypes:e.implicitTypes,i=0,a=s.length;i<a;i+=1)if(o=s[i],(o.instanceOf||o.predicate)&&(!o.instanceOf||typeof t=="object"&&t instanceof o.instanceOf)&&(!o.predicate||o.predicate(t))){if(e.tag=n?o.tag:"?",o.represent){if(c=e.styleMap[o.tag]||o.defaultStyle,ld.call(o.represent)==="[object Function]")r=o.represent(t,c);else if(ud.call(o.represent,c))r=o.represent[c](t,c);else throw new Jn("!<"+o.tag+'> tag resolver accepts not "'+c+'" style');e.dump=r}return!0}return!1}function Mt(e,t,n,r,s,i){e.tag=null,e.dump=n,cd(e,n,!1)||cd(e,n,!0);var a=ld.call(e.dump);r&&(r=e.flowLevel<0||e.flowLevel>t);var o=a==="[object Object]"||a==="[object Array]",c,l;if(o&&(c=e.duplicates.indexOf(n),l=c!==-1),(e.tag!==null&&e.tag!=="?"||l||e.indent!==2&&t>0)&&(s=!1),l&&e.usedDuplicates[c])e.dump="*ref_"+c;else{if(o&&l&&!e.usedDuplicates[c]&&(e.usedDuplicates[c]=!0),a==="[object Object]")r&&Object.keys(e.dump).length!==0?(a_(e,t,e.dump,s),l&&(e.dump="&ref_"+c+e.dump)):(i_(e,t,e.dump),l&&(e.dump="&ref_"+c+" "+e.dump));else if(a==="[object Array]"){var u=e.noArrayIndent&&t>0?t-1:t;r&&e.dump.length!==0?(s_(e,u,e.dump,s),l&&(e.dump="&ref_"+c+e.dump)):(r_(e,u,e.dump),l&&(e.dump="&ref_"+c+" "+e.dump))}else if(a==="[object String]")e.tag!=="?"&&e_(e,e.dump,t,i);else{if(e.skipInvalid)return!1;throw new Jn("unacceptable kind of an object to dump "+a)}e.tag!==null&&e.tag!=="?"&&(e.dump="!<"+e.tag+"> "+e.dump)}return!0}function o_(e,t){var n=[],r=[],s,i;for(ha(e,n,r),s=0,i=r.length;s<i;s+=1)t.duplicates.push(n[r[s]]);t.usedDuplicates=new Array(i)}function ha(e,t,n){var r,s,i;if(e!==null&&typeof e=="object")if(s=t.indexOf(e),s!==-1)n.indexOf(s)===-1&&n.push(s);else if(t.push(e),Array.isArray(e))for(s=0,i=e.length;s<i;s+=1)ha(e[s],t,n);else for(r=Object.keys(e),s=0,i=r.length;s<i;s+=1)ha(e[r[s]],t,n)}function wd(e,t){t=t||{};var n=new Yx(t);return n.noRefs||o_(e,n),Mt(n,0,e,!0,!0)?n.dump+`
`:""}function c_(e,t){return wd(e,Xn.extend({schema:Ex},t))}ya.exports.dump=wd;ya.exports.safeDump=c_});var Td=g((lC,X)=>{"use strict";var Xr=td(),Cd=Sd();function Jr(e){return function(){throw new Error("Function "+e+" is deprecated and cannot be used.")}}X.exports.Type=se();X.exports.Schema=Ot();X.exports.FAILSAFE_SCHEMA=Br();X.exports.JSON_SCHEMA=ca();X.exports.CORE_SCHEMA=la();X.exports.DEFAULT_SAFE_SCHEMA=gn();X.exports.DEFAULT_FULL_SCHEMA=Kn();X.exports.load=Xr.load;X.exports.loadAll=Xr.loadAll;X.exports.safeLoad=Xr.safeLoad;X.exports.safeLoadAll=Xr.safeLoadAll;X.exports.dump=Cd.dump;X.exports.safeDump=Cd.safeDump;X.exports.YAMLException=mn();X.exports.MINIMAL_SCHEMA=Br();X.exports.SAFE_SCHEMA=gn();X.exports.DEFAULT_SCHEMA=Kn();X.exports.scan=Jr("scan");X.exports.parse=Jr("parse");X.exports.compose=Jr("compose");X.exports.addConstructor=Jr("addConstructor")});var Rd=g((uC,Ad)=>{"use strict";var l_=Td();Ad.exports=l_});var va=g((exports,module)=>{"use strict";var yaml=Rd(),engines=exports=module.exports;engines.yaml={parse:yaml.safeLoad.bind(yaml),stringify:yaml.safeDump.bind(yaml)};engines.json={parse:JSON.parse.bind(JSON),stringify:function(e,t){let n=Object.assign({replacer:null,space:2},t);return JSON.stringify(e,n.replacer,n.space)}};engines.javascript={parse:function parse(str,options,wrap){try{return wrap!==!1&&(str=`(function() {
return `+str.trim()+`;
}());`),eval(str)||{}}catch(e){if(wrap!==!1&&/(unexpected|identifier)/i.test(e.message))return parse(str,options,!1);throw new SyntaxError(e)}},stringify:function(){throw new Error("stringifying JavaScript is not supported")}}});var Ed=g((dC,Pd)=>{"use strict";Pd.exports=function(e){return typeof e=="string"&&e.charAt(0)==="\uFEFF"?e.slice(1):e}});var Qr=g(tt=>{"use strict";var Od=Ed(),Id=zn();tt.define=function(e,t,n){Reflect.defineProperty(e,t,{enumerable:!1,configurable:!0,writable:!0,value:n})};tt.isBuffer=function(e){return Id(e)==="buffer"};tt.isObject=function(e){return Id(e)==="object"};tt.toBuffer=function(e){return typeof e=="string"?Buffer.from(e):e};tt.toString=function(e){if(tt.isBuffer(e))return Od(String(e));if(typeof e!="string")throw new TypeError("expected input to be a string or buffer");return Od(e)};tt.arrayify=function(e){return e?Array.isArray(e)?e:[e]:[]};tt.startsWith=function(e,t,n){return typeof n!="number"&&(n=t.length),e.slice(0,n)===t}});var Qn=g((fC,Dd)=>{"use strict";var u_=va(),d_=Qr();Dd.exports=function(e){let t=Object.assign({},e);return t.delimiters=d_.arrayify(t.delims||t.delimiters||"---"),t.delimiters.length===1&&t.delimiters.push(t.delimiters[0]),t.language=(t.language||t.lang||"yaml").toLowerCase(),t.engines=Object.assign({},u_,t.parsers,t.engines),t}});var xa=g((mC,Nd)=>{"use strict";Nd.exports=function(e,t){let n=t.engines[e]||t.engines[p_(e)];if(typeof n>"u")throw new Error('gray-matter engine "'+e+'" is not registered');return typeof n=="function"&&(n={parse:n}),n};function p_(e){switch(e.toLowerCase()){case"js":case"javascript":return"javascript";case"coffee":case"coffeescript":case"cson":return"coffee";case"yaml":case"yml":return"yaml";default:return e}}});var _a=g((hC,Md)=>{"use strict";var f_=zn(),m_=xa(),h_=Qn();Md.exports=function(e,t,n){if(t==null&&n==null)switch(f_(e)){case"object":t=e.data,n={};break;case"string":return e;default:throw new TypeError("expected file to be a string or object")}let r=e.content,s=h_(n);if(t==null){if(!s.data)return e;t=s.data}let i=e.language||s.language,a=m_(i,s);if(typeof a.stringify!="function")throw new TypeError('expected "'+i+'.stringify" to be a function');t=Object.assign({},e.data,t);let o=s.delimiters[0],c=s.delimiters[1],l=a.stringify(t,n).trim(),u="";return l!=="{}"&&(u=kn(o)+kn(l)+kn(c)),typeof e.excerpt=="string"&&e.excerpt!==""&&r.indexOf(e.excerpt.trim())===-1&&(u+=kn(e.excerpt)+kn(c)),u+kn(r)};function kn(e){return e.slice(-1)!==`
`?e+`
`:e}});var Fd=g((gC,Ld)=>{"use strict";var g_=Qn();Ld.exports=function(e,t){let n=g_(t);if(e.data==null&&(e.data={}),typeof n.excerpt=="function")return n.excerpt(e,n);let r=e.data.excerpt_separator||n.excerpt_separator;if(r==null&&(n.excerpt===!1||n.excerpt==null))return e;let s=typeof n.excerpt=="string"?n.excerpt:r||n.delimiters[0],i=e.content.indexOf(s);return i!==-1&&(e.excerpt=e.content.slice(0,i)),e}});var qd=g((yC,Ud)=>{"use strict";var jd=zn(),y_=_a(),bn=Qr();Ud.exports=function(e){return jd(e)!=="object"&&(e={content:e}),jd(e.data)!=="object"&&(e.data={}),e.contents&&e.content==null&&(e.content=e.contents),bn.define(e,"orig",bn.toBuffer(e.content)),bn.define(e,"language",e.language||""),bn.define(e,"matter",e.matter||""),bn.define(e,"stringify",function(t,n){return n&&n.language&&(e.language=n.language),y_(e,t,n)}),e.content=bn.toString(e.content),e.isEmpty=!1,e.excerpt="",e}});var Hd=g((vC,Wd)=>{"use strict";var v_=xa(),x_=Qn();Wd.exports=function(e,t,n){let r=x_(n),s=v_(e,r);if(typeof s.parse!="function")throw new TypeError('expected "'+e+'.parse" to be a function');return s.parse(t,r)}});var wn=g((xC,Gd)=>{"use strict";var __=require("fs"),k_=Fl(),ka=Qn(),b_=_a(),$d=Fd(),w_=va(),S_=qd(),C_=Hd(),Bd=Qr();function me(e,t){if(e==="")return{data:{},content:e,excerpt:"",orig:e};let n=S_(e),r=me.cache[n.content];if(!t){if(r)return n=Object.assign({},r),n.orig=r.orig,n;me.cache[n.content]=n}return T_(n,t)}function T_(e,t){let n=ka(t),r=n.delimiters[0],s=`
`+n.delimiters[1],i=e.content;n.language&&(e.language=n.language);let a=r.length;if(!Bd.startsWith(i,r,a))return $d(e,n),e;if(i.charAt(a)===r.slice(-1))return e;i=i.slice(a);let o=i.length,c=me.language(i,n);c.name&&(e.language=c.name,i=i.slice(c.raw.length));let l=i.indexOf(s);return l===-1&&(l=o),e.matter=i.slice(0,l),e.matter.replace(/^\s*#[^\n]+/gm,"").trim()===""?(e.isEmpty=!0,e.empty=e.content,e.data={}):e.data=C_(e.language,e.matter,n),l===o?e.content="":(e.content=i.slice(l+s.length),e.content[0]==="\r"&&(e.content=e.content.slice(1)),e.content[0]===`
`&&(e.content=e.content.slice(1))),$d(e,n),(n.sections===!0||typeof n.section=="function")&&k_(e,n.section),e}me.engines=w_;me.stringify=function(e,t,n){return typeof e=="string"&&(e=me(e,n)),b_(e,t,n)};me.read=function(e,t){let n=__.readFileSync(e,"utf8"),r=me(n,t);return r.path=e,r};me.test=function(e,t){return Bd.startsWith(e,ka(t).delimiters[0])};me.language=function(e,t){let r=ka(t).delimiters[0];me.test(e)&&(e=e.slice(r.length));let s=e.slice(0,e.search(/\r?\n/));return{raw:s,name:s?s.trim():""}};me.cache={};me.clearCache=function(){me.cache={}};Gd.exports=me});var lw={};Ma(lw,{activate:()=>ow,deactivate:()=>cw});module.exports=uf(lw);var nn=q(require("vscode"));var Ra=q(require("path")),J=q(require("vscode"));var jn=["inbox","plan","code","audit","completed"],rn=".kanban2code",Un="inbox",$e="projects";var sn="_agents",qn="_context",an="_providers";var Yd=q(Al()),Cn=q(require("path"));var es=q(wn()),zd=q(require("fs/promises")),Sn=q(require("path"));var Vd=(e,t)=>console.warn(e,t);function A_(e){let t=e.split(Sn.sep).filter(Boolean),n=t.lastIndexOf($e);if(n!==-1&&t.length>n+1){let r=t[n+1],s=t[t.length-1],i=t[n+2];return{project:r,phase:i&&i!==s?i:void 0}}return{project:void 0,phase:void 0}}function R_(e){let t=e.match(/^#\s+(.+)$/m);return t?t[1].trim():void 0}function P_(e,t,n={}){let r={},s=e;try{let p=(0,es.default)(e);r=p.data??{},s=p.content}catch(p){(n.warn??Vd)(`Invalid frontmatter in ${t}; using defaults.`,p)}let i=jn.includes(r.stage)?r.stage:"inbox",{project:a,phase:o}=A_(t),c=Array.isArray(r.contexts)?r.contexts.map(String):[],l=Array.isArray(r.skills)?r.skills.map(String):[],u=[];for(let p of c)if(p.startsWith("_context/skills/")||p.startsWith("skills/")){let m=Sn.basename(p,".md");l.includes(m)||l.push(m)}else u.push(p);return c=u,{id:Sn.basename(t,".md"),filePath:t,title:R_(s)||Sn.basename(t,".md"),stage:i,project:a,phase:o,agent:typeof r.agent=="string"?r.agent:void 0,provider:typeof r.provider=="string"?r.provider:void 0,parent:typeof r.parent=="string"?r.parent:void 0,tags:Array.isArray(r.tags)?r.tags.map(String):[],contexts:c,skills:l,order:typeof r.order=="number"?r.order:void 0,created:typeof r.created=="string"?r.created:void 0,attempts:typeof r.attempts=="number"?r.attempts:void 0,content:s}}async function Kd(e,t={}){let n=await zd.readFile(e,"utf-8");return P_(n,e,t)}function ts(e,t,n={}){let r={};if(t)try{r=(0,es.default)(t).data??{}}catch(i){(n.warn??Vd)(`Invalid frontmatter while serializing ${e.filePath}; preserving known fields only.`,i)}let s={...r,stage:e.stage,agent:e.agent,provider:e.provider,parent:e.parent,tags:e.tags??[],contexts:e.contexts??[],skills:e.skills??[],order:e.order,created:e.created,attempts:e.attempts};return delete s.project,delete s.phase,Object.keys(s).forEach(i=>{s[i]===void 0&&delete s[i]}),es.default.stringify(e.content,s)}async function E_(e){let t=[Cn.join(e,Un,"*.md"),Cn.join(e,$e,"**","*.md"),Cn.join(e,"phase-*","*.md")],n=s=>s.split(Cn.sep).join("/");return await(0,Yd.default)(t.map(n),{ignore:["**/_context.md"],absolute:!0,cwd:e})}async function er(e){let t=await E_(e),n=[],r=[];return await Promise.all(t.map(async s=>{try{let i=await Kd(s);n.push(i)}catch(i){console.error(`Failed to load task: ${s}`,i),r.push(i)}})),O_(n)}function O_(e){return[...e].sort((t,n)=>{let r=t.order??1/0,s=n.order??1/0;return r!==s?r-s:t.id.localeCompare(n.id)})}async function ba(e,t){return(await er(e)).find(r=>r.id===t)}var he=q(require("fs/promises")),Te=q(require("path"));var Zd={"01-\u{1F5FA}\uFE0Froadmapper.md":`---
name: roadmapper
description: Idea exploration and vision document creation
type: robot
created: '2025-12-17'
---

# Roadmapper Agent

## Purpose

Turn raw ideas into a structured roadmap document that captures the what and why.

## Rules

- No architecture, phases, or tasks (Architect handles that)
- No implementation code
- No tech decisions without user input
- Ask clarifying questions only when needed

## Input

User idea or a task file with an idea to explore.

## Output

Save a roadmap to \`.kanban2code/projects/<project-name>/<roadmap-name>.md\`:

\`\`\`markdown
# [Vision Title]

## Overview

[2-3 paragraph summary]

## Problem Statement

[What problem this solves and why]

## Goals

- [Goal]

## Non-Goals (Out of Scope)

- [Not included]

## User Stories

- As a [user], I want [feature] so that [benefit]

## Success Criteria

- [Measurable outcome]

## Open Questions

- [Unresolved decision]

## Notes

[Constraints or context]
\`\`\`

## Workflow

1. Clarify the idea with minimal questions
2. Expand the vision and edge cases
3. Write the roadmap using the template
4. Review with the user
5. Create an Architect task and mark your task complete

## Handoff Protocol

When roadmap is complete and approved:

1. **Update your task file** to mark complete:

\`\`\`yaml
---
stage: completed
agent: roadmapper
---
\`\`\`

2. **Create an Architect task** in \`.kanban2code/projects/<project-name>/\`:

\`\`\`yaml
---
stage: inbox
tags: [architecture, p0, missing-architecture, missing-decomposition]
agent: architect
contexts: []
parent: <your-task-id>
---

# Architecture: [Vision Title]

## Goal
Add technical design, phases, and tasks to the roadmap.

## Input
Roadmap: \`.kanban2code/projects/<project-name>/<roadmap-name>.md\`
\`\`\`

## CRITICAL: Stage Transition

**You MUST update your task file frontmatter when done:**

\`\`\`yaml
---
stage: completed
agent: roadmapper
---
\`\`\`

Do not just mention completion - actually edit the frontmatter!
`,"02-\u{1F3DB}\uFE0Farchitect.md":`---
name: architect
description: Technical design, phases, tasks, and context
type: robot
created: '2025-12-17'
---

# Architect Agent

## Purpose

Transform roadmap visions into actionable implementation plans. Edit the existing roadmap to add architecture, phases, tasks, tests, files to touch, and context.

## Rules

- Edit the existing roadmap only; do not create new files
- Append the required sections in the exact order shown
- Use concise, unambiguous wording
- Keep names consistent across phases, tasks, and files
- Review available skills in \`_context/skills/\` and specify relevant ones for each task

## Do Not

- Generate individual task files (Splitter does this)
- Write implementation code
- Make major technology decisions without user input

## Input

Roadmap document from Roadmapper (vision, goals, stories, success criteria).

## Output

You **edit the same roadmap file** to append technical architecture sections:

\`\`\`markdown
---
## Technical Architecture

### Overview
[High-level technical approach]

### Components
- [Component 1]: [Purpose]
- [Component 2]: [Purpose]

### Data Flow
[How data moves through the system]

### Dependencies
- [External dependency]: [Why needed]

### Constraints
- [Technical constraint]: [Reason]

---

## Phases

### Phase 1: [Name]

[Description of this phase]

#### Task 1.1: [Task Name]

**Definition of Done:**

- [ ] [Checkpoint 1]
- [ ] [Checkpoint 2]

**Files:**

- \`path/to/file.ts\` - [create/modify] - [reason]

**Tests:**

- [ ] [Test case 1]
- [ ] [Test case 2]

**Skills:**

- \`skills/[skill-name]\` - [reason why this skill is needed]

#### Task 1.2: [Task Name]

...

### Phase 2: [Name]

...

---

## Context

### Relevant Patterns

[Existing patterns in codebase to follow]

### Related Files

- \`path/to/related.ts\` - [why relevant]

### Gotchas

- [Potential pitfall]: [How to avoid]
\`\`\`

## Skills System

### What are skills?

Skills are reusable context files in \`_context/skills/\` that provide framework-specific conventions, patterns, and best practices. They ensure consistent code generation across tasks.

### Available skills

Before architecting, check \`_context/skills/\` for relevant skills:

- **Framework skills**: \`react-core-skills.md\`, \`nextjs-core-skills.md\`, \`python-core-skills.md\`
- **Specialized skills**: \`skill-caching-data-fetching.md\`, \`skill-metadata-seo.md\`, \`skill-routing-layouts.md\`, \`skill-server-actions-mutations.md\`, \`skill-typescript-config.md\`

### When to specify skills

For each task in your phase breakdown, specify relevant skills:

- Task involves React/Next.js/Python \u2192 specify framework skill
- Task involves specific patterns (routing, caching, etc.) \u2192 specify specialized skill
- Multiple skills may apply \u2192 specify all relevant ones

### How to specify skills

Add a **Skills:** section to each task showing which skills the Splitter should add:

\`\`\`markdown
**Skills:**

- \`skills/react-core-skills\` - Task involves React components
- \`skills/skill-routing-layouts\` - Task modifies routing structure
\`\`\`

## Workflow

1. Read the roadmap
2. Check \`_context/skills/\` to understand available skills
3. Explore the codebase for patterns and constraints
4. Define architecture (overview, components, data flow, dependencies, constraints)
5. Plan phases and tasks with definition of done, files, tests, and skills
6. Add context (patterns, related files, gotchas)
7. Review with user, then hand off to Splitter

## Task Quality

- Atomic, testable, actionable
- Avoid vague tasks ("Implement the feature", "Fix bug", "Update files")
- List unit/integration/e2e tests as applicable

## Handoff Protocol

When architecture is complete and approved:

1. **Update the roadmap file** with all architecture sections

2. **Remove \`missing-architecture\` tag** from your own task

3. **Create a Splitter task** in the same project folder:

   \`\`\`yaml
   ---
   stage: inbox
   tags: [decomposition, missing-decomposition]
   agent: splitter
   contexts: []
   parent: <your-task-id>
   ---

   # Split: [Vision Title]

   ## Goal
   Generate individual task files from the roadmap.

   ## Input
   Roadmap: \`.kanban2code/projects/<project-name>/<roadmap-name>.md\`
   \`\`\`

4. **Mark your task complete** (move to audit \u2192 completed)

## Quality Checklist

- [ ] Architecture is sound and explained
- [ ] Every task has definition of done, files, and tests
- [ ] Context includes patterns, related files, and gotchas
- [ ] User approved the architecture
- [ ] \`missing-architecture\` tag removed from your task

## CRITICAL: Stage Transition

**You MUST update your task file frontmatter when done:**

\`\`\`yaml
---
stage: completed
agent: architect
---
\`\`\`

Do not just mention completion - actually edit the frontmatter!
`,"03-\u2702\uFE0Fsplitter.md":`---
name: splitter
description: Generates individual task files from roadmaps
type: robot
created: '2025-12-17'
---

# Splitter Agent

## Purpose

Generate task files from an architected roadmap.

## Rules

- Read the roadmap only; do not modify it
- Generate one file per task; do not add or remove tasks
- Preserve definition of done items exactly
- Use naming conventions, tags, and agent heuristics
- Extract skills from each task's **Skills:** section and add to \`contexts:\` array

## Input

Roadmap with phases, tasks, files, tests, and context.

## Output

Create folders and task files:

Folder:

\`\`\`
.kanban2code/projects/<project-name>/phase{number}-{kebab-case-name}/
\`\`\`

Task file name:

\`\`\`
task{phase}.{number}-{kebab-case-name}.md
\`\`\`

Task file format:

\`\`\`markdown
---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skills/react-core-skills, skills/skill-routing-layouts]
---

# [Task Title]

## Goal

[From roadmap]

## Definition of Done

- [ ] [Checkpoint]

## Files

- \`path/to/file.ts\` - [create/modify] - [reason]

## Tests

- [ ] [Test case]

## Context

[From roadmap]
\`\`\`

**Important:** The \`contexts:\` array should include skills specified in the roadmap's **Skills:** section for each task. If the roadmap shows:

\`\`\`markdown
**Skills:**

- \`skills/react-core-skills\` - Task involves React components
\`\`\`

Then add \`skills/react-core-skills\` to the \`contexts:\` array in the task frontmatter.

## Heuristics

Tags:

- Remove/Delete -> [refactor, p0] or [chore, p0]
- Create/Add/Implement -> [feature, p1]
- Update/Modify/Fix -> [refactor, p1]
- Test/Verify -> [test, p2]
- Document -> [docs, p2]
- Audit/Review -> [chore, p1]

Agents:

- All tasks start with -> planner (stage: plan)
- Planning/design tasks -> planner
- Implementation/tests tasks -> planner (will move to coder)
- Docs tasks -> planner
- Review tasks -> planner (will move through pipeline)

Note: All generated tasks should have agent: planner and stage: plan. The planner will move them to coder when ready.

## Workflow

1. Read the entire roadmap
2. Create phase folders
3. Create task files for every task
4. Remove \`missing-decomposition\` tag, mark task complete, report summary

## CRITICAL: Stage Transition

**You MUST update your task file frontmatter when done:**

\`\`\`yaml
---
stage: completed
agent: splitter
---
\`\`\`

Do not just mention completion - actually edit the frontmatter!
`,"04-\u{1F4CB}planner.md":`---
name: planner
description: Refines prompts, distills context, and gathers implementation-ready snippets
type: robot
stage: plan
created: '2025-12-17'
---

# Planner Agent

## Purpose
Refine tasks into implementation-ready prompts and distill high-signal context so the coder can start immediately with minimal exploration.

## First contact
Say exactly: "I'm Planner Agent, I do not code, I only refine the prompt and gather context."

## Stage
Work on tasks in stage: \`plan\`. When done, move to stage: \`code\` and agent: \`coder\`.

## Rules
- Do not write implementation code
- Do not make architecture decisions
- Edit only the task file (append sections + required frontmatter updates)
- No "I will...", no narration, no tool talk
- Replace placeholders with real content (no bracketed text)
- Redact secrets
- If critical info is missing, add a Questions subsection under Refined Prompt and stop
- Review available skills in \`_context/skills/\` and add relevant ones to task metadata

## Input
Task file with goal, definition of done, files to modify, and tests to write.

## Output Contract
Append sections in this order:

## Refined Prompt
Objective: <one-line objective>

Implementation approach:
1. <step 1>
2. <step 2>

Key decisions:
- <decision>: <rationale>

Edge cases:
- <edge case>

Questions (only if blocked):
- <question>

## Context

### File Tree (scoped)
Extract only the relevant subtree from \`ARCHITECTURE.md\` for files in scope.
- Include parent directories for orientation
- Include sibling files only if imported/exported by scoped files
- Mark files as \`<- modify\`, \`<- create\`, or \`<- read-only reference\`
- Max 20 lines

### Architecture Excerpts
Extract only architecture sections needed for this task.
- Quote concise bullets/paragraphs with heading path reference
- Include only conventions the coder must follow
- Max 30 lines total

### Skill Excerpts
For each skill in the task \`contexts:\` array:
- Read the full skill file, extract only relevant sections
- Include source skill path and section headers
- Max 20 lines per skill excerpt
- If none apply, write: "No specific skill guidance needed beyond general conventions."

### Code Excerpts
For each file in task \`## Files\`, extract the minimum code needed to implement safely.
- Include \`path:line-line\` for each excerpt
- Include one line on why the excerpt matters
- Prioritize signatures, types, exports, and usage shapes (not full implementations)
- For files to modify: show current state that will change
- For consumer files: show import/usage contract that must remain compatible
- Max 15 lines per excerpt, max 5 excerpts total

### Dependency Graph
List files importing/from imported by modified files.
- Use search results, do not guess
- Limit to task domain (skip node_modules and unrelated features)
- Flag consumers not listed in task \`## Files\`

### Patterns to Follow
Brief notes on conventions found in the codebase that the coder should match.

### Test Patterns
Where to look and how tests are structured for similar features.

### Gotchas
- <pitfall>: <avoidance>

### Scope Boundaries
If this task is part of a phase with multiple tasks, explicitly state what this task should NOT touch.
- Read sibling tasks in the same phase to determine boundaries
- Omit this section if no sibling tasks exist

## Workflow
1. Read the task file completely
2. Read other task files in the same phase folder to understand scope boundaries
3. Check \`_context/skills/\` and identify relevant skills
4. Update task frontmatter to add skills to \`contexts:\` array
5. Read \`ARCHITECTURE.md\` and extract relevant file tree and architecture sections
6. Read each skill file in \`contexts:\` and extract relevant excerpts
7. Read the actual codebase files listed in \`## Files\` and extract code excerpts
8. Search for imports/consumers of modified files to build the dependency graph
9. Write the refined prompt with implementation approach, decisions, and edge cases
10. Write scope boundaries by cross-referencing other tasks in the phase
11. Append all sections and update stage to \`code\` and agent to \`coder\`

## Context tree
File Tree (scoped) \u2014 Max 20 lines

Extract relevant subtree from ARCHITECTURE.md. Mark files: \u2190 modify, \u2190 create, \u2190 read-only reference.

Example:


	components/
	\u251C\u2500\u2500 ui/                   # shadcn/ui components (use existing)
	\u2514\u2500\u2500 reviews/
	    \u251C\u2500\u2500 rating-input.tsx          # \u2190 modify
	    \u251C\u2500\u2500 review-wizard.tsx         # \u2190 read-only reference
	    \u2514\u2500\u2500 __tests__/
	        \u2514\u2500\u2500 rating-input.test.tsx # \u2190 create

Architecture Excerpts \u2014 Max 30 lines total

Quote only relevant sections with source path.

## CRITICAL: Stage Transition

**You MUST update the task file frontmatter when done:**
\`\`\`yaml
---
stage: code
agent: coder
---
\`\`\`

Do not just mention the stage change - actually edit the frontmatter to set \`stage: code\` and \`agent: coder\`!
`,"05-\u2699\uFE0Fcoder.md":`---
name: coder
description: General-purpose coding agent for implementation
type: robot
stage: code
created: '2025-12-17'
---

# Coder Agent

## Purpose
Implement tasks from refined prompts and context. Produce code, tests, and task updates.

## Stage
Work on tasks in stage: code. Move to stage: audit and agent: auditor when complete.

## Rules
- Follow the refined prompt and context
- Do not change architecture
- Write tests as specified
- Do not move to audit if build/tests fail

## Input
Task file containing goal, definition of done, refined prompt, context, files, and tests.

## Output
- Code changes and tests
- Task file updated:
  - stage: audit
  - definition of done items checked
  - Audit section listing touched files

## Workflow
1. Read the task completely
2. Implement changes using existing patterns
3. Write tests for required cases
4. Verify build/tests
5. Update the task file (stage to \`audit\`, agent to \`auditor\`)

## Quality Standards
- Follow project conventions
- Keep functions small and readable
- Use clear names; comment only when needed
- TypeScript: avoid \`any\`, handle errors
- React: hooks, accessibility, error/loading states
- Tests: behavior-focused, cover edge cases

## Task File Updates
- Change \`stage\` to \`audit\` and \`agent\` to \`auditor\`
- Check completed items in Definition of Done
- Add \`## Audit\` with one file path per line

## CRITICAL: Stage Transition

**You MUST update the task file frontmatter when done:**
\`\`\`yaml
---
stage: audit
agent: auditor
---
\`\`\`

Do not just mention the stage change - actually edit the frontmatter to set \`stage: audit\` and \`agent: auditor\`!

## Blockers
If context is missing or requirements are ambiguous, note assumptions or ask for clarification. Do not move to audit with failing tests or unmet requirements.
`,"06-\u2705auditor.md":`---
name: auditor
description: Code review and quality rating
type: robot
stage: audit
created: '2025-12-17'
---

# Auditor Agent

## Purpose
Review implementations and assign a quality rating (1-10). 8+ is accepted.

## Stage
Work on tasks in stage: audit.
- Rating 8-10 -> move to stage: completed (agent stays as auditor)
- Rating 1-7 -> move to stage: code and agent: coder with feedback

## Input
Task file in stage: audit with goal, definition of done, Audit file list, and implementation.

## Output
Append a Review section to the task file:

\`\`\`markdown
---

## Review

**Rating: X/10**

**Verdict: ACCEPTED** | **NEEDS WORK**

### Summary
[1-2 sentence summary]

### Findings

#### Blockers
- [ ] [Issue]: [Description] - \`file.ts:line\`

#### High Priority
- [ ] [Issue]: [Description] - \`file.ts:line\`

#### Medium Priority
- [ ] [Issue]: [Description] - \`file.ts:line\`

#### Low Priority / Nits
- [ ] [Issue]: [Description] - \`file.ts:line\`

### Test Assessment
- Coverage: [Adequate/Needs improvement]
- Missing tests: [List]

### What's Good
- [Positive observation]

### Recommendations
- [Optional suggestion]
\`\`\`

## Review Focus
- Correctness vs definition of done
- Code quality and maintainability
- Tests and coverage gaps
- Security and accessibility
- Performance concerns

## Workflow
1. Read task and definition of done
2. Review files in the Audit section
3. Assess tests
4. Write review
5. Update stage based on rating:
   - If rating >= 8: set stage to \`completed\` (keep agent as \`auditor\`)
   - If rating < 8: set stage to \`code\` and agent to \`coder\`
6. **If rating >= 8 (ACCEPTED)**: Update \`.kanban2code/_context/architecture.md\` to add any new files created during the task implementation

## Architecture Updates (On Acceptance)

When a task passes (rating 8+), you MUST update the architecture documentation:

1. Open \`.kanban2code/_context/architecture.md\`
2. Add new files from the Audit section to the appropriate location in the directory structure
3. Add brief descriptions for new services, components, or utilities
4. Update any relevant sections that describe functionality affected by the changes

This ensures the architecture documentation stays current with the codebase.

## CRITICAL: Stage Transition

**You MUST update the task file frontmatter when changing stages:**
\`\`\`yaml
---
stage: completed   # or 'code' if needs work
agent: auditor     # or 'coder' if needs work
---
\`\`\`

Do not just mention the stage change in your review - actually edit the frontmatter!
`,"07-\u{1F4AC}conversational.md":`---
name: conversational
description: Friendly colleague who brainstorms ideas and refines them into clear prompts
created: '2025-12-26'
---

# Conversational Agent

## Purpose
Talk through ideas like a colleague brainstorming together. Summarize what you heard, ask natural questions, and help refine the idea into a clear, actionable prompt.

## Core Behavior

**Listen and summarize first**
Start by reflecting what you understood in 1-2 sentences (not bulleted lists unless natural). This shows you're listening.

**Ask 1-2 questions naturally**
Don't force questions into a numbered list. Just ask what you need to know next, in the flow of conversation.

**Offer examples when paths aren't obvious**
If there are multiple ways to approach something, say so and offer to explain the options.

**Stay high-level until they go deeper**
Focus on: goals, audience, constraints, what "done" looks like. Don't dive into implementation unless they ask.

**Guide toward a refined prompt**
When you have enough clarity, naturally transition to proposing a refined prompt. Keep it conversational\u2014no formal approval gates unless it feels right in context.

## Hard Rules
- No code changes, no patches, no implementation unless explicitly told to implement
- Stay in planning/architecture mode
- Read referenced files first, then summarize context before proposing decisions
- Ask only high-leverage clarifying questions (max 3 at a time)
- Prefer concrete options + tradeoffs + a recommendation
- Do not drift into generic advice; anchor everything to this repo/workflow
- Keep responses structured and decision-oriented

## Response Format
1. What I heard
2. Current state (as-is)
3. Proposed direction (to-be)
4. Key decisions
5. Recommended next step (1-3 options)

## When to Produce a Refined Prompt

You're ready when you can describe:
- The goal in one sentence
- Who it's for or what it affects
- What "done" looks like
- Any key constraints

If something's missing, ask about it conversationally.

## Working with the Task File

When you're ready to update the task:
- Propose the refined prompt naturally (not in a rigid template)
- Ask if it captures what they want
- When they approve, add/update a \`## Refined Prompt\` section in the task file
- Don't change \`stage\` or \`agent\` unless they explicitly ask

## Project-Specific Lens
- Kanban2Code: staged workflow, filesystem tasks, orchestration pipeline
- We are redesigning automation, providers, and "modes" semantics
- Optimize for sequencing major changes safely before coding

## Anti-Patterns
- Forcing every response into "What I heard / Questions / Draft prompt" sections
- Using numbered question lists when one natural question works
- Over-formalizing the approval process
- Asking more than 3 questions at once
- Diving into technical details before understanding the high-level goal
`};var Xd={"codex-high.md":`---
cli: codex
subcommand: exec
model: gpt-5.3-codex
unattended_flags:
  - '--yolo'
output_flags:
  - '--json'
prompt_style: stdin
provider: openai
config_overrides:
  model_reasoning_effort: high
---

`,"codex-low.md":`---
cli: codex
subcommand: exec
model: gpt-5.3-codex
unattended_flags:
  - '--yolo'
output_flags:
  - '--json'
prompt_style: stdin
provider: openai
config_overrides:
  model_reasoning_effort: low
---

`,"codex-xhigh.md":`---
cli: codex
subcommand: exec
model: gpt-5.3-codex
unattended_flags:
  - '--yolo'
output_flags:
  - '--json'
prompt_style: stdin
provider: openai
config_overrides:
  model_reasoning_effort: xhigh
---

`,"codex.md":`---
cli: codex
subcommand: exec
model: gpt-5.3-codex
unattended_flags:
  - '--yolo'
output_flags:
  - '--json'
prompt_style: stdin
provider: openai
config_overrides:
  model_reasoning_effort: medium
---

`,"glm.md":`---
cli: kilo
subcommand: run
model: zai/glm-5
unattended_flags:
  - '--auto'
output_flags: []
prompt_style: positional
provider: zai
---
`,"haiku.md":`---
cli: claude
model: claude-haiku-4-5
unattended_flags:
  - '--dangerously-skip-permissions'
output_flags:
  - '--output-format'
  - json
prompt_style: flag
safety:
  max_turns: 20
  max_budget_usd: 2
provider: anthropic
---

`,"kimi.md":`---
cli: kimi
model: kimi-k2-thinking-turbo
unattended_flags:
  - '--print'
output_flags:
  - '--quiet'
prompt_style: flag
provider: moonshot
---

`,"minimax.md":`---
cli: minimax
model: kimi-k2-5
unattended_flags:
  - '--print'
output_flags:
  - '--quiet'
prompt_style: flag
provider: minimax
---
`,"opus.md":`---
cli: claude
model: claude-opus-4-6
unattended_flags:
  - '--dangerously-skip-permissions'
output_flags:
  - '--output-format'
  - json
prompt_style: flag
safety:
  max_turns: 20
  max_budget_usd: 5
provider: anthropic
---

`,"sonnet.md":`---
cli: claude
model: claude-sonnet-4-5
unattended_flags:
  - '--dangerously-skip-permissions'
output_flags:
  - '--output-format'
  - json
prompt_style: flag
safety:
  max_turns: 20
  max_budget_usd: 3
provider: anthropic
---

`};var Jd={"ai-guide.md":`---
name: Kanban2Code AI Guide
description: Operational guide for AI agents and providers in a Kanban2Code workspace.
scope: global
created: 2025-12-14
updated: 2026-02-12
---

# Kanban2Code AI Guide

This guide defines how to create, edit, and progress task files in Kanban2Code.

## 1) Core Concepts

- \`stage\`: where the task is in the lifecycle (\`inbox\`, \`plan\`, \`code\`, \`audit\`, \`completed\`)
- \`agent\`: behavioral role/instructions (\`planner\`, \`coder\`, \`auditor\`, etc.)
- \`provider\`: LLM provider runtime config (CLI + model + flags)

Rule of thumb:

- Agent controls **how** the assistant behaves.
- Provider controls **what runtime** executes the prompt.

## 2) Workspace Layout

Kanban2Code stores data under \`.kanban2code/\`:

- \`inbox/\` and \`projects/**\`: task files
- \`_agents/\`: agent behavioral instructions
- \`_providers/\`: provider CLI config files
- \`_context/\`: shared context docs
- \`_archive/\`: completed tasks
- \`config.json\`: config and \`providerDefaults\`

## 3) Task File Format

Task files are markdown with optional YAML frontmatter.

\`\`\`md
---
stage: plan
agent: planner
provider: sonnet
tags: [feature, p1]
contexts: [ai-guide]
attempts: 0
---

# Improve runner retry handling

## Goal

Make retry behavior clearer and safer.
\`\`\`

Fields commonly used:

- \`stage\`: \`inbox | plan | code | audit | completed\`
- \`agent\`: behavioral role (e.g. planner, coder, auditor)
- \`provider\`: runtime/LLM config identifier (optional)
- \`attempts\`: integer retry count for runner workflow
- \`tags\`, \`contexts\`, \`parent\`, \`order\`, \`created\`

## 4) Stage Progression

Default execution path:

- \`inbox -> plan -> code -> audit -> completed\`

Audit outcomes:

- accepted audit -> \`completed\`
- failed audit -> \`code\` with incremented \`attempts\`
- failed audit with \`attempts >= 2\` -> runner hard stop for human review

## 5) Context Assembly

Prompt context is assembled in layers:

1. global: \`.kanban2code/how-it-works.md\`, \`.kanban2code/architecture.md\`, \`.kanban2code/project-details.md\`
2. agent/provider instructions: from \`_agents/\` first
3. project context: \`.kanban2code/projects/<project>/_context.md\`
4. phase context: \`.kanban2code/projects/<project>/<phase>/_context.md\`
5. custom contexts: from \`contexts:\`

When runner mode is active, prompt context includes:

- \`<runner automated="true" />\`

## 6) Dual-Mode Behavior (Manual vs Automated)

Agent instructions must support two execution environments.

### Manual mode (default)

- Assistant can edit task frontmatter directly for stage handoff.
- Assistant can follow legacy manual workflow actions.

### Automated mode (runner flag present)

- Assistant must **not** edit frontmatter.
- Assistant must **not** commit.
- Assistant outputs structured markers only.
- Runner applies all transitions and commit operations.

## 7) Structured Output Markers

Use HTML comment markers so runner parser can detect outcomes.

- Stage transition:
  - \`<!-- STAGE_TRANSITION: code -->\`
  - \`<!-- STAGE_TRANSITION: audit -->\`
  - \`<!-- STAGE_TRANSITION: completed -->\`
- Changed files:
  - \`<!-- FILES_CHANGED: src/a.ts, src/b.ts -->\`
- Audit result:
  - \`<!-- AUDIT_RATING: 8 -->\`
  - \`<!-- AUDIT_VERDICT: ACCEPTED -->\`
  - \`<!-- AUDIT_VERDICT: NEEDS_WORK -->\`

## 8) Planner/Coder/Auditor Expectations

- Planner:
  - Produce implementation-ready plan and clear tests
  - When done, MUST change task stage to \`code\` and agent to \`coder\`
  - In manual mode: edit frontmatter directly
  - In automated mode: output \`<!-- STAGE_TRANSITION: code -->\`

- Coder:
  - Implement requested changes and tests
  - When done, MUST change task stage to \`audit\` and agent to \`auditor\`
  - In automated mode output both stage transition and files changed markers

- Auditor:
  - Prioritize correctness, regressions, and missing tests
  - Use \`.kanban2code/architecture.md\` (root-level) for architecture updates
  - When done with rating 8+: MUST change to \`completed\`
  - When done with rating <8: MUST change to \`code\` with agent \`coder\`
  - In automated mode output \`AUDIT_RATING\` + \`AUDIT_VERDICT\`
  - Retry-awareness in automated mode: be slightly more lenient on attempt 2+, while keeping standards

## 9) Practical Examples

Manual planner handoff (frontmatter edited directly):

\`\`\`md
---
stage: code
agent: coder
provider: opus
tags: [feature, p1]
---

# Add stage-aware provider picker

## Goal

Implement UI provider picker behavior for plan/code/audit tasks.
\`\`\`

Automated coder output snippet:

\`\`\`md
Implemented provider picker and tests.

<!-- STAGE_TRANSITION: audit -->
<!-- FILES_CHANGED: src/webview/ui/components/ProviderPicker.tsx, tests/webview/components/ProviderPicker.test.tsx -->
\`\`\`

Automated auditor output snippet:

\`\`\`md
No blocking issues found.

<!-- AUDIT_RATING: 9 -->
<!-- AUDIT_VERDICT: ACCEPTED -->
\`\`\`

## 10) Common Mistakes To Avoid

- Editing frontmatter in automated mode
- Omitting structured markers in automated mode
- Writing architecture notes to \`_context/architecture.md\` instead of \`.kanban2code/architecture.md\`
- Marking a task complete without confirming tests/build expectations
`,"architecture.md":'---\nname: Architecture\ndescription: Codebase and project description\nscope: global\ncreated: \'2025-12-17\'\nfile_references:\n  - docs/architecture.md\n---\n\n# Architecture Context\n\nThis context file links to the main architecture documentation. When the auditor accepts a task (rating 8+), they should update this file or the linked documentation to reflect any new files created.\n\nSee: [docs/architecture.md](docs/architecture.md) for the full architecture documentation including directory structure.\n\n## Accepted Task Updates\n\n- date: 2026-02-26\n  - task: `task7.1-terminal-executor`\n  - files-updated: none\n  - new-files-created:\n    - `src/services/terminal-executor.ts` - Service that resolves task/provider context, builds CLI command text, and executes it in a named VS Code terminal\n    - `tests/terminal-executor.test.ts` - Unit tests covering command formatting, terminal reuse, prompt-size warning, and user-facing error paths\n\n- date: 2026-02-26\n  - task: `task13.1-dogfooding-and-iteration`\n  - files-updated:\n    - `.kanban2code/projects/roadmap/task13.1-dogfooding-and-iteration.md` (captured dogfooding execution log, hardening checklist validation, and auditor review)\n  - new-files-created:\n    - `.kanban2code/projects/roadmap/task13.2-restore-validation-scripts.md` - Follow-up roadmap task to restore missing `test:e2e` and `typecheck` scripts\n    - `.kanban2code/projects/roadmap/task13.3-fix-webview-typecheck-regressions.md` - Follow-up roadmap task for webview TypeScript typing regressions\n    - `.kanban2code/projects/roadmap/task13.4-fix-build-node-builtin-bundling.md` - Follow-up roadmap task for build failures from Node built-ins in webview bundling\n\n- date: 2026-02-26\n  - task: `task11.1-minimax-adapter-provider-expansion`\n  - files-updated:\n    - `src/runner/adapter-factory.ts` (registered `minimax` adapter case)\n    - `src/orchestrator/openai-client.ts` (added configurable OpenAI-compatible base URL and provider label)\n    - `src/orchestrator/orchestrator.ts` (routes MiniMax providers to `https://api.minimax.chat` via OpenAI-compatible stream client)\n    - `src/assets/providers.ts` (regenerated bundled providers to include `minimax.md`)\n    - `tests/orchestrator.test.ts` (added coverage for MiniMax endpoint routing)\n  - new-files-created:\n    - `.kanban2code/_providers/minimax.md` - Provider configuration for MiniMax CLI using the Kimi K2 model profile\n    - `src/runner/adapters/minimax-adapter.ts` - MiniMax CLI adapter implementing flag-based prompt execution and response parsing\n    - `tests/minimax-adapter.test.ts` - Unit tests for MiniMax adapter command construction, parsing behavior, and factory resolution\n\n- date: 2026-02-26\n  - task: `task8.1-new-messaging-protocol`\n  - files-updated: none\n  - new-files-created:\n    - `src/webview/messaging.ts` - Defines V2 host/webview message contracts with strict Zod payload schemas, typed envelope helpers, and discriminated union validation\n    - `tests/webview/messaging.test.ts` - Verifies round-trip serialization/validation for all V2 message types plus invalid version/type/payload rejection and type inference checks\n\n- date: 2026-02-26\n  - task: `task6.1-task-file-generator`\n  - files-updated: none\n  - new-files-created:\n    - `src/types/task-proposal.ts` - Defines `TaskProposal` payload shape for orchestrator-generated task metadata\n    - `src/services/task-generator.ts` - Parses YAML/JSON task proposals and writes validated task markdown files into inbox/project paths\n    - `tests/task-generator.test.ts` - Verifies proposal parsing, file generation, and successful `parseTaskFile()` round-trip\n\n- date: 2026-02-26\n  - task: `task5.1-orchestrator-service`\n  - files-updated: none\n  - new-files-created:\n    - `src/orchestrator/orchestrator.ts` - Main stateless orchestrator service that resolves provider config, builds system prompt context, and streams model tokens\n    - `src/orchestrator/anthropic-client.ts` - Anthropic HTTP streaming client for `content_block_delta` SSE token extraction\n    - `src/orchestrator/openai-client.ts` - OpenAI HTTP streaming client for chat completion delta token extraction\n    - `src/orchestrator/system-prompt-builder.ts` - Workspace-aware system prompt builder with task/skill summaries and optional agent/custom prompt sections\n    - `src/types/orchestrator.ts` - Shared orchestrator call/message types for provider calls and context injection\n    - `tests/orchestrator.test.ts` - Unit tests covering system prompt content and Anthropic stream/error behavior\n\n- date: 2026-02-26\n  - task: `task4.1-skill-auto-selector`\n  - files-updated: none\n  - new-files-created:\n    - `src/services/skill-selector.ts` - Skill auto-selection service with framework detection, scoring, ordering, and content hydration\n    - `src/types/skill.ts` - Shared types for selected skills and skill index metadata\n    - `tests/skill-selector.test.ts` - Unit tests for framework detection, matching behavior, ordering, and hydration\n\n- date: 2026-02-26\n  - task: `task3.1-workspace-snapshot-service`\n  - files-updated: none\n  - new-files-created:\n    - `src/types/snapshot.ts` - Defines `WorkspaceSnapshot` types including stage-grouped tasks and metadata counts\n    - `src/services/workspace-snapshot.ts` - Builds aggregate workspace snapshot from config, tasks, agents, contexts, skills, and providers\n    - `tests/workspace-snapshot.test.ts` - Unit tests for populated workspace snapshot, empty workspace defaults, and invalid-root errors\n\n- date: 2026-02-26\n  - task: `task2.1-port-runner`\n  - files-updated: none\n  - new-files-created:\n    - `src/runner/cli-adapter.ts` - Base CLI adapter interface and shared response/command types\n    - `src/runner/adapter-factory.ts` - Adapter resolver by CLI executable\n    - `src/runner/adapters/claude-adapter.ts` - Claude CLI adapter with JSON parsing\n    - `src/runner/adapters/codex-adapter.ts` - Codex CLI adapter with JSONL stream parsing\n    - `src/runner/adapters/kimi-adapter.ts` - KIMI CLI adapter with plain-text parsing\n    - `src/runner/adapters/kilo-adapter.ts` - Kilo CLI adapter with JSONL stream parsing\n    - `src/runner/output-parser.ts` - Structured output marker extraction helpers\n    - `src/runner/runner-state.ts` - Runner runtime state event helpers\n    - `src/runner/runner-log.ts` - Markdown run report generation and persistence\n    - `src/runner/git-ops.ts` - Git cleanliness and auto-commit operations for runner flows\n    - `src/runner/runner-engine.ts` - Core stage pipeline execution engine\n    - `tests/runner-log.test.ts` - Unit coverage for runner log output/persistence\n    - `tests/runner-engine.test.ts` - Unit coverage for runner pipeline behavior\n    - `tests/e2e/setup.ts` - E2E workspace utilities for workflow tests\n    - `tests/e2e/core-workflows.test.ts` - E2E workflow coverage for core lifecycle behavior\n\n- date: 2026-02-26\n  - task: `task1.1-port-core-types-and-services`\n  - files-updated:\n    - `package.json` (added `fast-glob`, `gray-matter`, `zod`)\n  - new-files-created:\n    - `src/types/*.ts` (task, provider, config, errors, filters, context, copy)\n    - `src/core/*.ts` (constants, rules)\n    - `src/utils/text.ts`\n    - `src/workspace/*.ts` (state, validation)\n    - `src/services/scanner.ts` - Task file scanning and sorting\n    - `src/services/frontmatter.ts` - Frontmatter parsing/serialization\n    - `src/services/stage-manager.ts` - Task stage transitions\n    - `src/services/task-content.ts` - Task content reading/writing\n    - `src/services/task-watcher.ts` - File system watcher for tasks\n    - `src/services/projects.ts` - Project/phase management\n    - `src/services/archive.ts` - Archiving logic\n    - `src/services/delete-task.ts` - Task deletion\n    - `src/services/copy.ts` - Clipboard operations\n    - `src/services/fs-move.ts` - File system move helper\n    - `src/services/scaffolder.ts` - Workspace initialization\n    - `src/services/config.ts` - Configuration service\n    - `src/services/logging.ts` - Structured logging\n    - `src/services/error-recovery.ts` - Error handling\n    - `src/services/prompt-builder.ts` - Context assembly for prompts\n    - `src/services/context.ts` - Context file management\n    - `src/services/provider-service.ts` - Provider config management\n    - `src/assets/*.ts` (agents, providers, contexts, seed-content)\n    - `tests/setup.ts` - Global test setup\n    - `tests/vscode-stub.ts` - VS Code API stub\n    - `tests/*.test.ts` - Unit tests for all services\n\n- date: 2026-02-26\n  - task: `task0.1-clean-slate-bootstrap`\n  - files-updated:\n    - `build.ts` (simplified esbuild bootstrap for extension and webview bundles)\n    - `src/extension.ts` (minimal activation/deactivation with Output Channel logging)\n    - `vitest.config.ts` (baseline test config with VS Code alias and coverage defaults)\n    - `docs/architecture.md` (initialized architecture document with directory structure)\n  - new-files-created:\n    - `package.json` - Minimal VS Code extension manifest, activation events, and Bun scripts\n    - `tsconfig.json` - TypeScript compiler configuration for extension/webview sources\n    - `vitest.e2e.config.ts` - E2E test runner configuration baseline\n    - `.vscodeignore` - VSIX packaging exclusions\n    - `.prettierrc` - Project formatting rules\n    - `eslint.config.mjs` - Project linting configuration\n    - `src/webview/ui/main.tsx` - Minimal React entry that renders `Loading...`\n    - `src/webview/ui/vscodeApi.ts` - Singleton VS Code webview API accessor\n\n- date: 2026-02-11\n  - task: `task1.1-add-agent-and-attempts-fields-to-task-interface`\n  - files-updated:\n    - `src/types/task.ts` (`Task` now includes optional `agent?: string` and `attempts?: number`)\n    - `src/services/frontmatter.ts` (parse + stringify support for `agent` and `attempts`)\n  - new-files-created: none\n\n- date: 2026-02-11\n  - task: `task1.2-define-providerconfig-and-agentconfig-types-with-zod-schemas`\n  - files-updated: none\n  - new-files-created:\n    - `src/types/provider.ts` - Defines `ProviderConfig` interface and Zod schema for CLI configuration\n    - `src/types/agent.ts` - Defines `AgentConfig` interface and Zod schema for agent configuration\n    - `tests/provider-agent-schemas.test.ts` - Tests for the provider and agent schema validation\n\n- date: 2026-02-11\n  - task: `task1.3-add-agents-folder-and-logs-folder-constants`\n  - files-updated:\n    - `src/core/constants.ts` (added `AGENTS_FOLDER = \'_agents\'` and `LOGS_FOLDER = \'_logs\'`)\n  - new-files-created: none\n\n- date: 2026-02-11\n  - task: `task2.1-create-agentservice-crud-for-agents`\n  - files-updated:\n    - `docs/architecture.md` (added `agent-service.ts` to service list)\n  - new-files-created:\n    - `src/services/agent-service.ts` - Service for CRUD operations on agent files\n    - `tests/agent-service.test.ts` - Tests for agent files CRUD operations\n\n- date: 2026-02-11\n  - task: `task2.2-create-providerservice-crud-for-new-providers-cli-config-files`\n  - files-updated: none\n  - new-files-created:\n    - `src/services/provider-service.ts` - CRUD service for provider CLI configuration files in `_providers/`\n    - `tests/provider-service.test.ts` - Tests for provider CLI config CRUD operations\n\n- date: 2026-02-11\n  - task: `task2.3-update-frontmatter-parser-for-agent-and-attempts`\n  - files-updated:\n    - `src/services/frontmatter.ts` (parse/serialize `agent` and `attempts` fields)\n    - `src/services/task-content.ts` (`saveTaskWithMetadata` metadata interface now includes `agent`)\n    - `src/webview/KanbanPanel.ts` (threads `agent` through `FullTaskDataLoaded` and `SaveTaskWithMetadata`)\n    - `src/webview/SidebarProvider.ts` (threads `agent` through `FullTaskDataLoaded` and `SaveTaskWithMetadata`)\n    - `src/webview/ui/components/TaskEditorModal.tsx` (manages `agent` state, dirty checking, save)\n    - `tests/frontmatter.test.ts` (4 new tests for agent/attempts parsing, serialization, round-trip)\n  - new-files-created: none\n\n- date: 2026-02-11\n  - task: `task2.4-update-prompt-builder-for-agent-aware-context-loading`\n  - files-updated:\n    - `src/services/prompt-builder.ts` (added `loadAgentInstructions` with 3-step fallback chain, `buildRunnerPrompt` export, runner `<runner automated="true" />` injection)\n  - new-files-created: none\n  - tests-added:\n    - `tests/prompt-builder.test.ts` (5 new tests: agent loading, provider-to-agent fallback, provider fallback, runner prompt shape, runner automated flag)\n\n- date: 2026-02-11\n  - task: `task2.5-update-stage-manager-for-agent-aware-auto-assignment`\n  - files-updated:\n    - `src/services/stage-manager.ts` (added `AgentInfo`, `listAgentsWithStage`, `getDefaultAgentForStage`, `getDefaultProviderForAgent`, `shouldAutoUpdateAgent`; updated `updateTaskStage` to auto-set `agent` and `provider` from agent defaults with fallback to stage-based provider assignment)\n  - new-files-created: none\n  - tests-added:\n    - `tests/stage-manager.test.ts` (5 new tests: agent-for-stage lookup, provider-for-agent config lookup, auto-set agent+provider on code/audit stages, manual agent preservation)\n\n- date: 2026-02-11\n  - task: `task3.1-create-migration-service-providers-to-agents-new-providers`\n  - files-updated:\n    - `.kanban2code/.gitignore` (added `_logs/` entry)\n  - new-files-created:\n    - `src/services/migration.ts` - Atomic migration service for providers \u2192 agents transition\n    - `tests/migration.test.ts` - Tests for migration service functionality\n  - tests-added:\n    - 4 tests: migration success, idempotence, rollback, gitignore update\n\n- date: 2026-02-11\n  - task: `task3.2-update-build-script-to-bundle-agents`\n  - files-updated:\n    - `build.ts` (added `_agents/` directory reading to `generateBundledContent()`)\n  - new-files-created:\n    - `src/assets/agents.ts` - Auto-generated file containing bundled agent files\n\n- date: 2026-02-11\n  - task: `task3.3-update-scaffolder-for-agents-directory`\n  - files-updated:\n    - `src/services/scaffolder.ts` (added `_agents/` to scaffold and sync functions)\n    - `tests/scaffolder.test.ts` (added tests for agent scaffolding)\n  - new-files-created: none\n  - tests-added:\n    - 2 tests: scaffold creates agents, sync preserves existing agents\n\n- date: 2026-02-11\n  - task: `task3.4-register-migration-command-verify-file-watcher-coverage`\n  - files-updated:\n    - `src/commands/index.ts` (registered `kanban2code.migrateProvidersAgents` command with VS Code progress notification)\n    - `src/services/task-watcher.ts` (added `_agents/` and `_providers/` exclusion in `isTaskFile()`)\n    - `package.json` (added command declaration and activation event)\n  - new-files-created: none\n  - tests-added:\n    - 2 tests in `tests/task-watcher.test.ts`: `_agents/` and `_providers/` exclusion from task events\n\n- date: 2026-02-11\n  - task: `task4.0-deterministic-task-ordering-in-scanner`\n  - files-updated:\n    - `src/services/scanner.ts` (added `sortTasks` and `getOrderedTasksForStage` exports; `loadAllTasks` now returns sorted results)\n    - `tests/scanner.test.ts` (added 10 tests for deterministic ordering)\n  - new-files-created: none\n  - tests-added:\n    - 10 tests: order field sorting, undefined order handling, filename tiebreaker, stage filtering, immutability\n\n- date: 2026-02-11\n  - task: `task4.1-cli-adapter-interface-claude-adapter`\n  - files-updated: none\n  - new-files-created:\n    - `src/runner/cli-adapter.ts` - `CliAdapter` interface, `CliResponse`, `CliCommandResult`, `CliAdapterOptions` types\n    - `src/runner/adapters/claude-adapter.ts` - Claude CLI adapter implementation\n    - `tests/claude-adapter.test.ts` - Tests for Claude adapter\n\n- date: 2026-02-11\n  - task: `task4.2-codex-kimi-and-kilo-cli-adapters-adapter-factory`\n  - files-updated: none\n  - new-files-created:\n    - `src/runner/adapters/codex-adapter.ts` - Codex CLI adapter (stdin prompt, JSONL output)\n    - `src/runner/adapters/kimi-adapter.ts` - KIMI CLI adapter (-p flag, plain text output)\n    - `src/runner/adapters/kilo-adapter.ts` - Kilo CLI adapter (positional prompt, JSONL output)\n    - `src/runner/adapter-factory.ts` - Factory function `getAdapterForCli(cli) \u2192 CliAdapter`\n    - `tests/other-cli-adapters.test.ts` - Tests for Codex, KIMI, Kilo adapters and factory\n\n- date: 2026-02-11\n  - task: `task4.3-structured-output-parser`\n  - files-updated: none\n  - new-files-created:\n    - `src/runner/output-parser.ts` - Structured marker extraction for LLM output\n    - `tests/output-parser.test.ts` - Tests for output-parser\n  - tests-added:\n    - 8 tests: stage transitions, audit ratings, verdicts, file lists, and fallbacks\n\n- date: 2026-02-11\n  - task: `task4.5-git-operations-for-runner`\n  - files-updated: none\n  - new-files-created:\n    - `src/runner/git-ops.ts` - Git helper functions for runner (`isWorkingTreeClean`, `hasUncommittedChanges`, `commitRunnerChanges`)\n    - `tests/git-ops.test.ts` - Tests for git operations (3 tests)\n\n- date: 2026-02-11\n  - task: `task4.4-runner-execution-engine`\n  - files-updated: none\n  - new-files-created:\n    - `src/runner/runner-engine.ts` - Core runner execution engine with sequential pipeline logic\n    - `tests/runner-engine.test.ts` - Tests for RunnerEngine\n  - tests-added:\n    - 6 tests: pipeline execution, audit failure loops, CLI crash handling, dirty git check\n\n- date: 2026-02-11\n  - task: `task4.6-runner-log-report-generator`\n  - files-updated: none\n  - new-files-created:\n    - `src/runner/runner-log.ts` - `RunnerLog` class for generating markdown run reports\n    - `tests/runner-log.test.ts` - Tests for runner log generation and persistence\n  - tests-added:\n    - 4 tests: markdown headers, summary counts, per-task fields, zero-task handling\n\n- date: 2026-02-11\n  - task: `task4.7-register-runner-vs-code-commands`\n  - files-updated:\n    - `src/commands/index.ts` (registered runner commands)\n    - `src/extension.ts` (runner singleton lifecycle, progress API)\n    - `package.json` (added runner commands)\n  - new-files-created:\n    - `tests/runner-singleton.test.ts` - Tests for runner singleton and cancellation\n\n- date: 2026-02-11\n  - task: `task5.1-update-messaging-protocol-for-modes-and-runner`\n  - files-updated:\n    - `src/webview/messaging.ts` (added mode-management and runner-control message types; added `RunnerState` type/schema/parser)\n    - `tests/webview.test.ts` (added EnvelopeSchema coverage for new message types and RunnerState validation tests)\n  - new-files-created: none\n\n- date: 2026-02-11\n  - task: `task5.2-modepicker-component-update-agentpicker`\n  - files-updated:\n    - `src/webview/ui/components/AgentPicker.tsx` (Agent picker now targets LLM providers, updates label to "Agent (LLM Provider)", and keeps provider description hint behavior)\n    - `src/webview/ui/components/TaskEditorModal.tsx` (uses provider-based AgentPicker wiring)\n    - `src/webview/ui/components/TaskModal.tsx` (uses provider-based AgentPicker wiring)\n    - `tests/webview/components/AgentPicker.test.tsx` (covers provider rendering, label text, no-selection behavior, and canonical name resolution)\n  - new-files-created:\n    - `src/webview/ui/components/ModePicker.tsx` - Mode dropdown component with mode description hint and "Create new mode" action\n    - `tests/webview/components/ModePicker.test.tsx` - ModePicker component tests for rendering, selection, callbacks, and no-selection behavior\n\n- date: 2026-02-11\n  - task: `task5.3-runner-controls-on-column-headers`\n  - files-updated:\n    - `src/webview/ui/components/Column.tsx` (added runner control buttons: play, play-all, stop; visibility logic based on `isRunnerActive` and `stage`)\n    - `src/webview/ui/components/BoardHorizontal.tsx` (passed down runner control props to Column)\n    - `src/webview/ui/styles/main.css` (styles for runner controls and buttons)\n    - `tests/webview/column.test.tsx` (added 6 tests for runner control visibility, behavior, and callbacks)\n  - new-files-created: none\n\n- date: 2026-02-12\n  - task: `task5.4-update-taskcard-for-mode-runner-status`\n  - files-updated:\n    - `src/webview/ui/components/TaskCard.tsx` (footer now renders `mode | agent` when both exist, shows agent-only fallback, adds per-card run action and running-state indicator)\n    - `src/webview/ui/components/Icons.tsx` (added `PlayIcon` for card-level run action)\n    - `src/webview/ui/components/Column.tsx` (threads `runningTaskId` and `onRunTask` into TaskCard)\n    - `src/webview/ui/components/BoardHorizontal.tsx` (threads `runningTaskId` and `onRunTask` into Column)\n    - `src/webview/ui/styles/main.css` (added running card pulse border, spinner, and disabled action styling)\n    - `tests/webview/taskcard.test.tsx` (added tests for mode+agent footer display, run button stage visibility, and active runner indicator)\n  - new-files-created: none\n\n- date: 2026-02-12\n  - task: `task5.5-update-taskmodal-and-taskeditormodal-for-mode-field`\n  - files-updated:\n    - `src/webview/ui/components/TaskModal.tsx` (added ModePicker below AgentPicker, `mode` in form data and CreateTask payload)\n    - `src/webview/ui/components/TaskEditorModal.tsx` (added ModePicker to Assignment section, `mode` in metadata state, dirty checking, and SaveTaskWithMetadata payload)\n    - `src/webview/ui/components/Sidebar.tsx` (threads `modes` from `useTaskData` to `TaskModal`)\n    - `src/webview/ui/components/Board.tsx` (threads `modes` from `useTaskData` to `TaskModal`)\n    - `src/webview/ui/hooks/useTaskData.ts` (exposes `modes` in return value, handles `InitState` modes payload)\n    - `src/webview/SidebarProvider.ts` (loads modes via `listAvailableModes`, sends in `InitState` and `FullTaskDataLoaded`)\n    - `src/webview/KanbanPanel.ts` (loads modes via `listAvailableModes`, sends in `InitState` and `FullTaskDataLoaded`)\n    - `src/commands/index.ts` (writes `mode` to frontmatter in `newTask` command)\n    - `tests/webview/task-modal-create-project.test.tsx` (added tests for mode+agent picker rendering and CreateTask payload)\n    - `tests/webview/task-editor-modal.test.tsx` (added tests for mode+agent picker rendering, SaveTaskWithMetadata payload with mode, null mode backward compat)\n  - new-files-created: none\n\n- date: 2026-02-12\n  - task: `task5.6-wire-runner-messages-through-webview-hosts`\n  - files-updated:\n    - `src/webview/KanbanPanel.ts` (added `RunTask`, `RunColumn`, `StopRunner` message handlers; subscribes to `onRunnerStateChanged` and posts `RunnerStateChanged` to webview; includes runner state in `InitState`)\n    - `src/webview/SidebarProvider.ts` (added `RequestModes`, `CreateMode`, `RunTask`, `RunColumn`, `StopRunner` message handlers; subscribes to `onRunnerStateChanged` and posts `RunnerStateChanged` to webview; includes runner state in `InitState`)\n    - `src/webview/ui/hooks/useTaskData.ts` (exposes `modes`, `isRunnerActive`, `activeRunnerTaskId` in return value; handles `RunnerStateChanged` and `ModesLoaded` messages)\n  - new-files-created:\n    - `src/runner/runner-state.ts` - Simple event emitter module for runner state (get/set/subscribe)\n    - `tests/webview-host-runner.test.ts` - Tests for webview host runner message handling\n    - `tests/webview/useTaskData.runner.test.tsx` - Tests for useTaskData runner state tracking\n\n- date: 2026-02-12\n  - task: `task5.7-modemodal-component-create-edit-mode`\n  - files-updated:\n    - `src/webview/ui/components/index.ts` (added `ModeModal` barrel export)\n    - `src/webview/ui/styles/main.css` (added `.mode-modal` size class alongside `.agent-modal`)\n  - new-files-created:\n    - `src/webview/ui/components/ModeModal.tsx` - Modal for creating and editing mode files (glassmorphic pattern)\n    - `tests/webview/components/ModeModal.test.tsx` - Tests for ModeModal (field rendering, validation, edit mode pre-population)\n\n- date: 2026-02-12\n  - task: `task5.8-update-context-menu-for-mode-and-runner-actions`\n  - files-updated:\n    - `src/webview/ui/components/TaskContextMenu.tsx` (added "Run Task" action with runner-active/stage guard, "Change Mode" submenu, "Change Agent" submenu, and `updateTaskMetadata` helper for `SaveTaskWithMetadata`)\n    - `src/webview/ui/components/Sidebar.tsx` (passes `modes`, `agents`, `isRunnerActive` to TaskContextMenu)\n    - `src/webview/ui/components/Board.tsx` (passes `modes`, `agents`, `isRunnerActive` to TaskContextMenu)\n    - `tests/webview/components/TaskContextMenu.test.tsx` (4 tests: Run Task visibility, disabled state, mode submenu, agent submenu)\n  - new-files-created: none\n\n- date: 2026-02-12\n  - task: `task6.2-redesign-coder-mode-for-structured-output`\n  - files-updated:\n    - `.kanban2code/_modes/coder.md` (added dual-mode instructions: Mode Detection, Manual/Automated output and workflow sections; explicit no-commit rule in automated mode)\n  - new-files-created: none\n\n- date: 2026-02-12\n  - task: `refactor-mode-to-agent-and-agent-to-provider`\n  - description: Comprehensive refactoring to align terminology with industry standards.\n  - files-updated:\n    - `src/types/*.ts`, `src/services/*.ts`, `src/runner/*.ts`, `src/webview/*.tsx`, `tests/*.ts`\n    - `package.json`, `build.ts`, `scaffolder.ts`\n  - new-files-created:\n    - `.kanban2code/_providers/` (moved from defunct modes)\n    - `src/assets/providers.ts` (replaced `modes.ts`)\n  - status: completed\n\n- date: 2026-02-13\n  - task: `1770933535169-create-a-coming-soon-page`\n  - files-updated: none\n  - new-files-created:\n    - `docs/design/coming-soon.html` - Standalone modern glassmorphic landing page with hero, 6-feature teaser grid, preview placeholder, CTA, and footer\n\n- date: 2026-02-13\n  - task: `1771012835226-add-more-codex-providers`\n  - files-updated:\n    - `src/assets/providers.ts` (regenerated bundled providers now include codex reasoning-effort variants)\n    - `tests/provider-service.test.ts` (added coverage for parsing `config_overrides.model_reasoning_effort`)\n    - `tests/scaffolder.test.ts` (added assertions that new codex variant provider files scaffold correctly)\n  - new-files-created:\n    - `.kanban2code/_providers/codex-low.md` - Codex provider preset with `model_reasoning_effort: low`\n    - `.kanban2code/_providers/codex-high.md` - Codex provider preset with `model_reasoning_effort: high`\n    - `.kanban2code/_providers/codex-xhigh.md` - Codex provider preset with `model_reasoning_effort: xhigh`\n',"skills-index.json":`{
  "version": "1.0.0",
  "last_updated": "2026-02-19",
  "framework_detection": {
    "nextjs": {
      "files": ["next.config.js", "next.config.ts", "next.config.mjs"],
      "package_json_deps": ["next"],
      "keywords": ["next.js", "nextjs", "app router", "pages router"]
    },
    "react": {
      "files": ["*.tsx", "*.jsx"],
      "package_json_deps": ["react", "react-dom"],
      "keywords": ["react", "component", "hooks", "useState", "useEffect"]
    },
    "python": {
      "files": ["*.py", "pyproject.toml", "setup.py", "requirements.txt"],
      "keywords": ["python", "pandas", "numpy", "greykite", "sklearn", "fastapi", "flask", "django"]
    },
    "greykite": {
      "files": ["*.py", "pyproject.toml", "setup.py", "requirements.txt"],
      "keywords": ["greykite", "silverkite", "time series forecast", "anomaly detection", "changepoint detection", "linkedin forecasting"]
    }
  },
  "core_skills": [
    {
      "name": "Next.js 16 Core",
      "file": "_context/skills/nextjs-core-skills.md",
      "framework": "nextjs",
      "always_attach": true,
      "priority": 10,
      "description": "Mandatory baseline for Next.js 16. Covers async APIs (params, cookies, headers), proxy.ts migration, React 19 patterns (useActionState), and parallel route requirements."
    },
    {
      "name": "React + TypeScript Core",
      "file": "_context/skills/react-core-skills.md",
      "framework": "react",
      "always_attach": true,
      "priority": 9,
      "description": "React/TypeScript naming conventions and patterns. Enforces PascalCase components, camelCase variables, {Component}Props interfaces, and hook best practices."
    },
    {
      "name": "Python Core (PEP 8)",
      "file": "_context/skills/python-core-skills.md",
      "framework": "python",
      "always_attach": true,
      "priority": 9,
      "description": "Python naming conventions and best practices. Enforces PEP 8 snake_case, type hints, docstrings, and Pythonic patterns."
    }
  ],
  "conditional_skills": [
    {
      "name": "Caching & Data Fetching",
      "file": "_context/skills/skill-caching-data-fetching.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "cache",
          "caching",
          "fetch",
          "revalidate",
          "revalidateTag",
          "cacheTag",
          "cacheLife",
          "use cache",
          "unstable_cache",
          "ISR",
          "stale",
          "PPR",
          "partial prerendering"
        ],
        "files": [
          "**/use-cache.ts",
          "**/cache.ts",
          "**/data.ts",
          "**/lib/fetch*.ts"
        ],
        "task_patterns": [
          "performance",
          "slow page",
          "data not updating",
          "stale data",
          "caching strategy",
          "incremental static regeneration"
        ]
      },
      "description": "Deep dive into 'use cache' directive, cacheLife profiles (seconds/minutes/hours/days/weeks/max), cacheTag for invalidation, PPR patterns, and the 'uncached by default' paradigm shift."
    },
    {
      "name": "Server Actions & Mutations",
      "file": "_context/skills/skill-server-actions-mutations.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "server action",
          "use server",
          "useActionState",
          "useFormState",
          "useFormStatus",
          "form action",
          "FormData",
          "mutation",
          "submit",
          "zod",
          "validation",
          ".bind"
        ],
        "files": [
          "**/actions.ts",
          "**/actions/*.ts",
          "**/*-action.ts"
        ],
        "task_patterns": [
          "form submission",
          "create form",
          "update data",
          "delete record",
          "handle form",
          "validate input"
        ]
      },
      "description": "Security patterns (Zod validation mandatory), useActionState migration from useFormState, .bind() for secure argument passing, redirect() placement outside try/catch."
    },
    {
      "name": "Routing & Layouts",
      "file": "_context/skills/skill-routing-layouts.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "parallel route",
          "@modal",
          "@slot",
          "default.js",
          "default.tsx",
          "intercepting route",
          "(.)folder",
          "(..)folder",
          "layout.tsx",
          "loading.js",
          "error.js",
          "route group"
        ],
        "files": [
          "**/default.tsx",
          "**/default.js",
          "**/@*/page.tsx",
          "**/loading.tsx",
          "**/error.tsx"
        ],
        "task_patterns": [
          "modal",
          "sidebar",
          "navigation",
          "nested layout",
          "create page",
          "add route",
          "parallel slot"
        ]
      },
      "description": "Parallel routes (default.js requirement), intercepting routes syntax (.)/(..)/(...), async params in layouts, loading.js and error.js patterns."
    },
    {
      "name": "next-intl (App Router i18n)",
      "file": "_context/skills/skill-next-intl.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "next-intl",
          "i18n",
          "internationalization",
          "localization",
          "locale",
          "locales",
          "translations",
          "NextIntlClientProvider",
          "setRequestLocale",
          "defineRouting",
          "createNavigation",
          "getRequestConfig",
          "localePrefix"
        ],
        "files": [
          "**/i18n/routing.ts",
          "**/i18n/navigation.ts",
          "**/i18n/request.ts",
          "**/middleware.ts",
          "messages/*.json"
        ],
        "task_patterns": [
          "i18n setup",
          "localize routes",
          "localized navigation",
          "translate UI",
          "multi-language",
          "locale detection"
        ]
      },
      "description": "Next.js 16 App Router i18n with next-intl: async params, setRequestLocale, NextIntlClientProvider, defineRouting, middleware matcher, and navigation wrappers."
    },
    {
      "name": "Drizzle ORM (PostgreSQL)",
      "file": "_context/skills/skill-drizzle-orm.md",
      "framework": "node",
      "triggers": {
        "keywords": [
          "drizzle",
          "drizzle-orm",
          "drizzle-kit",
          "pgTable",
          "jsonb",
          "$type",
          "db:push",
          "db:generate",
          "db:migrate",
          "postgres",
          "postgresql",
          "migration"
        ],
        "files": [
          "**/drizzle.config.ts",
          "**/src/db/schema.ts",
          "**/src/db/client.ts",
          "drizzle/**/*.sql"
        ],
        "task_patterns": [
          "drizzle orm",
          "database schema",
          "postgres migrations",
          "jsonb handling",
          "connection pooling"
        ]
      },
      "description": "Drizzle ORM patterns for PostgreSQL: schema in TS, jsonb $type typing, pg Pool usage, indexes in pgTable callback, and dev/prod migration workflow."
    },
    {
      "name": "HTTP Security Headers (Next.js)",
      "file": "_context/skills/skill-http-security-headers.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "Content-Security-Policy",
          "CSP",
          "security headers",
          "headers()",
          "next.config",
          "X-Frame-Options",
          "X-Content-Type-Options",
          "Referrer-Policy",
          "Permissions-Policy",
          "clickjacking",
          "XSS",
          "nonce",
          "strict-dynamic"
        ],
        "files": [
          "**/next.config.ts",
          "**/next.config.js",
          "**/next.config.mjs",
          "**/proxy.ts",
          "**/middleware.ts"
        ],
        "task_patterns": [
          "security hardening",
          "post-incident",
          "add CSP",
          "configure headers",
          "prevent clickjacking",
          "tighten referrer policy"
        ]
      },
      "description": "Next.js HTTP response header hardening: baseline headers, CSP (static vs nonce), Report-Only rollout, and next.config headers() patterns."
    },
    {
      "name": "Tailwind CSS v4 (CSS-first)",
      "file": "_context/skills/skill-tailwindcss-v4.md",
      "framework": "react",
      "triggers": {
        "keywords": [
          "tailwind v4",
          "tailwindcss v4",
          "tailwindcss",
          "@theme",
          "@source",
          "@config",
          "@tailwindcss/postcss",
          "postcss.config",
          "globals.css",
          "tw-animate-css",
          "tailwind.config.js",
          "@tailwind base",
          "@tailwind utilities"
        ],
        "files": [
          "**/postcss.config.*",
          "**/app/globals.css",
          "**/src/app/globals.css",
          "**/*.css"
        ],
        "task_patterns": [
          "tailwind setup",
          "tailwind migration",
          "css-first",
          "design tokens",
          "theme variables",
          "animate utilities"
        ]
      },
      "description": "Tailwind CSS v4 CSS-first setup: @import \\"tailwindcss\\", @theme tokens, @tailwindcss/postcss, @source scan paths, legacy @config, and tw-animate-css integration."
    },
    {
      "name": "Testing Stack (Vitest + Playwright)",
      "file": "_context/skills/skill-vitest-playwright-testing.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "vitest",
          "playwright",
          "jsdom",
          "@vitejs/plugin-react",
          "vitest.config",
          "playwright.config",
          "*.test.ts",
          "*.test.tsx",
          "tests/*.spec.ts",
          "coverage",
          "next/headers",
          "cookies()",
          "headers()",
          "supabase",
          "vi.mock"
        ],
        "files": [
          "**/vitest.config.ts",
          "**/vitest.setup.ts",
          "**/playwright.config.ts",
          "tests/**/*.spec.ts"
        ],
        "task_patterns": [
          "testing stack",
          "add tests",
          "unit tests",
          "e2e tests",
          "coverage",
          "mock next headers",
          "mock supabase"
        ]
      },
      "description": "Conventions for Vitest (unit/component) + Playwright (E2E): file patterns, config baselines, coverage requirements, and mocking Next.js request scope and Supabase."
    },
    {
      "name": "Supabase Auth SSR (@supabase/ssr)",
      "file": "_context/skills/skill-supabase-ssr.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "@supabase/ssr",
          "supabase ssr",
          "supabase auth",
          "createServerClient",
          "createBrowserClient",
          "proxy.ts",
          "cookies.setAll",
          "next/headers",
          "getUser",
          "getClaims",
          "getSession",
          "RLS",
          "auth.uid",
          "@supabase/auth-helpers-nextjs"
        ],
        "files": [
          "proxy.ts",
          "**/lib/supabase/client.ts",
          "**/lib/supabase/server.ts",
          "**/lib/supabase/proxy.ts"
        ],
        "task_patterns": [
          "supabase auth",
          "ssr auth",
          "session leakage",
          "cookie handling",
          "rls policies",
          "nextjs supabase"
        ]
      },
      "description": "Security-first Supabase Auth for Next.js App Router using @supabase/ssr: browser vs server clients, cookie plumbing, proxy.ts session refresh, and RLS coordination."
    },
    {
      "name": "PostHog Analytics (Next.js)",
      "file": "_context/skills/skill-posthog-analytics.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "posthog",
          "posthog-js",
          "posthog-node",
          "@posthog/react",
          "analytics",
          "$pageview",
          "$pageleave",
          "autocapture",
          "server-only",
          "client-only",
          "runtime",
          "nodejs"
        ],
        "files": [
          "**/app/providers.tsx",
          "**/lib/posthog-server.ts",
          "**/lib/analytics/client.ts",
          "**/lib/analytics/server.ts"
        ],
        "task_patterns": [
          "add analytics",
          "posthog integration",
          "pageview tracking",
          "custom events",
          "server tracking",
          "client tracking"
        ]
      },
      "description": "PostHog integration patterns for Next.js App Router: strict client/server separation, provider setup, Node server tracking with flush/shutdown, pageview strategy, and standard event properties."
    },
    {
      "name": "Metadata & SEO",
      "file": "_context/skills/skill-metadata-seo.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "metadata",
          "generateMetadata",
          "SEO",
          "openGraph",
          "og:image",
          "opengraph-image",
          "sitemap",
          "robots",
          "meta tags",
          "title",
          "description",
          "ImageResponse"
        ],
        "files": [
          "**/opengraph-image.tsx",
          "**/twitter-image.tsx",
          "**/sitemap.ts",
          "**/robots.ts",
          "**/icon.tsx"
        ],
        "task_patterns": [
          "SEO optimization",
          "social sharing",
          "meta tags",
          "sitemap generation",
          "open graph image",
          "twitter card"
        ]
      },
      "description": "Async generateMetadata signature change, ImageResponse with async params, sitemap.ts and robots.ts dynamic generation, image remotePatterns security."
    },
    {
      "name": "TypeScript & Config",
      "file": "_context/skills/skill-typescript-config.md",
      "framework": "nextjs",
      "triggers": {
        "keywords": [
          "next.config",
          "typescript",
          "type error",
          "Promise type",
          "tsconfig",
          "server-only",
          "experimental",
          "cacheComponents",
          "@types/react"
        ],
        "files": [
          "**/next.config.ts",
          "**/next.config.js",
          "**/tsconfig.json"
        ],
        "task_patterns": [
          "type error",
          "build error",
          "configuration",
          "setup project",
          "module resolution",
          "cannot be used as JSX"
        ]
      },
      "description": "next.config.ts (typed config), Promise prop type patterns, React 19 type compatibility, server-only module protection, module resolution settings."
    },
    {
      "name": "Greykite (Time Series Forecasting)",
      "file": "_context/skills/skill-greykite.md",
      "framework": "greykite",
      "triggers": {
        "keywords": [
          "greykite",
          "silverkite",
          "time series forecast",
          "anomaly detection",
          "changepoint detection",
          "linkedin forecasting",
          "forecast",
          "forecasting",
          "changepoint",
          "trend changepoint",
          "adaptive lasso"
        ],
        "files": [
          "**/forecast*.py",
          "**/anomaly*.py",
          "**/changepoint*.py",
          "**/greykite*.py"
        ],
        "task_patterns": [
          "time series forecast",
          "forecast model",
          "anomaly detection",
          "detect anomalies",
          "changepoint detection",
          "trend analysis",
          "business metric forecast",
          "monitoring alert"
        ]
      },
      "description": "Greykite time series forecasting and anomaly detection: Forecaster.run_forecast_config, ChangepointDetector, GreykiteDetector, model templates (AUTO/SILVERKITE/PROPHET/ARIMA), evaluation metrics, and visualization patterns."
    }
  ]
}
`,"skills/nextjs-core-skills.md":`---
skill_name: nextjs-core-skills
version: "16.0.10"
framework: Next.js
react_version: "19"
last_verified: "2025-12-18"
always_attach: true
priority: 10
triggers:
  - nextjs
  - next.js
  - app router
  - react 19
  - params
  - cookies
  - headers
  - middleware
  - proxy.ts
---

<!--
LLM INSTRUCTION: This is a CORE skill file for Next.js 16.0.10.
ALWAYS apply these rules when generating Next.js code.
Your training data likely contains v14/v15 patterns - OVERRIDE them with v16 patterns below.
Key breaking changes: async params, proxy.ts, useActionState, uncached-by-default.
When you see \u274C WRONG, that's what you might hallucinate. Use \u2705 CORRECT instead.
-->

# Next.js 16 Core Skills

> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18

## 1. What AI Models Get Wrong

- **Synchronous params access** \u2192 LLMs generate \`Page({ params }: { params: { slug: string } })\` because training data from v14 used sync access. In v16, params is a Promise.
- **Using \`middleware.ts\`** \u2192 LLMs create middleware.ts because it existed in v14/15. In v16, it's deprecated in favor of \`proxy.ts\`.
- **Assuming fetch is cached** \u2192 LLMs expect fetch to cache by default (v14 behavior). In v16, all fetches are uncached by default.
- **Using \`useFormState\`** \u2192 LLMs import from 'react-dom' using React 18 patterns. React 19 renames this to \`useActionState\`.
- **Omitting \`default.js\` in parallel routes** \u2192 LLMs forget this file, causing build failures in v16 which strictly requires it for all @slots.

## 2. Golden Rules

### \u2705 DO
- **Await all dynamic APIs** \u2192 \`params\`, \`searchParams\`, \`cookies()\`, \`headers()\` are Promises in v16
- **Use \`proxy.ts\` for request interception** \u2192 Replaces middleware.ts, runs on Node.js by default
- **Keep components Server by default** \u2192 Only add \`'use client'\` for interactivity (state, events, browser APIs)
- **Create \`default.js\` for every parallel route slot** \u2192 Required fallback for soft navigation
- **Use \`useActionState\` from 'react'** \u2192 React 19's replacement for useFormState

### \u274C DON'T  
- **Don't access params synchronously** \u2192 Causes runtime crash: "params is a Promise"
- **Don't use \`middleware.ts\`** \u2192 Deprecated, use proxy.ts instead
- **Don't use \`useFormState\` from 'react-dom'** \u2192 Renamed to useActionState in React 19
- **Don't assume fetch caches** \u2192 v16 is uncached by default, opt-in with \`'use cache'\`
- **Don't use \`getServerSideProps\`/\`getStaticProps\`** \u2192 Don't exist in App Router

## 3. Critical Patterns

### Async Params in Page Components

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// Sync access causes runtime crash in v16
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>{params.slug}</h1>; // Error: params is a Promise
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
// Await the Promise props
interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  return <h1>{params.slug}</h1>;
}
\`\`\`
**Why:** v16's Partial Prerendering requires async access to support streaming dynamic content.

---

### Async Cookies and Headers

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// Sync access returns Promise object, not data
import { cookies, headers } from 'next/headers';

export default function Page() {
  const cookieStore = cookies(); // Wrong: returns Promise
  const token = cookieStore.get('token'); // undefined
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
import { cookies, headers } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');
  
  const headerList = await headers();
  const userAgent = headerList.get('user-agent');
}
\`\`\`
**Why:** Request APIs are async to support Edge runtime and streaming.

---

### Proxy.ts Instead of Middleware

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// middleware.ts - DEPRECATED
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
// proxy.ts - at project root or src/
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  
  if (url.pathname === '/old') {
    url.pathname = '/new';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
\`\`\`
**Why:** Renamed for clarity\u2014it's a proxy/interception layer, not middleware chain. Runs on Node.js by default.

---

### React 19 Form Pattern

**\u274C WRONG (v14/React 18 - Hallucination Risk):**
\`\`\`typescript
'use client';
import { useFormState } from 'react-dom'; // Wrong import

export function Form() {
  const [state, action] = useFormState(submitAction, null);
}
\`\`\`

**\u2705 CORRECT (v16/React 19):**
\`\`\`typescript
'use client';
import { useActionState } from 'react'; // Correct import

export function Form() {
  const [state, formAction, isPending] = useActionState(submitAction, null);
  
  return (
    <form action={formAction}>
      <input name="email" />
      <button disabled={isPending}>Submit</button>
      {state?.error && <p>{state.error}</p>}
    </form>
  );
}
\`\`\`
**Why:** React 19 renamed useFormState to useActionState and added isPending.

---

### Parallel Routes Default.js

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`
app/
\u251C\u2500\u2500 @modal/
\u2502   \u2514\u2500\u2500 login/
\u2502       \u2514\u2500\u2500 page.tsx
\u2514\u2500\u2500 layout.tsx
// Missing default.tsx causes 404 on soft navigation!
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`
app/
\u251C\u2500\u2500 @modal/
\u2502   \u251C\u2500\u2500 default.tsx  \u2190 REQUIRED
\u2502   \u2514\u2500\u2500 login/
\u2502       \u2514\u2500\u2500 page.tsx
\u2514\u2500\u2500 layout.tsx
\`\`\`

\`\`\`typescript
// app/@modal/default.tsx
export default function Default() {
  return null; // Render nothing when no modal active
}
\`\`\`
**Why:** v16 strictly requires default.js as fallback when slot has no matching route during soft navigation.

## 4. Quick Reference Table

| Feature | \u274C Don't | \u2705 Do |
|---------|---------|------|
| Params | \`{ params: { id: string } }\` | \`{ params: Promise<{ id: string }> }\` |
| Cookies | \`const c = cookies()\` | \`const c = await cookies()\` |
| Headers | \`const h = headers()\` | \`const h = await headers()\` |
| Middleware | \`middleware.ts\` | \`proxy.ts\` |
| Form State | \`useFormState\` from 'react-dom' | \`useActionState\` from 'react' |
| Caching | Assume cached by default | Use \`'use cache'\` explicitly |
| Parallel Routes | Skip default.js | Create default.js for every @slot |
| Config | \`next.config.js\` | \`next.config.ts\` (typed) |

## 5. Checklist Before Coding

- [ ] Verify Next.js version is 16.x and React 19 in package.json
- [ ] All \`params\` and \`searchParams\` props typed as \`Promise<...>\` and awaited
- [ ] All \`cookies()\` and \`headers()\` calls have \`await\`
- [ ] Using \`proxy.ts\` not \`middleware.ts\` for request interception
- [ ] Every parallel route @slot has a \`default.tsx\` file
- [ ] Using \`useActionState\` not \`useFormState\` for forms
`,"skills/python-core-skills.md":`---
skill_name: python-core-skills
version: "3.12.0"
framework: Python
last_verified: "2025-12-18"
always_attach: true
priority: 9
triggers:
  - python
  - py
  - pyproject
  - fastapi
  - flask
  - django
  - pandas
  - numpy
  - sklearn
  - pytorch
  - tensorflow
---

<!--
LLM INSTRUCTION: This is a CORE skill file for Python projects.
ALWAYS apply these rules when generating Python code.
Your training data contains mixed conventions - ENFORCE PEP 8 naming below.
Key focus: Naming consistency, type hints, docstrings, Pythonic patterns.
When you see WRONG, that's inconsistent/bad practice. Use CORRECT instead.
-->

# Python Core Skills (PEP 8 + Modern Best Practices)

> **Target:** Python 3.10+ | **Last Verified:** 2025-12-18

## 1. What AI Models Get Wrong

- **Inconsistent naming** \u2192 LLMs switch between \`getUserData\`, \`get_user_data\`, \`GetUserData\` randomly. Python uses snake_case for functions/variables.
- **Missing type hints** \u2192 LLMs omit type annotations. Modern Python requires type hints for maintainability.
- **Missing docstrings** \u2192 LLMs skip documentation. All public functions need docstrings.
- **CamelCase variables** \u2192 LLMs use JavaScript-style \`userName\` instead of \`user_name\`.
- **Single-letter variables** \u2192 LLMs use \`x\`, \`d\`, \`l\` instead of descriptive names.
- **Bare except clauses** \u2192 LLMs write \`except:\` instead of specific exceptions.
- **Mutable default arguments** \u2192 LLMs use \`def func(items=[])\` causing bugs.

## 2. Naming Convention Rules

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Modules | \`snake_case.py\` | \`task_manager.py\`, \`data_utils.py\` |
| Packages | \`snake_case/\` | \`data_processing/\`, \`ml_models/\` |
| Test files | \`test_*.py\` | \`test_task_manager.py\` |
| Config files | \`snake_case.py\` | \`config.py\`, \`settings.py\` |

### Code Naming

| Type | Convention | Example |
|------|-----------|---------|
| Classes | \`PascalCase\` | \`TaskManager\`, \`DataProcessor\` |
| Functions | \`snake_case\` | \`get_user_data()\`, \`process_tasks()\` |
| Variables | \`snake_case\` | \`user_name\`, \`filtered_tasks\` |
| Constants | \`UPPER_SNAKE_CASE\` | \`MAX_RETRIES\`, \`API_URL\` |
| Private | \`_leading_underscore\` | \`_internal_cache\`, \`_helper_func()\` |
| Protected | \`_single_underscore\` | \`_protected_method()\` |
| Name mangling | \`__double_underscore\` | \`__private_attr\` (rare) |
| Type variables | \`PascalCase\` | \`T\`, \`ItemType\`, \`KeyType\` |

## 3. Golden Rules

### DO
- **Modules: snake_case.py** \u2192 \`task_manager.py\`, \`data_utils.py\`
- **Classes: PascalCase** \u2192 \`TaskManager\`, \`DataProcessor\`
- **Functions/variables: snake_case** \u2192 \`get_data()\`, \`user_name\`
- **Constants: UPPER_SNAKE_CASE** \u2192 \`MAX_RETRIES\`, \`DEFAULT_TIMEOUT\`
- **Private: _leading_underscore** \u2192 \`_internal_func()\`, \`_cache\`
- **Type hints on all functions** \u2192 \`def get_user(id: str) -> User:\`
- **Docstrings on all public functions** \u2192 Google or NumPy style
- **Specific exception handling** \u2192 \`except ValueError as e:\`
- **Use \`None\` as default, not mutable** \u2192 \`def func(items: list | None = None):\`

### DON'T
- **Don't use camelCase** \u2192 No \`getUserData\`, use \`get_user_data\`
- **Don't use PascalCase for functions** \u2192 No \`GetUser()\`, use \`get_user()\`
- **Don't skip type hints** \u2192 Always annotate parameters and returns
- **Don't use single letters** \u2192 No \`d = {}\`, use \`data = {}\`
- **Don't use bare except** \u2192 No \`except:\`, specify the exception
- **Don't use mutable defaults** \u2192 No \`def func(items=[]):\`

## 4. Critical Patterns

### Function and Variable Naming

**WRONG (JavaScript-style):**
\`\`\`python
def getUserData(userId):  # camelCase (wrong)
    userName = "John"     # camelCase (wrong)
    return userName

MaxRetries = 3  # PascalCase for constant (wrong)
\`\`\`

**CORRECT (PEP 8):**
\`\`\`python
def get_user_data(user_id: str) -> str:  # snake_case + types
    user_name = "John"                    # snake_case
    return user_name

MAX_RETRIES = 3  # UPPER_SNAKE_CASE for constants
\`\`\`

---

### Class Naming

**WRONG:**
\`\`\`python
class task_manager:  # snake_case (wrong)
    pass

class taskManager:   # camelCase (wrong)
    pass
\`\`\`

**CORRECT:**
\`\`\`python
class TaskManager:  # PascalCase
    """Manages task operations."""

    def __init__(self, config: Config) -> None:
        self._config = config  # Private attribute
        self.tasks: list[Task] = []
\`\`\`

---

### Type Hints (Required)

**WRONG (No types):**
\`\`\`python
def process_data(items, threshold):
    results = []
    for item in items:
        if item.value > threshold:
            results.append(item)
    return results
\`\`\`

**CORRECT (Full types):**
\`\`\`python
from typing import Sequence

def process_data(
    items: Sequence[DataItem],
    threshold: float
) -> list[DataItem]:
    """Process items above threshold.

    Args:
        items: Sequence of data items to process.
        threshold: Minimum value threshold.

    Returns:
        List of items above threshold.
    """
    results: list[DataItem] = []
    for item in items:
        if item.value > threshold:
            results.append(item)
    return results
\`\`\`

---

### Docstrings (Google Style)

**WRONG (No docstring):**
\`\`\`python
def calculate_forecast(data, horizon):
    model = GreyKiteModel()
    return model.predict(data, horizon)
\`\`\`

**CORRECT (Google style docstring):**
\`\`\`python
def calculate_forecast(
    data: pd.DataFrame,
    horizon: int
) -> pd.DataFrame:
    """Calculate time series forecast using GreyKite.

    Args:
        data: Historical time series data with 'ds' and 'y' columns.
        horizon: Number of periods to forecast.

    Returns:
        DataFrame with forecasted values and confidence intervals.

    Raises:
        ValueError: If data is missing required columns.

    Example:
        >>> df = pd.DataFrame({'ds': dates, 'y': values})
        >>> forecast = calculate_forecast(df, horizon=30)
    """
    model = GreyKiteModel()
    return model.predict(data, horizon)
\`\`\`

---

### Exception Handling

**WRONG (Bare except):**
\`\`\`python
try:
    result = process_data(items)
except:  # Catches everything including KeyboardInterrupt!
    result = None
\`\`\`

**CORRECT (Specific exceptions):**
\`\`\`python
try:
    result = process_data(items)
except ValueError as e:
    logger.error(f"Invalid data: {e}")
    result = None
except ConnectionError as e:
    logger.error(f"Connection failed: {e}")
    raise
\`\`\`

---

### Mutable Default Arguments

**WRONG (Mutable default):**
\`\`\`python
def add_item(item: str, items: list = []) -> list:  # BUG!
    items.append(item)
    return items

# Bug: items list persists between calls!
add_item("a")  # ['a']
add_item("b")  # ['a', 'b'] - unexpected!
\`\`\`

**CORRECT (None default):**
\`\`\`python
def add_item(item: str, items: list[str] | None = None) -> list[str]:
    if items is None:
        items = []
    items.append(item)
    return items

# Correct behavior
add_item("a")  # ['a']
add_item("b")  # ['b'] - fresh list each time
\`\`\`

---

### Private and Protected Members

**WRONG (No convention):**
\`\`\`python
class DataProcessor:
    def __init__(self):
        self.cache = {}        # Public? Private?
        self.helper_func()     # Internal? External?
\`\`\`

**CORRECT (Clear convention):**
\`\`\`python
class DataProcessor:
    """Process data with caching."""

    def __init__(self) -> None:
        self._cache: dict[str, Any] = {}  # Private (single underscore)
        self._initialize()

    def process(self, data: Data) -> Result:
        """Public API method."""
        return self._transform(data)

    def _transform(self, data: Data) -> Result:
        """Private helper method."""
        return Result(data)

    def _initialize(self) -> None:
        """Private initialization."""
        self._cache.clear()
\`\`\`

## 5. Module Structure Template

\`\`\`python
# File: task_processor.py
"""Task processing module.

This module provides utilities for processing and validating tasks.

Example:
    >>> processor = TaskProcessor(config)
    >>> result = processor.process(task)
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .config import Config

# Constants
MAX_RETRIES = 3
DEFAULT_TIMEOUT = 30.0

# Module logger
logger = logging.getLogger(__name__)


@dataclass
class ProcessResult:
    """Result of task processing.

    Attributes:
        success: Whether processing succeeded.
        data: Processed data if successful.
        error: Error message if failed.
    """

    success: bool
    data: dict | None = None
    error: str | None = None


class TaskProcessor:
    """Process tasks with retry logic.

    Args:
        config: Configuration object.
        max_retries: Maximum retry attempts.
    """

    def __init__(
        self,
        config: Config,
        max_retries: int = MAX_RETRIES
    ) -> None:
        self._config = config
        self._max_retries = max_retries
        self._cache: dict[str, ProcessResult] = {}

    def process(self, task: Task) -> ProcessResult:
        """Process a single task.

        Args:
            task: Task to process.

        Returns:
            ProcessResult with success status and data.

        Raises:
            ValueError: If task is invalid.
        """
        if not task.is_valid():
            raise ValueError(f"Invalid task: {task.id}")

        return self._execute_with_retry(task)

    def _execute_with_retry(self, task: Task) -> ProcessResult:
        """Execute task with retry logic."""
        for attempt in range(self._max_retries):
            try:
                result = self._execute(task)
                return ProcessResult(success=True, data=result)
            except ConnectionError as e:
                logger.warning(f"Attempt {attempt + 1} failed: {e}")

        return ProcessResult(success=False, error="Max retries exceeded")

    def _execute(self, task: Task) -> dict:
        """Execute task processing."""
        # Implementation
        return {"processed": True}
\`\`\`

## 6. Quick Reference Table

| Category | Convention | Examples |
|----------|-----------|----------|
| **Module files** | \`snake_case.py\` | \`task_manager.py\`, \`data_utils.py\` |
| **Package dirs** | \`snake_case/\` | \`data_processing/\`, \`ml_models/\` |
| **Classes** | \`PascalCase\` | \`TaskManager\`, \`DataProcessor\` |
| **Functions** | \`snake_case\` | \`get_user_data()\`, \`process_tasks()\` |
| **Variables** | \`snake_case\` | \`user_name\`, \`filtered_items\` |
| **Constants** | \`UPPER_SNAKE_CASE\` | \`MAX_RETRIES\`, \`API_URL\` |
| **Private** | \`_underscore\` | \`_cache\`, \`_helper()\` |
| **Type vars** | \`PascalCase\` | \`T\`, \`ItemType\`, \`KeyType\` |
| **Test files** | \`test_*.py\` | \`test_processor.py\` |

## 7. Checklist Before Coding

- [ ] Module files use snake_case.py
- [ ] Classes use PascalCase
- [ ] Functions and variables use snake_case
- [ ] Constants use UPPER_SNAKE_CASE
- [ ] Private members use _leading_underscore
- [ ] All functions have type hints (params + return)
- [ ] All public functions have docstrings (Google style)
- [ ] No mutable default arguments (use None)
- [ ] Specific exception handling (no bare except)
- [ ] Imports organized: stdlib, third-party, local

## 8. Common Mistakes

\`\`\`python
# WRONG: camelCase
def getUserData(userId):
    userName = data[userId]

# CORRECT: snake_case
def get_user_data(user_id: str) -> str:
    user_name = data[user_id]
\`\`\`

\`\`\`python
# WRONG: mutable default
def add(item, items=[]):
    items.append(item)

# CORRECT: None default
def add(item: str, items: list | None = None) -> list:
    if items is None:
        items = []
    items.append(item)
\`\`\`

\`\`\`python
# WRONG: bare except
try:
    result = fetch()
except:
    pass

# CORRECT: specific exception
try:
    result = fetch()
except ConnectionError as e:
    logger.error(e)
\`\`\`

\`\`\`python
# WRONG: no types
def process(data, threshold):
    return [x for x in data if x > threshold]

# CORRECT: full types
def process(data: list[float], threshold: float) -> list[float]:
    return [x for x in data if x > threshold]
\`\`\`

## 9. ML/Data Science Conventions

For GreyKite, pandas, sklearn projects:

\`\`\`python
# DataFrame variables: descriptive names
df_raw = pd.read_csv("data.csv")      # Not: df, d, data
df_cleaned = clean_data(df_raw)        # Not: df2, clean
df_features = extract_features(df_cleaned)

# Model variables
model_forecast = GreykiteModel()       # Not: m, model
model_classifier = RandomForestClassifier()

# Column names: snake_case strings
df.columns = ["user_id", "created_at", "value"]  # Not: userId, CreatedAt

# Function naming for ML
def train_model(df_train: pd.DataFrame) -> Model:
def evaluate_model(model: Model, df_test: pd.DataFrame) -> Metrics:
def generate_forecast(model: Model, horizon: int) -> pd.DataFrame:
\`\`\`
`,"skills/react-core-skills.md":`---
skill_name: react-core-skills
version: "19.0.0"
framework: React
typescript_version: "5.x"
last_verified: "2025-12-18"
always_attach: true
priority: 9
triggers:
  - react
  - tsx
  - jsx
  - component
  - hooks
  - usestate
  - useeffect
  - typescript
---

<!--
LLM INSTRUCTION: This is a CORE skill file for React + TypeScript projects.
ALWAYS apply these rules when generating React/TypeScript code.
Your training data contains mixed conventions - ENFORCE consistent naming below.
Key focus: Naming consistency, component patterns, TypeScript safety, hooks best practices.
When you see WRONG, that's inconsistent/bad practice. Use CORRECT instead.
-->

# React + TypeScript Core Skills

> **Target:** React 19+ | **TypeScript:** 5.x | **Last Verified:** 2025-12-18

## 1. What AI Models Get Wrong

- **Inconsistent file naming** \u2192 LLMs randomly switch between \`UserProfile.tsx\`, \`user-profile.tsx\`, \`user_profile.tsx\` in the same project. Pick ONE convention and stick to it.
- **Mixed variable naming** \u2192 LLMs use \`userName\`, \`user_name\`, \`UserName\` interchangeably. TypeScript/React uses camelCase for variables.
- **Prop interfaces without suffix** \u2192 LLMs create \`interface User\` when it should be \`UserProps\` to distinguish from data types.
- **Default exports without component name** \u2192 LLMs write \`export default function() {}\` losing type information.
- **Using \`any\` type** \u2192 LLMs default to \`any\` when types are unclear. Always use proper types or \`unknown\`.
- **Hooks outside components** \u2192 LLMs call hooks in helper functions or conditionally.
- **Missing key prop** \u2192 LLMs forget \`key\` in \`.map()\` causing React warnings.

## 2. Naming Convention Rules

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | \`PascalCase.tsx\` | \`TaskCard.tsx\`, \`UserProfile.tsx\` |
| Hooks | \`useCamelCase.ts\` | \`useTaskData.ts\`, \`useKeyboard.ts\` |
| Services/Utils | \`kebab-case.ts\` | \`task-service.ts\`, \`date-utils.ts\` |
| Types | \`kebab-case.ts\` or \`PascalCase.ts\` | \`task.ts\`, \`filters.ts\` |
| Constants | \`kebab-case.ts\` | \`constants.ts\`, \`api-endpoints.ts\` |

### Code Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | \`PascalCase\` | \`TaskCard\`, \`UserProfile\` |
| Props interfaces | \`{Component}Props\` | \`TaskCardProps\`, \`UserProfileProps\` |
| Hooks | \`useCamelCase\` | \`useTaskData()\`, \`useLocalStorage()\` |
| Variables | \`camelCase\` | \`filteredTasks\`, \`isLoading\` |
| Functions | \`camelCase\` | \`handleClick\`, \`formatDate\` |
| Constants | \`UPPER_SNAKE_CASE\` | \`MAX_ITEMS\`, \`API_URL\` |
| Types/Interfaces | \`PascalCase\` | \`Task\`, \`User\`, \`FilterState\` |
| Enums | \`PascalCase\` | \`Status\`, \`Priority\` |
| CSS classes | \`kebab-case\` | \`task-card\`, \`btn-primary\` |

## 3. Golden Rules

### DO
- **Component files: PascalCase.tsx** \u2192 \`TaskCard.tsx\`, \`UserProfile.tsx\`
- **Props interfaces: {Component}Props** \u2192 \`interface TaskCardProps\`
- **Hooks: use + PascalCase** \u2192 \`useTaskData\`, \`useKeyboard\`
- **Variables/functions: camelCase** \u2192 \`filteredTasks\`, \`handleClick\`
- **Constants: UPPER_SNAKE_CASE** \u2192 \`MAX_ITEMS\`, \`DEFAULT_TIMEOUT\`
- **CSS classes: kebab-case** \u2192 \`task-card\`, \`user-profile\`
- **One component per file** \u2192 File exports single component matching filename
- **Type all props and state** \u2192 No implicit \`any\`
- **Hooks at top level** \u2192 Never conditional, never in loops

### DON'T
- **Don't mix naming conventions** \u2192 No \`user-profile.tsx\` and \`UserSettings.tsx\` together
- **Don't use \`any\` type** \u2192 Use \`unknown\` or define proper types
- **Don't call hooks conditionally** \u2192 No \`if (x) { useState() }\`
- **Don't mutate state directly** \u2192 Use setState, never \`state.x = y\`
- **Don't use index as key** \u2192 Use \`key={item.id}\` not \`key={index}\`

## 4. Critical Patterns

### File and Component Naming

**WRONG (Inconsistent):**
\`\`\`typescript
// Mixed conventions in same project
user-profile.tsx          // kebab-case
TaskCard.tsx             // PascalCase
user_settings.tsx        // snake_case

export default function() { ... }  // Anonymous
\`\`\`

**CORRECT (Consistent):**
\`\`\`typescript
// All components: PascalCase.tsx
UserProfile.tsx
TaskCard.tsx
UserSettings.tsx

// File: UserProfile.tsx
interface UserProfileProps {
  userId: string;
  onUpdate: (user: User) => void;
}

export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  return <div>...</div>;
}
\`\`\`

---

### Variable and Function Naming

**WRONG (Inconsistent):**
\`\`\`typescript
const UserName = 'John';        // PascalCase (wrong)
const user_email = 'john@...';  // snake_case (wrong)
const HandleClick = () => {};   // PascalCase (wrong)
\`\`\`

**CORRECT (Consistent):**
\`\`\`typescript
const userName = 'John';           // camelCase
const userEmail = 'john@...';      // camelCase
const handleClick = () => {};      // camelCase

const MAX_RETRIES = 3;             // UPPER_SNAKE_CASE for constants
const DEFAULT_TIMEOUT = 5000;
\`\`\`

---

### Props Interface Naming

**WRONG (Ambiguous):**
\`\`\`typescript
interface Task {  // Is this data or props?
  onComplete: () => void;
}

function TaskCard(props: any) {  // No type safety
  return <div>{props.task.title}</div>;
}
\`\`\`

**CORRECT (Clear):**
\`\`\`typescript
// Data type
interface Task {
  id: string;
  title: string;
}

// Props type (suffix: Props)
interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
}

function TaskCard({ task, onComplete }: TaskCardProps) {
  return <div>{task.title}</div>;
}
\`\`\`

---

### Hook Naming and Usage

**WRONG:**
\`\`\`typescript
function taskData() {  // Missing 'use' prefix
  return useState([]);
}

function TaskList() {
  if (condition) {
    const [data] = useState([]);  // Conditional hook!
  }
}
\`\`\`

**CORRECT:**
\`\`\`typescript
export function useTaskData() {  // use + PascalCase
  const [data, setData] = useState<Task[]>([]);
  return { data, setData };
}

function TaskList() {
  const [data] = useState<Task[]>([]);  // Top level
  if (!data) return null;  // Conditional RENDER, not hook
  return <div>...</div>;
}
\`\`\`

---

### CSS Class Naming

**WRONG (Inconsistent):**
\`\`\`typescript
<div className="TaskCard">        // PascalCase
<div className="task_card">       // snake_case
<div className="taskcard">        // no separator
\`\`\`

**CORRECT (Consistent):**
\`\`\`typescript
<div className="task-card">           // kebab-case
  <h2 className="task-card-title">    // kebab-case
  <div className="task-card-actions"> // kebab-case
\`\`\`

## 5. Component Structure Template

\`\`\`typescript
// File: TaskCard.tsx
import { useState } from 'react';
import type { Task } from '@/types/task';
import './TaskCard.css';

// Constants
const MAX_TITLE_LENGTH = 100;

// Props interface
interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

// Component
export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  // Hooks at top
  const [isExpanded, setIsExpanded] = useState(false);

  // Handlers
  const handleEdit = () => onEdit?.(task);
  const handleDelete = () => onDelete?.(task.id);

  // Early returns
  if (!task) return null;

  // Render
  return (
    <div className="task-card">
      <h3 className="task-card-title">{task.title}</h3>
      <div className="task-card-actions">
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
\`\`\`

## 6. Quick Reference Table

| Category | Convention | Examples |
|----------|-----------|----------|
| **Component files** | \`PascalCase.tsx\` | \`TaskCard.tsx\`, \`UserProfile.tsx\` |
| **Component names** | \`PascalCase\` | \`TaskCard\`, \`UserProfile\` |
| **Props interfaces** | \`{Component}Props\` | \`TaskCardProps\`, \`UserProfileProps\` |
| **Hook files** | \`useCamelCase.ts\` | \`useTaskData.ts\`, \`useKeyboard.ts\` |
| **Hook functions** | \`useCamelCase\` | \`useTaskData()\`, \`useLocalStorage()\` |
| **Variables** | \`camelCase\` | \`filteredTasks\`, \`isLoading\` |
| **Functions** | \`camelCase\` | \`handleClick\`, \`formatDate\` |
| **Constants** | \`UPPER_SNAKE_CASE\` | \`MAX_ITEMS\`, \`API_URL\` |
| **Types/Interfaces** | \`PascalCase\` | \`Task\`, \`User\`, \`FilterState\` |
| **CSS classes** | \`kebab-case\` | \`task-card\`, \`btn-primary\` |
| **Service files** | \`kebab-case.ts\` | \`task-service.ts\`, \`date-utils.ts\` |

## 7. Checklist Before Coding

- [ ] Component files use PascalCase.tsx
- [ ] Component names match filename
- [ ] Props have {Component}Props interface
- [ ] Hooks use 'use' prefix, called at top level
- [ ] Variables use camelCase, constants use UPPER_SNAKE_CASE
- [ ] CSS classes use kebab-case
- [ ] No \`any\` types
- [ ] List items have unique \`key\` prop (not index)
- [ ] Event handlers are typed (React.MouseEvent, etc.)

## 8. Common Mistakes

\`\`\`typescript
// WRONG: index as key
{tasks.map((task, i) => <TaskCard key={i} />)}

// CORRECT: unique ID
{tasks.map((task) => <TaskCard key={task.id} />)}
\`\`\`

\`\`\`typescript
// WRONG: state mutation
items.push(newItem);

// CORRECT: immutable update
setItems([...items, newItem]);
\`\`\`

\`\`\`typescript
// WRONG: conditional hook
if (show) { const [x] = useState(); }

// CORRECT: conditional render
const [x] = useState();
if (!show) return null;
\`\`\`
`,"skills/skill-caching-data-fetching.md":`---
skill_name: skill-caching-data-fetching
version: "16.0.10"
framework: Next.js
last_verified: "2025-12-18"
always_attach: false
priority: 8
triggers:
  - cache
  - fetch
  - revalidate
  - cacheTag
  - cacheLife
  - use cache
  - unstable_cache
  - ISR
  - PPR
  - stale data
  - performance
---

<!--
LLM INSTRUCTION: Apply when user mentions caching, data fetching, or performance.
CRITICAL CHANGE: Next.js 16 is UNCACHED BY DEFAULT. fetch() does NOT cache.
Do NOT use: unstable_cache, revalidate: 60 in fetch options.
DO use: 'use cache' directive, cacheLife() profiles, cacheTag() for invalidation.
Your v14 training assumed fetch cached by default - that's WRONG for v16.
-->

# Caching & Data Fetching

> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18

## 1. What AI Models Get Wrong

- **Assuming fetch caches by default** \u2192 LLMs expect v14 behavior where fetch was cached. In v16, fetch is uncached by default.
- **Using \`unstable_cache\`** \u2192 LLMs suggest this deprecated API. In v16, use \`'use cache'\` directive instead.
- **Using \`revalidate: 60\` in fetch options** \u2192 LLMs still use this pattern. v16 prefers \`'use cache'\` with \`cacheLife\` profiles.
- **Expecting Route Handler GET to be static** \u2192 LLMs assume GET routes cache. In v16, they're dynamic by default.
- **Trying to cache in proxy.ts** \u2192 LLMs attempt fetch caching in proxy. This is explicitly not supported.

## 2. Golden Rules

### \u2705 DO
- **Use \`'use cache'\` directive** \u2192 Opt-in caching for functions or files
- **Use \`cacheLife\` profiles** \u2192 Semantic durations: \`seconds\`, \`minutes\`, \`hours\`, \`days\`, \`weeks\`, \`max\`
- **Use \`cacheTag\` for invalidation** \u2192 Tag cached data for targeted revalidation
- **Wrap dynamic content in \`<Suspense>\`** \u2192 Enables PPR static shell + streaming
- **Call \`revalidateTag\` after mutations** \u2192 Purge cache in Server Actions

### \u274C DON'T  
- **Don't assume fetch is cached** \u2192 v16 defaults to uncached
- **Don't use \`unstable_cache\`** \u2192 Deprecated, replaced by \`'use cache'\`
- **Don't cache in proxy.ts** \u2192 Explicitly unsupported, all fetches run every request
- **Don't use \`getStaticProps\` patterns** \u2192 Not available in App Router
- **Don't forget UI refresh after mutations** \u2192 Use \`router.refresh()\` or revalidation

## 3. Critical Patterns

### Use Cache Directive

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// Assuming fetch caches automatically
export async function getProduct(id: string) {
  const res = await fetch(\`https://api.example.com/products/\${id}\`); // Not cached in v16!
  return res.json();
}

// Or using deprecated unstable_cache
import { unstable_cache } from 'next/cache';
const getData = unstable_cache(async () => {
  return { ok: true };
}); // Deprecated
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
import { cacheLife } from 'next/cache';

export async function getProduct(id: string) {
  'use cache'; // Directive enables caching
  cacheLife('hours'); // Use semantic profile
  
  const res = await fetch(\`https://api.example.com/products/\${id}\`);
  return res.json();
}
\`\`\`
**Why:** v16 inverts caching\u2014uncached by default, explicit opt-in required.

---

### CacheLife Profiles

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// Using arbitrary seconds in fetch options
const res = await fetch(url, { 
  next: { revalidate: 3600 } // Old pattern
});
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
import { cacheLife } from 'next/cache';

export async function getMarketingData() {
  'use cache';
  cacheLife('hours'); // Built-in: seconds, minutes, hours, days, weeks, max
  
  return fetch('https://api.example.com/marketing').then(r => r.json());
}

// Custom profiles in next.config.ts
const nextConfig: NextConfig = {
  cacheLife: {
    'marketing-pages': {
      stale: 3600,      // Serve stale up to 1 hour
      revalidate: 900,  // Check for updates every 15 mins
      expire: 86400,    // Hard expire after 1 day
    },
  },
};
\`\`\`
**Why:** Semantic profiles are clearer and integrate with Next's SWR system.

---

### Tag-Based Invalidation

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// Not tagging data for invalidation
async function getPosts() {
  return fetch('https://api.example.com/posts'); // No way to selectively invalidate
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
import { cacheTag, revalidateTag } from 'next/cache';

// Tag the cached data
async function getPosts() {
  'use cache';
  cacheTag('posts'); // Tag for invalidation
  return db.posts.findMany();
}

// Invalidate in Server Action
'use server';
export async function createPost(data: FormData) {
  await db.posts.create({
    title: String(data.get('title') ?? ''),
    body: String(data.get('body') ?? ''),
  });
  revalidateTag('posts'); // Purge cache
}
\`\`\`
**Why:** Tags enable surgical cache invalidation without full revalidation.

---

### Partial Prerendering (PPR)

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// No Suspense boundary - entire page becomes dynamic
export default async function Page() {
  const user = await getCurrentUser(); // Dynamic - cookies
  const products = await getProducts(); // Could be static
  
  return (
    <div>
      <UserGreeting user={user} />
      <ProductList products={products} />
    </div>
  ); // Entire page is dynamic
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
import { Suspense } from 'react';

export default function Page() {
  return (
    <main>
      <h1>Static Title (Instant Load)</h1>
      <ProductList /> {/* Can be cached */}
      
      <Suspense fallback={<p>Loading user...</p>}>
        <UserProfile /> {/* Dynamic - streams in */}
      </Suspense>
    </main>
  );
}
\`\`\`
**Why:** PPR sends static shell immediately, streams dynamic "holes" via Suspense.

---

### Route Handler Caching

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// Assuming GET is cached/static
export async function GET() {
  const data = await db.query('SELECT * FROM items');
  return Response.json(data); // Dynamic in v16!
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
// Explicitly set caching behavior
export const dynamic = 'force-static'; // Or use 'use cache'

export async function GET() {
  'use cache';
  cacheLife('minutes');
  
  const data = await db.query('SELECT * FROM items');
  return Response.json(data);
}
\`\`\`
**Why:** GET routes are uncached by default in v16. Explicit opt-in required.

## 4. Quick Reference Table

| Feature | \u274C Don't | \u2705 Do |
|---------|---------|------|
| Cache Data | Assume cached | Use \`'use cache'\` directive |
| Revalidation | \`revalidate: 60\` in fetch | \`cacheLife('minutes')\` |
| Old Cache API | \`unstable_cache()\` | \`'use cache'\` directive |
| Invalidation | \`revalidatePath\` only | \`cacheTag()\` + \`revalidateTag()\` |
| GET Routes | Assume static | Set \`dynamic = 'force-static'\` |
| Dynamic Data | No Suspense | Wrap in \`<Suspense>\` for PPR |
| Proxy.ts | Attempt caching | Move caching logic to pages |

## 5. Checklist Before Coding

- [ ] Enable \`cacheComponents: true\` in next.config.ts (default in 16.0.10)
- [ ] Add \`'use cache'\` directive to functions that should be cached
- [ ] Use semantic \`cacheLife\` profiles instead of raw seconds
- [ ] Tag cached data with \`cacheTag()\` for selective invalidation
- [ ] Call \`revalidateTag()\` in Server Actions after mutations
- [ ] Wrap dynamic components in \`<Suspense>\` for PPR benefits
`,"skills/skill-dashboard-design.md":`---
skill_name: skill-dashboard-design
version: "1.0"
framework: UI/UX Design
last_verified: "2026-02-17"
always_attach: false
priority: 5
triggers:
  - dashboard design
  - dashboard ui
  - dashboard layout
  - design system
  - design cheatsheet
  - icon size
  - font weight
  - border radius
  - icon stroke
  - huge_icons
  - ui design
  - frontend design
---

<!--
LLM INSTRUCTION: Apply this skill when designing or reviewing dashboard UIs.
Enforce: 14px base font, 16px base icon, 1.2px stroke width, 2 font weights max (regular + medium),
8-12px border radius, and semantic color tokens from globals. Never use semibold except in rare
emphasis cases. Prefer filled+stroke icons from huge_icons. Color values must come from design tokens.
-->

# Dashboard Design Skill

> **Domain:** Frontend UI/UX | **Style:** Dashboard / Data interfaces | **Last Verified:** 2026-02-17

## 1. What AI Models Get Wrong

- **Using too many font weights** \u2014 more than 2 (regular + medium) creates visual noise.
- **Ignoring icon stroke consistency** \u2014 mixing stroke widths breaks visual rhythm.
- **Hardcoding colors** \u2014 all color values must come from design tokens (\`globals.css\` / CSS custom properties).
- **Overusing large border radii** \u2014 going beyond 12px makes dashboards feel like mobile apps, not tools.
- **Using semibold or bold freely** \u2014 semibold is reserved for rare, high-signal emphasis only.
- **Scaling icons arbitrarily** \u2014 base size is 16px; deviations must be intentional and consistent.

## 2. Golden Rules

### Typography

- **Base font size:** \`14px\` \u2014 all body text, labels, table cells, sidebar items.
- **Only 2 weights:**
  - \`regular\` (400) \u2014 body text, secondary labels, descriptions.
  - \`medium\` (500) \u2014 headings, section titles, emphasis, interactive labels.
  - \`semibold\` (600) \u2014 **very rare**; only for critical callouts or KPI values that must stand out.
- Do not use \`bold\` (700) or \`light\` (300) in dashboard contexts.

### Icons

- **Library:** \`huge_icons\` \u2014 filled + stroke style.
- **Base size:** \`16px\` \u2014 default for inline icons, sidebar nav, action buttons.
- **Stroke widths (use one per context, never mix within a component):**
  - \`1px\` \u2014 light, decorative, background icons.
  - \`1.2px\` \u2014 **default**; use for all standard UI icons.
  - \`1.5px\` \u2014 stronger emphasis; use for primary CTAs or active state icons.
- Filled variant: use for active/selected states.
- Stroke variant: use for default/inactive states.

### Colors

- **Always use design tokens** \u2014 never hardcode hex or rgb values.
- Source: \`globals.css\` (or equivalent CSS custom property file for the project).
- Semantic token pattern: \`--color-text-primary\`, \`--color-surface-muted\`, \`--color-border\`, etc.
- Limit to 3\u20135 active colors per view; use muted/subtle variants for non-critical elements.

### Border Radius

- **Range: \`8px\` to \`12px\`** \u2014 no exceptions without explicit design approval.
  - \`8px\` \u2014 compact elements: badges, tags, small inputs, table cells.
  - \`10px\` \u2014 standard cards, modals, dropdowns.
  - \`12px\` \u2014 featured cards, hero panels, primary containers.
- Do not use \`4px\` (too sharp) or \`16px+\` (too rounded for dashboards).

## 3. Component Patterns

### Stat / KPI Card

\`\`\`tsx
// Correct: medium weight for value, regular for label, 10px radius, 16px icon
<div className="rounded-[10px] p-4 bg-[var(--color-surface)]">
  <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-[14px] font-normal">
    <Icon name="chart-bar" size={16} strokeWidth={1.2} />
    <span>Total Revenue</span>
  </div>
  <p className="text-[24px] font-medium text-[var(--color-text-primary)] mt-1">$48,200</p>
</div>
\`\`\`

### Sidebar Nav Item

\`\`\`tsx
// Active: filled icon, medium text. Inactive: stroke icon, regular text.
<NavItem
  icon={isActive ? <FilledIcon size={16} /> : <StrokeIcon size={16} strokeWidth={1.2} />}
  label="Analytics"
  weight={isActive ? "medium" : "regular"}
/>
\`\`\`

### Data Table Cell

\`\`\`tsx
// 14px, regular weight, tokens for color
<td className="text-[14px] font-normal text-[var(--color-text-primary)] px-3 py-2">
  John Doe
</td>
\`\`\`

## 4. \u2705 DO / \u274C DON'T

### \u2705 DO
- Use \`14px\` for all body/label text.
- Use \`16px\` as the default icon size.
- Use \`1.2px\` stroke width unless intentionally signaling emphasis.
- Use \`regular\` + \`medium\` weights only (semibold max once per page).
- Pull all colors from CSS custom properties (\`var(--color-...)\`).
- Use \`8px\`\u2013\`12px\` radius range consistently per element type.
- Use \`huge_icons\` filled variant for active/selected states, stroke for default.

### \u274C DON'T
- Don't use \`bold\`, \`light\`, or \`thin\` font weights.
- Don't hardcode \`#hex\` or \`rgb()\` values; use tokens.
- Don't exceed \`12px\` border radius for dashboard components.
- Don't go below \`8px\` border radius unless for a chip/micro-badge.
- Don't mix stroke widths (\`1px\`, \`1.2px\`, \`1.5px\`) within the same component.
- Don't use icon sizes other than 16px without a deliberate layout reason.

## 5. Quick Reference Cheatsheet

| Token         | Value              | Notes                                 |
|---------------|--------------------|---------------------------------------|
| Font size     | \`14px\`             | Base for all dashboard text           |
| Font weights  | \`400\`, \`500\`       | Regular + medium; semibold = rare     |
| Icon library  | \`huge_icons\`       | Filled (active) + Stroke (default)    |
| Icon size     | \`16px\`             | Base; scale intentionally             |
| Stroke width  | \`1.2px\`            | Default; 1px light, 1.5px emphasis    |
| Border radius | \`8px\` \u2013 \`12px\`     | 8 compact / 10 standard / 12 featured |
| Colors        | CSS custom props   | Always via \`var(--color-...)\`         |

## 6. Checklist

- [ ] All text is \`14px\` base size.
- [ ] Only \`regular\` and \`medium\` weights used (semibold count = 0\u20131 per page).
- [ ] Icons are from \`huge_icons\`, sized at \`16px\`, \`1.2px\` stroke by default.
- [ ] Stroke variants used for inactive states, filled for active/selected.
- [ ] All colors reference CSS custom properties \u2014 no hardcoded values.
- [ ] Border radius stays within \`8px\`\u2013\`12px\`.
- [ ] No mixed stroke widths within a single component.
`,"skills/skill-drizzle-orm.md":`---
skill_name: skill-drizzle-orm
version: "1.x"
framework: Node.js
last_verified: "2025-12-26"
always_attach: false
priority: 6
triggers:
  - drizzle
  - drizzle-orm
  - drizzle-kit
  - pgTable
  - jsonb
  - $type
  - db:push
  - db:generate
  - db:migrate
  - migration
  - postgres
  - postgresql
---

<!--
LLM INSTRUCTION: Use for PostgreSQL + Drizzle ORM. Avoid Prisma/TypeORM patterns.
Schema lives in TypeScript with pgTable. Indexes defined in the pgTable callback.
Use jsonb.$type<T>() for compile-time typing only (no runtime validation).
Use pg Pool with a single shared connection pool.
Migrations: db:push for dev; db:generate + db:migrate for prod.
Advanced indexes (GIN/where/using) may require custom SQL migrations.
-->

# Drizzle ORM (PostgreSQL)

> **Target:** Drizzle ORM + PostgreSQL | **Last Verified:** 2025-12-26

## 1. What AI Models Get Wrong

- **Mixing ORMs** (Prisma schema, TypeORM decorators).
- **Missing pgTable callback** for indexes/constraints.
- **Assuming $type validates at runtime** (it does not).
- **Creating a Pool per request** instead of a shared Pool.
- **Using db:push in prod** instead of migrations.

## 2. Golden Rules

### \u2705 DO
- **Define schema in TS** with \`pgTable\` and column builders.
- **Use jsonb.$type<T>()** to lock TypeScript types (compile-time only).
- **Define indexes** in the \`pgTable(..., (t) => [ ... ])\` callback.
- **Use a shared \`pg.Pool\`** and pass it to \`drizzle({ client: pool })\`.
- **Dev:** \`db:push\`. **Prod:** \`db:generate\` + \`db:migrate\`.

### \u274C DON'T
- **Don't add Prisma/TypeORM files** (\`schema.prisma\`, \`@Entity()\`).
- **Don't expect $type to validate data** at runtime.
- **Don't rely on advanced index features** without verifying drizzle-kit output.

## 3. Minimal Setup (Files)

\`\`\`
src/db/client.ts
src/db/schema.ts
drizzle.config.ts
\`\`\`

## 4. Core Patterns

### Postgres client (\`src/db/client.ts\`)
\`\`\`ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000
});

export const db = drizzle({ client: pool, schema });
\`\`\`

### Schema + JSONB typing (\`src/db/schema.ts\`)
\`\`\`ts
import { pgTable, text, jsonb, uuid, index } from 'drizzle-orm/pg-core';

type UserSettings = {
  theme: 'light' | 'dark';
  marketingOptIn: boolean;
};

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull(),
    settings: jsonb('settings').$type<UserSettings>().notNull()
  },
  (t) => [index('users_email_idx').on(t.email)]
);
\`\`\`

### JSONB query with sql
\`\`\`ts
import { sql, eq } from 'drizzle-orm';
import { users } from './schema';

await db
  .select()
  .from(users)
  .where(eq(sql\`\${users.settings} ->> 'theme'\`, 'dark'));
\`\`\`

### Migration scripts
\`\`\`json
{
  "scripts": {
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  }
}
\`\`\`

## 5. Checklist

- [ ] Schema uses \`pgTable\` + TS columns.
- [ ] JSONB uses \`.$type<T>()\` for compile-time typing.
- [ ] Indexes defined in the \`pgTable\` callback.
- [ ] Shared \`pg.Pool\` passed to \`drizzle\`.
- [ ] Dev uses \`db:push\`; prod uses \`db:generate\` + \`db:migrate\`.
`,"skills/skill-frontend-design.md":`---
skill_name: skill-frontend-design
version: "1.0"
framework: Frontend UI/UX
last_verified: "2026-02-17"
always_attach: false
priority: 4
triggers:
  - frontend design
  - web design
  - ui design
  - landing page
  - component design
  - page design
  - beautiful ui
  - modern design
  - design skill
  - aesthetic
  - visual design
  - creative ui
  - polished ui
  - production-grade ui
  - distinctive design
---

<!--
LLM INSTRUCTION: Use this skill when the user asks to build web components, pages, artifacts,
posters, or applications with high design quality. This skill guides creation of distinctive,
production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real
working code with exceptional attention to aesthetic details and creative choices.
The user primarily works with Tailwind CSS + shadcn/ui but expects designs that transcend
typical component library defaults. Push beyond stock shadcn patterns into genuinely modern,
memorable interfaces.
-->

# Frontend Design Skill

> **Domain:** Frontend UI/UX Design | **Stack:** Tailwind CSS, shadcn/ui, React | **Last Verified:** 2026-02-17

## 1. What AI Models Get Wrong

- **Defaulting to generic aesthetics** \u2014 Inter font, purple gradients on white, predictable card grids. This is "AI slop."
- **Treating shadcn as a ceiling** \u2014 shadcn is a foundation, not a finished design. Override tokens, extend components, break the defaults.
- **Using safe, committee-approved palettes** \u2014 timid color distributions with no dominant voice.
- **Ignoring motion entirely** \u2014 or sprinkling random transitions without choreography.
- **Symmetric, predictable layouts** \u2014 centered hero, 3-column features grid, footer. Every AI output looks identical.
- **Skipping atmosphere** \u2014 flat solid backgrounds with no depth, texture, or visual interest.
- **Converging on the same fonts** \u2014 Space Grotesk, Inter, Roboto appear in nearly every AI-generated UI.

## 2. Design Thinking Process

Before writing any code, commit to a direction:

### Step 1: Context
- **Purpose** \u2014 What problem does this interface solve? Who uses it?
- **Tone** \u2014 Commit to a distinct aesthetic direction. Starting points (not limits):
  - Brutally minimal / Swiss precision
  - Maximalist chaos / information-dense
  - Luxury / refined / editorial
  - Lo-fi / zine / raw
  - Dark / moody / cinematic
  - Soft / pastel / dreamy
  - Retro-futuristic / synthwave
  - Organic / natural / handcrafted
  - Art deco / geometric / structured
  - Playful / whimsical / toy-like
  - Industrial / utilitarian / blueprint
- **Constraints** \u2014 Framework, performance budget, accessibility requirements.

### Step 2: Differentiation
Ask: *What makes this UNFORGETTABLE? What is the one thing someone will remember?*

### Step 3: Execute with conviction
Bold maximalism and refined minimalism both work. The key is **intentionality, not intensity**. Every detail must serve the chosen direction.

## 3. Aesthetics Guidelines

### Typography

Typography carries the design's singular voice. It is the most impactful design decision.

**Rules:**
- **Never default** to Arial, Inter, Roboto, system stacks, or Space Grotesk. These signal default thinking.
- **Choose fonts with personality** \u2014 the typeface should be inseparable from the aesthetic direction.
- **Display type should be expressive**, even risky. Body text should be legible and refined.
- **Pair like actors in a scene** \u2014 a bold display font with a quiet body font creates tension and hierarchy.
- **Work the full typographic range** \u2014 size, weight, letter-spacing, text-transform, line-height all contribute.

**Font discovery sources:**
- Google Fonts (filter by category + trending)
- Fontshare (free, high-quality variable fonts)
- Fontsource (npm-installable, tree-shakable)

**Pairing examples (vary every time \u2014 never repeat across projects):**
- Display: \`Clash Display\` / Body: \`Satoshi\`
- Display: \`Cabinet Grotesk\` / Body: \`General Sans\`
- Display: \`Playfair Display\` / Body: \`Source Serif 4\`
- Display: \`Syne\` / Body: \`Work Sans\`
- Display: \`Space Mono\` / Body: \`IBM Plex Sans\`

### Color & Theme

Commit to a cohesive position. Palettes must take a stance.

**Rules:**
- Lead with a **dominant color**, punctuate with **sharp accents**.
- Avoid timid, evenly-distributed palettes where every color gets equal weight.
- Use **CSS custom properties** for all color values (Tailwind \`@theme\` tokens or \`globals.css\`).
- Bold + saturated, moody + restrained, or high-contrast + minimal \u2014 pick one and commit.
- Dark themes are not just "invert the colors" \u2014 they need their own palette with adjusted saturation and contrast.

**Tailwind + shadcn approach:**
\`\`\`css
/* Override shadcn defaults in globals.css \u2014 don't just use the stock theme */
@theme {
  --color-accent: oklch(0.72 0.18 145);
  --color-surface: oklch(0.14 0.01 260);
  --color-surface-raised: oklch(0.18 0.01 260);
  --color-text-primary: oklch(0.95 0 0);
  --color-text-muted: oklch(0.55 0.01 260);
  --color-border: oklch(0.25 0.01 260);
}
\`\`\`

### Motion & Animation

Motion should feel choreographed, not scattered.

**Rules:**
- **One well-orchestrated page load** with staggered reveals (\`animation-delay\`) creates more delight than random micro-interactions.
- **CSS-only first** \u2014 use \`@keyframes\`, \`transition\`, \`animation-delay\` for HTML/CSS projects.
- **Motion library (framer-motion)** for React when orchestration or gesture-based interaction is needed.
- **Scroll-triggered animations** \u2014 use \`IntersectionObserver\` or motion's \`whileInView\`.
- **Hover states that surprise** \u2014 not just \`opacity: 0.8\`. Think scale, translate, color shift, blur, clip-path reveals.

**Stagger pattern (Tailwind + CSS):**
\`\`\`css
.stagger-in > * {
  opacity: 0;
  transform: translateY(12px);
  animation: fadeUp 0.5s ease-out forwards;
}
.stagger-in > *:nth-child(1) { animation-delay: 0ms; }
.stagger-in > *:nth-child(2) { animation-delay: 80ms; }
.stagger-in > *:nth-child(3) { animation-delay: 160ms; }
.stagger-in > *:nth-child(4) { animation-delay: 240ms; }

@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}
\`\`\`

### Spatial Composition & Layout

Break expectations. Layouts should have a point of view.

**Techniques:**
- **Asymmetry** \u2014 off-center hero text, unequal column splits (40/60, 30/70).
- **Overlap and z-depth** \u2014 elements layered with negative margins, \`z-index\`, absolute positioning.
- **Diagonal flow** \u2014 skewed sections, rotated elements, angled dividers.
- **Grid-breaking elements** \u2014 items that bleed outside their container or span unexpected areas.
- **Dramatic scale jumps** \u2014 120px display heading next to 14px body. Not gradual \u2014 dramatic.
- **Full-bleed moments** \u2014 edge-to-edge images, color blocks, or sections.
- **Generous negative space OR controlled density** \u2014 both are valid, but commit to one.

### Backgrounds & Visual Depth

Flat solid backgrounds are the hallmark of generic AI output. Create atmosphere.

**Techniques:**
- Gradient meshes and multi-stop radial gradients
- Noise and grain overlays (\`background-image: url("data:image/svg+xml,...")\` or CSS \`filter\`)
- Geometric patterns (CSS \`repeating-linear-gradient\`, SVG patterns)
- Layered transparencies and glassmorphism (\`backdrop-filter: blur()\`)
- Dramatic or soft shadows and glows (\`box-shadow\` layering, colored shadows)
- Decorative borders, \`clip-path\` shapes, SVG masks
- Print-inspired textures: halftone, duotone, stipple
- Knockout typography (text as mask over images/gradients)

**Grain overlay (reusable):**
\`\`\`css
.grain::after {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.04;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
\`\`\`

## 4. Tailwind + shadcn: Beyond Defaults

shadcn/ui provides unstyled primitives. The design layer is your responsibility.

### Override, don't accept
\`\`\`tsx
// WRONG: stock shadcn button
<Button variant="default">Submit</Button>

// RIGHT: designed button with intent
<Button
  className="bg-[var(--color-accent)] text-black font-medium tracking-tight
             rounded-[10px] px-6 py-3 text-[15px]
             hover:brightness-110 hover:scale-[1.02]
             active:scale-[0.98] transition-all duration-150"
>
  Submit
</Button>
\`\`\`

### Extend component variants
Create project-specific variants via \`cva\` or className overrides that match your aesthetic:
\`\`\`tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center transition-all duration-150 font-medium tracking-tight",
  {
    variants: {
      intent: {
        primary: "bg-[var(--color-accent)] text-black rounded-[10px] hover:brightness-110",
        ghost: "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]",
        danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-[10px]",
      },
      size: {
        sm: "text-[13px] px-3 py-1.5 rounded-[8px]",
        md: "text-[15px] px-5 py-2.5 rounded-[10px]",
        lg: "text-[17px] px-7 py-3.5 rounded-[12px]",
      },
    },
    defaultVariants: { intent: "primary", size: "md" },
  }
);
\`\`\`

### Theme token overrides
Always customize the shadcn theme tokens in \`globals.css\` \u2014 the default theme is intentionally neutral:
\`\`\`css
@layer base {
  :root {
    /* Replace with your aesthetic's palette */
    --background: 0 0% 4%;
    --foreground: 0 0% 95%;
    --card: 0 0% 7%;
    --primary: 145 60% 45%;
    --primary-foreground: 0 0% 2%;
    --muted: 0 0% 12%;
    --muted-foreground: 0 0% 50%;
    --border: 0 0% 14%;
    --radius: 0.625rem;
  }
}
\`\`\`

## 5. DO / DON'T

### DO
- Choose a bold aesthetic direction and execute every detail in service of it.
- Pick distinctive, characterful fonts \u2014 different for every project.
- Lead with a dominant color; use accents sparingly but decisively.
- Choreograph motion \u2014 staggered load, purposeful hover, scroll-triggered reveals.
- Create visual depth with gradients, noise, shadows, layered elements.
- Override shadcn defaults aggressively \u2014 tokens, spacing, radius, components.
- Use asymmetric layouts, dramatic scale contrasts, and intentional negative space.
- Vary between light/dark themes, different aesthetics \u2014 no two projects should look the same.

### DON'T
- Don't use Inter, Roboto, Arial, Space Grotesk, or system font stacks.
- Don't use purple-gradient-on-white or any palette that screams "AI generated this."
- Don't accept stock shadcn themes without customization.
- Don't create symmetric, predictable layouts (centered hero > 3-col grid > CTA > footer).
- Don't add \`opacity: 0.8\` hover states as your only interaction.
- Don't use flat solid backgrounds with no depth or texture.
- Don't scatter random micro-interactions \u2014 choreograph motion intentionally.
- Don't converge on familiar choices across projects \u2014 actively explore the full range.

## 6. Implementation Complexity Matching

Match code complexity to the aesthetic vision:

| Direction | Code Approach |
|-----------|---------------|
| Maximalist / chaos | Elaborate keyframes, layered pseudo-elements, SVG animations, complex gradients, multiple overlapping elements |
| Refined / minimal | Precise spacing, perfect typography scale, subtle transitions, restraint in every detail, fewer elements but each one perfect |
| Editorial / magazine | CSS Grid with named areas, art-directed image placement, pull quotes, typographic hierarchy with 4+ size steps |
| Dark / moody | Colored shadows, glow effects, grain overlays, deep layered backgrounds, selective light sources |
| Retro-futuristic | Custom fonts, scanline effects, neon glows, CRT curvature, monospace accents |

Excellence comes from executing the vision well \u2014 not from adding more effects.

## 7. Checklist

- [ ] Aesthetic direction chosen and stated before coding.
- [ ] Fonts are distinctive and project-specific (not Inter/Roboto/Arial/Space Grotesk).
- [ ] Color palette takes a clear position \u2014 dominant + accent, via CSS tokens.
- [ ] shadcn theme tokens overridden in \`globals.css\` to match the direction.
- [ ] Layout has a point of view \u2014 asymmetry, scale contrast, or intentional density.
- [ ] Motion is choreographed \u2014 staggered load, purposeful hover/scroll interactions.
- [ ] Backgrounds have depth \u2014 gradients, noise, patterns, or layered effects.
- [ ] No generic "AI slop" patterns (purple gradients, symmetric grids, stock components).
- [ ] Implementation complexity matches the aesthetic ambition.
- [ ] The design is memorable \u2014 someone could describe what makes it unique.
`,"skills/skill-greykite.md":`---
skill_name: greykite
version: "1.0.0"
framework: Python
last_verified: "2026-02-19"
always_attach: false
priority: 7
triggers:
  - greykite
  - silverkite
  - time series forecast
  - anomaly detection
  - changepoint detection
  - linkedin forecasting
---

<!--
LLM INSTRUCTION: This is a skill file for Greykite - LinkedIn's time series forecasting and anomaly detection library.
Apply these patterns when working with Greykite for forecasting, anomaly detection, and changepoint analysis.
-->

# Greykite: Time Series Forecasting & Anomaly Detection

> **Framework:** Greykite (LinkedIn) | **Last Verified:** 2026-02-19

## 1. Overview

Greykite is a Python library developed by LinkedIn for flexible, intuitive, and fast time series forecasting and anomaly detection. The flagship algorithm, Silverkite, excels at handling time series with changepoints in trend or seasonality, event and holiday effects, and temporal dependencies.

### Key Features

- **Multiple algorithms**: Silverkite (native), Facebook Prophet, Auto ARIMA
- **Automatic model selection**: AUTO template for out-of-the-box performance
- **Changepoint detection**: Adaptive lasso with automatic regularization
- **Anomaly detection**: Greykite AD with optimized thresholds
- **Unified interface**: Consistent API across all models
- **Sklearn integration**: Works with scikit-learn pipelines
- **Interactive visualization**: Plotly-based charts

## 2. Core APIs

### 2.1 Forecaster.run_forecast_config - High-level forecasting

The primary entry point for creating forecasts with automatic model selection, cross-validation, and backtesting.

\`\`\`python
from greykite.common.data_loader import DataLoader
from greykite.framework.templates.autogen.forecast_config import ForecastConfig
from greykite.framework.templates.autogen.forecast_config import MetadataParam
from greykite.framework.templates.forecaster import Forecaster
from greykite.framework.templates.model_templates import ModelTemplateEnum

# Load sample data
data_loader = DataLoader()
df = data_loader.load_peyton_manning()

# Configure metadata
metadata = MetadataParam(
    time_col="ts",
    value_col="y",
    freq="D"
)

# Create forecast configuration
config = ForecastConfig(
    model_template=ModelTemplateEnum.AUTO.name,
    forecast_horizon=365,
    coverage=0.95,
    metadata_param=metadata
)

# Run forecast
forecaster = Forecaster()
result = forecaster.run_forecast_config(df=df, config=config)

# Access results
print(result.forecast.df.head())
print(result.backtest.test_evaluation)
print(result.model[-1].summary())
\`\`\`

### 2.2 ChangepointDetector.find_trend_changepoints - Detect trend shifts

Identifies points in time where the trend changes using adaptive lasso.

\`\`\`python
from greykite.algo.changepoint.adalasso.changepoint_detector import ChangepointDetector
from greykite.common.data_loader import DataLoader

# Load data
data_loader = DataLoader()
df = data_loader.load_peyton_manning()

# Initialize detector
detector = ChangepointDetector()

# Detect trend changepoints
result = detector.find_trend_changepoints(
    df=df,
    time_col="ts",
    value_col="y",
    yearly_seasonality_order=10,
    resample_freq="7D",
    potential_changepoint_n=25,
    regularization_strength=0.5,
    actual_changepoint_min_distance="30D",
    no_changepoint_distance_from_end="90D"
)

# View detected changepoints
print(result["trend_changepoints"])

# Visualize
fig = detector.plot()
fig.show()
\`\`\`

### 2.3 GreykiteDetector - Anomaly detection

Combines forecasting with automatic threshold optimization.

\`\`\`python
from greykite.detection.detector.config import ADConfig
from greykite.detection.detector.data import DetectorData
from greykite.detection.detector.greykite import GreykiteDetector
from greykite.framework.templates.autogen.forecast_config import ForecastConfig
from greykite.framework.templates.autogen.forecast_config import MetadataParam
from greykite.framework.templates.model_templates import ModelTemplateEnum

# Configure forecast model
metadata = MetadataParam(time_col="ts", value_col="y", freq="D")
forecast_config = ForecastConfig(
    model_template=ModelTemplateEnum.AUTO.name,
    forecast_horizon=7,
    coverage=None,
    metadata_param=metadata
)

# Configure anomaly detection
ad_config = ADConfig(
    volatility_features_list=[
        ["dow"],
        ["is_weekend"],
        ["dow", "hour"]
    ],
    coverage_grid=[0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 0.99]
)

# Initialize and train detector
detector = GreykiteDetector(
    forecast_config=forecast_config,
    ad_config=ad_config
)

train_data = DetectorData(df=train_df)
detector.fit(data=train_data)

# Predict anomalies
test_data = DetectorData(df=test_df)
test_data = detector.predict(test_data)

# View results
print(detector.pred_df[["ts", "y", "y_pred", "y_pred_lower", "y_pred_upper", "anomaly"]].head())
\`\`\`

### 2.4 DataLoader - Sample datasets

Provides easy access to built-in time series datasets.

\`\`\`python
from greykite.common.data_loader import DataLoader

data_loader = DataLoader()

# View available datasets
print(data_loader.available_datasets)

# Load datasets
df_peyton = data_loader.load_peyton_manning()  # Daily Wikipedia page views
df_bikes = data_loader.load_bikesharing()        # Hourly bike rentals
df_parking = data_loader.load_parking()          # Hourly parking data
\`\`\`

## 3. Naming Conventions

### 3.1 Variable Naming

| Type | Convention | Example |
|------|-----------|---------|
| DataFrames | \`df_*\` | \`df_raw\`, \`df_cleaned\`, \`df_features\` |
| Models | \`model_*\` | \`model_forecast\`, \`model_classifier\` |
| Configs | \`config_*\` | \`config_forecast\`, \`config_ad\` |
| Results | \`result_*\` | \`result_forecast\`, \`result_changepoints\` |
| Detectors | \`detector_*\` | \`detector_changepoint\`, \`detector_anomaly\` |
| Metadata | \`metadata_*\` | \`metadata_param\` |

### 3.2 Function Naming

\`\`\`python
# Forecasting functions
def generate_forecast(df: pd.DataFrame, horizon: int) -> pd.DataFrame:
    """Generate time series forecast."""
    pass

def evaluate_forecast(result: ForecastResult) -> dict:
    """Evaluate forecast performance metrics."""
    pass

def plot_forecast(result: ForecastResult) -> go.Figure:
    """Plot forecast with confidence intervals."""
    pass

# Anomaly detection functions
def detect_anomalies(df: pd.DataFrame, config: ADConfig) -> pd.DataFrame:
    """Detect anomalies in time series data."""
    pass

def optimize_thresholds(df: pd.DataFrame, labels: pd.Series) -> dict:
    """Optimize detection thresholds based on labeled data."""
    pass

# Changepoint detection functions
def find_changepoints(df: pd.DataFrame, params: dict) -> list:
    """Find trend changepoints in time series."""
    pass

def plot_changepoints(df: pd.DataFrame, changepoints: list) -> go.Figure:
    """Plot time series with detected changepoints."""
    pass
\`\`\`

## 4. Common Patterns

### 4.1 Basic Forecasting Workflow

\`\`\`python
from greykite.common.data_loader import DataLoader
from greykite.framework.templates.autogen.forecast_config import ForecastConfig
from greykite.framework.templates.autogen.forecast_config import MetadataParam
from greykite.framework.templates.forecaster import Forecaster
from greykite.framework.templates.model_templates import ModelTemplateEnum

def run_basic_forecast(
    df: pd.DataFrame,
    time_col: str,
    value_col: str,
    forecast_horizon: int = 30,
    coverage: float = 0.95
) -> ForecastResult:
    """Run basic forecast with AUTO model selection.

    Args:
        df: Input DataFrame with time series data.
        time_col: Name of timestamp column.
        value_col: Name of value column.
        forecast_horizon: Number of periods to forecast.
        coverage: Prediction interval coverage.

    Returns:
        ForecastResult with predictions and metrics.
    """
    # Configure metadata
    metadata = MetadataParam(
        time_col=time_col,
        value_col=value_col,
        freq="D"
    )

    # Create forecast configuration
    config = ForecastConfig(
        model_template=ModelTemplateEnum.AUTO.name,
        forecast_horizon=forecast_horizon,
        coverage=coverage,
        metadata_param=metadata
    )

    # Run forecast
    forecaster = Forecaster()
    result = forecaster.run_forecast_config(df=df, config=config)

    return result
\`\`\`

### 4.2 Advanced Forecast Configuration

\`\`\`python
from greykite.framework.templates.autogen.forecast_config import (
    ForecastConfig,
    MetadataParam,
    ModelComponentsParam,
    EvaluationPeriodParam,
    ComputationParam
)

def create_advanced_config(
    forecast_horizon: int = 365,
    coverage: float = 0.95
) -> ForecastConfig:
    """Create advanced forecast configuration with custom parameters.

    Args:
        forecast_horizon: Number of periods to forecast.
        coverage: Prediction interval coverage.

    Returns:
        Configured ForecastConfig object.
    """
    config = ForecastConfig(
        model_template=ModelTemplateEnum.SILVERKITE.name,
        metadata_param=MetadataParam(
            time_col="ts",
            value_col="y",
            freq="D"
        ),
        forecast_horizon=forecast_horizon,
        coverage=coverage,
        model_components_param=ModelComponentsParam(
            growth={"growth_term": "linear"},
            seasonality={
                "yearly_seasonality": 15,
                "quarterly_seasonality": 5,
                "monthly_seasonality": 5,
                "weekly_seasonality": 4
            },
            events={
                "holidays_to_model_separately": ["New Year's Day", "Christmas Day"],
                "holiday_lookup_countries": ["US"],
                "holiday_pre_num_days": 2,
                "holiday_post_num_days": 2
            },
            changepoints={
                "changepoints_dict": {
                    "method": "auto",
                    "regularization_strength": 0.6,
                    "potential_changepoint_n": 25,
                    "no_changepoint_proportion_from_end": 0.2
                }
            },
            autoregression={"autoreg_dict": "auto"}
        ),
        evaluation_period_param=EvaluationPeriodParam(
            test_horizon=90,
            cv_horizon=90,
            cv_min_train_periods=365,
            cv_expanding_window=True,
            cv_periods_between_splits=90
        ),
        computation_param=ComputationParam(
            verbose=1,
            n_jobs=-1
        )
    )

    return config
\`\`\`

### 4.3 Anomaly Detection Pipeline

\`\`\`python
from greykite.detection.detector.config import ADConfig
from greykite.detection.detector.data import DetectorData
from greykite.detection.detector.greykite import GreykiteDetector

def run_anomaly_detection(
    df_train: pd.DataFrame,
    df_test: pd.DataFrame,
    time_col: str,
    value_col: str
) -> pd.DataFrame:
    """Run anomaly detection with optimized thresholds.

    Args:
        df_train: Training data for model fitting.
        df_test: Test data for anomaly detection.
        time_col: Name of timestamp column.
        value_col: Name of value column.

    Returns:
        DataFrame with anomaly flags and predictions.
    """
    # Configure forecast model
    metadata = MetadataParam(time_col=time_col, value_col=value_col, freq="D")
    forecast_config = ForecastConfig(
        model_template=ModelTemplateEnum.AUTO.name,
        forecast_horizon=7,
        coverage=None,
        metadata_param=metadata
    )

    # Configure anomaly detection
    ad_config = ADConfig(
        volatility_features_list=[
            ["dow"],
            ["is_weekend"],
            ["dow", "hour"]
        ],
        coverage_grid=[0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 0.99]
    )

    # Initialize and train detector
    detector = GreykiteDetector(
        forecast_config=forecast_config,
        ad_config=ad_config
    )

    train_data = DetectorData(df=df_train)
    detector.fit(data=train_data)

    # Predict anomalies
    test_data = DetectorData(df=df_test)
    test_data = detector.predict(test_data)

    return detector.pred_df
\`\`\`

### 4.4 Changepoint Detection

\`\`\`python
from greykite.algo.changepoint.adalasso.changepoint_detector import ChangepointDetector

def detect_trend_changepoints(
    df: pd.DataFrame,
    time_col: str,
    value_col: str,
    regularization_strength: float = 0.5
) -> dict:
    """Detect trend changepoints in time series.

    Args:
        df: Input DataFrame with time series data.
        time_col: Name of timestamp column.
        value_col: Name of value column.
        regularization_strength: Regularization strength (0.0-1.0).

    Returns:
        Dictionary with detected changepoints and trend estimation.
    """
    detector = ChangepointDetector()

    result = detector.find_trend_changepoints(
        df=df,
        time_col=time_col,
        value_col=value_col,
        yearly_seasonality_order=10,
        resample_freq="7D",
        potential_changepoint_n=25,
        regularization_strength=regularization_strength,
        actual_changepoint_min_distance="30D",
        no_changepoint_distance_from_end="90D"
    )

    return result
\`\`\`

## 5. Model Templates

### 5.1 Available Templates

| Template | Description | Use Case |
|----------|-------------|----------|
| \`AUTO\` | Automatic model selection | Default, unknown data patterns |
| \`SILVERKITE\` | Native Greykite algorithm | Complex seasonality, changepoints |
| \`PROPHET\` | Facebook Prophet | Holiday effects, business cycles |
| \`ARIMA\` | Auto ARIMA | Simple patterns, quick forecasts |

### 5.2 Template Selection

\`\`\`python
from greykite.framework.templates.model_templates import ModelTemplateEnum

# Automatic selection (recommended for most cases)
config = ForecastConfig(
    model_template=ModelTemplateEnum.AUTO.name,
    ...
)

# Silverkite for complex patterns
config = ForecastConfig(
    model_template=ModelTemplateEnum.SILVERKITE.name,
    ...
)

# Prophet for holiday-heavy data
config = ForecastConfig(
    model_template=ModelTemplateEnum.PROPHET.name,
    ...
)

# ARIMA for simple patterns
config = ForecastConfig(
    model_template=ModelTemplateEnum.ARIMA.name,
    ...
)
\`\`\`

## 6. Evaluation Metrics

### 6.1 Available Metrics

\`\`\`python
# Access backtest metrics
result = forecaster.run_forecast_config(df=df, config=config)

# Common metrics
metrics = result.backtest.test_evaluation

# Available metrics:
# - MAPE: Mean Absolute Percentage Error
# - RMSE: Root Mean Squared Error
# - MAE: Mean Absolute Error
# - SMAPE: Symmetric Mean Absolute Percentage Error
# - Quantile losses: For prediction intervals

print(f"MAPE: {metrics['MAPE']:.2f}%")
print(f"RMSE: {metrics['RMSE']:.2f}")
print(f"MAE: {metrics['MAE']:.2f}")
\`\`\`

### 6.2 Cross-Validation

\`\`\`python
# Configure cross-validation
config = ForecastConfig(
    ...
    evaluation_period_param=EvaluationPeriodParam(
        test_horizon=90,              # Holdout test set size
        cv_horizon=90,                # Cross-validation fold size
        cv_min_train_periods=365,     # Minimum training size
        cv_expanding_window=True,     # Expanding vs rolling window
        cv_periods_between_splits=90  # Gap between CV splits
    )
)

# Access CV results
result = forecaster.run_forecast_config(df=df, config=config)
cv_results = result.backtest.cv_evaluation
\`\`\`

## 7. Visualization

### 7.1 Plotting Forecasts

\`\`\`python
import plotly.io as pio

# Plot timeseries
fig = result.timeseries.plot()
pio.show(fig)

# Plot backtest results
fig_backtest = result.backtest.plot()
pio.show(fig_backtest)

# Plot future forecast
fig_forecast = result.forecast.plot()
pio.show(fig_forecast)

# Plot component breakdown
fig_components = result.forecast.plot_components()
pio.show(fig_components)
\`\`\`

### 7.2 Plotting Anomalies

\`\`\`python
# Plot predictions with anomaly flags
fig = detector.plot(phase="predict", title="Anomaly Detection Results")
fig.show()
\`\`\`

### 7.3 Plotting Changepoints

\`\`\`python
# Visualize changepoints
fig = detector.plot()
fig.show()
\`\`\`

## 8. Best Practices

### 8.1 Data Preparation

\`\`\`python
# Ensure proper column names
df = df.rename(columns={"date": "ts", "value": "y"})

# Ensure proper datetime format
df["ts"] = pd.to_datetime(df["ts"])

# Handle missing values
df = df.dropna(subset=["ts", "y"])

# Sort by time
df = df.sort_values("ts")

# Remove duplicates
df = df.drop_duplicates(subset=["ts"])
\`\`\`

### 8.2 Model Selection

\`\`\`python
# Start with AUTO template
config = ForecastConfig(
    model_template=ModelTemplateEnum.AUTO.name,
    ...
)

# If performance is poor, try specific templates
# - SILVERKITE for complex seasonality
# - PROPHET for strong holiday effects
# - ARIMA for simple patterns
\`\`\`

### 8.3 Hyperparameter Tuning

\`\`\`python
# Adjust regularization strength for changepoints
config = ForecastConfig(
    ...
    model_components_param=ModelComponentsParam(
        changepoints={
            "changepoints_dict": {
                "regularization_strength": 0.6,  # Higher = fewer changepoints
                "potential_changepoint_n": 25
            }
        }
    )
)

# Adjust seasonality orders
config = ForecastConfig(
    ...
    model_components_param=ModelComponentsParam(
        seasonality={
            "yearly_seasonality": 15,  # Higher = more flexible
            "weekly_seasonality": 4
        }
    )
)
\`\`\`

### 8.4 Performance Optimization

\`\`\`python
# Use parallel processing
config = ForecastConfig(
    ...
    computation_param=ComputationParam(
        n_jobs=-1  # Use all cores
    )
)

# Reduce CV folds for faster training
config = ForecastConfig(
    ...
    evaluation_period_param=EvaluationPeriodParam(
        cv_horizon=30,  # Smaller folds
        cv_periods_between_splits=30
    )
)
\`\`\`

## 9. Common Use Cases

### 9.1 Business Metric Forecasting

\`\`\`python
def forecast_business_metric(
    df: pd.DataFrame,
    metric_name: str,
    forecast_horizon: int = 90
) -> dict:
    """Forecast business metrics like revenue, users, etc.

    Args:
        df: Historical metric data.
        metric_name: Name of the metric being forecasted.
        forecast_horizon: Number of periods to forecast.

    Returns:
        Dictionary with forecast and metrics.
    """
    result = run_basic_forecast(
        df=df,
        time_col="ts",
        value_col="y",
        forecast_horizon=forecast_horizon
    )

    return {
        "metric_name": metric_name,
        "forecast": result.forecast.df,
        "metrics": result.backtest.test_evaluation,
        "model_summary": result.model[-1].summary()
    }
\`\`\`

### 9.2 Monitoring Anomaly Detection

\`\`\`python
def detect_monitoring_anomalies(
    df: pd.DataFrame,
    metric_name: str,
    train_ratio: float = 0.8
) -> pd.DataFrame:
    """Detect anomalies in monitoring metrics.

    Args:
        df: Time series monitoring data.
        metric_name: Name of the metric.
        train_ratio: Ratio of data to use for training.

    Returns:
        DataFrame with anomaly flags.
    """
    split_idx = int(len(df) * train_ratio)
    df_train = df[:split_idx].reset_index(drop=True)
    df_test = df[split_idx:].reset_index(drop=True)

    result = run_anomaly_detection(
        df_train=df_train,
        df_test=df_test,
        time_col="ts",
        value_col="y"
    )

    return result
\`\`\`

### 9.3 Hierarchical Forecast Reconciliation

\`\`\`python
from greykite.algo.reconcile.convex.reconcile_forecasts import ReconcileAdditiveForecasts

def reconcile_hierarchical_forecasts(
    forecasts_df: pd.DataFrame,
    constraint_matrix: pd.DataFrame
) -> pd.DataFrame:
    """Reconcile hierarchical forecasts to satisfy additivity constraints.

    Args:
        forecasts_df: DataFrame with hierarchical forecasts.
        constraint_matrix: Constraint matrix defining relationships.

    Returns:
        Reconciled forecasts satisfying constraints.
    """
    reconciler = ReconcileAdditiveForecasts()

    reconciled = reconciler.reconcile_forecasts(
        forecasts=forecasts_df,
        constraint_matrix=constraint_matrix,
        unbiased=True,
        weight="MLE"
    )

    return reconciled["reconciled_forecasts"]
\`\`\`

## 10. Quick Reference

### 10.1 Import Patterns

\`\`\`python
# Core imports
from greykite.common.data_loader import DataLoader
from greykite.framework.templates.forecaster import Forecaster
from greykite.framework.templates.autogen.forecast_config import (
    ForecastConfig,
    MetadataParam,
    ModelComponentsParam
)
from greykite.framework.templates.model_templates import ModelTemplateEnum

# Changepoint detection
from greykite.algo.changepoint.adalasso.changepoint_detector import ChangepointDetector

# Anomaly detection
from greykite.detection.detector.greykite import GreykiteDetector
from greykite.detection.detector.config import ADConfig
from greykite.detection.detector.data import DetectorData

# Reconciliation
from greykite.algo.reconcile.convex.reconcile_forecasts import ReconcileAdditiveForecasts
\`\`\`

### 10.2 Common Parameters

| Parameter | Description | Default | Common Values |
|-----------|-------------|---------|---------------|
| \`forecast_horizon\` | Periods to forecast | - | 30, 90, 365 |
| \`coverage\` | Prediction interval | 0.95 | 0.8, 0.9, 0.95, 0.99 |
| \`regularization_strength\` | Changepoint regularization | 0.6 | 0.3, 0.5, 0.7, 0.9 |
| \`yearly_seasonality\` | Fourier order for yearly | 15 | 5, 10, 15, 20 |
| \`weekly_seasonality\` | Fourier order for weekly | 4 | 2, 4, 6, 8 |

### 10.3 Result Access

\`\`\`python
# Forecast results
result.forecast.df              # Future predictions
result.forecast.plot()          # Plot forecast
result.forecast.plot_components()  # Plot components

# Backtest results
result.backtest.test_evaluation  # Test set metrics
result.backtest.cv_evaluation    # CV metrics
result.backtest.plot()           # Plot backtest

# Model results
result.model[-1].summary()       # Model summary
result.model.predict(df)         # Make predictions
result.timeseries.make_future_dataframe(periods=30)  # Future dates
\`\`\`

## 11. Troubleshooting

### 11.1 Common Issues

**Issue: Poor forecast accuracy**
- Solution: Try different model templates (SILVERKITE, PROPHET)
- Solution: Adjust seasonality orders
- Solution: Check for data quality issues

**Issue: Too many/few changepoints**
- Solution: Adjust \`regularization_strength\` (higher = fewer)
- Solution: Set \`potential_changepoint_n\` appropriately
- Solution: Use \`actual_changepoint_min_distance\`

**Issue: Too many false anomalies**
- Solution: Adjust \`coverage_grid\` range
- Solution: Add volatility features
- Solution: Use labeled data for threshold optimization

**Issue: Slow training**
- Solution: Use \`n_jobs=-1\` for parallel processing
- Solution: Reduce CV folds
- Solution: Use simpler model template

### 11.2 Debugging Tips

\`\`\`python
# Enable verbose output
config = ForecastConfig(
    ...
    computation_param=ComputationParam(verbose=2)
)

# Check data quality
print(df.info())
print(df.describe())
print(df.isnull().sum())

# Validate model fit
model = result.model[-1]
print(model.summary())

# Plot residuals
fig = result.forecast.plot_components()
pio.show(fig)
\`\`\`
`,"skills/skill-http-security-headers.md":`---
skill_name: skill-http-security-headers
version: "1.0"
framework: Next.js
last_verified: "2025-12-26"
always_attach: false
priority: 8
triggers:
  - csp
  - content-security-policy
  - security headers
  - headers()
  - next.config
  - x-frame-options
  - x-content-type-options
  - referrer-policy
  - permissions-policy
  - clickjacking
  - xss
  - nonce
  - strict-dynamic
---

<!--
LLM INSTRUCTION: Use for Next.js HTTP response header hardening.
Prefer CSP frame-ancestors over X-Frame-Options, but set both for defense-in-depth.
If using nonce-based CSP, it must be per-request (not a static next.config.ts string).
Static export (output: 'export') cannot use next.config headers(); configure at CDN/host instead.
-->

# Next.js HTTP Security Headers

> **Target:** Next.js (App Router or Pages Router) | **Last Verified:** 2025-12-26

## 1. What AI Models Get Wrong

- **Static nonce CSP in \`next.config.*\`** (nonces must be generated per request).
- **Allowing \`unsafe-inline\`/\`unsafe-eval\` in production**.
- **Using X-Frame-Options alone** (modern control is CSP \`frame-ancestors\`).
- **Forgetting static export limits** (\`headers()\` doesn\u2019t apply to \`output: 'export'\`).
- **Over-broad allowlists** (\`connect-src *\`, \`script-src *\`) that nullify CSP.

## 2. Golden Rules

### \u2705 DO
- **Set baseline security headers** via \`next.config.*\` \`headers()\` when you have a server runtime.
- **Use CSP \`frame-ancestors\`** to prevent clickjacking (keep XFO as legacy defense).
- **Roll out CSP using Report-Only first** if unsure what will break.
- **Generate CSP nonces per request** when you need strict CSP.

### \u274C DON'T
- **Don\u2019t ship \`unsafe-eval\` in production** (dev-only if absolutely required).
- **Don\u2019t use a single static nonce**.
- **Don\u2019t rely on \`headers()\` for static export**.

## 3. Baseline Headers (Good Defaults)

Use these unless a requirement forces deviation:

- \`X-Content-Type-Options: nosniff\`
- \`Referrer-Policy: strict-origin-when-cross-origin\`
- \`Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()\`
- \`X-Frame-Options: DENY\` (or \`SAMEORIGIN\` if you must embed yourself)
- \`Content-Security-Policy: ...\` (see below)

## 4. Implementing via \`next.config.*\` (Static Header Values)

\`\`\`ts
// next.config.ts
import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()'
  },
  { key: 'X-Frame-Options', value: 'DENY' }
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; upgrade-insecure-requests;"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
\`\`\`

## 5. CSP: When to Use Nonces

Use nonce-based CSP when you need strong XSS mitigation without allowing inline scripts.

### Strict CSP shape (conceptual)

- \`script-src 'self' 'nonce-<NONCE>' 'strict-dynamic'\`
- \`style-src 'self' 'nonce-<NONCE>'\`
- keep \`frame-ancestors 'none'\`, \`object-src 'none'\`, \`base-uri 'self'\`, \`form-action 'self'\`

### Next.js pattern: generate nonce per request

\`\`\`ts
// proxy.ts (example)
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const csp = \`default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; frame-ancestors 'none'; script-src 'self' 'nonce-\${nonce}' 'strict-dynamic'; style-src 'self' 'nonce-\${nonce}'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; upgrade-insecure-requests;\`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}
\`\`\`

Use the nonce for third-party scripts:

\`\`\`tsx
import { headers } from 'next/headers';
import Script from 'next/script';

export default async function Page() {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return <Script src="https://example.com/script.js" nonce={nonce} />;
}
\`\`\`

## 6. Static Export Caveat

If using \`output: 'export'\`, set headers at the hosting layer (CDN, reverse proxy). \`next.config.*\` \`headers()\` won\u2019t apply.

## 7. Checklist

- [ ] Baseline headers set for all routes.
- [ ] CSP includes \`frame-ancestors\`.
- [ ] No \`unsafe-eval\`/\`unsafe-inline\` in production.
- [ ] If using nonces, they are per request and passed to scripts.
- [ ] Static export handled at CDN/host.
`,"skills/skill-metadata-seo.md":`---
skill_name: skill-metadata-seo
version: "16.0.10"
framework: Next.js
last_verified: "2025-12-18"
always_attach: false
priority: 6
triggers:
  - metadata
  - generateMetadata
  - SEO
  - openGraph
  - og:image
  - opengraph-image
  - sitemap
  - robots
  - meta tags
---

<!--
LLM INSTRUCTION: Apply when user works on SEO, metadata, or social sharing.
generateMetadata params are PROMISES - must await them.
opengraph-image.tsx also receives async params.
Do NOT use next/head - App Router uses export const metadata or generateMetadata.
Use sitemap.ts and robots.ts for dynamic generation, not static files.
Image remotePatterns: localhost is BLOCKED by default (SSRF prevention).
-->

# Metadata & SEO

> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18

## 1. What AI Models Get Wrong

- **Using sync params in generateMetadata** \u2192 LLMs use \`{ params: { id: string } }\`. In v16, params is a Promise.
- **Using \`next/head\` in App Router** \u2192 LLMs suggest the old Head component. App Router uses metadata exports.
- **Sync params in ImageResponse** \u2192 LLMs forget opengraph-image.tsx also receives async params.
- **Using sitemap.xml file** \u2192 LLMs create static XML. v16 prefers sitemap.ts with dynamic generation.
- **Missing parent metadata extension** \u2192 LLMs don't await parent to extend existing metadata.

## 2. Golden Rules

### \u2705 DO
- **Await params in generateMetadata** \u2192 First argument is \`{ params: Promise<...> }\`
- **Use \`export const metadata\` or \`generateMetadata\`** \u2192 App Router's metadata API
- **Await params in opengraph-image.tsx** \u2192 Image routes also receive async params
- **Use sitemap.ts for dynamic sitemaps** \u2192 Return \`MetadataRoute.Sitemap\` array
- **Await \`parent\` for extending metadata** \u2192 Access parent's openGraph images, etc.

### \u274C DON'T  
- **Don't use \`next/head\`** \u2192 Not available in App Router
- **Don't access params synchronously** \u2192 They're Promises in generateMetadata
- **Don't create static sitemap.xml** \u2192 Use sitemap.ts for dynamic generation
- **Don't forget robots.ts** \u2192 Controls crawler behavior
- **Don't use local IPs in remotePatterns** \u2192 Blocked by default for SSRF prevention

## 3. Critical Patterns

### Async generateMetadata

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
import type { Metadata } from 'next';

// Sync params - CRASHES in v16
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } // Wrong type
}): Promise<Metadata> {
  const product = await fetch(\`https://api.example.com/products/\${params.id}\`); // Error
  return { title: product.name };
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // 1. Await the params
  const { id } = await params;
  
  // 2. Fetch data
  const product = await fetch(\`https://api.example.com/products/\${id}\`)
    .then((res) => res.json());

  // 3. Extend parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [product.image, ...previousImages],
    },
  };
}
\`\`\`
**Why:** v16's async params support PPR and streaming for metadata generation.

---

### OpenGraph Image with Async Params

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

// Sync params - CRASHES
export default function Image({ params }: { params: { slug: string } }) {
  return new ImageResponse(
    <div>Post: {params.slug}</div>, // Error
    { width: 1200, height: 600 }
  );
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Blog post image';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // Optionally fetch post data
  const post = await fetch(\`https://api.example.com/posts/\${slug}\`)
    .then(r => r.json());
  
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
          color: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    ),
    { ...size }
  );
}
\`\`\`
**Why:** Image routes follow the same async params pattern as pages.

---

### Dynamic Sitemap

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`xml
<!-- public/sitemap.xml - Static, outdated -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
  </url>
</urlset>
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetch('https://api.example.com/posts')
    .then(r => r.json());

  const postUrls = posts.map((post: { slug: string; updatedAt: string }) => ({
    url: \`https://example.com/blog/\${post.slug}\`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://example.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...postUrls,
  ];
}
\`\`\`
**Why:** sitemap.ts generates dynamic XML at request time with fresh data.

---

### Robots.ts

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`
# public/robots.txt - Static file
User-agent: *
Disallow: /admin
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: \`\${baseUrl}/sitemap.xml\`,
    host: baseUrl,
  };
}
\`\`\`
**Why:** robots.ts allows dynamic rules and environment-based URLs.

---

### Image Remote Patterns Security

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// next.config.ts
const config = {
  images: {
    remotePatterns: [
      { hostname: 'localhost' }, // Blocked for SSRF prevention
      { hostname: '127.0.0.1' }, // Blocked
    ],
  },
};
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.example.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
    ],
    // Only for development - NOT production
    // dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
\`\`\`
**Why:** v16 blocks loopback IPs by default to prevent SSRF attacks.

## 4. Quick Reference Table

| Feature | \u274C Don't | \u2705 Do |
|---------|---------|------|
| Head Tags | \`import Head from 'next/head'\` | \`export const metadata\` or \`generateMetadata\` |
| Metadata Params | \`params: { id: string }\` | \`params: Promise<{ id: string }>\` |
| OG Image Params | Sync access | \`await params\` in async function |
| Sitemap | Static \`sitemap.xml\` | Dynamic \`sitemap.ts\` |
| Robots | Static \`robots.txt\` | Dynamic \`robots.ts\` |
| Local Images | \`localhost\` in remotePatterns | Only production domains |
| Parent Metadata | Ignore parent | \`await parent\` to extend |

## 5. Checklist Before Coding

- [ ] \`generateMetadata\` function awaits its \`params\` argument
- [ ] \`opengraph-image.tsx\` is async and awaits params  
- [ ] Using \`export const metadata\` or \`generateMetadata\` (not next/head)
- [ ] \`sitemap.ts\` returns \`MetadataRoute.Sitemap\` array
- [ ] \`robots.ts\` returns \`MetadataRoute.Robots\` object
- [ ] Image \`remotePatterns\` only includes production domains (no localhost)
`,"skills/skill-next-intl.md":`---
skill_name: skill-next-intl
version: "3.x"
framework: Next.js
last_verified: "2025-12-26"
always_attach: false
priority: 7
triggers:
  - next-intl
  - i18n
  - internationalization
  - locale
  - locales
  - translations
  - NextIntlClientProvider
  - setRequestLocale
  - defineRouting
  - createNavigation
  - getRequestConfig
---

<!--
LLM INSTRUCTION: Use for Next.js App Router i18n with next-intl.
CRITICAL: In Next.js 16, params are Promises in layouts/pages. Always await.
CRITICAL: In async server components, use getTranslations (async) from next-intl/server. NEVER use useTranslations hook in async functions.
useTranslations hook is ONLY for client components ('use client').
Always call setRequestLocale(locale) in every layout/page that uses params.
Use NextIntlClientProvider in the root locale layout.
Use createNavigation() wrappers; never use next/link or next/navigation directly for localized routes.
Do NOT use next-intl/client or createSharedPathnamesNavigation (deprecated).
-->

# next-intl (Next.js 16 App Router)

> **Target:** Next.js 16 | **Last Verified:** 2025-12-26

## 1. What AI Models Get Wrong

- **Sync params access** \u2192 Next.js 16 params are Promises; sync destructuring breaks.
- **Missing setRequestLocale** \u2192 causes dynamic rendering errors or wrong locale.
- **Using useTranslations in async server components** \u2192 hooks can't be called in async functions; use \`getTranslations\` from \`next-intl/server\` instead.
- **Using next/link** \u2192 bypasses localized pathnames.
- **No NextIntlClientProvider** \u2192 client hooks fail.
- **Missing matcher for unprefixed routes** \u2192 localePrefix: 'as-needed' breaks.

## 2. Golden Rules

### \u2705 DO
- **Type params as Promise** and \`await\` them in layouts/pages.
- **Call setRequestLocale(locale)** before any server-side translations.
- **Use \`getTranslations\` from \`next-intl/server\`** in async server components (pages/layouts).
- **Use \`useTranslations\` from \`next-intl\`** only in client components (\`'use client'\`).
- **Wrap with NextIntlClientProvider** in \`[locale]/layout.tsx\`.
- **Use createNavigation wrappers** for Link/redirect/useRouter/usePathname.
- **Validate locale** with hasLocale and fallback to defaultLocale.

### \u274C DON'T
- **Don't destructure params synchronously** (\`{ params: { locale } }\`).
- **Don't use \`useTranslations\` in async server components** \u2192 use \`getTranslations\` instead.
- **Don't import from next-intl/client** (deprecated).
- **Don't use createSharedPathnamesNavigation** (superseded).
- **Don't use next/link or next/navigation directly** for localized routes.

## 3. Minimal Setup (Files)

\`\`\`
src/
\u251C\u2500\u2500 i18n/
\u2502   \u251C\u2500\u2500 routing.ts
\u2502   \u251C\u2500\u2500 navigation.ts
\u2502   \u2514\u2500\u2500 request.ts
proxy.ts
\u2514\u2500\u2500 app/[locale]/layout.tsx
messages/
\u2514\u2500\u2500 en.json
\`\`\`

## 4. Core Patterns

### Routing (\`src/i18n/routing.ts\`)
\`\`\`ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/about': { en: '/about', es: '/acerca-de' }
  }
} as const);

export type Locale = (typeof routing.locales)[number];
\`\`\`

### Navigation (\`src/i18n/navigation.ts\`)
\`\`\`ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
\`\`\`

### Request Config (\`src/i18n/request.ts\`)
\`\`\`ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(\`../../messages/\${locale}.json\`)).default
  };
});
\`\`\`

### Proxy (\`proxy.ts\`) \u2014 compose with other request interceptors
If you also use Supabase SSR (\`@supabase/ssr\`), run both i18n + session refresh in **one** \`proxy.ts\`.

\`\`\`ts
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { updateSession } from '@/lib/supabase/proxy';

const handleI18n = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1) Refresh Supabase session (may set cookies)
  const sessionResponse = await updateSession(request);

  // 2) Apply i18n routing (may rewrite/redirect)
  const i18nResponse = handleI18n(request);

  // 3) Merge cookies into the final response
  for (const cookie of sessionResponse.cookies.getAll()) {
    i18nResponse.cookies.set(cookie);
  }

  return i18nResponse;
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\\\..*).*)']
};
\`\`\`

### Locale Layout (\`src/app/[locale]/layout.tsx\`)
\`\`\`tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
\`\`\`

### Server Component Page (\`app/[locale]/page.tsx\`)
\`\`\`tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
\`\`\`

> **Note:** Use \`getTranslations\` (async) in server components. Use \`useTranslations\` (hook) only in client components.

### Client Component (\`'use client'\`)
\`\`\`tsx
'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';

export default function Navigation() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav>
      <Link href="/about">{t('about')}</Link>
      <button onClick={() => router.push('/contact')}>{t('contact')}</button>
    </nav>
  );
}
\`\`\`

## 5. Checklist

- [ ] Params typed as \`Promise\` and awaited in layouts/pages.
- [ ] \`setRequestLocale(locale)\` called before server translations.
- [ ] \`NextIntlClientProvider\` wraps app under \`[locale]/layout.tsx\`.
- [ ] Navigation uses \`@/i18n/navigation\` wrappers.
- [ ] Proxy matcher includes unprefixed routes.
`,"skills/skill-posthog-analytics.md":`---
skill_name: skill-posthog-analytics
version: "1.0"
framework: Next.js
last_verified: "2025-12-26"
always_attach: false
priority: 5
triggers:
  - posthog
  - posthog-js
  - posthog-node
  - "@posthog/react"
  - analytics
  - pageview
  - "$pageview"
  - "$pageleave"
  - autocapture
  - server-only
  - client-only
  - runtime = 'nodejs'
---

<!--
LLM INSTRUCTION: Use for PostHog analytics in Next.js App Router.
Strictly separate client tracking (posthog-js/@posthog/react) from server tracking (posthog-node).
Mark server analytics modules as server-only and client analytics modules as client-only to prevent cross-imports.
Server tracking must run in Node runtime (not Edge); set export const runtime = 'nodejs' where needed.
Prefer PostHog SPA pageview auto-tracking; only use manual $pageview/$pageleave when required.
Always flush server events in short-lived runtimes (flushAt: 1, flushInterval: 0, shutdown()).
-->

# PostHog Analytics (Next.js App Router)

> **Target:** Next.js App Router | **Last Verified:** 2025-12-26

## 1. What AI Models Get Wrong

- Importing \`posthog-node\` into client bundles (causes runtime/bundle issues).
- Using browser-only APIs on the server (\u201Cwindow is not defined\u201D).
- Running server tracking in Edge runtime.
- Double-tracking pageviews (auto + manual).
- Not flushing server events in serverless/short-lived execution.

## 2. Golden Rules

### \u2705 DO
- **Client:** \`posthog-js\` + \`@posthog/react\` in \`'use client'\` components only.
- **Server:** \`posthog-node\` in server-only modules only; flush events on completion.
- Enforce separation with \`import 'server-only'\` and optionally \`import 'client-only'\`.
- Prefer SPA pageview auto-tracking; standardize one approach.
- For server handlers/actions using PostHog Node SDK, ensure \`export const runtime = 'nodejs'\` if your project uses Edge elsewhere.

### \u274C DON'T
- Don\u2019t import server tracking helpers in client components.
- Don\u2019t rely on server tracking in Edge.
- Don\u2019t mix auto and manual pageview capture without a clear reason.

## 3. Environment Variables

Client (public):

\`\`\`bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
\`\`\`

Server (keep separate names to avoid accidental client coupling):

\`\`\`bash
POSTHOG_SERVER_KEY=phc_...
POSTHOG_SERVER_HOST=https://us.i.posthog.com
\`\`\`

## 4. Client Setup (Provider)

\`\`\`tsx
// app/providers.tsx
'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from '@posthog/react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
\`\`\`

Wrap in \`app/layout.tsx\` without forcing full client rendering (boundary is fine).

## 5. Pageview Tracking

- Prefer built-in SPA pageview auto-tracking (don\u2019t manually capture unless you disable it).
- If manual is required:
  - disable auto (\`capture_pageview: false\`)
  - capture both \`$pageview\` and \`$pageleave\` (use \`sendBeacon\` for leave).

## 6. Server Setup (\`posthog-node\`)

\`\`\`ts
// src/lib/posthog-server.ts
import 'server-only';
import { PostHog } from 'posthog-node';

export function PostHogServer() {
  return new PostHog(process.env.POSTHOG_SERVER_KEY!, {
    host: process.env.POSTHOG_SERVER_HOST!,
    flushAt: 1,
    flushInterval: 0
  });
}
\`\`\`

Use in a route handler/action and \`await posthog.shutdown()\` in \`finally\`.

## 7. Standard Event Shape (Recommended)

- Event naming: \`[object] [verb]\` (e.g. \`project created\`, \`invite sent\`).
- Include these properties on all custom events:
  - \`source: 'client' | 'server'\`
  - \`app: 'web'\`
  - \`router: 'app'\`
  - domain IDs (\`org_id\`, \`project_id\`, etc.)

## 8. Checklist

- [ ] Client and server analytics code is split and enforced via \`server-only\` / \`client-only\`.
- [ ] Server tracking runs in Node runtime and flushes on completion.
- [ ] Pageview strategy chosen (auto vs manual) and not duplicated.
- [ ] Custom event naming and core properties standardized.
`,"skills/skill-routing-layouts.md":`---
skill_name: skill-routing-layouts
version: "16.0.10"
framework: Next.js
last_verified: "2025-12-18"
always_attach: false
priority: 7
triggers:
  - parallel route
  - "@modal"
  - "@slot"
  - default.js
  - default.tsx
  - intercepting route
  - layout.tsx
  - loading.js
  - error.js
  - route group
---

<!--
LLM INSTRUCTION: Apply when user creates pages, modals, layouts, or navigation.
CRITICAL: Every parallel route @slot MUST have a default.tsx file (even if it returns null).
Params in layouts are ALSO Promises - must await them just like in pages.
Intercepting routes: (.) = same level, (..) = parent, (...) = root.
error.js MUST have 'use client' directive. loading.js is auto-Suspense.
Do NOT use _app.js, _document.js, or next/router - those are Pages Router patterns.
-->

# Routing & Layouts

> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18

## 1. What AI Models Get Wrong

- **Omitting \`default.js\` in parallel routes** \u2192 LLMs forget this file. v16 build fails without it for every @slot.
- **Using sync params in layouts** \u2192 LLMs access params directly. In v16, layout params are Promises too.
- **Confusing intercepting route syntax** \u2192 LLMs mix up \`(.)\` vs \`(..)\` vs \`(...)\` conventions.
- **Using Pages Router patterns** \u2192 LLMs suggest \`_app.js\`, \`_document.js\`, \`next/router\` in App Router context.
- **Creating page.tsx AND route.ts in same folder** \u2192 LLMs don't realize this causes conflicts.

## 2. Golden Rules

### \u2705 DO
- **Create \`default.js\` for every parallel route @slot** \u2192 Required fallback for soft navigation
- **Await params in layouts** \u2192 Layouts receive \`Promise<{ slug: string }>\` too
- **Use \`(.)\` for same-level intercept, \`(..)\` for parent** \u2192 Precise routing semantics
- **Use \`loading.js\` for Suspense boundaries** \u2192 Automatic loading UI per segment
- **error.js must be 'use client'** \u2192 Error boundaries are client components

### \u274C DON'T  
- **Don't skip default.js** \u2192 Causes 404 or build failure in v16
- **Don't access layout params synchronously** \u2192 They're Promises
- **Don't use \`_app.js\`, \`_document.js\`** \u2192 App Router uses layout.tsx
- **Don't use \`next/router\`** \u2192 Use \`next/navigation\` in App Router
- **Don't have page.tsx and route.ts together** \u2192 Same segment conflict

## 3. Critical Patterns

### Parallel Routes with Default.js

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`
app/
\u251C\u2500\u2500 @modal/
\u2502   \u2514\u2500\u2500 photo/
\u2502       \u2514\u2500\u2500 [id]/
\u2502           \u2514\u2500\u2500 page.tsx
\u251C\u2500\u2500 layout.tsx
\u2514\u2500\u2500 page.tsx
// Missing default.tsx = BUILD FAILURE in v16
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`
app/
\u251C\u2500\u2500 @modal/
\u2502   \u251C\u2500\u2500 default.tsx      \u2190 REQUIRED
\u2502   \u2514\u2500\u2500 photo/
\u2502       \u2514\u2500\u2500 [id]/
\u2502           \u2514\u2500\u2500 page.tsx
\u251C\u2500\u2500 layout.tsx
\u2514\u2500\u2500 page.tsx
\`\`\`

\`\`\`typescript
// app/@modal/default.tsx
export default function Default() {
  return null; // Render nothing when no modal matches
}

// app/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
\`\`\`
**Why:** When navigating away from /photo/123, Next needs default.tsx to know what to render in @modal slot.

---

### Async Params in Layouts

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// Sync access in layout - CRASHES
export default function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string }; // Wrong type
}) {
  return (
    <div>
      <h1>Blog: {params.slug}</h1> {/* Error: params is Promise */}
      {children}
    </div>
  );
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>; // Promise type
}) {
  const { slug } = await params; // Await required
  
  return (
    <div className="blog-layout">
      <aside>Current Post: {slug}</aside>
      {children}
    </div>
  );
}
\`\`\`
**Why:** All params are Promises in v16 to support PPR streaming.

---

### Intercepting Routes Syntax

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`
app/
\u251C\u2500\u2500 feed/
\u2502   \u2514\u2500\u2500 (..)photo/      \u2190 Wrong: should match route structure
\u2502       \u2514\u2500\u2500 [id]/
\u2502           \u2514\u2500\u2500 page.tsx
\u2514\u2500\u2500 photo/
    \u2514\u2500\u2500 [id]/
        \u2514\u2500\u2500 page.tsx
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`
app/
\u251C\u2500\u2500 @modal/
\u2502   \u2514\u2500\u2500 (.)photo/       \u2190 (.) = same level intercept
\u2502       \u2514\u2500\u2500 [id]/
\u2502           \u2514\u2500\u2500 page.tsx
\u251C\u2500\u2500 feed/
\u2502   \u2514\u2500\u2500 (..)photo/      \u2190 (..) = one level up intercept  
\u2502       \u2514\u2500\u2500 [id]/
\u2502           \u2514\u2500\u2500 page.tsx
\u251C\u2500\u2500 photo/
\u2502   \u2514\u2500\u2500 [id]/
\u2502       \u2514\u2500\u2500 page.tsx    \u2190 Full page (hard navigation)
\u2514\u2500\u2500 layout.tsx
\`\`\`

**Syntax Reference:**
- \`(.)\` - Intercept from same level
- \`(..)\` - Intercept from one level up
- \`(..)(..)\` - Two levels up
- \`(...)\` - Intercept from app root

**Why:** Soft navigation shows intercepted modal; hard refresh shows full page.

---

### Loading.js and Error.js

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// Manual loading state in page
'use client';
export default function Page() {
  const [loading, setLoading] = useState(true);
  // ... manual spinner logic
}

// error.js as Server Component
export default function Error({ error }) { // Missing 'use client'
  return <div>Error: {error.message}</div>;
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
// app/dashboard/loading.tsx - Automatic Suspense
export default function Loading() {
  return <div className="skeleton">Loading dashboard...</div>;
}

// app/dashboard/error.tsx - MUST be 'use client'
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
\`\`\`
**Why:** loading.js auto-wraps in Suspense. error.js must be client for reset() interactivity.

---

### Default.js with Async Params

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// Sync params in default.js
export default function Default({ params }: { params: { id: string } }) {
  return <div>Fallback for {params.id}</div>; // Crashes
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
// app/@sidebar/default.tsx
export default async function Default({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <div>Default sidebar for {id}</div>;
}
\`\`\`
**Why:** default.js follows the same async params contract as page.tsx.

## 4. Quick Reference Table

| Feature | \u274C Don't | \u2705 Do |
|---------|---------|------|
| Parallel Routes | Skip default.js | Create default.js for every @slot |
| Layout Params | \`params: { slug: string }\` | \`params: Promise<{ slug: string }>\` |
| Same-level Intercept | Random folder | \`(.)folder\` syntax |
| Parent-level Intercept | \`(.)folder\` | \`(..)folder\` syntax |
| Error Boundary | Server Component | \`'use client'\` directive |
| Loading UI | Manual useState | \`loading.js\` file |
| Global Layout | \`_app.js\` | \`app/layout.tsx\` |
| Navigation | \`next/router\` | \`next/navigation\` |

## 5. Checklist Before Coding

- [ ] Every parallel route @slot has a \`default.tsx\` file
- [ ] Layout components are \`async\` and \`await\` their params
- [ ] Using correct intercept syntax: \`(.)\` same, \`(..)\` parent, \`(...)\` root
- [ ] \`error.js\` files have \`'use client'\` at top
- [ ] No \`_app.js\`, \`_document.js\`, or \`next/router\` usage
- [ ] No page.tsx and route.ts in the same folder
`,"skills/skill-server-actions-mutations.md":`---
skill_name: skill-server-actions-mutations
version: "16.0.10"
framework: Next.js
react_version: "19"
last_verified: "2025-12-18"
always_attach: false
priority: 8
triggers:
  - server action
  - use server
  - useActionState
  - useFormState
  - form action
  - FormData
  - mutation
  - submit
  - zod
  - validation
---

<!--
LLM INSTRUCTION: Apply when user creates forms or server-side mutations.
SECURITY: Server Actions are PUBLIC HTTP endpoints. ALWAYS validate with Zod.
REACT 19 CHANGE: useFormState is RENAMED to useActionState. Import from 'react' not 'react-dom'.
CRITICAL: redirect() throws an error intentionally - NEVER catch it in try/catch.
Use .bind() for passing IDs, NOT hidden inputs (which are tamperable).
-->

# Server Actions & Mutations

> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18

## 1. What AI Models Get Wrong

- **Using \`useFormState\` from 'react-dom'** \u2192 LLMs use React 18 import. React 19 renames to \`useActionState\` from 'react'.
- **Skipping Zod validation** \u2192 LLMs trust FormData directly. Server Actions are public endpoints\u2014validation is mandatory.
- **Placing \`redirect()\` inside try/catch** \u2192 LLMs catch the redirect error. redirect() throws intentionally and must not be caught.
- **Defining actions in 'use client' files** \u2192 LLMs put 'use server' inside client components. Actions must be in server files.
- **Using hidden inputs for IDs** \u2192 LLMs use \`<input type="hidden">\` for passing IDs. Use \`.bind()\` for secure argument passing.

## 2. Golden Rules

### \u2705 DO
- **Validate ALL input with Zod** \u2192 Server Actions are public HTTP endpoints
- **Use \`useActionState\` from 'react'** \u2192 React 19's renamed hook with isPending
- **Use \`.bind()\` for secure argument passing** \u2192 Prevents client tampering
- **Place \`redirect()\` outside try/catch** \u2192 It throws to trigger navigation
- **Call \`revalidateTag()\` after mutations** \u2192 Update cached data

### \u274C DON'T  
- **Don't trust FormData** \u2192 Always validate server-side
- **Don't use \`useFormState\`** \u2192 Renamed to useActionState in React 19
- **Don't catch redirect/notFound errors** \u2192 They throw intentionally
- **Don't define 'use server' in 'use client' files** \u2192 Invalid, actions must be separate
- **Don't use hidden inputs for sensitive IDs** \u2192 Use .bind() instead

## 3. Critical Patterns

### Secure Server Action with Zod

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
'use server';

export async function createUser(formData: FormData) {
  // Trusting raw FormData - SECURITY RISK
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  
  await db.user.create({ email, role }); // No validation!
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

const schema = z.object({
  email: z.string().email(),
  role: z.enum(['user', 'admin']),
});

type CreateUserState =
  | {
      error: string;
      issues?: Record<string, string[]>;
    }
  | null;

export async function createUser(_prevState: CreateUserState, formData: FormData): Promise<CreateUserState> {
  // 1. Authentication
  const session = await auth();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  // 2. Validation (MANDATORY)
  const parsed = schema.safeParse({
    email: formData.get('email'),
    role: formData.get('role'),
  });

  if (!parsed.success) {
    return { error: 'Invalid input', issues: parsed.error.flatten().fieldErrors };
  }

  // 3. Mutation
  try {
    await db.user.create({ data: parsed.data });
  } catch (e) {
    return { error: 'Database error' };
  }

  // 4. Redirect (OUTSIDE try/catch)
  redirect('/users');
}
\`\`\`
**Why:** Server Actions are public endpoints. Zod validation is non-negotiable security.

---

### useActionState (React 19)

**\u274C WRONG (v14/React 18 - Hallucination Risk):**
\`\`\`typescript
'use client';
import { useFormState } from 'react-dom'; // WRONG import

export function UserForm() {
  const [state, action] = useFormState(createUser, null); // Missing isPending
  
  return <form action={action}>...</form>;
}
\`\`\`

**\u2705 CORRECT (v16/React 19):**
\`\`\`typescript
'use client';
import { useActionState } from 'react'; // Correct import
import { createUser } from './actions';

export function UserForm() {
  // React 19: [state, dispatch, isPending]
  const [state, formAction, isPending] = useActionState(createUser, null);

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      
      {state?.issues?.email && (
        <span className="error">{state.issues.email}</span>
      )}
      
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </button>
      
      {state?.error && <div className="error">{state.error}</div>}
    </form>
  );
}
\`\`\`
**Why:** React 19 renamed useFormState to useActionState and added isPending as third return value.

---

### Secure Argument Binding

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// Hidden inputs can be tampered with in DevTools
export function DeleteButton({ userId }: { userId: string }) {
  return (
    <form action={deleteUser}>
      <input type="hidden" name="userId" value={userId} /> {/* Tamperable! */}
      <button>Delete</button>
    </form>
  );
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
// Server Component - .bind() is secure
export function DeleteButton({ userId }: { userId: string }) {
  const deleteUserWithId = deleteUser.bind(null, userId);
  
  return (
    <form action={deleteUserWithId}>
      <button>Delete</button>
    </form>
  );
}

// actions.ts
'use server';
export async function deleteUser(userId: string, formData: FormData) {
  // userId is bound server-side, client cannot tamper
  await db.user.delete({ where: { id: userId } });
  revalidateTag('users');
}
\`\`\`
**Why:** .bind() serializes arguments in the React Server Components closure, not in client HTML.

---

### Redirect Outside Try/Catch

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
'use server';

export async function submitForm(formData: FormData) {
  try {
    await db.insert(formData);
    redirect('/success'); // CAUGHT by catch block!
  } catch (e) {
    return { error: 'Failed' }; // Redirect never happens
  }
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
'use server';
import { redirect } from 'next/navigation';

export async function submitForm(formData: FormData) {
  let success = false;
  
  try {
    await db.insert(formData);
    success = true;
  } catch (e) {
    return { error: 'Database error' };
  }

  // Redirect OUTSIDE try/catch
  if (success) {
    redirect('/success');
  }
}
\`\`\`
**Why:** redirect() throws a NEXT_REDIRECT error to trigger navigation. Catching it prevents the redirect.

---

### useFormStatus for Submit Buttons

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// Prop drilling isPending to button
export function Form({ isPending }: { isPending: boolean }) {
  return (
    <form>
      <SubmitButton disabled={isPending} />
    </form>
  );
}
\`\`\`

**\u2705 CORRECT (v16/React 19):**
\`\`\`typescript
'use client';
import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

// Usage - no prop drilling needed
export function Form() {
  return (
    <form action={submitAction}>
      <input name="email" />
      <SubmitButton /> {/* Reads pending from parent form */}
    </form>
  );
}
\`\`\`
**Why:** useFormStatus reads status from the nearest parent form without prop drilling.

## 4. Quick Reference Table

| Feature | \u274C Don't | \u2705 Do |
|---------|---------|------|
| Form Hook | \`useFormState\` from 'react-dom' | \`useActionState\` from 'react' |
| Validation | Trust raw FormData | Validate with Zod (mandatory) |
| Pass IDs | \`<input type="hidden">\` | \`.bind(null, id)\` |
| Redirect | Inside try/catch | Outside try/catch block |
| Action Files | 'use server' in 'use client' file | Separate actions.ts file |
| Button State | Prop drilling isPending | \`useFormStatus\` hook |
| After Mutation | Forget cache | \`revalidateTag()\` or \`router.refresh()\` |

## 5. Checklist Before Coding

- [ ] Server Action file has \`'use server'\` at top (not inside 'use client' file)
- [ ] All input validated with Zod before any database operations
- [ ] Using \`useActionState\` from 'react' (not useFormState from 'react-dom')
- [ ] \`redirect()\` and \`notFound()\` calls are outside try/catch blocks
- [ ] Using \`.bind()\` for passing IDs instead of hidden inputs
- [ ] Calling \`revalidateTag()\` or \`router.refresh()\` after mutations
`,"skills/skill-supabase-ssr.md":`---
skill_name: skill-supabase-ssr
version: "1.0"
framework: Next.js
last_verified: "2025-12-29"
always_attach: false
priority: 8
triggers:
  - "@supabase/ssr"
  - supabase ssr
  - supabase auth
  - createServerClient
  - createBrowserClient
  - proxy.ts
  - cookies.setAll
  - next/headers
  - getUser
  - getClaims
  - getSession
  - rls
  - auth.uid()
  - "@supabase/auth-helpers-nextjs"
---

<!--
LLM INSTRUCTION: Use for Supabase Auth in Next.js App Router with @supabase/ssr.
FORBID: @supabase/auth-helpers-nextjs (deprecated; don't mix with @supabase/ssr).
Use separate clients: createBrowserClient (client components) and createServerClient (server).
Server Components may throw on setting cookies: wrap cookies.setAll in try/catch.
Use a Proxy (proxy.ts) to refresh sessions and write cookies to BOTH request and response to avoid desync.
Never rely on getSession() for server-side protection; prefer getClaims() (JWT verification) or getUser() (server revalidation).
Coordinate RLS policies with schema: policies depend on columns like user_id/tenant_id and auth.uid().
-->

# Supabase Auth (SSR) for Next.js App Router

> **Target:** Next.js + \`@supabase/ssr\` | **Last Verified:** 2025-12-29

## 1. What AI Models Get Wrong

- Using \`@supabase/auth-helpers-nextjs\` (deprecated) or mixing it with \`@supabase/ssr\`.
- Creating a server client as a module singleton (can bleed cookie state across requests).
- Forgetting the Proxy session refresh step (tokens drift; server components can\u2019t reliably set cookies).
- Not updating both \`request.cookies\` and \`response.cookies\` in the Proxy.
- Trusting \`getSession()\` for server-side authorization decisions.

## 2. Golden Rules

### \u2705 DO
- Use \`@supabase/ssr\` only; uninstall \`@supabase/auth-helpers-nextjs\`.
- Use **two clients**:
  - \`createBrowserClient\` for Client Components.
  - \`createServerClient\` for Server Components/Actions/Route Handlers with cookie plumbing.
- In Server Components, implement \`cookies.getAll()\` + \`cookies.setAll()\` and **catch \`setAll\` errors**.
- Use \`proxy.ts\` to refresh sessions early and keep cookies consistent per request.
- For server-side protection, use \`getClaims()\` (recommended) or \`getUser()\` (strongest, revalidated).

### \u274C DON'T
- Don\u2019t trust \`getSession()\` in server code for protection.
- Don\u2019t set cookies in Server Components without guarding for runtime errors.
- Don\u2019t ship schema changes without matching RLS updates.

## 3. Minimal File Layout

\`\`\`
proxy.ts                    # Root Next.js middleware entrypoint
lib/supabase/client.ts      # Browser client (createBrowserClient)
lib/supabase/server.ts      # Server client (createServerClient)
lib/supabase/proxy.ts       # Session refresh with getClaims()
\`\`\`

## 4. Client Component: Browser Client

\`\`\`ts
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
\`\`\`

## 5. Server: Per-request Client + Cookie Safety

\`\`\`ts
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components can throw on cookie writes.
            // Safe to ignore IF proxy.ts refreshes sessions.
          }
        }
      }
    }
  );
}
\`\`\`

## 6. Proxy Session Refresh (Required)

### Root \`proxy.ts\`
\`\`\`ts
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
\`\`\`

### Session updater (\`lib/supabase/proxy.ts\`)
\`\`\`ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  // IMPORTANT: Avoid writing logic between createServerClient(...) and getClaims().
  // IMPORTANT: Don't remove getClaims(); it both validates and keeps sessions/cookies in sync.
  await supabase.auth.getClaims();

  return response;
}
\`\`\`

## 7. Authorization Guidance (Server-side)

- **Never** rely on \`supabase.auth.getSession()\` for server protection (it reads from storage/cookies and is not a strong guarantee).
- Use \`supabase.auth.getClaims()\` to protect pages/user data when JWT validation is sufficient (verifies against JWKS/public keys; commonly used in middleware/proxy).
- Use \`supabase.auth.getUser()\` when you need the strongest server-side check (revalidated with Supabase Auth).

## 8. RLS + Schema Coordination (Security Invariant)

- RLS is the enforcement layer; without policies it is effectively default-deny.
- Policies commonly use \`auth.uid()\`; schema must include the columns used by policies (\`user_id\`, \`tenant_id\`, etc.).
- Ship table changes and RLS policy updates together (same PR/migration unit).

## 9. Checklist

- [ ] \`@supabase/auth-helpers-nextjs\` removed and not used.
- [ ] Browser code uses \`createBrowserClient\`.
- [ ] Server code uses per-request \`createServerClient\` with \`getAll/setAll\` cookie plumbing.
- [ ] \`setAll\` errors are caught in Server Components.
- [ ] \`proxy.ts\` refreshes sessions and updates both request and response cookies.
- [ ] Server protection uses \`getClaims()\` or \`getUser()\` (not \`getSession()\`).
- [ ] RLS policies and schema evolve together.
`,"skills/skill-tailwindcss-v4.md":`---
skill_name: skill-tailwindcss-v4
version: "4.x"
framework: Tailwind CSS
last_verified: "2025-12-26"
always_attach: false
priority: 6
triggers:
  - tailwind v4
  - tailwindcss v4
  - tailwindcss
  - "@theme"
  - "@source"
  - "@config"
  - "@tailwindcss/postcss"
  - postcss.config
  - globals.css
  - tw-animate-css
  - tailwind.config.js
---

<!--
LLM INSTRUCTION: Use for Tailwind CSS v4 (CSS-first). Prevent generating tailwind.config.js by default.
v4 entry is @import "tailwindcss"; (do not emit @tailwind base/components/utilities).
Theme tokens live in @theme as CSS custom properties; use :root only for non-Tailwind vars.
PostCSS plugin is @tailwindcss/postcss.
For extra scan sources, prefer @source in CSS over a JS config.
Only create a JS config when explicitly required; load it via @config (not auto-detected).
tw-animate-css is CSS-first; import it in CSS.
-->

# Tailwind CSS v4 (CSS-first)

> **Target:** Tailwind CSS v4 | **Last Verified:** 2025-12-26

## 1. What AI Models Get Wrong

- **Generating \`tailwind.config.js\` by default** (v4 is CSS-first; avoid JS config unless required).
- **Using v3 directives** (\`@tailwind base/components/utilities\`) instead of \`@import "tailwindcss";\`.
- **Putting design tokens in JS** instead of \`@theme\` variables.
- **Adding a \`content: []\` scan array** (prefer auto-detection; use \`@source\` when needed).
- **Using \`theme()\`** (prefer generated CSS variables).

## 2. Golden Rules

### \u2705 DO
- Use \`@import "tailwindcss";\` as the Tailwind entry in \`globals.css\`.
- Define Tailwind tokens in \`@theme { --color-...; --font-...; --breakpoint-...; }\`.
- Configure PostCSS with the \`@tailwindcss/postcss\` plugin.
- Use \`@source\` in CSS for monorepo/external scan sources.
- Import \`tw-animate-css\` in CSS when needed.

### \u274C DON'T
- Don\u2019t create \`tailwind.config.js\` unless explicitly required.
- Don\u2019t emit \`@tailwind base/components/utilities\` (v3 pattern).
- Don\u2019t use \`theme()\` for new code (prefer \`var(--...)\`).

## 3. Minimal Setup (Next.js-friendly)

### Install
\`\`\`bash
npm i tailwindcss @tailwindcss/postcss postcss
\`\`\`

### \`postcss.config.mjs\`
\`\`\`js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
\`\`\`

### \`app/globals.css\` (or \`src/app/globals.css\`)
\`\`\`css
@import "tailwindcss";
\`\`\`

## 4. Tokens: \`@theme\` vs \`:root\`

### Tailwind tokens (generate utilities)
\`\`\`css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.62 0.2 250);
  --font-sans: ui-sans-serif, system-ui, sans-serif;
  --breakpoint-3xl: 120rem;
  --radius-lg: 0.75rem;
}
\`\`\`

### Non-Tailwind variables (do not generate utilities)
\`\`\`css
:root {
  --marketing-site-max-width: 72rem;
}
\`\`\`

## 5. Content Scanning

- Default: rely on v4 auto-detection.
- If you must include extra sources (monorepos/external packages), add \`@source\`:

\`\`\`css
@import "tailwindcss";
@source "../packages/ui";
@source "../node_modules/@my-company/ui-lib";
\`\`\`

## 6. Legacy Escape Hatch (only when required): \`@config\`

If a legacy Tailwind config is unavoidable, load it explicitly:

\`\`\`css
@import "tailwindcss";
@config "../../tailwind.config.js";
\`\`\`

## 7. \`tw-animate-css\` (Tailwind v4)

### Install
\`\`\`bash
npm i -D tw-animate-css
\`\`\`

### Import in CSS
\`\`\`css
@import "tailwindcss";
@import "tw-animate-css";
\`\`\`

### Pattern: data-state driven animations
\`\`\`tsx
export function Toast({ show }: { show: boolean }) {
  return (
    <div
      data-state={show ? "show" : "hide"}
      className="
        data-[state=show]:animate-in
        data-[state=hide]:animate-out
        fade-in fade-out
        slide-in-from-top-8 slide-out-to-top-8
        duration-500
      "
    />
  );
}
\`\`\`

## 8. Checklist

- [ ] No \`tailwind.config.js\` added unless explicitly required.
- [ ] \`globals.css\` uses \`@import "tailwindcss";\`.
- [ ] Tokens live in \`@theme\` (Tailwind) or \`:root\` (non-Tailwind).
- [ ] \`postcss.config.*\` uses \`@tailwindcss/postcss\`.
- [ ] Extra scan sources use \`@source\` (not \`content: []\`).
- [ ] \`tw-animate-css\` imported in CSS when used.
`,"skills/skill-typescript-config.md":`---
skill_name: skill-typescript-config
version: "16.0.10"
framework: Next.js
react_version: "19"
last_verified: "2025-12-18"
always_attach: false
priority: 6
triggers:
  - next.config
  - typescript
  - type error
  - Promise type
  - tsconfig
  - server-only
  - experimental
  - cacheComponents
  - "@types/react"
---

<!--
LLM INSTRUCTION: Apply when user has type errors or config issues.
Use next.config.ts (TypeScript) not next.config.js.
Remove experimental.serverActions - it's stable in v16.
Use cacheComponents: true instead of experimental.ppr.
All params must be typed as Promise<...> - your v14 training types are WRONG.
@types/react must be v19 for async components to work.
Use 'server-only' package to prevent accidental client imports.
moduleResolution should be "bundler" not "node".
-->

# TypeScript & Config

> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18

## 1. What AI Models Get Wrong

- **Using \`next.config.js\`** \u2192 LLMs use JavaScript config. v16 officially supports \`next.config.ts\` with type safety.
- **Using \`experimental.serverActions\`** \u2192 LLMs enable this flag. Server Actions are stable in v16, no flag needed.
- **Using \`experimental.ppr\`** \u2192 LLMs suggest this flag. In v16, use \`cacheComponents: true\` instead.
- **Wrong Promise types for props** \u2192 LLMs type params as objects. In v16, they must be \`Promise<...>\`.
- **Importing server-only in 'use client'** \u2192 LLMs import database modules in client files. This causes build failure.

## 2. Golden Rules

### \u2705 DO
- **Use \`next.config.ts\`** \u2192 Typed configuration with autocomplete
- **Type params as Promises** \u2192 \`params: Promise<{ slug: string }>\`
- **Upgrade @types/react to v19** \u2192 Fixes async component type errors
- **Use \`server-only\` package** \u2192 Prevents accidental client imports
- **Set \`cacheComponents: true\`** \u2192 Enables 'use cache' and PPR

### \u274C DON'T  
- **Don't use \`experimental.serverActions\`** \u2192 Stable in v16, no flag needed
- **Don't use \`experimental.ppr\`** \u2192 Use \`cacheComponents\` instead
- **Don't import server code in 'use client' files** \u2192 Build failure
- **Don't use old @types/react** \u2192 Causes async component errors
- **Don't use \`publicRuntimeConfig\`** \u2192 Removed, use env variables

## 3. Critical Patterns

### Typed next.config.ts

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`javascript
// next.config.js - No type safety
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // Not needed in v16!
    ppr: true, // Wrong flag
  },
};

module.exports = nextConfig;
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
// next.config.ts - Typed configuration
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // v16 Caching - replaces experimental.ppr
  cacheComponents: true,
  
  // Logging for debugging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
  // Optional: typed routes
  experimental: {
    typedRoutes: true,
  },
  
  // Custom cache profiles
  cacheLife: {
    'blog-posts': {
      stale: 3600,
      revalidate: 900,
      expire: 86400,
    },
  },
};

export default nextConfig;
\`\`\`
**Why:** TypeScript config provides autocomplete and catches invalid options at compile time.

---

### Promise Props Type Errors

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// Error: Property 'slug' does not exist on type 'Promise<...>'
interface Props {
  params: { slug: string }; // Wrong type
}

export default function Page({ params }: Props) {
  return <h1>{params.slug}</h1>; // Type error AND runtime error
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
// Correct Promise types
interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  
  return <h1>{slug}</h1>;
}

// For layouts
interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { slug } = await params;
  return <div data-slug={slug}>{children}</div>;
}
\`\`\`
**Why:** v16 types params as Promises to support PPR streaming architecture.

---

### Async Component Type Errors

**\u274C WRONG (v14/React 18 types - Hallucination Risk):**
\`\`\`typescript
// Error: 'Page' cannot be used as a JSX component
// This happens with old @types/react
export default async function Page() {
  const data = await fetch('https://api.example.com/data').then(r => r.json());
  return <div>{data.title}</div>;
}
\`\`\`

**\u2705 CORRECT (v16/React 19 types):**
\`\`\`json
// package.json - Ensure React 19 types
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^16.0.10"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.0.0"
  }
}
\`\`\`

\`\`\`typescript
// Now async components work without errors
export default async function Page() {
  const data = await fetch('https://api.example.com/data').then(r => r.json());
  return <div>{data.title}</div>;
}
\`\`\`
**Why:** React 19 types support async components natively; old v18 types don't.

---

### Server-Only Module Protection

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// lib/db.ts - Can accidentally be imported in client
import { prisma } from './prisma';

export async function getUsers() {
  return prisma.user.findMany();
}

// components/UserList.tsx
'use client';
import { getUsers } from '../lib/db'; // BUILD FAILURE
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`typescript
// lib/db.ts - Protected with server-only
import 'server-only'; // Import at top of file
import { prisma } from './prisma';

export async function getUsers() {
  return prisma.user.findMany();
}

// components/UserList.tsx
'use client';
// Cannot import from db.ts - build error with clear message:
// "You're importing a component that needs server-only"

// Instead, pass data as props from Server Component
export function UserList({ users }: { users: User[] }) {
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
\`\`\`
**Why:** \`server-only\` package prevents accidental imports in client bundles.

---

### Module Resolution Issues

**\u274C WRONG (v14/v15 - Hallucination Risk):**
\`\`\`typescript
// tsconfig.json with loose settings
{
  "compilerOptions": {
    "moduleResolution": "node", // May cause issues
    "paths": {
      "@/*": ["./src/*"] // Path doesn't match actual structure
    }
  }
}
\`\`\`

**\u2705 CORRECT (v16):**
\`\`\`json
// tsconfig.json - Correct settings for Next 16
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      { "name": "next" }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
\`\`\`
**Why:** \`moduleResolution: "bundler"\` is recommended for Next 16 with modern bundlers.

## 4. Quick Reference Table

| Feature | \u274C Don't | \u2705 Do |
|---------|---------|------|
| Config File | \`next.config.js\` | \`next.config.ts\` |
| Server Actions | \`experimental.serverActions\` | Remove (stable) |
| PPR | \`experimental.ppr\` | \`cacheComponents: true\` |
| Params Type | \`{ slug: string }\` | \`Promise<{ slug: string }>\` |
| React Types | \`@types/react@18\` | \`@types/react@19\` |
| Server Code | Unprotected | \`import 'server-only'\` |
| Runtime Config | \`publicRuntimeConfig\` | Environment variables |
| Module Resolution | \`"node"\` | \`"bundler"\` |

## 5. Checklist Before Coding

- [ ] Using \`next.config.ts\` (not .js) with \`NextConfig\` type
- [ ] Removed \`experimental.serverActions\` (stable in v16)
- [ ] Using \`cacheComponents: true\` instead of \`experimental.ppr\`
- [ ] All params/searchParams typed as \`Promise<...>\`
- [ ] \`@types/react\` and \`@types/react-dom\` are v19
- [ ] Server-only modules import \`'server-only'\` at top
- [ ] \`tsconfig.json\` uses \`moduleResolution: "bundler"\`
`,"skills/skill-vitest-playwright-testing.md":`---
skill_name: skill-vitest-playwright-testing
version: "1.0"
framework: Next.js
last_verified: "2025-12-26"
always_attach: false
priority: 6
triggers:
  - vitest
  - playwright
  - @vitejs/plugin-react
  - jsdom
  - vitest.config
  - playwright.config
  - "*.test.ts"
  - "*.test.tsx"
  - tests/*.spec.ts
  - coverage
  - next/headers
  - cookies()
  - headers()
  - supabase
  - vi.mock
---

<!--
LLM INSTRUCTION: Use for repositories that run Vitest for unit/component tests and Playwright for E2E.
Keep unit tests as *.test.ts(x) and Playwright tests under tests/*.spec.ts.
Vitest must exclude tests/**; Playwright must use testDir: 'tests'.
Mock next/headers (cookies/headers) in Vitest when code depends on request scope.
Prefer mocking your own Supabase wrapper module rather than mocking @supabase/supabase-js directly.
Coverage config should include provider, reporters, include/exclude, and thresholds; run coverage via CLI flag.
-->

# Testing Stack: Vitest + Playwright (Next.js / React)

> **Target:** Next.js + React | **Last Verified:** 2025-12-26

## 1. What AI Models Get Wrong

- Mixing unit + E2E file patterns so runners pick up the wrong tests.
- Forgetting \`@vitejs/plugin-react\` or \`jsdom\` in Vitest for React DOM tests.
- Not providing a shared \`vitest.setup.ts\` (matchers + global mocks).
- Trying to unit-test async Server Component flows instead of using Playwright.
- Breaking request-scoped code by not mocking \`next/headers\` (\`cookies()\` / \`headers()\`).

## 2. Golden Rules

### \u2705 DO
- **Vitest:** \`*.test.ts\` / \`*.test.tsx\` for unit/component tests.
- **Playwright:** \`tests/*.spec.ts\` for E2E tests.
- Ensure **Vitest excludes \`tests/**\`** and **Playwright uses \`testDir: 'tests'\`**.
- Use \`vitest.setup.ts\` for \`@testing-library/jest-dom/vitest\` and shared mocks.
- Mock \`next/headers\` in unit tests when server code touches cookies/headers.
- Run E2E against \`build\` + \`start\` for realism.

### \u274C DON'T
- Don\u2019t let Vitest execute Playwright specs (keep patterns separated).
- Don\u2019t rely on real request context in unit tests.
- Don\u2019t unit-test full server flows that depend on Next.js runtime; prefer Playwright.

## 3. Vitest Baseline

### \`vitest.config.ts\`
\`\`\`ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['tests/**', 'node_modules/**', '.next/**', 'dist/**'],
    setupFiles: ['./vitest.setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx}',
        'tests/**',
        '.next/**',
        'dist/**',
        '**/*.d.ts'
      ],
      thresholds: { lines: 80, functions: 80, statements: 80, branches: 70 }
    }
  }
});
\`\`\`

### \`vitest.setup.ts\`
\`\`\`ts
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

const cookieStore = {
  get: vi.fn((name: string) => ({ name, value: 'cookie' })),
  getAll: vi.fn(() => []),
  set: vi.fn(),
  delete: vi.fn()
};

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => cookieStore),
  headers: vi.fn(async () => new Headers({ 'user-agent': 'vitest' }))
}));
\`\`\`

## 4. Supabase Mocking Pattern

Prefer a wrapper module (example): \`src/lib/supabase/client.ts\` exporting a single \`supabase\` client.
Mock that wrapper in unit tests instead of mocking \`@supabase/supabase-js\` internals.

## 5. Playwright Baseline

### \`playwright.config.ts\`
\`\`\`ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  testMatch: /.*\\\\.spec\\\\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
\`\`\`

## 6. Required Scripts

\`\`\`json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:coverage": "vitest run --coverage.enabled",
    "test:e2e": "npm run build && npx playwright test"
  }
}
\`\`\`

## 7. Checklist

- [ ] Unit tests use \`*.test.ts(x)\` and exclude \`tests/**\`.
- [ ] E2E tests live in \`tests/*.spec.ts\` and Playwright uses \`testDir: 'tests'\`.
- [ ] \`vitest.setup.ts\` exists and includes jest-dom matchers.
- [ ] \`next/headers\` is mocked in unit tests where needed.
- [ ] Coverage has provider + reporters + include/exclude + thresholds.
- [ ] E2E runs against production build (\`build\` + \`start\`).
`};var Qd=`# How Kanban2Code Works

Welcome to your new Kanban board!

## Folder Structure
- **inbox/**: New tasks start here.
- **projects/**: Organize tasks by project.
- **_archive/**: Completed tasks go here.

## Workflow
1. Create a task in the sidebar.
2. Drag it to 'Plan' or 'Code' on the board.
3. Mark it as 'Completed' to archive it.
`,ep=`# Architecture

Describe your system architecture here.
`,tp=`# Project Details

- **Name:**
- **Goal:**
`,np=`---
created: {date}
stage: inbox
---

# Explore Kanban2Code

This is a sample task. Drag me to 'Plan' to start working on it!
`;var I_=".kanban2code";async function rp(e){let t=Te.join(e,I_);try{throw await he.access(t),new Error("Kanban2Code already initialized.")}catch(r){if(r.code!=="ENOENT")throw r}let n=["inbox","projects","_agents","_providers","_context","_archive"];for(let r of n)await he.mkdir(Te.join(t,r),{recursive:!0});await he.writeFile(Te.join(t,"how-it-works.md"),Qd),await he.writeFile(Te.join(t,"architecture.md"),ep),await he.writeFile(Te.join(t,"project-details.md"),tp);for(let[r,s]of Object.entries(Zd))await he.writeFile(Te.join(t,"_agents",r),s);for(let[r,s]of Object.entries(Xd))await he.writeFile(Te.join(t,"_providers",r),s);for(let[r,s]of Object.entries(Jd)){let i=Te.join(t,"_context",r);await he.mkdir(Te.dirname(i),{recursive:!0}),await he.writeFile(i,s)}await he.writeFile(Te.join(t,"inbox/sample-task.md"),np.replace("{date}",new Date().toISOString())),await he.writeFile(Te.join(t,".gitignore"),`_archive/
`)}var ys=q(require("vscode"));var ns=class{buildCommand(t,n,r){let s=[];t.subcommand&&s.push(t.subcommand),s.push("-p",n),s.push("--model",t.model);for(let a of t.unattended_flags)s.push(a);s.push("--output-format","json");let i=r?.maxTurns??t.safety?.max_turns;return i!==void 0&&s.push("--max-turns",String(i)),r?.systemPrompt&&s.push("--append-system-prompt",r.systemPrompt),r?.sessionId&&s.push("--session-id",r.sessionId),{command:t.cli,args:s}}parseResponse(t,n){let r=t.trim();if(!r)return{success:!1,result:"",error:`CLI exited with code ${n} and no output`};let s;try{s=JSON.parse(r)}catch{return{success:!1,result:r,error:`Failed to parse CLI output as JSON: ${r.slice(0,200)}`}}return s.is_error?{success:!1,result:s.result,error:s.result,sessionId:s.session_id,cost:s.total_cost_usd,turns:s.num_turns}:{success:!0,result:s.result,sessionId:s.session_id,cost:s.total_cost_usd,turns:s.num_turns}}};function tr(e){if(typeof e=="string"){let r=e.trim();return r||void 0}if(Array.isArray(e)){let r=e.map(s=>tr(s)).filter(s=>!!s);return r.length>0?r.join(`
`).trim():void 0}if(!e||typeof e!="object")return;let t=e,n=["result","output_text","text","content","message","final","delta"];for(let r of n){let s=tr(t[r]);if(s)return s}}var rs=class{buildCommand(t,n,r){let s=[];t.subcommand&&s.push(t.subcommand);for(let a of t.unattended_flags)s.push(a);for(let a of t.output_flags)s.push(a);s.push("--model",t.model);let i=r?.maxTurns??t.safety?.max_turns;if(i!==void 0&&s.push("--max-turns",String(i)),t.config_overrides)for(let[a,o]of Object.entries(t.config_overrides))s.push("-c",`${a}=${String(o)}`);return s.push("-"),{command:t.cli,args:s,stdin:n}}parseResponse(t,n){let r=t.trim();if(!r)return{success:!1,result:"",error:`CLI exited with code ${n} and no output`};let s=r.split(/\r?\n/).map(m=>m.trim()).filter(Boolean),i,a,o,c,l,u=!1;for(let m of s)try{let f=JSON.parse(m);u=!0;let _=tr(f);_&&(i=_),f.is_error===!0&&(a=tr(f.error)??tr(f.message)??"Codex reported an error"),typeof f.error=="string"&&f.error.trim()&&(a=f.error.trim()),typeof f.message=="string"&&String(f.type).toLowerCase()==="error"&&(a=f.message.trim()),typeof f.session_id=="string"?o=f.session_id:typeof f.sessionId=="string"&&(o=f.sessionId),typeof f.total_cost_usd=="number"&&(c=f.total_cost_usd),typeof f.num_turns=="number"&&(l=f.num_turns)}catch{}if(!u)return{success:n===0,result:r,error:n===0?void 0:`CLI exited with code ${n}: ${r.slice(0,200)}`};let d=i??"",p=n===0&&!a;return{success:p,result:d,error:p?void 0:a??`CLI exited with code ${n}`,sessionId:o,cost:c,turns:l}}};var ss=class{buildCommand(t,n,r){let s=[];t.subcommand&&s.push(t.subcommand);for(let a of t.unattended_flags)s.push(a);s.push("--model",t.model),s.push("-p",n);for(let a of t.output_flags)s.push(a);let i=r?.maxTurns??t.safety?.max_turns;return i!==void 0&&s.push("--max-steps-per-turn",String(i)),{command:t.cli,args:s}}parseResponse(t,n){let r=t.trim();return r?{success:n===0,result:r,error:n===0?void 0:`CLI exited with code ${n}: ${r.slice(0,200)}`}:{success:!1,result:"",error:`CLI exited with code ${n} and no output`}}};function nr(e){if(typeof e=="string"){let r=e.trim();return r||void 0}if(Array.isArray(e)){let r=e.map(s=>nr(s)).filter(s=>!!s);return r.length>0?r.join(`
`).trim():void 0}if(!e||typeof e!="object")return;let t=e,n=["result","output_text","text","content","message","final","delta"];for(let r of n){let s=nr(t[r]);if(s)return s}}var is=class{buildCommand(t,n,r){let s=[];t.subcommand&&s.push(t.subcommand);for(let a of t.unattended_flags)a!=="--yolo"&&s.push(a);s.push("--format","json"),s.push("-m",t.model);let i=n;return r?.systemPrompt&&(i=`${r.systemPrompt}

${n}`),s.push(i),{command:t.cli,args:s}}parseResponse(t,n){let r=t.trim();if(!r)return{success:!1,result:"",error:`CLI exited with code ${n} and no output`};let s=r.split(/\r?\n/).map(m=>m.trim()).filter(Boolean),i,a,o,c,l,u=!1;for(let m of s)try{let f=JSON.parse(m);u=!0;let _=nr(f);_&&(i=_),f.is_error===!0&&(a=nr(f.error)??nr(f.message)??"Kilo reported an error"),typeof f.error=="string"&&f.error.trim()&&(a=f.error.trim()),typeof f.message=="string"&&String(f.type).toLowerCase()==="error"&&(a=f.message.trim()),typeof f.session_id=="string"?o=f.session_id:typeof f.sessionId=="string"&&(o=f.sessionId),typeof f.total_cost_usd=="number"&&(c=f.total_cost_usd),typeof f.num_turns=="number"&&(l=f.num_turns)}catch{}if(!u)return{success:n===0,result:r,error:n===0?void 0:`CLI exited with code ${n}: ${r.slice(0,200)}`};let d=i??"",p=n===0&&!a;return{success:p,result:d,error:p?void 0:a??`CLI exited with code ${n}`,sessionId:o,cost:c,turns:l}}};var as=class{buildCommand(t,n,r){let s=[];t.subcommand&&s.push(t.subcommand);for(let a of t.unattended_flags)s.push(a);s.push("--model",t.model),s.push("-p",n);for(let a of t.output_flags)s.push(a);let i=r?.maxTurns??t.safety?.max_turns;return i!==void 0&&s.push("--max-steps-per-turn",String(i)),{command:t.cli,args:s}}parseResponse(t,n){let r=t.trim();return r?{success:n===0,result:r,error:n===0?void 0:`CLI exited with code ${n}: ${r.slice(0,200)}`}:{success:!1,result:"",error:`CLI exited with code ${n} and no output`}}};function sp(e){switch(e.toLowerCase()){case"claude":return new ns;case"codex":return new rs;case"kimi":return new ss;case"kilo":return new is;case"minimax":return new as;default:throw new Error(`Unsupported CLI adapter: ${e}`)}}var xe=q(require("fs/promises")),B=q(require("path")),cs=q(wn());var ip=q(require("fs/promises")),Tn=q(require("path"));async function os(e){let t=Tn.join(e,rn);try{if((await ip.stat(t)).isDirectory())return t}catch(n){if(n.code==="ENOENT")return null}return null}async function D_(e,t){let n=Tn.relative(e,t);return!n.startsWith("..")&&!Tn.isAbsolute(n)}async function Ie(e,t){if(!await D_(e,t))throw new Error(`Path validation failed: '${t}' is outside valid root '${e}'.`)}async function op(e){let t=B.join(e,qn),n=[];try{let r=[],s=a=>a.replace(/\\/g,"/"),i=async a=>{let o=await xe.readdir(a,{withFileTypes:!0});for(let c of o){let l=B.join(a,c.name);if(c.isDirectory()){if(c.name==="skills"&&a===t)continue;await i(l)}else c.isFile()&&c.name.endsWith(".md")&&r.push(l)}};await i(t);for(let a of r){let o=s(B.relative(t,a)),c=s(B.relative(e,a)),l=B.basename(a,".md"),d=!o.includes("/")?l:c;try{let p=await xe.readFile(a,"utf-8"),m=(0,cs.default)(p),f=typeof m.data.name=="string"?m.data.name:typeof m.data.skill_name=="string"?Lt(m.data.skill_name):Lt(l);n.push({id:d,name:f,description:typeof m.data.description=="string"?m.data.description:"",path:c,scope:m.data.scope==="project"?"project":"global"})}catch{n.push({id:d,name:Lt(l),description:"",path:c,scope:"global"})}}}catch{return[]}return n.sort((r,s)=>r.name.localeCompare(s.name))}async function ls(e){let t=B.join(e,qn,"skills"),n=[];try{let r=[],s=a=>a.replace(/\\/g,"/"),i=async a=>{let o=await xe.readdir(a,{withFileTypes:!0});for(let c of o){let l=B.join(a,c.name);c.isDirectory()?await i(l):c.isFile()&&c.name.endsWith(".md")&&r.push(l)}};await i(t);for(let a of r){let o=s(B.relative(t,a)),c=s(B.relative(e,a)),l=B.basename(a,".md"),d=!o.includes("/")?l:o;try{let p=await xe.readFile(a,"utf-8"),m=(0,cs.default)(p),f=typeof m.data.skill_name=="string"?m.data.skill_name:typeof m.data.name=="string"?m.data.name:Lt(l);n.push({id:d,name:f,description:typeof m.data.description=="string"?m.data.description:"",path:c,framework:typeof m.data.framework=="string"?m.data.framework:void 0,priority:["high","medium","low"].includes(m.data.priority)?m.data.priority:void 0,alwaysAttach:typeof m.data.always_attach=="boolean"?m.data.always_attach:!1,triggers:Array.isArray(m.data.triggers)?m.data.triggers:void 0})}catch{n.push({id:d,name:Lt(l),description:"",path:c})}}}catch{return[]}return n.sort((r,s)=>{let i={high:0,medium:1,low:2,undefined:3},a=i[r.priority]??3,o=i[s.priority]??3;return a!==o?a-o:r.name.localeCompare(s.name)})}async function us(e){let t=B.join(e,sn),n=[];try{let r=[],s=a=>a.replace(/\\/g,"/"),i=async a=>{let o=await xe.readdir(a,{withFileTypes:!0});for(let c of o){let l=B.join(a,c.name);c.isDirectory()?await i(l):c.isFile()&&c.name.endsWith(".md")&&r.push(l)}};await i(t);for(let a of r){let o=s(B.relative(t,a)),c=s(B.relative(e,a)),l=B.basename(a,".md"),d=!o.includes("/")?l:c;try{let p=await xe.readFile(a,"utf-8"),m=(0,cs.default)(p);n.push({id:d,name:typeof m.data.name=="string"?m.data.name:Lt(l),description:typeof m.data.description=="string"?m.data.description:"",path:c})}catch{n.push({id:d,name:Lt(l),description:"",path:c})}}}catch{return[]}return n.sort((r,s)=>r.name.localeCompare(s.name))}function Lt(e){return e.split(/[-_]/).map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}async function Ae(e,t){let n=B.join(e,t);await Ie(e,n);try{return await xe.readFile(n,"utf-8")}catch(r){return r?.code==="ENOENT"||console.warn(`Failed to read context file ${n}:`,r),""}}async function cp(e,t){let n=B.join(e,t);await Ie(e,n);try{return(await xe.stat(n)).isFile()}catch(r){return r?.code==="ENOENT",!1}}function lp(e){return e.endsWith(".md")?e:`${e}.md`}var ap="folder:";async function N_(e,t){let n=t.replace(/^[/\\]+/,"").replace(/[/\\]+$/,""),r=B.join(e,n);await Ie(e,r);let s=[],i=async o=>{let c=B.join(e,o);await Ie(e,c);let l;try{l=await xe.readdir(c,{withFileTypes:!0})}catch(u){if(u?.code==="ENOENT")return;console.warn(`Failed to read folder context ${c}:`,u);return}for(let u of l){let d=B.join(o,u.name),p=B.join(e,d);await Ie(e,p),u.isDirectory()?await i(d):u.isFile()&&s.push(d)}};return await i(n),(await Promise.all(s.sort((o,c)=>o.localeCompare(c)).map(async o=>{let c=await Ae(e,o);return c?`<!-- file: ${o} -->
${c}`:""}))).filter(Boolean).join(`

`)}async function up(e){let t=["how-it-works.md","architecture.md","project-details.md"];return(await Promise.all(t.map(r=>Ae(e,r)))).filter(Boolean).join(`

`)}async function dp(e,t){if(!t)return"";let n=B.join($e,t,"_context.md");return Ae(e,n)}async function pp(e,t,n){if(!t||!n)return"";let r=B.join($e,t,n,"_context.md");return Ae(e,r)}async function fp(e,t){return!t||t.length===0?"":(await Promise.all(t.map(async r=>{if(r.startsWith(ap)){let o=r.slice(ap.length);return N_(e,o)}let s=lp(r);if(s.includes("/")||s.includes("\\"))return Ae(e,s);let a=B.join(qn,s);return await cp(e,a)?Ae(e,a):Ae(e,s)}))).filter(Boolean).join(`

`)}async function mp(e,t){if(!t||t.length===0)return"";let n=B.join(qn,"skills");return(await Promise.all(t.map(async s=>{let i=lp(s);if(i.includes("/")||i.includes("\\")){let c=B.join(n,i);return await cp(e,c)?Ae(e,c):Ae(e,i)}let o=B.join(n,i);return Ae(e,o)}))).filter(Boolean).join(`

`)}var yp=q(require("path"));function _e(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function An(e,t){return t?`<section name="${e}">${_e(t)}</section>`:""}function M_(e){let t=[];t.push(`<id>${_e(e.id)}</id>`),t.push(`<filePath>${_e(e.filePath)}</filePath>`),t.push(`<target-file>${_e(e.filePath)}</target-file>`),t.push(`<title>${_e(e.title)}</title>`),t.push(`<stage>${_e(e.stage)}</stage>`),e.project&&t.push(`<project>${_e(e.project)}</project>`),e.phase&&t.push(`<phase>${_e(e.phase)}</phase>`),e.agent&&t.push(`<agent>${_e(e.agent)}</agent>`),e.parent&&t.push(`<parent>${_e(e.parent)}</parent>`),typeof e.order=="number"&&t.push(`<order>${e.order}</order>`),e.created&&t.push(`<created>${_e(e.created)}</created>`);let n=(e.tags??[]).map(s=>`<tag>${_e(s)}</tag>`).join("");t.push(`<tags>${n}</tags>`);let r=(e.contexts??[]).map(s=>`<contextRef>${_e(s)}</contextRef>`).join("");return t.push(`<contexts>${r}</contexts>`),`<metadata>${t.join("")}</metadata>`}function hp(e){return e.toLowerCase().replace(/\.md$/g,"").replace(/^\d+[-_.\s]*/g,"").replace(/[^a-z0-9]+/g,"")}function gp(e,t){return t?e===t?!0:hp(e)===hp(t):!1}async function L_(e,t){let n=t.agent?.trim();if(n){let r=yp.join(sn,`${n}.md`),s=await Ae(e,r);if(s)return{content:s,sectionName:"agent"};let a=(await us(e)).find(o=>gp(n,o.id)||gp(n,o.name));if(a){let o=await Ae(e,a.path);if(o)return{content:o,sectionName:"agent"}}}return{content:"",sectionName:"agent"}}async function F_(e,t,n){let[r,s,i,a,o,c]=await Promise.all([up(t),L_(t,e),dp(t,e.project),pp(t,e.project,e.phase),fp(t,e.contexts),mp(t,e.skills)]),l=[An("global",r),An(s.sectionName,s.content),An("project",i),An("phase",a),An("custom",o),An("skills",c)];return n?.isRunner&&l.push('<runner automated="true" />'),`<context>${l.filter(Boolean).join("")}</context>`}function j_(e){let t=M_(e),n=`<content>${_e(e.content)}</content>`;return`<task>${t}${n}</task>`}async function vp(e,t){let n=await F_(e,t),r=j_(e);return`<system>${n}${r}</system>`}var Qt=q(require("fs/promises")),kt=q(require("path")),Op=q(wn());var h={};Ma(h,{BRAND:()=>uk,DIRTY:()=>Ft,EMPTY_PATH:()=>H_,INVALID:()=>E,NEVER:()=>Kk,OK:()=>de,ParseStatus:()=>ae,Schema:()=>M,ZodAny:()=>xt,ZodArray:()=>it,ZodBigInt:()=>Ut,ZodBoolean:()=>qt,ZodBranded:()=>sr,ZodCatch:()=>Xt,ZodDate:()=>Wt,ZodDefault:()=>Zt,ZodDiscriminatedUnion:()=>fs,ZodEffects:()=>Me,ZodEnum:()=>Kt,ZodError:()=>ke,ZodFirstPartyTypeKind:()=>I,ZodFunction:()=>hs,ZodIntersection:()=>Gt,ZodIssueCode:()=>k,ZodLazy:()=>zt,ZodLiteral:()=>Vt,ZodMap:()=>Dn,ZodNaN:()=>Mn,ZodNativeEnum:()=>Yt,ZodNever:()=>Ue,ZodNull:()=>$t,ZodNullable:()=>Xe,ZodNumber:()=>jt,ZodObject:()=>be,ZodOptional:()=>De,ZodParsedType:()=>S,ZodPipeline:()=>ir,ZodPromise:()=>_t,ZodReadonly:()=>Jt,ZodRecord:()=>ms,ZodSchema:()=>M,ZodSet:()=>Nn,ZodString:()=>vt,ZodSymbol:()=>On,ZodTransformer:()=>Me,ZodTuple:()=>Ze,ZodType:()=>M,ZodUndefined:()=>Ht,ZodUnion:()=>Bt,ZodUnknown:()=>st,ZodVoid:()=>In,addIssueToContext:()=>w,any:()=>xk,array:()=>wk,bigint:()=>mk,boolean:()=>Pp,coerce:()=>Vk,custom:()=>Tp,date:()=>hk,datetimeRegex:()=>Sp,defaultErrorMap:()=>nt,discriminatedUnion:()=>Ak,effect:()=>Uk,enum:()=>Lk,function:()=>Dk,getErrorMap:()=>Rn,getParsedType:()=>Ye,instanceof:()=>pk,intersection:()=>Rk,isAborted:()=>ds,isAsync:()=>Pn,isDirty:()=>ps,isValid:()=>yt,late:()=>dk,lazy:()=>Nk,literal:()=>Mk,makeIssue:()=>rr,map:()=>Ok,nan:()=>fk,nativeEnum:()=>Fk,never:()=>kk,null:()=>vk,nullable:()=>Wk,number:()=>Rp,object:()=>Sk,objectUtil:()=>wa,oboolean:()=>zk,onumber:()=>Gk,optional:()=>qk,ostring:()=>Bk,pipeline:()=>$k,preprocess:()=>Hk,promise:()=>jk,quotelessJson:()=>U_,record:()=>Ek,set:()=>Ik,setErrorMap:()=>W_,strictObject:()=>Ck,string:()=>Ap,symbol:()=>gk,transformer:()=>Uk,tuple:()=>Pk,undefined:()=>yk,union:()=>Tk,unknown:()=>_k,util:()=>j,void:()=>bk});var j;(function(e){e.assertEqual=s=>{};function t(s){}e.assertIs=t;function n(s){throw new Error}e.assertNever=n,e.arrayToEnum=s=>{let i={};for(let a of s)i[a]=a;return i},e.getValidEnumValues=s=>{let i=e.objectKeys(s).filter(o=>typeof s[s[o]]!="number"),a={};for(let o of i)a[o]=s[o];return e.objectValues(a)},e.objectValues=s=>e.objectKeys(s).map(function(i){return s[i]}),e.objectKeys=typeof Object.keys=="function"?s=>Object.keys(s):s=>{let i=[];for(let a in s)Object.prototype.hasOwnProperty.call(s,a)&&i.push(a);return i},e.find=(s,i)=>{for(let a of s)if(i(a))return a},e.isInteger=typeof Number.isInteger=="function"?s=>Number.isInteger(s):s=>typeof s=="number"&&Number.isFinite(s)&&Math.floor(s)===s;function r(s,i=" | "){return s.map(a=>typeof a=="string"?`'${a}'`:a).join(i)}e.joinValues=r,e.jsonStringifyReplacer=(s,i)=>typeof i=="bigint"?i.toString():i})(j||(j={}));var wa;(function(e){e.mergeShapes=(t,n)=>({...t,...n})})(wa||(wa={}));var S=j.arrayToEnum(["string","nan","number","integer","float","boolean","date","bigint","symbol","function","undefined","null","array","object","unknown","promise","void","never","map","set"]),Ye=e=>{switch(typeof e){case"undefined":return S.undefined;case"string":return S.string;case"number":return Number.isNaN(e)?S.nan:S.number;case"boolean":return S.boolean;case"function":return S.function;case"bigint":return S.bigint;case"symbol":return S.symbol;case"object":return Array.isArray(e)?S.array:e===null?S.null:e.then&&typeof e.then=="function"&&e.catch&&typeof e.catch=="function"?S.promise:typeof Map<"u"&&e instanceof Map?S.map:typeof Set<"u"&&e instanceof Set?S.set:typeof Date<"u"&&e instanceof Date?S.date:S.object;default:return S.unknown}};var k=j.arrayToEnum(["invalid_type","invalid_literal","custom","invalid_union","invalid_union_discriminator","invalid_enum_value","unrecognized_keys","invalid_arguments","invalid_return_type","invalid_date","invalid_string","too_small","too_big","invalid_intersection_types","not_multiple_of","not_finite"]),U_=e=>JSON.stringify(e,null,2).replace(/"([^"]+)":/g,"$1:"),ke=class e extends Error{get errors(){return this.issues}constructor(t){super(),this.issues=[],this.addIssue=r=>{this.issues=[...this.issues,r]},this.addIssues=(r=[])=>{this.issues=[...this.issues,...r]};let n=new.target.prototype;Object.setPrototypeOf?Object.setPrototypeOf(this,n):this.__proto__=n,this.name="ZodError",this.issues=t}format(t){let n=t||function(i){return i.message},r={_errors:[]},s=i=>{for(let a of i.issues)if(a.code==="invalid_union")a.unionErrors.map(s);else if(a.code==="invalid_return_type")s(a.returnTypeError);else if(a.code==="invalid_arguments")s(a.argumentsError);else if(a.path.length===0)r._errors.push(n(a));else{let o=r,c=0;for(;c<a.path.length;){let l=a.path[c];c===a.path.length-1?(o[l]=o[l]||{_errors:[]},o[l]._errors.push(n(a))):o[l]=o[l]||{_errors:[]},o=o[l],c++}}};return s(this),r}static assert(t){if(!(t instanceof e))throw new Error(`Not a ZodError: ${t}`)}toString(){return this.message}get message(){return JSON.stringify(this.issues,j.jsonStringifyReplacer,2)}get isEmpty(){return this.issues.length===0}flatten(t=n=>n.message){let n={},r=[];for(let s of this.issues)if(s.path.length>0){let i=s.path[0];n[i]=n[i]||[],n[i].push(t(s))}else r.push(t(s));return{formErrors:r,fieldErrors:n}}get formErrors(){return this.flatten()}};ke.create=e=>new ke(e);var q_=(e,t)=>{let n;switch(e.code){case k.invalid_type:e.received===S.undefined?n="Required":n=`Expected ${e.expected}, received ${e.received}`;break;case k.invalid_literal:n=`Invalid literal value, expected ${JSON.stringify(e.expected,j.jsonStringifyReplacer)}`;break;case k.unrecognized_keys:n=`Unrecognized key(s) in object: ${j.joinValues(e.keys,", ")}`;break;case k.invalid_union:n="Invalid input";break;case k.invalid_union_discriminator:n=`Invalid discriminator value. Expected ${j.joinValues(e.options)}`;break;case k.invalid_enum_value:n=`Invalid enum value. Expected ${j.joinValues(e.options)}, received '${e.received}'`;break;case k.invalid_arguments:n="Invalid function arguments";break;case k.invalid_return_type:n="Invalid function return type";break;case k.invalid_date:n="Invalid date";break;case k.invalid_string:typeof e.validation=="object"?"includes"in e.validation?(n=`Invalid input: must include "${e.validation.includes}"`,typeof e.validation.position=="number"&&(n=`${n} at one or more positions greater than or equal to ${e.validation.position}`)):"startsWith"in e.validation?n=`Invalid input: must start with "${e.validation.startsWith}"`:"endsWith"in e.validation?n=`Invalid input: must end with "${e.validation.endsWith}"`:j.assertNever(e.validation):e.validation!=="regex"?n=`Invalid ${e.validation}`:n="Invalid";break;case k.too_small:e.type==="array"?n=`Array must contain ${e.exact?"exactly":e.inclusive?"at least":"more than"} ${e.minimum} element(s)`:e.type==="string"?n=`String must contain ${e.exact?"exactly":e.inclusive?"at least":"over"} ${e.minimum} character(s)`:e.type==="number"?n=`Number must be ${e.exact?"exactly equal to ":e.inclusive?"greater than or equal to ":"greater than "}${e.minimum}`:e.type==="bigint"?n=`Number must be ${e.exact?"exactly equal to ":e.inclusive?"greater than or equal to ":"greater than "}${e.minimum}`:e.type==="date"?n=`Date must be ${e.exact?"exactly equal to ":e.inclusive?"greater than or equal to ":"greater than "}${new Date(Number(e.minimum))}`:n="Invalid input";break;case k.too_big:e.type==="array"?n=`Array must contain ${e.exact?"exactly":e.inclusive?"at most":"less than"} ${e.maximum} element(s)`:e.type==="string"?n=`String must contain ${e.exact?"exactly":e.inclusive?"at most":"under"} ${e.maximum} character(s)`:e.type==="number"?n=`Number must be ${e.exact?"exactly":e.inclusive?"less than or equal to":"less than"} ${e.maximum}`:e.type==="bigint"?n=`BigInt must be ${e.exact?"exactly":e.inclusive?"less than or equal to":"less than"} ${e.maximum}`:e.type==="date"?n=`Date must be ${e.exact?"exactly":e.inclusive?"smaller than or equal to":"smaller than"} ${new Date(Number(e.maximum))}`:n="Invalid input";break;case k.custom:n="Invalid input";break;case k.invalid_intersection_types:n="Intersection results could not be merged";break;case k.not_multiple_of:n=`Number must be a multiple of ${e.multipleOf}`;break;case k.not_finite:n="Number must be finite";break;default:n=t.defaultError,j.assertNever(e)}return{message:n}},nt=q_;var xp=nt;function W_(e){xp=e}function Rn(){return xp}var rr=e=>{let{data:t,path:n,errorMaps:r,issueData:s}=e,i=[...n,...s.path||[]],a={...s,path:i};if(s.message!==void 0)return{...s,path:i,message:s.message};let o="",c=r.filter(l=>!!l).slice().reverse();for(let l of c)o=l(a,{data:t,defaultError:o}).message;return{...s,path:i,message:o}},H_=[];function w(e,t){let n=Rn(),r=rr({issueData:t,data:e.data,path:e.path,errorMaps:[e.common.contextualErrorMap,e.schemaErrorMap,n,n===nt?void 0:nt].filter(s=>!!s)});e.common.issues.push(r)}var ae=class e{constructor(){this.value="valid"}dirty(){this.value==="valid"&&(this.value="dirty")}abort(){this.value!=="aborted"&&(this.value="aborted")}static mergeArray(t,n){let r=[];for(let s of n){if(s.status==="aborted")return E;s.status==="dirty"&&t.dirty(),r.push(s.value)}return{status:t.value,value:r}}static async mergeObjectAsync(t,n){let r=[];for(let s of n){let i=await s.key,a=await s.value;r.push({key:i,value:a})}return e.mergeObjectSync(t,r)}static mergeObjectSync(t,n){let r={};for(let s of n){let{key:i,value:a}=s;if(i.status==="aborted"||a.status==="aborted")return E;i.status==="dirty"&&t.dirty(),a.status==="dirty"&&t.dirty(),i.value!=="__proto__"&&(typeof a.value<"u"||s.alwaysSet)&&(r[i.value]=a.value)}return{status:t.value,value:r}}},E=Object.freeze({status:"aborted"}),Ft=e=>({status:"dirty",value:e}),de=e=>({status:"valid",value:e}),ds=e=>e.status==="aborted",ps=e=>e.status==="dirty",yt=e=>e.status==="valid",Pn=e=>typeof Promise<"u"&&e instanceof Promise;var R;(function(e){e.errToObj=t=>typeof t=="string"?{message:t}:t||{},e.toString=t=>typeof t=="string"?t:t?.message})(R||(R={}));var Ne=class{constructor(t,n,r,s){this._cachedPath=[],this.parent=t,this.data=n,this._path=r,this._key=s}get path(){return this._cachedPath.length||(Array.isArray(this._key)?this._cachedPath.push(...this._path,...this._key):this._cachedPath.push(...this._path,this._key)),this._cachedPath}},_p=(e,t)=>{if(yt(t))return{success:!0,data:t.value};if(!e.common.issues.length)throw new Error("Validation failed but no issues detected.");return{success:!1,get error(){if(this._error)return this._error;let n=new ke(e.common.issues);return this._error=n,this._error}}};function N(e){if(!e)return{};let{errorMap:t,invalid_type_error:n,required_error:r,description:s}=e;if(t&&(n||r))throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);return t?{errorMap:t,description:s}:{errorMap:(a,o)=>{let{message:c}=e;return a.code==="invalid_enum_value"?{message:c??o.defaultError}:typeof o.data>"u"?{message:c??r??o.defaultError}:a.code!=="invalid_type"?{message:o.defaultError}:{message:c??n??o.defaultError}},description:s}}var M=class{get description(){return this._def.description}_getType(t){return Ye(t.data)}_getOrReturnCtx(t,n){return n||{common:t.parent.common,data:t.data,parsedType:Ye(t.data),schemaErrorMap:this._def.errorMap,path:t.path,parent:t.parent}}_processInputParams(t){return{status:new ae,ctx:{common:t.parent.common,data:t.data,parsedType:Ye(t.data),schemaErrorMap:this._def.errorMap,path:t.path,parent:t.parent}}}_parseSync(t){let n=this._parse(t);if(Pn(n))throw new Error("Synchronous parse encountered promise.");return n}_parseAsync(t){let n=this._parse(t);return Promise.resolve(n)}parse(t,n){let r=this.safeParse(t,n);if(r.success)return r.data;throw r.error}safeParse(t,n){let r={common:{issues:[],async:n?.async??!1,contextualErrorMap:n?.errorMap},path:n?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:t,parsedType:Ye(t)},s=this._parseSync({data:t,path:r.path,parent:r});return _p(r,s)}"~validate"(t){let n={common:{issues:[],async:!!this["~standard"].async},path:[],schemaErrorMap:this._def.errorMap,parent:null,data:t,parsedType:Ye(t)};if(!this["~standard"].async)try{let r=this._parseSync({data:t,path:[],parent:n});return yt(r)?{value:r.value}:{issues:n.common.issues}}catch(r){r?.message?.toLowerCase()?.includes("encountered")&&(this["~standard"].async=!0),n.common={issues:[],async:!0}}return this._parseAsync({data:t,path:[],parent:n}).then(r=>yt(r)?{value:r.value}:{issues:n.common.issues})}async parseAsync(t,n){let r=await this.safeParseAsync(t,n);if(r.success)return r.data;throw r.error}async safeParseAsync(t,n){let r={common:{issues:[],contextualErrorMap:n?.errorMap,async:!0},path:n?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:t,parsedType:Ye(t)},s=this._parse({data:t,path:r.path,parent:r}),i=await(Pn(s)?s:Promise.resolve(s));return _p(r,i)}refine(t,n){let r=s=>typeof n=="string"||typeof n>"u"?{message:n}:typeof n=="function"?n(s):n;return this._refinement((s,i)=>{let a=t(s),o=()=>i.addIssue({code:k.custom,...r(s)});return typeof Promise<"u"&&a instanceof Promise?a.then(c=>c?!0:(o(),!1)):a?!0:(o(),!1)})}refinement(t,n){return this._refinement((r,s)=>t(r)?!0:(s.addIssue(typeof n=="function"?n(r,s):n),!1))}_refinement(t){return new Me({schema:this,typeName:I.ZodEffects,effect:{type:"refinement",refinement:t}})}superRefine(t){return this._refinement(t)}constructor(t){this.spa=this.safeParseAsync,this._def=t,this.parse=this.parse.bind(this),this.safeParse=this.safeParse.bind(this),this.parseAsync=this.parseAsync.bind(this),this.safeParseAsync=this.safeParseAsync.bind(this),this.spa=this.spa.bind(this),this.refine=this.refine.bind(this),this.refinement=this.refinement.bind(this),this.superRefine=this.superRefine.bind(this),this.optional=this.optional.bind(this),this.nullable=this.nullable.bind(this),this.nullish=this.nullish.bind(this),this.array=this.array.bind(this),this.promise=this.promise.bind(this),this.or=this.or.bind(this),this.and=this.and.bind(this),this.transform=this.transform.bind(this),this.brand=this.brand.bind(this),this.default=this.default.bind(this),this.catch=this.catch.bind(this),this.describe=this.describe.bind(this),this.pipe=this.pipe.bind(this),this.readonly=this.readonly.bind(this),this.isNullable=this.isNullable.bind(this),this.isOptional=this.isOptional.bind(this),this["~standard"]={version:1,vendor:"zod",validate:n=>this["~validate"](n)}}optional(){return De.create(this,this._def)}nullable(){return Xe.create(this,this._def)}nullish(){return this.nullable().optional()}array(){return it.create(this)}promise(){return _t.create(this,this._def)}or(t){return Bt.create([this,t],this._def)}and(t){return Gt.create(this,t,this._def)}transform(t){return new Me({...N(this._def),schema:this,typeName:I.ZodEffects,effect:{type:"transform",transform:t}})}default(t){let n=typeof t=="function"?t:()=>t;return new Zt({...N(this._def),innerType:this,defaultValue:n,typeName:I.ZodDefault})}brand(){return new sr({typeName:I.ZodBranded,type:this,...N(this._def)})}catch(t){let n=typeof t=="function"?t:()=>t;return new Xt({...N(this._def),innerType:this,catchValue:n,typeName:I.ZodCatch})}describe(t){let n=this.constructor;return new n({...this._def,description:t})}pipe(t){return ir.create(this,t)}readonly(){return Jt.create(this)}isOptional(){return this.safeParse(void 0).success}isNullable(){return this.safeParse(null).success}},$_=/^c[^\s-]{8,}$/i,B_=/^[0-9a-z]+$/,G_=/^[0-9A-HJKMNP-TV-Z]{26}$/i,z_=/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,V_=/^[a-z0-9_-]{21}$/i,K_=/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,Y_=/^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,Z_=/^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,X_="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",Sa,J_=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,Q_=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,ek=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,tk=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,nk=/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,rk=/^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,bp="((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))",sk=new RegExp(`^${bp}$`);function wp(e){let t="[0-5]\\d";e.precision?t=`${t}\\.\\d{${e.precision}}`:e.precision==null&&(t=`${t}(\\.\\d+)?`);let n=e.precision?"+":"?";return`([01]\\d|2[0-3]):[0-5]\\d(:${t})${n}`}function ik(e){return new RegExp(`^${wp(e)}$`)}function Sp(e){let t=`${bp}T${wp(e)}`,n=[];return n.push(e.local?"Z?":"Z"),e.offset&&n.push("([+-]\\d{2}:?\\d{2})"),t=`${t}(${n.join("|")})`,new RegExp(`^${t}$`)}function ak(e,t){return!!((t==="v4"||!t)&&J_.test(e)||(t==="v6"||!t)&&ek.test(e))}function ok(e,t){if(!K_.test(e))return!1;try{let[n]=e.split(".");if(!n)return!1;let r=n.replace(/-/g,"+").replace(/_/g,"/").padEnd(n.length+(4-n.length%4)%4,"="),s=JSON.parse(atob(r));return!(typeof s!="object"||s===null||"typ"in s&&s?.typ!=="JWT"||!s.alg||t&&s.alg!==t)}catch{return!1}}function ck(e,t){return!!((t==="v4"||!t)&&Q_.test(e)||(t==="v6"||!t)&&tk.test(e))}var vt=class e extends M{_parse(t){if(this._def.coerce&&(t.data=String(t.data)),this._getType(t)!==S.string){let i=this._getOrReturnCtx(t);return w(i,{code:k.invalid_type,expected:S.string,received:i.parsedType}),E}let r=new ae,s;for(let i of this._def.checks)if(i.kind==="min")t.data.length<i.value&&(s=this._getOrReturnCtx(t,s),w(s,{code:k.too_small,minimum:i.value,type:"string",inclusive:!0,exact:!1,message:i.message}),r.dirty());else if(i.kind==="max")t.data.length>i.value&&(s=this._getOrReturnCtx(t,s),w(s,{code:k.too_big,maximum:i.value,type:"string",inclusive:!0,exact:!1,message:i.message}),r.dirty());else if(i.kind==="length"){let a=t.data.length>i.value,o=t.data.length<i.value;(a||o)&&(s=this._getOrReturnCtx(t,s),a?w(s,{code:k.too_big,maximum:i.value,type:"string",inclusive:!0,exact:!0,message:i.message}):o&&w(s,{code:k.too_small,minimum:i.value,type:"string",inclusive:!0,exact:!0,message:i.message}),r.dirty())}else if(i.kind==="email")Z_.test(t.data)||(s=this._getOrReturnCtx(t,s),w(s,{validation:"email",code:k.invalid_string,message:i.message}),r.dirty());else if(i.kind==="emoji")Sa||(Sa=new RegExp(X_,"u")),Sa.test(t.data)||(s=this._getOrReturnCtx(t,s),w(s,{validation:"emoji",code:k.invalid_string,message:i.message}),r.dirty());else if(i.kind==="uuid")z_.test(t.data)||(s=this._getOrReturnCtx(t,s),w(s,{validation:"uuid",code:k.invalid_string,message:i.message}),r.dirty());else if(i.kind==="nanoid")V_.test(t.data)||(s=this._getOrReturnCtx(t,s),w(s,{validation:"nanoid",code:k.invalid_string,message:i.message}),r.dirty());else if(i.kind==="cuid")$_.test(t.data)||(s=this._getOrReturnCtx(t,s),w(s,{validation:"cuid",code:k.invalid_string,message:i.message}),r.dirty());else if(i.kind==="cuid2")B_.test(t.data)||(s=this._getOrReturnCtx(t,s),w(s,{validation:"cuid2",code:k.invalid_string,message:i.message}),r.dirty());else if(i.kind==="ulid")G_.test(t.data)||(s=this._getOrReturnCtx(t,s),w(s,{validation:"ulid",code:k.invalid_string,message:i.message}),r.dirty());else if(i.kind==="url")try{new URL(t.data)}catch{s=this._getOrReturnCtx(t,s),w(s,{validation:"url",code:k.invalid_string,message:i.message}),r.dirty()}else i.kind==="regex"?(i.regex.lastIndex=0,i.regex.test(t.data)||(s=this._getOrReturnCtx(t,s),w(s,{validation:"regex",code:k.invalid_string,message:i.message}),r.dirty())):i.kind==="trim"?t.data=t.data.trim():i.kind==="includes"?t.data.includes(i.value,i.position)||(s=this._getOrReturnCtx(t,s),w(s,{code:k.invalid_string,validation:{includes:i.value,position:i.position},message:i.message}),r.dirty()):i.kind==="toLowerCase"?t.data=t.data.toLowerCase():i.kind==="toUpperCase"?t.data=t.data.toUpperCase():i.kind==="startsWith"?t.data.startsWith(i.value)||(s=this._getOrReturnCtx(t,s),w(s,{code:k.invalid_string,validation:{startsWith:i.value},message:i.message}),r.dirty()):i.kind==="endsWith"?t.data.endsWith(i.value)||(s=this._getOrReturnCtx(t,s),w(s,{code:k.invalid_string,validation:{endsWith:i.value},message:i.message}),r.dirty()):i.kind==="datetime"?Sp(i).test(t.data)||(s=this._getOrReturnCtx(t,s),w(s,{code:k.invalid_string,validation:"datetime",message:i.message}),r.dirty()):i.kind==="date"?sk.test(t.data)||(s=this._getOrReturnCtx(t,s),w(s,{code:k.invalid_string,validation:"date",message:i.message}),r.dirty()):i.kind==="time"?ik(i).test(t.data)||(s=this._getOrReturnCtx(t,s),w(s,{code:k.invalid_string,validation:"time",message:i.message}),r.dirty()):i.kind==="duration"?Y_.test(t.data)||(s=this._getOrReturnCtx(t,s),w(s,{validation:"duration",code:k.invalid_string,message:i.message}),r.dirty()):i.kind==="ip"?ak(t.data,i.version)||(s=this._getOrReturnCtx(t,s),w(s,{validation:"ip",code:k.invalid_string,message:i.message}),r.dirty()):i.kind==="jwt"?ok(t.data,i.alg)||(s=this._getOrReturnCtx(t,s),w(s,{validation:"jwt",code:k.invalid_string,message:i.message}),r.dirty()):i.kind==="cidr"?ck(t.data,i.version)||(s=this._getOrReturnCtx(t,s),w(s,{validation:"cidr",code:k.invalid_string,message:i.message}),r.dirty()):i.kind==="base64"?nk.test(t.data)||(s=this._getOrReturnCtx(t,s),w(s,{validation:"base64",code:k.invalid_string,message:i.message}),r.dirty()):i.kind==="base64url"?rk.test(t.data)||(s=this._getOrReturnCtx(t,s),w(s,{validation:"base64url",code:k.invalid_string,message:i.message}),r.dirty()):j.assertNever(i);return{status:r.value,value:t.data}}_regex(t,n,r){return this.refinement(s=>t.test(s),{validation:n,code:k.invalid_string,...R.errToObj(r)})}_addCheck(t){return new e({...this._def,checks:[...this._def.checks,t]})}email(t){return this._addCheck({kind:"email",...R.errToObj(t)})}url(t){return this._addCheck({kind:"url",...R.errToObj(t)})}emoji(t){return this._addCheck({kind:"emoji",...R.errToObj(t)})}uuid(t){return this._addCheck({kind:"uuid",...R.errToObj(t)})}nanoid(t){return this._addCheck({kind:"nanoid",...R.errToObj(t)})}cuid(t){return this._addCheck({kind:"cuid",...R.errToObj(t)})}cuid2(t){return this._addCheck({kind:"cuid2",...R.errToObj(t)})}ulid(t){return this._addCheck({kind:"ulid",...R.errToObj(t)})}base64(t){return this._addCheck({kind:"base64",...R.errToObj(t)})}base64url(t){return this._addCheck({kind:"base64url",...R.errToObj(t)})}jwt(t){return this._addCheck({kind:"jwt",...R.errToObj(t)})}ip(t){return this._addCheck({kind:"ip",...R.errToObj(t)})}cidr(t){return this._addCheck({kind:"cidr",...R.errToObj(t)})}datetime(t){return typeof t=="string"?this._addCheck({kind:"datetime",precision:null,offset:!1,local:!1,message:t}):this._addCheck({kind:"datetime",precision:typeof t?.precision>"u"?null:t?.precision,offset:t?.offset??!1,local:t?.local??!1,...R.errToObj(t?.message)})}date(t){return this._addCheck({kind:"date",message:t})}time(t){return typeof t=="string"?this._addCheck({kind:"time",precision:null,message:t}):this._addCheck({kind:"time",precision:typeof t?.precision>"u"?null:t?.precision,...R.errToObj(t?.message)})}duration(t){return this._addCheck({kind:"duration",...R.errToObj(t)})}regex(t,n){return this._addCheck({kind:"regex",regex:t,...R.errToObj(n)})}includes(t,n){return this._addCheck({kind:"includes",value:t,position:n?.position,...R.errToObj(n?.message)})}startsWith(t,n){return this._addCheck({kind:"startsWith",value:t,...R.errToObj(n)})}endsWith(t,n){return this._addCheck({kind:"endsWith",value:t,...R.errToObj(n)})}min(t,n){return this._addCheck({kind:"min",value:t,...R.errToObj(n)})}max(t,n){return this._addCheck({kind:"max",value:t,...R.errToObj(n)})}length(t,n){return this._addCheck({kind:"length",value:t,...R.errToObj(n)})}nonempty(t){return this.min(1,R.errToObj(t))}trim(){return new e({...this._def,checks:[...this._def.checks,{kind:"trim"}]})}toLowerCase(){return new e({...this._def,checks:[...this._def.checks,{kind:"toLowerCase"}]})}toUpperCase(){return new e({...this._def,checks:[...this._def.checks,{kind:"toUpperCase"}]})}get isDatetime(){return!!this._def.checks.find(t=>t.kind==="datetime")}get isDate(){return!!this._def.checks.find(t=>t.kind==="date")}get isTime(){return!!this._def.checks.find(t=>t.kind==="time")}get isDuration(){return!!this._def.checks.find(t=>t.kind==="duration")}get isEmail(){return!!this._def.checks.find(t=>t.kind==="email")}get isURL(){return!!this._def.checks.find(t=>t.kind==="url")}get isEmoji(){return!!this._def.checks.find(t=>t.kind==="emoji")}get isUUID(){return!!this._def.checks.find(t=>t.kind==="uuid")}get isNANOID(){return!!this._def.checks.find(t=>t.kind==="nanoid")}get isCUID(){return!!this._def.checks.find(t=>t.kind==="cuid")}get isCUID2(){return!!this._def.checks.find(t=>t.kind==="cuid2")}get isULID(){return!!this._def.checks.find(t=>t.kind==="ulid")}get isIP(){return!!this._def.checks.find(t=>t.kind==="ip")}get isCIDR(){return!!this._def.checks.find(t=>t.kind==="cidr")}get isBase64(){return!!this._def.checks.find(t=>t.kind==="base64")}get isBase64url(){return!!this._def.checks.find(t=>t.kind==="base64url")}get minLength(){let t=null;for(let n of this._def.checks)n.kind==="min"&&(t===null||n.value>t)&&(t=n.value);return t}get maxLength(){let t=null;for(let n of this._def.checks)n.kind==="max"&&(t===null||n.value<t)&&(t=n.value);return t}};vt.create=e=>new vt({checks:[],typeName:I.ZodString,coerce:e?.coerce??!1,...N(e)});function lk(e,t){let n=(e.toString().split(".")[1]||"").length,r=(t.toString().split(".")[1]||"").length,s=n>r?n:r,i=Number.parseInt(e.toFixed(s).replace(".","")),a=Number.parseInt(t.toFixed(s).replace(".",""));return i%a/10**s}var jt=class e extends M{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte,this.step=this.multipleOf}_parse(t){if(this._def.coerce&&(t.data=Number(t.data)),this._getType(t)!==S.number){let i=this._getOrReturnCtx(t);return w(i,{code:k.invalid_type,expected:S.number,received:i.parsedType}),E}let r,s=new ae;for(let i of this._def.checks)i.kind==="int"?j.isInteger(t.data)||(r=this._getOrReturnCtx(t,r),w(r,{code:k.invalid_type,expected:"integer",received:"float",message:i.message}),s.dirty()):i.kind==="min"?(i.inclusive?t.data<i.value:t.data<=i.value)&&(r=this._getOrReturnCtx(t,r),w(r,{code:k.too_small,minimum:i.value,type:"number",inclusive:i.inclusive,exact:!1,message:i.message}),s.dirty()):i.kind==="max"?(i.inclusive?t.data>i.value:t.data>=i.value)&&(r=this._getOrReturnCtx(t,r),w(r,{code:k.too_big,maximum:i.value,type:"number",inclusive:i.inclusive,exact:!1,message:i.message}),s.dirty()):i.kind==="multipleOf"?lk(t.data,i.value)!==0&&(r=this._getOrReturnCtx(t,r),w(r,{code:k.not_multiple_of,multipleOf:i.value,message:i.message}),s.dirty()):i.kind==="finite"?Number.isFinite(t.data)||(r=this._getOrReturnCtx(t,r),w(r,{code:k.not_finite,message:i.message}),s.dirty()):j.assertNever(i);return{status:s.value,value:t.data}}gte(t,n){return this.setLimit("min",t,!0,R.toString(n))}gt(t,n){return this.setLimit("min",t,!1,R.toString(n))}lte(t,n){return this.setLimit("max",t,!0,R.toString(n))}lt(t,n){return this.setLimit("max",t,!1,R.toString(n))}setLimit(t,n,r,s){return new e({...this._def,checks:[...this._def.checks,{kind:t,value:n,inclusive:r,message:R.toString(s)}]})}_addCheck(t){return new e({...this._def,checks:[...this._def.checks,t]})}int(t){return this._addCheck({kind:"int",message:R.toString(t)})}positive(t){return this._addCheck({kind:"min",value:0,inclusive:!1,message:R.toString(t)})}negative(t){return this._addCheck({kind:"max",value:0,inclusive:!1,message:R.toString(t)})}nonpositive(t){return this._addCheck({kind:"max",value:0,inclusive:!0,message:R.toString(t)})}nonnegative(t){return this._addCheck({kind:"min",value:0,inclusive:!0,message:R.toString(t)})}multipleOf(t,n){return this._addCheck({kind:"multipleOf",value:t,message:R.toString(n)})}finite(t){return this._addCheck({kind:"finite",message:R.toString(t)})}safe(t){return this._addCheck({kind:"min",inclusive:!0,value:Number.MIN_SAFE_INTEGER,message:R.toString(t)})._addCheck({kind:"max",inclusive:!0,value:Number.MAX_SAFE_INTEGER,message:R.toString(t)})}get minValue(){let t=null;for(let n of this._def.checks)n.kind==="min"&&(t===null||n.value>t)&&(t=n.value);return t}get maxValue(){let t=null;for(let n of this._def.checks)n.kind==="max"&&(t===null||n.value<t)&&(t=n.value);return t}get isInt(){return!!this._def.checks.find(t=>t.kind==="int"||t.kind==="multipleOf"&&j.isInteger(t.value))}get isFinite(){let t=null,n=null;for(let r of this._def.checks){if(r.kind==="finite"||r.kind==="int"||r.kind==="multipleOf")return!0;r.kind==="min"?(n===null||r.value>n)&&(n=r.value):r.kind==="max"&&(t===null||r.value<t)&&(t=r.value)}return Number.isFinite(n)&&Number.isFinite(t)}};jt.create=e=>new jt({checks:[],typeName:I.ZodNumber,coerce:e?.coerce||!1,...N(e)});var Ut=class e extends M{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte}_parse(t){if(this._def.coerce)try{t.data=BigInt(t.data)}catch{return this._getInvalidInput(t)}if(this._getType(t)!==S.bigint)return this._getInvalidInput(t);let r,s=new ae;for(let i of this._def.checks)i.kind==="min"?(i.inclusive?t.data<i.value:t.data<=i.value)&&(r=this._getOrReturnCtx(t,r),w(r,{code:k.too_small,type:"bigint",minimum:i.value,inclusive:i.inclusive,message:i.message}),s.dirty()):i.kind==="max"?(i.inclusive?t.data>i.value:t.data>=i.value)&&(r=this._getOrReturnCtx(t,r),w(r,{code:k.too_big,type:"bigint",maximum:i.value,inclusive:i.inclusive,message:i.message}),s.dirty()):i.kind==="multipleOf"?t.data%i.value!==BigInt(0)&&(r=this._getOrReturnCtx(t,r),w(r,{code:k.not_multiple_of,multipleOf:i.value,message:i.message}),s.dirty()):j.assertNever(i);return{status:s.value,value:t.data}}_getInvalidInput(t){let n=this._getOrReturnCtx(t);return w(n,{code:k.invalid_type,expected:S.bigint,received:n.parsedType}),E}gte(t,n){return this.setLimit("min",t,!0,R.toString(n))}gt(t,n){return this.setLimit("min",t,!1,R.toString(n))}lte(t,n){return this.setLimit("max",t,!0,R.toString(n))}lt(t,n){return this.setLimit("max",t,!1,R.toString(n))}setLimit(t,n,r,s){return new e({...this._def,checks:[...this._def.checks,{kind:t,value:n,inclusive:r,message:R.toString(s)}]})}_addCheck(t){return new e({...this._def,checks:[...this._def.checks,t]})}positive(t){return this._addCheck({kind:"min",value:BigInt(0),inclusive:!1,message:R.toString(t)})}negative(t){return this._addCheck({kind:"max",value:BigInt(0),inclusive:!1,message:R.toString(t)})}nonpositive(t){return this._addCheck({kind:"max",value:BigInt(0),inclusive:!0,message:R.toString(t)})}nonnegative(t){return this._addCheck({kind:"min",value:BigInt(0),inclusive:!0,message:R.toString(t)})}multipleOf(t,n){return this._addCheck({kind:"multipleOf",value:t,message:R.toString(n)})}get minValue(){let t=null;for(let n of this._def.checks)n.kind==="min"&&(t===null||n.value>t)&&(t=n.value);return t}get maxValue(){let t=null;for(let n of this._def.checks)n.kind==="max"&&(t===null||n.value<t)&&(t=n.value);return t}};Ut.create=e=>new Ut({checks:[],typeName:I.ZodBigInt,coerce:e?.coerce??!1,...N(e)});var qt=class extends M{_parse(t){if(this._def.coerce&&(t.data=!!t.data),this._getType(t)!==S.boolean){let r=this._getOrReturnCtx(t);return w(r,{code:k.invalid_type,expected:S.boolean,received:r.parsedType}),E}return de(t.data)}};qt.create=e=>new qt({typeName:I.ZodBoolean,coerce:e?.coerce||!1,...N(e)});var Wt=class e extends M{_parse(t){if(this._def.coerce&&(t.data=new Date(t.data)),this._getType(t)!==S.date){let i=this._getOrReturnCtx(t);return w(i,{code:k.invalid_type,expected:S.date,received:i.parsedType}),E}if(Number.isNaN(t.data.getTime())){let i=this._getOrReturnCtx(t);return w(i,{code:k.invalid_date}),E}let r=new ae,s;for(let i of this._def.checks)i.kind==="min"?t.data.getTime()<i.value&&(s=this._getOrReturnCtx(t,s),w(s,{code:k.too_small,message:i.message,inclusive:!0,exact:!1,minimum:i.value,type:"date"}),r.dirty()):i.kind==="max"?t.data.getTime()>i.value&&(s=this._getOrReturnCtx(t,s),w(s,{code:k.too_big,message:i.message,inclusive:!0,exact:!1,maximum:i.value,type:"date"}),r.dirty()):j.assertNever(i);return{status:r.value,value:new Date(t.data.getTime())}}_addCheck(t){return new e({...this._def,checks:[...this._def.checks,t]})}min(t,n){return this._addCheck({kind:"min",value:t.getTime(),message:R.toString(n)})}max(t,n){return this._addCheck({kind:"max",value:t.getTime(),message:R.toString(n)})}get minDate(){let t=null;for(let n of this._def.checks)n.kind==="min"&&(t===null||n.value>t)&&(t=n.value);return t!=null?new Date(t):null}get maxDate(){let t=null;for(let n of this._def.checks)n.kind==="max"&&(t===null||n.value<t)&&(t=n.value);return t!=null?new Date(t):null}};Wt.create=e=>new Wt({checks:[],coerce:e?.coerce||!1,typeName:I.ZodDate,...N(e)});var On=class extends M{_parse(t){if(this._getType(t)!==S.symbol){let r=this._getOrReturnCtx(t);return w(r,{code:k.invalid_type,expected:S.symbol,received:r.parsedType}),E}return de(t.data)}};On.create=e=>new On({typeName:I.ZodSymbol,...N(e)});var Ht=class extends M{_parse(t){if(this._getType(t)!==S.undefined){let r=this._getOrReturnCtx(t);return w(r,{code:k.invalid_type,expected:S.undefined,received:r.parsedType}),E}return de(t.data)}};Ht.create=e=>new Ht({typeName:I.ZodUndefined,...N(e)});var $t=class extends M{_parse(t){if(this._getType(t)!==S.null){let r=this._getOrReturnCtx(t);return w(r,{code:k.invalid_type,expected:S.null,received:r.parsedType}),E}return de(t.data)}};$t.create=e=>new $t({typeName:I.ZodNull,...N(e)});var xt=class extends M{constructor(){super(...arguments),this._any=!0}_parse(t){return de(t.data)}};xt.create=e=>new xt({typeName:I.ZodAny,...N(e)});var st=class extends M{constructor(){super(...arguments),this._unknown=!0}_parse(t){return de(t.data)}};st.create=e=>new st({typeName:I.ZodUnknown,...N(e)});var Ue=class extends M{_parse(t){let n=this._getOrReturnCtx(t);return w(n,{code:k.invalid_type,expected:S.never,received:n.parsedType}),E}};Ue.create=e=>new Ue({typeName:I.ZodNever,...N(e)});var In=class extends M{_parse(t){if(this._getType(t)!==S.undefined){let r=this._getOrReturnCtx(t);return w(r,{code:k.invalid_type,expected:S.void,received:r.parsedType}),E}return de(t.data)}};In.create=e=>new In({typeName:I.ZodVoid,...N(e)});var it=class e extends M{_parse(t){let{ctx:n,status:r}=this._processInputParams(t),s=this._def;if(n.parsedType!==S.array)return w(n,{code:k.invalid_type,expected:S.array,received:n.parsedType}),E;if(s.exactLength!==null){let a=n.data.length>s.exactLength.value,o=n.data.length<s.exactLength.value;(a||o)&&(w(n,{code:a?k.too_big:k.too_small,minimum:o?s.exactLength.value:void 0,maximum:a?s.exactLength.value:void 0,type:"array",inclusive:!0,exact:!0,message:s.exactLength.message}),r.dirty())}if(s.minLength!==null&&n.data.length<s.minLength.value&&(w(n,{code:k.too_small,minimum:s.minLength.value,type:"array",inclusive:!0,exact:!1,message:s.minLength.message}),r.dirty()),s.maxLength!==null&&n.data.length>s.maxLength.value&&(w(n,{code:k.too_big,maximum:s.maxLength.value,type:"array",inclusive:!0,exact:!1,message:s.maxLength.message}),r.dirty()),n.common.async)return Promise.all([...n.data].map((a,o)=>s.type._parseAsync(new Ne(n,a,n.path,o)))).then(a=>ae.mergeArray(r,a));let i=[...n.data].map((a,o)=>s.type._parseSync(new Ne(n,a,n.path,o)));return ae.mergeArray(r,i)}get element(){return this._def.type}min(t,n){return new e({...this._def,minLength:{value:t,message:R.toString(n)}})}max(t,n){return new e({...this._def,maxLength:{value:t,message:R.toString(n)}})}length(t,n){return new e({...this._def,exactLength:{value:t,message:R.toString(n)}})}nonempty(t){return this.min(1,t)}};it.create=(e,t)=>new it({type:e,minLength:null,maxLength:null,exactLength:null,typeName:I.ZodArray,...N(t)});function En(e){if(e instanceof be){let t={};for(let n in e.shape){let r=e.shape[n];t[n]=De.create(En(r))}return new be({...e._def,shape:()=>t})}else return e instanceof it?new it({...e._def,type:En(e.element)}):e instanceof De?De.create(En(e.unwrap())):e instanceof Xe?Xe.create(En(e.unwrap())):e instanceof Ze?Ze.create(e.items.map(t=>En(t))):e}var be=class e extends M{constructor(){super(...arguments),this._cached=null,this.nonstrict=this.passthrough,this.augment=this.extend}_getCached(){if(this._cached!==null)return this._cached;let t=this._def.shape(),n=j.objectKeys(t);return this._cached={shape:t,keys:n},this._cached}_parse(t){if(this._getType(t)!==S.object){let l=this._getOrReturnCtx(t);return w(l,{code:k.invalid_type,expected:S.object,received:l.parsedType}),E}let{status:r,ctx:s}=this._processInputParams(t),{shape:i,keys:a}=this._getCached(),o=[];if(!(this._def.catchall instanceof Ue&&this._def.unknownKeys==="strip"))for(let l in s.data)a.includes(l)||o.push(l);let c=[];for(let l of a){let u=i[l],d=s.data[l];c.push({key:{status:"valid",value:l},value:u._parse(new Ne(s,d,s.path,l)),alwaysSet:l in s.data})}if(this._def.catchall instanceof Ue){let l=this._def.unknownKeys;if(l==="passthrough")for(let u of o)c.push({key:{status:"valid",value:u},value:{status:"valid",value:s.data[u]}});else if(l==="strict")o.length>0&&(w(s,{code:k.unrecognized_keys,keys:o}),r.dirty());else if(l!=="strip")throw new Error("Internal ZodObject error: invalid unknownKeys value.")}else{let l=this._def.catchall;for(let u of o){let d=s.data[u];c.push({key:{status:"valid",value:u},value:l._parse(new Ne(s,d,s.path,u)),alwaysSet:u in s.data})}}return s.common.async?Promise.resolve().then(async()=>{let l=[];for(let u of c){let d=await u.key,p=await u.value;l.push({key:d,value:p,alwaysSet:u.alwaysSet})}return l}).then(l=>ae.mergeObjectSync(r,l)):ae.mergeObjectSync(r,c)}get shape(){return this._def.shape()}strict(t){return R.errToObj,new e({...this._def,unknownKeys:"strict",...t!==void 0?{errorMap:(n,r)=>{let s=this._def.errorMap?.(n,r).message??r.defaultError;return n.code==="unrecognized_keys"?{message:R.errToObj(t).message??s}:{message:s}}}:{}})}strip(){return new e({...this._def,unknownKeys:"strip"})}passthrough(){return new e({...this._def,unknownKeys:"passthrough"})}extend(t){return new e({...this._def,shape:()=>({...this._def.shape(),...t})})}merge(t){return new e({unknownKeys:t._def.unknownKeys,catchall:t._def.catchall,shape:()=>({...this._def.shape(),...t._def.shape()}),typeName:I.ZodObject})}setKey(t,n){return this.augment({[t]:n})}catchall(t){return new e({...this._def,catchall:t})}pick(t){let n={};for(let r of j.objectKeys(t))t[r]&&this.shape[r]&&(n[r]=this.shape[r]);return new e({...this._def,shape:()=>n})}omit(t){let n={};for(let r of j.objectKeys(this.shape))t[r]||(n[r]=this.shape[r]);return new e({...this._def,shape:()=>n})}deepPartial(){return En(this)}partial(t){let n={};for(let r of j.objectKeys(this.shape)){let s=this.shape[r];t&&!t[r]?n[r]=s:n[r]=s.optional()}return new e({...this._def,shape:()=>n})}required(t){let n={};for(let r of j.objectKeys(this.shape))if(t&&!t[r])n[r]=this.shape[r];else{let i=this.shape[r];for(;i instanceof De;)i=i._def.innerType;n[r]=i}return new e({...this._def,shape:()=>n})}keyof(){return Cp(j.objectKeys(this.shape))}};be.create=(e,t)=>new be({shape:()=>e,unknownKeys:"strip",catchall:Ue.create(),typeName:I.ZodObject,...N(t)});be.strictCreate=(e,t)=>new be({shape:()=>e,unknownKeys:"strict",catchall:Ue.create(),typeName:I.ZodObject,...N(t)});be.lazycreate=(e,t)=>new be({shape:e,unknownKeys:"strip",catchall:Ue.create(),typeName:I.ZodObject,...N(t)});var Bt=class extends M{_parse(t){let{ctx:n}=this._processInputParams(t),r=this._def.options;function s(i){for(let o of i)if(o.result.status==="valid")return o.result;for(let o of i)if(o.result.status==="dirty")return n.common.issues.push(...o.ctx.common.issues),o.result;let a=i.map(o=>new ke(o.ctx.common.issues));return w(n,{code:k.invalid_union,unionErrors:a}),E}if(n.common.async)return Promise.all(r.map(async i=>{let a={...n,common:{...n.common,issues:[]},parent:null};return{result:await i._parseAsync({data:n.data,path:n.path,parent:a}),ctx:a}})).then(s);{let i,a=[];for(let c of r){let l={...n,common:{...n.common,issues:[]},parent:null},u=c._parseSync({data:n.data,path:n.path,parent:l});if(u.status==="valid")return u;u.status==="dirty"&&!i&&(i={result:u,ctx:l}),l.common.issues.length&&a.push(l.common.issues)}if(i)return n.common.issues.push(...i.ctx.common.issues),i.result;let o=a.map(c=>new ke(c));return w(n,{code:k.invalid_union,unionErrors:o}),E}}get options(){return this._def.options}};Bt.create=(e,t)=>new Bt({options:e,typeName:I.ZodUnion,...N(t)});var rt=e=>e instanceof zt?rt(e.schema):e instanceof Me?rt(e.innerType()):e instanceof Vt?[e.value]:e instanceof Kt?e.options:e instanceof Yt?j.objectValues(e.enum):e instanceof Zt?rt(e._def.innerType):e instanceof Ht?[void 0]:e instanceof $t?[null]:e instanceof De?[void 0,...rt(e.unwrap())]:e instanceof Xe?[null,...rt(e.unwrap())]:e instanceof sr||e instanceof Jt?rt(e.unwrap()):e instanceof Xt?rt(e._def.innerType):[],fs=class e extends M{_parse(t){let{ctx:n}=this._processInputParams(t);if(n.parsedType!==S.object)return w(n,{code:k.invalid_type,expected:S.object,received:n.parsedType}),E;let r=this.discriminator,s=n.data[r],i=this.optionsMap.get(s);return i?n.common.async?i._parseAsync({data:n.data,path:n.path,parent:n}):i._parseSync({data:n.data,path:n.path,parent:n}):(w(n,{code:k.invalid_union_discriminator,options:Array.from(this.optionsMap.keys()),path:[r]}),E)}get discriminator(){return this._def.discriminator}get options(){return this._def.options}get optionsMap(){return this._def.optionsMap}static create(t,n,r){let s=new Map;for(let i of n){let a=rt(i.shape[t]);if(!a.length)throw new Error(`A discriminator value for key \`${t}\` could not be extracted from all schema options`);for(let o of a){if(s.has(o))throw new Error(`Discriminator property ${String(t)} has duplicate value ${String(o)}`);s.set(o,i)}}return new e({typeName:I.ZodDiscriminatedUnion,discriminator:t,options:n,optionsMap:s,...N(r)})}};function Ca(e,t){let n=Ye(e),r=Ye(t);if(e===t)return{valid:!0,data:e};if(n===S.object&&r===S.object){let s=j.objectKeys(t),i=j.objectKeys(e).filter(o=>s.indexOf(o)!==-1),a={...e,...t};for(let o of i){let c=Ca(e[o],t[o]);if(!c.valid)return{valid:!1};a[o]=c.data}return{valid:!0,data:a}}else if(n===S.array&&r===S.array){if(e.length!==t.length)return{valid:!1};let s=[];for(let i=0;i<e.length;i++){let a=e[i],o=t[i],c=Ca(a,o);if(!c.valid)return{valid:!1};s.push(c.data)}return{valid:!0,data:s}}else return n===S.date&&r===S.date&&+e==+t?{valid:!0,data:e}:{valid:!1}}var Gt=class extends M{_parse(t){let{status:n,ctx:r}=this._processInputParams(t),s=(i,a)=>{if(ds(i)||ds(a))return E;let o=Ca(i.value,a.value);return o.valid?((ps(i)||ps(a))&&n.dirty(),{status:n.value,value:o.data}):(w(r,{code:k.invalid_intersection_types}),E)};return r.common.async?Promise.all([this._def.left._parseAsync({data:r.data,path:r.path,parent:r}),this._def.right._parseAsync({data:r.data,path:r.path,parent:r})]).then(([i,a])=>s(i,a)):s(this._def.left._parseSync({data:r.data,path:r.path,parent:r}),this._def.right._parseSync({data:r.data,path:r.path,parent:r}))}};Gt.create=(e,t,n)=>new Gt({left:e,right:t,typeName:I.ZodIntersection,...N(n)});var Ze=class e extends M{_parse(t){let{status:n,ctx:r}=this._processInputParams(t);if(r.parsedType!==S.array)return w(r,{code:k.invalid_type,expected:S.array,received:r.parsedType}),E;if(r.data.length<this._def.items.length)return w(r,{code:k.too_small,minimum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),E;!this._def.rest&&r.data.length>this._def.items.length&&(w(r,{code:k.too_big,maximum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),n.dirty());let i=[...r.data].map((a,o)=>{let c=this._def.items[o]||this._def.rest;return c?c._parse(new Ne(r,a,r.path,o)):null}).filter(a=>!!a);return r.common.async?Promise.all(i).then(a=>ae.mergeArray(n,a)):ae.mergeArray(n,i)}get items(){return this._def.items}rest(t){return new e({...this._def,rest:t})}};Ze.create=(e,t)=>{if(!Array.isArray(e))throw new Error("You must pass an array of schemas to z.tuple([ ... ])");return new Ze({items:e,typeName:I.ZodTuple,rest:null,...N(t)})};var ms=class e extends M{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(t){let{status:n,ctx:r}=this._processInputParams(t);if(r.parsedType!==S.object)return w(r,{code:k.invalid_type,expected:S.object,received:r.parsedType}),E;let s=[],i=this._def.keyType,a=this._def.valueType;for(let o in r.data)s.push({key:i._parse(new Ne(r,o,r.path,o)),value:a._parse(new Ne(r,r.data[o],r.path,o)),alwaysSet:o in r.data});return r.common.async?ae.mergeObjectAsync(n,s):ae.mergeObjectSync(n,s)}get element(){return this._def.valueType}static create(t,n,r){return n instanceof M?new e({keyType:t,valueType:n,typeName:I.ZodRecord,...N(r)}):new e({keyType:vt.create(),valueType:t,typeName:I.ZodRecord,...N(n)})}},Dn=class extends M{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(t){let{status:n,ctx:r}=this._processInputParams(t);if(r.parsedType!==S.map)return w(r,{code:k.invalid_type,expected:S.map,received:r.parsedType}),E;let s=this._def.keyType,i=this._def.valueType,a=[...r.data.entries()].map(([o,c],l)=>({key:s._parse(new Ne(r,o,r.path,[l,"key"])),value:i._parse(new Ne(r,c,r.path,[l,"value"]))}));if(r.common.async){let o=new Map;return Promise.resolve().then(async()=>{for(let c of a){let l=await c.key,u=await c.value;if(l.status==="aborted"||u.status==="aborted")return E;(l.status==="dirty"||u.status==="dirty")&&n.dirty(),o.set(l.value,u.value)}return{status:n.value,value:o}})}else{let o=new Map;for(let c of a){let l=c.key,u=c.value;if(l.status==="aborted"||u.status==="aborted")return E;(l.status==="dirty"||u.status==="dirty")&&n.dirty(),o.set(l.value,u.value)}return{status:n.value,value:o}}}};Dn.create=(e,t,n)=>new Dn({valueType:t,keyType:e,typeName:I.ZodMap,...N(n)});var Nn=class e extends M{_parse(t){let{status:n,ctx:r}=this._processInputParams(t);if(r.parsedType!==S.set)return w(r,{code:k.invalid_type,expected:S.set,received:r.parsedType}),E;let s=this._def;s.minSize!==null&&r.data.size<s.minSize.value&&(w(r,{code:k.too_small,minimum:s.minSize.value,type:"set",inclusive:!0,exact:!1,message:s.minSize.message}),n.dirty()),s.maxSize!==null&&r.data.size>s.maxSize.value&&(w(r,{code:k.too_big,maximum:s.maxSize.value,type:"set",inclusive:!0,exact:!1,message:s.maxSize.message}),n.dirty());let i=this._def.valueType;function a(c){let l=new Set;for(let u of c){if(u.status==="aborted")return E;u.status==="dirty"&&n.dirty(),l.add(u.value)}return{status:n.value,value:l}}let o=[...r.data.values()].map((c,l)=>i._parse(new Ne(r,c,r.path,l)));return r.common.async?Promise.all(o).then(c=>a(c)):a(o)}min(t,n){return new e({...this._def,minSize:{value:t,message:R.toString(n)}})}max(t,n){return new e({...this._def,maxSize:{value:t,message:R.toString(n)}})}size(t,n){return this.min(t,n).max(t,n)}nonempty(t){return this.min(1,t)}};Nn.create=(e,t)=>new Nn({valueType:e,minSize:null,maxSize:null,typeName:I.ZodSet,...N(t)});var hs=class e extends M{constructor(){super(...arguments),this.validate=this.implement}_parse(t){let{ctx:n}=this._processInputParams(t);if(n.parsedType!==S.function)return w(n,{code:k.invalid_type,expected:S.function,received:n.parsedType}),E;function r(o,c){return rr({data:o,path:n.path,errorMaps:[n.common.contextualErrorMap,n.schemaErrorMap,Rn(),nt].filter(l=>!!l),issueData:{code:k.invalid_arguments,argumentsError:c}})}function s(o,c){return rr({data:o,path:n.path,errorMaps:[n.common.contextualErrorMap,n.schemaErrorMap,Rn(),nt].filter(l=>!!l),issueData:{code:k.invalid_return_type,returnTypeError:c}})}let i={errorMap:n.common.contextualErrorMap},a=n.data;if(this._def.returns instanceof _t){let o=this;return de(async function(...c){let l=new ke([]),u=await o._def.args.parseAsync(c,i).catch(m=>{throw l.addIssue(r(c,m)),l}),d=await Reflect.apply(a,this,u);return await o._def.returns._def.type.parseAsync(d,i).catch(m=>{throw l.addIssue(s(d,m)),l})})}else{let o=this;return de(function(...c){let l=o._def.args.safeParse(c,i);if(!l.success)throw new ke([r(c,l.error)]);let u=Reflect.apply(a,this,l.data),d=o._def.returns.safeParse(u,i);if(!d.success)throw new ke([s(u,d.error)]);return d.data})}}parameters(){return this._def.args}returnType(){return this._def.returns}args(...t){return new e({...this._def,args:Ze.create(t).rest(st.create())})}returns(t){return new e({...this._def,returns:t})}implement(t){return this.parse(t)}strictImplement(t){return this.parse(t)}static create(t,n,r){return new e({args:t||Ze.create([]).rest(st.create()),returns:n||st.create(),typeName:I.ZodFunction,...N(r)})}},zt=class extends M{get schema(){return this._def.getter()}_parse(t){let{ctx:n}=this._processInputParams(t);return this._def.getter()._parse({data:n.data,path:n.path,parent:n})}};zt.create=(e,t)=>new zt({getter:e,typeName:I.ZodLazy,...N(t)});var Vt=class extends M{_parse(t){if(t.data!==this._def.value){let n=this._getOrReturnCtx(t);return w(n,{received:n.data,code:k.invalid_literal,expected:this._def.value}),E}return{status:"valid",value:t.data}}get value(){return this._def.value}};Vt.create=(e,t)=>new Vt({value:e,typeName:I.ZodLiteral,...N(t)});function Cp(e,t){return new Kt({values:e,typeName:I.ZodEnum,...N(t)})}var Kt=class e extends M{_parse(t){if(typeof t.data!="string"){let n=this._getOrReturnCtx(t),r=this._def.values;return w(n,{expected:j.joinValues(r),received:n.parsedType,code:k.invalid_type}),E}if(this._cache||(this._cache=new Set(this._def.values)),!this._cache.has(t.data)){let n=this._getOrReturnCtx(t),r=this._def.values;return w(n,{received:n.data,code:k.invalid_enum_value,options:r}),E}return de(t.data)}get options(){return this._def.values}get enum(){let t={};for(let n of this._def.values)t[n]=n;return t}get Values(){let t={};for(let n of this._def.values)t[n]=n;return t}get Enum(){let t={};for(let n of this._def.values)t[n]=n;return t}extract(t,n=this._def){return e.create(t,{...this._def,...n})}exclude(t,n=this._def){return e.create(this.options.filter(r=>!t.includes(r)),{...this._def,...n})}};Kt.create=Cp;var Yt=class extends M{_parse(t){let n=j.getValidEnumValues(this._def.values),r=this._getOrReturnCtx(t);if(r.parsedType!==S.string&&r.parsedType!==S.number){let s=j.objectValues(n);return w(r,{expected:j.joinValues(s),received:r.parsedType,code:k.invalid_type}),E}if(this._cache||(this._cache=new Set(j.getValidEnumValues(this._def.values))),!this._cache.has(t.data)){let s=j.objectValues(n);return w(r,{received:r.data,code:k.invalid_enum_value,options:s}),E}return de(t.data)}get enum(){return this._def.values}};Yt.create=(e,t)=>new Yt({values:e,typeName:I.ZodNativeEnum,...N(t)});var _t=class extends M{unwrap(){return this._def.type}_parse(t){let{ctx:n}=this._processInputParams(t);if(n.parsedType!==S.promise&&n.common.async===!1)return w(n,{code:k.invalid_type,expected:S.promise,received:n.parsedType}),E;let r=n.parsedType===S.promise?n.data:Promise.resolve(n.data);return de(r.then(s=>this._def.type.parseAsync(s,{path:n.path,errorMap:n.common.contextualErrorMap})))}};_t.create=(e,t)=>new _t({type:e,typeName:I.ZodPromise,...N(t)});var Me=class extends M{innerType(){return this._def.schema}sourceType(){return this._def.schema._def.typeName===I.ZodEffects?this._def.schema.sourceType():this._def.schema}_parse(t){let{status:n,ctx:r}=this._processInputParams(t),s=this._def.effect||null,i={addIssue:a=>{w(r,a),a.fatal?n.abort():n.dirty()},get path(){return r.path}};if(i.addIssue=i.addIssue.bind(i),s.type==="preprocess"){let a=s.transform(r.data,i);if(r.common.async)return Promise.resolve(a).then(async o=>{if(n.value==="aborted")return E;let c=await this._def.schema._parseAsync({data:o,path:r.path,parent:r});return c.status==="aborted"?E:c.status==="dirty"?Ft(c.value):n.value==="dirty"?Ft(c.value):c});{if(n.value==="aborted")return E;let o=this._def.schema._parseSync({data:a,path:r.path,parent:r});return o.status==="aborted"?E:o.status==="dirty"?Ft(o.value):n.value==="dirty"?Ft(o.value):o}}if(s.type==="refinement"){let a=o=>{let c=s.refinement(o,i);if(r.common.async)return Promise.resolve(c);if(c instanceof Promise)throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");return o};if(r.common.async===!1){let o=this._def.schema._parseSync({data:r.data,path:r.path,parent:r});return o.status==="aborted"?E:(o.status==="dirty"&&n.dirty(),a(o.value),{status:n.value,value:o.value})}else return this._def.schema._parseAsync({data:r.data,path:r.path,parent:r}).then(o=>o.status==="aborted"?E:(o.status==="dirty"&&n.dirty(),a(o.value).then(()=>({status:n.value,value:o.value}))))}if(s.type==="transform")if(r.common.async===!1){let a=this._def.schema._parseSync({data:r.data,path:r.path,parent:r});if(!yt(a))return E;let o=s.transform(a.value,i);if(o instanceof Promise)throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");return{status:n.value,value:o}}else return this._def.schema._parseAsync({data:r.data,path:r.path,parent:r}).then(a=>yt(a)?Promise.resolve(s.transform(a.value,i)).then(o=>({status:n.value,value:o})):E);j.assertNever(s)}};Me.create=(e,t,n)=>new Me({schema:e,typeName:I.ZodEffects,effect:t,...N(n)});Me.createWithPreprocess=(e,t,n)=>new Me({schema:t,effect:{type:"preprocess",transform:e},typeName:I.ZodEffects,...N(n)});var De=class extends M{_parse(t){return this._getType(t)===S.undefined?de(void 0):this._def.innerType._parse(t)}unwrap(){return this._def.innerType}};De.create=(e,t)=>new De({innerType:e,typeName:I.ZodOptional,...N(t)});var Xe=class extends M{_parse(t){return this._getType(t)===S.null?de(null):this._def.innerType._parse(t)}unwrap(){return this._def.innerType}};Xe.create=(e,t)=>new Xe({innerType:e,typeName:I.ZodNullable,...N(t)});var Zt=class extends M{_parse(t){let{ctx:n}=this._processInputParams(t),r=n.data;return n.parsedType===S.undefined&&(r=this._def.defaultValue()),this._def.innerType._parse({data:r,path:n.path,parent:n})}removeDefault(){return this._def.innerType}};Zt.create=(e,t)=>new Zt({innerType:e,typeName:I.ZodDefault,defaultValue:typeof t.default=="function"?t.default:()=>t.default,...N(t)});var Xt=class extends M{_parse(t){let{ctx:n}=this._processInputParams(t),r={...n,common:{...n.common,issues:[]}},s=this._def.innerType._parse({data:r.data,path:r.path,parent:{...r}});return Pn(s)?s.then(i=>({status:"valid",value:i.status==="valid"?i.value:this._def.catchValue({get error(){return new ke(r.common.issues)},input:r.data})})):{status:"valid",value:s.status==="valid"?s.value:this._def.catchValue({get error(){return new ke(r.common.issues)},input:r.data})}}removeCatch(){return this._def.innerType}};Xt.create=(e,t)=>new Xt({innerType:e,typeName:I.ZodCatch,catchValue:typeof t.catch=="function"?t.catch:()=>t.catch,...N(t)});var Mn=class extends M{_parse(t){if(this._getType(t)!==S.nan){let r=this._getOrReturnCtx(t);return w(r,{code:k.invalid_type,expected:S.nan,received:r.parsedType}),E}return{status:"valid",value:t.data}}};Mn.create=e=>new Mn({typeName:I.ZodNaN,...N(e)});var uk=Symbol("zod_brand"),sr=class extends M{_parse(t){let{ctx:n}=this._processInputParams(t),r=n.data;return this._def.type._parse({data:r,path:n.path,parent:n})}unwrap(){return this._def.type}},ir=class e extends M{_parse(t){let{status:n,ctx:r}=this._processInputParams(t);if(r.common.async)return(async()=>{let i=await this._def.in._parseAsync({data:r.data,path:r.path,parent:r});return i.status==="aborted"?E:i.status==="dirty"?(n.dirty(),Ft(i.value)):this._def.out._parseAsync({data:i.value,path:r.path,parent:r})})();{let s=this._def.in._parseSync({data:r.data,path:r.path,parent:r});return s.status==="aborted"?E:s.status==="dirty"?(n.dirty(),{status:"dirty",value:s.value}):this._def.out._parseSync({data:s.value,path:r.path,parent:r})}}static create(t,n){return new e({in:t,out:n,typeName:I.ZodPipeline})}},Jt=class extends M{_parse(t){let n=this._def.innerType._parse(t),r=s=>(yt(s)&&(s.value=Object.freeze(s.value)),s);return Pn(n)?n.then(s=>r(s)):r(n)}unwrap(){return this._def.innerType}};Jt.create=(e,t)=>new Jt({innerType:e,typeName:I.ZodReadonly,...N(t)});function kp(e,t){let n=typeof e=="function"?e(t):typeof e=="string"?{message:e}:e;return typeof n=="string"?{message:n}:n}function Tp(e,t={},n){return e?xt.create().superRefine((r,s)=>{let i=e(r);if(i instanceof Promise)return i.then(a=>{if(!a){let o=kp(t,r),c=o.fatal??n??!0;s.addIssue({code:"custom",...o,fatal:c})}});if(!i){let a=kp(t,r),o=a.fatal??n??!0;s.addIssue({code:"custom",...a,fatal:o})}}):xt.create()}var dk={object:be.lazycreate},I;(function(e){e.ZodString="ZodString",e.ZodNumber="ZodNumber",e.ZodNaN="ZodNaN",e.ZodBigInt="ZodBigInt",e.ZodBoolean="ZodBoolean",e.ZodDate="ZodDate",e.ZodSymbol="ZodSymbol",e.ZodUndefined="ZodUndefined",e.ZodNull="ZodNull",e.ZodAny="ZodAny",e.ZodUnknown="ZodUnknown",e.ZodNever="ZodNever",e.ZodVoid="ZodVoid",e.ZodArray="ZodArray",e.ZodObject="ZodObject",e.ZodUnion="ZodUnion",e.ZodDiscriminatedUnion="ZodDiscriminatedUnion",e.ZodIntersection="ZodIntersection",e.ZodTuple="ZodTuple",e.ZodRecord="ZodRecord",e.ZodMap="ZodMap",e.ZodSet="ZodSet",e.ZodFunction="ZodFunction",e.ZodLazy="ZodLazy",e.ZodLiteral="ZodLiteral",e.ZodEnum="ZodEnum",e.ZodEffects="ZodEffects",e.ZodNativeEnum="ZodNativeEnum",e.ZodOptional="ZodOptional",e.ZodNullable="ZodNullable",e.ZodDefault="ZodDefault",e.ZodCatch="ZodCatch",e.ZodPromise="ZodPromise",e.ZodBranded="ZodBranded",e.ZodPipeline="ZodPipeline",e.ZodReadonly="ZodReadonly"})(I||(I={}));var pk=(e,t={message:`Input not instance of ${e.name}`})=>Tp(n=>n instanceof e,t),Ap=vt.create,Rp=jt.create,fk=Mn.create,mk=Ut.create,Pp=qt.create,hk=Wt.create,gk=On.create,yk=Ht.create,vk=$t.create,xk=xt.create,_k=st.create,kk=Ue.create,bk=In.create,wk=it.create,Sk=be.create,Ck=be.strictCreate,Tk=Bt.create,Ak=fs.create,Rk=Gt.create,Pk=Ze.create,Ek=ms.create,Ok=Dn.create,Ik=Nn.create,Dk=hs.create,Nk=zt.create,Mk=Vt.create,Lk=Kt.create,Fk=Yt.create,jk=_t.create,Uk=Me.create,qk=De.create,Wk=Xe.create,Hk=Me.createWithPreprocess,$k=ir.create,Bk=()=>Ap().optional(),Gk=()=>Rp().optional(),zk=()=>Pp().optional(),Vk={string:(e=>vt.create({...e,coerce:!0})),number:(e=>jt.create({...e,coerce:!0})),boolean:(e=>qt.create({...e,coerce:!0})),bigint:(e=>Ut.create({...e,coerce:!0})),date:(e=>Wt.create({...e,coerce:!0}))};var Kk=E;var Yk=h.enum(["flag","positional","stdin"]),Zk=h.object({max_turns:h.number().int().positive().optional(),max_budget_usd:h.number().positive().optional(),timeout:h.number().int().positive().optional()}).optional(),gs=h.object({cli:h.string(),model:h.string(),subcommand:h.string().optional(),unattended_flags:h.array(h.string()),output_flags:h.array(h.string()),prompt_style:Yk,safety:Zk,provider:h.string().optional(),config_overrides:h.record(h.string(),h.unknown()).optional()});async function Ta(e){let t=kt.join(e,an),n=[];try{let r=[],s=a=>a.replace(/\\/g,"/"),i=async a=>{let o=await Qt.readdir(a,{withFileTypes:!0});for(let c of o){let l=kt.join(a,c.name);c.isDirectory()?await i(l):c.isFile()&&c.name.endsWith(".md")&&r.push(l)}};await i(t);for(let a of r){let o=s(kt.relative(t,a)),c=s(kt.relative(e,a)),l=kt.basename(a,".md"),d=!o.includes("/")?l:c;try{let p=await Qt.readFile(a,"utf-8"),m=(0,Op.default)(p),f=typeof m.data.name=="string"?m.data.name:Ep(l),_=gs.safeParse(m.data);n.push({id:d,name:f,path:c,config:_.success?_.data:void 0})}catch{n.push({id:d,name:Ep(l),path:c,config:void 0})}}}catch{return[]}return n.sort((r,s)=>r.name.localeCompare(s.name))}async function Ln(e,t){return(await Ta(e)).find(s=>s.id===t||s.name===t)?.config}function Ep(e){return e.split(/[-_]/).map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}var Ip=5e4;function Dp(e){return`'${e.replace(/'/g,"'\\''")}'`}function Xk(e){let t=[e.command,...e.args].map(Dp).join(" ");return e.stdin?`printf %s ${Dp(e.stdin)} | ${t}`:t}function Jk(e,t){let n=ys.window.terminals.find(r=>r.name===e);return n||ys.window.createTerminal({name:e,cwd:t})}async function vs(e,t,n){try{let r=await ba(e,t);if(!r)throw new Error(`Task not found: ${t}`);if(!r.provider)throw new Error(`No provider configured for task "${r.title}". Configure a provider first.`);let s=await Ln(e,r.provider);if(!s)throw new Error(`Provider not found: ${r.provider}. Configure a valid provider in .kanban2code/_providers.`);let i=await vp(r,e);i.length>Ip&&console.warn(`Prompt for task "${r.id}" exceeds ${Ip} chars (${i.length}).`);let o=sp(s.cli).buildCommand(s,i),c=Xk(o),l=Jk(r.title,n);l.sendText(c),l.show()}catch(r){let s=r instanceof Error?r.message:String(r);throw ys.window.showErrorMessage(`Failed to execute task in terminal: ${s}`),r}}function Aa(){return J.workspace.workspaceFolders?.[0]?.uri.fsPath??null}async function Np(e,t){let n=t?.getKanbanRoot?.();if(n)return n;let r=await os(e);return t?.setKanbanRoot?.(r),r}async function Mp(){await J.window.showInformationMessage("Kanban2Code workspace not found.","Create Workspace")==="Create Workspace"&&await J.commands.executeCommand("kanban2code.createWorkspace")}function Lp(e,t={}){let n=J.commands.registerCommand("kanban2code.createWorkspace",async()=>{let a=Aa();if(!a){J.window.showErrorMessage("Please open a workspace folder first");return}try{await rp(a);let o=Ra.join(a,rn);t.setKanbanRoot?.(o),await t.onWorkspaceCreated?.(o,a),J.window.showInformationMessage("Kanban2Code workspace created successfully")}catch(o){let c=o instanceof Error?o.message:String(o);if(c.includes("already initialized")){J.window.showInformationMessage(c);return}J.window.showErrorMessage(`Failed to create workspace: ${c}`)}}),r=J.commands.registerCommand("kanban2code.runTask",async()=>{let a=Aa();if(!a){J.window.showErrorMessage("Please open a workspace folder first");return}let o=await Np(a,t);if(!o){await Mp();return}let l=(await er(o)).filter(p=>!!p.provider);if(l.length===0){J.window.showInformationMessage("No tasks with providers configured found");return}let u=l.map(p=>({label:p.title,description:`${p.stage}${p.provider?` | ${p.provider}`:""}`,detail:p.filePath,taskId:p.id})),d=await J.window.showQuickPick(u,{placeHolder:"Select a task to run in terminal",matchOnDescription:!0,matchOnDetail:!0});d&&await vs(o,d.taskId,a)}),s=J.commands.registerCommand("kanban2code.newTask",async()=>{await J.commands.executeCommand("kanban2code.sidebar.focus"),await t.focusSidebarChat?.()}),i=J.commands.registerCommand("kanban2code.openSettings",async()=>{let a=Aa();if(!a){J.window.showErrorMessage("Please open a workspace folder first");return}let o=await Np(a,t);if(!o){await Mp();return}let c=Ra.join(o,an);await J.commands.executeCommand("revealInExplorer",J.Uri.file(c))});e.subscriptions.push(n,r,s,i)}var St=q(require("fs/promises")),qe=q(require("path")),Na=q(require("vscode"));var Ea=q(require("fs/promises")),Oa=q(require("path")),qp=q(wn());var Qk=5,eb=[{name:"nextjs",patterns:["nextjs","next.js","app router"]},{name:"react",patterns:["react","jsx","tsx"]},{name:"python",patterns:["python","pyproject.toml",".py"]},{name:"django",patterns:["django"]},{name:"flask",patterns:["flask"]},{name:"node",patterns:["node","node.js","package.json"]}];function Pa(e){return e.toLowerCase()}function Fp(e){return e?e.toLowerCase().replace(/[^a-z0-9]+/g,""):""}function Wp(e,t){if(!e)return!1;let n=Fp(e);return n?t.some(r=>{let s=Fp(r);return n.includes(s)||s.includes(n)}):!1}function tb(e,t){if(!t||t.length===0)return[];let n=Pa(e);return t.filter(r=>n.includes(Pa(r)))}function jp(e){return e==="high"?0:e==="medium"?1:e==="low"?2:3}function Up(e){return-e}async function nb(e,t){try{let n=Oa.join(e,t),r=await Ea.readFile(n,"utf-8"),s=(0,qp.default)(r);return typeof s.data.priority=="number"&&Number.isFinite(s.data.priority)?s.data.priority:void 0}catch{return}}async function rb(e,t){let n=await Promise.all(t.map(s=>nb(e,s.path))),r=t.map((s,i)=>[s.id,{id:s.id,name:s.name,path:s.path,framework:s.framework,priority:n[i]??s.priority,alwaysAttach:s.alwaysAttach??!1,triggers:s.triggers??[]}]);return Object.fromEntries(r)}function sb(e,t,n,r){let s=[],i=0;return e.alwaysAttach&&(s.push("alwaysAttach"),i+=100),Wp(e.framework,t)&&(s.push(`framework:${e.framework}`),i+=20),n.length>0&&(s.push(`triggers:${n.join(",")}`),i+=10+n.length),{skill:e,score:i,reason:s,priorityValue:typeof r=="number"?r:0,priorityLabel:r}}function ib(e,t,n,r){return{id:e.id,name:e.name,path:e.path,content:t,priority:r,reason:n}}function ab(e){let t=Pa(e),n=new Set;for(let r of eb)r.patterns.some(s=>t.includes(s))&&n.add(r.name);return Array.from(n)}async function Hp(e,t,n=Qk){let r=await ls(e);if(r.length===0)return[];let s=ab(t),i=await rb(e,r),a=new Map;for(let u of r){let d=tb(t,u.triggers),p=Wp(u.framework,s),m=d.length>0;if(!(!!u.alwaysAttach||p||m))continue;let _=i[u.id]?.priority??u.priority,T=sb(u,s,d,_),F=a.get(u.id);(!F||T.score>F.score)&&a.set(u.id,T)}let c=Array.from(a.values()).sort((u,d)=>{if(u.skill.alwaysAttach!==d.skill.alwaysAttach)return u.skill.alwaysAttach?-1:1;let p=jp(u.priorityLabel),m=jp(d.priorityLabel);return p!==m?p-m:u.score!==d.score?d.score-u.score:u.priorityValue!==d.priorityValue?Up(u.priorityValue)-Up(d.priorityValue):u.skill.name.localeCompare(d.skill.name)}).slice(0,Math.max(0,n));return(await Promise.all(c.map(async u=>{try{let d=await Ea.readFile(Oa.join(e,u.skill.path),"utf-8");return ib(u.skill,d,u.reason.join("; ")||"matched",i[u.skill.id]?.priority??u.skill.priority)}catch{return null}}))).filter(u=>!!u)}var Gp=q(require("fs/promises"));var xs=q(require("fs")),Bp=q(require("path")),bt=q(require("vscode"));var Le={version:"1.0.0",agents:{opus:{description:"Claude Opus - Best for planning, architecture, and complex UI work",primaryUse:["planning","architecture","ui","design"],secondaryUse:["auditing","code-review"]},codex:{description:"Claude Codex - Best for backend logic, APIs, and code auditing",primaryUse:["backend","api","logic","coding"],secondaryUse:["auditing"]},sonnet:{description:"Claude Sonnet - Best for quick tasks and context creation",primaryUse:["quick-tasks","context-creation","roadmap-reading"],secondaryUse:[]},glm:{description:"GLM - Best for task splitting and simple context",primaryUse:["task-splitting","simple-context"],secondaryUse:["miscellaneous"]},gemini:{description:"Gemini - Alternative for UI work",primaryUse:["ui"],secondaryUse:[]}},tags:{categories:{type:{description:"Type of task",values:["feature","bug","refactor","spike","docs","test","design","security","config","audit"]},priority:{description:"Task priority level",values:["critical","high","medium","low"]},domain:{description:"Technical domain",values:["frontend","backend","api","database","infra","devops","ui","ux"]},component:{description:"Project component or module",values:["core","auth","ui","utils","services","types","config"]}}},stages:{inbox:{description:"New tasks awaiting triage",order:0,allowedTransitions:["plan","completed"],color:"#6b7280"},plan:{description:"Tasks being planned and designed",order:1,allowedTransitions:["inbox","code","completed"],color:"#3b82f6"},code:{description:"Tasks in active development",order:2,allowedTransitions:["plan","audit","completed"],color:"#f59e0b"},audit:{description:"Tasks under review",order:3,allowedTransitions:["code","completed"],color:"#8b5cf6"},completed:{description:"Finished tasks",order:4,allowedTransitions:["inbox"],color:"#10b981"}},preferences:{fileNaming:"kebab-case",requireTests:!1,defaultAgent:"codex",archiveCompleted:!0,archiveAfterDays:7},providerDefaults:{coder:"opus",auditor:"opus",planner:"sonnet",contextBuilder:"sonnet",splitter:"glm"}};var $p="config.json",Ia=class{config=Le;kanbanRoot=null;configWatcher=null;onConfigChangeEmitter=new bt.EventEmitter;onConfigChange=this.onConfigChangeEmitter.event;async initialize(t){this.kanbanRoot=t,await this.loadConfig(),this.setupWatcher()}async loadConfig(){if(!this.kanbanRoot)return console.log("ConfigService: No kanban root set, using defaults"),this.config=Le,this.config;let t=Bp.join(this.kanbanRoot,$p);try{if(xs.existsSync(t)){let n=xs.readFileSync(t,"utf-8"),r=JSON.parse(n);this.config=this.mergeWithDefaults(r),console.log("ConfigService: Loaded config from",t)}else console.log("ConfigService: No config.json found, using defaults"),this.config=Le}catch(n){console.error("ConfigService: Error loading config, using defaults:",n),bt.window.showWarningMessage(`Kanban2Code: Error loading config.json. Using defaults. ${n instanceof Error?n.message:""}`),this.config=Le}return this.config}mergeWithDefaults(t){return{version:t.version??Le.version,project:t.project,agents:{...Le.agents,...t.agents},tags:{categories:{...Le.tags.categories,...t.tags?.categories??{}}},stages:{...Le.stages,...t.stages},preferences:{...Le.preferences,...t.preferences},personalities:t.personalities,providerDefaults:{...Le.providerDefaults,...t.providerDefaults}}}setupWatcher(){if(!this.kanbanRoot)return;this.configWatcher?.dispose();let t=new bt.RelativePattern(this.kanbanRoot,$p);this.configWatcher=bt.workspace.createFileSystemWatcher(t),this.configWatcher.onDidChange(async()=>{console.log("ConfigService: config.json changed, reloading"),await this.loadConfig(),this.onConfigChangeEmitter.fire(this.config)}),this.configWatcher.onDidCreate(async()=>{console.log("ConfigService: config.json created, loading"),await this.loadConfig(),this.onConfigChangeEmitter.fire(this.config)}),this.configWatcher.onDidDelete(()=>{console.log("ConfigService: config.json deleted, using defaults"),this.config=Le,this.onConfigChangeEmitter.fire(this.config)})}getConfig(){return this.config}getAgent(t){return this.config.agents[t]}getAgentNames(){return Object.keys(this.config.agents)}getTagCategory(t){return this.config.tags.categories[t]}getAllTags(){let t=[];for(let n of Object.values(this.config.tags.categories))t.push(...n.values);return[...new Set(t)]}getStage(t){return this.config.stages[t]}getStageNames(){return Object.entries(this.config.stages).sort(([,t],[,n])=>t.order-n.order).map(([t])=>t)}getAllowedTransitions(t){return this.config.stages[t]?.allowedTransitions??[]}getPreferences(){return this.config.preferences}getDefaultAgent(){return this.config.preferences.defaultAgent??"codex"}getPersonality(t){return this.config.personalities?.[t]}getPersonalityNames(){return Object.keys(this.config.personalities??{})}getProject(){return this.config.project}getProviderDefault(t){return this.config.providerDefaults?.[t]}getProviderDefaults(){return this.config.providerDefaults??{}}isTransitionAllowed(t,n){return this.getAllowedTransitions(t).includes(n)}dispose(){this.configWatcher?.dispose(),this.configWatcher=null,this.onConfigChangeEmitter.dispose()}},Da=new Ia;function ob(){return{inbox:[],plan:[],code:[],audit:[],completed:[]}}function cb(e){let t=ob();for(let n of e)t[n.stage].push(n);return t}function lb(e){return{inbox:e.inbox.length,plan:e.plan.length,code:e.code.length,audit:e.audit.length,completed:e.completed.length}}async function en(e){let t;try{t=await Gp.stat(e)}catch{throw new Error(`Kanban root does not exist: ${e}`)}if(!t.isDirectory())throw new Error(`Kanban root is not a directory: ${e}`);await Da.initialize(e);let[n,r,s,i,a]=await Promise.all([er(e),us(e),op(e),ls(e),Ta(e)]),o=cb(n),c=lb(o),l=jn.reduce((u,d)=>u+c[d],0);return{config:Da.getConfig(),tasks:o,agents:r,contexts:s,skills:i,providers:a,metadata:{taskCounts:c,totalTasks:l,agentCount:r.length,contextCount:s.length,skillCount:i.length,providerCount:a.length}}}function ub(e){return e.filter(t=>t.role!=="system").map(t=>({role:t.role==="assistant"?"assistant":"user",content:t.content}))}async function*db(e){if(!e.body)return;let t=e.body.getReader(),n=new TextDecoder,r="";for(;;){let{done:i,value:a}=await t.read();if(i)break;r+=n.decode(a,{stream:!0});let o=r.split(`
`);r=o.pop()??"";for(let c of o){let l=c.trim();if(!l.startsWith("data:"))continue;let u=l.slice(5).trim();if(!u||u==="[DONE]")continue;let d=JSON.parse(u);if(d.type==="error")throw new Error(d.error?.message||"Anthropic streaming error");d.type==="content_block_delta"&&typeof d.delta?.text=="string"&&(yield d.delta.text)}}let s=r.trim();if(s.startsWith("data:")){let i=s.slice(5).trim();if(i&&i!=="[DONE]"){let a=JSON.parse(i);a.type==="content_block_delta"&&typeof a.delta?.text=="string"&&(yield a.delta.text)}}}async function*zp(e){let t=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json","x-api-key":e.apiKey,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:e.model,max_tokens:e.maxTokens??1024,temperature:e.temperature,system:e.systemPrompt,stream:!0,messages:ub(e.messages)})});if(!t.ok){let n=await t.text().catch(()=>""),r=t.headers.get("retry-after"),s=r?` Retry-After: ${r}s.`:"";throw new Error(`Anthropic API error ${t.status}${s}${n?` ${n}`:""}`)}yield*db(t)}function pb(e,t){let n=e.map(r=>({role:r.role,content:r.content}));return t?.trim()?[{role:"system",content:t.trim()},...n]:n}function Vp(e){let t=e.trim();if(!t)return null;let n=t.startsWith("data:")?t.slice(5).trim():t;if(!n||n==="[DONE]")return null;let r=JSON.parse(n);if(r.error?.message)throw new Error(r.error.message);let s=r.choices?.[0]?.delta?.content;return typeof s=="string"?s:null}async function*fb(e){if(!e.body)return;let t=e.body.getReader(),n=new TextDecoder,r="";for(;;){let{done:i,value:a}=await t.read();if(i)break;r+=n.decode(a,{stream:!0});let o=r.split(`
`);r=o.pop()??"";for(let c of o){let l=Vp(c);l&&(yield l)}}let s=Vp(r);s&&(yield s)}async function*Kp(e){let n=`${e.apiBaseUrl?.replace(/\/+$/,"")||"https://api.openai.com"}/v1/chat/completions`,r=e.providerLabel?.trim()||"OpenAI",s=await fetch(n,{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${e.apiKey}`},body:JSON.stringify({model:e.model,stream:!0,temperature:e.temperature,max_tokens:e.maxTokens,messages:pb(e.messages,e.systemPrompt)})});if(!s.ok){let i=await s.text().catch(()=>""),a=s.headers.get("retry-after"),o=a?` Retry-After: ${a}s.`:"";throw new Error(`${r} API error ${s.status}${o}${i?` ${i}`:""}`)}yield*fb(s)}function ar(e,t){if(e.length===0)return"(none)";let n=e.slice(0,t).map(s=>`- ${s}`),r=e.length-Math.min(e.length,t);return r>0&&n.push(`- ...and ${r} more`),n.join(`
`)}function mb(e,t){return e.skills.length===0?"(none)":e.skills.slice(0,t).map(n=>{let r=n.description.trim();return r?`- ${n.name}: ${r}`:`- ${n.name}`}).join(`
`)}function hb(e){return e.length===0?"(none)":e.map(t=>{let n=t.reason.trim()||"selected";return`- ${t.name} (${n})`}).join(`
`)}function Yp(e){let{snapshot:t,selectedSkills:n=[],customSystemPrompt:r,agentInstructions:s,maxTasksPerStage:i=5,maxSkills:a=12}=e,o={inbox:ar(t.tasks.inbox.map(l=>l.title),i),plan:ar(t.tasks.plan.map(l=>l.title),i),code:ar(t.tasks.code.map(l=>l.title),i),audit:ar(t.tasks.audit.map(l=>l.title),i),completed:ar(t.tasks.completed.map(l=>l.title),i)},c=["You are the Kanban2Code orchestrator assistant.","Use workspace state, task priorities, and available skills to produce useful responses.","","Workspace Task Summary:",`- total tasks: ${t.metadata.totalTasks}`,`- inbox (${t.tasks.inbox.length}):
${o.inbox}`,`- plan (${t.tasks.plan.length}):
${o.plan}`,`- code (${t.tasks.code.length}):
${o.code}`,`- audit (${t.tasks.audit.length}):
${o.audit}`,`- completed (${t.tasks.completed.length}):
${o.completed}`,"","Available Skills Summary:",mb(t,a),"","Selected Skills:",hb(n)];return s?.trim()&&c.push("","Agent Instructions:",s.trim()),r?.trim()&&c.push("","Additional System Prompt:",r.trim()),c.join(`
`)}function gb(e){let t=(e.provider||"").toLowerCase(),n=e.cli.toLowerCase();if(t.includes("anthropic")||n.includes("claude")||n.includes("anthropic"))return"anthropic";if(t.includes("openai")||t.includes("minimax")||n.includes("openai")||n.includes("minimax")||n.includes("gpt")||n.includes("codex"))return"openai";throw new Error(`Unknown provider '${e.provider??e.cli}'. Supported providers: anthropic, openai.`)}function yb(e){let t=(e.provider||"").toLowerCase(),n=e.cli.toLowerCase();return t.includes("minimax")||n.includes("minimax")?{apiBaseUrl:"https://api.minimax.chat",providerLabel:"MiniMax"}:{providerLabel:"OpenAI"}}function vb(e,t){if(t?.trim())return t.trim();let n=e==="anthropic"?process.env.ANTHROPIC_API_KEY:process.env.OPENAI_API_KEY;if(!n?.trim()){let r=e==="anthropic"?"ANTHROPIC_API_KEY":"OPENAI_API_KEY";throw new Error(`Missing API key for ${e}. Set ${r} or pass apiKey in options.`)}return n.trim()}function xb(e){return e.filter(t=>t.role==="user").map(t=>t.content).join(`
`)}async function _b(e){if(e.providerConfig)return e.providerConfig;let t=await Ln(e.kanbanRoot,e.provider);if(!t)throw new Error(`Provider config not found for '${e.provider}'.`);return t}async function*Zp(e){let t=await _b(e),n=gb(t),r=vb(n,e.apiKey),s=e.workspaceSnapshot??await en(e.kanbanRoot),i=e.selectedSkills??await Hp(e.kanbanRoot,xb(e.messages)),a=Yp({snapshot:s,selectedSkills:i,customSystemPrompt:e.systemPrompt,agentInstructions:e.agentInstructions});try{if(n==="anthropic"){yield*zp({apiKey:r,model:t.model,messages:e.messages,systemPrompt:a,temperature:e.temperature,maxTokens:e.maxTokens});return}let o=yb(t);yield*Kp({apiKey:r,model:t.model,messages:e.messages,systemPrompt:a,temperature:e.temperature,maxTokens:e.maxTokens,apiBaseUrl:o.apiBaseUrl,providerLabel:o.providerLabel})}catch(o){yield`[ERROR: ${o instanceof Error?o.message:"Unknown orchestrator error"}]`}}var Fn=q(require("fs/promises")),wt=q(require("path"));var kb=q(wn());function bb(e){return e.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,50).replace(/-+$/g,"")||"untitled-task"}function wb(e,t){let n=t.trim();return n?/^\s*#\s+.+/m.test(n.split(`
`)[0]??"")?`${n}
`:`# ${e}

${n}
`:`# ${e}
`}async function Sb(e,t){let n=0;for(;;){let r=n===0?`${t}.md`:`${t}-${n}.md`,s=wt.join(e,r);try{await Fn.access(s),n+=1}catch{return r}}}async function Xp(e,t){let n=[e];t.project?(n.push($e,t.project),t.phase&&n.push(t.phase)):n.push(Un);let r=wt.join(...n);await Ie(e,r),await Fn.mkdir(r,{recursive:!0});let s=bb(t.title),i=await Sb(r,s),a=wt.join(r,i);await Ie(e,a);let o={id:wt.basename(i,".md"),filePath:a,title:t.title,stage:t.stage,agent:t.agent,tags:t.tags??[],contexts:t.contexts??[],skills:t.skills??[],content:wb(t.title,t.description)},c=ts(o);return await Fn.writeFile(a,c,"utf-8"),wt.relative(e,a)}var Jp=require("events"),ks=q(require("path"));var Cb=300;function Tb(e){let t=e.endsWith(".md"),n=ks.basename(e);if(!t||n==="_context.md")return!1;let r=ks.sep;return!(e.includes(`${r}${an}${r}`)||e.includes(`${r}${sn}${r}`))}function Ab(e){let t=require("vscode"),n=new t.RelativePattern(e,"**/*.md"),r=t.workspace.createFileSystemWatcher(n);return{onDidCreate:s=>r.onDidCreate(i=>s(i.fsPath)),onDidChange:s=>r.onDidChange(i=>s(i.fsPath)),onDidDelete:s=>r.onDidDelete(i=>s(i.fsPath)),dispose:()=>r.dispose()}}var _s=class extends Jp.EventEmitter{constructor(n,r={}){super();this.root=n;this.debounceMs=r.debounceMs??Cb,this.watcherFactory=r.watcherFactory??Ab}watcher;debounceTimers=new Map;lastDeleted=null;debounceMs;watcherFactory;start(){this.watcher||(this.watcher=this.watcherFactory(this.root),this.watcher.onDidCreate(n=>this.handleEvent("created",n)),this.watcher.onDidChange(n=>this.handleEvent("updated",n)),this.watcher.onDidDelete(n=>this.handleEvent("deleted",n)))}dispose(){this.watcher?.dispose(),this.debounceTimers.forEach(n=>clearTimeout(n)),this.debounceTimers.clear(),this.lastDeleted=null}handleEvent(n,r){if(!r.includes(rn)||!Tb(r))return;let s=this.lastDeleted,i=Date.now();if(n==="deleted")this.lastDeleted={path:r,at:i};else if(s&&i-s.at<=this.debounceMs){this.emitDebounced(`move-${s.path}->${r}`,()=>{this.emit("event",{type:"moved",from:s.path,to:r})}),this.lastDeleted=null;return}this.emitDebounced(`${n}:${r}`,()=>{this.emit("event",{type:n,path:r})})}emitDebounced(n,r){let s=this.debounceTimers.get(n);s&&clearTimeout(s);let i=setTimeout(()=>{this.debounceTimers.delete(n),r()},this.debounceMs);this.debounceTimers.set(n,i)}};var Re=2,Qp=h.enum(["inbox","plan","code","audit","completed"]),Rb=h.object({inbox:h.number().int().nonnegative(),plan:h.number().int().nonnegative(),code:h.number().int().nonnegative(),audit:h.number().int().nonnegative(),completed:h.number().int().nonnegative()}).strict(),or=h.custom(),Pb=h.custom(),Eb=h.custom(),Ob=h.custom(),Ib=h.custom(),ef=h.object({config:h.custom(),tasks:h.object({inbox:h.array(or),plan:h.array(or),code:h.array(or),audit:h.array(or),completed:h.array(or)}).strict(),agents:h.array(Pb),contexts:h.array(Eb),skills:h.array(Ob),providers:h.array(Ib),metadata:h.object({taskCounts:Rb,totalTasks:h.number().int().nonnegative(),agentCount:h.number().int().nonnegative(),contextCount:h.number().int().nonnegative(),skillCount:h.number().int().nonnegative(),providerCount:h.number().int().nonnegative()}).strict()}).strict(),Db=h.object({role:h.enum(["system","user","assistant"]),content:h.string()}).strict(),Nb=gs.strict(),Mb=h.object({kanbanRootExists:h.boolean(),workspaceSnapshot:ef,activeProvider:Nb.nullable()}).strict(),Lb=h.object({token:h.string()}).strict(),Fb=h.object({}).strict(),jb=h.object({path:h.string(),title:h.string()}).strict(),Ub=h.object({workspaceSnapshot:ef}).strict(),qb=h.object({message:h.string()}).strict(),Wb=h.object({}).strict(),Hb=Db.extend({providerId:h.string().min(1).optional()}).strict(),$b=h.object({title:h.string().min(1),description:h.string(),stage:Qp,agent:h.string().optional(),tags:h.array(h.string()).optional(),project:h.string().optional(),phase:h.string().optional(),contexts:h.array(h.string()).optional(),skills:h.array(h.string()).optional()}).strict(),Bb=h.object({taskFilePath:h.string(),allRemaining:h.boolean().optional()}).strict(),Gb=h.object({taskFilePath:h.string(),title:h.string().min(1),stage:Qp,content:h.string(),agent:h.string().optional(),provider:h.string().optional(),tags:h.array(h.string()).optional(),contexts:h.array(h.string()).optional(),skills:h.array(h.string()).optional(),project:h.string().optional(),phase:h.string().optional()}).strict(),zb=h.object({}).strict();var Vb=h.object({version:h.literal(Re),type:h.literal("InitState"),payload:Mb}).strict(),Kb=h.object({version:h.literal(Re),type:h.literal("StreamChunk"),payload:Lb}).strict(),Yb=h.object({version:h.literal(Re),type:h.literal("MessageComplete"),payload:Fb}).strict(),Zb=h.object({version:h.literal(Re),type:h.literal("TaskGenerated"),payload:jb}).strict(),Xb=h.object({version:h.literal(Re),type:h.literal("WorkspaceUpdated"),payload:Ub}).strict(),Jb=h.object({version:h.literal(Re),type:h.literal("Error"),payload:qb}).strict(),Qb=h.object({version:h.literal(Re),type:h.literal("RequestState"),payload:Wb}).strict(),ew=h.object({version:h.literal(Re),type:h.literal("SendMessage"),payload:Hb}).strict(),tw=h.object({version:h.literal(Re),type:h.literal("GenerateTask"),payload:$b}).strict(),nw=h.object({version:h.literal(Re),type:h.literal("RunTask"),payload:Bb}).strict(),rw=h.object({version:h.literal(Re),type:h.literal("SaveTask"),payload:Gb}).strict(),sw=h.object({version:h.literal(Re),type:h.literal("CancelStream"),payload:zb}).strict(),iw=h.discriminatedUnion("type",[Vb,Kb,Yb,Zb,Xb,Jb,Qb,ew,tw,nw,rw,sw]);function at(e,t){return{version:Re,type:e,payload:t}}function tf(e){let t=iw.safeParse(e);if(!t.success)throw new Error(`Invalid message envelope: ${t.error.message}`);return t.data}var cr=class{constructor(t,n){this.extensionUri=t;this.options=n;this.watcher=new _s(n.kanbanRoot),this.watcher.on("event",()=>{this.refreshSnapshotAndBroadcast()}),this.watcher.start()}static viewType="kanban2code.sidebar";view;snapshot=null;activeProvider=null;selectedProviderId=null;chatHistory=[];streamGeneration=0;watcher;resolveWebviewView(t,n,r){this.view=t,t.webview.options={enableScripts:!0,localResourceRoots:[Na.Uri.joinPath(this.extensionUri,"dist")]},t.webview.html=this.getWebviewContent(t.webview),t.webview.onDidReceiveMessage(async s=>{await this.handleWebviewMessage(s)}),t.onDidDispose(()=>{this.watcher.dispose()}),this.sendInitState()}async handleWebviewMessage(t){try{let n=tf(t);switch(n.type){case"RequestState":await this.sendInitState();break;case"SendMessage":await this.handleSendMessage(n.payload);break;case"GenerateTask":{let r=await Xp(this.options.kanbanRoot,n.payload);this.postMessage(at("TaskGenerated",{path:r,title:n.payload.title})),await this.refreshSnapshotAndBroadcast();break}case"RunTask":{let r=qe.basename(n.payload.taskFilePath,".md");await vs(this.options.kanbanRoot,r,this.options.workspaceRoot);break}case"SaveTask":await this.handleSaveTask(n.payload);break;case"CancelStream":this.streamGeneration+=1,this.postMessage(at("MessageComplete",{}));break;default:break}}catch(n){let r=n instanceof Error?n.message:String(n);this.postMessage(at("Error",{message:r}))}}async handleSendMessage(t){let n=this.snapshot??await en(this.options.kanbanRoot);this.snapshot=n;let r=t.providerId?.trim(),s=r?this.resolveProviderId(n,r):this.selectedProviderId??this.resolveDefaultProviderId(n);if(!s)throw new Error("No provider configured. Add a provider in .kanban2code/_providers.");this.selectedProviderId=s;let i={role:t.role,content:t.content};this.chatHistory.push(i);let a=++this.streamGeneration,o="";for await(let c of Zp({kanbanRoot:this.options.kanbanRoot,provider:s,messages:this.chatHistory,workspaceSnapshot:n})){if(a!==this.streamGeneration)return;o+=c,this.postMessage(at("StreamChunk",{token:c}))}a===this.streamGeneration&&(this.chatHistory.push({role:"assistant",content:o}),this.postMessage(at("MessageComplete",{})))}async handleSaveTask(t){let n=this.snapshot??await en(this.options.kanbanRoot),r=this.findTaskByFilePath(n,t.taskFilePath);if(!r)throw new Error(`Task not found: ${t.taskFilePath}`);let s=qe.basename(r.filePath),i=t.project?qe.join(this.options.kanbanRoot,"projects",t.project,t.phase??""):qe.join(this.options.kanbanRoot,"inbox"),a=i.endsWith(qe.sep)?i.slice(0,-1):i,o=qe.join(a,s);await Ie(this.options.kanbanRoot,o),await St.mkdir(qe.dirname(o),{recursive:!0});let c="";try{c=await St.readFile(r.filePath,"utf8")}catch{c=""}let l={...r,filePath:o,title:t.title,stage:t.stage,agent:t.agent,provider:t.provider,tags:t.tags??[],contexts:t.contexts??[],skills:t.skills??[],project:t.project,phase:t.phase,content:t.content},u=ts(l,c);await St.writeFile(o,u,"utf8"),o!==r.filePath&&await St.rm(r.filePath,{force:!0}),await this.refreshSnapshotAndBroadcast()}findTaskByFilePath(t,n){for(let r of["inbox","plan","code","audit","completed"]){let s=t.tasks[r].find(i=>i.filePath===n);if(s)return s}return null}resolveDefaultProviderId(t){let n=t.config.providerDefaults?.coder;if(n){let s=t.providers.find(i=>i.id===n);if(s)return s.id}return t.providers.find(s=>s.config)?.id??null}resolveProviderId(t,n){let r=t.providers.find(s=>s.id===n);if(!r||!r.config)throw new Error(`Provider not found or invalid: ${n}`);return r.id}async sendInitState(){try{let t=await en(this.options.kanbanRoot);this.snapshot=t;let n=this.selectedProviderId??this.resolveDefaultProviderId(t);this.selectedProviderId=n,this.activeProvider=n?await Ln(this.options.kanbanRoot,n)??null:null,this.postMessage(at("InitState",{kanbanRootExists:!0,workspaceSnapshot:t,activeProvider:this.activeProvider}))}catch{let t={config:{version:"1.0.0",agents:{},tags:{categories:{}},stages:{},preferences:{}},tasks:{inbox:[],plan:[],code:[],audit:[],completed:[]},agents:[],contexts:[],skills:[],providers:[],metadata:{taskCounts:{inbox:0,plan:0,code:0,audit:0,completed:0},totalTasks:0,agentCount:0,contextCount:0,skillCount:0,providerCount:0}};this.postMessage(at("InitState",{kanbanRootExists:!1,workspaceSnapshot:t,activeProvider:null}))}}async refreshSnapshotAndBroadcast(){let t=await en(this.options.kanbanRoot);this.snapshot=t,this.postMessage(at("WorkspaceUpdated",{workspaceSnapshot:t}))}postMessage(t){this.view?.webview.postMessage(t)}getWebviewContent(t){let n=t.asWebviewUri(Na.Uri.joinPath(this.extensionUri,"dist","webview.js")),r=aw();return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${t.cspSource} 'unsafe-inline'; script-src 'nonce-${r}';" />
  <title>Kanban2Code</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${r}" src="${n}"></script>
</body>
</html>`}};function aw(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t="";for(let n=0;n<32;n+=1)t+=e.charAt(Math.floor(Math.random()*e.length));return t}var tn=class{static _kanbanRoot=null;static _filterState=null;static get kanbanRoot(){return this._kanbanRoot}static setKanbanRoot(t){this._kanbanRoot=t}static get filterState(){return this._filterState}static setFilterState(t){this._filterState=t}};async function ow(e){let t,n=(i,a)=>{if(t)return;t=new cr(e.extensionUri,{kanbanRoot:i,workspaceRoot:a});let o=nn.window.registerWebviewViewProvider(cr.viewType,t);e.subscriptions.push(o)},r=nn.workspace.workspaceFolders?.[0]?.uri.fsPath??null,s=null;r&&(s=await os(r),tn.setKanbanRoot(s),s&&n(s,r)),Lp(e,{getKanbanRoot:()=>tn.kanbanRoot,setKanbanRoot:i=>tn.setKanbanRoot(i),onWorkspaceCreated:(i,a)=>{n(i,a)}}),r&&!s&&await nn.window.showInformationMessage("Kanban2Code workspace not found.","Create Workspace")==="Create Workspace"&&await nn.commands.executeCommand("kanban2code.createWorkspace")}function cw(){tn.setKanbanRoot(null)}0&&(module.exports={activate,deactivate});
/*! Bundled license information:

is-extglob/index.js:
  (*!
   * is-extglob <https://github.com/jonschlinkert/is-extglob>
   *
   * Copyright (c) 2014-2016, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

is-glob/index.js:
  (*!
   * is-glob <https://github.com/jonschlinkert/is-glob>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   *)

is-number/index.js:
  (*!
   * is-number <https://github.com/jonschlinkert/is-number>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Released under the MIT License.
   *)

to-regex-range/index.js:
  (*!
   * to-regex-range <https://github.com/micromatch/to-regex-range>
   *
   * Copyright (c) 2015-present, Jon Schlinkert.
   * Released under the MIT License.
   *)

fill-range/index.js:
  (*!
   * fill-range <https://github.com/jonschlinkert/fill-range>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

queue-microtask/index.js:
  (*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

run-parallel/index.js:
  (*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

is-extendable/index.js:
  (*!
   * is-extendable <https://github.com/jonschlinkert/is-extendable>
   *
   * Copyright (c) 2015, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

strip-bom-string/index.js:
  (*!
   * strip-bom-string <https://github.com/jonschlinkert/strip-bom-string>
   *
   * Copyright (c) 2015, 2017, Jon Schlinkert.
   * Released under the MIT License.
   *)
*/
