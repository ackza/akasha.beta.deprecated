import React, { Component, PropTypes } from 'react';
import r from 'ramda';
import * as Colors from 'material-ui/styles/colors';
import { SvgIcon, IconButton, RaisedButton,
    TextField, Checkbox, Divider } from 'material-ui';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import Avatar from '../../../../../shared-components/Avatar/avatar';
import ImageUploader from '../../../../../shared-components/ImageUploader/image-uploader';
import { inputFieldMethods } from '../../../../../utils/dataModule';
import validationProvider from '../../../../../utils/validationProvider';
import { UserValidation } from '../../../../../utils/validationSchema';
import { injectIntl, FormattedMessage } from 'react-intl';
import CreateProfileHeader from '../../../components/CreateProfileHeader';
import PanelContainer from 'shared-components/PanelContainer/panel-container';
import { profileMessages, formMessages, generalMessages } from 'locale-data/messages';

class CreateProfile extends Component {
    constructor (props) {
        super(props);
        this.getProps = inputFieldMethods.getProps.bind(this);
        this.state = {
            formValues: {},
            links: [
                {
                    title: '',
                    url: '',
                    type: '',
                    id: 0
                }
            ]
        };
        this.validatorTypes = new UserValidation(props.intl).getSchema();
        this.serverValidatedFields = ['userName'];
    }
    componentWillMount () {
        this.setState({ opt_details: false });
    }
    componentDidMount () {
        if (this.firstNameInput) {
            this.firstNameInput.focus();
        }
    }
    getValidatorData = () => this.state.formValues;
    handleShowDetails = () => {
        this.setState({ opt_details: !this.state.opt_details });
    };
    handleSubmit = () => {
        const { profileActions } = this.props;
        const profileData = this.state.formValues;
        const optionalData = {};
        const profileImage = this.imageUploader.getWrappedInstance().getImage();
        const errors = this.props.errors;
        const userLinks = this.state.links.filter(link => link.title.length > 0);
        profileData.password = new TextEncoder('utf-8').encode(this.state.formValues.password);
        profileData.password2 = new TextEncoder('utf-8').encode(this.state.formValues.password2);
        // optional settings
        if (userLinks.length > 0) {
            optionalData.links = userLinks;
        }
        if (profileImage) {
            optionalData.coverImage = profileImage;
        }
        if (this.state.about) {
            optionalData.about = this.state.about;
        }
        // check for remaining errors
        Object.keys(errors).forEach(errKey => {
            if (errors[errKey].length > 0) {
                return;
            }
        });
        // save a temporary profile to indexedDB
        // console.log(profileData);
        // console.log('profile creation is disabled for testing purposes!!')
        // return;
        this.avatar.getImage().then(uintArr => {
            if (uintArr) {
                optionalData.avatar = uintArr;
            }
            profileData.optionalData = optionalData;
            return profileData;
        }).then(() =>
            profileActions.createTempProfile(profileData, {
                currentStep: 0,
                status: 'finished',
                message: 'Profile creation started!'
            })
        )
            .then(() => this.context.router.push('new-profile-status'));
    };
    _submitForm = (ev) => {
        ev.preventDefault();
        this.handleSubmit();
    };
    _handleCancel = (ev) => {
        ev.preventDefault();
        this.profileForm.reset();
        this.context.router.goBack();
    };
    _handleAddLink = () => {
        const currentLinks = this.state.links.slice();
        const notEmpty = this._checkLinks();

        if (!notEmpty) {
            currentLinks.push({
                title: '',
                url: '',
                type: '',
                id: currentLinks.length
            });
            this.setState({
                links: currentLinks
            });
        }
    };
    _handleRemoveLink = (linkId) => {
        let links = this.state.links;
        if (this.state.links.length > 1) {
            links = r.reject((link) => link.id === linkId, links);
        }
        for (let i = 0; i < links.length; i++) {
            links[i].id = i;
        }
        this.setState({
            links
        });
    };
    _checkLinks = () =>
        this.state.links.every(link =>
            Object.keys(link).forEach((key) =>
                (key !== 'id' && key !== 'type' && link[key].length !== 0)
            )
        );

