import express, { Request, Response } from 'express';
import path from 'path';
//import cors from 'cors';
const cors = require('cors');
import { validateClientORCL } from './api/apiHandler';
import { router } from './router';

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { dbCheck } from './db/ClientController';

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

dotenv.config();
const jwtTokenSecret = process.env.JWT_TKN_SECRET;

if (!jwtTokenSecret) {
  throw Error('JWT Token Required');
}

export const checkToken = async (req: Request, res: Response) => {
  const clientNum = await getClientFromJWT(req);
  if (clientNum > 0) {
    res.locals.clientNum = clientNum;
    return true;
  }
  await buildToken(req, res);
  return res.statusCode === 200;
};

const buildToken = async (req: Request, res: Response) => {
  let clientNum = 0;
  try {
    if (res.locals.user) {
      clientNum = await validateClientORCL(res.locals.user.name);
    }
    if (clientNum > 0) {
      const token = jwt.sign(
        {
          username: req.oidc.user.name,
          role: 'client',
          clientNum: clientNum,
        },
        jwtTokenSecret,
        { expiresIn: '24h' }
      );
      res.locals.clientNum = clientNum;
      res.cookie('auth', token, { secure: false, httpOnly: true, maxAge: Number(process.env.SESSION_LIFE) });
      res.status(200);
    } else {
      res.status(403);
    }
  } catch (error) {
    console.error(error);
    res.status(503);
  }
};

const getClientFromJWT = async (req: Request) => {
  let clientNum = 0;
  try {
    const token = req.cookies['auth'];
    if (token) {
      //TODO fix any
      const decoded: any = jwt.verify(token, jwtTokenSecret);
      clientNum = decoded.clientNum;
    }
    return clientNum;
  } catch (error) {
    console.error(error);
    return clientNum;
  }
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: '*',
  })
);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.HOST,
  clientID: process.env.AUTH_CLIENT_ID,
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
  session: {
    cookie: {
      domain: 'report-timber-harvest.service.yukon.ca',
    },
  },
  routes: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    callback: '/api/auth/callback',
    postLogoutRedirect: '/api/auth/post-logout',
  },
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.use(function (req, res, next) {
  if (req.oidc.isAuthenticated()) {
    if (req.oidc.user.email_verified || process.env.AUTH_EMAIL_VERIFIED_FLAG === 'TRUE') {
      res.locals.user = req.oidc.user;
    } else {
      // req.url = '/api/auth/logout';
      // return app._router.handle(req, res, next);
      // res.locals.user = null;
      ///res.locals.clientNum = null;
      //res.clearCookie('auth');
      //res.clearCookie('appSession');
      return res.status(403).send('Auth Email Not Verified');
    }
  } else {
    res.locals.user = null;
    if (req.url === '/api/checkToken') {
      return res.status(403).send('Not Logged In');
    }
  }
  next();
});

app.get('/api/auth/post-logout', async (req: any, res) => {
  res.locals.user = null;
  res.locals.clientNum = null;
  res.clearCookie('auth');
  res.clearCookie('appSession');
  res.redirect(process.env.HOST + '/');
});

app.get('/api/health-check', async (req: any, res) => {
  const db = await dbCheck();
  if (!db) {
    res.send('KO - DB');
  } else {
    res.send('OK');
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('trust proxy', true);

app.use(router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err: any, req: any, res: any) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: app.get('env') === 'development' ? err : {},
  });
});

export { app };
