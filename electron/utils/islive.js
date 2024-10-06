const fs = require('fs')
const Conf = require('ee-core/config');

// const fetch = require('node-fetch')

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
    avatar:''
  }
  const str = (await data.text()).replaceAll('\\','')
  // 使用正则表达式计算 user_count_str 在字符串中出现的次数
  const statusRegex = /"status_str":"([^"]+)"/;
  const statusMatch = str.match(statusRegex);
  if(statusMatch){
    result.status = statusMatch[1]
  }

  // 直播标题
  const titleRegex = /"title":"([^"]+)"[^}]*"user_count_str"/;
  const titleMatch = str.match(titleRegex);
  if(titleMatch){
    result.title = titleMatch[1]
  }

  // 直播账号名称
  const nicknameRegex = /"nickname":"([^"]+)"[^}]*"avatar_thumb"/;
  const nicknameMatch = str.match(nicknameRegex);
  if(nicknameMatch){
    result.nickname = nicknameMatch[1]
  }

  // 账号头像
  const avatarRegex = /"avatar_thumb":\s*\{[^}]*"url_list":\[([^\]]+)\]\}/;
  const avatarMatch = str.match(avatarRegex);
  if (avatarMatch) {
    const urls = avatarMatch[1].split(',');
    const cleanUrls = urls.map(url => url.trim().slice(1, -1));
    result.avatar = cleanUrls[0]
  } 

  // const regex = new RegExp('user_count_str', "g");
  // const matches = str.match(regex);
  // const count = matches ? matches.length : 0;
  // const message = count>=2?'正在直播':'直播已结束'
  // console.log(message);
  // 0、1 直播结束 2 正在直播
  return result;
}


