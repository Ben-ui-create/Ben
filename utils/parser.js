export async function jsonBodyParser(req) {
    if (req.headers['content-type'] !== 'application/json') {
        return {};
    }

    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            resolve(JSON.parse(body));
        });

        req.on('error', (err) => {
            reject(err);
        });

    });
}

export function queryParser(req) {
    const {pathname: url, searchParams } = new URL(`http://localhost:8080${req.url}`);

    const query = Object.fromEntries(searchParams);

    return {query, url, method: req.method};
}

export async function parser(req) {
    const {query, url, method} = queryParser(req);

    let body = '';

    if (['POST', 'PUT'].includes(method)) {
        body = await jsonBodyParser(req);
    }

    req.query = query;
    req.body = body;
    req.url = url;

    return req;
}

export default parser;

//
// axios.get('http://localhost:8080/login?id=10')
// .then(res => {
//     console.log(res);
// })
// .catch(err => console.log(err))
// .finally(() => {
//     console.log('Done!');
// });
//
// axios.get('http://localhost:8080/login', {
//     params: {
//         id: 100,
//     }
// })
// .then(res => {
//     console.log(res.data);
// })
// .catch(err => {
//     console.log(err);
// })
// .finally(() => {
//     console.log('Done!');
// });
//
// async function getData() {
//     try {
//         const response = await  axios.get('http://localhost:8080/login?id=12');
//
//         console.log(response.data);
//     } catch (error) {
//         console.error(error);
//     }
// }
//
// getData();
//
// async function main(id) {
//   try {
//     const response = await axios(`https://jsonplaceholder.typicode.com/users/${id}`);
//
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// }
//
// main(1);

//
// axios.post('http://localhost:8080/register', {
//   firstName: 'John',
//   lastname: 'Doe',
// })
//   .then(async res => {
//     const file = getDataPath('users.json');
//     await fs.writeFile(file, res.data);
//     console.log(res.data);
//   })
//   .catch(err => {
//     console.error(err);
//   })
//   .finally(() => {
//     console.log('Done!');
//   });