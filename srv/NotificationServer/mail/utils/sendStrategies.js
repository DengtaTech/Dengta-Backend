import { NOTIFICATION_TYPES } from './constant.js';

export const sendStrategies = {
  [NOTIFICATION_TYPES.ON_NEW_FOLLOWED]: async (mailService, element) => {
    return mailService.sendMail({
      from: `"DengTa" <${process.env.GMAIL_ACCOUNT}>`,
      to: element.destinationEmail,
      subject: element.subject,
      text: `${element.content}\n第二行測試`,
    });
  },
  [NOTIFICATION_TYPES.ON_NEW_FOOTPRINT]: async (mailService, element) => {
    return mailService.sendMail({
      from: `"DengTa" <${process.env.GMAIL_ACCOUNT}>`,
      to: element.destinationEmail,
      subject: element.subject,
      text: `${element.content}\n第二行測試`,
    });
  },
};
// [NOTIFICATION_TYPES.SYSTEM]: async (mailService, element) => {
//   // 這邊只是示範，可自行替換實際內容
//   return mailService.sendMail({
//     from: `"System" <${process.env.GMAIL_ACCOUNT}>`,
//     to: element.email,
//     subject: `[系統通知] ${element.title}`,
//     text: `${element.content}\n第二行測試`,
//   });
// },
// 其他類型 ...
// [NOTIFICATION_TYPES.FOLLOWER_FOOTPRINT]: async (mailService, element) => {...}
// [NOTIFICATION_TYPES.FOOTPRINT_REACTION]: async (mailService, element) => {...}
