// 静态资源基础路径
const baseAssetUrl = '/public';
// 创建 script
function createScript(src) {
  $('body').append($(`<script src='${baseAssetUrl}/${src}'></script>`));
}
// 计算种子参数
function getSeed() {
  return +(Math.random() > 0.5)
}
// 显示页面时间 + 服务端时间
function showTime(seed, serverTime) {
  return $(
    `<li>参数：{seed: ${seed}} &nbsp;&nbsp; 当前页面时间：${new Date().getTime()} &nbsp;&nbsp;  服务器时间：${serverTime}</li>`
  )
}
