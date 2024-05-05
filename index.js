// script by siputzx
// recode by rian ofc
// jangan dihapus jembud
var express = require("express"), cors = require("cors"), secure = require("ssl-express-www");
const path = require('path');
const os = require('os');
var request = require('request');
const fs = require('fs');
const fetch = require('node-fetch');
const { BingImageCreator } = require("./function/scraper/bingimg");
const { processing } = require("./function/scraper/Anakay");
const ptz = require('./function/index') 
const { getBuffer } = require("./function/scraper/buffer");
const apis = require("@siputzx/scraper") 
const api = require("caliph-api")
const axios = require('axios')

  var {
  ytDonlodMp3,
  ytDonlodMp4,
  ytPlayMp3,
  ytPlayMp4,
  ytSearch
} = require("./function/scraper/yt");
var {
  wallpaperhd,
  HariLibur, 
  downloadCapcut,
  capcutsearch
} = require("./function/scraper/api");
var {
  chatgptss,
  searchsticker, 
  pinterest, 
  quotesAnime, 
  capcut
} = require("./function/scraper/exonityscraper");
var app = express();
app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());
app.use(secure);
app.use(express.static(path.join(__dirname, 'public')));
const port = 3000;

app.get('/stats', (req, res) => {
  const stats = {
    platform: os.platform(),
    architecture: os.arch(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    uptime: os.uptime(),
    cpuModel: os.cpus()[0].model,
    numCores: os.cpus().length,
    loadAverage: os.loadavg(),
    hostname: os.hostname(),
    networkInterfaces: os.networkInterfaces(),
    osType: os.type(),
    osRelease: os.release(),
    userInfo: os.userInfo(),
    processId: process.pid,
    nodeVersion: process.version,
    execPath: process.execPath,
    cwd: process.cwd(),
    memoryUsage: process.memoryUsage()
  };
  res.json(stats);
});

app.get('/loadihng', (req, res) => {
  res.sendFile(path.join(__dirname,  'index.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  'home.html'));
});
app.get('/pingpong', (req, res) => {
  res.sendFile(path.join(__dirname,  'game.html'));
});
app.get('/loading', (req, res) => {
  res.sendFile(path.join(__dirname,  'j.html'));
});
app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname,  'lah.html'));
});
app.get('/gte', (req, res) => {
  res.sendFile(path.join(__dirname,  'LOADING.html'));
});
app.get('/lolhuman', (req, res) => {
  res.sendFile(path.join(__dirname,  'Lolhuman.html'));
});
app.get('/api/ragbot', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await ptz.ragBot(message);
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk degreeGuru
app.get('/api/degreeguru', async (req, res) => {
  try {
    const { message }= req.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await ptz.degreeGuru(message);
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk smartContract
app.get('/api/smartcontract', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await ptz.smartContract(message);
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk blackboxAIChat
app.get('/api/blackbox', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await ptz.blackboxAIChat(message);
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/gpt", async (req, res) => {
const text = req.query.text;

if (!text) {
return res.status(400).send("Parameter 'text' is required.");
}

try {
const requestData = {
operation: "chatExecute",
params: {
text: text,
languageId: "6094f9b4addddd000c04c94b",
toneId: "60572a649bdd4272b8fe358c",
voiceId: ""
}
};

const config = {
headers: {
Accept: "application/json, text/plain, */*",
Authentication: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MTZjMjFhMGE1NTNiNjE1MDhmNWIxOSIsImlhdCI6MTcxMjc2NzUxNH0.qseE0iNl-4bZrpQoB-zxVsc-pz13l3JOKkg4u6Y08OY",
"Content-Type": "application/json"
}
};
let {data} = await axios.post("https://api.rytr.me/", requestData, config)
data.data.content = data.data.content.replace(/<\/?p[^>]*>/g, '');
res.json(data);
} catch (error) {
console.error(error);
res.status(500).send("Internal Server Error");
}
});
app.get('/api/tiktok', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    const response = await ptz.tiktok2(message);
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/ttsearch', async (req, res) => {
  try {
    const message = req.query.text;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "text" tidak ditemukan' });
    }
    const response = await ptz.tiktokserch2(message);
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/bingimg', async (req, res) => {
  try {
    const message = req.query.text;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "text" tidak ditemukan' });
    }
    const img2 = new BingImageCreator({
      cookie: `1lVjcgPnXLSccoYZ1_QxlVsh2GUoIvwXRkMCYur5Q_fgtQRMeSs_DmnDTNKixYXAN9Tr5eOphlc5qjEfsreCOWx9EELSDG6Pt-oB2Twm_htnoVtQVCMrPM-7pt8z3nReVKGLEQ2cQn5Vxuz9GHJiBtEeHGTdEbzbPRcYr3PD75pkfZWpjCELTxHhskev33pUTeuTLGHpc4gqIh3PQLL6IZw`,
    });
    const data = await img2.createImage(message);
            
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      data
    
    });     
  } catch (error) {
    res.status(500).json({ error: error.message });
 }       
    });

