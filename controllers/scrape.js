const puppeteer = require('puppeteer');

const scrapeWebsite = async (req, res) => {
    const { url } = req.body;
    if(!url) {
        return res.status(200).json({ success: false, data: { status: 400, message: 'No URL provided' } });
    }

    const [oUrl, element] = url.split(' ');


    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(oUrl, { waitUntil: 'networkidle2' });

        // Listen for console messages from the page
        // page.on('console', msg => console.log(msg.text()));

        const scrapedData = await page.evaluate(async (element) => {
            let index = 0; 
            const extractData = async (el) => { 
                index += 1; 
                if (!el) return null; 

                const tag = el.tagName.toLowerCase();
                const itemId = String(index); 

                const attributes = {
                };

                if(el.className && typeof el.className === 'string') {
                    attributes['class'] = el.className
                }

                if(el.getAttribute('id')) {
                    attributes['id'] = el.id
                }

                const children = Array.from(el.children);
                const content = children.length === 0 
                    ? (el.innerText ? el.innerText.trim() : '')  
                    : await Promise.all(children.map(child => extractData(child)));

                for (let i = 0; i < el.attributes.length; i++) {
                    const attr = el.attributes[i];
                    if (attr.name !== 'id' && attr.name !== 'class') {
                        attributes[attr.name] = attr.value; 
                    }
                }

                return { itemId, tag, content, attributes };
            };

            const html = document.querySelector(element || 'body');
            return await extractData(html);
        }, element || 'body');

        await browser.close();

        return res.status(200).json({ success: true, data: { status: 200, data: scrapedData || { tag: 'No results', itemId: '-1', } } });
    } catch (error) {
        console.error('Error scraping website, restart the app');//, error);
        return res.status(200).json({ success: false, data: { status: 500, message: 'Error' } });
    }
};

module.exports = {
    scrapeWebsite,
};
