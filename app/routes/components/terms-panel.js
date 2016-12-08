import React, { Component, PropTypes } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { IconButton } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import PanelContainer from 'shared-components/PanelContainer/panel-container';
import { akashaTerms } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions

const TermsPanel = ({ hideTerms }) => (
  <div>
    <PanelContainer
      showBorder
      title={
        <FormattedMessage
          id="app.terms.title"
          description="AKASHA`s terms and conditions title"
          defaultMessage="AKASHA: Terms of Service"
        />
              }
      subTitle={
        <div style={{ textAlign: 'right' }}>
          <IconButton onClick={hideTerms}>
            <CloseIcon />
          </IconButton>
        </div>
              }
      style={{
          left: '50%',
          marginLeft: '-320px',
          position: 'fixed',
          top: 0,
          bottom: 0,
          zIndex: 16
      }}
    >
      <div>
        <div>
          <FormattedHTMLMessage
            id="app.terms.preface"
            description="AKASHA`s terms preface"
            defaultMessage={`<p>1 AKASHA is a next-generation social blogging network powered by a new kind of computer known as Ethereum and the Inter Planetary File System.</p>
                        <p>2 By using AKASHA and creating an AKASHA Identity or a Profile Smart Contract, you confirm to have carefully reviewed and to fully understand and agree to the terms and conditions set forth in this document (the “Terms”).</p>
                        <p>3 Because the current version of AKASHA is a Pre-Alpha-Release only, we may ask you to review and accept new or supplemental terms that apply to your interaction with AKASHA and newly introduced functionalities in the future.</p>
                        <p>4 Prior to installing AKAHSA, please ensure that you have downloaded the .zip file by using the pre-alpha invites directly sent out by AKASHA. Unpacking / installing any other files may involve substantial security risks.</p>`
                    }
          />
        </div>
        <h2>
          <FormattedMessage
            id="app.terms.privacyTitle"
            description="privacy section title"
            defaultMessage={'1. Privacy'}
          />
        </h2>
        <div>
          <FormattedHTMLMessage
            id="app.terms.privacyBody"
            description="privacy section content"
            defaultMessage={'<p>5 Your privacy is very important to us which distinguishes AKASHA from any known Social Media Network. We designed AKASHA in a way that you remain in control of how you share your data with others. AKASHA will not collect and use your content and information for any other purposes than chosen by you.</p>'}
          />
        </div>
        <h2>
          <FormattedMessage
            id="app.terms.sharingYourContentTitle"
            description="sharing content section title"
            defaultMessage={'2. Sharing Your Content and Information'}
          />
        </h2>
        <div>
          <FormattedHTMLMessage
            id="app.terms.sharingYourContentBody"
            description="content of sharing your content section"
            defaultMessage={`<p>6 You own all of the content and information you post on AKASHA. AKASHA allows you to control your content and how it is shared through your AKASHA settings.</p>
                        <p>7 For content that is covered by intellectual property rights, like photos, text and videos (IP Content), you have the possibility to choose between different Licence Options (covering a spectrum from all rights reserved to no rights reserved) allowing you the specify how and under what conditions your content may be used by others.</p>
                        <p>8 By publishing your IP Content on AKASHA, you grant AKASHA non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use the IP content for the purpose of its publication on AKASHA and subject to the conditions specified by you in the Licence Options.</p>
                        <p>9 You are aware that AKASHA is a decentralized application and that, consequently, content published on AKASHA is not under control of any legal entity or private individual. Accordingly, you may not fully delete any content published from the AKASHA Platform. When you remove content, your content is only delisted and harder to find for others. However, you understand that removed content persist without any time limitation and may still be available to others.</p>
                        <p>10 When you publish content using the setting “No rights reserved” in the License Option, it means that you are allowing everyone to access and use that content, to associate it with you (i.e., your name and profile picture) and that you wave all your copyrights and related rights to this content.</p>`
                    }
          />
        </div>
        <h2>
          <FormattedMessage
            id="app.terms.noUnlawfulTitle"
            description="no unlawful activities and content section title"
            defaultMessage={'3. No unlawful activities and content'}
          />
        </h2>
        <div>
          <FormattedHTMLMessage
            id="app.terms.noUnlawfulBody"
            description="no unlawful activities and content section body"
            defaultMessage={`<p>11 You are aware that AKASHA is a fully decentralized platform that is not under control of any legal entity or private individual. AKASHA has no knowledge of and no means to control whether any content published on AKASHA violates any third party intellectual property rights or is illegal under the laws of certain jurisdictions. Accordingly, the success of AKASHA relies in the responsibility of each User. By using AKASHA you commit to keep AKASHA clean from any unlawful content and activities. In particular:<br>
                            <p>§  You will not solicit login information or access a Profile belonging to someone else.</p>
                            <p>§  You will not bully, intimidate or harass any other User.</p>
                            <p>§  You will not post content that is hate speech, threatening, incites violence.</p>
                            <p>§  You will not use AKASHA to do anything unlawful in your jurisdiction or in Switzerland.</p>
                            <p>§  You will not use AKASHA to do anything misleading, malicious or discriminatory.</p>
                            <p>§  You will not post content or take any action on AKASHA that infringes or violates someone else's rights or otherwise violates the law.</p></p>
                        <p>12 It is envisaged that updated versions of AKASHA will contain functionalities which enable the AKASHA Community to self moderate the content published on the platform without direct involvement from AKASHA International GmbH.</p>`
                    }
          />
        </div>
        <h2>
          <FormattedMessage
            id="app.terms.registrationTitle"
            description="registration and identity section title"
            defaultMessage={'4. Registration and Identity'}
          />
        </h2>
        <div>
          <FormattedHTMLMessage
            id="app.terms.registrationBody"
            description="registration and identity section content"
            defaultMessage={'<p>13 AKASHA is all about privacy. You may create an Identity using the credentials of your choice or maintain multiple Identities. However, as AKASHA runs on the Ethereum Platform, the use of AKASHA involves certain payments. Accordingly, you will not use AKASHA if you are under 13 years old.</p>'}
          />
        </div>
        <h2>
          <FormattedMessage
            id="app.terms.paymentOfFeesTitle"
            description="payment of fees section title"
            defaultMessage={'5. Payment of Fees'}
          />
        </h2>
        <div>
          <FormattedHTMLMessage
            id="app.terms.paymentOfFeesBody"
            description="payment of fees section content"
            defaultMessage={'<p>14 When creating an Identity, you will be provided with an Ethereum Address (Ethereum Identity Key) to which you will need to make a transfer of a small amount of Ether (ETH). Whenever your usage of AKASHA is subject to the payment of a fee, this fee – after you have provided your consent in each individual case – will be withdrawn from your Ethereum Identity Key Balance. The amount of ETH on your Ethereum Identity Key Balance remains in your control and may be withdrawn any time.</p>'}
          />
        </div>
        <h2>
          <FormattedMessage
            id="app.terms.advertisementTitle"
            description="advertisement section title"
            defaultMessage={'6. Advertisement'}
          />
        </h2>
        <div>
          <FormattedHTMLMessage
            id="app.terms.advertisementBody"
            description="advertisement section content"
            defaultMessage={'<p>15 AKASHA shall remain free from any advertising and other commercial or sponsored content. In order to help us do that, you agree to refrain from using AKASHA for advertising purposes.</p>'}
          />
        </div>
        <h2>
          <FormattedMessage
            id="app.terms.noWarrantyTitle"
            description="no warranty section title"
            defaultMessage={'7. No warranty'}
          />
        </h2>
        <div>
          <FormattedHTMLMessage
            id="app.terms.noWarrantyBody"
            description="no warranty section content"
            defaultMessage={'<p>16 You understand and expressly accept that there is no warranty whatsoever regarding the availability, functionality, and/or the success of AKASHA and the Ethereum Identity Key , expressed or implied, to the extent permitted by law, and that the Pre-Alpha           release of AKASHA is used at the sole risk of yourself on an “as is” and “under development” basis and without, to the extent permitted by law, any warranties of any kind, including, but not limited to, warranties of title or implied warranties, merchantability or fitness        for a particular purpose;</p>'
                    }
          />
        </div>
        <h2>
          <FormattedMessage
            id="app.terms.passwordTitle"
            description="password section title"
            defaultMessage={'8. Password / Open Login'}
          />
        </h2>
        <div>
          <FormattedHTMLMessage
            id="app.terms.passwordBody"
            description="password section content"
            defaultMessage={`<p>17 As part of creating your identity, you will need to provide a password. The password will be used to access AKASHA and make use of your Ethereum Identity Key Balance. You must keep this password safe and may not share it with anybody.</p>
                        <p>18 When logging in you have an option to create a secure “authentication hash/token” for a amount of time in your choice, which allows you to securely sign transactions while logged in without having to reintroduce your password each time you post, comment or vote on something (Open Login Function). When the selected time period expires, you will be prompted to reintroduce your password. Please assure that you do not leave your AKASHA access device unattended after having chosen the Open Login Function.</p>`}
          />
        </div>
        <h2>
          <FormattedMessage
            id="app.terms.risksTitle"
            description="risks section title"
            defaultMessage={'9. Risks'}
          />
        </h2>
        <div>
          <FormattedHTMLMessage
            id="app.terms.risksBody"
            description="risks section content"
            defaultMessage={`<p>19 You understand and accept the risks in connection with using AKASHA and transferring ETH to the Deposit Wallet as exemplary set forth hereinafter. In particular, but not concluding, you understand the inherent risks listed hereinafter:<br>
                        <p>§  Risk of software weaknesses: You understand and accept that AKASHA, the smart contract system concept, the underlying software application and software platform (i.e. the Ethereum blockchain) is still in an early development stage and unproven, why there is no warranty that AKASHA will run uninterrupted or error-free and why there is an inherent risk that the software could contain weaknesses, vulnerabilities or bugs causing, inter alia, the complete loss of your profile and/or ETH submitted by you to the Deposit Wallet.</p>
                        <p>§  Regulatory risk: The User understands and accepts that the blockchain technology allows new forms of interaction and that it is possible that certain jurisdictions will apply existing regulations on, or introduce new regulations addressing, blockchain technology based applications, which may be contrary to the current setup of AKASHA and which may, inter alia, result in substantial modifications of the AKASHA, including its termination and the loss of ETH submitted by you to the Deposit Wallet.</p>
                        <p>§  Risk of abandonment / lack of success: You understand and accept that the development of AKASHA beyond the Beta Version may be abandoned for a number of reasons, including lack of interest from the public, lack of funding, lack of commercial success or prospects (e.g. caused by competing projects).</p>
                        <p>§  Risk of theft: You understand and accept that the AKASHA smart contract concept, the underlying software application and software platform (i.e. the Ethereum blockchain) may be exposed to attacks by hackers or other individuals that that could result in theft or loss of ETH submitted by you to the Deposit Wallet.</p>
                        <p>§  Risk of Ethereum mining attacks: You understand and accept that, as with other cryptocurrencies, the blockchain used for AKASHA is susceptible to mining attacks, including but not limited to double-spend attacks, majority mining power attacks, “selfish-mining” attacks, and race condition attacks.</p>
                        <p>§  Risk of new version: You understand and accept that the network of miners will be ultimately in control of AKASHA. You understand that a majority of these miners could agree at any point to make changes to the official AKASHA network and to run the new version of the smart contract system.</p></p>`
                    }
          />
        </div>
        <h2>
          <FormattedMessage
            id="app.terms.taxationTitle"
            description="taxation section title"
            defaultMessage={'10. Taxation'}
          />
        </h2>
        <div>
          <FormattedHTMLMessage
            id="app.terms.taxationBody"
            description="taxation section content"
            defaultMessage={'<p>20 You bear the sole responsibility to determine if any action or transaction related to AKASHA have tax implications for yourself.</p>'}
          />
        </div>
        <h2>
          <FormattedMessage
            id="app.terms.noLiabilityTitle"
            description="no liability section title"
            defaultMessage={'11. No Liability'}
          />
        </h2>
        <div>
          <FormattedHTMLMessage
            id="app.terms.noLiabilityBody"
            description="no liability section content"
            defaultMessage={`<p>21 You acknowledge and agree that, to the fullest extent permitted by any applicable law, the User will not hold any developers, contractors or founders of AKASHA liable for any and all damages or injury whatsoever caused by or related to the use of, or   the        inability to use, AKASHA under any cause or action whatsoever of any kind in any jurisdiction, including, without limitation, actions for breach of warranty, breach of contract or tort (including negligence) and that developers of AKASHA shall not be liable for any               indirect, incidental, special, exemplary or consequential damages (including for loss of profits, goodwill, data goodwill or other intangible losses) in any way whatsoever arising out of the use of, or the inability to use of AKASHA.</p>
                        <p>22 In particular, you acknowledge and agree that AKASHA and any of its developers, contractors or founders will not be liable under any circumstances to you or any other party, person or entity for any damages or losses that may result from the following:<br>
                            <p>§ Termination, suspension, loss or modification of AKASHA;</p>
                            <p>§  Use of or inability to use AKASHA;</p>
                            <p>§  Access delays or acces interruptions to AKASHA;</p>
                            <p>§  Data non-delivery, mis-delivery, corruption, destruction or other modification;</p>
                            <p>§  Events beyond AKASHA’s control;</p>
                            <p>§  Application of any applicable law, regulation or AKASHA policy;</p>
                            <p>§  Disbursement or non-disbursement of fund held on your Deposit Wallet;</p>
                            <p>§  Loss or liability resulting from errors, omissions or misstatements related to AKASHA (this includes loss of data resulting from delays, nondeliveries, mis-deliveries or service interruptions independent of the cause);</p>
                            <p>§  Loss or liability resulting from the unauthorized use or misuse of your Identity, password or other security authentication option;</p>
                            <p>§  Unauthorized use or alteration of your content;</p>
                            <p>§  Violation of any third party rights, including, but not limited to, rights of publicity, rights of privacy, intellectual property rights and any other proprietary rights;</p>
                            <p>§  Any other matter relating to your use of AKASHA.</p></p>
                        <p>23 AKASHA disclaims any responsibility for any content, goods and services sold by you or otherwise made available through AKASHA, or the quality or accuracy of any information on AKASHA. AKASHA will not endorse, warrant, or guarantee any product or service offered through AKASHA, and will not be a party to or in any way monitor any transaction between you and third-party offered through or resulting from the services or use of AKASHA, including, but not limited to, all licensing of content, transactions, or any business agreements.</p>`
                    }
          />
        </div>
        <h2>
          <FormattedMessage
            id="app.terms.miscTitle"
            description="miscellaneous section title"
            defaultMessage={'12. Miscellaneous'}
          />
        </h2>
        <div>
          <FormattedHTMLMessage
            id="app.terms.miscBody"
            description="miscellaneous section content"
            defaultMessage={`<p>24 You agree that if any portion of these Terms is found illegal or unenforceable, in whole or in part, such provision shall, as to such jurisdiction, be ineffective solely to the extent of such determination of invalidity or unenforceability without              affecting the validity or enforceability thereof in any other manner or jurisdiction and without affecting the remaining provisions of the Terms, which shall continue to be in full force and effect.</p>
                        <p>25 The applicable law is Swiss law. Any dispute arising out of or in connection with AKASHA
                        shall be finally settled by the ordinary courts of the registered domicile of the defendant.</p>`}
          />
        </div>
      </div>
    </PanelContainer>
    <div
      style={{
          position: 'fixed',
          overflow: 'hidden',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 15,
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}
    />
  </div>
    );

TermsPanel.propTypes = {
    hideTerms: PropTypes.func
};

export default TermsPanel;
