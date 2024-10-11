import nodemailer from 'nodemailer';
import { Eta } from 'eta';
import mjml2html from 'mjml';
import { marked } from 'marked';
import fs from 'fs';
import { mentionRepo } from '../Repository/mentionRepo.js';
import { KEYWORDS_LIMIT } from '../../Config/constants.js';
import { dateUtils } from '../../utils/dateUtils.js';

const eta = new Eta({ views: 'emails' });

marked.setOptions({
  breaks: true,
  gfm: true,
});

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const mailTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

export const emailService = {
  sendBasicEmail: async (
    to: string,
    subject: string,
    text: string,
  ): Promise<void> => {
    const mailOptions = {
      from: GMAIL_USER,
      to,
      subject,
      text,
    };

    try {
      await mailTransport.sendMail(mailOptions);
    } catch (err) {
      console.error('Error:', err);
    }
  },
  sendHtmlEmail: async (
    to: string,
    subject: string,
    html: string,
  ): Promise<void> => {
    const mailOptions = {
      from: GMAIL_USER,
      to,
      subject,
      html,
    };

    try {
      await mailTransport.sendMail(mailOptions);
    } catch (err) {
      console.error('Error:', err);
    }
  },
  sendWeeklyKeywordOfficialNotificationEmail: async (
    to: string,
    subject: string,
    userName: string,
  ): Promise<void> => {
    try {
      console.log('Sending weekly keyword notification email to:', to);

      const keywords = await mentionRepo.getTopKeywordsInWeek(
        new Date(),
        KEYWORDS_LIMIT,
      );

      const weekStart = dateUtils.getMonday(new Date());
      const weekEnd = dateUtils.getSunday(new Date());

      const keywordsTable = keywords
        .map(
          (keyword, index) =>
            `<tr style="font-size: 20px; padding: 15px 0; text-align: left;">
              <td style="padding: 10px 15px 10px 0px">${index + 1}</td>
              <td style="padding: 10px 15px">${keyword.keyword}</td>
              <td style="padding: 10px 0px 10px 15px">${keyword.totalCount}</td>
            </tr>`,
        )
        .join('\n');

      const mjmlTemplate = fs.readFileSync(
        './emails/weekly-keyword-notification.mjml',
        'utf-8',
      );

      // 使用 replace 而不是直接將 keywordsTable 放入 renderString 的原因
      // 是因為 eta 會將 <tr> 轉換成 &lt;tr&gt;，這樣 mjml 就無法正確解析
      const replacedTemplate = mjmlTemplate.replace(
        '%%keywords-table%%',
        keywordsTable,
      );

      const renderedTemplate = eta.renderString(replacedTemplate, {
        name: userName,
        week: `${weekStart} ~ ${weekEnd}`,
      });

      const { html } = mjml2html(renderedTemplate);

      await emailService.sendHtmlEmail(to, subject, html);
    } catch (err) {
      console.error('Error:', err);
    }
  },
};