app.get('/api/ytmp4', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    ytDonlodMp4(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/yts', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    ytSearch(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/ytmp3', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    ytDonlodMp3(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/spotify', async (req, res) => {
  try{
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
   var response = await fetch(`https://api.miftahganzz.my.id/api/download/spotify?url=${message}&apikey=zex`);
    var data = await response.json();
    var { result: result } = data;
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/gemini', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var response = await fetch(`https://apiruulzz.my.id/api/gemini?query=${message}`);
    var data = await response.json();
    var { result: result } = data;
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/chatbot_bitrough', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    const lang = req.query.lang;
    if (!lang) {
      return res.status(400).json({ error: 'Parameter "lang" tidak ditemukan' });
    }
   var response = await fetch(`https://api.onesytex.my.id/api/chatbot_bitrough?query=${message}&lang=${lang}`);
    var data = await response.json();
    var { msg: result } = data.reply;
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/aio', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var response = await fetch(`.my.id/api/gemini?query=${message}`);
    var data = await response.json();
    var { result: result } = data;
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});

app.get('/api/tiktokStalk', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var response = await fetch(`https://apiruulzz.my.id/api/tiktokStalk?query=${message}`);
    var data = await response.json();
    var { result: result } = data;
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/ytplaymp4', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    ytPlayMp4(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/remini', async (req, res) => {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
const This = await processing(message, "enhance");
res.set({
                'Content-Type': 'image/jpeg'
            })
            res.send(This)    
});
  app.get('/api/capcutdl', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   let a = await capcut(message)
    var video = a.video;
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY", 
      video
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/HariLibur', async (req, res) => {
  try {
    HariLibur()
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/quotesAnime', async (req, res) => {
  try {
    quotesAnime()
    .then((hasil) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      hasil 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/chat-gpt', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    let aja = await chatgptss(message) 
    var result = aja.resultan.data
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/pinterest', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    pinterest(message)
    .then((hasil) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      hasil 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/searchsticker', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    searchsticker(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/tikmusic', async (req, res) => {
  const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  var response = await fetch(`https://aemt.me/download/tikdl?url=${message}`);
    var data = await response.json();
    var { nowm: video, audio } = data.result.url;
    var requestSettings = {
        url: audio,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'audio/mp3');
        res.send(body);
    });
});
app.get('/api/nobg', async (req, res) => {
  const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  const img = `${message}`
const { data } = await axios.post("https://backend.zyro.com/v1/ai/remove-background", { 
image: "data:image/jpeg;base64," + img.toString("base64") 
})
const image = Buffer.from(data.result.split(",")[1], "base64")
    var requestSettings = {
        url: image,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/jpeg');
        res.send(body);
    });
});
app.get('/api/asupan', async (req, res) => {
  var data = ["https://api.miftahganzz.my.id/api/random/asupanrandom?type=video&apikey=zex"] 
    var result = data[Math.floor(Math.random() * data.length)];
    var requestSettings = {
        url: result,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'video/mp4');
        res.send(body);
    });
    
});
app.get('/api/toanime', async (req, res) => {
  const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  let result = await getBuffer(`https://skizo.tech/api/toanime?apikey=nana&url=${url}`)
res.set({'Content-Type': 'image/png'})
res.send(result)
});
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname,  '404.html'));
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ada kesalahan pada server😵');
});
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
