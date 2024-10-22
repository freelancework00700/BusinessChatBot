export class HttpStatus {
    sendOkResponse = (res, message, data = null) => {
        const resObject = { success: true, message, data };
        res.status(200).json(resObject);
    };

    sendBadRequestResponse = (res, message = "Something went wrong, please try again later.", data = null) => {
        const resObject = { success: false, message, data };
        res.status(200).json(resObject);
    };

    sendInvalidTokenResponse = (res, message = "Invalid Token!", data = null) => {
        const resObject = { success: false, message, data };
        res.status(401).json(resObject);
    };
}
