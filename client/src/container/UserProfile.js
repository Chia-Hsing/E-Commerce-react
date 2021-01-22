import React, { Component } from 'react'
import { connect } from 'react-redux'

import UserProfileCard from '../components/User/UserProfileCard'
import FileUploader from '../components/UI/FileUploader'
import Input from '../components/UI/Input'
import * as actions from '../store/actions/index'
import { updateObj, checkValidity, arrayBufferToBase64Img } from '../utils/utilities'
import '../scss/userProfile.scss'

class UserProfile extends Component {
    state = {
        controls: {
            name: {
                eleType: 'input',
                eleConfig: {
                    type: 'text',
                    placeholder: ' ',
                },
                val: '',
                validation: {
                    isRequired: true,
                },
                valid: false,
                touched: false,
            },
            email: {
                eleType: 'input',
                eleConfig: {
                    type: 'email',
                    placeholder: ' ',
                },
                val: '',
                validation: {
                    isRequired: true,
                    isEmail: true,
                },
                valid: false,
                touched: false,
            },
            phone: {
                eleType: 'input',
                eleConfig: {
                    type: 'text',
                    placeholder: ' ',
                },
                val: '',
                validation: {
                    isRequired: true,
                    isPhone: true,
                },
                valid: false,
                touched: false,
            },
            address: {
                eleType: 'input',
                eleConfig: {
                    type: 'text',
                    placeholder: ' ',
                },
                val: '',
                validation: {
                    isRequired: true,
                },
                valid: false,
                touched: false,
            },
            city: {
                eleType: 'input',
                eleConfig: {
                    type: 'text',
                    placeholder: ' ',
                },
                val: '',
                validation: {
                    isRequired: true,
                },
                valid: false,
                touched: false,
            },
            postalCode: {
                eleType: 'input',
                eleConfig: {
                    type: 'text',
                    placeholder: ' ',
                },
                val: '',
                validation: {
                    isRequired: true,
                    isPostalCode: true,
                },
                valid: false,
                touched: false,
            },
        },
        avatarPreview: '',
    }

    async componentDidMount() {
        await this.props.onGetUserProfile()

        const update = updateObj(this.state.controls, {
            name: { ...this.state.controls.name, val: this.props.userProfile.name || '' },
            email: { ...this.state.controls.email, val: this.props.userProfile.email || '' },
            phone: { ...this.state.controls.phone, val: this.props.userProfile.phone || '' },
            address: { ...this.state.controls.address, val: this.props.userProfile.address || '' },
            city: { ...this.state.controls.city, val: this.props.userProfile.city || '' },
            postalCode: { ...this.state.controls.postalCode, val: this.props.userProfile.postalCode || '' },
        })

        this.setState({ controls: update })
    }

    inputChangeHandler = (e, controlName) => {
        const updatedControls = updateObj(this.state.controls, {
            [controlName]: updateObj(this.state.controls[controlName], {
                val: e.target.value,
                valid: checkValidity(e.target.value, this.state.controls[controlName].validation),
                touched: true,
            }),
        })

        this.setState({ controls: updatedControls })
    }

    submitHandler = e => {
        const target = e.target

        var formData = new FormData(target)

        const stateKeys = ['name', 'email', 'phone', 'address', 'city', 'postalCode']

        stateKeys.forEach(stateKey => {
            formData.set([stateKey], this.state.controls[stateKey].val)
        })

        const config = {
            headers: { 'content-type': 'multipart/form-data' },
        }

        this.props.onUpdateUserProfile(formData, config)
    }

    uploadImgHandler = files => {
        if (files.length <= 0) return
        const url = URL.createObjectURL(files[0])
        this.setState({ avatarPreview: url })
    }

    render() {
        let formElement = []

        for (let key in this.state.controls) {
            formElement.push({
                key,
                config: this.state.controls[key],
            })
        }

        const form = formElement.map(ele => {
            return (
                <Input
                    error={this.props.error}
                    key={ele.key}
                    label={ele.key}
                    value={ele.config.val}
                    type={ele.config.eleType}
                    config={ele.config.eleConfig}
                    isValid={ele.config.valid}
                    touched={ele.config.touched}
                    shouldValidate={ele.config.validation}
                    inputChange={e => this.inputChangeHandler(e, ele.key)}
                />
            )
        })

        let avatarImg = null
        let avatarPreview = null

        if (this.props.userProfile.avatar) {
            const imgBuffer = this.props.userProfile.avatar.data
            avatarImg = arrayBufferToBase64Img(imgBuffer)

            if (this.state.avatarPreview) {
                avatarPreview = this.state.avatarPreview
            } else {
                avatarPreview = avatarImg
            }
        } else {
            avatarImg = 'https://i.pinimg.com/564x/a6/f3/c5/a6f3c55ace829310723adcb7a468869b.jpg'

            if (this.state.avatarPreview) {
                avatarPreview = this.state.avatarPreview
            } else {
                avatarPreview = avatarImg
            }
        }

        const userProfileCard = <UserProfileCard avatar={avatarImg} name={this.props.userProfile.name} />

        const avatarUpload = <FileUploader img={avatarPreview} fileChange={files => this.uploadImgHandler(files)} />

        return (
            <section className="userContainer">
                {userProfileCard}
                <form onSubmit={this.submitHandler} className="userProfileDetail">
                    {form}
                    {avatarUpload}
                    <button>Update</button>
                </form>
            </section>
        )
    }
}

const mapStateToProps = state => {
    return {
        userProfile: state.user.userProfile,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetUserProfile: () => dispatch(actions.getUserProfile()),
        onUpdateUserProfile: (formData, config) => dispatch(actions.updateUserProfile(formData, config)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)