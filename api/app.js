const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

let urls = [
	'https://www.youtube.com/channel/UCvXmT2bjGcUvoAEuDYUcwJQ/videos',
	'https://www.youtube.com/channel/UCZcvko6qVYbuCCNMpjnwigA/videos',
	'https://www.youtube.com/user/kRaToSWorLD/videos',
	'https://www.youtube.com/user/3DJuegosTV/videos',
	'https://www.youtube.com/user/elfedelobo/videos',
	'https://www.youtube.com/user/h3h3Productions/videos'
]

let final = []


/* TESTING */
app.post("/test", (req, res) => {
	


})

app.get("/getLinks", (req, res) => {
	let myJsonString = JSON.stringify(final);
	
	res.setHeader('Content-Type', 'application/json');
	res.send(myJsonString)
})


/* PUPPETER */

const puppeteer = require('puppeteer');

async function getPic() {
  	const browser = await puppeteer.launch({headless: false});
  	const page = await browser.newPage();
 
	for(let i = 0; i < urls.length; i++)
	{
	  	await page.goto(urls[i],  {timeout:0});
		await page.evaluate('window.scrollTo(0, -100)');
	 	await page.screenshot({path: 'public/testing' + (i+1) + '.jpg'});	

	 	let obj = {url: urls[i], image: 'http://192.168.0.103:3000/testing' + (i+1) + '.jpg'}	
	 	final.push(obj)
	}  


  await browser.close();
  console.log(final)
    console.log("Si entre")
}

getPic();

/* HANDLE IMAGES */








app.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
 });