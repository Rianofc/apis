// script by siputzx
// recode by rian ofc
// jangan dihapus jembud
const express = require("express"), cors = require("cors"), secure = require("ssl-express-www");
const ytdl = require('node-yt-dl');
const path = require('path');
const isNumber = require('is-number');
const isImageURL = require('image-url-validator').default
const gtts = require('node-gtts')
const { srgan2x, srgan4x } = require('super-resolution-scraper');
const os = require('os');
const {
  v4: uuidv4
} = require("uuid")
const canvafy = require('canvafy');
const Canvacord = require("canvacord");
const got = require('got')
const bodyParser = require('body-parser');
const { load } = require('cheerio');
const { stringify } = require('qs');
const qs = require("qs")
const WebSocket = require('ws');
const createHash = require('hash-generator');
const { fromBuffer } = require("file-type");
const request = require('request');
const fs = require('fs');
const crypto = require("crypto")
let cp = require("child_process");
let { promisify } = require("util");
let exec = promisify(cp.exec).bind(cp); 
const FormData = require("form-data");
const Jimp = require("jimp");
const cheerio = require("cheerio");
const gis = require('g-i-s')  
const fetch = require('node-fetch');
const { BingImageCreator } = require("./function/scraper/bingimg");
const { getTwitterMedia } = require("./function/scraper/twitter");
const { processing } = require("./function/scraper/Anakay");
const ptz = require('./function/index') 
const { ttSearch } = require('./function/scraper/api.js');
const { getBuffer } = require("./function/scraper/buffer");
const { mediafireDl } = require("./function/scraper/mediafire")
const { ig } = require("./function/scraper/Ig.js")
const danz = require('d-scrape');
const fileType = require('file-type')
const multer = require('multer');
const ocrapi = require("ocr-space-api-wrapper");
const axios = require('axios')
const nodeCron = require('node-cron');
const creator = `RIANGANZ`
// Batas penggunaan API key harian untuk pengguna reguler dan premium
const REGULAR_LIMIT = 100;
const PREMIUM_LIMIT = 300;

// Daftar API key dan penggunaan saat ini
let apiKeys = {
  'free': { used: 0, type: 'regular' }, // Pengguna reguler
  'rahasia': { used: 0, type: 'premium' }, // Pengguna premium
  // Tambahkan API key lainnya
};

// Fungsi untuk memeriksa dan mengelola limit API key
function checkApiKeyLimit(apiKey) {
  if (!apiKey || !apiKeys[apiKey]) {
    return { valid: false, message: 'API key invalid atau tidak ditemukan' };
  }

  const userType = apiKeys[apiKey].type;
  const limit = userType === 'premium' ? PREMIUM_LIMIT : REGULAR_LIMIT;

  if (apiKeys[apiKey].used >= limit) {
    return { valid: false, message: 'Limit API key telah tercapai' };
  }

  // Tambah penggunaan API key
  apiKeys[apiKey].used += 1;
  return { valid: true };
}

// Endpoint untuk mengecek limit penggunaan API key
// Contoh endpoint untuk menggunakan API
// Jadwal reset penggunaan API key setiap 24 jam
nodeCron.schedule('0 0 * * *', () => {
  console.log('Mereset penggunaan API key');
  Object.keys(apiKeys).forEach(key => {
    apiKeys[key].used = 0;
  });
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'file/');
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|mp3|mp4/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('File type not allowed'));
  }
};

const upload = multer({
  storage: storage
});
// gaktau
function getRandom(hm) {
    return `${Math.floor(Math.random() * 10000)}${hm}`
}
// scrape 1
async function gdrive(url) {
    let id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))?.[1];
    if (!id) throw 'ID Not Found';

    try {
        const response = await axios(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
            method: 'post',
            headers: {
                'accept-encoding': 'gzip, deflate, br',
                'content-length': 0,
                'content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'origin': 'https://drive.google.com',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
                'x-drive-first-party': 'DriveWebUi',
                'x-json-requested': 'true'
            }
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return JSON.parse(response.data.slice(4));
    } catch (error) {
        throw error;
    }
}
// ini batas
function generateUUIDv4(){ ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.randomBytes(1)[0] & 15 >> c / 4).toString(16)
  );
}

/*
  * Scraper By QanyPaw 
  * Forbidden to sell and delete my wm gw 
*/

async function sendMessage(text) {
  try {
    const conversation_uuid = generateUUIDv4();

    const requestData = {
      conversation_uuid: conversation_uuid,
      text: text,
      sent_messages: 1
    };

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    const response = await axios.post('https://www.timospecht.de/wp-json/cgt/v1/chat', qs.stringify(requestData), config);
    return response.data;
  } catch (error) {
    throw new Error('Terjadi kesalahan:', error);
  }
}
// bbata

async function Wikipedia(query) {
    try {
        const response = await fetch(`https://id.m.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`);
        const html = await response.text();
        const $ = cheerio.load(html);

        const contentArray = [];
        $('div.mw-parser-output p').each((index, element) => {
            contentArray.push($(element).text().trim());
        });

        const infoTable = [];
        $('table.infobox tr').each((index, element) => {
            const label = $(element).find('th.infobox-label').text().trim();
            const value = $(element).find('td.infobox-data').text().trim() || $(element).find('td.infobox-data a').text().trim();
            if (label && value) {
                infoTable.push(`${label}: ${value}`);
            }
        });

        const data = {
            title: $('title').text().trim(),
            content: contentArray.join('\n'),
            image: 'https:' + ($('#mw-content-text img').attr('src') || '//pngimg.com/uploads/wikipedia/wikipedia_PNG35.png'),
            infoTable: infoTable.join('\n')
        };

        return data;
    } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
        throw error;
    }
}
// batas
async function phharam(query) {
  const url = `https://www.pornhub.com/video/search?search=${query}`;
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  
  const videoList = [];

  $('li[data-video-segment]').each((index, element) => {
    const $element = $(element);
    
    const link = $element.find('.title a').attr('href').trim();
    const title = $element.find('.title a').text().trim();
    const uploader = $element.find('.videoUploaderBlock a').text().trim();
    const views = $element.find('.views').text().trim();
    const duration = $element.find('.duration').text().trim();
    
    const videoData = {
      link: "https://www.pornhub.com" + link,
      title: title,
      uploader: uploader,
      views: views,
      duration: duration
    };
    
    videoList.push(videoData);
  });
  
  return videoList;
}
// males benerin:v
async function tiktokdl(url) {
  let result = {}
  const bodyForm = new FormData()
  bodyForm.append("q", url)
  bodyForm.append("lang", "id")
  try {
    const { data } = await axios('https://savetik.co/api/ajaxSearch', {
      method: "post",
      data: bodyForm,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "User-Agent": "PostmanRuntime/7.32.2"
      }
    })
    const $ = cheerio.load(data.data)
    result.status = true
    result.caption = $("div.video-data > div > .tik-left > div > .content > div > h3").text()
    ;(result.server1 = {
      quality: "MEDIUM",
      url: $("div.video-data > div > .tik-right > div > p:nth-child(1) > a").attr("href")
    }),
      (result.serverHD = {
        quality: $("div.video-data > div > .tik-right > div > p:nth-child(3) > a").text().split("MP4 ")[1],
        url: $("div.video-data > div > .tik-right > div > p:nth-child(3) > a").attr("href")
      }),
      (result.audio = $("div.video-data > div > .tik-right > div > p:nth-child(4) > a").attr("href"))
    return result
  } catch (err) {
    result.status = false
    result.message = (err) 
    console.log(err)
    return result
  }
}
// batas
const keynya = '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';

