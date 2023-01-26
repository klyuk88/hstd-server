module.exports = {
    async afterCreate(event) {
        const {
            result
        } = event;

        const locale = result.locale

        const message = `
        <p style="font-size: 16px">
        Dear Participant!<br>
        Thank you for submitting your paper to the conference! The review process will take no more than 2 weeks, after that you will receive a letter with decision of the Program Committee.
        </p>
        <p style="font-size: 16px">
        Sincerely,<br>
        HSTD 2023 Organizing Committee
        </p>`

        const messageRu = `
        <p style="font-size: 16px">
        Уважаемый Участник!<br>
        Благодарим Вас за представление доклада на конференцию! Процесс рассмотрения займет не более 2 недель, после чего вы получите письмо с решением Программного комитета.
        </p>
        <p style="font-size: 16px">
        Искренне,<br>
        Оргкомитет HSTD 2023
        </p>`



        for (let index = 0; index < result.authors.length; index++) {
            const author = result.authors[index];

            if (author.corresponding) {
                strapi.service('api::manuscript.manuscript').sendMail(author.email, locale === 'ru' ? messageRu : message, 'Благодарим Вас за представление доклада на конференцию HSTD 23')
            }

        }

    },
    async afterUpdate(event) {
        const {
            result
        } = event;
        const entry = await strapi.entityService.findOne('api::manuscript.manuscript', result.id, {
            populate: {
                authors: true,
                statusWork: true
            },
        });
        console.log('update', entry);

        for (let index = 0; index < entry.authors.length; index++) {
            const author = entry.authors[index];
            if (author.corresponding && result.status === 'Revise') {
                strapi.service('api::manuscript.manuscript').sendMail(author.email, `By decision of the Program Committee, your paper needs to be revised. You can read the comments of the reviewers in your personal account in the field Decision. We are waiting for your paper after the revision.`)

            } else if (author.corresponding && result.status === 'Reject') {
                strapi.service('api::manuscript.manuscript').sendMail(author.email, `We regret to inform you that, in accordance with the decision of the Program Committee, your paper cannot be accepted for participation in the conference. You can read the reviewer's comments in your account in the field Decision.`)
            } else if (author.corresponding && result.status === 'Accept') {

                strapi.service('api::manuscript.manuscript').sendMail(author.email, `We are pleased to inform you that your paper has been accepted for participation in the conference.
In the near future, you will be able to pay the registration fee in your personal account.
You will receive a detailed program after August 10th. If you have any questions, do not hesitate to contact the organizing committee of the conference.`)
            }

        }

    }

};