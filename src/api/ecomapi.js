import axios from 'axios';

const ServerURL = 'https://fakestoreapi.com';

const getData = async url => {
  try {
    const response = await axios.get(`${ServerURL}/${url}`);
    return response.data;
  } catch (e) {
    console.log('GET ERROR:', e.message);
    return null;
  }
};

const postData = async (url, body) => {
  try {
    const response = await axios.post(`${ServerURL}/${url}`, body);
    return response.data;
  } catch (e) {
    console.log('POST ERROR:', e.message);
    return null;
  }
};

export { ServerURL, getData, postData };
