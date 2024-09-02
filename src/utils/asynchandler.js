const asynchandler = (requesthandler) => {
    (req, res, next) => {
        Promise.resolve(requesthandler(req, res, next))
            .catch((error) => next(error))
    }
}




export { asynchandler }

// const asynchandler = (fn) => async (req, res, next) => { 
//     try {
//         await fn(res,res,next)
//     } catch (error) {
//         console.log(error.code || 500).json({
//             sucess: false,
//             message:error.message
//         });
//     }
// }

