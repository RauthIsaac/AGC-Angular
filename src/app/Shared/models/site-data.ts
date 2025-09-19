export interface SiteData {
    id : number;
    langCode : number;
    companyName : string;
    ceO_Name : string;
    ceO_JobTitle : string;
    ceO_IntroMessage : string;
    ceO_EndMessage : string;
    logoUrl : string;
    coverImgUrl : string;
    news : News[];
    products : Product[];
}


export interface News {
    siteIdentityId : number;
    langCode : number;
    id : number;
    title : string;
    subTitle : string;
    description : string;
    newsImgUrl : string;
}

export interface Product {
    siteIdentityId : number;
    langCode : number;
    id : number;
    name : string;
    title : string;
    subTitle : string;
    description : string;
    imageUrl : string;
}