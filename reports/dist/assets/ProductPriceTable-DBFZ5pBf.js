import{u as v,r,j as e,b as S}from"./index-BDHAM68H.js";const w=()=>{const{apiEndpoints:c}=v(),[i,f]=r.useState([]),[h,s]=r.useState(!0),[u,n]=r.useState(""),[d,p]=r.useState(null),[l,m]=r.useState(null),[x,b]=r.useState(c.product_price),y=async t=>{const o=localStorage.getItem("authToken");if(!o){n("Authentication token not found"),s(!1);return}if(!t){n("API endpoint not found"),s(!1);return}try{const a=await S.get(t,{headers:{Authorization:`Bearer ${o}`}});a.data&&a.data.results?(f(a.data.results),p(a.data.links.next),m(a.data.links.previous)):n("Invalid data format"),s(!1)}catch(a){console.error(a),n("Failed to fetch table data"),s(!1)}};r.useEffect(()=>{y(x)},[x,c]);const j=()=>{d&&b(d)},P=()=>{l&&b(l)};if(h)return e.jsx("div",{children:"Loading..."});if(u)return e.jsx("div",{children:u});if(i.length===0)return e.jsx("div",{children:"No data available"});const g=Object.keys(i[0]),N=t=>t==null?"":typeof t=="object"?JSON.stringify(t):t.toString();return e.jsxs("div",{className:"container mx-auto p-4",children:[e.jsx("h2",{className:"text-2xl font-bold mb-4",children:"Table: Product Price"}),e.jsxs("div",{className:"overflow-x-auto",children:[e.jsxs("table",{className:"min-w-full bg-white border border-gray-200",children:[e.jsx("thead",{children:e.jsx("tr",{children:g.map(t=>e.jsx("th",{className:"px-4 py-2 border-b border-gray-200 bg-gray-100 text-left text-sm font-medium text-gray-700",children:t},t))})}),e.jsx("tbody",{children:i.map((t,o)=>e.jsx("tr",{className:"odd:bg-white even:bg-gray-50",children:g.map(a=>e.jsx("td",{className:"px-4 py-2 border-b border-gray-200 text-sm text-gray-700",children:N(t[a])},a))},o))})]}),e.jsxs("div",{className:"flex justify-between mt-4",children:[e.jsx("button",{onClick:P,disabled:!l,className:"px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50",children:"Previous"}),e.jsx("button",{onClick:j,disabled:!d,className:"px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50",children:"Next"})]})]})]})};export{w as default};
