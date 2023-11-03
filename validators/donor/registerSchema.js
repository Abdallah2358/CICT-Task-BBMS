const db = require('../../database/models');
const Donor = db.Donor;

const checkEmailNotInUse = async (value) => {
    const donor = await Donor.findOne({ where: { email: value } });
    if (donor) {
        throw new Error('E-mail already in use');
    }
};
const checkNationalIdNotInUse = async (value) => {
    const donor = await Donor.findOne({ where: { national_id: value } });
    if (donor) {
        throw new Error('National Id already in exist');
    }
};
module.exports = {
    registerSchema: {
        full_name: { notEmpty: { errorMessage: 'Name is required' }, },
        national_id: {
            notEmpty: { errorMessage: 'National Id is required' },
            isLength: { options: { min: 9, max: 9 }, errorMessage: 'National Id must be 9 digits', },
            isNumeric: { errorMessage: 'National Id must be a number' },
            custom: { options: checkNationalIdNotInUse },
        },
        city_id: { notEmpty: { errorMessage: 'City is required' }, },
        email: {
            notEmpty: { errorMessage: "Email is Required" },
            isEmail: { errorMessage: "Invalid Email" },
            custom: { options: checkEmailNotInUse },
        },
        blood_type_id: {
            notEmpty: { errorMessage: 'Blood Type is required' }
        },
    }
};

