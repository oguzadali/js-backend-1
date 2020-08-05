const asyncErrorWrapper = require("express-async-handler")
const { searchHelper, paginationHelper } = require("./queryMiddlewarehelpers")
const question = require("../../controlers/question")

const userQueryMiddleware = function (model, options) {

    return asyncErrorWrapper(async function (req, res, next) {

        let query = model.find();

        // Search User By Name
        const total = await model.countDocuments()
        query = searchHelper("name", query, req);

        // Paginate User

        const paginationResult = await paginationHelper(total, query, req);

        query = paginationResult.query;
        pagination = paginationResult.pagination;

        const queryResults = await query;

        res.queryResults = {
            success: true,
            count: queryResults.length,
            pagination,
            data: queryResults
        };
        next();

    }


    )
}
module.exports = { userQueryMiddleware }

