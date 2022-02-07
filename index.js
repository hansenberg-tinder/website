const express = require('express');
const app = express();

const crypto = require('crypto');
const axios = require('axios');

require('dotenv').config();

app.use(express.json());

function time(req, res, next) {
  if (new Date().getTime() > new Date(2022, 01, 11, 18).getTime()) {
    console.log('Too late!');
    return res.status(200).json({
      m: true,
      success: true,
      s: 'Hi',
      tl: true,
    });
  }
  next();
}

function secondTime(req, res, next) {
  if (new Date().getTime() <= new Date(2022, 01, 11, 18).getTime()) {
    console.log('Too early!');
    return res.status(200).json({
      m: true,
      success: true,
      s: 'Bye',
      te: true,
    });
  }
  next();
}

app.post('/trylogin', time, async (req, res) => {
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
    res.status(400).json({
      success: false,
      msg: err.response.data.msg,
      err: err.response.data.err,
    });
  }
});

app.post('/try/second/login', secondTime, async (req, res) => {
  const accessToken = req.body.aToken;

  const unhashedKey = process.env.KEY_UUID_UNHASHED;
  const hashedKey = crypto.createHash('md5').update(unhashedKey).digest('hex');

  try {
    const r = await axios.post(
      `${process.env.U}newLogin`,
      { accessToken },
      {
        headers: {
          Authorization: `Bearer ${hashedKey}`,
        },
      }
    );
    const m = r.data.matches;

    return res.status(200).json({ success: true, m });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      msg: err.response.data.msg,
      err: err.response.data.err,
    });
  }
});

app.post('/names', async (req, res) => {
  const unhashedKey = process.env.KEY_UUID_UNHASHED;
  const hashedKey = crypto.createHash('md5').update(unhashedKey).digest('hex');

  try {
    const names = await axios.post(
      `${process.env.U}retrieve/all/names`,
      {
        toDoId: req.body.fd,
      },
      {
        headers: {
          Authorization: `Bearer ${hashedKey}`,
        },
      }
    );
    console.log(names.data);
    res.status(200).json({ names: names.data });
  } catch (err) {
    console.log('Error' + err.response.data.msg);
    res.status(400).send(err.response.data.msg);
  }
});

app.post('/names/log/:random', time, async (req, res) => {
  const name = req.body.n;

  const calcTime = new Date().getTime() - 2500 * 2 * 678;
  console.log(`req.body.g: ${req.body.g}`);

  console.log(`calcTime: ${calcTime}`);

  const smash = Math.abs(calcTime - req.body.g) < 2000;
  const pass =
    !smash && Math.abs(calcTime + 2000 * 1000 * 1000 - req.body.g) < 2000;

  try {
    if (pass) await handlePass(name, req.body.t);
    else if (smash) {
      const r = await handleSmash(name, req.body.t);
      if (r?.err)
        res.status(200).json({
          success: false,
          err: r.customMsg,
        });
    } else return res.status(200).json({ success: true, hi: true });

    return res.status(200).json({ success: undefined });
  } catch (error) {
    console.log('Error' + error);

    return res.status(300).json({ success: true });
  }
});

async function handleSmash(othername, userid) {
  const unhashedKey = process.env.KEY_UUID_UNHASHED;
  const hashedKey = crypto.createHash('md5').update(unhashedKey).digest('hex');

  const res = await axios.post(
    `${process.env.U}set/new/smash`,
    { toAddName: othername, id: userid },
    {
      headers: {
        Authorization: `Bearer ${hashedKey}`,
      },
    }
  );
  if (res.data.success === false) return { err: true, customMsg: res.data };
  return res.data;
}
async function handlePass(othername, userid) {
  const unhashedKey = process.env.KEY_UUID_UNHASHED;
  const hashedKey = crypto.createHash('md5').update(unhashedKey).digest('hex');

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
