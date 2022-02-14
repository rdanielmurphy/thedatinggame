CREATE TABLE address (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 city TEXT,
	 isPrimary INTEGER,
	 lastUpdate INTEGER,
	 state TEXT,
	 street TEXT,
	 street2 TEXT,
	 type TEXT,
	 zipCode TEXT,
	 lastModifiedUserId INTEGER
);

CREATE TABLE application_user (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 acceptTermsDate INTEGER,
	 displayName TEXT,
	 enabled INTEGER,
	 firstName TEXT,
	 firstTimeAccess INTEGER,
	 hasWebAccess INTEGER,
	 invalidLogins INTEGER,
	 janrainId TEXT,
	 lastLoggedIn INTEGER,
	 lastModifiedDate INTEGER,
	 lastName TEXT,
	 passwordChangeRequired INTEGER,
	 passwordHash TEXT,
	 salesforceId TEXT,
	 saltHash TEXT,
	 username TEXT,
	 zoneId INTEGER,
	 account_id INTEGER NOT NULL,
	 userPreference_id INTEGER,
	 useOldSync INTEGER,
	 auth0id TEXT,
	 migrationAttempted INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE application_user_address (
	 application_user_id INTEGER,
	 addresses_id INTEGER
);

CREATE TABLE application_user_email (
	 application_user_id INTEGER,
	 emails_id INTEGER
);

CREATE TABLE application_user_phonenumber (
	 application_user_id INTEGER,
	 phonenumbers_id INTEGER
);

CREATE TABLE application_user_role (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 role TEXT,
	 roleGroup TEXT,
	 user_id INTEGER
);

CREATE TABLE cloud_account (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 convenienceFeePercent INTEGER,
	 defaultZoneId INTEGER,
	 isEnabled INTEGER,
	 isMaster INTEGER,
	 lastModifiedDate INTEGER,
	 name TEXT,
	 salesforceId TEXT,
	 standards TEXT,
	 statesNotIncluded TEXT,
	 feeStructure_id INTEGER,
	 preferences_id INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE cloud_account_address (
	 cloud_account_id INTEGER,
	 addresses_id INTEGER
);

CREATE TABLE cloud_account_email (
	 cloud_account_id INTEGER,
	 emails_id INTEGER
);

CREATE TABLE cloud_account_phonenumber (
	 cloud_account_id INTEGER,
	 phonenumbers_id INTEGER
);

CREATE TABLE comment (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 lastModified INTEGER,
	 name TEXT,
	 number INTEGER,
	 text TEXT,
	 comment_group_id INTEGER,
	 remoteCommentGroupId INTEGER,
	 lastModifiedUserId INTEGER,
	 hasAdded INTEGER DEFAULT 0
);

CREATE TABLE comment_group (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 lastModified INTEGER,
	 name TEXT,
	 number INTEGER,
	 account_id INTEGER,
	 lastModifiedUserId INTEGER,
	 hasAdded INTEGER DEFAULT 0
);

CREATE TABLE company (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 user1 TEXT,
	 user2 TEXT,
	 user3 TEXT,
	 user4 TEXT,
	 user5 TEXT,
	 lastModifiedDate INTEGER,
	 name TEXT,
	 account_id INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE company_address (
	 company_id INTEGER,
	 addresses_id INTEGER
);

CREATE TABLE company_email (
	 company_id INTEGER,
	 emails_id INTEGER
);

CREATE TABLE company_phonenumber (
	 company_id INTEGER,
	 phonenumbers_id INTEGER
);

CREATE TABLE contact (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 user1 TEXT,
	 user2 TEXT,
	 user3 TEXT,
	 user4 TEXT,
	 user5 TEXT,
	 displayName TEXT,
	 firstName TEXT,
	 lastModifiedDate INTEGER,
	 lastName TEXT,
	 tag TEXT,
	 account_id INTEGER,
	 company_id INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE contact_address (
	 contact_id INTEGER,
	 addresses_id INTEGER
);

CREATE TABLE contact_email (
	 contact_id INTEGER,
	 emails_id INTEGER
);

CREATE TABLE contact_license (
	 contact_id INTEGER,
	 licenses_id INTEGER
);

CREATE TABLE contact_phonenumber (
	 contact_id INTEGER,
	 phonenumbers_id INTEGER
);

CREATE TABLE dbChangeItem (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 accountId INTEGER,
	 action TEXT,
	 category TEXT,
	 changeDate INTEGER,
	 objectId INTEGER,
	 objectRemoteId INTEGER,
	 objectType TEXT,
	 origin TEXT,
	 parentClass TEXT,
	 parentId INTEGER,
	 parentRemoteId INTEGER,
	 parentProperty TEXT,
	 payload TEXT,
	 previousData TEXT,
	 userId INTEGER,
	 dbChangeSet_id INTEGER,
	 deviceId TEXT,
	 inspectionId INTEGER,
	 inspectionRemoteId INTEGER,
	 scriptId INTEGER,
	 scriptRemoteId INTEGER,
	 processed INTEGER,
	 requestOrigin TEXT,
	 lastModifiedUserId INTEGER
);

CREATE TABLE dbChangeSet (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 accountId INTEGER,
	 timestamp INTEGER,
	 maxId INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE document (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 defaultType TEXT,
	 fileLocation TEXT,
	 isDefault INTEGER,
	 type TEXT,
	 inspection_id INTEGER,
	 reportDefinition_id INTEGER,
	 service_id INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE email (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 emailAddress TEXT,
	 emailType TEXT,
	 isPrimary INTEGER,
	 lastModifiedDate INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE event (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 allDay INTEGER,
	 displayName TEXT,
	 end INTEGER,
	 lastModifiedDate INTEGER,
	 start INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE image (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 fileName TEXT NOT NULL,
	 lastModifiedDate INTEGER,
	 account_id INTEGER,
	 remoteAccountId INTEGER,
	 contact_id INTEGER,
	 remoteContactId INTEGER,
	 inspection_id INTEGER,
	 remoteInspectionId INTEGER,
	 user_id INTEGER,
	 remoteUserId INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE inspection (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 coverPhotoId INTEGER,
	 remoteCoverPhotoId INTEGER,
	 discountAmount INTEGER,
	 displayName TEXT,
	 fee INTEGER,
	 lastModifiedDate INTEGER,
	 name TEXT,
	 number TEXT,
	 referredBy INTEGER,
	 remoteReferredBy INTEGER,
	 scriptId INTEGER,
	 remoteScriptId INTEGER,
	 status TEXT,
	 totalDiscounts INTEGER,
	 account_id INTEGER,
	 applicationUser_id INTEGER,
	 event_id INTEGER,
	 invoice_id INTEGER,
	 property_id INTEGER,
	 reportParameters_id INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE inspection_contact (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 contactSignaturePath TEXT,
	 isPrimary INTEGER,
	 contact_id INTEGER,
	 inspection_id INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE inspection_type (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 lastModified INTEGER,
	 name TEXT,
     lastModifiedUserId INTEGER
);

CREATE TABLE invoice (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 checkNumber TEXT,
	 convenienceFee INTEGER,
	 dateCreated INTEGER,
	 number TEXT,
	 paymentMethod TEXT,
	 totalFee INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE license (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 licenseNumber TEXT,
	 startDate INTEGER,
	 state TEXT,
	 type TEXT,
	 application_user_id INTEGER,
	 contact_id INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE license_type (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 lastModified INTEGER,
	 type TEXT,
	 lastModifiedUserId INTEGER
);

CREATE TABLE option (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 name TEXT,
	 number INTEGER,
	 script_id INTEGER,
	 section_id INTEGER,
	 subsection_id INTEGER,
	 isComplete INTEGER,
	 lastModifiedUserId INTEGER,
	 hasAdded INTEGER DEFAULT 0
);

CREATE TABLE overview (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 lastModified INTEGER,
	 master INTEGER,
	 account_id INTEGER,
	 remoteAccountId INTEGER,
	 script_id INTEGER,
	 remoteScriptId INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE overview_section (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 commentListNumber INTEGER,
	 name TEXT,
	 number INTEGER,
	 text TEXT,
	 overview_id INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE phonenumber (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 extension TEXT,
	 isPrimary INTEGER,
	 lastUpdate INTEGER,
	 phoneNumber TEXT,
	 phoneType TEXT,
	 lastModifiedUserId INTEGER
);

CREATE TABLE photo (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 comment TEXT,
	 displayOrder INTEGER,
	 fileName TEXT NOT NULL,
	 inspectionId INTEGER,
	 remoteInspectionId INTEGER,
	 lastModifiedDate INTEGER,
	 layout TEXT,
	 sectionId INTEGER,
	 remoteSectionId INTEGER,
	 subsectionId INTEGER,
	 remoteSubsectionId INTEGER,
	 optionId INTEGER,
	 remoteOptionId INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE property (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 acUnits INTEGER,
	 age INTEGER,
	 basementType TEXT,
	 bathrooms INTEGER,
	 bedrooms INTEGER,
	 crawlspaceType TEXT,
	 fireplaces INTEGER,
	 furnaceFuel TEXT,
	 furnaces INTEGER,
	 garageType TEXT,
	 garages TEXT,
	 lastModifiedDate INTEGER,
	 notes TEXT,
	 purchasePrice INTEGER,
	 slabOnGrade TEXT,
	 squareFeet INTEGER,
	 style TEXT,
	 type TEXT,
	 utilitiesOn INTEGER,
	 waterHeaterFuel TEXT,
	 waterHeaters INTEGER,
	 yearBuilt INTEGER,
	 address_id INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE recent_item (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 itemId INTEGER,
	 label TEXT,
	 lastAccessed INTEGER,
	 lastModifiedDate INTEGER,
	 type TEXT,
	 application_user_id INTEGER
);

CREATE TABLE related_contact (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 attendingInspection INTEGER,
	 role TEXT,
	 contact_id INTEGER,
	 inspection_id INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE report_definition (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 description TEXT,
	 effectiveDate INTEGER,
	 expirationDate INTEGER,
	 location TEXT,
	 name TEXT,
	 state TEXT,
	 versionNumber INTEGER,
	 cloudAccount_id INTEGER,
	 inspectionType_id INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE report_parameters (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 buyersAgentPresent INTEGER,
	 exclusions TEXT,
	 hasAddendum INTEGER,
	 hasExclusions INTEGER,
	 releaseReports INTEGER,
	 sellersAgentPresent INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE script (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 additionalComments TEXT,
	 createDate INTEGER,
	 editable INTEGER,
	 lastModified INTEGER,
	 master INTEGER,
	 name TEXT,
	 originalScriptId INTEGER,
	 remoteOriginalScriptId INTEGER,
	 tag TEXT,
	 account_id INTEGER,
	 overview_id INTEGER,
	 summary_id INTEGER,
	 version INTEGER,
	 isComplete INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE section (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 name TEXT,
	 number INTEGER,
	 sectionIndex INTEGER,
	 tag TEXT,
	 script_id INTEGER,
	 isComplete INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE service (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 description TEXT,
	 discount INTEGER,
	 lastModified INTEGER,
	 price INTEGER,
	 scriptID INTEGER,
	 remoteScriptId INTEGER,
	 account_id INTEGER,
	 inspection_id INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE subsection (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 name TEXT,
	 number INTEGER,
	 subsectionIndex INTEGER,
	 script_id INTEGER,
	 section_id INTEGER,
	 isComplete INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE summary (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 lastModified INTEGER,
	 master INTEGER,
	 account_id INTEGER,
	 remoteAccountId INTEGER,
	 script_id INTEGER,
	 remoteScriptId INTEGER,
	 lastModifiedUserId INTEGER,
	 type INTEGER DEFAULT 0
);

CREATE TABLE summary_section (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 commentListNumber INTEGER,
	 name TEXT,
	 number INTEGER,
	 text TEXT,
	 summary_id INTEGER,
	 lastModifiedUserId INTEGER,
	 type INTEGER DEFAULT 0
);

CREATE TABLE summary_subsection (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 commentListNumber INTEGER,
	 name TEXT,
	 number INTEGER,
	 text TEXT,
	 section_id INTEGER,
	 lastModifiedUserId INTEGER,
	 type INTEGER DEFAULT 0
);

CREATE TABLE user_device (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 activationDate INTEGER,
	 deviceId TEXT,
	 deviceName TEXT,
	 deviceType TEXT,
	 user_id INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE user_preference (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 colorCondition INTEGER,
	 defaultPhotoLayout TEXT,
	 endOfDay INTEGER,
	 numberOfRecentItems INTEGER,
	 numberOfUpcomingInspectionDays INTEGER,
	 preferredReport INTEGER,
	 preferredScript INTEGER,
	 receiveDailyEmail INTEGER,
	 smtpFrom TEXT,
	 smtpHost TEXT,
	 smtpPassword TEXT,
	 smtpPort TEXT,
	 smtpProvider TEXT,
	 smtpUsername TEXT,
	 startOfDay INTEGER,
	 timeZone TEXT,
	 lastModifiedUserId INTEGER
);

CREATE TABLE userdefinedfields (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 companyId INTEGER,
	 displayOrder INTEGER,
	 fieldDescription TEXT,
	 fieldLabel TEXT,
	 fieldType TEXT,
	 fieldValue INTEGER,
	 lastModifiedDate INTEGER,
	 userId INTEGER,
	 visible INTEGER,
	 lastModifiedUserId INTEGER
);

CREATE TABLE value (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 checked INTEGER,
	 commentListNumber INTEGER,
	 isNa INTEGER,
	 number INTEGER,
	 texasDeficient INTEGER,
	 texasInspected INTEGER,
	 texasNotInspected INTEGER,
	 texasNotPresent INTEGER,
	 text TEXT,
	 type INTEGER,
	 userText TEXT,
	 script_id INTEGER,
	 section_id INTEGER,
	 subsection_id INTEGER,
	 option_id INTEGER,
	 isHighlighted INTEGER DEFAULT 0,
	 highLightColor INTEGER DEFAULT 0,
	 optionTitle TEXT,
	 lastModifiedUserId INTEGER,
	 hasAdded INTEGER DEFAULT 0
);

CREATE TABLE value_option (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 remoteId INTEGER,
	 checked INTEGER,
	 number INTEGER,
	 text TEXT,
	 script_id INTEGER,
	 section_id INTEGER,
	 subsection_id INTEGER,
	 option_id INTEGER,
	 value_id INTEGER,
	 lastModifiedUserId INTEGER,
	 hasAdded INTEGER DEFAULT 0
);

CREATE TABLE sync_deleted_object (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	serverId INTEGER,
	deviceId INTEGER,
	objectType TEXT,
	json TEXT,
	inspectionId INTEGER,
	scriptId INTEGER
);

CREATE TABLE data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT,
    iv TEXT
);

CREATE TABLE syncdata(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    syncDate INTEGER,
    lastRequestDate INTEGER,
    accountSyncDate INTEGER,
    defaultSyncDate INTEGER,
    scriptSyncDate INTEGER,
    serviceSyncDate INTEGER,
    commentSyncDate INTEGER,
    inspectionSyncDate INTEGER,
    lastRequestedChangeSetId INTEGER
);

CREATE TABLE state(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    abbr TEXT,
    name TEXT,
    country TEXT
);

CREATE TABLE userReportStyle(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    sectionFont TEXT,
    sectionFontSize REAL,
    sectionColor CHAR(6),
    sectionBGColor CHAR(6),
    subsectionFont TEXT,
    subsectionFontSize REAL,
    subsectionColor CHAR(6),
    subsectionBGColor CHAR(6),
    optionFont TEXT,
    optionFontSize REAL,
    optionColor CHAR(6),
    valueFont TEXT,
    valueFontSize REAL,
    valueColor CHAR(6),
    includeSetOptionsOnly INTEGER,
    includeSetValuesOnly INTEGER,
    colorConditions INTEGER
);

CREATE TABLE agreement(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    piaText TEXT,
    addendum TEXT
);

CREATE TABLE COLORS (
    id INTEGER NOT NULL PRIMARY KEY,
    red INTEGER,
    green INTEGER,
    blue INTEGER,
    name TEXT
);

CREATE TABLE version_updates(
    id INTEGER NOT NULL PRIMARY KEY,
    versionCode INTEGER,
    hasRun INTEGER,
    success INTEGER,
    lastAttempt INTEGER
);