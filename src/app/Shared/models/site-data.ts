export interface SiteData {
    id: number,
    langCode: number,
    companyName: string,
    logoUrl: string,
    coverImgUrl: string,

    news: News[],
    news_title: string,
    news_description: string,
    news_button: string,

    products: Product[],
    products_title: string,
    products_description: string,
    products_button: string,
    product_applications: string,
    product_applications_statement: string,
    product_keyBenefits: string,
    product_keyBenefits_statement: string,
    product_why_choose: string,

    header_phone: string,
    header_email: string,
    header_distributed: string,
    header_companyName: string,
    header_navigation_home: string,
    header_navigation_about: string,
    header_navigation_products: string,
    header_navigation_clients: string,
    header_navigation_news: string,
    header_navigation_contact: string,
    header_languageSwitcher: string,

    hero_mainTitle: string,
    hero_subtitle: string,
    hero_arabicBadge: string,
    hero_productFilter_label: string,
    hero_mission: string,

    values_title: string,
    values_subtitle: string,
    values_principles_title_1: string,
    values_principles_description_1: string,
    values_principles_title_2: string,
    values_principles_description_2: string,
    values_principles_title_3: string,
    values_principles_description_3: string,
    values_principles_title_4: string,
    values_principles_description_4: string,
    values_principles_title_5: string,
    values_principles_description_5: string,
    values_principles_title_6: string,
    values_principles_description_6: string,
    values_principles_title_7: string,
    values_principles_description_7: string,
    values_principles_title_8: string,
    values_principles_description_8: string,
    values_principles_title_9: string,
    values_principles_description_9: string,


    about_title: string,
    about_ImgUrl: string,
    about_subtitle: string,
    about_description: string,
    about_ourMission: string,
    about_missionStatement: string,
    about_ourVision: string,
    about_visionStatement: string,
    about_stats_yearsExperience: string,
    about_stats_specialists: string,
    about_stats_specializedProducts: string,
    about_stats_technicalSupport: string,
    about_stats_authorizedCompany: string,
    about_stats_authorizedDistributor: string,

    ceO_Name: string,
    ceO_JobTitle: string,
    ceO_IntroMessage: string,
    ceO_EndMessage: string,
    ceoMessage_title: string,
    ceoMessage_visionStatement: string,
    ceoMessage_ceoName: string,
    ceoMessage_position: string,
    ceoMessage_message: string,
    ceoMessage_ceoImageUrl: string,
    ceoMessage_ceoQualifications: string,

    clients_title: string,
    clients_description: string,
    clients_message: string,
    client_Images: string[],

    clients_sectorsTitle: string,
    clients_sectors_name_1: string,
    clients_sectors_description_1: string,
    clients_sectors_name_2: string,
    clients_sectors_description_2: string,
    clients_sectors_name_3: string,
    clients_sectors_description_3: string,
    clients_sectors_name_4: string,
    clients_sectors_description_4: string,
    clients_sectors_name_5: string,
    clients_sectors_description_5: string,
    clients_sectors_name_6: string,
    clients_sectors_description_6: string,

    clientFamily_title: string,
    clientFamily_description: string,
    clientFamily_button: string,

    contact_title: string,
    contact_description: string,
    contact_form_sendTitle: string,
    contact_form_fields_name: string,
    contact_form_fields_email: string,
    contact_form_fields_phone: string,
    contact_form_fields_subject: string,
    contact_form_fields_message: string,
    contact_form_button: string,
    contact_info_phone: string,
    contact_info_email: string,
    contact_title_address: string,
    contact_info_address: string,
    contact_info_workingHours: string,
    contact_info_Location: string,      // Link
    contact_info_locationMap: string,   // Title

    footer_companyDescription: string,
    footer_quickLinks: string,
    footer_copyright: string,
    footer_contactInfo: string,
    footer_contactInfoList_phone: string,
    footer_contactInfoList_email: string,
    footer_contactInfoList_address: string,
    footer_socialMedia: string,
    footer_socialMedia_facebookUrl: string,
    footer_socialMedia_tiktokUrl: string,
    footer_socialMedia_linkedinUrl: string,
    footer_socialMedia_instagramUrl: string
}

export interface News {
  id: number;
  langCode: number;
  siteIdentityId: number;
  newsImgUrl: string;
  title: string;
  subTitle: string;
  description: string;
  createdAt: string | null; 
  si: SiteData | null;     
}


export interface Product {
  id: number;
  langCode: number;
  si: SiteData | null;
  siteIdentityId: number;
  name: string;
  title: string;
  subTitle: string;
  description: string;
  imageUrl: string;
  benefit_Title_1: string;
  benefit_Description_1: string;
  benefit_Title_2: string;
  benefit_Description_2: string;
  benefit_Title_3: string;
  benefit_Description_3: string;
  benefit_Title_4: string;
  benefit_Description_4: string;
  applicationsList: string;
  why_Choose_Statement: string;
  why_Choose_List: string;
}



