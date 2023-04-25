const express = require('express');
const { json } = require('express');
const OracleDB = require('oracledb');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/image/' });
const emailToAuthCode = {};
const fs = require('fs');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'samron3797@gmail.com',
    pass: 'suptmsennwtdjpis',
  },
});

const logFilePath = 'server_logs.txt';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
  
  let log = `/moms/ccyyhh ->[ ${ip} ] ccyyhh 조회 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/moms/register-info', async (req, res) => {
  let log =``;
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
    
  log += `/moms/register-info ->[ ${ip} ] register 조회 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
}
   catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
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

  
    let log = `/moms/ccyyhh/register ->[ ${ip} ] age-cmt 삽입 ${JSON.stringify(req.body)} < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
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
  let log =`` ;
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
    log +=`/moms/register ->[ ${ip} ] 회원가입 요청 ${JSON.stringify(req.body)} ->`
    const sql = `INSERT INTO register(id, pw, name, phone, email) VALUES (:id, :pw, :name, :phone, :email)`;
    const bindParams = {
      id: id,
      pw: crypto.createHash('md5').update(pw).digest('hex'),
      name: name,
      phone: phone,
      email: email
    };
    const result = await connection.execute(sql, bindParams, { autoCommit: true });
    res.status(200).send(`Inserted ${result.rowsAffecte} row(s)`);
    
    log +=` [성공] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
     
  } 
   catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
    log +=` [실패] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
  }
  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
});

//로그인 
app.post('/moms/login', async (req, res) => {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const { id, pw } = req.body;
  const ip = req.connection.remoteAddress;
  const connection = await OracleDB.getConnection(dbConfig);
  let log = `/moms/login ->[ ${ip} ] 로그인 요청 ${id}`;
  try {
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
        
        if (login.rows.length > 0) {
          res.end(JSON.stringify(logininfo));
          log += ` -> [성공] ${logininfo['id']}님 접속 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        const logininfo = { success: false };
        log += ` -> [실패] 잘못된 비밀번호 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
       
        res.end(JSON.stringify(logininfo));
      }
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      const logininfo = { success: false };
      log += ` -> [실패] 존재하지 않는 아이디 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
      res.end(JSON.stringify(logininfo));
    }
    await connection.release();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
});

