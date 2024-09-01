const crypto = require('crypto');
const axios = require('axios');

// PhonePe API Integration

// Function to initiate a new payment
const newPayment = async (req, res) => {
    try {
        const merchantTransactionId = 'MP' + Date.now();
        const { user_id, price, phone, name } = req.body;
        const { PORT, TEST_MERCHANT_ID, TEST_SALT_KEY, TEST_PHONEPE_HOST } = process.env;

        if (!TEST_MERCHANT_ID || !TEST_SALT_KEY) {
            throw new Error('Environment variables TEST_MERCHANT_ID and TEST_SALT_KEY must be set');
        }

        const data = {
            merchantId: TEST_MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: 'MUID' + user_id,
            name: name,
            amount: price * 100, // Convert price to paise
            redirectUrl: `http://localhost:${PORT}/status/${merchantTransactionId}`, // add callback api to check status
            redirectMode: 'POST',
            mobileNumber: phone,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };

        const payload = JSON.stringify(data);
        const payloadBase64 = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const stringToHash = payloadBase64 + '/pg/v1/pay' + TEST_SALT_KEY;
        const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const options = {
            method: 'POST',
            url: `${TEST_PHONEPE_HOST}/pg/v1/pay`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadBase64
            }
        };

        const response = await axios(options);

        if (response.data.data && response.data.data.instrumentResponse && response.data.data.instrumentResponse.redirectInfo) {
            console.log('response.data.data -=- ', response.data.data);
            console.log('Redirecting to:', response.data.data.instrumentResponse.redirectInfo.url);
            return res.status(200).json({
                success: true,
                redirectUrl: response.data.data.instrumentResponse.redirectInfo.url
            });
        } else {
            console.log('Invalid response from PhonePe -=- ');
            throw new Error('Invalid response from PhonePe');
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).send({
            message: error.message,
            success: false
        });
    }
};

// Function to check the status of a payment
const checkStatus = async (req, res) => {
    try {
        const merchantTransactionId = req.params['txnId'];
        const { TEST_MERCHANT_ID, TEST_SALT_KEY, TEST_PHONEPE_HOST } = process.env;
        const keyIndex = 1;
        const string = `/pg/v1/status/${TEST_MERCHANT_ID}/${merchantTransactionId}` + TEST_SALT_KEY;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + "###" + keyIndex;

        const options = {
            method: 'GET',
            url: `${TEST_PHONEPE_HOST}/pg/v1/status/${TEST_MERCHANT_ID}/${merchantTransactionId}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': TEST_MERCHANT_ID
            }
        };

        const response = await axios.request(options);
        if (response.data.success === true) {
            console.log(response.data);
            return res.status(200).send({ success: true, message: "Payment Success" });
        } else {
            return res.status(400).send({ success: false, message: "Payment Failure" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: err.message });
    }
};

module.exports = {
    newPayment,
    checkStatus
};
