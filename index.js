var express = require('express')
var app = express()
var cheerio = require('cheerio');
var request = require('request');

var url = 'https://www.myinstants.com'; 

var timeoutInMilliseconds = 10*1000
var opts = {
	url: url,
	timeout: timeoutInMilliseconds
}

app.get('/', function (req, res) {

	res.header("Content-Type", "application/json; charset=utf-8");
	var response = res;

	request(opts, function (err, res, body) {

		if (err) {
			console.dir(err)
			return
		}

		var statusCode = res.statusCode;
		var rawHtml = body;
		$ = cheerio.load(body)

		var respondeArray = [];

		$('.instant').each(function(i, elem) {
			let linkr = `https://www.myinstants.com`
			var link = linkr + $('.small-button').attr(linkr + 'onclick');
			var item = {
				title : link,
				link : link
			};

		 	respondeArray[i] = item;
		});

		response.send( JSON.stringify(respondeArray) );
	});

})

app.listen(3000)
