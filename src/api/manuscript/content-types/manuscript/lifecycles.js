module.exports = {
    async afterCreate(event) {
        const {
            result
        } = event;

        const locale = result.locale

        const subject = {
            ru: 'Благодарим Вас за представление доклада на конференцию HSTD 23',
            en: 'Thank you for submitting your paper to the HSTD 2023'
        }


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
        С Уважением,<br>
        Оргкомитет HSTD 2023
        </p>`



        for (let index = 0; index < result.authors.length; index++) {
            const author = result.authors[index];

            if (author.corresponding) {
                strapi.service('api::manuscript.manuscript').sendMail(author.email, locale === 'ru' ? messageRu : message, locale === 'ru' ? subject.ru : subject.en)
            }

        }

    },
    async afterUpdate(event) {
        const {
            result
        } = event;
        const locale = result.locale

        const entry = await strapi.entityService.findOne('api::manuscript.manuscript', result.id, {
            populate: {
                authors: true,
                statusWork: true
            },
            locale: locale
        });
        if (entry.authors.length > 0 && entry.statusWork) {
            const subject = {
                ru: 'Решение по вашей статье на HSTD 2023',
                en: 'Decision on your paper at HSTD 2023'
            }


            const reviseMessage = {
                ru: `
                <p style="font-size: 16px">
                Уважаемый Участник!<br>
                По решению Программного комитета ваша статья нуждается в доработке. Вы можете прочитать комментарии рецензентов в личном кабинете в поле Решение. Ждем вашу статью после доработки.
                </p>
                <p style="font-size: 16px">
                С Уважением,<br>
                Оргкомитет HSTD 2023
                </p>`,
                en: `
                <p style="font-size: 16px">
                Dear Participant!<br>
                By decision of the Program Committee, your paper needs to be revised. You can read the comments of the reviewers in your personal account in the field Decision. We are waiting for your paper after the revision.
                </p>
                <p style="font-size: 16px">
                Sincerely,<br>
                HSTD 2023 Organizing Committee
                </p>`
            }

            const rejectMessage = {
                ru: `
                <p style="font-size: 16px">
                Уважаемый Участник!<br>
                С сожалением сообщаем Вам, что в соответствии с решением Программного комитета Ваш доклад не может быть принят к участию в конференции. Вы можете прочитать комментарии рецензента в личном кабинете в поле Решение.
                </p>
                <p style="font-size: 16px">
                С Уважением,<br>
                Оргкомитет HSTD 2023
                </p>`,
                en: `
                <p style="font-size: 16px">
                Dear Participant!<br>
                We regret to inform you that, in accordance with the decision of the Program Committee, your paper cannot be accepted for participation in the conference. You can read the reviewer's comments in your account in the field Decision.
                </p>
                <p style="font-size: 16px">
                Sincerely,<br>
                HSTD 2023 Organizing Committee
                </p>`
            }
            const acceptMessage = {
                ru: `
                <p style="font-size: 16px">
                Уважаемый Участник!<br>
                Мы рады сообщить вам, что ваша статья принята к участию в конференции. В ближайшее время вы сможете оплатить регистрационный взнос в личном кабинете. Подробную программу вы получите после 10 августа. Если у вас есть какие-либо вопросы, не стесняйтесь обращаться к оргкомитету конференции.
                </p>
                <p style="font-size: 16px">
                С Уважением,<br>
                Оргкомитет HSTD 2023
                </p>`,
                en: `
                <p style="font-size: 16px">
                Dear Participant!<br>
                We are pleased to inform you that your paper has been accepted for participation in the conference. In the near future, you will be able to pay the registration fee in your personal account. You will receive a detailed program after August 10th. If you have any questions, do not hesitate to contact the organizing committee of the conference.
                </p>
                <p style="font-size: 16px">
                Sincerely,<br>
                HSTD 2023 Organizing Committee
                </p>`
            }


            for (let index = 0; index < entry.authors.length; index++) {
                const author = entry.authors[index];

                if (author.corresponding && entry.statusWork.slug === 'revise') {
                    strapi.service('api::manuscript.manuscript').sendMail(author.email, locale === 'ru' ? reviseMessage.ru : reviseMessage.en, locale === 'ru' ? subject.ru : subject.en)

                } else if (author.corresponding && entry.statusWork.slug === 'reject') {
                    strapi.service('api::manuscript.manuscript').sendMail(author.email, locale === 'ru' ? rejectMessage.ru : rejectMessage.en, locale === 'ru' ? subject.ru : subject.en)

                } else if (author.corresponding && entry.statusWork.slug === 'accept') {

                    strapi.service('api::manuscript.manuscript').sendMail(author.email, locale === 'ru' ? acceptMessage.ru : acceptMessage.en, locale === 'ru' ? subject.ru : subject.en)
                }

            }

        } else {
            return
        }


    }

};