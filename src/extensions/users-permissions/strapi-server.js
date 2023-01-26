module.exports = (plugin) => {
    plugin.controllers.user.update = async (ctx) => {
        console.log(ctx.request);
        try {
            const entry = await strapi.entityService.update(
                'plugin::users-permissions.user',
                ctx.state.user.id, {
                    data: ctx.request.body
                }
            );
            // strapi.service('api::manuscript.manuscript').sendMail(ctx.state.user.email, `Thank you for registration as listener.`, `Registration as listener at HSTD 2023`)
            ctx.body = entry;
        } catch (error) {
            ctx.body = error
        }


    };
    return plugin

};