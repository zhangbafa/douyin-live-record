/**
 * 检测直播间是否正在直播
 * 仅支持抖音
 */
async function isLive(roomId, cookie) {
  var headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,pt;q=0.7",
    "cache-control": "max-age=0",
    "cookie":cookie,
    "priority": "u=0, i",
    "sec-ch-ua":
      '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
  };
  const liveUrl = `https://live.douyin.com/${roomId}`
  const data = await fetch(liveUrl, {
    headers,
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  });
  let result = {
    status:'0',
    title:'',
    nickname:'',
    avatar:'',
    streamUrl:''
  }
  const str = (await data.text()).replaceAll('\\','')
  // 使用正则表达式计算 user_count_str 在字符串中出现的次数
  const statusRegex = /"status_str":"([^"]+)"/;
  const statusMatch = str.match(statusRegex);
  if(statusMatch){
    result.status = statusMatch[1]
  }

  // const secUidRegex = /"secUid":"([^"]+)"/;
  // const secUidMatch = str.match(secUidRegex);
  // if(secUidMatch){
  //   result.secUid = secUidMatch[1]
  // }

  // 直播标题
  const titleRegex = /"title":"([^"]+)"[^}]*"user_count_str"/;
  const titleMatch = str.match(titleRegex);
  if(titleMatch){
    result.title = titleMatch[1]
  }

  // 直播账号名称
  // const nicknameRegex = /"nickname":"([^"]+)"[^}]*"avatar_thumb"/;
  // const nicknameMatch = str.match(nicknameRegex);
  // if(nicknameMatch){
  //   result.nickname = nicknameMatch[1]
  // }

  // 账号头像
  // const avatarRegex = /"avatar_thumb":\s*\{[^}]*"url_list":\[([^\]]+)\]\}/;
  // const avatarMatch = str.match(avatarRegex);
  // if (avatarMatch) {
  //   const urls = avatarMatch[1].split(',');
  //   const cleanUrls = urls.map(url => url.trim().slice(1, -1));
  //   result.avatar = cleanUrls[0]
  // } 
  

  // 直播流
  const streamRegex = /"stream_url":\s*({.*?})/;
  const streamMatch = str.match(streamRegex);
  if (streamMatch) {
    try {
      const filterU0026 = streamMatch[1].replaceAll('u0026','&')+'}'
      result.streamUrl= JSON.parse(filterU0026)    
    } catch (error) {
      
    }
  }

  // 直播流
  const ownerRegex = /"owner":\s*({.*?})/;
  const ownerMatch = str.match(ownerRegex);
  
  if (ownerMatch) {
    const owner  = JSON.parse(ownerMatch[1]+'}')
    result.avatar = owner.avatar_thumb?.url_list[0]
    result.nickname = owner.nickname
    result.secUid = owner.sec_uid
    result.idStr = owner.id_str
  
  }

  /* 大概率会发生无法解码的问题，弃用
  const webstreamRegex = /"web_stream_url":\s*({.*?}),"default_resolution/;
  const webstreamMatch = str.match(webstreamRegex);
  if (webstreamMatch) {
    try {
      const filterU0026 = webstreamMatch[1].replaceAll('u0026','&')+'}'
      result.webStreamUrl= JSON.parse(filterU0026)    
    } catch (error) {
      
    }
  }*/
  return result;
}



export {isLive}