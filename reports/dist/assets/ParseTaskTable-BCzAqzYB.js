import{u as v,r as s,j as e,b as k}from"./index-C74CXgtr.js";const T=()=>{const{apiEndpoints:c}=v(),[i,f]=s.useState([]),[h,r]=s.useState(!0),[x,n]=s.useState(""),[l,p]=s.useState(null),[d,m]=s.useState(null),[u,b]=s.useState(c.parse_task),y=async t=>{const o=localStorage.getItem("authToken");if(!o){n("Authentication token not found"),r(!1);return}if(!t){n("API endpoint not found"),r(!1);return}try{const a=await k.get(t,{headers:{Authorization:`Bearer ${o}`}});a.data&&a.data.results?(f(a.data.results),p(a.data.links.next),m(a.data.links.previous)):n("Invalid data format"),r(!1)}catch(a){console.error(a),n("Failed to fetch table data"),r(!1)}};s.useEffect(()=>{y(u)},[u,c]);const j=()=>{l&&b(l)},N=()=>{d&&b(d)};if(h)return e.jsx("div",{children:"Loading..."});if(x)return e.jsx("div",{children:x});if(i.length===0)return e.jsx("div",{children:"No data available"});const g=Object.keys(i[0]),P=t=>t==null?"":typeof t=="object"?JSON.stringify(t):t.toString();return e.jsxs("div",{className:"container mx-auto p-4",children:[e.jsx("h2",{className:"text-2xl font-bold mb-4",children:"Table: Parse Task"}),e.jsxs("div",{className:"overflow-x-auto",children:[e.jsxs("table",{className:"min-w-full bg-white border border-gray-200",children:[e.jsx("thead",{children:e.jsx("tr",{children:g.map(t=>e.jsx("th",{className:"px-4 py-2 border-b border-gray-200 bg-gray-100 text-left text-sm font-medium text-gray-700",children:t},t))})}),e.jsx("tbody",{children:i.map((t,o)=>e.jsx("tr",{className:"odd:bg-white even:bg-gray-50",children:g.map(a=>e.jsx("td",{className:"px-4 py-2 border-b border-gray-200 text-sm text-gray-700",children:P(t[a])},a))},o))})]}),e.jsxs("div",{className:"flex justify-between mt-4",children:[e.jsx("button",{onClick:N,disabled:!d,className:"px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50",children:"Previous"}),e.jsx("button",{onClick:j,disabled:!l,className:"px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50",children:"Next"})]})]})]})};export{T as default};
