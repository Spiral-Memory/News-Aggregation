const apiKey = '';
const cx = '';

function googleSearch(query) {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.items) {
                data.items.forEach((item, index) => {
                    console.log(`Result ${index + 1}:`);
                    console.log('Title:', item.title);
                    console.log('URL:', item.link);
                    console.log('');
                });
            } else {
                console.log('No results found');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Example usage:
googleSearch('Bouchier leeds England to T20 series win over NZ');