//아이디 찾기 이메일 인증
app.post('/moms/find-id', async (req, res) => {
  let log =``;
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ip = req.connection.remoteAddress;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const rN = Math.floor(100000 + Math.random() * 900000);
  emailToAuthCode[email] = rN;
  try {
    
    const connection = await OracleDB.getConnection(dbConfig);
    
    const result = await connection.execute(
      `SELECT id FROM register WHERE (email = :email) and (name = :name) and (phone = :phone)`,
      [email, name, phone]
    );

    if (result.rows.length> 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const logininfo = {
          success: true
        };
  const mailOptions = {
    from: 'mom`s care App',
    to: email,
    subject: 'Mom`s care Application 이메일 인증',
    text: `아래의 Pin 번호를 어플리케이션에 입력해주세요\n\n\t\t${rN.toString()}`,
  };
  transporter.sendMail(mailOptions, (error, info) => { // 이메일 전송
    if (error) {
      log += `/moms/find-id ->[ ${ip} ] 아이디 찾기 인증 메일 전송 -> [실패] 에러 발생 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
      fs.appendFile(logFilePath, log, (err) => {
        if (err) throw err;
        console.log(log); // 로그를 콘솔에 출력
      });
      const info = {
        success: false,
      };
      return res.end(JSON.stringify(info));
    } else {
      log += `/moms/find-id ->[ ${ip} ] 아이디 찾기 인증 메일 전송 -> [성공] ${emailToAuthCode[email]} < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
      fs.appendFile(logFilePath, log, (err) => {
        if (err) throw err;
        console.log(log); // 로그를 콘솔에 출력
      });
      const info = {
        success: true,
      };
      return res.end(JSON.stringify(info));
    }
  });
        res.end(JSON.stringify(logininfo));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      const logininfo = { success: false, message: `일치하는 회원정보가 없습니다.`};
      log += `/moms/find-id ->[ ${ip} ] -> [실패] 일치하는 회원정보가 없습니다. < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
      res.end(JSON.stringify(logininfo));
    }
    await connection.release();
  } catch (err) {
    log += `/moms/find-id ->[ ${ip} ] -> [실패] 오류 발생 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
});

// 아이디 반환
app.post('/moms/find-id/id', async (req, res) => {
  const email = req.body.email;
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  let log =``;
  const ip = req.connection.remoteAddress;
  try {
    const connection = await OracleDB.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT id FROM register WHERE email = :email`,
      [email]
    );
    const info = {
      success: true,
      id: result.rows[0][0],    };
    if(result.rows.length> 0)
    {
      log = `/moms/find-id/id ->[ ${ip} ] 아이디 반환 -> [성공] ${result.rows[0][0]}< ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
    }
    else{
      log = `/moms/find-id/id ->[ ${ip} ] 아이디 반환 -> [실패] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
    }
    fs.appendFile(logFilePath, log, (err) => {
      if (err) throw err;
      console.log(log); // 로그를 콘솔에 출력
    });
    await connection.release();
    return res.end(JSON.stringify(info));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '아이디 반환 실패 ' });
  }
});

//비밀번호 수정 이메일 인증
app.post('/moms/change-pw', async (req, res) => {
  let log = ``;
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const rN = Math.floor(100000 + Math.random() * 900000);
  const { email , phone , id} = req.body;
  emailToAuthCode[email] = rN;
  const ip = req.connection.remoteAddress;
  const connection = await OracleDB.getConnection(dbConfig);
  try {
  const check = await connection.execute(
    `SELECT clientnum FROM register WHERE email = :email and id = :id and phone = :phone`,
    [email, id, phone]
  );

    if (check.rows.length > 0) {
      const mailOptions = {
        from: 'mom`s care App',
        to: email,
        subject: 'Mom`s care Application 이메일 인증',
        text: `아래의 Pin 번호를 어플리케이션에 입력해주세요\n\n\t\t${rN.toString()}`,
      };

      transporter.sendMail(mailOptions, (error, info) => { // 이메일 전송
        if (error) {
          log += `/moms/change-pw ->[ ${ip} ] 비밀번호 찾기 인증 메일 전송 -> [실패] 에러 발생 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
          fs.appendFile(logFilePath, log, (err) => {
            if (err) throw err;
            console.log(log); // 로그를 콘솔에 출력
          });
          const info = {
            success: false
          };
          return res.end(JSON.stringify(info));
        } else {
          log += `/moms/change-pw ->[ ${ip} ] 비밀번호 찾기 인증 메일 전송 -> [성공] ${emailToAuthCode[email]} < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
          fs.appendFile(logFilePath, log, (err) => {
            if (err) throw err;
            console.log(log); // 로그를 콘솔에 출력
          });
          const info = {
            success: true
          };
          return res.end(JSON.stringify(info));
        }
      });
}else{
  log += `/moms/change-pw ->[ ${ip} ] 비밀번호 찾기 인증 메일 전송 -> [실패] 일치하는 사용자가 없습니다. < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
  const info = {
    success: false
  };
  res.end(JSON.stringify(info));
}
await connection.release();
  }catch(error)
  {

  }

fs.appendFile(logFilePath, log, (err) => {
  if (err) throw err;
  console.log(log); // 로그를 콘솔에 출력
});
});

//비밀번호 수정
app.post('/moms/change-pw/pw', async (req, res) => {
  const ip = req.connection.remoteAddress;
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const pw = req.body.pw;
  const email = req.body.email;
  const connection = await OracleDB.getConnection(dbConfig);
  let log = ``;

  try{
  const sql = `UPDATE register SET pw = :pw where email= :email`;
  const bindParams = {
    pw: crypto.createHash('md5').update(pw).digest('hex'),
    email: email
  };
  const result = await connection.execute(sql, bindParams, { autoCommit: true });
     
  if (result.rowsAffected > 0){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const info = {
       success: true,
       pw: 'change success'
    };
      log += `/moms/change-pw/pw ->[ ${ip} ] -> [성공] ${info['pw']}  < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
      fs.appendFile(logFilePath, log, (err) => {
        if (err) throw err;
        console.log(log); // 로그를 콘솔에 출력
      });
      res.end(JSON.stringify(info));
    }
  else if(!pw){
    res.writeHead(401, { 'Content-Type': 'application/json' });
    const info = { success: false };
    log += `/moms/change-pw/pw ->[ ${ip} ] -> [실패] pw값이 비어있습니다. < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
    fs.appendFile(logFilePath, log, (err) => {
      if (err) throw err;
      console.log(log); // 로그를 콘솔에 출력
    });
    res.end(JSON.stringify(info));
  }
}catch(error){

  }
  
});

//사진 업로드
app.post('/upload/images', upload.array('images', 10), async (req, res) => {
  let log = ``;
  let fileNames=``;
  try {
    const ip = req.connection.remoteAddress;
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const files = req.files;
    const clientNum = parseInt(req.body.clientNum);
    const diary_date = req.body.diary_date;
    const connection = await OracleDB.getConnection();

    const sql = `SELECT diaryNo FROM diary WHERE clientNum = :clientNum and diary_date = :diary_date`;
      const binds = {
        clientNum: clientNum,
        diary_date: diary_date
      };
    const options = { autoCommit: true };
    const Sresult = await connection.execute(sql, binds, options);
    log += `/upload/images -> [ ${ip} ] -> `;
    if (!files) {
      log += `[실패] 이미지 없음 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
      res.status(400).send('No file uploaded.');
      fs.appendFile(logFilePath, log, (err) => {
        if (err) throw err;
        console.log(log); // 로그를 콘솔에 출력
      });
      return;
    }else{
      const filePaths = files.map(file => file.path);
      for (let i = 0; i < files.length; i++) {
        const filename = filePaths[i].split('\\').pop().split('/').pop();
        fileNames += `${filename}/`;
      }
      if(Sresult.rows.length > 0){ // 입력받은 다이어리가 존재하면
        log += `[성공] 이미지 업로드 ${fileNames} < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
        fs.appendFile(logFilePath, log, (err) => {
          if (err) throw err;
          console.log(log); // 로그를 콘솔에 출력
        });
        log=``;
      
        const sql2 = `UPDATE diary SET imageURL = :fileNames WHERE diaryNo = :diaryNo`;
        const binds2 = {
          fileNames: fileNames,
          diaryNo: Sresult.rows[0][0]
        };
        const result = await connection.execute(sql2, binds2, options);
  
        if(result.rowsAffected > 0)
        {
          log = `/upload -> [ ${ip} ] -> [성공] 경로 저장 성공 : ${fileNames} < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
          res.status(200).send(`${files.length} files path uploaded!`);
        }
        else
        {
          log = `/upload -> [ ${ip} ] -> [실패] 경로 저장 실패 : ${fileNames} < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
          res.status(500).send(`${files.length} files path uploaded failed`);
        }
        connection.close();
        
      }
    else{
      log += `[실패] 해당하는 다이어리값이 없습니다. ${fileNames} < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
    }
  }
} catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
});
//다이어리 반환
//입력 값 clientNum, diary_date
//반환 값 success, content, imageURL
app.post('/moms/diary', async (req, res) => {
  const clientNum = parseInt(req.body.clientNum);
  const diary_date = req.body.diary_date;
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  let log =``;
  const ip = req.connection.remoteAddress;
  const connection = await OracleDB.getConnection(dbConfig);
  try {
    
    const result = await connection.execute(
      `SELECT content, imageURL FROM diary WHERE clientNum = :clientNum and diary_date = :diary_date`,
      [clientNum, diary_date]
    );
    if (result.rows.length < 1) {
      const info = {
        success: false
      };
      return res.end(JSON.stringify(info));
    }
    const info = {
      success: true,
      content: result.rows[0][0],
      imageURL: result.rows[0][1]
    };
    if(result.rows.length > 0)
    {
      log = `/moms/diary ->[ ${ip} ] 다이어리 요청 -> [성공] ${clientNum}, ${diary_date} < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
    }
    else{
      log = `/moms/diary ->[ ${ip} ] 다이어리 요청 -> [실패] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
    }
    fs.appendFile(logFilePath, log, (err) => {
      if (err) throw err;
      console.log(log); // 로그를 콘솔에 출력
    });
    await connection.release();
    return res.end(JSON.stringify(info));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '다이어리 요청 실패 ' });
  }
});
//이미지 불러오기 ex) http://182.219.226.49/image/image_name
app.get('/image/:path', (req, res) => {
  const ip = req.connection.remoteAddress;
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const imagePath = 'uploads/image/' + req.params.path;
  let log = `/image/${imagePath} -> [ ${ip} ] 이미지 요청 -> `;

  fs.readFile(imagePath, (err, data) => {
    if (err) {
      log += `[실패] 존재하지 않는 이미지 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
      res.status(404).send('Not Found');
    } else {
      log += `[성공] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.end(data);
    }
    fs.appendFile(logFilePath, log, (err) => {
      if (err) throw err;
      console.log(log); // 로그를 콘솔에 출력
    });
  });
});
  
