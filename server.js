const express = require('express');
const { json } = require('express');
const OracleDB = require('oracledb');
const crypto = require('crypto');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');


const logFilePath = 'server_logs.txt';

const app = express();

const port = 8090;

const dbConfig = {
  user: 'ysk',
  password: 'tomtom',
  connectString: 'localhost:1521/XE',
};

OracleDB.createPool({
  user: dbConfig.user,
  password: dbConfig.password,
  connectString: dbConfig.connectString,
  poolAlias: "default"
});

// Middleware to parse JSON request body
app.use(express.json());

app.get('/moms/ccyyhh', async (req, res) => {
  try {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

     const ip = req.connection.remoteAddress; //client ip
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
  
  const log = `/moms/ccyyhh ->[ ${ip} ] ccyyhh 조회 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`;
  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/moms/register-info', async (req, res) => {
  try {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ip = req.connection.remoteAddress;
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
    
    const log = `/moms/register-info ->[ ${ip} ] register 조회 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`;
  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
}
   catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/moms/yysskk', async (req, res) => {
  try {
    // Connect to the database
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

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
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

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

    const log = `/moms/ccyyhh/register ->[ ${ip} ] age-cmt 삽입 ${JSON.stringify(req.body)} < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`;
    fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// 회원가입 요청
app.post('/moms/register', async (req, res) => {
  try {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

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

    res.status(200).send(`Inserted ${result.rowsAffected} row(s)`);
  
    const log =`/moms/register ->[ ${ip} ] 회원가입 요청 ${JSON.stringify(req.body)} -> [성공] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`;
     fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
  } 
   catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
    const log =`/moms/register ->[ ${ip} ] 회원가입 요청 ${JSON.stringify(req.body)} -> [실패] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`;
    fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
  
  }
});

//로그인 
app.post('/moms/login', async (req, res) => {
  try {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const { id, pw } = req.body;
    const ip = req.connection.remoteAddress;
    const connection = await OracleDB.getConnection(dbConfig);
    
    const log = `/moms/login ->[ ${ip} ] 로그인 요청 ${JSON.stringify(req.body)}`
    fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });

    const result = await connection.execute(
      `SELECT id, pw FROM register WHERE id = :id`,
      [id]
    );

    if (result.rows.length > 0) {
      const login = await connection.execute(
        `SELECT * FROM register WHERE id = :id and pw = :pw`,
        [id, crypto.createHash('md5').update(pw).digest('hex')]
      );
      
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
        if (login.rows.length > 0) {
          const log = ` -> [성공] ${logininfo['id']}님 접속 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`
          fs.appendFile(logFilePath, log, (err) => {
          if (err) throw err;
          console.log(log); // 로그를 콘솔에 출력
        });
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        const logininfo = { success: false };
        const log = ` -> [실패] 잘못된 비밀번호 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`
        fs.appendFile(logFilePath, log, (err) => {
        if (err) throw err;
        console.log(log); // 로그를 콘솔에 출력
      });
        res.end(JSON.stringify(logininfo));
      }
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      const logininfo = { success: false };
      const log = ` -> [실패] 존재하지 않는 아이디 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`
        fs.appendFile(logFilePath, log, (err) => {
        if (err) throw err;
        console.log(log); // 로그를 콘솔에 출력
      });
      res.end(JSON.stringify(logininfo));
    }
    await connection.release();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//아이디 찾기
app.post('/moms/find-id', async (req, res) => {
  try {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const { email } = req.body;
    const ip = req.connection.remoteAddress;
    const connection = await OracleDB.getConnection(dbConfig);
    
    const log = `/moms/find-id ->[ ${ip} ] 아이디 찾기 요청 ${JSON.stringify(req.body)}`
    fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });

    const result = await connection.execute(
      `SELECT id FROM register WHERE email = :email`,
      [email]
    );

    if (result.rows.length > 0) {
     
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const logininfo = {
          success: true,
          id: result.rows[0][0]
        };
        res.end(JSON.stringify(logininfo));
          const log = ` -> [성공] ${logininfo['id']}  < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`
          fs.appendFile(logFilePath, log, (err) => {
          if (err) throw err;
          console.log(log); // 로그를 콘솔에 출력
        });
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      const logininfo = { success: false };
      const log = ` -> [실패] 존재하지 않는 이메일 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`
        fs.appendFile(logFilePath, log, (err) => {
        if (err) throw err;
        console.log(log); // 로그를 콘솔에 출력
      });
      res.end(JSON.stringify(logininfo));
    }
    await connection.release();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
//비밀번호 수정
app.post('/moms/change-pw', async (req, res) => {
  try {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    const { email , pw} = req.body;
    const ip = req.connection.remoteAddress;
    const connection = await OracleDB.getConnection(dbConfig);
    
    const log = `/moms/change-pw ->[ ${ip} ] 비밀번호 변경 요청 ${JSON.stringify(req.body)}`
    fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });

  const checkemail = await connection.execute(
    `SELECT clientnum FROM register WHERE email = :email`,
    [email]
  );
    if (checkemail.rows.length > 0 && pw) {
      const sql = `UPDATE register SET pw = :pw where email= :email`;
      const bindParams = {
        pw: crypto.createHash('md5').update(pw).digest('hex'),
        email: email
      };
      const result = await connection.execute(sql, bindParams, { autoCommit: true });
      console.log(result.sql);
      if (result.rowsAffected >0){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const info = {
          success: true,
          pw: 'change success'
        };
        res.end(JSON.stringify(info));
          const log = ` -> [성공] ${info['pw']}  < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`
          fs.appendFile(logFilePath, log, (err) => {
          if (err) throw err;
          console.log(log); // 로그를 콘솔에 출력
        });
      }
      else{

      }
    }
    else if(!pw){
      res.writeHead(401, { 'Content-Type': 'application/json' });
      const info = { success: false };
      const log = ` -> [실패] pw값이 비어있습니다. < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`
        fs.appendFile(logFilePath, log, (err) => {
        if (err) throw err;
        console.log(log); // 로그를 콘솔에 출력
      });
      res.end(JSON.stringify(info));
    }
    else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      const info = { success: false };
      const log = ` -> [실패] 존재하지 않는 이메일 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`
        fs.appendFile(logFilePath, log, (err) => {
        if (err) throw err;
        console.log(log); // 로그를 콘솔에 출력
      });
      res.end(JSON.stringify(info));
    }
    await connection.release();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
//사진 업로드
app.post('/upload', upload.array('images', 10), async (req, res) => {
  try {
    const ip = req.connection.remoteAddress;
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const files = req.files;

    if (!files) {
      const log = `/upload -> [ ${ip} ] -> [실패] 이미지 없음 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`
      fs.appendFile(logFilePath, log, (err) => {
        if (err) throw err;
        console.log(log); // 로그를 콘솔에 출력
      });
      res.status(400).send('No file uploaded.');
      return;
    }

    const log = `/upload -> [ ${ip} ] -> [성공] 이미지 업로드 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`
    fs.appendFile(logFilePath, log, (err) => {
      if (err) throw err;
      console.log(log); // 로그를 콘솔에 출력
    });

    const filePaths = files.map(file => file.path);
    
    const sql = `INSERT INTO image_path (path) VALUES (:path)`;
    const binds = filePaths.map(filePath => ({ path: filePath }));
    const options = { autoCommit: true };
    const connection = await OracleDB.getConnection();
    const result = await connection.executeMany(sql, binds, options);

    if(result.rowsAffected>0)
    {
      const fileNames = req.files.map(file => file.originalname);
      const log = `/upload -> [ ${ip} ] -> [성공] 경로 저장 성공 : ${fileNames} < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}>\n`
      fs.appendFile(logFilePath, log, (err) => {
        if (err) throw err;
        console.log(log); // 로그를 콘솔에 출력
      });
    }
    connection.close();
    res.status(200).send(`${files.length} files uploaded!`);
  
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

  

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
