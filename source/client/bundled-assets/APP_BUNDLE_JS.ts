export const APP_BUNDLE_JS = "(()=>{var F,c,oe,De,E,Z,re,j,Me,I={},ie=[],Ie=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,G=Array.isArray;function P(t,e){for(var n in e)t[n]=e[n];return t}function se(t){var e=t.parentNode;e&&e.removeChild(t)}function T(t,e,n){var o,i,r,u={};for(r in e)r==\"key\"?o=e[r]:r==\"ref\"?i=e[r]:u[r]=e[r];if(arguments.length>2&&(u.children=arguments.length>3?F.call(arguments,2):n),typeof t==\"function\"&&t.defaultProps!=null)for(r in t.defaultProps)u[r]===void 0&&(u[r]=t.defaultProps[r]);return U(t,u,o,i,null)}function U(t,e,n,o,i){var r={type:t,props:e,key:n,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:i??++oe};return i==null&&c.vnode!=null&&c.vnode(r),r}function H(t){return t.children}function $(t,e){this.props=t,this.context=e}function R(t,e){if(e==null)return t.__?R(t.__,t.__.__k.indexOf(t)+1):null;for(var n;e<t.__k.length;e++)if((n=t.__k[e])!=null&&n.__e!=null)return n.__e;return typeof t.type==\"function\"?R(t):null}function ue(t){var e,n;if((t=t.__)!=null&&t.__c!=null){for(t.__e=t.__c.base=null,e=0;e<t.__k.length;e++)if((n=t.__k[e])!=null&&n.__e!=null){t.__e=t.__c.base=n.__e;break}return ue(t)}}function ee(t){(!t.__d&&(t.__d=!0)&&E.push(t)&&!N.__r++||Z!==c.debounceRendering)&&((Z=c.debounceRendering)||re)(N)}function N(){var t,e,n,o,i,r,u,l,a;for(E.sort(j);t=E.shift();)t.__d&&(e=E.length,o=void 0,i=void 0,r=void 0,l=(u=(n=t).__v).__e,(a=n.__P)&&(o=[],i=[],(r=P({},u)).__v=u.__v+1,O(a,u,r,n.__n,a.ownerSVGElement!==void 0,u.__h!=null?[l]:null,o,l??R(u),u.__h,i),fe(o,u,i),u.__e!=l&&ue(u)),E.length>e&&E.sort(j));N.__r=0}function le(t,e,n,o,i,r,u,l,a,y,d){var _,m,f,s,p,D,g,S,x,b=0,w=o&&o.__k||ie,B=w.length,C=B,M=e.length;for(n.__k=[],_=0;_<M;_++)(s=n.__k[_]=(s=e[_])==null||typeof s==\"boolean\"||typeof s==\"function\"?null:typeof s==\"string\"||typeof s==\"number\"||typeof s==\"bigint\"?U(null,s,null,null,s):G(s)?U(H,{children:s},null,null,null):s.__b>0?U(s.type,s.props,s.key,s.ref?s.ref:null,s.__v):s)!=null?(s.__=n,s.__b=n.__b+1,(S=He(s,w,g=_+b,C))===-1?f=I:(f=w[S]||I,w[S]=void 0,C--),O(t,s,f,i,r,u,l,a,y,d),p=s.__e,(m=s.ref)&&f.ref!=m&&(f.ref&&z(f.ref,null,s),d.push(m,s.__c||p,s)),p!=null&&(D==null&&(D=p),(x=f===I||f.__v===null)?S==-1&&b--:S!==g&&(S===g+1?b++:S>g?C>M-g?b+=S-g:b--:b=S<g&&S==g-1?S-g:0),g=_+b,typeof s.type!=\"function\"||S===g&&f.__k!==s.__k?typeof s.type==\"function\"||S===g&&!x?s.__d!==void 0?(a=s.__d,s.__d=void 0):a=p.nextSibling:a=ce(t,p,a):a=ae(s,a,t),typeof n.type==\"function\"&&(n.__d=a))):(f=w[_])&&f.key==null&&f.__e&&(f.__e==a&&(a=R(f)),q(f,f,!1),w[_]=null);for(n.__e=D,_=B;_--;)w[_]!=null&&(typeof n.type==\"function\"&&w[_].__e!=null&&w[_].__e==n.__d&&(n.__d=w[_].__e.nextSibling),q(w[_],w[_]))}function ae(t,e,n){for(var o,i=t.__k,r=0;i&&r<i.length;r++)(o=i[r])&&(o.__=t,e=typeof o.type==\"function\"?ae(o,e,n):ce(n,o.__e,e));return e}function ce(t,e,n){return n==null||n.parentNode!==t?t.insertBefore(e,null):e==n&&e.parentNode!=null||t.insertBefore(e,n),e.nextSibling}function He(t,e,n,o){var i=t.key,r=t.type,u=n-1,l=n+1,a=e[n];if(a===null||a&&i==a.key&&r===a.type)return n;if(o>(a!=null?1:0))for(;u>=0||l<e.length;){if(u>=0){if((a=e[u])&&i==a.key&&r===a.type)return u;u--}if(l<e.length){if((a=e[l])&&i==a.key&&r===a.type)return l;l++}}return-1}function Be(t,e,n,o,i){var r;for(r in n)r===\"children\"||r===\"key\"||r in e||L(t,r,null,n[r],o);for(r in e)i&&typeof e[r]!=\"function\"||r===\"children\"||r===\"key\"||r===\"value\"||r===\"checked\"||n[r]===e[r]||L(t,r,e[r],n[r],o)}function te(t,e,n){e[0]===\"-\"?t.setProperty(e,n??\"\"):t[e]=n==null?\"\":typeof n!=\"number\"||Ie.test(e)?n:n+\"px\"}function L(t,e,n,o,i){var r;e:if(e===\"style\")if(typeof n==\"string\")t.style.cssText=n;else{if(typeof o==\"string\"&&(t.style.cssText=o=\"\"),o)for(e in o)n&&e in n||te(t.style,e,\"\");if(n)for(e in n)o&&n[e]===o[e]||te(t.style,e,n[e])}else if(e[0]===\"o\"&&e[1]===\"n\")r=e!==(e=e.replace(/(PointerCapture)$|Capture$/,\"$1\")),e=e.toLowerCase()in t?e.toLowerCase().slice(2):e.slice(2),t.l||(t.l={}),t.l[e+r]=n,n?o||t.addEventListener(e,r?_e:ne,r):t.removeEventListener(e,r?_e:ne,r);else if(e!==\"dangerouslySetInnerHTML\"){if(i)e=e.replace(/xlink(H|:h)/,\"h\").replace(/sName$/,\"s\");else if(e!==\"width\"&&e!==\"height\"&&e!==\"href\"&&e!==\"list\"&&e!==\"form\"&&e!==\"tabIndex\"&&e!==\"download\"&&e!==\"rowSpan\"&&e!==\"colSpan\"&&e in t)try{t[e]=n??\"\";break e}catch{}typeof n==\"function\"||(n==null||n===!1&&e[4]!==\"-\"?t.removeAttribute(e):t.setAttribute(e,n))}}function ne(t){return this.l[t.type+!1](c.event?c.event(t):t)}function _e(t){return this.l[t.type+!0](c.event?c.event(t):t)}function O(t,e,n,o,i,r,u,l,a,y){var d,_,m,f,s,p,D,g,S,x,b,w,B,C,M,k=e.type;if(e.constructor!==void 0)return null;n.__h!=null&&(a=n.__h,l=e.__e=n.__e,e.__h=null,r=[l]),(d=c.__b)&&d(e);e:if(typeof k==\"function\")try{if(g=e.props,S=(d=k.contextType)&&o[d.__c],x=d?S?S.props.value:d.__:o,n.__c?D=(_=e.__c=n.__c).__=_.__E:(\"prototype\"in k&&k.prototype.render?e.__c=_=new k(g,x):(e.__c=_=new $(g,x),_.constructor=k,_.render=Ae),S&&S.sub(_),_.props=g,_.state||(_.state={}),_.context=x,_.__n=o,m=_.__d=!0,_.__h=[],_._sb=[]),_.__s==null&&(_.__s=_.state),k.getDerivedStateFromProps!=null&&(_.__s==_.state&&(_.__s=P({},_.__s)),P(_.__s,k.getDerivedStateFromProps(g,_.__s))),f=_.props,s=_.state,_.__v=e,m)k.getDerivedStateFromProps==null&&_.componentWillMount!=null&&_.componentWillMount(),_.componentDidMount!=null&&_.__h.push(_.componentDidMount);else{if(k.getDerivedStateFromProps==null&&g!==f&&_.componentWillReceiveProps!=null&&_.componentWillReceiveProps(g,x),!_.__e&&(_.shouldComponentUpdate!=null&&_.shouldComponentUpdate(g,_.__s,x)===!1||e.__v===n.__v)){for(e.__v!==n.__v&&(_.props=g,_.state=_.__s,_.__d=!1),e.__e=n.__e,e.__k=n.__k,e.__k.forEach(function(A){A&&(A.__=e)}),b=0;b<_._sb.length;b++)_.__h.push(_._sb[b]);_._sb=[],_.__h.length&&u.push(_);break e}_.componentWillUpdate!=null&&_.componentWillUpdate(g,_.__s,x),_.componentDidUpdate!=null&&_.__h.push(function(){_.componentDidUpdate(f,s,p)})}if(_.context=x,_.props=g,_.__P=t,_.__e=!1,w=c.__r,B=0,\"prototype\"in k&&k.prototype.render){for(_.state=_.__s,_.__d=!1,w&&w(e),d=_.render(_.props,_.state,_.context),C=0;C<_._sb.length;C++)_.__h.push(_._sb[C]);_._sb=[]}else do _.__d=!1,w&&w(e),d=_.render(_.props,_.state,_.context),_.state=_.__s;while(_.__d&&++B<25);_.state=_.__s,_.getChildContext!=null&&(o=P(P({},o),_.getChildContext())),m||_.getSnapshotBeforeUpdate==null||(p=_.getSnapshotBeforeUpdate(f,s)),le(t,G(M=d!=null&&d.type===H&&d.key==null?d.props.children:d)?M:[M],e,n,o,i,r,u,l,a,y),_.base=e.__e,e.__h=null,_.__h.length&&u.push(_),D&&(_.__E=_.__=null)}catch(A){e.__v=null,(a||r!=null)&&(e.__e=l,e.__h=!!a,r[r.indexOf(l)]=null),c.__e(A,e,n)}else r==null&&e.__v===n.__v?(e.__k=n.__k,e.__e=n.__e):e.__e=Re(n.__e,e,n,o,i,r,u,a,y);(d=c.diffed)&&d(e)}function fe(t,e,n){for(var o=0;o<n.length;o++)z(n[o],n[++o],n[++o]);c.__c&&c.__c(e,t),t.some(function(i){try{t=i.__h,i.__h=[],t.some(function(r){r.call(i)})}catch(r){c.__e(r,i.__v)}})}function Re(t,e,n,o,i,r,u,l,a){var y,d,_,m=n.props,f=e.props,s=e.type,p=0;if(s===\"svg\"&&(i=!0),r!=null){for(;p<r.length;p++)if((y=r[p])&&\"setAttribute\"in y==!!s&&(s?y.localName===s:y.nodeType===3)){t=y,r[p]=null;break}}if(t==null){if(s===null)return document.createTextNode(f);t=i?document.createElementNS(\"http://www.w3.org/2000/svg\",s):document.createElement(s,f.is&&f),r=null,l=!1}if(s===null)m===f||l&&t.data===f||(t.data=f);else{if(r=r&&F.call(t.childNodes),d=(m=n.props||I).dangerouslySetInnerHTML,_=f.dangerouslySetInnerHTML,!l){if(r!=null)for(m={},p=0;p<t.attributes.length;p++)m[t.attributes[p].name]=t.attributes[p].value;(_||d)&&(_&&(d&&_.__html==d.__html||_.__html===t.innerHTML)||(t.innerHTML=_&&_.__html||\"\"))}if(Be(t,f,m,i,l),_)e.__k=[];else if(le(t,G(p=e.props.children)?p:[p],e,n,o,i&&s!==\"foreignObject\",r,u,r?r[0]:n.__k&&R(n,0),l,a),r!=null)for(p=r.length;p--;)r[p]!=null&&se(r[p]);l||(\"value\"in f&&(p=f.value)!==void 0&&(p!==t.value||s===\"progress\"&&!p||s===\"option\"&&p!==m.value)&&L(t,\"value\",p,m.value,!1),\"checked\"in f&&(p=f.checked)!==void 0&&p!==t.checked&&L(t,\"checked\",p,m.checked,!1))}return t}function z(t,e,n){try{typeof t==\"function\"?t(e):t.current=e}catch(o){c.__e(o,n)}}function q(t,e,n){var o,i;if(c.unmount&&c.unmount(t),(o=t.ref)&&(o.current&&o.current!==t.__e||z(o,null,e)),(o=t.__c)!=null){if(o.componentWillUnmount)try{o.componentWillUnmount()}catch(r){c.__e(r,e)}o.base=o.__P=null,t.__c=void 0}if(o=t.__k)for(i=0;i<o.length;i++)o[i]&&q(o[i],e,n||typeof t.type!=\"function\");n||t.__e==null||se(t.__e),t.__=t.__e=t.__d=void 0}function Ae(t,e,n){return this.constructor(t,n)}function pe(t,e,n){var o,i,r,u;c.__&&c.__(t,e),i=(o=typeof n==\"function\")?null:n&&n.__k||e.__k,r=[],u=[],O(e,t=(!o&&n||e).__k=T(H,null,[t]),i||I,I,e.ownerSVGElement!==void 0,!o&&n?[n]:i?null:e.firstChild?F.call(e.childNodes):null,r,!o&&n?n:i?i.__e:e.firstChild,o,u),fe(r,t,u)}F=ie.slice,c={__e:function(t,e,n,o){for(var i,r,u;e=e.__;)if((i=e.__c)&&!i.__)try{if((r=i.constructor)&&r.getDerivedStateFromError!=null&&(i.setState(r.getDerivedStateFromError(t)),u=i.__d),i.componentDidCatch!=null&&(i.componentDidCatch(t,o||{}),u=i.__d),u)return i.__E=i}catch(l){t=l}throw t}},oe=0,De=function(t){return t!=null&&t.constructor===void 0},$.prototype.setState=function(t,e){var n;n=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=P({},this.state),typeof t==\"function\"&&(t=t(P({},n),this.props)),t&&P(n,t),t!=null&&this.__v&&(e&&this._sb.push(e),ee(this))},$.prototype.forceUpdate=function(t){this.__v&&(this.__e=!0,t&&this.__h.push(t),ee(this))},$.prototype.render=H,E=[],re=typeof Promise==\"function\"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,j=function(t,e){return t.__v.__b-e.__v.__b},N.__r=0,Me=0;function de(t){let{stewBuildId:e}=t,n=`/stew_${e}`;return{stewResourcesDirectoryPath:n,configPath:`${n}/stew.config.json`,modulesDirectoryPath:`${n}/modules`,datasetsDirectoryPath:`${n}/datasets`,stylesDirectoryPath:`${n}/styles`}}function J(t){throw new Error(`invalid path: ${t}`)}var W,v,Q,me,X=0,be=[],K=[],he=c.__b,ge=c.__r,ve=c.diffed,ye=c.__c,Se=c.unmount;function ke(t,e){c.__h&&c.__h(v,t,X||e),X=0;var n=v.__H||(v.__H={__:[],__h:[]});return t>=n.__.length&&n.__.push({__V:K}),n.__[t]}function xe(t){return X=1,Ue(Pe,t)}function Ue(t,e,n){var o=ke(W++,2);if(o.t=t,!o.__c&&(o.__=[n?n(e):Pe(void 0,e),function(l){var a=o.__N?o.__N[0]:o.__[0],y=o.t(a,l);a!==y&&(o.__N=[y,o.__[1]],o.__c.setState({}))}],o.__c=v,!v.u)){var i=function(l,a,y){if(!o.__c.__H)return!0;var d=o.__c.__H.__.filter(function(m){return m.__c});if(d.every(function(m){return!m.__N}))return!r||r.call(this,l,a,y);var _=!1;return d.forEach(function(m){if(m.__N){var f=m.__[0];m.__=m.__N,m.__N=void 0,f!==m.__[0]&&(_=!0)}}),!(!_&&o.__c.props===l)&&(!r||r.call(this,l,a,y))};v.u=!0;var r=v.shouldComponentUpdate,u=v.componentWillUpdate;v.componentWillUpdate=function(l,a,y){if(this.__e){var d=r;r=void 0,i(l,a,y),r=d}u&&u.call(this,l,a,y)},v.shouldComponentUpdate=i}return o.__N||o.__}function Ce(t,e){var n=ke(W++,3);!c.__s&&Le(n.__H,e)&&(n.__=t,n.i=e,v.__H.__h.push(n))}function $e(){for(var t;t=be.shift();)if(t.__P&&t.__H)try{t.__H.__h.forEach(V),t.__H.__h.forEach(Y),t.__H.__h=[]}catch(e){t.__H.__h=[],c.__e(e,t.__v)}}c.__b=function(t){v=null,he&&he(t)},c.__r=function(t){ge&&ge(t),W=0;var e=(v=t.__c).__H;e&&(Q===v?(e.__h=[],v.__h=[],e.__.forEach(function(n){n.__N&&(n.__=n.__N),n.__V=K,n.__N=n.i=void 0})):(e.__h.forEach(V),e.__h.forEach(Y),e.__h=[],W=0)),Q=v},c.diffed=function(t){ve&&ve(t);var e=t.__c;e&&e.__H&&(e.__H.__h.length&&(be.push(e)!==1&&me===c.requestAnimationFrame||((me=c.requestAnimationFrame)||Ne)($e)),e.__H.__.forEach(function(n){n.i&&(n.__H=n.i),n.__V!==K&&(n.__=n.__V),n.i=void 0,n.__V=K})),Q=v=null},c.__c=function(t,e){e.some(function(n){try{n.__h.forEach(V),n.__h=n.__h.filter(function(o){return!o.__||Y(o)})}catch(o){e.some(function(i){i.__h&&(i.__h=[])}),e=[],c.__e(o,n.__v)}}),ye&&ye(t,e)},c.unmount=function(t){Se&&Se(t);var e,n=t.__c;n&&n.__H&&(n.__H.__.forEach(function(o){try{V(o)}catch(i){e=i}}),n.__H=void 0,e&&c.__e(e,n.__v))};var we=typeof requestAnimationFrame==\"function\";function Ne(t){var e,n=function(){clearTimeout(o),we&&cancelAnimationFrame(e),setTimeout(t)},o=setTimeout(n,100);we&&(e=requestAnimationFrame(n))}function V(t){var e=v,n=t.__c;typeof n==\"function\"&&(t.__c=void 0,n()),v=e}function Y(t){var e=v;t.__c=t.__(),v=e}function Le(t,e){return!t||t.length!==e.length||e.some(function(n,o){return n!==t[o]})}function Pe(t,e){return typeof e==\"function\"?e(t):e}function Ee(t){let{stewConfig:e,stewResourceMap:n}=t,[o,i]=xe({loadingStatus:\"loading\",segmentKey:e.stewSegments[0].segmentKey});return Ce(()=>{Fe({stewResourceMap:n,segmentState:o,setSegmentState:i})},[o.segmentKey]),h(\"div\",null,h(\"div\",{style:{display:\"flex\",flexDirection:\"row\"}},e.stewSegments.map(r=>h(\"div\",{style:{padding:8,color:\"purple\",cursor:\"pointer\",fontWeight:700},onClick:()=>{i({loadingStatus:\"loading\",segmentKey:r.segmentKey})}},r.segmentKey))),h(\"div\",{style:{padding:8,fontWeight:300}},o.segmentKey),o.loadingStatus===\"success\"?h(H,null,h(o.segmentModule.SegmentItemDisplay,{someSegmentItem:o.segmentDataset[0]}),h(\"style\",null,o.segmentCss)):null)}async function Fe(t){let{stewResourceMap:e,segmentState:n,setSegmentState:o}=t,[i,r,u]=await Promise.all([fetch(`${e.datasetsDirectoryPath}/${n.segmentKey}.json`).then(l=>l.json()),fetch(`${e.modulesDirectoryPath}/${n.segmentKey}.js`).then(l=>l.text()).then(l=>new Function(`${l}return segmentModuleResult.default`)()),fetch(`${e.stylesDirectoryPath}/${n.segmentKey}.css`).then(l=>l.text())]);o({loadingStatus:\"success\",segmentKey:n.segmentKey,segmentDataset:i,segmentModule:r,segmentCss:u})}window.h=T;Te();async function Te(){let{stewConfig:t,stewResourceMap:e}=await Ke();pe(T(Ee,{stewConfig:t,stewResourceMap:e}),document.getElementById(\"appContainer\")??J(\"hydrate.appContainer\")),document.getElementById(\"splashPageStyle\")?.remove(),console.info(t)}async function Ke(){console.log(document.getElementById(\"appScript\")?.dataset.stew_build_id);let t=document.getElementById(\"appScript\")?.dataset.stew_build_id??J(\"loadApp.stewBuildId\"),e=de({stewBuildId:t}),o=await(await fetch(e.configPath)).json();return{stewResourceMap:e,stewConfig:o}}})();"