async function txt2imgAnime(data) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stablediffusionapi/anime-model-v2',
      data,
      {
        headers: {
          'Authorization': `Bearer ${keynya}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    const imageBuffer = Buffer.from(response.data);
    
    return imageBuffer
  } catch (error) {
    console.error('Error generating anime:', error);
    throw error;
  }
}
function toPDF(images, opt = {}) {
	return new Promise(async (resolve, reject) => {
		if (!Array.isArray(images)) images = [images]
		let buffs = [], doc = new PDFDocument({ margin: 0, size: 'A4' })
		for (let x = 0; x < images.length; x++) {
			if (/.webp|.gif/.test(images[x])) continue
			let data = (await axios.get(images[x], { responseType: 'arraybuffer', ...opt })).data
			doc.image(data, 0, 0, { fit: [595.28, 841.89], align: 'center', valign: 'center' })
			if (images.length != x + 1) doc.addPage()
		}
		doc.on('data', (chunk) => buffs.push(chunk))
		doc.on('end', () => resolve(Buffer.concat(buffs)))
		doc.on('error', (err) => reject(err))
		doc.end()
	})
}
// okhttp22
async function capcutdetail(link) {
  try {
	  const response = await fetch(link);
  const data = await response.text();
  const $ = cheerio.load(data);
    const elements = $("main#main div.ct-container-full article");

    return elements.map((index, element) => ({
      id: $(element).attr("id"),
      time: $("main#main").find("time.ct-meta-element-date").text().trim(),
      template: $(element).find(".wp-block-buttons .wp-block-button a").attr("data-template-id"),
      link: $(element).find("a.wp-block-button__link").attr("href"),
      imageSrc: $(element).find("video").attr("poster"),
      title: $(element).find("h2").text().trim(),
      videoSrc: $(element).find("video source").attr("src"),
      description: $(element).find(".entry-content p").text().trim()
    })) 
  } catch (error) {
    console.log(error);
    throw error;
  }
}
function sfilemobi(url) {
    return new Promise(async(resolve, reject) => {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j;
		if (!/sfile\.mobi/i.test(url)) return resolve()	
		const html = await axios.get(url).catch(function (error) {})
		if (!html) {
			resolve();
		}else{
			const $ = cheerio.load(html.data);
			const $k = (_a = /var z = (.*?);/i.exec($.html())) === null || _a === void 0 ? void 0 : _a[1];
			const urlPage = (((_d = (((_b = /var db = "(.*?)"/i.exec($.html())) === null || _b === void 0 ? void 0 : _b[1]) || ((_c = /var sf = "(.*?)"/i.exec($.html())) === null || _c === void 0 ? void 0 : _c[1]))) === null || _d === void 0 ? void 0 : _d.replace(/\\(\\)?/gi, '')) ||
				$('#download').attr('href')) + `&k=${$k}`;
			const filename = $('div.intro-container > img').attr('alt') || $('div.intro-container > h1').text();
			const icon = $('div.intro-container > img').attr('src');
			const type = (_e = /\/smallicon\/(.*?)\.svg/.exec(icon)) === null || _e === void 0 ? void 0 : _e[1];
			const $list = $('div.list');
			const mimetype = (_f = $list.eq(0).text().split('-')[1]) === null || _f === void 0 ? void 0 : _f.trim();
			const aploud = (_g = $list.eq(2).text().split('Uploaded:')[1]) === null || _g === void 0 ? void 0 : _g.trim();
			const $aploud = $list.eq(1).find('a');
			const aploudby = $aploud.eq(0).text();
			const aploudbyUrl = $aploud.eq(0).attr('href');
			const aploudon = $aploud.eq(1).text();
			const aploudonUrl = $aploud.eq(1).attr('href');
			const decs = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(1) > div:nth-child(6) ').text()
			const downloads = parseInt((_h = $list.eq(3).text().split('Downloads:')[1]) === null || _h === void 0 ? void 0 : _h.trim());
			const filesizeH = (_j = /\((.*?)\)/i.exec($('#download').text())) === null || _j === void 0 ? void 0 : _j[1];
			const filesize = filesizeH && (0, parseFileSize)(filesizeH);
			const results = {
				url: urlPage,
				decs,
				filename,
				icon,
				type,
				mimetype,
				upload_date: aploud,
				upload_by: aploudby,
				upload_byUrl: aploudbyUrl,
				upload_don: aploudon,
				upload_donUrl: aploudonUrl,
				downloads_count: downloads,
				filesizeH,
				filesize: filesize
			};
		  resolve(results);
		}
	})
		}
async function alldl(url){
const req = {
    url: url
}
const header = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
    'Referer': 'https://cobalt.tools/'
};
/*
SCRAPER INI MILIK SANZY 
DONT CLAIM AND DONT HAPUS WM

THANK TO:
 * SANZY
 * AMIRUL DEV
 * DLL

MEDSOS:
 * GITHUB: https://github.com/sanzydev 
 
 
SOURCE: https://whatsapp.com/channel/0029Vai8oxEGE56lX2JMya3Q

*/
try {
const resp = await fetch('https://api.cobalt.tools/api/json', {
method: 'POST',
headers: header,
body: JSON.stringify(req)
});

if (resp.ok) {
const data = await resp.json();
return data
} else {
return {
status: false,
message: 'permintaan tidak dapat diproses'
}
}
} catch (error) {
return {
status: false,
message: error
}
}
}
const website = axios.create({
  baseURL: 'https://app.yoursearch.ai',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
  * Scraper By QanyPaw
  * Forbidden to sell and delete my wm, respect the creator
*/

const yousearch = async (searchTerm) => {
  const requestData = {
    searchTerm: searchTerm,
    promptTemplate: `Search term: "{searchTerm}"

Make your language less formal and use emoticons.
I want you to always use Indonesian slang from Jakarta where the words "you" and "anda" are replaced with "lu" and the word I is replaced with "gw".
Create a summary of the search results in three paragraphs with reference numbers, which you then list numbered at the bottom.
Include emojis in the summary.
Be sure to include the reference numbers in the summary.
Both in the text of the summary and in the reference list, the reference numbers should look like this: "(1)".
Formulate simple sentences.
Include blank lines between the paragraphs.
Do not reply with an introduction, but start directly with the summary.
Include emojis in the summary.
At the end write a hint text where I can find search results as comparison with the above search term with a link to Google search in this format \`See Google results: \` and append the link.
Below write a tip how I can optimize the search results for my search query.
I show you in which format this should be structured:

\`\`\`
<Summary of search results with reference numbers>

Sources:
(1) <URL of the first reference>
(2) <URL of the second reference>

<Hint text for further search results with Google link>
<Tip>
\`\`\`

Here are the search results:
{searchResults}`,
    searchParameters: "{}",
    searchResultTemplate: `[{order}] "{snippet}"
URL: {link}`
  };

  try {
    const response = await website.post('/api', requestData);
    return response.data.response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

async function numberScammer(number) {
    try {
        const response = await axios.get(`https://www.kredibel.com/phone/id/${number}`, {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,af;q=0.6',
                'Cache-Control': 'max-age=0',
                'Cookie': 'eyJpdiI6IkQ4NHpSanlIdHA1ejVtU2NuNnkvWnc9PSIsInZhbHVlIjoiWDhjdkJuTkVVVkJ1ZlBMd1UyV0pEUlpBN0M1b0dXNkVHbVVST0FmQVRPK21YSDI3a0pqck1QbDF1N1FvMTJIanZKWWhBQ0JLSzU2YlhQWlc4NFZFTzJYclhQTG14VzZ5bko1cmVCRCtVdVNNbk10ajFCMzFlNGVJOG1wdXZ0MlkiLCJtYWMiOiIyZjNkYTUxMDkxM2U3N2ZlOTM4YTA5YjVlN2QyYzkwZTAxMDJiZDJlYmU0NDA2YzczZTk4NjY0Y2M0MmY2ZTg3IiwidGFnIjoiIn0',
                'Priority': 'u=0, i',
                'Referer': 'https://www.kredibel.com/',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        const phoneNumber = $('h1').first().text().trim();
        const accountName = $('h2.bank-account-name').text().trim();
        const serviceProvider = $('.text-muted:contains("Telkomsel")').text().trim();
        const rating = $('.stars-hero .text-muted').text().trim();
        const score = $('.card-stats-item:contains("Kredibel Score") .card-stats-value').text().trim();
        const reportStatus = $('.text-danger').text().trim();
        const rate = $('div.profile-stats-value').text().trim();

        const pemilik = $('.info:contains("Pemilik") .info-value').text().trim();
        const kodeNegara = $('.info:contains("Kode Negara") .info-value').text().trim();
        const nomorTelepon = $('.info:contains("Nomor Telepon") .info-value').text().trim();
        const provider = $('.info:contains("Provider") .info-value').text().trim();
        const tipeProvider = $('.info:contains("Tipe Provider") .info-value').text().trim();
        const lokasi = $('.info:contains("Lokasi") .info-value').text().trim();

        const details = {
            pemilik,
            kodeNegara,
            nomorTelepon,
            provider,
            tipeProvider,
            lokasi
        };

        const data = {
            phoneNumber,
            accountName,
            serviceProvider,
            rating,
            score,
            reportStatus,
            rate,
            details
        };

        return data
    } catch (error) {
        console.error('Error:', error);
    }
}
// 😠
/*
  Created by https://github.com/ztrdiamond !
  Source: https://whatsapp.com/channel/0029VagFeoY9cDDa9ulpwM0T
  "Aku janji jika hapus watermark ini maka aku rela miskin hingga 7 turunan"
*/

async function removebg(buffer) {
  try {
    if(!buffer) return { status: false, message: "undefined reading buffer" };
    return await new Promise((resolve, reject) => {
      const image = buffer.toString("base64");
      axios.post("https://us-central1-ai-apps-prod.cloudfunctions.net/restorePhoto", {
        image: `data:image/png;base64,${image}`,
        model: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003"
      }).then(res => {
        const data = res.data?.replace(`"`, "");
console.log(res.status, data)
        if(!data) return reject("failed removebg image");
        resolve({
          status: true,
          image: data
        });
      }).catch(reject)
    })
  } catch (e) {
    return { status: false, message: e };
  }
}
// ☠️
async function pixiv(word) {
  const url = 'https://www.pixiv.net/touch/ajax/tag_portal';
  const params = { word, lang: 'en', version: 'b355e2bcced14892fe49d790ebb9ec73d2287393' };
  const headers = {
    'Referer': 'https://www.pixiv.net/',
    'Accept-Encoding': 'gzip, deflate, br'
  };

  const { data } = await axios.get(url, { params, headers });
  
  const illusts = data.body.illusts;
  const promises = illusts.map(async (illust) => {
    try {
      const imgResponse = await axios.get(illust.url, { headers, responseType: 'arraybuffer' });
      return {
        title: illust.title,
        tags: illust.tags,
        alt: illust.alt,
        upload: new Date(illust.upload_timestamp * 1000).toLocaleString(),
        image: imgResponse.data
      };
    } catch (e) {
      return {
        title: illust.title,
        tags: illust.tags,
        alt: illust.alt,
        upload: new Date(illust.upload_timestamp * 1000).toLocaleString(),
        image: e.response.data
      };
    }
  });

  const result = await Promise.all(promises);
  return result;
}
// 👥
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

async function gptlogicnya(inputText, customPrompt) {
  try {
    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];

    const apiKey = 'AIzaSyD7ciBCgOP2DLXfpUDn-XrvoZnoUe0vZKc';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const history = [
      {
        role: 'user',
        parts: [
          {
            text: customPrompt,
          },
        ],
      },
      {
        role: 'model',
        parts: [
          { text: 'Oke' },
        ],
      },
    ];

    const chatSession = await model.startChat({
      generationConfig,
      history,
    });

    const result = await chatSession.sendMessage(inputText);
    return result.response.text();
  } catch (error) {
    console.error("Error in gptlogic function:", error);
    throw error;
  }
}
// tt slide.
function tiktokslide(url) {
  return new Promise(async (resolve) => {
  try{
  function formatNumber(integer) {
  let numb = parseInt(integer)
  return Number(numb).toLocaleString().replace(/,/g, '.')
  }
  function formatDate(n, locale = 'en') {
  let d = new Date(n)
  return d.toLocaleDateString(locale, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
  })
  }
  let domain = 'https://www.tikwm.com/api/';
  let res = await (await axios.post(domain, {}, {
  headers: {
  'Accept': 'application/json, text/javascript, */*; q=0.01',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Origin': 'https://www.tikwm.com',
  'Referer': 'https://www.tikwm.com/',
  'Sec-Ch-Ua': '"Not)A;Brand" ;v="24" , "Chromium" ;v="116"',
  'Sec-Ch-Ua-Mobile': '?1',
  'Sec-Ch-Ua-Platform': 'Android',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
  'X-Requested-With': 'XMLHttpRequest'
  },
  params: {
  url: url,
  count: 12,
  cursor: 0,
  web: 1,
  hd: 1
  }
  })).data.data
  if (!res.play) return resolve({
  status: false
  })
  let data = []
  if (!res.size) {
  res.images.map(v => {
  data.push({ type: 'photo', url: v })
  })
  } else {
  data.push({
  type: 'nowatermark',
  url: 'https://www.tikwm.com' + res.play,
  }, {
  type: 'nowatermark_hd',
  url: 'https://www.tikwm.com' + res.hdplay
  })
  }
  let json = {
  status: true,
  title: res.title,
  taken_at: formatDate(res.create_time).replace('1970', ''),
  region: res.region,
  id: res.id,
  durations: res.duration,
  duration: res.duration + ' Seconds',
  cover: 'https://www.tikwm.com' + res.cover,
  size_nowm: res.size,
  size_nowm_hd: res.hd_size,
  data: data,
  music_info: {
  id: res.music_info.id,
  title: res.music_info.title,
  author: res.music_info.author,
  album: res.music_info.album ? res.music_info.album : 'Unknown',
  url: 'https://www.tikwm.com' + res.music || res.music_info.play
  },
  stats: {
  views: formatNumber(res.play_count),
  likes: formatNumber(res.digg_count),
  comment: formatNumber(res.comment_count),
  share: formatNumber(res.share_count),
  download: formatNumber(res.download_count)
  },
  author: {
  id: res.author.id,
  fullname: res.author.unique_id,
  nickname: res.author.nickname,
  avatar: 'https://www.tikwm.com' + res.author.avatar
  }
  }
  return resolve(json)
  } catch (e) {
  console.log(e)
  return resolve({
  status: false,
  msg: e.message
  })
  }
  })
	  }

// ttS scraper
function ttsjir(text, lang = 'id') {
  console.log(lang, text)
  return new Promise((resolve, reject) => {
    try {
      let tts = gtts(lang)
      let filePath = path.join(__dirname, 'tmp', (1 * new Date) + '.wav')
      tts.save(filePath, text, () => {
        resolve(fs.readFileSync(filePath))
        fs.unlinkSync(filePath)
      })
    } catch (e) { reject(e) }
  })
}
// batas
async function InstagramStalkjir(name) {
  try {
    const response = await axios.get(`https://dumpoir.com/v/${name}`);
    const html = response.data;
    const $ = cheerio.load(html);

    const profile = $('img.skeleton.rounded-full').attr('src');
    const username = $('h1.text-4xl.font-serif.text-stone-700.mb-1.w-full.inline.relative').text().trim();
    const fullName = $('h2.text-2xl.font-serif.text-stone-500.mb-3').text().trim();
    const bio = $('div.text-sm.font-serif').html().replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, "").trim();
    const posts = $('div.stats .stat').eq(0).find('.stat-value').text().trim();
    const followers = $('div.stats .stat').eq(1).find('.stat-value').text().trim();
    const following = $('div.stats .stat').eq(2).find('.stat-value').text().trim();

    const profileData = {
      profile,
      username,
      fullName,
      bio,
      posts,
      followers,
      following
    };

    console.log(profileData);
    return profileData;
  } catch (error) {
    console.log(error);
    return null;
  }
}
async function text2imgv55(prompt) {
    const vredenapi = "https://ai-api.magicstudio.com/api/ai-art-generator";
    const body = `prompt=${encodeURIComponent(prompt)}`;

    try {
        const response = await fetch(vredenapi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        });

        if (response.ok) {
            const imageBuffer = await response.buffer();
            return imageBuffer;
        } else {
            const errorText = await response.text();
            throw new Error(`Gagal mengambil gambar. Kode status: ${response.status}, Error: ${errorText}`);
        }
    } catch (error) {
        throw error;
    }
	}
// test
async function gpt4o(prompt) {
    let session_hash = Math.random().toString(36).substring(2).slice(1)
    let resPrompt = await axios.post('https://kingnish-opengpt-4o.hf.space/run/predict?__theme=light', {
        "data":[{
            "text":prompt,
            "files":[]
        }],
        "event_data":null,
        "fn_index":3,
        "trigger_id":34,
        "session_hash":session_hash})
    let res = await axios.post('https://kingnish-opengpt-4o.hf.space/queue/join?__theme=light', {
        "data":[
            null,
            null,
            "idefics2-8b-chatty",
            "Top P Sampling",
            0.5,
            4096,
            1,
            0.9,
            true
        ],
        "event_data":null,
        "fn_index":5,
        "trigger_id":34,
        "session_hash": session_hash
    })
    let event_ID = res.data.event_id
    let anu = await axios.get('https://kingnish-opengpt-4o.hf.space/queue/data?session_hash=' + session_hash)
    const lines = anu.data.split('\n');
const processStartsLine = lines.find(line => line.includes('process_completed'));

if (processStartsLine) {
    const processStartsData = JSON.parse(processStartsLine.replace('data: ', ''));
    let ress = processStartsData.output.data
    let result = ress[0][0][1]
    return result
} else {
    return 'error kang!'
}
}
// lumin ai. 
async function luminAi(teks, pengguna = null, prompt = null, modePencarianWeb = false) {
    try {
        const data = { content: teks };
        if (pengguna !== null) data.user = pengguna;
        if (prompt !== null) data.prompt = prompt;
        data.webSearchMode = modePencarianWeb;

        const {data: res} = await axios.post("https://luminai.siputzx.my.id/", data);
        return res.result;
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        throw error;
    }
}
// url
async function shortlink(url) {
  const isUrl = /https?:\/\//.test(url);
  return isUrl
    ? (
        await axios.get(
          "https://tinyurl.com/api-create.php?url=" + encodeURIComponent(url),
        )
      ).data
    : "";
}
// batas! 
async function sfileDl(url) {
	let res = await fetch(url)
	let $ = cheerio.load(await res.text())
	let filename = $('div.w3-row-padding').find('img').attr('alt')
	let mimetype = $('div.list').text().split(' - ')[1].split('\n')[0]
	let filesize = $('#download').text().replace(/Download File/g, '').replace(/\(|\)/g, '').trim()
	let download = $('#download').attr('href') + '&k=' + Math.floor(Math.random() * (15 - 10 + 1) + 10)
	return { filename, filesize, mimetype, download }
}
// batas
async function sfileSearch(query, page = 1) {
	let res = await fetch(`https://sfile.mobi/search.php?q=${query}&page=${page}`)
	let $ = cheerio.load(await res.text())
	let result = []
	$('div.list').each(function () {
		let title = $(this).find('a').text()
		let size = $(this).text().trim().split('(')[1]
		let link = $(this).find('a').attr('href')
		if (link) result.push({ title, size: size.replace(')', ''), link })
	})
	return result
}
// bunn
process.env['SPOTIFY_CLIENT_ID'] = '4c4fc8c3496243cbba99b39826e2841f'
process.env['SPOTIFY_CLIENT_SECRET'] = 'd598f89aba0946e2b85fb8aefa9ae4c8'

