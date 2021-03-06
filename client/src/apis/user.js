import { apiHelper } from '../utils/helpers'

export const getUserProfile = () => {
    return apiHelper.get('/user/profile')
}

export const updateUserProfile = (formData, config) => {
    return apiHelper.patch('/user/profile', formData, config)
}

export const getDeliveryInfo = () => {
    return apiHelper.get('/user/deliveryInfo')
}

export const postDeliveryInfo = formData => {
    return apiHelper.post('/user/deliveryInfo', formData)
}

export const updateDeliveryInfo = (DID, formData) => {
    return apiHelper.patch(`/user/deliveryInfo/${DID}`, formData)
}

export const deleteDeliveryInfo = DID => {
    return apiHelper.delete(`/user/deliveryInfo/${DID}`)
}

export const getUserOrder = () => {
    return apiHelper.get(`/user/order`)
}
