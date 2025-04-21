import fs from 'fs';
import { Eta } from 'eta';
import mjml2html from 'mjml';
import { NOTIFICATION_TYPES } from './constant.js';

const eta = new Eta({ views: 'emails' });

export const sendStrategies = {
  [NOTIFICATION_TYPES.ON_NEW_FOLLOWED]: async (mailService, element) => {
    const mjmlTemplate = fs.readFileSync('./emails/get-followed.mjml', 'utf-8');

    const renderedTemplate = eta.renderString(mjmlTemplate, {
      name: element.metadata.fullName,
      avatar: element.metadata.avatar,
      lifeRole: element.metadata.lifeRole,
      cardLink: element.metadata.cardLink,
    });

    const { html } = await mjml2html(renderedTemplate);

    return mailService.sendMail({
      from: `"DengTa" <${process.env.GMAIL_ACCOUNT}>`,
      to: element.destinationEmail,
      subject: element.subject,
      html,
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