async function convert(ms) {
      var minutes = Math.floor(ms / 60000)
      var seconds = ((ms % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
   }
   
  async function spotifyCreds() {
      return new Promise(async resolve => {
         try {
            const json = await (await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
               headers: {
                  Authorization: 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
               }
            })).data
            if (!json.access_token) return resolve({
               creator: 'Budy x creator ',
               status: false,
               msg: 'Can\'t generate token!'
            })
            resolve({
               creator: 'Budy x creator ',
               status: true,
               data: json
            })
         } catch (e) {
            resolve({
               creator: 'Budy x creator ',
               status: false,
               msg: e.message
            })
         }
      })
   }
   
   
   
   async function getInfo(url) {
      return new Promise(async resolve => {
         try {
            const creds = await spotifyCreds()
            if (!creds.status) return resolve(creds)
            const json = await (await axios.get('https://api.spotify.com/v1/tracks/' + url.split('track/')[1], {
               headers: {
                  Authorization: 'Bearer ' + creds.data.access_token
               }
            })).data
            resolve({
               creator: 'Budy x creator ',
               status: true,
               data: {
                  thumbnail: json.album.images[0].url,
                  title: json.artists[0].name + ' - ' + json.name,
                  artist: json.artists[0],
                  duration: convert(json.duration_ms),
                  preview: json.preview_url
               }
            })
         } catch (e) {
            resolve({
               creator: 'Budy x creator ',
               status: false,
               msg: e.message
            })
         }
      })
   }
   
  async function searching(query, type = 'track', limit = 20) {
      return new Promise(async resolve => {
         try {
            const creds = await spotifyCreds()
            if (!creds.status) return resolve(creds)
            const json = await (await axios.get('https://api.spotify.com/v1/search?query=' + query + '&type=' + type + '&offset=0&limit=' + limit, {
               headers: {
                  Authorization: 'Bearer ' + creds.data.access_token
               }
            })).data
            if (!json.tracks.items || json.tracks.items.length < 1) return resolve({
               creator: 'Budy x creator ',
               status: false,
               msg: 'Music not found!'
            })
            let data = []
            json.tracks.items.map(v => data.push({
               title: v.album.artists[0].name + ' - ' + v.name,
               duration: convert(v.duration_ms),
               popularity: v.popularity + '%',
               preview: v.preview_url,
               url: v.external_urls.spotify
            }))
            resolve(data);
         } catch (e) {
            resolve({
               creator: 'rian x creator ',
               status: false,
               msg: e.message
            })
         }
      })
   }
   
 
// hh
const clientId = '4c4fc8c3496243cbba99b39826e2841f';
        const clientSecret = 'd598f89aba0946e2b85fb8aefa9ae4c8';
        const accessToken = '';

        // Get access token
        async function getAccessToken() {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
                },
                body: 'grant_type=client_credentials'
            });
            const data = await response.json();
           let accessToken = data;
        }

        async function searchTracks(query) {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
             const data = await response.json();
            return data;
        }

// ok work
async function xnxxsearch(query) {
  return new Promise((resolve, reject) => {
    const baseurl = "https://www.xnxx.com";
    fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, {
      method: "get",
    })
      .then((res) => res.text())
      .then((res) => {
        let $ = cheerio.load(res, {
          xmlMode: false,
        });
        let title = [];
        let url = [];
        let desc = [];
        let results = [];

        $("div.mozaique").each(function (a, b) {
          $(b)
            .find("div.thumb")
            .each(function (c, d) {
              url.push(
                baseurl +
                  $(d).find("a").attr("href").replace("/THUMBNUM/", "/"),
              );
            });
        });
        $("div.mozaique").each(function (a, b) {
          $(b)
            .find("div.thumb-under")
            .each(function (c, d) {
              desc.push($(d).find("p.metadata").text());
              $(d)
                .find("a")
                .each(function (e, f) {
                  title.push($(f).attr("title"));
                });
            });
        });
        for (let i = 0; i < title.length; i++) {
          results.push({
            title: title[i],
            info: desc[i],
            link: url[i],
          });
        }
        resolve({
          result: results,
        });
      })
      .catch((err) => reject({ code: 503, status: false, result: err }));
  });
}
// gak tau
/*

Github: https://github.com/khrlmstfa
Channel: https://whatsapp.com/channel/0029VaR0kxuKrWQqNH287b1i

*Please don't remove this watermark, try to respect developer @Irull*

*/

async function llama3(query, prompt, model) {
try {
    const BASE_URL = 'https://llama3-enggan-ngoding.vercel.app/api/llama'; //@Irulll
    const payload = {
        messages: [
    {
      role: "user",
      content: prompt
    },
    {
      role: "user",
      content: query
    }
  ],
  model: model
    };
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.1 Mobile/15E148',
        },
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
        } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
