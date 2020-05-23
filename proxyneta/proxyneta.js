const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const process = require('process')

const API_PORT = 3333;

const app = express();
app.use(cors());

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/bitfinex/', async (req, res) => {
	try {
		let longs = await axios.get(`https://api-pub.bitfinex.com/v2/stats1/pos.size:1m:tBTCUSD:long/last`)
		if (!longs) throw 'Unable to fetch bitfinex longs'
		let shorts = await axios.get(`https://api-pub.bitfinex.com/v2/stats1/pos.size:1m:tBTCUSD:short/last`)
		if (!shorts) throw 'Unable to fetch bitfinex shorts'
	  res.send({
	  	time: longs.data[0],
	  	longs: longs.data[1],
	  	shorts: shorts.data[1],
	  	delta: longs.data[1] - shorts.data[1]
	  });
	  res.end();
	} catch(err) {
		console.log(err);
	} 
});

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

process.on('SIGINT', () => {
  process.exit(0)
})