const cookie = "douyin.com; device_web_cpu_core=2; device_web_memory_size=8; xg_device_score=4.731176470588235; bd_ticket_guard_client_web_domain=2; xgplayer_user_id=106059560150; LOGIN_STATUS=1; store-region-src=uid; live_use_vvc=%22false%22; SEARCH_RESULT_LIST_TYPE=%22single%22; UIFID_TEMP=96cd3b166f3029d7c1cc3f64582454ab8a83ff1f9e6d6689076dd47ef1dca5f8dc1f2541210957d40e6585c32fcc5041bc9a0c0cb64a098f45889d50fde443b876112308fd90af1b5394abab42c8cd3d; fpk1=U2FsdGVkX1+4PvfZw7j/rmNnhj15syW/KLtHVy5/PdciC9tpVd4Lu/DasHkPl5PNl6XQWK6BolsgAYoc6n6uFw==; fpk2=10f9287deaf609ee36fb37783f2b89c0; UIFID=96cd3b166f3029d7c1cc3f64582454ab8a83ff1f9e6d6689076dd47ef1dca5f8dc1f2541210957d40e6585c32fcc5041074d633113a547a745d04cf199e1edcdf64e04b8cff66bc1a29307b53e053fcf04d6b2d1c8193a7298ac70bb3198c10dc49a3e4197207c47024a22f740f41db26b7bec03371d36e119af040ac8add010bd976fa8f1989f428a0a04b2c339df8d49c3e9a7f0b8213d351516e8a942fed5; my_rd=2; xgplayer_device_id=608074914; _bd_ticket_crypt_doamin=2; __security_server_data_status=1; is_hit_partitioned_cookie_canary_ss=true; s_v_web_id=verify_m026vaqv_0ff7a85b_9d51_1175_b054_cae95cd879dc; d_ticket=738923e0a09b2f83e3ab66a7ad4812240204a; passport_assist_user=Cjzax7WmzwU6D5IkUF2qas81gdPTOoCf8zkil3iVs45l96_d3_W4rzi7lrQNoP-1VfWFsoP2P9VacN--Rf4aSgo8pjNT6Yp8U3QuGf97sV721398s5MGM7wqgZwu3Ur2sdDJu3G_GdzpGq0aMDU089sCRaMZC8fQ9thGw7tVELvx2Q0Yia_WVCABIgEDvJd1hg%3D%3D; n_mh=DeXR54yI4bFDS6RsydknjAf0hUrSD7AG40NK5vsSwLA; sso_uid_tt=2f2022cb7e018b54e9d1868be72be6bc; sso_uid_tt_ss=2f2022cb7e018b54e9d1868be72be6bc; toutiao_sso_user=d6baffde2ec605673fe9f17810cd2b04; toutiao_sso_user_ss=d6baffde2ec605673fe9f17810cd2b04; sid_ucp_sso_v1=1.0.0-KGVkNWMyMTJkMGYxZjI1Yzg4NzM1NmU1MDU5MmU5N2JkZTdlYmQ3ZTAKHwjMmpD14QIQ77ORtgYY7zEgDDDFjYzVBTgCQPEHSAYaAmxmIiBkNmJhZmZkZTJlYzYwNTY3M2ZlOWYxNzgxMGNkMmIwNA; ssid_ucp_sso_v1=1.0.0-KGVkNWMyMTJkMGYxZjI1Yzg4NzM1NmU1MDU5MmU5N2JkZTdlYmQ3ZTAKHwjMmpD14QIQ77ORtgYY7zEgDDDFjYzVBTgCQPEHSAYaAmxmIiBkNmJhZmZkZTJlYzYwNTY3M2ZlOWYxNzgxMGNkMmIwNA; uid_tt=50eddcba475f45b5e236e8e2da8203a9; uid_tt_ss=50eddcba475f45b5e236e8e2da8203a9; sid_tt=7fc660c04831ef029d4b0a4e5ce64e40; sessionid=7fc660c04831ef029d4b0a4e5ce64e40; sessionid_ss=7fc660c04831ef029d4b0a4e5ce64e40; is_staff_user=false; _bd_ticket_crypt_cookie=583b056b998ef7839f3d3e6f7d956d87; store-region=cn-ah; hevc_supported=true; SelfTabRedDotControl=%5B%7B%22id%22%3A%227372751499254761512%22%2C%22u%22%3A6%2C%22c%22%3A0%7D%5D; passport_csrf_token=dfe7605f1d6f464032f92099a038a780; passport_csrf_token_default=dfe7605f1d6f464032f92099a038a780; volume_info=%7B%22isMute%22%3Afalse%2C%22isUserMute%22%3Afalse%2C%22volume%22%3A0.927%7D; sid_guard=7fc660c04831ef029d4b0a4e5ce64e40%7C1727062033%7C5184000%7CFri%2C+22-Nov-2024+03%3A27%3A13+GMT; sid_ucp_v1=1.0.0-KDE1ZTFhZDYxODNmNmNjNTYwNmJhNDAzODEyNTBjNTU2MDM1ZDdmYTIKGQjMmpD14QIQkcDDtwYY7zEgDDgCQPEHSAQaAmxxIiA3ZmM2NjBjMDQ4MzFlZjAyOWQ0YjBhNGU1Y2U2NGU0MA; ssid_ucp_v1=1.0.0-KDE1ZTFhZDYxODNmNmNjNTYwNmJhNDAzODEyNTBjNTU2MDM1ZDdmYTIKGQjMmpD14QIQkcDDtwYY7zEgDDgCQPEHSAQaAmxxIiA3ZmM2NjBjMDQ4MzFlZjAyOWQ0YjBhNGU1Y2U2NGU0MA; FOLLOW_LIVE_POINT_INFO=%22MS4wLjABAAAAuzbwmQ1sJPYRwvzZjSRGChDM0dghND0viwjdrLjvkXc%2F1727280000000%2F0%2F1727259250891%2F0%22; dy_swidth=1440; dy_sheight=900; publish_badge_show_info=%220%2C0%2C0%2C1727579553640%22; ttwid=1%7CBrLzWwPHOOLNxteWo1jRWuaRJ6rNhWPHvfzFsPK42SQ%7C1727736791%7C3e971ff86c30c0a0c58857e7630c7d95ae5e52fd9dd1283bcc71cdfdf94ef40e; __live_version__=%221.1.2.4035%22; webcast_local_quality=null; webcast_leading_last_show_time=1727767224678; webcast_leading_total_show_times=1; live_can_add_dy_2_desktop=%221%22; __ac_nonce=066fba6d70006750eddc5; __ac_signature=_02B4Z6wo00f01gWHL8AAAIDC4od41iQmS9oFpytAAOeoHsu757FMwZigKQwo2Xq03.b2C3b66Zm4WtVu9ADb3zMnaf6H2ioy2VEThxoDnzvYP7e9dNYetbppw1174XStD0XtlSHidJyWH50J31; strategyABtestKey=%221727768289.635%22; FOLLOW_NUMBER_YELLOW_POINT_INFO=%22MS4wLjABAAAAuzbwmQ1sJPYRwvzZjSRGChDM0dghND0viwjdrLjvkXc%2F1727798400000%2F0%2F0%2F1727769490648%22; csrf_session_id=39278b2eceb0c1ed016795e47a51370e; biz_trace_id=f548d95b; download_guide=%223%2F20241001%2F0%22; douyin.com; device_web_cpu_core=2; device_web_memory_size=8; xg_device_score=4.731176470588235; pwa2=%220%7C0%7C3%7C0%22; stream_player_status_params=%22%7B%5C%22is_auto_play%5C%22%3A0%2C%5C%22is_full_screen%5C%22%3A0%2C%5C%22is_full_webscreen%5C%22%3A0%2C%5C%22is_mute%5C%22%3A0%2C%5C%22is_speed%5C%22%3A1%2C%5C%22is_visible%5C%22%3A0%7D%22; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1440%2C%5C%22screen_height%5C%22%3A900%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A2%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A5.7%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A50%7D%22; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCTHNSOTM1ZGZvejM0eDB0MDFDcDZMY0N2TzFhZ1ppbjdmcnF3QWRzbXY4bmFtd3VwVjZFZlpHS1YwRzNGVWRzMUczc1Q4VXNlbVFzamFNR0xrTFVON009IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoyfQ%3D%3D; home_can_add_dy_2_desktop=%221%22; odin_tt=e5a9c390716adc8bac46b4fc9dd26c9c73b8a77c2a1439f728f392abf1682ce0fafe98cb9e36e1ca585b5cb9e3b6e84336c19178f103614ddb87d2679f3d6812; IsDouyinActive=false; passport_fe_beating_status=false";
// const a =  isLive(784024758800,cookie).then(res=>{
//   console.log(res)
// });


module.exports = {
  isLive,
  cookie
};