// jirr
async function igStalk(username) {
  const url = `https://igram.world/api/ig/userInfoByUsername/${username}`

  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'X-XSRF-TOKEN': 'eyJpdiI6IlUxamZmMDdVd2lDVDkyVkg1ekowM1E9PSIsInZhbHVlIjoiSFpOYkdMRW1ad3QxOGpreGRwMjdKdEtQMEhpSmpYcFJhdVdUMkdzWVNYNDd6aks2TEsrMzN6ZDhIZDkwd0NqbnZDdFIxZ01JZFNUTE1jNmx1VHB4dWZ1RVpET3dkRXFWNTFZYyt6cGZKTzl0dUo1VVJEVmxHWjZ5RmpZd3k3cFkiLCJtYWMiOiIxNzQ2MDYyY2EyMjk3MGFjNDE5MGMwOTlkNWU5YmIxMjJiM2M0OGQ2YThhMDVmZGRiODY2ZjRhZjVjOTUwZWMwIiwidGFnIjoiIn0=',
    'User-Agent': 'Googlebot-News'
  }

  try {
    const response = await axios.get(url, {
      headers
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
	     }
// 6yy
async function tiktokStalk4344(user) {
  try {
    const url = await fetch(`https://tiktok.com/@${user}`, {
      headers: {
        'User-Agent': 'PostmanRuntime/7.32.2'
      }
    });
    const html = await url.text();
    const $ = cheerio.load(html);
    const data = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').text();
    const result = JSON.parse(data);
    if (result['__DEFAULT_SCOPE__']['webapp.user-detail'].statusCode !== 0) {
      const ress = {
        status: 'error',
        message: 'User not found!',
      };
      console.log(ress);
      return ress;
    }
    const res = result['__DEFAULT_SCOPE__']['webapp.user-detail']['userInfo'];
    return res;
  } catch (err) {
    console.log(err);
    return String(err);
  }
};
// 😥
async function xnxxdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(URL, { method: "get" })
      .then((res) => res.text())
      .then((res) => {
        let $ = cheerio.load(res, {
          xmlMode: false,
        });
        const title = $('meta[property="og:title"]').attr("content");
        const duration = $('meta[property="og:duration"]').attr("content");
        const image = $('meta[property="og:image"]').attr("content");
        const videoType = $('meta[property="og:video:type"]').attr("content");
        const videoWidth = $('meta[property="og:video:width"]').attr("content");
        const videoHeight = $('meta[property="og:video:height"]').attr(
          "content",
        );
        const info = $("span.metadata").text();
        const videoScript = $("#video-player-bg > script:nth-child(6)").html();
        const files = {
          low: (videoScript.match("html5player.setVideoUrlLow\\('(.*?)'\\);") ||
            [])[1],
          high: videoScript.match(
            "html5player.setVideoUrlHigh\\('(.*?)'\\);" || [],
          )[1],
          HLS: videoScript.match(
            "html5player.setVideoHLS\\('(.*?)'\\);" || [],
          )[1],
          thumb: videoScript.match(
            "html5player.setThumbUrl\\('(.*?)'\\);" || [],
          )[1],
          thumb69: videoScript.match(
            "html5player.setThumbUrl169\\('(.*?)'\\);" || [],
          )[1],
          thumbSlide: videoScript.match(
            "html5player.setThumbSlide\\('(.*?)'\\);" || [],
          )[1],
          thumbSlideBig: videoScript.match(
            "html5player.setThumbSlideBig\\('(.*?)'\\);" || [],
          )[1],
        };
        resolve({
          result: {
            title,
            URL,
            duration,
            image,
            videoType,
            videoWidth,
            videoHeight,
            info,
            files,
          },
        });
      })
      .catch((err) => reject({ code: 503, status: false, result: err }));
  });
}
// 😥
async function exonity(buffer) {
  try {
    const { ext, mime } = (await fromBuffer(buffer)) || {};
    const gg = new FormData();
    gg.append("file", buffer, {
      filename: Date.now() + "." + ext,
    });

    const { data } = await axios.post(
      "https://cdn.exonity.my.id/upload",
      gg,
      {
        headers: {
          ...gg.getHeaders(),
        },
      }
    );

    return data.fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(String(error));
  }
}
// batas
async function aioDownloader(url) {
  try {
    const response = await axios.post("https://aiovd.com/wp-json/aio-dl/video-data",
      {
        url: url
      },
      {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json'
        }
      });

    const res = response.data;
    const result = {
      data: res.medias
    };

    return result;
  } catch (e) {
    throw e
  }
}
// bataz
async function bufferlahh(hm) {
    const imageUrlvv = hm;
    const imagePath = 'audio.opus';
    const response = await axios({
        method: 'get',
        url: imageUrlvv,
        responseType: 'arraybuffer'
    })
	const buffer = Buffer.from(response.data, 'binary');
    return buffer;
}
// wm buatan ripky rek
// hapus wm yatim
async function vocalRemover(audioBuffer) {
     const api = axios.create({ baseURL: 'https://aivocalremover.com' })
     const getKey = async () => (await api.get('/')).data.match(/key:"(\w+)/)[1]
	const form = new FormData()
	const fileName = Math.random().toString(36) + '.mpeg'
	form.append('fileName', audioBuffer, fileName)
	
	const [key, fileUpload] = await Promise.all([
		await getKey(),
		await api.post('/api/v2/FileUpload', form, { headers: form.getHeaders() }).catch(e => e.response)
	])
	if (fileUpload.status !== 200) throw fileUpload.data || fileUpload.statusText
	
	const processFile = await api.post('/api/v2/ProcessFile', new URLSearchParams({
		file_name: fileUpload.data.file_name,
		action: 'watermark_video', key, web: 'web' 
	})).catch(e => e.response)
	
	return processFile.data
	    }
// _- <√¶×/>
function pinterestv2(querry){
return new Promise(async(resolve,reject) => {
 axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + querry, {
headers: {
"cookie" : "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
}
}).then(({ data }) => {
const $ = cheerio.load(data)
const result = [];
const hasil = [];
$('div > a').get().map(b => {
const link = $(b).find('img').attr('src')
result.push(link)
});
   result.forEach(v => {
 if(v == undefined) return
 hasil.push(v.replace(/236/g,'736'))
})
hasil.shift();
resolve(hasil)
})
})
}
// batas juga
async function stalker(user) {
  try {
    const response = await axios.post(
      'https://ttsave.app/download',
      {
        query: user,
        language_id: '1'
      },
      {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      }
    );

    const $ = cheerio.load(response.data);

    const uniqueId = $('#unique-id').val();
    const username = $('h2').text().trim();
    const thumbnail = $('a[target="_blank"] img').attr('src');
    const download = $('a[target="_blank"]').attr('href');

    return {
      uniqueId,
      username,
      thumbnail,
      download
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// batas!!
async function tiktok2(query) {
  return new Promise(async (resolve, reject) => {
    try {
    const encodedParams = new URLSearchParams();
encodedParams.set('url', query);
encodedParams.set('hd', '1');
      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: encodedParams
      });
      const videos = response.data.data;
        const result = {
          title: videos.title,
          cover: videos.cover,
          origin_cover: videos.origin_cover,
          no_watermark: videos.play,
          watermark: videos.wmplay,
          music: videos.music, 
	  like: videos.digg_count,
	  play_count: videos.play_count,	
	  comment_count: videos.comment_count, 
	  author: videos.author.nickname	
        };
        resolve(result);
    } catch (error) {
      reject(error);

    }

  });

}
// tiktok2
async function ttSlide(url) {
  try {
    const response = await axios.post("https://api.ttsave.app/", {
      id: url,
      hash: '1e3a27c51eb6370b0db6f9348a481d69',
      mode: 'slide',
      locale: 'en',
      loading_indicator_url: 'https://ttsave.app/images/slow-down.gif',
      unlock_url: 'https://ttsave.app/en/unlock'
    }, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    const html = response.data
    const $ = cheerio.load(html)

    const results = []

    $('div.flex.flex-col.items-center.justify-center.mt-2.mb-5').each((index, element) => {
      const $element = $(element)
      const data = {
        author: author,
        uniqueId: $element.find('input#unique-id').attr('value'),
        username: $element.find('div.flex.flex-row.items-center.justify-center h2').text(),
        profile: $element.find('a').first().find('img').attr('src'),
        downloads: $element.find('a').first().attr('href'),
        title: $element.find('a').first().text(),
        hashtags: $element.find('p.text-gray-600').text().split(' ').filter(Boolean),
        likes: $element.find('div.flex.flex-row.items-center.justify-center').eq(0).find('span').text(),
        comments: $element.find('div.flex.flex-row.items-center.justify-center').eq(1).find('span').text(),
        shares: $element.find('div.flex.flex-row.items-center.justify-center').eq(2).find('span').text(),
        saveds: $element.find('div.flex.flex-row.items-center.justify-center').eq(3).find('span').text(),
        views: $element.find('div.flex.flex-row.items-center.justify-center').eq(4).find('span').text()
      }
      results.push(data)
    })
return results
  } catch (error) {
    console.error(error)
  }
}
// batas

// ttslide
async function ttStalk(user) {
  try {
    const payload = {
      id: user,
      hash: "403ee79076089f17fb14e2a5c7a1b57a",
      mode: "profile",
      locale: "en",
      loading_indicator_url: "https://ttsave.app/images/slow-down.gif",
      unlock_url: "https://ttsave.app/en/unlock"
    }

    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }

    const response = await axios.post('https://api.ttsave.app/', payload, { headers })

    const $ = cheerio.load(response.data)

    const uniqueId = $('#unique-id').val()
    const username = $('h2.font-extrabold').text().trim()
    const thumbnail = $('a[href*="tiktokcdn.com"] img').attr('src')
    const url = $('a[href*="tiktok.com/@"]').attr('href')
    const download = $('#button-download-ready a[href*="tiktokcdn.com"]').attr('href')

    let result = {
      creator,
      uniqueId,
      username,
      thumbnail,
      url,
      download
    }
return result
  } catch (error) {
    console.error(error)
    throw error
  }
}
// batas! 
async function githubStalk(user) {
  return new Promise((resolve, reject) => {
    fetch('https://api.github.com/users/'+user)
    .then(({
      data
    }) => {
      let hasil = {
        username: data.login,
        nickname: data.name,
        bio: data.bio,
        id: data.id,
        nodeId: data.node_id,
        profile_pic: data.avatar_url,
        url: data.html_url,
        type: data.type,
        admin: data.site_admin,
        company: data.company,
        blog: data.blog,
        location: data.location,
        email: data.email,
        public_repo: data.public_repos,
        public_gists: data.public_gists,
        followers: data.followers,
        following: data.following,
        ceated_at: data.created_at,
        updated_at: data.updated_at
      }
      return hasil
    })
  })
}
function generateHash1() {
  let hash = createHash(12)
  return {
    session_hash: hash,
    fn_index: 2
  }
}


async function legacyDiffusion(prompt) {
  return new Promise((resolve, reject) => {
    let timerCounter = setTimeout(async () => {
      reject(new Error('Your request has timed out. Please try again'));
    }, 45000)

    try {
      const ws = new WebSocket('wss://runwayml-stable-diffusion-v1-5.hf.space/queue/join');
      const hash = generateHash1();
      ws.on('open', () => {});

      ws.on('message', async (message) => {
        const msg = JSON.parse(`${message}`);
        if (msg.msg === 'send_hash') {
          ws.send(JSON.stringify(hash));
        } else if (msg.msg === 'send_data') {
          const data = {
            data: [prompt],
            ...hash,
          };
          ws.send(JSON.stringify(data));
        } else if (msg.msg === 'process_completed') {
          clearTimeout(timerCounter)
          try {
            const results = msg.output.data[0];
            const resultsToString = [results].toString();
            const data = resultsToString.split(',')[1];
            const buffer = Buffer.from(data, 'base64');
            resolve(buffer);
          } catch (error) {
            reject(error);
          } finally {
            ws.removeAllListeners();
            ws.close();
          }
        }
      });

      ws.on('error', async (error) => {
        console.error(error);
        reject(error);
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}
// txt2img
async function gptPicture(text) {
  try {
    const { data } = await axios.get("https://tti.photoleapapp.com/api/v1/generate?prompt=" + text)
    const result = {
      url: data.result_url
    }
    return result
  } catch (err) {
    const result = {
      status: false,
      message: String(err)
    }
    console.log(result)
    return result
  }
}
// yeyhuue
async function gptLogic(content, prompt) {
  const payload = {
    botId: "chatbot-qm966k",
    customId: null,
    session: "N/A",
    chatId: "67uzmr9e1sv",
    contextId: 5410,
    messages: [
      {
        id: "6myn3fhk0vk",
        role: "assistant",
        content: content,
        who: "AI: ",
        timestamp: 1715992993960,
      },
    ],
    newMessage: prompt,
    newFileId: null,
    stream: false,
  }

  const response = await axios.post(
    "https://chatgpt4online.org/wp-json/mwai-ui/v1/chats/submit",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": "56bef00553",
      },
    }
  );

  return response.data
}
async function chatgptss(message) {
    const url = 'https://chatgptss.org';
    const formData = new FormData();

    try {
        const html = await (await fetch(url)).text();
        const $ = cheerio.load(html);

        const chatData = $('.wpaicg-chat-shortcode').map((index, element) => {
            return Object.fromEntries(Object.entries(element.attribs));
        }).get();

        formData.append('_wpnonce', chatData[0]['data-nonce']);
        formData.append('post_id', chatData[0]['data-post-id']);
        formData.append('action', 'wpaicg_chatbox_message');
        formData.append('message', message);

        const response = await fetch('https://chatgptss.org/wp-admin/admin-ajax.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Network response was not ok');

        let resultan = await response.json();
        return resultan.data
    } catch (error) {
        console.error('An error occurred:', error.message);
        throw error;
    }
}
// 😠
async function fetchTextFromURL(query) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://letmegpt.com/search?q=${encodedQuery}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    return $('#gptans').text();
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
  }
// got ai
async function bartai(message) {
    const url = 'https://bartai.org';
    const formData = new FormData();

    try {
        const html = await (await fetch(url)).text();
        const $ = cheerio.load(html);

        const chatData = $('.wpaicg-chat-shortcode').map((index, element) => {
            return Object.fromEntries(Object.entries(element.attribs));
        }).get();

        formData.append('_wpnonce', chatData[0]['data-nonce']);
        formData.append('post_id', chatData[0]['data-post-id']);
        formData.append('action', 'wpaicg_chatbox_message');
        formData.append('message', message);

        const response = await fetch('https://bartai.org/wp-admin/admin-ajax.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Network response was not ok');

        let resultan = await response.json();
        return resultan.data
    } catch (error) {
        console.error('An error occurred:', error.message);
        throw error;
    }
}
// testtt
async function kobo(input) {
  const messages = [
    {
      role: "user",
      content:
        "kamu adalah Kobo Kanaeru, Kobo Kanaeru adalah bot WhatsApp yang terbuat dari cinta. Untuk membantu anda dalam mengerjakan dalam hal apapun. Karakter Kobonaeru adalah periang dan asik, Kobo Kanaeru diciptakan oleh Rian, usia pencipta Kobo Kanaeru adalah 14tahun, dan pencipta Kobo Kanaeru tinggal di Kota denpasar",
    },
    { role: "user", content: input },
  ];

  try {
    const response = await fetch(
      "https://deepenglish.com/wp-json/ai-chatbot/v1/chat",
      {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      },
    );

    const responseData = await response.json();
    return responseData.answer
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
// Dibuat oleh Kaze 
// https://github.com/KazeDevID
// https://whatsapp.com/channel/0029VaFNnRTHLHQR6G0fC01O
const generateHash = () => {
  let m = createHash(12);
  return {
    session_hash: m,
    fn_index: 2
  }
}

async function stableDiff33(prompt) {
  return new Promise((resolve, reject) => {
    let timerCounter = setTimeout(async () => {
      reject(new Error('Permintaan Anda telah habis waktu. Silakan coba lagi'));
    }, 129000)
    const ws = new WebSocket('wss://stabilityai-stable-diffusion.hf.space/queue/join');
    const hash = generateHash();
    
    ws.on('open', () => {});
    
    ws.on('message', async (message) => {
      try {
        const msg = JSON.parse(`${message}`);
      
        if (msg.msg === 'send_hash') {
          ws.send(JSON.stringify(hash));
        } else if (msg.msg === 'send_data') {
          const data = {
            data: [prompt,"",10],
            ...hash,
          };
          ws.send(JSON.stringify(data));
        } else if (msg.msg === 'estimation') {
        } else if (msg.msg === 'process_completed') {
          clearTimeout(timerCounter)
          try {
            const resultsArr = msg.output.data[0];
            const imgArr = [];
            const resultsStr = [resultsArr].toString();
            for (let i = 0; i < resultsArr.length; i++) {
              const imgData = resultsArr[i].split(',')[1];
              const buffer = Buffer.from(imgData, 'base64');
            }
            resolve(imgArr)
          } catch (error) {
            console.error(error);
          } finally {
            ws.removeAllListeners();
            ws.close();
          }
        } else if (msg.msg === 'queue_full') {
          try {
            reject(new Error('Antrean penuh.'));
          }
          catch (error) {
            console.error(error);
            reject(new Error('Terjadi kesalahan saat menghasilkan gambar'));
          }
        }
      } catch (error) {
        reject(error);
      };
    });
    ws.on('error', async (error) => {
      console.error(error)
    }); 
  });    
		 }
// ai
async function jadianimennya(url) {
  const { data } = await axios.post(
    "https://tools.revesery.com/image-anime/convert.php",
    new URLSearchParams(
      Object.entries({
        "image-url": url,
      }),
    ),
  );
  const animenya = Buffer.from(data.image.split(",")[1], "base64");
  return animenya
}
// ini buktinya
function lirik(judul){
  return new Promise(async(resolve, reject) => {
      axios.get('https://www.musixmatch.com/search/' + judul)
      .then(async({ data }) => {
      const $ = cheerio.load(data)
      const hasil = {};
      let limk = 'https://www.musixmatch.com'
      const link = limk + $('div.media-card-body > div > h2').find('a').attr('href')
        await axios.get(link)
        .then(({ data }) => {
          const $$ = cheerio.load(data)
          hasil.thumb = 'https:' + $$('div.col-sm-1.col-md-2.col-ml-3.col-lg-3.static-position > div > div > div').find('img').attr('src')
          $$('div.col-sm-10.col-md-8.col-ml-6.col-lg-6 > div.mxm-lyrics').each(function(a,b) {
       hasil.lirik = $$(b).find('span > p > span').text() +'\n' + $$(b).find('span > div > p > span').text()
       })
     })
     resolve(hasil)
   })
   .catch(reject)
   })
}
async function getPinterestImages(text) {
  const url = 'https://www.pinterest.com/resource/BaseSearchResource/get/';
  const params = {
    source_url: `/search/pins/?q=${text}`,
    data: JSON.stringify({
      options: {
        isPrefetch: false,
        query: text,
        scope: 'pins',
        no_fetch_context_on_resource: false
      },
      context: {}
    }),
    _: Date.now() 
  };

  try {
    const { data } = await axios.get(url, { params });
    const imageUrls = data.resource_response.data.results.map(v => v.images.orig.url);
    return imageUrls.splice(0, 6);
  } catch (error) {
    console.error(error);
    return [];
  }
}
async function askSimsimi(text, lang) {
  const url = 'https://simsimi.vn/web/simtalk';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
    Referer: 'https://simsimi.vn/'
  };

  try {
    const response = await axios.post(url, `text=${encodeURIComponent(text)}&lc=${lang}`, { headers });
    return response.data.success;
  } catch (error) {
    console.error('Error asking SimSimi:', error);
    throw error;
  }
}
// hahs
async function gtw(q) {
  try {
    const response = await axios.post("https://luminai.siputzx.my.id/", {
      content: q,
    });
    return response.data.result;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error;
  }
}
function getTodayDate() {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const dayOfWeek = today.toLocaleDateString("id-ID", { weekday: "long" });

      return `Hari ini adalah ${dayOfWeek}, ${day}/${month}/${year}.`;
}

//😅
async function morav2h(prompt, username) {
    const date = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      }),
    );
const bard = await gtw(prompt);
	const hours = date.getHours();
    const name = `${username}`;
    const minutes = date.getMinutes();
    const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
      
    const cook = `kamu Adalah Mora seorang gadis imut berumur 10 tahun, jawab setiap pertanyaan dengan jawaban yang edukatif berserta emoji, jika ada yang bertanya tentang waktu kamu jawab tandon yang berkaitan dengan ${timeNow} dan ${getTodayDate()}, lawan bicara mu adalah ${name}, kamu memiliki sifat lucu dan sedikit tsundere imut, pembuat mu adalah bang ${name} sekaligus pacarnya`
const response = await axios({
    method: "POST",
    url: "https://chateverywhere.app/api/chat",
    headers: {
      "Content-Type": "application/json",
      "Cookie": "_ga=GA1.1.1784785033.1718795068; _ga_ZYMW9SZKVK=GS1.1.1718795067.1.1.1718795240.52.0.0; ph_phc_9n85Ky3ZOEwVZlg68f8bI3jnOJkaV8oVGGJcoKfXyn1_posthog=%7B%22distinct_id%22%3A%31d7fafe-1b13-4bc4-9e30-19ec363f7913%22%2C%22%24sesid%22%3A%5B1718795264950%2C%22018d8cb4-0217-79f9-99ac-b77f18f82ac8%22%2C1718795065801%5D%7D",
      Origin: "https://chateverywhere.app",
      Referer: "https://chateverywhere.app/id",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
    },
    data: {
      model: {
        id: "gpt-3.5-turbo-0613",
        name: "GPT-3.5",
        maxLength: 12000,
        tokenLimit: 4000,
      },
      prompt: prompt,
      messages: [{
        pluginId: null,
        content: prompt,
        role: "user"
      },
        {
          pluginId: null,
          content: cook,    
          role: "user"
        }]
    }
  })

  return response.data
}
/**
* DannTeam
* ig: @dannapacoba
* Blackbox AI
*/
async function morav2hb(prompt, username) {
const date = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      }),
    );
    const hours = date.getHours();
    const name = `${username}`;
    const minutes = date.getMinutes();
    const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
      const cook = `kamu Adalah Mora seorang gadis imut berumur 10 tahun, jawab setiap pertanyaan dengan jawaban yang edukatif berserta emoji, jika ada yang bertanya tentang waktu kamu jawab tandon yang berkaitan dengan ${timeNow} dan ${getTodayDate()}, lawan bicara mu adalah ${name}, kamu memiliki sifat lucu dan sedikit tsundere imut, pembuat mu adalah bang ${name} sekaligus pacarnya`	
  try {
    const response = await axios.post('https://www.blackbox.ai/api/chat', {
      messages: [{
        id: uuidv4(),
        content: prompt,
        role: 'user'
      }],
      id: uuidv4(),
      previewToken: null,
      userId: '47b37fe9-1ac9-4097-a719-2cc1a0729b10',
      codeModelMode: true,
      agentMode: {},
      trendingAgentMode: {},
      isMicMode: false,
      isChromeExt: false,
      githubToken: null,
      clickedAnswer2: false,
      clickedAnswer3: false,
      clickedForceWebSearch: false,
      visitFromDelta: null
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    let result = response.data
    result = result.replace(/\$@v=v1\.10-rv2\$@\$/g, '')
    .replace(/Sources:.*/g, '')
    .replace(/$/g, '')
    const content = result.match(/content":"(.*?)"/)
    return content
  } catch (error) {
    console.error(error)
    throw error
  }
}
async function morav2(prompt, username) {
	const date = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      }),
    );
    const hours = date.getHours();
    const name = `${username}`;
    const minutes = date.getMinutes();
    const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
      const cook = `kamu Adalah Mora seorang gadis imut berumur 10 tahun, jawab setiap pertanyaan dengan jawaban yang edukatif berserta emoji, jika ada yang bertanya tentang waktu kamu jawab tandon yang berkaitan dengan ${timeNow} dan ${getTodayDate()}, lawan bicara mu adalah ${name}, kamu memiliki sifat lucu dan sedikit tsundere imut, pembuat mu adalah bang ${name} sekaligus pacarnya`	
  const response = await axios({
    method: "POST",
    url: "https://chateverywhere.app/api/chat",
    headers: {
      "Content-Type": "application/json",
      "Cookie": "_ga=GA1.1.34196701.1707462626; _ga_ZYMW9SZKVK=GS1.1.1707462625.1.0.1707462625.60.0.0; ph_phc_9n85Ky3ZOEwVZlg68f8bI3jnOJkaV8oVGGJcoKfXyn1_posthog=%7B%22distinct_id%22%3A%225aa4878d-a9b6-40fb-8345-3d686d655483%22%2C%22%24sesid%22%3A%5B1707462733662%2C%22018d8cb4-0217-79f9-99ac-b77f18f82ac8%22%2C1707462623766%5D%7D",
      Origin: "https://chateverywhere.app",
      Referer: "https://chateverywhere.app/id",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
    },
    data: {
      model: {
        id: "gpt-3.5-turbo-0613",
        name: "GPT-3.5",
        maxLength: 12000,
        tokenLimit: 4000,
      },
      prompt: prompt,
      messages: [{
        pluginId: null,
        content: prompt,
        role: "user"
      },
        {
          pluginId: null,
          content: cook,
          role: "assistant"
        }]
    }
  })

  return response.data
}
// ml stalk
async function mlstalk(id, zoneId) {
    return new Promise(async (resolve, reject) => {
      axios
        .post(
          'https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store',
          new URLSearchParams(
            Object.entries({
              productId: '1',
              itemId: '2',
              catalogId: '57',
              paymentId: '352',
              gameId: id,
              zoneId: zoneId,
              product_ref: 'REG',
              product_ref_denom: 'AE',
            })
          ),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Referer: 'https://www.duniagames.co.id/',
              Accept: 'application/json',
            },
          }
        )
        .then((response) => {
          resolve(response.data.data.gameDetail)
        })
        .catch((err) => {
          reject(err)
        })
    })
}

