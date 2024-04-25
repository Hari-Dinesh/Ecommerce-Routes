import * as yup from 'yup';
export const validate_date = yup.object({
    date:yup.date().required('Date is required'),
    trip_status:yup.string().oneOf(['COMPLETED', 'RIDER_CANCELLED', 'DRIVER_CANCELLED']).required('Trip status is required'),
});