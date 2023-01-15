'use strict';

/**
 * manuscript service
 */

const {
    createCoreService
} = require('@strapi/strapi').factories;

module.exports = createCoreService('api::manuscript.manuscript', ({
    strapi
}) => ({
    async sendMail(email, message, subject = `Decision on your paper at HSTD 2023`) {
        try {
            const res = await strapi.plugins['email'].services.email.send({
                to: email,
                from: '"HSTD Conference" <hstd-conference@mai.ru>',
                subject: subject,
                text: '',
                html: `
<p style="font-size: 16px">
Dear Participant!<br>
${message}</p>
<p style="font-size: 16px">
Sincerely,<br>
HSTD 2023 Organizing Committee
</p>
`,
            })
            return res

        } catch (error) {
            return error
        }

    }

}));