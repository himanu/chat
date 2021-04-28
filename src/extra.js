const axios = require('axios');

// axios.get('/',)

// axios({
//     method: 'get',
//     url: 'https://jsonplaceholder.typicode.com/comments',
//     responseType: 'stream'
//   })
//     .then(function (response) {
//       response.data.pipe())
//     });

axios.get('https://jsonplaceholder.typicode.com/users'
  )
  .then(function (response) {
    const data = response.data;
    data.forEach(element => {
        console.log(element.email);
    });
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // always executed
  });