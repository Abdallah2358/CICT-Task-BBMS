const db = require('../../models');
const User = db.User;

const checkEmailNotInUse = async (value) => {
    const user = await User.findOne({ where: { email: value } });
    if (user) {
        throw new Error('E-mail already in use');
    }
};
const checkNIDNotInUse = async (value) => {
    const user = await User.findOne({ where: { NID: value } });
    if (user) {
        throw new Error('National Id already in exist');
    }
};
module.exports = {
    registerSchema: {
        fName: { notEmpty: { errorMessage: 'Name is required' }, },
        NID: {
            notEmpty: { errorMessage: 'National Id is required', bail: true },
            isLength: { options: { min: 9, max: 9 }, errorMessage: 'National Id must be 9 digits', },
            isNumeric: { errorMessage: 'National Id must be a number' },
            custom: { options: checkNIDNotInUse },
        },
        city: { notEmpty: { errorMessage: 'City is required' }, },
        email: {
            notEmpty: { errorMessage: "Email is Required" },
            isEmail: { errorMessage: "Invalid Email" },
            custom: { options: checkEmailNotInUse },
        },
    }
};

