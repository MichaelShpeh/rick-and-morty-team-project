import"./main-51e28f4d.js";const Y="/rick-and-morty-team-project/assets/sprites-cc0aab62.svg",F=async e=>{const t=document.createElement("div");t.className="backdrop";const a=await S(e.episode),o=(Array.isArray(a)?a:[a]).map(n=>{const s=(n.episode||"").match(/S0*?(\d+)E0*?(\d+)/i),r=s?s[1]:"—";return`
				<li>
					<h3>${n.name}</h3>
					<div class="characters__modal--episodes-list-season">
						<h4>Season</h4>
						<p>${r}</p>
					</div>
					<div class="characters__modal--episodes-list-airdate">
						<h4>Air date</h4>
						<p>${n.air_date}</p>
					</div>
				</li>
			`}).join("");return t.innerHTML=`
        <div class="characters__modal">
            <button class="characters__modal--close">
                <svg class="icon" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <use xlink:href="${Y}#close"></use>
                </svg>
            </button>

            <div>
							<div class="characters__modal--image">
									<img src="${e.image}" alt="${e.name}" />
							</div>

							<div class="characters__modal--about">
									<ul class="characters__modal--about-list">
											<li>
													<h2>Status</h2>
													<p>${e.status}</p>
											</li>
											<li>
													<h2>Species</h2>
													<p>${e.species}</p>
											</li>
											<li>
													<h2>Gender</h2>
													<p>${e.gender}</p>
											</li>
											<li>
													<h2>Origin</h2>
													<p>${e.origin.name}</p>
											</li>
											<li>
													<h2>Location</h2>
													<p>${e.location.name}</p>
											</li>
											<li>
													<h2>Episodes</h2>
													<p>${e.episode.slice(0,4).map(n=>n.split("/").pop()).join(", ")}</p>
											</li>
											<li>
													<h2>Type</h2>
													<p>${e.type||"Unknown"}</p>
											</li>
									</ul>
							</div>
						</div>

            <div class="characters__modal--episodes">
                <h2>Episodes</h2>
                <ul class="characters__modal--episodes-list">
                    ${o}
                </ul>
            </div>
        </div>
    `,t},G=document.querySelector("main"),b="https://rickandmortyapi.com/api",I="/character/";G.addEventListener("click",async e=>{const t=e.target.closest(".character-card");if(!t)return;const a=t.dataset.id,o=await fetch(`${b}${I}${a}`).then(c=>c.json());if(console.log(o),!o)throw new Error("Failed to load character data");const n=await F(o),s=n.querySelector(".characters__modal--window");document.body.appendChild(n),document.body.classList.add("no-scroll"),n.querySelector(".characters__modal--close").addEventListener("click",()=>{document.body.removeChild(n),document.body.classList.remove("no-scroll")}),window.addEventListener("keydown",c=>{c.key==="Escape"&&(document.body.removeChild(n),document.body.classList.remove("no-scroll"))}),n.addEventListener("click",c=>{c.target===n&&(document.body.removeChild(n),document.body.classList.remove("no-scroll"))}),s.addEventListener("click",c=>{c.stopPropagation()})});async function S(e){const t=e.splice(0,5).map(o=>o.split("/").pop());return await fetch(`${b}/episode/${t.join(",")}`).then(o=>o.json())}var v=Object.defineProperty,$=Object.getOwnPropertyDescriptor,N=Object.getOwnPropertyNames,X=Object.prototype.hasOwnProperty,x=(e,t)=>{for(var a in t)v(e,a,{get:t[a],enumerable:!0})},B=(e,t,a,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of N(t))!X.call(e,n)&&n!==a&&v(e,n,{get:()=>t[n],enumerable:!(o=$(t,n))||o.enumerable});return e},W=e=>B(v({},"__esModule",{value:!0}),e),L={};x(L,{getCharacter:()=>O,getCharacters:()=>q,getEndpoints:()=>V,getEpisode:()=>Q,getEpisodes:()=>K,getLocation:()=>D,getLocations:()=>H});var z=W(L),J={required:"You are using an invalid argument. As an argument use an integer (Id) or an array of integers (Ids).",optional:"You are using an invalid argument. As an argument use a filter object or leave it blank."},k=e=>typeof e=="number"&&Number.isInteger(e),R=e=>Array.isArray(e)&&e.every(k),T=(e,t)=>{if(t&&k(e))return`/${e}`;if(t&&R(e)){let a=e;return`/${a.length?a:"[0]"}`}if(!t&&typeof e=="object"&&!Array.isArray(e))return`/?${new URLSearchParams(e).toString()}`;throw new Error(J[t?"required":"optional"])},A=T,Z=async e=>{let t=await fetch(`https://rickandmortyapi.com/api/${e}`);return t.ok?{data:await t.json(),status:t.status,statusMessage:t.statusText}:{data:{},status:t.status,statusMessage:t.statusText}},M=Z,U=async({endpoint:e,options:t,isIdRequired:a=!1})=>{let o=A(t,a);return M(`${e}/${o}`)},l=U,j="character",q=e=>l({endpoint:j,options:e??{}}),O=e=>l({endpoint:j,options:e,isIdRequired:!0}),E="location",H=e=>l({endpoint:E,options:e??{}}),D=e=>l({endpoint:E,options:e,isIdRequired:!0}),C="episode",K=e=>l({endpoint:C,options:e??{}}),Q=e=>l({endpoint:C,options:e,isIdRequired:!0}),V=()=>l({endpoint:"",options:{}});const ee=new URL("/rick-and-morty-team-project/assets/characters-ba1e72bb.html",self.location),te=new URL("data:application/octet-stream;base64,PGFydGljbGUgY2xhc3M9J2NoYXJhY3Rlci1jYXJkJyBkYXRhLWlkPSd7e2lkfX0nPgoJPGRpdiBjbGFzcz0nY2hhcmFjdGVyLWNhcmRfX2ltYWdlLXdyYXBwZXInPgoJCTxpbWcgc3JjPSd7e2ltYWdlfX0nIGFsdD0ne3tuYW1lfX0nIGNsYXNzPSdjaGFyYWN0ZXItY2FyZF9faW1hZ2UnIC8+Cgk8L2Rpdj4KCgk8ZGl2IGNsYXNzPSdjaGFyYWN0ZXItY2FyZF9fYm9keSc+CgkJPGgzIGNsYXNzPSdjaGFyYWN0ZXItY2FyZF9fbmFtZSc+e3tuYW1lfX08L2gzPgoJCTxwIGNsYXNzPSdjaGFyYWN0ZXItY2FyZF9fb3JpZ2luJz4KCQkJPHN0cm9uZyBjbGFzcz0nY2hhcmFjdGVyLWNhcmRfX29yaWdpbi0tY2wnPk9yaWdpbjo8L3N0cm9uZz4KCQkJe3tvcmlnaW59fQoJCTwvcD4KCQk8cCBjbGFzcz0nY2hhcmFjdGVyLWNhcmRfX2xvY2F0aW9uJz4KCQkJPHN0cm9uZyBjbGFzcz0nY2hhcmFjdGVyLWNhcmRfX2xvY2F0aW9uLS1jbCc+TG9jYXRpb246PC9zdHJvbmc+CgkJCXt7bG9jYXRpb259fQoJCTwvcD4KCTwvZGl2Pgo8L2FydGljbGU+",self.location);let _=null;const ae=()=>window.matchMedia("(min-width: 1440px)").matches?20:10;let d=[],m=0,p=null,f=!1;function y(){document.querySelectorAll(".dropdown.dropdown--open").forEach(e=>e.classList.remove("dropdown--open"))}function ne(){const e=document.querySelectorAll(".dropdown");e.length&&(e.forEach(t=>{const a=t.dataset.select,o=t.querySelector(".dropdown__trigger"),n=t.querySelector(".dropdown__value"),s=t.querySelectorAll(".dropdown__item"),r=document.getElementById(`filter-${a}`);if(!o||!n||!s.length||!r)return;const c=r.options[r.selectedIndex];if(c){const i=c.value,u=c.textContent.trim();n.textContent=u,s.forEach(h=>h.classList.toggle("dropdown__item--selected",h.dataset.value===i))}o.addEventListener("click",i=>{i.stopPropagation();const u=t.classList.contains("dropdown--open");y(),u||t.classList.add("dropdown--open")}),s.forEach(i=>{i.addEventListener("click",()=>{const u=i.dataset.value,h=i.textContent.trim();n.textContent=h,s.forEach(w=>w.classList.toggle("dropdown__item--selected",w===i)),r.value=u,r.dispatchEvent(new Event("change",{bubbles:!0})),y()})})}),document.addEventListener("click",t=>{t.target.closest(".dropdown")||y()}))}async function oe(){const e=document.getElementById("characters-root"),a=await(await fetch(ee)).text();e.innerHTML+=a}async function se(){const t=await(await fetch(te)).text();_=Handlebars.compile(t)}async function re(e,t={}){const a=await z.getCharacters({page:e,...t});if(a.status!==200)throw new Error(a.statusMessage||"Failed to load characters");return a.data}async function ce(e={}){var o;const t=m+1,a=await re(t,e);p=((o=a.info)==null?void 0:o.pages)??null,m=t,d=d.concat(a.results||[])}async function ie(e,t={}){for(;d.length<e&&(p===null||m<p);)await ce(t)}function le(e,t=!1){const a=document.getElementById("characters-list"),o=e.map(n=>{var s,r;return _({name:n.name,image:n.image,origin:((s=n.origin)==null?void 0:s.name)||"Unknown",location:((r=n.location)==null?void 0:r.name)||"Unknown"})}).join("");t?a.insertAdjacentHTML("beforeend",o):a.innerHTML=o}function g(){const e=document.getElementById("characters-load-more");if(!e)return;const a=(d.length>0||p===null||m<p)&&!f;e.style.display=a?"inline-block":"none",e.disabled=!a}async function P(e,t={}){const a=ae();await ie(a,t);const o=d.splice(0,a);if(o.length===0){g();return}le(o,e),g()}async function de(e={}){m=0,p=null,d=[],await P(!1,e)}async function pe(){if(!f)try{f=!0,g(),await P(!0)}catch(e){console.error(e)}finally{f=!1,g()}}function ue(){const e=document.getElementById("characters-load-more");e&&e.addEventListener("click",pe)}async function me(){await oe(),ne(),await se(),ue(),await de()}document.addEventListener("DOMContentLoaded",me);
