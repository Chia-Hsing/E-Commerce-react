import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { icons } from '../../utils/icons'
import '../../scss/product.scss'

const ItemDetail = props => {
    return (
        <>
            <div className="imgContainer">
                <img src={props.img} alt=""></img>
            </div>
            <div className="detailContainer">
                <div>
                    <h4>{props.product.name}</h4>
                    <strong>{props.product.price}</strong>
                </div>
                <div className="detailBody">
                    <select className="sizeSelector" onChange={e => props.getStock(e)}>
                        <option value={-1}> - size - </option>
                        {/* product.stock = [{S: ...},{M: ...},{L: ...}] */}
                        {props.product.stock.map(item => {
                            const size = Object.keys(item)
                            const stock = item[size]
                            return (
                                <option key={size} value={stock}>
                                    {size}
                                </option>
                            )
                        })}
                    </select>

                    {/* props.quantity equal to undefined when first time gets the information from server. */}
                    {props.quantity !== undefined ? (
                        <ul className="productPurchaseController">
                            <li onClick={props.onDeleteProductHandler}>{icons.minus()}</li>
                            <li>
                                <span>{props.quantity}</span>
                            </li>
                            <li onClick={props.onAddProductHandler}>{icons.plus()}</li>
                        </ul>
                    ) : /* props.itemStock equal to -1 which means the selector is on the -size- option. */
                    props.itemStock === -1 ? null : (
                        <button disabled={props.canBePurchased} onClick={props.onAddProductHandler}>
                            {props.itemStock === 0 ? ' out of stock' : 'add to bag'}
                        </button>
                    )}
                    {/* props.realItemStock equal to undefined when first time gets the information from server. */}
                    {props.itemStock <= 0 ? null : props.realItemStock === undefined ? (
                        <span>stock: {props.itemStock}</span>
                    ) : (
                        <span>stock: {props.realItemStock}</span>
                    )}
                </div>
                <p>{props.product.description}</p>
                <div className="goToBag">
                    <Link to="/shopping-bag">check bag</Link>
                </div>
            </div>
        </>
    )
}

export default ItemDetail

ItemDetail.propTypes = {
    img: PropTypes.string,
    product: PropTypes.object,
    itemStock: PropTypes.number,
    realItemStock: PropTypes.number,
    getStock: PropTypes.func,
    quantity: PropTypes.number,
    onDeleteProductHandler: PropTypes.func,
    onAddProductHandler: PropTypes.func,
    canBePurchased: PropTypes.bool,
}
