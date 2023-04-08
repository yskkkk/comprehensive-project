const express = require('express');
const { json } = require('express');
const OracleDB = require('oracledb');
const crypto = require('crypto');
const app = express();

const port = 8090;

const dbConfig = {
  user: 'ysk',
  password: 'tomtom',
  connectString: 'localhost:1521/XE',
};

// Middleware to parse JSON request body
app.use(express.json());

app.get('/moms/ccyyhh', async (req, res) => {
  try {
    // Connect to the database
    const connection = await OracleDB.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM ccyyhh`
    );

    await connection.release();

    const jsonData = [];
    const columnNames = result.metaData.map((col) => col.name);
    for (let row of result.rows) {
      const obj = {};
      for (let i = 0; i < columnNames.length; i++) {
        obj[columnNames[i]] = row[i];
      }
      jsonData.push(obj);
    }
    res.send(jsonData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/moms/register-info/', async (req, res) => {
  try {
    // Connect to the database
    const connection = await OracleDB.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM register`
    );

    await connection.release();

    const jsonData = [];
    const columnNames = result.metaData.map((col) => col.name);
    for (let row of result.rows) {
      const obj = {};
      for (let i = 0; i < columnNames.length; i++) {
        obj[columnNames[i]] = row[i];
      }
      jsonData.push(obj);
    }
    res.send(jsonData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/moms/yysskk', async (req, res) => {
  try {
    // Connect to the database
    const connection = await OracleDB.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM yysskk`
    );

    // Release the database connection
    await connection.release();

    // Convert the result to an array of objects and send it to the client
    const jsonData = [];
    const columnNames = result.metaData.map((col) => col.name);
    for (let row of result.rows) {
      const obj = {};
      for (let i = 0; i < columnNames.length; i++) {
        obj[columnNames[i]] = row[i];
      }
      jsonData.push(obj);
    }
    res.send(jsonData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/moms/ccyyhh/register', async (req, res) => {
  try {
    const { age, cmt } = req.body;
    const ccyyhh = req.url.split('/').pop();
    const ip = req.connection.remoteAddress; //client ip
    // Oracle 데이터베이스 연결
    const connection = await OracleDB.getConnection(dbConfig);
    // ccyyhh 테이블에 데이터 삽입
    const sql = `INSERT INTO ccyyhh(age, cmt) VALUES (:age, :cmt)`;
    const bindParams = {
      age: parseInt(age),
      cmt: cmt
    };
    const result = await connection.execute(sql, bindParams, { autoCommit: true });

    console.log(`Client IP: ${ip} `+`(으)로부터 데이터 삽입`);
    console.log(`${JSON.stringify(req.body)}`);

    res.status(200).send(`Inserted ${result.rowsAffected} row(s)`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// 회원가입 요청
app.post('/moms/register', async (req, res) => {
  try {
    const { id, pw, name, phone, email } = req.body;
    const register = req.url.split('/').pop();
    const ip = req.connection.remoteAddress; //client ip
    // Oracle 데이터베이스 연결
    const connection = await OracleDB.getConnection(dbConfig);
    // ccyyhh 테이블에 데이터 삽입
    const sql = `INSERT INTO register(id, pw, name, phone, email) VALUES (:id, :pw, :name, :phone, :email)`;
    const bindParams = {
      id: id,
      pw: crypto.createHash('md5').update(pw).digest('hex'),
      name: name,
      phone: phone,
      email: email
    };
    const result = await connection.execute(sql, bindParams, { autoCommit: true });

    console.log(`Client IP: ${ip} `+`의 회원가입`);
    console.log(`${JSON.stringify(req.body)}`);

    res.status(200).send(`Inserted ${result.rowsAffected} row(s)`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});

//로그인 
app.post('/moms/login', async (req, res) => {
  try {
    const { id, pw } = req.body;
    const ip = req.connection.remoteAddress;
    const connection = await OracleDB.getConnection(dbConfig);
    
    console.log(`로그인 요청 : ${ip}`);
    console.log(`${JSON.stringify(req.body)}`);

    const result = await connection.execute(
      `SELECT id, pw FROM register WHERE id = :id`,
      [id]
    );

    if (result.rows.length > 0) {
      const login = await connection.execute(
        `SELECT * FROM register WHERE id = :id and pw = :pw`,
        [id, crypto.createHash('md5').update(pw).digest('hex')]
      );
      if (login.rows.length > 0) {
        console.log(`로그인 성공 : ${JSON.stringify(req.body)}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const logininfo = {
          success: true,
          cnum: login.rows[0][0],
          id: login.rows[0][1],
          name: login.rows[0][3],
          phone: login.rows[0][4],
          email: login.rows[0][5]
        };
        res.end(JSON.stringify(logininfo));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        const logininfo = { success: false };
        console.log(`비밀번호가 틀렸습니다.`);
        res.end(JSON.stringify(logininfo));
      }
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      const logininfo = { success: false };
      console.log(`로그인 실패 : 아이디가 존재하지 않습니다.`);
      res.end(JSON.stringify(logininfo));
    }
    await connection.release();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
