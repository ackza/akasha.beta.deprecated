import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { injectIntl, FormattedMessage } from 'react-intl';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import { Row, Col, Input, Button, Form, Select } from 'antd';
import * as actionTypes from '../../constants/action-types';
import { AvatarEditor, ImageUploader } from '../';
import { profileMessages, formMessages,
    generalMessages, validationMessages } from '../../locale-data/messages';
import { getProfileSchema } from '../../utils/validationSchema';
import { uploadImage } from '../../local-flux/services/utils-service';

const FormItem = Form.Item;
const { Option } = Select;

class ProfileEditForm extends Component {
    constructor (props) {
        super(props);
        this.state = {
            akashaIdIsValid: true,
            akashaIdExists: false
        };
        this.validatorTypes = getProfileSchema(props.intl, { isUpdate: props.isUpdate });
        this.showErrorOnFields = [];
        this.isSubmitting = false;
    }
    getValidatorData = () => this.props.tempProfile.toJS();
    componentWillReceiveProps (nextProps) {
        const { isUpdate, tempProfile } = nextProps;
        // we need to enable update temp profile button only if something has changed
        // so we need to keep a ref to old temp profile.
        if (isUpdate && tempProfile.akashaId !== this.props.tempProfile.akashaId) {
            this.refTempProfile = tempProfile;
        }
    }

    _showTerms = (ev) => {
        ev.preventDefault();
        const { onTermsShow } = this.props;
        if (onTermsShow) return onTermsShow();
        return null;
    }

    _handleAddLink = linkType => () => {
        const { tempProfile } = this.props;
        const links = tempProfile.get(linkType);
        let updatedTempProfile;
        const lastLink = links.last();
        if (lastLink) {
            if (linkType === 'links' &&
                (lastLink.get('title').length === 0 || lastLink.get('url').length === 0)) {
                return null;
            }
        }
        if (linkType === 'links') {
            updatedTempProfile = tempProfile.setIn([linkType],
                links.push(new Map({
                    title: '',
                    url: '',
                    type: '',
                    id: links.size > 0 ? (links.last().get('id') + 1) : 1
                })));
        }
        return this.props.onProfileUpdate(updatedTempProfile);
    };

    _handleLinkChange = (linkType, field, linkId) => {
        const { tempProfile } = this.props;
        const links = tempProfile.get(linkType);
        const index = links.findIndex(link => link.get('id') === linkId);
        return (ev) => {
            const updatedLinks = links.setIn([index, field], ev.target.value);
            const updatedTempProfile = tempProfile.setIn([linkType], updatedLinks);
            this.props.onProfileUpdate(updatedTempProfile);
        };
    }

    _handleRemoveLink = (linkId, linkType) => {
        const { tempProfile, onProfileUpdate } = this.props;
        const links = tempProfile.get(linkType);
        return () => {
            onProfileUpdate(
                tempProfile.setIn([linkType],
                    links.filter(link => link.get('id') !== linkId)
                )
            );
        };
    }

    _handleFieldChange = (field) => {
        const { tempProfile, onProfileUpdate } = this.props;
        return (ev) => {
            onProfileUpdate(tempProfile.setIn([field], ev.target.value));
        };
    }

    _handleResponse = (resp) => {
        const { idValid, exists, } = resp.data;
        if (resp.error) {
            this.setState({
                error: `Unknown error ${resp.error}`
            });
            return;
        }
        this.setState({
            akashaIdIsValid: idValid,
            akashaIdExists: exists
        });
    }

    _validateAkashaId = (akashaId) => {
        const serverChannel = window.Channel.server.registry.profileExists;
        const clientChannel = window.Channel.client.registry.profileExists;
        if (!this.idVerifyChannelEnabled) {
            serverChannel.enable();
            this.idVerifyChannelEnabled = true;
        }
        // one listener is auto attached on application start
        // we need to attach another one with the provided handler
        if (clientChannel.listenerCount <= 1) {
            clientChannel.on((ev, data) => this._handleResponse(data));
        }
        serverChannel.send({ akashaId });
    }

    _onValidate = field => (err) => {
        if (err) {
            this.setState({
                formHasErrors: true
            });
        } else {
            this.setState({
                formHasErrors: false
            });
        }
        // validation passed
        if (field === 'akashaId') {
            this._validateAkashaId(this.props.tempProfile.get('akashaId'));
        }
    }

    _validateField = (field, index, sub) =>
        () => {
            if (!this.showErrorOnFields.includes(field)) {
                this.showErrorOnFields.push(field);
            }
            if (field === 'links') {
                return this.props.validate(this._onValidate(field[index][sub]));
            }
            return this.props.validate(this._onValidate(field));
        };

