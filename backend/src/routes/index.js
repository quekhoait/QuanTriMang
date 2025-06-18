const UserRouter = require('./UserRouter');
const FileRouter = require('./FileRouter');

const routes = (app) => {
    app.use('/api/user', UserRouter);
    app.use('/api/file',FileRouter);
}

module.exports = routes;