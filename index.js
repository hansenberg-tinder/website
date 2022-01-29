const express = require('express');
const app = express();

const crypto = require('crypto');
const axios = require('axios');

require('dotenv').config();

app.use(express.json());

app.post('/trylogin', async (req, res) => {
  const accessToken = req.body.token;

  const unhashedKey = process.env.KEY_UUID_UNHASHED;
  const hashedKey = crypto.createHash('md5').update(unhashedKey).digest('hex');

  try {
    const r = await axios.post(
      `${process.env.U}login`,
      { accessToken },
      {
        headers: {
          Authorization: `Bearer ${hashedKey}`,
        },
      }
    );
    const id = r.data.identificationNumber;

    return res.status(200).json({ success: true, id });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({
        success: false,
        msg: err.response.data.msg,
        err: err.response.data.err,
      });
  }
});

app.get('/names', async (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );

  const unhashedKey = process.env.KEY_UUID_UNHASHED;
  const hashedKey = crypto.createHash('md5').update(unhashedKey).digest('hex');

  try {
    const names = await axios.get(`${process.env.U}retrieve/all/names`, {
      headers: {
        Authorization: `Bearer ${hashedKey}`,
      },
    });
    console.log(names.data);
    res.status(200).json({ names: names.data });
  } catch (err) {
    console.log('Error' + err);
    res.status(500).send(err);
  }
});

app.post('/names/log/:random', async (req, res) => {
  const name = req.body.n;

  const calcTime = req.body.g - (new Date().getTime() - 5000 * 678);

  const smash = calcTime > -1 && calcTime < 2000;
  const pass = !smash && calcTime > 80 * 1000 && calcTime < 2000 + 80 * 1000;
  try {
    if (pass) await handlePass(name, req.body.t);
    else if (smash) await handleSmash(name, req.body.t);
    else return res.status(200).json({ success: true, hi: true });

    return res.status(200).json({ success: undefined });
  } catch (error) {
    return res.status(200).json({ success: true });
  }
});

async function handleSmash(othername, userid) {
  return (
    await axios.post(
      `${process.env.U}set/new/smash`,
      { toAddName: othername, id: userid },
      {
        headers: {
          Authorization: `Bearer ${hashedKey}`,
        },
      }
    )
  ).data;
}
async function handlePass(othername, userid) {
  return (
    await axios.post(
      `${process.env.U}set/new/pass`,
      { toAddName: othername, id: userid },
      {
        headers: {
          Authorization: `Bearer ${hashedKey}`,
        },
      }
    )
  ).data;
}

// Handle express requests
app.use(express.static('./dist'));
app.get(/.*/, (req, res) => res.sendFile(__dirname + '/dist/index.html'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
