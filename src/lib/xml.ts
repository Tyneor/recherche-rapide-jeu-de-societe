export const readXmlStream = async (stream: ReadableStream<Uint8Array>) => {
  // from chatGPT
  const textDecoder = new TextDecoder("utf-8");
  const reader = stream.getReader();
  let xmlString = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = textDecoder.decode(value, { stream: true });
      xmlString += chunk;
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    return xmlDoc;
  } finally {
    reader.releaseLock();
  }
};

export const getTagValue = (element: Element) => {
  return element.childNodes[0].nodeValue;
};