    _handleLinkChange = (field, linkId, ev) => {
        const links = r.clone(this.state.links);
        const fieldValue = ev.target.value;
        const index = r.findIndex(r.propEq('id', linkId))(links);
        const link = links[index];
        link[field] = fieldValue;
        if (field === 'url') {
            if (field.indexOf('akasha://')) {
                link.type = 'internal';
            } else {
                link.type = 'other';
            }
        }
        links[index] = link;
        this.setState({ links });
    };
    _handleAboutChange = (ev) => {
        this.setState({
            about: ev.target.value
        });
    };
    _handleModalShow = (ev, modalName) => {
        ev.preventDefault();
        console.log('show modal ', modalName);
    };
    render () {
        const { intl } = this.props;
        const floatLabelStyle = { color: Colors.lightBlack };
        const inputStyle = { color: Colors.darkBlack };
        const firstNameProps = this.getProps({
            floatingLabelText: intl.formatMessage(formMessages.firstName),
            ref: (firstNameInput) => { this.firstNameInput = firstNameInput; },
            floatingLabelStyle: floatLabelStyle,
            inputStyle: { inputStyle },
            style: { width: '210px', verticalAlign: 'middle' },
            statePath: 'formValues.firstName',
            required: true,
            addValueLink: true,
            onBlur: this.props.handleValidation('formValues.firstName')
        });

        const lastNameProps = this.getProps({
            floatingLabelStyle: floatLabelStyle,
            floatingLabelText: intl.formatMessage(formMessages.lastName),
            inputStyle: { inputStyle },
            style: { width: '210px', marginLeft: '20px', verticalAlign: 'middle' },
            statePath: 'formValues.lastName',
            required: true,
            addValueLink: true,
            onBlur: this.props.handleValidation('formValues.lastName')
        });

        const userNameProps = this.getProps({
            fullWidth: true,
            inputStyle: { inputStyle },
            style: { verticalAlign: 'middle' },
            floatingLabelText: intl.formatMessage(formMessages.userName),
            floatingLabelStyle: floatLabelStyle,
            required: true,
            addValueLink: true,
            statePath: 'formValues.userName',
            onTextChange: this.props.handleValidation('formValues.userName')
        });

        const passwordProps = this.getProps({
            type: 'password',
            fullWidth: true,
            inputStyle: { inputStyle },
            style: { verticalAlign: 'middle' },
            floatingLabelText: intl.formatMessage(formMessages.password),
            floatingLabelStyle: floatLabelStyle,
            required: true,
            addValueLink: true,
            statePath: 'formValues.password',
            onBlur: this.props.handleValidation('formValues.password')
        });

        const password2Props = this.getProps({
            type: 'password',
            fullWidth: true,
            inputStyle: { inputStyle },
            style: { verticalAlign: 'middle' },
            floatingLabelText: intl.formatMessage(formMessages.passwordVerify),
            floatingLabelStyle: floatLabelStyle,
            required: true,
            addValueLink: true,
            statePath: 'formValues.password2',
            onBlur: this.props.handleValidation('formValues.password2')
        });

        return (
          <PanelContainer
            showBorder
            actions={[
              <RaisedButton
                key="cancel"
                label={intl.formatMessage(generalMessages.cancel)}
                type="reset"
                onClick={this._handleCancel}
              />,
              <RaisedButton
                key="submit"
                label={intl.formatMessage(generalMessages.submit)}
                type="submit"
                onClick={this._submitForm}
                style={{ marginLeft: 8 }}
                disabled={this.state.submitting}
                primary
              />
            ]}
            header={<CreateProfileHeader title={profileMessages.createProfileTitle} />}
          >
            <form
              action=""
              onSubmit={this.handleSubmit}
              ref={(profileForm) => this.profileForm = profileForm}
            >
              <TextField {...firstNameProps} />
              <TextField {...lastNameProps} />
              <TextField {...userNameProps} />
              <TextField {...passwordProps} />
              <TextField {...password2Props} />
              <Checkbox
                label={intl.formatMessage(profileMessages.optionalDetailsLabel)}
                style={{ marginTop: '18px', marginLeft: '-4px' }}
                checked={this.state.opt_details}
                onCheck={this.handleShowDetails}
              />
              <div style={{ display: this.state.opt_details ? 'block' : 'none' }} >
                <h3 style={{ margin: '30px 0 10px 0' }} >
                  {intl.formatMessage(profileMessages.avatarTitle)}
                </h3>
                <div>
                  <Avatar
                    editable
                    ref={(avatar) => { this.avatar = avatar; }}
                  />
                </div>
                <h3 style={{ margin: '20px 0 10px 0' }} >
                  {intl.formatMessage(profileMessages.backgroundImageTitle)}
                </h3>
                <ImageUploader
                  ref={(imageUploader) => { this.imageUploader = imageUploader; }}
                  minHeight={350}
                  minWidth={672}
                />
                <h3 style={{ margin: '20px 0 0 0' }} >
                  {intl.formatMessage(profileMessages.aboutYouTitle)}
                </h3>
                <TextField
                  fullWidth
                  floatingLabelText={
                    intl.formatMessage(profileMessages.shortDescriptionLabel)
                  }
                  multiLine
                  value={this.state.about}
                  floatingLabelStyle={floatLabelStyle}
                  onChange={this._handleAboutChange}
                />
                <div className="row" style={{ margin: '20px 0 0 0' }}>
                  <h3 className="col-xs-10">
                    {intl.formatMessage(profileMessages.linksTitle)}
                  </h3>
                  <div className="col-xs-2 end-xs">
                    <IconButton
                      title={intl.formatMessage(profileMessages.addLinkButtonTitle)}
                      onClick={this._handleAddLink}
                    >
                      <SvgIcon >
                        <ContentAddIcon
                          color={this.context.muiTheme.palette.primary1Color}
                        />
                      </SvgIcon>
                    </IconButton>
                  </div>
                </div>
                {this.state.links.map((link, key) =>
                  <div key={key} className="row">
                    <div className="col-xs-10">
                      <TextField
                        autoFocus={(this.state.links.length - 1) === key}
                        fullWidth
                        floatingLabelText={intl.formatMessage(formMessages.title)}
                        value={link.title}
                        floatingLabelStyle={floatLabelStyle}
                        onChange={(ev) => this._handleLinkChange('title', link.id, ev)}
                      />
                      <TextField
                        fullWidth
                        floatingLabelText={intl.formatMessage(formMessages.url)}
                        value={link.url}
                        floatingLabelStyle={floatLabelStyle}
                        onChange={(ev) => this._handleLinkChange('url', link.id, ev)}
                      />
                    </div>
                    {this.state.links.length > 1 &&
                      <div className="col-xs-2 center-xs">
                        <IconButton
                          title={intl.formatMessage(profileMessages.removeLinkButtonTitle)}
                          style={{ marginTop: '24px' }}
                          onClick={(ev) => this._handleRemoveLink(link.id, ev)}
                        >
                          <SvgIcon >
                            <CancelIcon />
                          </SvgIcon>
                        </IconButton>
                      </div>
                    }
                    {this.state.links.length > 1 &&
                      <Divider
                        style={{ marginTop: '16px' }}
                        className="col-xs-12"
                      />
                    }
                  </div>
                )}
              </div>
              <small>
                <FormattedMessage
                  {...profileMessages.terms}
                  values={{
                      termsLink: (
                        <a
                          href="/terms"
                          onClick={(ev) => this._handleModalShow(ev, 'termsOfService')}
                        >
                          {intl.formatMessage(generalMessages.termsOfService)}
                        </a>
                      ),
                      privacyLink: (
                        <a
                          href="/privacy"
                          onClick={(ev) => this._handleModalShow(ev, 'privacyPolicy')}
                        >
                          {intl.formatMessage(generalMessages.privacyPolicy)}
                        </a>
                      )
                  }}
                />
              </small>
            </form>
          </PanelContainer>
        );
    }
}

CreateProfile.propTypes = {
    profileState: PropTypes.object.isRequired,
    style: PropTypes.object,
    validate: React.PropTypes.func,
    errors: React.PropTypes.object,
    isValid: React.PropTypes.func,
    profileActions: React.PropTypes.object,
    getValidationMessages: React.PropTypes.func,
    clearValidations: React.PropTypes.func,
    handleValidation: React.PropTypes.func,
    handleServerValidation: React.PropTypes.func,
    intl: React.PropTypes.object
};

CreateProfile.contextTypes = {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
};

CreateProfile.defaultProps = {
    style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    }
};

export default injectIntl(validationProvider(CreateProfile));