const craftmenRouter = require('../../api/admin/craftmen/craftmen.router');
const settingRouter = require('../../api/admin/settings/settings.router');
const signInRouter = require('../../api/admin/sign_in/sign_in.router');
const usersRouter = require('../../api/admin/users/users.router');
const dashboardRouter = require('../../api/admin/dashboard/dashboard.router');
const analyzesRouter = require('../../api/admin/analyzes/analyzes.router');

module.exports = {

    initRoutings: (app) => {
        app.use('/admin/analyzes', analyzesRouter);
        app.use('/admin/sign-in', signInRouter);
        app.use('/admin/settings', settingRouter);
        app.use('/admin/craftmen', craftmenRouter);
        app.use('/admin/users', usersRouter);
        app.use('/admin/dashboard', dashboardRouter);
    }
}