    _getErrorMessages = (field, index, sub) => {
        const { getValidationMessages } = this.props;
        if (this.showErrorOnFields.includes(field) && !this.isSubmitting) {
            if (field === 'links') {
                const errors = getValidationMessages(field)[index];
                if (errors && errors[sub]) {
                    return errors[sub][0];
                }
                return null;
            }
            return getValidationMessages(field)[0];
        }
        return null;
    }
    // server validated akashaId errors must have higher priority
    _getAkashaIdErrors = () => {
        const { intl } = this.props;
        const { akashaIdIsValid, akashaIdExists } = this.state;
        if (!akashaIdIsValid) {
            return intl.formatMessage(validationMessages.akashaIdNotValid);
        }
        if (akashaIdExists) {
            return intl.formatMessage(validationMessages.akashaIdExists);
        }
        if (this._getErrorMessages('akashaId')) {
            return this._getErrorMessages('akashaId');
        }
        return null;
    }

    _handleCancel = () => {
        const { onCancel } = this.props;
        if (typeof onCancel === 'function') {
            onCancel();
        }
    }

    _handleAvatarClear = () => {
        const { tempProfile, onProfileUpdate } = this.props;
        onProfileUpdate(
            tempProfile.set('avatar', null)
        );
    }

    _handleAvatarAdd = () => {
        const { tempProfile, onProfileUpdate } = this.props;
        this.avatar.getImage().then(avatar =>
            onProfileUpdate(
                tempProfile.set('avatar', avatar)
            )
        );
    }

    _handleBackgroundClear = () => {
        const { tempProfile, onProfileUpdate } = this.props;
        onProfileUpdate(
            tempProfile.set('backgroundImage', new Map())
        );
    }

    _handleBackgroundChange = (bgImageObj) => {
        const { tempProfile, onProfileUpdate } = this.props;
        uploadImage(bgImageObj).then((bgImageObjIpfs) => {
            onProfileUpdate(
                tempProfile.set('backgroundImage', bgImageObjIpfs));
        });
    }

    _handleSave = () => {
        const { tempProfile } = this.props;
        this.props.tempProfileCreate(tempProfile);
    }

    _handleSubmit = (ev) => {
        ev.preventDefault();
        const { isUpdate, tempProfile, actionAdd } = this.props;

        this.props.validate((err) => {
            if (err) {
                this.showErrorOnFields = this.showErrorOnFields.concat(Object.keys(err));
                this.forceUpdate();
                console.error(err);
                return;
            }
            this.isSubmitting = true;
            if (this.state.akashaIdIsValid && !this.state.akashaIdExists) {
                const actionType = isUpdate ?
                    actionTypes.profileUpdate :
                    actionTypes.profileRegister;
                const ethAddress = tempProfile.get('ethAddress');
                const data = tempProfile ? tempProfile.toJS() : null;
                actionAdd(ethAddress, actionType, data);
            }
        });
    }


