// const asynchandler = (requesthandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requesthandler(req, res, next))
//             .catch((error) => next(error))
//     }
// }

const asynchandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        // Forward the error to Express error-handling middleware
        next(error);
    }
};


export { asynchandler }
