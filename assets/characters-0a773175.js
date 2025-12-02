import"./main-14a9f174.js";const _="/rick-and-morty-team-project/assets/sprites-cc0aab62.svg",C=async e=>{const t=document.createElement("div");t.className="backdrop";const n=await j(e.episode),a=(Array.isArray(n)?n:[n]).map(o=>{const c=(o.episode||"").match(/S0*?(\d+)E0*?(\d+)/i),s=c?c[1]:"—";return`
				<li>
					<h3>${o.name}</h3>
					<div class="characters__modal--episodes-list-season">
						<h4>Season</h4>
						<p>${s}</p>
					</div>
					<div class="characters__modal--episodes-list-airdate">
						<h4>Air date</h4>
						<p>${o.air_date}</p>
					</div>
				</li>
			`}).join("");return t.innerHTML=`
        <div class="characters__modal">
            <button class="characters__modal--close">
                <svg class="icon" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <use xlink:href="${_}#close"></use>
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
													<p>${e.episode.slice(0,4).map(o=>o.split("/").pop()).join(", ")}</p>
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
                    ${a}
                </ul>
            </div>
        </div>
    `,t},E=document.querySelector("main"),w="https://rickandmortyapi.com/api",Y="/character/";E.addEventListener("click",async e=>{const t=e.target.closest(".character-card");if(!t)return;const n=t.dataset.id,a=await fetch(`${w}${Y}${n}`).then(i=>i.json());if(console.log(a),!a)throw new Error("Failed to load character data");const o=await C(a),c=o.querySelector(".characters__modal--window");document.body.appendChild(o),document.body.classList.add("no-scroll"),o.querySelector(".characters__modal--close").addEventListener("click",()=>{document.body.removeChild(o),document.body.classList.remove("no-scroll")}),window.addEventListener("keydown",i=>{i.key==="Escape"&&(document.body.removeChild(o),document.body.classList.remove("no-scroll"))}),o.addEventListener("click",i=>{i.target===o&&(document.body.removeChild(o),document.body.classList.remove("no-scroll"))}),c.addEventListener("click",i=>{i.stopPropagation()})});async function j(e){const t=e.splice(0,5).map(a=>a.split("/").pop());return await fetch(`${w}/episode/${t.join(",")}`).then(a=>a.json())}const F="https://rickandmortyapi.com/api/character",G=new URL("/rick-and-morty-team-project/assets/characters-ba1e72bb.html",self.location),P=new URL("data:application/octet-stream;base64,PGFydGljbGUgY2xhc3M9J2NoYXJhY3Rlci1jYXJkJyBkYXRhLWlkPSd7e2lkfX0nPgoJPGRpdiBjbGFzcz0nY2hhcmFjdGVyLWNhcmRfX2ltYWdlLXdyYXBwZXInPgoJCTxpbWcgc3JjPSd7e2ltYWdlfX0nIGFsdD0ne3tuYW1lfX0nIGNsYXNzPSdjaGFyYWN0ZXItY2FyZF9faW1hZ2UnIC8+Cgk8L2Rpdj4KCgk8ZGl2IGNsYXNzPSdjaGFyYWN0ZXItY2FyZF9fYm9keSc+CgkJPGgzIGNsYXNzPSdjaGFyYWN0ZXItY2FyZF9fbmFtZSc+e3tuYW1lfX08L2gzPgoJCTxwIGNsYXNzPSdjaGFyYWN0ZXItY2FyZF9fb3JpZ2luJz4KCQkJPHN0cm9uZyBjbGFzcz0nY2hhcmFjdGVyLWNhcmRfX29yaWdpbi0tY2wnPk9yaWdpbjo8L3N0cm9uZz4KCQkJe3tvcmlnaW59fQoJCTwvcD4KCQk8cCBjbGFzcz0nY2hhcmFjdGVyLWNhcmRfX2xvY2F0aW9uJz4KCQkJPHN0cm9uZyBjbGFzcz0nY2hhcmFjdGVyLWNhcmRfX2xvY2F0aW9uLS1jbCc+TG9jYXRpb246PC9zdHJvbmc+CgkJCXt7bG9jYXRpb259fQoJCTwvcD4KCTwvZGl2Pgo8L2FydGljbGU+",self.location);let v=null;const S=1440;let b=10;function L(){b=window.innerWidth>=S?20:10}L();window.addEventListener("resize",L);let l=[],h=0,d=null,u=!1;function y(){document.querySelectorAll(".dropdown.dropdown--open").forEach(e=>e.classList.remove("dropdown--open"))}function X(){const e=document.querySelectorAll(".dropdown");e.length&&(e.forEach(t=>{const n=t.dataset.select,a=t.querySelector(".dropdown__trigger"),o=t.querySelector(".dropdown__value"),c=t.querySelectorAll(".dropdown__item"),s=document.getElementById(`filter-${n}`);if(!a||!o||!c.length||!s)return;const i=s.options[s.selectedIndex];if(i){const r=i.value,p=i.textContent.trim();o.textContent=p,c.forEach(m=>m.classList.toggle("dropdown__item--selected",m.dataset.value===r))}a.addEventListener("click",r=>{r.stopPropagation();const p=t.classList.contains("dropdown--open");y(),p||t.classList.add("dropdown--open")}),c.forEach(r=>{r.addEventListener("click",()=>{const p=r.dataset.value,m=r.textContent.trim();o.textContent=m,c.forEach(g=>g.classList.toggle("dropdown__item--selected",g===r)),s.value=p,s.dispatchEvent(new Event("change",{bubbles:!0})),y()})})}),document.addEventListener("click",t=>{t.target.closest(".dropdown")||y()}))}async function N(){const e=document.getElementById("characters-root"),n=await(await fetch(G)).text();e.innerHTML+=n}async function I(){const t=await(await fetch(P)).text();v=Handlebars.compile(t)}async function W(e){const t=`${F}?page=${e}`,n=await fetch(t);if(!n.ok)throw new Error("Failed to load characters");return n.json()}async function $(){var n;const e=h+1,t=await W(e);d=((n=t.info)==null?void 0:n.pages)??null,h=e,l=l.concat(t.results||[])}async function z(e){for(;l.length<e&&(d===null||h<d);)await $()}function B(e,t=!1){const n=document.getElementById("characters-list"),a=e.map(o=>{var c,s;return v({id:o.id,name:o.name,image:o.image,origin:((c=o.origin)==null?void 0:c.name)||"Unknown",location:((s=o.location)==null?void 0:s.name)||"Unknown"})}).join("");t?n.insertAdjacentHTML("beforeend",a):n.innerHTML=a}function f(){const e=document.getElementById("characters-load-more");if(!e)return;const n=(l.length>0||d===null||h<d)&&!u;e.style.display=n?"inline-block":"none",e.disabled=!n}async function k(e){const t=b;await z(t);const n=l.splice(0,t);if(n.length===0){f();return}B(n,e),f()}async function x(){h=0,d=null,l=[],await k(!1)}async function J(){if(!u)try{u=!0,f(),await k(!0)}catch(e){console.error(e)}finally{u=!1,f()}}function T(){const e=document.getElementById("characters-load-more");e&&e.addEventListener("click",J)}async function Z(){await N(),X(),await I(),T(),await x()}document.addEventListener("DOMContentLoaded",Z);
