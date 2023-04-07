const express = require('express');
const { json } = require('express');
const app = express();
const OracleDB = require('oracledb');

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



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