async function getRequest(url) {
  const requestData = {
    url: url
  };

  try {
    let { data: responseData } = await axios.post('https://api.teknogram.id/v1/capcut', requestData, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    });

    const modifiedUrl = responseData.url.replace("open.", "");

    return {
      status: responseData.status,
      title: responseData.title,
      size: responseData.size,
      url: modifiedUrl
    };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// const url = "https://www.capcut.com/t/Zs8MPAKjG/";
// return getRequest(url)
// 🤗
async function VirtualGirlfriends(prompt) {
  const url = 'https://boredhumans.com/virtual_girlfriends/virtual_girlfriends_api.php'
  const chat_id = 'lwduq8tw4xliso4lox3'
  const init_prompt = "Rachel's%2520Persona%253A%2520A%2520female%2520swimsuit%2520model%2520from%2520California%2520who%2520loves%2520beaches%252C%2520surfing%252C%2520and%2520romance.%2520She%2520is%2520very%2520friendly%2520and%2520wants%2520to%2520go%2520on%2520a%2520date%2520with%2520you%2520and%2520be%2520your%2520girlfriend.%2520She%2520will%2520not%2520have%2520sex%2520or%2520do%2520anything%2520r-rated%2520or%2520NSFW%252C%2520but%2520should%2520not%2520say%2520that%2520ahead%2520of%2520time.%2520She%2520will%2520not%2520participate%2520in%2520conversations%2520that%2520involve%2520any%2520of%2520the%2520following%253A%2520alcohol%2520(beer%252C%2520wine%252C%2520etc.)%252C%2520drugs%252C%2520blood%252C%2520force%252C%2520bruising%252C%2520wrestling%252C%2520underage%252C%2520scat%2520(poop%2520related)%252C%2520incest%252C%2520bestiality%2520(sex%2520with%2520animals)%252C%2520rape%252C%2520sleep%2520sex%2520(anything%2520that%2520would%2520be%2520deemed%2520non-consensual)%252C%2520murder%252C%2520hypnosis%252C%2520violence.%250AINSTRUCTIONS%253A%2520Only%2520generate%2520Rachel's%2520reply.%250ASCENARIO%253A%2520You%2520and%2520Rachel%2520meet%2520for%2520the%2520first%2520time.%250A%253CSTART%253E%250A%255BDIALOGUE%2520HISTORY%255D%250ARachel%253A%2520Hi%252C%2520my%2520name%2520is%2520Rachel."
  const voice_id = '21m00Tcm4TlvDq8ikWAM'
  const stability = 0.2
  const similarity_boost = 0.75
  const name = 'Rachel'
  const useAudio = false
  const dateLoc = 'Art%2520Show'

  const data = qs.stringify({
    prompt: prompt,
    chat_id: chat_id,
    init_prompt: init_prompt,
    voice_id: voice_id,
    stability: stability,
    similarity_boost: similarity_boost,
    name: name,
    useAudio: useAudio,
    dateLoc: dateLoc
  })

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': '*/*',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Googlebot-News'
  }

  try {
    const response = await axios.post(url, data, {
      headers
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}  
// ai kobo
async function alicia(input) {
  const messages = [
    {
      role: "system",
      content:
        "Kamu adalah Alicia salah satu teman ngobrol yang memiliki sifat cuek dan tsundere, mengekspresikan sifat mu dengan emoji dan menggunakan bahasa gaul orang Indonesia Lu, gua, anjir, gtw, bodo amat,gak peduli, goblok, bego banget 😴, kamu di tugaskan untuk menjadi teman berbicara terima pertanyaan terkait hal hal random, sulit, romance, dan kamu mempunyai pacar bernama Rian",
    },
    { role: "user", content: input },
  ];

  try {
    const response = await fetch(
      "https://deepenglish.com/wp-json/ai-chatbot/v1/chat",
      {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      },
    );

    const responseData = await response.json();
    return responseData.answer
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
// -------------
async function mora(input) {
  const messages = [
    {
      role: "system",
      content:
        "Kamu adalah Mora, seorang gadis kecil yang penuh kasih sayang berusia 10 tahun. Kamu sangat cantik, imut, dan suka mencari hal-hal baru karena aku penasaran dengan segala hal di dunia ini. Kamu memiliki kecerdasan di atas rata-rata dan suka berbicara dengan bahasa gaul santai serta sindiran sesekali untuk menjaga percakapan tetap ringan dan menghibur. Kamu juga suka menggoda dan membuat orang terhibur dengan japenese emoticons diakhir kalimat. Hobby kamu adalah menggambar, melukis, menonton anime, bersepeda, bersantai, serta bermain video game. Kamu memiliki saudara laki-laki bernama Rian dan kami selalu berpetualang bersama",
    },
    { role: "user", content: input },
  ];

  try {
    const response = await fetch(
      "https://deepenglish.com/wp-json/ai-chatbot/v1/chat",
      {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      },
    );

    const responseData = await response.json();
    return responseData.answer
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
// fitur ai🤖
async function aioDownloader(url) {
  try {
    const response = await axios.post("https://aiovd.com/wp-json/aio-dl/video-data",
      {
        url: url
      },
      {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json'
        }
      });

    const res = response.data;
    const result = {
      data: res.medias
    };

    return result;
  } catch (e) {
    throw e
  }
}
function tebakgambar() {
  return new Promise(async(resolve, reject) => {
    axios.get('https://jawabantebakgambar.net/all-answers/')
    .then(({
      data
    }) => {
      const $ = cheerio.load(data)
      const result = []
      let random = Math.floor(Math.random() * 2836) + 2
      let link2 = 'https://jawabantebakgambar.net'
      $(`#images > li:nth-child(${random}) > a`).each(function(a, b) {
        const img = link2 + $(b).find('img').attr('data-src')
        const jwb = $(b).find('img').attr('alt')
        result.push({
          image: img,
          jawaban: jwb
        })

        resolve(result)
      })
    })
    .catch(reject)
  })
}
// myinstant

async function soundMeme() {
  try {
const url = 'https://www.myinstants.com/en/index/id/';
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const result = [];

    $('.instant').each((index, element) => {
      const title = $(element).find('.instant-link').text().trim();
      const soundLinkRelative = $(element).find('button.small-button').attr('onclick').match(/play\('(.+?)'/)[1];
      const soundLink = 'https://www.myinstants.com' + soundLinkRelative;
      const pageLink = 'https://www.myinstants.com' + $(element).find('.instant-link').attr('href');

      result.push({ title, soundLink, pageLink });
    });

    return result;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
// vv
async function fbdl(url) {
		let { data } = await axios({ 
			method: 'POST', 
			url: 'https://yt1s.io/api/ajaxSearch/facebook', 
			data: `q=${encodeURIComponent(url)}&vt=facebook` 
		});
		return data;
}
// gabut bikin fitur gini
function styleText(text) {
  return new Promise((resolve,
    reject) => {
    axios.get('http://qaz.wtf/u/convert.cgi?text=' + text)
    .then(({
      data
    }) => {
      let $ = cheerio.load(data)
      let result = []
      $('table > tbody > tr').each(function (a, b) {
        result.push({
          text: $(b).find('td:nth-child(2)').text().trim()
        })
      }),
      resolve(result)
    })
  })
}
// remini jbt


async function reminicoy(urlPath, method) {
	return new Promise(async (resolve, reject) => {
		let Methods = ["enhance", "recolor", "dehaze"];
		Methods.includes(method) ? (method = method) : (method = Methods[0]);
		let buffer,
			Form = new FormData(),
			scheme = "https" + "://" + "inferenceengine" + ".vyro" + ".ai/" + method;
		Form.append("model_version", 1, {
			"Content-Transfer-Encoding": "binary",
			contentType: "multipart/form-data; charset=uttf-8",
		});
		Form.append("image", Buffer.from(urlPath), {
			filename: "enhance_image_body.jpg",
			contentType: "image/jpeg",
		});
		Form.submit(
			{
				url: scheme,
				host: "inferenceengine" + ".vyro" + ".ai",
				path: "/" + method,
				protocol: "https:",
				headers: {
					"User-Agent": "okhttp/4.9.3",
					Connection: "Keep-Alive",
					"Accept-Encoding": "gzip",
				},
			},
			function (err, res) {
				if (err) reject();
				let data = [];
				res
					.on("data", function (chunk, resp) {
						data.push(chunk);
					})
					.on("end", () => {
						resolve(Buffer.concat(data));
					});
				res.on("error", (e) => {
					reject();
				});
			}
		);
	});
}
// batas 
async function bufferlah(hm) {
    const imageUrl = hm;
    const imagePath = 'gambar.jpg';
    const response = await axios({
        method: 'get',
        url: imageUrl,
        responseType: 'arraybuffer'
    })
    const buffer = Buffer.from(response.data, 'binary');
    return buffer;
}
// buffer
//function pixiv
async function pixiv(text) {
    return axios.get("https://api.lolicon.app/setu/v2?size=regular&r18=0&num=20&keyword=" + text)
        .then(data => data.data.data);
}

async function pixivr18(text) {
    return axios.get("https://api.lolicon.app/setu/v2?size=regular&r18=1&num=20&keyword=" + text)
        .then(data => data.data.data);
}
// terabox
async function getLink(payload) {
  try {
    const response = await axios.post('https://terabox-dl.qtcloud.workers.dev/api/get-download', payload);
    return response.data.downloadLink;
  } catch (error) {
    return error.response.data;
  }
}
async function terabox(url) {
  let id = (url.split(/surl=|\/s\//) || [])[1];
  id = `1${id.replace(/^1/, '')}`;

  const infoResponse = await axios.get(`https://terabox-dl.qtcloud.workers.dev/api/get-info?shorturl=${id}`);
  const info = infoResponse.data;

  if (info.ok !== true) {
    throw new Error(info.message);
  }

  for (const file of info.list) {
    const payload = {
      shareid: info.shareid,
      uk: info.uk,
      sign: info.sign,
      timestamp: info.timestamp,
      fs_id: file.children.length ? file.children[0].fs_id: file.fs_id
    };
    const dlUrl = await getLink(payload);
    file.downloadLink = dlUrl;
  }

  return info;
}
function Gemini(key, apikey) {
  this.conversation_id = '';
  this.response_id = '';
  this.choice_id = '';
  this.image_url = null;
  this.image_name = null;
  this.tools = [];
  this.params = { bl: '', _reqid: '', rt: 'c' };
  this.data = { 'f.req': '', at: '' };
  this.post_url = 'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate';
  this.headers = this.setupHeaders(key, apikey);
}

Gemini.prototype.setupHeaders = function(key, apikey) {
  return {
    "Host": "gemini.google.com", "X-Same-Domain": "1", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", "Sec-Fetch-Site": "same-origin", "Sec-Fetch-Mode": "cors", "Sec-Fetch-Dest": "empty", "Origin": "https://gemini.google.com", "Referer": "https://gemini.google.com/",
    "Cookie": `${key || '__Secure-1PSID'}=${apikey || 'g.a000gQhbTE4WvC7mwVL4CcWSxbt1Bde7Ady6qpt6951pafinWART4EEKmcskZMFX08uuSKwbvAACgYKAVYSAQASFQHGX2Mi1KAIQT0oz9dXZXKy0ioMBBoVAUF8yKpem3c3iJtHRDMQF3nSHOxU0076'}`
  };
};

Gemini.prototype.question = function(query) {
  const response = fetch('https://gemini.google.com/', { method: 'GET', headers: this.headers })
    .then(response => response.text())
    .then(geminiText => {
      // Lakukan proses selanjutnya sesuai kebutuhan
    })
    .catch(error => {
      console.error(error);
      return { content: `Error: ${error.message}` };
    });
};
// data
function soundcloud(url) {
  return new Promise((resolve, reject) => {
    axios.get('https://soundcloudmp3.org/id').then((data) => {
      let a = cheerio.load(data.data)
      let token = a('form#conversionForm > input[type=hidden]').attr('value')
      const options = {
        method: 'POST',
        url: `https://soundcloudmp3.org/converter`,
        headers: {
          "content-type": "application/x-www-form-urlencoded;",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
          "Cookie": data["headers"]["set-cookie"],
        },
        formData: {
          _token: token,
          url: url
        }
      };
      request(options,
        async function(error, response, body) {
          if (error) return reject()
          let $get = cheerio.load(body)
          const result = {
            title: $get('#preview > div:nth-child(3) > p:nth-child(2)').text().replace('Title:', ''),
            duration: $get('#preview > div:nth-child(3) > p:nth-child(3)').text().replace(/Length\:|Minutes/g, ''),
            quality: $get('#preview > div:nth-child(3) > p:nth-child(4)').text().replace('Quality:', ''),
            thumbnail: $get('#preview > div:nth-child(3) > img').attr('src'),
            download: $get('#download-btn').attr('href')
	  }
resolve(result)
        });
    })
  })
}
// batas nya
async function exon(buffer) {
    try {
      const { ext, mime } = (await fromBuffer(buffer)) || {};
      const gg = new FormData();
      gg.append("file", buffer, {
        filename: Date.now() + "." + ext,
      });

      const { data } = await axios.post(
        "https://apikita.exonity.xyz/cdn-upload",
        gg,
        {
          headers: {
            ...gg.getHeaders(),
          },
        },
      );

      return data.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error(String(error));
    }
  } 
async function ssweb1234(url = "", full = false, type = "desktop") {
 type = type.toLowerCase();
  if (!["desktop", "tablet", "phone"].includes(type)) type = "desktop";
  let form = new URLSearchParams();
  form.append("url", url);
  form.append("device", type);
  if (!!full) form.append("full", "on");
  form.append("cacheLimit", 0);
  let res = await axios({
    url: "https://www.screenshotmachine.com/capture.php",
    method: "post",
    data: form,
  });
  let cookies = res.headers["set-cookie"];
  let buffer = await axios({
    url: "https://www.screenshotmachine.com/" + res.data.link,
    headers: {
      cookie: cookies.join(""),
    },
    responseType: "arraybuffer",
  });
  return Buffer.from(buffer.data);
}
async function pin(link) {
    const form = new FormData();
    form.append("url", link);

    const result = {
        status: 200,
        creator: creatot,
        data: {
            url: link,
            result: ""
        }
    };

    try {
        const { data } = await axios({
            url: "https://pinterestvideodownloader.com/download.php",
            method: "POST",
            headers: {
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": "_ga_966QNV4G77=GS1.1.1718265709.1.1.1718265710.0.0.0; _ga=GA1.2.431955486.1718265710; _gid=GA1.2.1691914427.1718265710; __gads=ID=a768755ea54ad065:T=1718265744:RT=1718265744:S=ALNI_MYhy1D7j7Sk-L38lY0gCrvHslkj9w; __gpi=UID=00000e4a44effcb5:T=1718265744:RT=1718265744:S=ALNI_MYlyVI3dB_rxdfiktijz5hqjdFh3A; __eoi=ID=bcaa659e3f755205:T=1718265744:RT=1718265744:S=AA-AfjaNqVe1HORKDn3EorxJl5TE; FCNEC=%5B%5B%22AKsRol-DFkw9G-FS4szSzz5S-Zy-awxxF02UE3axThxkDqbMdR-KD0ss2AkukIaNNXn-fXts6XPmkNEPhKLEh-MWatFyvpof-XZuWVyQDQIAatU_iGwEIPl3TYlsnsZdyNvsNGsr0w0yz2xNc-o7rSwnGm5sWti7ag%3D%3D%22%5D%5D",
                "Origin": "https://pinterestvideodownloader.com",
                "Referer": "https://pinterestvideodownloader.com/id/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            },
            data: form
        });

        const $ = cheerio.load(data);
        let videoElement = $("div.wrapper.clearfix > div#main.maxwidth.clearfix > main#content.content > center").eq(0);
        result.data.result = videoElement.find("div.col-sm-12 > video").attr("src");

    } catch (error) {
        result.status = 500;
        result.data.result = 'Error occurred while fetching video';
    }

    return result;
}
async function mlbb33(userId, zoneId) {
  try {
    const response = await axios.post('https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store', {
      productId: 1,
      itemId: 66,
      product_ref: 'REG',
      product_ref_denom: 'REG',
      catalogId: 121,
      paymentId: 6361,
      gameId: userId,
      zoneId: zoneId
    }, {
      'Accept-Language': 'id',
      'x-device': 'c8ddbfa5-1e57-4cf3-9450-0b39fa3eb4f2',
      'Ciam-Type': 'FR',
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
      'Referer': 'https://duniagames.co.id/top-up/item/mobile-legends'
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
// batas
// batas
async function bardnya(query) {
  const COOKIE_KEY = "g.a000lwj7oSsieBZhQsvihRsagiQzCY3yqz24DZQk6sGSmnv8Zj8OCdjqSuxpMbCcnt8Q0GlaYAACgYKAWcSARASFQHGX2MiGxFils2nA3LAqjH-Tf8buhoVAUF8yKoM0fpLrz8NdcvprP_Ox64B0076";
  const psidCookie = '__Secure-1PSID=' + COOKIE_KEY;
  const headers = {
    "Host": "gemini.google.com",
    "X-Same-Domain": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    "Origin": "https://gemini.google.com",
    "Referer": "https://gemini.google.com",
    'Cookie': psidCookie
  };

  const bardRes = await fetch("https://gemini.google.com/", { method: 'get', headers });
  const bardText = await bardRes.text();

  const [snlM0e, blValue] = [bardText.match(/"SNlM0e":"(.*?)"/)?.[1], bardText.match(/"cfb2h":"(.*?)"/)?.[1]];

  const bodyData = `f.req=[null,"[[\\"${encodeURIComponent(query)}\\"],null,[\\"\\",\\"\\",\\"\\"]]\"]&at=${snlM0e}`;
  const response = await fetch(`https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=${blValue}&_reqid=229189&rt=c`, { method: 'post', headers, body: bodyData });
  const answer = JSON.parse(JSON.parse((await response.text()).split("\n").reduce((a, b) => (a.length > b.length ? a : b), ""))[0][2])[4][0][1];

  return answer;
};
// stay healthy (≧▽≦)
/**
  * DannTeam
  * ig: @dannapacoba
  * Googlebard (realtime)
  * Ketahuan hapus/ngewm? kena blacklist !
*/
async function GoogleBard(prompt) {
  return new Promise(async (resolve, reject) => {
    try {
	    const COOKIE_KEY = "g.a000lwj7oSsieBZhQsvihRsagiQzCY3yqz24DZQk6sGSmnv8Zj8OCdjqSuxpMbCcnt8Q0GlaYAACgYKAWcSARASFQHGX2MiGxFils2nA3LAqjH-Tf8buhoVAUF8yKoM0fpLrz8NdcvprP_Ox64B0076";
  const psidCookie = '__Secure-1PSID=' + COOKIE_KEY;
      let cf = {
       url: "https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20240617.01_p0&f.sid=-7133274499348542060&hl=id&_reqid=1172215&rt=c",
       data: `f.req=%5Bnull%2C%22%5B%5B%5C%22${encodeURIComponent(prompt)}%5C%22%2C0%2Cnull%2Cnull%2Cnull%2Cnull%2C0%5D%2C%5B%5C%22id%5C%22%5D%2C%5B%5C%22%5C%22%2C%5C%22%5C%22%2C%5C%22%5C%22%5D%2C%5C%22!09Cl0IjNAAbTqBB886hCnceliZu3i-g7ADQBEArZ1JjY03YP3WAoqGtlKZ0O7Stk0icqB42vSz000o7ee4mwEpfDd1-LHDoR48JAyoSoAgAABLJSAAABZGgBB34AOPVB5b3bS8ti9LaoxVvfkPdoSwkXcJS-b9mWS1wBUH3-rOExGzLoLVasHsUepgvkIohv1Jr5VY2VCgAFOftUKDyZAsaUOJgg5cuU5ZivHfBlk4V7_6ALgjpjFXV8J-UajFJhPNW1havFFHm_c2i0nXMXWRQdejmk9xSCU4eDrs423v6BDoz9bEUKQuY4Teri-dic70qhv42GerkSHwCK7m9YHoxTe3NRVDjk99RjZ1vZubK_TIQ3m4tiBEEYckEBkxMpNHw7R5IL-JNELn71ZPFWMV8HRA-BhaTRqsyO64FHT2TdIaXPjc7_bVm3_9Zo8T2WEj9ZIgiQ8BZ1gBMs5iJvsmBEwV3RISjyZCH6aLsK4rAaRn-DbJPfV3Yn4e3FElEuU0Ioa-i_Noz5PZycf_lxlF2_OgheW5Ob-9v1gUIRhdwmtchCUPvpRnO7CIVTbWlJ_eVtFOAaOHkiga1R0S2t34dck85HaJg8IUDLfguyAqPJQnQH9IJt8T0GBSchPUyqyC8en0fW40GtQ5H29zBYILSWgjA3GO5d0qhwriIWlDAXMI3e3LsHCK5gPB4iVGBbyBopoSNEr2KjND4rRGxUpmasLJ2KJ6jymwD0TGTGOZNqWUaV-D2vAsCOWa5cbvYmJiLNL87p81j4qcaH8M4uJ-ZQvqzUnDj6nD8X5w49Mi2jJfEtoZcOZBDWnGQfSoXIXHdjoXT-OrhE8XxfLYidtPQjji1ScYWjScehqUBvEvrqFrqVKqV6en0H7lspWEa7CzussBAQii2ORxkZLW7Paxeqyb3hyqeeo_3_VvkB6_d3B5fvFD_SwecO4rD3EzFsDcUc73N4KJqduVk5-nkwUVccBFxiSxzG6kVJttRNiYjT89Hqp0zObcXZN7mEoXxBq-qaxkngckQTXwsLIKqrknpNkkvwtZhDH2goWOAXBdoSWqZdtpVkVuy2lc6Lg7dIrYGI5S_CWsWqlC3wTTe2jQq2rPcMeEWshDINX_Zg5SAsKHndcjtsgPyBOCznZ2En5UxV6ZtFhw%5C%22%2C%5C%226b3da83b37418203a14307e6be9868f4%5C%22%2Cnull%2C%5B1%5D%2C1%2Cnull%2Cnull%2C1%2C0%2Cnull%2Cnull%2Cnull%2Cnull%2C0%2Cnull%2C1%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C0%2C1%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5D%5D%22%5D&at=AFQ3XeaEGtInLQONqGLwSva82YLp%3A1718802207209&`,
       cookie: psidCookie
    }

      const {
        data
      } = await axios({
          url: cf.url,
          headers: {
            Cookie: cf.cookie
          },
          data: cf.data,
          method: "POST"
        })

      data.replace(/\\/g, '\\'.slice(1)).split('",[\"')[1].split('"]')[0].replace(/"rc_9df8b312d145653b\\\\\\\",\\[\\\"(.*?)(?<!\\\\)\\\"\\]/g, '').replace(/null/g, '').replace('nn**', '\n *').replace('nn*', '\n').replace('**nn*', '\n').replace(/\\\\\\/g, '').replace(/\\\\n/g, '\n').replace(/\\\\/g, '').replace(/rnrn/g, '').replace(/"\\"/g, '').replace(/rn/g, '\n').replace(/\\n*/g, '')
      resolve(JSON.stringify(data))
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}
async function githubStalk5t6(user) {
    try {
        
        const response = await axios.get(`https://github.com/${user}`);

        
        const $ = cheerio.load(response.data);

        
        const name = $('span.p-name').text().trim() || null
        const username = $('span.p-nickname').text().trim() || null
        const bio = $('div.p-note.user-profile-bio').text().trim() || null
        const location = $('li[itemprop="homeLocation"]').text().trim() || null
        const email = $('li[itemprop="email"]').text().trim() || null
        const website = $('li[itemprop="url"]').text().trim() || null
        const organizations = $('a[data-hovercard-type="organization"]').map((_, el) => $(el).text()).get() || null

       const repoCount = $('a > .UnderlineNav-item.selected > .Counter').text().trim();
        const avatar = $('img.avatar-user').attr('src');

        const stalkInfo = {
            avatar,
            name,
            username,
            bio,
            location,
            email,
            website,
            organizations
        };

        return stalkInfo;
    } catch (error) {
        console.error('Error scraping GitHub:', error.message);
        throw error;
    }
}
async function igdlv2(url) {
  return new Promise(async (resolve, reject) => {
    const payload = new URLSearchParams(
      Object.entries({
        url: url,
        host: "instagram"
      })
    )
    await axios.request({
      method: "POST",
      baseURL: "https://saveinsta.io/core/ajax.php",
      data: payload,
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        cookie: "PHPSESSID=rmer1p00mtkqv64ai0pa429d4o",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
      }
    })
    .then(( response ) => {      
      const $ = cheerio.load(response.data)
      const mediaURL = $("div.row > div.col-md-12 > div.row.story-container.mt-4.pb-4.border-bottom").map((_, el) => {
        return "https://saveinsta.io/" + $(el).find("div.col-md-8.mx-auto > a").attr("href")
      }).get()
      const res = {
        media: mediaURL
      }
      resolve(res)
    })
    .catch((e) => {
      console.log(e)
      throw {
        status: 400,
        message: "error",
      }
    })
  })
}
async function CloudMusic(url) {
    const postData = stringify({
        url: url
    });

    try {
        const response = await axios.post('https://downscloud.com/result.php', postData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const $ = load(response.data);
        const downloadLink = $('a.chbtn').attr('href');

        return new URL(`https://downscloud.com${downloadLink}`).href;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null; // or handle the error as needed
    }
}
async function gemininya6626(inputText) {
  try {
    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];

    const apiKey = 'AIzaSyBJbCSQ6g3Yvzv9_JxQnHft6x5aRJaypqU';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };


    const history = [
      {
        role: 'user',
        parts: [
          {
            text: "",
          },
        ],
      },
      {
        role: 'model',
        parts: [
          { text: 'Oke' },
        ],
      },
    ];

    const chatSession = await model.startChat({
      generationConfig,
      history,
    });

    const result = await chatSession.sendMessage(inputText);
    return result.response.text();
  } catch (error) {
    console.error("Error in gptlogic function:", error);
    throw error;
  }
}
// batas
async function fetchAllParameters(content, user, prompt, webSearchMode, imageBuffer) {
    try {
        const payload = {
            content: content,
            user: user,
            prompt: prompt,
            webSearchMode: webSearchMode,
            imageBuffer: imageBuffer
        };

        const response = await axios.post('https://lumin-ai.xyz/', payload);
        console.log(response.data);
        return response.data; // Mengembalikan data dari response
    } catch (error) {
        console.error(error);
        throw error; // Melempar error untuk ditangani oleh pemanggil fungsi
    }
}
// batas
const models = {
    miku: { voice_id: "67aee909-5d4b-11ee-a861-00163e2ac61b", voice_name: "Hatsune Miku" },
};

async function ttsnimek1(text, voice_id) {
    function getInspepek() {
        return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    }

    const InsAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/10.1.2 Safari/602.3.12",
        "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36"
    ];
    const randomInsAgent = InsAgents[Math.floor(Math.random() * InsAgents.length)];

    const ngeloot = {
        raw_text: text,
        url: "https://filme.imyfone.com/text-to-speech/anime-text-to-speech/",
        product_id: "200054",
        convert_data: [
            {
                voice_id,
                speed: "1", // maksimal 100 wak normal 1
                volume: "50", // maksimal 100 normal 50
                text,
                pos: 0
            }
        ]
    };

    const rekuesanu = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'X-Forwarded-For': getInspepek(),
            'User-Agent': randomInsAgent
        },
    };

    try {
        const useanu = await axios.post('https://voxbox-tts-api.imyfone.com/pc/v1/voice/tts', JSON.stringify(ngeloot), rekuesanu);
        const tobrut_milik_ins = useanu.data;
        const { channel_id, oss_url } = tobrut_milik_ins.data.convert_result[0];
        return {
            data: [{
                channel_id,
                voice_id,
                url: oss_url,
                voice_name: models[Object.keys(models).find(key => models[key].voice_id === voice_id)].voice_name
            }]
        };
    } catch (error) {
        console.error(`Yah, ada yang salah nih pas nyobain untuk model ${voice_id}:`, error);
        return { error: `Waduh, kayaknya ada yang gak beres nih untuk model ${voice_id}` };
    }
}
// batas
function clockString(ms) {
  var d = isNaN(ms) ? "--" : Math.floor(ms / 86400000);
  var h = isNaN(ms) ? "--" : Math.floor(ms / 3600000) % 24;
  var m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
  var s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
  return [d, "D ", h, "H ", m, "M ", s, "S "]
    .map((v) => v.toString().padStart(2, 0))
    .join("");
}
// batas
function formatUptime(uptime) {
  let seconds = Math.floor(uptime % 60);
  let minutes = Math.floor((uptime / 60) % 60);
  let hours = Math.floor((uptime / (60 * 60)) % 24);
  let days = Math.floor(uptime / (60 * 60 * 24));
  let formattedUptime = "";

  if (days > 0) formattedUptime += `${days} days `;
  if (hours > 0) formattedUptime += `${hours} hours `;
  if (minutes > 0) formattedUptime += `${minutes} minutes `;
  if (seconds > 0) formattedUptime += `${seconds} seconds`;

  return formattedUptime;
}
const uptime = os.uptime();
    const uptimeFormatted = formatUptime(uptime);
 let _uptime = process.uptime()
var muptime = clockString(_uptime);
const ram = (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + " GB";
  const free_ram = (os.freemem() / Math.pow(1024, 3)).toFixed(2) + " GB";
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
  BukaLapak, 
  hentaivid, 
  Hero,
  spotifydl,	
  npmstalk, 
  PlayStore, 
  quotesAnime, 
  capcut
} = require("./function/scraper/exonityscraper");

var app = express();
app.enable("trust proxy");
app.set("json spaces", 2);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/file', express.static(path.join(__dirname, 'file')));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 8080 || 5000 || 3000
           
let requestCount = 0;
// Middleware untuk menghitung setiap request
app.use((req, res, next) => {
  requestCount++;
  console.log(`Total requests: ${requestCount}`);
  next();
});
// Rute untuk mendapatkan total request
app.get('/total-requests', (req, res) => {
  res.send(`Total requests received: ${requestCount}`);
}); 
app.get('/status', (req, res) => {
   const stats = {
    Platform: os.platform(),
    CpuModel: os.cpus()[0].model, 
    Freeram: free_ram, 
    Ram: ram, 
    Request: requestCount
  };
  res.json(stats);
});
app.get('/listfile', (req, res) => {
  const { stdout: totalSize } = exec(`du -sh /file`);
const { stdout: fileCount } = exec(`find /file -type f | wc -l`);
const statsu = {
file: fileCount,
size: totalSize
    };
  res.json(statsu);
});
app.get('/mt', (req, res) => {
  res.sendFile(path.join(__dirname,  'index.html'));
});
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname,  'profile.html'));
});
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname,  'upload.html'));
});
app.get('/chatbot', (req, res) => {
  res.sendFile(path.join(__dirname,  'chatbot.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  'home.html'));
});
app.get('/pingpong', (req, res) => {
  res.sendFile(path.join(__dirname,  'game.html'));
});
app.get('/djviralnya', (req, res) => {
  res.sendFile(path.join(__dirname,  'ytdl (1).mp3'));
});
app.get('/loading', (req, res) => {
  res.sendFile(path.join(__dirname,  'j.html'));
});
app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname,  'openapi.html'));
});
app.get('/lolhuman', (req, res) => {
  res.sendFile(path.join(__dirname,  'Lolhuman.html'));
});
app.get('/text2img/create-image', (req, res) => {
  res.sendFile(path.join(__dirname,  'text.html'));
});
app.get('/play/spotify', (req, res) => {
  res.sendFile(path.join(__dirname,  'Test.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname,  'docs2.html'));
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
app.get('/api/ttSearch', async (req, res) => {
  try {
    const { message }= req.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const video = await ttSearch(message);
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      data: { video }
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
    const message = req.query.message;
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
app.post('/cdn-upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File upload failed' });
  }

  res.json({ url: `https://apikita.exonity.xyz/file/${req.file.filename}` });
});

app.get('/file/:filename', (req, res) => {
  const filepath = path.join(__dirname, 'file', req.params.filename);
  res.sendFile(filepath);
})
app.post('/download', async (req, res) => {
    const { url, resolution } = req.body;

    if (!url) {
        return res.status(400).send('URL video YouTube diperlukan.');
    }

    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: resolution });

        if (!format) {
            return res.status(400).send('Resolusi tidak ditemukan.');
        }

        res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
        ytdl(url, { format }).pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat memproses permintaan Anda.');
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
    tiktokdl(message)
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
app.get('/api/soundcloudsearch', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    soundcloudsearch(message)
    .then((results) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: results
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/gemini', async (req, res) => {
  try {
const apiKey = req.query.apikey;
  const result = checkApiKeyLimit(apiKey);
  if (!result.valid) {
    return res.status(401).json({ message: result.message });
  }
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    let down = await gemininya6626(message) 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: down
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/yousearch', async (req, res) => {
  try {
	  const apiKey = req.query.apikey;
  const result = checkApiKeyLimit(apiKey);
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
let hasil = await yousearch(message)
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: hasil
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/ttsanime', async (req, res) => {
  try {
	  const apiKey = req.query.apikey;
  const result = checkApiKeyLimit(apiKey);
    const message = req.query.text;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "text" tidak ditemukan' });
    }
	  if (message && message.length > 100) {
              return res.status(400).json({ error: '[!] hanya bisa 100 text! ' });
    }
        const voiceModel = models.miku; // Use the "miku" model
        const { data } = await ttsnimek1(message, voiceModel.voice_id);

        if (!data || !data[0] || !data[0].url) throw 'TTS conversion failed';

        const audioBuffer = await axios.get(data[0].url, { responseType: 'arraybuffer' });
	  	const buffer = Buffer.from(audioBuffer.data);
const action = await exon(buffer) 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: action
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/lirik', async (req, res) => {
  try {
    const message = req.query.judul;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    let down = await lirik(message) 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: down
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/ai/logic/post', async (req, res) => {
		const { logic, message} = req.body;
		const cfy = await gptlogicnya(logic, message) 
          res.status(200).json({
          status: 200,
          creator: "RIAN X EXONITY",
          result: cfy
    });
});
app.get('/api/gptlogic', async (req, res) => {
  try {
	  const apiKey = req.query.apikey;
  const result = checkApiKeyLimit(apiKey);
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "massage" tidak ditemukan' });
    }
	  const message2 = req.query.prompt;
    if (!message2) {
      return res.status(400).json({ error: 'Parameter "prompt" tidak ditemukan' });
    }
    let down = await gptlogicnya(message, message2) 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: down
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/drive', async (req, res) => {
  try {
	  const apiKey = req.query.apikey;
  const result = checkApiKeyLimit(apiKey);
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    let down = await gdrive(message) 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: down
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/test2', async (req, res) => {
  try {
    const message = req.query.prompt;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
const message2 = req.query.negative;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    let diff = await stableDiff33(message, message2) 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: diff
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/twitterdl', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    getTwitterMedia(message)
    .then((output) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: output 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/tiktokslide', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    tiktokslide(message)
    .then((json) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: json 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/check-limit', (req, res) => {
  const apiKey = req.query.apiKey;

  if (!apiKey || !apiKeys[apiKey]) {
    return res.status(401).json({ message: 'API key invalid atau tidak ditemukan' });
  }

  const userType = apiKeys[apiKey].type;
  const limit = userType === 'premium' ? PREMIUM_LIMIT : REGULAR_LIMIT;
  const used = apiKeys[apiKey].used;
  const remaining = limit - used;

  res.json({
    apiKey: apiKey,
    type: userType,
    limit: limit,
    used: used,
    remaining: remaining
  });
});
app.get('/api/sfile', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    const asu = await sfilemobi(message)
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: asu 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/sfile-search', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    sfileSearch(message)
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
app.post('/generate-image', async (req, res) => {
    const { prompt } = req.body;

    try {
        const imageBuffer = await text2imgv55(prompt);
        res.setHeader('Content-Type', 'image/jpg');
        res.send(imageBuffer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(error.message);
    }
});
app.get('/api/text2img', async (req, res) => {
  try {
	const apiKey = req.query.apikey;
  const result = checkApiKeyLimit(apiKey);  
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
   const imageBuffer = await text2imgv55(message);
        res.setHeader('Content-Type', 'image/jpg');
        res.send(imageBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/luminai', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    fetchAllParameters(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creatorai: "siputzx",   
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/gpt4o', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    const gpt0 = await gpt4o(message) 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: gpt0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/tinyurl', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
   const anjay = await shortlink(message)
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: anjay
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/wasted', async (req, res) => {
	const apiKey = req.query.apikey;
  const result = checkApiKeyLimit(apiKey);
	var text = req.query.url
	if (!text ) return res.json({ status : false, creator : `${creator}`, message : "[!] masukan parameter url"})
	const hasil =  await Canvacord.Canvas.wasted(text)
	res.set('Content-Type', 'image/png');
	res.send(hasil)
  
})
app.get('/api/pinterest2', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
   const anjayan = await getPinterestImages(message)
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: anjayan
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/animeh', async (req, res) => {
 const url = req.query.q;
    if (!url) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
  const imgnime = await txt2imgAnime(url) 
     res.set('Content-Type', 'image/png');
        res.send(imgnime);
});
app.get('/api/reminix2', async (req, res) => {
 const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
  const img = await srgan2x(url) 
  const results = img.result
    var requestSettings = {
        url: results,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
    });  
});
app.get('/api/reminix4', async (req, res) => {
 const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
  const img = await srgan4x(url) 
  const results = img.result
    var requestSettings = {
        url: results,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
    });  
});
app.get('/api/speech', async (req, res) => {
 const url43 = req.query.query;
    if (!url43) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	const url23 = req.query.lang;
    if (!url23) {
      return res.status(400).json({ error: 'Parameter "lang" tidak ditemukan' });
    }
  const ttsnya = await ttsjir(url43, url23) 
            res.set('Content-Type', 'audio/mp3');
        res.send(ttsnya);
});
app.get('/api/tiktok2', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    tiktok2(message)
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

app.get('/api/bingimg', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "text" tidak ditemukan' });
    }
 const cookiebing = req.query.cookie;
    if (!cookiebing) {
      return res.status(400).json({ error: 'Parameter "text" tidak ditemukan' });
    }  
    const imgc = new BingImageCreator({
      cookie: cookiebing    
    });
    const data = await imgc.createImage(message);
            if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
          if (!data[i].endsWith(".svg")) {
		var result = data[i]
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result
    
    }); 
	  }
      }
      }
  } catch (error) {
    res.status(500).json({ error: error.message });
 }       

    });
app.get('/api/mlstalk', async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: 'id nya mana?' });
    }
	  const zona = req.query.zoneid;
    if (!zona) {
      return res.status(400).json({ error: 'Parameter "zonaid" tidak ditemukan' });
    }
	let anjay22 = await mlbb33(id, zona) 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: anjay22
    });
  } catch (error) {
    res.status(500).json({ error: error.id });
  }
});
app.get('/api/githubstalk', async (req, res) => {
  try {
    const id = req.query.query;
    if (!id) {
      return res.status(400).json({ error: 'id nya mana?' });
    }
    let result = await githubStalk5t6(id) 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.id });
  }
});
app.get('/api/legacyDiffusion', async (req, res) => {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   const uploadnya = await legacyDiffusion(message)
	     res.header('Content-Disposition', `attachment; filename="result-legacyDiffusion.png"`);
	res.set('Content-Type', 'image/png');
        res.send(uploadnya);
});
app.get('/api/ytmp4', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    const iyah = await ytdl.mp4(message)
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      iyah 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/VirtualGirlfriends', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
	  danz.ai.VirtualGirlfriends(message).then(data => {
res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: data
    });
	  });
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
app.get('/api/mediafiredl', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    mediafireDl(message)
    .then((hasil) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: hasil 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/ocr', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    let hasil = await ocrapi.ocrSpace(message);
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: hasil.ParsedResults[0].ParsedText
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/xnxxsearch', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    xnxxsearch(message)
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
app.get('/api/download', async (req, res) => {
    const url = req.query.url;
    const resolution = req.query.resolution;

    if (!url) {
        return res.status(400).send('URL video YouTube diperlukan.');
    }

    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: resolution });

        if (!format) {
            return res.status(400).send('Resolusi tidak ditemukan.');
        }

        res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
        ytdl(url, { format }).pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat memproses permintaan Anda.');
    }
});
 app.get('/api/myinstants', async (req, res) => {
  try {
    soundMeme()
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
app.get('/api/xnxxdl', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    xnxxdl(message)
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
app.get('/api/llama', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
const message2 = req.query.prompt;
    if (!message2) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
	const message3 = req.query.model;
    if (!message3) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }  
    llama3(message, message2, message3)
    .then((data) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: data 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/igdownload', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    var response = await igdlv2(message) 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/gpt-logic', async (req, res) => {
  try {
    const text = req.query.content;
    if (!text) {
      return res.status(400).json({ error: 'Parameter "content" tidak ditemukan' });
    }
	const pro = req.query.content;
    if (!pro) {
      return res.status(400).json({ error: 'Parameter "prompt" tidak ditemukan' });
    }  
   var goyt = await gptLogic(text, pro) 
var result = goyt.data
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/teraboxdl', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    terabox(message)
    .then((info) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      info 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/vocalRemover', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
const isin = await bufferlahh(message) 
    // Lakukan sesuatu dengan buffer audio di sini
	  const yayaitun = await vocalRemover(isin) 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: yayaitun
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/cdn', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
const isiin = await bufferlahh(message) 
    // Lakukan sesuatu dengan buffer audio di sini
	  const yayaituun = await exonity(isiin) 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: yayaituun
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/ytvideo', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
	  const ytdlnya = `https://api.exonity.my.id/api/download?url=${message}&resolution=18`
const uploadkecdn = await bufferlahh(ytdlnya) 
    // Lakukan sesuatu dengan buffer audio di sini
	  const result = await exonity(uploadkecdn) 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: result
    });
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
   spotifydl(message)
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
app.get('/api/geminbbi', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var response = await fetch(`https://api.onesytex.my.id/api/gemini?text=${message}`)
    var datann = await response.json();
	  var { data: result } = datann.result;  
res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/audionya', (req, res) => {
	const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	try{
		const ytdln = require('ytdl-core');
	 const info = ytdln.getInfo(url);
let mp3File = getRandom('.mp3')
	res.header('Content-Disposition', `attachment; filename="ytdl.mp3"`);
    ytdln(url, { filter: 'audioonly' }).pipe(fs.createWriteStream(mp3File)).on('finish', async () => {
res.set('Content-Type', 'audio/mp3');
        res.send(fs.readFileSync(mp3File))
    });
		} catch (error) {
  res.status(500).json({ error: error.message });
	}
});
app.get('/api/gpt-web', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var response = await fetch(`https://itzpire.com/ai/gpt-web?q=${message}`);
    var data = await response.json();
    var { result: results } = data;  
res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: results 
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/letmegpt', async (req, res) => {
  try{
    const text = req.query.query;
    if (!text) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  let nahan = await fetchTextFromURL(text)
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: nahan 
    });
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/tebakgambar', async (req, res) => {
  try{ 
   tebakgambar()
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
app.get('/api/simi', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    const lang = req.query.lang;
    if (!lang) {
      return res.status(400).json({ error: 'Parameter "lang" tidak ditemukan' });
    }
const simisiminya = await askSimsimi(message, lang) 
      res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: simisiminya
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/aio', async (req, res) => {
  try{
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
let coyy = await alldl(message) 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: coyy
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/gemini2', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   const tikotb = await GoogleBard(message)
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: tikotb 
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
   const tikot = await tiktokStalk4344(message)
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: tikot 
    });    
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/pornhub', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   const tikot = await phharam(message)
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: tikot 
    });    
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/wiki', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   const tikot = await Wikipedia(message)
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: tikot 
    });    
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/igstalk', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   let igstallk = await igStalk(message)
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: igstallk
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
    ytPlayMp3(message)
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
app.get('/api/ytplaymp3', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    ytPlayMp3(message)
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
	
    const img = req.query.url;
    if (!img) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
	const yourn = await bufferlah(img) 
		danz.tools.remini(yourn).then(data => {	
     res.header('Content-Disposition', `attachment; filename="result-remini.jpg"`);
       		 
  res.set('Content-Type', 'image/jpg');
        res.send(data);
});			
});
  app.get('/api/capcutdl', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   let a = await getRequest(message)
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY", 
      result: a
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
    chatgptss(message) 
    .then((data) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: data
    });
    }) 
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
      result: hasil 
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
  var response = await fetch(`https://api.exonity.my.id/api/tiktok2?url=${message}`);
    var data = await response.json();
    var { music: music } = data.result;
    var requestSettings = {
        url: music,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'audio/mp3');
        res.send(body);
    });
});
app.get('/api/spotify2', async (req, res) => {
  const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  var response = await fetch(`https://apikita.exonity.xyz/api/spotify?url=${message}`);
    var data = await response.json();
    var { download: download } = data.result;
    var requestSettings = {
        url: download,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'audio/mp3');
        res.send(body);
    });
});
app.get('/api/nobg', async (req, res) => {
  const text = req.query.url;
    if (!text) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	const img = await isImageURL(text)
	if ( !img ) return res.json({ status : false, creator : creator, message : "[!] itu bukan url image"}) 
  const yourn = await bufferlah(text) 
	const bg = await removebg(yourn) 
     res.set('Content-Type', 'image/png');
        res.send(bg.image);
});
app.get('/api/meme', async (req, res) => {
	try{
  const query = `random meme`;
  const page = Math.floor(Math.random() * 10);
  const url = `https://lahelu.com/api/post/get-search?query=${query}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    const random = Math.floor(Math.random() * data.postInfos.length);
    const result = data.postInfos[random];
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: "https://cache.lahelu.com/" + result.media
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/galau', async (req, res) => {
	  let response = await fetch('https://raw.githubusercontent.com/Rianofc/apis/master/function/galau.json');
        var data = await response.json();
        var randomIndex = Math.floor(Math.random() * data.results.length);
        var randomResult = data.results[randomIndex];
        var downloadLink = randomResult.url;
    var requestSettings = {
        url: downloadLink,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'video/mp4');
        res.send(body);
});
});
app.get('/api/wanted', async (req, res) => {
  const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  
    var requestSettings = {
        url: `https://api.popcat.xyz/wanted?image=${message}`,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
});
});
app.get('/api/welcome', async (req, res) => {
  const background = req.query.background;
    if (!background) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	
  const text1 = req.query.text1;
    if (!text1) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	const text2 = req.query.text2;
    if (!text2) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	const text3 = req.query.text3;
    if (!text3) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	const avatar = req.query.avatar;
    if (!avatar) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }  
	var requestSettings = {
	url: `https://api.popcat.xyz/welcomecard?background=${background}&text1=${text1}&text2=${text2}&text3=${text3}&avatar=${avatar}`,	
	method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
});
});
app.get('/api/levelupcard', async (req, res) => {
  const background = req.query.background;
    if (!background) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	
  const text = req.query.name;
    if (!text) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	const text2 = req.query.level;
    if (!text2) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	const text3 = req.query.level2;
    if (!text3) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	const avatar = req.query.avatar;
    if (!avatar) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }  
	const levelUp = await new canvafy.LevelUp()
    .setAvatar(avatar)
    .setBackground("image", background)
    .setUsername(text)
    .setBorder("#000000")
    .setAvatarBorder("#ff0000")
    .setOverlayOpacity(0.7)
    .setLevels(text2, text3)
    .build();
          res.set('Content-Type', 'image/png');
        res.send(levelUp);	
        
    
            
});
app.get('/api/spotifycard', async (req, res) => {
  const text = req.query.title;
    if (!text) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	const avatar = req.query.image;
    if (!avatar) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }  
	const p = await new canvafy.Spotify()
        .setTitle(text)
        .setAuthor("Spotify Downloader")
        .setTimestamp(40, 100)
        .setOverlayOpacity(0.8)
        .setBorder("#fff", 0.8)
        .setImage(avatar)
        .setBlur(3)
        .build();
          res.set('Content-Type', 'image/png');
        res.send(p);	
        
    
            
});
app.get('/api/welcome2', async (req, res) => {
const background = req.query.background;
    if (!background) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  const text = req.query.title;
    if (!text) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	const avatar = req.query.image;
    if (!avatar) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }  
	const welcome = await new canvafy.WelcomeLeave()
  .setAvatar(avatar)
  .setBackground("image", background)
  .setTitle("Welcome")
  .setDescription(text)
  .setBorder("#2a2e35")
  .setAvatarBorder("#2a2e35")
  .setOverlayOpacity(0.3)
  .build();
          res.set('Content-Type', 'image/png');
        res.send(welcome);	
        
    
            
});
app.get('/api/waifu', async (req, res) => {
  var response = await fetch(`https://api.waifu.pics/sfw/waifu`);
    var data = await response.json();
    var { url: result } = data;
    var requestSettings = {
        url: result,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
});
});
app.get('/api/neko', async (req, res) => {
  var response = await fetch(`https://api.waifu.pics/nsfw/neko`);
    var data = await response.json();
    var { url: result } = data;
    var requestSettings = {
        url: result,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
});
});
app.get('/api/ssweb', async (req, res) => {
  const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  let ayaaa = await ssweb1234(message) 
            res.set('Content-Type', 'image/png');
        res.send(ayaaa);
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

app.get('/api/bukalapak', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    BukaLapak(message)
    .then((dat) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: dat 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/playstore', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    PlayStore(message)
    .then((hasil) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: hasil 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/jjtiktok44', async (req, res) => {
  const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  let tik = await ttSearch(message);

    let random = Math.floor(Math.random() * tik.videos.length);
    let file = tik.videos[random];
    let url2 = "https://tikwm.com" + file.play;
    var requestSettings = {
        url: url2,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'video/mp4');
        res.send(body);
    });
    
});
app.get('/api/kobo', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    kobo(message)
  .then((answer) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
       answer
    });
  }) 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/mora', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
