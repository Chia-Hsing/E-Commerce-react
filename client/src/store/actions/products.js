import * as actionTypes from './actionTypes'
import * as apis from '../../apis/products'

export const initProducts = () => dispatch => {
    dispatch({ type: actionTypes.INIT_PRODUCTS })
}

export const getProducts = (gender, category, pageItemsLimit, page) => async dispatch => {
    try {
        const res = await apis.getProducts(gender, category, pageItemsLimit, page)

        if (res.data.status !== 'success' || res.statusText !== 'OK') {
            return dispatch({ type: actionTypes.GET_PRODUCTS_FAILED, error: res.data.message })
        }

        const {
            data: { productResponse },
        } = res

        dispatch({ type: actionTypes.GET_PRODUCTS_SUCCESS, productResponse })
    } catch (error) {
        dispatch({ type: actionTypes.GET_PRODUCTS_FAILED, error: error.message })
    }
}

export const initProduct = () => dispatch => {
    dispatch({ type: actionTypes.INIT_PRODUCT })
}

export const getProduct = PID => async dispatch => {
    try {
        const res = await apis.getProduct(PID)

        if (res.data.status !== 'success' || res.statusText !== 'OK') {
            return dispatch({ type: actionTypes.GET_PRODUCTS_FAILED, error: res.data.message })
        }

        const {
            data: {
                product: {
                    name,
                    price,
                    description,
                    stock: { S, M, L },
                    image,
                    _id,
                },
            },
        } = res

        let product = { name, price, description, stock: [{ S }, { M }, { L }], image, _id }

        dispatch({ type: actionTypes.GET_PRODUCT_SUCCESS, product })
    } catch (error) {
        dispatch({ type: actionTypes.GET_PRODUCT_FAILED, error: error.message })
    }
}
