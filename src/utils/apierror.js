class ApiError extends Error {
    constructor(
        statuscode,
        message = "Something went wrong",
        stack = ""
    ) {
        super(message),
            this.statuscode = statuscode
        this.data = null
        this.message = message
        this.success = false
        this.error = error
    }

}
export { ApiError }