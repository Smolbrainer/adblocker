const BATCH_SIZE = 1000;  // Use a smaller batch size to avoid hitting the limit

async function applyRulesInBatches(urls) {
    let rules = [];
    let batchCount = 0;

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i].trim();
        if (url) {
            rules.push({
                "id": i + 1 + batchCount * BATCH_SIZE,  // Unique ID per batch
                "action": { "type": "block" },
                "condition": { "urlFilter": url }
            });
        }

        if (rules.length === BATCH_SIZE || i === urls.length - 1) {
            // Apply the current batch of rules
            try {
                await chrome.declarativeNetRequest.updateDynamicRules({ addRules: rules });
                console.log(`Applied batch ${batchCount + 1} of ${rules.length} rules.`);
            } catch (error) {
                console.error(`Failed to apply rules in batch starting with URL: ${urls[i]}`, error);
            }

            batchCount++;  // Increment batch count
            rules = [];  // Reset rules array for the next batch
        }
    }
}

chrome.runtime.getURL('urls.txt');

fetch(chrome.runtime.getURL('urls.txt'))
    .then(response => response.text())
    .then(data => {
        var urls = data.split("\n").filter(url => url.trim() !== "");  // Filter out empty URLs
        urls = Array.from(new Set(urls));  // Remove duplicates
        applyRulesInBatches(urls);  // Apply rules in batches
    })
    .catch(error => {
        console.error('Failed to load urls.txt:', error);
    });
