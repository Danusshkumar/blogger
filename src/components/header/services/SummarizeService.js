// services/SummarizeService.js
export const summarizeText = async (text) => {
    try {
      const response = await fetch('https://api.cohere.ai/v1/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer Xpb0o5veC68Ktpz45eifY6sHyA8iRgiYZjO00XT3`, // Replace with your Cohere API Key
        },
        body: JSON.stringify({
          text: text,
          length: 'long', // Request a long, detailed summary
        }),
      });
  
      const responseData = await response.json();
      if (response.ok) {
        return formatSummaryIntoPoints(responseData.summary);
      } else {
        console.error('API Error:', responseData);
        alert('Failed to summarize the text. Please try again later.');
        return '';
      }
    } catch (error) {
      console.error('Error summarizing text:', error);
      alert('Failed to summarize the text. Please try again later.');
      return '';
    }
  };
  
  const formatSummaryIntoPoints = (summary) => {
    return summary
      .split('. ')
      .map(sentence => `- ${sentence.trim()}`)
      .join('\n');
  };
  