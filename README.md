# http-cache

http 缓存。

## QuickStart

```bash
$ npm i
$ EGG_SERVER_ENV=prod npm start
$ open http://localhost:7001/
```

## Cache

### 按存储位置分类

|位置|优先级|生命周期|多 Tab 页共享|触发方式
|-----|-----|-----|------|------|
Service Worker|++++||√|
Memory Cache|+++|浏览器获取资源到 Tab 页面关闭||请求相同类型的 url，异步请求或者较大资源不会放到这里
Disk Cache|++|浏览器根据内部算法释放‘最老’或‘最可能过时’的缓存|√|
网络请求|+|

### 按是否需要服务端配合分类

- 强缓存：浏览器通过某些 http 请求头来判断请求是否命中缓存，如果命中，则直接跳过服务器使用本地缓存，否则发新请求到服务器下载新资源。
- 协商缓存：浏览器通过发请求到服务器，由服务器来判断浏览器的缓存是否仍然有效，如果是，则响应 304，浏览器直接使用本地缓存，否则响应 200，浏览器需要重新下载新资源。


### 缓存相关头部字段

- `Cache-Control`
  - `public`: 资源可以缓存在任意位置，对用户共享缓存。
  - `private`: 资源缓存私有化，资源存储在私有缓存空间，只有特定用户才可访问。
  - `no-cache`: 浏览器会根据响应码是否为 304 来判断是否需要使用本地缓存，一般配合 `ETag` 和 `Last-Modified` 使用，该字段作用不是为了减少请求数，而是减少响应大小。
  - `no-store`: 每个请求都不走缓存，直接由服务器返回
  - `max-age`: 资源有效期限，在此期间内浏览器会一直使用本地缓存的资源，超过期限后才再次请求服务器获取新数据，一般用来缓存相对稳定的静态资源，比如 js，css 等静态文件。

- `Last-Modified` + `If-Modified-Since`
  - `Last-Modified`：标示这个响应资源的最后修改时间。web服务器在响应请求时，告诉浏览器资源的最后修改时间。
  - `If-Modified-Since`：当资源过期时（强缓存失效），发现资源具有 `Last-Modified` 声明，则再次向web服务器请求时带上头 `If-Modified-Since`，表示请求时间。web 服务器收到请求后发现有头 `If-Modified-Since` 则与被请求资源的最后修改时间进行比对。若最后修改时间较新，说明资源又被改动过，则响应整片资源内容（写在响应消息包体内），HTTP 200；若最后修改时间较旧，说明资源无新修改，则响应HTTP 304 (无需包体，节省浏览)，告知浏览器继续使用所保存的 cache。
  - 缺点：
    - `Last-Modified` 标注的最后修改只能精确到秒级，如果某些文件在1秒钟以内，被修改多次的话，它将不能准确标注文件的修改时间（无法及时更新文件).
    - 如果某些文件会被定期生成，当有时内容并没有任何变化，但 `Last-Modified` 却改变了，导致文件没法使用缓存.
    - 如果文件是通过服务器动态生成的，那么该方法的更新时间永远是生成的时间，尽管文件可能没有变化，所以起不到缓存的作用。

- `ETag` + `If-None-Match`: 优先级高于 `Last-Modified`
  - `Etag`：web 服务器响应请求时，告诉浏览器当前资源在服务器的唯一标识（生成规则由服务器决定）。
  - `If-None-Match`：当资源过期时（使用 `Cache-Control` 标识的 `max-age`），发现资源具有 `ETag` 声明，则再次向 web 服务器请求时带上头`If-None-Match`。web 服务器收到请求后发现有头 `If-None-Match` 则与被请求资源的相应校验串进行比对，决定返回 200 或 304。

### 浏览器清空缓存

- `meta` 标签

```html
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-store">
<meta http-equiv="expires" content="0">
```

- 随机参数

给请求 url 带上随机参数，如 `Math.random()`

- 浏览器控制面板

Network -> Disable cache