    render () {
        const { intl, isUpdate, tempProfile } = this.props;
        const { akashaId, firstName, lastName, about, links, avatar, backgroundImage,
            baseUrl } = tempProfile;
        const { formatMessage } = intl;

        return (
          <div className="profile-edit-form__wrap">
            <div className="profile-edit-form__form-wrapper">
              <Row type="flex" className="">
                <Form
                  action=""
                  style={{ width: '100%' }}
                  onSubmit={this._handleSubmit}
                >
                  <Col type="flex" md={24}>
                    <Col md={8}>
                      <div className="row">
                        <p className="col-xs-12">
                          {intl.formatMessage(profileMessages.avatarTitle)}
                        </p>
                        <div className="col-xs-12 center-xs">
                          <AvatarEditor
                            editable
                            ref={(avtr) => { this.avatar = avtr; }}
                            image={avatar}
                            onImageAdd={this._handleAvatarAdd}
                            onImageClear={this._handleAvatarClear}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col md={24}>
                      <div className="row profile-edit-form__bg-image">
                        <p className="col-xs-12" >
                          {intl.formatMessage(profileMessages.backgroundImageTitle)}
                        </p>
                        <div className="col-xs-12">
                          <ImageUploader
                            ref={(imageUploader) => { this.imageUploader = imageUploader; }}
                            minWidth={360}
                            intl={intl}
                            initialImage={backgroundImage}
                            baseUrl={baseUrl}
                            onImageClear={this._handleBackgroundClear}
                            onChange={this._handleBackgroundChange}
                          />
                        </div>
                      </div>
                    </Col>
                  </Col>
                  <Col md={24}>
                    <FormItem
                      label={formatMessage(formMessages.akashaId)}
                      colon={false}
                      hasFeedback
                      validateStatus={this._getAkashaIdErrors('akashaId') ? 'error' : 'success'}
                      help={this._getAkashaIdErrors('akashaId')}
                      style={{ marginRight: 8 }}
                    >
                      <Input
                        value={akashaId}
                        onChange={this._handleFieldChange('akashaId')}
                        onBlur={this._validateField('akashaId')}
                        disabled={isUpdate}
                      />
                    </FormItem>
                  </Col>
                  <Col md={12}>
                    <FormItem
                      label={formatMessage(formMessages.firstName)}
                      colon={false}
                      hasFeedback
                      validateStatus={this._getErrorMessages('firstName') ? 'error' : 'success'}
                      help={this._getErrorMessages('firstName')}
                      style={{ marginRight: 8 }}
                    >
                      <Input
                        value={firstName}
                        onChange={this._handleFieldChange('firstName')}
                        onBlur={this._validateField('firstName')}
                      />
                    </FormItem>
                  </Col>
                  <Col md={12}>
                    <FormItem
                      label={formatMessage(formMessages.lastName)}
                      colon={false}
                      hasFeedback
                      validateStatus={this._getErrorMessages('lastName') ? 'error' : 'success'}
                      help={this._getErrorMessages('lastName')}
                      style={{ marginLeft: 8 }}
                    >
                      <Input
                        value={lastName}
                        onChange={this._handleFieldChange('lastName')}
                        onBlur={this._validateField('lastName')}
                      />
                    </FormItem>
                  </Col>
                  <Col md={24}>
                    <FormItem
                      label={intl.formatMessage(profileMessages.aboutMeTitle)}
                      colon={false}
                    >
                      <Input.TextArea
                        rows={2}
                        placeholder={intl.formatMessage(profileMessages.shortDescriptionLabel)}
                        value={about}
                        onChange={this._handleFieldChange('about')}
                        autosize={{ minRows: 2 }}
                      />
                    </FormItem>
                  </Col>
                  <Col md={24}>
                    <h3 className="col-xs-10 profile-edit-form__links">
                      {intl.formatMessage(profileMessages.linksTitle)}
                    </h3>
                    {links.map((link, index) => (
                      <div key={`${index + 1}`}>
                        <FormItem
                          label={intl.formatMessage(formMessages.title)}
                          colon={false}
                          hasFeedback
                          validateStatus={this._getErrorMessages('links', index, 'title') ? 'error' : 'success'}
                          help={this._getErrorMessages('links', index, 'title')}
                        >
                          <Input
                            value={link.get('title')}
                            onChange={this._handleLinkChange('links', 'title', link.get('id'))}
                            onBlur={this._validateField('links', index, 'title')}
                          />
                        </FormItem>
                        <FormItem
                          label={intl.formatMessage(formMessages.url)}
                          colon={false}
                          hasFeedback
                          validateStatus={this._getErrorMessages('links', index, 'url') ? 'error' : 'success'}
                          help={this._getErrorMessages('links', index, 'url')}
                        >
                          <Input
                            value={link.get('url')}
                            style={{ width: '100%' }}
                            onChange={this._handleLinkChange('links', 'url', link.get('id'))}
                            onBlur={this._validateField('links', index, 'url')}
                          />
                        </FormItem>
                        <Button
                          type="primary"
                          icon="close-circle"
                          ghost
                          onClick={this._handleRemoveLink(link.get('id'), 'links')}
                        >{intl.formatMessage(profileMessages.removeLinkButtonTitle)}</Button>
                      </div>
                        ))}
                    <div className="col-xs-2 end-xs profile-edit-form__add-links-btn">
                      <Button
                        icon="plus"
                        type="primary borderless"
                        onClick={this._handleAddLink('links')}
                        title={intl.formatMessage(profileMessages.addLinkButtonTitle)}
                        ghost
                        style={{ border: 'none' }}
                      >Add more</Button>
                    </div>
                  </Col>
                  {!isUpdate &&
                  <Col md={24}>
                    <small className="profile-edit-form__terms">
                      <FormattedMessage
                        {...generalMessages.terms}
                        values={{
                            termsLink: (
                              <a
                                href="/terms"
                                onClick={this._showTerms}
                              >
                                {intl.formatMessage(generalMessages.termsOfService)}
                              </a>
                            )
                        }}
                      />
                    </small>
                  </Col>
                }
                </Form>
              </Row>
            </div>
            <div className="profile-edit-form__buttons-wrapper">
              <div className="profile-edit-form__save-btn">
                <Button
                  size="large"
                  onClick={this._handleSave}
                >
                  {intl.formatMessage(profileMessages.saveForLater)}
                </Button>
              </div>
              <div className="profile-edit-form__update-btn">
                <Button
                  type="primary"
                  onClick={this._handleSubmit}
                  size="large"
                >
                  {isUpdate ?
                        intl.formatMessage(profileMessages.updateProfile) :
                        intl.formatMessage(profileMessages.registerProfile)
                    }
                </Button>
              </div>
            </div>
          </div>
        );
    }
}

ProfileEditForm.propTypes = {
    actionAdd: PropTypes.func,
    form: PropTypes.shape(),
    getValidationMessages: PropTypes.func,
    intl: PropTypes.shape(),
    isUpdate: PropTypes.bool,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    onProfileUpdate: PropTypes.func.isRequired,
    onTermsShow: PropTypes.func,
    style: PropTypes.shape(),
    tempProfile: PropTypes.shape(),
    tempProfileCreate: PropTypes.func,
    validate: PropTypes.func,
};

const validationHOC = validation(strategy());

export default injectIntl(
    Form.create()(validationHOC(ProfileEditForm))
);