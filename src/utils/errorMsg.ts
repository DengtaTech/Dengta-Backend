import { Response } from 'express';
type oError = {
  error: string;
};
//有沒有需要console.log一下錯誤訊息給後端
export const errorMsg = {
  emailExist: (res: Response<oError>) => {
    res.status(403).json({ error: 'Email already exists' });
  },
  noToken: (res: Response<oError>) => {
    res.status(401).json({ error: 'Client error - No token provided' });
  },
  wrongToken: (res: Response<oError>) => {
    res.status(403).json({ error: 'Client error - Invalid token' });
  },
  inputEmpty: (res: Response<oError>) => {
    res.status(400).json({
      error: 'Client error - Input feild (images?) should not be empty',
    });
  },
  emailFormat: (res: Response<oError>) => {
    res.status(403).json({ error: 'Email format problem' });
  },
  serverError: (res: Response<oError>) => {
    res.status(500).json({ error: 'Internal Server Error' });
  },
  dbError: (res: Response<oError>) => {
    res.status(500).json({ error: 'Database Error' });
  },
};
