// Local preview:  node dev-server.js  ->  http://localhost:3000
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'site'),PORT=process.env.PORT||3000;
const T={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
http.createServer((q,s)=>{let p=decodeURIComponent(new URL(q.url,'http://x').pathname);if(p.endsWith('/'))p+='index.html';let f=path.join(ROOT,p);
if(!f.startsWith(ROOT)){s.writeHead(403);return s.end()}
if((!fs.existsSync(f)||fs.statSync(f).isDirectory())&&fs.existsSync(f+'.html'))f+='.html';
if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){s.writeHead(404,{'Content-Type':T['.html']});return s.end(fs.readFileSync(path.join(ROOT,'404.html')))}
s.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(s)}).listen(PORT,()=>console.log('http://localhost:'+PORT));
