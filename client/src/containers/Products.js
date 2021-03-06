import { React, Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import * as actions from '../store/actions/index'
import SingleItem from '../components/Products/SingleItem'
import { alert, arrayBufferToBase64Img } from '../utils/utilities'
import BreadCrumb from '../components/UI/Breadcrumb'
import Skeleton from 'react-loading-skeleton'
import '../scss/products.scss'

class Products extends Component {
    state = {
        // determine what current page is.
        page: 0,
        gender: null,
        category: null,
    }

    // trigger api handler to get products information from backend.
    getProductsHandler = () => {
        try {
            // take the search query content from url.
            const query = new URLSearchParams(this.props.location.search)
            const pageItemsLimit = 6
            let gender = null
            let category = null

            for (let param of query.entries()) {
                if (param[0] === 'gender') {
                    gender = param[1]
                } else {
                    category = param[1]
                }
            }

            // add one to state.page before every time request the products, until page equal to totalpages.
            this.setState(
                prevState => ({
                    page: prevState.page + 1,
                    gender,
                    category,
                }),
                async () => {
                    await this.props.onGetProducts(gender, category, pageItemsLimit, this.state.page)
                }
            )
        } catch (e) {}
    }

    componentDidMount() {
        // initialize state before page mounting.
        this.setState({ page: 0 }, () => {
            this.props.onInitProducts()
            this.getProductsHandler()
        })
    }

    // if the location.search is different from the previous one, update the page.
    componentDidUpdate(prevProps, prevState) {
        if (this.props.location.search !== prevProps.location.search) {
            this.setState({ page: 0 }, () => {
                this.props.onInitProducts()
                this.getProductsHandler()
            })
        }
    }

    errorAlertHandler = msg => {
        alert
            .fire({
                title: 'Oops...',
                text: msg,
                icon: 'warning',
                iconHtml: '!',
                iconColor: '#2a2c30',
                confirmButtonText: 'redirect to homepage',
            })
            .then(result => {
                if (result.isConfirmed) {
                    this.props.history.push('/')
                }
            })
    }

    render() {
        let products = Array(6)
            .fill()
            .map((item, i) => {
                return (
                    <div key={i} className="single-item-box">
                        <Skeleton width={300} height={190} />
                        <div className="single-item-box-line">
                            <Skeleton width={260} height={25} />
                        </div>
                        <div className="single-item-box-line">
                            <Skeleton width={80} height={25} />
                        </div>
                    </div>
                )
            })
        let moreProductsButton = null

        // if there is a error.
        if (this.props.error) {
            this.errorAlertHandler(this.props.error)
            this.props.history.push('/')
        }

        // if no items return.
        if (this.props.isNoItem) {
            products = (
                <div className="no-item">
                    <h3>There is no items in this category!</h3>
                    <span>Head to another category to find out more items.</span>
                </div>
            )
        }

        // handle products returning.
        if (this.props.products.length > 0) {
            products = this.props.products.map((product, i) => {
                const img = arrayBufferToBase64Img(product.image.data)
                return (
                    <SingleItem
                        key={product._id}
                        _id={product._id}
                        name={product.name}
                        img={img}
                        price={product.price}
                    />
                )
            })

            // determine whether show the more products button or not.
            moreProductsButton =
                this.props.totalPages === 0 || this.state.page === this.props.totalPages ? null : (
                    <button
                        className="button"
                        onClick={() => {
                            this.getProductsHandler()
                        }}
                    >
                        more items
                    </button>
                )
        }

        return (
            <section>
                {this.props.products.length <= 0 && !this.props.isNoItem ? (
                    <div className="breadCrumbWrap">
                        <ul className="breadCrumb">
                            <Skeleton width={170} height={30} />
                        </ul>
                    </div>
                ) : (
                    <BreadCrumb gender={this.state.gender} category={this.state.category} />
                )}

                <div className="products-container">{products}</div>
                {moreProductsButton}
            </section>
        )
    }
}

const mapStateToProps = state => {
    return {
        totalPages: state.products.totalPages,
        products: state.products.products,
        loading: state.products.loading,
        isNoItem: state.products.isNoItem,
        error: state.products.error,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onInitProducts: () => dispatch(actions.initProducts()),
        onGetProducts: (gd, cg, pil, pg) => dispatch(actions.getProducts(gd, cg, pil, pg)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Products))

Products.propTypes = {
    onGetProducts: PropTypes.func,
    onInitProducts: PropTypes.func,
    error: PropTypes.string,
    isNoItem: PropTypes.bool,
    products: PropTypes.array,
    totalPages: PropTypes.number,
}