//이메일 전송
app.post('/moms/sendemail', async(req, res) => {
  let log=``;
  let message=``;
  try{
  const ip = req.connection.remoteAddress;
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const rN = Math.floor(100000 + Math.random() * 900000);
  const id = req.body.id;
  const phone = req.body.phone;
  const email = req.body.email;
  emailToAuthCode[email] = rN;
  log += `/moms/sendmail ->[ ${ip} ] 회원가입 인증 메일 전송`;

  // 이메일 주소의 유효성 검사
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).send('잘못된 이메일 주소입니다.');
  }
  const connection = await OracleDB.getConnection(dbConfig);

  const result1 = await connection.execute(`SELECT * FROM register WHERE email = :email`, [email]);
  const result2 = await connection.execute(`SELECT * FROM register WHERE id = :id`, [id]);
  const result3 = await connection.execute(`SELECT * FROM register WHERE phone = :phone`, [phone]);

  if(result1.rows.length > 0) {
    message += `이메일 `
  }
  if(result2.rows.length > 0) {
    message += `아이디 `
  }
  if(result3.rows.length > 0) {
    message += `핸드폰 번호 `
  }
  if((result1.rows.length > 0) || (result2.rows.length > 0) || (result3.rows.length > 0 ))
  {
    message += `(이)가 중복 됩니다.`;
    log += ` -> [실패] ${message} < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
    const info = {
      success: false,
      message: message
    };
    fs.appendFile(logFilePath, log, (err) => {
      if (err) throw err;
      console.log(log); // 로그를 콘솔에 출력
    });
    return res.end(JSON.stringify(info));
  }else{

  const mailOptions = {
    from: 'mom`s care App',
    to: email,
    subject: 'Mom`s care Application 이메일 인증',
    text: `아래의 Pin 번호를 어플리케이션에 입력해주세요\n\n\t\t${rN.toString()}`,
  };
 
  transporter.sendMail(mailOptions, (error, info) => { // 이메일 전송
    if (error) {
      log += ` -> [실패] 에러 발생 < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
      fs.appendFile(logFilePath, log, (err) => {
        if (err) throw err;
        console.log(log); // 로그를 콘솔에 출력
      });
      const info = {
        success: false,
      };
      return res.end(JSON.stringify(info));
    } else {
      log += ` -> [성공] ${emailToAuthCode[email]} < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`
      fs.appendFile(logFilePath, log, (err) => {
        if (err) throw err;
        console.log(log); // 로그를 콘솔에 출력
      });
      const info = {
        success: true,
      };
      return res.end(JSON.stringify(info));
    }
  });
}
}catch (error) {
  console.error(error);
  return res.status(500).send('서버 오류가 발생했습니다.');
}
});

//이메일 인증
app.post('/moms/sendemail/auth', (req, res) => {
  const ip = req.connection.remoteAddress;
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const email = req.body.email;
  const authCode = parseInt(req.body.auth);
  let log = `/moms/sendemail/auth ->[ ${ip} ] 메일 인증 ${JSON.stringify(req.body)}`;
  
  //인증값 비교
  if (emailToAuthCode[email] === authCode) {
    log += ` -> [성공] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
    delete emailToAuthCode[email]; // 인증 성공시 코드 삭제
    const info = {
      success: true,
    };
    fs.appendFile(logFilePath, log, (err) => {
      if (err) throw err;
      console.log(log); // 로그를 콘솔에 출력
    });
    return res.end(JSON.stringify(info));
  }else {
    log += ` -> [실패] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
    const info = {
      success: false,
    };
    fs.appendFile(logFilePath, log, (err) => {
      if (err) throw err;
      console.log(log); // 로그를 콘솔에 출력
    });
    return res.end(JSON.stringify(info));
  }  
});

//다이어리 등록
app.post('/moms/diary/register', async (req, res) => {
  let log =`` ;
  try {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    const { clientNum, diary_date, content} = req.body;

    const ip = req.connection.remoteAddress; //client ip
    // Oracle 데이터베이스 연결
    const connection = await OracleDB.getConnection(dbConfig);
    
    log +=`/moms/diary ->[ ${ip} ] 다이어리 작성 ${JSON.stringify(req.body)} ->`
    const sql = `INSERT INTO diary(clientNum, diary_date, content) VALUES (:clientNum, :diary_date, :content)`;
    const bindParams = {
      clientNum: clientNum,
      diary_date: diary_date,
      content: content
    };
    const result = await connection.execute(sql, bindParams, { autoCommit: true });
    res.status(200).send(`Inserted ${result.rowsAffecte} row(s)`);
    
    log +=` [성공] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
     
  } 
   catch (err) {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    console.error(err.message);
    res.status(500).send('Internal Server Error');
    log +=` [실패] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
  }
  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
});

//문의사항 입력 값 -> title, content, clientNum
app.post('/moms/inquire-request', async (req, res) => {
  let log =`` ;
  try {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ip = req.connection.remoteAddress; //client ip
    const { title, content, clientNum } = req.body;
    const connection = await OracleDB.getConnection(dbConfig);

    log +=`/moms/inquire ->[ ${ip} ] 문의 사항 입력 ${JSON.stringify(req.body)} ->`
    const sql = `INSERT INTO inquire (inquireNo, title, content, reply, inquire_date, clientNum) VALUES (seq_inquire.NEXTVAL, :title ,:content , '아직 답변이 오지 않았어요',TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS'), :clientNum)`;
    const bind = {
      title: title,
      content: content,
      clientNum: parseInt(clientNum)
    };
    const result = await connection.execute(sql, bind, { autoCommit: true });
    if(result.rowsAffected > 0)
    {
      res.status(200).send(`문의사항 전송 성공`);
      log +=` [성공] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
    }
  } 
   catch (err) {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    console.error(err.message);
    res.status(500).send('서버 오류');
    log +=` [실패] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
  }
  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
});

//문의사항 반환 
//입력 값 clientNum
//반환 값 title, content, reply, inqure_date 
app.post('/moms/inquire', async (req, res) => {
  let log =`` ;
  try {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ip = req.connection.remoteAddress; //client ip
    const clientNum = parseInt(req.body);
    const connection = await OracleDB.getConnection(dbConfig);

    log +=`/moms/inquire ->[ ${ip} ] 문의 사항 조회 ${JSON.stringify(req.body)} ->`
    const sql = `SELECT * FROM inquire WHERE clientNum = :clientNum`;
    const bind = {
      clientNum: clientNum
    };
    const result = await connection.execute(sql, bind, { outFormat: OracleDB.OBJECT });
    if(result.rows.length > 0)
    {
      console.log(result.rows);
      res.status(200).send(result.rows);
      log +=` [성공] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
    }
    else {
      res.status(200).send(`조회된 문의사항이 없습니다.`);
      log +=` [실패] 조회된 문의사항이 없습니다. < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
    }
  } 
  catch (err) {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    console.error(err.message);
    res.status(500).send('서버 오류');
    log +=` [실패] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
  }
  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
});

//공지사항 요청
app.post('/moms/notice', async (req, res) => {
  let log =`` ;
  try {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ip = req.connection.remoteAddress; //client ip
    const connection = await OracleDB.getConnection(dbConfig);

    log +=`/moms/notice ->[ ${ip} ] 공지사항 조회 ->`
    const sql = `SELECT * FROM notice`;
    const result = await connection.execute(sql);
    if(result.rows.length > 0)
    {
      res.status(200).json(result.rows);
      log +=` [성공] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
    }
  } 
  catch (err) {
    console.error(err.message);
    res.status(500).send('서버 오류');
    log +=` [실패] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
  }
  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
});
//아기정보 등록
//입력 값 babyName, expectedDate, dadName, momName, clientNum
app.post('/moms/baby/register', async (req, res) => {
  let log = '';
  try {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ip = req.connection.remoteAddress;
    const { babyName, expectedDate, dadName, momName, clientNum } = req.body;
    const connection = await OracleDB.getConnection(dbConfig);

    log += `/moms/baby/register -> [ ${ip} ] 아기 정보 입력 ${JSON.stringify(req.body)} -> `;
    const sql = `INSERT INTO baby (babyNo, babyName, expectedDate, dadName, momName, clientNum) VALUES (seq_baby.NEXTVAL, :babyName, :expectedDate, :dadName, :momName, :clientNum)`;
    const bind = {
      babyName: babyName,
      expectedDate: expectedDate,
      dadName: dadName,
      momName: momName,
      clientNum: clientNum
    };
    const result = await connection.execute(sql, bind, { autoCommit: true });
    if (result.rowsAffected > 0) {
      res.status(200).send(`아기 정보 입력 성공`);
      log += `[성공] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
    }
  } catch (err) {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    console.error(err.message);
    res.status(500).send('서버 오류');
    log += `[실패] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
  }
  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log);
  });
});
//아기 정보 반환
//입력 값 clientNum
//반환 값 babyNo, babyName, expectedDate, dadName, momName, clientNum
app.post('/moms/baby', async (req, res) => {
  let log = ``;
  try {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ip = req.connection.remoteAddress; //client ip
    const { clientNum } = req.body;
    const connection = await OracleDB.getConnection(dbConfig);

    log += `/moms/baby -> [${ip}] 아기 정보 조회 (clientNum: ${clientNum}) ->`;
    const sql = `SELECT babyNo, babyName, expectedDate, dadName, momName FROM baby WHERE clientNum = :clientNum`;
    const bind = { clientNum };
    const result = await connection.execute(sql, bind);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
      log += ` [성공] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
    } else {
      res.status(404).send('등록된 아기 정보가 없습니다.');
      log += ` [실패] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('서버 오류');
    log += ` [실패] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
  }
  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
});

//아기정보 수정
// 입력값 clientNum, babyNo, babyName, expectedDate, dadName, momName
// babyNo는 아기정보 요청할때 반환되며 사용자에게 표출되지 않고 어플리케이션 내부에서 식별자로 쓰여야 한다.
app.post('/moms/baby/modify', async (req, res) => {
  let log = ``;
  try {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ip = req.connection.remoteAddress; //client ip
    const { clientNum, babyNo, babyName, expectedDate, dadName, momName } = req.body;
    const connection = await OracleDB.getConnection(dbConfig);

    log += `/moms/baby/modify -> [${ip}] 아기 정보 수정 (clientNum: ${clientNum}) ->`;

    const sql = `UPDATE baby SET babyName = :babyName, expectedDate = :expectedDate, dadName = :dadName, momName = :momName WHERE (clientNum = :clientNum and babyNo = :babyNo)`;
    const bind = { clientNum, babyNo, babyName, expectedDate, dadName, momName };

    const result = await connection.execute(sql, bind);

    if (result.rowsAffected > 0) {
      res.status(200).send('아기 정보가 업데이트 되었습니다.');
      log += ` [성공] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
    } else {
      res.status(404).send('아기 정보 업데이트에 실패하였습니다.');
      log += ` [실패] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('서버 오류');
    log += ` [실패] < ${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} >\n`;
  }

  fs.appendFile(logFilePath, log, (err) => {
    if (err) throw err;
    console.log(log); // 로그를 콘솔에 출력
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