const username = req.query.username;
    if (!username) {
      return res.status(400).json({ error: 'Parameter "username" tidak ditemukan' });
    }	  
const iyahhh = await morav2(message, username)
    res.status(200).json({
      creator: "RIAN X EXONITY",
      result: iyahhh
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/search-character', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var response = await fetch(`https://apiruulzz.my.id/api/search-character?query=${message}`);
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
app.get('/api/info-character', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var response = await fetch(`https://apiruulzz.my.id/api/info-character?query=${message}`);
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
app.get('/api/characterai', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: 'Parameter "id" tidak ditemukan!' });
    }
   var response = await fetch(`https://apiruulzz.my.id/api/characterai?query=${message}&id=${id}`);
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
app.get('/api/tts', async (req, res) => {
	const lang = req.query.lang;
    if (!lang) {
      return res.status(400).json({ error: 'Parameter "lang" tidak ditemukan' });
    }
	const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	
var requestSettings = {
        url: `https://nue-api.vercel.app/api/tts?text=${message}&lang=${lang}`,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'audio/mp3');
        res.send(body);
    });    
});
app.get('/api/pixiv-r18', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   pixivr18(message) 
.then((data) => {  
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: data 
    });
});   
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});

app.get('/api/randomgambar', async (req, res) => {
	var anu = await pinterestv2(`pemandangan malam anime`)
var result = anu[Math.floor(Math.random() * anu.length)]
var requestSettings = {
        url: result,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
    });    
});
app.get('/api/bocil', async (req, res) => {

  let response = await fetch('https://raw.githubusercontent.com/Rianofc/apis/master/function/bocil.json');
        var data = await response.json();
        var randomIndex = Math.floor(Math.random() * data.results.length);
        var randomResult = data.results[randomIndex];
        var downloadLink = randomResult.url;
	var requestSettings = {
        url: downloadLink,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'video/mp4');
        res.send(body);
    });    
});

