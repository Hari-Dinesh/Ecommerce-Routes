import * as yup from 'yup';

export const validateLogin = yup.object({
    email: yup.string().email('Email must be a valid email').required('Email is required'),
    password: yup.string()
        .min(3, 'Password must be at least 3 characters')
        .max(30, 'Password must be at most 30 characters')
        .matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/, 'Password must contain only letters, numbers, and special characters')
        .required('Password is required'),
});

export const validateUserRegistration=yup.object({
    name: yup.string().min(3, 'Name must be at least 3 characters').max(30, 'Name must be at most 30 characters').required('Name is required'),
    email: yup.string().email('Email must be a valid email').required('Email is required'),
    password: yup.string().matches(new RegExp('^[a-zA-Z0-9]{3,30}$'), 'Password must be between 3 and 30 characters').required('Password is required'),
    phone: yup.string().min(10, 'Phone must be at least 10 characters').max(12, 'Phone must be at most 12 characters').required('Phone is required'),
    address: yup.string().required('Address is required'),
    gender: yup.string().required('Gender is required')
})
