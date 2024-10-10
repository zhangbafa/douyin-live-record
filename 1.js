"use strict";


const Conf = require('ee-core/config');
function getCookie(){
    const config = {
        "savedir": "5",
        "segment": false,
        "segmentDuration": 10,
        "cookie": "66"
      }

      

    return config?.cookie
  }

const a = getCookie()
console.log(a)