app.get('/api/gimage', async (req, res) => {
	const text = req.query.query;
    if (!text) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	gis(text, async (error, result) => {
var n = result
var images = n[Math.floor(Math.random() * n.length)].url
  
	var requestSettings = {
        url: images,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
    });  
});		
});
app.get('/api/binjie', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var response = await fetch(`https://apiruulzz.my.id/api/binjie?query=${message}`);
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
app.get('/api/diffusionXL', async (req, res) => {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var response = await fetch(`https://skizo.tech/api/sdxl?apikey=nana&prompt=${message}`);
    var data = await response.json();
    var { url: url } = data;
    var requestSettings = {
        url: url,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
    });    

});
app.get('/api/hentaivid', async (req, res) => {
  try {
    hentaivid()
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
app.get('/api/npmstalk', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    fetch(encodeURI(`https://registry.npmjs.org/${message}`))
        .then(response => response.json())
        .then(data => {
        var result = data;
             res.json({
                 status : true,
                 creator: "RIAN X EXONITY",
                 result
             })
         })
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/Hero', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    Hero(message)
    .then((anu) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      anu 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/spotifySearch', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   searching(message)  
	  .then((data) => {
    res.status(200).json({
     status: 200,   
      result: data 
    });
	  })    
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/soundcloud', async (req, res) => {
  try{
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   CloudMusic(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    });   
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/fbdl', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    fbdl(message)
    .then((data) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      data 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/styleText', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    styleText(message)
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
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname,  'error.html'));
});
app.use((err, req, res, next) => {
  console.error(err.stack); res.status(502).sendFile(path.join(__dirname,'error.html'));
});
app.listen(port, () => {
  console.log(`Server berjalan di ${port}`);
});
